const security = {
  page_title: 'An ninh',
  title: 'An ninh',
  subtitle: 'Cấu hình bảo vệ nâng cao chống lại các cuộc tấn công tinh vi.',
  tabs: {
    captcha: 'CAPTCHA',
    password_policy: 'Chính sách mật khẩu',
    blocklist: 'Danh sách chặn',
    general: 'Chung',
  },
  bot_protection: {
    title: 'Chống bot',
    description:
      'Bật CAPTCHA cho đăng ký, đăng nhập và khôi phục mật khẩu để chặn các mối đe dọa tự động.',
    captcha: {
      title: 'CAPTCHA',
      placeholder: 'Chọn nhà cung cấp CAPTCHA và thiết lập tích hợp.',
      add: 'Thêm CAPTCHA',
    },
    settings: 'Cài đặt',
    enable_captcha: 'Bật CAPTCHA',
    enable_captcha_description:
      'Bật xác minh CAPTCHA cho các luồng đăng ký, đăng nhập và khôi phục mật khẩu.',
    custom_ui_captcha_notice:
      'Bạn đang dùng giao diện tùy chỉnh (Bring your UI). Cần thêm cấu hình để bật CAPTCHA trong giao diện tùy chỉnh của bạn. <a>Xem hướng dẫn thiết lập</a>.',
  },
  create_captcha: {
    setup_captcha: 'Thiết lập CAPTCHA',
  },
  captcha_providers: {
    recaptcha_enterprise: {
      name: 'reCAPTCHA Enterprise',
      description:
        'Giải pháp CAPTCHA cấp doanh nghiệp của Google, cung cấp khả năng phát hiện mối đe dọa nâng cao và phân tích an ninh chi tiết để bảo vệ website của bạn khỏi các hoạt động gian lận.',
    },
    turnstile: {
      name: 'Cloudflare Turnstile',
      description:
        'Giải pháp CAPTCHA thông minh của Cloudflare, cung cấp khả năng chống bot không gây khó chịu, đảm bảo trải nghiệm người dùng liền mạch mà không cần giải câu đố hình ảnh.',
    },
  },
  captcha_details: {
    back_to_security: 'Quay lại An ninh',
    page_title: 'Chi tiết CAPTCHA',
    check_readme: 'Xem README',
    options_change_captcha: 'Đổi nhà cung cấp CAPTCHA',
    connection: 'Kết nối',
    description: 'Cấu hình các kết nối captcha của bạn.',
    site_key: 'Khóa trang (site key)',
    secret_key: 'Khóa bí mật',
    project_id: 'ID dự án',
    domain: 'Miền (không bắt buộc)',
    domain_placeholder: 'www.google.com (mặc định) hoặc recaptcha.net',
    recaptcha_key_id: 'ID khóa reCAPTCHA',
    recaptcha_api_key: 'Khóa API của dự án',
    deletion_description: 'Bạn có chắc chắn muốn xóa nhà cung cấp CAPTCHA này không?',
    captcha_deleted: 'Đã xóa nhà cung cấp CAPTCHA thành công',
    setup_captcha: 'Thiết lập CAPTCHA',
    mode: 'Chế độ xác minh',
    mode_invisible: 'Ẩn',
    mode_checkbox: 'Hộp kiểm',
    mode_notice:
      'Chế độ xác minh được định nghĩa trong cài đặt khóa reCAPTCHA của bạn trên Google Cloud Console. Thay đổi chế độ tại đây yêu cầu loại khóa tương ứng.',
  },
  password_policy: {
    password_requirements: 'Yêu cầu mật khẩu',
    password_requirements_description:
      'Nâng cao yêu cầu mật khẩu để chống lại tấn công dò mật khẩu (credential stuffing) và mật khẩu yếu. ',
    minimum_length: 'Độ dài tối thiểu',
    minimum_length_description:
      'NIST đề xuất dùng <a>tối thiểu 8 ký tự</a> cho các sản phẩm web.',
    minimum_length_error: 'Độ dài tối thiểu phải trong khoảng {{min}} đến {{max}} (bao gồm hai đầu).',
    minimum_required_char_types: 'Số loại ký tự bắt buộc tối thiểu',
    minimum_required_char_types_description:
      'Loại ký tự: chữ hoa (A-Z), chữ thường (a-z), số (0-9) và ký tự đặc biệt ({{symbols}}).',
    password_rejection: 'Từ chối mật khẩu',
    compromised_passwords: 'Từ chối mật khẩu bị lộ',
    breached_passwords: 'Mật khẩu bị lộ',
    breached_passwords_description: 'Từ chối các mật khẩu đã từng xuất hiện trong cơ sở dữ liệu bị lộ.',
    restricted_phrases: 'Hạn chế cụm từ kém an toàn',
    restricted_phrases_tooltip:
      'Mật khẩu của bạn nên tránh các cụm từ này trừ khi kết hợp thêm 3 ký tự bổ sung hoặc nhiều hơn.',
    repetitive_or_sequential_characters: 'Ký tự lặp lại hoặc liên tiếp',
    repetitive_or_sequential_characters_description: 'Ví dụ: "AAAA", "1234" và "abcd".',
    user_information: 'Thông tin người dùng',
    user_information_description: 'Ví dụ: địa chỉ email, số điện thoại, tên người dùng, v.v.',
    custom_words: 'Từ tùy chỉnh',
    custom_words_description:
      'Cá nhân hóa các từ theo ngữ cảnh cụ thể, không phân biệt hoa thường, mỗi từ một dòng.',
    custom_words_placeholder: 'Tên dịch vụ, tên công ty của bạn, v.v.',
    password_expiration: 'Hết hạn mật khẩu',
    password_expiration_description:
      'Yêu cầu người dùng đặt lại mật khẩu sau một số ngày nhất định. Người dùng đăng nhập qua SSO hoặc passkey sẽ không bị ảnh hưởng.',
    enable_password_expiration: 'Bật hết hạn mật khẩu',
    enable_password_expiration_description:
      'Yêu cầu người dùng đặt lại mật khẩu định kỳ. Người dùng hiện có chưa có ngày đổi mật khẩu được ghi nhận sẽ được tính từ ngày chính sách này được bật.',
    enable_password_expiration_tip:
      'Hết hạn mật khẩu chỉ có thể bật sau khi bạn cấu hình ít nhất một phương thức quên mật khẩu với bộ kết nối hợp lệ trong trải nghiệm đăng nhập.',
    expiration_period: 'Thời hạn hiệu lực mật khẩu (ngày)',
    expiration_period_description: 'Số ngày mật khẩu còn hiệu lực trước khi hết hạn.',
    expiration_period_error: 'Thời hạn hiệu lực mật khẩu phải trong khoảng {{min}} đến {{max}} ngày.',
    password_expiration_recovery_reminder:
      'Một số người dùng có thể không có địa chỉ email hoặc số điện thoại để nhận mã khôi phục mật khẩu, nên họ sẽ không thể đặt lại mật khẩu đã hết hạn. Hãy yêu cầu email hoặc số điện thoại khi đăng ký để đảm bảo mọi người dùng đều có thể khôi phục mật khẩu.',
  },
  verification_code_policy: {
    card_title: 'Mã xác minh',
    card_description:
      'Cấu hình thời hạn hết hạn và số lần thử lại tối đa cho mã xác minh dùng trong các luồng đăng nhập, đăng ký và đặt lại mật khẩu.',
    enable: {
      title: 'Tùy chỉnh cài đặt mã xác minh',
      description:
        'Cho phép tùy chỉnh thời hạn hết hạn của mã xác minh và số lần thử lại tối đa.',
    },
    expiration_duration: {
      title: 'Thời hạn hết hạn (giây)',
      description:
        'Khoảng thời gian tính bằng giây mà mã xác minh còn hiệu lực sau khi được gửi.',
      error_message: 'Thời hạn hết hạn phải trong khoảng từ 60 đến 3600 giây.',
    },
    max_retry_attempts: {
      title: 'Số lần thử lại tối đa',
      description:
        'Số lần xác minh thất bại tối đa được phép trước khi mã bị vô hiệu hóa.',
      error_message: 'Số lần thử lại tối đa phải trong khoảng từ 1 đến 100.',
    },
  },

  sentinel_policy: {
    card_title: 'Khóa định danh',
    card_description:
      'Chức năng khóa được áp dụng cho mọi người dùng với cài đặt mặc định, nhưng bạn có thể tùy chỉnh để kiểm soát tốt hơn.\n\nTạm thời khóa một định danh sau nhiều lần xác thực thất bại liên tiếp (ví dụ: nhập sai mật khẩu hoặc mã xác minh liên tục) để ngăn chặn tấn công dò mật khẩu (brute force).',
    enable_sentinel_policy: {
      title: 'Tùy chỉnh trải nghiệm khóa',
      description:
        'Cho phép tùy chỉnh số lần đăng nhập thất bại tối đa trước khi khóa, thời gian khóa và mở khóa thủ công ngay lập tức.',
    },
    max_attempts: {
      title: 'Số lần thất bại tối đa',
      description:
        'Tạm thời khóa một định danh khi đạt số lần đăng nhập thất bại tối đa trong một giờ.',
      error_message: 'Số lần thất bại tối đa phải lớn hơn 0.',
    },
    lockout_duration: {
      title: 'Thời gian khóa (phút)',
      description: 'Chặn đăng nhập trong một khoảng thời gian sau khi vượt quá giới hạn số lần thất bại tối đa.',
      error_message: 'Thời gian khóa phải ít nhất 1 phút.',
    },
    manual_unlock: {
      title: 'Mở khóa thủ công',
      description:
        'Mở khóa người dùng ngay lập tức bằng cách xác nhận danh tính của họ và nhập định danh của họ.',
      unblock_by_identifiers: 'Mở khóa theo định danh',
      modal_description_1:
        'Một định danh đã bị tạm khóa do nhiều lần đăng nhập/đăng ký thất bại. Để bảo vệ an ninh, quyền truy cập sẽ tự động được khôi phục sau thời gian khóa.',
      modal_description_2:
        ' Chỉ mở khóa thủ công khi bạn đã xác nhận danh tính của người dùng và đảm bảo không có nỗ lực truy cập trái phép.',
      placeholder: 'Nhập định danh (địa chỉ email / số điện thoại / tên người dùng)',
      confirm_button_text: 'Mở khóa ngay',
      success_toast: 'Đã mở khóa thành công',
      duplicate_identifier_error: 'Định danh đã được thêm',
      empty_identifier_error: 'Vui lòng nhập ít nhất một định danh',
    },
  },
  blocklist: {
    card_title: 'Danh sách chặn email',
    card_description:
      'Kiểm soát cơ sở người dùng của bạn bằng cách chặn các địa chỉ email có rủi ro cao hoặc không mong muốn.',
    custom_email_allowlist: {
      title: 'Cho phép địa chỉ email tùy chỉnh',
      description:
        'Thêm quy tắc để chỉ cho phép các miền email, địa chỉ email hoặc mẫu ký tự đại diện cụ thể cho việc đăng ký mới và email vừa liên kết. Ví dụ: bar@example.com, @example.com, foo*@example.com, *@example.com. Các miền gmail.com và googlemail.com được coi là tương đương, và các dấu chấm trong phần local sẽ bị bỏ qua, do đó foo.bar@gmail.com khớp với foobar@googlemail.com.',
      placeholder: 'Nhập địa chỉ email, miền hoặc mẫu ký tự đại diện',
      duplicate_error: 'Địa chỉ email, miền hoặc mẫu ký tự đại diện email đã được thêm',
      invalid_format_error:
        'Phải là địa chỉ email hợp lệ (bar@example.com), miền (@example.com) hoặc mẫu ký tự đại diện email (foo*@example.com, *@example.com)',
      warnings: {
        identical_entries:
          'Một số mục trong danh sách cho phép cũng tồn tại trong quy tắc chặn. Các email khớp có thể vẫn bị chặn.',
        blocked_exact_email:
          'Một số email chính xác trong danh sách cho phép khớp với một quy tắc chặn. Các email khớp có thể vẫn bị chặn.',
        blocked_subaddressing:
          'Một số mục trong danh sách cho phép chứa dấu cộng (+), nhưng subaddressing email đang bị chặn.',
        effectively_unusable:
          'Dựa trên các kiểm tra này, danh sách cho phép hiện tại có thể không cho phép bất kỳ email mới nào đi qua.',
      },
    },
    disposable_email: {
      title: 'Chặn địa chỉ email dùng một lần',
      description:
        'Bật để từ chối các lượt đăng ký dùng địa chỉ email dùng một lần hoặc tạm thời, giúp ngăn spam và cải thiện chất lượng người dùng.',
    },
    email_subaddressing: {
      title: 'Chặn subaddressing email',
      description:
        'Bật để từ chối các lượt đăng ký dùng địa chỉ email có dấu cộng (+) và ký tự bổ sung (ví dụ: user+alias@foo.com).',
    },
    custom_email_address: {
      title: 'Chặn địa chỉ email tùy chỉnh',
      description:
        'Thêm quy tắc để chặn các miền email, địa chỉ email hoặc mẫu ký tự đại diện cụ thể khỏi việc đăng ký hoặc liên kết qua giao diện. Ví dụ: bar@example.com, @example.com, foo*@example.com, *@example.com. Các miền gmail.com và googlemail.com được coi là tương đương, và các dấu chấm trong phần local sẽ bị bỏ qua, do đó foo.bar@gmail.com khớp với foobar@googlemail.com.',
      placeholder: 'Nhập địa chỉ email, miền hoặc mẫu ký tự đại diện',
      duplicate_error: 'Địa chỉ email, miền hoặc mẫu ký tự đại diện email đã được thêm',
      invalid_format_error:
        'Phải là địa chỉ email hợp lệ (bar@example.com), miền (@example.com) hoặc mẫu ký tự đại diện email (foo*@example.com, *@example.com)',
    },
  },
};

export default Object.freeze(security);
