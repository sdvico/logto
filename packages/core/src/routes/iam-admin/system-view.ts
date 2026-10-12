import { ApplicationType, hasSecrets } from '@logto/schemas';
import { z } from 'zod';

import { type IamAdminApplicationRow } from '#src/queries/iam-admin.js';
import { getCustomDataString } from '#src/utils/iam-organization.js';

export const iamSyncRoleName = 'machine:iam-sync';
export const iamAdminRoleName = 'machine:iam-admin';
export const iamSyncScope = 'iam-sync:read';

/** Tên loại trong API ↔ loại của Logto. */
export const appTypes = Object.freeze({
  traditional: ApplicationType.Traditional,
  spa: ApplicationType.SPA,
  native: ApplicationType.Native,
  m2m: ApplicationType.MachineToMachine,
} as const);

export type AppTypeName = keyof typeof appTypes;

const appTypeNameGuard = z.enum(['traditional', 'spa', 'native', 'm2m']);

const toAppTypeName = (type: ApplicationType): AppTypeName =>
  appTypeNameGuard.parse(
    Object.entries(appTypes).find(([, value]) => value === type)?.[0] ?? 'traditional'
  );

export const systemGuard = z.object({
  system: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isCaller: z.boolean(),
  apps: z
    .object({
      id: z.string(),
      name: z.string(),
      type: appTypeNameGuard,
      hasSecret: z.boolean(),
      roles: z.string().array(),
      createdAt: z.string(),
    })
    .array(),
});

type SystemView = z.infer<typeof systemGuard>;

/** Hệ của một ứng dụng: `custom_data.system`, chưa có thì chính id ứng dụng (hệ một app). */
export const getSystemKey = ({
  id,
  customData,
}: Pick<IamAdminApplicationRow, 'id' | 'customData'>) =>
  getCustomDataString(customData, 'system') ?? id;

/** Gom ứng dụng theo hệ, giữ thứ tự tạo. `callerClientId` đánh dấu hệ của app đang gọi. */
export const groupSystems = (
  rows: readonly IamAdminApplicationRow[],
  callerClientId: string
): SystemView[] => {
  const rowsBySystem = new Map<string, IamAdminApplicationRow[]>();

  for (const row of rows) {
    const key = getSystemKey(row);
    rowsBySystem.set(key, [...(rowsBySystem.get(key) ?? []), row]);
  }

  return [...rowsBySystem.entries()].map(([system, apps]) => {
    const named = apps.find(({ customData }) => getCustomDataString(customData, 'systemName'));

    return {
      system,
      name: getCustomDataString(named?.customData, 'systemName') ?? apps[0]?.name ?? system,
      description: getCustomDataString(named?.customData, 'systemDescription') ?? null,
      isCaller: apps.some(({ id }) => id === callerClientId),
      apps: apps.map(({ id, name, type, roleNames, createdAt }) => ({
        id,
        name,
        type: toAppTypeName(type),
        hasSecret: hasSecrets(type),
        roles: roleNames,
        createdAt: new Date(createdAt).toISOString(),
      })),
    };
  });
};

export const applicationDetailGuard = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: appTypeNameGuard,
  system: z.string().nullable(),
  hasSecret: z.boolean(),
  roles: z.string().array(),
  redirectUris: z.string().array(),
  postLogoutRedirectUris: z.string().array(),
  corsAllowedOrigins: z.string().array(),
  resource: z.string().nullable(),
  scope: z.string().nullable(),
  isCaller: z.boolean(),
  createdAt: z.string(),
});

type ApplicationDetail = z.infer<typeof applicationDetailGuard>;

const stringArrayGuard = z.string().array();

/** Mảng chuỗi trong một cột jsonb; không phải mảng chuỗi thì coi như rỗng. */
const getStringArray = (metadata: unknown, key: string): string[] => {
  const record = z.record(z.unknown()).safeParse(metadata);
  const parsed = stringArrayGuard.safeParse(record.success ? record.data[key] : undefined);
  return parsed.success ? parsed.data : [];
};

/**
 * Chi tiết một ứng dụng (A4). Không bao giờ có secret. `iamSyncResource` chỉ gắn cho app m2m mang
 * `machine:iam-sync`, cùng luật với A2.
 */
export const toApplicationDetail = (
  row: IamAdminApplicationRow,
  { isCaller, iamSyncResource }: { isCaller: boolean; iamSyncResource: string }
): ApplicationDetail => {
  const hasIamSync =
    row.type === ApplicationType.MachineToMachine && row.roleNames.includes(iamSyncRoleName);

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: toAppTypeName(row.type),
    system: getCustomDataString(row.customData, 'system') ?? null,
    hasSecret: hasSecrets(row.type),
    roles: row.roleNames,
    redirectUris: getStringArray(row.oidcClientMetadata, 'redirectUris'),
    postLogoutRedirectUris: getStringArray(row.oidcClientMetadata, 'postLogoutRedirectUris'),
    corsAllowedOrigins: getStringArray(row.customClientMetadata, 'corsAllowedOrigins'),
    resource: hasIamSync ? iamSyncResource : null,
    scope: hasIamSync ? iamSyncScope : null,
    isCaller,
    createdAt: new Date(row.createdAt).toISOString(),
  };
};
