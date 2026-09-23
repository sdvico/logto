const guard = {
  invalid_input: 'Yêu cầu {{type}} không hợp lệ.',
  invalid_pagination: 'Giá trị phân trang của yêu cầu không hợp lệ.',
  can_not_get_tenant_id: 'Không thể lấy tenant id từ yêu cầu.',
  file_size_exceeded: 'Kích thước tệp vượt quá giới hạn cho phép.',
  mime_type_not_allowed: 'Loại MIME không được phép.',
  not_allowed_for_admin_tenant: 'Không được phép thực hiện với admin tenant.',
};

export default Object.freeze(guard);
