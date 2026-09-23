const mfa = {
  title: 'Xác thực đa yếu tố',
  description:
    'Thêm xác thực đa yếu tố để nâng cao mức độ an toàn cho trải nghiệm đăng nhập của bạn.',
  factors: 'Các yếu tố',
  multi_factors: 'Đa yếu tố',
  multi_factors_description:
    'Người dùng cần xác minh một trong các yếu tố đã bật cho xác minh 2 bước.',
  totp: 'Ứng dụng xác thực',
  otp_description: 'Liên kết Google Authenticator, v.v., để xác minh mật khẩu một lần.',
  webauthn: 'Passkey',
  webauthn_description:
    'Xác minh qua phương thức được trình duyệt hỗ trợ: sinh trắc học, quét bằng điện thoại, hoặc khóa bảo mật, v.v.',
  webauthn_domain_tip:
    'WebAuthn gắn khóa công khai với một miền cụ thể. Việc thay đổi miền dịch vụ của bạn sẽ khiến người dùng không thể xác thực bằng các passkey hiện có.',
  backup_code: 'Mã dự phòng',
  backup_code_description: 'Tạo 10 mã dự phòng dùng một lần sau khi người dùng thiết lập bất kỳ phương thức MFA nào.',
  backup_code_setup_hint: "Khi người dùng không thể xác minh các yếu tố MFA trên, hãy dùng tùy chọn dự phòng.",
  backup_code_error_hint:
    'Để dùng mã dự phòng, bạn cần có thêm ít nhất một phương thức MFA khác để xác thực người dùng thành công.',
  email_verification_code: 'Mã xác minh email',
  email_verification_code_description:
    'Liên kết địa chỉ email để nhận và xác minh mã xác minh.',
  phone_verification_code: 'Mã xác minh SMS',
  phone_verification_code_description:
    'Liên kết số điện thoại để nhận và xác minh mã xác minh SMS.',
  policy: 'Chính sách',
  policy_description: 'Đặt chính sách MFA cho luồng đăng nhập và đăng ký.',
  two_step_sign_in_policy: 'Chính sách xác minh 2 bước khi đăng nhập',
  user_controlled: 'Người dùng có thể tự bật hoặc tắt MFA',
  user_controlled_tip:
    'Người dùng có thể bỏ qua việc thiết lập MFA lần đầu khi đăng nhập hoặc đăng ký, hoặc bật/tắt MFA trong cài đặt tài khoản.',
  mandatory: 'Người dùng luôn phải dùng MFA khi đăng nhập',
  mandatory_tip:
    'Người dùng phải thiết lập MFA lần đầu khi đăng nhập hoặc đăng ký, và dùng nó cho mọi lần đăng nhập sau đó.',
  require_mfa: 'Yêu cầu MFA',
  require_mfa_label:
    'Bật tùy chọn này để bắt buộc xác minh 2 bước khi truy cập ứng dụng của bạn. Nếu tắt, người dùng có thể tự quyết định có bật MFA cho mình hay không.',
  require_mfa_optional:
    'MFA tùy chọn: Cho phép người dùng tự chọn bật MFA để bảo vệ tài khoản của họ',
  require_mfa_adaptive:
    'MFA thích ứng: Chỉ yêu cầu MFA khi lần đăng nhập có vẻ rủi ro (ví dụ: quốc gia mới / không hoạt động lâu ngày)',
  require_mfa_mandatory:
    'MFA bắt buộc: Yêu cầu mọi người dùng hoàn thành MFA mỗi lần đăng nhập',
  set_up_prompt: 'Nhắc thiết lập MFA',
  no_prompt: 'Không nhắc người dùng thiết lập MFA',
  prompt_at_sign_in_and_sign_up:
    'Nhắc người dùng thiết lập MFA trong quá trình đăng ký (có thể bỏ qua, chỉ nhắc một lần)',
  prompt_only_at_sign_in:
    'Nhắc người dùng thiết lập MFA ở lần đăng nhập tiếp theo sau khi đăng ký (có thể bỏ qua, chỉ nhắc một lần)',
  prompt_at_sign_in_and_sign_up_mandatory:
    'Nhắc người dùng thiết lập MFA trong quá trình đăng ký (không thể bỏ qua)',
  prompt_only_at_sign_in_mandatory:
    'Nhắc người dùng thiết lập MFA ở lần đăng nhập tiếp theo sau khi đăng ký (không thể bỏ qua)',
  set_up_organization_required_mfa_prompt:
    'Nhắc thiết lập MFA cho người dùng sau khi tổ chức bật MFA',
  prompt_at_sign_in_non_skippable: 'Nhắc người dùng thiết lập MFA ở lần đăng nhập tiếp theo (không thể bỏ qua)',
  email_primary_method_tip:
    "Mã xác minh email đã là phương thức đăng nhập chính của bạn. Để đảm bảo an toàn, nó không thể được dùng lại cho MFA.",
  phone_primary_method_tip:
    "Mã xác minh SMS đã là phương thức đăng nhập chính của bạn. Để đảm bảo an toàn, nó không thể được dùng lại cho MFA.",
  no_email_connector_warning:
    'Chưa thiết lập bộ kết nối email. Trước khi hoàn tất cấu hình, người dùng sẽ không thể dùng mã xác minh email cho MFA. <a>{{link}}</a> trong "Connectors".',
  no_sms_connector_warning:
    'Chưa thiết lập bộ kết nối SMS. Trước khi hoàn tất cấu hình, người dùng sẽ không thể dùng mã xác minh SMS cho MFA. <a>{{link}}</a> trong "Connectors".',
  no_email_connector_error:
    'Không thể bật MFA bằng mã xác minh email nếu chưa có bộ kết nối email. Vui lòng cấu hình một bộ kết nối email trước.',
  no_sms_connector_error:
    'Không thể bật MFA bằng mã xác minh SMS nếu chưa có bộ kết nối SMS. Vui lòng cấu hình một bộ kết nối SMS trước.',
  setup_link: 'Thiết lập',
  trusted_device: {
    title: 'Thiết bị tin cậy',
    description:
      'Cho phép trình duyệt tin cậy tự động hoàn tất xác minh MFA khi luồng MFA hiện tại yêu cầu.',
    enable_title: 'Bật thiết bị tin cậy',
    enable_description:
      'Cho phép người dùng tin cậy trình duyệt này sau khi hoàn thành một yếu tố MFA hợp lệ.',
    duration_title: 'Thời gian tin cậy (ngày)',
    duration_error: 'Nhập một số nguyên trong khoảng từ {{min}} đến {{max}}.',
    duration_note: 'Thay đổi thời gian tin cậy chỉ áp dụng cho các thiết bị được tin cậy sau đó.',
    organization_allow_title: 'Cho phép thiết bị tin cậy',
    organization_allow_tip:
      'Một tổ chức chỉ có thể hạn chế chính sách thiết bị tin cậy của tenant; không thể bật tính năng này khi chính sách của tenant đang tắt.',
    organization_allow_description:
      'Cho phép xác minh bằng thiết bị tin cậy cho thành viên của tổ chức này.',
    organization_global_disabled:
      'Hãy bật thiết bị tin cậy trong cài đặt MFA của tenant trước khi cho phép tính năng này với tổ chức.',
    management_description:
      'Quản lý các trình duyệt mà người dùng này đã tin cậy sau khi hoàn thành MFA. Xóa một trình duyệt sẽ yêu cầu MFA lại trên trình duyệt đó ở lần đăng nhập tiếp theo.',
    management_hint: 'Vị trí gần nhất chỉ mang tính tham khảo.',
    management_empty: 'Người dùng này chưa có thiết bị tin cậy nào đang hoạt động.',
    management_deletion_confirmation:
      'Xóa {{name}}? Trình duyệt này sẽ cần MFA lại ở lần đăng nhập tiếp theo.',
    management_removed: 'Đã xóa thiết bị tin cậy.',
  },
};

export default Object.freeze(mfa);
