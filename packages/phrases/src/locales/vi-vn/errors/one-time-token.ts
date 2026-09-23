const one_time_token = {
  token_not_found: 'Không tìm thấy token {{token}}.',
  email_mismatch: 'Email không khớp với token đã cho.',
  interaction_event_mismatch: 'Token này không thể dùng cho tương tác này.',
  token_expired: 'Token đã hết hạn.',
  token_consumed: 'Token đã được sử dụng.',
  token_revoked: 'Token đã bị thu hồi.',
  cannot_reactivate_token: 'Không thể kích hoạt lại token.',
};

export default Object.freeze(one_time_token);
