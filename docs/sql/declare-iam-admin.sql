-- Khai bao IAM Admin API (docs/iam-admin-api-design.md) va app M2M quan tri cua VMS Alert.
-- Idempotent: chay lai nhieu lan an toan. Doi tuong: tenant 'default'.
--
-- Secret KHONG ghi trong tep nay (khac declare-apps.sql). Truyen qua bien psql:
--   psql "$DB_URL" -v ON_ERROR_STOP=1 -v iam_admin_secret="$(openssl rand -hex 24)" \
--     -f docs/sql/declare-iam-admin.sql
-- Chay lai voi secret khac = doi secret (cot applications.secret va application_secrets).
--
-- App nay CHI mang role machine:iam-admin, khong mang role iam-sync va khong co quyen 'all' cua
-- Management API. App thuoc to chuc 'toan-quoc' (level = trung_uong): IAM Admin API tu choi app
-- khong thuoc to chuc cap trung uong.
--
-- Hoan tac: xem cuoi tep.

\set ON_ERROR_STOP on

begin;

insert into resources (tenant_id, id, name, indicator, access_token_ttl)
values ('default', 'res-iam-admin', 'sdvico IAM Admin API', 'https://default.logto.app/iam-admin', 3600)
on conflict (id) do nothing;

insert into scopes (tenant_id, id, name, description, resource_id) values
  ('default', 'scope-iam-admin-ur', 'iam-admin:users:read', 'Xem nguoi dung, don vi, chuc danh IAM', 'res-iam-admin'),
  ('default', 'scope-iam-admin-uw', 'iam-admin:users:write', 'Tao, sua, khoa, xoa nguoi dung IAM; gan don vi va chuc danh', 'res-iam-admin'),
  ('default', 'scope-iam-admin-ar', 'iam-admin:apps:read', 'Xem ung dung IAM theo he', 'res-iam-admin'),
  ('default', 'scope-iam-admin-aw', 'iam-admin:apps:write', 'Tao, xoa ung dung IAM theo he', 'res-iam-admin')
on conflict (id) do nothing;

insert into roles (tenant_id, id, name, description, type)
values ('default', 'role-iam-admin', 'machine:iam-admin', 'M2M role cho IAM Admin API, chi cap cho app quan tri cua VMS Alert', 'MachineToMachine')
on conflict (id) do nothing;

insert into roles_scopes (tenant_id, id, role_id, scope_id) values
  ('default', 'rs-iam-admin-ur', 'role-iam-admin', 'scope-iam-admin-ur'),
  ('default', 'rs-iam-admin-uw', 'role-iam-admin', 'scope-iam-admin-uw'),
  ('default', 'rs-iam-admin-ar', 'role-iam-admin', 'scope-iam-admin-ar'),
  ('default', 'rs-iam-admin-aw', 'role-iam-admin', 'scope-iam-admin-aw')
on conflict do nothing;

insert into applications (tenant_id, id, name, description, secret, type, oidc_client_metadata, custom_data)
values ('default', 'app-vmsalert-admin', 'VMS Alert Admin Client', 'Trang Nguoi dung IAM, Ung dung IAM tren VMS Alert',
        :'iam_admin_secret', 'MachineToMachine',
        '{"redirectUris": [], "postLogoutRedirectUris": []}'::jsonb, '{"system": "vmsalert"}'::jsonb)
on conflict (id) do update set secret = excluded.secret;

delete from application_secrets where application_id = 'app-vmsalert-admin' and name = 'admin-secret';
insert into application_secrets (tenant_id, application_id, name, value)
values ('default', 'app-vmsalert-admin', 'admin-secret', :'iam_admin_secret');

insert into applications_roles (tenant_id, id, application_id, role_id)
values ('default', 'ar-vmsalert-admin', 'app-vmsalert-admin', 'role-iam-admin')
on conflict do nothing;

insert into organization_application_relations (tenant_id, organization_id, application_id)
values ('default', 'toan-quoc', 'app-vmsalert-admin')
on conflict do nothing;

commit;

-- Hoan tac (xoa app truoc, resource sau; quan he va roles_scopes xoa theo cascade):
--   delete from applications where id = 'app-vmsalert-admin';
--   delete from roles where id = 'role-iam-admin';
--   delete from resources where id = 'res-iam-admin';
