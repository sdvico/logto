import { pickDefault, createMockUtils } from '@logto/shared/esm';

import { type IamAdminUserRow } from '#src/queries/iam-admin.js';
import { MockTenant } from '#src/test-utils/tenant.js';

const { jest } = import.meta;
const { mockEsmWithActual } = createMockUtils(jest);

const { verifyBearerTokenFromRequest } = await mockEsmWithActual(
  '#src/middleware/koa-auth/index.js',
  () => ({
    verifyBearerTokenFromRequest: jest.fn(),
  })
);

const appId = 'vmsalert-api';

const nationwideOrganization = {
  id: 'toan-quoc',
  name: 'Cục Thuỷ sản và Kiểm ngư',
  customData: { level: 'trung_uong' },
};

const borderPostOrganization = {
  id: 'bp-qn-cr',
  name: 'Đồn BP Cái Rồng',
  customData: {
    level: 'co_so',
    type: 'DON_BP',
    parentOrgId: 'toan-quoc',
    provinceCode: '22',
    sourceCode: 'TKSCR',
    roleTitles: { TRUONG: 'Đồn trưởng' },
  },
};

const userRow: IamAdminUserRow = {
  id: 'u-an',
  username: 'an.nv',
  name: 'Nguyễn Văn An',
  primaryEmail: 'an.nv@example.gov.vn',
  primaryPhone: '0912345678',
  isSuspended: false,
  hasPassword: true,
  customData: { externalIds: { mkn: '1042' } },
  lastSignInAt: Date.UTC(2026, 9, 12, 1, 42),
  passwordUpdatedAt: null,
  createdAt: Date.UTC(2025, 2, 14),
  updatedAt: Date.UTC(2026, 9, 11),
};

const suspendedRow: IamAdminUserRow = {
  ...userRow,
  id: 'u-khanh',
  username: 'khanh.vd',
  name: 'Vũ Đức Khánh',
  primaryEmail: null,
  primaryPhone: null,
  isSuspended: true,
  customData: {},
  lastSignInAt: null,
};

const getOrganizationsByApplicationId = jest.fn();
const iamAdmin = {
  findAllUsers: jest.fn(async () => [userRow, suspendedRow]),
  findUserById: jest.fn(async (id: string) => (id === userRow.id ? userRow : null)),
  findMemberships: jest.fn(async () => [{ organizationId: 'bp-qn-cr', userId: 'u-an' }]),
  findRoleAssignments: jest.fn(async () => [
    { organizationId: 'bp-qn-cr', userId: 'u-an', roleId: 'role-truong', roleName: 'Trưởng' },
  ]),
  findLastSignInApplications: jest.fn(async (userIds: readonly string[]) =>
    userIds.includes('u-an')
      ? [{ userId: 'u-an', applicationId: 'vmsalert-web', applicationName: 'VMS Alert' }]
      : []
  ),
};

const tenantContext = new MockTenant(undefined, {
  iamAdmin,
  organizations: {
    findAll: jest.fn(async () => [2, [nationwideOrganization, borderPostOrganization]]),
    roles: {
      findAll: jest.fn(async () => [
        2,
        [
          { id: 'role-truong', name: 'Trưởng' },
          { id: 'role-cv', name: 'Chuyên viên' },
        ],
      ]),
    },
    relations: {
      apps: { getOrganizationsByApplicationId },
    },
  } as unknown as MockTenant['queries']['organizations'],
});

const { createRequester } = await import('#src/utils/test-utils.js');
const request = createRequester({
  anonymousRoutes: await pickDefault(import('#src/routes/iam-admin/index.js')),
  tenantContext,
});

const mockToken = (scopes = ['iam-admin:users:read']) => {
  verifyBearerTokenFromRequest.mockResolvedValue({ sub: appId, clientId: appId, scopes });
};

