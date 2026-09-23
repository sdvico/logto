const roles = {
  page_title: 'Vai trò',
  title: 'Vai trò',
  subtitle:
    'Vai trò bao gồm các quyền quyết định người dùng có thể làm gì. RBAC dùng vai trò để cấp cho người dùng quyền truy cập vào tài nguyên cho các hành động cụ thể.',
  create: 'Tạo vai trò',
  role_name: 'Tên vai trò',
  role_type: 'Loại vai trò',
  type_user: 'Người dùng',
  type_machine_to_machine: 'Máy-đến-máy',
  role_description: 'Mô tả',
  role_name_placeholder: 'Nhập tên vai trò của bạn',
  role_description_placeholder: 'Nhập mô tả vai trò của bạn',
  col_roles: 'Vai trò',
  col_type: 'Loại',
  col_description: 'Mô tả',
  col_assigned_entities: 'Đã gán',
  user_counts: '{{count}} người dùng',
  application_counts: '{{count}} ứng dụng',
  user_count: '{{count}} người dùng',
  application_count: '{{count}} ứng dụng',
  assign_permissions: 'Gán quyền',
  create_role_title: 'Tạo vai trò',
  create_role_description: 'Dùng vai trò để tổ chức quyền và gán chúng cho người dùng.',
  create_role_button: 'Tạo vai trò',
  role_created: 'Vai trò {{name}} đã được tạo thành công.',
  search: 'Tìm theo tên vai trò, mô tả hoặc ID',
  placeholder_title: 'Vai trò',
  placeholder_description:
    'Vai trò là một nhóm các quyền có thể được gán cho người dùng. Hãy thêm quyền trước khi tạo vai trò.',
  assign_roles: 'Gán vai trò',
  management_api_access_notification:
    'Để truy cập Management API của sdvico, hãy chọn vai trò có quyền Management API <flag/>.',
  with_management_api_access_tip:
    'Vai trò máy-đến-máy này bao gồm quyền Management API của sdvico',
  role_creation_hint: 'Không tìm thấy vai trò phù hợp? <a>Tạo vai trò</a>',
};

export default Object.freeze(roles);
