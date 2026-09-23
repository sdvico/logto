const applications = {
  page_title: 'Ứng dụng',
  title: 'Ứng dụng',
  subtitle: 'Tạo và quản lý ứng dụng cho xác thực OIDC.',
  subtitle_with_app_type: 'Thiết lập xác thực sdvico cho ứng dụng {{name}} của bạn',
  create_device_flow_description:
    'Tạo một ứng dụng native dùng OAuth 2.0 Device Authorization Grant cho thiết bị hạn chế nhập liệu hoặc ứng dụng không giao diện.',
  create: 'Tạo ứng dụng',
  create_third_party: 'Tạo ứng dụng bên thứ ba',
  create_thrid_party_modal_title: 'Tạo ứng dụng bên thứ ba ({{type}})',
  application_name: 'Tên ứng dụng',
  application_name_placeholder: 'Ứng dụng của tôi',
  application_description: 'Mô tả ứng dụng',
  application_description_placeholder: 'Nhập mô tả ứng dụng của bạn',
  select_application_type: 'Chọn một loại ứng dụng',
  no_application_type_selected: 'Bạn chưa chọn loại ứng dụng nào',
  application_created: 'Đã tạo ứng dụng thành công.',
  tab: {
    my_applications: 'Ứng dụng của tôi',
    third_party_applications: 'Ứng dụng bên thứ ba',
  },
  app_id: 'App ID',
  type: {
    native: {
      title: 'Ứng dụng Native',
      subtitle: 'Ứng dụng chạy trong môi trường native',
      description: 'Ví dụ: ứng dụng iOS, Android, desktop, TV, CLI',
    },
    spa: {
      title: 'Single Page App',
      subtitle: 'Ứng dụng chạy trong trình duyệt web và tự cập nhật dữ liệu tại chỗ',
      description: 'Ví dụ: ứng dụng React DOM, Vue',
    },
    traditional: {
      title: 'Web truyền thống',
      subtitle: 'Ứng dụng render và cập nhật trang hoàn toàn bởi máy chủ web',
      description: 'Ví dụ: Next.js, PHP',
    },
    machine_to_machine: {
      title: 'Machine-to-Machine',
      subtitle: 'Ứng dụng (thường là một dịch vụ) giao tiếp trực tiếp với resource',
      description: 'Ví dụ: dịch vụ backend',
    },
    protected: {
      title: 'Ứng dụng được bảo vệ',
      subtitle: 'Ứng dụng được bảo vệ bởi sdvico', // Not in use
      description: 'N/A', // Not in use
    },
    saml: {
      title: 'Ứng dụng SAML',
      subtitle: 'Ứng dụng dùng làm connector SAML IdP',
      description: 'Ví dụ: SAML',
    },
    third_party: {
      title: 'Ứng dụng bên thứ ba',
      subtitle: 'Ứng dụng dùng làm connector IdP bên thứ ba',
      description: 'Ví dụ: OIDC',
    },
  },
  authorization_flow: {
    title: 'Luồng ủy quyền',
    tooltip: 'Chọn luồng ủy quyền cho ứng dụng của bạn. Sau khi đặt, không thể thay đổi.',
    authorization_code: {
      title: 'Authorization code',
      description:
        'Loại grant mặc định và phổ biến nhất. Người dùng được chuyển đến trang đăng nhập để ủy quyền truy cập trực tiếp.',
    },
    device_flow: {
      title: 'Device flow',
      description:
        'Dùng cho thiết bị hạn chế nhập liệu hoặc ứng dụng không giao diện (ví dụ: TV, CLI). Người dùng hoàn tất đăng nhập trên một thiết bị khác bằng cách nhập mã thiết bị hoặc quét mã QR.',
    },
  },
  placeholder_title: 'Chọn một loại ứng dụng để tiếp tục',
  placeholder_description:
    'sdvico dùng một thực thể ứng dụng cho OIDC để hỗ trợ các việc như nhận diện ứng dụng của bạn, quản lý đăng nhập và tạo audit log.',
  third_party_application_placeholder_description:
    'Dùng sdvico làm Identity Provider để cung cấp ủy quyền OAuth cho các dịch vụ bên thứ ba. Có sẵn màn hình xin sự đồng ý của người dùng cho truy cập tài nguyên. <a>Tìm hiểu thêm</a>',
  dynamic_app: {
    title: 'Ứng dụng động',
    subtitle: 'CIMD',
    description: 'Ứng dụng động cho phép OAuth client kết nối mà không cần đăng ký trước.',
    settings_description:
      'Ứng dụng động cho phép OAuth client kết nối mà không cần đăng ký trước. Sử dụng đặc tả OAuth Client ID Metadata Document (CIMD).',
    beta_notice:
      'Ứng dụng động hiện đang trong giai đoạn beta. Hãy trải nghiệm và <ContactLink>chia sẻ phản hồi</ContactLink> với chúng tôi.',
    app_id_placeholder: 'Được cung cấp động bởi mỗi client',
    enable_confirm_modal: {
      title: 'Bật truy cập client động?',
      content:
        'Bất kỳ OAuth client nào có URL client ID HTTPS công khai hợp lệ đều có thể khởi tạo ủy quyền cho tenant này mà không cần đăng ký trước. Truy cập vẫn bị giới hạn theo quyền tối đa và sự đồng ý của người dùng.',
      beta_pricing_notice:
        'Ứng dụng động miễn phí sử dụng trong giai đoạn beta. Có thể áp dụng giá add-on sau beta. Chúng tôi sẽ báo trước cho bạn, và bạn có thể tắt tính năng này bất cứ lúc nào.',
    },
    enabled: 'Đã bật ứng dụng động thành công.',
    disable_confirm_modal: {
      title: 'Tắt ứng dụng động?',
      content:
        'Các client CIMD sẽ không thể khởi tạo yêu cầu ủy quyền mới nữa. Các grant hiện có vẫn được giữ lại, và access token đã phát hành có thể vẫn hợp lệ đến khi hết hạn.',
    },
    disabled: 'Đã tắt ứng dụng động thành công.',
    permissions: {
      user_title: 'Người dùng',
      user_description:
        'Chọn các quyền mà OAuth client yêu cầu để truy cập dữ liệu người dùng cụ thể.',
      grant_user_level_permissions: 'Cấp quyền người dùng',
      organization_title: 'Tổ chức',
      organization_description:
        'Chọn các quyền mà OAuth client yêu cầu để truy cập dữ liệu tổ chức cụ thể.',
      grant_organization_level_permissions: 'Cấp quyền tổ chức',
      permission_delete_confirm:
        'Hành động này sẽ xóa quyền khỏi ứng dụng động, khiến OAuth client không thể yêu cầu người dùng ủy quyền cho quyền này nữa. Bạn có chắc muốn tiếp tục?',
    },
  },
  guide: {
    third_party: {
      title: 'Tích hợp ứng dụng bên thứ ba',
      description:
        'Dùng sdvico làm Identity Provider để cung cấp ủy quyền OAuth cho các dịch vụ bên thứ ba. Có sẵn màn hình xin sự đồng ý của người dùng cho truy cập tài nguyên an toàn. <a>Tìm hiểu thêm</a>',
    },
  },
};

export default Object.freeze(applications);
