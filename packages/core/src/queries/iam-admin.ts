import {
  ApplicationType,
  Applications,
  ApplicationsRoles,
  LogResult,
  Logs,
  OrganizationRoles,
  OrganizationRoleUserRelations,
  OrganizationUserRelations,
  Roles,
  Users,
  token,
} from '@logto/schemas';
import { type Nullable } from '@silverhand/essentials';
import { type CommonQueryMethods, sql } from '@silverhand/slonik';

import { convertToIdentifiers } from '#src/utils/sql.js';

const users = convertToIdentifiers(Users);
const memberships = convertToIdentifiers(OrganizationUserRelations);
// Các bảng dưới đây được JOIN với nhau nên cột phải kèm tên bảng (cả hai đều có cột `id`).
const roleAssignments = convertToIdentifiers(OrganizationRoleUserRelations, true);
const organizationRoles = convertToIdentifiers(OrganizationRoles, true);
const logs = convertToIdentifiers(Logs, true);
const applications = convertToIdentifiers(Applications, true);
const applicationsRoles = convertToIdentifiers(ApplicationsRoles, true);
const roles = convertToIdentifiers(Roles, true);

/** Bốn loại ứng dụng IAM Admin API quản lý; `Protected`, `SAML` không thuộc phạm vi. */
const systemApplicationTypes = [
  ApplicationType.Traditional,
  ApplicationType.SPA,
  ApplicationType.Native,
  ApplicationType.MachineToMachine,
];

/** Mỗi lần đổi mã lấy token thành công = một lần người dùng vào một ứng dụng. */
const signInLogKey = `${token.Type.ExchangeTokenBy}.${token.ExchangeByType.AuthorizationCode}`;

export type IamAdminUserRow = {
  id: string;
  username: Nullable<string>;
  name: Nullable<string>;
  primaryEmail: Nullable<string>;
  primaryPhone: Nullable<string>;
  isSuspended: boolean;
  hasPassword: boolean;
  customData: unknown;
  lastSignInAt: Nullable<number>;
  passwordUpdatedAt: Nullable<number>;
  createdAt: number;
  updatedAt: number;
};

export type IamAdminApplicationRow = {
  id: string;
  name: string;
  description: Nullable<string>;
  type: ApplicationType;
  customData: unknown;
  oidcClientMetadata: unknown;
  customClientMetadata: unknown;
  createdAt: number;
  roleNames: string[];
};

export type IamAdminMembershipRow = { organizationId: string; userId: string };

export type IamAdminRoleAssignmentRow = {
  organizationId: string;
  userId: string;
  roleId: string;
  roleName: string;
};

export type IamAdminLastSignInRow = {
  userId: string;
  applicationId: string;
  applicationName: Nullable<string>;
};

/**
 * Truy vấn cho IAM Admin API. Quy mô vài nghìn người dùng, nên đọc cả bảng rồi lọc, sắp, chia
 * trang ở tầng ứng dụng (cùng cách làm của IAM Sync, xem docs/iam-sync-api-design.md mục 1).
 * Không đọc cột mật khẩu: chỉ trả `hasPassword`.
 */
