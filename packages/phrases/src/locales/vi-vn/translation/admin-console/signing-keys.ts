const signing_keys = {
  title: 'Khóa ký',
  description: 'Quản lý an toàn các khóa ký được ứng dụng của bạn sử dụng.',
  private_key: 'Khóa riêng OIDC',
  private_keys_description: 'Khóa riêng OIDC dùng để ký các token JWT.',
  cookie_key: 'Khóa cookie OIDC',
  cookie_keys_description: 'Khóa cookie OIDC dùng để ký cookie.',
  private_keys_in_use: 'Khóa riêng đang sử dụng',
  cookie_keys_in_use: 'Khóa cookie đang sử dụng',
  rotate_private_keys: 'Xoay khóa riêng',
  rotate_cookie_keys: 'Xoay khóa cookie',
  rotate_private_keys_description:
    'Hành động này sẽ tạo một khóa ký riêng mới, xoay khóa hiện tại và xóa khóa trước đó của bạn. Các token JWT được ký bằng khóa hiện tại sẽ vẫn còn hiệu lực cho đến khi bị xóa hoặc xoay khóa lần nữa.',
  rotate_cookie_keys_description:
    'Hành động này sẽ tạo một khóa cookie mới, xoay khóa hiện tại và xóa khóa trước đó của bạn. Cookie được ký bằng khóa hiện tại sẽ vẫn còn hiệu lực cho đến khi bị xóa hoặc xoay khóa lần nữa.',
  select_private_key_algorithm: 'Chọn thuật toán khóa ký cho khóa riêng mới',
  rotate_button: 'Xoay khóa',
  table_column: {
    id: 'ID',
    status: 'Trạng thái',
    algorithm: 'Thuật toán khóa ký',
    effective_at: 'Có hiệu lực từ',
  },
  status: {
    next: 'Kế tiếp',
    current: 'Hiện tại',
    previous: 'Trước đó',
    effective_in: 'Có hiệu lực sau {{time}}',
  },
  reminder: {
    rotate_private_key:
      'Bạn có chắc muốn xoay <strong>khóa riêng OIDC</strong>? Các token JWT mới phát hành sẽ được ký bằng khóa mới. Token JWT hiện có vẫn còn hiệu lực cho đến khi bạn xoay khóa lần nữa.',
    rotate_cookie_key:
      'Bạn có chắc muốn xoay <strong>khóa cookie OIDC</strong>? Cookie mới được tạo trong phiên đăng nhập sẽ được ký bằng khóa cookie mới. Cookie hiện có vẫn còn hiệu lực cho đến khi bạn xoay khóa lần nữa.',
    delete_private_key:
      'Bạn có chắc muốn xóa <strong>khóa riêng OIDC</strong>? Các token JWT hiện có được ký bằng khóa riêng này sẽ không còn hiệu lực.',
    delete_cookie_key:
      'Bạn có chắc muốn xóa <strong>khóa cookie OIDC</strong>? Các phiên đăng nhập cũ có cookie được ký bằng khóa cookie này sẽ không còn hiệu lực. Người dùng đó cần xác thực lại.',
  },
  messages: {
    rotate_key_success: 'Xoay khóa ký thành công.',
    delete_key_success: 'Xóa khóa thành công.',
  },
};

export default Object.freeze(signing_keys);
