const tenants = {
  title: 'Cài đặt',
  description: 'Quản lý hiệu quả cài đặt tenant và tùy chỉnh domain của bạn.',
  oss_description:
    'Thay đổi cài đặt tài khoản và quản lý thông tin cá nhân tại đây để bảo đảm an toàn tài khoản của bạn.',
  tabs: {
    settings: 'Cài đặt',
    members: 'Thành viên',
    domains: 'Domain',
    oidc_configs: 'Cấu hình OIDC',
    subscription: 'Gói và thanh toán',
    billing_history: 'Lịch sử thanh toán',
    license: 'Giấy phép',
  },
  license: {
    purchase_title: 'GÓI TỰ TRIỂN KHAI',
    purchase_description:
      'Gói Pro và Doanh nghiệp tự triển khai mở khóa các tính năng trả phí trên máy chủ riêng của bạn, như ẩn nhận diện sdvico, dùng giao diện riêng, SSO khởi tạo từ IdP, cộng tác trên Console và không giới hạn ứng dụng SAML. Mua một gói để nhận khóa giấy phép của bạn.',
    purchase_button: 'Xem các gói tự triển khai',
    install_title: 'CÀI ĐẶT GIẤY PHÉP',
    install_description: 'Dán khóa giấy phép bạn nhận được sau khi mua gói tự triển khai.',
    install_button: 'Cài đặt giấy phép',
    key_field: 'Khóa giấy phép',
    key_field_description:
      'Khóa được xác minh trên máy chủ của bạn và không bao giờ rời khỏi đó. Hãy lấy khóa mới từ tài khoản sdvico của bạn nếu khóa hiện tại đã hết hạn.',
    key_placeholder: 'Dán khóa giấy phép của bạn vào đây',
    installed_toast: 'Cài đặt giấy phép thành công.',
    details_title: 'GIẤY PHÉP',
    details_description: 'Giấy phép được cài trên máy chủ này và những quyền mà nó cấp.',
    plan_field: 'Gói',
    environment_field: 'Môi trường',
    environment_production: 'Production',
    environment_non_production: 'Không phải production',
    expires_at_field: 'Hết hạn vào',
    installed_at_field: 'Cài đặt vào',
    replace_button: 'Thay giấy phép',
  },
  members: {
    card_title: 'Quản lý tenant an toàn hơn với sdvico Cloud',
    card_description:
      'Thêm quản trị viên hoặc người cộng tác vào tenant của bạn mà không cần chia sẻ một tài khoản quản trị chung.',
    card_action: 'Khám phá sdvico Cloud',
    self_hosted_card_title: 'Quản lý tenant an toàn hơn với các gói tự triển khai',
    self_hosted_card_description:
      'Thêm quản trị viên hoặc người cộng tác vào tenant của bạn mà không cần chia sẻ một tài khoản quản trị chung.',
    self_hosted_card_action: 'Khám phá các gói tự triển khai',
  },
  settings: {
    title: 'CÀI ĐẶT',
    description: 'Đặt tên tenant và xem khu vực lưu trữ dữ liệu cùng loại tenant của bạn.',
    tenant_id: 'ID tenant',
    tenant_name: 'Tên tenant',
    tenant_instance: 'Chọn máy chủ của bạn',
    tenant_instance_description:
      'Chọn nơi tenant của bạn sẽ được lưu trữ. Chọn sdvico Cloud cho hạ tầng chia sẻ công khai, hoặc một máy chủ riêng cho tài nguyên chuyên dụng.',
    tenant_region: 'Khu vực dữ liệu',
    tenant_region_description:
      'Vị trí vật lý nơi tài nguyên tenant của bạn (người dùng, ứng dụng, v.v.) được lưu trữ. Không thể thay đổi sau khi tạo.',
    tenant_region_tip: 'Tài nguyên tenant của bạn được lưu trữ tại {{region}}. <a>Tìm hiểu thêm</a>',
    environment_tag_development: 'Dev',
    environment_tag_production: 'Prod',
    tenant_type: 'Loại tenant',
    development_description:
      'Chỉ dùng để thử nghiệm và không nên dùng trong môi trường production. Không cần gói đăng ký. Có đầy đủ tính năng Pro nhưng có một số hạn chế như banner đăng nhập.',
    production_description:
      'Dành cho các ứng dụng đang được người dùng cuối sử dụng và có thể yêu cầu gói đăng ký trả phí.',
    tenant_info_saved: 'Đã lưu thông tin tenant thành công.',
    tenant_mfa: 'Xác thực đa yếu tố',
    tenant_mfa_description:
      'Yêu cầu thành viên của bạn thiết lập xác thực đa yếu tố để truy cập tenant này.',
    enterprise_sso: 'SSO doanh nghiệp',
    enterprise_sso_description:
      'Có sẵn trên các gói trả phí. Liên hệ chúng tôi để bật SSO doanh nghiệp giúp mọi thành viên đăng nhập vào Console sdvico Cloud bằng nhà cung cấp danh tính của tổ chức bạn.',
  },
  full_env_tag: {
    development: 'Development',
    production: 'Production',
  },
  deletion_card: {
    title: 'XÓA',
    tenant_deletion: 'Xóa tenant',
    tenant_deletion_description:
      'Xóa tenant sẽ dẫn đến việc loại bỏ vĩnh viễn toàn bộ dữ liệu người dùng và cấu hình liên quan. Vui lòng thực hiện cẩn trọng.',
    tenant_deletion_button: 'Xóa tenant',
  },
  leave_tenant_card: {
    title: 'RỜI KHỎI',
    leave_tenant: 'Rời khỏi tenant',
    leave_tenant_description:
      'Mọi tài nguyên trong tenant sẽ vẫn còn nhưng bạn sẽ không còn quyền truy cập vào tenant này.',
    last_admin_note: 'Để rời khỏi tenant này, hãy đảm bảo có ít nhất một thành viên khác có vai trò Quản trị viên.',
  },
  create_modal: {
    title: 'Tạo tenant',
    subtitle: 'Tạo một tenant mới có tài nguyên và người dùng riêng biệt.',
    tenant_id: 'ID tenant',
    tenant_usage_purpose: 'Bạn muốn dùng tenant này để làm gì?',
    development_description:
      'Chỉ dùng để thử nghiệm và không nên dùng trong môi trường production. Không cần gói đăng ký.',
    development_description_for_private_regions:
      'Chỉ dùng để thử nghiệm và không nên dùng trong môi trường production.',
    development_hint: 'Có đầy đủ tính năng Pro nhưng có một số hạn chế như banner đăng nhập.',
    production_description: 'Dành cho người dùng cuối và có thể yêu cầu gói đăng ký trả phí.',
    available_plan: 'Gói khả dụng:',
    create_button: 'Tạo tenant',
    tenant_name_placeholder: 'Tenant của tôi',
    tenant_created: 'Đã tạo tenant thành công.',
    invitation_failed:
      'Một số lời mời gửi không thành công. Vui lòng thử lại sau tại Cài đặt -> Thành viên.',
    tenant_type_description: 'Không thể thay đổi sau khi tạo.',
    tenant_id_invalid:
      'ID tenant chỉ được chứa chữ thường, số và gạch nối, và không được vượt quá {{max}} ký tự.',
    tenant_id_placeholder: 'ID tenant của bạn',
    tenant_id_tip:
      'Tùy chỉnh ID tenant. Nếu để trống, sdvico sẽ tạo ID mặc định. Không thể thay đổi ID tenant sau khi tạo.',
  },
  dev_tenant_migration: {
    title: 'Bây giờ bạn có thể thử các tính năng Pro miễn phí bằng cách tạo "Tenant phát triển" mới!',
    affect_title: 'Điều này ảnh hưởng đến bạn như thế nào?',
    hint_1:
      'Chúng tôi đang thay thế các <strong>thẻ môi trường</strong> cũ bằng hai loại tenant mới: <strong>"Development"</strong> và <strong>"Production"</strong>.',
    hint_2:
      'Để đảm bảo chuyển đổi liền mạch và hoạt động không bị gián đoạn, tất cả tenant được tạo trước đây sẽ được nâng cấp lên loại tenant <strong>Production</strong> cùng với gói đăng ký trước đó của bạn.',
    hint_3: 'Đừng lo, mọi cài đặt khác của bạn sẽ được giữ nguyên.',
    about_tenant_type: 'Về loại tenant',
  },
  delete_modal: {
    title: 'Xóa tenant',
    description_line1:
      'Bạn có chắc muốn xóa tenant "<span>{{name}}</span>" với thẻ môi trường "<span>{{tag}}</span>"? Hành động này không thể hoàn tác, và sẽ dẫn đến việc xóa vĩnh viễn toàn bộ dữ liệu và thông tin tenant của bạn.',
    description_line2:
      'Trước khi xóa tenant, có thể chúng tôi có thể giúp bạn. <span><a>Liên hệ qua Email</a></span>',
    description_line3:
      'Nếu bạn muốn tiếp tục, vui lòng nhập tên tenant "<span>{{name}}</span>" để xác nhận.',
    delete_button: 'Xóa vĩnh viễn',
    cannot_delete_title: 'Không thể xóa tenant này',
    cannot_delete_description:
      'Rất tiếc, bạn không thể xóa tenant này ngay bây giờ. Vui lòng đảm bảo bạn đang dùng gói Miễn phí và đã thanh toán hết các hóa đơn còn nợ.',
  },
  leave_tenant_modal: {
    description: 'Bạn có chắc muốn rời khỏi tenant này?',
    leave_button: 'Rời khỏi',
  },
  tenant_landing_page: {
    title: 'Bạn chưa tạo tenant nào',
    description:
      'Để bắt đầu cấu hình dự án của bạn với sdvico, vui lòng tạo một tenant mới. Nếu bạn cần đăng xuất hoặc xóa tài khoản, chỉ cần nhấn vào nút ảnh đại diện ở góc trên bên phải.',
    create_tenant_button: 'Tạo tenant',
  },
  status: {
    mau_exceeded: 'Vượt MAU',
    token_exceeded: 'Vượt token',
    suspended: 'Đã tạm ngưng',
    overdue: 'Quá hạn',
  },
  tenant_suspended_page: {
    title: 'Tenant đã bị tạm ngưng. Liên hệ chúng tôi để khôi phục quyền truy cập.',
    description_1:
      'Chúng tôi rất tiếc phải thông báo rằng tài khoản tenant của bạn đã bị tạm ngưng do sử dụng sai quy định, bao gồm vượt giới hạn MAU, thanh toán quá hạn, hoặc các hành động không được phép khác.',
    description_2:
      'Nếu bạn cần thêm thông tin, có bất kỳ thắc mắc nào, hoặc muốn khôi phục toàn bộ chức năng và mở lại tenant của bạn, vui lòng liên hệ với chúng tôi ngay.',
  },
  production_tenant_notification: {
    text: 'Bạn đang ở tenant dev để thử nghiệm miễn phí. Hãy tạo một tenant production để vận hành thật.',
    action: 'Tạo tenant',
  },
};

export default Object.freeze(tenants);
