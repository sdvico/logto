const jwt_claims = {
  title: 'JWT tùy chỉnh',
  description:
    'Tùy chỉnh access token hoặc ID token, cung cấp thêm thông tin cho ứng dụng của bạn.',
  access_token: {
    card_title: 'Access token',
    card_description:
      'Access token là thông tin xác thực được các API dùng để cấp quyền cho yêu cầu, chỉ chứa các claim cần thiết cho quyết định truy cập.',
  },
  user_jwt: {
    card_field: 'Access token của người dùng',
    card_description: 'Thêm dữ liệu riêng của người dùng trong quá trình cấp access token.',
    for: 'cho người dùng',
  },
  machine_to_machine_jwt: {
    card_field: 'Access token máy-đến-máy',
    card_description: 'Thêm dữ liệu bổ sung trong quá trình cấp token máy-đến-máy.',
    for: 'cho M2M',
  },
  id_token: {
    card_title: 'ID token',
    card_description:
      'ID token là một khẳng định danh tính nhận được sau khi đăng nhập, chứa các claim danh tính người dùng để client dùng cho hiển thị hoặc tạo phiên làm việc.',
    card_field: 'ID token của người dùng',
    card_field_description:
      "Các claim 'sub', 'email', 'phone', 'profile', và 'address' luôn có sẵn. Các claim khác phải được bật ở đây trước. Trong mọi trường hợp, ứng dụng của bạn phải yêu cầu đúng phạm vi (scope) khi tích hợp để nhận được các claim này.",
  },
  code_editor_title: 'Tùy chỉnh các claim {{token}}',
  custom_jwt_create_button: 'Thêm claim tùy chỉnh',
  custom_jwt_item: 'Claim tùy chỉnh {{for}}',
  delete_modal_title: 'Xóa claim tùy chỉnh',
  delete_modal_content: 'Bạn có chắc chắn muốn xóa các claim tùy chỉnh này?',
  clear: 'Bắt đầu lại',
  cleared: 'Đã xóa',
  restore: 'Khôi phục mặc định',
  restored: 'Đã khôi phục',
  data_source_tab: 'Nguồn dữ liệu',
  error_handling_tab: 'Xử lý lỗi',
  test_tab: 'Ngữ cảnh kiểm thử',
  jwt_claims_description: 'Các claim mặc định được tự động đưa vào và không thể bị ghi đè.',
  user_data: {
    title: 'Ngữ cảnh người dùng',
    subtitle: 'Dùng tham số đầu vào `context.user` để cung cấp thông tin quan trọng về người dùng.',
  },
  grant_data: {
    title: 'Ngữ cảnh grant',
    subtitle:
      'Dùng tham số đầu vào `context.grant` để cung cấp thông tin quan trọng về grant, chỉ khả dụng cho trao đổi token.',
  },
  interaction_data: {
    title: 'Ngữ cảnh tương tác người dùng',
    subtitle:
      "Dùng tham số `context.interaction` để truy cập thông tin tương tác của người dùng cho phiên xác thực hiện tại.",
  },
  application_data: {
    title: 'Ngữ cảnh ứng dụng',
    subtitle:
      'Dùng tham số đầu vào `context.application` để cung cấp thông tin ứng dụng liên kết với token.',
  },
  organization_data: {
    title: 'Ngữ cảnh tổ chức',
    subtitle:
      'Dùng tham số đầu vào `context.organization` để cung cấp thông tin tổ chức đích, chỉ khả dụng cho token tổ chức.',
  },
  token_data: {
    title: 'Nội dung token',
    subtitle: 'Dùng tham số đầu vào `token` cho nội dung access token hiện tại. ',
  },
  api_context: {
    title: 'Ngữ cảnh API: kiểm soát truy cập',
    subtitle: 'Dùng phương thức `api.denyAccess` để từ chối yêu cầu token.',
  },
  error_handling: {
    title: 'Xử lý lỗi',
    subtitle: 'Kiểm soát việc có chặn cấp token khi script gặp lỗi hay không.',
    input_field_title: 'Hành vi cấp token khi script gặp lỗi',
    block_issuance_switch: 'Chặn cấp token khi script gặp lỗi',
    default_hint_create:
      'Các script claim tùy chỉnh mới mặc định sẽ chặn cấp token khi script gặp lỗi. Nếu API đã cung cấp một giá trị, giá trị đã lưu sẽ được dùng thay thế.',
    default_hint_edit:
      'Các script claim tùy chỉnh hiện có chưa có cài đặt này sẽ giữ hành vi mặc định cũ là tắt cho đến khi bạn lưu một giá trị rõ ràng.',
    warning:
      'Khi được bật, lỗi thời gian chạy của script sẽ từ chối yêu cầu token với `invalid_request` (400) và một `error_description` đã được bản địa hóa. Các lệnh gọi tới `api.denyAccess` vẫn trả về `access_denied`.',
  },
  fetch_external_data: {
    title: 'Lấy dữ liệu bên ngoài',
    subtitle: 'Tích hợp dữ liệu từ API bên ngoài của bạn trực tiếp vào claim.',
    description:
      'Dùng hàm `fetch` để gọi API bên ngoài của bạn và đưa dữ liệu vào claim tùy chỉnh. Ví dụ: ',
  },
  environment_variables: {
    title: 'Đặt biến môi trường',
    subtitle: 'Dùng biến môi trường để lưu trữ thông tin nhạy cảm.',
    input_field_title: 'Thêm biến môi trường',
    sample_code: 'Truy cập biến môi trường trong bộ xử lý claim token tùy chỉnh của bạn. Ví dụ: ',
  },
  jwt_claims_hint:
    'Giới hạn claim tùy chỉnh dưới 50KB. Các claim token mặc định được tự động đưa vào token và không thể bị ghi đè.',
  tester: {
    subtitle: 'Điều chỉnh token và dữ liệu người dùng giả để kiểm thử.',
    run_button: 'Chạy kiểm thử',
    result_title: 'Kết quả kiểm thử',
  },
  sandbox_warning: {
    title: 'Script chạy với quyền của máy chủ',
    description:
      'Trên sdvico tự triển khai (self-hosted), script này chạy trong cùng môi trường với sdvico: nó có thể đọc biến môi trường máy chủ và truy cập các dịch vụ trong mạng nội bộ của bạn. Script không được cách ly (sandbox). Chỉ cấp quyền truy cập trang này cho những người bạn tin tưởng có quyền truy cập máy chủ.',
  },
  form_error: {
    invalid_json: 'Định dạng JSON không hợp lệ',
  },
};

export default Object.freeze(jwt_claims);
