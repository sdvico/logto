const application = {
  invalid_type: 'Chỉ ứng dụng machine-to-machine mới có thể gắn vai trò.',
  role_exists: 'Vai trò có id {{roleId}} đã được thêm vào ứng dụng này.',
  invalid_role_type: 'Không thể gán vai trò kiểu user cho ứng dụng machine-to-machine.',
  invalid_third_party_application_type:
    'Chỉ ứng dụng web truyền thống, single-page và native mới có thể đánh dấu là ứng dụng bên thứ ba.',
  third_party_application_only: 'Tính năng này chỉ áp dụng cho ứng dụng bên thứ ba.',
  third_party_application_cannot_enable_token_exchange:
    'Ứng dụng bên thứ ba không được phép bật trao đổi token (token exchange).',
  user_consent_scopes_not_found: 'Phạm vi (scope) đồng ý của người dùng không hợp lệ.',
  consent_management_api_scopes_not_allowed: 'Không được phép dùng phạm vi (scope) của Management API.',
  device_flow_native_only: 'Device flow chỉ áp dụng cho ứng dụng native.',
  device_flow_not_changeable: 'Không thể thay đổi device flow sau khi tạo ứng dụng.',
  protected_app_metadata_is_required: 'Cần có metadata của protected app.',
  protected_app_not_configured:
    'Nhà cung cấp protected app chưa được cấu hình. Tính năng này không có ở bản mã nguồn mở.',
  cloudflare_unknown_error: 'Gặp lỗi không xác định khi gọi Cloudflare API',
  protected_application_only: 'Tính năng này chỉ áp dụng cho protected application.',
  protected_application_misconfigured: 'Protected application đang bị cấu hình sai.',
  protected_application_subdomain_exists:
    'Subdomain của protected application đã được sử dụng.',
  invalid_subdomain: 'Subdomain không hợp lệ.',
  custom_domain_not_found: 'Không tìm thấy custom domain.',
  should_delete_custom_domains_first: 'Cần xóa custom domain trước.',
  no_legacy_secret_found: 'Ứng dụng không có legacy secret.',
  secret_name_exists: 'Tên secret đã tồn tại.',
  sync_application_secret_failed: 'Đồng bộ secret của ứng dụng thất bại.',
  saml: {
    use_saml_app_api: 'Hãy dùng API `[METHOD] /saml-applications(/.*)?` để thao tác với ứng dụng SAML.',
    saml_application_only: 'API này chỉ áp dụng cho ứng dụng SAML.',
    reach_oss_limit: 'Bạn KHÔNG THỂ tạo thêm ứng dụng SAML vì đã đạt giới hạn {{limit}}.',
    acs_url_binding_not_supported:
      'Chỉ hỗ trợ HTTP-POST binding để nhận SAML assertion.',
    acs_url_scheme_not_supported:
      'Chỉ hỗ trợ giao thức HTTP và HTTPS cho Assertion Consumer Service URL.',
    can_not_delete_active_secret: 'Không thể xóa secret đang hoạt động.',
    no_active_secret: 'Không tìm thấy secret đang hoạt động.',
    entity_id_required: 'Cần có Entity ID để tạo metadata.',
    name_id_format_required: 'Cần có định dạng Name ID.',
    unsupported_name_id_format: 'Định dạng Name ID không được hỗ trợ.',
    missing_email_address: 'Người dùng chưa có địa chỉ email.',
    email_address_unverified: 'Địa chỉ email của người dùng chưa được xác minh.',
    invalid_certificate_pem_format: 'Định dạng chứng chỉ PEM không hợp lệ',
    acs_url_required: 'Cần có Assertion Consumer Service URL.',
    private_key_required: 'Cần có private key.',
    certificate_required: 'Cần có chứng chỉ (certificate).',
    invalid_saml_request: 'Yêu cầu xác thực SAML không hợp lệ.',
    auth_request_issuer_not_match:
      'Issuer của yêu cầu xác thực SAML không khớp với entity ID của service provider.',
    sp_initiated_saml_sso_session_not_found_in_cookies:
      'Không tìm thấy session ID của SAML SSO do service provider khởi tạo trong cookie.',
    sp_initiated_saml_sso_session_not_found:
      'Không tìm thấy session của SAML SSO do service provider khởi tạo.',
    state_mismatch: 'Giá trị `state` không khớp.',
  },
};

export default Object.freeze(application);
