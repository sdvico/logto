const sign_up_and_sign_in = {
  identifiers_email: 'Địa chỉ email',
  identifiers_phone: 'Số điện thoại',
  identifiers_username: 'Tên đăng nhập',
  identifiers_email_or_sms: 'Địa chỉ email hoặc số điện thoại',
  identifiers_none: 'Không áp dụng',
  and: 'và',
  or: 'hoặc',
  sign_up: {
    title: 'ĐĂNG KÝ',
    sign_up_identifier: 'Định danh đăng ký',
    identifier_description:
      'Tất cả định danh đăng ký đã chọn đều là bắt buộc khi tạo tài khoản mới.',
    sign_up_authentication: 'Cài đặt xác thực cho đăng ký',
    verification_tip:
      'Người dùng phải xác minh email hoặc số điện thoại bạn đã cấu hình bằng cách nhập mã xác minh khi đăng ký.',
    authentication_description:
      'Tất cả hành động đã chọn sẽ là bắt buộc để người dùng hoàn tất luồng.',
    set_a_password_option: 'Tạo mật khẩu',
    verify_at_sign_up_option: 'Xác minh khi đăng ký',
    social_only_creation_description: '(Chỉ áp dụng cho tạo tài khoản qua mạng xã hội)',
    collect_user_profile: 'Thu thập hồ sơ người dùng',
    add_profile_fields: 'Thêm trường hồ sơ',
    profile_fields_hint: {
      not_in_list: 'Không có trong danh sách?',
      set_up: 'Cài đặt',
      go_to: 'các trường hồ sơ khác ngay.',
    },
  },
  sign_in: {
    title: 'ĐĂNG NHẬP',
    sign_in_identifier_and_auth: 'Cài đặt định danh và xác thực cho đăng nhập',
    description: 'Người dùng có thể đăng nhập bằng bất kỳ tùy chọn nào có sẵn.',
    add_sign_in_method: 'Thêm phương thức đăng nhập',
    add_sign_up_method: 'Thêm phương thức đăng ký',
    password_auth: 'Mật khẩu',
    verification_code_auth: 'Mã xác minh',
    auth_swap_tip: 'Đổi vị trí các tùy chọn dưới đây để xác định tùy chọn nào xuất hiện trước trong luồng.',
    require_auth_factor: 'Bạn phải chọn ít nhất một yếu tố xác thực.',
    forgot_password: 'Quên mật khẩu',
    forgot_password_description:
      'Người dùng có thể đặt lại mật khẩu bằng bất kỳ phương thức xác minh nào có sẵn.',
    add_verification_method: 'Thêm phương thức xác minh',
    email_verification_code: 'Mã xác minh qua email',
    phone_verification_code: 'Mã xác minh qua số điện thoại',
  },
  social_sign_in: {
    title: 'ĐĂNG NHẬP MẠNG XÃ HỘI',
    social_sign_in: 'Đăng nhập mạng xã hội',
    description:
      'Tùy theo định danh bắt buộc bạn đã cài đặt, người dùng có thể được yêu cầu cung cấp định danh khi đăng ký qua liên kết mạng xã hội.',
    add_social_connector: 'Thêm liên kết mạng xã hội',
    set_up_hint: {
      not_in_list: 'Không có trong danh sách?',
      set_up_more: 'Cài đặt',
      go_to: 'các liên kết mạng xã hội khác ngay.',
    },
    settings_title: 'Trải nghiệm đăng nhập mạng xã hội',
    automatic_account_linking: 'Tự động liên kết tài khoản có cùng định danh',
    automatic_account_linking_tip:
      'Khi bật, nếu người dùng đăng nhập bằng một định danh mạng xã hội mới và có đúng một tài khoản hiện có cùng định danh (ví dụ: địa chỉ email), sdvico sẽ tự động liên kết định danh mạng xã hội đó với tài khoản đó. Người dùng sẽ không được hỏi có muốn liên kết tài khoản hay không.',
    required_sign_up_identifiers: 'Yêu cầu người dùng cung cấp định danh đăng ký còn thiếu',
    required_sign_up_identifiers_tip:
      'Khi bật, người dùng đăng nhập qua nhà cung cấp mạng xã hội phải điền mọi định danh đăng ký bắt buộc còn thiếu (như email) trước khi hoàn tất đăng nhập. \n\nNếu tắt, người dùng có thể tiếp tục mà không cần cung cấp định danh còn thiếu, dù tài khoản mạng xã hội không đồng bộ chúng.',
  },
  passkey_sign_in: {
    title: 'ĐĂNG NHẬP BẰNG PASSKEY',
    passkey_sign_in: 'Đăng nhập bằng passkey',
    enable_passkey_sign_in_description:
      'Cho phép người dùng truy cập ứng dụng nhanh và an toàn qua Passkey (WebAuthn), sử dụng sinh trắc học hoặc khóa bảo mật, v.v.',
    prompts: 'Gợi ý passkey',
    show_passkey_button: 'Hiện nút "Tiếp tục với passkey" trên trang đăng nhập',
    show_passkey_button_tip:
      'Tắt nút "Tiếp tục với passkey" khiến luồng đăng nhập ưu tiên định danh trước, hiển thị các tùy chọn mật khẩu và passkey ở bước tiếp theo.',
    allow_autofill: 'Cho phép gợi ý và tự điền passkey đã đăng ký trong các trường định danh',
  },
  tip: {
    set_a_password: 'Một mật khẩu riêng gắn với tên đăng nhập của bạn là điều bắt buộc.',
    verify_at_sign_up:
      'Hiện tại chúng tôi chỉ hỗ trợ email và số điện thoại đã xác minh. Cơ sở người dùng của bạn có thể chứa nhiều địa chỉ email hoặc số điện thoại kém chất lượng nếu không có kiểm tra.',
    password_auth:
      'Điều này là bắt buộc vì bạn đã bật tùy chọn tạo mật khẩu trong quá trình đăng ký.',
    verification_code_auth:
      'Điều này là bắt buộc vì bạn chỉ bật tùy chọn cung cấp mã xác minh khi đăng ký. Bạn có thể tự do bỏ chọn khi việc tạo mật khẩu được cho phép trong quá trình đăng ký.',
    email_mfa_enabled:
      'Mã xác minh qua email đã được bật cho xác thực đa yếu tố, nên không thể dùng lại làm phương thức đăng nhập chính vì lý do an toàn.',
    phone_mfa_enabled:
      'Mã xác minh qua số điện thoại đã được bật cho xác thực đa yếu tố, nên không thể dùng lại làm phương thức đăng nhập chính vì lý do an toàn.',
    delete_sign_in_method:
      'Điều này là bắt buộc vì bạn đã chọn {{identifier}} làm định danh bắt buộc.',
    password_disabled_notification:
      'Tùy chọn "Tạo mật khẩu" đã bị tắt đối với đăng ký bằng tên đăng nhập, điều này có thể khiến người dùng không đăng nhập được. Xác nhận để tiếp tục lưu.',
  },
  advanced_options: {
    title: 'TÙY CHỌN NÂNG CAO',
    enable_single_sign_on: 'Bật đăng nhập một lần (SSO) cho doanh nghiệp',
    enable_single_sign_on_description:
      'Cho phép người dùng đăng nhập vào ứng dụng bằng đăng nhập một lần với danh tính doanh nghiệp của họ.',
    single_sign_on_hint: {
      prefix: 'Đi tới ',
      link: '"SSO doanh nghiệp"',
      suffix: 'để cài đặt thêm liên kết doanh nghiệp.',
    },
    enable_user_registration: 'Cho phép đăng ký người dùng',
    enable_user_registration_description:
      'Cho phép hoặc cấm đăng ký người dùng. Khi tắt, người dùng vẫn có thể được thêm trong bảng quản trị nhưng người dùng không còn thể tự tạo tài khoản qua giao diện đăng nhập.',
    unknown_session_redirect_url: 'URL chuyển hướng khi phiên không xác định',
    unknown_session_redirect_url_tip:
      'Đôi khi sdvico có thể không nhận diện được phiên của người dùng trên trang đăng nhập, ví dụ khi phiên hết hạn hoặc người dùng đánh dấu trang hay chia sẻ liên kết đăng nhập. Theo mặc định, lỗi 404 "phiên không xác định" sẽ hiện ra. Để cải thiện trải nghiệm, hãy đặt một URL dự phòng để chuyển người dùng về ứng dụng của bạn và khởi động lại quá trình xác thực.',
  },
  username_policy: {
    title: 'Chính sách tên đăng nhập',
    description:
      'Tùy chỉnh yêu cầu về tên đăng nhập, bao gồm độ dài, ký tự cho phép và phân biệt hoa thường.',
    manage_button: 'Quản lý',
    modal_title: 'Chính sách tên đăng nhập',
    modal_description: 'Tùy chỉnh yêu cầu về tên đăng nhập cho người dùng cuối của bạn.',
    length: {
      title: 'Độ dài tên đăng nhập',
      minimum: 'Tối thiểu',
      maximum: 'Tối đa',
      min_greater_than_max: 'Độ dài tối thiểu không thể lớn hơn độ dài tối đa.',
    },
    allowed_chars: {
      title: 'Loại ký tự cho phép',
      uppercase: 'Chữ hoa (A-Z)',
      lowercase: 'Chữ thường (a-z)',
      numbers: 'Số (0-9)',
      underscore: 'Gạch dưới (_)',
      no_valid_leading_char:
        'Không cho phép chỉ có số. Hãy bật ít nhất một trong các loại: chữ hoa, chữ thường hoặc gạch dưới.',
      no_char_selected: 'Chọn ít nhất một loại ký tự.',
    },
    case_sensitive: {
      title: 'Tên đăng nhập phân biệt hoa thường',
      description:
        'Coi chữ hoa và chữ thường là khác nhau. ‘user123’ và ‘User123’ được coi là hai tên đăng nhập khác nhau.',
    },
    case_conflicts: {
      title: 'Phát hiện xung đột tên đăng nhập hiện có',
      description:
        'Một số tên đăng nhập sẽ trùng nhau nếu tắt phân biệt hoa thường. Hãy giải quyết {{count}} nhóm xung đột dưới đây trước khi lưu.',
      sample_title: 'Tên đăng nhập bị xung đột',
    },
  },
};

export default Object.freeze(sign_up_and_sign_in);