export const createIamAdminQueries = (pool: CommonQueryMethods) => {
  const userColumns = sql`
    ${users.fields.id},
    ${users.fields.username},
    ${users.fields.name},
    ${users.fields.primaryEmail},
    ${users.fields.primaryPhone},
    ${users.fields.isSuspended},
    (${users.fields.passwordEncrypted} is not null) as has_password,
    ${users.fields.customData},
    ${users.fields.lastSignInAt},
    ${users.fields.passwordUpdatedAt},
    ${users.fields.createdAt},
    ${users.fields.updatedAt}
  `;

  const findAllUsers = async () =>
    pool.any<IamAdminUserRow>(sql`
      select ${userColumns}
      from ${users.table}
    `);

  const findUserById = async (userId: string) =>
    pool.maybeOne<IamAdminUserRow>(sql`
      select ${userColumns}
      from ${users.table}
      where ${users.fields.id} = ${userId}
    `);

  const findMemberships = async (userId?: string) =>
    pool.any<IamAdminMembershipRow>(sql`
      select ${memberships.fields.organizationId}, ${memberships.fields.userId}
      from ${memberships.table}
      ${userId ? sql`where ${memberships.fields.userId} = ${userId}` : sql``}
    `);

  const findRoleAssignments = async (userId?: string) =>
    pool.any<IamAdminRoleAssignmentRow>(sql`
      select
        ${roleAssignments.fields.organizationId},
        ${roleAssignments.fields.userId},
        ${roleAssignments.fields.organizationRoleId} as role_id,
        ${organizationRoles.fields.name} as role_name
      from ${roleAssignments.table}
      join ${organizationRoles.table}
        on ${organizationRoles.fields.id} = ${roleAssignments.fields.organizationRoleId}
      ${userId ? sql`where ${roleAssignments.fields.userId} = ${userId}` : sql``}
    `);

  /** Ứng dụng của lần vào thành công gần nhất, một dòng mỗi người dùng có trong `userIds`. */
  const findLastSignInApplications = async (userIds: readonly string[]) => {
    if (userIds.length === 0) {
      return [];
    }

    return pool.any<IamAdminLastSignInRow>(sql`
      select distinct on (${logs.fields.payload}->>'userId')
        ${logs.fields.payload}->>'userId' as user_id,
        ${logs.fields.payload}->>'applicationId' as application_id,
        ${applications.fields.name} as application_name
      from ${logs.table}
      left join ${applications.table}
        on ${applications.fields.id} = ${logs.fields.payload}->>'applicationId'
      where ${logs.fields.key} = ${signInLogKey}
        and ${logs.fields.payload}->>'result' = ${LogResult.Success}
        and ${logs.fields.payload}->>'applicationId' is not null
        and ${logs.fields.payload}->>'userId' = any(${sql.array([...userIds], 'varchar')})
      order by ${logs.fields.payload}->>'userId', ${logs.fields.createdAt} desc
    `);
  };

  /** Ứng dụng thuộc bốn loại trên, kèm tên các Role M2M. Bên thứ ba không tính. */
  const selectSystemApplications = (applicationId?: string) => sql`
    select
      ${applications.fields.id},
      ${applications.fields.name},
      ${applications.fields.description},
      ${applications.fields.type},
      ${applications.fields.customData},
      ${applications.fields.oidcClientMetadata},
      ${applications.fields.customClientMetadata},
      ${applications.fields.createdAt},
      coalesce(
        array_agg(${roles.fields.name} order by ${roles.fields.name})
          filter (where ${roles.fields.name} is not null),
        '{}'
      ) as role_names
    from ${applications.table}
    left join ${applicationsRoles.table}
      on ${applicationsRoles.fields.applicationId} = ${applications.fields.id}
    left join ${roles.table}
      on ${roles.fields.id} = ${applicationsRoles.fields.roleId}
    where ${applications.fields.type} = any(${sql.array(systemApplicationTypes, 'text')}::application_type[])
      and ${applications.fields.isThirdParty} = false
      ${applicationId ? sql`and ${applications.fields.id} = ${applicationId}` : sql``}
    group by ${applications.fields.id}
    order by ${applications.fields.createdAt}
  `;

  const findSystemApplications = async () =>
    pool.any<IamAdminApplicationRow>(selectSystemApplications());

  /** Một ứng dụng thuộc bốn loại trên; `null` nếu không có hoặc khác loại. */
  const findSystemApplicationById = async (applicationId: string) =>
    pool.maybeOne<IamAdminApplicationRow>(selectSystemApplications(applicationId));

  return {
    findSystemApplications,
    findSystemApplicationById,
    findAllUsers,
    findUserById,
    findMemberships,
    findRoleAssignments,
    findLastSignInApplications,
  };
};