describe('IAM Admin API, read endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getOrganizationsByApplicationId.mockResolvedValue([1, [nationwideOrganization]]);
    mockToken();
  });

  describe('auth', () => {
    it('rejects a user token', async () => {
      verifyBearerTokenFromRequest.mockResolvedValue({
        sub: 'u-an',
        clientId: 'vmsalert-web',
        scopes: ['iam-admin:users:read'],
      });
      const response = await request.get('/iam-admin/v1/users');
      expect(response.status).toBe(403);
    });

    it('rejects a token without the users:read scope', async () => {
      mockToken(['iam-sync:read']);
      const response = await request.get('/iam-admin/v1/users');
      expect(response.status).toBe(403);
    });

    it('rejects an app outside the nationwide organization', async () => {
      getOrganizationsByApplicationId.mockResolvedValue([1, [borderPostOrganization]]);
      const response = await request.get('/iam-admin/v1/users');
      expect(response.status).toBe(403);
    });

    it('checks the token against the iam-admin resource', async () => {
      await request.get('/iam-admin/v1/users');
      expect(verifyBearerTokenFromRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.stringMatching(/\/iam-admin$/)
      );
    });
  });

  it('GET /users returns organizations, role titles and the last sign-in application', async () => {
    const response = await request.get('/iam-admin/v1/users');

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(2);
    expect(response.body.data[0]).toEqual({
      id: 'u-an',
      username: 'an.nv',
      name: 'Nguyễn Văn An',
      email: 'an.nv@example.gov.vn',
      phone: '0912345678',
      status: 'active',
      organizations: [
        {
          id: 'bp-qn-cr',
          name: 'Đồn BP Cái Rồng',
          type: 'DON_BP',
          roles: [{ code: 'TRUONG', title: 'Đồn trưởng' }],
        },
      ],
      lastSignInAt: '2026-10-12T01:42:00.000Z',
      lastSignInApplication: { id: 'vmsalert-web', name: 'VMS Alert' },
    });
    expect(response.body.data[1]).toMatchObject({ id: 'u-khanh', lastSignInApplication: null });
    expect(iamAdmin.findLastSignInApplications).toHaveBeenCalledWith(['u-an', 'u-khanh']);
  });

  it('GET /users rejects an out-of-range page size', async () => {
    const response = await request.get('/iam-admin/v1/users').query({ pageSize: 101 });
    expect(response.status).toBe(400);
  });

  it('GET /user-stats counts users and organizations', async () => {
    const response = await request.get('/iam-admin/v1/user-stats');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      total: 2,
      active: 1,
      suspended: 1,
      noOrganization: 1,
      organizations: 2,
    });
  });

  it('GET /users/:id returns the detail with path and external ids', async () => {
    const response = await request.get('/iam-admin/v1/users/u-an');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 'u-an',
      hasPassword: true,
      passwordUpdatedAt: null,
      createdAt: '2025-03-14T00:00:00.000Z',
      externalIds: { mkn: '1042' },
      lastSignInApplication: { id: 'vmsalert-web', name: 'VMS Alert' },
      organizations: [
        {
          id: 'bp-qn-cr',
          path: ['Cục Thuỷ sản và Kiểm ngư'],
          provinceCode: '22',
          sourceCode: 'TKSCR',
          roles: [{ code: 'TRUONG', title: 'Đồn trưởng' }],
        },
      ],
    });
  });

  it('GET /users/:id returns 404 for an unknown user', async () => {
    const response = await request.get('/iam-admin/v1/users/khong-co');
    expect(response.status).toBe(404);
  });

  it('GET /organizations returns every organization with its member count', async () => {
    const response = await request.get('/iam-admin/v1/organizations');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([
      {
        id: 'toan-quoc',
        name: 'Cục Thuỷ sản và Kiểm ngư',
        type: null,
        level: 'trung_uong',
        parentOrgId: null,
        provinceCode: null,
        sourceCode: null,
        roleTitles: {},
        memberCount: 0,
      },
      {
        id: 'bp-qn-cr',
        name: 'Đồn BP Cái Rồng',
        type: 'DON_BP',
        level: 'co_so',
        parentOrgId: 'toan-quoc',
        provinceCode: '22',
        sourceCode: 'TKSCR',
        roleTitles: { TRUONG: 'Đồn trưởng' },
        memberCount: 1,
      },
    ]);
  });

  it('GET /organization-roles returns role codes', async () => {
    const response = await request.get('/iam-admin/v1/organization-roles');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([
      { code: 'TRUONG', name: 'Trưởng' },
      { code: 'CHUYEN_VIEN', name: 'Chuyên viên' },
    ]);
  });
});
