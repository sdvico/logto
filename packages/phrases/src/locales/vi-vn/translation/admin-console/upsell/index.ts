import add_on from './add-on.js';
import featured_plan_content from './featured-plan-content.js';
import paywall from './paywall.js';

const upsell = {
  upgrade_plan: 'Nâng cấp gói',
  compare_plans: 'So sánh các gói',
  try_with_product_name: 'Thử {{productName}} ngay',
  view_plans: 'Xem các gói',
  explore_self_hosted_plans: 'Khám phá các gói tự triển khai',
  create_tenant: {
    title: 'Chọn gói tenant của bạn',
    description:
      'sdvico cung cấp các gói cạnh tranh với mức giá sáng tạo và hợp lý, được thiết kế cho các công ty đang tăng trưởng. <a>Tìm hiểu thêm</a>',
    base_price: 'Giá cơ bản',
    monthly_price: '{{value, number}}/tháng',
    view_all_features: 'Xem tất cả tính năng',
    select_plan: 'Chọn <name/>',
    free_tenants_limit: 'Tối đa {{count, number}} tenant miễn phí',
    free_tenants_limit_other: 'Tối đa {{count, number}} tenant miễn phí',
    most_popular: 'Phổ biến nhất',
    upgrade_success: 'Đã nâng cấp thành công lên <name/>',
  },
  mau_exceeded_modal: {
    title: 'MAU đã vượt giới hạn. Hãy nâng cấp gói của bạn.',
    notification:
      'MAU hiện tại của bạn đã vượt giới hạn của <planName/>. Vui lòng nâng cấp lên gói cao cấp kịp thời để tránh bị tạm ngưng dịch vụ sdvico. ',
    update_plan: 'Cập nhật gói',
  },
  token_exceeded_modal: {
    title: 'Lượng token sử dụng đã vượt giới hạn. Hãy nâng cấp gói của bạn.',
    notification:
      'Bạn đã vượt giới hạn sử dụng token của <planName/>. Người dùng sẽ không thể truy cập dịch vụ sdvico một cách bình thường. Vui lòng nâng cấp lên gói cao cấp kịp thời để tránh gây bất tiện.',
  },
  payment_overdue_modal: {
    title: 'Quá hạn thanh toán hóa đơn',
    notification:
      'Rất tiếc! Thanh toán hóa đơn cho tenant <span>{{name}}</span> đã thất bại. Vui lòng thanh toán hóa đơn kịp thời để tránh bị tạm ngưng dịch vụ sdvico.',
    unpaid_bills: 'Hóa đơn chưa thanh toán',
    update_payment: 'Cập nhật thanh toán',
  },
  add_on_quota_item: {
    api_resource: 'Tài nguyên API',
    machine_to_machine: 'ứng dụng machine-to-machine',
    tokens: '{{limit}}M token',
    tenant_member: 'thành viên tenant',
  },
  charge_notification_for_quota_limit:
    'Bạn đã vượt hạn mức {{item}} của mình. sdvico sẽ tính thêm phí cho phần sử dụng vượt hạn mức. Việc tính phí sẽ bắt đầu vào ngày cơ chế tính giá tiện ích bổ sung mới được phát hành. <a>Tìm hiểu thêm</a>',
  paywall,
  featured_plan_content,
  add_on,
  convert_to_production_modal: {
    title: 'Bạn sắp chuyển tenant phát triển của mình thành tenant sản xuất',
    description:
      'Sẵn sàng vận hành thật? Chuyển tenant dev này thành tenant sản xuất sẽ mở khóa toàn bộ chức năng',
    benefits: {
      stable_environment: 'Đối với người dùng cuối: Một môi trường ổn định để sử dụng thực tế.',
      keep_pro_features:
        'Giữ tính năng Pro: Bạn sẽ đăng ký gói Pro. <a>Xem tính năng của Pro.</a>',
      no_dev_restrictions:
        'Không còn hạn chế dành cho dev: Loại bỏ giới hạn hệ thống về entity, tài nguyên và banner đăng nhập.',
    },
    cards: {
      dev_description: 'Mục đích kiểm thử',
      prod_description: 'Sản xuất thực tế',
      convert_label: 'chuyển đổi',
    },
    button: 'Chuyển sang tenant sản xuất',
  },
};

export default Object.freeze(upsell);
