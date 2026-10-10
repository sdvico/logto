/**
 * SDVICO: phần tính toán của trang "Đồng bộ IAM" — tóm tắt, lọc, và diễn giải từng người như IAM Sync
 * API trả. Hàm thuần; danh sách hệ lấy từ Hệ tích hợp cộng các khoá thấy trong `external_ids`.
 */
import { type Nullable } from '@silverhand/essentials';

type SyncOrganization = {
  id: string;
  name: string;
  type?: string;
  parentOrgId?: string;
  roleTitles?: Record<string, string>;
};

export type SyncUser = {
  id: string;
  username: Nullable<string>;
  name: Nullable<string>;
  status: 'active' | 'suspended';
  organizations: SyncOrganization[];
  roles: Array<{ code: string; name: string; organizationId?: string }>;
  scopes: Array<{ type: string; id: string }>;
  external_ids?: Record<string, string>;
  updated_at: string;
};

/** Hệ để hiển thị: khoá trong `external_ids` và tên. */
export type SyncSystem = { key: string; label: string };

/** Tổ chức trong cây (để tra tên cấp trên và tỉnh). */
export type TreeOrganization = { id: string; name: string; type?: string; parentOrgId?: string };

/** Mỗi đơn vị của một người: tên, loại, chức danh, vị trí trong cây. */
type UserUnit = {
  id: string;
  name: string;
  type?: string;
  title: string;
  place: string;
};

/** Các hệ đã khai báo, cộng khoá lạ thấy trong dữ liệu (hiện bằng chính khoá). */
export const systemsOf = (registered: readonly SyncSystem[], users: readonly SyncUser[]) => {
  const known = new Set(registered.map(({ key }) => key));
  const extra = [
    ...new Set(users.flatMap(({ external_ids }) => Object.keys(external_ids ?? {}))),
  ].filter((key) => !known.has(key));

  return [...registered, ...extra.map((key) => ({ key, label: key }))];
};

export const summarize = (users: readonly SyncUser[], systems: readonly SyncSystem[]) => ({
  total: users.length,
  linked: systems.map(({ key, label }) => ({
    key,
    label,
    count: users.filter(({ external_ids }) => Boolean(external_ids?.[key])).length,
  })),
  suspended: users.filter(({ status }) => status === 'suspended').length,
  untypedUnits: new Set(
    users.flatMap(({ organizations }) =>
      organizations.filter(({ type }) => !type).map(({ id }) => id)
    )
  ).size,
});

/** Lọc "hệ đã nối": tất cả, một khoá hệ, hoặc chưa nối hệ nào. */
export const noSystem = '__none__';
/** Lọc "loại đơn vị": thiếu loại. */
export const untypedUnit = '__untyped__';

export type SyncFilter = {
  search: string;
  system: string;
  unitType: string;
  status: '' | 'active' | 'suspended';
};

export const emptyFilter: SyncFilter = Object.freeze({
  search: '',
  system: '',
  unitType: '',
  status: '',
});

const matchesSystem = (user: SyncUser, system: string) => {
  const keys = Object.keys(user.external_ids ?? {});
  if (!system) {
    return true;
  }
  return system === noSystem ? keys.length === 0 : keys.includes(system);
};

const matchesUnitType = ({ organizations }: SyncUser, unitType: string) =>
  !unitType ||
  organizations.some(({ type }) => (unitType === untypedUnit ? !type : type === unitType));

const matchesSearch = ({ name, username }: SyncUser, search: string) => {
  const needle = search.trim().toLowerCase();
  return (
    !needle || [name, username].some((value) => value?.toLowerCase().includes(needle) ?? false)
  );
};

export const filterUsers = (users: readonly SyncUser[], filter: SyncFilter) =>
  users.filter(
    (user) =>
      matchesSearch(user, filter.search) &&
      matchesSystem(user, filter.system) &&
      matchesUnitType(user, filter.unitType) &&
      (!filter.status || user.status === filter.status)
  );

/** Các loại đơn vị đang có trong dữ liệu, theo thứ tự xuất hiện. */
export const unitTypesOf = (users: readonly SyncUser[]) => [
  ...new Set(
    users.flatMap(({ organizations }) => organizations.flatMap(({ type }) => (type ? [type] : [])))
  ),
];

/** "Cấp trên · Tỉnh" theo cây tổ chức; không có trong cây thì báo tổ chức cũ. */
const placeOf = (
  organization: SyncOrganization,
  tree: ReadonlyMap<string, TreeOrganization>
): string => {
  if (!organization.type) {
    return 'tổ chức cũ, chưa có trong cây mới';
  }
  const parent = organization.parentOrgId ? tree.get(organization.parentOrgId) : undefined;
  const province =
    parent?.type === 'TINH'
      ? parent
      : parent?.parentOrgId
        ? tree.get(parent.parentOrgId)
        : undefined;
  const names = [parent?.name, province?.type === 'TINH' ? province.name : undefined].filter(
    Boolean
  );
  return [...new Set(names)].join(' · ');
};

/** Đơn vị và chức danh của một người; chức danh lấy tên theo đơn vị (`roleTitles`) nếu có. */
export const unitsOf = (user: SyncUser, tree: ReadonlyMap<string, TreeOrganization>): UserUnit[] =>
  user.organizations.map((organization) => {
    const titles = user.roles
      .filter(({ organizationId }) => organizationId === organization.id)
      .map(({ code, name }) => organization.roleTitles?.[code] ?? name);
    return {
      id: organization.id,
      name: organization.name,
      ...(organization.type ? { type: organization.type } : {}),
      title: titles.join(', '),
      place: placeOf(organization, tree),
    };
  });
