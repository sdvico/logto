# Kế hoạch: fork Logto → sdvico (dịch VI + rebrand Cục Thủy sản)

Trạng thái nguồn: clone cục bộ `logto-io/logto` (không push GitHub — theo yêu cầu).
Chưa push lên `github.com/sdvico/logto`; khi cần, tự tạo fork trên web rồi `git remote add sdvico <url> && git push sdvico main`.

## Ghi nhận khảo sát repo

- Monorepo pnpm, 19 package trong `packages/*`. Package chính liên quan tới UI/nhận diện:
  - `packages/console` — Admin Console (React). Có `logo.svg`, `cloud-logo.svg`, `favicon.ico`, `index.html` (title/meta), component `ImageInputs/LogoAndFavicon.tsx`.
  - `packages/experience` — trang đăng nhập/đăng ký (Sign-in Experience). Có default logo `logto-logo-{dark,light,shadow}.svg`, nhưng **logo/màu thật sự hiển thị khi vận hành được nạp động từ cấu hình `sign-in-experience`** (bảng cấu hình trong `packages/schemas/src/foundations/jsonb-types/sign-in-experience.ts`, seed ở `packages/schemas/src/seeds/sign-in-experience.ts`) — nghĩa là phần lớn "nhận diện" của trang đăng nhập **đổi được qua Admin Console, không cần sửa code**.
  - `packages/phrases` (~5 500 dòng, 104 file/locale) — chuỗi văn bản Admin Console.
  - `packages/phrases-experience` (~825 dòng, 15 file/locale) — chuỗi văn bản trang đăng nhập.
  - Hiện **chưa có locale `vi-vn`** ở cả hai package trên (danh sách locale: ar, de, en, es, fa-ir, fr, it, ja, ko, pl-pl, pt-br, pt-pt, ru, th, tr-tr, zh-*, + cs/es-mx/uk-ua ở phrases-experience). Phải tạo mới hoàn toàn, không phải "bật lên".
- Chuỗi `logto`/`Logto` xuất hiện trong ~3 500 file toàn repo, nhưng phần lớn là:
  - tên package npm scope `@logto/*` (import path nội bộ, ~19 package) — **không nên đổi**: đổi sẽ vỡ toàn bộ import, CI, publish, rủi ro cao mà không có giá trị nhận diện với người dùng cuối.
  - tên biến/class/comment nội bộ, test fixture, docs kỹ thuật (CONTRIBUTING, AGENTS.md) — không hiển thị ra UI.
  - logo các SDK bên thứ ba trong docs hướng dẫn tích hợp (`assets/docs/guides/*/logo.svg` — logo React/Vue/Express...) — **không phải nhận diện Logto, không sờ vào**.
- Vậy "rà soát nhận diện Logto → sdvico" nên khoanh vào **brand thật sự hiển thị với người dùng**: tên sản phẩm hiển thị (page title, header Console, email/SMS mẫu, README/marketing docs), logo/favicon file ảnh, bảng màu mặc định, domain mẫu trong `.env.sample`/docker-compose, chứ không đổi package scope kỹ thuật.

## Bảng màu placeholder (chờ logo Cục Thủy sản thật)

Phong cách "thủy sản/biển": xanh biển đậm làm primary, xanh ngọc/xanh lá biển làm accent, trung tính xám ánh xanh. Sẽ đóng gói thành design tokens để dễ thay khi có logo thật — xem chi tiết ở Phase 2.

## Các phase (chạy song song trong từng phase bằng multi-agent, phase sau chờ phase trước)

### Phase 0 — Đã xong
- Clone repo cục bộ. ✅

### Phase 1 — Rà soát nhận diện (audit) — song song theo package
Nhiều agent độc lập, mỗi agent quét 1-2 package, chỉ **liệt kê** (không sửa) các điểm brand hiển thị người dùng cần đổi: chuỗi tên sản phẩm, file logo/favicon, meta/title, email templates, domain mẫu. Gộp thành 1 báo cáo `docs/audit-report.md` với 2 cột: "Phải đổi (user-facing)" / "Giữ nguyên (internal, lý do)".

### Phase 2 — Design tokens & tài sản thương hiệu (song song với Phase 3)
- Tạo `packages/console` + `packages/experience` design tokens (màu, tuỳ biến file theme hiện có) theo bảng màu placeholder ở trên.
- Thay `logo.svg`, `cloud-logo.svg`, favicon Console bằng bản "sdvico" placeholder (dùng chữ SVG tạm, dễ thay bằng logo Cục Thủy sản thật sau).
- Cập nhật seed `sign-in-experience.ts` để tenant mới mặc định ra màu/logo sdvico thay vì Logto.
- Kiểm tra tương phản WCAG cho bảng màu mới (script tự động).

### Phase 3 — Dịch tiếng Việt (song song với Phase 2, song song nội bộ theo nhóm file)
- Tạo locale `vi-vn` cho `packages/phrases` (chia ~104 file thành ~8-10 lô, mỗi agent dịch 1 lô, giữ nguyên cấu trúc key/placeholder `{{...}}`).
- Tạo locale `vi-vn` cho `packages/phrases-experience` (~15 file, 1-2 agent).
- Đăng ký locale mới vào danh sách locale hệ thống (`packages/schemas` hoặc file khai báo locale trung tâm) để hệ thống nhận `vi-vn`.
- Dịch các chuỗi brand còn lại tìm thấy ở Phase 1 (title, email mẫu...) sang tiếng Việt + tên sdvico.

### Phase 4 — Áp dụng sửa đổi từ audit (sau Phase 1, song song với Phase 2/3 nếu không đụng file)
- Từng agent áp các thay đổi "Phải đổi" trong audit report vào đúng package của mình.

### Phase 5 — Kiểm tra tổng hợp (chạy cuối, không song song)
- `pnpm i && pnpm build` (hoặc ít nhất type-check/lint từng package đã sửa).
- Script kiểm tra tính đầy đủ key i18n (Logto có sẵn check-missing-translation) cho `vi-vn`.
- Chạy Console/Experience cục bộ, chụp ảnh xác nhận nhận diện mới + tiếng Việt.
- Báo cáo tổng hợp, chưa push GitHub (theo yêu cầu).

## Quyết định cần chốt thêm khi có thông tin
- Logo/màu thật của Cục Thủy sản khi bạn gửi → thay placeholder ở Phase 2 mà không cần làm lại toàn bộ (token hoá sẵn).
- Có muốn đổi tên hiển thị "Logto" → "sdvico" hay một tên sản phẩm khác (vd "sdvico IAM", "Cổng định danh Cục Thủy sản")? Tạm dùng "sdvico" theo yêu cầu gốc.
