const custom_profile_fields = {
  table: {
    add_button: 'Thêm trường hồ sơ',
    title: {
      field_label: 'Nhãn trường',
      type: 'Loại',
      user_data_key: 'Khóa dữ liệu người dùng',
    },
    placeholder: {
      title: 'Thu thập hồ sơ người dùng',
      description: 'Tùy chỉnh các trường để thu thập thêm thông tin hồ sơ người dùng khi đăng ký.',
    },
  },
  type: {
    Text: 'Văn bản',
    Number: 'Số',
    Date: 'Ngày',
    Checkbox: 'Ô chọn (Boolean)',
    Select: 'Danh sách chọn (Chọn một)',
    Url: 'URL',
    Regex: 'Biểu thức chính quy',
    Address: 'Địa chỉ (Kết hợp)',
    Fullname: 'Họ và tên (Kết hợp)',
  },
  modal: {
    title: 'Thêm trường hồ sơ',
    subtitle: 'Tùy chỉnh các trường để thu thập thêm thông tin hồ sơ người dùng khi đăng ký.',
    built_in_properties: 'Dữ liệu người dùng cơ bản',
    custom_properties: 'Dữ liệu người dùng tùy chỉnh',
    custom_data_field_name: 'Khóa dữ liệu người dùng',
    custom_data_field_input_placeholder: 'Nhập khóa dữ liệu người dùng, ví dụ `myFavoriteFieldName`',
    custom_field: {
      title: 'Dữ liệu tùy chỉnh',
      description:
        'Các thuộc tính người dùng bổ sung bạn có thể định nghĩa để đáp ứng yêu cầu riêng của ứng dụng.',
    },
    type_required: 'Vui lòng chọn loại thuộc tính',
    create_button: 'Tạo trường hồ sơ',
    avatar: {
      description:
        'Cho phép người dùng tải lên ảnh đại diện khi đăng ký. URL ảnh đã tải lên sẽ được lưu làm ảnh đại diện người dùng.',
      storage_not_configured:
        'Tải lên ảnh đại diện cần có nhà cung cấp lưu trữ được cấu hình. Hãy cấu hình lưu trữ trước khi thêm trường này.',
    },
  },
  details: {
    page_title: 'Chi tiết trường hồ sơ',
    back_to_sie: 'Quay lại trải nghiệm đăng nhập',
    enter_field_name: 'Nhập tên trường hồ sơ',
    delete_description:
      'Hành động này không thể hoàn tác. Bạn có chắc muốn xóa trường hồ sơ này?',
    field_deleted: 'Đã xóa thành công trường hồ sơ {{name}}.',
    key: 'Khóa dữ liệu người dùng',
    field_name: 'Tên trường',
    field_type: 'Loại trường',
    settings: 'Cài đặt',
    settings_description:
      'Tùy chỉnh các trường để thu thập thêm thông tin hồ sơ người dùng khi đăng ký.',
    address_format: 'Định dạng địa chỉ',
    single_line_address: 'Địa chỉ một dòng',
    multi_line_address: 'Địa chỉ nhiều dòng (Ví dụ: Đường, Thành phố, Tỉnh/Bang, Mã bưu điện, Quốc gia)',
    components: 'Thành phần',
    components_tip: 'Chọn các thành phần để tạo thành trường phức hợp.',
    label: 'Nhãn trường',
    label_placeholder: 'Nhãn',
    label_tip: 'Cần bản địa hóa? Thêm ngôn ngữ tại <a>Trải nghiệm đăng nhập > Nội dung</a>',
    label_tooltip:
      'Nhãn nổi mô tả mục đích của trường. Nhãn hiện bên trong ô nhập và di chuyển lên trên khi trường được focus hoặc có giá trị.',
    placeholder: 'Placeholder của trường',
    placeholder_placeholder: 'Placeholder',
    placeholder_tooltip:
      'Ví dụ hoặc gợi ý định dạng hiển thị bên trong ô nhập. Thường xuất hiện sau khi nhãn nổi lên và nên ngắn gọn (ví dụ: MM/DD/YYYY).',
    description: 'Mô tả trường',
    description_placeholder: 'Mô tả',
    description_tooltip:
      'Văn bản hỗ trợ hiển thị dưới trường nhập. Dùng cho hướng dẫn dài hơn hoặc ghi chú về khả năng truy cập.',
    options: 'Tùy chọn',
    options_tip:
      'Nhập mỗi tùy chọn trên một dòng mới. Dùng cú pháp value:label (ví dụ red:Red). Bạn cũng có thể chỉ nhập value; nếu không có label, value sẽ được hiển thị làm nhãn.',
    options_placeholder: 'value1:label1\nvalue2:label2\nvalue3:label3',
    regex: 'Biểu thức chính quy',
    regex_tip: 'Định nghĩa biểu thức chính quy để kiểm tra dữ liệu nhập.',
    regex_placeholder: '^[a-zA-Z0-9]+$',
    date_format: 'Định dạng ngày',
    date_format_us: 'MM/dd/yyyy (ví dụ: Hoa Kỳ)',
    date_format_uk: 'dd/MM/yyyy (ví dụ: Anh và châu Âu)',
    date_format_iso: 'yyyy-MM-dd (Chuẩn quốc tế)',
    custom_date_format: 'Định dạng ngày tùy chỉnh',
    custom_date_format_placeholder: 'Nhập định dạng ngày tùy chỉnh. Ví dụ "MM-dd-yyyy"',
    custom_date_format_tip: 'Xem tài liệu <a>date-fns</a> để biết các mã định dạng hợp lệ.',
    input_length: 'Độ dài dữ liệu nhập',
    value_range: 'Khoảng giá trị',
    min: 'Tối thiểu',
    max: 'Tối đa',
    default_value: 'Giá trị mặc định',
    checkbox_checked: 'Đã chọn (True)',
    checkbox_unchecked: 'Chưa chọn (False)',
    required: 'Bắt buộc',
    required_description:
      'Khi bật, người dùng phải điền trường này. Khi tắt, trường này là không bắt buộc.',
    avatar_upload_description:
      'Người dùng cuối tải lên ảnh đại diện khi đăng ký. Giá trị được lưu là URL ảnh đã tải lên.',
  },
};

export default Object.freeze(custom_profile_fields);
