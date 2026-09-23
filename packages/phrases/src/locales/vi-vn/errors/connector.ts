const connector = {
  general: 'Có lỗi xảy ra ở connector: {{errorDescription}}',
  not_found: 'Không tìm thấy connector khả dụng cho loại: {{type}}.',
  not_enabled: 'Connector chưa được bật.',
  invalid_metadata: 'Metadata của connector không hợp lệ.',
  invalid_config_guard: 'Config guard của connector không hợp lệ.',
  unexpected_type: 'Loại connector không đúng như mong đợi.',
  invalid_request_parameters: 'Yêu cầu chứa tham số đầu vào sai.',
  insufficient_request_parameters: 'Yêu cầu có thể đang thiếu một số tham số đầu vào.',
  invalid_config: 'Cấu hình của connector không hợp lệ.',
  invalid_certificate:
    'Chứng chỉ của connector không hợp lệ, vui lòng đảm bảo chứng chỉ đang ở dạng mã hóa PEM.',
  invalid_response: 'Phản hồi của connector không hợp lệ.',
  template_not_found: 'Không tìm thấy template phù hợp trong cấu hình connector.',
  template_not_supported: 'Connector không hỗ trợ loại template này.',
  rate_limit_exceeded: 'Vượt quá giới hạn tần suất kích hoạt. Vui lòng thử lại sau.',
  usage_limit_exceeded: 'Đã đạt giới hạn sử dụng dịch vụ email.',
  not_implemented: '{{method}}: chưa được triển khai.',
  social_invalid_access_token: 'Access token của connector không hợp lệ.',
  invalid_auth_code: 'Auth code của connector không hợp lệ.',
  social_invalid_id_token: 'ID token của connector không hợp lệ.',
  authorization_failed: 'Quá trình ủy quyền của người dùng không thành công.',
  social_auth_code_invalid: 'Không thể lấy access token, vui lòng kiểm tra lại authorization code.',
  more_than_one_sms: 'Số lượng connector SMS lớn hơn 1.',
  more_than_one_email: 'Số lượng connector Email lớn hơn 1.',
  more_than_one_connector_factory:
    'Tìm thấy nhiều connector factory (với id {{connectorIds}}), bạn có thể gỡ bỏ những cái không cần thiết.',
  db_connector_type_mismatch: 'Có một connector trong cơ sở dữ liệu không khớp với loại tương ứng.',
  not_found_with_connector_id: 'Không tìm thấy connector với standard connector id đã cho.',
  multiple_instances_not_supported:
    'Không thể tạo nhiều instance với standard connector đã chọn.',
  invalid_type_for_syncing_profile: 'Bạn chỉ có thể đồng bộ hồ sơ người dùng với connector mạng xã hội.',
  can_not_modify_target: "Không thể chỉnh sửa 'target' của connector.",
  should_specify_target: "Bạn cần chỉ định 'target'.",
  multiple_target_with_same_platform:
    'Bạn không thể có nhiều connector mạng xã hội cùng target và cùng platform.',
  cannot_overwrite_metadata_for_non_standard_connector:
    "Không thể ghi đè 'metadata' của connector này.",
  email_connector: {
    bulk_deletion_no_filter:
      'Cần cung cấp ít nhất một điều kiện lọc để thực hiện xóa theo lô dựa trên thuộc tính. Các thuộc tính được hỗ trợ: {{properties, list(type:conjunction)}}.',
  },
  token_storage_not_supported: 'Connector này không hỗ trợ lưu trữ token. ',
};

export default Object.freeze(connector);
