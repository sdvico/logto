/**
 * SDVICO: dòng người dùng đọc từ tệp xuất của một hệ tích hợp (MKN: `export-staff-to-iam.js`), và phần
 * "biết dòng nào sai" của bước Soát. Hàm thuần, không gọi API: trạng thái hiện có của Logto đi vào qua
 * `ImportLookup`.
 */
import { emailRegEx, phoneRegEx, usernameRegEx } from '@logto/core-kit';
import { z } from 'zod';

import { parseCsv } from './csv';
import { countKeys } from './group';
import {
  type BatchCount,
  isCreating,
  isLinking,
  isUnitMissing,
  type RoleCode,
  rules,
  toRoleCode,
} from './review-rules';

/** Cột bắt buộc của tệp chung cho mọi hệ. */
export const requiredColumns = Object.freeze([
  'account_id',
  'username',
  'full_name',
  'email',
  'phone',
  'status',
  'password_bcrypt',
  'units',
  'role',
  'source_groups',
  'source_scopes',
  'note',
] as const);

/** Cột chỉ để đọc, giúp soát; tệp không có thì để trống. */
export const optionalColumns = Object.freeze([
  'agency_name',
  'unit_names',
  'scope_places',
  'role_title',
] as const);

type Column = (typeof requiredColumns)[number] | (typeof optionalColumns)[number];

/** Tên cột cũ của tệp MKN (trước khi có tên chung) vẫn nhận. */
const legacyColumnNames: Readonly<Record<string, Column>> = Object.freeze({
  mkn_account_id: 'account_id',
  mkn_groups: 'source_groups',
  mkn_scopes: 'source_scopes',
  mkn_scope_places: 'scope_places',
});

const columnOf = (name: string): string => legacyColumnNames[name] ?? name;

type StaffRow = {
  /** Số dòng trong tệp (dòng tiêu đề là 1), dùng làm khoá ổn định. */
  line: number;
  /** Mã tài khoản ở hệ nguồn, lưu vào `externalIds.<khoá hệ>`. */
  sourceAccountId: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  passwordBcrypt: string;
  /** `LOẠI` hoặc `LOẠI:mã`, vd `CHI_CUC:22`, `DON_BP:TKSCR`, `CUC`. */
  units: string[];
  role: string;
  sourceGroups: string;
  sourceScopes: string;
  note: string;
  /** Đơn vị ghi trong tài khoản ở hệ nguồn, vd "BQL cảng cá Tam Quan". */
  agencyName: string;
  /** Tên đơn vị IAM mà script đã suy ra, vd "Cảng cá Tam Quan · Gia Lai". */
  unitNames: string;
  /** Vị trí các phạm vi đang có ở hệ nguồn, kèm mức. */
  scopePlaces: string;
  /** Tên chức danh mặc định theo loại đơn vị, vd "Nhân viên". */
  roleTitle: string;
};

const tryParseCsv = (text: string): { cells: string[][]; error?: string } => {
  try {
    return { cells: parseCsv(text) };
  } catch (error: unknown) {
    return { cells: [], error: error instanceof Error ? error.message : String(error) };
  }
};

export const parseStaffFile = (text: string): { rows: StaffRow[]; error?: string } => {
  const { cells: lines, error } = tryParseCsv(text);

  if (error) {
    return { rows: [], error };
  }

  const [header, ...body] = lines;

  if (!header) {
    return { rows: [], error: 'Tệp rỗng.' };
  }

  const columns = header.map((name) => columnOf(name.trim()));
  const repeated = columns.filter((column, index) => columns.indexOf(column) !== index);

  if (repeated.length > 0) {
    return {
      rows: [],
      error: `Tệp có cột trùng (tính cả tên cũ mkn_*): ${[...new Set(repeated)].join(', ')}.`,
    };
  }

  const indexOf = new Map(columns.map((column, index) => [column, index]));
  const missing = requiredColumns.filter((column) => !indexOf.has(column));

  if (missing.length > 0) {
    return {
      rows: [],
      error: `Tệp thiếu cột: ${missing.join(', ')}.`,
    };
  }

  const cell = (cells: string[], column: Column) => (cells[indexOf.get(column) ?? -1] ?? '').trim();

  return {
    rows: body.map((cells, index) => ({
      line: index + 2,
      sourceAccountId: cell(cells, 'account_id'),
      username: cell(cells, 'username'),
      fullName: cell(cells, 'full_name'),
      email: cell(cells, 'email'),
      phone: cell(cells, 'phone'),
      status: cell(cells, 'status'),
      passwordBcrypt: cell(cells, 'password_bcrypt'),
      units: cell(cells, 'units')
        .split(';')
        .map((unit) => unit.trim())
        .filter(Boolean),
      role: cell(cells, 'role'),
      sourceGroups: cell(cells, 'source_groups'),
      sourceScopes: cell(cells, 'source_scopes'),
      note: cell(cells, 'note'),
      agencyName: cell(cells, 'agency_name'),
      unitNames: cell(cells, 'unit_names'),
      scopePlaces: cell(cells, 'scope_places'),
      roleTitle: cell(cells, 'role_title'),
    })),
  };
};

