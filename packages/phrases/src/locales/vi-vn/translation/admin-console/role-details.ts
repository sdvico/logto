const role_details = {
  back_to_roles: 'Quay lại vai trò',
  identifier: 'Định danh',
  delete_description:
    'Hành động này sẽ xóa các quyền liên quan đến vai trò này khỏi những người dùng bị ảnh hưởng và xóa liên kết giữa vai trò, người dùng và quyền.',
  role_deleted: '{{name}} đã được xóa thành công.',
  general_tab: 'Chung',
  users_tab: 'Người dùng',
  m2m_apps_tab: 'Ứng dụng máy-đến-máy',
  permissions_tab: 'Quyền',
  settings: 'Cài đặt',
  settings_description:
    'Vai trò là một nhóm các quyền có thể được gán cho người dùng. Vai trò còn giúp tổng hợp các quyền được định nghĩa cho nhiều API khác nhau, giúp việc thêm, xóa hoặc điều chỉnh quyền hiệu quả hơn so với gán từng quyền riêng lẻ cho người dùng.',
  field_name: 'Tên',
  field_description: 'Mô tả',
  field_is_default: 'Vai trò mặc định',
  field_is_default_description:
    'Đặt vai trò này làm vai trò mặc định cho người dùng mới. Có thể đặt nhiều vai trò mặc định. Điều này cũng ảnh hưởng đến vai trò mặc định cho người dùng được tạo qua Management API.',
  type_m2m_role_tag: 'Máy-đến-máy',
  type_user_role_tag: 'Người dùng',
  m2m_role_notification:
    'Gán vai trò máy-đến-máy này cho một ứng dụng máy-đến-máy để cấp quyền truy cập vào các tài nguyên API liên quan. <a>Tạo ứng dụng máy-đến-máy</a> trước nếu bạn chưa có.',
  permission: {
    assign_button: 'Gán quyền',
    assign_title: 'Gán quyền',
    assign_subtitle:
      'Gán quyền cho vai trò này. Vai trò sẽ có thêm quyền được gán, và người dùng có vai trò này sẽ kế thừa các quyền đó.',
    assign_form_field: 'Gán quyền',
    added_text: '{{count, number}} quyền đã được thêm',
    added_text_other: '{{count, number}} quyền đã được thêm',
    api_permission_count: '{{count, number}} quyền',
    api_permission_count_other: '{{count, number}} quyền',
    confirm_assign: 'Gán quyền',
    permission_assigned: 'Các quyền đã chọn đã được gán thành công cho vai trò này',
    deletion_description:
      'Nếu xóa quyền này, người dùng bị ảnh hưởng có vai trò này sẽ mất quyền truy cập được cấp bởi quyền này.',
    permission_deleted: 'Quyền "{{name}}" đã được xóa thành công khỏi vai trò này',
    empty: 'Không có quyền nào',
  },
  users: {
    assign_button: 'Gán người dùng',
    name_column: 'Người dùng',
    app_column: 'Ứng dụng',
    latest_sign_in_column: 'Đăng nhập gần nhất',
    delete_description:
      'Người dùng sẽ vẫn còn trong nhóm người dùng của bạn nhưng mất quyền ủy quyền cho vai trò này.',
    deleted: '{{name}} đã được xóa khỏi vai trò này',
    assign_title: 'Gán người dùng vào {{name}}',
    assign_subtitle: 'Tìm người dùng phù hợp bằng cách tìm theo tên, email, số điện thoại hoặc ID người dùng.',
    assign_field: 'Gán người dùng',
    confirm_assign: 'Gán người dùng',
    assigned_toast_text: 'Các người dùng đã chọn đã được gán thành công vào vai trò này',
    empty: 'Không có người dùng nào',
  },
  applications: {
    assign_button: 'Gán ứng dụng máy-đến-máy',
    name_column: 'Ứng dụng',
    app_column: 'Ứng dụng máy-đến-máy',
    description_column: 'Mô tả',
    delete_description:
      'Ứng dụng sẽ vẫn còn trong nhóm ứng dụng của bạn nhưng mất quyền ủy quyền cho vai trò này.',
    deleted: '{{name}} đã được xóa khỏi vai trò này',
    assign_title: 'Gán ứng dụng máy-đến-máy vào {{name}}',
    assign_subtitle:
      'Tìm ứng dụng máy-đến-máy phù hợp bằng cách tìm theo tên, mô tả hoặc ID ứng dụng.',
    assign_field: 'Gán ứng dụng máy-đến-máy',
    confirm_assign: 'Gán ứng dụng máy-đến-máy',
    assigned_toast_text: 'Các ứng dụng đã chọn đã được gán thành công vào vai trò này',
    empty: 'Không có ứng dụng nào',
  },
};

export default Object.freeze(role_details);
