const organization_role_details = {
  page_title: 'Chi tiết vai trò tổ chức',
  back_to_org_roles: 'Quay lại vai trò tổ chức',
  delete_confirm:
    'Hành động này sẽ xóa các quyền liên quan đến vai trò này khỏi những người dùng bị ảnh hưởng và xóa các liên kết giữa vai trò tổ chức, thành viên trong tổ chức và quyền tổ chức.',
  deleted: 'Vai trò tổ chức {{name}} đã được xóa thành công.',
  permissions: {
    tab: 'Quyền',
    name_column: 'Quyền',
    description_column: 'Mô tả',
    type_column: 'Loại quyền',
    type: {
      api: 'Quyền API',
      org: 'Quyền tổ chức',
    },
    assign_permissions: 'Gán quyền',
    remove_permission: 'Xóa quyền',
    remove_confirmation:
      'Nếu xóa quyền này, người dùng có vai trò tổ chức này sẽ mất quyền truy cập được cấp bởi quyền này.',
    removed: 'Quyền {{name}} đã được xóa thành công khỏi vai trò tổ chức này',
    assign_description:
      'Gán quyền cho các vai trò trong tổ chức này. Quyền có thể bao gồm cả quyền tổ chức và quyền API.',
    organization_permissions: 'Quyền tổ chức',
    api_permissions: 'Quyền API',
    assign_organization_permissions: 'Gán quyền tổ chức',
    assign_api_permissions: 'Gán quyền API',
  },
  general: {
    tab: 'Chung',
    settings: 'Cài đặt',
    description:
      'Vai trò tổ chức là một nhóm các quyền có thể được gán cho người dùng. Các quyền này có thể đến từ quyền tổ chức được định nghĩa sẵn và quyền API.',
    name_field: 'Tên',
    description_field: 'Mô tả',
    description_field_placeholder: 'Người dùng có quyền chỉ xem',
  },
};

export default Object.freeze(organization_role_details);
