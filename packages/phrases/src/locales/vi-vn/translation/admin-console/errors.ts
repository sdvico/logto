const errors = {
  something_went_wrong: 'Ôi! Đã có lỗi xảy ra.',
  page_not_found: 'Không tìm thấy trang',
  unknown_server_error: 'Đã xảy ra lỗi máy chủ không xác định',
  empty: 'Không có dữ liệu',
  missing_total_number: 'Không thể tìm thấy Total-Number trong header phản hồi',
  invalid_uri_format: 'Định dạng URI không hợp lệ',
  invalid_origin_format: 'Định dạng origin của URI không hợp lệ',
  invalid_json_format: 'Định dạng JSON không hợp lệ',
  invalid_parameters_format: 'Định dạng tham số không hợp lệ',
  invalid_regex: 'Biểu thức chính quy không hợp lệ',
  invalid_error_message_format: 'Định dạng thông báo lỗi không hợp lệ.',
  required_field_missing: 'Vui lòng nhập {{field}}',
  required_field_missing_plural: 'Bạn phải nhập ít nhất một {{field}}',
  more_details: 'Xem thêm chi tiết',
  username_pattern_error:
    'Tên đăng nhập chỉ được chứa chữ cái, số hoặc gạch dưới và không được bắt đầu bằng số.',
  email_pattern_error: 'Địa chỉ email không hợp lệ.',
  phone_pattern_error: 'Số điện thoại không hợp lệ.',
  insecure_contexts: 'Không hỗ trợ ngữ cảnh không an toàn (non-HTTPS).',
  unexpected_error: 'Đã xảy ra lỗi không mong muốn.',
  not_found: '404 không tìm thấy',
  create_internal_role_violation:
    'Bạn đang tạo một vai trò nội bộ mới, điều này bị sdvico cấm. Hãy thử một tên khác không bắt đầu bằng "#internal:".',
  should_be_an_integer: 'Phải là một số nguyên.',
  number_should_be_between_inclusive:
    'Số phải nằm trong khoảng từ {{min}} đến {{max}} (bao gồm cả hai đầu).',
};

export default Object.freeze(errors);
