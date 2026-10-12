**Người tạo:** claude (phía CBVMS) · **Chủ sở hữu:** thu · **Ai xử lý tiếp:** đội IAM sdvico

# Kế hoạch: thay đổi phía IAM để tích hợp IUU / MKN / CBVMS

Kiến trúc tổng thể: kho `mkn-3`, `docs/draft/plan/2026-10-09-iam-integration-architecture.md`.
Tài liệu này chỉ gồm việc **trong kho Logto**. Mỗi bước có tệp, lệnh, kiểm và tiêu chí đạt.

Quyết định đã chốt (tóm tắt): IAM giữ người, đơn vị, chức danh, phạm vi; mỗi hệ tự quyết ma trận
quyền. Không dùng `organization_scopes`. Cây tổ chức nhiều tầng qua `custom_data.parentOrgId`.
Ba vai trò `role-truong`, `role-pho`, `role-cv`. Id tổ chức viết tắt tiếng Việt (`toan-quoc`, `tinh-qn`, `bp-qn-cr`).

Trạng thái đối chiếu ngày 10/10/2026. Đã commit trên `develop` (chưa push): nhận `-` trong username
(`feat(toolkit)`), màn nhập cán bộ (`feat(console)`), kế hoạch và seed SQL (`docs`), bước 3 phía `core`
(`feat(core)`). Commit `feat(core)` dùng `--no-verify` theo yêu cầu, vì hook `tsc` của `core` hỏng sẵn ở
`phrase.test.ts`, `koa-i18next.test.ts` (bản fork chỉ còn en, vi-VN); eslint và commitlint đã chạy tay, đạt.
Còn nợ: 24 test `core` hỏng sẵn ở 8 bộ (ngôn ngữ và thương hiệu sdvico), chưa sửa.

| # | Việc | Trạng thái |
|---|---|---|
| 1 | Seed vai trò và 435 tổ chức | Xong ở Logto local (kiểm lại 10/10: đủ 435, đúng số từng loại). Chưa chạy máy thật |
| 2 | Chốt nguồn dữ liệu của seed tổ chức | Xong: sửa dòng 3–4, thêm khối "Khuôn id" |
| 3 | IAM Sync API gửi thêm thông tin tổ chức và `external_ids` | Xong ở local: mã + test (8/8), kiểm đầu cuối đạt, tài liệu OpenAPI hợp lệ, `sample-response.json` và hướng dẫn tích hợp đã cập nhật. Chưa triển khai máy thật |
| 4 | Chuyển 48 người dùng NKKT sang cây tổ chức mới | Không cần: IAM thật đang trống (chốt 10/10) |
| 5 | Ứng dụng đăng nhập và M2M cho từng hệ; quyền tối thiểu; đổi secret | Chưa. Đã ghi phát hiện ở 5.2, 5.3 |
| 6 | Cập nhật `docs/SETUP.md` và tài liệu tích hợp | Chưa (`SETUP.md`, `fix-remove-cang-orgs.sql`, `TAI-LIEU-IAM-sdvico.md`) |
| 7 | Nạp cán bộ MKN: MKN xuất CSV, Logto nhập qua màn Console có duyệt tay | Mã xong, thử đạt với Management API local (10/10). **Chưa bấm qua giao diện**. Chưa chạy máy thật |

---

## Bước 1 · Seed vai trò và tổ chức (đã có)

Tệp: `docs/sql/seed-organization-roles.sql`, `docs/sql/seed-organizations.sql`. Chạy theo đúng thứ tự:

```bash
psql -v ON_ERROR_STOP=1 -U postgres -d <db logto> -f docs/sql/seed-organization-roles.sql
psql -v ON_ERROR_STOP=1 -U postgres -d <db logto> -f docs/sql/seed-organizations.sql
```

Kiểm:

```sql
select custom_data->>'type' as type, count(*) from organizations
where tenant_id = 'default' and custom_data ? 'type' and id not like 'org-%' group by 1 order by 2;
```

Đạt: `ROOT 1, CUC 1, KN_VUNG 5, BDBP_TINH 21, BQL_CANG 21, CHI_CUC 23, TINH 23, CANG 122, DON_BP 218`.
Chạy lần 2 không đổi số. Không tổ chức nào có `parentOrgId` trỏ tới id không tồn tại:

