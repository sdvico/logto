const auth = {
  authorization_header_missing: 'Thiếu header Authorization.',
  authorization_token_type_not_supported: 'Loại authorization không được hỗ trợ.',
  unauthorized: 'Chưa được ủy quyền. Vui lòng kiểm tra thông tin đăng nhập và phạm vi truy cập.',
  forbidden: 'Không có quyền truy cập. Vui lòng kiểm tra vai trò và quyền của bạn.',
  expected_role_not_found: 'Không tìm thấy vai trò yêu cầu. Vui lòng kiểm tra vai trò và quyền của bạn.',
  jwt_sub_missing: 'Thiếu trường `sub` trong JWT.',
  require_re_authentication: 'Cần xác thực lại để thực hiện hành động được bảo vệ.',
  exceed_token_limit: 'Đã vượt giới hạn token. Vui lòng liên hệ quản trị viên.',
  third_party_application_forbidden:
    'Ứng dụng bên thứ ba không được phép chỉnh sửa dữ liệu tài khoản qua API này.',
};

export default Object.freeze(auth);
