const featured_plan_content = {
  mau: {
    free_plan: 'Tối đa {{count, number}} MAU',
    pro_plan: 'MAU không giới hạn',
  },
  m2m: {
    free_plan: '{{count, number}} machine-to-machine',
    pro_plan: 'Machine-to-machine bổ sung',
  },
  saml_and_third_party_apps: 'Ứng dụng SAML & ứng dụng bên thứ ba',
  third_party_apps: 'IdP cho ứng dụng bên thứ ba',
  mfa: 'Xác thực đa yếu tố',
  sso: 'Enterprise SSO',
  role_and_permissions: {
    free_plan: '{{roleCount, number}} vai trò và {{permissionCount, number}} quyền mỗi vai trò',
    pro_plan: 'Vai trò và quyền mỗi vai trò không giới hạn',
  },
  rbac: 'Kiểm soát truy cập theo vai trò',
  organizations: 'Organization',
  audit_logs: 'Lưu trữ nhật ký kiểm tra: {{count, number}} ngày',
};

export default Object.freeze(featured_plan_content);
