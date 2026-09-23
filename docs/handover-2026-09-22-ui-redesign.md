# Bàn giao bổ sung — 2026-09-22: đổi thương hiệu "Sat-Alert IAM", thiết kế lại trang đăng nhập & cổng ứng dụng

Bổ sung cho [`README.md`](README.md). Phần này ghi lại các thay đổi UI/UX và backend nhỏ thực hiện sau bản bàn giao đầu (mô hình tổ chức, IAM Sync API, permission-audit) — đọc [`TAI-LIEU-IAM-sdvico.md`](TAI-LIEU-IAM-sdvico.md) trước nếu chưa nắm tổng thể hệ thống.

## 1. Đổi thương hiệu → "Sat-Alert IAM"

- Toàn bộ nhãn "IAM"/"Sdvico" trong Console (logo, tiêu đề tab, tên gói dev) và trang đăng nhập đổi thành **"Sat-Alert IAM"**.
- Logo chính thức của **Cục Thủy sản và Kiểm ngư** (`tongcucthuysan.gov.vn`) vẫn giữ nguyên làm logo hiển thị chính ở mọi nơi (header Console, header trang đăng nhập).
- Thêm 1 logo SVG mới — `packages/experience/src/assets/images/sat-alert-iam-mark.svg` (khối gradient teal→xanh dương, hoạ tiết khiên+khoá) — **chỉ dùng 2 chỗ**: favicon của app đăng nhập, và badge cạnh chữ "Sat-Alert IAM" trên trang đăng nhập/cổng ứng dụng. Không thay thế logo Cục Thủy sản.

## 2. Thiết kế lại trang đăng nhập (clone theo `iuu-report.vercel.app/login`)

File chính: [`packages/experience/src/pages/SignIn/HeroLayout.tsx`](../packages/experience/src/pages/SignIn/HeroLayout.tsx) + `heroLayout.module.scss`.

Bố cục 2 cột (chỉ áp dụng cho trang `/sign-in`, không đụng tới Register/Consent/Device — các trang đó vẫn dùng `LandingPageLayout` cũ):

- **Trái**: nền gradient xanh navy→teal, logo mark + chữ "Sat-Alert IAM", tiêu đề, mô tả hệ thống, 3 badge "Tài khoản → Phân quyền → Ứng dụng nghiệp vụ".
- **Phải**: khung trắng chứa **đúng** form đăng nhập gốc của Logto (không viết lại logic auth — chỉ bọc CSS khác đi), thêm dòng "Liên hệ Cục Thủy sản và Kiểm ngư để được cấp tài khoản." ở cuối khung.
- Header trên cùng (logo Cục Thủy sản + tên cơ quan + nhãn "HỆ THỐNG SAT-ALERT IAM") căn giữa cùng trục max-width với phần nội dung bên dưới (1040px), tránh lệch trái/phải trên màn hình rộng.

Các thay đổi cấu hình DB đi kèm (`sign_in_experiences`, tenant `default`):

- `branding.logoUrl`/`darkLogoUrl` → data URI logo thật (trước đó trỏ domain giả `sdvico.local`, gây lỗi hiển thị).
- `language_info` → `{autoDetect: false, fallbackLanguage: 'vi-VN'}` — mặc định tiếng Việt.
- `sign_up.identifiers = []` + `sign_in_mode = 'SignIn'` — ẩn hẳn nút "Tạo tài khoản" (hệ thống nội bộ, tài khoản do admin cấp).
- `hide_logto_branding = true` (cả 2 tenant) — ẩn "Powered by Logto" toàn hệ thống.

## 3. Trang cổng ứng dụng (`/` và `/unknown-session`)

File: [`packages/experience/src/pages/AppPortal/index.tsx`](../packages/experience/src/pages/AppPortal/index.tsx).

Thay cho màn hình lỗi 404 mặc định của Logto khi không có phiên đăng nhập hợp lệ, `/` và `/unknown-session` giờ hiển thị **cổng vào** liệt kê các ứng dụng nghiệp vụ đã kết nối, cùng phong cách với trang đăng nhập:

| Ứng dụng | Mô tả | Link hiện tại |
|---|---|---|
| Sat Alert | Cảnh báo giám sát tàu cá qua vệ tinh | `https://cbvms.tongcucthuysan.gov.vn/` |
| eLogbook | Nhật ký khai thác thủy sản điện tử | `http://gstc.tongcucthuysan.gov.vn/nkkt/` |
| IUU | Báo cáo điều hành chống khai thác IUU | `http://iuu.tongcucthuysan.gov.vn/` |

