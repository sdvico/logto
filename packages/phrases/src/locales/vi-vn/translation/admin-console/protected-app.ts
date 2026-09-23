const protected_app = {
  name: 'Ứng dụng được bảo vệ',
  title: 'Tạo Ứng dụng được bảo vệ: Thêm xác thực đơn giản và cực nhanh',
  fast_create: 'Tạo nhanh',
  modal_title: 'Tạo Ứng dụng được bảo vệ',
  modal_subtitle:
    'Bật bảo vệ nhanh và an toàn chỉ với vài lần nhấp. Thêm xác thực vào ứng dụng web hiện có của bạn một cách dễ dàng.',
  form: {
    url_field_label: 'URL gốc của bạn',
    url_field_placeholder: 'https://domain.com/',
    url_field_description: 'Cung cấp địa chỉ của ứng dụng cần được bảo vệ bằng xác thực.',
    url_field_modification_notice:
      'Các thay đổi đối với URL gốc có thể cần 1-2 phút để có hiệu lực trên toàn bộ hệ thống mạng toàn cầu.',
    url_field_tooltip:
      "Cung cấp địa chỉ ứng dụng của bạn, không bao gồm phần '/pathname'. Sau khi tạo, bạn có thể tùy chỉnh quy tắc xác thực theo route.\n\nLưu ý: URL gốc bản thân không yêu cầu xác thực; việc bảo vệ chỉ áp dụng cho các truy cập thông qua miền ứng dụng được chỉ định.",
    domain_field_label: 'Miền ứng dụng',
    domain_field_placeholder: 'ten-mien-cua-ban',
    domain_field_description:
      'URL này đóng vai trò proxy bảo vệ xác thực cho URL gốc. Miền tùy chỉnh có thể được áp dụng sau khi tạo.',
    domain_field_description_short:
      'URL này đóng vai trò proxy bảo vệ xác thực cho URL gốc.',
    domain_field_tooltip:
      "Ứng dụng được sdvico bảo vệ sẽ mặc định được lưu trữ tại 'ten-mien-cua-ban.{{domain}}'. Miền tùy chỉnh có thể được áp dụng sau khi tạo.",
    create_application: 'Tạo ứng dụng',
    create_protected_app: 'Tạo nhanh',
    errors: {
      domain_required: 'Miền của bạn là bắt buộc.',
      domain_in_use: 'Tên miền phụ này đã được sử dụng.',
      invalid_domain_format:
        "Định dạng miền phụ không hợp lệ: chỉ dùng chữ thường, số và dấu gạch nối '-'.",
      url_required: 'URL gốc là bắt buộc.',
      invalid_url:
        "Định dạng URL gốc không hợp lệ: hãy dùng http:// hoặc https://. Lưu ý: '/pathname' hiện chưa được hỗ trợ.",
      localhost:
        'Vui lòng đưa máy chủ cục bộ của bạn ra internet trước. Tìm hiểu thêm về <a>phát triển cục bộ</a>.',
    },
  },
  id_token_claims: {
    card_title: 'Claim của ID token',
    card_description:
      'Yêu cầu thêm phạm vi người dùng trong lúc đăng nhập Ứng dụng được bảo vệ để đưa các claim mở rộng đã bật vào ID token được chuyển tiếp.',
    field_title: 'Phạm vi bổ sung',
    field_description:
      'Claim chỉ được đưa vào khi được bật trong <a>Custom JWT > ID token</a> và phạm vi tương ứng được yêu cầu tại đây.',
    table_column_scope: 'Phạm vi',
    table_column_claims_forwarded: 'Claim được chuyển tiếp',
    disabled_claims_hint:
      'Các claim bị làm mờ chưa được chuyển tiếp. Hãy bật chúng trong <a>Custom JWT > ID token</a> để đưa vào ID token.',
  },
  success_message:
    '🎉 Xác thực ứng dụng đã được bật thành công! Hãy khám phá trải nghiệm mới trên website của bạn.',
};

export default Object.freeze(protected_app);