/** Tổ chức Logto tra theo khoá đơn vị (`LOẠI` hoặc `LOẠI:mã`). */
export type ImportOrganization = {
  id: string;
  name: string;
  /** Tên chức danh theo mã ở loại đơn vị này (`custom_data.roleTitles`), vd `{ TRUONG: 'Đồn trưởng' }`. */
  roleTitles?: Readonly<Record<string, string>>;
};

/** Người dùng đã có trên IAM, đủ để soát việc nối. */
export type ImportUser = {
  id: string;
  name: string;
  username: string;
  /** `custom_data.externalIds`: mã của người này ở từng hệ. */
  externalIds: Readonly<Record<string, string>>;
  /** Thuộc ít nhất một tổ chức, nên IAM Sync API trả về. */
  isInSync: boolean;
};

/** Hệ nguồn đã chọn ở bước 1 (từ Hệ tích hợp). */
export type ImportSource = { key: string; label: string };

/** Trạng thái Logto mà bước Soát cần. Khoá chữ đã đưa về chữ thường. */
export type ImportLookup = {
  source: ImportSource;
  users: ReadonlyMap<string, ImportUser>;
  /** Mã ở hệ nguồn → các người IAM đang mang mã đó (đúng ra tối đa một). */
  userIdsBySourceId: ReadonlyMap<string, readonly string[]>;
  userIdsByUsername: ReadonlyMap<string, readonly string[]>;
  userIdsByEmail: ReadonlyMap<string, readonly string[]>;
  userIdsByPhone: ReadonlyMap<string, readonly string[]>;
  organizationByUnit: ReadonlyMap<string, ImportOrganization>;
  /** Khoá đơn vị khớp nhiều tổ chức: không chọn bừa. */
  ambiguousUnits: ReadonlySet<string>;
  roleIdByCode: ReadonlyMap<string, string>;
};

/** Loại đơn vị mà mã là `sourceCode` (đồn, cảng); các loại khác dùng `provinceCode` nếu có. */
const sourceCodeTypes = new Set(['DON_BP', 'CANG']);

const unitCustomDataGuard = z.object({
  type: z.string(),
  provinceCode: z.string().optional(),
  sourceCode: z.string().optional(),
});

/** Khoá đơn vị của một tổ chức Logto, theo `custom_data` do seed-organizations.sql ghi. */
export const unitKeyOf = (customData: unknown): string | undefined => {
  const parsed = unitCustomDataGuard.safeParse(customData);

  if (!parsed.success) {
    return undefined;
  }

  const { type, provinceCode, sourceCode } = parsed.data;
  const code = sourceCodeTypes.has(type) ? sourceCode : provinceCode;

  return code === undefined ? type : `${type}:${code}`;
};

/** Tên hợp lệ với Logto (`^[A-Z_a-z][\w-]*$`): đổi ký tự lạ thành `_`, đầu không phải chữ hoặc `_` thì thêm `u_`. */
export const suggestUsername = (username: string) => {
  const replaced = username.replaceAll(/[^\w-]/g, '_');
  return /^[A-Z_a-z]/.test(replaced) ? replaced : `u_${replaced}`;
};

