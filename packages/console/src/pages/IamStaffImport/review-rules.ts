/**
 * SDVICO: các luật kiểm của bước Soát (màn "Nhập người dùng"). Mỗi luật trả một vấn đề hoặc không;
 * `checkRows` ở staff-rows.ts chạy hết theo thứ tự này.
 */
import { usernameRegEx } from '@logto/core-kit';

import { phonesIn } from './phone';
import {
  type DraftRow,
  type ImportLookup,
  type Issue,
  type MatchReason,
  type UserMatch,
} from './staff-rows';

const matchReasonTitles: Readonly<Record<MatchReason, string>> = Object.freeze({
  username: 'tên đăng nhập',
  email: 'email',
  phone: 'số điện thoại',
});

export const roleCodes = Object.freeze(['TRUONG', 'PHO', 'CHUYEN_VIEN'] as const);
export type RoleCode = (typeof roleCodes)[number];

export const toRoleCode = (role: string): RoleCode | undefined =>
  roleCodes.find((code) => code === role.toUpperCase());

export const isUnitMissing = (unit: string, lookup: ImportLookup) =>
  !lookup.organizationByUnit.has(unit) || lookup.ambiguousUnits.has(unit);

/** Dòng tạo người mới (chưa ai mang mã này, người duyệt chọn tạo). */
export const isCreating = (draft: DraftRow) => !draft.existingUserId && draft.action === 'create';

/** Dòng chỉ ghi mã hệ nguồn lên người IAM đã có. */
export const isLinking = (draft: DraftRow) => !draft.existingUserId && draft.action === 'link';

/** Dòng gán tổ chức, chức danh: tạo mới, hoặc người đã nhập từ trước. */
const isGranting = (draft: DraftRow) => !isLinking(draft);

export type BatchCount = {
  usernames: ReadonlyMap<string, number>;
  sourceIds: ReadonlyMap<string, number>;
  emails: ReadonlyMap<string, number>;
  phones: ReadonlyMap<string, number>;
  /** Người IAM được nhiều dòng chọn nối vào. */
  linkTargets: ReadonlyMap<string, number>;
};

/** Tài khoản bị khoá ở hệ nguồn: tạo trên IAM không kèm mật khẩu, để bước khoá có hỏng cũng không ai đăng nhập được. */
export const isSuspendedInSource = (draft: DraftRow) =>
  Boolean(draft.source.status) && draft.source.status.toUpperCase() !== 'ACTIVE';

/** Dữ liệu một luật kiểm cần; `email`, `phone` là giá trị sẽ gửi (đã lọc). */
type RuleContext = {
  draft: DraftRow;
  lookup: ImportLookup;
  /** Số dòng đang chọn theo từng khoá (tên đăng nhập, mã hệ nguồn), để bắt trùng trong lô. */
  batchCount: BatchCount;
  email?: string;
  phone?: string;
};

type Rule = (context: RuleContext) => Issue | undefined;

const when = (condition: boolean, value: Issue) => (condition ? value : undefined);

/** "đã nối MKN, IUU" hoặc "chưa nối hệ nào", theo `externalIds` của người IAM. */
const linkedSystemsOf = ({ user }: UserMatch) => {
  const keys = Object.keys(user.externalIds);
  return keys.length > 0 ? `đã nối ${keys.join(', ')}` : 'chưa nối hệ nào';
};

const reasonsOf = ({ reasons }: UserMatch) =>
  reasons.map((reason) => matchReasonTitles[reason]).join(', ');

