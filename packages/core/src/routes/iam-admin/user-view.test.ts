import { type IamAdminUserRow } from '#src/queries/iam-admin.js';

import {
  type OrganizationRecord,
  countUsers,
  getOrganizationPath,
  groupOrganizationsByUser,
  selectUserPage,
  toUserSummary,
  userListQueryGuard,
} from './user-view.js';

const organizations: OrganizationRecord[] = [
  { id: 'toan-quoc', name: 'Cục Thuỷ sản và Kiểm ngư', customData: { level: 'trung_uong' } },
  {
    id: 'bdbp-qn',
    name: 'BĐBP Quảng Ninh',
    customData: { type: 'BDBP', parentOrgId: 'toan-quoc' },
  },
  {
    id: 'bp-qn-cr',
    name: 'Đồn BP Cái Rồng',
    customData: {
      type: 'DON_BP',
      parentOrgId: 'bdbp-qn',
      roleTitles: { TRUONG: 'Đồn trưởng' },
    },
  },
];
const organizationsById = new Map(
  organizations.map((organization) => [organization.id, organization])
);

const createUserRow = (id: string, overrides: Partial<IamAdminUserRow> = {}): IamAdminUserRow => ({
  id,
  username: id,
  name: null,
  primaryEmail: null,
  primaryPhone: null,
  isSuspended: false,
  hasPassword: true,
  customData: {},
  lastSignInAt: null,
  passwordUpdatedAt: null,
  createdAt: 0,
  updatedAt: 0,
  ...overrides,
});

describe('getOrganizationPath', () => {
  it('returns parent names from the root down, without the organization itself', () => {
    expect(getOrganizationPath('bp-qn-cr', organizationsById)).toEqual([
      'Cục Thuỷ sản và Kiểm ngư',
      'BĐBP Quảng Ninh',
    ]);
  });

  it('stops when parentOrgId points in a loop', () => {
    const looped = new Map<string, OrganizationRecord>([
      ['a', { id: 'a', name: 'A', customData: { parentOrgId: 'b' } }],
      ['b', { id: 'b', name: 'B', customData: { parentOrgId: 'a' } }],
    ]);

    expect(getOrganizationPath('a', looped)).toEqual(['B']);
  });
});

describe('groupOrganizationsByUser', () => {
  it('uses the organization role title and keeps one entry per organization', () => {
    const grouped = groupOrganizationsByUser(
      [
        { organizationId: 'bp-qn-cr', userId: 'u1' },
        { organizationId: 'bdbp-qn', userId: 'u1' },
        { organizationId: 'org-da-xoa', userId: 'u1' },
      ],
      [
        { organizationId: 'bp-qn-cr', userId: 'u1', roleId: 'role-truong', roleName: 'Trưởng' },
        { organizationId: 'bdbp-qn', userId: 'u1', roleId: 'role-cv', roleName: 'Chuyên viên' },
      ],
      organizationsById
    );

    expect(grouped.get('u1')).toEqual([
      {
        id: 'bp-qn-cr',
        name: 'Đồn BP Cái Rồng',
        type: 'DON_BP',
        roles: [{ code: 'TRUONG', title: 'Đồn trưởng' }],
      },
      {
        id: 'bdbp-qn',
        name: 'BĐBP Quảng Ninh',
        type: 'BDBP',
        roles: [{ code: 'CHUYEN_VIEN', title: 'Chuyên viên' }],
      },
    ]);
  });
});

describe('selectUserPage', () => {
  const truong = { code: 'TRUONG', title: 'Đồn trưởng' };
  const chuyenVien = { code: 'CHUYEN_VIEN', title: 'Chuyên viên' };
  const users = [
    {
      summary: toUserSummary(
        createUserRow('an', {
          name: 'Nguyễn Văn An',
          primaryPhone: '0912345678',
          lastSignInAt: 2000,
        }),
        [{ id: 'bp-qn-cr', name: 'Đồn BP Cái Rồng', type: 'DON_BP', roles: [truong] }]
      ),
      createdAt: 10,
    },
    {
      summary: toUserSummary(
        createUserRow('binh', { name: 'Trần Thị Bình', isSuspended: true, lastSignInAt: 3000 }),
        [{ id: 'bdbp-qn', name: 'BĐBP Quảng Ninh', type: 'BDBP', roles: [chuyenVien] }]
      ),
      createdAt: 30,
    },
    {
      summary: toUserSummary(createUserRow('chau', { name: 'Lê Minh Châu' }), []),
      createdAt: 20,
    },
  ];
  const select = (query: Record<string, string>) =>
    selectUserPage(users, userListQueryGuard.parse(query));
  const ids = (page: ReturnType<typeof select>) => page.data.map(({ id }) => id);

  it('sorts by last sign-in, newest first, with never-signed-in users last', () => {
    expect(ids(select({}))).toEqual(['binh', 'an', 'chau']);
  });

  it('sorts by name and by creation time', () => {
    expect(ids(select({ sort: 'name' }))).toEqual(['chau', 'an', 'binh']);
    expect(ids(select({ sort: 'createdAt' }))).toEqual(['binh', 'chau', 'an']);
  });

  it('searches names without case and phone numbers by digits', () => {
    expect(ids(select({ search: 'nguyễn' }))).toEqual(['an']);
    expect(ids(select({ search: '0912 345' }))).toEqual(['an']);
  });

  it('filters by status, including users without an organization', () => {
    expect(ids(select({ status: 'suspended' }))).toEqual(['binh']);
    expect(ids(select({ status: 'active' }))).toEqual(['an', 'chau']);
    expect(ids(select({ status: 'no-organization' }))).toEqual(['chau']);
  });

  it('matches the role inside the selected organization only', () => {
    expect(ids(select({ roleCode: 'TRUONG' }))).toEqual(['an']);
    expect(ids(select({ organizationId: 'bdbp-qn', roleCode: 'TRUONG' }))).toEqual([]);
  });

  it('pages after filtering and reports the matched total', () => {
    const page = select({ page: '2', pageSize: '2' });

    expect(ids(page)).toEqual(['chau']);
    expect(page.total).toBe(3);
  });
});

describe('countUsers', () => {
  it('counts active, suspended and users without an organization', () => {
    const summaries = [
      toUserSummary(createUserRow('a'), []),
      toUserSummary(createUserRow('b', { isSuspended: true }), [
        { id: 'x', name: 'X', type: null, roles: [] },
      ]),
    ];

    expect(countUsers(summaries, 435)).toEqual({
      total: 2,
      active: 1,
      suspended: 1,
      noOrganization: 1,
      organizations: 435,
    });
  });
});
