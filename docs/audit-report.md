# Báo cáo rà soát nhận diện "Logto" trong repo — chuẩn bị đổi thương hiệu sang "sdvico"

**Phạm vi:** Fork `logto-io/logto` về `github.com/sdvico/logto`, dịch tiếng Việt các chuỗi hiển thị người dùng, thay nhận diện Logto bằng nhận diện sdvico (placeholder màu xanh biển/thủy sản — **chưa có logo/màu chính thức của Cục Thủy sản**).
**Tổng số phát hiện:** 227 (từ dữ liệu JSON đầu vào, các nhóm: `console`, `experience`, `core-server`, `schemas-seeds`, `cli-connectors`, `misc-packages`, `phrases-en`, `root-repo`).

---

## 1. Tóm tắt số lượng theo category

| Category | Số lượng | Ý nghĩa |
|---|---|---|
| `brand_name_text` | 176 | Chuỗi văn bản UI/CLI/README chứa chữ "Logto" hiển thị cho người dùng, cần đổi tên + dịch tiếng Việt |
| `logo_or_favicon_asset` | 24 | File ảnh/SVG/ICO logo, favicon, apple-touch-icon mang thương hiệu Logto |
| `keep_internal` | 11 | Định danh/kỹ thuật nội bộ, không hiển thị cho người dùng cuối — **giữ nguyên** |
| `sample_domain_or_email` | 9 | Domain, URL, badge, User-Agent tham chiếu tới `logto.io` / hạ tầng của Logto |
| `page_title_meta` | 6 | Tiêu đề tab trình duyệt (`<title>`) hoặc mô tả trang Swagger |
| `color_token` | 1 | Mã màu mặc định (`#6139F6` — tím Logto) dùng khi seed tenant mới |
| **Tổng** | **227** | |

Trong đó 216 phát hiện thuộc nhóm **"Phải đổi (user-facing)"** (mọi category trừ `keep_internal`), và 11 phát hiện thuộc nhóm **"Giữ nguyên (internal)"**.

---

## 2. Bảng "Phải đổi (user-facing)" — nhóm theo file/package

> Ghi chú: các file trong `packages/phrases/...` có rất nhiều dòng lặp lại cùng một quy tắc ("dịch sang tiếng Việt, thay chữ Logto → sdvico") nên được gộp theo file, kèm danh sách số dòng, để bảng còn đọc được.

### 2.1. Nhóm `console` (packages/console)

| File | Hiện tại | Loại | Đề xuất đổi |
|---|---|---|---|
| `src/consts/tenants.ts:172` | `mainTitle = isCloud ? 'Logto Cloud' : 'Logto Console'` | page_title_meta | Đổi thành tên thương hiệu sdvico, ví dụ `'sdvico Console'` (chuỗi này set title tab qua react-helmet trong `App.tsx`) |
| `src/favicon.ico` | Favicon Logto (16x16, 32x32) | logo_or_favicon_asset | Thay bằng favicon sdvico dựng từ logo Cục Thủy sản (placeholder xanh biển) |
| `src/apple-touch-icon.png` | Apple touch icon Logto | logo_or_favicon_asset | Thay bằng icon sdvico dựng từ logo Cục Thủy sản (placeholder) |
| `src/assets/images/logo.svg` | Logo/wordmark Logto, hiển thị ở Topbar (OSS) và splash AppLoading | logo_or_favicon_asset | Thay bằng logo sdvico / Cục Thủy sản, giữ cùng viewBox/tỉ lệ với `<Logo />` |
| `src/assets/images/cloud-logo.svg` | Logo "Logto Cloud", hiển thị ở Topbar khi `isCloud` | logo_or_favicon_asset | Thay bằng biến thể logo cloud của sdvico, hoặc dùng lại logo.svg nếu không có bản Cloud riêng |
| `src/consts/tenants.ts:59` | `name: 'Logto Development plan'` | brand_name_text | Đổi thành `'sdvico Development plan'` |
| `src/hooks/use-inkeep-configs.ts:106` | `organizationDisplayName: 'Logto'` | brand_name_text | Đổi thành `'sdvico'` (tên tổ chức hiển thị ở header widget AI/Inkeep) |
| `src/hooks/use-inkeep-configs.ts:135` | `aiAssistantName: 'Logto AI'` | brand_name_text | Đổi thành `'sdvico AI'` |
| `src/hooks/use-inkeep-configs.ts:133` | `aiAssistantAvatar: theme === 'dark' ? logtoAiBotDark : logtoAiBot` | logo_or_favicon_asset | Thay ảnh avatar bot Logto bằng avatar bot sdvico (tìm icon nguồn dạng `logto-ai-bot*` trong `src/assets`) |
| `src/components/Region/index.tsx:100` | `displayName: 'Logto Cloud (Public)'` | brand_name_text | Đổi tên hiển thị dropdown theo tên vùng/product của sdvico (chỉ áp dụng nếu vẫn giữ bộ chọn vùng cloud) |
| `src/components/CreateConnectorForm/index.tsx:78` | `t(copyKeys.action, { productName: 'Logto Cloud' })` | brand_name_text | Đổi giá trị `productName` sang tên thương hiệu sdvico (chuỗi dịch nằm ở package `@logto/phrases`) |
| `src/components/SamlAppLimitBanner/index.tsx:49` | `t(content.actionKey, { productName: 'Logto Cloud' })` | brand_name_text | Tương tự trên |
| `.../OssUpsell.tsx:43` | `t('upsell.try_with_product_name', { productName: 'Logto Cloud' })` | brand_name_text | Tương tự trên |
| `package.json:5` | `"homepage": "https://github.com/logto-io/logto#readme"` | sample_domain_or_email | Đổi thành `https://github.com/sdvico/logto#readme` sau khi fork xong |

