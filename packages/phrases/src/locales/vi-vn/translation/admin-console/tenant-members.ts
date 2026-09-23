const tenant_members = {
  members: 'Thành viên',
  invitations: 'Lời mời',
  invite_members: 'Mời thành viên',
  user: 'Người dùng',
  roles: 'Vai trò',
  admin: 'Quản trị viên',
  collaborator: 'Người cộng tác',
  invitation_status: 'Trạng thái lời mời',
  inviter: 'Người mời',
  expiration_date: 'Ngày hết hạn',
  invite_modal: {
    title: 'Mời người vào sdvico Cloud',
    subtitle: 'Để mời thành viên vào một tổ chức, họ phải chấp nhận lời mời.',
    to: 'Đến',
    added_as: 'Thêm với vai trò',
    email_input_placeholder: 'johndoe@example.com',
  },
  invitation_statuses: {
    pending: 'Đang chờ',
    accepted: 'Đã chấp nhận',
    expired: 'Đã hết hạn',
    revoked: 'Đã thu hồi',
  },
  invitation_empty_placeholder: {
    title: 'Mời thành viên nhóm',
    description:
      'Tenant của bạn hiện chưa có thành viên nào được mời.\nĐể hỗ trợ việc tích hợp, hãy xem xét thêm thành viên hoặc quản trị viên.',
  },
  menu_options: {
    edit: 'Sửa vai trò tenant',
    delete: 'Xóa người dùng khỏi tenant',
    resend_invite: 'Gửi lại lời mời',
    revoke: 'Thu hồi lời mời',
    delete_invitation_record: 'Xóa bản ghi lời mời này',
  },
  edit_modal: {
    title: 'Đổi vai trò của {{name}}',
  },
  delete_user_confirm: 'Bạn có chắc muốn xóa người dùng này khỏi tenant này?',
  assign_admin_confirm:
    'Bạn có chắc muốn cấp quyền quản trị viên cho người dùng đã chọn? Cấp quyền quản trị viên sẽ cho phép người dùng có các quyền sau.<ul><li>Thay đổi gói thanh toán của tenant</li><li>Thêm hoặc xóa người cộng tác</li><li>Xóa tenant</li></ul>',
  revoke_invitation_confirm: 'Bạn có chắc muốn thu hồi lời mời này?',
  delete_invitation_confirm: 'Bạn có chắc muốn xóa bản ghi lời mời này?',
  messages: {
    invitation_sent: 'Đã gửi lời mời.',
    invitation_revoked: 'Đã thu hồi lời mời.',
    invitation_resend: 'Đã gửi lại lời mời.',
    invitation_deleted: 'Đã xóa bản ghi lời mời.',
  },
  errors: {
    email_required: 'Email của người được mời là bắt buộc.',
    email_exists: 'Địa chỉ email đã tồn tại.',
    member_exists: 'Người dùng này đã là thành viên của tổ chức này.',
    pending_invitation_exists:
      'Đã có lời mời đang chờ. Hãy xóa email liên quan hoặc thu hồi lời mời.',
    invalid_email: 'Địa chỉ email không hợp lệ. Vui lòng đảm bảo đúng định dạng.',
    max_member_limit: 'Bạn đã đạt đến số lượng thành viên tối đa ({{limit}}) cho tenant này.',
  },
};

export default Object.freeze(tenant_members);
