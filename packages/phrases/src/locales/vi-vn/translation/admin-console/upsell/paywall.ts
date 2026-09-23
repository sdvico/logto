const paywall = {
  applications:
    'Đã đạt giới hạn {{count, number}} ứng dụng của <planName/>. Nâng cấp gói để đáp ứng nhu cầu của nhóm bạn. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  applications_other:
    'Đã đạt giới hạn {{count, number}} ứng dụng của <planName/>. Nâng cấp gói để đáp ứng nhu cầu của nhóm bạn. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  machine_to_machine_feature:
    'Chuyển sang gói <strong>Pro</strong> để có thêm ứng dụng machine-to-machine và hưởng mọi tính năng cao cấp. <a>Liên hệ với chúng tôi</a> nếu bạn có thắc mắc.',
  machine_to_machine:
    'Đã đạt giới hạn {{count, number}} ứng dụng machine-to-machine của <planName/>. Nâng cấp gói để đáp ứng nhu cầu của nhóm bạn. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  machine_to_machine_other:
    'Đã đạt giới hạn {{count, number}} ứng dụng machine-to-machine của <planName/>. Nâng cấp gói để đáp ứng nhu cầu của nhóm bạn. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  resources:
    'Đã đạt giới hạn {{count, number}} tài nguyên API của <planName/>. Nâng cấp gói để đáp ứng nhu cầu của nhóm bạn. <a>Liên hệ với chúng tôi</a> nếu cần hỗ trợ.',
  resources_other:
    'Đã đạt giới hạn {{count, number}} tài nguyên API của <planName/>. Nâng cấp gói để đáp ứng nhu cầu của nhóm bạn. <a>Liên hệ với chúng tôi</a> nếu cần hỗ trợ.',
  scopes_per_resource:
    'Đã đạt giới hạn {{count, number}} quyền mỗi tài nguyên API của <planName/>. Nâng cấp ngay để mở rộng. <a>Liên hệ với chúng tôi</a> nếu cần hỗ trợ.',
  scopes_per_resource_other:
    'Đã đạt giới hạn {{count, number}} quyền mỗi tài nguyên API của <planName/>. Nâng cấp ngay để mở rộng. <a>Liên hệ với chúng tôi</a> nếu cần hỗ trợ.',
  custom_domain:
    'Đã đạt giới hạn {{count, number}} miền tùy chỉnh của <planName/>. Nâng cấp lên gói trả phí để thêm nhiều miền tùy chỉnh và các quyền lợi cao cấp. Đừng ngần ngại <a>liên hệ với chúng tôi</a> nếu bạn có thắc mắc.',
  custom_domain_others:
    'Đã đạt giới hạn {{count, number}} miền tùy chỉnh của <planName/>. Nâng cấp lên gói trả phí để thêm nhiều miền tùy chỉnh và các quyền lợi cao cấp. Đừng ngần ngại <a>liên hệ với chúng tôi</a> nếu bạn có thắc mắc.',
  social_connectors:
    'Đã đạt giới hạn {{count, number}} connector mạng xã hội của <planName/>. Để đáp ứng nhu cầu của nhóm bạn, hãy nâng cấp gói để có thêm connector mạng xã hội và khả năng tạo connector riêng bằng OIDC, OAuth 2.0 và SAML. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  social_connectors_other:
    'Đã đạt giới hạn {{count, number}} connector mạng xã hội của <planName/>. Để đáp ứng nhu cầu của nhóm bạn, hãy nâng cấp gói để có thêm connector mạng xã hội và khả năng tạo connector riêng bằng OIDC, OAuth 2.0 và SAML. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  standard_connectors_feature:
    'Nâng cấp lên gói <strong>Hobby</strong> hoặc <strong>Pro</strong> để tạo connector riêng bằng OIDC, OAuth 2.0 và SAML, cùng với connector mạng xã hội không giới hạn và mọi tính năng cao cấp. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  standard_connectors:
    'Đã đạt giới hạn {{count, number}} connector mạng xã hội của <planName/>. Để đáp ứng nhu cầu của nhóm bạn, hãy nâng cấp gói để có thêm connector mạng xã hội và khả năng tạo connector riêng bằng OIDC, OAuth 2.0 và SAML. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  standard_connectors_other:
    'Đã đạt giới hạn {{count, number}} connector mạng xã hội của <planName/>. Để đáp ứng nhu cầu của nhóm bạn, hãy nâng cấp gói để có thêm connector mạng xã hội và khả năng tạo connector riêng bằng OIDC, OAuth 2.0 và SAML. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  standard_connectors_pro:
    'Đã đạt giới hạn {{count, number}} connector chuẩn của <planName/>. Để đáp ứng nhu cầu của nhóm bạn, hãy nâng cấp lên gói Enterprise để có thêm connector mạng xã hội và khả năng tạo connector riêng bằng OIDC, OAuth 2.0 và SAML. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  standard_connectors_pro_other:
    'Đã đạt giới hạn {{count, number}} connector chuẩn của <planName/>. Để đáp ứng nhu cầu của nhóm bạn, hãy nâng cấp lên gói Enterprise để có thêm connector mạng xã hội và khả năng tạo connector riêng bằng OIDC, OAuth 2.0 và SAML. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  roles:
    'Nâng cấp gói để thêm vai trò và quyền bổ sung. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  scopes_per_role:
    'Đã đạt giới hạn {{count, number}} quyền mỗi vai trò của <planName/>. Nâng cấp gói để thêm vai trò và quyền bổ sung. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  scopes_per_role_other:
    'Đã đạt giới hạn {{count, number}} quyền mỗi vai trò của <planName/>. Nâng cấp gói để thêm vai trò và quyền bổ sung. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  saml_applications_oss:
    'Ứng dụng SAML bổ sung chỉ có ở gói sdvico Enterprise. Liên hệ với chúng tôi nếu bạn cần hỗ trợ.',
  saml_applications_oss_limit_notice:
    'Bản mã nguồn mở của bạn hỗ trợ tối đa {{limit}} ứng dụng SAML. Bạn có thể dùng sdvico Cloud hoặc liên hệ với chúng tôi để có thêm lựa chọn khác.',
  logto_pricing_button_text: 'Bảng giá sdvico Cloud',
  saml_applications:
    'Ứng dụng SAML bổ sung chỉ có ở gói sdvico Enterprise. Liên hệ với chúng tôi nếu bạn cần hỗ trợ.',
  saml_applications_add_on:
    'Mở khóa tính năng ứng dụng SAML bằng cách nâng cấp lên gói trả phí. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  hooks:
    'Đã đạt giới hạn {{count, number}} webhook của <planName/>. Nâng cấp gói để tạo thêm webhook. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  hooks_other:
    'Đã đạt giới hạn {{count, number}} webhook của <planName/>. Nâng cấp gói để tạo thêm webhook. Hãy <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  mfa: 'Mở khóa MFA để tăng cường bảo mật xác thực bằng cách nâng cấp lên gói trả phí. Đừng ngần ngại <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  organizations:
    'Mở khóa organization bằng cách nâng cấp lên gói trả phí. Đừng ngần ngại <a>liên hệ với chúng tôi</a> nếu bạn cần hỗ trợ.',
  third_party_apps:
    'Mở khóa sdvico làm IdP cho ứng dụng bên thứ ba bằng cách nâng cấp lên gói trả phí. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  sso_connectors:
    'Mở khóa enterprise sso bằng cách nâng cấp lên gói trả phí. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  tenant_members:
    'Mở khóa tính năng cộng tác bằng cách nâng cấp lên gói trả phí. Nếu cần hỗ trợ, hãy <a>liên hệ với chúng tôi</a>.',
  tenant_members_dev_plan:
    'Bạn đã đạt giới hạn {{limit}} thành viên. Hãy xóa một thành viên hoặc hủy lời mời đang chờ để thêm người mới. Cần thêm chỗ? Hãy liên hệ với chúng tôi.',
  custom_jwt: {
    title: 'Thêm claim tùy chỉnh',
    description:
      'Nâng cấp lên gói trả phí để dùng chức năng JWT tùy chỉnh và các quyền lợi cao cấp. Đừng ngần ngại <a>liên hệ với chúng tôi</a> nếu bạn có thắc mắc.',
  },
  branding_customization:
    'Mở khóa toàn quyền kiểm soát nhận diện thương hiệu với tính năng "Ẩn thương hiệu sdvico" và "Dùng giao diện của riêng bạn" bằng cách nâng cấp gói.',
  bring_your_ui:
    'Nâng cấp lên gói trả phí để dùng chức năng mang giao diện tùy chỉnh của riêng bạn và các quyền lợi cao cấp.',
  security_features:
    'Mở khóa các tính năng bảo mật nâng cao bằng cách nâng cấp lên gói Pro. Đừng ngần ngại <a>liên hệ với chúng tôi</a> nếu bạn có thắc mắc.',
  collect_user_profile:
    'Nâng cấp lên gói trả phí để thu thập thêm thông tin hồ sơ người dùng trong quá trình đăng ký. Đừng ngần ngại <a>liên hệ với chúng tôi</a> nếu bạn có thắc mắc.',
  passkey_sign_in:
    'Nâng cấp lên gói trả phí để dùng chức năng đăng nhập bằng passkey và các quyền lợi cao cấp. Đừng ngần ngại <a>liên hệ với chúng tôi</a> nếu bạn có thắc mắc.',
};

export default Object.freeze(paywall);
