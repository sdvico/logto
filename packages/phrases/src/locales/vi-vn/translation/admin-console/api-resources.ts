const api_resources = {
  page_title: 'API resources',
  title: 'API resources',
  subtitle: 'Định nghĩa các API mà ứng dụng được ủy quyền của bạn có thể sử dụng.',
  create: 'Tạo API resource',
  api_name: 'Tên API',
  api_name_placeholder: 'Nhập tên API của bạn',
  api_identifier: 'API Identifier',
  api_identifier_placeholder: 'https://your-api-identifier',
  api_identifier_tip:
    'Định danh duy nhất của API resource. Phải là một URI tuyệt đối và không có thành phần fragment (#). Tương đương với <a>resource parameter</a> trong OAuth 2.0.',
  default_api: 'API mặc định',
  default_api_label:
    'Mỗi tenant chỉ có thể đặt tối đa một API mặc định.\nKhi đã chỉ định một API mặc định, tham số resource có thể được bỏ qua trong yêu cầu xác thực. Các lần đổi token sau đó sẽ mặc định dùng API này làm audience, dẫn đến việc phát hành JWT. <a>Tìm hiểu thêm</a>',
  api_resource_created: 'Đã tạo thành công API resource {{name}}',
  invalid_resource_indicator_format: 'API indicator phải là một URI tuyệt đối hợp lệ.',
};

export default Object.freeze(api_resources);