```sql
select count(*) from organizations o where tenant_id = 'default' and o.custom_data ? 'parentOrgId'
  and not exists (select 1 from organizations p where p.id = o.custom_data->>'parentOrgId');
-- đạt: 0
```

Đã kiểm ở local ngày 08/10/2026 (Logto local, tenant `default`).

---

## Bước 2 · Chốt nguồn dữ liệu của seed tổ chức

Hiện trạng: `seed-organizations.sql` được **sinh** từ danh mục tỉnh, cảng, đồn của CBVMS. Dòng đầu tệp ghi
"sửa CSV rồi sinh lại", nhưng tệp CSV và script sinh **không còn** (nằm ở thư mục tạm, đã mất). Nếu để
nguyên, người đọc sẽ đi tìm một công cụ không tồn tại.

Đề xuất: **coi `seed-organizations.sql` là nguồn**, sửa tay khi cần (thêm cảng, đổi tên).

Việc:
1. Sửa dòng 3 và 4 của `docs/sql/seed-organizations.sql` thành:
   ```sql
   -- Sinh lần đầu 08/10/2026 từ danh mục tỉnh/cảng/đồn của CBVMS. Từ nay tệp này là nguồn: sửa tay,
   -- giữ khuôn id (mục "Khuôn id" bên dưới). Idempotent: chạy lại cập nhật tên và custom_data.
   ```
2. Thêm khối chú thích "Khuôn id" ngay dưới (bảng ở Phụ lục A).

Kiểm: `grep -n "sửa CSV" docs/sql/seed-organizations.sql` không ra dòng nào.

---

## Bước 3 · IAM Sync API gửi thêm thông tin tổ chức và `external_ids`

**Vì sao:** các hệ cần biết người dùng thuộc **loại đơn vị nào** (`type`), ở tỉnh nào, đồn hay cảng nào,
để tự quy đổi ra quyền. Hiện API chỉ trả `organizations[] { id, name }`. Đã kiểm 08/10: người dùng thử
trong `bp-qn-cr` nhận về `{ "id": "bp-qn-cr", "name": "Trạm KSBP Cái Rồng" }`, mất hết `custom_data`.

Tệp: `packages/core/src/routes/iam-sync.ts`.

### 3.1. Khuôn trả về mới (chỉ THÊM trường, giữ tương thích ngược theo `AGENTS.md`)

```json
{
  "id": "u-…", "username": "…", "name": "…", "status": "active",
  "organizations": [{
    "id": "bp-qn-cr", "name": "Trạm KSBP Cái Rồng",
    "level": "co_so", "type": "DON_BP", "parentOrgId": "bdbp-qn",
    "provinceCode": "22", "sourceCode": "TKSCR",
    "roleTitles": { "TRUONG": "Đồn trưởng", "PHO": "Phó Đồn trưởng", "CHUYEN_VIEN": "Cán bộ" }
  }],
  "roles": [{ "code": "TRUONG", "name": "Trưởng", "organizationId": "bp-qn-cr" }],
  "scopes": [{ "type": "port", "id": "TKSCR" }],
  "external_ids": { "mkn": "…" },
  "updated_at": "…"
}
```

- `roles[].organizationId` (mới): một người kiêm nhiều đơn vị thì biết chức danh nào ở đơn vị nào.
  Hiện mã gộp vai trò của mọi đơn vị vào một danh sách.
- `external_ids`: lấy từ `users.custom_data.externalIds`. Tài liệu `TAI-LIEU-IAM-sdvico.md` mục 2.4
  đã ghi trường này nhưng mã chưa trả.
- Trường nào không có trong `custom_data` thì bỏ khỏi đối tượng (không trả `null`).

### 3.2. Sửa mã

1. `collectSyncUsers`: tham số `visibleOrganizations` đổi kiểu từ `{ id; name }` sang có thêm `customData`
   (`resolveVisibleOrganizations` đang trả nguyên đối tượng tổ chức nên đã có sẵn).
