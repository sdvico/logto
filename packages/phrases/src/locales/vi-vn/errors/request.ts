const request = {
  invalid_input: 'Dữ liệu đầu vào không hợp lệ. {{details}}',
  general: 'Đã xảy ra lỗi yêu cầu.',
  range_not_satisfiable: 'Không thể đáp ứng phạm vi (range) yêu cầu.',
  feature_not_supported: 'Tính năng này không được hỗ trợ trong môi trường hiện tại.',
  rate_limited: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
  message_rate_limited: 'Quá nhiều tin nhắn được gửi tới người nhận này. Vui lòng thử lại sau.',
};

export default Object.freeze(request);
