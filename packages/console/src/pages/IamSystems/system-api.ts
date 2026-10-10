/**
 * SDVICO: gọi Management API cho trang "Hệ tích hợp". Mọi thao tác dùng API có sẵn của Logto:
 * custom data app (merge), kiểm soát truy cập app, vai trò M2M, secret, thành viên tổ chức.
 */
import {
  type Application,
  ApplicationType,
  type Organization,
  type Role,
  RoleType,
} from '@logto/schemas';
import { type KyInstance } from 'ky';

import { fetchAll } from '../IamStaffImport/lookup';

import {
  type IamLogin,
  iamSyncRoleName,
  type IamSystem,
  organizationIdsForUnitTypes,
  parseIamSystem,
  type SyncUserSummary,
  unitTypeOf,
} from './systems';

/** Tổ chức gốc có `level = trung_uong`: app đồng bộ là thành viên thì thấy mọi người dùng. */
export const nationwideOrganizationId = 'toan-quoc';

type SystemEntry = { system: IamSystem; syncApp: Application; loginApp?: Application };

export type SystemList = {
  systems: SystemEntry[];
  /** App M2M chưa khai báo là hệ nào. */
  unregisteredSyncApps: Application[];
  /** App có thể làm app đăng nhập (web, SPA, native). */
  loginCandidates: Application[];
};

const loginAppTypes: ReadonlySet<ApplicationType> = new Set([
  ApplicationType.Traditional,
  ApplicationType.SPA,
  ApplicationType.Native,
]);

export const loadSystems = async (api: KyInstance): Promise<SystemList> => {
  const applications = await fetchAll<Application>(api, 'api/applications');
  const byId = new Map(applications.map((application) => [application.id, application]));
  const syncApps = applications.filter(({ type }) => type === ApplicationType.MachineToMachine);

  return {
    systems: syncApps.flatMap((syncApp): SystemEntry[] => {
      const system = parseIamSystem(syncApp.customData);
      if (!system) {
        return [];
      }
      const loginApp = system.loginAppId ? byId.get(system.loginAppId) : undefined;
      return [loginApp ? { system, syncApp, loginApp } : { system, syncApp }];
    }),
    unregisteredSyncApps: syncApps.filter(({ customData }) => !parseIamSystem(customData)),
    loginCandidates: applications.filter(({ type }) => loginAppTypes.has(type)),
  };
};

type SecretSummary = { name: string; createdAt: number; expiresAt: number | undefined };

export type SystemDetail = SystemEntry & {
  loginCandidates: Application[];
  syncRoles: Role[];
  syncOrganizations: Organization[];
  secrets: SecretSummary[];
  organizations: Array<{ id: string; name: string; type?: string }>;
  users: SyncUserSummary[];
};

export const loadSystemDetail = async (
  api: KyInstance,
  syncAppId: string
): Promise<SystemDetail | undefined> => {
  const { systems, loginCandidates } = await loadSystems(api);
  const entry = systems.find(({ syncApp }) => syncApp.id === syncAppId);
  if (!entry) {
    return undefined;
  }

  const [syncRoles, syncOrganizations, secrets, organizations, preview] = await Promise.all([
    fetchAll<Role>(api, `api/applications/${syncAppId}/roles`),
    fetchAll<Organization>(api, `api/applications/${syncAppId}/organizations`),
    api.get(`api/applications/${syncAppId}/secrets`).json<SecretSummary[]>(),
    fetchAll<Organization>(api, 'api/organizations'),
    api.get('api/iam-sync-preview/users').json<{ data: SyncUserSummary[] }>(),
  ]);

  return {
    ...entry,
    loginCandidates,
    syncRoles,
    syncOrganizations,
    // Không giữ giá trị secret trong trạng thái trang: chỉ tên và thời hạn.
    secrets: secrets.map(({ name, createdAt, expiresAt }) => ({ name, createdAt, expiresAt })),
    organizations: organizations.map(({ id, name, customData }) => {
      const type = unitTypeOf(customData);
      return type ? { id, name, type } : { id, name };
    }),
    users: preview.data,
  };
};

/**
 * Lưu chế độ đăng nhập. `blocked` chỉ ghi custom data (core chặn mọi đăng nhập, giữ nguyên luật cũ để
 * mở lại không mất cấu hình); `limited` thay luật bằng danh sách tổ chức thuộc các loại đã chọn rồi bật;
 * `open` tắt kiểm soát truy cập.
 */