### 2.2. Nhóm `experience` (packages/experience)

| File | Hiện tại | Loại | Đề xuất đổi |
|---|---|---|---|
| `src/shared/components/LogtoSignature/index.tsx:173` | Badge `aria-label="Powered By Logto"`, `<span>Powered by</span>`, link `https://logto.io/...` — **hardcode, có MutationObserver+setInterval "integrity guard" tự bật lại nếu bị ẩn/xóa** | brand_name_text | Đây là điểm "Logto" hiển thị lớn nhất, xuất hiện trên MỌI màn hình sign-in/sign-up. Không thể tắt qua config branding tenant — phải sửa trực tiếp component (đổi text/logo/link sang sdvico, hoặc gỡ component cùng guard ép hiển thị) |
| `src/shared/assets/icons/logto-logo-dark.svg` | Logo Logto (dark) dùng riêng cho badge trên | logo_or_favicon_asset | Thay/gỡ cùng lúc với rebrand `LogtoSignature` |
| `src/shared/assets/icons/logto-logo-light.svg` | Logo Logto (light) dùng riêng cho badge trên | logo_or_favicon_asset | Thay/gỡ cùng lúc với rebrand `LogtoSignature` |
| `src/shared/assets/icons/logto-logo-shadow.svg` | Icon tĩnh (shadow) của badge trên | logo_or_favicon_asset | Thay/gỡ cùng lúc với rebrand `LogtoSignature` |
| `src/utils/sign-in-experience.ts:82` | `return 'Logto';` | page_title_meta | Fallback `<title>` cho path chưa map — đổi thành `'sdvico'` |
| `src/shared/assets/favicon.png` | Favicon fallback mặc định (khi tenant chưa cấu hình `branding.favicon`) | logo_or_favicon_asset | Thay bằng favicon sdvico placeholder |
| `src/shared/assets/apple-touch-icon.png` | Apple-touch-icon fallback mặc định | logo_or_favicon_asset | Thay bằng icon sdvico placeholder |
| `src/favicon.ico` | Favicon gốc package, phục vụ tĩnh tại `/favicon.ico` | logo_or_favicon_asset | Thay bằng .ico sdvico placeholder |

### 2.3. Nhóm `core-server` (packages/core)

| File | Hiện tại | Loại | Đề xuất đổi |
|---|---|---|---|
| `src/libraries/saml-application/utils.ts:50` | `commonName: 'logto.io'`, `organizationName: 'Logto'` — nhúng vào chứng chỉ SAML SP mà admin tenant tải xuống đưa cho IdP | sample_domain_or_email | Đổi `commonName` thành domain triển khai của sdvico, `organizationName` thành `'Sdvico'` (hoặc tên pháp lý/thương hiệu chính thức) trước khi vận hành thật |
| `src/libraries/hook/utils.ts:95` | `'user-agent': 'Logto (https://logto.io/)'` gửi trong mọi request webhook | sample_domain_or_email | Đổi thành `'Sdvico (https://<domain-sdvico>/)'`; ưu tiên thấp vì hầu hết bên nhận không quan tâm User-Agent |
| `src/routes/swagger/consts.ts:1` | Mô tả markdown dài cho trang Swagger/OpenAPI ("Logto Management API...", link `docs.logto.io`, `cloud.logto.io`, ví dụ domain `*.logto.app`) | page_title_meta | Viết lại nội dung theo nền tảng Sdvico, đổi link docs/API sang domain của sdvico nếu Swagger UI được public cho bên thứ ba |

