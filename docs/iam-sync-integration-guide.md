# Tài liệu tích hợp — sdvico IAM Sync API

Dành cho đội kỹ thuật của IUU, MKN, CBVMS (hoặc bất kỳ hệ thống ngoài nào cần đồng bộ danh sách người dùng từ IAM sdvico).

## 1. Xác thực — bằng gì?

**Bearer token chuẩn OAuth2, grant `client_credentials`** (không phải API key tĩnh, không phải Basic Auth). Mỗi hệ thống được cấp riêng:
- `client_id`
- `client_secret`

Luồng lấy token:

```bash
curl -X POST https://<domain-sdvico>/oidc/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=<client_id_cua_ban>" \
  -d "client_secret=<client_secret_cua_ban>" \
  -d "resource=https://<tenantId>.logto.app/iam-sync" \
  -d "scope=iam-sync:read"
```

Response:
```json
{
  "access_token": "eyJhbGciOi...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "iam-sync:read"
}
```

Token hết hạn sau 3600s (1 giờ) — phải tự xin lại token mới khi hết hạn (không có refresh token với `client_credentials`).

Gọi API:
```bash
curl -H "Authorization: Bearer <access_token>" \
  https://<domain-sdvico>/api/iam-sync/v1/users
```

**Lưu ý quan trọng:** token phải xin đúng `resource=https://<tenantId>.logto.app/iam-sync` — token xin cho mục đích khác (vd Management API) sẽ bị từ chối 401 do sai `audience`, dù cùng `client_id`/`client_secret`.

## 2. Endpoint

```
GET /api/iam-sync/v1/users
```

Không có tham số query (không phân trang, theo yêu cầu). Trả về **toàn bộ** user mà app gọi được phép thấy (xem mục 3).

### Response

```json
{
  "data": [
    {
      "id": "u-chinnd-tho",
      "username": "chinnd-THO",
      "name": "Nguyễn Đức Chín",
      "email": "ducchinh030272@gmail.com",
      "status": "active",
      "organizations": [
        { "id": "org-ban-quan-ly-au-t", "name": "Ban Quản lý Âu thuyền và Cảng cá Đà Nẵng" }
      ],
      "roles": [{ "code": "CHUYEN_VIEN", "name": "Chuyên viên" }],
      "permissions": ["iuu:read"],
      "scopes": [{ "type": "port", "id": "org-ban-quan-ly-au-t" }],
      "external_ids": { "nkkt": "NKKT-00042" },
      "updated_at": "2026-09-22T04:11:37.303Z"
    }
  ]
}
```

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | string | **User ID nội bộ của IAM (sdvico/Logto)** — cố định, không đổi theo thời gian. Đây là khoá chính hệ thống ngoài nên lưu lại để đối chiếu. |
| `username`, `name`, `email` | string \| null | Thông tin hiển thị |
| `status` | `active` \| `suspended` | Trạng thái tài khoản |
| `organizations[]` | array | Các tổ chức user thuộc về (trong phạm vi app được phép thấy) |
| `roles[]` | `{code, name}[]` | `code` ổn định để so sánh trong code (`TRUONG`/`PHO`/`CHUYEN_VIEN`), `name` là nhãn hiển thị tiếng Việt |
| `permissions[]` | string[] | Quyền hạn suy ra từ vai trò (vd `iuu:read`, `iuu:update`) |
| `scopes[]` | `{type, id}[]` | Data scope: `province`/`ward`/`port`/`vessel` |
| `external_ids` | object | Map user_id cũ của các hệ thống ngoài (xem mục 4) |
| `updated_at` | ISO datetime | Lần cập nhật gần nhất |

## 3. Cơ chế phân quyền — app thấy được gì?

Mỗi hệ thống (IUU/MKN/CBVMS) là 1 M2M application riêng, được gán làm **thành viên của 1 hoặc nhiều Organization**:
- Nếu là thành viên của Organization cấp **"Trung ương"** (`custom_data.level = "trung_uong"`) → thấy **toàn bộ** user của **mọi** tổ chức.
- Nếu là thành viên của Organization cấp **"Tỉnh"/"Cảng"** cụ thể → **chỉ** thấy user thuộc đúng (các) tổ chức đó.
- Nếu app chưa được gán vào Organization nào → API trả lỗi `403 auth.forbidden`.

