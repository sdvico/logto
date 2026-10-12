import { ApplicationType } from '@logto/schemas';
import { pickDefault, createMockUtils } from '@logto/shared/esm';

import { type IamAdminApplicationRow } from '#src/queries/iam-admin.js';
import { MockTenant } from '#src/test-utils/tenant.js';

const { jest } = import.meta;
const { mockEsmWithActual } = createMockUtils(jest);

const { verifyBearerTokenFromRequest } = await mockEsmWithActual(
  '#src/middleware/koa-auth/index.js',
  () => ({ verifyBearerTokenFromRequest: jest.fn() })
);

const appId = 'app-vmsalert-admin';
const actorHeaders = { 'X-Iam-Actor': 'an.nv' };
const nationwideOrganization = {
  id: 'toan-quoc',
  name: 'Toàn quốc',
  customData: { level: 'trung_uong' },
};

const vmsAlert = { system: 'vmsalert', systemName: 'VMS Alert' };
const appRow = (
  id: string,
  type: ApplicationType,
  customData: Record<string, string>,
  roleNames: string[] = []
): IamAdminApplicationRow => ({
  id,
  name: id,
  description: null,
  type,
  customData,
  oidcClientMetadata: {},
  customClientMetadata: {},
  createdAt: Date.UTC(2026, 9, 1),
  roleNames,
});

const existingApps = [
  {
    ...appRow('login-spa', ApplicationType.SPA, vmsAlert),
    oidcClientMetadata: {
      redirectUris: ['https://vms.example.gov.vn/cb'],
      postLogoutRedirectUris: [],
    },
    customClientMetadata: { corsAllowedOrigins: ['https://vms.example.gov.vn'] },
  },
  appRow('sync-m2m', ApplicationType.MachineToMachine, vmsAlert, ['machine:iam-sync']),
  appRow(appId, ApplicationType.MachineToMachine, vmsAlert, ['machine:iam-admin']),
  appRow('demo', ApplicationType.Traditional, {}),
  appRow('baocao-web', ApplicationType.Traditional, { system: 'baocao' }),
  appRow('quantri-m2m', ApplicationType.MachineToMachine, { system: 'quantri' }, [
    'machine:iam-admin',
  ]),
];

const findSystemApplications = jest.fn(async () => existingApps);
const findSystemApplicationById = jest.fn(
  async (id: string) => existingApps.find((app) => app.id === id) ?? null
);
const insertApplication = jest.fn(async (data: { id: string }) => data);
const deleteApplicationById = jest.fn();
const insertSecret = jest.fn();
const insertApplicationsRoles = jest.fn();
const insertAppMembership = jest.fn();
const findRoleByRoleName = jest.fn(async () => ({ id: 'role-iam-sync' }));
const insertLog = jest.fn();

const tenantContext = new MockTenant(undefined, {
  iamAdmin: { findSystemApplications, findSystemApplicationById },
  applications: { insertApplication, deleteApplicationById },
  applicationSecrets: { insert: insertSecret },
  applicationsRoles: { insertApplicationsRoles },
  roles: { findRoleByRoleName },
  logs: { insertLog },
  organizations: {
    relations: {
      apps: {
        getOrganizationsByApplicationId: jest.fn(async () => [1, [nationwideOrganization]]),
        insert: insertAppMembership,
      },
    },
  } as unknown as MockTenant['queries']['organizations'],
} as unknown as ConstructorParameters<typeof MockTenant>[1]);

const { createRequester } = await import('#src/utils/test-utils.js');
const request = createRequester({
  anonymousRoutes: await pickDefault(import('#src/routes/iam-admin/index.js')),
  tenantContext,
});

const mockToken = (scopes: string[]) => {
  verifyBearerTokenFromRequest.mockResolvedValue({ sub: appId, clientId: appId, scopes });
};

