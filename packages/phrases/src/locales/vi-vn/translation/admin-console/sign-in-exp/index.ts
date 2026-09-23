import content from './content.js';
import custom_profile_fields from './custom-profile-fields.js';
import sign_up_and_sign_in from './sign-up-and-sign-in.js';

const sign_in_exp = {
  page_title: 'Trải nghiệm đăng nhập',
  page_title_with_account: 'Đăng nhập & tài khoản',
  title: 'Đăng nhập & tài khoản',
  description:
    'Tùy chỉnh luồng xác thực và giao diện, xem trước trải nghiệm dựng sẵn theo thời gian thực.',
  tabs: {
    branding: 'Nhận diện thương hiệu',
    sign_up_and_sign_in: 'Đăng ký và đăng nhập',
    collect_user_profile: 'Thu thập hồ sơ người dùng',
    account_center: 'Trung tâm tài khoản',
    content: 'Nội dung',
    password_policy: 'Chính sách mật khẩu',
  },
  welcome: {
    title: 'Tùy chỉnh trải nghiệm đăng nhập',
    description:
      'Bắt đầu nhanh với cài đặt đăng nhập đầu tiên của bạn. Hướng dẫn này sẽ đưa bạn qua tất cả cài đặt cần thiết.',
    get_started: 'Bắt đầu',
    apply_remind:
      'Xin lưu ý rằng trải nghiệm đăng nhập sẽ áp dụng cho tất cả ứng dụng thuộc tài khoản này.',
  },
  color: {
    title: 'MÀU SẮC',
    primary_color: 'Màu thương hiệu',
    dark_primary_color: 'Màu thương hiệu (tối)',
    dark_mode: 'Bật chế độ tối',
    dark_mode_description:
      'Ứng dụng của bạn sẽ có giao diện chế độ tối tự động tạo dựa trên màu thương hiệu và thuật toán của sdvico. Bạn có thể tự do tùy chỉnh.',
    dark_mode_reset_tip: 'Tính lại màu chế độ tối dựa trên màu thương hiệu.',
    reset: 'Tính lại',
  },
  branding: {
    title: 'KHU VỰC NHẬN DIỆN THƯƠNG HIỆU',
    ui_style: 'Kiểu',
    with_light: '{{value}}',
    with_dark: '{{value}} (tối)',
    app_logo_and_favicon: 'Logo ứng dụng và favicon',
    company_logo_and_favicon: 'Logo công ty và favicon',
    organization_logo_and_favicon: 'Logo tổ chức và favicon',
    hide_logto_branding: 'Ẩn nhận diện sdvico',
    hide_logto_branding_description:
      'Xóa dòng "Powered by sdvico". Làm nổi bật riêng thương hiệu của bạn với trải nghiệm đăng nhập sạch, chuyên nghiệp.',
    hide_logto_branding_oss_note: 'Tính năng này có sẵn mặc định trên <a>sdvico Cloud</a>.',
  },
  branding_uploads: {
    app_logo: {
      title: 'Logo ứng dụng',
      url: 'URL logo ứng dụng',
      url_placeholder: 'https://your.cdn.domain/logo.png',
      error: 'Logo ứng dụng: {{error}}',
    },
    company_logo: {
      title: 'Logo công ty',
      url: 'URL logo công ty',
      url_placeholder: 'https://your.cdn.domain/logo.png',
      error: 'Logo công ty: {{error}}',
    },
    organization_logo: {
      title: 'Tải lên hình ảnh',
      url: 'URL logo tổ chức',
      url_placeholder: 'https://your.cdn.domain/logo.png',
      error: 'Logo tổ chức: {{error}}',
    },
    connector_logo: {
      title: 'Tải lên hình ảnh',
      url: 'URL logo liên kết',
      url_placeholder: 'https://your.cdn.domain/logo.png',
      error: 'Logo liên kết: {{error}}',
    },
    favicon: {
      title: 'Favicon',
      url: 'URL favicon',
      url_placeholder: 'https://your.cdn.domain/favicon.ico',
      error: 'Favicon: {{error}}',
    },
  },
  custom_ui: {
    title: 'Giao diện tùy chỉnh',
    cloud_tag: 'Cloud',
    css_code_editor_title: 'CSS tùy chỉnh',
    css_code_editor_field_title: 'Ghi đè CSS',
    css_code_editor_description1: 'Xem ví dụ về CSS tùy chỉnh.',
    css_code_editor_description2: '<a>{{link}}</a>',
    css_code_editor_description_link_content: 'Tìm hiểu thêm',
    css_code_editor_content_placeholder:
      'Nhập CSS ghi đè của bạn tại đây để tùy biến giao diện theo đúng ý muốn. Thể hiện sự sáng tạo và làm nổi bật giao diện của bạn.',
    bring_your_ui_title: 'Dùng giao diện riêng',
    bring_your_ui_upload_title: 'Tải lên tài nguyên giao diện tùy chỉnh',
    bring_your_ui_description:
      'Tải lên một gói nén (.zip) để thay thế giao diện dựng sẵn của sdvico bằng mã của riêng bạn. <a>Tìm hiểu thêm</a>',
    bring_your_ui_oss_description: 'Tùy chỉnh giao diện đăng nhập bằng mã của riêng bạn.',
    bring_your_ui_oss_card_description:
      'Tải lên giao diện đăng nhập tùy chỉnh của bạn trực tiếp trên <a>sdvico Cloud</a>. Không cần fork và triển khai lại.',
    bring_your_ui_oss_try_cloud: 'Thử Cloud',
    preview_with_bring_your_ui_description:
      'Tài nguyên giao diện tùy chỉnh của bạn đã được tải lên thành công và đang được sử dụng. Do đó, cửa sổ xem trước dựng sẵn đã bị tắt.\nĐể kiểm tra giao diện đăng nhập tùy chỉnh của bạn, hãy nhấn nút "Xem trước trực tiếp" để mở trong tab trình duyệt mới.',
    csp_description:
      'Cho phép thêm các nguồn (source expression) cho giao diện đăng nhập tùy chỉnh của bạn. Các giá trị này chỉ áp dụng khi tài nguyên giao diện tùy chỉnh được phục vụ.',
    csp_script_src: 'script-src được cho phép',
    csp_script_src_tip:
      'Cho phép các nguồn HTTPS cho script được tải bởi giao diện tùy chỉnh của bạn, ví dụ https://scripts.example.com hoặc https://*.example.com.',
    csp_connect_src: 'connect-src được cho phép',
    csp_connect_src_tip:
      'Cho phép các nguồn HTTPS hoặc WSS cho các yêu cầu mạng thực hiện từ giao diện tùy chỉnh của bạn, ví dụ https://api.example.com hoặc wss://events.example.com.',
    csp_source_invalid_error:
      'Nhập một nguồn hợp lệ. Sử dụng URL https://; connect-src cũng hỗ trợ wss://. Không hỗ trợ từ khóa CSP và dấu chấm phẩy.',
    csp_source_duplicate_error: 'Nguồn này đã có trong danh sách.',
  },
  account_center: {
    title: 'TRUNG TÂM TÀI KHOẢN',
    description:
      'Triển khai trung tâm tài khoản để người dùng cuối quản lý bảo mật tài khoản và thông tin hồ sơ.',
    enable_account_api: 'Bật trung tâm tài khoản và Account API',
    enable_account_api_description:
      'Bật cả Account API dành cho người dùng và trung tâm tài khoản dựng sẵn của sdvico. Khi tắt, cả hai tính năng sẽ không dùng được.',
    field_options: {
      off: 'Tắt',
      edit: 'Chỉnh sửa',
      read_only: 'Chỉ đọc',
      enabled: 'Đã bật',
      disabled: 'Đã tắt',
    },
    sections: {
      account_security: {
        title: 'BẢO MẬT TÀI KHOẢN',
        description:
          'Quản lý quyền truy cập Account API, cho phép người dùng xem hoặc sửa thông tin định danh và các yếu tố xác thực sau khi đăng nhập vào ứng dụng.',
        security_verification: {
          title: 'Xác minh bảo mật',
          description:
            'Trước khi thay đổi cài đặt bảo mật, người dùng phải xác minh danh tính để nhận mã xác minh có hiệu lực 10 phút. Để bật một phương thức xác minh (email, điện thoại, mật khẩu), hãy đặt quyền Account API thành <strong>Chỉ đọc</strong> (tối thiểu) hoặc <strong>Chỉnh sửa</strong> ở dưới để hệ thống nhận biết người dùng đã cấu hình phương thức đó. <a>Tìm hiểu thêm</a>',
        },
        groups: {
          identifiers: {
            title: 'Định danh',
          },
          authentication_factors: {
            title: 'Yếu tố xác thực',
          },
          session_management: {
            title: 'Quản lý phiên',
          },
        },
      },
      user_profile: {
        title: 'HỒ SƠ NGƯỜI DÙNG',
        description:
          'Quản lý quyền truy cập Account API, cho phép người dùng xem hoặc sửa dữ liệu hồ sơ cơ bản hoặc tùy chỉnh sau khi đăng nhập vào ứng dụng.',
        groups: {
          profile_data: {
            title: 'Dữ liệu hồ sơ',
          },
        },
      },
      secret_vault: {
        title: 'KHO LƯU TRỮ BÍ MẬT',
        description:
          'Đối với các liên kết mạng xã hội và doanh nghiệp, lưu trữ an toàn token truy cập của bên thứ ba để gọi API của họ (ví dụ: thêm sự kiện vào Google Calendar).',
        third_party_token_storage: {
          title: 'Token bên thứ ba',
          third_party_access_token_retrieval: 'Lấy token truy cập bên thứ ba',
          third_party_token_tooltip:
            'Để lưu token, bạn có thể bật tính năng này trong cài đặt của liên kết mạng xã hội hoặc doanh nghiệp tương ứng.',
          third_party_token_description:
            'Khi Account API được bật, việc lấy token bên thứ ba sẽ được tự động kích hoạt.',
        },
      },
    },
    fields: {
      email: 'Địa chỉ email',
      phone: 'Số điện thoại',
      social: 'Định danh mạng xã hội',
      password: 'Mật khẩu',
      mfa: 'Xác thực đa yếu tố',
      mfa_description: 'Cho phép người dùng quản lý phương thức MFA từ trung tâm tài khoản.',
      passkey: 'Passkey',
      username: 'Tên đăng nhập',
      name: 'Tên',
      avatar: 'Ảnh đại diện',
      profile: 'Hồ sơ',
      profile_description: 'Kiểm soát quyền truy cập các thuộc tính hồ sơ có cấu trúc.',
      custom_data: 'Dữ liệu tùy chỉnh',
      custom_data_description: 'Kiểm soát quyền truy cập dữ liệu JSON tùy chỉnh lưu trên người dùng.',
      sessions: 'Phiên',
      trusted_devices: 'Thiết bị tin cậy',
    },
    profile_fields: {
      title: 'Trường hồ sơ cho trung tâm tài khoản dựng sẵn',
      add_profile_fields: 'Thêm trường hồ sơ',
      hint: {
        not_in_list: 'Không có trong danh sách?',
        set_up: 'Cài đặt',
        go_to: 'các trường hồ sơ khác ngay.',
      },
      disabled_hint: {
        name: 'Để thêm trường này, hãy đặt quyền "Tên" thành "Chỉnh sửa / Chỉ đọc" trong phần Hồ sơ người dùng bên dưới trước.',
        avatar:
          'Để thêm trường này, hãy đặt quyền "Ảnh đại diện" thành "Chỉnh sửa / Chỉ đọc" trong phần Hồ sơ người dùng bên dưới trước.',
        profile:
          'Để thêm trường này, hãy đặt quyền "Hồ sơ" thành "Chỉnh sửa / Chỉ đọc" trong phần Hồ sơ người dùng bên dưới trước.',
        custom_data:
          'Để thêm trường này, hãy đặt quyền "Dữ liệu tùy chỉnh" thành "Chỉnh sửa / Chỉ đọc" trong phần Hồ sơ người dùng bên dưới trước.',
      },
    },
    webauthn_related_origins: 'Nguồn liên quan WebAuthn',
    webauthn_related_origins_description:
      'Thêm các domain của ứng dụng front-end được phép đăng ký passkey qua Account API.',
    webauthn_related_origins_error: 'Nguồn phải bắt đầu bằng https:// hoặc http://',
    delete_account_url: 'Xóa tài khoản',
    delete_account_url_description:
      'Cung cấp URL endpoint riêng của bạn để xử lý việc xóa tài khoản theo logic tùy chỉnh.',
    prebuilt_ui: {
      title: 'TÍCH HỢP GIAO DIỆN DỰNG SẴN',
      description:
        'Tích hợp nhanh trung tâm tài khoản dựng sẵn, xác minh bảo mật, hoặc một luồng cập nhật hồ sơ đơn lẻ bằng giao diện dựng sẵn. Chỉ cần kết hợp domain của bạn với route để tạo URL trung tâm tài khoản (ví dụ: https://auth.foo.com/account/email).',
      permission_notice:
        'Để tích hợp các luồng dựng sẵn này, hãy đặt quyền Account API liên quan thành <strong>Chỉnh sửa</strong> trong cài đặt bên dưới.',
      account_center_title: 'Tích hợp trung tâm tài khoản dựng sẵn',
      account_center_description:
        'Chuyển người dùng đến trung tâm tài khoản để quản lý cài đặt bảo mật như email, điện thoại, tên đăng nhập, mật khẩu, MFA và tài khoản liên kết.',
      flows_title: 'Tích hợp các luồng cài đặt bảo mật dựng sẵn',
      single_task_flows_title: 'Tích hợp một luồng đơn lẻ dựng sẵn',
      flows_description:
        'Kết hợp domain của bạn với route để tạo URL cài đặt tài khoản (ví dụ: https://auth.foo.com/account/email). Có thể thêm `redirect=` để đưa người dùng về ứng dụng sau khi cập nhật thành công, `show_success=true` để giữ trang thành công hiển thị, `ui_locales=` để ghi đè ngôn ngữ mặc định, hoặc `identifier=` để điền trước ô định danh.',
      single_task_flows_description:
        'Chuyển người dùng thẳng vào một luồng cụ thể (ví dụ: liên kết email). Có thể thêm `redirect=` để đưa người dùng về ứng dụng sau khi cập nhật thành công, `show_success=true` để giữ trang thành công hiển thị, `ui_locales=` để ghi đè ngôn ngữ mặc định, hoặc `identifier=` để điền trước ô định danh.',
      tooltips: {
        email: 'Cập nhật địa chỉ email chính của bạn',
        phone: 'Cập nhật số điện thoại chính của bạn',
        username: 'Cập nhật tên đăng nhập của bạn',
        password: 'Đặt mật khẩu mới',
        social: 'Liên kết tài khoản mạng xã hội để đăng nhập',
        social_change: 'Đổi sang một tài khoản mạng xã hội liên kết khác',
        social_remove: 'Xóa một tài khoản mạng xã hội đã liên kết',
        authenticator_app: 'Thiết lập ứng dụng xác thực mới cho xác thực đa yếu tố',
        authenticator_app_replace: 'Thay thế ứng dụng xác thực hiện có bằng ứng dụng mới',
        passkey_add: 'Đăng ký passkey mới',
        passkey_manage: 'Quản lý passkey hiện có hoặc thêm passkey mới',
        backup_codes_generate: 'Tạo bộ 10 mã dự phòng mới',
        backup_codes_manage: 'Xem mã dự phòng hiện có hoặc tạo mã mới',
        account_center:
          'Truy cập trung tâm tài khoản để quản lý cài đặt bảo mật như email, điện thoại, tên đăng nhập, mật khẩu, MFA và tài khoản liên kết',
        profile: 'Trung tâm quản lý thông tin cá nhân của bạn (ví dụ: tên, ảnh đại diện)',
        sessions: 'Xem và quản lý các phiên đang hoạt động trên các thiết bị',
      },
      customize_note: 'Không muốn trải nghiệm dựng sẵn? Bạn có thể hoàn toàn',
      customize_link: 'tùy chỉnh luồng của mình bằng Account API.',
    },
    custom_css: {
      title: 'CSS TÙY CHỈNH',
      description: 'Tùy chỉnh giao diện của trung tâm tài khoản bằng CSS tùy chỉnh.',
    },
  },
  sign_up_and_sign_in,
  content,
  setup_warning: {
    no_connector_sms:
      'Chưa cài đặt liên kết SMS. Trước khi hoàn tất cấu hình, người dùng sẽ không thể đăng nhập bằng phương thức này. <a>{{link}}</a> trong "Liên kết"',
    no_connector_email:
      'Chưa cài đặt liên kết email. Trước khi hoàn tất cấu hình, người dùng sẽ không thể đăng nhập bằng phương thức này. <a>{{link}}</a> trong "Liên kết"',
    no_connector_social:
      'Bạn chưa cài đặt liên kết mạng xã hội nào. Hãy thêm liên kết trước để áp dụng phương thức đăng nhập mạng xã hội. <a>{{link}}</a> trong "Liên kết".',
    no_connector_email_account_center:
      'Chưa cài đặt liên kết email. Hãy cài đặt tại <a>"Liên kết email và SMS"</a>.',
    no_connector_sms_account_center:
      'Chưa cài đặt liên kết SMS. Hãy cài đặt tại <a>"Liên kết email và SMS"</a>.',
    no_connector_social_account_center:
      'Chưa cài đặt liên kết mạng xã hội. Hãy cài đặt tại <a>"Liên kết mạng xã hội"</a>.',
    no_mfa_factor: 'Chưa cài đặt yếu tố MFA nào. Hãy cài đặt tại <a>{{link}}</a>.',
    setup_link: 'Cài đặt',
  },
  save_alert: {
    description:
      'Bạn đang triển khai quy trình đăng nhập và đăng ký mới. Tất cả người dùng của bạn có thể bị ảnh hưởng bởi cài đặt mới này. Bạn có chắc muốn cam kết với thay đổi này?',
    before: 'Trước',
    after: 'Sau',
    sign_up: 'Đăng ký',
    sign_in: 'Đăng nhập',
    social: 'Mạng xã hội',
    forgot_password_migration_notice:
      'Chúng tôi đã nâng cấp xác minh quên mật khẩu để hỗ trợ các phương thức tùy chỉnh. Trước đây, việc này được xác định tự động dựa trên liên kết email và SMS của bạn. Nhấn <strong>Xác nhận</strong> để hoàn tất nâng cấp.',
  },
  preview: {
    title: 'Xem trước đăng nhập',
    live_preview: 'Xem trước trực tiếp',
    live_preview_tip: 'Lưu để xem trước thay đổi',
    native: 'Ứng dụng gốc',
    desktop_web: 'Web trên máy tính',
    mobile_web: 'Web trên di động',
    desktop: 'Máy tính',
    mobile: 'Di động',
  },
  custom_profile_fields,
};

export default Object.freeze(sign_in_exp);
