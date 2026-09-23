-- Dữ liệu test cho IAM Sync API (local only, KHÔNG dùng cho production).
-- Tenant: default

-- 1) Organizations: Trung ương + 1 tỉnh (Quảng Ninh)
insert into organizations (tenant_id, id, name, description, custom_data)
values
  ('default', 'org-tw', 'Trung ương - Cục Thủy sản', 'Cấp trung ương', '{"level":"trung_uong"}'::jsonb),
  ('default', 'org-qn', 'Chi cục Thủy sản Quảng Ninh', 'Cấp tỉnh', '{"level":"tinh","provinceCode":"22"}'::jsonb)
on conflict (id) do update set custom_data = excluded.custom_data;

-- 2) Organization roles (dùng chung mọi tỉnh)
insert into organization_roles (tenant_id, id, name, description, type)
values
  ('default', 'role-truong', 'Trưởng', 'Trưởng đơn vị', 'User'),
  ('default', 'role-pho', 'Phó', 'Phó đơn vị', 'User'),
  ('default', 'role-cv', 'Chuyên viên', 'Chuyên viên nghiệp vụ', 'User')
on conflict (id) do nothing;

-- 3) Organization scopes (permission)
insert into organization_scopes (tenant_id, id, name, description)
values
  ('default', 'scope-iuu-read', 'iuu:read', 'Đọc dữ liệu IUU'),
  ('default', 'scope-iuu-update', 'iuu:update', 'Cập nhật dữ liệu IUU')
on conflict (id) do nothing;

-- 4) Role -> scope
insert into organization_role_scope_relations (tenant_id, organization_role_id, organization_scope_id)
values
  ('default', 'role-truong', 'scope-iuu-read'),
  ('default', 'role-truong', 'scope-iuu-update'),
  ('default', 'role-cv', 'scope-iuu-read')
on conflict do nothing;

-- 5) M2M application cho hệ thống IUU
insert into applications (tenant_id, id, name, secret, type, oidc_client_metadata)
values (
  'default',
  'm2m-iuu-sync',
  'IUU Sync Client (test)',
  'local-test-secret-123123',
  'MachineToMachine',
  '{"redirectUris": [], "postLogoutRedirectUris": []}'::jsonb
)
on conflict (id) do nothing;

insert into application_secrets (tenant_id, application_id, name, value)
values ('default', 'm2m-iuu-sync', 'sync-secret', 'local-test-secret-123123')
on conflict do nothing;

-- 6) M2M app IUU = thành viên org Quảng Ninh (chỉ thấy tỉnh này, KHÔNG phải trung ương)
insert into organization_application_relations (tenant_id, organization_id, application_id)
values ('default', 'org-qn', 'm2m-iuu-sync')
on conflict do nothing;

-- 7) 2 user test (đã fictionalize thông tin cá nhân, không dùng PII thật từ hồ sơ bàn giao)
insert into users (tenant_id, id, username, primary_email, name, custom_data)
values
  ('default', 'user-truong-qn', 'truongban.qn', 'truongban.qn@example-test.vn', 'Nguyễn Văn Test1',
    '{"dataScope":{"province":["22"],"port":["QN01"]}}'::jsonb),
  ('default', 'user-cv-qn', 'chuyenvien.qn', 'chuyenvien.qn@example-test.vn', 'Trần Thị Test2',
    '{"dataScope":{"province":["22"],"ward":["QN001"]}}'::jsonb)
on conflict (id) do nothing;

insert into organization_user_relations (tenant_id, organization_id, user_id)
values
  ('default', 'org-qn', 'user-truong-qn'),
  ('default', 'org-qn', 'user-cv-qn')
on conflict do nothing;

insert into organization_role_user_relations (tenant_id, organization_id, organization_role_id, user_id)
values
  ('default', 'org-qn', 'role-truong', 'user-truong-qn'),
  ('default', 'org-qn', 'role-cv', 'user-cv-qn')
on conflict do nothing;
