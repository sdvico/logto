/**
 * SDVICO: nạp trạng thái Logto mà bước Soát cần, qua Management API có sẵn: mọi người dùng (để biết
 * tên, email, số điện thoại đã dùng, ai đã nhập và ai nối được), mọi tổ chức (tra theo đơn vị), vai trò
 * tổ chức, và ai đang được IAM Sync API trả về.
 */
import { type Organization, type OrganizationRole, type UserProfileResponse } from '@logto/schemas';
import { type KyInstance } from 'ky';
import { z } from 'zod';

import { countKeys, groupIds } from './group';
import {
  type ImportLookup,
  type ImportOrganization,
  type ImportSource,
  type ImportUser,
  unitKeyOf,
} from './staff-rows';

/** Giới hạn `page_size` của Management API. */
const pageSize = 100;

/** Mã chức danh → id vai trò tổ chức, đúng `KNOWN_ROLE_CODES` của IAM Sync API (seed-organization-roles.sql). */
const roleIdByCodeConvention: Readonly<Record<string, string>> = Object.freeze({
  TRUONG: 'role-truong',
  PHO: 'role-pho',
  CHUYEN_VIEN: 'role-cv',
});

/** Đọc hết mọi trang của một danh sách Management API. */
export const fetchAll = async <T>(
  api: KyInstance,
  path: string,
  query: Readonly<Record<string, string>> = {}
): Promise<T[]> => {
  const fetchFrom = async (page: number): Promise<T[]> => {
    const items = await api
      .get(path, { searchParams: { ...query, page, page_size: pageSize } })
      .json<T[]>();
    return items.length < pageSize ? items : [...items, ...(await fetchFrom(page + 1))];
  };

  return fetchFrom(1);
};

const externalIdsGuard = z.object({ externalIds: z.record(z.unknown()) });

const roleTitlesGuard = z.object({ roleTitles: z.record(z.string()) });

const toImportOrganization = ({ id, name, customData }: Organization): ImportOrganization => {
  const parsed = roleTitlesGuard.safeParse(customData);
  return parsed.success ? { id, name, roleTitles: parsed.data.roleTitles } : { id, name };
};

/** `custom_data.externalIds`, chỉ giữ giá trị chuỗi. */
export const externalIdsOf = (customData: unknown): Record<string, string> => {
  const parsed = externalIdsGuard.safeParse(customData);
  return parsed.success
    ? Object.fromEntries(
        Object.entries(parsed.data.externalIds).flatMap(([key, value]) =>
          typeof value === 'string' && value ? [[key, value]] : []
        )
      )
    : {};
};

/** Người dùng IAM kèm email, số điện thoại để tra trùng. */
type IndexedUser = ImportUser & { email?: string; phone?: string };

/** Các chỉ mục người dùng của `ImportLookup` cho hệ nguồn `sourceKey`. */
export const userIndexesOf = (users: readonly IndexedUser[], sourceKey: string) => ({
  users: new Map(users.map(({ email, phone, ...user }) => [user.id, user])),
  userIdsBySourceId: groupIds(users.map(({ id, externalIds }) => [externalIds[sourceKey], id])),
  userIdsByUsername: groupIds(users.map(({ id, username }) => [username.toLowerCase(), id])),
  userIdsByEmail: groupIds(users.map(({ id, email }) => [email?.toLowerCase(), id])),
  userIdsByPhone: groupIds(users.map(({ id, phone }) => [phone, id])),
});

/** Trạng thái Logto cho bước Soát, và mọi tổ chức (sắp theo tên) để người duyệt chọn tay. */
export const loadImportData = async (
  api: KyInstance,
  source: ImportSource
): Promise<{ lookup: ImportLookup; organizations: ImportOrganization[] }> => {
  const [users, organizations, roles, syncPreview] = await Promise.all([
    fetchAll<UserProfileResponse>(api, 'api/users'),
    fetchAll<Organization>(api, 'api/organizations'),
    fetchAll<OrganizationRole>(api, 'api/organization-roles'),
    api.get('api/iam-sync-preview/users').json<{ data: Array<{ id: string }> }>(),
  ]);
  const inSync = new Set(syncPreview.data.map(({ id }) => id));
  const indexedUsers = users.map(
    (user): IndexedUser => ({
      id: user.id,
      name: user.name ?? '',
      username: user.username ?? '',
      externalIds: externalIdsOf(user.customData),
      isInSync: inSync.has(user.id),
      ...(user.primaryEmail ? { email: user.primaryEmail } : {}),
      ...(user.primaryPhone ? { phone: user.primaryPhone } : {}),
    })
  );

  const unitEntries = organizations.flatMap((organization): Array<[string, ImportOrganization]> => {
    const key = unitKeyOf(organization.customData);
    return key ? [[key, toImportOrganization(organization)]] : [];
  });
  const unitCount = countKeys(unitEntries.map(([key]) => key));

  const roleIds = new Set(roles.map(({ id }) => id));

  const lookup: ImportLookup = {
    source,
    ...userIndexesOf(indexedUsers, source.key),
    organizationByUnit: new Map(unitEntries),
    ambiguousUnits: new Set([...unitCount].filter(([, count]) => count > 1).map(([key]) => key)),
    roleIdByCode: new Map(
      Object.entries(roleIdByCodeConvention).filter(([, roleId]) => roleIds.has(roleId))
    ),
  };

  return {
    lookup,
    organizations: organizations
      .map((organization) => toImportOrganization(organization))
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name, 'vi')),
  };
};
