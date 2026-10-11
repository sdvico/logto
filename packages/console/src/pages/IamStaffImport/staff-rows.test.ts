import { toCsv } from './csv';
import {
  checkRows,
  hasBlockingIssue,
  parseStaffFile,
  roleTitleOf,
  suggestUsername,
  unitKeyOf,
} from './staff-rows';
import { codesOf, fileOf, header, lookup, reviewOf } from './test-fixtures';

describe('parseStaffFile', () => {
  it('reads every column and splits units', () => {
    const { rows, error } = parseStaffFile(
      fileOf({ account_id: 'a1', username: 'nguyen_a', units: 'CHI_CUC:22; DON_BP:TKSCR' })
    );

    expect(error).toBeUndefined();
    expect(rows[0]).toMatchObject({
      line: 2,
      sourceAccountId: 'a1',
      username: 'nguyen_a',
      units: ['CHI_CUC:22', 'DON_BP:TKSCR'],
    });
  });

  it('reads the optional location columns, and leaves them empty for an older file', () => {
    const newFile = toCsv([
      [...header, 'agency_name', 'unit_names', 'scope_places', 'role_title'],
      [
        ...header.map((column) => (column === 'username' ? 'cang' : '')),
        'BQL cảng cá Tam Quan',
        'Cảng cá Tam Quan · Gia Lai',
        'Tam Quan · Gia Lai (HANDLE)',
        'Nhân viên',
      ],
    ]);

    expect(parseStaffFile(newFile).rows[0]).toMatchObject({
      agencyName: 'BQL cảng cá Tam Quan',
      unitNames: 'Cảng cá Tam Quan · Gia Lai',
      scopePlaces: 'Tam Quan · Gia Lai (HANDLE)',
      roleTitle: 'Nhân viên',
    });
    expect(parseStaffFile(fileOf({ username: 'old' })).rows[0]).toMatchObject({
      agencyName: '',
      unitNames: '',
      scopePlaces: '',
      roleTitle: '',
    });
  });

  it('rejects a file without the export columns', () => {
    expect(parseStaffFile('username,name\na,b').error).toContain('account_id');
  });

  it('still reads an MKN file with the old mkn_* column names', () => {
    const legacyHeader = header.map(
      (column) =>
        ({
          account_id: 'mkn_account_id',
          source_groups: 'mkn_groups',
          source_scopes: 'mkn_scopes',
        })[column as string] ?? column
    );
    const legacyFile = toCsv([
      [...legacyHeader, 'mkn_scope_places'],
      [
        ...legacyHeader.map(
          (column) =>
            ({
              mkn_account_id: 'a1',
              username: 'cang',
              mkn_groups: 'bql_cang',
              mkn_scopes: 'PORT:1',
            })[column] ?? ''
        ),
        'Tam Quan (HANDLE)',
      ],
    ]);
    const { rows, error } = parseStaffFile(legacyFile);

    expect(error).toBeUndefined();
    expect(rows[0]).toMatchObject({
      sourceAccountId: 'a1',
      sourceGroups: 'bql_cang',
      sourceScopes: 'PORT:1',
      scopePlaces: 'Tam Quan (HANDLE)',
    });
  });

  it('rejects a file that has both the old and the new name of a column', () => {
    expect(parseStaffFile(toCsv([[...header, 'mkn_account_id']])).error).toContain('account_id');
  });
});

describe('unitKeyOf', () => {
  it('uses sourceCode for border posts and ports, provinceCode otherwise', () => {
    expect(unitKeyOf({ type: 'DON_BP', provinceCode: '22', sourceCode: 'TKSCR' })).toBe(
      'DON_BP:TKSCR'
    );
    expect(unitKeyOf({ type: 'CHI_CUC', provinceCode: '22' })).toBe('CHI_CUC:22');
    expect(unitKeyOf({ type: 'CUC' })).toBe('CUC');
    expect(unitKeyOf({})).toBeUndefined();
  });
});

describe('suggestUsername', () => {
  it('makes usernames valid for Logto', () => {
    expect(suggestUsername('nguyen.van-a')).toBe('nguyen_van-a');
    expect(suggestUsername('2026cb')).toBe('u_2026cb');
    expect(suggestUsername('-cb')).toBe('u_-cb');
  });
});

