import { type Nullable } from '@silverhand/essentials';
import { object, string, z } from 'zod';

import RequestError from '#src/errors/RequestError/index.js';
import { verifyBearerTokenFromRequest } from '#src/middleware/koa-auth/index.js';
import assertThat from '#src/utils/assert-that.js';

import type { AnonymousRouter, ManagementApiRouter, RouterInitArgs } from './types.js';

/**
 * Sdvico IAM Sync API — cho các hệ thống ngoài (IUU/MKN/CBVMS) đồng bộ danh sách user.
 *
 * Xác thực RIÊNG (không dùng chung scope `all` của Management API nữa): API Resource
 * "https://<tenantId>.logto.app/iam-sync" + scope "iam-sync:read". Mỗi M2M app IUU/MKN/CBVMS
 * chỉ cần Role có đúng scope này (xem docs/sql/declare-apps.sql), KHÔNG có toàn quyền
 * Management API như bản proof-of-concept đầu tiên — xem docs/iam-sync-api-design.md.
 *
 * Cơ chế phân quyền theo tổ chức (đã chốt): mỗi hệ thống ngoài = 1 M2M Application riêng,
 * được thêm làm thành viên của Organization (Tỉnh/Cảng hoặc Trung ương) qua
 * `organization_application_relations`. `organizations.custom_data.level` phân biệt
 * 'trung_uong' (thấy toàn bộ user mọi tổ chức) và các cấp còn lại — vd 'tinh', 'cang'
 * (chỉ thấy user thuộc đúng tổ chức mà app là thành viên).
 */

const IAM_SYNC_REQUIRED_SCOPE = 'iam-sync:read';

const getIamSyncResourceIndicator = (tenantId: string) => `https://${tenantId}.logto.app/iam-sync`;

const customDataGuard = z.record(z.unknown());

const getCustomDataField = (customData: unknown, key: string): unknown => {
  const parsed = customDataGuard.safeParse(customData);
  return parsed.success ? parsed.data[key] : undefined;
};

const getCustomDataString = (customData: unknown, key: string): string | undefined => {
  const value = getCustomDataField(customData, key);

  return typeof value === 'string' ? value : undefined;
};

/** Object chuỗi → chuỗi (vd `roleTitles`, `externalIds`); bỏ các giá trị không phải chuỗi. */
const getCustomDataStringRecord = (
  customData: unknown,
  key: string
): Record<string, string> | undefined => {
  const value = getCustomDataField(customData, key);

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string'
  );

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

const getOrganizationLevel = (customData: unknown): string | undefined =>
  getCustomDataString(customData, 'level');

/**
 * Cha trực tiếp của tổ chức trong cây phân cấp thật (vd Cảng thuộc Chi cục quản lý), lưu ở
 * `organizations.custom_data.parentOrgId`. KHÔNG phải mọi Cảng đều đã xác định được Chi cục
 * quản lý (dữ liệu nguồn không nêu rõ) — org nào chưa rõ thì field này là null/undefined và
 * chỉ hiện diện độc lập (không tự động lộ ra cho app cấp tỉnh nào).
 */
const getParentOrgId = (customData: unknown): string | undefined =>
  getCustomDataString(customData, 'parentOrgId');

/**
 * Thông tin tổ chức trả cho hệ thống ngoài, để họ tự quy đổi ra quyền (loại đơn vị, tỉnh, mã
 * đồn/cảng nguồn, tên chức danh). Trường nào không có trong `custom_data` thì bỏ khỏi đối tượng.
 */
const toSyncOrganization = ({
  id,
  name,
  customData,
}: {
  id: string;
  name: string;
  customData: unknown;
}) => ({
  id,
  name,
  level: getOrganizationLevel(customData),
  type: getCustomDataString(customData, 'type'),
  parentOrgId: getParentOrgId(customData),
  provinceCode: getCustomDataString(customData, 'provinceCode'),
  sourceCode: getCustomDataString(customData, 'sourceCode'),
  roleTitles: getCustomDataStringRecord(customData, 'roleTitles'),
});

type SyncOrganization = ReturnType<typeof toSyncOrganization>;

const scopeTypes = Object.freeze(['province', 'ward', 'port', 'vessel'] as const);

type DataScope = Partial<Record<(typeof scopeTypes)[number], string[]>>;

const stringArrayGuard = z.string().array();

/** Khoá nào không phải mảng chuỗi thì bỏ riêng khoá đó, không bỏ cả phạm vi. */
const getDataScope = (customData: unknown): DataScope => {
  const dataScope = getCustomDataField(customData, 'dataScope');

  return Object.fromEntries(
    scopeTypes.flatMap((type) => {
      const parsed = stringArrayGuard.safeParse(getCustomDataField(dataScope, type));
      return parsed.success ? [[type, parsed.data]] : [];
    })
  );
};

