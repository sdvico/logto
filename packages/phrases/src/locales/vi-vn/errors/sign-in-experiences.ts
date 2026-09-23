const sign_in_experiences = {
  empty_content_url_of_terms_of_use:
    'URL nội dung "Điều khoản sử dụng" đang trống. Vui lòng thêm URL nội dung nếu "Điều khoản sử dụng" được bật.',
  empty_social_connectors:
    'Chưa có connector mạng xã hội nào. Vui lòng thêm connector mạng xã hội đã bật khi phương thức đăng nhập bằng mạng xã hội được bật.',
  enabled_connector_not_found: 'Không tìm thấy connector {{type}} đã được bật.',
  not_one_and_only_one_primary_sign_in_method:
    'Phải có duy nhất một phương thức đăng nhập chính. Vui lòng kiểm tra lại dữ liệu đầu vào.',
  username_requires_password: 'Phải bật đặt mật khẩu cho định danh đăng ký bằng username.',
  passwordless_requires_verify: 'Phải bật xác minh cho định danh đăng ký bằng email/số điện thoại.',
  miss_sign_up_identifier_in_sign_in: 'Phương thức đăng nhập phải chứa định danh đăng ký.',
  password_sign_in_must_be_enabled:
    'Phải bật đăng nhập bằng mật khẩu khi yêu cầu đặt mật khẩu trong quá trình đăng ký.',
  code_sign_in_must_be_enabled:
    'Phải bật đăng nhập bằng mã xác minh khi không yêu cầu đặt mật khẩu trong quá trình đăng ký.',
  unsupported_default_language: 'Ngôn ngữ {{language}} hiện chưa được hỗ trợ.',
  at_least_one_authentication_factor: 'Bạn phải chọn ít nhất một yếu tố xác thực.',
  backup_code_cannot_be_enabled_alone: 'Không thể chỉ bật mã dự phòng (backup code) một mình.',
  duplicated_mfa_factors: 'Yếu tố MFA bị trùng lặp.',
  email_verification_code_cannot_be_used_for_mfa:
    'Không thể dùng mã xác minh email cho MFA khi xác minh email đã được bật cho đăng nhập.',
  phone_verification_code_cannot_be_used_for_mfa:
    'Không thể dùng mã xác minh SMS cho MFA khi xác minh SMS đã được bật cho đăng nhập.',
  email_verification_code_cannot_be_used_for_sign_in:
    'Không thể dùng mã xác minh email cho đăng nhập khi nó đã được bật cho MFA.',
  phone_verification_code_cannot_be_used_for_sign_in:
    'Không thể dùng mã xác minh SMS cho đăng nhập khi nó đã được bật cho MFA.',
  adaptive_mfa_requires_mfa: 'Phải bật MFA trước khi bật MFA thích ứng (adaptive MFA).',
  adaptive_mfa_requires_non_skippable_policy:
    'MFA thích ứng yêu cầu chính sách prompt MFA không thể bỏ qua. Hãy dùng PromptOnlyAtSignInMandatory hoặc PromptAtSignInAndSignUpMandatory.',
  non_adaptive_mfa_requires_skippable_policy:
    'Khi MFA thích ứng bị tắt, chính sách prompt MFA phải có thể bỏ qua. Không dùng PromptOnlyAtSignInMandatory hoặc PromptAtSignInAndSignUpMandatory.',
  duplicated_sign_up_identifiers: 'Phát hiện định danh đăng ký bị trùng lặp.',
  missing_sign_up_identifiers: 'Định danh đăng ký chính không được để trống.',
  invalid_custom_email_blocklist_format:
    'Mục nào đó trong danh sách email bị chặn tùy chỉnh không hợp lệ: {{items, list(type:conjunction)}}. Mỗi mục phải là địa chỉ email hoặc domain email hợp lệ, ví dụ foo@example.com hoặc @example.com.',
  forgot_password_method_requires_connector:
    'Phương thức quên mật khẩu yêu cầu phải cấu hình connector {{method}} tương ứng.',
  password_expiration_requires_forgot_password:
    'Tính năng hết hạn mật khẩu yêu cầu ít nhất một phương thức quên mật khẩu có connector hợp lệ.',
  password_expiration_not_enabled:
    'Chính sách hết hạn mật khẩu chưa được bật. Hãy bật trong phần cài đặt sign-in experience trước khi cho mật khẩu hết hạn.',
  password_expiration_invalid_period_days:
    'Số ngày hiệu lực phải là số nguyên dương khi tính năng hết hạn mật khẩu được bật.',
  username_policy_case_conflicts_exist:
    'Không thể chuyển sang chế độ username không phân biệt hoa thường khi đang tồn tại các username chỉ khác nhau về hoa thường. Hãy xử lý xung đột và thử lại.',
};

export default Object.freeze(sign_in_experiences);
