/**
 * SDVICO: "Hệ tích hợp" — mỗi hệ (MKN, IUU, CBVMS, …) có một app đồng bộ (M2M) và một app đăng nhập.
 * Cấu hình nằm ngay trên `custom_data` của hai app, không thêm bảng:
 * - app đồng bộ: `iamSystem = { key, label, description?, loginAppId? }` — bản ghi của hệ;
 * - app đăng nhập: `iamLogin = { mode, unitTypes }` — ai được đăng nhập. `blocked` do core chặn
 *   (`isApplicationSignInBlocked`), `limited` ghi thành luật kiểm soát truy cập của Logto.
 * Các hàm ở đây là hàm thuần; gọi API nằm ở `system-api.ts`.
 */
import { z } from 'zod';

const iamSystemGuard = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
  loginAppId: z.string().optional(),
});

export type IamSystem = z.infer<typeof iamSystemGuard>;

export const loginModes = Object.freeze(['open', 'limited', 'blocked'] as const);
type LoginMode = (typeof loginModes)[number];

const iamLoginGuard = z.object({
  mode: z.enum(loginModes),
  unitTypes: z.string().array().default([]),
});

export type IamLogin = z.infer<typeof iamLoginGuard>;

const systemCustomDataGuard = z.object({ iamSystem: iamSystemGuard });
const loginCustomDataGuard = z.object({ iamLogin: iamLoginGuard });

export const parseIamSystem = (customData: unknown): IamSystem | undefined => {
  const parsed = systemCustomDataGuard.safeParse(customData);
  return parsed.success ? parsed.data.iamSystem : undefined;
};

/** App đăng nhập chưa khai báo thì coi như mở cho mọi tài khoản (đúng mặc định của Logto). */
export const parseIamLogin = (customData: unknown): IamLogin => {
  const parsed = loginCustomDataGuard.safeParse(customData);
  return parsed.success ? parsed.data.iamLogin : { mode: 'open', unitTypes: [] };
};

export const loginModeTitles: Readonly<Record<LoginMode, string>> = Object.freeze({
  open: 'Mọi tài khoản IAM',
  limited: 'Giới hạn theo loại đơn vị',
  blocked: 'Chặn toàn bộ',
});

/** Khoá trong `external_ids`: chữ thường, số, gạch dưới, bắt đầu bằng chữ. */
export const isSystemKeyValid = (key: string) => /^[a-z][\d_a-z]{1,31}$/.test(key);

/** Lỗi của khoá mới, hoặc `undefined` nếu dùng được. */
export const checkSystemKey = (key: string, usedKeys: ReadonlySet<string>) => {
  if (!isSystemKeyValid(key)) {
    return 'Khoá 2–32 ký tự: chữ thường, số, gạch dưới, bắt đầu bằng chữ.';
  }
  if (usedKeys.has(key)) {
    return `Khoá "${key}" đã có hệ khác dùng.`;
  }
};

/** Tên loại đơn vị để hiển thị; loại mới chưa có tên thì hiện mã. */
const unitTypeLabels: Readonly<Record<string, string>> = Object.freeze({
  CUC: 'Cục',
  KN_VUNG: 'Chi cục Kiểm ngư vùng',
  CHI_CUC: 'Chi cục Thủy sản',
  BDBP_TINH: 'Ban Chỉ huy BĐBP tỉnh',
  DON_BP: 'Đồn, trạm biên phòng',
  BQL_CANG: 'Ban quản lý cảng cá',
  CANG: 'Cảng cá',
});

export const unitTypeLabel = (type: string) => unitTypeLabels[type] ?? type;

/** Nút gom của cây tổ chức, không có người nên không đưa vào lựa chọn. */
const groupingUnitTypes: ReadonlySet<string> = new Set(['ROOT', 'TINH']);

type SystemOrganization = { id: string; type?: string };

const unitTypeGuard = z.object({ type: z.string() });