describe('IAM Admin API, systems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken(['iam-admin:apps:read', 'iam-admin:apps:write']);
  });

  it('GET /systems groups apps by system and marks the caller', async () => {
    const response = await request.get('/iam-admin/v1/systems');

    expect(response.status).toBe(200);
    const { data } = response.body as {
      data: Array<{ apps: Array<{ type: string; hasSecret: boolean }> }>;
    };
    const [first, demo] = data;
    expect(first).toMatchObject({ system: 'vmsalert', name: 'VMS Alert', isCaller: true });
    expect(first?.apps.map(({ type, hasSecret }) => [type, hasSecret])).toEqual([
      ['spa', false],
      ['m2m', true],
      ['m2m', true],
    ]);
    expect(demo).toMatchObject({ system: 'demo', name: 'demo', isCaller: false });
  });

  it('GET /systems requires the apps:read scope', async () => {
    mockToken(['iam-admin:users:read']);
    const response = await request.get('/iam-admin/v1/systems');
    expect(response.status).toBe(403);
  });

  describe('GET /applications/:id', () => {
    it('returns URIs and CORS origins without any secret', async () => {
      const response = await request.get('/iam-admin/v1/applications/login-spa');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'login-spa',
        name: 'login-spa',
        description: null,
        type: 'spa',
        system: 'vmsalert',
        hasSecret: false,
        roles: [],
        redirectUris: ['https://vms.example.gov.vn/cb'],
        postLogoutRedirectUris: [],
        corsAllowedOrigins: ['https://vms.example.gov.vn'],
        resource: null,
        scope: null,
        isCaller: true,
        createdAt: '2026-10-01T00:00:00.000Z',
      });
    });

    it('gives the iam-sync resource to a sync app only', async () => {
      const response = await request.get('/iam-admin/v1/applications/sync-m2m');
      expect(response.body).toMatchObject({
        type: 'm2m',
        hasSecret: true,
        resource: 'https://mock_id.logto.app/iam-sync',
        scope: 'iam-sync:read',
      });
    });

    it('marks apps of other systems as not the caller', async () => {
      const response = await request.get('/iam-admin/v1/applications/demo');
      expect(response.body).toMatchObject({ system: null, isCaller: false });
    });

    it('returns 404 for an unknown application', async () => {
      const response = await request.get('/iam-admin/v1/applications/khong-co');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /systems', () => {
    const body = {
      system: 'cang-ca',
      name: 'Cổng cảng cá',
      apps: [
        {
          type: 'traditional',
          name: 'Cổng web',
          redirectUris: ['https://cangca.example.gov.vn/callback'],
        },
        { type: 'native', name: 'App cán bộ', redirectUris: ['vn.sdvico.cangca://callback'] },
        {
          type: 'spa',
          name: 'Bản đồ',
          redirectUris: ['https://map.example.gov.vn/cb'],
          corsAllowedOrigins: ['https://map.example.gov.vn'],
        },
        { type: 'm2m', name: 'Đồng bộ', roles: ['machine:iam-sync'] },
      ],
    };

    it('creates every app, returns secrets only for confidential apps', async () => {
      const response = await request.post('/iam-admin/v1/systems').set(actorHeaders).send(body);

      expect(response.status).toBe(201);
      const { apps } = response.body as {
        apps: Array<{ type: string; clientSecret: unknown }>;
      };
      expect(
        apps.map(({ type, clientSecret }) => [type, typeof clientSecret === 'string'])
      ).toEqual([
        ['traditional', true],
        ['native', false],
        ['spa', false],
        ['m2m', true],
      ]);
      expect(response.body.apps[3]).toMatchObject({
        resource: 'https://mock_id.logto.app/iam-sync',
        scope: 'iam-sync:read',
      });
      expect(insertApplication).toHaveBeenCalledTimes(4);
      expect(insertApplication).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ApplicationType.SPA,
          customClientMetadata: { corsAllowedOrigins: ['https://map.example.gov.vn'] },
          customData: { system: 'cang-ca', systemName: 'Cổng cảng cá' },
        })
      );
      expect(insertSecret).toHaveBeenCalledTimes(2);
      expect(insertApplicationsRoles).toHaveBeenCalledWith([
        expect.objectContaining({ roleId: 'role-iam-sync' }),
      ]);
      expect(insertAppMembership).toHaveBeenCalledWith(
        expect.objectContaining({ organizationId: 'toan-quoc' })
      );
    });

    it('never grants machine:iam-admin', async () => {
      const response = await request
        .post('/iam-admin/v1/systems')
        .set(actorHeaders)
        .send({ ...body, apps: [{ type: 'm2m', name: 'X', roles: ['machine:iam-admin'] }] });
      expect(response.status).toBe(400);
      expect(insertApplication).not.toHaveBeenCalled();
    });

    it('rejects a custom scheme for a web app and https-less native URIs pass through validation', async () => {
      const response = await request
        .post('/iam-admin/v1/systems')
        .set(actorHeaders)
        .send({
          ...body,
          apps: [{ type: 'traditional', name: 'X', redirectUris: ['vn.sdvico.x://cb'] }],
        });
      expect(response.status).toBe(400);
    });

    it('returns 409 when the system key is taken', async () => {
      const response = await request
        .post('/iam-admin/v1/systems')
        .set(actorHeaders)
        .send({ ...body, system: 'baocao' });
      expect(response.status).toBe(409);
      expect(insertApplication).not.toHaveBeenCalled();
    });

    it('deletes created apps when a later step fails', async () => {
      insertSecret.mockRejectedValueOnce(new Error('db down'));
      const response = await request.post('/iam-admin/v1/systems').set(actorHeaders).send(body);

      expect(response.status).toBe(500);
      expect(deleteApplicationById).toHaveBeenCalledTimes(1);
      expect(insertLog).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /systems/:system', () => {
    it('deletes every app of the system', async () => {
      const response = await request.delete('/iam-admin/v1/systems/baocao').set(actorHeaders);
      expect(response.status).toBe(204);
      expect(deleteApplicationById).toHaveBeenCalledWith('baocao-web');
    });

    it('refuses the caller system', async () => {
      const response = await request.delete('/iam-admin/v1/systems/vmsalert').set(actorHeaders);
      expect(response.status).toBe(403);
      expect(deleteApplicationById).not.toHaveBeenCalled();
    });

    it('refuses a system holding machine:iam-admin', async () => {
      const response = await request.delete('/iam-admin/v1/systems/quantri').set(actorHeaders);
      expect(response.status).toBe(403);
    });

    it('returns 404 for an unknown system', async () => {
      const response = await request.delete('/iam-admin/v1/systems/khong-co').set(actorHeaders);
      expect(response.status).toBe(404);
    });
  });
});
