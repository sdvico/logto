import {
  emptyFilter,
  filterUsers,
  noSystem,
  summarize,
  type SyncUser,
  systemsOf,
  type TreeOrganization,
  unitsOf,
  unitTypesOf,
  untypedUnit,
} from './sync-users';

const userOf = (overrides: Partial<SyncUser>): SyncUser => ({
  id: 'u',
  username: 'u',
  name: 'U',
  status: 'active',
  organizations: [],
  roles: [],
  scopes: [],
  updated_at: '2026-10-10T08:00:00.000Z',
  ...overrides,
});

const port = { id: 'cang-qn-cr', name: 'Cái Rồng', type: 'CANG', parentOrgId: 'bqlc-qn' };
const users: SyncUser[] = [
  userOf({
    id: 'a',
    username: 'cang',
    name: 'Nguyễn Văn An',
    organizations: [
      { ...port, roleTitles: { CHUYEN_VIEN: 'Nhân viên' } },
      {
        id: 'ccts-qn',
        name: 'Chi cục Thủy sản Quảng Ninh',
        type: 'CHI_CUC',
        parentOrgId: 'tinh-qn',
      },
    ],
    roles: [
      { code: 'CHUYEN_VIEN', name: 'Chuyên viên', organizationId: 'cang-qn-cr' },
      { code: 'PHO', name: 'Phó', organizationId: 'ccts-qn' },
    ],
    external_ids: { mkn: 'm-1', cbvms: 'c-1' },
  }),
  userOf({ id: 'b', username: 'khoa', status: 'suspended', external_ids: { mkn: 'm-2' } }),
  userOf({ id: 'c', username: 'testu1', organizations: [{ id: 'old', name: 'Tổ chức cũ' }] }),
];

const tree = new Map<string, TreeOrganization>([
  ['tinh-qn', { id: 'tinh-qn', name: 'Quảng Ninh', type: 'TINH', parentOrgId: 'toan-quoc' }],
  [
    'bqlc-qn',
    { id: 'bqlc-qn', name: 'BQL cảng cá Quảng Ninh', type: 'BQL_CANG', parentOrgId: 'tinh-qn' },
  ],
]);

describe('systemsOf and summarize', () => {
  it('adds keys seen in the data to the registered systems and counts per system', () => {
    const systems = systemsOf(
      [
        { key: 'mkn', label: 'MKN' },
        { key: 'iuu', label: 'IUU' },
      ],
      users
    );

    expect(systems).toEqual([
      { key: 'mkn', label: 'MKN' },
      { key: 'iuu', label: 'IUU' },
      { key: 'cbvms', label: 'cbvms' },
    ]);
    expect(summarize(users, systems)).toEqual({
      total: 3,
      linked: [
        { key: 'mkn', label: 'MKN', count: 2 },
        { key: 'iuu', label: 'IUU', count: 0 },
        { key: 'cbvms', label: 'cbvms', count: 1 },
      ],
      suspended: 1,
      untypedUnits: 1,
    });
  });
});

/** Id người còn lại sau khi lọc. */
const ids = (filter: Partial<typeof emptyFilter>) =>
  filterUsers(users, { ...emptyFilter, ...filter }).map(({ id }) => id);

describe('filterUsers', () => {
  it('filters by search, system, unit type and status', () => {
    expect(ids({})).toEqual(['a', 'b', 'c']);
    expect(ids({ search: 'văn an' })).toEqual(['a']);
    expect(ids({ system: 'cbvms' })).toEqual(['a']);
    expect(ids({ system: noSystem })).toEqual(['c']);
    expect(ids({ unitType: 'CHI_CUC' })).toEqual(['a']);
    expect(ids({ unitType: untypedUnit })).toEqual(['c']);
    expect(ids({ status: 'suspended' })).toEqual(['b']);
  });

  it('lists unit types present in the data', () => {
    expect(unitTypesOf(users)).toEqual(['CANG', 'CHI_CUC']);
  });
});

describe('unitsOf', () => {
  it('uses the per-unit role title and places the unit in the tree', () => {
    expect(unitsOf(users[0]!, tree)).toEqual([
      {
        id: 'cang-qn-cr',
        name: 'Cái Rồng',
        type: 'CANG',
        title: 'Nhân viên',
        place: 'BQL cảng cá Quảng Ninh · Quảng Ninh',
      },
      {
        id: 'ccts-qn',
        name: 'Chi cục Thủy sản Quảng Ninh',
        type: 'CHI_CUC',
        title: 'Phó',
        place: 'Quảng Ninh',
      },
    ]);
  });

  it('marks an organization outside the new tree', () => {
    expect(unitsOf(users[2]!, tree)[0]?.place).toBe('tổ chức cũ, chưa có trong cây mới');
  });
});