/** Bỏ khoảng trắng, chấm, gạch, ngoặc và dấu `+` đầu; Logto chỉ nhận chữ số. */
export const normalizePhone = (phone: string) =>
  phone.replaceAll(/[\s().-]/g, '').replace(/^\+/, '');

/** `error` chặn dòng; `warning` vẫn chạy được nhưng có mất mát; `info` để người duyệt biết. */
export type Issue = { code: string; level: 'error' | 'warning' | 'info'; message: string };

/** Lý do coi một người IAM là cùng người với dòng tệp. */
export type MatchReason = 'username' | 'email' | 'phone';

/** Người IAM khớp với dòng tệp, để nối thay vì tạo mới. */
export type UserMatch = {
  user: ImportUser;
  reasons: MatchReason[];
  /** Người IAM khác cũng khớp một khoá của dòng. */
  otherUserIds: string[];
  /**
   * Không nối được vì không rõ là ai: email hoặc số điện thoại trùng nhiều người IAM, hoặc khớp nhiều
   * người mà không ai khớp tên đăng nhập.
   */
  isAmbiguous: boolean;
};

/** `create` tạo người mới; `link` chỉ ghi mã hệ nguồn lên người IAM đã có. */
type RowAction = 'create' | 'link';

/** Dòng nháp ở bước Soát: dòng tệp + phần người duyệt sửa + kết quả tra Logto. */
export type DraftRow = {
  source: StaffRow;
  include: boolean;
  action: RowAction;
  match?: UserMatch;
  username: string;
  role: RoleCode;
  /** Tổ chức Logto sẽ thêm người vào (đã tra từ `units`, người duyệt thêm hoặc bỏ được). */
  organizations: ImportOrganization[];
  email?: string;
  phone?: string;
  issues: Issue[];
  /** Đã có người Logto mang `externalIds.<khoá hệ>` này: chạy thì chỉ bổ sung tổ chức, vai trò. */
  existingUserId?: string;
};

/** Người đi kèm một khoá tra; khoá trống thì không có ai. */
const idsOf = (index: ReadonlyMap<string, readonly string[]>, key: string) =>
  key ? (index.get(key) ?? []) : [];

/**
 * Người IAM khớp dòng tệp. Tên đăng nhập là khoá chính: khớp thì nối mặc định. Email, số điện thoại chỉ
 * là gợi ý (dữ liệu thật có người dùng chung email); trùng nhiều người thì đánh dấu để chặn nối.
 */
const findMatch = (row: StaffRow, lookup: ImportLookup): UserMatch | undefined => {
  const byReason: Array<[MatchReason, readonly string[]]> = [
    ['username', idsOf(lookup.userIdsByUsername, row.username.toLowerCase())],
    ['email', idsOf(lookup.userIdsByEmail, row.email.toLowerCase())],
    ['phone', idsOf(lookup.userIdsByPhone, normalizePhone(row.phone))],
  ];
  const [candidateId] = byReason.flatMap(([, ids]) => ids);
  const user = candidateId === undefined ? undefined : lookup.users.get(candidateId);

  if (!user) {
    return undefined;
  }

  const reasons = byReason.filter(([, ids]) => ids.includes(user.id)).map(([reason]) => reason);
  const otherUserIds = [
    ...new Set(byReason.flatMap(([, ids]) => ids).filter((id) => id !== user.id)),
  ];

  return {
    user,
    reasons,
    otherUserIds,
    isAmbiguous:
      // Trùng nhiều người kể cả tên đăng nhập (Logto có thể phân biệt hoa thường): không nối tự động.
      byReason.some(([, ids]) => ids.length > 1) ||
      (!reasons.includes('username') && otherUserIds.length > 0),
  };
};