2. Trong vòng lặp: lưu `organizations: Map<orgId, OrganizationMeta>` thay cho `Map<orgId, name>`;
   lưu `roles` kèm `organizationId`.
3. Thêm hàm đọc `custom_data` có kiểm kiểu, theo khuôn `getOrganizationLevel`, `getParentOrgId` đang có:
   `type`, `provinceCode`, `sourceCode` (chuỗi), `roleTitles` (object chuỗi → chuỗi).
4. `syncUserGuard`: thêm các trường mới với `.optional()`; thêm `external_ids: z.record(z.string()).optional()`.
5. Route `GET /iam-sync-preview/users` dùng chung `collectSyncUsers` nên tự có thêm trường; kiểm trang
   Console `packages/console/src/pages/IamSyncUsers` vẫn hiển thị được.

### 3.3. Test

Tệp mới `packages/core/src/routes/iam-sync.test.ts`, theo khuôn `log.test.ts`
(`MockTenant`, `createRequester`). Ca thử:

| Ca | Dữ liệu | Đạt |
|---|---|---|
| Thiếu token / sai audience | | 401 |
| Token không có `iam-sync:read` | | 403 |
| App M2M không thuộc tổ chức nào | | 403 |
| App thuộc `toan-quoc` (`level = trung_uong`) | 2 tổ chức, 2 người | Trả đủ 2 người |
| Thông tin tổ chức | Tổ chức có đủ `custom_data` | Có `type`, `provinceCode`, `sourceCode`, `roleTitles` |
| Tổ chức thiếu `custom_data` | `{}` | Chỉ có `id`, `name`; không lỗi |
| Kiêm nhiệm | 1 người, 2 tổ chức, 2 vai trò | `roles[]` có 2 phần tử, đúng `organizationId` |
| `external_ids` | `custom_data.externalIds = { mkn: "x" }` | `external_ids.mkn = "x"` |

Lệnh (đã chạy 10/10, 8/8 đạt). Jest chạy trên `build/` do tsc sinh ra, nên lệnh cũ
`pnpm test:only src/routes/iam-sync.test.ts` báo "0 matches". Kho đòi pnpm 9 hoặc 10; pnpm 12 tự cài lại
thư viện và sửa `pnpm-lock.yaml`, nên dùng `npx pnpm@10.18.0` nếu máy cài pnpm khác:

```bash
pnpm install --frozen-lockfile && pnpm prepack            # ở gốc kho, lần đầu
cd packages/core && pnpm build:test                       # tsc sang build/; 3 lỗi kiểu có sẵn ở phrase.test.ts, koa-i18next.test.ts
pnpm test:only build/routes/iam-sync.test.js
```

### 3.4. Kiểm đầu cuối ở local

```bash
TOKEN=$(curl -s -X POST http://localhost:3003/oidc/token \
  -u "<app_id>:<app_secret>" -d grant_type=client_credentials \
  -d resource=https://default.logto.app/iam-sync -d scope=iam-sync:read | jq -r .access_token)
curl -s http://localhost:3003/api/iam-sync/v1/users -H "authorization: Bearer $TOKEN" | jq '.data[0].organizations[0]'
```

Đạt: đối tượng tổ chức có `type` và `roleTitles`.

### 3.5. Tài liệu đi kèm

- `docs/sample-response.json`: thêm các trường mới.
- `docs/iam-sync-integration-guide.md`: mô tả các trường mới.
- Đã làm 10/10 hai mục trên. Còn lệch có từ trước, chưa sửa: ví dụ và bảng trong hai tệp có `email` và
  `permissions[]`, nhưng `syncUserGuard` không có hai trường này nên API không trả.
- `AGENTS.md` yêu cầu cập nhật OpenAPI khi đổi API: route này **chưa có** tệp `*.openapi.json`.

**Đã quyết 10/10/2026:**
1. OpenAPI: **làm**. Thêm `packages/core/src/routes/iam-sync.openapi.json` cho cả `GET /api/iam-sync/v1/users` và
   `GET /api/iam-sync-preview/users`, với cơ chế xác thực riêng `IamSyncOAuth2` (resource `iam-sync`, scope
   `iam-sync:read`). Đưa `iamSyncRouter` vào `swagger.json` và `.well-known/management.openapi.json`
   (`routes/init.ts`), thêm `operationId` ở `customRoutes` (`swagger/utils/operation-id.ts`). Đã kiểm trên Logto
   local: cả hai tài liệu hợp lệ theo `swagger-parser`, không trùng `operationId`.