⚠️ **3 link trên trỏ thẳng vào domain thật hiện có của từng hệ thống — các hệ thống này CHƯA tích hợp OIDC với Sat-Alert IAM**, nên bấm vào chỉ mở thẳng app đó, **không** đi qua SSO. Khi đội kỹ thuật từng app tích hợp Logto SDK (redirect qua `/oidc/auth` của IAM), thay `signInUrl` tương ứng trong `BUSINESS_APPS` (đầu file `AppPortal/index.tsx`) bằng link đăng nhập thật của app đó.

Vì vậy trang có thêm nút riêng **"Dùng app demo để test đăng nhập SSO →"** trỏ tới `/demo-app` — đây là cách duy nhất hiện tại để test luồng OIDC thật end-to-end trong lúc chờ 3 app trên tích hợp.

## 4. `demo-app` — mô phỏng đúng kịch bản "click → SSO"

File: [`packages/demo-app/src/App.tsx`](../packages/demo-app/src/App.tsx).

Trước đây `demo-app` (app mẫu có sẵn của Logto) tự động redirect sang trang đăng nhập ngay khi tải trang — không giống cách một app nghiệp vụ thật hoạt động. Đã sửa lại:

- Hiển thị màn hình landing ("Business app demo" / "Ứng dụng nghiệp vụ (Demo)") với nút bấm rõ ràng **"Đăng nhập bằng Sat-Alert IAM"**.
- Chỉ khi bấm nút mới gọi `signIn()` của Logto SDK → redirect qua `/oidc/auth` thật.
- Sau đăng nhập, hiển thị lại username/user ID lấy từ ID token — giữ nguyên cơ chế cũ, chỉ đổi UX vào.

Tài khoản test có sẵn: `chuyenvien_qn` / `Test@123456` (user `user-cv-qn`, dữ liệu Quảng Ninh **hư cấu**, không phải người thật trong hồ sơ NKKT).

## 5. Console: trang xem nhanh IAM Sync (`IamSyncUsers`)

Hoàn thiện nốt trang Console còn dang dở từ bản bàn giao trước:

- [`packages/console/src/pages/IamSyncUsers/index.tsx`](../packages/console/src/pages/IamSyncUsers/index.tsx) — bảng hiển thị dữ liệu `GET /api/iam-sync-preview/users` (username, tên, trạng thái, tổ chức, vai trò, phạm vi dữ liệu, cập nhật lúc).
- Route đăng ký tại `packages/console/src/hooks/use-console-routes/index.tsx` (`iam-sync-users`), sidebar item trong `packages/console/src/containers/ConsoleContent/Sidebar/hook.tsx` (mục "Quản lý người dùng").
- Cần đăng nhập Console admin để xem — chưa test qua trình duyệt trong phiên này vì không có sẵn mật khẩu tài khoản `admin` (không tự đổi mật khẩu tài khoản người khác); đã kiểm tra `tsc --noEmit` sạch cho toàn bộ package Console.

## 6. Việc còn tồn đọng (bổ sung)

- Đặt lại tên "IUU/MKN/CBVMS" trong một số comment code cũ (`iam-sync.ts`, tài liệu thiết kế trước đó) — về mặt chức năng không ảnh hưởng, nhưng nên đổi cho khớp tên gọi chính thức "Sat Alert / eLogbook / IUU" khi có dịp dọn code.
- 3 link app trong `AppPortal` cần thay bằng link SSO thật khi từng app tích hợp xong OIDC (xem mục 3).
- Trang `IamSyncUsers` trong Console chưa được xác nhận bằng mắt qua trình duyệt (thiếu mật khẩu admin) — chỉ mới kiểm tra type-check.
- Do repo local là **shallow clone**, lần đầu push lên `https://github.com/sdvico/iam` phải gộp lịch sử thành 1 commit khởi tạo (xem message của commit đầu) để tránh lỗi `did not receive expected object` của Git khi push shallow history sang remote mới — các lần push sau nên cân nhắc bỏ giới hạn shallow (`git fetch --unshallow`) nếu cần giữ lịch sử chi tiết.
