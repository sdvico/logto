import { pickDefault, createMockUtils } from '@logto/shared/esm';

import RequestError from '#src/errors/RequestError/index.js';
import { MockTenant } from '#src/test-utils/tenant.js';

const { jest } = import.meta;
const { mockEsmWithActual } = createMockUtils(jest);

const { verifyBearerTokenFromRequest } = await mockEsmWithActual(
  '#src/middleware/koa-auth/index.js',
  () => ({
    verifyBearerTokenFromRequest: jest.fn(),
  })
);

const appId = 'app-mkn-sync';

const nationwideOrganization = {
  id: 'toan-quoc',
  name: 'Toàn quốc',
  customData: { level: 'trung_uong', type: 'ROOT' },
};

const borderPostOrganization = {
  id: 'bp-qn-cr',
  name: 'Trạm KSBP Cái Rồng',
  customData: {
    level: 'co_so',
    type: 'DON_BP',
    parentOrgId: 'bdbp-qn',
    provinceCode: '22',
    sourceCode: 'TKSCR',
    roleTitles: { TRUONG: 'Đồn trưởng', PHO: 'Phó Đồn trưởng', CHUYEN_VIEN: 'Cán bộ' },
  },
};

const bareOrganization = { id: 'org-cu', name: 'Tổ chức cũ', customData: {} };

const createUser = (
  id: string,
  organizationRoles: Array<{ id: string; name: string }>,
  customData: Record<string, unknown> = {}
) => ({
  id,
  username: id,
  name: `Người dùng ${id}`,
  isSuspended: false,
  customData,
  updatedAt: 0,
  organizationRoles,
});

const getOrganizationsByApplicationId = jest.fn();
const findAll = jest.fn();
const getUsersByOrganizationId = jest.fn();

const tenantContext = new MockTenant(undefined, {
  organizations: {
    findAll,
    relations: {
      apps: { getOrganizationsByApplicationId },
      users: { getUsersByOrganizationId },
    } as unknown as MockTenant['queries']['organizations']['relations'],
  },
});

const { createRequester } = await import('#src/utils/test-utils.js');
const request = createRequester({
  anonymousRoutes: await pickDefault(import('#src/routes/iam-sync.js')),
  tenantContext,
});

const mockValidToken = (scopes = ['iam-sync:read']) => {
  verifyBearerTokenFromRequest.mockResolvedValue({ sub: appId, clientId: appId, scopes });
};

/** Mỗi tổ chức trả về đúng danh sách người dùng cho sẵn, như truy vấn thật theo `organizationId`. */
const mockUsersByOrganization = (usersByOrganization: Record<string, unknown[]>) => {
  getUsersByOrganizationId.mockImplementation(async (organizationId: string) => {
    const users = usersByOrganization[organizationId] ?? [];
    return [users.length, users];
  });
};

