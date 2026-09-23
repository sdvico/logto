import concurrent_device_limit from './concurrent-device-limit.js';

const application_details = {
  page_title: 'Chi tiết ứng dụng',
  back_to_applications: 'Về ứng dụng',
  check_guide: 'Xem hướng dẫn',
  settings: 'Cài đặt',
  settings_description:
    'Một "Ứng dụng" là một phần mềm hoặc dịch vụ đã đăng ký có thể truy cập thông tin người dùng hoặc hành động thay cho người dùng. Ứng dụng giúp nhận diện ai đang yêu cầu gì từ sdvico và xử lý việc đăng nhập cùng quyền hạn. Điền các trường bắt buộc để xác thực.',
  integration: 'Tích hợp',
  integration_description:
    'Triển khai với sdvico secure workers, được vận hành bởi mạng biên của Cloudflare để đạt hiệu suất hàng đầu và khởi động lạnh 0ms trên toàn cầu.',
  service_configuration: 'Cấu hình dịch vụ',
  service_configuration_description: 'Hoàn tất các cấu hình cần thiết trong dịch vụ của bạn.',
  session: 'Phiên',
  endpoints_and_credentials: 'Endpoint & Thông tin xác thực',
  endpoints_and_credentials_description:
    'Dùng các endpoint và thông tin xác thực sau để thiết lập kết nối OIDC trong ứng dụng của bạn.',
  refresh_token_settings: 'Refresh token',
  refresh_token_settings_description: 'Quản lý các quy tắc refresh token cho ứng dụng này.',
  machine_logs: 'Nhật ký máy',
  application_name: 'Tên ứng dụng',
  application_name_placeholder: 'Ứng dụng của tôi',
  description: 'Mô tả',
  description_placeholder: 'Nhập mô tả ứng dụng của bạn',
  config_endpoint: 'Endpoint cấu hình OpenID provider',
  issuer_endpoint: 'Issuer endpoint',
  jwks_uri: 'JWKS URI',
  authorization_endpoint: 'Authorization endpoint',
  authorization_endpoint_tip:
    'Endpoint để thực hiện xác thực và ủy quyền. Được dùng cho <a>Authentication</a> theo OpenID Connect.',
  show_endpoint_details: 'Hiện chi tiết endpoint',
  hide_endpoint_details: 'Ẩn chi tiết endpoint',
  logto_endpoint: 'Endpoint sdvico',
  application_id: 'App ID',
  application_id_tip:
    'Định danh ứng dụng duy nhất do sdvico tạo. Nó cũng tương ứng với "<a>client_id</a>" trong OpenID Connect.',
  application_secret: 'App secret',
  application_secret_other: 'App secret',
  redirect_uri: 'Redirect URI',
  redirect_uris: 'Redirect URI',
  redirect_uri_placeholder: 'https://your.website.com/app',
  redirect_uri_placeholder_native: 'io.logto://callback',
  redirect_uri_tip:
    'URI được chuyển hướng đến sau khi người dùng đăng nhập (thành công hoặc không). Xem <a>AuthRequest</a> theo OpenID Connect để biết thêm.',
  mixed_redirect_uri_warning:
    'Loại ứng dụng của bạn không tương thích với ít nhất một trong các redirect URI. Điều này không tuân theo thực hành tốt nhất và chúng tôi khuyến nghị mạnh mẽ giữ các redirect URI thống nhất.',
  wildcard_redirect_uri_warning:
    'Redirect URI dùng ký tự đại diện (wildcard) không phải là chuẩn OIDC và có thể làm tăng bề mặt tấn công. Hãy dùng cẩn thận và ưu tiên redirect URI chính xác khi có thể.',
  post_sign_out_redirect_uri: 'Post sign-out redirect URI',
  post_sign_out_redirect_uris: 'Post sign-out redirect URI',
  post_sign_out_redirect_uri_placeholder: 'https://your.website.com/home',
  post_sign_out_redirect_uri_tip:
    'URI được chuyển hướng đến sau khi người dùng đăng xuất (không bắt buộc). Có thể không có tác dụng thực tế với một số loại ứng dụng.',
  cors_allowed_origins: 'CORS allowed origins',
  cors_allowed_origins_placeholder: 'https://your.website.com',
  cors_allowed_origins_tip:
    'Theo mặc định, tất cả origin của Redirect URI sẽ được cho phép. Thường không cần thao tác gì với trường này. Xem <a>tài liệu MDN</a> để biết thêm chi tiết.',
  token_endpoint: 'Token endpoint',
  user_info_endpoint: 'Userinfo endpoint',
  enable_admin_access: 'Bật quyền truy cập quản trị',
  enable_admin_access_label:
    'Bật hoặc tắt quyền truy cập Management API. Khi bật, bạn có thể dùng access token để gọi Management API thay mặt cho ứng dụng này.',
  always_issue_refresh_token: 'Luôn phát hành refresh token',
  always_issue_refresh_token_label:
    'Khi bật, sdvico sẽ luôn phát hành refresh token, bất kể `prompt=consent` có xuất hiện trong yêu cầu xác thực hay không. Tuy nhiên, không nên dùng cách này trừ khi cần thiết, vì nó không tương thích với OpenID Connect và có thể gây ra sự cố.',
  refresh_token_ttl: 'Thời gian sống (TTL) của refresh token (ngày)',
  refresh_token_ttl_tip:
    'Khoảng thời gian một refresh token có thể được dùng để yêu cầu access token mới trước khi hết hạn và không còn hợp lệ. Yêu cầu token sẽ kéo dài TTL của refresh token đến giá trị này.',
  rotate_refresh_token: 'Luân chuyển refresh token',
  rotate_refresh_token_label:
    'Khi bật, sdvico sẽ phát hành một refresh token mới cho yêu cầu token khi đã qua 70% thời gian sống (TTL) ban đầu hoặc khi đáp ứng một số điều kiện nhất định. <a>Tìm hiểu thêm</a>',
  rotate_refresh_token_label_for_public_clients:
    'Khi bật, sdvico sẽ phát hành một refresh token mới cho mỗi yêu cầu token. <a>Tìm hiểu thêm</a>',
  backchannel_logout: 'Backchannel Logout',
  backchannel_logout_description:
    'Cấu hình endpoint backchannel logout theo OpenID Connect và liệu ứng dụng này có yêu cầu session hay không.',
  backchannel_logout_uri: 'Backchannel logout URI',
  backchannel_logout_uri_session_required: 'Có yêu cầu session không?',
  backchannel_logout_uri_session_required_description:
    'Khi bật, RP yêu cầu claim `sid` (session ID) phải có trong logout token để xác định phiên RP với OP khi `backchannel_logout_uri` được dùng.',
  token_exchange: 'Đổi token',
  token_exchange_description: 'Quản lý cài đặt đổi token cho ứng dụng này.',
  allow_token_exchange: 'Cho phép đổi token',
  allow_token_exchange_description:
    'Cho phép ứng dụng này khởi tạo yêu cầu đổi token. Điều này cần thiết cho <impersonationLink>giả lập người dùng (user impersonation)</impersonationLink> và <patLink>personal access token</patLink>.',
  allow_token_exchange_public_client_warning:
    'Không khuyến nghị bật đổi token cho public client (single-page app / native app). Public client không thể lưu trữ thông tin xác thực một cách an toàn, điều này có thể khiến ứng dụng của bạn gặp rủi ro giả lập token.',
  device_flow_tag: 'Device flow',
  device_flow_notification:
    'Ứng dụng này bật OAuth 2.0 Device Authorization Flow cho thiết bị hạn chế nhập liệu hoặc ứng dụng không giao diện (ví dụ: TV, CLI). Người dùng hoàn tất đăng nhập trên một thiết bị khác bằng cách nhập mã thiết bị hoặc quét mã QR. <a>Tìm hiểu thêm</a>',
  device_flow_try_demo: 'Thử bản demo',
  delete_description:
    'Hành động này không thể hoàn tác. Nó sẽ xóa vĩnh viễn ứng dụng này. Vui lòng nhập tên ứng dụng <span>{{name}}</span> để xác nhận.',
  enter_your_application_name: 'Nhập tên ứng dụng của bạn',
  application_deleted: 'Đã xóa thành công ứng dụng {{name}}',
  redirect_uri_required: 'Bạn phải nhập ít nhất một redirect URI',
  app_domain_description_1:
    'Bạn có thể tự do dùng domain của mình với {{domain}} được vận hành bởi sdvico, luôn hợp lệ vĩnh viễn.',
  app_domain_description_2:
    'Bạn có thể tự do sử dụng domain <domain>{{domain}}</domain> của mình, luôn hợp lệ vĩnh viễn.',
  custom_rules: 'Quy tắc xác thực tùy chỉnh',
  custom_rules_placeholder: '^/(admin|privacy)/.+$',
  custom_rules_description:
    'Đặt quy tắc bằng biểu thức chính quy cho các route cần xác thực. Mặc định: bảo vệ toàn bộ site nếu để trống.',
  authentication_routes: 'Route xác thực',
  custom_rules_tip:
    "Đây là hai tình huống ví dụ:<ol><li>Chỉ bảo vệ route '/admin' và '/privacy' bằng xác thực: ^/(admin|privacy)/.*</li><li>Loại trừ ảnh JPG khỏi xác thực: ^(?!.*\\.jpg$).*$</li></ol>",
  authentication_routes_description:
    'Chuyển hướng nút xác thực của bạn dùng các route đã chỉ định. Lưu ý: các route này không thể thay thế.',
  protect_origin_server: 'Bảo vệ origin server của bạn',
  protect_origin_server_description:
    'Hãy đảm bảo bảo vệ origin server của bạn khỏi truy cập trực tiếp. Xem hướng dẫn để biết <a>chi tiết hơn</a>.',
  third_party_settings_description:
    'Tích hợp ứng dụng bên thứ ba với sdvico làm Identity Provider (IdP) của bạn bằng OIDC / OAuth 2.0, có màn hình xin sự đồng ý để người dùng ủy quyền.',
  session_duration: 'Thời gian phiên (ngày)',
  try_it: 'Thử ngay',
  no_organization_placeholder: 'Không tìm thấy tổ chức nào. <a>Đến trang tổ chức</a>',
  field_custom_data: 'Dữ liệu tùy chỉnh',
  field_custom_data_tip:
    'Thông tin ứng dụng tùy chỉnh bổ sung không có trong các thuộc tính ứng dụng định sẵn, chẳng hạn cài đặt và cấu hình đặc thù theo nghiệp vụ.',
  custom_data_invalid: 'Dữ liệu tùy chỉnh phải là một đối tượng JSON hợp lệ',
  access_control: {
    name: 'Quy tắc',
    title: 'Kiểm soát truy cập',
    description: 'Tùy chỉnh quy tắc kiểm soát truy cập ở cấp ứng dụng của bạn.',
    enable: 'Bật kiểm soát truy cập cấp ứng dụng',
    enable_description:
      'Bật kiểm soát truy cập chi tiết để giới hạn người dùng nào có thể truy cập ứng dụng này. Nếu tắt, mọi người dùng đã đăng ký trong hệ thống đều có thể truy cập.',
    enable_without_rules_notice: 'Thêm ít nhất một quy tắc truy cập trước khi bật kiểm soát truy cập.',
    load_error: 'Không thể tải quy tắc kiểm soát truy cập.',
    custom_allow_rules: 'Quy tắc cho phép tùy chỉnh',
    custom_allow_rules_description:
      'Tạo quy tắc để người dùng có thuộc tính nhất định có thể truy cập tự động. Cần ít nhất một quy tắc khi đã bật.',
    rules: 'Quy tắc truy cập',
    add_rules: 'Thêm quy tắc',
    rules_description: 'Người dùng có thể truy cập ứng dụng này khi khớp với bất kỳ quy tắc nào đã cấu hình.',
    empty_rules_description: 'Chưa có quy tắc nào được cấu hình.',
    delete_rule_confirmation: 'Bạn có chắc muốn xóa quy tắc này?',
    rule_table_rules: 'Quy tắc',
    rule_table_description: 'Mô tả',
    rule_table_users: 'Người dùng',
    rule_table_members: 'Thành viên',
    rule_table_user_id: 'ID người dùng',
    rule_count: '{{count}} quy tắc',
    rule_count_other: '{{count}} quy tắc',
    rule_users: 'Người dùng',
    rule_users_description: 'Người dùng cụ thể có thể truy cập ứng dụng này.',
    rule_roles: 'Vai trò',
    rule_user_roles: 'Vai trò người dùng',
    rule_user_roles_description: 'Người dùng được gán vai trò người dùng đã chọn có thể truy cập ứng dụng này.',
    rule_organizations: 'Tổ chức',
    rule_organizations_description:
      'Tất cả thành viên hiện tại và tương lai của các tổ chức đã chọn đều có thể truy cập ứng dụng này.',
    rule_organization_roles: 'Vai trò tổ chức',
    rule_organization_roles_description:
      'Thành viên có vai trò tổ chức đã chọn trong các tổ chức đã chọn có thể truy cập ứng dụng này.',
  },
  branding: {
    name: 'Nhận diện thương hiệu',
    description: 'Tùy chỉnh logo ứng dụng và màu thương hiệu cho trải nghiệm cấp ứng dụng.',
    description_third_party:
      'Tùy chỉnh tên hiển thị và logo của ứng dụng bạn trên màn hình xin sự đồng ý.',
    app_logo: 'Logo ứng dụng',
    app_level_sie: 'Trải nghiệm đăng nhập cấp ứng dụng',
    app_level_sie_switch:
      'Bật trải nghiệm đăng nhập cấp ứng dụng và thiết lập nhận diện riêng cho ứng dụng. Nếu tắt, trải nghiệm đăng nhập chung (omni) sẽ được dùng.',
    more_info: 'Thông tin thêm',
    more_info_description: 'Cung cấp cho người dùng thêm chi tiết về ứng dụng của bạn trên màn hình xin sự đồng ý.',
    display_name: 'Tên hiển thị',
    application_logo: 'Logo ứng dụng',
    application_logo_dark: 'Logo ứng dụng (chế độ tối)',
    brand_color: 'Màu thương hiệu',
    brand_color_dark: 'Màu thương hiệu (chế độ tối)',
    terms_of_use_url: 'URL điều khoản sử dụng ứng dụng',
    privacy_policy_url: 'URL chính sách bảo mật ứng dụng',
  },
  permissions: {
    name: 'Quyền',
    description:
      'Chọn các quyền mà ứng dụng bên thứ ba cần để người dùng ủy quyền truy cập các loại dữ liệu cụ thể.',
    user_permissions: 'Dữ liệu người dùng cá nhân',
    organization_permissions: 'Quyền truy cập tổ chức',
    table_name: 'Cấp quyền',
    field_name: 'Quyền',
    field_description: 'Hiển thị trên màn hình xin sự đồng ý',
    delete_text: 'Xóa quyền',
    permission_delete_confirm:
      'Hành động này sẽ thu hồi các quyền đã cấp cho ứng dụng bên thứ ba, ngăn nó yêu cầu người dùng ủy quyền cho các loại dữ liệu cụ thể. Bạn có chắc muốn tiếp tục?',
    permissions_assignment_description:
      'Chọn các quyền mà ứng dụng bên thứ ba yêu cầu để người dùng ủy quyền truy cập các loại dữ liệu cụ thể.',
    user_profile: 'Dữ liệu người dùng',
    api_permissions: 'Quyền API',
    organization: 'Quyền tổ chức',
    user_permissions_assignment_form_title: 'Thêm quyền hồ sơ người dùng',
    organization_permissions_assignment_form_title: 'Thêm quyền tổ chức',
    api_resource_permissions_assignment_form_title: 'Thêm quyền API resource',
    user_data_permission_description_tips:
      'Bạn có thể sửa mô tả của quyền dữ liệu người dùng cá nhân qua "Trải nghiệm đăng nhập > Nội dung > Quản lý ngôn ngữ"',
    permission_description_tips:
      'Khi sdvico được dùng làm Identity Provider (IdP) để xác thực trong ứng dụng bên thứ ba, và người dùng được yêu cầu ủy quyền, mô tả này sẽ hiển thị trên màn hình xin sự đồng ý.',
    user_title: 'Người dùng',
    user_description:
      'Chọn các quyền mà ứng dụng bên thứ ba yêu cầu để truy cập dữ liệu người dùng cụ thể.',
    grant_user_level_permissions: 'Cấp quyền dữ liệu người dùng',
    organization_title: 'Tổ chức',
    organization_description:
      'Chọn các quyền mà ứng dụng bên thứ ba yêu cầu để truy cập dữ liệu tổ chức cụ thể.',
    grant_organization_level_permissions: 'Cấp quyền dữ liệu tổ chức',
    oidc_title: 'OIDC',
    oidc_description:
      'Các quyền OIDC cốt lõi được tự động cấu hình cho ứng dụng của bạn. Các scope này thiết yếu cho xác thực và không hiển thị trên màn hình xin sự đồng ý của người dùng.',
    default_oidc_permissions: 'Quyền OIDC mặc định',
    permission_column: 'Quyền',
    guide_column: 'Hướng dẫn',
    openid_permission: 'openid',
    openid_permission_guide:
      "Không bắt buộc cho truy cập resource OAuth.\nBắt buộc cho xác thực OIDC. Cấp quyền truy cập ID token và cho phép truy cập 'userinfo_endpoint'.",
    offline_access_permission: 'offline_access',
    offline_access_permission_guide:
      'Không bắt buộc. Lấy refresh token cho truy cập lâu dài hoặc tác vụ nền.',
  },
  roles: {
    assign_button: 'Gán vai trò',
    delete_description:
      'Hành động này sẽ xóa vai trò này khỏi ứng dụng machine-to-machine này. Vai trò vẫn còn tồn tại, nhưng sẽ không còn gắn với ứng dụng machine-to-machine này nữa.',
    deleted: 'Đã xóa {{name}} thành công khỏi người dùng này.',
    assign_title: 'Gán vai trò cho {{name}}',
    assign_subtitle:
      'Ứng dụng machine-to-machine phải có vai trò loại machine-to-machine để truy cập các API resource liên quan.',
    assign_role_field: 'Gán vai trò',
    role_search_placeholder: 'Tìm theo tên vai trò',
    added_text: 'Đã thêm {{value, number}}',
    assigned_app_count: '{{value, number}} ứng dụng',
    confirm_assign: 'Gán vai trò',
    role_assigned: 'Đã gán vai trò thành công',
    search: 'Tìm theo tên vai trò, mô tả hoặc ID',
    empty: 'Không có vai trò nào',
  },
  secrets: {
    value: 'Giá trị',
    empty: 'Ứng dụng này không có secret nào.',
    created_at: 'Tạo lúc',
    expires_at: 'Hết hạn lúc',
    never: 'Không bao giờ',
    create_new_secret: 'Tạo secret mới',
    delete_confirmation:
      'Hành động này không thể hoàn tác. Bạn có chắc muốn xóa secret này?',
    deleted: 'Đã xóa secret thành công.',
    activated: 'Đã kích hoạt secret thành công.',
    deactivated: 'Đã hủy kích hoạt secret thành công.',
    legacy_secret: 'Secret cũ',
    expired: 'Đã hết hạn',
    expired_tooltip: 'Secret này đã hết hạn vào {{date}}.',
    create_modal: {
      title: 'Tạo application secret',
      expiration: 'Hết hạn',
      expiration_description: 'Secret sẽ hết hạn vào {{date}}.',
      expiration_description_never:
        'Secret sẽ không bao giờ hết hạn. Chúng tôi khuyến nghị đặt ngày hết hạn để tăng cường an toàn.',
      days: '{{count}} ngày',
      days_other: '{{count}} ngày',
      years: '{{count}} năm',
      years_other: '{{count}} năm',
      created: 'Đã tạo secret {{name}} thành công.',
    },
    edit_modal: {
      title: 'Sửa application secret',
      edited: 'Đã sửa secret {{name}} thành công.',
    },
  },
  saml_idp_config: {
    title: 'Metadata SAML IdP',
    description:
      'Dùng metadata và chứng chỉ sau để cấu hình SAML IdP trong ứng dụng của bạn.',
    metadata_url_label: 'URL metadata IdP',
    single_sign_on_service_url_label: 'URL dịch vụ single sign-on',
    idp_entity_id_label: 'Entity ID của IdP',
  },
  saml_idp_certificates: {
    title: 'Chứng chỉ ký SAML',
    expires_at: 'Hết hạn lúc',
    finger_print: 'Fingerprint',
    status: 'Trạng thái',
    active: 'Đang hoạt động',
    inactive: 'Không hoạt động',
  },
  saml_idp_name_id_format: {
    title: 'Định dạng Name ID',
    description: 'Chọn định dạng name ID của SAML IdP.',
    persistent: 'Persistent',
    persistent_description: 'Dùng ID người dùng sdvico làm Name ID',
    transient: 'Transient',
    transient_description: 'Dùng ID người dùng một lần làm Name ID',
    unspecified: 'Unspecified',
    unspecified_description: 'Dùng ID người dùng sdvico làm Name ID',
    email_address: 'Địa chỉ email',
    email_address_description: 'Dùng địa chỉ email làm Name ID',
  },
  saml_idp_authentication: {
    always_force_authn: 'Luôn buộc xác thực lại',
    always_force_authn_description:
      'Yêu cầu người dùng đăng nhập lại mỗi khi truy cập ứng dụng này, ngay cả khi họ đã có phiên sdvico.',
    always_force_authn_tip:
      'Khi bật, sdvico luôn yêu cầu người dùng đăng nhập lại cho ứng dụng này. Khi tắt, một phiên sdvico hiện có sẽ được dùng lại trừ khi service provider yêu cầu xác thực mới bằng ForceAuthn.',
  },
  saml_encryption_config: {
    encrypt_assertion: 'Mã hóa assertion SAML',
    encrypt_assertion_description: 'Khi bật tùy chọn này, assertion SAML sẽ được mã hóa.',
    encrypt_then_sign: 'Mã hóa rồi ký',
    encrypt_then_sign_description:
      'Khi bật tùy chọn này, assertion SAML sẽ được mã hóa rồi ký; nếu không, assertion SAML sẽ được ký rồi mã hóa.',
    certificate: 'Chứng chỉ',
    certificate_tooltip:
      'Sao chép và dán chứng chỉ x509 bạn nhận được từ service provider để mã hóa assertion SAML.',
    certificate_placeholder:
      '-----BEGIN CERTIFICATE-----\nMIICYDCCAcmgAwIBA...\n-----END CERTIFICATE-----\n',
    certificate_missing_error: 'Chứng chỉ là bắt buộc.',
    certificate_invalid_format_error:
      'Phát hiện định dạng chứng chỉ không hợp lệ. Vui lòng kiểm tra định dạng chứng chỉ và thử lại.',
  },
  saml_app_attribute_mapping: {
    name: 'Ánh xạ thuộc tính',
    title: 'Ánh xạ thuộc tính cơ bản',
    description: 'Thêm ánh xạ thuộc tính để đồng bộ hồ sơ người dùng từ sdvico sang ứng dụng của bạn.',
    col_logto_claims: 'Giá trị của sdvico',
    col_sp_claims: 'Tên giá trị của ứng dụng của bạn',
    add_button: 'Thêm mục khác',
  },
  concurrent_device_limit,
};

export default Object.freeze(application_details);
