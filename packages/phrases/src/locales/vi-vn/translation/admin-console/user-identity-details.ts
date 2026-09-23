const user_identity_details = {
  social_identity_page_title: 'Chi tiết danh tính mạng xã hội',
  back_to_user_details: 'Về chi tiết người dùng',
  delete_identity: `Xóa liên kết danh tính`,
  social_account: {
    title: 'Tài khoản mạng xã hội',
    description:
      'Xem dữ liệu người dùng và thông tin hồ sơ được đồng bộ từ tài khoản {{connectorName}} đã liên kết.',
    provider_name: 'Tên nhà cung cấp danh tính mạng xã hội',
    identity_id: 'ID danh tính mạng xã hội',
    user_profile: 'Hồ sơ người dùng được đồng bộ từ nhà cung cấp danh tính mạng xã hội',
  },
  sso_account: {
    title: 'Tài khoản SSO doanh nghiệp',
    description:
      'Xem dữ liệu người dùng và thông tin hồ sơ được đồng bộ từ tài khoản {{connectorName}} đã liên kết.',
    provider_name: 'Tên nhà cung cấp danh tính SSO doanh nghiệp',
    identity_id: 'ID danh tính SSO doanh nghiệp',
    user_profile: 'Hồ sơ người dùng được đồng bộ từ nhà cung cấp danh tính SSO doanh nghiệp',
  },
  token_storage: {
    title: 'Access token',
    description:
      'Lưu access token và refresh token từ {{connectorName}} vào Secret Vault. Cho phép gọi API tự động mà không cần người dùng chấp thuận lại nhiều lần.',
  },
  access_token: {
    title: 'Access token',
    description_active:
      'Access token đang hoạt động và được lưu an toàn trong Secret Vault. Sản phẩm của bạn có thể dùng nó để truy cập API của {{connectorName}}.',
    description_inactive:
      'Access token này không còn hoạt động (ví dụ: đã bị thu hồi). Người dùng phải cấp quyền lại để khôi phục chức năng.',
    description_expired:
      'Access token này đã hết hạn. Việc gia hạn sẽ diễn ra tự động ở lần gọi API kế tiếp bằng refresh token. Nếu không có refresh token, người dùng cần xác thực lại.',
  },
  refresh_token: {
    available:
      'Refresh token khả dụng. Nếu access token hết hạn, nó sẽ được tự động làm mới bằng refresh token.',
    not_available:
      'Refresh token không khả dụng. Sau khi access token hết hạn, người dùng phải xác thực lại để lấy token mới.',
  },
  token_status: 'Trạng thái token',
  created_at: 'Ngày tạo',
  updated_at: 'Ngày cập nhật',
  expires_at: 'Ngày hết hạn',
  scopes: 'Scope',
  delete_tokens: {
    title: 'Xóa token',
    description:
      'Xóa các token đã lưu. Người dùng phải cấp quyền lại để khôi phục chức năng.',
    confirmation_message:
      'Bạn có chắc chắn muốn xóa token không? Secret Vault của sdvico sẽ xóa access token và refresh token của {{connectorName}} đã lưu. Người dùng này phải cấp quyền lại để khôi phục quyền truy cập API {{connectorName}}.',
  },
  token_storage_disabled: {
    title: 'Lưu trữ token đang bị tắt cho connector này',
    description:
      'Hiện tại người dùng chỉ có thể dùng {{connectorName}} để đăng nhập, liên kết tài khoản hoặc đồng bộ hồ sơ trong mỗi luồng chấp thuận. Để truy cập API của {{connectorName}} và thực hiện hành động thay mặt người dùng, vui lòng bật lưu trữ token trong',
  },
};

export default user_identity_details;