const flattenScopes = (dataScope: DataScope): Array<{ type: string; id: string }> =>
  scopeTypes.flatMap((type) => (dataScope[type] ?? []).map((id) => ({ type, id })));

/**
 * Code ổn định cho vai trò (vd "CHUYEN_VIEN"), để hệ thống ngoài switch/if theo code thay vì
 * so sánh chuỗi tiếng Việt có dấu (name có thể đổi câu chữ, code thì không). Ánh xạ tường minh
 * cho các role đã biết; role mới/chưa có trong danh sách sẽ tự suy code từ chính id của nó
 * (id trong Logto vốn cố định, không đổi theo thời gian) để không bao giờ thiếu code.
 */
const KNOWN_ROLE_CODES: Record<string, string> = {
  'role-truong': 'TRUONG',
  'role-pho': 'PHO',
  'role-cv': 'CHUYEN_VIEN',
};

const getRoleCode = (roleId: string): string =>
  KNOWN_ROLE_CODES[roleId] ??
  roleId
    .replace(/^role-/, '')
    .toUpperCase()
    .replaceAll(/[^\dA-Z]+/g, '_');

const syncUserGuard = object({
  id: string(),
  username: string().nullable(),
  name: string().nullable(),
  status: z.enum(['active', 'suspended']),
  organizations: object({
    id: string(),
    name: string(),
    level: string().optional(),
    type: string().optional(),
    parentOrgId: string().optional(),
    provinceCode: string().optional(),
    sourceCode: string().optional(),
    roleTitles: z.record(string()).optional(),
  }).array(),
  roles: object({
    code: string(),
    name: string(),
    /** Tổ chức nơi người dùng giữ vai trò này; người kiêm nhiệm có một phần tử mỗi tổ chức. */
    organizationId: string().optional(),
  }).array(),
  scopes: object({ type: string(), id: string() }).array(),
  /** Mã người dùng ở các hệ cũ, đội IAM ghi vào `users.custom_data.externalIds`. */
  external_ids: z.record(string()).optional(),
  updated_at: string(),
});

const syncUsersResponseGuard = object({ data: syncUserGuard.array() });

/**
 * Lõi dùng chung cho cả 2 route bên dưới: gom user theo tập hợp Organization được phép thấy
 * (đã tính đệ quy theo Cảng trực thuộc Tỉnh nếu còn dùng `parentOrgId`), rồi map sang đúng
 * format response rút gọn (id, username, name, status, organizations, roles, scopes, updated_at).
 */
const collectSyncUsers = async (
  organizations: RouterInitArgs<AnonymousRouter>[1]['queries']['organizations'],
  visibleOrganizations: ReadonlyArray<{ id: string; name: string; customData: unknown }>
) => {
  const usersById = new Map<
    string,
    {
      id: string;
      username: Nullable<string>;
      name: Nullable<string>;
      isSuspended: boolean;
      customData: unknown;
      updatedAt: number;
      organizations: Map<string, SyncOrganization>;
      /**
       * Khoá `orgId:roleId`: cùng một vai trò ở hai tổ chức là hai phần tử. Giữ nguyên roleId
       * để suy code ổn định ở bước sau.
       */
      roles: Map<string, { roleId: string; name: string; organizationId: string }>;
    }
  >();

  for (const org of visibleOrganizations) {
    const syncOrganization = toSyncOrganization(org);
    // eslint-disable-next-line no-await-in-loop -- one organization at a time keeps DB pool usage bounded
    const [, orgUsers] = await organizations.relations.users.getUsersByOrganizationId(org.id, {
      limit: 1000,
      offset: 0,
    });

    for (const user of orgUsers) {
      const existing = usersById.get(user.id) ?? {
        id: user.id,
        username: user.username,
        name: user.name,
        isSuspended: user.isSuspended,
        customData: user.customData,
        updatedAt: user.updatedAt,
        organizations: new Map<string, SyncOrganization>(),
        roles: new Map<string, { roleId: string; name: string; organizationId: string }>(),
      };

      existing.organizations.set(org.id, syncOrganization);
      // `organizationRoles` chỉ gồm vai trò của người dùng trong đúng tổ chức `org`.
      for (const role of user.organizationRoles) {
        existing.roles.set(`${org.id}:${role.id}`, {
          roleId: role.id,
          name: role.name,
          organizationId: org.id,
        });
      }

      usersById.set(user.id, existing);
    }
  }

  return [...usersById.values()].map((user) => ({
    id: user.id,
    username: user.username,
    name: user.name,
    status: user.isSuspended ? ('suspended' as const) : ('active' as const),
    organizations: [...user.organizations.values()],
    roles: [...user.roles.values()].map(({ roleId, name, organizationId }) => ({
      code: getRoleCode(roleId),
      name,
      organizationId,
    })),
    scopes: flattenScopes(getDataScope(user.customData)),
    external_ids: getCustomDataStringRecord(user.customData, 'externalIds'),
    updated_at: new Date(user.updatedAt).toISOString(),
  }));
};

