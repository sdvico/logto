const domain = {
  status: {
    connecting: 'Đang kết nối...',
    in_use: 'Đang sử dụng',
    failed_to_connect: 'Kết nối thất bại',
  },
  update_endpoint_notice:
    'Đừng quên cập nhật domain cho callback URI của connector mạng xã hội và endpoint sdvico trong ứng dụng của bạn nếu bạn muốn dùng domain tùy chỉnh cho các tính năng này.',
  error_hint:
    'Hãy đảm bảo bạn đã cập nhật bản ghi DNS. Chúng tôi sẽ tiếp tục kiểm tra mỗi {{value}} giây.',
  custom: {
    custom_domain: 'Domain tùy chỉnh',
    custom_domain_description:
      'Nâng cao nhận diện thương hiệu bằng cách dùng domain tùy chỉnh. Domain này sẽ được dùng trong trải nghiệm đăng nhập của bạn.',
    custom_domain_field: 'Domain tùy chỉnh',
    custom_domain_placeholder: 'auth.domain.com',
    add_custom_domain_field: 'Thêm domain tùy chỉnh',
    custom_domains_field: 'Domain tùy chỉnh',
    add_domain: 'Thêm domain',
    invalid_domain_format:
      'Vui lòng nhập một domain URL hợp lệ với ít nhất ba phần, ví dụ "auth.domain.com."',
    verify_domain: 'Xác minh domain',
    enable_ssl: 'Bật SSL',
    checking_dns_tip:
      'Sau khi bạn cấu hình bản ghi DNS, quá trình sẽ tự động chạy và có thể mất đến 24 giờ. Bạn có thể rời khỏi màn hình này trong khi nó đang chạy.',
    enable_ssl_tip:
      'Bật SSL sẽ tự động chạy và có thể mất đến 24 giờ. Bạn có thể rời khỏi màn hình này trong khi nó đang chạy.',
    generating_dns_records: 'Đang tạo bản ghi DNS...',
    add_dns_records: 'Vui lòng thêm các bản ghi DNS này vào nhà cung cấp DNS của bạn.',
    dns_table: {
      type_field: 'Loại',
      name_field: 'Tên',
      value_field: 'Giá trị',
    },
    deletion: {
      delete_domain: 'Xóa domain',
      reminder: 'Xóa domain tùy chỉnh',
      description: 'Bạn có chắc muốn xóa domain tùy chỉnh này?',
      in_used_description:
        'Bạn có chắc muốn xóa domain tùy chỉnh "<span>{{domain}}</span>" này?',
      in_used_tip:
        'Nếu bạn đã dùng domain tùy chỉnh này trong nhà cung cấp connector mạng xã hội hoặc endpoint ứng dụng, bạn sẽ cần đổi URI sang domain mặc định của sdvico "<span>{{domain}}</span>" trước. Điều này cần thiết để nút đăng nhập mạng xã hội hoạt động bình thường.',
      deleted: 'Xóa domain tùy chỉnh thành công!',
    },
    config_custom_domain_description:
      'Cấu hình domain tùy chỉnh để thiết lập các tính năng sau: ứng dụng, connector mạng xã hội và connector doanh nghiệp.',
    verification_files: {
      title: 'Tệp xác minh domain',
      description:
        'Phục vụ các tệp văn bản hoặc JSON nhỏ từ domain tùy chỉnh này để xác minh quyền sở hữu domain với các dịch vụ bên thứ ba.',
      add: 'Thêm tệp xác minh',
      empty: 'Chưa có tệp xác minh nào được cấu hình.',
      path: 'Đường dẫn tệp',
      content_type: 'Loại nội dung',
      content_type_text: 'Văn bản thuần',
      content_type_json: 'JSON',
      content: 'Nội dung tệp',
      content_placeholder: 'Dán đúng nội dung tệp xác minh',
      required: 'Trường này là bắt buộc.',
      invalid_path:
        'Dùng một tên tệp có phần mở rộng tại gốc domain, hoặc một đường dẫn dưới /.well-known/. Chỉ hỗ trợ chữ cái, số, dấu chấm, gạch ngang và gạch dưới.',
      duplicate_path: 'Đã có tệp xác minh khác dùng đường dẫn này.',
      content_too_long: 'Nội dung tệp không được vượt quá 16.384 ký tự.',
      invalid_json: 'Vui lòng nhập nội dung JSON hợp lệ.',
    },
  },
  default: {
    default_domain: 'Domain mặc định',
    default_domain_description:
      'sdvico cung cấp một domain mặc định đã được cấu hình sẵn, dùng ngay không cần thiết lập thêm. Domain mặc định này đóng vai trò phương án dự phòng ngay cả khi bạn đã bật domain tùy chỉnh.',
    default_domain_field: 'Domain mặc định của sdvico',
  },
  custom_endpoint_note:
    'Bạn có thể tùy chỉnh tên domain của các endpoint này theo yêu cầu. Chọn "{{custom}}" hoặc "{{default}}".',
  custom_social_callback_url_note:
    'Bạn có thể tùy chỉnh tên domain của URI này để khớp với endpoint ứng dụng của bạn. Chọn "{{custom}}" hoặc "{{default}}".',
  custom_acs_url_note:
    'Bạn có thể tùy chỉnh tên domain của URI này để khớp với URL assertion consumer service của nhà cung cấp danh tính của bạn. Chọn "{{custom}}" hoặc "{{default}}".',
  switch_custom_domain_tip:
    'Đổi domain để xem endpoint tương ứng. Thêm domain khác qua <a>domain tùy chỉnh</a>.',
  switch_saml_app_domain_tip:
    'Đổi domain để xem các URL tương ứng. Với giao thức SAML, URL metadata có thể được lưu trên bất kỳ domain truy cập được. Tuy nhiên, domain được chọn sẽ quyết định URL dịch vụ SSO mà SP dùng để chuyển hướng người dùng cuối đến xác thực, ảnh hưởng đến trải nghiệm đăng nhập và khả năng hiển thị URL.',
  switch_saml_connector_domain_tip:
    'Đổi domain để xem các URL tương ứng. Domain được chọn sẽ quyết định ACS URL của bạn, ảnh hưởng đến nơi người dùng được chuyển hướng sau khi đăng nhập SSO. Hãy chọn domain phù hợp với hành vi chuyển hướng mong đợi của ứng dụng.',
};

export default Object.freeze(domain);
