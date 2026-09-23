# Thiết kế: IAM Sync API cho IUU / MKN / CBVMS

Trạng thái: **phân tích, chưa code**. Dựa trên đọc trực tiếp schema Postgres & code OIDC/M2M thật của Logto (không suy diễn) tại thời điểm fork.

## 1. Đối chiếu mô hình dữ liệu

| Khái niệm nghiệp vụ | Native Logto? | Quyết định |
|---|---|---|
| Organization 2 cấp (Trung ương / Tỉnh) | Không — bảng `organizations` không có `parent_id`, model phẳng theo RFC0001 | Mô phỏng qua `organizations.custom_data`: `{ level: 'trung_uong' | 'tinh', parentOrgId?: string, provinceCode?: string }`. Không migration DB. |
| Role (Trưởng / Phó / Chuyên viên) | Có — khớp thẳng **Organization Role** | Dùng `organization_roles` + `organization_role_user_relations`, không cần custom. |
| Permission (`iuu:read`, `iuu:update`...) | Có — khớp `organization_scopes` / API resource scopes | Dùng native. |
| Data Scope (Tỉnh/Xã-Phường/Cảng/Tàu, ID động) | Không có khái niệm tương đương | Lưu ở `users.custom_data.dataScope`: `{ province: string[], ward: string[], port: string[], vessel: string[] }`. Không bảng mới, không migration. |

**Vì sao chọn `custom_data` thay vì bảng mới:** đây là bản fork nội bộ, khối lượng user/tỉnh không lớn (63 tỉnh/thành, ~vài nghìn user), không cần tối ưu SQL filter theo scope ở tầng DB. Đổi lại: lọc theo scope phải làm ở tầng application (đọc jsonb rồi filter trong code), chấp nhận được ở quy mô này. Nếu sau này cần filter hàng chục nghìn user theo data scope thường xuyên, nên tách bảng `user_data_scopes` riêng — ghi chú lại làm điểm cần revisit, không làm ngay.

## 2. Cơ chế xác thực & phân quyền cho app tích hợp (IUU/MKN/CBVMS)

**Không dùng** `application_access_control_*` (org/org-role/user allow-list) — cơ chế này chỉ áp dụng cho luồng đăng nhập tương tác (OIDC authorization code / consent / refresh-token / token-exchange), quyết định *người dùng* nào được đăng nhập vào 1 client. Không liên quan tới M2M `client_credentials`.

**Dùng đúng:** cơ chế M2M app làm thành viên Organization.

- Mỗi hệ thống (IUU, MKN, CBVMS) = **1 Machine-to-Machine Application riêng** trong Logto (`applications`, type `MachineToMachine`), 1 `client_id`/`client_secret` cho mỗi hệ thống — quyết định đã chốt với bạn.
- Tạo 1 API Resource, ví dụ `https://api.sdvico.vn/iam-sync`, với scope `iam-sync:read`.
- Với mỗi tỉnh mà hệ thống X được phép đồng bộ dữ liệu: thêm M2M app của X làm thành viên của Organization đó (`organization_application_relations`) và gán 1 Organization Role có scope `iam-sync:read` tại org đó (`organization_role_application_relations`).
- Hệ thống được phép xem **toàn bộ tỉnh** (ví dụ hệ thống Trung ương): gán M2M app vào Organization cấp "Trung ương" (`custom_data.level = 'trung_uong'`) — route xử lý API sẽ hiểu quy ước này và trả toàn bộ user mọi tỉnh, KHÔNG phải Logto tự hiểu hierarchy (Logto không có).
- Lấy token: `client_credentials` grant, tham số `organization_id` (cơ chế org token có sẵn của Logto) → token trả về mang claim tổ chức + scope đã gán.
- Route `GET /api/v1/iam/users` (Management API mở rộng, không phải OIDC endpoint) đọc token, xác định:
  1. `client_id` nào gọi (từ M2M token) → app nào.
  2. App đó là thành viên của org nào (`organization_application_relations` theo `application_id`).
  3. Nếu có org `level = 'trung_uong'` trong danh sách → trả toàn bộ user. Ngược lại → chỉ trả user thuộc các org (tỉnh) đó.

## 3. Contract API — GET /api/v1/iam/users

Đã xác nhận với bạn: **JSON #1 là contract chính thức**, ví dụ:

```json
{
  "data": [
    {
      "id": "logto-user-id",
      "username": "nguyenvana",
      "name": "Nguyễn Văn A",
      "email": "a@domain.vn",
      "status": "active",
      "organizations": [{ "id": "org-001", "name": "Chi cục Quảng Ninh" }],
      "roles": ["chuyen-vien"],
      "permissions": ["iuu:read", "iuu:update"],
      "scopes": [
        { "type": "province", "id": "22" },
        { "type": "port", "id": "QN01" }
      ],
      "updated_at": "2026-09-22T09:00:00Z"
    }
  ]
}
```

Nguồn dữ liệu cho từng field, ánh xạ từ Logto:

| Field response | Lấy từ đâu |
|---|---|
| `id`, `username`, `name`, `email`, `status` (`isSuspended` → active/suspended) | `users` (native) |
| `organizations[]` | `organization_user_relations` join `organizations` (lọc theo phạm vi app gọi — mục 2) |
| `roles[]` | `organization_role_user_relations` join `organization_roles`, trong đúng org đang xét |
| `permissions[]` | `organization_role_scope_relations`/`organization_role_resource_scope_relations` suy ra từ role, HOẶC lấy trực tiếp `organization_scopes` gán qua role |
| `scopes[]` (`province`/`ward`/`port`/`vessel`) | `users.custom_data.dataScope`, "làm phẳng" thành mảng `{type, id}` khi trả ra |
| `updated_at` | `users.updated_at` (native) |

**Phân trang / incremental sync:** chưa có trong JSON mẫu — đề xuất thêm query param `?updated_since=<ISO time>&page=&page_size=` để IUU/MKN/CBVMS đồng bộ tăng dần thay vì kéo toàn bộ mỗi lần (repo user có thể lên tới hàng nghìn). Cần bạn xác nhận có cần không trước khi đưa vào code.

## 4. Việc còn mở, cần xác nhận thêm trước khi code

1. Tên field chính xác cho Organization Role dùng làm "Trưởng/Phó/Chuyên viên" — dùng đúng 3 role này cho MỌI tỉnh (role dùng chung, gán theo từng org), hay mỗi tỉnh có bộ role riêng?
2. `permissions[]` trong response — là permission cố định theo role (không đổi theo user), hay có thể override riêng từng user (native Logto có `organization_user_relations` không có custom scope trực tiếp trên user, phải qua role)?
3. Có cần phân trang/incremental sync (`updated_since`) như đề xuất mục 3 không?
4. Route `GET /api/v1/iam/users` đặt ở đâu: route mới trong `packages/core` (chạy chung Management API service), hay 1 service/BFF riêng đứng trước Logto gọi Management API sẵn có rồi build lại JSON theo contract này? (route mới trong core là ít lớp trung gian nhất, nhưng đụng vào core service của fork).
