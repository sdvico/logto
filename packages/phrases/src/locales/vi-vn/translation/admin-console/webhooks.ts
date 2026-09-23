const webhooks = {
  page_title: 'Webhook',
  title: 'Webhook',
  subtitle: 'Tạo webhook để nhận cập nhật theo thời gian thực về các sự kiện cụ thể một cách dễ dàng.',
  create: 'Tạo webhook',
  schemas: {
    interaction: 'Tương tác người dùng',
    user: 'Người dùng',
    trusted_device: 'Thiết bị tin cậy',
    organization: 'Organization',
    role: 'Vai trò',
    scope: 'Quyền',
    organization_role: 'Vai trò organization',
    organization_scope: 'Quyền organization',
    security: 'Bảo mật',
  },
  table: {
    name: 'Tên',
    events: 'Sự kiện',
    success_rate: 'Tỷ lệ thành công (24h)',
    requests: 'Yêu cầu (24h)',
  },
  placeholder: {
    title: 'Webhook',
    description:
      'Tạo webhook để nhận cập nhật theo thời gian thực qua yêu cầu POST tới endpoint URL của bạn. Luôn nắm bắt và xử lý ngay các sự kiện như "Tạo tài khoản", "Đăng nhập" và "Đặt lại mật khẩu".',
    create_webhook: 'Tạo webhook',
  },
  create_form: {
    title: 'Tạo webhook',
    subtitle:
      'Thêm webhook để gửi yêu cầu POST tới endpoint URL kèm thông tin chi tiết về các sự kiện của người dùng.',
    events: 'Sự kiện',
    events_description: 'Chọn các sự kiện kích hoạt mà sdvico sẽ gửi yêu cầu POST.',
    name: 'Tên',
    name_placeholder: 'Nhập tên webhook',
    endpoint_url: 'Endpoint URL',
    endpoint_url_placeholder: 'https://your.webhook.endpoint.url',
    endpoint_url_tip:
      'Nhập URL của endpoint nơi payload webhook sẽ được gửi tới khi sự kiện xảy ra.',
    create_webhook: 'Tạo webhook',
    missing_event_error: 'Bạn phải chọn ít nhất một sự kiện.',
  },
  webhook_created: 'Webhook {{name}} đã được tạo thành công.',
};

export default Object.freeze(webhooks);
