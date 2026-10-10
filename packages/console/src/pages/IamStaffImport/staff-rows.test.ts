import { toCsv } from './csv';
import {
  checkRows,
  draftFromRow,
  hasBlockingIssue,
  type ImportLookup,
  normalizePhone,
  parseStaffFile,
  requiredColumns,
  suggestUsername,
  unitKeyOf,
} from './staff-rows';

const header = [...requiredColumns];

const fileOf = (...rows: Array<Partial<Record<(typeof requiredColumns)[number], string>>>) =>
  toCsv([
    header,
    // Tệp xuất thật luôn ghi role (mặc định CHUYEN_VIEN).
    ...rows.map((row) =>
      header.map((column) => row[column] ?? (column === 'role' ? 'CHUYEN_VIEN' : ''))
    ),
  ]);

const lookup: ImportLookup = {
  userIdByMknId: new Map([['mkn-imported', 'user-imported']]),
  usernames: new Set(['taken', 'imported']),
  emails: new Set(['used@example.com']),
  phones: new Set(['0900000000']),
  organizationByUnit: new Map([
    ['CHI_CUC:22', { id: 'ccts-qn', name: 'Chi cục Thủy sản Quảng Ninh' }],
    ['DON_BP:TKSCR', { id: 'bp-qn-cr', name: 'Trạm KSBP Cái Rồng' }],
    ['KN_VUNG', { id: 'cckn-v1', name: 'Vùng 1' }],
  ]),
  ambiguousUnits: new Set(['KN_VUNG']),
  roleIdByCode: new Map([
    ['TRUONG', 'role-truong'],
    ['PHO', 'role-pho'],
    ['CHUYEN_VIEN', 'role-cv'],
  ]),
};

const reviewOf = (...rows: Parameters<typeof fileOf>) =>
  checkRows(
    parseStaffFile(fileOf(...rows)).rows.map((row) => draftFromRow(row, lookup)),
    lookup
  );

const codesOf = (draft: ReturnType<typeof reviewOf>[number]) =>
  draft.issues.map(({ code }) => code);

describe('parseStaffFile', () => {
  it('reads every column and splits units', () => {
    const { rows, error } = parseStaffFile(
      fileOf({ mkn_account_id: 'a1', username: 'nguyen_a', units: 'CHI_CUC:22; DON_BP:TKSCR' })
    );

    expect(error).toBeUndefined();
    expect(rows[0]).toMatchObject({
      line: 2,
      mknAccountId: 'a1',
      username: 'nguyen_a',
      units: ['CHI_CUC:22', 'DON_BP:TKSCR'],
    });
  });

  it('rejects a file without the export columns', () => {
    expect(parseStaffFile('username,name\na,b').error).toContain('mkn_account_id');
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

describe('suggestUsername and normalizePhone', () => {
  it('makes usernames valid for Logto', () => {
    expect(suggestUsername('nguyen.van-a')).toBe('nguyen_van-a');
    expect(suggestUsername('2026cb')).toBe('u_2026cb');
    expect(suggestUsername('-cb')).toBe('u_-cb');
  });

  it('keeps digits only', () => {
    expect(normalizePhone('+84 912.345-678')).toBe('84912345678');
  });
});

describe('checkRows', () => {
  it('accepts a clean row and resolves its organizations', () => {
    const [draft] = reviewOf({
      mkn_account_id: 'a1',
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
    expect(draft?.phone).toBe('0912345678');
    expect(draft?.include).toBe(true);
  });

  it('renames an invalid username with a warning', () => {
    const [draft] = reviewOf({
      mkn_account_id: 'a1',
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
      mkn_account_id: 'a1',
      username: 'chinnd-THO',
      units: 'CHI_CUC:22',
      password_bcrypt: 'x',
    });

    expect(draft?.username).toBe('chinnd-THO');
    expect(draft?.issues).toEqual([]);
  });

  it('blocks a username taken on IAM or duplicated in the file', () => {
    const [taken, first, second] = reviewOf(
      { mkn_account_id: 'a1', username: 'TAKEN', units: 'CHI_CUC:22', password_bcrypt: 'x' },
      { mkn_account_id: 'a2', username: 'dup', units: 'CHI_CUC:22', password_bcrypt: 'x' },
      { mkn_account_id: 'a3', username: 'dup', units: 'CHI_CUC:22', password_bcrypt: 'x' }
    );

    expect(codesOf(taken!)).toContain('USERNAME_TAKEN');
    expect(codesOf(first!)).toContain('USERNAME_DUPLICATE_IN_FILE');
    expect(hasBlockingIssue(second!)).toBe(true);
  });

  it('drops a used email and an invalid phone with warnings', () => {
    const [draft] = reviewOf({
      mkn_account_id: 'a1',
      username: 'nguyen_a',
      units: 'CHI_CUC:22',
      password_bcrypt: 'x',
      email: 'USED@example.com',
      phone: '0900000000',
    });

    expect(codesOf(draft!)).toEqual(['EMAIL_DROPPED', 'PHONE_DROPPED']);
    expect(draft?.email).toBeUndefined();
    expect(draft?.phone).toBeUndefined();
  });

  it('flags unknown and ambiguous units, and a row without any unit', () => {
    const [draft] = reviewOf({
      mkn_account_id: 'a1',
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
      mkn_account_id: 'mkn-imported',
      username: 'imported',
      units: 'CHI_CUC:22',
    });

    expect(draft?.include).toBe(false);
    expect(draft?.existingUserId).toBe('user-imported');
    expect(codesOf(draft!)).toEqual(['ALREADY_IMPORTED']);
  });

  it('reports missing password and suspended status', () => {
    const [draft] = reviewOf({
      mkn_account_id: 'a1',
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
        mkn_account_id: 'a1',
        username: 'a',
        units: 'CHI_CUC:22',
        password_bcrypt: 'x',
        role: 'GIAM_DOC',
      },
      { mkn_account_id: 'a2', username: 'b', units: 'CHI_CUC:22', password_bcrypt: 'x', role: '' }
    );

    expect(unknown?.role).toBe('CHUYEN_VIEN');
    expect(codesOf(unknown!)).toEqual(['ROLE_DEFAULTED']);
    expect(codesOf(empty!)).toEqual(['ROLE_DEFAULTED']);
  });

  it('blocks two selected rows with the same mkn_account_id', () => {
    const [first, second] = reviewOf(
      {
        mkn_account_id: 'same',
        username: 'a',
        units: 'CHI_CUC:22',
        password_bcrypt: 'x',
        role: 'PHO',
      },
      {
        mkn_account_id: 'same',
        username: 'b',
        units: 'CHI_CUC:22',
        password_bcrypt: 'x',
        role: 'PHO',
      }
    );

    expect(codesOf(first!)).toEqual(['MKN_ID_DUPLICATE_IN_FILE']);
    expect(hasBlockingIssue(second!)).toBe(true);
  });

  it('drops an email or phone shared by two selected rows', () => {
    const shared = { email: 'same@example.com', phone: '0912 000 111', units: 'CHI_CUC:22' };
    const [first, second] = reviewOf(
      { ...shared, mkn_account_id: 'a1', username: 'a', password_bcrypt: 'x', role: 'PHO' },
      { ...shared, mkn_account_id: 'a2', username: 'b', password_bcrypt: 'x', role: 'PHO' }
    );

    expect(codesOf(first!)).toEqual(['EMAIL_DROPPED', 'PHONE_DROPPED']);
    expect(second?.email).toBeUndefined();
    expect(second?.phone).toBeUndefined();
  });
});
