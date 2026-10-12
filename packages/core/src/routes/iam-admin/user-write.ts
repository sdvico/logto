import { StatementTimeoutError } from '@silverhand/slonik';
import { z } from 'zod';

import RequestError from '#src/errors/RequestError/index.js';
import { buildUserPasswordPayloadFromPassword } from '#src/libraries/user.utils.js';
import koaGuard from '#src/middleware/koa-guard.js';
import assertThat from '#src/utils/assert-that.js';
import { getConsoleLogFromContext } from '#src/utils/console.js';

import type { AnonymousRouter, RouterInitArgs } from '../types.js';

import { getActor, writeIamAdminLog } from './audit.js';
import { iamAdminScopes, koaIamAdminAuth } from './auth.js';
import {
  createUserBodyGuard,
  generateTemporaryPassword,
  membershipParamsGuard,
  roleCodesGuard,
  updateUserBodyGuard,
  userParamsGuard,
} from './user-input.js';
import { userDetailGuard } from './user-view.js';
import { createUserWriteHelpers } from './user-write-helpers.js';

export default function userWriteRoutes<T extends AnonymousRouter>(
  ...[router, tenant]: RouterInitArgs<T>
) {
  const { queries, libraries } = tenant;
  const { users, organizations } = queries;
  const { users: userLibrary } = libraries;
  const canWriteUsers = koaIamAdminAuth(tenant, iamAdminScopes.usersWrite);
  const {
    assertIdentifiersAvailable,
    assertUserExists,
    loadExistingUserDetail,
    resolveRoleIds,
    setOrganizationRoles,
  } = createUserWriteHelpers(tenant);

  router.post(
    '/iam-admin/v1/users',
    canWriteUsers,
    koaGuard({
      body: createUserBodyGuard,
      response: z.object({ user: userDetailGuard, temporaryPassword: z.string().nullable() }),
      status: [201, 400, 401, 403, 404, 422],
    }),
    async (ctx, next) => {
      const actor = getActor(ctx);
      const { name, username, email, phone, password, organization } = ctx.guard.body;

      await assertIdentifiersAvailable({ username, email, phone });

      if (organization) {
        // Kiểm đơn vị trước khi tạo người dùng; không có thì 404, chưa có gì bị ghi.
        await organizations.findById(organization.id);
      }
      const roleIds = organization ? await resolveRoleIds(organization.roleCodes) : [];
      const temporaryPassword = password.mode === 'generate' ? generateTemporaryPassword() : null;

      const [user] = await userLibrary.insertUser({
        id: await userLibrary.generateUserId(),
        name,
        username,
        primaryEmail: email,
        primaryPhone: phone,
        ...(await buildUserPasswordPayloadFromPassword(
          password.mode === 'set' ? password.value : (temporaryPassword ?? '')
        )),
      });

      if (organization) {
        try {
          await setOrganizationRoles(user.id, organization.id, roleIds);
        } catch (error: unknown) {
          // Không để lại người dùng nửa vời khi gán đơn vị hỏng.
          await users.deleteUserById(user.id);
          throw error;
        }
      }

      await writeIamAdminLog(queries, ctx, {
        actor,
        action: 'User.Create',
        payload: {
          userId: user.id,
          organizationId: organization?.id,
          roleCodes: organization?.roleCodes,
        },
      });

      ctx.status = 201;
      ctx.body = { user: await loadExistingUserDetail(user.id), temporaryPassword };

      return next();
    }
  );

  router.patch(
    '/iam-admin/v1/users/:id',
    canWriteUsers,
    koaGuard({
      params: userParamsGuard,
      body: updateUserBodyGuard,
      response: userDetailGuard,
      status: [200, 400, 401, 403, 404, 422],
    }),
    async (ctx, next) => {
      const actor = getActor(ctx);
      const { id } = ctx.guard.params;
      const { name, username, email, phone } = ctx.guard.body;
      const changes = {
        ...(name === undefined ? {} : { name }),
        ...(username === undefined ? {} : { username }),
        ...(email === undefined ? {} : { primaryEmail: email }),
        ...(phone === undefined ? {} : { primaryPhone: phone }),
      };

      await assertUserExists(id);
      await userLibrary.checkIdentifierCollision(changes, id);
      await users.updateUserById(id, changes);
      await writeIamAdminLog(queries, ctx, {
        actor,
        action: 'User.Update',
        payload: {
          userId: id,
          fields: Object.keys(changes),
        },
      });

      ctx.body = await loadExistingUserDetail(id);

      return next();
    }
  );

  router.put(
    '/iam-admin/v1/users/:id/suspension',
    canWriteUsers,
    koaGuard({
      params: userParamsGuard,
      body: z.object({ suspended: z.boolean(), reason: z.string().trim().max(500).optional() }),
      response: userDetailGuard,
      status: [200, 400, 401, 403, 404],
    }),
    async (ctx, next) => {
      const actor = getActor(ctx);
      const { id } = ctx.guard.params;
      const { suspended, reason } = ctx.guard.body;

      await assertUserExists(id);
      await users.updateUserById(id, { isSuspended: suspended });

      if (suspended) {
        await userLibrary.signOutUser(id);
      }

      await writeIamAdminLog(queries, ctx, {
        actor,
        action: suspended ? 'User.Suspend' : 'User.Unsuspend',
        payload: { userId: id, reason },
      });

      ctx.body = await loadExistingUserDetail(id);

      return next();
    }
  );

  router.post(
    '/iam-admin/v1/users/:id/password-reset',
    canWriteUsers,
    koaGuard({
      params: userParamsGuard,
      body: z.object({ revokeSessions: z.boolean().default(true) }),
      response: z.object({ temporaryPassword: z.string() }),
      status: [200, 400, 401, 403, 404],
    }),
    async (ctx, next) => {
      const actor = getActor(ctx);
      const { id } = ctx.guard.params;
      const { revokeSessions } = ctx.guard.body;
      const temporaryPassword = generateTemporaryPassword();

      await assertUserExists(id);
      await users.updateUserById(id, await buildUserPasswordPayloadFromPassword(temporaryPassword));

      if (revokeSessions) {
        await userLibrary.signOutUser(id);
      }

      await writeIamAdminLog(queries, ctx, {
        actor,
        action: 'User.ResetPassword',
        payload: {
          userId: id,
          revokeSessions,
        },
      });

      ctx.body = { temporaryPassword };

      return next();
    }
  );

  router.delete(
    '/iam-admin/v1/users/:id',
    canWriteUsers,
    koaGuard({ params: userParamsGuard, status: [204, 400, 401, 403, 404] }),
    async (ctx, next) => {
      const actor = getActor(ctx);
      const { id } = ctx.guard.params;

      await assertUserExists(id);

      // Giống DELETE /api/users/:userId của Logto: thu hồi phiên là cố gắng tối đa, hết thời gian
      // thì vẫn xoá, các phiên còn lại tự hết hạn.
      try {
        await userLibrary.signOutUser(id);
      } catch (error: unknown) {
        if (!(error instanceof StatementTimeoutError)) {
          throw error;
        }
        getConsoleLogFromContext(ctx).error(`Failed to revoke sessions of user ${id}.`, error);
      }

      await users.deleteUserById(id);
      await writeIamAdminLog(queries, ctx, {
        actor,
        action: 'User.Delete',
        payload: { userId: id },
      });

      ctx.status = 204;

      return next();
    }
  );

  router.put(
    '/iam-admin/v1/users/:id/organizations/:orgId',
    canWriteUsers,
    koaGuard({
      params: membershipParamsGuard,
      body: z.object({ roleCodes: roleCodesGuard }),
      response: userDetailGuard,
      status: [200, 400, 401, 403, 404],
    }),
    async (ctx, next) => {
      const actor = getActor(ctx);
      const { id, orgId } = ctx.guard.params;
      const { roleCodes } = ctx.guard.body;

      await assertUserExists(id);
      await organizations.findById(orgId);
      await setOrganizationRoles(id, orgId, await resolveRoleIds(roleCodes));
      await writeIamAdminLog(queries, ctx, {
        actor,
        action: 'User.SetOrganizationRoles',
        payload: {
          userId: id,
          organizationId: orgId,
          roleCodes,
        },
      });

      ctx.body = await loadExistingUserDetail(id);

      return next();
    }
  );

  router.delete(
    '/iam-admin/v1/users/:id/organizations/:orgId',
    canWriteUsers,
    koaGuard({ params: membershipParamsGuard, status: [204, 400, 401, 403, 404] }),
    async (ctx, next) => {
      const actor = getActor(ctx);
      const { id, orgId } = ctx.guard.params;
      const existing = await organizations.relations.users.getExistingOrganizationIds(id, [orgId]);
      const isMember = existing.length > 0;

      assertThat(isMember, new RequestError({ code: 'entity.not_found', status: 404 }));
      // Chức danh ở đơn vị đó xoá theo khoá ngoại (organization_role_user_relations).
      await organizations.relations.users.delete({ organizationId: orgId, userId: id });
      await writeIamAdminLog(queries, ctx, {
        actor,
        action: 'User.LeaveOrganization',
        payload: {
          userId: id,
          organizationId: orgId,
        },
      });

      ctx.status = 204;

      return next();
    }
  );
}
