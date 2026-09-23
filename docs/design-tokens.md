# Design tokens — sdvico (placeholder, chờ nhận diện chính thức Cục Thủy sản)

> Toàn bộ giá trị trong file này là PLACEHOLDER. Khi Cục Thủy sản cung cấp bộ nhận diện chính thức (logo + bảng màu + typography), chỉ cần thay giá trị ở đây và ở các file code liệt kê tại mục 3 — không cần sửa lại logic.

## 1. Bảng màu

Nền tham chiếu để tính tương phản: trắng `#FFFFFF` (nền sáng mặc định) và tối `#10242B` (nền tối/dark mode). Tỷ lệ tính theo công thức WCAG 2.x (relative luminance), làm tròn 2 chữ số. Ngưỡng AA cho text thường: ≥ 4.5:1; text lớn (≥18px bold hoặc ≥24px): ≥ 3:1.

| Tên token | Hex | Vai trò sử dụng | Tương phản trên nền trắng | Tương phản trên nền tối `#10242B` |
|---|---|---|---|---|
| `color-primary` | `#0B5FA5` | Nút chính, link, nhấn mạnh, icon active | ~6.6:1 — đạt AA cho text thường trên nền trắng | ~2.4:1 (ước tính) — không đạt AA cho text, chỉ nên dùng làm nền/khối màu, không dùng làm màu chữ trên nền tối; cần kiểm lại bằng công cụ contrast checker |
| `color-primary-dark` | `#08466C` | Hover/pressed state của nút chính | ~10:1 — đạt AA/AAA cho text thường trên nền trắng | cần kiểm lại bằng công cụ contrast checker (hai màu tối gần nhau, khả năng tương phản thấp) |
| `color-accent` | `#17A398` | Trạng thái thành công, badge, điểm nhấn phụ | ~3.1:1 — chỉ đạt mức AA cho text lớn (large text ≥3:1), KHÔNG đạt AA cho text thường/nhỏ trên nền trắng → tránh dùng làm màu chữ nhỏ, ưu tiên dùng làm nền khối (badge/pill) với chữ trắng hoặc chữ tối đè lên | cần kiểm lại bằng công cụ contrast checker |
| `color-bg` (neutral background) | `#F4F8FA` | Nền trang / nền khối nội dung | Không áp dụng (màu nền, không dùng làm text) | — |
| `color-border` (neutral border) | `#D7E3E8` | Viền input, chia khối, divider | Không áp dụng (màu viền, không dùng làm text) | — |
| `color-text-primary` | `#10242B` | Text chính (heading, body quan trọng) | ~16:1 — đạt AA/AAA dư sức trên nền trắng | Không áp dụng (đây chính là màu nền tối tham chiếu) |
| `color-text-secondary` | `#4B6570` | Text phụ (caption, label, mô tả) | ~6.2:1 — đạt AA cho text thường trên nền trắng | cần kiểm lại bằng công cụ contrast checker |

Ghi chú:
- `color-primary` trên nền `color-bg` (`#F4F8FA`, gần trắng) có tương phản gần tương đương với nền trắng thuần (~6.5:1), vẫn đạt AA.
- Với các cặp màu tối-trên-tối hoặc chưa tính được chính xác bằng tay ở trên, đã ghi rõ "cần kiểm lại bằng công cụ contrast checker" — khuyến nghị dùng công cụ như WebAIM Contrast Checker hoặc DevTools trước khi đưa vào production thật.
- Đây là placeholder màu xanh biển/thủy sản (primary xanh biển đậm, accent xanh ngọc biển, nền trung tính nhạt) — không phải màu chính thức của Cục Thủy sản.

## 2. Typography (font)

Giữ nguyên toàn bộ font hệ thống hiện có của Logto (font-family, font-weight, font-size scale trong các package hiện tại) — KHÔNG đổi.

Lý do: Cục Thủy sản chưa cung cấp brief typography riêng (chưa có yêu cầu về font chữ, kiểu chữ, hoặc bộ font thương hiệu). Đổi font ở giai đoạn này là suy đoán không có cơ sở, có thể phải đổi lại tốn công khi có brief chính thức. Khi có brief typography, chỉ cần cập nhật token font tại đây và các file cấu hình font liên quan.

## 3. Logo tạm (placeholder)

Mô tả placeholder đang dùng:
- Wordmark "sdvico" tối giản, màu `color-primary` (`#0B5FA5`), trên nền trắng — dùng cho light mode.
- Biến thể wordmark "sdvico" màu trắng, trên nền `color-primary` (hoặc nền tối) — dùng cho dark mode.
- Không có biểu tượng/icon phức tạp, không có logo chính thức — chỉ là chữ cách điệu hoặc hình sóng biển tối giản, có ghi chú "PLACEHOLDER" ngay trong file SVG.

Danh sách đường dẫn file đã/cần thay khi có logo thật của Cục Thủy sản:

- `packages/console/src/assets/images/logo.svg`
- `packages/console/src/assets/images/cloud-logo.svg`
- `packages/console/src/assets/images/favicon.ico` *(binary — cần thiết kế viên tạo lại thủ công)*
- `packages/console/src/assets/images/apple-touch-icon.png` *(binary — cần thiết kế viên tạo lại thủ công)*
- `packages/experience/src/shared/assets/icons/logto-logo-dark.svg`
- `packages/experience/src/shared/assets/icons/logto-logo-light.svg`
- `packages/experience/src/shared/assets/icons/logto-logo-shadow.svg`
- `packages/experience/src/shared/assets/icons/favicon.png` *(binary — cần thiết kế viên tạo lại thủ công)*
- `packages/experience/src/shared/assets/icons/apple-touch-icon.png` *(binary — cần thiết kế viên tạo lại thủ công)*
- `packages/experience/src/shared/assets/icons/favicon.ico` *(binary — cần thiết kế viên tạo lại thủ công)*
- `packages/schemas/src/seeds/sign-in-experience.ts` — trường `logoUrl`, `darkLogoUrl`, `defaultPrimaryColor`
- `assets/sdvico-logo-light.svg` (gốc repo)
- `assets/sdvico-logo-dark.svg` (gốc repo)
- `logo.png` (gốc repo) *(binary — cần thiết kế viên tạo lại thủ công)*
- `packages/demo-app` — các icon liên quan (favicon/app icon nếu có)
- `packages/device-demo-app` — các icon liên quan (favicon/app icon nếu có)

## 4. Khi có nhận diện chính thức

Khi có bộ nhận diện chính thức của Cục Thủy sản, thay các giá trị màu/logo ở trên là đủ, không cần sửa lại code logic.
