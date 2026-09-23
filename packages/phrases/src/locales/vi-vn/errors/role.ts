const role = {
  name_in_use: 'Tên vai trò {{name}} đã được sử dụng',
  scope_exists: 'Scope id {{scopeId}} đã được thêm vào vai trò này',
  management_api_scopes_not_assignable_to_user_role:
    'Không thể gán scope của Management API cho vai trò người dùng.',
  user_exists: 'User id {{userId}} đã được thêm vào vai trò này',
  application_exists: 'Application id {{applicationId}} đã được thêm vào vai trò này',
  default_role_missing:
    'Một số roleNames mặc định không tồn tại trong cơ sở dữ liệu, vui lòng tạo các vai trò này trước',
  internal_role_violation:
    'Bạn có thể đang cố cập nhật hoặc xóa một vai trò nội bộ, điều này bị sdvico cấm. Nếu bạn đang tạo vai trò mới, hãy chọn tên khác không bắt đầu bằng "#internal:".',
};

export default Object.freeze(role);
