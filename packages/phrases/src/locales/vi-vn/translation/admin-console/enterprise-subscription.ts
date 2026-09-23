const enterprise_subscription = {
  page_title: 'Gói đăng ký',
  title: 'Quản lý gói đăng ký của bạn',
  subtitle: 'Đây là nơi quản lý gói đăng ký đa tenant và lịch sử thanh toán của bạn',
  tab: {
    subscription: 'Gói đăng ký',
    billing_history: 'Lịch sử thanh toán',
  },
  subscription: {
    title: 'Gói đăng ký',
    description: 'Dễ dàng theo dõi mức sử dụng, xem hóa đơn tiếp theo và xem lại hợp đồng gốc của bạn.',
    enterprise_plan_title: 'Gói Enterprise',
    enterprise_plan_description:
      'Đây là gói đăng ký Enterprise của bạn và hạn mức này được chia sẻ giữa các tenant. Dữ liệu sử dụng có thể có độ trễ nhẹ khi cập nhật. ',
    add_on_title: 'Gói mở rộng trả theo mức sử dụng',
    add_on_description:
      "Đây là các gói mở rộng trả theo mức sử dụng dựa trên hợp đồng của bạn hoặc mức giá trả theo mức sử dụng chuẩn của sdvico. Bạn sẽ bị tính phí theo mức sử dụng thực tế.",
    included: 'Đã bao gồm',
    over_quota: 'Vượt hạn mức',
    basic_plan_column_title: {
      product: 'Sản phẩm',
      usage: 'Mức sử dụng',
      quota: 'Hạn mức',
    },
    add_on_column_title: {
      product: 'Sản phẩm',
      unit_price: 'Đơn giá',
      quantity: 'Số lượng',
      total_price: 'Tổng',
    },
    add_on_sku_price: '${{price}}/tháng',
    private_region_title: 'Máy chủ đám mây riêng ({{regionName}})',
    shared_cross_tenants: 'Chia sẻ giữa các tenant',
  },
};

export default Object.freeze(enterprise_subscription);
