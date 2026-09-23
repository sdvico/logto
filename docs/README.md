# Tài liệu bàn giao — IAM sdvico (fork logto-io/logto)

Bắt đầu từ đây khi tiếp nhận dự án.

| Đọc theo thứ tự | Nội dung |
|---|---|
| [`SETUP.md`](SETUP.md) | **Bắt đầu ở đây** — dựng lại toàn bộ môi trường local từ đầu, kèm mọi workaround Windows đã gặp |
| [`TAI-LIEU-IAM-sdvico.md`](TAI-LIEU-IAM-sdvico.md) | **Tài liệu chính** — mô hình tổ chức (cây Trung ương/Tỉnh), tích hợp M2M, xác thực SSO, sequence diagram |
| [`handover-2026-09-22-ui-redesign.md`](handover-2026-09-22-ui-redesign.md) | 🆕 Đổi thương hiệu "Sat-Alert IAM", thiết kế lại trang đăng nhập + cổng ứng dụng, sửa `demo-app`, trang Console xem nhanh IAM Sync |
| [`iam-sync-integration-guide.md`](iam-sync-integration-guide.md) | Hướng dẫn chi tiết hơn cho đội kỹ thuật IUU/MKN/CBVMS |
| [`app-integration-credentials.md`](app-integration-credentials.md) | ⚠️ Thông tin đăng nhập 3 app M2M — nhạy cảm, đổi trước khi dùng thật |
| [`sample-response.json`](sample-response.json) | Ví dụ response thật của API |
| [`iam-sync-api-design.md`](iam-sync-api-design.md) | Ghi chép thiết kế kỹ thuật ban đầu (bối cảnh quyết định) |
| [`permission-manifest-sync-design.md`](permission-manifest-sync-design.md) | 🆕 Thiết kế (chưa code) — app expose manifest quyền hạn để IAM **audit** định kỳ (chỉ đọc/so sánh/báo cáo, không đổi cấu trúc organization_scopes/roles đã duyệt) |
| [`design-tokens.md`](design-tokens.md) | Bảng màu/logo placeholder chờ bộ nhận diện chính thức |
| [`audit-report.md`](audit-report.md) | Rà soát nhận diện Logto→sdvico ban đầu (227 phát hiện) |
| [`PLAN.md`](PLAN.md) | Kế hoạch tổng thể lúc khởi động dự án |
| [`change-log.md`](change-log.md) | Nhật ký rebrand ban đầu |
| `sql/` | Script SQL tạo/sửa dữ liệu — idempotent, chạy theo đúng thứ tự trong `SETUP.md` mục 3.5 |
| `diagrams/` | Sơ đồ cây tổ chức + sequence diagram (M2M, SSO) |

## Tóm tắt nhanh hệ thống

- Fork của [logto-io/logto](https://github.com/logto-io/logto), rebrand sang "sdvico" / "IAM", dịch tiếng Việt (chỉ còn 2 ngôn ngữ: English + Tiếng Việt).
- Mô hình tổ chức: **chỉ 2 cấp Trung ương / Tỉnh** (đúng đặc tả gốc). Cảng/Xã-phường/Tàu **không phải Organization** — là Data Scope trên từng User (`users.custom_data.dataScope`).
- API chính: `GET /api/iam-sync/v1/users` — cho hệ thống ngoài (IUU/MKN/CBVMS) đồng bộ danh sách user qua M2M `client_credentials`, xác thực bằng API Resource + scope `iam-sync:read` riêng (không dùng chung quyền Management API).
- `GET /api/iam-sync-preview/users` — bản xem nhanh cho admin đã đăng nhập Console, không cần token M2M.
- Dữ liệu mẫu: 48 tài khoản thật từ hồ sơ bàn giao NKKT + 2 tài khoản test.

## Việc còn tồn đọng khi bàn giao

- Đổi `client_secret` test → thật trước khi vận hành (xem `app-integration-credentials.md`).
- Xác nhận domain thật khi triển khai (hiện dùng `default.logto.app` cho local).
- 12 quan hệ Cảng↔Chi cục được suy luận từ tra cứu web, chưa có trong biên bản gốc — cần đội nghiệp vụ xác nhận (nguồn trích dẫn trong `TAI-LIEU-IAM-sdvico.md` mục 1).
- Favicon/logo nguồn chỉ 91×91px — nên xin bản cao hơn từ Cục.
- Chưa chạy `pnpm -r build` sạch cho toàn bộ 77 package (một số package không liên quan tới Console/IAM Sync API còn lỗi build có sẵn từ Logto gốc, không phải do sdvico gây ra).
