const organization_details = {
  page_title: 'Chi tiết tổ chức',
  delete_confirmation:
    'Sau khi xóa, tất cả thành viên sẽ mất quyền thành viên và vai trò trong tổ chức này. Hành động này không thể hoàn tác.',
  organization_id: 'ID tổ chức',
  settings_description:
    'Tổ chức đại diện cho các nhóm, khách hàng doanh nghiệp và công ty đối tác có thể truy cập vào ứng dụng của bạn.',
  name_placeholder: 'Tên của tổ chức, không yêu cầu phải là duy nhất.',
  description_placeholder: 'Mô tả về tổ chức.',
  member: 'Thành viên',
  member_other: 'Thành viên',
  add_members_to_organization: 'Thêm thành viên vào tổ chức {{name}}',
  add_members_to_organization_description:
    'Tìm người dùng phù hợp bằng cách tìm theo tên, email, số điện thoại hoặc ID người dùng. Các thành viên hiện có sẽ không hiển thị trong kết quả tìm kiếm.',
  add_with_organization_role: 'Thêm kèm vai trò tổ chức',
  user: 'Người dùng',
  application: 'Ứng dụng',
  application_other: 'Ứng dụng',
  add_applications_to_organization: 'Thêm ứng dụng vào tổ chức {{name}}',
  add_applications_to_organization_description:
    'Tìm ứng dụng phù hợp bằng cách tìm theo ID ứng dụng, tên hoặc mô tả. Các ứng dụng hiện có sẽ không hiển thị trong kết quả tìm kiếm.',
  at_least_one_application: 'Cần ít nhất một ứng dụng.',
  remove_application_from_organization: 'Xóa ứng dụng khỏi tổ chức',
  remove_application_from_organization_description:
    'Sau khi xóa, ứng dụng sẽ mất liên kết và vai trò trong tổ chức này. Hành động này không thể hoàn tác.',
  search_application_placeholder: 'Tìm theo ID ứng dụng, tên hoặc mô tả',
  roles: 'Vai trò tổ chức',
  authorize_to_roles: 'Cấp quyền cho {{name}} truy cập các vai trò sau:',
  edit_organization_roles: 'Chỉnh sửa vai trò tổ chức',
  edit_organization_roles_title: 'Chỉnh sửa vai trò tổ chức của {{name}}',
  remove_user_from_organization: 'Xóa người dùng khỏi tổ chức',
  remove_user_from_organization_description:
    'Sau khi xóa, người dùng sẽ mất quyền thành viên và vai trò trong tổ chức này. Hành động này không thể hoàn tác.',
  search_user_placeholder: 'Tìm theo tên, email, số điện thoại hoặc ID người dùng',
  at_least_one_user: 'Cần ít nhất một người dùng.',
  organization_roles_tooltip: 'Các vai trò được gán cho {{type}} trong tổ chức này.',
  custom_data: 'Dữ liệu tùy chỉnh',
  custom_data_tip:
    'Dữ liệu tùy chỉnh là một đối tượng JSON có thể dùng để lưu thêm dữ liệu liên quan đến tổ chức.',
  invalid_json_object: 'Đối tượng JSON không hợp lệ.',
  branding: {
    name: 'nhận diện thương hiệu',
    description: 'Tùy chỉnh trải nghiệm đăng nhập theo cấp tổ chức của bạn.',
    organization_level_sie: 'Trải nghiệm đăng nhập theo cấp tổ chức',
    organization_level_sie_switch:
      'Bật trải nghiệm đăng nhập theo cấp tổ chức và thiết lập nhận diện thương hiệu riêng cho tổ chức. Nếu tắt, hệ thống sẽ ưu tiên dùng trải nghiệm đăng nhập theo cấp ứng dụng, sau đó là trải nghiệm đăng nhập chung.',
    logo: 'Logo tổ chức',
    logo_tooltip:
      'Bạn có thể truyền ID tổ chức để hiển thị logo này trong trải nghiệm đăng nhập; cần có phiên bản logo tối nếu chế độ tối được bật trong cài đặt trải nghiệm đăng nhập chung. <a>Tìm hiểu thêm</a>',
  },
  jit: {
    title: 'Cấp quyền theo thời gian thực (Just-in-time)',
    description:
      'Người dùng có thể tự động tham gia tổ chức và được gán vai trò ngay lần đăng nhập đầu tiên thông qua một số phương thức xác thực. Bạn có thể thiết lập các điều kiện cần đáp ứng để cấp quyền theo thời gian thực.',
    email_domain: 'Cấp quyền theo miền email',
    email_domain_description:
      'Người dùng mới đăng ký bằng địa chỉ email đã xác minh hoặc thông qua đăng nhập xã hội với email đã xác minh sẽ tự động tham gia tổ chức. <a>Tìm hiểu thêm</a>',
    email_domain_placeholder: 'Nhập miền email để cấp quyền theo thời gian thực',
    invalid_domain: 'Miền không hợp lệ',
    domain_already_added: 'Miền đã được thêm',
    sso_enabled_domain_warning:
      'Bạn đã nhập một hoặc nhiều miền email liên kết với SSO doanh nghiệp. Người dùng có các email này sẽ theo luồng SSO tiêu chuẩn và sẽ không được cấp quyền vào tổ chức này trừ khi cấu hình cấp quyền SSO doanh nghiệp.',
    enterprise_sso: 'Cấp quyền SSO doanh nghiệp',
    no_enterprise_connector_set:
      'Bạn chưa thiết lập bộ kết nối SSO doanh nghiệp nào. Hãy thêm bộ kết nối trước để bật cấp quyền SSO doanh nghiệp. <a>Thiết lập</a>',
    add_enterprise_connector: 'Thêm bộ kết nối doanh nghiệp',
    enterprise_sso_description:
      'Người dùng mới hoặc người dùng hiện có đăng nhập lần đầu qua SSO doanh nghiệp sẽ tự động tham gia tổ chức.  <a>Tìm hiểu thêm</a>',
    organization_roles: 'Vai trò tổ chức mặc định',
    organization_roles_description:
      'Gán vai trò cho người dùng khi họ tham gia tổ chức thông qua cấp quyền theo thời gian thực.',
  },
  mfa: {
    title: 'Xác thực đa yếu tố (MFA)',
    tip: 'Khi yêu cầu MFA, người dùng chưa cấu hình MFA sẽ bị từ chối khi thử đổi mã token tổ chức. Cài đặt này không ảnh hưởng đến việc xác thực người dùng.',
    description: 'Yêu cầu người dùng cấu hình xác thực đa yếu tố để truy cập tổ chức này.',
    no_mfa_warning:
      'Chưa có phương thức xác thực đa yếu tố nào được bật cho tenant của bạn. Người dùng sẽ không thể truy cập tổ chức này cho đến khi ít nhất một <a>phương thức xác thực đa yếu tố</a> được bật.',
  },
};

export default Object.freeze(organization_details);
