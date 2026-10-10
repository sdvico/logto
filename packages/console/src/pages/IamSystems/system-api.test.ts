import { type KyInstance } from 'ky';

import { createSystem, saveLogin } from './system-api';

type Call = { method: string; url: string; json: unknown };

/** API giả ghi lại mọi lời gọi; `get` trả danh sách vai trò, `post` trả app có id theo thứ tự. */
const fakeApi = () => {
  const calls: Call[] = [];
  const respond = (method: string) => (url: string, options?: { json?: unknown }) => {
    // eslint-disable-next-line @silverhand/fp/no-mutating-methods -- recording calls in a test double
    calls.push({ method, url, json: options?.json });
    const appCount = calls.filter((call) => call.url === 'api/applications').length;
    const body =
      method === 'get'
        ? [{ id: 'role-iam-sync', name: 'machine:iam-sync' }]
        : { id: `app-${appCount}` };
    return { json: async () => body };
  };
  const api = {
    get: respond('get'),
    post: respond('post'),
    put: respond('put'),
    patch: respond('patch'),
  } as unknown as KyInstance;
  return { api, calls };
};

const steps = (calls: readonly Call[]) => calls.map(({ method, url }) => `${method} ${url}`);
const organizations = [{ id: 'cang-a', type: 'CANG' }];

describe('saveLogin', () => {
  it('opens by writing custom data before turning access control off', async () => {
    const { api, calls } = fakeApi();
    await saveLogin(api, 'login', { mode: 'open', unitTypes: [] }, organizations);

    expect(steps(calls)).toEqual([
      'patch api/applications/login/custom-data',
      'patch api/applications/login',
    ]);
    expect(calls[1]?.json).toEqual({ appLevelAccessControlEnabled: false });
  });

  it('limits by setting rules and enabling them before writing custom data', async () => {
    const { api, calls } = fakeApi();
    await saveLogin(api, 'login', { mode: 'limited', unitTypes: ['CANG'] }, organizations);

    expect(steps(calls)).toEqual([
      'put api/applications/login/access-control',
      'patch api/applications/login',
      'patch api/applications/login/custom-data',
    ]);
    expect(calls[0]?.json).toMatchObject({ organizationIds: ['cang-a'] });
  });

  it('blocks by writing custom data only, and refuses a limit without organizations', async () => {
    const { api, calls } = fakeApi();
    await saveLogin(api, 'login', { mode: 'blocked', unitTypes: [] }, organizations);

    expect(steps(calls)).toEqual(['patch api/applications/login/custom-data']);
    await expect(
      saveLogin(api, 'login', { mode: 'limited', unitTypes: ['DON_BP'] }, organizations)
    ).rejects.toThrow('chưa có tổ chức');
  });
});

describe('createSystem', () => {
  it('creates the sync app together with its system record, then role and nationwide scope', async () => {
    const { api, calls } = fakeApi();
    const syncAppId = await createSystem(api, {
      key: 'elogbook',
      label: 'eLogbook',
      origin: 'https://elogbook.example.vn/',
      initialMode: 'blocked',
    });

    expect(syncAppId).toBe('app-2');
    expect(steps(calls)).toEqual([
      'get api/roles',
      'post api/applications',
      'post api/applications',
      'post api/applications/app-2/roles',
      'post api/organizations/toan-quoc/applications',
    ]);
    expect(calls[1]?.json).toMatchObject({
      type: 'Traditional',
      oidcClientMetadata: { redirectUris: ['https://elogbook.example.vn/auth/callback'] },
      customData: { iamLogin: { mode: 'blocked', unitTypes: [] } },
    });
    expect(calls[2]?.json).toMatchObject({
      type: 'MachineToMachine',
      customData: { iamSystem: { key: 'elogbook', label: 'eLogbook', loginAppId: 'app-1' } },
    });
  });
});
