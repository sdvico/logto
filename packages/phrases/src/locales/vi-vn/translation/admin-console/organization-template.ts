const organization_template = {
  title: 'Mẫu tổ chức',
  subtitle:
    'Trong các ứng dụng SaaS đa tenant, mẫu tổ chức định nghĩa chính sách kiểm soát truy cập chung (quyền và vai trò) cho nhiều tổ chức.',
  roles: {
    tab_name: 'Vai trò tổ chức',
    search_placeholder: 'Tìm theo tên vai trò',
    create_title: 'Tạo vai trò tổ chức',
    role_column: 'Vai trò tổ chức',
    permissions_column: 'Quyền',
    placeholder_title: 'Vai trò tổ chức',
    placeholder_description:
      'Vai trò tổ chức là một nhóm các quyền có thể được gán cho người dùng. Các quyền này phải đến từ quyền tổ chức được định nghĩa sẵn.',
    create_modal: {
      title: 'Tạo vai trò tổ chức',
      create: 'Tạo vai trò',
      name: 'Tên vai trò',
      description: 'Mô tả',
      type: 'Loại vai trò',
      created: 'Vai trò tổ chức {{name}} đã được tạo thành công.',
    },
  },
  permissions: {
    tab_name: 'Quyền tổ chức',
    search_placeholder: 'Tìm theo tên quyền',
    create_org_permission: 'Tạo quyền tổ chức',
    permission_column: 'Quyền tổ chức',
    description_column: 'Mô tả',
    placeholder_title: 'Quyền tổ chức',
    placeholder_description:
      'Quyền tổ chức là quyền được phép truy cập tài nguyên trong phạm vi của tổ chức.',
    delete_confirm:
      'Nếu xóa quyền này, mọi vai trò tổ chức có chứa quyền này sẽ mất quyền đó, và người dùng đang có quyền này sẽ mất quyền truy cập được cấp bởi nó.',
    create_title: 'Tạo quyền tổ chức',
    edit_title: 'Chỉnh sửa quyền tổ chức',
    permission_field_name: 'Tên quyền',
    description_field_name: 'Mô tả',
    description_field_placeholder: 'Xem lịch sử lịch hẹn',
    create_permission: 'Tạo quyền',
    created: 'Quyền tổ chức {{name}} đã được tạo thành công.',
  },
};

export default Object.freeze(organization_template);
