/**
 * Dữ liệu dùng chung cho các test của màn nhập: tệp mẫu, trạng thái IAM giả, và hàm soát nhanh.
 */
import { toCsv } from './csv';
import { userIndexesOf } from './lookup';
import {
  checkRows,
  draftFromRow,
  type ImportLookup,
  parseStaffFile,
  requiredColumns,
} from './staff-rows';

export const header = [...requiredColumns];

export const fileOf = (...rows: Array<Partial<Record<(typeof requiredColumns)[number], string>>>) =>
  toCsv([
    header,
    // Tệp xuất thật luôn ghi role (mặc định CHUYEN_VIEN).
    ...rows.map((row) =>
      header.map((column) => row[column] ?? (column === 'role' ? 'CHUYEN_VIEN' : ''))
    ),
  ]);

export const lookup: ImportLookup = {
  source: { key: 'mkn', label: 'MKN' },
  ...userIndexesOf(
    [
      {
        id: 'user-imported',
        name: 'Đã nhập',
        username: 'imported',
        externalIds: { mkn: 'mkn-imported' },
        isInSync: true,
      },
      {
        id: 'user-taken',
        name: 'Người có sẵn',
        username: 'taken',
        externalIds: { iuu: 'iuu-1' },
        isInSync: true,
      },
      {
        id: 'user-used',
        name: 'Dùng email',
        username: 'used_user',
        externalIds: {},
        isInSync: false,
        email: 'used@example.com',
        phone: '84900000000',
      },
      {
        id: 'user-linked',
        name: 'Đã nối MKN khác',
        username: 'linked',
        externalIds: { mkn: 'other-mkn' },
        isInSync: true,
      },
      {
        id: 'user-shared-1',
        name: 'Chung email 1',
        username: 'shared_1',
        externalIds: {},
        isInSync: true,
        email: 'shared@example.com',
      },
      {
        id: 'user-shared-2',
        name: 'Chung email 2',
        username: 'shared_2',
        externalIds: {},
        isInSync: true,
        email: 'shared@example.com',
      },
      {
        id: 'user-dup-1',
        name: 'Mã trùng 1',
        username: 'dup_1',
        externalIds: { mkn: 'dup-mkn' },
        isInSync: true,
      },
      {
        id: 'user-dup-2',
        name: 'Mã trùng 2',
        username: 'dup_2',
        externalIds: { mkn: 'dup-mkn' },
        isInSync: true,
      },
    ],
    'mkn'
  ),
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

export const reviewOf = (...rows: Parameters<typeof fileOf>) =>
  checkRows(
    parseStaffFile(fileOf(...rows)).rows.map((row) => draftFromRow(row, lookup)),
    lookup
  );

export const codesOf = (draft: ReturnType<typeof reviewOf>[number]) =>
  draft.issues.map(({ code }) => code);
