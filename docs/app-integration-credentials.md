# Thông tin đăng nhập app tích hợp M2M — IUU / MKN / CBVMS

⚠️ **File này chứa `client_secret` — nhạy cảm.** Hiện tại là giá trị sinh cho môi trường **test local**, KHÔNG dùng cho vận hành thật. Trước khi bàn giao/triển khai thật: đổi secret, xoá lịch sử file này khỏi git nếu từng commit, và chuyển việc lưu trữ sang secret manager thay vì file phẳng.

Xem hướng dẫn dùng đầy đủ (auth flow, endpoint, error code, cách map `user_id`) tại [`TAI-LIEU-IAM-sdvico.md`](TAI-LIEU-IAM-sdvico.md) mục 2, hoặc [`iam-sync-api-design.md`](iam-sync-api-design.md).

## Thông số dùng chung cho cả 3 app

| Thông số | Giá trị (môi trường local hiện tại) |
|---|---|
| Token endpoint | `http://localhost:3001/oidc/token` |
| API endpoint | `http://localhost:3001/api/iam-sync/v1/users` |
| `resource` | `https://default.logto.app/iam-sync` |
| `scope` | `iam-sync:read` |
| `grant_type` | `client_credentials` |

## IUU

| | |
|---|---|
| `client_id` | `app-iuu-sync` |
| `client_secret` | `a54c43b37e45b420c08f0f135b06e136f372eaaf5fadf4d2` |
| Phạm vi tổ chức | Thành viên "Trung ương" → thấy toàn bộ user mọi tổ chức |

## MKN

| | |
|---|---|
| `client_id` | `app-mkn-sync` |
| `client_secret` | `bfd034d37b58dcfaf535f7a973445d19868595afed5a27a6` |
| Phạm vi tổ chức | Thành viên "Trung ương" → thấy toàn bộ user mọi tổ chức |

## CBVMS

| | |
|---|---|
| `client_id` | `app-cbvms-sync` |
| `client_secret` | `d7014dd654e5b128e057195aa84f4da7cf551a0c1ae2eacb` |
| Phạm vi tổ chức | Thành viên "Trung ương" → thấy toàn bộ user mọi tổ chức |

## Ví dụ test nhanh (IUU)

```bash
TOKEN=$(curl -s -X POST http://localhost:3001/oidc/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=app-iuu-sync" \
  -d "client_secret=a54c43b37e45b420c08f0f135b06e136f372eaaf5fadf4d2" \
  -d "resource=https://default.logto.app/iam-sync" \
  -d "scope=iam-sync:read" | python -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/iam-sync/v1/users
```

## Đổi secret khi cần (script mẫu, thay giá trị placeholder)

```bash
export PGPASSWORD=123123
PSQL="/c/Program Files/PostgreSQL/18/bin/psql.exe"
"$PSQL" -U postgres -h localhost -d sdvico_logto -c "
update applications set secret='<secret-moi>' where id='app-iuu-sync';
update application_secrets set value='<secret-moi>' where application_id='app-iuu-sync';
"
```

Làm tương tự cho `app-mkn-sync`, `app-cbvms-sync`. Nhớ báo secret mới cho đúng đội IUU/MKN/CBVMS tương ứng qua kênh an toàn (không gửi qua email/chat thường).

## Muốn giới hạn 1 app chỉ thấy 1 vài tỉnh/cảng cụ thể (thay vì mặc định "Trung ương" = toàn quốc)

```sql
-- Vi du: chi cho app-mkn-sync thay du lieu tinh Quang Tri (thay vi toan quoc)
delete from organization_application_relations
  where application_id = 'app-mkn-sync' and organization_id = 'org-tw';
insert into organization_application_relations (tenant_id, organization_id, application_id)
  values ('default', 'org-chi-cuc-thuy-san', 'app-mkn-sync');
```
