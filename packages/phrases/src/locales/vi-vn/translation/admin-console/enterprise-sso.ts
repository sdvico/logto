const enterprise_sso = {
  page_title: 'SSO doanh nghiệp',
  title: 'SSO doanh nghiệp',
  subtitle: 'Kết nối nhà cung cấp danh tính doanh nghiệp và bật đăng nhập một lần.',
  create: 'Thêm bộ kết nối doanh nghiệp',
  col_connector_name: 'Tên bộ kết nối',
  col_type: 'Loại',
  col_email_domain: 'Miền email',

  placeholder_title: 'Bộ kết nối doanh nghiệp',
  placeholder_description:
    'sdvico đã cung cấp sẵn nhiều nhà cung cấp danh tính doanh nghiệp để kết nối, đồng thời bạn cũng có thể tự tạo bằng giao thức SAML và OIDC.',
  create_modal: {
    title: 'Thêm bộ kết nối doanh nghiệp',
    text_divider: 'Hoặc bạn có thể tùy chỉnh bộ kết nối theo một giao thức chuẩn.',
    connector_name_field_title: 'Tên bộ kết nối',
    connector_name_field_placeholder: 'Ví dụ: {tên công ty} - {tên nhà cung cấp danh tính}',
    create_button_text: 'Tạo bộ kết nối',
  },
  guide: {
    subtitle: 'Hướng dẫn từng bước để kết nối nhà cung cấp danh tính doanh nghiệp.',
    finish_button_text: 'Tiếp tục',
  },
  basic_info: {
    title: 'Cấu hình dịch vụ của bạn trong IdP',
    description:
      'Tạo một tích hợp ứng dụng mới bằng SAML 2.0 trong nhà cung cấp danh tính {{name}} của bạn. Sau đó dán giá trị sau vào đó.',
    saml: {
      acs_url_field_name: 'URL dịch vụ tiêu thụ khẳng định (Reply URL)',
      audience_uri_field_name: 'Audience URI (SP Entity ID)',
      entity_id_field_name: 'Entity ID của nhà cung cấp dịch vụ (SP)',
      entity_id_field_tooltip:
        'SP Entity ID có thể ở dạng chuỗi bất kỳ, thường dùng dạng URI hoặc URL làm định danh, nhưng không bắt buộc.',
      acs_url_field_placeholder: 'https://your-domain.com/api/saml/callback',
      entity_id_field_placeholder: 'urn:your-domain.com:sp:saml:{serviceProviderId}',
      sign_auth_request: 'Ký yêu cầu xác thực',
      sign_auth_request_tooltip:
        'sdvico ký các yêu cầu xác thực SAML bằng một chứng chỉ được tạo ra. Chỉ bật khi nhà cung cấp danh tính của bạn được cấu hình để xác minh yêu cầu đã ký.',
      signing_certificate_field_name: 'Chứng chỉ ký yêu cầu',
      signing_keys_empty: 'Chưa có khóa ký nào được tạo.',
      generate_signing_key: 'Tạo khóa mới',
      signing_key_generated: 'Khóa ký đã được tạo.',
      signing_key_activated: 'Khóa ký đã được kích hoạt.',
      signing_key_deactivated: 'Khóa ký đã bị hủy kích hoạt.',
      signing_key_deleted: 'Khóa ký đã bị xóa.',
      sign_auth_request_warning:
        'Sau khi bật, hãy tạo một khóa ký ở dưới và đăng ký chứng chỉ của khóa đó với nhà cung cấp danh tính của bạn (và bật xác minh yêu cầu đã ký ở đó). Cho đến khi chứng chỉ được đăng ký, việc đăng nhập qua kết nối này sẽ thất bại.',
    },
    oidc: {
      redirect_uri_field_name: 'Redirect URI (Callback URL)',
      redirect_uri_field_description:
        "Redirect URI là nơi người dùng được chuyển hướng đến sau khi xác thực SSO. Hãy thêm URI này vào cấu hình IdP của bạn.",
      redirect_uri_field_custom_domain_description:
        'Nếu bạn dùng nhiều <a>miền tùy chỉnh</a> trong sdvico, hãy nhớ thêm tất cả các callback URI tương ứng vào IdP để SSO hoạt động trên mọi miền.\n\nMiền sdvico mặc định (*.logto.app) luôn hợp lệ — chỉ thêm nó nếu bạn cũng muốn hỗ trợ SSO trên miền đó.',
    },
  },
  attribute_mapping: {
    title: 'Ánh xạ thuộc tính',
    description:
      '`id` và `email` là bắt buộc để đồng bộ hồ sơ người dùng từ IdP. Nhập tên claim và giá trị sau vào IdP của bạn.',
    col_sp_claims: 'Giá trị của nhà cung cấp dịch vụ (sdvico)',
    col_idp_claims: 'Tên claim của nhà cung cấp danh tính',
    idp_claim_tooltip: 'Tên claim của nhà cung cấp danh tính',
  },
  metadata: {
    title: 'Cấu hình metadata của IdP',
    description: 'Cấu hình metadata từ nhà cung cấp danh tính',
    dropdown_trigger_text: 'Dùng phương thức cấu hình khác',
    dropdown_title: 'chọn phương thức cấu hình của bạn',
    metadata_format_url: 'Nhập URL metadata',
    metadata_format_xml: 'Tải lên file metadata XML',
    metadata_format_manual: 'Nhập chi tiết metadata thủ công',
    saml: {
      metadata_url_field_name: 'URL metadata',
      metadata_url_description:
        'Tự động lấy dữ liệu từ URL metadata và luôn cập nhật chứng chỉ mới nhất.',
      metadata_xml_field_name: 'File metadata XML của IdP',
      metadata_xml_uploader_text: 'Tải lên file metadata XML',
      sign_in_endpoint_field_name: 'URL đăng nhập',
      idp_entity_id_field_name: 'Entity ID của IdP (Issuer)',
      certificate_field_name: 'Chứng chỉ ký',
      certificate_placeholder: 'Sao chép và dán chứng chỉ x509',
      certificate_required: 'Cần có chứng chỉ ký.',
    },
    oidc: {
      client_id_field_name: 'Client ID',
      client_secret_field_name: 'Client secret',
      issuer_field_name: 'Đơn vị phát hành (Issuer)',
      scope_field_name: 'Phạm vi',
      scope_field_placeholder: 'Nhập các phạm vi (phân tách bằng khoảng trắng)',
    },
  },
};

export default Object.freeze(enterprise_sso);
