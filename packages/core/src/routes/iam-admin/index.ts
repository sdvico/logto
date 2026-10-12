import { z } from 'zod';

import RequestError from '#src/errors/RequestError/index.js';
import koaGuard from '#src/middleware/koa-guard.js';
import assertThat from '#src/utils/assert-that.js';
import {
  getCustomDataString,
  getCustomDataStringRecord,
  getOrganizationLevel,
  getParentOrgId,
  getRoleCode,
} from '#src/utils/iam-organization.js';

import type { AnonymousRouter, RouterInitArgs } from '../types.js';

import { iamAdminScopes, koaIamAdminAuth } from './auth.js';
import systemRoutes from './systems.js';
import { createUserLoader, maxOrganizations } from './user-loader.js';
import {
  countUsers,
  selectUserPage,
  userDetailGuard,
  userListQueryGuard,
  userStatsGuard,
  userSummaryGuard,
  withLastSignInApplications,
} from './user-view.js';
import userWriteRoutes from './user-write.js';

const organizationGuard = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().nullable(),
  level: z.string().nullable(),
  parentOrgId: z.string().nullable(),
  provinceCode: z.string().nullable(),
  sourceCode: z.string().nullable(),
  roleTitles: z.record(z.string()),
  memberCount: z.number(),
});

/**
 * IAM Admin API (`/api/iam-admin/v1`) cho trang Người dùng IAM, Ứng dụng IAM trên CBVMS.
 * Hợp đồng: docs/iam-admin-api-design.md. File này giữ các route đọc; ghi người dùng ở
 * `user-write.ts`, hệ ứng dụng ở `systems.ts`.
 */
export default function iamAdminRoutes<T extends AnonymousRouter>(
  ...[router, tenant]: RouterInitArgs<T>
) {
  const { queries } = tenant;
  const { iamAdmin, organizations } = queries;
  const canReadUsers = koaIamAdminAuth(tenant, iamAdminScopes.usersRead);

  const { findOrganizationsById, loadUserSummaries, loadUserDetail } = createUserLoader(tenant);

  router.get(
    '/iam-admin/v1/users',
    canReadUsers,
    koaGuard({
      query: userListQueryGuard,
      response: z.object({ data: userSummaryGuard.array(), total: z.number() }),
      status: [200, 400, 401, 403],
    }),
    async (ctx, next) => {
      const { users } = await loadUserSummaries();
      const { data, total } = selectUserPage(users, ctx.guard.query);
      const lastSignIns = await iamAdmin.findLastSignInApplications(data.map(({ id }) => id));

      ctx.body = { data: withLastSignInApplications(data, lastSignIns), total };

      return next();
    }
  );

  router.get(
    '/iam-admin/v1/user-stats',
    canReadUsers,
    koaGuard({ response: userStatsGuard, status: [200, 401, 403] }),
    async (ctx, next) => {
      const { users, organizationCount } = await loadUserSummaries();

      ctx.body = countUsers(
        users.map(({ summary }) => summary),
        organizationCount
      );

      return next();
    }
  );

  router.get(
    '/iam-admin/v1/users/:id',
    canReadUsers,
    koaGuard({
      params: z.object({ id: z.string().min(1) }),
      response: userDetailGuard,
      status: [200, 401, 403, 404],
    }),
    async (ctx, next) => {
      const detail = await loadUserDetail(ctx.guard.params.id);

      assertThat(detail, new RequestError({ code: 'entity.not_found', status: 404 }));

      ctx.body = detail;

      return next();
    }
  );

  router.get(
    '/iam-admin/v1/organizations',
    canReadUsers,
    koaGuard({
      response: z.object({ data: organizationGuard.array() }),
      status: [200, 401, 403],
    }),
    async (ctx, next) => {
      const [organizationsById, membershipRows] = await Promise.all([
        findOrganizationsById(),
        iamAdmin.findMemberships(),
      ]);
      const memberCounts = new Map<string, number>();
      for (const { organizationId } of membershipRows) {
        memberCounts.set(organizationId, (memberCounts.get(organizationId) ?? 0) + 1);
      }

      ctx.body = {
        data: [...organizationsById.values()].map(({ id, name, customData }) => ({
          id,
          name,
          type: getCustomDataString(customData, 'type') ?? null,
          level: getOrganizationLevel(customData) ?? null,
          parentOrgId: getParentOrgId(customData) ?? null,
          provinceCode: getCustomDataString(customData, 'provinceCode') ?? null,
          sourceCode: getCustomDataString(customData, 'sourceCode') ?? null,
          roleTitles: getCustomDataStringRecord(customData, 'roleTitles') ?? {},
          memberCount: memberCounts.get(id) ?? 0,
        })),
      };

      return next();
    }
  );

  router.get(
    '/iam-admin/v1/organization-roles',
    canReadUsers,
    koaGuard({
      response: z.object({ data: z.object({ code: z.string(), name: z.string() }).array() }),
      status: [200, 401, 403],
    }),
    async (ctx, next) => {
      const [, roles] = await organizations.roles.findAll(maxOrganizations, 0);

      ctx.body = { data: roles.map(({ id, name }) => ({ code: getRoleCode(id), name })) };

      return next();
    }
  );

  userWriteRoutes(router, tenant);
  systemRoutes(router, tenant);
}
