# Thiết kế: IAM Admin API cho trang Người dùng IAM và Ứng dụng IAM

Trạng thái: **đã code cả ba đợt, đã kiểm đầu-cuối trên Logto local** (12/10/2026). Phục vụ bản thiết kế "IAM thay console Logto"
(trang `/iam/users`, `/iam/apps` trên CBVMS). Người dùng đã chọn: dựng API riêng, scope hẹp, giống
IAM Sync API; **không** cấp quyền `all` của Management API cho CBVMS.

Tài liệu này thay mục 8 và mục 9 ("CBVMS chỉ đọc") của
`mkn-3/docs/draft/plan/2026-10-09-iam-integration-architecture.md`: CBVMS nay được sửa người dùng IAM
và quản lý ứng dụng, nhưng chỉ qua các endpoint dưới đây.

## 1. Xác thực

- API Resource mới: `https://<tenantId>.logto.app/iam-admin`, token `client_credentials`.
- Bốn scope, gán qua Role M2M riêng cho từng hệ:

| Scope | Cho phép |
|---|---|
| `iam-admin:users:read` | Xem danh sách, chi tiết; cây đơn vị; chức danh |
| `iam-admin:users:write` | Tạo, sửa, tạm khoá, đặt lại mật khẩu, xoá; gán đơn vị và chức danh |
| `iam-admin:apps:read` | Xem danh sách ứng dụng |
| `iam-admin:apps:write` | Tạo, xoá ứng dụng |

- Chỉ M2M app (`sub === clientId`) mới gọi được, như IAM Sync.
- App gọi phải là thành viên tổ chức `level = trung_uong`. Không phải → 403. Trang này là
  bản thay console, nên chỉ hệ trung ương được dùng; không có chế độ thấy theo tỉnh.
- Người thao tác: CBVMS gửi `X-Iam-Actor: <account.username>` và `X-Iam-Actor-Id: <account.id>` ở mọi
  lệnh ghi (tên đăng nhập đổi được, mã thì không). Logto ghi cả hai vào nhật ký (`logs.payload.actor`)
  cùng `applicationId`. Thiếu `X-Iam-Actor` ở lệnh ghi → 400; thiếu `X-Iam-Actor-Id` thì vẫn nhận.

- `X-Iam-Actor` gửi dạng `encodeURIComponent(username)` vì header chỉ nhận ASCII; IAM giải mã trước khi
  ghi nhật ký. Nhật ký: bảng `logs`, key `IamAdmin.<User|System>.<Hành động>`, `payload.actor = {username, id}`.

Tiền tố mọi đường dẫn: `/api/iam-admin/v1`.

Lỗi theo dạng sẵn có của Logto: `{ code, message, data?, details? }`. `message` luôn dịch theo `code`, nên
chi tiết máy đọc được nằm ở chỗ khác:

| Mã HTTP | `code` | Chi tiết |
|---|---|---|
| 400 | `guard.invalid_input` | Body sai: `data.issues` (Zod). Thiếu `X-Iam-Actor`: message "The request header X-Iam-Actor is invalid." |
| 400 | `entity.not_exists` | Mã chức danh lạ, hoặc chưa khai Role `machine:iam-sync`: message nêu tên |
| 403 | `auth.forbidden` | `data.reason`: `not_machine_to_machine`, `missing_scope:<scope>`, `not_nationwide`, `caller_system`, `iam_admin_system` |
| 404 | `entity.not_found` | Người dùng, đơn vị, thành viên hoặc hệ không có |
| 409 | `entity.unique_integrity_violation` | Mã hệ đã có: `data.system` |
| 422 | `user.username_already_in_use`, `user.email_already_in_use`, `user.phone_already_in_use` | Trùng định danh |

## 2. Người dùng

