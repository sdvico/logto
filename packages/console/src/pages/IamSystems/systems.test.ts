import {
  availableUnitTypes,
  buildConfigBlock,
  checkSystemKey,
  countLinked,
  extraSyncRoles,
  isSystemKeyValid,
  organizationIdsForUnitTypes,
  parseIamLogin,
  parseIamSystem,
  splitBySignIn,
  type SyncUserSummary,
} from './systems';

describe('parseIamSystem and parseIamLogin', () => {
  it('reads the system record and ignores other custom data', () => {
    expect(parseIamSystem({ iamSystem: { key: 'mkn', label: 'MKN' }, other: 1 })).toEqual({
      key: 'mkn',
      label: 'MKN',
    });
    expect(parseIamSystem({})).toBeUndefined();
  });

  it('treats an undeclared login app as open', () => {
    expect(parseIamLogin({})).toEqual({ mode: 'open', unitTypes: [] });
    expect(parseIamLogin({ iamLogin: { mode: 'blocked' } })).toEqual({
      mode: 'blocked',
      unitTypes: [],
    });
  });
});

describe('isSystemKeyValid', () => {
  it('accepts lowercase keys only', () => {
    expect(isSystemKeyValid('elogbook')).toBe(true);
    expect(isSystemKeyValid('e_logbook2')).toBe(true);
    expect(isSystemKeyValid('eLogbook')).toBe(false);
    expect(isSystemKeyValid('2iuu')).toBe(false);
    expect(isSystemKeyValid('e')).toBe(false);
  });
});

describe('checkSystemKey', () => {
  it('rejects malformed and taken keys', () => {
    expect(checkSystemKey('iuu', new Set(['mkn']))).toBeUndefined();
    expect(checkSystemKey('mkn', new Set(['mkn']))).toContain('đã có hệ khác');
    expect(checkSystemKey('IUU', new Set())).toContain('chữ thường');
  });
});

describe('organizationIdsForUnitTypes', () => {
  it('expands unit types to sorted organization ids', () => {
    const organizations = [
      { id: 'cang-b', type: 'CANG' },
      { id: 'ccts-qn', type: 'CHI_CUC' },
      { id: 'cang-a', type: 'CANG' },
      { id: 'tinh-qn', type: 'TINH' },
      { id: 'org-old' },
    ];

    expect(organizationIdsForUnitTypes(organizations, ['CANG', 'CHI_CUC'])).toEqual([
      'cang-a',
      'cang-b',
      'ccts-qn',
    ]);
  });
});

describe('availableUnitTypes', () => {
  it('lists unit types found in the tree, without grouping nodes', () => {
    expect(
      availableUnitTypes([
        { id: 'toan-quoc', type: 'ROOT' },
        { id: 'tinh-qn', type: 'TINH' },
        { id: 'cang-a', type: 'CANG' },
        { id: 'ccts-qn', type: 'CHI_CUC' },
        { id: 'cang-b', type: 'CANG' },
        { id: 'org-old' },
      ])
    ).toEqual(['CANG', 'CHI_CUC']);
  });
});

describe('splitBySignIn and countLinked', () => {
  const users: SyncUserSummary[] = [
    {
      username: 'cang',
      organizations: [{ id: 'cang-a', type: 'CANG' }],
      external_ids: { mkn: 'x' },
    },
    { username: 'bp', organizations: [{ id: 'bp-a', type: 'DON_BP' }] },
    { username: 'old', organizations: [{ id: 'org-old' }] },
  ];
  const names = (list: readonly SyncUserSummary[]) => list.map(({ username }) => username);

  it('allows everyone when open and nobody when blocked', () => {
    expect(names(splitBySignIn(users, { mode: 'open', unitTypes: [] }).allowed)).toEqual([
      'cang',
      'bp',
      'old',
    ]);
    expect(splitBySignIn(users, { mode: 'blocked', unitTypes: ['CANG'] }).allowed).toEqual([]);
  });

  it('allows only members of the chosen unit types when limited', () => {
    const { allowed, denied } = splitBySignIn(users, { mode: 'limited', unitTypes: ['CANG'] });

    expect(names(allowed)).toEqual(['cang']);
    expect(names(denied)).toEqual(['bp', 'old']);
  });

  it('counts users linked to a system key', () => {
    expect(countLinked(users, 'mkn')).toBe(1);
    expect(countLinked(users, 'iuu')).toBe(0);
  });
});

describe('buildConfigBlock', () => {
  it('never prints a secret and falls back to placeholders', () => {
    const block = buildConfigBlock({
      tenantEndpoint: 'http://localhost:3003/',
      tenantId: 'default',
      key: 'mkn',
      syncAppId: 'sync-1',
    });

    expect(block).toContain('IAM_ISSUER=http://localhost:3003/oidc');
    expect(block).toContain('IAM_CLIENT_ID=[CHƯA GẮN APP ĐĂNG NHẬP]');
    expect(block).toContain('IAM_SYNC_RESOURCE=https://default.logto.app/iam-sync');
    expect(block).toContain('IAM_EXTERNAL_ID_KEY=mkn');
    expect(block).not.toMatch(/SECRET=(?!<giao)/);
  });
});

describe('extraSyncRoles', () => {
  it('flags every role other than machine:iam-sync', () => {
    expect(
      extraSyncRoles([
        { id: '1', name: 'machine:iam-sync' },
        { id: '2', name: 'Logto Management API access' },
      ])
    ).toEqual([{ id: '2', name: 'Logto Management API access' }]);
  });
});
