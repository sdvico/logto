import { pickDefault, createMockUtils } from '@logto/shared/esm';

import { type IamAdminUserRow } from '#src/queries/iam-admin.js';
import { MockTenant } from '#src/test-utils/tenant.js';

const { jest } = import.meta;
const { mockEsmWithActual } = createMockUtils(jest);

const { verifyBearerTokenFromRequest } = await mockEsmWithActual(
  '#src/middleware/koa-auth/index.js',
  () => ({ verifyBearerTokenFromRequest: jest.fn() })
);

const { buildUserPasswordPayloadFromPassword } = await mockEsmWithActual(
  '#src/libraries/user.utils.js',
  () => ({
    buildUserPasswordPayloadFromPassword: jest.fn(async (password: string) => ({
      passwordEncrypted: `hashed:${password}`,
    })),
  })
);

const appId = 'app-vmsalert-admin';
const actorHeaders = { 'X-Iam-Actor': encodeURIComponent('an.nv'), 'X-Iam-Actor-Id': 'acc-1' };

const nationwideOrganization = {
  id: 'toan-quoc',
  name: 'Toàn quốc',
  customData: { level: 'trung_uong' },
};
const borderPost = { id: 'bp-qn-cr', name: 'Đồn BP Cái Rồng', customData: { type: 'DON_BP' } };

const userRow: IamAdminUserRow = {
  id: 'u-an',
  username: 'an.nv',
  name: 'Nguyễn Văn An',
  primaryEmail: null,
  primaryPhone: null,
  isSuspended: false,
  hasPassword: true,
  customData: {},
  lastSignInAt: null,
  passwordUpdatedAt: null,
  createdAt: 0,
  updatedAt: 0,
};

const findUserById = jest.fn(async (id: string) =>
  ['u-an', 'u-moi'].includes(id) ? { ...userRow, id } : null
);
const iamAdmin = {
  findUserById,
  findMemberships: jest.fn(async () => []),
  findRoleAssignments: jest.fn(async () => []),
  findLastSignInApplications: jest.fn(async () => []),
};
const users = {
  hasUser: jest.fn(async () => false),
  hasUserWithEmail: jest.fn(async () => false),
  hasUserWithNormalizedPhone: jest.fn(async () => false),
  updateUserById: jest.fn(async () => userRow),
  deleteUserById: jest.fn(),
};
const getExistingOrganizationIds = jest.fn(async (): Promise<string[]> => []);
const insertMembership = jest.fn();
const deleteMembership = jest.fn();
const replaceRoles = jest.fn();
const findOrganizationById = jest.fn(async (id: string) => {
  if (id !== borderPost.id) {
    throw new Error('not found');
  }
  return borderPost;
});
const insertLog = jest.fn();
const insertUser = jest.fn(async () => [{ ...userRow, id: 'u-moi' }]);
const signOutUser = jest.fn();

const tenantContext = new MockTenant(
  undefined,
  {
    iamAdmin,
    users: users as unknown as MockTenant['queries']['users'],
    logs: { insertLog },
    signInExperiences: { getUsernameCaseSensitive: jest.fn(async () => false) },
    organizations: {
      findAll: jest.fn(async () => [2, [nationwideOrganization, borderPost]]),
      findById: findOrganizationById,
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
        apps: {
          getOrganizationsByApplicationId: jest.fn(async () => [1, [nationwideOrganization]]),
        },
        users: {
          getExistingOrganizationIds,
          insert: insertMembership,
          delete: deleteMembership,
        },
        usersRoles: { replace: replaceRoles },
      },
    } as unknown as MockTenant['queries']['organizations'],
  },
  undefined,
  {
    users: {
      insertUser,
      generateUserId: jest.fn(async () => 'u-moi'),
      checkIdentifierCollision: jest.fn(),
      signOutUser,
    },
  } as unknown as MockTenant['libraries']
);

const { createRequester } = await import('#src/utils/test-utils.js');
const request = createRequester({
  anonymousRoutes: await pickDefault(import('#src/routes/iam-admin/index.js')),
  tenantContext,
});

