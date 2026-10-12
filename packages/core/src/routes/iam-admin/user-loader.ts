import type TenantContext from '#src/tenants/TenantContext.js';
import { getRoleCode } from '#src/utils/iam-organization.js';

import {
  type OrganizationRecord,
  groupOrganizationsByUser,
  toUserDetail,
  toUserSummary,
  withLastSignInApplications,
} from './user-view.js';

/** Trần an toàn khi đọc cả bảng tổ chức, chức danh (hiện 436 tổ chức). */
export const maxOrganizations = 5000;

/** Nạp dữ liệu dùng chung cho các route người dùng của IAM Admin API. */
export const createUserLoader = ({ queries }: TenantContext) => {
  const { iamAdmin, organizations } = queries;

  const findOrganizationsById = async () => {
    const [, rows] = await organizations.findAll(maxOrganizations, 0);
    return new Map<string, OrganizationRecord>(rows.map((row) => [row.id, row]));
  };

  /** Mã chức danh (vd `TRUONG`) → id vai trò tổ chức trong Logto. */
  const findRoleIdsByCode = async () => {
    const [, roles] = await organizations.roles.findAll(maxOrganizations, 0);
    return new Map(roles.map(({ id }) => [getRoleCode(id), id]));
  };

  const loadUserSummaries = async () => {
    const [users, membershipRows, roleRows, organizationsById] = await Promise.all([
      iamAdmin.findAllUsers(),
      iamAdmin.findMemberships(),
      iamAdmin.findRoleAssignments(),
      findOrganizationsById(),
    ]);
    const organizationsByUser = groupOrganizationsByUser(
      membershipRows,
      roleRows,
      organizationsById
    );

    return {
      users: users.map((user) => ({
        summary: toUserSummary(user, organizationsByUser.get(user.id) ?? []),
        createdAt: user.createdAt,
      })),
      organizationCount: organizationsById.size,
    };
  };

  /** Chi tiết một người dùng (U3); `null` nếu không có. */
  const loadUserDetail = async (userId: string) => {
    const user = await iamAdmin.findUserById(userId);

    if (!user) {
      return null;
    }

    const [membershipRows, roleRows, organizationsById, lastSignIns] = await Promise.all([
      iamAdmin.findMemberships(userId),
      iamAdmin.findRoleAssignments(userId),
      findOrganizationsById(),
      iamAdmin.findLastSignInApplications([userId]),
    ]);
    const userOrganizations =
      groupOrganizationsByUser(membershipRows, roleRows, organizationsById).get(userId) ?? [];
    const detail = toUserDetail(user, userOrganizations, organizationsById);
    const [summary] = withLastSignInApplications([detail], lastSignIns);

    return { ...detail, lastSignInApplication: summary?.lastSignInApplication ?? null };
  };

  return { findOrganizationsById, findRoleIdsByCode, loadUserSummaries, loadUserDetail };
};