describe('roleTitleOf', () => {
  const [draft] = reviewOf({
    account_id: 'a1',
    username: 'a',
    units: 'CHI_CUC:22',
    password_bcrypt: 'x',
  });
  const titled = {
    ...draft!,
    organizations: [
      { id: 'bp-qn-cr', name: 'Trạm', roleTitles: { TRUONG: 'Đồn trưởng', CHUYEN_VIEN: 'Cán bộ' } },
    ],
  };

  it('uses the title of the chosen organization and follows the selected role', () => {
    expect(roleTitleOf(titled)).toBe('Cán bộ');
    expect(roleTitleOf({ ...titled, role: 'TRUONG' })).toBe('Đồn trưởng');
  });

  it('falls back to the file title only while the role is unchanged', () => {
    const withFileTitle = {
      ...draft!,
      organizations: [],
      source: { ...draft!.source, roleTitle: 'Nhân viên' },
    };

    expect(roleTitleOf(withFileTitle)).toBe('Nhân viên');
    expect(roleTitleOf({ ...withFileTitle, role: 'PHO' })).toBe('');
  });
});

describe('checkRows', () => {
  it('accepts a clean row and resolves its organizations', () => {
    const [draft] = reviewOf({
      account_id: 'a1',
      username: 'nguyen_a',
      units: 'CHI_CUC:22;DON_BP:TKSCR',
      role: 'CHUYEN_VIEN',
      password_bcrypt: '$2b$10$x',
      status: 'ACTIVE',
      email: 'a@example.com',
      phone: '0912 345 678',
    });

    expect(draft?.issues).toEqual([]);
    expect(draft?.organizations.map(({ id }) => id)).toEqual(['ccts-qn', 'bp-qn-cr']);
    expect(draft?.phone).toBe('84912345678');
    expect(draft?.include).toBe(true);
  });

  it('renames an invalid username with a warning', () => {
    const [draft] = reviewOf({
      account_id: 'a1',
      username: 'nguyen.van-a',
      units: 'CHI_CUC:22',
      password_bcrypt: 'x',
    });

    expect(draft?.username).toBe('nguyen_van-a');
    expect(codesOf(draft!)).toEqual(['USERNAME_RENAMED']);
    expect(hasBlockingIssue(draft!)).toBe(false);
  });

  it('keeps a username with hyphens as in MKN', () => {
    const [draft] = reviewOf({
      account_id: 'a1',
      username: 'chinnd-THO',
      units: 'CHI_CUC:22',
      password_bcrypt: 'x',
    });

    expect(draft?.username).toBe('chinnd-THO');
    expect(draft?.issues).toEqual([]);
  });

  it('blocks a username taken on IAM when creating, or duplicated in the file', () => {
    const [taken, first, second] = reviewOf(
      { account_id: 'a1', username: 'TAKEN', units: 'CHI_CUC:22', password_bcrypt: 'x' },
      { account_id: 'a2', username: 'dup', units: 'CHI_CUC:22', password_bcrypt: 'x' },
      { account_id: 'a3', username: 'dup', units: 'CHI_CUC:22', password_bcrypt: 'x' }
    );
    const [createTaken] = checkRows([{ ...taken!, action: 'create' }], lookup);

    expect(codesOf(createTaken!)).toContain('USERNAME_TAKEN');
    expect(codesOf(first!)).toContain('USERNAME_DUPLICATE_IN_FILE');
    expect(hasBlockingIssue(second!)).toBe(true);
  });

  it('drops a used email and a used phone with warnings', () => {
    const [draft] = reviewOf({
      account_id: 'a1',
      username: 'nguyen_a',
      units: 'CHI_CUC:22',
      password_bcrypt: 'x',
      email: 'USED@example.com',
      phone: '0900000000',
    });

    expect(draft?.action).toBe('create');
    expect(codesOf(draft!)).toEqual(['LINK_SUGGESTED', 'EMAIL_DROPPED', 'PHONE_DROPPED']);
    expect(draft?.email).toBeUndefined();
    expect(draft?.phone).toBeUndefined();
  });

  it('drops a phone that is not a valid number', () => {
    const [draft] = reviewOf({
      account_id: 'a1',
      username: 'nguyen_a',
      units: 'CHI_CUC:22',
      password_bcrypt: 'x',
      phone: '12345',
    });

    expect(codesOf(draft!)).toContain('PHONE_DROPPED');
    expect(draft?.phone).toBeUndefined();
  });

  it('keeps the first of several phones in a cell and tells the reviewer', () => {
    const [draft] = reviewOf({
      account_id: 'a1',
      username: 'nguyen_a',
      units: 'CHI_CUC:22',
      password_bcrypt: 'x',
      phone: '0912345678 hoặc 0987654321',
    });

    expect(draft?.phone).toBe('84912345678');
    expect(codesOf(draft!)).toContain('PHONE_EXTRA');
    expect(hasBlockingIssue(draft!)).toBe(false);
  });

  it('flags unknown and ambiguous units, and a row without any unit', () => {
    const [draft] = reviewOf({
      account_id: 'a1',
      username: 'nguyen_a',
      units: 'KN_VUNG;CANG:NOPE',
      password_bcrypt: 'x',
      note: 'UNMAPPED_SCOPE NATIONAL',
    });

    expect(codesOf(draft!)).toEqual(['UNIT_NOT_FOUND', 'NO_UNIT', 'EXPORT_NOTE']);
    expect(draft?.issues[0]?.message).toContain('KN_VUNG, CANG:NOPE');
  });

  it('unchecks an already imported row and does not report its own username as taken', () => {
    const [draft] = reviewOf({
      account_id: 'mkn-imported',
      username: 'imported',
      units: 'CHI_CUC:22',
    });

    expect(draft?.include).toBe(false);
    expect(draft?.existingUserId).toBe('user-imported');
    expect(codesOf(draft!)).toEqual(['ALREADY_IMPORTED']);
  });

  it('reports missing password and suspended status', () => {
    const [draft] = reviewOf({
      account_id: 'a1',
      username: 'nguyen_a',
      units: 'CHI_CUC:22',
      status: 'SUSPENDED',
      role: 'TRUONG',
    });

    expect(draft?.role).toBe('TRUONG');
    expect(codesOf(draft!)).toEqual(['NO_PASSWORD', 'SUSPENDED']);
  });

  it('warns when an unknown role falls back to CHUYEN_VIEN', () => {
    const [unknown, empty] = reviewOf(
      {
        account_id: 'a1',
        username: 'a',
        units: 'CHI_CUC:22',
        password_bcrypt: 'x',
        role: 'GIAM_DOC',
      },
      { account_id: 'a2', username: 'b', units: 'CHI_CUC:22', password_bcrypt: 'x', role: '' }
    );

    expect(unknown?.role).toBe('CHUYEN_VIEN');
    expect(codesOf(unknown!)).toEqual(['ROLE_DEFAULTED']);
    expect(codesOf(empty!)).toEqual(['ROLE_DEFAULTED']);
  });

  it('blocks two selected rows with the same mkn_account_id', () => {
    const [first, second] = reviewOf(
      {
        account_id: 'same',
        username: 'a',
        units: 'CHI_CUC:22',
        password_bcrypt: 'x',
        role: 'PHO',
      },
      {
        account_id: 'same',
        username: 'b',
        units: 'CHI_CUC:22',
        password_bcrypt: 'x',
        role: 'PHO',
      }
    );

    expect(codesOf(first!)).toEqual(['SOURCE_ID_DUPLICATE_IN_FILE']);
    expect(hasBlockingIssue(second!)).toBe(true);
  });

  it('drops an email or phone shared by two selected rows', () => {
    const shared = { email: 'same@example.com', phone: '0912 000 111', units: 'CHI_CUC:22' };
    const [first, second] = reviewOf(
      { ...shared, account_id: 'a1', username: 'a', password_bcrypt: 'x', role: 'PHO' },
      { ...shared, account_id: 'a2', username: 'b', password_bcrypt: 'x', role: 'PHO' }
    );

    expect(codesOf(first!)).toEqual(['EMAIL_DROPPED', 'PHONE_DROPPED']);
    expect(second?.email).toBeUndefined();
    expect(second?.phone).toBeUndefined();
  });
});
