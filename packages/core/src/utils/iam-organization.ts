import { z } from 'zod';

/**
 * Đọc `custom_data` của tổ chức và mã vai trò theo quy ước của IAM sdvico. Dùng chung cho
 * IAM Sync API (`routes/iam-sync.ts`) và IAM Admin API (`routes/iam-admin/`).
 */

const customDataGuard = z.record(z.unknown());

export const getCustomDataField = (customData: unknown, key: string): unknown => {
  const parsed = customDataGuard.safeParse(customData);
  return parsed.success ? parsed.data[key] : undefined;
};

export const getCustomDataString = (customData: unknown, key: string): string | undefined => {
  const value = getCustomDataField(customData, key);

  return typeof value === 'string' ? value : undefined;
};

/** Object chuỗi → chuỗi (vd `roleTitles`, `externalIds`); bỏ các giá trị không phải chuỗi. */
export const getCustomDataStringRecord = (
  customData: unknown,
  key: string
): Record<string, string> | undefined => {
  const value = getCustomDataField(customData, key);

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string'
  );

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

export const getOrganizationLevel = (customData: unknown): string | undefined =>
  getCustomDataString(customData, 'level');

/**
 * Cha trực tiếp của tổ chức trong cây phân cấp thật (vd Cảng thuộc Chi cục quản lý), lưu ở
 * `organizations.custom_data.parentOrgId`. KHÔNG phải mọi Cảng đều đã xác định được Chi cục
 * quản lý (dữ liệu nguồn không nêu rõ) — org nào chưa rõ thì field này là null/undefined và
 * chỉ hiện diện độc lập (không tự động lộ ra cho app cấp tỉnh nào).
 */
export const getParentOrgId = (customData: unknown): string | undefined =>
  getCustomDataString(customData, 'parentOrgId');

/**
 * Thông tin tổ chức trả cho hệ thống ngoài, để họ tự quy đổi ra quyền (loại đơn vị, tỉnh, mã
 * đồn/cảng nguồn, tên chức danh). Trường nào không có trong `custom_data` thì bỏ khỏi đối tượng.
 */
export const toSyncOrganization = ({
  id,
  name,
  customData,
}: {
  id: string;
  name: string;
  customData: unknown;
}) => ({
  id,
  name,
  level: getOrganizationLevel(customData),
  type: getCustomDataString(customData, 'type'),
  parentOrgId: getParentOrgId(customData),
  provinceCode: getCustomDataString(customData, 'provinceCode'),
  sourceCode: getCustomDataString(customData, 'sourceCode'),
  roleTitles: getCustomDataStringRecord(customData, 'roleTitles'),
});

export type SyncOrganization = ReturnType<typeof toSyncOrganization>;

/**
 * Code ổn định cho vai trò (vd "CHUYEN_VIEN"), để hệ thống ngoài switch/if theo code thay vì
 * so sánh chuỗi tiếng Việt có dấu (name có thể đổi câu chữ, code thì không). Ánh xạ tường minh
 * cho các role đã biết; role mới/chưa có trong danh sách sẽ tự suy code từ chính id của nó
 * (id trong Logto vốn cố định, không đổi theo thời gian) để không bao giờ thiếu code.
 */
const KNOWN_ROLE_CODES: Record<string, string> = {
  'role-truong': 'TRUONG',
  'role-pho': 'PHO',
  'role-cv': 'CHUYEN_VIEN',
};

export const getRoleCode = (roleId: string): string =>
  KNOWN_ROLE_CODES[roleId] ??
  roleId
    .replace(/^role-/, '')
    .toUpperCase()
    .replaceAll(/[^\dA-Z]+/g, '_');
