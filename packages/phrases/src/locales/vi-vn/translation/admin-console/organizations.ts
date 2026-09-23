const organizations = {
  organization: 'Tổ chức',
  page_title: 'Tổ chức',
  title: 'Tổ chức',
  subtitle:
    'Tổ chức thường được dùng trong SaaS hoặc các ứng dụng đa tenant tương tự, đại diện cho khách hàng của bạn là các nhóm, tổ chức hoặc toàn bộ công ty. Tổ chức là nền tảng cho việc xác thực và phân quyền B2B.',
  organization_template: 'Mẫu tổ chức',
  organization_id: 'ID tổ chức',
  members: 'Thành viên',
  machine_to_machine: 'Ứng dụng máy-đến-máy',
  branding: 'Nhận diện thương hiệu',
  create_organization: 'Tạo tổ chức',
  setup_organization: 'Thiết lập tổ chức của bạn',
  organization_list_placeholder_title: 'Tổ chức',
  organization_list_placeholder_text:
    'Tổ chức thường được dùng trong SaaS hoặc các ứng dụng đa tenant tương tự như một cách làm tốt. Chúng cho phép bạn phát triển ứng dụng để khách hàng tạo và quản lý tổ chức, mời thành viên và gán vai trò.',
  organization_name_placeholder: 'Tổ chức của tôi',
  organization_description_placeholder: 'Mô tả ngắn về tổ chức',
  organization_permission: 'Quyền tổ chức',
  organization_permission_other: 'Quyền tổ chức',
  create_permission_placeholder: 'Xem lịch sử lịch hẹn',
  organization_role: 'Vai trò tổ chức',
  organization_role_other: 'Vai trò tổ chức',
  organization_role_description:
    'Vai trò tổ chức là một nhóm các quyền có thể được gán cho người dùng. Các quyền này phải đến từ quyền tổ chức được định nghĩa sẵn.',
  role: 'Vai trò',
  search_placeholder: 'Tìm theo tên hoặc ID tổ chức',
  search_role_placeholder: 'Nhập để tìm và chọn vai trò',
  empty_placeholder: '🤔 Bạn chưa thiết lập {{entity}} nào.',
  organization_and_member: 'Tổ chức và thành viên',
  organization_and_member_description:
    'Tổ chức là một nhóm người dùng và có thể đại diện cho các nhóm, khách hàng doanh nghiệp và công ty đối tác, mỗi người dùng là một "Thành viên". Đây là các thực thể nền tảng để xử lý các yêu cầu đa tenant của bạn.',
  guide: {
    title: 'Bắt đầu với hướng dẫn',
    subtitle: 'Khởi động nhanh cài đặt tổ chức của bạn với hướng dẫn của chúng tôi',
    introduction: {
      title: 'Cùng tìm hiểu cách tổ chức hoạt động trong sdvico',
      section_1: {
        title: 'Một tổ chức là một nhóm người dùng (danh tính)',
      },
      section_2: {
        title: 'Mẫu tổ chức được thiết kế cho kiểm soát truy cập của ứng dụng đa tenant',
        description:
          'Trong các ứng dụng SaaS đa tenant, nhiều tổ chức thường chia sẻ cùng một mẫu kiểm soát truy cập, bao gồm quyền và vai trò. Trong sdvico, chúng tôi gọi đó là "mẫu tổ chức".',
        permission_description:
          'Quyền tổ chức là quyền được phép truy cập tài nguyên trong phạm vi của tổ chức.',
        role_description_deprecated:
          'Vai trò tổ chức là một nhóm các quyền tổ chức có thể được gán cho thành viên.',
        role_description:
          'Vai trò tổ chức là một nhóm các quyền tổ chức hoặc quyền API có thể được gán cho thành viên.',
      },
      section_3: {
        title: 'Tôi có thể gán quyền API cho vai trò tổ chức không?',
        description:
          'Có, bạn có thể gán quyền API cho vai trò tổ chức. sdvico cung cấp sự linh hoạt để quản lý vai trò của tổ chức bạn một cách hiệu quả, cho phép bạn kết hợp cả quyền tổ chức và quyền API trong các vai trò đó.',
      },
      section_4: {
        title: 'Tương tác với minh họa để xem mọi thứ kết nối với nhau như thế nào',
        description:
          'Hãy lấy một ví dụ. John và Sarah thuộc các tổ chức khác nhau với các vai trò khác nhau trong phạm vi từng tổ chức. Di chuột qua các mô-đun khác nhau để xem điều gì xảy ra.',
      },
    },
    organization_permissions: 'Quyền tổ chức',
    organization_roles: 'Vai trò tổ chức',
    admin: 'Quản trị viên',
    member: 'Thành viên',
    guest: 'Khách',
    role_description:
      'Vai trò "{{role}}" chia sẻ cùng một mẫu tổ chức trên các tổ chức khác nhau.',
    john: 'John',
    john_tip:
      'John thuộc hai tổ chức với email "john@email.com" là định danh duy nhất. Anh ấy là quản trị viên của tổ chức A và cũng là khách của tổ chức B.',
    sarah: 'Sarah',
    sarah_tip:
      'Sarah thuộc một tổ chức với email "sarah@email.com" là định danh duy nhất. Cô ấy là quản trị viên của tổ chức B.',
  },
};

export default Object.freeze(organizations);
