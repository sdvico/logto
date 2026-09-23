const domain = {
  not_configured: 'Nhà cung cấp hostname cho domain chưa được cấu hình.',
  cloudflare_data_missing: 'Thiếu cloudflare_data, vui lòng kiểm tra lại.',
  cloudflare_unknown_error: 'Gặp lỗi không xác định khi gọi Cloudflare API',
  cloudflare_response_error: 'Nhận được phản hồi không mong đợi từ Cloudflare.',
  limit_to_one_domain: 'Bạn chỉ có thể có một custom domain.',
  hostname_already_exists: 'Domain này đã tồn tại trên hệ thống của chúng tôi.',
  cloudflare_not_found: 'Không tìm thấy hostname trong Cloudflare',
  domain_is_not_allowed: 'Domain này không được phép sử dụng.',
  domain_in_use: 'Domain {{domain}} đã được sử dụng',
  exceed_domain_limit: 'Bạn chỉ có thể có tối đa {{limit}} custom domain.',
};

export default Object.freeze(domain);
