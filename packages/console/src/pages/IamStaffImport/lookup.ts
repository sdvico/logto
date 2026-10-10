/**
 * SDVICO: nạp trạng thái Logto mà bước Soát cần, qua Management API có sẵn: mọi người dùng (để biết
 * tên, email, số điện thoại đã dùng và ai đã nhập), mọi tổ chức (tra theo đơn vị), vai trò tổ chức.
 */
import { type Organization, type OrganizationRole, type UserProfileResponse } from '@logto/schemas';
import { type KyInstance } from 'ky';
import { z } from 'zod';

import { type ImportLookup, type ImportOrganization, unitKeyOf } from './staff-rows';

/** Giới hạn `page_size` của Management API. */
const pageSize = 100;

/** Mã chức danh → id vai trò tổ chức, đúng `KNOWN_ROLE_CODES` của IAM Sync API (seed-organization-roles.sql). */
const roleIdByCodeConvention: Readonly<Record<string, string>> = Object.freeze({
  TRUONG: 'role-truong',
  PHO: 'role-pho',
  CHUYEN_VIEN: 'role-cv',
});

const fetchAll = async <T>(api: KyInstance, path: string): Promise<T[]> => {
  const fetchFrom = async (page: number): Promise<T[]> => {
    const items = await api.get(path, { searchParams: { page, page_size: pageSize } }).json<T[]>();
    return items.length < pageSize ? items : [...items, ...(await fetchFrom(page + 1))];
  };

  return fetchFrom(1);
};

const externalIdsGuard = z.object({ externalIds: z.object({ mkn: z.string() }) });

const roleTitlesGuard = z.object({ roleTitles: z.record(z.string()) });

const toImportOrganization = ({ id, name, customData }: Organization): ImportOrganization => {
  const parsed = roleTitlesGuard.safeParse(customData);
  return parsed.success ? { id, name, roleTitles: parsed.data.roleTitles } : { id, name };
};

const mknIdOf = (customData: unknown): string | undefined => {
  const parsed = externalIdsGuard.safeParse(customData);
  return parsed.success ? parsed.data.externalIds.mkn : undefined;
};

/** Trạng thái Logto cho bước Soát, và mọi tổ chức (sắp theo tên) để người duyệt chọn tay. */
export const loadImportData = async (
  api: KyInstance
): Promise<{ lookup: ImportLookup; organizations: ImportOrganization[] }> => {
  const [users, organizations, roles] = await Promise.all([
    fetchAll<UserProfileResponse>(api, 'api/users'),
    fetchAll<Organization>(api, 'api/organizations'),
    fetchAll<OrganizationRole>(api, 'api/organization-roles'),
  ]);

  const unitEntries = organizations.flatMap((organization): Array<[string, ImportOrganization]> => {
    const key = unitKeyOf(organization.customData);
    return key ? [[key, toImportOrganization(organization)]] : [];
  });
  const unitCount = unitEntries.reduce(
    (count, [key]) => new Map(count).set(key, (count.get(key) ?? 0) + 1),
    new Map<string, number>()
  );

  const roleIds = new Set(roles.map(({ id }) => id));

  const lookup: ImportLookup = {
    userIdByMknId: new Map(
      users.flatMap((user): Array<[string, string]> => {
        const mknId = mknIdOf(user.customData);
        return mknId ? [[mknId, user.id]] : [];
      })
    ),
    usernames: new Set(users.flatMap(({ username }) => (username ? [username.toLowerCase()] : []))),
    emails: new Set(
      users.flatMap(({ primaryEmail }) => (primaryEmail ? [primaryEmail.toLowerCase()] : []))
    ),
    phones: new Set(users.flatMap(({ primaryPhone }) => (primaryPhone ? [primaryPhone] : []))),
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
