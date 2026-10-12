import type { Context, MiddlewareType } from 'koa';

import RequestError from '#src/errors/RequestError/index.js';
import { verifyBearerTokenFromRequest } from '#src/middleware/koa-auth/index.js';
import type TenantContext from '#src/tenants/TenantContext.js';
import assertThat from '#src/utils/assert-that.js';
import { getOrganizationLevel } from '#src/utils/iam-organization.js';

export const iamAdminScopes = Object.freeze({
  usersRead: 'iam-admin:users:read',
  usersWrite: 'iam-admin:users:write',
  appsRead: 'iam-admin:apps:read',
  appsWrite: 'iam-admin:apps:write',
} as const);

type IamAdminScope = (typeof iamAdminScopes)[keyof typeof iamAdminScopes];

const getIamAdminResourceIndicator = (tenantId: string) =>
  `https://${tenantId}.logto.app/iam-admin`;

/**
 * `RequestError` không đưa `message` tự viết lên body (nó dịch theo `code`), nên lý do cụ thể đi
 * trong `data.reason` để hệ gọi phân biệt được các ca 403.
 */
export const forbidden = (reason: string) =>
  new RequestError({ code: 'auth.forbidden', status: 403 }, { reason });

/** App M2M đã qua xác thực của từng request, để handler biết ai gọi mà không xác thực lại. */
const callerByContext = new WeakMap<Context, string>();

/** Client id của app đang gọi; chỉ dùng sau `koaIamAdminAuth`. */
export const getCallerClientId = (ctx: Context): string => {
  const clientId = callerByContext.get(ctx);
  assertThat(clientId, forbidden('not_authenticated'));
  return clientId;
};

/**
 * Xác thực IAM Admin API (docs/iam-admin-api-design.md mục 1): token M2M của resource iam-admin,
 * có `requiredScope`, và app gọi là thành viên một tổ chức cấp trung ương. Không dùng quyền `all`
 * của Management API.
 */
export const koaIamAdminAuth =
  <StateT, ContextT, ResponseBodyT>(
    { envSet, id: tenantId, queries }: TenantContext,
    requiredScope: IamAdminScope
  ): MiddlewareType<StateT, ContextT, ResponseBodyT> =>
  async (ctx, next) => {
    const { sub, clientId, scopes } = await verifyBearerTokenFromRequest(
      envSet,
      ctx.request,
      getIamAdminResourceIndicator(tenantId)
    );

    assertThat(clientId && sub === clientId, forbidden('not_machine_to_machine'));
    assertThat(scopes.includes(requiredScope), forbidden(`missing_scope:${requiredScope}`));

    const [, appOrganizations] =
      await queries.organizations.relations.apps.getOrganizationsByApplicationId(clientId);

    assertThat(
      appOrganizations.some(({ customData }) => getOrganizationLevel(customData) === 'trung_uong'),
      forbidden('not_nationwide')
    );

    callerByContext.set(ctx, clientId);

    return next();
  };
