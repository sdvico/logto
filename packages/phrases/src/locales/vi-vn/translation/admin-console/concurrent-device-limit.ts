const concurrent_device_limit = {
  title: 'Giới hạn thiết bị đồng thời',
  enable: 'Bật giới hạn thiết bị đồng thời',
  enable_description:
    'Khi bật, sdvico sẽ áp giới hạn số grant hoạt động tối đa cho mỗi người dùng của ứng dụng này.',
  field: 'Giới hạn thiết bị đồng thời trên mỗi ứng dụng',
  field_description:
    'Giới hạn số thiết bị mà một người dùng có thể đăng nhập cùng lúc. sdvico thực thi điều này bằng cách giới hạn số grant hoạt động và tự động hủy grant cũ nhất khi vượt giới hạn.',
  field_placeholder: 'Để trống nếu không giới hạn',
  should_be_greater_than_zero: 'Phải lớn hơn 0.',
};

export default Object.freeze(concurrent_device_limit);