### 2.4. Nhóm `schemas-seeds` (packages/schemas)

| File | Hiện tại | Loại | Đề xuất đổi |
|---|---|---|---|
| `src/seeds/sign-in-experience.ts:14` | `defaultPrimaryColor = '#6139F6'` (tím thương hiệu Logto) | color_token | Đổi sang màu chủ đạo lấy từ palette Cục Thủy sản — **hiện dùng placeholder xanh biển/thủy sản** |
| `src/seeds/sign-in-experience.ts:29` | `logoUrl: 'https://logto.io/logo.svg'` (tenant mặc định) | logo_or_favicon_asset | Đổi sang URL logo sdvico/Cục Thủy sản (placeholder), hoặc để `undefined` |
| `src/seeds/sign-in-experience.ts:30` | `darkLogoUrl: 'https://logto.io/logo-dark.svg'` (tenant mặc định) | logo_or_favicon_asset | Đổi sang URL logo dark sdvico (placeholder) |
| `src/seeds/sign-in-experience.ts:95` | `logoUrl: 'https://logto.io/logo.svg'` (admin tenant/Console) | logo_or_favicon_asset | Đổi sang URL logo sdvico (placeholder) |
| `src/seeds/sign-in-experience.ts:96` | `darkLogoUrl: 'https://logto.io/logo-dark.svg'` (admin tenant/Console) | logo_or_favicon_asset | Đổi sang URL logo dark sdvico (placeholder) |

### 2.5. Nhóm `cli-connectors` (packages/connectors, packages/cli)

