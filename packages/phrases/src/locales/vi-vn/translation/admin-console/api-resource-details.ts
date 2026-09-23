const api_resource_details = {
  page_title: 'Chi tiết API resource',
  back_to_api_resources: 'Về API resources',
  general_tab: 'Chung',
  permissions_tab: 'Quyền',
  settings: 'Cài đặt',
  settings_description:
    'API resource, còn gọi là Resource Indicator, chỉ ra dịch vụ hoặc tài nguyên đích được yêu cầu, thường là một biến định dạng URI đại diện cho danh tính của tài nguyên đó.',
  management_api_settings_description:
    'sdvico Management API là tập hợp đầy đủ các API cho phép quản trị viên quản lý nhiều nghiệp vụ liên quan đến danh tính, áp dụng chính sách bảo mật, và tuân thủ các quy định, tiêu chuẩn.',
  management_api_notice:
    'API này đại diện cho thực thể của sdvico và không thể sửa hoặc xóa. Hãy tạo một ứng dụng machine-to-machine để gọi sdvico Management API. <a>Tìm hiểu thêm</a>',
  token_expiration_time_in_seconds: 'Thời gian hết hạn token (giây)',
  token_expiration_time_in_seconds_placeholder: 'Nhập thời gian hết hạn token',
  delete_description:
    'Hành động này không thể hoàn tác. Nó sẽ xóa vĩnh viễn API resource này. Vui lòng nhập tên API resource <span>{{name}}</span> để xác nhận.',
  enter_your_api_resource_name: 'Nhập tên API resource của bạn',
  api_resource_deleted: 'Đã xóa thành công API resource {{name}}',
  permission: {
    create_button: 'Tạo quyền',
    create_title: 'Tạo quyền',
    create_subtitle: 'Định nghĩa các quyền (scope) mà API này cần.',
    confirm_create: 'Tạo quyền',
    edit_title: 'Sửa quyền API',
    edit_subtitle: 'Định nghĩa các quyền (scope) mà API {{resourceName}} cần.',
    name: 'Tên quyền',
    name_placeholder: 'read:resource',
    forbidden_space_in_name: 'Tên quyền không được chứa khoảng trắng.',
    description: 'Mô tả',
    description_placeholder: 'Có thể đọc các resource',
    permission_created: 'Đã tạo thành công quyền {{name}}',
    delete_description:
      'Nếu quyền này bị xóa, người dùng đang có quyền này sẽ mất quyền truy cập được cấp bởi nó.',
    deleted: 'Đã xóa thành công quyền "{{name}}".',
  },
};

export default Object.freeze(api_resource_details);
