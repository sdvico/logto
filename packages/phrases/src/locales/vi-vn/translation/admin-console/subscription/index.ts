import quota_item from './quota-item.js';
import quota_table from './quota-table.js';
import usage from './usage.js';

const subscription = {
  free_plan: 'Gói miễn phí',
  free_plan_description: 'Dành cho dự án cá nhân và thử nghiệm sdvico ban đầu. Không cần thẻ tín dụng.',
  pro_plan: 'Gói Pro',
  pro_plan_description: 'Dành cho doanh nghiệp yên tâm sử dụng cùng sdvico.',
  enterprise: 'Gói Doanh nghiệp',
  enterprise_description: 'Dành cho các đội nhóm và doanh nghiệp lớn với yêu cầu cấp doanh nghiệp.',
  admin_plan: 'Gói quản trị',
  dev_plan: 'Gói phát triển',
  self_hosted_pro_plan: 'Gói Pro tự triển khai',
  self_hosted_enterprise_plan: 'Gói Doanh nghiệp tự triển khai',
  current_plan: 'Gói hiện tại',
  current_plan_description:
    'Đây là gói hiện tại của bạn. Bạn có thể dễ dàng xem mức sử dụng, kiểm tra hóa đơn sắp tới và thay đổi gói khi cần.',
  plan_usage: 'Mức sử dụng gói',
  plan_cycle: 'Chu kỳ gói: {{period}}. Mức sử dụng gia hạn vào {{renewDate}}.',
  next_bill: 'Hóa đơn sắp tới của bạn',
  next_bill_hint: 'Để biết thêm về cách tính, vui lòng xem <a>bài viết</a> này.',
  next_bill_tip:
    'Giá hiển thị ở đây chưa bao gồm thuế và có thể có độ trễ nhỏ khi cập nhật. Số tiền thuế sẽ được tính dựa trên thông tin bạn cung cấp và quy định của địa phương, và sẽ được hiển thị trong hóa đơn của bạn.',
  manage_payment: 'Quản lý thanh toán',
  overfill_quota_warning:
    'Bạn đã đạt đến giới hạn quota. Để tránh sự cố, hãy nâng cấp gói.',
  upgrade_pro: 'Nâng cấp lên Pro',
  update_payment: 'Cập nhật thanh toán',
  payment_error:
    'Phát hiện vấn đề thanh toán. Không thể xử lý ${{price, number}} cho kỳ trước. Cập nhật thanh toán để tránh việc dịch vụ sdvico bị tạm ngưng.',
  downgrade: 'Hạ cấp',
  current: 'Hiện tại',
  upgrade: 'Nâng cấp',
  quota_table,
  billing_history: {
    invoice_column: 'Hóa đơn',
    status_column: 'Trạng thái',
    amount_column: 'Số tiền',
    invoice_created_date_column: 'Ngày tạo hóa đơn',
    invoice_status: {
      void: 'Đã hủy',
      paid: 'Đã thanh toán',
      open: 'Đang mở',
      uncollectible: 'Quá hạn',
    },
  },
  quota_item,
  cancel_feedback_modal: {
    title: 'Rất tiếc khi bạn rời đi',
    description:
      'Gói đăng ký của bạn đã bị hủy. Phản hồi của bạn giúp chúng tôi cải thiện sdvico. Chúng tôi đọc mọi phản hồi.',
    what_made_you_cancel: 'Điều gì khiến bạn hủy?',
    how_to_reconsider: 'Chúng tôi có thể làm gì để bạn xem xét lại?',
  },
  downgrade_modal: {
    title: 'Bạn có chắc muốn hạ cấp?',
    description:
      'Nếu bạn chọn chuyển sang <targetName/>, xin lưu ý rằng bạn sẽ không còn quyền truy cập vào quota và tính năng đã có trước đây ở <currentName/>.',
    before: 'Trước: <name/>',
    after: 'Sau: <name />',
    downgrade: 'Hạ cấp',
  },
  not_eligible_modal: {
    downgrade_title: 'Bạn không đủ điều kiện để hạ cấp',
    downgrade_description:
      'Hãy đảm bảo bạn đáp ứng các tiêu chí sau trước khi hạ cấp xuống <name/>.',
    downgrade_help_tip: 'Cần trợ giúp khi hạ cấp? <a>Liên hệ chúng tôi</a>.',
    upgrade_title: 'Lời nhắc thân thiện dành cho những người dùng sớm đáng quý của chúng tôi',
    upgrade_description:
      'Bạn hiện đang sử dụng nhiều hơn mức <name /> cho phép. sdvico hiện đã chính thức hoạt động, bao gồm các tính năng riêng cho từng gói. Trước khi xem xét nâng cấp lên <name />, hãy đảm bảo bạn đáp ứng các tiêu chí sau.',
    upgrade_pro_tip: ' Hoặc xem xét nâng cấp lên gói Pro.',
    upgrade_help_tip: 'Cần trợ giúp khi nâng cấp? <a>Liên hệ chúng tôi</a>.',
    a_maximum_of: 'Tối đa <item/>',
  },
  upgrade_success: 'Nâng cấp lên <name/> thành công',
  downgrade_success: 'Hạ cấp xuống <name/> thành công',
  subscription_check_pending:
    'Thanh toán của bạn đã được xử lý. Việc thiết lập gói đăng ký của bạn đang mất nhiều thời gian hơn bình thường.',
  no_subscription: 'Không có gói đăng ký',
  usage,
  token_usage_notification: {
    exceeded:
      'Bạn đã vượt quá 100% giới hạn quota. Người dùng sẽ không thể đăng nhập bình thường. Vui lòng nâng cấp ngay để tránh mọi bất tiện.',
    close_to_limit:
      'Bạn gần đạt đến giới hạn sử dụng token. sdvico sẽ ngừng cấp token nếu mức sử dụng của bạn vượt quá 100%. Vui lòng nâng cấp gói Miễn phí để tránh mọi bất tiện.',
    dev_plan_exceeded: 'Tenant này đã đạt đến giới hạn token theo chính sách giới hạn thực thể của sdvico.',
  },
};

export default Object.freeze(subscription);