const mockToken = (scopes = ['iam-admin:users:write']) => {
  verifyBearerTokenFromRequest.mockResolvedValue({ sub: appId, clientId: appId, scopes });
};

const loggedActions = () => insertLog.mock.calls.map(([entry]) => (entry as { key: string }).key);

describe('IAM Admin API, user write endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken();
  });

  it('rejects a token with only the read scope', async () => {
    mockToken(['iam-admin:users:read']);
    const response = await request.delete('/iam-admin/v1/users/u-an').set(actorHeaders);
    expect(response.status).toBe(403);
    expect(users.deleteUserById).not.toHaveBeenCalled();
  });

  it('rejects a write without X-Iam-Actor and changes nothing', async () => {
    const response = await request
      .put('/iam-admin/v1/users/u-an/suspension')
      .send({ suspended: true });
    expect(response.status).toBe(400);
    expect(users.updateUserById).not.toHaveBeenCalled();
  });

  describe('POST /users', () => {
    it('creates a user with a generated password and a first organization', async () => {
      const response = await request
        .post('/iam-admin/v1/users')
        .set(actorHeaders)
        .send({
          name: 'Người mới',
          username: 'nguoi.moi',
          password: { mode: 'generate' },
          organization: { id: 'bp-qn-cr', roleCodes: ['TRUONG'] },
        });

      expect(response.status).toBe(201);
      expect(response.body.temporaryPassword).toMatch(/^(?:[\dA-Za-z]{4}-){2}[\dA-Za-z]{4}$/);
      expect(buildUserPasswordPayloadFromPassword).toHaveBeenCalledWith(
        response.body.temporaryPassword
      );
      expect(insertMembership).toHaveBeenCalledWith({
        organizationId: 'bp-qn-cr',
        userId: 'u-moi',
      });
      expect(replaceRoles).toHaveBeenCalledWith('bp-qn-cr', 'u-moi', ['role-truong']);
      expect(insertLog.mock.calls[0]?.[0]).toMatchObject({
        key: 'IamAdmin.User.Create',
        payload: {
          applicationId: appId,
          actor: { username: 'an.nv', id: 'acc-1' },
          userId: 'u-moi',
        },
      });
    });

    it('rejects a set password without digits', async () => {
      const response = await request
        .post('/iam-admin/v1/users')
        .set(actorHeaders)
        .send({ name: 'A', username: 'a.b', password: { mode: 'set', value: 'chicochu' } });
      expect(response.status).toBe(400);
      expect(insertUser).not.toHaveBeenCalled();
    });

    it('returns 422 when the username is taken', async () => {
      users.hasUser.mockResolvedValueOnce(true);
      const response = await request
        .post('/iam-admin/v1/users')
        .set(actorHeaders)
        .send({ name: 'A', username: 'an.nv', password: { mode: 'generate' } });
      expect(response.status).toBe(422);
      expect(insertUser).not.toHaveBeenCalled();
    });

    it('returns 400 for an unknown role code before creating the user', async () => {
      const response = await request
        .post('/iam-admin/v1/users')
        .set(actorHeaders)
        .send({
          name: 'A',
          username: 'a.b',
          password: { mode: 'generate' },
          organization: { id: 'bp-qn-cr', roleCodes: ['GIAM_DOC'] },
        });
      expect(response.status).toBe(400);
      expect(insertUser).not.toHaveBeenCalled();
    });

    it('deletes the new user when assigning the organization fails', async () => {
      replaceRoles.mockRejectedValueOnce(new Error('db down'));
      const response = await request
        .post('/iam-admin/v1/users')
        .set(actorHeaders)
        .send({
          name: 'A',
          username: 'a.b',
          password: { mode: 'generate' },
          organization: { id: 'bp-qn-cr', roleCodes: ['TRUONG'] },
        });
      expect(response.status).toBe(500);
      expect(users.deleteUserById).toHaveBeenCalledWith('u-moi');
      expect(insertLog).not.toHaveBeenCalled();
    });
  });

  it('PATCH /users/:id maps email and phone to primary identifiers', async () => {
    const response = await request
      .patch('/iam-admin/v1/users/u-an')
      .set(actorHeaders)
      .send({ name: 'Tên mới', email: null });

    expect(response.status).toBe(200);
    expect(users.updateUserById).toHaveBeenCalledWith('u-an', {
      name: 'Tên mới',
      primaryEmail: null,
    });
  });

  it('PATCH /users/:id returns 404 for an unknown user', async () => {
    const response = await request
      .patch('/iam-admin/v1/users/khong-co')
      .set(actorHeaders)
      .send({ name: 'X' });
    expect(response.status).toBe(404);
  });

  it('PUT /users/:id/suspension suspends, signs out and logs the reason', async () => {
    const response = await request
      .put('/iam-admin/v1/users/u-an/suspension')
      .set(actorHeaders)
      .send({ suspended: true, reason: 'Nghỉ việc' });

    expect(response.status).toBe(200);
    expect(users.updateUserById).toHaveBeenCalledWith('u-an', { isSuspended: true });
    expect(signOutUser).toHaveBeenCalledWith('u-an');
    expect(loggedActions()).toEqual(['IamAdmin.User.Suspend']);
  });

  it('PUT /users/:id/suspension unsuspends without signing out', async () => {
    await request
      .put('/iam-admin/v1/users/u-an/suspension')
      .set(actorHeaders)
      .send({ suspended: false });
    expect(signOutUser).not.toHaveBeenCalled();
    expect(loggedActions()).toEqual(['IamAdmin.User.Unsuspend']);
  });

  it('POST /users/:id/password-reset returns a temporary password once', async () => {
    const response = await request
      .post('/iam-admin/v1/users/u-an/password-reset')
      .set(actorHeaders)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.temporaryPassword).toMatch(/^.{4}-.{4}-.{4}$/);
    expect(signOutUser).toHaveBeenCalledWith('u-an');
  });

  it('DELETE /users/:id signs out and deletes', async () => {
    const response = await request.delete('/iam-admin/v1/users/u-an').set(actorHeaders);
    expect(response.status).toBe(204);
    expect(signOutUser).toHaveBeenCalledWith('u-an');
    expect(users.deleteUserById).toHaveBeenCalledWith('u-an');
  });

  describe('organization membership', () => {
    it('adds the membership when missing and replaces roles', async () => {
      const response = await request
        .put('/iam-admin/v1/users/u-an/organizations/bp-qn-cr')
        .set(actorHeaders)
        .send({ roleCodes: ['CHUYEN_VIEN', 'CHUYEN_VIEN'] });

      expect(response.status).toBe(200);
      expect(insertMembership).toHaveBeenCalled();
      expect(replaceRoles).toHaveBeenCalledWith('bp-qn-cr', 'u-an', ['role-cv']);
    });

    it('keeps the membership when it exists', async () => {
      getExistingOrganizationIds.mockResolvedValueOnce(['bp-qn-cr']);
      await request
        .put('/iam-admin/v1/users/u-an/organizations/bp-qn-cr')
        .set(actorHeaders)
        .send({ roleCodes: ['TRUONG'] });
      expect(insertMembership).not.toHaveBeenCalled();
    });

    it('rejects an empty role list', async () => {
      const response = await request
        .put('/iam-admin/v1/users/u-an/organizations/bp-qn-cr')
        .set(actorHeaders)
        .send({ roleCodes: [] });
      expect(response.status).toBe(400);
    });

    it('leaves an organization, 404 when not a member', async () => {
      const missing = await request
        .delete('/iam-admin/v1/users/u-an/organizations/bp-qn-cr')
        .set(actorHeaders);
      expect(missing.status).toBe(404);

      getExistingOrganizationIds.mockResolvedValueOnce(['bp-qn-cr']);
      const left = await request
        .delete('/iam-admin/v1/users/u-an/organizations/bp-qn-cr')
        .set(actorHeaders);
      expect(left.status).toBe(204);
      expect(deleteMembership).toHaveBeenCalledWith({ organizationId: 'bp-qn-cr', userId: 'u-an' });
    });
  });
});