| File | Hiện tại | Loại | Đề xuất đổi |
|---|---|---|---|
| `connector-logto-social-demo/src/constant.ts:11` | `name: { en: 'Logto Social Demo' }` | brand_name_text | Đổi thành `'SDVICO Social Demo'` hoặc gỡ connector demo trước go-live |
| `connector-logto-social-demo/logo.svg` | Icon logo Logto (hiển thị trong Console và nút social sign-in) | logo_or_favicon_asset | Thay bằng icon trung lập/placeholder hoặc mark thương hiệu mới |
| `connector-logto-email/src/constant.ts:9` | `name: { en: 'Logto email service', de: ..., }` — 16 locale đều chứa "Logto" | brand_name_text | Thay "Logto" bằng tên thương hiệu mới ở TẤT CẢ 16 locale (ví dụ `'SDVICO email service'`) |
| `connector-logto-email/logo.svg` | Icon connector email (light) | logo_or_favicon_asset | Thay bằng mark thương hiệu mới |
| `connector-logto-email/logo-dark.svg` | Icon connector email (dark) | logo_or_favicon_asset | Thay bằng bản dark của mark thương hiệu mới |
| `connector-mailgun/src/constant.ts:59-72` | Template OTP mặc định: `subject: 'Logto sign-in template {{code}}'`, ... — **gửi thật tới hộp thư người dùng** | brand_name_text | Thay mọi chữ "Logto" bằng tên thương hiệu mới trong toàn bộ template trước khi dùng thật |
| `connector-mailjunky/src/constant.ts:47-116` | `placeholder: 'Logto'` (from-name) + 8 template mặc định nhắc "Logto" | brand_name_text | Cập nhật placeholder mặc định và toàn bộ nội dung template |
| `connector-sendgrid-email/src/constant.ts:43-112` | `placeholder: 'Logto'` + template OTP mặc định | brand_name_text | Cập nhật placeholder và toàn bộ template |
| `connector-smtp/src/constant.ts:72-129,171` | Template mặc định (sign-in/register/quên MK/...) + `placeholder: '<Logto-SMTP>'` | brand_name_text | Thay toàn bộ chữ "Logto" trong template và placeholder |
| `connector-smtp2go-email/src/constant.ts:43-112` | `placeholder: 'Logto'` + template OTP mặc định | brand_name_text | Cập nhật placeholder và toàn bộ template |
| `cli/src/commands/install/utils.ts:69` | `message: 'Where should we create your Logto instance?'` | brand_name_text | Đổi "Logto" → tên thương hiệu mới (ví dụ 'SDVICO IAM') |
| `cli/src/commands/install/utils.ts:202` | `Use the command below to start Logto. Happy hacking!` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/commands/install/utils.ts:95` | `Logto requires PostgreSQL >=...` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/commands/install/utils.ts:108` | `consoleLog.fatal('Logto requires a Postgres instance to run.')` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/utils.ts:176` | `The path ... does not contain a Logto instance.` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/utils.ts:214` | `message: 'Where is your Logto instance?'` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/index.ts:21` | `describe: 'The Postgres URL to Logto database'` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/index.ts:26` | `describe: 'Print Logto CLI version'` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/commands/install/index.ts:80` | `describe: 'Download and run the latest Logto release'` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/commands/install/index.ts:85` | `describe: 'Path of Logto, must be a non-existing path'` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/commands/install/index.ts:90` | `describe: 'Skip Logto database seeding'` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |
| `cli/src/commands/install/index.ts:102` | `describe: 'URL for downloading Logto, can be a local path to tar.'` | brand_name_text | Đổi "Logto" → tên thương hiệu mới |

### 2.6. Nhóm `misc-packages` (demo-app, device-demo-app, elements, account)

| File | Hiện tại | Loại | Đề xuất đổi |
|---|---|---|---|
| `demo-app/src/index.html:9` | `<title>Logto Live Preview</title>` | page_title_meta | Đổi thành `"SDVICO Live Preview"` |
| `demo-app/src/index.html:7` (+ file `apple-touch-icon.png`, `favicon.ico`) | Icon Logto tham chiếu trong `<head>` | logo_or_favicon_asset | Thay bằng icon sdvico/Cục Thủy sản (placeholder) |
| `demo-app/src/DevPanel.tsx:55` | `<div className={styles.title}>Logto config</div>` | brand_name_text | Đổi thành nhãn trung lập, ví dụ `"App config"` |
| `device-demo-app/index.html:9` | `<title>Logto Device Flow Demo</title>` | page_title_meta | Đổi title theo sdvico; thay `favicon.ico` kèm |
| `device-demo-app/src/App.tsx:288` | `import logtoIcon from './assets/logto-icon.svg'`, `alt="Logto"` | logo_or_favicon_asset | Thay `assets/logto-icon.svg` bằng logo sdvico/Cục Thủy sản, sửa `alt` |
| `device-demo-app/src/Footer.tsx:30` | Khối "Powered by" liên kết `https://logto.io`, dùng `logto-logo-*.svg`, `alt="Logto"` | logo_or_favicon_asset | Gỡ hoặc thay bằng nhận diện sdvico; nếu là demo white-label có thể gỡ hẳn |
| `elements/index.html:7` | `<title>Logto elements dev page</title>` | page_title_meta | Trang dev nội bộ, không tới tay người dùng cuối — ưu tiên thấp, có thể đổi tên tuỳ ý |
| `account/README.md:3` | Mô tả "The Logto account center app..." | brand_name_text | Tài liệu dành cho dev, không phải UI hiển thị — rebrand tuỳ chọn để nhất quán |

### 2.7. Nhóm `phrases-en` (packages/phrases/src/locales/en/...)

Toàn bộ các chuỗi dưới đây là **văn bản giao diện tiếng Anh mặc định**, hiển thị trực tiếp cho quản trị viên tenant trong Admin Console. Quy tắc chung: **dịch sang tiếng Việt + thay mọi chữ "Logto" bằng "sdvico"** (áp dụng đồng nhất cho tất cả các dòng, không cần lặp lại nội dung gốc từng dòng trong bảng).