export const unitTypeOf = (customData: unknown): string | undefined => {
  const parsed = unitTypeGuard.safeParse(customData);
  return parsed.success ? parsed.data.type : undefined;
};

/** Các loại đơn vị đang có trong cây tổ chức, theo thứ tự xuất hiện. */
export const availableUnitTypes = (organizations: readonly SystemOrganization[]) => [
  ...new Set(
    organizations.flatMap(({ type }) => (type && !groupingUnitTypes.has(type) ? [type] : []))
  ),
];

/** Danh sách tổ chức cho luật kiểm soát truy cập: mọi tổ chức thuộc các loại đã chọn. */
export const organizationIdsForUnitTypes = (
  organizations: readonly SystemOrganization[],
  unitTypes: readonly string[]
) =>
  organizations
    .filter(({ type }) => type !== undefined && unitTypes.includes(type))
    .map(({ id }) => id)
    .slice()
    .sort();

/** Người dùng như IAM Sync API trả (chỉ phần cần để đếm). */
export type SyncUserSummary = {
  username: string | undefined;
  organizations: Array<{ id: string; type?: string }>;
  external_ids?: Record<string, string>;
};

/** Ai được đăng nhập theo cấu hình, để thấy hậu quả trước khi lưu. */
export const splitBySignIn = (users: readonly SyncUserSummary[], login: IamLogin) => {
  const isAllowed = (user: SyncUserSummary) => {
    if (login.mode === 'blocked') {
      return false;
    }
    if (login.mode === 'open') {
      return true;
    }
    return user.organizations.some(
      ({ type }) => type !== undefined && login.unitTypes.includes(type)
    );
  };

  return {
    allowed: users.filter((user) => isAllowed(user)),
    denied: users.filter((user) => !isAllowed(user)),
  };
};

export const countLinked = (users: readonly SyncUserSummary[], key: string) =>
  users.filter(({ external_ids }) => Boolean(external_ids?.[key])).length;

type ConfigInput = {
  tenantEndpoint?: string;
  tenantId: string;
  key: string;
  loginAppId?: string;
  redirectUri?: string;
  syncAppId: string;
};

/** Khối cấu hình giao cho đội phát triển của hệ; secret không bao giờ in ra. */
export const buildConfigBlock = ({
  tenantEndpoint,
  tenantId,
  key,
  loginAppId,
  redirectUri,
  syncAppId,
}: ConfigInput) => {
  const origin = (tenantEndpoint ?? '[IAM]').replace(/\/$/, '');
  return [
    '# Đăng nhập (OIDC)',
    `IAM_ISSUER=${origin}/oidc`,
    `IAM_CLIENT_ID=${loginAppId ?? '[CHƯA GẮN APP ĐĂNG NHẬP]'}`,
    'IAM_CLIENT_SECRET=<giao qua kênh riêng>',
    `IAM_REDIRECT_URI=${redirectUri ?? '[REDIRECT URI]'}`,
    '',
    '# Đồng bộ người dùng (IAM Sync API)',
    `IAM_SYNC_CLIENT_ID=${syncAppId}`,
    'IAM_SYNC_CLIENT_SECRET=<giao qua kênh riêng>',
    `IAM_SYNC_RESOURCE=https://${tenantId}.logto.app/iam-sync`,
    'IAM_SYNC_SCOPE=iam-sync:read',
    `IAM_SYNC_USERS_URL=${origin}/api/iam-sync/v1/users`,
    `IAM_EXTERNAL_ID_KEY=${key}`,
  ].join('\n');
};

/** Vai trò M2M duy nhất app đồng bộ cần. */
export const iamSyncRoleName = 'machine:iam-sync';

/** Vai trò thừa trên app đồng bộ (vd quyền Management API) — nên gỡ. */
export const extraSyncRoles = <T extends { name: string }>(roles: readonly T[]) =>
  roles.filter(({ name }) => name !== iamSyncRoleName);