| # | Phương thức, đường dẫn | Scope | Màn hình |
|---|---|---|---|
| U1 | `GET /users` | users:read | 1, 7 |
| U2 | `GET /user-stats` | users:read | 1, 7 (thẻ KPI) |
| U3 | `GET /users/:id` | users:read | 2, 3, 8 |
| U6 | `POST /users` | users:write | 5 |
| U7 | `PATCH /users/:id` | users:write | 2 |
| U8 | `PUT /users/:id/suspension` | users:write | 6 |
| U9 | `POST /users/:id/password-reset` | users:write | 6 |
| U10 | `DELETE /users/:id` | users:write | 6 |
| U11 | `PUT /users/:id/organizations/:orgId` | users:write | 3 |
| U12 | `DELETE /users/:id/organizations/:orgId` | users:write | 3 |
| O1 | `GET /organizations` | users:read | 3, 5 (cây đơn vị) |
| O2 | `GET /organization-roles` | users:read | 3, 5 |

### U1 `GET /users`

Query: `search` (họ tên, tên đăng nhập, email, số điện thoại; không phân biệt hoa thường), `organizationId`,
`roleCode`, `status` = `active` | `suspended` | `no-organization`, `page` (từ 1), `pageSize` (≤ 100, mặc
định 20), `sort` = `lastSignIn` (mặc định) | `name` | `createdAt`.

```json
{
  "data": [{
    "id": "u-mkn-4f1a9c03b27e5d18", "username": "an.nv", "name": "Nguyễn Văn An",
    "email": "an.nv@tongcucthuysan.gov.vn", "phone": "0912345678", "status": "active",
    "organizations": [{ "id": "bp-qn-cr", "name": "Đồn BP Cái Rồng", "type": "DON_BP",
                        "roles": [{ "code": "TRUONG", "title": "Trưởng" }] }],
    "lastSignInAt": "2026-10-12T01:42:00.000Z",
    "lastSignInApplication": { "id": "vmsalert-web", "name": "VMS Alert" }
  }],
  "total": 1326
}
```

`roles[].title` lấy từ `roleTitles` của tổ chức, không có thì lấy tên vai trò. `lastSignInApplication`
lấy từ bản ghi nhật ký đăng nhập thành công mới nhất; không có thì `null`.

### U2 `GET /user-stats`

Không đặt dưới `/users/` vì sẽ trùng với `GET /users/:id`.

`{ "total": 1326, "active": 1291, "suspended": 23, "noOrganization": 12, "organizations": 435 }`

### U3 `GET /users/:id`

Như một phần tử của U1, thêm: `createdAt`, `updatedAt`, `passwordUpdatedAt` (cột `users.password_updated_at`; `null` nếu chưa đặt), `hasPassword`,
`externalIds` (từ `custom_data.externalIds`), và mỗi tổ chức có thêm `path` (tên các tổ chức cha theo
`parentOrgId`, từ gốc xuống), `provinceCode`, `sourceCode`.

### U6 `POST /users`

```json
{ "name": "…", "username": "…", "email": "…", "phone": "…",
  "password": { "mode": "generate" } | { "mode": "set", "value": "…" },
  "organization": { "id": "…", "roleCodes": ["CHUYEN_VIEN"] } }
```

`username`, `name`, `password` bắt buộc. Mật khẩu tự nhập: tối thiểu 8 ký tự, có chữ và số, cộng chính
sách mật khẩu của Logto. Trùng tên đăng nhập, email, số điện thoại → 422 với `code` của Logto. Trả 201
`{ "user": <U3>, "temporaryPassword": "…" | null }`. Mật khẩu tạm chỉ trả ở lần này.

### U7 `PATCH /users/:id`

Body (đều tuỳ chọn): `name`, `username`, `email`, `phone`. `null` để xoá email, số điện thoại. Trả U3.

### U8 `PUT /users/:id/suspension`

`{ "suspended": true, "reason": "…" }`. Khoá thì thu hồi mọi phiên (Logto đã làm khi đặt
`isSuspended`). `reason` ghi nhật ký. Trả U3.

### U9 `POST /users/:id/password-reset`

`{ "revokeSessions": true }`. Sinh mật khẩu tạm, trả `{ "temporaryPassword": "…" }` một lần.

### U10 `DELETE /users/:id`

204. Nhật ký cũ giữ nguyên.

### U11, U12 đơn vị và chức danh