/** Các luật kiểm của bước Soát, theo thứ tự hiển thị. */
export const rules: readonly Rule[] = [
  ({ draft }) =>
    when(!draft.source.sourceAccountId, {
      code: 'SOURCE_ID_MISSING',
      level: 'error',
      message: 'Thiếu account_id: không nối lại được với hệ nguồn.',
    }),
  ({ draft, lookup }) =>
    when((lookup.userIdsBySourceId.get(draft.source.sourceAccountId)?.length ?? 0) > 1, {
      code: 'SOURCE_ID_ON_MANY_USERS',
      level: 'error',
      message: `Mã ${lookup.source.key} này đang nằm trên nhiều người IAM: sửa tay cho còn một người trước khi nhập.`,
    }),
  ({ draft }) =>
    when(Boolean(draft.existingUserId), {
      code: 'ALREADY_IMPORTED',
      level: 'info',
      message:
        'Đã nhập trước đó. Chọn dòng này thì chỉ bổ sung tổ chức, chức danh; không tạo người mới.',
    }),
  ({ draft }) =>
    when(isLinking(draft) && !draft.match, {
      code: 'LINK_NO_MATCH',
      level: 'error',
      message: 'Không có người IAM nào để nối: chọn Tạo mới.',
    }),
  ({ draft: { match, existingUserId, action }, lookup }) => {
    if (!match || existingUserId) {
      return;
    }
    const lead = action === 'link' ? 'Nối vào' : 'Có thể là';
    return {
      code: action === 'link' ? 'LINK_MATCHED' : 'LINK_SUGGESTED',
      level: 'info',
      message: `${lead} người IAM "${match.user.name}" (${match.user.username}), khớp ${reasonsOf(
        match
      )}, ${linkedSystemsOf(match)}. Nối thì chỉ thêm mã ${
        lookup.source.label
      }, giữ nguyên mọi thứ khác.`,
    };
  },
  ({ draft }) =>
    when(isLinking(draft) && Boolean(draft.match?.isAmbiguous), {
      code: 'LINK_AMBIGUOUS',
      level: 'error',
      message:
        'Email hoặc số điện thoại khớp nhiều người IAM: không biết nối vào ai. Chọn Tạo mới, hoặc nối tay ở trang người dùng.',
    }),
  ({ draft, lookup }) => {
    const taken = draft.match?.user.externalIds[lookup.source.key];
    return when(isLinking(draft) && Boolean(taken), {
      code: 'LINK_TAKEN',
      level: 'error',
      message: `Người IAM này đã nối với tài khoản ${lookup.source.label} khác (${
        taken ?? ''
      }): mỗi người IAM chỉ nối một tài khoản của mỗi hệ.`,
    });
  },
  ({ draft, batchCount }) =>
    when(
      isLinking(draft) &&
        Boolean(draft.match) &&
        (batchCount.linkTargets.get(draft.match?.user.id ?? '') ?? 0) > 1,
      {
        code: 'LINK_DUPLICATE_IN_FILE',
        level: 'error',
        message: 'Dòng khác đang chọn cũng nối vào người IAM này.',
      }
    ),
  ({ draft }) =>
    when(isLinking(draft) && Boolean(draft.match) && !draft.match?.reasons.includes('username'), {
      code: 'LINK_WITHOUT_USERNAME',
      level: 'warning',
      message:
        'Không khớp tên đăng nhập: kiểm họ tên trước khi nối. Không phải cùng người thì chọn Tạo mới.',
    }),
  ({ draft }) =>
    when(
      isLinking(draft) &&
        Boolean(draft.match) &&
        !draft.match?.isAmbiguous &&
        (draft.match?.otherUserIds.length ?? 0) > 0,
      {
        code: 'LINK_OTHER_MATCH',
        level: 'warning',
        message:
          'Email hoặc số điện thoại của dòng đang thuộc một người IAM khác: kiểm kỹ trước khi nối.',
      }
    ),
  ({ draft, lookup }) =>
    when(isLinking(draft) && draft.match?.user.isInSync === false, {
      code: 'LINK_NOT_IN_SYNC',
      level: 'warning',
      message: `Người IAM này chưa thuộc tổ chức nào: IAM Sync API chưa trả về, ${lookup.source.label} chưa thấy cho tới khi được gán tổ chức.`,
    }),
  ({ draft }) =>
    when(isCreating(draft) && !usernameRegEx.test(draft.username), {
      code: 'USERNAME_INVALID',
      level: 'error',
      message: 'Tên đăng nhập chỉ nhận chữ, số, `_`, `-`, và phải bắt đầu bằng chữ hoặc `_`.',
    }),
  ({ draft }) =>
    when(
      isCreating(draft) &&
        usernameRegEx.test(draft.username) &&
        draft.username !== draft.source.username,
      {
        code: 'USERNAME_RENAMED',
        level: 'warning',
        message: `Tên đăng nhập đổi từ "${draft.source.username}" thành "${draft.username}". Báo người dùng tên mới.`,
      }
    ),
  ({ draft, lookup }) =>
    when(isCreating(draft) && lookup.userIdsByUsername.has(draft.username.toLowerCase()), {
      code: 'USERNAME_TAKEN',
      level: 'error',
      message: 'Tên đăng nhập đã có người khác dùng trên IAM: đổi tên, hoặc nối vào người đó.',
    }),
  ({ draft, batchCount }) =>
    when(isCreating(draft) && (batchCount.usernames.get(draft.username.toLowerCase()) ?? 0) > 1, {
      code: 'USERNAME_DUPLICATE_IN_FILE',
      level: 'error',
      message: 'Trùng tên đăng nhập với dòng khác đang chọn.',
    }),
  ({ draft, batchCount, lookup }) =>
    when((batchCount.sourceIds.get(draft.source.sourceAccountId) ?? 0) > 1, {
      code: 'SOURCE_ID_DUPLICATE_IN_FILE',
      level: 'error',
      message: `Trùng account_id với dòng khác đang chọn: một tài khoản ${lookup.source.label} chỉ nối với một người IAM.`,
    }),
  ({ draft, email }) =>
    when(isCreating(draft) && Boolean(draft.source.email) && !email, {
      code: 'EMAIL_DROPPED',
      level: 'warning',
      message: `Bỏ email "${draft.source.email}": sai định dạng hoặc đã có người dùng.`,
    }),
  ({ draft, phone }) =>
    when(isCreating(draft) && Boolean(draft.source.phone) && !phone, {
      code: 'PHONE_DROPPED',
      level: 'warning',
      message: `Bỏ số điện thoại "${draft.source.phone}": sai định dạng hoặc đã có người dùng.`,
    }),
  ({ draft, phone }) =>
    when(isCreating(draft) && Boolean(phone) && phonesIn(draft.source.phone).length > 1, {
      code: 'PHONE_EXTRA',
      level: 'info',
      message: `Ô số điện thoại "${draft.source.phone}" có nhiều số, chỉ lưu ${phone ?? ''}.`,
    }),
  ({ draft, lookup }) => {
    const missing = draft.source.units.filter((unit) => isUnitMissing(unit, lookup));
    return when(isGranting(draft) && missing.length > 0, {
      code: 'UNIT_NOT_FOUND',
      level: 'warning',
      message: `Không tìm thấy tổ chức cho ${missing.join(', ')}; chọn tay nếu cần.`,
    });
  },
  ({ draft }) =>
    when(isGranting(draft) && draft.organizations.length === 0, {
      code: 'NO_UNIT',
      level: 'warning',
      message:
        'Chưa có tổ chức nào: người dùng không có quyền ở các hệ, và IAM Sync API chưa trả về người này.',
    }),
  ({ draft }) =>
    when(isGranting(draft) && !toRoleCode(draft.source.role) && draft.role === 'CHUYEN_VIEN', {
      code: 'ROLE_DEFAULTED',
      level: 'warning',
      message: `Chức danh "${draft.source.role}" trong tệp không nhận ra; đang dùng Chuyên viên, chọn lại nếu cần.`,
    }),
  ({ draft, lookup }) =>
    when(isGranting(draft) && !lookup.roleIdByCode.has(draft.role), {
      code: 'ROLE_UNKNOWN',
      level: 'error',
      message: `Chưa có vai trò tổ chức cho mã ${draft.role}.`,
    }),
  ({ draft }) =>
    when(isCreating(draft) && !draft.source.passwordBcrypt, {
      code: 'NO_PASSWORD',
      level: 'info',
      message: 'Không có mật khẩu: người dùng phải đặt mật khẩu mới trên IAM.',
    }),
  ({ draft, lookup }) =>
    when(isSuspendedInSource(draft), {
      code: 'SUSPENDED',
      level: 'info',
      message: isLinking(draft)
        ? `Trạng thái ở ${lookup.source.label}: ${draft.source.status}. Nối không đổi trạng thái của người IAM.`
        : `Trạng thái ở ${lookup.source.label}: ${draft.source.status}. Tài khoản IAM sẽ bị khoá và nhập không kèm mật khẩu.`,
    }),
  ({ draft }) =>
    when(Boolean(draft.source.note), {
      code: 'EXPORT_NOTE',
      level: 'info',
      message: `Ghi chú khi xuất: ${draft.source.note}`,
    }),
];
