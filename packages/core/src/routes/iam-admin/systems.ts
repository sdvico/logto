import { validateRedirectUrl } from '@logto/core-kit';
import { defaultApplicationSecretName, hasSecrets } from '@logto/schemas';
import { generateStandardId, generateStandardSecret } from '@logto/shared';
import { z } from 'zod';

import RequestError from '#src/errors/RequestError/index.js';
import koaGuard from '#src/middleware/koa-guard.js';
import { buildOidcClientMetadata } from '#src/oidc/utils.js';
import assertThat from '#src/utils/assert-that.js';

import { generateInternalSecret } from '../applications/application-secret.js';
import { getIamSyncResourceIndicator } from '../iam-sync.js';
import type { AnonymousRouter, RouterInitArgs } from '../types.js';

import { getActor, writeIamAdminLog } from './audit.js';
import { forbidden, getCallerClientId, iamAdminScopes, koaIamAdminAuth } from './auth.js';
import {
  type AppTypeName,
  applicationDetailGuard,
  appTypes,
  getSystemKey,
  groupSystems,
  iamAdminRoleName,
  iamSyncRoleName,
  iamSyncScope,
  systemGuard,
  toApplicationDetail,
} from './system-view.js';

/** Tổ chức gốc cấp trung ương (docs/sql/seed-organizations.sql); app đồng bộ mới được gắn vào đây. */
const nationwideOrganizationId = 'toan-quoc';
const maxUris = 20;

const uriListGuard = (kind: 'web' | 'mobile') =>
  z
    .string()
    .max(512)
    .refine((url) => validateRedirectUrl(url, kind), { message: `Không phải URI ${kind} hợp lệ.` })
    .array()
    .max(maxUris);

const appNameGuard = z.string().trim().min(1).max(128);

const createAppGuard = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('traditional'),
    name: appNameGuard,
    redirectUris: uriListGuard('web').min(1),
    postLogoutRedirectUris: uriListGuard('web').default([]),
  }),
  z.object({
    type: z.literal('spa'),
    name: appNameGuard,
    redirectUris: uriListGuard('web').min(1),
    postLogoutRedirectUris: uriListGuard('web').default([]),
    corsAllowedOrigins: z.string().url().max(512).array().max(maxUris).default([]),
  }),
  z.object({
    type: z.literal('native'),
    name: appNameGuard,
    redirectUris: uriListGuard('mobile').min(1),
    postLogoutRedirectUris: uriListGuard('mobile').default([]),
  }),
  z.object({
    type: z.literal('m2m'),
    name: appNameGuard,
    // Chỉ quyền đọc đồng bộ. Quyền iam-admin chỉ cấp bằng SQL (docs/sql/declare-iam-admin.sql).
    roles: z.literal(iamSyncRoleName).array().max(1).default([]),
  }),
]);

type CreateApp = z.infer<typeof createAppGuard>;

const createSystemGuard = z.object({
  system: z.string().regex(/^[\da-z-]{2,40}$/),
  name: z.string().trim().min(1).max(128),
  description: z.string().trim().max(500).optional(),
  apps: createAppGuard.array().min(1).max(10),
});

const createdAppGuard = z.object({
  name: z.string(),
  type: z.enum(['traditional', 'spa', 'native', 'm2m']),
  clientId: z.string(),
  clientSecret: z.string().nullable(),
  resource: z.string().nullable(),
  scope: z.string().nullable(),
});

const toOidcClientMetadata = (app: CreateApp) =>
  buildOidcClientMetadata(
    app.type === 'm2m'
      ? undefined
      : { redirectUris: app.redirectUris, postLogoutRedirectUris: app.postLogoutRedirectUris }
  );

