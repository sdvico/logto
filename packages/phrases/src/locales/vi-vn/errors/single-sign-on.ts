const single_sign_on = {
  forbidden_domains: 'Không cho phép dùng domain email công khai.',
  duplicated_domains: 'Có domain bị trùng lặp.',
  invalid_domain_format: 'Định dạng domain không hợp lệ.',
  duplicate_connector_name: 'Tên connector đã tồn tại. Vui lòng chọn tên khác.',
  idp_initiated_authentication_not_supported:
    'Xác thực do IdP khởi tạo chỉ được hỗ trợ cho connector SAML.',
  idp_initiated_authentication_invalid_application_type:
    'Loại ứng dụng không hợp lệ. Chỉ ứng dụng {{type}} được cho phép.',
  idp_initiated_authentication_redirect_uri_not_registered:
    'redirect_uri chưa được đăng ký. Vui lòng kiểm tra lại cài đặt ứng dụng.',
  idp_initiated_authentication_client_callback_uri_not_found:
    'Không tìm thấy client callback URI cho xác thực do IdP khởi tạo. Vui lòng kiểm tra lại cài đặt connector.',
  sso_signing_unavailable:
    'Chúng tôi không thể hoàn tất đăng nhập với nhà cung cấp danh tính của bạn. Vui lòng liên hệ quản trị viên.',
  can_not_delete_active_signing_key:
    'Không thể xóa signing key đang hoạt động. Hãy kích hoạt key khác hoặc hủy kích hoạt key này trước.',
  can_not_deactivate_signing_key_in_use:
    'Không thể hủy kích hoạt signing key đang được dùng khi yêu cầu xác thực có ký (signed authentication request) đang được bật. Hãy tắt tính năng này trước.',
  active_signing_key_required:
    'Không tìm thấy signing key đang hoạt động. Hãy tạo và kích hoạt một signing key trước khi bật yêu cầu xác thực có ký.',
};

export default Object.freeze(single_sign_on);
