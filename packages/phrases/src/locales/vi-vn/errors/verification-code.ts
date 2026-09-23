const verification_code = {
  phone_email_empty: 'Cả số điện thoại và email đều trống.',
  not_found: 'Không tìm thấy mã xác minh. Vui lòng gửi mã xác minh trước.',
  phone_mismatch: 'Số điện thoại không khớp. Vui lòng yêu cầu mã xác minh mới.',
  email_mismatch: 'Email không khớp. Vui lòng yêu cầu mã xác minh mới.',
  code_mismatch: 'Mã xác minh không hợp lệ.',
  expired: 'Mã xác minh đã hết hạn. Vui lòng yêu cầu mã xác minh mới.',
  exceed_max_try:
    'Đã vượt giới hạn số lần thử mã xác minh. Vui lòng yêu cầu mã xác minh mới.',
};

export default Object.freeze(verification_code);