/**
 * Từ danh sách Organization mà 1 M2M app là thành viên trực tiếp, suy ra toàn bộ Organization
 * app đó được phép thấy: nếu có org cấp "trung_uong" → tất cả; ngược lại → chính các org đó
 * cộng đệ quy theo `parentOrgId` (tương thích ngược, hiện không còn org nào có level=cang nên
 * thường không mở rộng thêm gì — xem docs/sql/fix-remove-cang-orgs.sql).
 */
const resolveVisibleOrganizations = async (
  organizations: RouterInitArgs<AnonymousRouter>[1]['queries']['organizations'],
  memberOrganizations: ReadonlyArray<{ id: string; customData: unknown }>
) => {
  const isNationwide = memberOrganizations.some(
    (org) => getOrganizationLevel(org.customData) === 'trung_uong'
  );

  const [, allOrganizations] = await organizations.findAll(1000, 0);

  if (isNationwide) {
    return allOrganizations;
  }

  const childrenByParentId = new Map<string, string[]>();
  for (const org of allOrganizations) {
    const parentId = getParentOrgId(org.customData);
    if (parentId) {
      childrenByParentId.set(parentId, [...(childrenByParentId.get(parentId) ?? []), org.id]);
    }
  }

  const getDescendantIds = (orgId: string, seen = new Set<string>()): string[] => {
    if (seen.has(orgId)) {
      return [];
    }
    seen.add(orgId);
    const directChildren = childrenByParentId.get(orgId) ?? [];
    return directChildren.flatMap((childId) => [childId, ...getDescendantIds(childId, seen)]);
  };

  const visibleIds = new Set(
    memberOrganizations.flatMap((org) => [org.id, ...getDescendantIds(org.id)])
  );

  return allOrganizations.filter((org) => visibleIds.has(org.id));
};

export function iamSyncRoutes<T extends AnonymousRouter>(...[router, tenant]: RouterInitArgs<T>) {
  const { queries, envSet, id: tenantId } = tenant;
  const { organizations } = queries;

  router.get('/iam-sync/v1/users', async (ctx, next) => {
    const { sub, clientId, scopes } = await verifyBearerTokenFromRequest(
      envSet,
      ctx.request,
      getIamSyncResourceIndicator(tenantId)
    );

    assertThat(
      clientId && sub === clientId,
      new RequestError({
        code: 'auth.forbidden',
        status: 403,
        message: 'Chỉ M2M application mới được gọi IAM Sync API.',
      })
    );

    assertThat(
      scopes.includes(IAM_SYNC_REQUIRED_SCOPE),
      new RequestError({
        code: 'auth.forbidden',
        status: 403,
        message: `Thiếu scope bắt buộc "${IAM_SYNC_REQUIRED_SCOPE}".`,
      })
    );

    // Org nào mà M2M app này là thành viên (organization_application_relations).
    const [, appOrganizations] =
      await organizations.relations.apps.getOrganizationsByApplicationId(clientId);

    assertThat(
      appOrganizations.length > 0,
      new RequestError({
        code: 'auth.forbidden',
        status: 403,
        message:
          'M2M application chưa được gán làm thành viên của Organization nào — chưa có quyền đọc user nào cả.',
      })
    );

    const visibleOrganizations = await resolveVisibleOrganizations(organizations, appOrganizations);
    const data = await collectSyncUsers(organizations, visibleOrganizations);

    ctx.body = syncUsersResponseGuard.parse({ data });

    return next();
  });
}

/**
 * Trang xem đơn giản cho Cục Quản lý ngay trong Console admin (session admin thường, KHÔNG
 * qua M2M token) — nên dùng managementRouter (đã có koaAuth với scope 'all' của Management API).
 * Trả về TOÀN BỘ user (không giới hạn theo tổ chức nào) vì đây là màn hình quản trị nội bộ.
 */
export function iamSyncAdminPreviewRoutes<T extends ManagementApiRouter>(
  ...[router, tenant]: RouterInitArgs<T>
) {
  const { queries } = tenant;
  const { organizations } = queries;

  router.get('/iam-sync-preview/users', async (ctx, next) => {
    const [, allOrganizations] = await organizations.findAll(1000, 0);
    const data = await collectSyncUsers(organizations, allOrganizations);

    ctx.body = syncUsersResponseGuard.parse({ data });

    return next();
  });
}

export default iamSyncRoutes;
