const oidc_configs = {
  sessions_card_title: 'Phiên đăng nhập sdvico',
  sessions_card_description:
    'Tùy chỉnh chính sách phiên đăng nhập được lưu bởi máy chủ ủy quyền sdvico. Chính sách này ghi lại trạng thái xác thực toàn cục của người dùng để hỗ trợ SSO và cho phép xác thực lại âm thầm trên nhiều ứng dụng.',
  session_max_ttl_in_days: 'Thời gian sống tối đa của phiên (TTL) tính theo ngày',
  session_max_ttl_in_days_tip:
    'Giới hạn thời gian sống tuyệt đối tính từ lúc tạo phiên. Bất kể có hoạt động hay không, phiên sẽ kết thúc khi hết khoảng thời gian cố định này.',
  cloud_private_key_rotation_notice:
    'Trên sdvico Cloud, việc luân chuyển khóa riêng tư sẽ có hiệu lực sau thời gian gia hạn 4 giờ.',
};

export default Object.freeze(oidc_configs);
