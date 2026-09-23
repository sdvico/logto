const custom_profile_fields = {
  entity_not_exists_with_names: 'Không tìm thấy đối tượng với các tên đã cho: {{names}}',
  invalid_min_max_input: 'Giá trị min và max không hợp lệ.',
  invalid_default_value: 'Giá trị mặc định không hợp lệ.',
  invalid_options: 'Tùy chọn của trường không hợp lệ.',
  invalid_regex_format: 'Định dạng regex không hợp lệ.',
  invalid_address_components: 'Các thành phần địa chỉ không hợp lệ.',
  invalid_fullname_components: 'Các thành phần họ tên không hợp lệ.',
  invalid_sub_component_type: 'Loại thành phần con không hợp lệ.',
  name_exists: 'Trường đã tồn tại với tên này.',
  conflicted_sie_order: 'Giá trị thứ tự trường bị xung đột trong Sign-in Experience.',
  invalid_name: 'Tên trường không hợp lệ, chỉ được dùng chữ hoặc số, phân biệt hoa thường.',
  name_conflict_sign_in_identifier:
    'Tên trường không hợp lệ. Khóa định danh đăng nhập đã được dùng riêng: {{name}}.',
  name_conflict_built_in_prop:
    'Tên trường không hợp lệ. Tên thuộc tính hồ sơ người dùng có sẵn đã được dùng riêng: {{name}}.',
  name_conflict_custom_data: 'Tên trường không hợp lệ. Khóa dữ liệu tùy chỉnh đã được dùng riêng: {{name}}.',
  name_required: 'Cần có tên trường.',
};

export default Object.freeze(custom_profile_fields);
