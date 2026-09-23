# SETUP — bàn giao môi trường local

Hướng dẫn dựng lại toàn bộ hệ thống IAM sdvico (fork `logto-io/logto`) từ đầu trên máy Windows. Viết cho người tiếp nhận bàn giao, giả định chưa từng chạy dự án này.

## 1. Yêu cầu môi trường

- Node.js `^22.14.0` (đã test với v22.19.0)
- pnpm `^9.0.0` hoặc `^10.0.0` — nếu máy chỉ có pnpm 8, chạy qua `npx --yes pnpm@9 <lệnh>` thay vì `pnpm <lệnh>` trực tiếp (toàn bộ hướng dẫn dưới đây dùng cách này để chắc chắn chạy được)
- PostgreSQL 14+ (đã test với PostgreSQL 18) — cài local hoặc dùng service có sẵn
- Python 3 + Pillow (`pip install pillow`) — chỉ cần nếu muốn tạo lại các ảnh sơ đồ trong `docs/diagrams/`
- Windows + Git Bash: một số script gốc của Logto (`generate.sh` trong `packages/schemas`, `packages/cli`, `packages/console`) là shell script, `pnpm` trên Windows chạy qua `cmd.exe` nên sẽ báo lỗi `'.' is not recognized...`. Cách xử lý: chạy trực tiếp bằng Git Bash: `bash generate.sh` trong đúng thư mục package, RỒI mới chạy tiếp phần còn lại của lệnh `build` gốc (`rm -rf lib && tsc -p tsconfig.build.json ...`) — xem chi tiết mục 3.
- `rsync` không có sẵn trên Windows — bước `copy:apidocs` của `packages/core` sẽ lỗi, không nghiêm trọng (chỉ ảnh hưởng tài liệu Swagger), workaround ở mục 3.4.
- pnpm global trên máy phải đúng `^9.0.0 || ^10.0.0` — không chỉ dùng `npx pnpm@9` (đó chỉ là workaround cho lệnh gõ tay). Cơ chế xem trước web (nếu dùng) tự chạy `pnpm` global, gặp bản pnpm cũ sẽ báo `ERR_PNPM_UNSUPPORTED_ENGINE` — chạy 1 lần: `npm i -g pnpm@9`.
- Đã sửa 1 bug có sẵn của Logto gốc trong `packages/core/src/middleware/koa-spa-proxy.ts` (dùng `path.join` thay vì `path.posix.join` khi rewrite URL proxy) — trên Windows, đường dẫn có dấu cách (`D:\Danh Thu\...`) sẽ bị hỏng URL, làm Console báo "Service Unavailable". Nếu pull code mới đè lên bản vá này, cần soát lại.

## 2. Cài đặt

```bash
cd "D:\Danh Thu\github\sdvico\logto"
npx --yes pnpm@9 install --no-frozen-lockfile
```

Nếu bước `husky` trong `prepare` lỗi (`"$NODE_ENV" was unexpected at this time`) — bỏ qua, không ảnh hưởng, `node_modules` vẫn cài đủ.

## 3. Build (thứ tự bắt buộc — package sau phụ thuộc package trước)

### 3.1. Build các package nền tảng + schemas

```bash
npx --yes pnpm@9 --filter @logto/cli... build
```

Nếu dừng ở bước `packages/schemas build` với lỗi `'.' is not recognized`:

```bash
cd packages/schemas
bash generate.sh
rm -rf lib
npx --yes pnpm@9 exec tsc -p tsconfig.build.json
rm -rf alterations-js
npx --yes pnpm@9 exec tsc -p tsconfig.build.alterations.json
cd ../..
```

Rồi chạy lại `npx --yes pnpm@9 --filter @logto/cli... build` — lần này sẽ qua vì `lib/` đã có.

### 3.2. Build CLI

```bash
npx --yes pnpm@9 --filter @logto/cli build
```

### 3.3. Seed database (tạo schema + OIDC config + tenant mặc định)

```bash
export PGPASSWORD=123123   # đổi theo mật khẩu Postgres thật của bạn
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -h localhost -c "CREATE DATABASE sdvico_logto;"

cd packages/cli
DB_URL="postgres://postgres:123123@localhost:5432/sdvico_logto" node . db seed --swe
cd ../..
```

Tạo file `.env` ở gốc repo:
```
DB_URL=postgres://postgres:123123@localhost:5432/sdvico_logto
TRUST_PROXY_HEADER=1
```

### 3.4. Build & chạy backend (`core`)

```bash
npx --yes pnpm@9 --filter @logto/core... build   # build các dep còn thiếu (app-insights...)
cd packages/core
rm -rf build
npx --yes pnpm@9 exec tsup
# copy openapi.json thủ công vì không có rsync trên Windows:
find src/routes -name "*.openapi.json" | while read f; do dest="build/routes/${f#src/routes/}"; mkdir -p "$(dirname "$dest")"; cp "$f" "$dest"; done
cd ../..
```

Chạy server:
```bash
cd packages/core
DB_URL="postgres://postgres:123123@localhost:5432/sdvico_logto" node .
```
→ `core` chạy ở `http://localhost:3001`, `admin` (Console) ở `http://localhost:3002`.

**Lưu ý:** đây là `node .` thường (không `NODE_ENV=production`) — ở chế độ này, các app frontend (Console/Experience/demo-app...) được **proxy sang vite dev server**, KHÔNG serve file tĩnh. Xem mục 4 để chạy Console.

### 3.5. Chạy dữ liệu mẫu + khai báo app tích hợp