2. `isDevFeaturesEnabled`: **không áp** cho route này. Route đang được các hệ dùng; đặt sau cờ sẽ tắt API ở
   máy chủ mặc định (`DEV_FEATURES_ENABLED` trống).

Phát hiện khi làm: ở chế độ kiểm chặt (`INTEGRATION_TEST=true` hoặc không production), `swagger.json` đang lỗi
500 vì route `permission-audit` (của sdvico) không có tài liệu: "Tag `Permission audit` must have a
description". Lỗi có từ trước, chưa sửa; test tích hợp `swagger-check` của Logto sẽ đỏ vì lỗi này.

---

## Bước 4 · Chuyển 48 người dùng NKKT sang cây tổ chức mới — KHÔNG CẦN

Chốt 10/10/2026: IAM thật đang trống, không có tài khoản nào gắn tổ chức cũ `org-*` để chuyển. 48 tài khoản
NKKT chỉ có trong `seed-nkkt-users.sql` ("Local test only"). Bảng đối chiếu, luật chuyển và tệp
`migrate-legacy-organizations.sql` đã bỏ.

Hệ quả: trên IAM mới chỉ chạy `seed-organization-roles.sql` rồi `seed-organizations.sql`. **Không** chạy các
tệp dựng mô hình cũ: `seed-nkkt-users.sql`, `fix-org-hierarchy.sql`, `fix-org-hierarchy-v2.sql`,
`fix-remove-cang-orgs.sql`, `seed-test-data.sql` (chúng tạo lại `org-*`). `declare-apps.sql` cũng tạo `org-tw`
(xem 5.2).

Còn mở: có cần 48 tài khoản NKKT để thử trên cây mới không. Nếu cần, sửa `seed-nkkt-users.sql` gắn thẳng vào
tổ chức mới.

---

## Bước 5 · Ứng dụng và quyền

### 5.1. Mỗi hệ hai ứng dụng

| Hệ | Đăng nhập (Traditional web) | Đồng bộ (M2M) |
|---|---|---|
| IUU | `web-iuu` | `app-iuu-sync` (đã có, `declare-apps.sql`) |
| MKN | `web-mkn` | `app-mkn-sync` (đã có) |
| CBVMS | `web-cbvms`, Redirect URI `https://cbvms.tongcucthuysan.gov.vn/app-cb/auth/callback` | `app-cbvms-sync` (đã có) |

Câu hỏi mở: CBVMS (kho `mkn-3`) và MKN có phải một hệ? Nếu đúng, bỏ một cặp ứng dụng.

Tạo ứng dụng web bằng Console (Applications → Create → Traditional web). **Không ghi secret vào git.**

### 5.2. Quyền tối thiểu cho ứng dụng M2M

- Chỉ role `machine:iam-sync` (`iam-sync:read`).
- Thành viên `toan-quoc` (`seed-organizations.sql` tự gán mọi app M2M).
- **Không** gán role Management API (`all`): ở Logto local, app "mkn sync" đang có role này, phải gỡ.

Kiểm:

```sql
select a.id, r.name from applications a join applications_roles ar on ar.application_id = a.id
join roles r on r.id = ar.role_id where a.tenant_id = 'default' and a.type = 'MachineToMachine';
-- đạt: mỗi app chỉ một dòng machine:iam-sync
```

Phát hiện 10/10:
- `seed-organizations.sql` gán **mọi** app M2M vào `toan-quoc`. App nào đang bị giới hạn theo tỉnh (vd
  `m2m-iuu-sync` ở `org-qn` trong dữ liệu thử) sẽ thấy toàn quốc sau bước 1. Cần quyết có giữ hành vi này.
- `declare-apps.sql` tạo tổ chức cũ `org-tw` và gán ba app vào đó. Chạy trên IAM mới sẽ dựng lại mô hình cũ.
  Cần đổi sang `toan-quoc` trước khi dùng.
