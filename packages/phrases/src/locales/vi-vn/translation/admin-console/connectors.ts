const connectors = {
  page_title: 'Connector',
  title: 'Connector',
  subtitle: 'Thiết lập connector để bật trải nghiệm đăng nhập không cần mật khẩu và đăng nhập mạng xã hội',
  create: 'Thêm connector mạng xã hội',
  config_sie_notice: 'Bạn đã thiết lập connector. Hãy đảm bảo cấu hình nó trong <a>{{link}}</a>.',
  config_sie_link_text: 'trải nghiệm đăng nhập',
  tab_email_sms: 'Connector email và SMS',
  tab_social: 'Connector mạng xã hội',
  connector_name: 'Tên connector',
  demo_tip:
    'Số lượng tin nhắn tối đa cho phép với connector demo này bị giới hạn ở 100 và không được khuyến nghị triển khai trong môi trường sản xuất.',
  social_demo_tip:
    'Connector demo được thiết kế chỉ để minh họa và không được khuyến nghị triển khai trong môi trường sản xuất.',
  connector_type: 'Loại',
  placeholder_title: 'Connector mạng xã hội',
  placeholder_description:
    'sdvico đã cung cấp nhiều connector đăng nhập mạng xã hội phổ biến, đồng thời bạn cũng có thể tạo connector riêng bằng các giao thức chuẩn.',
  save_and_done: 'Lưu và hoàn tất',
  type: {
    email: 'Connector email',
    sms: 'Connector SMS',
    social: 'Connector mạng xã hội',
  },
  setup_title: {
    email: 'Thiết lập connector email',
    sms: 'Thiết lập connector SMS',
    social: 'Thêm connector mạng xã hội',
  },
  guide: {
    subtitle: 'Hướng dẫn từng bước để cấu hình connector của bạn',
    general_setting: 'Cài đặt chung',
    parameter_configuration: 'Cấu hình tham số',
    test_connection: 'Kiểm thử kết nối',
    name: 'Tên cho nút đăng nhập mạng xã hội',
    name_placeholder: 'Nhập tên cho nút đăng nhập mạng xã hội',
    name_tip:
      'Tên của nút connector sẽ được hiển thị dạng "Tiếp tục với {{name}}." Hãy chú ý độ dài của tên để tránh quá dài.',
    connector_logo: 'Logo connector',
    connector_logo_tip: 'Logo sẽ được hiển thị trên nút đăng nhập của connector.',
    target: 'Tên nhà cung cấp danh tính',
    target_placeholder: 'Nhập tên nhà cung cấp danh tính của connector',
    target_tip:
      'Giá trị "Tên IdP" có thể là một chuỗi định danh duy nhất để phân biệt danh tính mạng xã hội của bạn.',
    target_tip_standard:
      'Giá trị "Tên IdP" có thể là một chuỗi định danh duy nhất để phân biệt danh tính mạng xã hội của bạn. Cài đặt này không thể thay đổi sau khi connector được tạo.',
    target_tooltip:
      '"Tên IdP" trong connector mạng xã hội của sdvico chỉ "nguồn" của danh tính mạng xã hội của bạn. Trong thiết kế của sdvico, chúng tôi không cho phép trùng "Tên IdP" của cùng một nền tảng để tránh xung đột. Bạn nên hết sức cẩn thận trước khi thêm connector vì bạn KHÔNG THỂ thay đổi giá trị này sau khi đã tạo. <a>Tìm hiểu thêm</a>',
    target_conflict:
      'Tên IdP đã nhập trùng với connector <span>name</span> hiện có. Dùng chung tên IdP có thể gây ra hành vi đăng nhập không mong muốn, khi người dùng có thể truy cập cùng một tài khoản qua hai connector khác nhau.',
    target_conflict_line2:
      'Nếu bạn muốn thay thế connector hiện tại bằng cùng nhà cung cấp danh tính này và cho phép người dùng trước đó đăng nhập mà không cần đăng ký lại, vui lòng xóa connector <span>name</span> và tạo một connector mới với cùng "Tên IdP".',
    target_conflict_line3:
      'Nếu bạn muốn kết nối với một nhà cung cấp danh tính khác, vui lòng sửa "Tên IdP" và tiếp tục.',
    config: 'Nhập JSON cấu hình của bạn',
    sync_profile: 'Đồng bộ thông tin hồ sơ',
    sync_profile_only_at_sign_up: 'Chỉ đồng bộ khi đăng ký',
    sync_profile_each_sign_in: 'Luôn đồng bộ mỗi lần đăng nhập',
    sync_profile_tip:
      'Đồng bộ hồ sơ cơ bản từ nhà cung cấp mạng xã hội, như tên và ảnh đại diện của người dùng.',
    enable_token_storage: {
      title: 'Lưu token để truy cập API lâu dài',
      description:
        'Lưu access token và refresh token trong Secret Vault. Cho phép gọi API tự động mà không cần người dùng đồng ý lại. Ví dụ: cho phép AI Agent của bạn thêm sự kiện vào Google Calendar với ủy quyền lâu dài. <a>Tìm hiểu cách gọi API bên thứ ba</a>',
    },
    callback_uri: 'Redirect URI (Callback URI)',
    callback_uri_description:
      'Redirect URI là nơi người dùng được chuyển hướng đến sau khi ủy quyền mạng xã hội. Thêm tất cả URI hiển thị vào cấu hình của IdP của bạn.',
    callback_uri_custom_domain_description:
      'Nếu bạn dùng nhiều <a>domain tùy chỉnh</a> trong sdvico, hãy chắc chắn thêm tất cả callback URI tương ứng vào IdP để đăng nhập mạng xã hội hoạt động trên mọi domain.\n\nDomain mặc định của sdvico (*.logto.app) luôn hợp lệ — chỉ cần thêm nếu bạn cũng muốn hỗ trợ đăng nhập dưới domain đó.',
    acs_url: 'URL dịch vụ tiêu thụ assertion',
  },
  platform: {
    universal: 'Toàn nền tảng',
    web: 'Web',
    native: 'Native',
  },
  add_multi_platform: ' hỗ trợ nhiều nền tảng, chọn một nền tảng để tiếp tục',
  drawer_title: 'Hướng dẫn Connector',
  drawer_subtitle: 'Làm theo hướng dẫn để tích hợp connector của bạn',
  unknown: 'Connector không xác định',
  standard_connectors: 'Connector chuẩn',
  create_form: {
    third_party_connectors:
      'Tích hợp nhà cung cấp bên thứ ba để đăng nhập mạng xã hội, liên kết tài khoản mạng xã hội và truy cập API nhanh chóng. <a>Tìm hiểu thêm</a>',
    email_connector_upsell: {
      title: 'Dịch vụ email tích hợp của sdvico',
      description:
        'Gửi email không cần cấu hình. Gửi mã xác minh và magic link ngay khi dùng.',
    },
    standard_connectors: 'Hoặc bạn có thể tự tạo connector mạng xã hội theo một giao thức chuẩn.',
  },
};

export default Object.freeze(connectors);