`PUT /users/:id/organizations/:orgId` body `{ "roleCodes": ["TRUONG"] }`: thêm vào đơn vị nếu chưa có,
rồi thay toàn bộ chức danh ở đơn vị đó. `roleCodes` rỗng → 400 (rời đơn vị thì dùng U12). Trả U3.
`DELETE …/organizations/:orgId` → 204.

### O1 `GET /organizations`

Trả cả 435 tổ chức một lần, không phân trang: `{ "data": [{ "id", "name", "type", "level",
"parentOrgId", "provinceCode", "sourceCode", "roleTitles", "memberCount" }] }`. CBVMS tự dựng cây.

### O2 `GET /organization-roles`

`{ "data": [{ "code": "TRUONG", "name": "Trưởng" }] }`.

## 3. Ứng dụng

Một **hệ** gồm N ứng dụng, mỗi ứng dụng là một trong bốn loại của Logto: `traditional` (web có máy chủ
giữ secret), `spa`, `native`, `m2m`. Các ứng dụng nối với hệ bằng `applications.custom_data.system`
(chuỗi, ví dụ `vmsalert`). Ứng dụng chưa có `system` hiện thành một hệ riêng, tên theo tên ứng dụng.
Loại `Protected`, `SAML` của Logto không quản lý ở đây.

IAM chỉ dùng cho cán bộ; ứng dụng của chủ tàu, thuyền trưởng không đăng nhập qua IAM và không có ở đây.

Ví dụ trên Logto local (12/10/2026), hệ VMS Alert gồm: `70ahnjolk35135otznbu9` (app đăng nhập, spa),
`01228qn2m4lrvbqwo8142` (app đồng bộ, m2m, `machine:iam-sync`; giữ thêm quyền `all` của Management API theo
quyết định của người dùng) và `app-vmsalert-admin` (m2m, `machine:iam-admin`). Id trên prod khác, người
dùng tự đọc trên máy chủ.

| # | Phương thức, đường dẫn | Scope |
|---|---|---|
| A1 | `GET /systems` | apps:read |
| A2 | `POST /systems` | apps:write |
| A3 | `DELETE /systems/:system` | apps:write |
| A4 | `GET /applications/:id` | apps:read |

Tạo và xoá theo **hệ**: màn tạo hệ tạo mọi ứng dụng trong một lần bấm, màn xoá hệ xoá cả hệ. Làm theo hệ
thì không còn ứng dụng mồ côi khi một nửa lệnh hỏng.

### A1 `GET /systems`

```json
{ "data": [{
  "system": "vmsalert", "name": "VMS Alert", "description": "…", "isCaller": true,
  "apps": [{ "id": "vmsalert-web", "name": "VMS Alert", "type": "traditional",
             "hasSecret": true, "roles": [], "createdAt": "…" }]
}] }
```

`hasSecret`: `true` với `traditional`, `m2m`; `false` với `spa`, `native` (client công khai, đăng nhập bằng
PKCE, `token_endpoint_auth_method = none`). `roles`: tên các Role M2M gán cho app, ví dụ
`["machine:iam-sync"]`. `isCaller` = hệ chứa app đang gọi.

### A2 `POST /systems`

```json
{ "system": "baocao", "name": "Cổng báo cáo tỉnh", "description": "…",
  "apps": [
    { "type": "traditional", "name": "Cổng báo cáo tỉnh",
      "redirectUris": ["https://baocao.example.gov.vn/callback"], "postLogoutRedirectUris": [] },
    { "type": "spa", "name": "…", "redirectUris": ["…"], "postLogoutRedirectUris": [],
      "corsAllowedOrigins": ["https://baocao.example.gov.vn"] },
    { "type": "native", "name": "…", "redirectUris": ["vn.sdvico.baocao://callback"] },
    { "type": "m2m", "name": "…", "roles": ["machine:iam-sync"] }
  ] }
```

- `system`: `[a-z0-9-]{2,40}`, chưa có hệ nào dùng → không thì 409. `apps` có 1 tới 10 phần tử.
- `redirectUris` bắt buộc (ít nhất một) với `traditional`, `spa`, `native`; không nhận với `m2m`. Kiểm bằng
  `validateRedirectUrl` của `@logto/core-kit`, như Logto Console: `native` dùng kiểu `mobile` (nhận scheme
  riêng của app), loại còn lại dùng kiểu `web`. `postLogoutRedirectUris` kiểm cùng cách, không bắt buộc.
