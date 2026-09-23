const verification_record = {
  not_found: 'Không tìm thấy bản ghi xác minh.',
  permission_denied: 'Quyền truy cập bị từ chối, vui lòng xác thực lại.',
  not_supported_for_google_one_tap: 'API này không hỗ trợ Google One Tap.',
  social_verification: {
    invalid_target: 'Bản ghi xác minh không hợp lệ. Mong đợi {{expected}} nhưng nhận được {{actual}}.',
    token_response_not_found:
      'Không tìm thấy phản hồi token. Vui lòng kiểm tra xem lưu trữ token có được hỗ trợ và bật cho connector mạng xã hội này không.',
  },
};

export default Object.freeze(verification_record);
