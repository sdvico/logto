const entity = {
  invalid_input: 'Dữ liệu đầu vào không hợp lệ. Danh sách giá trị không được để trống.',
  value_too_long: 'Độ dài của giá trị quá lớn, vượt quá giới hạn cho phép.',
  create_failed: 'Tạo {{name}} thất bại.',
  db_constraint_violated: 'Vi phạm ràng buộc của cơ sở dữ liệu.',
  not_exists: '{{name}} không tồn tại.',
  not_exists_with_id: '{{name}} với ID `{{id}}` không tồn tại.',
  not_found: 'Tài nguyên không tồn tại.',
  relation_foreign_key_not_found:
    'Không tìm thấy một hoặc nhiều khóa ngoại. Vui lòng kiểm tra dữ liệu đầu vào và đảm bảo các đối tượng liên quan đều tồn tại.',
  unique_integrity_violation: 'Đối tượng đã tồn tại. Vui lòng kiểm tra dữ liệu đầu vào và thử lại.',
};

export default Object.freeze(entity);
