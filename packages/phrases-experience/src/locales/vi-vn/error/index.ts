import password_rejected from './password-rejected.js';

const error = {
  general_required: `{{types, list(type: disjunction;)}} là bắt buộc`,
  general_invalid: `{{types, list(type: disjunction;)}} không hợp lệ`,
  invalid_min_max_input: 'Giá trị nhập phải nằm trong khoảng từ {{minValue}} đến {{maxValue}}',
  invalid_min_max_length:
    'Độ dài giá trị nhập phải nằm trong khoảng từ {{minLength}} đến {{maxLength}}',
  username_required: 'Tên đăng nhập là bắt buộc',
  password_required: 'Mật khẩu là bắt buộc',
  username_exists: 'Tên đăng nhập đã tồn tại',
  username_should_not_start_with_number: 'Tên đăng nhập không được bắt đầu bằng số',
  username_invalid_charset: 'Tên đăng nhập chỉ được chứa chữ cái, số hoặc gạch dưới.',
  username_too_short: 'Tên đăng nhập phải có ít nhất {{min}} ký tự.',
  username_too_long: 'Tên đăng nhập tối đa {{max}} ký tự.',
  username_uppercase_not_allowed: 'Không được dùng chữ hoa trong tên đăng nhập.',
  username_lowercase_not_allowed: 'Không được dùng chữ thường trong tên đăng nhập.',
  username_numbers_not_allowed: 'Không được dùng số trong tên đăng nhập.',
  username_underscore_not_allowed: 'Không được dùng gạch dưới trong tên đăng nhập.',
  invalid_email: 'Email không hợp lệ',
  invalid_phone: 'Số điện thoại không hợp lệ',
  passwords_do_not_match: 'Mật khẩu không khớp.',
  invalid_passcode: 'Mã xác minh không hợp lệ.',
  device_code_required: 'Mã là bắt buộc.',
  invalid_device_code: 'Mã thiết bị không hợp lệ.',
  device_flow_aborted: 'Yêu cầu đăng nhập đã bị gián đoạn.',
  invalid_connector_auth: 'Xác thực không hợp lệ',
  invalid_connector_request: 'Dữ liệu connector không hợp lệ',
  unknown: 'Lỗi không xác định.',
  invalid_session: 'Không tìm thấy phiên. Vui lòng quay lại và đăng nhập lại.',
  timeout: 'Yêu cầu đã hết thời gian chờ.',
  password_rejected,
  sso_not_enabled: 'Đăng nhập một lần (SSO) chưa được bật cho tài khoản email này.',
  invalid_link: 'Liên kết không hợp lệ',
  invalid_link_description: 'Token một lần của bạn có thể đã hết hạn hoặc không còn hiệu lực.',
  captcha_verification_failed: 'Xác minh captcha thất bại.',
  send_verification_code_failed: 'Gửi mã xác minh thất bại. Vui lòng thử lại sau.',
  send_verification_code_failed_use_password:
    'Gửi mã xác minh thất bại. Vui lòng đăng nhập bằng mật khẩu thay thế.',
  terms_acceptance_required: 'Cần đồng ý với điều khoản',
  terms_acceptance_required_description: 'Bạn phải đồng ý với các điều khoản để tiếp tục.',
  something_went_wrong: 'Đã có lỗi xảy ra',
  account_suspended: 'Tài khoản đã bị tạm ngưng',
  account_suspended_description:
    'Tài khoản này đã bị tạm ngưng. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
  access_denied: 'Truy cập bị từ chối',
  application_access_denied:
    'Bạn không có quyền truy cập ứng dụng này.\nVui lòng liên hệ quản trị viên để được hỗ trợ.',
  feature_not_enabled:
    'Bạn không có quyền truy cập tính năng này. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
};

export default Object.freeze(error);