| File | Số dòng có "Logto" | Loại | Đề xuất đổi |
|---|---|---|---|
| `errors/resource.ts` | 3, 4 | brand_name_text | Dịch tiếng Việt; đổi "Logto Management API" → "sdvico Management API" |
| `errors/role.ts` | 11 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/actions.ts` | 5, 31, 54, 58, 80, 85 | brand_name_text | Dịch; thay "Logto" → "sdvico" (đặc biệt các dòng 80/85 có 2 lần "Logto") |
| `translation/admin-console/api-resource-details.ts` | 10, 12 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/application-details.ts` | 9, 12, 34, 37, 66, 72, 74, 99, 115, 201, 292, 296, 303, 305, 325, 326 | brand_name_text | Dịch toàn bộ 16 chuỗi; thay "Logto" → "sdvico" (bao gồm nhãn `logto_endpoint`, `col_logto_claims` — có thể đổi cả key nếu làm rebrand triệt để, ngoài phạm vi dịch thuật) |
| `translation/admin-console/applications.ts` | 5, 46, 77, 79, 120 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/cloud.ts` | 9, 12, 19, 28 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/concurrent-device-limit.ts` | 5, 8 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/connector-details.ts` | 24, 40, 49, 51, 72 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/connectors.ts` | 18, 48, 70, 87 | brand_name_text | Dịch; thay "Logto" → "sdvico" (dòng 70 còn nhắc domain `*.logto.app` — cần quyết định domain riêng của sdvico) |
| `translation/admin-console/contact.ts` | 21 | brand_name_text | Dịch; "Logto team" → "đội ngũ sdvico" |
| `translation/admin-console/domain.ts` | 8, 42, 70, 71 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/enterprise-sso-details.ts` | 62, 65, 106, 118, 120 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/enterprise-sso.ts` | 12, 38, 54, 61 | brand_name_text | Dịch; thay "Logto" → "sdvico" (dòng 54 còn nhắc `*.logto.app`) |
| `translation/admin-console/enterprise-subscription.ts` | 17 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/errors.ts` | 24 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/get-started.ts` | 4, 16, 47, 50, 51, 57, 61, 62 | brand_name_text | Dịch; thay "Logto"/"Logto Cloud" → "sdvico"/tương đương |
| `translation/admin-console/guide.ts` | 30 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/inkeep-ai-bot.ts` | 3, 4, 5, 9 | brand_name_text | Dịch; "Logto AI" → "sdvico AI" |
| `translation/admin-console/jwt-claims.ts` | 107 | brand_name_text | Dịch; thay 2 lần "Logto" → "sdvico" |
| `translation/admin-console/oidc-configs.ts` | 2, 4, 9 | brand_name_text | Dịch; thay "Logto"/"Logto Cloud" → "sdvico" |
| `translation/admin-console/organizations.ts` | 37, 44, 55 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/oss-onboarding.ts` | 5, 11, 13 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/profile.ts` | 20, 43 | brand_name_text | Dịch; thay "Logto Cloud"/"Logto team" → "sdvico" |
| `translation/admin-console/protected-app.ts` | 23 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/roles.ts` | 33, 35 | brand_name_text | Dịch; thay "Logto Management API" → "sdvico Management API" |
| `translation/admin-console/sign-in-exp/content.ts` | 41, 43 | brand_name_text | Dịch; `logto_provided`/`logto_source_values` → nhãn tiếng Việt tương đương sdvico |
| `translation/admin-console/sign-in-exp/index.ts` | 33, 45, 47, 48, 95, 98, 120 | brand_name_text | Dịch; `hide_logto_branding` → "Ẩn nhận diện sdvico"; "Powered by Logto" → "Powered by sdvico" |
| `translation/admin-console/sign-in-exp/sign-up-and-sign-in.ts` | 61, 109 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/subscription/index.ts` | 7, 9, 31, 52, 71, 86, 87 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/subscription/quota-table.ts` | 98, 100, 104 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/subscription/usage.ts` | 13, 15 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/system-limit.ts` | 3 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/tenant-members.ts` | 13 | brand_name_text | Dịch; "Logto Cloud" → "sdvico" |
| `translation/admin-console/tenants.ts` | 18, 25, 39, 42, 55, 73, 115, 147 | brand_name_text | Dịch toàn bộ 8 chuỗi; thay "Logto"/"Logto Cloud" → "sdvico" |
| `translation/admin-console/upsell/index.ts` | 14, 27, 33, 38, 49 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/upsell/paywall.ts` | 45, 47, 48, 50, 61, 74 | brand_name_text | Dịch; thay "Logto"/"Logto Cloud"/"Logto Enterprise plan" → tương đương sdvico; `logto_pricing_button_text` → nhãn tương đương |
| `translation/admin-console/user-details.ts` | 153, 156, 175 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/user-identity-details.ts` | 51 | brand_name_text | Dịch; "Logto Secret Vault" → tên tương đương của sdvico |
| `translation/admin-console/webhook-details.ts` | 24, 29 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/webhooks.ts` | 34 | brand_name_text | Dịch; thay "Logto" → "sdvico" |
| `translation/admin-console/welcome.ts` | 4 | brand_name_text | Dịch; đây là đoạn "Welcome to Logto"-style copy — thay cả 2 lần "Logto" → "sdvico" |

