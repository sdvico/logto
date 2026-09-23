const cloud = {
  general: {
    onboarding: 'Onboarding',
  },
  create_tenant: {
    page_title: 'Tạo tenant',
    title: 'Tạo tenant đầu tiên của bạn',
    description:
      'Tenant là một môi trường độc lập, nơi bạn có thể quản lý danh tính người dùng, ứng dụng và mọi tài nguyên khác của sdvico.',
    invite_collaborators: 'Mời cộng tác viên qua email',
    hear_about_us: {
      title: 'Bạn biết đến sdvico từ đâu?',
      detail_placeholder: 'Chia sẻ thêm với chúng tôi (không bắt buộc)',
      options: {
        search_engine: 'Công cụ tìm kiếm (Google, Bing...)',
        ai_assistant: 'Trợ lý AI (ChatGPT, Claude, Gemini...)',
        github_oss: 'GitHub hoặc thư mục mã nguồn mở',
        friend_colleague: 'Bạn bè hoặc đồng nghiệp',
        powered_by: 'Trang đăng nhập của một ứng dụng dùng sdvico',
        content_social: 'Mạng xã hội, bài viết hoặc video (YouTube, X, Reddit...)',
        other: 'Khác',
      },
    },
  },
  social_callback: {
    title: 'Bạn đã đăng nhập thành công',
    description:
      'Bạn đã đăng nhập thành công bằng tài khoản mạng xã hội. Để đảm bảo tích hợp liền mạch và truy cập đầy đủ các tính năng của sdvico, chúng tôi khuyến nghị bạn tiếp tục cấu hình connector mạng xã hội riêng của mình.',
    notice:
      'Vui lòng không dùng connector demo cho môi trường sản xuất. Sau khi hoàn tất kiểm thử, hãy xóa connector demo và thiết lập connector riêng của bạn với thông tin xác thực của bạn.',
  },
  tenant: {
    create_tenant: 'Tạo tenant',
  },
};

export default Object.freeze(cloud);
