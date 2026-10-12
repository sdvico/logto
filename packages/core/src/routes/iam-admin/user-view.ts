import { type Nullable } from '@silverhand/essentials';
import { z } from 'zod';

import {
  type IamAdminLastSignInRow,
  type IamAdminMembershipRow,
  type IamAdminRoleAssignmentRow,
  type IamAdminUserRow,
} from '#src/queries/iam-admin.js';
import {
  getCustomDataString,
  getCustomDataStringRecord,
  getParentOrgId,
  getRoleCode,
} from '#src/utils/iam-organization.js';

export type OrganizationRecord = { id: string; name: string; customData: unknown };

const userStatusGuard = z.enum(['active', 'suspended']);

const userOrganizationGuard = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().nullable(),
  roles: z.object({ code: z.string(), title: z.string() }).array(),
});

export const userSummaryGuard = z.object({
  id: z.string(),
  username: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  status: userStatusGuard,
  organizations: userOrganizationGuard.array(),
  lastSignInAt: z.string().nullable(),
  lastSignInApplication: z.object({ id: z.string(), name: z.string() }).nullable(),
});

type UserSummary = z.infer<typeof userSummaryGuard>;

export const userDetailGuard = userSummaryGuard.extend({
  organizations: userOrganizationGuard
    .extend({
      path: z.string().array(),
      provinceCode: z.string().nullable(),
      sourceCode: z.string().nullable(),
    })
    .array(),
  createdAt: z.string(),
  updatedAt: z.string(),
  passwordUpdatedAt: z.string().nullable(),
  hasPassword: z.boolean(),
  externalIds: z.record(z.string()),
});

type UserDetail = z.infer<typeof userDetailGuard>;

export const userListQueryGuard = z.object({
  search: z.string().trim().optional(),
  organizationId: z.string().optional(),
  roleCode: z.string().optional(),
  status: z.enum(['active', 'suspended', 'no-organization']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['lastSignIn', 'name', 'createdAt']).default('lastSignIn'),
});

type UserListQuery = z.infer<typeof userListQueryGuard>;

export const userStatsGuard = z.object({
  total: z.number(),
  active: z.number(),
  suspended: z.number(),
  noOrganization: z.number(),
  organizations: z.number(),
});

const toIsoString = (time: Nullable<number>) =>
  time === null ? null : new Date(time).toISOString();

const getRoleTitle = (organization: OrganizationRecord, code: string, roleName: string) =>
  getCustomDataStringRecord(organization.customData, 'roleTitles')?.[code] ?? roleName;

/** Tên các tổ chức cha theo `parentOrgId`, từ gốc xuống, không gồm chính tổ chức. */
export const getOrganizationPath = (
  organizationId: string,
  organizationsById: ReadonlyMap<string, OrganizationRecord>,
  seen: ReadonlySet<string> = new Set([organizationId])
): string[] => {
  const parentId = getParentOrgId(organizationsById.get(organizationId)?.customData);
  const parent = parentId === undefined ? undefined : organizationsById.get(parentId);

  // `seen` chặn vòng lặp khi dữ liệu `parentOrgId` trỏ vòng.
  if (!parent || seen.has(parent.id)) {
    return [];
  }

  return [
    ...getOrganizationPath(parent.id, organizationsById, new Set([...seen, parent.id])),
    parent.name,
  ];
};

type UserOrganization = z.infer<typeof userOrganizationGuard>;

/** Đơn vị và chức danh của từng người dùng, khoá theo id người dùng. */
export const groupOrganizationsByUser = (
  membershipRows: readonly IamAdminMembershipRow[],
  roleRows: readonly IamAdminRoleAssignmentRow[],
  organizationsById: ReadonlyMap<string, OrganizationRecord>
): Map<string, UserOrganization[]> => {
  const rolesByMembership = new Map<string, Array<{ code: string; title: string }>>();

  for (const { organizationId, userId, roleId, roleName } of roleRows) {
    const organization = organizationsById.get(organizationId);
    if (organization) {
      const key = `${organizationId}:${userId}`;
      const code = getRoleCode(roleId);
      rolesByMembership.set(key, [
        ...(rolesByMembership.get(key) ?? []),
        { code, title: getRoleTitle(organization, code, roleName) },
      ]);
    }
  }

  const organizationsByUser = new Map<string, UserOrganization[]>();

  for (const { organizationId, userId } of membershipRows) {
    const organization = organizationsById.get(organizationId);
    if (organization) {
      organizationsByUser.set(userId, [
        ...(organizationsByUser.get(userId) ?? []),
        {
          id: organization.id,
          name: organization.name,
          type: getCustomDataString(organization.customData, 'type') ?? null,
          roles: rolesByMembership.get(`${organizationId}:${userId}`) ?? [],
        },
      ]);
    }
  }

  return organizationsByUser;
};