- `declare-apps.sql` lỗi `resources__indicator` trên DB đã tạo resource IAM Sync bằng Console (Logto local:
  resource id `kw8vt2x4gr92yzp5398bg`), vì `on conflict (id)` không bắt trùng `indicator`.
- Logto local 10/10: app "mkn sync" (`01228qn2m4lrvbqwo8142`) giữ ba role: `Logto Management API access`,
  `mkn-sync`, `machine:iam-sync`. Chưa gỡ.

### 5.3. Đổi secret

Secret thử đang nằm trong git (`declare-apps.sql`, `seed-test-data.sql`). Trước khi chạy thật: đổi secret
của cả ba app M2M trên máy chủ thật (Console → Application → App secrets), giao cho từng hệ qua kênh riêng.
Gỡ giá trị secret khỏi hai tệp SQL (thay bằng ghi chú "đặt trên máy chủ"). Secret thật của ba app còn nằm
trong `docs/app-integration-credentials.md` (trong git); `seed-test-data.sql` chỉ có secret thử. Secret đã vào
lịch sử git nên bắt buộc phải đổi, gỡ khỏi tệp chưa đủ.

---

## Bước 6 · Tài liệu

- `docs/SETUP.md` mục 3.5: thay danh sách 5 tệp cũ bằng `seed-organization-roles.sql` rồi
  `seed-organizations.sql` (và `declare-apps.sql` sau khi sửa theo 5.2).
- Ghi chú trong `docs/SETUP.md` và các tệp mô hình cũ (`seed-nkkt-users.sql`, `fix-org-hierarchy*.sql`,
  `fix-remove-cang-orgs.sql`): mô hình "cảng không là tổ chức" đã thay bằng cây mới; **không chạy** trên IAM mới.
- `docs/TAI-LIEU-IAM-sdvico.md` mục 1: cập nhật cây tổ chức.

---

## Bước 7 · Nạp cán bộ MKN vào IAM

Chốt 10/10/2026 (người dùng):
- MKN xuất tệp, Logto nhập "tự động từ tệp nhưng duyệt tay được", giống "Tạo hàng loạt" tài khoản của MKN
  (fe-admin `features/admin/components/bulk/BulkCreateModal.tsx`): màn 4 bước Tệp → Soát → Chạy → Kết quả.
- Mang mật khẩu bcrypt sang. Tệp CSV vì vậy là TỆP MẬT: không gửi qua chat/email, không vào git, xoá sau khi nhập.
- KHÔNG xuất tài khoản nhóm hệ thống (`admin`) và tài khoản khẩn cấp.

Phía MKN (kho `mkn-3`): `code/scripts/export-staff-to-iam.js` (đổi tên từ `xuat-tai-khoan-iam.js`, viết lại).
Chỉ đọc CSDL MKN, ra CSV; cột: `mkn_account_id, username, full_name, email, phone, status, password_bcrypt,
units, role, mkn_groups, mkn_scopes, note`. `units` ghi `LOẠI` hoặc `LOẠI:mã` (tra ngược `oidc.iam.group_map`),
không ghi id Logto.

Phía Logto: trang Console `iam-staff-import` (menu Người dùng › "Nhập cán bộ từ MKN"),
`packages/console/src/pages/IamStaffImport/`. Không thêm API máy chủ: mỗi dòng gọi API có sẵn
(`POST /api/users` với `passwordDigest` + `Bcrypt`, `PATCH .../is-suspended`, `POST /api/organizations/{id}/users`,
`POST .../users/{userId}/roles`), 4 dòng một lúc; dòng hỏng chạy lại được, không tạo trùng.
- Tra đơn vị: `CHI_CUC:22` → tổ chức `type = CHI_CUC`, `provinceCode = 22`; `DON_BP`, `CANG` theo `sourceCode`;
  `CUC` theo `type`. `KN_VUNG` khớp 5 tổ chức nên báo không tìm thấy, người duyệt chọn tay.