Việc gán app vào tổ chức nào là cấu hình phía sdvico (`organization_application_relations`), hệ thống ngoài không tự đổi được — cần liên hệ đội vận hành IAM nếu cần mở rộng/thu hẹp phạm vi.

## 4. Map `user_id` cũ với user hiện tại trong IAM — TRÁNH TẠO TRÙNG

**Vấn đề:** hệ thống ngoài (IUU/MKN/CBVMS) có thể đã có sẵn user trong database riêng của mình (vd với `user_id` nội bộ dạng số `"12345"`) **trước khi** tích hợp với IAM. Khi đồng bộ lần đầu, cần biết user nào trong response ứng với user nào đã có sẵn, để **không tạo trùng** bản ghi.

**Cách làm, theo thứ tự ưu tiên:**

1. **Có `external_ids.<tên hệ thống của bạn>` sẵn** → dùng trực tiếp, khớp chính xác 1-1, không cần đoán. Ví dụ hệ thống tên `nkkt` tra field `external_ids.nkkt`.
   - Field này được đội vận hành IAM điền vào `users.custom_data.externalIds` khi tạo/nhập user (vd trong quá trình migrate dữ liệu cũ sang IAM). Nếu hệ thống của bạn cần mapping này mà chưa thấy trong response, **báo đội vận hành IAM để bổ sung**, đừng tự suy đoán.
2. **Chưa có `external_ids` cho hệ thống của bạn** → đối chiếu tạm bằng `username` (ổn định hơn `email`). **Không dùng `email` làm khoá chính** — dữ liệu thật đã ghi nhận trường hợp 2 user dùng chung 1 email (xem `docs/sql/seed-nkkt-users.sql`), và nhiều user không có email.
3. **Sau khi đối chiếu xong lần đầu (bằng cách nào cũng được)** → hệ thống ngoài **PHẢI lưu lại `id`** (user_id của IAM) vào bản ghi local của mình làm khoá liên kết vĩnh viễn. Từ lần đồng bộ thứ 2 trở đi, **chỉ dùng `id`** để đối chiếu — không lặp lại bước so khớp theo tên/email nữa (username có thể đổi, email có thể đổi, nhưng `id` thì không).

Tóm tắt luồng đồng bộ khuyến nghị cho hệ thống ngoài:

```
Lần đầu:  for each user in response:
            local_user = find_by_external_id(user.external_ids['<ten_he_thong>'])
                         OR find_by_username(user.username)  # fallback, review thu cong neu nghi ngo
            if local_user existed:
                local_user.iam_user_id = user.id   # luu lai vinh vien
            else:
                create_local_user(iam_user_id = user.id, ...)

Tu lan 2:  for each user in response:
             local_user = find_by_iam_user_id(user.id)   # chi can the nay la du
             upsert(local_user, user)
```

## 5. Mã lỗi

| HTTP | code | Ý nghĩa |
|---|---|---|
| 401 | `auth.unauthorized` | Token không hợp lệ / hết hạn / sai `audience` (resource) |
| 403 | `auth.forbidden` | Thiếu scope `iam-sync:read`, hoặc app chưa gán vào Organization nào |

## 6. Việc còn cần làm trước khi dùng thật (nhắc lại)

- Đổi `client_secret` hiện tại (đang là giá trị test) — xem `docs/sql/declare-apps.sql`.
- Xác nhận domain thật (hiện `resource` dùng `https://default.logto.app/iam-sync` cho môi trường local — khi deploy thật, `tenantId`/domain sẽ khác).
- Nếu cần giới hạn từng hệ thống chỉ thấy 1 vài tỉnh/cảng cụ thể (thay vì mặc định "Trung ương" thấy toàn quốc), báo lại để cấu hình riêng cho từng app.