describe('GET /iam-sync/v1/users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when the bearer token is missing or has the wrong audience', async () => {
    verifyBearerTokenFromRequest.mockRejectedValue(
      new RequestError({ code: 'auth.unauthorized', status: 401 })
    );

    const response = await request.get('/iam-sync/v1/users');

    expect(response.status).toEqual(401);
  });

  it('returns 403 when the token lacks the iam-sync:read scope', async () => {
    mockValidToken([]);

    const response = await request.get('/iam-sync/v1/users');

    expect(response.status).toEqual(403);
    expect(getOrganizationsByApplicationId).not.toHaveBeenCalled();
  });

  it('returns 403 when the M2M app is not a member of any organization', async () => {
    mockValidToken();
    getOrganizationsByApplicationId.mockResolvedValue([0, []]);

    const response = await request.get('/iam-sync/v1/users');

    expect(response.status).toEqual(403);
  });

  it('returns users of every organization for a nationwide app', async () => {
    mockValidToken();
    getOrganizationsByApplicationId.mockResolvedValue([1, [nationwideOrganization]]);
    findAll.mockResolvedValue([2, [borderPostOrganization, bareOrganization]]);
    mockUsersByOrganization({
      [borderPostOrganization.id]: [createUser('u-1', [])],
      [bareOrganization.id]: [createUser('u-2', [])],
    });

    const response = await request.get('/iam-sync/v1/users');

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ data: [{ id: 'u-1' }, { id: 'u-2' }] });
    expect(response.body.data).toHaveLength(2);
  });

  it('returns organization details from custom_data', async () => {
    mockValidToken();
    getOrganizationsByApplicationId.mockResolvedValue([1, [nationwideOrganization]]);
    findAll.mockResolvedValue([1, [borderPostOrganization]]);
    mockUsersByOrganization({ [borderPostOrganization.id]: [createUser('u-1', [])] });

    const response = await request.get('/iam-sync/v1/users');

    expect(response.body.data[0].organizations).toEqual([
      {
        id: 'bp-qn-cr',
        name: 'Trạm KSBP Cái Rồng',
        level: 'co_so',
        type: 'DON_BP',
        parentOrgId: 'bdbp-qn',
        provinceCode: '22',
        sourceCode: 'TKSCR',
        roleTitles: { TRUONG: 'Đồn trưởng', PHO: 'Phó Đồn trưởng', CHUYEN_VIEN: 'Cán bộ' },
      },
    ]);
  });

  it('returns only id and name for an organization without custom_data', async () => {
    mockValidToken();
    getOrganizationsByApplicationId.mockResolvedValue([1, [nationwideOrganization]]);
    findAll.mockResolvedValue([1, [bareOrganization]]);
    mockUsersByOrganization({ [bareOrganization.id]: [createUser('u-1', [])] });

    const response = await request.get('/iam-sync/v1/users');

    expect(response.status).toEqual(200);
    expect(response.body.data[0].organizations).toStrictEqual([
      { id: 'org-cu', name: 'Tổ chức cũ' },
    ]);
    expect(response.body.data[0]).not.toHaveProperty('external_ids');
  });

  it('keeps one role entry per organization for a user holding the same role in two units', async () => {
    mockValidToken();
    getOrganizationsByApplicationId.mockResolvedValue([1, [nationwideOrganization]]);
    findAll.mockResolvedValue([2, [borderPostOrganization, bareOrganization]]);
    const headRole = { id: 'role-truong', name: 'Trưởng' };
    mockUsersByOrganization({
      [borderPostOrganization.id]: [createUser('u-1', [headRole])],
      [bareOrganization.id]: [createUser('u-1', [headRole])],
    });

    const response = await request.get('/iam-sync/v1/users');

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].roles).toEqual([
      { code: 'TRUONG', name: 'Trưởng', organizationId: 'bp-qn-cr' },
      { code: 'TRUONG', name: 'Trưởng', organizationId: 'org-cu' },
    ]);
  });

  it('flattens dataScope and skips only the keys that are not string arrays', async () => {
    mockValidToken();
    getOrganizationsByApplicationId.mockResolvedValue([1, [nationwideOrganization]]);
    findAll.mockResolvedValue([1, [bareOrganization]]);
    mockUsersByOrganization({
      [bareOrganization.id]: [
        createUser('u-1', [], { dataScope: { port: ['TKSCR'], province: '22', ward: [1] } }),
      ],
    });

    const response = await request.get('/iam-sync/v1/users');

    expect(response.body.data[0].scopes).toStrictEqual([{ type: 'port', id: 'TKSCR' }]);
  });

  it('returns external_ids from users.custom_data.externalIds', async () => {
    mockValidToken();
    getOrganizationsByApplicationId.mockResolvedValue([1, [nationwideOrganization]]);
    findAll.mockResolvedValue([1, [bareOrganization]]);
    mockUsersByOrganization({
      [bareOrganization.id]: [createUser('u-1', [], { externalIds: { mkn: 'x', invalid: 1 } })],
    });

    const response = await request.get('/iam-sync/v1/users');

    expect(response.body.data[0].external_ids).toStrictEqual({ mkn: 'x' });
  });
});
