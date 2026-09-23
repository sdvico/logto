const system_limit = {
  limit_exceeded:
    'Tenant <planName/> này đã đạt đến giới hạn {{entity}} theo <a>chính sách giới hạn thực thể của sdvico</a>.',
  entities: {
    application: 'ứng dụng',
    third_party_application: 'ứng dụng bên thứ ba',
    scope_per_resource: 'quyền theo tài nguyên',
    social_connector: 'liên kết mạng xã hội',
    user_role: 'vai trò người dùng',
    machine_to_machine_role: 'vai trò máy tới máy',
    scope_per_role: 'quyền theo vai trò',
    hook: 'hook',
    machine_to_machine: 'ứng dụng máy tới máy',
    resource: 'tài nguyên API',
    enterprise_sso: 'SSO doanh nghiệp',
    tenant_member: 'thành viên tenant',
    organization: 'tổ chức',
    saml_application: 'ứng dụng SAML',
    custom_domain: 'domain tùy chỉnh',
    user_per_organization: 'người dùng mỗi tổ chức',
    organization_user_role: 'vai trò người dùng tổ chức',
    organization_machine_to_machine_role: 'vai trò máy tới máy tổ chức',
    organization_scope: 'quyền tổ chức',
  },
};

export default Object.freeze(system_limit);
