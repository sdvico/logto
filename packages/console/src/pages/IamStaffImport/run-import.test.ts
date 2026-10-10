import { noop } from '@silverhand/essentials';
import { HTTPError, type KyInstance } from 'ky';

import { runImport } from './run-import';
import { type DraftRow, type ImportLookup } from './staff-rows';

const lookup: ImportLookup = {
  userIdByMknId: new Map(),
  usernames: new Set(),
  emails: new Set(),
  phones: new Set(),
  organizationByUnit: new Map(),
  ambiguousUnits: new Set(),
  roleIdByCode: new Map([['CHUYEN_VIEN', 'role-cv']]),
};

const draftOf = (overrides: Partial<DraftRow['source']> = {}, email?: string): DraftRow => ({
  source: {
    line: 2,
    mknAccountId: 'mkn-1',
    username: 'nguyen_a',
    fullName: 'Nguyễn A',
    email: email ?? '',
    phone: '',
    status: 'ACTIVE',
    passwordBcrypt: '$2b$10$hash',
    units: [],
    role: 'CHUYEN_VIEN',
    mknGroups: '',
    mknScopes: '',
    note: '',
    agencyName: '',
    unitNames: '',
    mknScopePlaces: '',
    roleTitle: '',
    ...overrides,
  },
  include: true,
  username: 'nguyen_a',
  role: 'CHUYEN_VIEN',
  organizations: [{ id: 'ccts-qn', name: 'Chi cục' }],
  email,
  issues: [],
});

/** Lỗi 422 của ky; jsdom không có `Response` nên chỉ dựng phần `response` mà mã đọc. */
const conflict = (code: string): HTTPError => {
  const response = {
    status: 422,
    json: async () => ({ code, message: code }),
    clone: () => response,
  };
  return Object.create(HTTPError.prototype, { response: { value: response } });
};

type Call = { method: string; url: string; json: unknown };

/** API giả: ghi lại mọi lời gọi; `failCreate` làm lần tạo người đầu tiên trả lỗi. */
const fakeApi = (failCreate?: HTTPError) => {
  const calls: Call[] = [];
  const respond = (method: string) => (url: string, options?: { json?: unknown }) => {
    const isCreate = method === 'post' && url === 'api/users';
    const isFirstCreate = isCreate && !calls.some((call) => call.url === 'api/users');
    // eslint-disable-next-line @silverhand/fp/no-mutating-methods -- recording calls in a test double
    calls.push({ method, url, json: options?.json });
    const result =
      failCreate && isFirstCreate ? Promise.reject(failCreate) : Promise.resolve({ id: 'user-1' });
    // Avoid an unhandled rejection when the caller only uses `.json()`.
    // eslint-disable-next-line promise/prefer-await-to-then -- attaching a handler without awaiting
    result.catch(noop);
    return {
      json: async () => result,
      // eslint-disable-next-line unicorn/no-thenable -- ky's ResponsePromise is awaitable; the fake mirrors it
      then: async (onResolve: (value: unknown) => unknown, onReject: (error: unknown) => unknown) =>
        // eslint-disable-next-line promise/prefer-await-to-then -- forwarding a thenable, as ky does
        result.then(onResolve, onReject),
    };
  };

  const api = { post: respond('post'), patch: respond('patch') } as unknown as KyInstance;
  return { api, calls };
};

const run = async (api: KyInstance, draft: DraftRow) =>
  runImport([draft], { api, lookup, createdUserIds: new Map(), onProgress: noop });

describe('runImport', () => {
  it('creates the user with the bcrypt digest, then adds membership and role', async () => {
    const { api, calls } = fakeApi();
    const [outcome] = await run(api, draftOf());

    expect(outcome).toMatchObject({ ok: true, userId: 'user-1' });
    expect(calls.map(({ method, url }) => `${method} ${url}`)).toEqual([
      'post api/users',
      'post api/organizations/ccts-qn/users',
      'post api/organizations/ccts-qn/users/user-1/roles',
    ]);
    expect(calls[0]?.json).toMatchObject({
      passwordDigest: '$2b$10$hash',
      passwordAlgorithm: 'Bcrypt',
      customData: { externalIds: { mkn: 'mkn-1' } },
    });
  });

  it('creates a suspended MKN account without a password before suspending it', async () => {
    const { api, calls } = fakeApi();
    await run(api, draftOf({ status: 'SUSPENDED' }));

    expect(calls[0]?.json).not.toHaveProperty('passwordDigest');
    expect(calls[1]).toMatchObject({
      method: 'patch',
      url: 'api/users/user-1/is-suspended',
      json: { isSuspended: true },
    });
  });

  it('retries without the email when Logto reports it in use, and warns', async () => {
    const { api, calls } = fakeApi(conflict('user.email_already_in_use'));
    const [outcome] = await run(api, draftOf({}, 'a@example.com'));

    expect(calls[0]?.json).toHaveProperty('primaryEmail', 'a@example.com');
    expect(calls[1]?.json).not.toHaveProperty('primaryEmail');
    expect(outcome?.ok).toBe(true);
    expect(outcome?.warnings).toEqual(['Bỏ email "a@example.com": đã có người dùng trên IAM.']);
  });
});