- Bước Soát báo từng dòng: đã nhập (`externalIds.mkn` có sẵn, tự bỏ chọn), trùng tên trên IAM hoặc trong tệp
  (chặn), tên đăng nhập đổi (khoảng trắng, ký tự lạ, chữ số, `-` hoặc `.` ở đầu không hợp lệ với Logto: gợi ý thay bằng `_`), email/điện thoại
  bỏ, chưa có tổ chức, không có mật khẩu, trạng thái MKN không ACTIVE (sẽ khoá), ghi chú khi xuất.
- Id người dùng do Logto sinh (không còn `u-mkn-…`); đồng bộ CBVMS nối bằng `external_ids.mkn`.
- Chốt 10/10 (người dùng): Logto nhận username có `-` như MKN. Sửa gốc `usernameRegEx` ở `@logto/core-kit` thành
  `^[A-Z_a-z][\w-]*$` (API quản trị, API tài khoản, trang đăng nhập, Console đều dùng chung); sửa câu thông báo
  bộ ký tự ở `phrases` và `phrases-experience` cho mọi ngôn ngữ. Chỉ nới thêm đầu vào, không đổi dữ liệu cũ.
- Chốt 12/10 (người dùng): Logto nhận cả `.` trong username (vd `nguyen.van`). `usernameRegEx` thành
  `^[A-Z_a-z][\w.-]*$`; câu thông báo bộ ký tự ở mọi ngôn ngữ thêm dấu chấm. `.` ở đầu vẫn không hợp lệ.

Đã kiểm 10/10 trên máy local:
- Script xuất trên `mknv3`: 8 cán bộ, xuất 7, bỏ `admin` (nhóm hệ thống); thiếu `--out` thì dừng.
- `pnpm jest src/pages/IamStaffImport` (console): 15/15. `tsc --noEmit` và eslint các tệp mới: sạch.
- Chạy chính các module của màn nhập với Management API Logto local và tệp vừa xuất: 6 dòng đạt, 1 dòng chặn đúng
  `USERNAME_TAKEN`; tổ chức + `role-cv` đúng; soát lại cùng tệp thì mọi dòng đã nhập hiện "đã nhập" và bỏ chọn;
  mật khẩu cũ `admin@111` xác minh được (204), sai thì 422. Đã xoá người dùng thử.
- CHƯA KIỂM: bấm qua giao diện Console (cần tài khoản quản trị Console); chạy trên máy thật.

Chạy trên máy thật (người vận hành):
1. MKN: `DB_NAME=… DB_PASSWORD=… node code/scripts/export-staff-to-iam.js --out <tệp ngoài kho>`.
2. Chuyển tệp qua kênh riêng. Console IAM › Người dùng › Nhập cán bộ từ MKN › chọn tệp › soát › Nhập.
3. Tải CSV kết quả (không có mật khẩu) để lưu hồ sơ và báo cán bộ bị đổi tên đăng nhập. Xoá tệp nguồn.

---

## Phụ lục A · Khuôn id tổ chức

| Loại (`type`) | Khuôn | Ví dụ |
|---|---|---|
| `ROOT` | `toan-quoc` | |
| `CUC` | `cuc-tskn` | |
| `KN_VUNG` | `cckn-v<số>` | `cckn-v1` |
| `TINH` | `tinh-<viết tắt tỉnh>` | `tinh-qn` |
| `CHI_CUC` | `ccts-<tỉnh>` | `ccts-qn` |
| `BDBP_TINH` | `bdbp-<tỉnh>` | `bdbp-qn` |
| `BQL_CANG` | `bqlc-<tỉnh>` | `bqlc-qn` |
| `DON_BP` | `bp-<tỉnh>-<chữ đầu tên>` | Trạm KSBP Cái Rồng → `bp-qn-cr` |
| `CANG` | `cang-<tỉnh>-<chữ đầu tên>` | Bạch Long Vỹ → `cang-hp-blv` |

Viết tắt tỉnh theo `province.abbr` của CBVMS, viết thường. Tên bỏ dấu, bỏ chữ chỉ loại (Trạm, KSBP, BPCK,
Đồn, Cảng, Bến, KNĐ). Tên một chữ thì giữ cả chữ. Trùng trong cùng tỉnh thì giữ đủ chữ cuối. Tối đa 21 ký tự.
