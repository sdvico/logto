-- Vai trò tổ chức dùng chung cho mọi đơn vị (IUU / MKN / CBVMS). Idempotent: chạy lại an toàn.
-- Chức danh = vai trò chung + loại đơn vị. Tên gọi theo loại (Cục trưởng, Đồn trưởng…) nằm ở
-- organizations.custom_data.roleTitles, do seed-organizations.sql ghi.
-- Mã gửi qua IAM Sync API (KNOWN_ROLE_CODES trong iam-sync.ts): TRUONG, PHO, CHUYEN_VIEN.
-- Id cố định, KHÔNG tạo vai trò bằng Console (Console sinh id ngẫu nhiên, mã gửi đi vô nghĩa).
-- Chạy: psql -v ON_ERROR_STOP=1 -U postgres -d <db logto> -f docs/sql/seed-organization-roles.sql

begin;

insert into organization_roles (tenant_id, id, name, description, type) values
  ('default', 'role-truong', 'Trưởng',
   'Cục trưởng, Chi cục trưởng, Chỉ huy trưởng, Đồn trưởng, Trưởng ban, Cảng trưởng', 'User'),
  ('default', 'role-pho', 'Phó',
   'Phó Cục trưởng, Phó Chi cục trưởng, Phó Chỉ huy trưởng, Phó Đồn trưởng, Phó trưởng ban, Cảng phó', 'User'),
  ('default', 'role-cv', 'Chuyên viên',
   'Chuyên viên, cán bộ, nhân viên', 'User')
on conflict (id) do update set name = excluded.name, description = excluded.description;

commit;

select id, name from organization_roles
where tenant_id = 'default' and id in ('role-truong', 'role-pho', 'role-cv')
order by id;
