/**
 * SDVICO: các luật kiểm của bước Soát (màn "Nhập cán bộ từ MKN"). Mỗi luật trả một vấn đề hoặc không;
 * `checkRows` ở staff-rows.ts chạy hết theo thứ tự này.
 */
import { usernameRegEx } from '@logto/core-kit';

import { type DraftRow, type ImportLookup, type Issue } from './staff-rows';

export const roleCodes = Object.freeze(['TRUONG', 'PHO', 'CHUYEN_VIEN'] as const);
export type RoleCode = (typeof roleCodes)[number];

export const toRoleCode = (role: string): RoleCode | undefined =>
  roleCodes.find((code) => code === role.toUpperCase());

export const isUnitMissing = (unit: string, lookup: ImportLookup) =>
  !lookup.organizationByUnit.has(unit) || lookup.ambiguousUnits.has(unit);

export type BatchCount = {
  usernames: ReadonlyMap<string, number>;
  mknIds: ReadonlyMap<string, number>;
  emails: ReadonlyMap<string, number>;
  phones: ReadonlyMap<string, number>;
};

/** Tài khoản bị khoá ở MKN: tạo trên IAM không kèm mật khẩu, để bước khoá có hỏng cũng không ai đăng nhập được. */
export const isSuspendedInMkn = (draft: DraftRow) =>
  Boolean(draft.source.status) && draft.source.status !== 'ACTIVE';

/** Dữ liệu một luật kiểm cần; `email`, `phone` là giá trị sẽ gửi (đã lọc). */
type RuleContext = {
  draft: DraftRow;
  lookup: ImportLookup;
  /** Số dòng đang chọn theo từng khoá (tên đăng nhập, mã MKN), để bắt trùng trong lô. */
  batchCount: BatchCount;
  email?: string;
  phone?: string;
};

type Rule = (context: RuleContext) => Issue | undefined;

const when = (condition: boolean, value: Issue) => (condition ? value : undefined);

/** Các luật kiểm của bước Soát, theo thứ tự hiển thị. */
export const rules: readonly Rule[] = [
  ({ draft }) =>
    when(!draft.source.mknAccountId, {
      code: 'MKN_ID_MISSING',
      level: 'error',
      message: 'Thiếu mkn_account_id: không nối lại được với MKN.',
    }),
  ({ draft }) =>
    when(Boolean(draft.existingUserId), {
      code: 'ALREADY_IMPORTED',
      level: 'info',
      message:
        'Đã nhập trước đó. Chọn dòng này thì chỉ bổ sung tổ chức, chức danh; không tạo người mới.',
    }),
  ({ draft }) =>
    when(!usernameRegEx.test(draft.username), {
      code: 'USERNAME_INVALID',
      level: 'error',
      message: 'Tên đăng nhập chỉ nhận chữ, số, `_`, `-`, và phải bắt đầu bằng chữ hoặc `_`.',
    }),
  ({ draft }) =>
    when(usernameRegEx.test(draft.username) && draft.username !== draft.source.username, {
      code: 'USERNAME_RENAMED',
      level: 'warning',
      message: `Tên đăng nhập đổi từ "${draft.source.username}" thành "${draft.username}": Logto không nhận ".", khoảng trắng, hoặc ký tự đầu là số hay "-". Báo cán bộ tên mới.`,
    }),
  ({ draft, lookup }) =>
    when(!draft.existingUserId && lookup.usernames.has(draft.username.toLowerCase()), {
      code: 'USERNAME_TAKEN',
      level: 'error',
      message: 'Tên đăng nhập đã có người khác dùng trên IAM.',
    }),
  ({ draft, batchCount }) =>
    when((batchCount.usernames.get(draft.username.toLowerCase()) ?? 0) > 1, {
      code: 'USERNAME_DUPLICATE_IN_FILE',
      level: 'error',
      message: 'Trùng tên đăng nhập với dòng khác đang chọn.',
    }),
  ({ draft, batchCount }) =>
    when((batchCount.mknIds.get(draft.source.mknAccountId) ?? 0) > 1, {
      code: 'MKN_ID_DUPLICATE_IN_FILE',
      level: 'error',
      message:
        'Trùng mkn_account_id với dòng khác đang chọn: một tài khoản MKN chỉ nối với một người IAM.',
    }),
  ({ draft, email }) =>
    when(!draft.existingUserId && Boolean(draft.source.email) && !email, {
      code: 'EMAIL_DROPPED',
      level: 'warning',
      message: `Bỏ email "${draft.source.email}": sai định dạng hoặc đã có người dùng.`,
    }),
  ({ draft, phone }) =>
    when(!draft.existingUserId && Boolean(draft.source.phone) && !phone, {
      code: 'PHONE_DROPPED',
      level: 'warning',
      message: `Bỏ số điện thoại "${draft.source.phone}": sai định dạng hoặc đã có người dùng.`,
    }),
  ({ draft, lookup }) => {
    const missing = draft.source.units.filter((unit) => isUnitMissing(unit, lookup));
    return when(missing.length > 0, {
      code: 'UNIT_NOT_FOUND',
      level: 'warning',
      message: `Không tìm thấy tổ chức cho ${missing.join(', ')}; chọn tay nếu cần.`,
    });
  },
  ({ draft }) =>
    when(draft.organizations.length === 0, {
      code: 'NO_UNIT',
      level: 'warning',
      message: 'Chưa có tổ chức nào: người dùng sẽ không có quyền ở các hệ.',
    }),
  ({ draft }) =>
    when(!toRoleCode(draft.source.role) && draft.role === 'CHUYEN_VIEN', {
      code: 'ROLE_DEFAULTED',
      level: 'warning',
      message: `Chức danh "${draft.source.role}" trong tệp không nhận ra; đang dùng Chuyên viên, chọn lại nếu cần.`,
    }),
  ({ draft, lookup }) =>
    when(!lookup.roleIdByCode.has(draft.role), {
      code: 'ROLE_UNKNOWN',
      level: 'error',
      message: `Chưa có vai trò tổ chức cho mã ${draft.role}.`,
    }),
  ({ draft }) =>
    when(!draft.existingUserId && !draft.source.passwordBcrypt, {
      code: 'NO_PASSWORD',
      level: 'info',
      message: 'Không có mật khẩu: cán bộ phải đặt mật khẩu mới trên IAM.',
    }),
  ({ draft }) =>
    when(isSuspendedInMkn(draft), {
      code: 'SUSPENDED',
      level: 'info',
      message: `Trạng thái MKN ${draft.source.status}: tài khoản IAM sẽ bị khoá và nhập không kèm mật khẩu.`,
    }),
  ({ draft }) =>
    when(Boolean(draft.source.note), {
      code: 'EXPORT_NOTE',
      level: 'info',
      message: `Ghi chú khi xuất: ${draft.source.note}`,
    }),
];
