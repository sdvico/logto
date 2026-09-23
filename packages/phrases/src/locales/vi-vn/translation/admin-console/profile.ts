const profile = {
  link_account: {
    anonymous: 'Ẩn danh',
  },

  delete_account: {
    title: 'XÓA TÀI KHOẢN',
    label: 'Xóa tài khoản',
    description:
      'Xóa tài khoản của bạn sẽ xóa toàn bộ thông tin cá nhân, dữ liệu người dùng và cấu hình. Hành động này không thể hoàn tác.',
    button: 'Xóa tài khoản',
    p: {
      has_issue:
        'Chúng tôi rất tiếc khi biết bạn muốn xóa tài khoản. Trước khi xóa tài khoản, bạn cần giải quyết các vấn đề sau.',
      after_resolved:
        'Sau khi giải quyết các vấn đề, bạn có thể xóa tài khoản. Vui lòng liên hệ với chúng tôi nếu bạn cần hỗ trợ.',
      check_information:
        'Chúng tôi rất tiếc khi biết bạn muốn xóa tài khoản. Vui lòng kiểm tra kỹ thông tin sau trước khi tiếp tục.',
      remove_all_data:
        'Xóa tài khoản của bạn sẽ vĩnh viễn xóa toàn bộ dữ liệu về bạn trên sdvico Cloud. Vì vậy hãy đảm bảo sao lưu mọi dữ liệu quan trọng trước khi tiếp tục.',
      confirm_information:
        'Vui lòng xác nhận thông tin trên là đúng như bạn mong đợi. Sau khi xóa tài khoản, chúng tôi sẽ không thể khôi phục lại.',
      has_admin_role:
        'Vì bạn có vai trò quản trị viên trong tenant sau, tenant này sẽ bị xóa cùng với tài khoản của bạn:',
      has_admin_role_other:
        'Vì bạn có vai trò quản trị viên trong các tenant sau, chúng sẽ bị xóa cùng với tài khoản của bạn:',
      quit_tenant: 'Bạn sắp rời khỏi tenant sau:',
      quit_tenant_other: 'Bạn sắp rời khỏi các tenant sau:',
    },
    issues: {
      paid_plan: 'Tenant sau đang có gói trả phí, vui lòng hủy đăng ký trước:',
      paid_plan_other: 'Các tenant sau đang có gói trả phí, vui lòng hủy đăng ký trước:',
      subscription_status: 'Tenant sau gặp vấn đề về trạng thái đăng ký:',
      subscription_status_other: 'Các tenant sau gặp vấn đề về trạng thái đăng ký:',
      open_invoice: 'Tenant sau có hóa đơn chưa thanh toán:',
      open_invoice_other: 'Các tenant sau có hóa đơn chưa thanh toán:',
    },
    error_occurred: 'Đã xảy ra lỗi',
    error_occurred_description: 'Rất tiếc, đã có lỗi xảy ra khi xóa tài khoản của bạn:',
    request_id: 'ID yêu cầu: {{requestId}}',
    try_again_later:
      'Vui lòng thử lại sau. Nếu vấn đề vẫn tiếp diễn, vui lòng liên hệ với nhóm sdvico kèm ID yêu cầu.',
    final_confirmation: 'Xác nhận cuối cùng',
    about_to_start_deletion:
      'Bạn sắp bắt đầu quá trình xóa và hành động này không thể hoàn tác.',
    permanently_delete: 'Xóa vĩnh viễn',
  },

  fields: {
    name: 'Tên',
    name_description:
      'Họ tên đầy đủ của người dùng dưới dạng hiển thị, bao gồm tất cả thành phần tên (ví dụ: "Jane Doe").',
    avatar: 'Ảnh đại diện',
    avatar_description: 'URL của ảnh đại diện người dùng.',
    familyName: 'Họ',
    familyName_description: 'Họ của người dùng (ví dụ: "Doe").',
    givenName: 'Tên',
    givenName_description: 'Tên riêng của người dùng (ví dụ: "Jane").',
    middleName: 'Tên đệm',
    middleName_description: 'Tên đệm của người dùng (ví dụ: "Marie").',
    nickname: 'Biệt danh',
    nickname_description:
      'Tên gọi thân mật hoặc quen thuộc của người dùng, có thể khác với tên hợp pháp của họ.',
    preferredUsername: 'Tên người dùng ưa thích',
    preferredUsername_description:
      'Định danh ngắn mà người dùng muốn được gọi.',
    profile: 'Hồ sơ',
    profile_description:
      'URL của trang hồ sơ dễ đọc của người dùng (ví dụ: hồ sơ mạng xã hội).',
    website: 'Trang web',
    website_description: 'URL của trang web hoặc blog cá nhân của người dùng.',
    gender: 'Giới tính',
    gender_description: 'Giới tính tự nhận của người dùng (ví dụ: "Nữ", "Nam", "Không xác định")',
    birthdate: 'Ngày sinh',
    birthdate_description: 'Ngày sinh của người dùng theo định dạng chỉ định (ví dụ: "MM-dd-yyyy").',
    zoneinfo: 'Múi giờ',
    zoneinfo_description:
      'Múi giờ của người dùng theo định dạng IANA (ví dụ: "America/New_York" hoặc "Europe/Paris").',
    locale: 'Ngôn ngữ',
    locale_description: 'Ngôn ngữ của người dùng theo định dạng IETF BCP 47 (ví dụ: "en-US" hoặc "zh-CN").',
    address: {
      formatted: 'Địa chỉ',
      streetAddress: 'Địa chỉ đường/phố',
      locality: 'Thành phố',
      region: 'Tỉnh/Bang',
      postalCode: 'Mã bưu chính',
      country: 'Quốc gia',
    },
    address_description:
      'Địa chỉ đầy đủ của người dùng dưới dạng hiển thị, bao gồm tất cả thành phần địa chỉ (ví dụ: "123 Main St, Anytown, USA 12345").',
    fullname: 'Họ và tên',
    fullname_description:
      'Kết hợp linh hoạt giữa họ, tên và tên đệm dựa trên cấu hình.',
  },
};

export default Object.freeze(profile);