### 2.8. Nhóm `root-repo` (gốc repo)

| File | Hiện tại | Loại | Đề xuất đổi |
|---|---|---|---|
| `README.md:1` | Khối `<picture>` link tới `logto.io`, nhúng `logo-dark.svg`/`logo-light.svg` từ `github.com/logto-io/.github`, alt "Logto logo" | logo_or_favicon_asset | Thay bằng logo SDVICO/Cục Thủy sản (bản sáng+tối) lưu trong fork, đổi link khỏi `logto.io` |
| `README.md:13` | Badge Discord, checks/release CI, codecov, `cloud.logto.io`, Gitpod, Render — toàn bộ trỏ về hạ tầng `logto-io` | sample_domain_or_email | Badge checks/release trỏ về repo riêng của fork thì đổi sang `github.com/sdvico/logto`; các badge gắn dịch vụ của Logto (Discord, cloud.logto.io, codecov project, Render deploy link) nên xoá vì không áp dụng cho fork |
| `README.md:21` | `# Logto` / "Logto is the modern, open-source auth infrastructure..." | brand_name_text | Dịch sang tiếng Việt, đổi tên hiển thị theo nhận diện SDVICO/Cục Thủy sản |
| `README.md:30` | Link website/cloud/docs/api/blog/wiki/newsletter, tất cả `*.logto.io` | sample_domain_or_email | Xoá hoặc thay các link trỏ tới dịch vụ của Logto gốc |
| `README.md:36` | `![Logto features](./assets/logto-features.png)` | logo_or_favicon_asset | Thay ảnh chụp màn hình theo nhận diện SDVICO/Cục Thủy sản hoặc xoá nếu không áp dụng |
| `README.md:61` | `curl ... raw.githubusercontent.com/logto-io/logto/HEAD/docker-compose.yml ... -p logto` | sample_domain_or_email | Đổi URL sang `sdvico/logto` sau khi fork; đổi tên project compose (`-p logto`) nếu cần |
| `README.md:85` | Mục "Support Logto" — Discord, chia sẻ Twitter/X ("@logto_io"), LinkedIn/Reddit/Telegram/WhatsApp quảng bá `logto.io`, "Open an issue"/"Contribute to Logto" về `github.com/logto-io/logto`, `mailto:contact@logto.io` | sample_domain_or_email | Xoá toàn bộ mục quảng bá cộng đồng Logto gốc; nếu giữ mục liên hệ/báo lỗi thì đổi sang kênh liên hệ và repo GitHub của sdvico |
| `README.md:93` | `<a href="#logto">Back to top</a>` | brand_name_text | Cập nhật cùng lúc với đổi heading `# Logto` |
| `logo.png` | Logo thương hiệu Logto ở gốc repo (25KB PNG) | logo_or_favicon_asset | Thay bằng artwork logo Cục Thủy sản/SDVICO |
| `AWESOME.md` | "# Logto awesome — Here's the list of awesome community-contributed resources for Logto." | brand_name_text | Dịch sang tiếng Việt hoặc xoá file nếu danh sách tài nguyên cộng đồng Logto gốc không còn phù hợp với fork nội bộ |
| `render.yaml:3` | `name: logto` | brand_name_text | Đổi tên service hiển thị theo nhận diện SDVICO nếu dùng để deploy fork này |
| `render.yaml:5` | `repo: https://github.com/logto-io/logto.git` | sample_domain_or_email | Cập nhật thành `https://github.com/sdvico/logto.git` sau khi fork xong, tránh Render deploy nhầm repo gốc |
| `docker-compose.yml:1` | `image: svhd/logto:${TAG-latest}` | sample_domain_or_email | Image Docker Hub công khai của cộng đồng Logto; nếu fork build image riêng cho SDVICO cần đổi sang registry/image nội bộ, nếu vẫn dùng bản gốc để demo thì ghi chú rõ trong comment |

---

## 3. Danh sách "Giữ nguyên (internal, không đổi)" — category `keep_internal`

