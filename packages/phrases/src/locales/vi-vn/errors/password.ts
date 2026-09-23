const password = {
  unsupported_encryption_method: 'Phương thức mã hóa {{name}} không được hỗ trợ.',
  pepper_not_found: 'Không tìm thấy password pepper. Vui lòng kiểm tra lại biến môi trường của core.',
  rejected: 'Mật khẩu bị từ chối. Vui lòng kiểm tra xem mật khẩu có đáp ứng yêu cầu không.',
  invalid_legacy_password_format: 'Định dạng mật khẩu legacy không hợp lệ.',
  unsupported_legacy_hash_algorithm: 'Thuật toán hash legacy không được hỗ trợ: {{algorithm}}.',
  expired: 'Mật khẩu của bạn đã hết hạn. Vui lòng đặt lại mật khẩu để tiếp tục.',
};

export default Object.freeze(password);
