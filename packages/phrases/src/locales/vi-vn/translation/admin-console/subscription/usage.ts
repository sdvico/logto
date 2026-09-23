const usage = {
  status_active: 'Đang sử dụng',
  status_inactive: 'Không sử dụng',
  limited_status_quota_description: '(Bao gồm {{quota}} đầu tiên)',
  unlimited_status_quota_description: '(Đã bao gồm)',
  disabled_status_quota_description: '(Không bao gồm)',
  usage_description_with_unlimited_quota: '{{usage}}<span> (Không giới hạn)</span>',
  usage_description_with_limited_quota: '{{usage}}<span> (Bao gồm {{basicQuota}} đầu tiên)</span>',
  usage_description_without_quota: '{{usage}}<span> (Không bao gồm)</span>',
  mau: {
    title: 'MAU',
    tooltip:
      'MAU là người dùng duy nhất đã trao đổi ít nhất một token với sdvico trong một kỳ thanh toán. Không giới hạn với gói Pro. <a>Tìm hiểu thêm</a>',
    tooltip_for_enterprise:
      'MAU là người dùng duy nhất đã trao đổi ít nhất một token với sdvico trong một kỳ thanh toán. Không giới hạn với gói Doanh nghiệp.',
  },
  organizations: {
    title: 'Tổ chức',
    tooltip:
      'Tính năng bổ sung với mức giá cố định ${{price, number}} mỗi tháng. Giá không phụ thuộc vào số lượng tổ chức hoặc mức độ hoạt động của chúng.',
    description_for_enterprise: '(Đã bao gồm)',
    tooltip_for_enterprise:
      'Việc bao gồm phụ thuộc vào gói của bạn. Nếu tính năng tổ chức không có trong hợp đồng ban đầu, nó sẽ được thêm vào hóa đơn khi bạn kích hoạt. Tiện ích thêm này có giá ${{price, number}}/tháng, không phụ thuộc vào số lượng tổ chức hoặc mức độ hoạt động.',
    tooltip_for_enterprise_with_numbered_basic_quota:
      'Gói của bạn bao gồm {{basicQuota}} tổ chức đầu tiên miễn phí. Nếu cần thêm, bạn có thể thêm bằng tiện ích tổ chức với mức giá cố định ${{price, number}} mỗi tháng, không phụ thuộc vào số lượng tổ chức hoặc mức độ hoạt động.',
  },
  mfa: {
    title: 'MFA',
    tooltip:
      'Tính năng bổ sung với mức giá cố định ${{price, number}} mỗi tháng. Giá không phụ thuộc vào số lượng yếu tố xác thực được sử dụng.',
    tooltip_for_enterprise:
      'Việc bao gồm phụ thuộc vào gói của bạn. Nếu tính năng MFA không có trong hợp đồng ban đầu, nó sẽ được thêm vào hóa đơn khi bạn kích hoạt. Tiện ích thêm này có giá ${{price, number}}/tháng, không phụ thuộc vào số lượng yếu tố xác thực được sử dụng.',
  },
  enterprise_sso: {
    title: 'SSO doanh nghiệp',
    tooltip: 'Tính năng bổ sung với giá ${{price, number}} cho mỗi kết nối SSO mỗi tháng.',
    tooltip_for_enterprise:
      'Tính năng bổ sung với giá ${{price, number}} cho mỗi kết nối SSO mỗi tháng. {{basicQuota}} kết nối SSO đầu tiên được bao gồm và miễn phí trong gói theo hợp đồng của bạn.',
  },
  api_resources: {
    title: 'Tài nguyên API',
    tooltip:
      'Tính năng bổ sung với giá ${{price, number}} cho mỗi tài nguyên mỗi tháng. 3 tài nguyên API đầu tiên miễn phí.',
    tooltip_for_enterprise:
      '{{basicQuota}} tài nguyên API đầu tiên được bao gồm và miễn phí trong gói theo hợp đồng của bạn. Nếu cần thêm, ${{price, number}} cho mỗi tài nguyên API mỗi tháng.',
  },
  machine_to_machine: {
    title: 'Máy tới máy',
    tooltip:
      'Tính năng bổ sung với giá ${{price, number}} cho mỗi ứng dụng mỗi tháng. Ứng dụng máy tới máy đầu tiên miễn phí.',
    tooltip_for_enterprise:
      'Ứng dụng máy tới máy đầu tiên miễn phí trong gói theo hợp đồng của bạn. Nếu cần thêm, ${{price, number}} cho mỗi ứng dụng mỗi tháng.',
  },
  tenant_members: {
    title: 'Thành viên tenant',
    tooltip:
      'Tính năng bổ sung với giá ${{price, number}} cho mỗi thành viên mỗi tháng. {{count}} thành viên tenant đầu tiên miễn phí.',
    tooltip_one:
      'Tính năng bổ sung với giá ${{price, number}} cho mỗi thành viên mỗi tháng. {{count}} thành viên tenant đầu tiên miễn phí.',
    tooltip_other:
      'Tính năng bổ sung với giá ${{price, number}} cho mỗi thành viên mỗi tháng. {{count}} thành viên tenant đầu tiên miễn phí.',
    tooltip_for_enterprise:
      '{{count}} thành viên tenant đầu tiên được bao gồm và miễn phí trong gói theo hợp đồng của bạn. Nếu cần thêm, ${{price, number}} cho mỗi thành viên tenant mỗi tháng.',
  },
  custom_domains: {
    title: 'Domain tùy chỉnh',
    tooltip:
      'Tính năng bổ sung với giá ${{price, number}} cho tối đa 10 domain tùy chỉnh mỗi tháng. 1 domain tùy chỉnh đầu tiên miễn phí.',
  },
  tokens: {
    title: 'Token',
    tooltip:
      'Tính năng bổ sung với giá ${{price, number}} cho mỗi {{tokenLimit}} token. {{basicQuota}} token đầu tiên được bao gồm.',
    tooltip_for_enterprise:
      '{{basicQuota}} token đầu tiên được bao gồm và miễn phí trong gói theo hợp đồng của bạn. Nếu cần thêm, ${{price, number}} cho mỗi {{tokenLimit}} token mỗi tháng.',
  },
  m2mTokens: {
    title: 'Token M2M',
  },
  hooks: {
    title: 'Hook',
    tooltip:
      'Tính năng bổ sung với giá ${{price, number}} cho mỗi hook. 10 hook đầu tiên được bao gồm.',
    tooltip_for_enterprise:
      '{{basicQuota}} hook đầu tiên được bao gồm và miễn phí trong gói theo hợp đồng của bạn. Nếu cần thêm, ${{price, number}} cho mỗi hook mỗi tháng.',
  },
  security_features: {
    title: 'Bảo mật nâng cao',
    tooltip:
      'Tính năng bổ sung với giá ${{price, number}}/tháng cho toàn bộ gói bảo mật nâng cao, bao gồm CAPTCHA, khóa định danh, danh sách chặn email, và nhiều hơn nữa.',
  },
  saml_applications: {
    title: 'Ứng dụng SAML',
    tooltip: 'Tính năng bổ sung với giá ${{price, number}} cho mỗi ứng dụng SAML mỗi tháng. ',
  },
  third_party_applications: {
    title: 'Ứng dụng bên thứ ba',
    tooltip: 'Tính năng bổ sung với giá ${{price, number}} cho mỗi ứng dụng mỗi tháng.',
  },
  rbacEnabled: {
    title: 'Vai trò',
    tooltip:
      'Tính năng bổ sung với mức giá cố định ${{price, number}} mỗi tháng. Giá không phụ thuộc vào số lượng vai trò toàn cục.',
  },
  pricing: {
    add_on_changes_in_current_cycle_notice:
      'Nếu bạn thực hiện bất kỳ thay đổi nào trong kỳ thanh toán hiện tại, hóa đơn kế tiếp của bạn có thể cao hơn một chút cho tháng đầu tiên sau thay đổi. Hóa đơn đó sẽ gồm ${{price, number}} giá cơ bản cộng chi phí tiện ích thêm cho phần sử dụng chưa tính trong kỳ hiện tại và toàn bộ chi phí cho kỳ tiếp theo. <a>Tìm hiểu thêm</a>',
  },
};

export default Object.freeze(usage);