export const saveLogin = async (
  api: KyInstance,
  loginAppId: string,
  login: IamLogin,
  organizations: ReadonlyArray<{ id: string; type?: string }>
) => {
  if (login.mode === 'limited') {
    const organizationIds = organizationIdsForUnitTypes(organizations, login.unitTypes);
    if (organizationIds.length === 0) {
      throw new Error('Các loại đơn vị đã chọn chưa có tổ chức nào.');
    }
    await api.put(`api/applications/${loginAppId}/access-control`, {
      json: { userIds: [], userRoleIds: [], organizationIds, organizationRoleRules: [] },
    });
  }

  const writeLogin = async () =>
    api.patch(`api/applications/${loginAppId}/custom-data`, { json: { iamLogin: login } });

  // Thứ tự để hỏng giữa chừng thì thực tế luôn chặt hơn điều trang hiển thị, không bao giờ lỏng hơn:
  // nới (mở) thì ghi custom data trước rồi mới tắt kiểm soát; siết (giới hạn) thì bật luật trước.
  if (login.mode === 'open') {
    await writeLogin();
    await api.patch(`api/applications/${loginAppId}`, {
      json: { appLevelAccessControlEnabled: false },
    });
    return;
  }

  if (login.mode === 'limited') {
    await api.patch(`api/applications/${loginAppId}`, {
      json: { appLevelAccessControlEnabled: true },
    });
  }

  await writeLogin();
};

/** Ghi bản ghi hệ; custom data merge ở cấp ngoài cùng nên luôn ghi đủ cả bản ghi. */
export const registerSystem = async (api: KyInstance, syncAppId: string, system: IamSystem) =>
  api.patch(`api/applications/${syncAppId}/custom-data`, { json: { iamSystem: system } });

export const removeSyncRole = async (api: KyInstance, syncAppId: string, roleId: string) =>
  api.delete(`api/applications/${syncAppId}/roles/${roleId}`);

/** Tạo secret mới, trả giá trị để hiện đúng một lần. Secret cũ giữ đến khi hệ đổi xong rồi xoá. */
export const createSecret = async (api: KyInstance, applicationId: string, name: string) => {
  const { value } = await api
    .post(`api/applications/${applicationId}/secrets`, { json: { name } })
    .json<{ value: string }>();
  return value;
};

export const deleteSecret = async (api: KyInstance, applicationId: string, name: string) =>
  api.delete(`api/applications/${applicationId}/secrets/${encodeURIComponent(name)}`);

export type NewSystemInput = {
  key: string;
  label: string;
  description?: string;
  /** Địa chỉ gốc của hệ, vd `https://elogbook.example.vn`. */
  origin: string;
  initialMode: 'open' | 'blocked';
};

export const callbackUriOf = (origin: string) => `${origin.replace(/\/$/, '')}/auth/callback`;

const findSyncRole = async (api: KyInstance) => {
  const machineRoles = await fetchAll<Role>(api, 'api/roles', { type: RoleType.MachineToMachine });
  const syncRole = machineRoles.find(({ name }) => name === iamSyncRoleName);
  if (!syncRole) {
    throw new Error('Chưa có vai trò M2M "machine:iam-sync" (chạy docs/sql/declare-apps.sql).');
  }
  return syncRole;
};

/** Gán vai trò `machine:iam-sync` cho app đồng bộ (sửa hệ tạo dở hoặc khai báo từ app cũ). */
export const grantSyncRole = async (api: KyInstance, syncAppId: string) => {
  const syncRole = await findSyncRole(api);
  await api.post(`api/applications/${syncAppId}/roles`, { json: { roleIds: [syncRole.id] } });
};

/** Cho app đồng bộ làm thành viên Toàn quốc: IAM Sync API trả mọi người dùng. */
export const joinNationwide = async (api: KyInstance, syncAppId: string) =>
  api.post(`api/organizations/${nationwideOrganizationId}/applications`, {
    json: { applicationIds: [syncAppId] },
  });

/**
 * Tạo hệ mới bằng các API có sẵn. App đồng bộ được tạo kèm luôn bản ghi hệ, nên nếu bước sau (vai trò,
 * Toàn quốc) hỏng thì hệ vẫn hiện ở Hệ tích hợp, có nút sửa, không thành app mồ côi. Trả id app đồng bộ.
 */
export const createSystem = async (api: KyInstance, input: NewSystemInput): Promise<string> => {
  const syncRole = await findSyncRole(api);

  const origin = input.origin.replace(/\/$/, '');
  const loginApp = await api
    .post('api/applications', {
      json: {
        name: input.label,
        description: `Đăng nhập ${input.label} bằng tài khoản IAM`,
        type: ApplicationType.Traditional,
        oidcClientMetadata: {
          redirectUris: [callbackUriOf(origin)],
          postLogoutRedirectUris: [origin],
        },
        customData: { iamLogin: { mode: input.initialMode, unitTypes: [] } },
      },
    })
    .json<Application>();

  const syncApp = await api
    .post('api/applications', {
      json: {
        name: `${input.label} sync`,
        description: `${input.label} đọc người dùng qua IAM Sync API`,
        type: ApplicationType.MachineToMachine,
        customData: {
          iamSystem: {
            key: input.key,
            label: input.label,
            ...(input.description ? { description: input.description } : {}),
            loginAppId: loginApp.id,
          },
        },
      },
    })
    .json<Application>();

  await api.post(`api/applications/${syncApp.id}/roles`, { json: { roleIds: [syncRole.id] } });
  await joinNationwide(api, syncApp.id);

  return syncApp.id;
};
