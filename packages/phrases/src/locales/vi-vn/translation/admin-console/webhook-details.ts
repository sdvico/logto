const webhook_details = {
  page_title: 'Chi tiết webhook',
  back_to_webhooks: 'Về trang webhook',
  not_in_use: 'Không sử dụng',
  success_rate: 'tỷ lệ thành công',
  requests: '{{value, number}} yêu cầu trong 24h',
  disable_webhook: 'Tắt webhook',
  disable_reminder:
    'Bạn có chắc chắn muốn kích hoạt lại webhook này không? Việc này sẽ không gửi yêu cầu HTTP tới endpoint URL.',
  webhook_disabled: 'Webhook đã bị tắt.',
  webhook_reactivated: 'Webhook đã được kích hoạt lại.',
  reactivate_webhook: 'Kích hoạt lại webhook',
  delete_webhook: 'Xóa webhook',
  deletion_reminder:
    'Bạn đang xóa webhook này. Sau khi xóa, webhook sẽ không gửi yêu cầu HTTP tới endpoint URL nữa.',
  deleted: 'Webhook đã được xóa thành công.',
  settings_tab: 'Cài đặt',
  recent_requests_tab: 'Yêu cầu gần đây (24h)',
  settings: {
    settings: 'Cài đặt',
    settings_description:
      'Webhook cho phép bạn nhận cập nhật theo thời gian thực về các sự kiện cụ thể ngay khi xảy ra, bằng cách gửi yêu cầu POST tới endpoint URL của bạn. Điều này giúp bạn xử lý ngay dựa trên thông tin mới nhận được.',
    events: 'Sự kiện',
    events_description: 'Chọn các sự kiện kích hoạt mà sdvico sẽ gửi yêu cầu POST.',
    name: 'Tên',
    endpoint_url: 'Endpoint URL',
    signing_key: 'Signing key',
    signing_key_tip:
      'Thêm khóa bí mật do sdvico cung cấp vào endpoint của bạn dưới dạng một request header để đảm bảo tính xác thực của payload webhook.',
    regenerate: 'Tạo lại',
    regenerate_key_title: 'Tạo lại signing key',
    regenerate_key_reminder:
      'Bạn có chắc chắn muốn sửa signing key không? Việc tạo lại sẽ có hiệu lực ngay lập tức. Hãy nhớ cập nhật signing key đồng thời ở phía endpoint của bạn.',
    regenerated: 'Signing key đã được tạo lại.',
    custom_headers: 'Header tùy chỉnh',
    custom_headers_tip:
      'Bạn có thể thêm header tùy chỉnh vào payload webhook để bổ sung ngữ cảnh hoặc metadata cho sự kiện.',
    key_duplicated_error: 'Key không được lặp lại.',
    key_missing_error: 'Key là bắt buộc.',
    value_missing_error: 'Value là bắt buộc.',
    invalid_key_error: 'Key không hợp lệ',
    invalid_value_error: 'Value không hợp lệ',
    test: 'Kiểm tra',
    test_webhook: 'Kiểm tra webhook của bạn',
    test_webhook_description:
      'Cấu hình webhook và kiểm tra bằng payload mẫu cho từng sự kiện đã chọn để xác nhận việc nhận và xử lý đúng.',
    send_test_payload: 'Gửi payload kiểm tra',
    test_result: {
      endpoint_url: 'Endpoint URL: {{url}}',
      message: 'Thông báo: {{message}}',
      response_status: 'Trạng thái phản hồi: {{status, number}}',
      response_body: 'Nội dung phản hồi: {{body}}',
      request_time: 'Thời gian yêu cầu: {{time}}',
      test_success: 'Kiểm tra webhook tới endpoint đã thành công.',
    },
  },
};

export default Object.freeze(webhook_details);
