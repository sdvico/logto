const session = {
  not_found: 'Không tìm thấy session. Vui lòng quay lại và đăng nhập lại.',
  invalid_credentials: 'Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đã nhập.',
  invalid_sign_in_method: 'Phương thức đăng nhập hiện tại không khả dụng.',
  invalid_connector_id: 'Không thể tìm thấy connector khả dụng với id {{connectorId}}.',
  insufficient_info: 'Thông tin đăng nhập không đủ.',
  connector_id_mismatch: 'connectorId không khớp với bản ghi session.',
  connector_session_not_found: 'Không tìm thấy session của connector. Vui lòng quay lại và đăng nhập lại.',
  verification_session_not_found:
    'Xác minh không thành công. Vui lòng khởi động lại luồng xác minh và thử lại.',
  verification_expired: 'Kết nối đã hết thời gian chờ. Hãy xác minh lại để đảm bảo an toàn cho tài khoản của bạn.',
  verification_blocked_too_many_attempts:
    'Quá nhiều lần thử trong thời gian ngắn. Vui lòng thử lại {{relativeTime}}.',
  unauthorized: 'Vui lòng đăng nhập trước.',
  unsupported_prompt_name: 'Tên prompt không được hỗ trợ.',
  forgot_password_not_enabled: 'Tính năng quên mật khẩu chưa được bật.',
  verification_failed:
    'Xác minh không thành công. Vui lòng khởi động lại luồng xác minh và thử lại.',
  connector_validation_session_not_found:
    'Không tìm thấy session của connector dùng để xác thực token.',
  csrf_token_mismatch: 'CSRF token không khớp.',
  identifier_not_found: 'Không tìm thấy định danh người dùng. Vui lòng quay lại và đăng nhập lại.',
  interaction_not_found:
    'Không tìm thấy session tương tác. Vui lòng quay lại và bắt đầu lại session.',
  invalid_interaction_type:
    'Thao tác này không được hỗ trợ cho tương tác hiện tại. Vui lòng bắt đầu một session mới.',
  not_supported_for_forgot_password: 'Thao tác này không được hỗ trợ cho quy trình quên mật khẩu.',
  identity_conflict:
    'Phát hiện xung đột định danh. Vui lòng bắt đầu một session mới để tiếp tục với một định danh khác.',
  identifier_not_verified:
    'Định danh {{identifier}} được cung cấp chưa được xác minh. Vui lòng tạo bản ghi xác minh cho định danh này và hoàn tất quá trình xác minh.',
  mfa: {
    require_mfa_verification: 'Cần xác minh MFA để đăng nhập.',
    mfa_sign_in_only: 'MFA chỉ khả dụng cho tương tác đăng nhập.',
    pending_info_not_found: 'Không tìm thấy thông tin MFA đang chờ xử lý, vui lòng khởi động MFA trước.',
    invalid_totp_code: 'Mã TOTP không hợp lệ.',
    webauthn_verification_failed: 'Xác minh WebAuthn thất bại.',
    webauthn_verification_not_found: 'Không tìm thấy xác minh WebAuthn.',
    bind_mfa_existed: 'MFA đã tồn tại.',
    backup_code_can_not_be_alone: 'Mã dự phòng (backup code) không thể là MFA duy nhất.',
    backup_code_required: 'Cần có mã dự phòng (backup code).',
    invalid_backup_code: 'Mã dự phòng (backup code) không hợp lệ.',
    mfa_policy_not_user_controlled: 'Chính sách MFA không do người dùng kiểm soát.',
    mfa_factor_not_enabled: 'Yếu tố MFA chưa được bật.',
    suggest_additional_mfa:
      'Để tăng cường bảo mật, hãy xem xét thêm một phương thức MFA khác. Bạn có thể bỏ qua bước này và tiếp tục.',
  },
  trusted_device_suggest_opt_in: 'Chọn có tin tưởng thiết bị này hay không.',
  step_up: {
    invalid_interaction_event: 'Xác thực step-up chỉ khả dụng cho tương tác đăng nhập.',
    subject_not_found:
      'Không tìm thấy session đã xác thực cho xác thực step-up. Vui lòng đăng nhập lại.',
    forbidden_route: 'Route này không được cho phép trong quá trình xác thực step-up.',
    forbidden_identifier:
      'Không được phép dùng định danh trong quá trình xác thực step-up. Vui lòng thử lại không kèm trường định danh.',
    acr_not_satisfied:
      'Xác minh đã hoàn tất không đáp ứng ngữ cảnh xác thực được yêu cầu. Vui lòng xác minh bằng phương thức khác.',
    require_verification:
      'Cần xác minh bằng một trong các phương thức hiện có của bạn để đạt được ngữ cảnh xác thực yêu cầu.',
  },
  passkey_sign_in: {
    pending_info_not_found:
      'Không tìm thấy thông tin đăng nhập bằng passkey đang chờ xử lý. Vui lòng khởi động lại luồng đăng nhập.',
    conflict_rp_id: 'Relying Party ID không khớp. Vui lòng dùng đúng client để đăng nhập.',
    sso_users_not_allowed: 'Tùy chọn đăng nhập bằng passkey không áp dụng cho người dùng SSO.',
  },
  password_expiration: {
    reset_not_allowed:
      'Chỉ được đặt lại mật khẩu sau khi mật khẩu đã hết hạn trong session đăng nhập hiện tại.',
  },
  sso_enabled: 'Đăng nhập một lần (SSO) đã được bật cho email này. Vui lòng đăng nhập bằng SSO.',
  captcha_required: 'Cần xác minh captcha.',
  captcha_failed: 'Xác minh captcha thất bại.',
  email_blocklist: {
    disposable_email_validation_failed: 'Xác thực địa chỉ email thất bại.',
    invalid_email: 'Địa chỉ email không hợp lệ.',
    email_subaddressing_not_allowed: 'Không được phép dùng email subaddressing.',
    email_not_allowed:
      'Địa chỉ email "{{email}}" bị hạn chế. Vui lòng chọn địa chỉ khác.',
  },
  google_one_tap: {
    cookie_mismatch: 'Cookie của Google One Tap không khớp.',
    invalid_id_token: 'Google ID Token không hợp lệ.',
    unverified_email: 'Email chưa được xác minh.',
  },
};

export default Object.freeze(session);