export const toUserSummary = (
  user: IamAdminUserRow,
  organizations: UserOrganization[]
): UserSummary => ({
  id: user.id,
  username: user.username,
  name: user.name,
  email: user.primaryEmail,
  phone: user.primaryPhone,
  status: user.isSuspended ? 'suspended' : 'active',
  organizations,
  lastSignInAt: toIsoString(user.lastSignInAt),
  lastSignInApplication: null,
});

export const toUserDetail = (
  user: IamAdminUserRow,
  organizations: UserOrganization[],
  organizationsById: ReadonlyMap<string, OrganizationRecord>
): UserDetail => ({
  ...toUserSummary(user, organizations),
  organizations: organizations.map((organization) => {
    const { customData } = organizationsById.get(organization.id) ?? {};
    return {
      ...organization,
      path: getOrganizationPath(organization.id, organizationsById),
      provinceCode: getCustomDataString(customData, 'provinceCode') ?? null,
      sourceCode: getCustomDataString(customData, 'sourceCode') ?? null,
    };
  }),
  createdAt: new Date(user.createdAt).toISOString(),
  updatedAt: new Date(user.updatedAt).toISOString(),
  passwordUpdatedAt: toIsoString(user.passwordUpdatedAt),
  hasPassword: user.hasPassword,
  externalIds: getCustomDataStringRecord(user.customData, 'externalIds') ?? {},
});

const normalize = (value: Nullable<string>) => (value ?? '').toLocaleLowerCase('vi');

const matchesSearch = (user: UserSummary, search: string) => {
  const term = normalize(search);
  const digits = search.replaceAll(/\D/g, '');

  return (
    [user.name, user.username, user.email].some((value) => normalize(value).includes(term)) ||
    (digits.length > 0 && (user.phone ?? '').replaceAll(/\D/g, '').includes(digits))
  );
};

const matchesStatus = (user: UserSummary, status: UserListQuery['status']) => {
  if (status === 'no-organization') {
    return user.organizations.length === 0;
  }

  return !status || user.status === status;
};

const matchesOrganizationAndRole = (
  user: UserSummary,
  { organizationId, roleCode }: Pick<UserListQuery, 'organizationId' | 'roleCode'>
) => {
  const organizations = organizationId
    ? user.organizations.filter(({ id }) => id === organizationId)
    : user.organizations;

  return (
    (!organizationId || organizations.length > 0) &&
    (!roleCode || organizations.some(({ roles }) => roles.some(({ code }) => code === roleCode)))
  );
};

const matchesFilters = (user: UserSummary, query: UserListQuery) =>
  (!query.search || matchesSearch(user, query.search)) &&
  matchesOrganizationAndRole(user, query) &&
  matchesStatus(user, query.status);

type SortableUser = { summary: UserSummary; createdAt: number };

const compareUsers =
  (sort: UserListQuery['sort']) =>
  (left: SortableUser, right: SortableUser): number => {
    const byId = left.summary.id.localeCompare(right.summary.id);

    if (sort === 'name') {
      return (
        normalize(left.summary.name ?? left.summary.username).localeCompare(
          normalize(right.summary.name ?? right.summary.username),
          'vi'
        ) || byId
      );
    }

    if (sort === 'createdAt') {
      return right.createdAt - left.createdAt || byId;
    }

    // Mới đăng nhập trước; chưa đăng nhập bao giờ xuống cuối.
    const leftTime = left.summary.lastSignInAt ?? '';
    const rightTime = right.summary.lastSignInAt ?? '';
    return rightTime.localeCompare(leftTime) || byId;
  };

/** Lọc, sắp xếp, chia trang. Trả trang hiện tại và tổng số dòng khớp bộ lọc. */
export const selectUserPage = (users: readonly SortableUser[], query: UserListQuery) => {
  const matched = users
    .filter(({ summary }) => matchesFilters(summary, query))
    .slice()
    .sort(compareUsers(query.sort));
  const start = (query.page - 1) * query.pageSize;

  return {
    data: matched.slice(start, start + query.pageSize).map(({ summary }) => summary),
    total: matched.length,
  };
};

export const withLastSignInApplications = (
  users: readonly UserSummary[],
  rows: readonly IamAdminLastSignInRow[]
): UserSummary[] => {
  const byUserId = new Map(rows.map((row) => [row.userId, row]));

  return users.map((user) => {
    const row = byUserId.get(user.id);
    return row
      ? {
          ...user,
          lastSignInApplication: {
            id: row.applicationId,
            name: row.applicationName ?? row.applicationId,
          },
        }
      : user;
  });
};

export const countUsers = (users: readonly UserSummary[], organizationCount: number) => ({
  total: users.length,
  active: users.filter(({ status }) => status === 'active').length,
  suspended: users.filter(({ status }) => status === 'suspended').length,
  noOrganization: users.filter(({ organizations }) => organizations.length === 0).length,
  organizations: organizationCount,
});