/** Dòng nháp ban đầu từ một dòng tệp. Lỗi tính riêng ở `checkRows` vì có lỗi phụ thuộc cả lô. */
export const draftFromRow = (row: StaffRow, lookup: ImportLookup): DraftRow => {
  const [existingUserId] = idsOf(lookup.userIdsBySourceId, row.sourceAccountId);
  const match = existingUserId ? undefined : findMatch(row, lookup);

  return {
    source: row,
    include: !existingUserId,
    // Chỉ tự nối khi khớp tên đăng nhập; khớp email, số điện thoại thì người duyệt tự chọn nối.
    action: match?.reasons.includes('username') ? 'link' : 'create',
    ...(match ? { match } : {}),
    username: usernameRegEx.test(row.username) ? row.username : suggestUsername(row.username),
    role: toRoleCode(row.role) ?? 'CHUYEN_VIEN',
    organizations: row.units.flatMap((unit) => {
      const organization = lookup.organizationByUnit.get(unit);
      return organization && !isUnitMissing(unit, lookup) ? [organization] : [];
    }),
    issues: [],
    existingUserId,
  };
};

/** Email dùng được: đúng định dạng, chưa ai trên IAM dùng, không trùng dòng khác đang chọn. */
const usableEmail = (email: string, lookup: ImportLookup, batchCount: BatchCount) => {
  const key = email.toLowerCase();
  return emailRegEx.test(email) &&
    !lookup.userIdsByEmail.has(key) &&
    (batchCount.emails.get(key) ?? 0) <= 1
    ? email
    : undefined;
};

const usablePhone = (raw: string, lookup: ImportLookup, batchCount: BatchCount) => {
  const phone = normalizePhone(raw);
  return phoneRegEx.test(phone) &&
    !lookup.userIdsByPhone.has(phone) &&
    (batchCount.phones.get(phone) ?? 0) <= 1
    ? phone
    : undefined;
};

const issueKey = (issues: readonly Issue[]) =>
  issues.map(({ code, message }) => `${code}:${message}`).join('|');

const isSameCheck = (before: DraftRow, after: DraftRow) =>
  before.username === after.username &&
  before.email === after.email &&
  before.phone === after.phone &&
  issueKey(before.issues) === issueKey(after.issues);

/** Tính lại lỗi cho cả lô (trùng chỉ tính giữa các dòng đang chọn); trả mảng dòng mới. */
export const checkRows = (drafts: readonly DraftRow[], lookup: ImportLookup): DraftRow[] => {
  const selected = drafts.filter(({ include }) => include);
  const creating = selected.filter((draft) => isCreating(draft));
  const batchCount: BatchCount = {
    usernames: countKeys(creating.map(({ username }) => username.trim().toLowerCase())),
    sourceIds: countKeys(selected.map(({ source }) => source.sourceAccountId)),
    emails: countKeys(creating.map(({ source }) => source.email.toLowerCase())),
    phones: countKeys(creating.map(({ source }) => normalizePhone(source.phone))),
    linkTargets: countKeys(
      selected.flatMap((draft) => (isLinking(draft) && draft.match ? [draft.match.user.id] : []))
    ),
  };

  return drafts.map((current) => {
    const draft = { ...current, username: current.username.trim() };
    const email = usableEmail(draft.source.email, lookup, batchCount);
    const phone = usablePhone(draft.source.phone, lookup, batchCount);
    const context = { draft, lookup, batchCount, email, phone };
    const checked = {
      ...draft,
      email,
      phone,
      issues: rules.flatMap((rule) => rule(context) ?? []),
    };

    // Giữ nguyên đối tượng cũ khi không đổi gì, để thẻ dòng (memo) không vẽ lại cả danh sách.
    return isSameCheck(current, checked) ? current : checked;
  });
};

/**
 * Tên chức danh thật theo tổ chức đã chọn (`custom_data.roleTitles`), vd "Đồn trưởng"; chưa có tổ chức
 * thì dùng tên trong tệp khi người duyệt chưa đổi chức danh.
 */
export const roleTitleOf = (draft: DraftRow) => {
  const titles = [
    ...new Set(
      draft.organizations.flatMap(({ roleTitles }) => {
        const title = roleTitles?.[draft.role];
        return title ? [title] : [];
      })
    ),
  ];

  if (titles.length > 0) {
    return titles.join(', ');
  }

  return draft.role === draft.source.role.toUpperCase() ? draft.source.roleTitle : '';
};

export const hasBlockingIssue = (draft: DraftRow) =>
  draft.issues.some(({ level }) => level === 'error');
