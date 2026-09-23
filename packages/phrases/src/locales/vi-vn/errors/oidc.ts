const oidc = {
  aborted: 'Người dùng cuối đã hủy tương tác.',
  invalid_scope: 'Scope không hợp lệ: {{scope}}.',
  invalid_token: 'Token được cung cấp không hợp lệ.',
  invalid_client_metadata: 'Metadata của client được cung cấp không hợp lệ.',
  insufficient_scope: 'Token thiếu scope `{{scope}}`.',
  invalid_request: 'Yêu cầu không hợp lệ.',
  invalid_grant: 'Yêu cầu grant không hợp lệ.',
  invalid_issuer: 'Issuer không hợp lệ.',
  invalid_redirect_uri:
    '`redirect_uri` không khớp với bất kỳ `redirect_uris` nào đã đăng ký của client.',
  access_denied: 'Truy cập bị từ chối.',
  invalid_target: 'Resource indicator không hợp lệ.',
  unsupported_grant_type: '`grant_type` được yêu cầu không được hỗ trợ.',
  unsupported_response_mode: '`response_mode` được yêu cầu không được hỗ trợ.',
  unsupported_response_type: '`response_type` được yêu cầu không được hỗ trợ.',
  /** @deprecated Use {@link oidc.server_error} or {@link oidc.provider_error_fallback} instead. */
  provider_error: 'Lỗi nội bộ OIDC: {{message}}.',
  server_error: 'Đã xảy ra lỗi OIDC không xác định. Vui lòng thử lại sau.',
  provider_error_fallback: 'Đã xảy ra lỗi OIDC: {{code}}.',
  custom_claims_script_error: 'Lỗi script custom claims: {{error_description}}',
  key_required: 'Cần có ít nhất một key.',
  key_not_found: 'Không tìm thấy key với ID {{id}}.',
  only_previous_key_can_be_deleted: 'Chỉ có thể xóa key trước đó.',
  invalid_session_payload: 'Payload của session không hợp lệ.',
  session_not_found: 'Không tìm thấy session.',
  invalid_session_account_id: 'accountId của session không khớp.',
  failed_to_revoke_grant: 'Thu hồi grant thất bại.',
  failed_to_cleanup_session_authorization: 'Dọn dẹp authorization của session thất bại.',
};

export default Object.freeze(oidc);
