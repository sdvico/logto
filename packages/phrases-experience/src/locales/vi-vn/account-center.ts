/* eslint-disable max-lines -- Locale catalog mirrors the complete Account Center phrase schema. */
const account_center = {
  home: {
    title: 'Không tìm thấy trang',
    description: 'Trang này không khả dụng.',
  },
  page: {
    title: 'Tài khoản',
    security_title: 'Bảo mật',
    security_description: 'Thay đổi cài đặt tài khoản tại đây để đảm bảo an toàn cho tài khoản của bạn.',
    profile_title: 'Thông tin cá nhân',
    profile_description: 'Thay đổi thông tin cá nhân của bạn tại đây.',
    sidebar_personal_info: 'Thông tin cá nhân',
    sidebar_security: 'Bảo mật',
    sidebar_sessions: 'Phiên đăng nhập',
    support: 'Hỗ trợ',
    user_menu: 'Menu người dùng',
    sign_out: 'Đăng xuất',
  },
  verification: {
    title: 'Xác minh bảo mật',
    description:
      'Xác minh danh tính để bảo vệ an toàn tài khoản của bạn. Vui lòng chọn phương thức xác minh.',
    error_send_failed: 'Gửi mã xác minh thất bại. Vui lòng thử lại sau.',
    error_invalid_code: 'Mã xác minh không hợp lệ hoặc đã hết hạn.',
    error_verify_failed: 'Xác minh thất bại. Vui lòng nhập lại mã.',
    verification_required: 'Xác minh đã hết hạn. Vui lòng xác minh lại danh tính của bạn.',
    try_another_method: 'Thử phương thức xác minh khác',
    no_available_methods_title: 'Không có phương thức xác minh nào khả dụng',
    no_available_methods_description:
      'Bạn chưa thiết lập phương thức xác minh nào. Vui lòng thêm mật khẩu, email hoặc số điện thoại vào tài khoản trước.',
  },
  password_verification: {
    title: 'Xác minh mật khẩu',
    description: 'Xác minh danh tính để bảo vệ an toàn tài khoản của bạn. Nhập mật khẩu của bạn.',
    error_failed: 'Mật khẩu không đúng. Vui lòng kiểm tra lại.',
  },
  verification_method: {
    password: {
      name: 'Mật khẩu',
      description: 'Xác minh bằng mật khẩu của bạn',
    },
    email: {
      name: 'Mã xác minh qua email',
      description: 'Gửi mã xác minh đến email của bạn',
    },
    phone: {
      name: 'Mã xác minh qua điện thoại',
      description: 'Gửi mã xác minh đến số điện thoại của bạn',
    },
  },
  email: {
    title: 'Liên kết email',
    description: 'Liên kết email để đăng nhập hoặc hỗ trợ khôi phục tài khoản.',
    verification_title: 'Nhập mã xác minh gửi tới email',
    verification_description:
      'Mã xác minh đã được gửi đến email {{email_address}} của bạn.',
    success: 'Đã liên kết email chính thành công.',
    verification_required: 'Xác minh đã hết hạn. Vui lòng xác minh lại danh tính của bạn.',
  },
  phone: {
    title: 'Liên kết số điện thoại',
    description: 'Liên kết số điện thoại để đăng nhập hoặc hỗ trợ khôi phục tài khoản.',
    verification_title: 'Nhập mã xác minh SMS',
    verification_description: 'Mã xác minh đã được gửi đến số điện thoại {{phone_number}} của bạn.',
    success: 'Đã liên kết số điện thoại chính thành công.',
    verification_required: 'Xác minh đã hết hạn. Vui lòng xác minh lại danh tính của bạn.',
  },
  username: {
    title: 'Đặt tên đăng nhập',
    description: 'Tên đăng nhập chỉ được chứa chữ cái, số và gạch dưới.',
    policy_description: '{{requirements}}',
    success: 'Đã cập nhật tên đăng nhập thành công.',
  },
  security: {
    add: 'Thêm',
    change: 'Đổi',
    remove: 'Xóa',
    not_set: 'Chưa đặt',
    social_sign_in: 'Đăng nhập qua mạng xã hội',
    social_not_linked: 'Chưa liên kết',
    email_phone: 'Email / Điện thoại',
    email: 'Email',
    phone: 'Điện thoại',
    password: 'Mật khẩu',
    configured: 'Đã cấu hình',
    not_configured: 'Chưa cấu hình',
    two_step_verification: 'Xác minh 2 bước',
    authenticator_app: 'Ứng dụng xác thực',
    passkeys: 'Passkey',
    backup_codes: 'Mã dự phòng',
    email_verification_code: 'Mã xác minh qua email',
    phone_verification_code: 'Mã xác minh qua điện thoại',
    passkeys_count_one: '{{count}} passkey',
    passkeys_count_other: '{{count}} passkey',
    backup_codes_count_one: 'Còn {{count}} mã',
    backup_codes_count_other: 'Còn {{count}} mã',
    view: 'Xem',
    manage: 'Quản lý',
    turn_on_2_step_verification_description:
      'Thêm một lớp bảo mật bổ sung. Bạn sẽ được yêu cầu thực hiện thêm một bước xác minh khi đăng nhập.',
    turn_off_2_step_verification: 'Tắt xác minh 2 bước',
    turn_off_2_step_verification_description:
      'Tắt xác minh 2 bước sẽ loại bỏ lớp bảo vệ bổ sung cho tài khoản của bạn khi đăng nhập. Bạn có chắc muốn tiếp tục không?',
    disable_2_step_verification: 'Tắt',
    no_verification_method_warning:
      'Bạn chưa thêm phương thức xác minh thứ hai. Hãy thêm ít nhất một phương thức để bật xác minh 2 bước khi đăng nhập.',
    passkey_sign_in_prompt: 'Nhắc thiết lập passkey',
    passkey_sign_in_prompt_description:
      'Khi bật, bạn sẽ được yêu cầu thiết lập passkey để đăng nhập nhanh hơn và an toàn hơn.',
    account_removal: 'Xóa tài khoản',
    delete_your_account: 'Xóa tài khoản của bạn',
    delete_account: 'Xóa tài khoản',
    remove_username_confirmation_title: 'Xóa tên đăng nhập',
    remove_username_confirmation_description:
      'Sau khi xóa, bạn sẽ không thể đăng nhập bằng tên đăng nhập này nữa. Bạn có chắc muốn tiếp tục không?',
    remove_email_confirmation_title: 'Xóa địa chỉ email',
    remove_email_confirmation_description:
      'Sau khi xóa, bạn sẽ không thể đăng nhập bằng địa chỉ email này nữa. Bạn có chắc muốn tiếp tục không?',
    remove_phone_confirmation_title: 'Xóa số điện thoại',
    remove_phone_confirmation_description:
      'Sau khi xóa, bạn sẽ không thể đăng nhập bằng số điện thoại này nữa. Bạn có chắc muốn tiếp tục không?',
    email_removed: 'Đã xóa địa chỉ email thành công.',
    phone_removed: 'Đã xóa số điện thoại thành công.',
    username_removed: 'Đã xóa tên đăng nhập thành công.',
    trusted_devices: {
      title: 'Thiết bị tin cậy MFA',
      current_device: 'Thiết bị hiện tại',
      expires_on: 'Hết hạn vào {{date}}',
      unknown_location: 'Vị trí không xác định',
      remove: 'Xóa',
      removed: 'Đã xóa thiết bị tin cậy thành công.',
      loading: 'Đang tải...',
      empty: 'Không có thiết bị tin cậy nào.',
      load_failed: 'Không tải được danh sách thiết bị tin cậy. Vui lòng thử lại.',
      retry: 'Thử lại',
      remove_confirmation_title: 'Xóa thiết bị tin cậy?',
      remove_confirmation_description:
        'Bạn sẽ phải hoàn tất xác minh MFA lại trên thiết bị này vào lần đăng nhập kế tiếp. Phiên đăng nhập hiện tại của bạn vẫn được giữ hoạt động.',
    },
  },
  social: {
    linked: 'Đã liên kết {{connector}} thành công.',
    removed: 'Đã xóa {{connector}} thành công.',
    not_enabled:
      'Phương thức đăng nhập mạng xã hội này chưa được bật. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
    remove_confirmation_title: 'Xóa tài khoản mạng xã hội',
    remove_confirmation_description:
      'Nếu bạn xóa {{connector}}, bạn có thể không đăng nhập được bằng phương thức này cho đến khi thêm lại.',
  },
  password: {
    title: 'Đặt mật khẩu',
    description: 'Tạo mật khẩu mới để bảo vệ tài khoản của bạn.',
    success: 'Đã cập nhật mật khẩu thành công.',
  },

  code_verification: {
    send: 'Gửi mã xác minh',
    resend: 'Chưa nhận được mã? <a>Gửi lại mã xác minh</a>',
    resend_countdown: 'Chưa nhận được mã? Gửi lại sau {{seconds}} giây',
  },

  email_verification: {
    title: 'Xác minh email của bạn',
    prepare_description:
      'Xác minh danh tính để bảo vệ an toàn tài khoản của bạn. Gửi mã xác minh đến email của bạn.',
    email_label: 'Địa chỉ email',
    send: 'Gửi mã xác minh',
    description:
      'Mã xác minh đã được gửi đến email {{email}} của bạn. Nhập mã để tiếp tục.',
    resend: 'Chưa nhận được mã? <a>Gửi lại mã xác minh</a>',
    not_received: 'Chưa nhận được mã?',
    resend_action: 'Gửi lại mã xác minh',
    resend_countdown: 'Chưa nhận được mã? Gửi lại sau {{seconds}} giây',
    error_send_failed: 'Gửi mã xác minh thất bại. Vui lòng thử lại sau.',
    error_verify_failed: 'Xác minh thất bại. Vui lòng nhập lại mã.',
    error_invalid_code: 'Mã xác minh không hợp lệ hoặc đã hết hạn.',
  },
  phone_verification: {
    title: 'Xác minh số điện thoại của bạn',
    prepare_description:
      'Xác minh danh tính để bảo vệ an toàn tài khoản của bạn. Gửi mã xác minh đến điện thoại của bạn.',
    phone_label: 'Số điện thoại',
    send: 'Gửi mã xác minh',
    description:
      'Mã xác minh đã được gửi đến số điện thoại {{phone}} của bạn. Nhập mã để tiếp tục.',
    resend: 'Chưa nhận được mã? <a>Gửi lại mã xác minh</a>',
    resend_countdown: 'Chưa nhận được mã? Gửi lại sau {{seconds}} giây',
    error_send_failed: 'Gửi mã xác minh thất bại. Vui lòng thử lại sau.',
    error_verify_failed: 'Xác minh thất bại. Vui lòng nhập lại mã.',
    error_invalid_code: 'Mã xác minh không hợp lệ hoặc đã hết hạn.',
  },
  mfa: {
    totp_already_added:
      'Bạn đã thêm ứng dụng xác thực rồi. Vui lòng xóa ứng dụng hiện có trước.',
    totp_not_enabled:
      'OTP qua ứng dụng xác thực chưa được bật. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
    backup_code_already_added:
      'Bạn đã có mã dự phòng đang hoạt động. Vui lòng sử dụng hoặc xóa chúng trước khi tạo mã mới.',
    backup_code_not_enabled:
      'Mã dự phòng chưa được bật. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
    backup_code_requires_other_mfa: 'Mã dự phòng yêu cầu thiết lập một phương thức MFA khác trước.',
    passkey_not_enabled:
      'Passkey chưa được bật. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
    passkey_already_registered:
      'Passkey này đã được đăng ký cho tài khoản của bạn. Vui lòng sử dụng một thiết bị xác thực khác.',
  },
  update_success: {
    default: {
      title: 'Cập nhật thành công',
      description: 'Thay đổi của bạn đã được lưu thành công.',
    },
    email: {
      title: 'Đã cập nhật địa chỉ email!',
      description: 'Địa chỉ email của tài khoản đã được thay đổi thành công.',
    },
    phone: {
      title: 'Đã cập nhật số điện thoại!',
      description: 'Số điện thoại của tài khoản đã được thay đổi thành công.',
    },
    username: {
      title: 'Đã cập nhật tên đăng nhập!',
      description: 'Tên đăng nhập của tài khoản đã được thay đổi thành công.',
    },
    password: {
      title: 'Đã cập nhật mật khẩu!',
      description: 'Mật khẩu của tài khoản đã được thay đổi thành công.',
    },
    totp: {
      title: 'Đã thêm ứng dụng xác thực!',
      description: 'Ứng dụng xác thực của bạn đã được liên kết thành công với tài khoản.',
    },
    totp_replaced: {
      title: 'Đã thay thế ứng dụng xác thực!',
      description: 'Ứng dụng xác thực của bạn đã được thay thế thành công.',
    },
    backup_code: {
      title: 'Đã tạo mã dự phòng!',
      description: 'Mã dự phòng của bạn đã được lưu. Hãy giữ chúng ở nơi an toàn.',
    },
    passkey: {
      title: 'Đã thêm passkey!',
      description: 'Passkey của bạn đã được liên kết thành công với tài khoản.',
    },
    social: {
      title: 'Đã liên kết tài khoản mạng xã hội!',
      description: 'Tài khoản mạng xã hội của bạn đã được liên kết thành công.',
    },
  },
  backup_code: {
    title: 'Mã dự phòng',
    description:
      'Bạn có thể dùng một trong các mã dự phòng này để truy cập tài khoản nếu gặp khó khăn khi xác minh 2 bước bằng cách khác. Mỗi mã chỉ dùng được một lần.',
    copy_hint: 'Hãy chắc chắn sao chép và lưu chúng ở nơi an toàn.',
    generate_new_title: 'Tạo mã dự phòng mới',
    generate_new: 'Tạo mã dự phòng mới',
  },
  passkey: {
    title: 'Passkey',
    added: 'Đã thêm: {{date}}',
    last_used: 'Dùng lần cuối: {{date}}',
    never_used: 'Chưa từng dùng',
    unnamed: 'Passkey chưa đặt tên',
    renamed: 'Đã đổi tên passkey thành công.',
    deleted: 'Đã xóa passkey thành công.',
    add_another_title: 'Thêm passkey khác',
    add_another_description:
      'Đăng ký passkey bằng sinh trắc học thiết bị, khóa bảo mật (ví dụ: YubiKey), hoặc các phương thức khả dụng khác.',
    add_passkey: 'Thêm passkey',
    delete_confirmation_title: 'Xóa passkey của bạn',
    delete_confirmation_description:
      'Nếu bạn xóa passkey này, bạn sẽ không thể xác minh bằng nó nữa.',
    rename_passkey: 'Đổi tên passkey',
    rename_description: 'Nhập tên mới cho passkey này.',
    name_this_passkey: 'Đặt tên cho passkey của thiết bị này',
    name_passkey_description:
      'Bạn đã xác minh thành công thiết bị này cho xác thực 2 bước. Tùy chỉnh tên để dễ nhận biết khi có nhiều khóa.',
    name_input_label: 'Tên',
  },
  sessions: {
    page_title: 'Phiên đăng nhập',
    page_description: 'Quản lý các phiên đăng nhập đang hoạt động và các ứng dụng bên thứ ba đã được cấp quyền.',
    title: 'Phiên đăng nhập',
    current_session: 'Phiên hiện tại',
    signed_in_at: 'Đăng nhập lúc {{date}}',
    revoke_session: 'Đăng xuất',
    revoke_session_title: 'Đăng xuất phiên',
    revoke_session_description:
      'Hành động này sẽ đăng xuất phiên và hủy toàn bộ quyền truy cập liên quan. Bạn có chắc muốn tiếp tục không?',
    no_other_sessions: 'Không có phiên đăng nhập khác đang hoạt động.',
    loading: 'Đang tải...',
    third_party_apps_title: 'Ứng dụng bên thứ ba',
    no_third_party_apps: 'Không có ứng dụng bên thứ ba nào được cấp quyền.',
    third_party_apps_load_failed: 'Không tải được danh sách ứng dụng bên thứ ba. Vui lòng thử lại.',
    granted_at: 'Cấp quyền lúc {{date}}',
    dynamic_app: 'Ứng dụng động',
    client_id: 'Client ID: {{clientId}}',
    revoke_grant: 'Xóa',
    revoke_grant_title: 'Xóa quyền truy cập ứng dụng bên thứ ba',
    revoke_grant_description:
      'Hành động này sẽ hủy quyền truy cập đã cấp cho ứng dụng này. Các access token đã cấp trước đó có thể vẫn còn hiệu lực cho đến khi hết hạn. Bạn có chắc muốn tiếp tục không?',
    revoke_grant_failed: 'Không thể hủy một số quyền truy cập. Vui lòng thử lại.',
  },
};

export default Object.freeze(account_center);
/* eslint-enable max-lines */
