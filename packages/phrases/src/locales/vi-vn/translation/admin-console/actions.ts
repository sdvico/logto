const actions = {
  page_title: 'Actions',
  title: 'Actions',
  subtitle:
    'Chạy mã tùy chỉnh tại các điểm cụ thể trong luồng xác thực để mở rộng hành vi của sdvico.',
  status: {
    not_configured: 'Chưa cấu hình',
    configured: 'Đã cấu hình',
    enabled: 'Đã bật',
    disabled: 'Đã tắt',
  },
  types: {
    post_first_factor_verification: {
      name: 'Sau khi xác minh yếu tố đầu tiên',
      description: 'Chạy logic tùy chỉnh sau khi xác minh mật khẩu cục bộ thất bại lúc đăng nhập.',
    },
    post_sign_in: {
      name: 'Sau khi đăng nhập',
      description: 'Chạy logic tùy chỉnh sau khi người dùng đăng nhập thành công.',
    },
  },
  data_source_tab: 'Nguồn dữ liệu',
  test_tab: 'Bối cảnh kiểm thử',
  settings_tab: 'Cài đặt',
  event_data: {
    title: 'Dữ liệu sự kiện',
    subtitle: 'Dùng tham số đầu vào `event` cho dữ liệu sự kiện xác thực.',
  },
  result_data: {
    title: 'Kết quả action',
    subtitle: 'Trả về một đối tượng kết quả mà sdvico hiểu được cho loại action này.',
  },
  environment_variables: {
    title: 'Đặt biến môi trường',
    subtitle: 'Dùng biến môi trường để lưu thông tin nhạy cảm.',
    input_field_title: 'Thêm biến môi trường',
    sample_code: 'Truy cập biến môi trường trong action handler của bạn. Ví dụ:',
  },
  fetch_external_data: {
    title: 'Lấy dữ liệu ngoài',
    subtitle: 'Gọi API bên ngoài từ script action của bạn.',
    description:
      'Dùng hàm `fetch` để gọi API bên ngoài và đưa dữ liệu vào kết quả action. Ví dụ:',
  },
  settings: {
    title: 'Cài đặt',
    subtitle: 'Kiểm soát action có đang hoạt động hay không và cách xử lý lỗi khi chạy.',
    enabled: {
      title: 'Bật action',
      description: 'Chạy script này khi sự kiện xác thực được kích hoạt.',
    },
    on_execution_error: {
      title: 'Khi script lỗi',
      description: 'Chọn cách sdvico xử lý khi script gặp lỗi lúc chạy.',
      block: 'Chặn luồng xác thực',
      allow: 'Cho phép luồng xác thực tiếp tục',
      post_first_factor_description:
        'Khi script này lỗi, sdvico luôn từ chối thông tin đăng nhập không hợp lệ để không thể bỏ qua bước xác minh mật khẩu.',
    },
  },
  test_context: {
    subtitle: 'Điều chỉnh dữ liệu sự kiện mẫu dùng khi chạy kiểm thử.',
    input_field_title: 'JSON mẫu sự kiện',
  },
  script: {
    title: 'Script',
    restore: 'Khôi phục mặc định',
    restored: 'Đã khôi phục',
  },
  tester: {
    run_button: 'Chạy kiểm thử',
    result_title: 'Kết quả kiểm thử',
  },
  form_error: {
    invalid_json: 'Định dạng JSON không hợp lệ',
  },
  sandbox_and_security_warning: {
    title: 'Script chạy với quyền của máy chủ',
    description:
      'Trên sdvico tự triển khai (self-hosted), script này chạy trong cùng môi trường với sdvico: nó có thể đọc biến môi trường của máy chủ và truy cập các dịch vụ trong mạng nội bộ của bạn. Nó không được chạy trong sandbox. Chỉ cấp quyền truy cập trang này cho người bạn tin tưởng với quyền truy cập máy chủ. Action này chỉ chạy sau khi xác minh mật khẩu cục bộ thất bại — chỉ trả về `passwordVerified: true` sau khi đã tự xác minh mật khẩu được gửi lên. Người dùng được tạo bởi action này sẽ bỏ qua các rào chặn chỉ áp dụng cho đăng ký, bao gồm danh sách email bị chặn, miền chỉ dùng SSO, chế độ tắt đăng ký, và kiểm tra hồ sơ bắt buộc khi đăng ký. Việc ghi hồ sơ và mật khẩu cho người dùng đã có cũng diễn ra trước khi hoàn tất MFA.',
  },
  sandbox_warning: {
    title: 'Script chạy với quyền của máy chủ',
    description:
      'Trên sdvico tự triển khai (self-hosted), script này chạy trong cùng môi trường với sdvico: nó có thể đọc biến môi trường của máy chủ và truy cập các dịch vụ trong mạng nội bộ của bạn. Nó không được chạy trong sandbox. Chỉ cấp quyền truy cập trang này cho người bạn tin tưởng với quyền truy cập máy chủ.',
  },
  security_warning: {
    title: 'Cảnh báo an toàn',
    description:
      'Action này chỉ chạy sau khi xác minh mật khẩu cục bộ thất bại. Chỉ trả về `passwordVerified: true` sau khi đã tự xác minh mật khẩu được gửi lên. Người dùng được tạo bởi action này sẽ bỏ qua các rào chặn chỉ áp dụng cho đăng ký, bao gồm danh sách email bị chặn, miền chỉ dùng SSO, chế độ tắt đăng ký, và kiểm tra hồ sơ bắt buộc khi đăng ký. Việc ghi hồ sơ và mật khẩu cho người dùng đã có cũng diễn ra trước khi hoàn tất MFA.',
  },
  delete_modal_title: 'Xóa action',
  delete_modal_content:
    'Bạn có chắc muốn xóa action này? Luồng xác thực sẽ không còn chạy script này nữa.',
  deleted: 'Đã xóa action',
  created: 'Đã tạo action',
  saved: 'Đã lưu action',
};

export default Object.freeze(actions);
