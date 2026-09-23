const mfa = {
  totp: 'OTP ứng dụng xác thực',
  webauthn: 'Passkey',
  backup_code: 'Mã dự phòng',
  email_verification_code: 'Mã xác minh qua email',
  phone_verification_code: 'Mã xác minh SMS',
  link_totp_description: 'Ví dụ: Google Authenticator, v.v.',
  link_webauthn_description: 'Liên kết thiết bị hoặc khóa cứng USB của bạn',
  link_backup_code_description: 'Tạo mã dự phòng',
  link_email_verification_code_description: 'Liên kết địa chỉ email của bạn',
  link_email_2fa_description: 'Liên kết địa chỉ email của bạn để xác minh 2 bước',
  link_phone_verification_code_description: 'Liên kết số điện thoại của bạn',
  link_phone_2fa_description: 'Liên kết số điện thoại của bạn để xác minh 2 bước',
  verify_totp_description: 'Nhập mã một lần trong ứng dụng',
  verify_webauthn_description: 'Xác minh bằng thiết bị hoặc khóa cứng USB của bạn',
  verify_backup_code_description: 'Dán mã dự phòng bạn đã lưu',
  verify_email_verification_code_description: 'Nhập mã đã gửi đến email của bạn',
  verify_phone_verification_code_description: 'Nhập mã đã gửi đến điện thoại của bạn',
  send_to_email: 'Gửi đến {{identifier}}',
  send_to_phone: 'Gửi đến {{identifier}}',
  onboarding: 'Bật xác minh 2 bước',
  onboarding_description:
    'Bảo vệ tài khoản của bạn bằng xác minh 2 bước. Chọn một hoặc nhiều phương thức: Passkey, ứng dụng xác thực (OTP), mã xác minh SMS, hoặc mã dự phòng.',
  enable_mfa: 'Bật xác minh 2 bước',
  add_mfa_factors: 'Thêm xác minh 2 bước',
  add_mfa_description:
    'Xác minh hai yếu tố đã được bật. Chọn phương thức xác minh thứ hai để đăng nhập an toàn.',
  add_another_mfa_factor: 'Thêm phương thức xác minh 2 bước khác',
  add_another_mfa_description:
    'Chọn cách khác để thêm nhằm xác minh danh tính khi đăng nhập.',
  verify_mfa_factors: 'Xác minh 2 bước',
  verify_mfa_description:
    'Xác minh 2 bước đã được bật cho tài khoản này. Vui lòng chọn cách thứ hai để xác minh danh tính của bạn.',
  add_authenticator_app: 'Thêm ứng dụng xác thực',
  replace_authenticator_app: 'Thay thế ứng dụng xác thực',
  step: 'Bước {{step, number}}: {{content}}',
  scan_qr_code: 'Quét mã QR này',
  scan_qr_code_description:
    'Quét mã QR sau bằng ứng dụng xác thực của bạn, ví dụ Google Authenticator, Duo Mobile, Authy, v.v.',
  qr_code_not_available: 'Không quét được mã QR?',
  copy_and_paste_key: 'Sao chép và dán khóa',
  copy_and_paste_key_description:
    'Sao chép và dán khóa sau vào ứng dụng xác thực của bạn, ví dụ Google Authenticator, Duo Mobile, Authy, v.v.',
  want_to_scan_qr_code: 'Muốn quét mã QR?',
  enter_one_time_code: 'Nhập mã một lần',
  enter_one_time_code_link_description:
    'Nhập mã xác minh 6 số được tạo bởi ứng dụng xác thực.',
  enter_one_time_code_description:
    'Xác minh 2 bước đã được bật cho tài khoản này. Vui lòng nhập mã một lần hiển thị trên ứng dụng xác thực đã liên kết của bạn.',
  enter_email_verification_code: 'Nhập mã xác minh qua email',
  enter_email_verification_code_description:
    'Xác thực 2 bước đã được bật cho tài khoản này. Vui lòng nhập mã xác minh email đã gửi đến {{identifier}}.',
  enter_phone_verification_code: 'Nhập mã xác minh SMS',
  enter_phone_verification_code_description:
    'Xác thực 2 bước đã được bật cho tài khoản này. Vui lòng nhập mã xác minh SMS đã gửi đến {{identifier}}.',
  link_another_mfa_factor: 'Chuyển sang phương thức khác',
  save_backup_code: 'Lưu mã dự phòng của bạn',
  save_backup_code_description:
    'Bạn có thể dùng một trong các mã dự phòng này để truy cập tài khoản nếu gặp khó khăn khi xác minh 2 bước bằng cách khác. Mỗi mã chỉ dùng được một lần.',
  backup_code_hint: 'Hãy chắc chắn sao chép và lưu chúng ở nơi an toàn.',
  new_backup_codes_generated:
    'Mã dự phòng mới đã thay thế mã cũ của bạn. Hãy lưu chúng ở nơi an toàn càng sớm càng tốt.',
  enter_a_backup_code: 'Nhập một mã dự phòng',
  enter_backup_code_description:
    'Nhập mã dự phòng bạn đã lưu khi xác minh 2 bước được bật lần đầu.',
  create_a_passkey: 'Tạo passkey',
  create_passkey_description:
    'Đăng ký passkey bằng sinh trắc học thiết bị, khóa bảo mật (ví dụ: YubiKey), hoặc các phương thức khả dụng khác.',
  try_another_verification_method: 'Thử phương thức xác minh khác',
  verify_via_passkey: 'Xác minh bằng passkey',
  verify_via_passkey_description:
    'Dùng passkey để xác minh bằng mật khẩu thiết bị hoặc sinh trắc học, quét mã QR, hoặc dùng khóa bảo mật USB như YubiKey.',
  trust_this_device_title: 'Tin cậy thiết bị này',
  trust_this_device_description:
    'Bạn có thể bỏ qua xác minh MFA trên thiết bị này trong các lần đăng nhập sau.',
  trust_this_device_one: 'Tin cậy thiết bị này trong {{count}} ngày',
  trust_this_device_two: 'Tin cậy thiết bị này trong {{count}} ngày',
  trust_this_device_few: 'Tin cậy thiết bị này trong {{count}} ngày',
  trust_this_device_many: 'Tin cậy thiết bị này trong {{count}} ngày',
  trust_this_device_other: 'Tin cậy thiết bị này trong {{count}} ngày',
  secret_key_copied: 'Đã sao chép khóa bí mật.',
  backup_code_copied: 'Đã sao chép mã dự phòng.',
  webauthn_not_ready: 'WebAuthn chưa sẵn sàng. Vui lòng thử lại sau.',
  webauthn_not_supported: 'WebAuthn không được hỗ trợ trên trình duyệt này.',
  webauthn_failed_to_create: 'Tạo thất bại. Vui lòng thử lại.',
  webauthn_failed_to_verify: 'Xác minh thất bại. Vui lòng thử lại.',
};

export default Object.freeze(mfa);