```bash
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -h localhost -d sdvico_logto -f "docs/sql/seed-nkkt-users.sql"
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -h localhost -d sdvico_logto -f "docs/sql/declare-apps.sql"
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -h localhost -d sdvico_logto -f "docs/sql/fix-org-hierarchy.sql"
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -h localhost -d sdvico_logto -f "docs/sql/fix-org-hierarchy-v2.sql"
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -h localhost -d sdvico_logto -f "docs/sql/fix-remove-cang-orgs.sql"
```

Cả 5 file đều idempotent (chạy lại nhiều lần an toàn). `fix-remove-cang-orgs.sql` sửa lỗi mô hình quan trọng: xoá Organization cấp "Cảng" (đúng đặc tả gốc chỉ 2 cấp Trung ương/Tỉnh — Cảng là Data Scope trên User, không phải Organization), phải chạy SAU 2 file `fix-org-hierarchy*`.

## 4. Chạy Console UI (giao diện quản trị)

Cần **2 dev server riêng** — Console (port 5002) và Experience/trang đăng nhập (port 5001, dùng khi bấm "Create account" hoặc đăng nhập):

```bash
cd packages/console && bash generate.sh && npx --yes pnpm@9 exec vite &
cd packages/experience && npx --yes pnpm@9 exec vite &
```

Mở trình duyệt tại **`http://localhost:3002/console`** (không phải 5002/5001 trực tiếp — hai cổng đó chỉ có frontend, thiếu API, phải qua proxy của `core` ở 3002).

Lần đầu mở sẽ ra trang "Welcome to Admin Console" — chưa có tài khoản admin nào, bấm "Create account" để tạo tài khoản quản trị đầu tiên (tự chọn thông tin, không có sẵn tài khoản mẫu).

**Lỗi "Service Unavailable" khi bấm Create account / Sign in:** do thiếu dev server port 5001 (Experience) — xem trên. Nếu bấm mà báo lỗi `ERR_PNPM_UNSUPPORTED_ENGINE` (yêu cầu pnpm 9/10), pnpm global trên máy đang là bản 8 — chạy `npm i -g pnpm@9` một lần để sửa dứt điểm (không chỉ dùng `npx pnpm@9` cho riêng lệnh đó).

**Ẩn bớt sidebar cho gọn (tuỳ chọn):** sửa biến `HIDDEN_SIDEBAR_ITEMS` trong `.env` gốc repo (đã có sẵn danh sách mặc định + giải thích từng mục) — sau khi sửa `.env`, PHẢI khởi động lại vite console (biến này chỉ đọc lúc start, không hot-reload).

## 5. Kiểm tra IAM Sync API hoạt động

```bash
TOKEN=$(curl -s -X POST http://localhost:3001/oidc/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=app-iuu-sync" \
  -d "client_secret=<xem docs/app-integration-credentials.md>" \
  -d "resource=https://default.logto.app/iam-sync" \
  -d "scope=iam-sync:read" | python -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/iam-sync/v1/users
```

Kỳ vọng: JSON trả về 50 user (48 từ hồ sơ NKKT + 2 dữ liệu test Quảng Ninh), mỗi user có đúng các field: `id, username, name, status, organizations, roles, scopes, updated_at` — xem `docs/sample-response.json` để đối chiếu.

Có thêm route xem nhanh cho admin đã đăng nhập Console (không cần token M2M): `GET /api/iam-sync-preview/users` — trả toàn bộ user, dùng session admin sẵn có.

## 6. Các file quan trọng trong `docs/`

| File | Nội dung |
|---|---|
| `PLAN.md` | Kế hoạch tổng thể ban đầu |
| `audit-report.md` | 227 phát hiện nhận diện Logto cần đổi |
| `design-tokens.md` | Bảng màu/logo placeholder |
| `iam-sync-api-design.md` | Thiết kế kỹ thuật IAM Sync API |
| `TAI-LIEU-IAM-sdvico.md` | **Tài liệu chính** — mô hình tổ chức, tích hợp M2M, SSO, sequence diagram |
| `app-integration-credentials.md` | Thông tin đăng nhập 3 app IUU/MKN/CBVMS (nhạy cảm, xem mục bảo mật) |
| `iam-sync-integration-guide.md` | Hướng dẫn tích hợp chi tiết cho đội IUU/MKN/CBVMS |
| `sample-response.json` | Ví dụ response thật của IAM Sync API |
| `sql/seed-nkkt-users.sql`, `sql/declare-apps.sql`, `sql/fix-org-hierarchy*.sql`, `sql/fix-remove-cang-orgs.sql` | Script tạo/sửa dữ liệu, idempotent, chạy đúng thứ tự trong mục 3.5 |
| `diagrams/*.png` | Sơ đồ cây tổ chức + sequence diagram M2M/SSO |
| `legacy-Tai-lieu-IAM-sdvico.docx` | Bản Word cũ, không còn cập nhật — dùng `TAI-LIEU-IAM-sdvico.md` |
| `diagrams/*.png` | Sơ đồ cây tổ chức + sequence diagram |

## 7. Việc còn tồn đọng khi bàn giao

- **Bảo mật:** secret trong `declare-apps.sql` là giá trị test, PHẢI đổi trước khi dùng thật (xem `docs/app-integration-credentials.md`).
- 12 quan hệ Cảng↔Chi cục được suy luận từ tra cứu web (không có trong biên bản gốc) — cần đội nghiệp vụ xác nhận lại, xem `TAI-LIEU-IAM-sdvico.md` mục 1.
- Domain thật khi triển khai — hiện toàn bộ cấu hình dùng `default.logto.app` (placeholder cho local).
- Chưa push code lên `github.com/sdvico/logto` — vẫn ở local.
- Chưa chạy `pnpm -r build` sạch hoàn toàn cho cả 77 package trong monorepo (một số package không cần cho việc chạy Console + IAM Sync API chưa được build, ví dụ `integration-tests`, `translate`).