export default function systemRoutes<T extends AnonymousRouter>(
  ...[router, tenant]: RouterInitArgs<T>
) {
  const { queries, envSet, id: tenantId } = tenant;
  const { iamAdmin, applications, applicationSecrets, applicationsRoles, organizations } = queries;

  const findSystemApps = async (system: string) => {
    const rows = await iamAdmin.findSystemApplications();
    return rows.filter((row) => getSystemKey(row) === system);
  };

  /** Tạo một ứng dụng; trả thông tin kết nối. Ghi xong mới trả, lỗi thì để hàm gọi dọn. */
  const createApp = async (
    app: CreateApp,
    customData: Record<string, string>,
    iamSyncRoleId: string | undefined,
    onCreated: (id: string) => void
  ) => {
    const type = appTypes[app.type];
    const { id } = await applications.insertApplication({
      id: generateStandardId(),
      secret: generateInternalSecret(),
      name: app.name,
      type,
      oidcClientMetadata: toOidcClientMetadata(app),
      customClientMetadata:
        app.type === 'spa' ? { corsAllowedOrigins: app.corsAllowedOrigins } : {},
      customData,
    });
    onCreated(id);

    const clientSecret = hasSecrets(type) ? generateStandardSecret() : null;
    if (clientSecret) {
      await applicationSecrets.insert({
        name: defaultApplicationSecretName,
        applicationId: id,
        value: clientSecret,
      });
    }

    const hasIamSync = app.type === 'm2m' && app.roles.includes(iamSyncRoleName);
    if (hasIamSync && iamSyncRoleId) {
      await applicationsRoles.insertApplicationsRoles([
        { id: generateStandardId(), applicationId: id, roleId: iamSyncRoleId },
      ]);
      await organizations.relations.apps.insert({
        organizationId: nationwideOrganizationId,
        applicationId: id,
      });
    }

    return {
      name: app.name,
      type: app.type satisfies AppTypeName,
      clientId: id,
      clientSecret,
      resource: hasIamSync ? getIamSyncResourceIndicator(tenantId) : null,
      scope: hasIamSync ? iamSyncScope : null,
    };
  };

  router.get(
    '/iam-admin/v1/systems',
    koaIamAdminAuth(tenant, iamAdminScopes.appsRead),
    koaGuard({
      response: z.object({ data: systemGuard.array() }),
      status: [200, 401, 403],
    }),
    async (ctx, next) => {
      ctx.body = {
        data: groupSystems(await iamAdmin.findSystemApplications(), getCallerClientId(ctx)),
      };

      return next();
    }
  );

  router.get(
    '/iam-admin/v1/applications/:id',
    koaIamAdminAuth(tenant, iamAdminScopes.appsRead),
    koaGuard({
      params: z.object({ id: z.string().min(1) }),
      response: applicationDetailGuard,
      status: [200, 401, 403, 404],
    }),
    async (ctx, next) => {
      const [application, caller] = await Promise.all([
        iamAdmin.findSystemApplicationById(ctx.guard.params.id),
        iamAdmin.findSystemApplicationById(getCallerClientId(ctx)),
      ]);

      // Không có, hoặc là loại Protected/SAML/bên thứ ba: cùng là 404.
      assertThat(application, new RequestError({ code: 'entity.not_found', status: 404 }));

      ctx.body = toApplicationDetail(application, {
        isCaller: caller !== null && getSystemKey(caller) === getSystemKey(application),
        iamSyncResource: getIamSyncResourceIndicator(tenantId),
      });

      return next();
    }
  );

  router.post(
    '/iam-admin/v1/systems',
    koaIamAdminAuth(tenant, iamAdminScopes.appsWrite),
    koaGuard({
      body: createSystemGuard,
      response: z.object({ issuer: z.string(), apps: createdAppGuard.array() }),
      status: [201, 400, 401, 403, 409],
    }),
    async (ctx, next) => {
      const actor = getActor(ctx);
      const { system, name, description, apps } = ctx.guard.body;

      const existingApps = await findSystemApps(system);
      assertThat(
        existingApps.length === 0,
        new RequestError({ code: 'entity.unique_integrity_violation', status: 409 }, { system })
      );

      const needsIamSync = apps.some((app) => app.type === 'm2m' && app.roles.length > 0);
      const iamSyncRole = needsIamSync
        ? await queries.roles.findRoleByRoleName(iamSyncRoleName)
        : undefined;
      const iamSyncRoleId = iamSyncRole?.id;
      assertThat(
        !needsIamSync || iamSyncRoleId,
        new RequestError({
          code: 'entity.not_exists',
          status: 400,
          name: `role ${iamSyncRoleName}`,
        })
      );

      const customData = {
        system,
        systemName: name,
        ...(description ? { systemDescription: description } : {}),
      };
      const createdIds: string[] = [];
      const created: Array<z.infer<typeof createdAppGuard>> = [];

      try {
        for (const app of apps) {
          // eslint-disable-next-line no-await-in-loop -- one app at a time so a failure stops before the rest
          const result = await createApp(app, customData, iamSyncRoleId, (id) => {
            // eslint-disable-next-line @silverhand/fp/no-mutating-methods -- collects ids for rollback
            createdIds.push(id);
          });
          // eslint-disable-next-line @silverhand/fp/no-mutating-methods -- keeps the request order
          created.push(result);
        }
      } catch (error: unknown) {
        // Một bước hỏng thì xoá mọi app đã tạo; secret, role, quan hệ tổ chức xoá theo khoá ngoại.
        await Promise.all(createdIds.map(async (id) => applications.deleteApplicationById(id)));
        throw error;
      }

      await writeIamAdminLog(queries, ctx, {
        actor,
        action: 'System.Create',
        payload: {
          system,
          applicationIds: createdIds,
        },
      });

      ctx.status = 201;
      ctx.body = { issuer: envSet.oidc.issuer, apps: created };

      return next();
    }
  );

  router.delete(
    '/iam-admin/v1/systems/:system',
    koaIamAdminAuth(tenant, iamAdminScopes.appsWrite),
    koaGuard({
      params: z.object({ system: z.string().min(1) }),
      status: [204, 400, 401, 403, 404],
    }),
    async (ctx, next) => {
      const actor = getActor(ctx);
      const { system } = ctx.guard.params;
      const apps = await findSystemApps(system);

      assertThat(apps.length > 0, new RequestError({ code: 'entity.not_found', status: 404 }));
      assertThat(!apps.some(({ id }) => id === getCallerClientId(ctx)), forbidden('caller_system'));
      assertThat(
        !apps.some(({ roleNames }) => roleNames.includes(iamAdminRoleName)),
        forbidden('iam_admin_system')
      );

      await Promise.all(apps.map(async ({ id }) => applications.deleteApplicationById(id)));
      await writeIamAdminLog(queries, ctx, {
        actor,
        action: 'System.Delete',
        payload: {
          system,
          applicationIds: apps.map(({ id }) => id),
        },
      });

      ctx.status = 204;

      return next();
    }
  );
}
