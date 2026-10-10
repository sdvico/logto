/**
 * SDVICO: dòng cán bộ đọc từ tệp `export-staff-to-iam.js` của MKN, và phần "biết dòng nào sai" của bước
 * Soát. Hàm thuần, không gọi API: trạng thái hiện có của Logto đi vào qua `ImportLookup`.
 */
import { emailRegEx, phoneRegEx, usernameRegEx } from '@logto/core-kit';
import { z } from 'zod';

import { parseCsv } from './csv';
import { type BatchCount, isUnitMissing, type RoleCode, rules, toRoleCode } from './review-rules';

/** Cột bắt buộc của tệp, đúng tên `COLUMNS` trong script xuất bên MKN. */
export const requiredColumns = Object.freeze([
  'mkn_account_id',
  'username',
  'full_name',
  'email',
  'phone',
  'status',
  'password_bcrypt',
  'units',
  'role',
  'mkn_groups',
  'mkn_scopes',
  'note',
] as const);

/** Cột chỉ để đọc, thêm sau (10/10); tệp cũ không có thì để trống. */
const optionalColumns = Object.freeze([
  'agency_name',
  'unit_names',
  'mkn_scope_places',
  'role_title',
] as const);

type Column = (typeof requiredColumns)[number] | (typeof optionalColumns)[number];

type StaffRow = {
  /** Số dòng trong tệp (dòng tiêu đề là 1), dùng làm khoá ổn định. */
  line: number;
  mknAccountId: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  passwordBcrypt: string;
  /** `LOẠI` hoặc `LOẠI:mã`, vd `CHI_CUC:22`, `DON_BP:TKSCR`, `CUC`. */
  units: string[];
  role: string;
  mknGroups: string;
  mknScopes: string;
  note: string;
  /** Đơn vị ghi trong tài khoản MKN, vd "BQL cảng cá Tam Quan". */
  agencyName: string;
  /** Tên đơn vị IAM mà script đã suy ra, vd "Cảng cá Tam Quan · Gia Lai". */
  unitNames: string;
  /** Vị trí các phạm vi đang có ở MKN, kèm mức. */
  mknScopePlaces: string;
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

  const indexOf = new Map(header.map((name, index) => [name.trim(), index]));
  const missing = requiredColumns.filter((column) => !indexOf.has(column));

  if (missing.length > 0) {
    return {
      rows: [],
      error: `Tệp thiếu cột: ${missing.join(', ')}. Hãy dùng tệp do export-staff-to-iam.js sinh ra.`,
    };
  }

  const cell = (cells: string[], column: Column) => (cells[indexOf.get(column) ?? -1] ?? '').trim();

  return {
    rows: body.map((cells, index) => ({
      line: index + 2,
      mknAccountId: cell(cells, 'mkn_account_id'),
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
      mknGroups: cell(cells, 'mkn_groups'),
      mknScopes: cell(cells, 'mkn_scopes'),
      note: cell(cells, 'note'),
      agencyName: cell(cells, 'agency_name'),
      unitNames: cell(cells, 'unit_names'),
      mknScopePlaces: cell(cells, 'mkn_scope_places'),
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

/** Trạng thái Logto mà bước Soát cần. Khoá chữ đã đưa về chữ thường. */
export type ImportLookup = {
  userIdByMknId: ReadonlyMap<string, string>;
  usernames: ReadonlySet<string>;
  emails: ReadonlySet<string>;
  phones: ReadonlySet<string>;
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

/** Dòng nháp ở bước Soát: dòng tệp + phần người duyệt sửa + kết quả tra Logto. */
export type DraftRow = {
  source: StaffRow;
  include: boolean;
  username: string;
  role: RoleCode;
  /** Tổ chức Logto sẽ thêm người vào (đã tra từ `units`, người duyệt thêm hoặc bỏ được). */
  organizations: ImportOrganization[];
  email?: string;
  phone?: string;
  issues: Issue[];
  /** Đã có người Logto mang `externalIds.mkn` này: chạy thì chỉ bổ sung tổ chức, vai trò. */
  existingUserId?: string;
};

/** Dòng nháp ban đầu từ một dòng tệp. Lỗi tính riêng ở `checkRows` vì có lỗi phụ thuộc cả lô. */
export const draftFromRow = (row: StaffRow, lookup: ImportLookup): DraftRow => {
  const existingUserId = lookup.userIdByMknId.get(row.mknAccountId);

  return {
    source: row,
    include: !existingUserId,
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
  return emailRegEx.test(email) && !lookup.emails.has(key) && (batchCount.emails.get(key) ?? 0) <= 1
    ? email
    : undefined;
};

const usablePhone = (raw: string, lookup: ImportLookup, batchCount: BatchCount) => {
  const phone = normalizePhone(raw);
  return phoneRegEx.test(phone) &&
    !lookup.phones.has(phone) &&
    (batchCount.phones.get(phone) ?? 0) <= 1
    ? phone
    : undefined;
};

const countBy = (keys: readonly string[]) =>
  keys
    .filter(Boolean)
    .reduce(
      (count, key) => new Map(count).set(key, (count.get(key) ?? 0) + 1),
      new Map<string, number>()
    );

/** Tính lại lỗi cho cả lô (trùng chỉ tính giữa các dòng đang chọn); trả mảng dòng mới. */
export const checkRows = (drafts: readonly DraftRow[], lookup: ImportLookup): DraftRow[] => {
  const selected = drafts.filter(({ include }) => include);
  const batchCount: BatchCount = {
    usernames: countBy(selected.map(({ username }) => username.trim().toLowerCase())),
    mknIds: countBy(selected.map(({ source }) => source.mknAccountId)),
    emails: countBy(selected.map(({ source }) => source.email.toLowerCase())),
    phones: countBy(selected.map(({ source }) => normalizePhone(source.phone))),
  };

  return drafts.map((current) => {
    const draft = { ...current, username: current.username.trim() };
    const email = usableEmail(draft.source.email, lookup, batchCount);
    const phone = usablePhone(draft.source.phone, lookup, batchCount);
    const context = { draft, lookup, batchCount, email, phone };

    return {
      ...draft,
      email,
      phone,
      issues: rules.flatMap((rule) => rule(context) ?? []),
    };
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