Các phát hiện dưới đây là định danh kỹ thuật/nội bộ, **không hiển thị cho người dùng cuối** — audit xác nhận rõ để tránh sửa nhầm khi rebrand.

| File | Hiện tại | Lý do giữ nguyên |
|---|---|---|
| `packages/experience/src/shared/utils/logo.ts` | `getLogoUrl`/`getBrandingLogoUrl` đọc `logoUrl`/`darkLogoUrl` hoàn toàn từ object `branding` truyền vào lúc runtime | Không hardcode nhãn Logto nào; chỉ resolve URL logo do config sign-in-experience cung cấp. Không cần sửa. |
| `packages/experience/src/Providers/AppBoundary/AppMeta.tsx:42` | Logic chọn favicon: ưu tiên `branding.favicon`/`darkFavicon` từ config, fallback về asset mặc định | Xác nhận favicon chủ yếu điều khiển bởi config runtime của tenant; chỉ cần đổi các file asset mặc định (đã liệt kê ở mục 2.2), không cần sửa logic. |
| `packages/experience/index.html:10` | `window.logtoSsr = "__LOGTO_SSR__";` | Định danh placeholder dữ liệu SSR nội bộ, không render ra màn hình, không phải nhận diện thương hiệu. |
| `packages/experience/src/i18n/utils.ts:59` | `const storageKey = 'i18nextLogtoUiLng';` | Tên key localStorage nội bộ, không hiển thị cho người dùng cuối. |
| `packages/schemas/src/seeds/sign-in-experience.ts:32` | `hideLogtoBranding: false,` | Đây là tên field cấu hình (flag) bật/tắt watermark "Powered by Logto" — giữ tên field, chỉ nên xem xét đổi **giá trị mặc định** sang `true` để watermark Logto không hiện ra mặc định (không thuộc phạm vi đổi tên/nhận diện). |
| `render.yaml:13` | `name: logto-database` | Tên database nội bộ, không hiển thị người dùng cuối; có thể giữ nguyên hoặc đổi tuỳ ý, không bắt buộc. |
| `package.json:2` | `"name": "@logto/root"` | Tên workspace root package dùng nội bộ cho tooling pnpm monorepo, không phải chuỗi hiển thị người dùng cuối; đổi phạm vi npm-scope nằm ngoài phạm vi rà soát này. |
| `docker-compose.yml:2` | `# This compose file is for demonstration only, do not use in prod.` | Comment kỹ thuật nội bộ, không bắt buộc dịch. |
| `docker-compose.yml:9` | `DB_URL=postgres://postgres:p0stgr3s@postgres:5432/logto` | Tên database mẫu và mật khẩu demo dùng nội bộ cho docker-compose demo, không phải nhận diện thương hiệu hiển thị. |
| `Dockerfile:2` | `WORKDIR /etc/logto` | Đường dẫn container nội bộ, không hiển thị người dùng cuối. |
| `docker-compose.integration.yml:1` | Service name `logto`, comment kỹ thuật liên quan license/webhook nội bộ | File phục vụ CI/integration test, không hiển thị cho người dùng cuối/operator vận hành sản phẩm. |

---

## 4. Ghi chú về placeholder màu/logo

Các phát hiện thuộc category **`logo_or_favicon_asset`** (24 phát hiện, mục 2.1–2.8) và **`color_token`** (1 phát hiện — `defaultPrimaryColor = '#6139F6'`, mục 2.4) đều sẽ được xử lý theo hai bước:

1. **Bước tạm (hiện tại):** thay bằng **placeholder màu xanh biển/thủy sản** và logo/icon tạm dựng theo tinh thần "ngành thủy sản" — chưa phải logo chính thức của Cục Thủy sản.
2. **Bước hoàn thiện (khi có tài nguyên chính thức):** thay toàn bộ placeholder này bằng **logo thật và bảng màu chính thức của Cục Thủy sản** ngay khi nhận được bộ nhận diện chính thức, đảm bảo đồng bộ trên toàn bộ 24 vị trí logo/favicon và mã màu mặc định `defaultPrimaryColor` nêu trên (đây là màu seed cho mọi tenant mới, ảnh hưởng tới toàn bộ theme mặc định của hệ thống).

---

*Báo cáo được tạo tự động từ dữ liệu rà soát nhận diện Logto trong mã nguồn, phục vụ việc chuẩn bị đổi thương hiệu sang sdvico.*
