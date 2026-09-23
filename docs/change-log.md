# Nhật ký thay đổi — Rebrand Logto → sdvico + Locale vi-VN

> Tổng hợp từ báo cáo của các agent đã chạy song song trên repo `D:\Danh Thu\github\sdvico\logto`.
> Ngày tổng hợp: 2026-09-22.

---

## 1. Danh sách file đã tạo/sửa, gom theo package

### 1.1. packages/console

- `packages/console/src/consts/tenants.ts` — đổi `mainTitle` → `'sdvico Cloud'` / `'sdvico Console'`; `name: 'Logto Development plan'` → `'sdvico Development plan'`.
- `packages/console/src/hooks/use-inkeep-configs.ts` — `organizationDisplayName` → `'sdvico'`; `aiAssistantName` → `'sdvico AI'`.
- `packages/console/src/components/Region/index.tsx` — `displayName: 'Logto Cloud (Public)'` → `'sdvico Cloud (Public)'`.
- `packages/console/src/assets/images/logo.svg` — thay bằng SVG placeholder "sdvico" (giữ viewBox gốc, gradient #0B5FA5 → #17A398, có comment PLACEHOLDER).
- `packages/console/src/assets/images/cloud-logo.svg` — thay bằng SVG placeholder "sdvico Cloud" (giữ viewBox gốc, cùng bảng màu, có comment PLACEHOLDER).

### 1.2. packages/experience

- `packages/experience/src/shared/components/LogtoSignature/index.tsx` — `logtoUrl` → placeholder `'#'`; `aria-label` → "Powered By sdvico"; text hiển thị → "Powered by sdvico".
- `packages/experience/src/shared/assets/icons/logto-logo-light.svg` — SVG placeholder "sdvico" (theme sáng), có comment PLACEHOLDER.
- `packages/experience/src/shared/assets/icons/logto-logo-dark.svg` — SVG placeholder "sdvico" (theme tối), có comment PLACEHOLDER.
- `packages/experience/src/utils/sign-in-experience.ts` — fallback title `'Logto'` → `'sdvico'`.
- *Không đổi:* `logto-logo-shadow.svg` (không thuộc phạm vi yêu cầu, vẫn dùng cho static/highlight guard).

### 1.3. packages/core

- `packages/core/src/libraries/saml-application/utils.ts` — `organizationName: 'Logto'` → `'Sdvico'`; `commonName: 'logto.io'` → `'auth.sdvico.local'` (placeholder, cần domain thật khi vận hành).
- `packages/core/src/libraries/hook/utils.ts` — header `user-agent` → `'Sdvico (https://sdvico.local/)'`.
- `packages/core/src/routes/swagger/consts.ts` — viết lại mô tả Markdown (`managementApiAuthDescription`, `userApiAuthDescription`): "Logto…" → "sdvico…"; các link `docs.logto.io`, `cloud.logto.io`, `*.logto.app` → placeholder `docs.sdvico.local`, `cloud.sdvico.local`, `*.sdvico.local`.

### 1.4. packages/schemas

- `packages/schemas/src/seeds/sign-in-experience.ts` — `defaultPrimaryColor` `#6139F6` → `#0B5FA5` (placeholder, có comment); `logoUrl`/`darkLogoUrl` của tenant mặc định và admin tenant → `https://sdvico.local/logo*.svg` (placeholder, chờ logo chính thức).

### 1.5. packages/cli

- `packages/cli/src/commands/install/utils.ts` — 4 chuỗi UI (prompt tạo instance, cảnh báo Postgres, thông báo lỗi, "Happy hacking!") đổi "Logto" → "sdvico".
- `packages/cli/src/utils.ts` — thông báo lỗi "does not contain a sdvico instance"; prompt "Where is your sdvico instance?".
- `packages/cli/src/index.ts` — describe "The Postgres URL to sdvico database"; "Print sdvico CLI version".
- `packages/cli/src/commands/install/index.ts` — 4 describe (download/path/skip seeding/URL) đổi "Logto" → "sdvico"; *giữ nguyên* "Init Logto for cloud" (ngoài phạm vi yêu cầu).

### 1.6. packages/connectors

- `packages/connectors/connector-logto-social-demo/src/constant.ts` — `name.en` → "SDVICO Social Demo".
- `packages/connectors/connector-logto-social-demo/logo.svg` — SVG placeholder mới, có comment PLACEHOLDER.
- `packages/connectors/connector-logto-email/src/constant.ts` — "Logto" → "SDVICO" ở toàn bộ 16 locale trong `name`.
- `packages/connectors/connector-logto-email/logo.svg` — SVG placeholder mới, có comment PLACEHOLDER.
- `packages/connectors/connector-logto-email/logo-dark.svg` — SVG placeholder bản dark, có comment PLACEHOLDER.
- `packages/connectors/connector-mailgun/src/constant.ts` — 4 template subject/html mặc định đổi "Logto" → "sdvico".
- `packages/connectors/connector-mailjunky/src/constant.ts` — `placeholder: 'Logto'` + 9 template subject/content → "sdvico".
- `packages/connectors/connector-sendgrid-email/src/constant.ts` — `placeholder: 'Logto'` + 9 template subject/content → "sdvico".
- `packages/connectors/connector-smtp/src/constant.ts` — 9 template subject/content + `placeholder: '<Logto-SMTP>'` → `'<sdvico-SMTP>'`.
- `packages/connectors/connector-smtp2go-email/src/constant.ts` — `placeholder: 'Logto'` + 9 template subject/content → "sdvico".
- *Không đổi (logo bên thứ ba, đúng nguyên tắc):* `connector-mailgun/logo.png`, và các `logo.svg` riêng của MailJunky/SendGrid/SMTP/SMTP2GO.

### 1.7. packages/demo-app, device-demo-app, elements, account (misc)

- `packages/demo-app/index.html` — `<title>` "Logto Live Preview" → "sdvico Live Preview".
- `packages/demo-app/src/DevPanel.tsx` — "Logto config" → "App config".
- `packages/device-demo-app/index.html` — `<title>` "Logto Device Flow Demo" → "sdvico Device Flow Demo".
- `packages/device-demo-app/src/assets/sdvico-icon.svg` — SVG placeholder mới (thay cho `logto-icon.svg`).
- `packages/device-demo-app/src/assets/sdvico-logo-light.svg`, `sdvico-logo-dark.svg`, `sdvico-logo-shadow.svg` — SVG placeholder mới (thay cho bộ `logto-logo-*.svg`).
- `packages/device-demo-app/src/App.tsx` — import icon đổi sang `sdvico-icon.svg`; `alt="Logto"` → `alt="sdvico"`.
- `packages/device-demo-app/src/Footer.tsx` — import 3 logo đổi sang `sdvico-logo-*.svg`; `alt`/`aria-label` đổi sang "sdvico"; link Logto → placeholder domain `https://sdvico.example.com/...`.
- `packages/elements/index.html` — `<title>` "Logto elements dev page" → "sdvico elements dev page".
- `packages/account/README.md` — mô tả "The Logto account center app..." → "The sdvico account center app...".
- *Ghi chú:* file `logto-icon.svg` và bộ `logto-logo-*.svg` cũ trong `device-demo-app` vẫn còn trên đĩa (không xoá, chỉ không còn được import) — có thể dọn sau nếu muốn.

### 1.8. Gốc repo

- `assets/sdvico-logo-light.svg` — tạo mới, SVG placeholder logo sdvico (nền sáng), comment PLACEHOLDER, màu #0B5FA5/#17A398.
- `assets/sdvico-logo-dark.svg` — tạo mới, SVG placeholder logo sdvico (nền tối).
- `README.md` — dịch toàn bộ sang tiếng Việt; heading "# Logto" → "# sdvico"; đổi logo sang 2 SVG mới; xoá badge/link chỉ dành cho dịch vụ Logto gốc (Discord, cloud.logto.io, codecov, gitpod, render deploy cũ, Twitter/X, mailto liên hệ, docs/blog/newsletter/auth-wiki, mục "Support Logto"); đổi badge checks/release sang `github.com/sdvico/logto`; đổi tên project docker-compose `-p logto` → `-p sdvico`; *giữ nguyên* lệnh `npm init @logto` (không đổi package scope).
- `AWESOME.md` — dịch dòng chú thích đầu file sang tiếng Việt (ghi rõ đây là danh sách kế thừa từ Logto gốc, cần rà lại khi dùng cho sdvico); *giữ nguyên* phần danh sách tài nguyên tiếng Anh gốc.
- `render.yaml` — `name: logto` → `name: sdvico`; `repo` đổi sang `https://github.com/sdvico/logto.git`.
- `docker-compose.yml` — thêm comment tiếng Việt giải thích dòng `image: svhd/logto:${TAG-latest}` là image Docker Hub công khai của Logto gốc, cần build/publish image riêng cho sdvico; *dòng image giữ nguyên* theo yêu cầu.
- `docs/design-tokens.md` — tạo mới, tài liệu design tokens placeholder (bảng màu #0B5FA5/#08466C/#17A398/#F4F8FA/#D7E3E8/#10242B/#4B6570 kèm ước tính tương phản WCAG, mô tả wordmark "sdvico" tạm thời, liệt kê toàn bộ đường dẫn logo/icon cần thay khi có bộ nhận diện chính thức).

### 1.9. packages/phrases — locale vi-VN mới (errors)

Tạo mới 33 file dịch tại `packages/phrases/src/locales/vi-vn/errors/` (toàn bộ: account-center, action, application, auth, connector, custom-profile-fields, domain, entity, guard, hook, jwt-customizer, license, localization, log, oidc, one-time-token, organization, password, request, resource, role, scope, secrets, session, sign-in-experiences, single-sign-on, storage, subscription, swagger, system-limit, user, verification-code, verification-record). File `index.ts` chỉ re-export, copy nguyên văn. "Logto Management API" → "sdvico Management API"; "forbidden by Logto" → "bị sdvico cấm".

### 1.10. packages/phrases — locale vi-VN mới (translation/admin-console và translation gốc)

Tạo mới toàn bộ các file dịch dưới `packages/phrases/src/locales/vi-vn/translation/admin-console/` và `packages/phrases/src/locales/vi-vn/translation/`, gồm (không giới hạn): actions, api-resource-details, api-resources, application-details, applications, cloud, components, concurrent-device-limit, connector-details, connectors, contact, dashboard, domain, enterprise-sso-details, enterprise-sso, enterprise-subscription, errors, general, get-started, guide, index, inkeep-ai-bot, invitation, jwt-claims, log-details, logs, menu, mfa, oidc-configs, organization-details, organization-role-details, organization-template, organizations, oss-onboarding, permissions, profile, protected-app, role-details, roles, security, session-expired, sign-in-exp/(content, custom-profile-fields, index, sign-up-and-sign-in), signing-keys, subscription/(index, quota-item, quota-table, usage), system-limit, tab-sections, tabs, tenant-members, tenants, topbar, upsell/(add-on, featured-plan-content, index, paywall), user-details, user-identity-details, users, webhook-details, webhooks, welcome, demo-app, oidc, translation/index.ts, và `vi-vn/index.ts` (gốc).

Tất cả chuỗi hiển thị có "Logto" với vai trò tên sản phẩm đã dịch và đổi thành "sdvico" (giữ chữ thường trừ khi đầu câu). Key kỹ thuật (`logto_endpoint`, `col_logto_claims`, import path `.js`) giữ nguyên. Ví dụ đổi tên riêng: "Logto Cloud" → "sdvico Cloud", "Logto team" → "nhóm sdvico", "Logto Management API" → "Management API của sdvico".

*Ghi chú từ agent:* một phần thư mục `vi-vn/` đã tồn tại sẵn từ trước khi các agent này chạy (không rõ do agent khác tạo trước đó trong cùng đợt) — đã rà soát và xác nhận không còn sót chữ "Logto" nào trong toàn bộ cây `vi-vn`.

### 1.11. packages/phrases-experience — locale vi-VN mới

Tạo mới 15 file tại `packages/phrases-experience/src/locales/vi-vn/`: account-center, action, description, development-tenant, error/index, error/password-rejected, index, input, list, mfa, passkey-sign-in, profile, secondary, step-up, user-scopes.

Không file nào trong nhóm này có chuỗi hiển thị chứa "Logto" là tên sản phẩm; key kỹ thuật `urn:logto:scope:*` và import `@logto/core-kit` giữ nguyên.

### 1.12. Wire-up locale vi-VN vào hệ thống

- `packages/phrases/src/index.ts` — thêm import `viVN` từ `./locales/vi-vn/index.js` (chèn sau `tr-TR`, trước `zh-CN` theo đúng thứ tự alphabet thực tế trong file); thêm `'vi-VN'` vào `builtInLanguages`; thêm `'vi-VN': viVN` vào `resource`.
- `packages/phrases-experience/src/index.ts` — thêm import `viVN` từ `./locales/vi-vn/index.js` (chèn sau `uk-ua`, trước `zh-cn`); thêm `'vi-VN'` vào `builtInLanguages`; thêm `'vi-VN': viVN` vào `resource`.

---

## 2. Cần xử lý thủ công sau

### 2.1. File nhị phân (.ico/.png) chưa thể tự tạo lại — cần thiết kế viên

Các file sau vẫn mang icon/màu Logto gốc, không thể sửa bằng công cụ text/agent, cần thiết kế viên tạo lại thủ công bằng bộ màu placeholder (#0B5FA5 / #17A398 / #F4F8FA), và thay bằng bộ nhận diện chính thức khi Cục Thủy sản cung cấp:

- `packages/demo-app/src/favicon.ico`
- `packages/demo-app/src/apple-touch-icon.png`
- `packages/device-demo-app/src/favicon.ico`
- `logo.png` (gốc repo) — README đã bỏ tham chiếu tới file này (chuyển sang 2 SVG mới ở `assets/`), nhưng file cũ vẫn còn trên đĩa, chưa xoá.
- `packages/connectors/connector-mailgun/logo.png` — không thuộc phạm vi rebrand vì là logo Mailgun (bên thứ ba), giữ nguyên, không cần thiết kế viên xử lý.

### 2.2. Toàn bộ màu/logo hiện là PLACEHOLDER

Nhắc lại: mọi màu sắc (#0B5FA5 xanh biển, #17A398 xanh ngọc, #F4F8FA, #08466C, #D7E3E8, #10242B, #4B6570), mọi SVG logo/wordmark "sdvico" mới tạo trong toàn bộ các package trên (console, experience, connectors, demo-app, device-demo-app, gốc repo) đều là PLACEHOLDER tạm thời, chưa phải bộ nhận diện chính thức. Cần thay thế toàn bộ khi Cục Thủy sản cung cấp bộ nhận diện thương hiệu chính thức. Danh sách đầy đủ đường dẫn logo/icon cần thay đã được liệt kê chi tiết tại `docs/design-tokens.md`.

### 2.3. Domain/URL placeholder cần domain thật khi vận hành

- `auth.sdvico.local` (SAML commonName, packages/core)
- `https://sdvico.local/` (user-agent header, packages/core)
- `docs.sdvico.local`, `cloud.sdvico.local`, `*.sdvico.local` (swagger consts, packages/core)
- `https://sdvico.local/logo*.svg` (seed sign-in-experience, packages/schemas)
- `https://sdvico.example.com/...` (Footer link, device-demo-app)
- `github.com/sdvico/logto` (README badge/link, render.yaml repo) — cần xác nhận đây đúng là địa chỉ repo GitHub thật sẽ dùng.
- `image: svhd/logto:${TAG-latest}` (docker-compose.yml) — hiện vẫn kéo image Docker Hub công khai của Logto gốc; cần build và publish image Docker riêng cho sdvico rồi cập nhật lại dòng này.

### 2.4. Điểm agent báo thiếu/không chắc/cần lưu ý thêm

- `AWESOME.md` — chỉ dịch dòng chú thích đầu file; toàn bộ danh sách tài nguyên bên dưới vẫn là nội dung tiếng Anh của cộng đồng Logto gốc, cần rà lại thủ công nếu muốn dùng cho sdvico (loại bỏ resource không còn phù hợp, cập nhật resource riêng của sdvico nếu có).
- File `logto-icon.svg` và bộ `logto-logo-*.svg` cũ trong `packages/device-demo-app/src/assets/` chưa bị xoá (chỉ không còn được import) — nên dọn dẹp sau nếu không cần giữ lại để đối chiếu.
- `packages/phrases/src/locales/vi-vn/translation/admin-console/index.ts` và một số file khác trong nhóm 1.10 được một agent phát hiện là đã tồn tại sẵn từ trước khi agent đó bắt đầu chạy — nghĩa là có khả năng một tiến trình/đợt chạy khác (ngoài danh sách báo cáo ở đây) đã tạo trước. Nên rà soát lại toàn bộ `packages/phrases/src/locales/vi-vn/` và `packages/phrases-experience/src/locales/vi-vn/` một lượt cuối để chắc chắn không có file nào bị bỏ sót hoặc ghi đè sai.
- `render.yaml` đổi `repo` sang `https://github.com/sdvico/logto.git` — cần xác nhận repo GitHub này đã tồn tại/đúng tên, nếu không Render sẽ không deploy được.
- Locale vi-VN mới chưa được kiểm tra hiển thị thực tế trên UI (console/experience) — chỉ được tạo và dịch theo cấu trúc key, chưa xác nhận layout/độ dài chuỗi tiếng Việt không vỡ giao diện.

---

## 3. Chưa kiểm tra build

Do repo có quy mô lớn và số lượng file bị sửa/dịch hàng loạt (hàng trăm file trên nhiều package: console, experience, core, schemas, cli, connectors, demo-app, device-demo-app, elements, account, phrases, phrases-experience), các agent đã không chạy `pnpm install`, `pnpm build`, hay type-check để xác nhận:

- Không có lỗi cú pháp TypeScript/JSON sau khi sửa hàng loạt chuỗi văn bản.
- Các file locale `vi-vn` mới tạo khớp đúng interface `LocalePhrase` / `DeepPartial<LocalePhrase>` (đủ key, đúng kiểu, không thiếu import).
- Import path và package scope `@logto/*` không bị ảnh hưởng ngoài ý muốn.
- SVG placeholder mới không vỡ định dạng (viewBox, namespace) khi build asset.

Việc bắt buộc trước khi coi tác vụ rebrand + locale vi-VN này là hoàn tất:

1. Chạy `pnpm install` tại gốc repo để đảm bảo dependency graph còn nguyên vẹn.
2. Chạy `pnpm -r build` (hoặc build từng package: console, experience, core, schemas, cli, connectors, phrases, phrases-experience) để bắt lỗi cú pháp/type.
3. Chạy type-check riêng cho `packages/phrases` và `packages/phrases-experience` (nơi có khối lượng file locale mới lớn nhất) để xác nhận `vi-vn/index.ts` khớp đúng type `LocalePhrase`.
4. Chạy thử console/experience ở môi trường dev, chuyển ngôn ngữ sang `vi-VN`, kiểm tra bằng mắt các màn hình chính (đăng nhập, đăng ký, dashboard admin) để phát hiện chuỗi dịch bị vỡ layout hoặc thiếu key (hiển thị fallback tiếng Anh).

Chưa có bước nào trong 4 mục trên được thực hiện tại thời điểm tổng hợp báo cáo này.
