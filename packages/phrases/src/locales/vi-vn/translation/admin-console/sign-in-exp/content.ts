const content = {
  terms_of_use: {
    title: 'ĐIỀU KHOẢN',
    description: 'Thêm Điều khoản và Chính sách bảo mật để đáp ứng yêu cầu tuân thủ.',
    terms_of_use: 'URL điều khoản sử dụng',
    terms_of_use_placeholder: 'https://your.terms.of.use/',
    privacy_policy: 'URL chính sách bảo mật',
    privacy_policy_placeholder: 'https://your.privacy.policy/',
    agree_to_terms: 'Đồng ý với điều khoản',
    agree_policies: {
      automatic: 'Tự động đồng ý với điều khoản khi tiếp tục',
      manual_registration_only: 'Yêu cầu tick đồng ý chỉ khi đăng ký',
      manual: 'Yêu cầu tick đồng ý cả khi đăng ký và đăng nhập',
    },
  },
  languages: {
    title: 'NGÔN NGỮ',
    enable_auto_detect: 'Bật tự động nhận diện',
    description:
      'Phần mềm của bạn nhận diện cài đặt ngôn ngữ của người dùng và tự chuyển sang ngôn ngữ đó. Bạn có thể thêm ngôn ngữ mới bằng cách dịch giao diện từ tiếng Anh sang ngôn ngữ khác.',
    manage_language: 'Quản lý ngôn ngữ',
    default_language: 'Ngôn ngữ mặc định',
    default_language_description_auto:
      'Ngôn ngữ mặc định sẽ được dùng khi ngôn ngữ người dùng nhận diện được không có trong thư viện ngôn ngữ hiện tại.',
    default_language_description_fixed:
      'Khi tắt tự động nhận diện, ngôn ngữ mặc định là ngôn ngữ duy nhất phần mềm của bạn hiển thị. Hãy bật tự động nhận diện để mở rộng ngôn ngữ.',
  },
  support: {
    title: 'HỖ TRỢ',
    subtitle: 'Hiển thị các kênh hỗ trợ trên trang lỗi để người dùng được trợ giúp nhanh.',
    support_email: 'Email hỗ trợ',
    support_email_placeholder: 'support@email.com',
    support_website: 'Website hỗ trợ',
    support_website_placeholder: 'https://your.website/support',
  },
  manage_language: {
    title: 'Quản lý ngôn ngữ',
    subtitle:
      'Bản địa hóa trải nghiệm sản phẩm bằng cách thêm ngôn ngữ và bản dịch. Bản đóng góp của bạn có thể được đặt làm ngôn ngữ mặc định.',
    add_language: 'Thêm ngôn ngữ',
    logto_provided: 'sdvico cung cấp',
    key: 'Khóa',
    logto_source_values: 'Giá trị gốc từ sdvico',
    custom_values: 'Giá trị tùy chỉnh',
    clear_all_tip: 'Xóa toàn bộ giá trị',
    unsaved_description: 'Các thay đổi sẽ không được lưu nếu bạn rời trang này mà chưa lưu.',
    deletion_tip: 'Xóa ngôn ngữ',
    deletion_title: 'Bạn muốn xóa ngôn ngữ đã thêm này?',
    deletion_description:
      'Sau khi xóa, người dùng của bạn sẽ không thể duyệt lại bằng ngôn ngữ này.',
    default_language_deletion_title: 'Không thể xóa ngôn ngữ mặc định.',
    default_language_deletion_description:
      '{{language}} được đặt làm ngôn ngữ mặc định của bạn và không thể xóa. ',
  },
};

export default Object.freeze(content);
