import RequestError from '#src/errors/RequestError/index.js';
import type TenantContext from '#src/tenants/TenantContext.js';
import assertThat from '#src/utils/assert-that.js';

import { createUserLoader } from './user-loader.js';

const notFound = () => new RequestError({ code: 'entity.not_found', status: 404 });

/** Các bước dùng chung cho route ghi người dùng (`user-write.ts`). */
export const createUserWriteHelpers = (tenant: TenantContext) => {
  const { users, organizations, signInExperiences, iamAdmin } = tenant.queries;
  const { findRoleIdsByCode, loadUserDetail } = createUserLoader(tenant);

  /** Không có người dùng → 404. Lỗi CSDL khác vẫn ném ra nguyên vẹn. */
  const assertUserExists = async (userId: string) => {
    assertThat(await iamAdmin.findUserById(userId), notFound());
  };

  const loadExistingUserDetail = async (userId: string) => {
    const detail = await loadUserDetail(userId);
    assertThat(detail, notFound());
    return detail;
  };

  /** Mã chức danh → id vai trò; mã không có → 400. */
  const resolveRoleIds = async (roleCodes: readonly string[]) => {
    const roleIdsByCode = await findRoleIdsByCode();
    const unknown = roleCodes.filter((code) => !roleIdsByCode.has(code));

    assertThat(
      unknown.length === 0,
      new RequestError({
        code: 'entity.not_exists',
        status: 400,
        name: `organization role ${unknown.join(', ')}`,
      })
    );

    return [...new Set(roleCodes)].flatMap((code) => roleIdsByCode.get(code) ?? []);
  };

  /** Thêm vào đơn vị nếu chưa có, rồi thay toàn bộ chức danh ở đơn vị đó. */
  const setOrganizationRoles = async (
    userId: string,
    organizationId: string,
    roleIds: string[]
  ) => {
    const existing = await organizations.relations.users.getExistingOrganizationIds(userId, [
      organizationId,
    ]);
    const isMember = existing.length > 0;

    if (!isMember) {
      await organizations.relations.users.insert({ organizationId, userId });
    }

    await organizations.relations.usersRoles.replace(organizationId, userId, roleIds);
  };

  const assertIdentifiersAvailable = async ({
    username,
    email,
    phone,
  }: {
    username: string;
    email?: string;
    phone?: string;
  }) => {
    const isCaseSensitive = await signInExperiences.getUsernameCaseSensitive();

    assertThat(
      !(await users.hasUser(username, isCaseSensitive)),
      new RequestError({ code: 'user.username_already_in_use', status: 422 })
    );
    assertThat(
      !email || !(await users.hasUserWithEmail(email)),
      new RequestError({ code: 'user.email_already_in_use', status: 422 })
    );
    assertThat(
      !phone || !(await users.hasUserWithNormalizedPhone(phone)),
      new RequestError({ code: 'user.phone_already_in_use', status: 422 })
    );
  };

  return {
    assertIdentifiersAvailable,
    assertUserExists,
    loadExistingUserDetail,
    resolveRoleIds,
    setOrganizationRoles,
  };
};
