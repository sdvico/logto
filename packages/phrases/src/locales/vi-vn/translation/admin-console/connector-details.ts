const connector_details = {
  page_title: 'Chi tiết connector',
  back_to_connectors: 'Về connector',
  check_readme: 'Xem README',
  settings: 'Cài đặt chung',
  settings_description:
    'Tích hợp nhà cung cấp bên thứ ba để đăng nhập mạng xã hội và liên kết tài khoản mạng xã hội nhanh chóng',
  setting_description_with_token_storage_supported:
    'Tích hợp nhà cung cấp bên thứ ba để đăng nhập mạng xã hội, liên kết tài khoản mạng xã hội và truy cập API.',
  email_connector_settings_description:
    'Tích hợp với nhà cung cấp gửi email của bạn để cho phép đăng ký và đăng nhập bằng email không cần mật khẩu cho người dùng cuối.',
  parameter_configuration: 'Cấu hình tham số',
  test_connection: 'Kiểm thử',
  save_error_empty_config: 'Vui lòng nhập cấu hình',
  send: 'Gửi',
  send_error_invalid_format: 'Dữ liệu nhập không hợp lệ',
  edit_config_label: 'Nhập JSON của bạn ở đây',
  test_email_sender: 'Kiểm thử connector email của bạn',
  test_sms_sender: 'Kiểm thử connector SMS của bạn',
  test_email_placeholder: 'john.doe@example.com',
  test_sms_placeholder: '+1 555-123-4567',
  test_message_sent: 'Đã gửi tin nhắn kiểm thử',
  test_sender_description:
    'sdvico dùng mẫu "Generic" để kiểm thử. Bạn sẽ nhận được một tin nhắn nếu connector của bạn được cấu hình đúng.',
  options_change_email: 'Đổi connector email',
  options_change_sms: 'Đổi connector SMS',
  connector_deleted: 'Đã xóa connector thành công',
  type_email: 'Connector email',
  type_sms: 'Connector SMS',
  type_social: 'Connector mạng xã hội',
  in_used_social_deletion_description:
    'Connector này đang được dùng trong trải nghiệm đăng nhập của bạn. Nếu xóa, trải nghiệm đăng nhập <name/> sẽ bị xóa trong cài đặt trải nghiệm đăng nhập. Bạn sẽ cần cấu hình lại nếu muốn thêm lại sau này.',
  in_used_passwordless_deletion_description:
    'Connector {{name}} này đang được dùng trong trải nghiệm đăng nhập của bạn. Nếu xóa, trải nghiệm đăng nhập của bạn sẽ không hoạt động đúng cho đến khi bạn giải quyết xung đột này. Bạn sẽ cần cấu hình lại nếu muốn thêm lại sau này.',
  deletion_description:
    'Bạn đang xóa connector này. Hành động này không thể hoàn tác, và bạn sẽ cần cấu hình lại nếu muốn thêm lại sau này.',
  logto_email: {
    total_email_sent: 'Tổng số email đã gửi: {{value, number}}',
    total_email_sent_tip:
      'sdvico dùng SendGrid cho email tích hợp an toàn và ổn định. Hoàn toàn miễn phí sử dụng. <a>Tìm hiểu thêm</a>',
    hosted_email_usage: {
      daily: 'Hàng ngày <value>{{usage, number}}</value> / {{limit, number}}',
      daily_unlimited: 'Hàng ngày <value>{{usage, number}}</value>',
      monthly: 'Hàng tháng <value>{{usage, number}}</value> / {{limit, number}}',
      monthly_unlimited: 'Hàng tháng <value>{{usage, number}}</value>',
      tip: 'Các gói Free và Development có giới hạn dịch vụ email tích hợp theo ngày và theo tháng.',
      banner: {
        approaching:
          'Bạn đang gần đạt giới hạn gửi email tích hợp của sdvico. <provider>Kết nối nhà cung cấp email riêng của bạn</provider>, hoặc <upgrade>nâng cấp gói</upgrade> để tiếp tục dùng dịch vụ email tích hợp của sdvico.',
        reached:
          'Bạn đã đạt giới hạn gửi email tích hợp của sdvico, điều này có thể làm gián đoạn email đăng nhập. <provider>Kết nối nhà cung cấp email riêng của bạn</provider>, hoặc <upgrade>nâng cấp gói</upgrade> để tiếp tục dùng dịch vụ email tích hợp của sdvico.',
      },
    },
    email_template_title: 'Mẫu email',
    template_description:
      'Email tích hợp dùng mẫu mặc định để gửi email xác minh một cách liền mạch. Không cần cấu hình gì, và bạn có thể tùy chỉnh thông tin thương hiệu cơ bản.',
    template_description_link_text: 'Xem mẫu',
    description_action_text: 'Xem mẫu',
    from_email_field: 'Email gửi từ',
    sender_name_field: 'Tên người gửi',
    sender_name_tip:
      'Tùy chỉnh tên người gửi cho email. Nếu để trống, "Verification" sẽ được dùng làm tên mặc định.',
    sender_name_placeholder: 'Tên người gửi của bạn',
    company_information_field: 'Thông tin công ty',
    company_information_description:
      'Hiển thị tên công ty, địa chỉ hoặc mã bưu chính ở cuối email để tăng độ tin cậy.',
    company_information_placeholder: 'Thông tin cơ bản về công ty của bạn',
    email_logo_field: 'Logo email',
    email_logo_tip:
      'Hiển thị logo thương hiệu của bạn ở đầu email. Dùng cùng một ảnh cho cả chế độ sáng và tối.',
    urls_not_allowed: 'Không được phép chứa URL',
    test_notes: 'sdvico dùng mẫu "Generic" để kiểm thử.',
  },
  google_one_tap: {
    title: 'Google One Tap',
    description: 'Google One Tap là cách an toàn và dễ dàng để người dùng đăng nhập vào website của bạn.',
    enable_google_one_tap: 'Bật Google One Tap',
    enable_google_one_tap_description:
      'Bật Google One Tap trong trải nghiệm đăng nhập của bạn: cho phép người dùng đăng ký hoặc đăng nhập nhanh bằng tài khoản Google nếu họ đã đăng nhập sẵn trên thiết bị.',
    configure_google_one_tap: 'Cấu hình Google One Tap',
    auto_select: 'Tự động chọn thông tin đăng nhập nếu có thể',
    close_on_tap_outside: 'Hủy hộp thoại nếu người dùng nhấn/chạm ra ngoài',
    itp_support: 'Bật <a>trải nghiệm One Tap nâng cao trên trình duyệt ITP</a>',
  },
  sign_in_experience: {
    in_use: 'Đã bật cho đăng nhập ',
    not_in_use: 'Đã tắt cho đăng nhập ',
  },
  email_logs: {
    title: 'Nhật ký email',
    time: 'Thời gian',
    recipient: 'Người nhận',
    recipient_placeholder: 'Tìm theo địa chỉ người nhận đầy đủ',
    template_type: 'Loại mẫu',
    status: 'Trạng thái',
    status_sent: 'Đã gửi',
    status_failed: 'Thất bại',
    language_tag: 'Ngôn ngữ',
    provider_message_id: 'ID tin nhắn của nhà cung cấp',
  },
};

export default Object.freeze(connector_details);
