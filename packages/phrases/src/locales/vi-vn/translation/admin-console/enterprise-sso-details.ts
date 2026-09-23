const enterprise_sso_details = {
  back_to_sso_connectors: 'Quay lại SSO doanh nghiệp',
  page_title: 'Chi tiết bộ kết nối SSO doanh nghiệp',
  readme_drawer_title: 'SSO doanh nghiệp',
  readme_drawer_subtitle: 'Thiết lập bộ kết nối SSO doanh nghiệp để cho phép người dùng cuối đăng nhập một lần',
  tab_experience: 'Trải nghiệm SSO',
  tab_connection: 'Kết nối',
  tab_idp_initiated_auth: 'SSO khởi tạo từ IdP',
  general_settings_title: 'Chung',
  general_settings_description:
    'Cấu hình trải nghiệm người dùng cuối và liên kết miền email doanh nghiệp cho luồng SSO khởi tạo từ SP.',
  custom_branding_title: 'Hiển thị',
  custom_branding_description:
    "Tùy chỉnh tên và logo hiển thị trong luồng đăng nhập một lần của người dùng cuối. Khi để trống, hệ thống sẽ dùng giá trị mặc định.",
  email_domain_field_name: 'Miền email doanh nghiệp',
  email_domain_field_description:
    'Người dùng có các miền email này có thể dùng SSO để xác thực. Vui lòng xác minh quyền sở hữu miền trước khi thêm.',
  email_domain_field_placeholder: 'Nhập một hoặc nhiều miền email (ví dụ: yourcompany.com)',
  sync_profile_field_name: 'Đồng bộ thông tin hồ sơ từ nhà cung cấp danh tính',
  sync_profile_option: {
    register_only: 'Chỉ đồng bộ ở lần đăng nhập đầu tiên',
    each_sign_in: 'Luôn đồng bộ ở mỗi lần đăng nhập',
  },
  connector_name_field_name: 'Tên bộ kết nối',
  display_name_field_name: 'Tên hiển thị',
  connector_logo_field_name: 'Logo hiển thị',
  connector_logo_field_description: 'Mỗi ảnh nên dưới 500KB, chỉ chấp nhận SVG, PNG, JPG, JPEG.',
  branding_logo_context: 'Tải lên logo',
  branding_logo_error: 'Lỗi tải lên logo: {{error}}',
  branding_light_logo_context: 'Tải lên logo chế độ sáng',
  branding_light_logo_error: 'Lỗi tải lên logo chế độ sáng: {{error}}',
  branding_logo_field_name: 'Logo',
  branding_logo_field_placeholder: 'https://your.domain/logo.png',
  branding_dark_logo_context: 'Tải lên logo chế độ tối',
  branding_dark_logo_error: 'Lỗi tải lên logo chế độ tối: {{error}}',
  branding_dark_logo_field_name: 'Logo (chế độ tối)',
  branding_dark_logo_field_placeholder: 'https://your.domain/dark-mode-logo.png',
  check_connection_guide: 'Hướng dẫn kết nối',
  enterprise_sso_deleted: 'Đã xóa bộ kết nối SSO doanh nghiệp thành công',
  delete_confirm_modal_title: 'Xóa bộ kết nối SSO doanh nghiệp',
  delete_confirm_modal_content:
    'Bạn có chắc chắn muốn xóa bộ kết nối doanh nghiệp này? Người dùng từ nhà cung cấp danh tính sẽ không thể dùng đăng nhập một lần.',
  upload_idp_metadata_title_saml: 'Tải lên metadata',
  upload_idp_metadata_description_saml: 'Cấu hình metadata được sao chép từ nhà cung cấp danh tính.',
  upload_idp_metadata_title_oidc: 'Tải lên thông tin xác thực',
  upload_idp_metadata_description_oidc:
    'Cấu hình thông tin xác thực và thông tin OIDC token được sao chép từ nhà cung cấp danh tính.',
  upload_idp_metadata_button_text: 'Tải lên file metadata XML',
  upload_signing_certificate_button_text: 'Tải lên file chứng chỉ ký',
  configure_domain_field_info_text:
    'Thêm miền email để hướng người dùng doanh nghiệp đến nhà cung cấp danh tính của họ cho đăng nhập một lần.',
  email_domain_field_required: 'Cần có miền email để bật SSO doanh nghiệp.',
  upload_saml_idp_metadata_info_text_url:
    'Dán URL metadata từ nhà cung cấp danh tính để kết nối.',
  upload_saml_idp_metadata_info_text_xml:
    'Dán metadata từ nhà cung cấp danh tính để kết nối.',
  upload_saml_idp_metadata_info_text_manual:
    'Điền metadata từ nhà cung cấp danh tính để kết nối.',
  upload_oidc_idp_info_text: 'Điền thông tin từ nhà cung cấp danh tính để kết nối.',
  service_provider_property_title: 'Cấu hình trong IdP',
  service_provider_property_description:
    'Thiết lập một tích hợp ứng dụng dùng {{protocol}} trong nhà cung cấp danh tính của bạn. Nhập các thông tin do sdvico cung cấp.',
  attribute_mapping_title: 'Ánh xạ thuộc tính',
  attribute_mapping_description:
    'Đồng bộ hồ sơ người dùng từ nhà cung cấp danh tính bằng cách cấu hình ánh xạ thuộc tính người dùng ở phía nhà cung cấp danh tính hoặc phía sdvico.',
  saml_preview: {
    sign_on_url: 'URL đăng nhập',
    entity_id: 'Đơn vị phát hành',
    x509_certificate: 'Chứng chỉ ký',
    certificate_content: 'Hết hạn {{date}}',
  },
  oidc_preview: {
    authorization_endpoint: 'Điểm cuối cấp quyền',
    token_endpoint: 'Điểm cuối token',
    userinfo_endpoint: 'Điểm cuối thông tin người dùng',
    jwks_uri: 'Điểm cuối tập khóa JSON web',
    issuer: 'Đơn vị phát hành',
  },
  idp_initiated_auth_config: {
    card_title: 'SSO khởi tạo từ IdP',
    card_description:
      'Người dùng thường bắt đầu quá trình xác thực từ ứng dụng của bạn bằng luồng SSO khởi tạo từ SP. KHÔNG bật tính năng này trừ khi thực sự cần thiết.',
    enable_idp_initiated_sso: 'Bật SSO khởi tạo từ IdP',
    enable_idp_initiated_sso_description:
      "Cho phép người dùng doanh nghiệp bắt đầu quá trình xác thực trực tiếp từ cổng của nhà cung cấp danh tính. Vui lòng hiểu rõ các rủi ro an ninh có thể xảy ra trước khi bật tính năng này.",
    default_application: 'Ứng dụng mặc định',
    default_application_tooltip:
      'Ứng dụng đích mà người dùng sẽ được chuyển hướng tới sau khi xác thực.',
    empty_applications_error:
      'Không tìm thấy ứng dụng nào. Vui lòng thêm một ứng dụng trong phần <a>Applications</a>.',
    empty_applications_placeholder: 'Không có ứng dụng',
    authentication_type: 'Loại xác thực',
    auto_authentication_disabled_title: 'Chuyển hướng về client cho SSO khởi tạo từ SP',
    auto_authentication_disabled_description:
      'Được đề xuất. Chuyển hướng người dùng đến ứng dụng phía client để khởi tạo một luồng xác thực OIDC khởi tạo từ SP an toàn. Điều này sẽ ngăn chặn tấn công CSRF.',
    auto_authentication_enabled_title: 'Đăng nhập trực tiếp bằng SSO khởi tạo từ IdP',
    auto_authentication_enabled_description:
      'Sau khi đăng nhập thành công, người dùng sẽ được chuyển hướng đến Redirect URI đã chỉ định kèm mã ủy quyền (không có xác thực state và PKCE).',
    auto_authentication_disabled_app: 'Dành cho ứng dụng web truyền thống, ứng dụng một trang (SPA)',
    auto_authentication_enabled_app: 'Dành cho ứng dụng web truyền thống',
    idp_initiated_auth_callback_uri: 'URI callback của client',
    idp_initiated_auth_callback_uri_tooltip:
      'URI callback của client để khởi tạo luồng xác thực SSO khởi tạo từ SP. Một ssoConnectorId sẽ được thêm vào URI dưới dạng tham số truy vấn. (ví dụ: https://your.domain/sso/callback?connectorId={{ssoConnectorId}})',
    redirect_uri: 'URI chuyển hướng sau khi đăng nhập',
    redirect_uri_tooltip:
      'URI chuyển hướng người dùng sau khi đăng nhập thành công. sdvico sẽ dùng URI này làm URI chuyển hướng OIDC trong yêu cầu cấp quyền. Nên dùng một URI riêng cho luồng xác thực SSO khởi tạo từ IdP để bảo mật tốt hơn.',
    empty_redirect_uris_error:
      'Chưa có URI chuyển hướng nào được đăng ký cho ứng dụng này. Vui lòng thêm một URI trước.',
    redirect_uri_placeholder: 'Chọn một URI chuyển hướng sau khi đăng nhập',
    auth_params: 'Tham số xác thực bổ sung',
    auth_params_tooltip:
      'Các tham số bổ sung sẽ được truyền trong yêu cầu cấp quyền. Theo mặc định chỉ có phạm vi (openid profile) được yêu cầu, bạn có thể chỉ định thêm phạm vi khác hoặc một giá trị state riêng tại đây. (ví dụ: { "scope": "organizations email", "state": "secret_state" }).',
  },
  trust_unverified_email: 'Tin tưởng email chưa xác minh',
  trust_unverified_email_label:
    'Luôn tin tưởng các địa chỉ email chưa xác minh được trả về từ nhà cung cấp danh tính',
  trust_unverified_email_tip:
    'Bộ kết nối Entra ID (OIDC) không trả về claim `email_verified`, nghĩa là các địa chỉ email từ Azure không được đảm bảo đã xác minh. Theo mặc định, sdvico sẽ không đồng bộ các địa chỉ email chưa xác minh vào hồ sơ người dùng. Chỉ bật tùy chọn này nếu bạn tin tưởng tất cả địa chỉ email từ thư mục Entra ID.',
  trust_unverified_email_tip_oidc:
    'Bộ kết nối OIDC có thể không trả về claim `email_verified`, nghĩa là các địa chỉ email từ nhà cung cấp danh tính không được đảm bảo đã xác minh. Theo mặc định, sdvico sẽ không đồng bộ các địa chỉ email chưa xác minh vào hồ sơ người dùng. Chỉ bật tùy chọn này nếu bạn tin tưởng tất cả địa chỉ email từ nhà cung cấp danh tính.',
  offline_access: {
    label: 'Làm mới access token',
    description:
      'Bật quyền truy cập `offline` của Google để yêu cầu refresh token, cho phép ứng dụng của bạn làm mới access token mà không cần người dùng cấp quyền lại.',
  },
};

export default Object.freeze(enterprise_sso_details);