- `corsAllowedOrigins` chỉ nhận với `spa`; ghi vào `customClientMetadata.corsAllowedOrigins`.
- `roles` chỉ nhận với `m2m` và chỉ được chứa `machine:iam-sync`; giá trị khác → 400. **Không bao giờ**
  gán `machine:iam-admin` hay scope `iam-admin:*` qua API: quyền quản trị chỉ cấp bằng SQL
  (`docs/sql/declare-iam-admin.sql`). Nếu không, một hệ tạo qua trang này sẽ tự tạo được hệ có quyền quản
  trị. App m2m có `machine:iam-sync` được thêm làm thành viên `toan-quoc`.
- Tạo lần lượt từng app; một bước hỏng thì xoá các app đã tạo rồi trả lỗi.

Trả 201:

```json
{ "issuer": "https://…/oidc",
  "apps": [{ "name": "…", "type": "m2m", "clientId": "…", "clientSecret": "…" | null,
             "resource": "https://<tenantId>.logto.app/iam-sync" | null,
             "scope": "iam-sync:read" | null }] }
```

Cùng thứ tự với `apps` gửi lên. `clientSecret` chỉ trả lần này, `null` với `spa`, `native`. `resource`,
`scope` chỉ có với app m2m mang `machine:iam-sync`.

### A3 `DELETE /systems/:system`

Xoá mọi ứng dụng của hệ. Hệ chứa app đang gọi → 403. Hệ không tồn tại → 404. Còn lại 204; phiên và token
của các app bị thu hồi theo cơ chế xoá app của Logto.

### A4 `GET /applications/:id`

Chi tiết một ứng dụng, cho màn bấm vào ứng dụng ở trang Ứng dụng IAM. **Không bao giờ trả secret.**

```json
{ "id": "…", "name": "…", "description": null, "type": "spa", "system": "vmsalert",
  "hasSecret": false, "roles": [], "redirectUris": ["…"], "postLogoutRedirectUris": [],
  "corsAllowedOrigins": ["…"], "resource": null, "scope": null, "isCaller": true, "createdAt": "…" }
```

`system` là `custom_data.system`, chưa gắn thì `null`. `resource`, `scope` chỉ có với app m2m mang
`machine:iam-sync`, cùng luật với A2. `isCaller` = app thuộc cùng hệ với app đang gọi. Không có, hoặc là
loại Protected, SAML, bên thứ ba → 404 `entity.not_found`.

Không làm (người dùng bỏ, 12/10/2026): xem và thu hồi phiên đăng nhập, nhật ký đăng nhập (màn 4).
Khoá người dùng và đặt lại mật khẩu vẫn để Logto tự thu hồi phiên như hiện có.

## 4. Câu hỏi mở

| Mã | Câu hỏi | Mặc định nếu không ai trả lời |
|---|---|---|
| A-Q1 | Hệ không phải trung ương có được dùng trang này (thấy theo tỉnh) không? | Không: 403 (menu IAM trên CBVMS là `nationalOnly`) |
| A-Q2 | App M2M tạo qua A2 có cần thêm scope khác ngoài `iam-sync:read`? | Chỉ `machine:iam-sync` (màn tạo hệ khoá ô `machine:iam-admin`) |
| A-Q3 | Có cần endpoint mở khoá riêng không, hay `suspended: false` ở U8 là đủ? | U8 là đủ (màn 6 dùng chung một nút) |

Ba mặc định trên khớp bản thiết kế; người dùng chưa trả lời thẳng câu nào.

## 5. Thứ tự làm

1. Đợt 1: xác thực, U1–U3, O1, O2 (chỉ đọc) + test + OpenAPI.
2. Đợt 2: U6–U12 + test.
3. Đợt 3: A1–A3 + test. Gắn `custom_data.system` cho các app có sẵn: `docs/sql/tag-iam-system-vmsalert.sql`.

Khai resource, scope, role và app quản trị: `docs/sql/declare-iam-admin.sql` (đã làm ở đợt 1).
