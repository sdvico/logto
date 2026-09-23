-- Script khai bao cac M2M application cho IAM Sync API (IUU / MKN / CBVMS).
-- Idempotent: chay lai nhieu lan an toan (on conflict do nothing / do update).
-- Doi tuong: tenant 'default' trong Postgres local.
--
-- v2: tach rieng API Resource + scope "iam-sync:read" cho IAM Sync API, KHONG con dung chung
-- scope 'all' cua Management API nua (v1 dung tam de proof-of-concept, da nang cap).
-- Moi he thong ngoai = 1 M2M application rieng (client_id/client_secret rieng, secret ngau nhien
-- 48 hex char, sinh boi Python secrets.token_hex(24) - xem docs/change-log-v2.md de biet gia tri).
--
-- Mac dinh ca 3 app duoc gan vao Organization "Trung uong" (org-tw, custom_data.level=trung_uong)
-- => thay toan bo user moi to chuc (pham vi quoc gia). Neu muon gioi han theo tung tinh/cang cu the,
-- xoa dong organization_application_relations tuong ung va thay bang insert rieng cho organization_id
-- can cap quyen.

-- ===== 1) API Resource rieng cho IAM Sync (khong dung chung Management API nua) =====
insert into resources (tenant_id, id, name, indicator, access_token_ttl)
values ('default', 'res-iam-sync', 'sdvico IAM Sync API', 'https://default.logto.app/iam-sync', 3600)
on conflict (id) do nothing;

insert into scopes (tenant_id, id, name, description, resource_id)
values ('default', 'scope-iam-sync-read', 'iam-sync:read', 'Doc danh sach user/org/role/scope qua IAM Sync API', 'res-iam-sync')
on conflict (id) do nothing;

-- ===== 2) Role M2M rieng, CHI co scope iam-sync:read (khong con 'all') =====
insert into roles (tenant_id, id, name, description, type)
values ('default', 'role-iam-sync', 'machine:iam-sync', 'M2M role rieng cho IAM Sync API, chi co scope iam-sync:read', 'MachineToMachine')
on conflict (id) do nothing;

insert into roles_scopes (tenant_id, id, role_id, scope_id)
values ('default', 'rs-iam-sync-read', 'role-iam-sync', 'scope-iam-sync-read')
on conflict do nothing;

-- Go grant scope 'all' cu (v1) khoi 3 app - khong con can toan quyen Management API
delete from applications_roles where application_id in ('app-iuu-sync','app-mkn-sync','app-cbvms-sync') and role_id = 'role-mapi-iuu';

-- Dam bao Organization "Trung uong" da ton tai
insert into organizations (tenant_id, id, name, description, custom_data)
values ('default', 'org-tw', 'Trung uong - Cuc Thuy san', 'Cap trung uong', '{"level":"trung_uong"}'::jsonb)
on conflict (id) do update set custom_data = excluded.custom_data;

-- ===== App 1: IUU (chong khai thac IUU) =====
insert into applications (tenant_id, id, name, secret, type, oidc_client_metadata)
values ('default', 'app-iuu-sync', 'IUU Sync Client', 'a54c43b37e45b420c08f0f135b06e136f372eaaf5fadf4d2', 'MachineToMachine',
        '{"redirectUris": [], "postLogoutRedirectUris": []}'::jsonb)
on conflict (id) do update set secret = excluded.secret;
insert into application_secrets (tenant_id, application_id, name, value)
values ('default', 'app-iuu-sync', 'sync-secret', 'a54c43b37e45b420c08f0f135b06e136f372eaaf5fadf4d2')
on conflict do nothing;
insert into applications_roles (tenant_id, id, application_id, role_id)
values ('default', 'ar-app-iuu-v2', 'app-iuu-sync', 'role-iam-sync')
on conflict do nothing;
insert into organization_application_relations (tenant_id, organization_id, application_id)
values ('default', 'org-tw', 'app-iuu-sync')
on conflict do nothing;

-- ===== App 2: MKN (kiem ngu) =====
insert into applications (tenant_id, id, name, secret, type, oidc_client_metadata)
values ('default', 'app-mkn-sync', 'MKN Sync Client', 'bfd034d37b58dcfaf535f7a973445d19868595afed5a27a6', 'MachineToMachine',
        '{"redirectUris": [], "postLogoutRedirectUris": []}'::jsonb)
on conflict (id) do update set secret = excluded.secret;
insert into application_secrets (tenant_id, application_id, name, value)
values ('default', 'app-mkn-sync', 'sync-secret', 'bfd034d37b58dcfaf535f7a973445d19868595afed5a27a6')
on conflict do nothing;
insert into applications_roles (tenant_id, id, application_id, role_id)
values ('default', 'ar-app-mkn-v2', 'app-mkn-sync', 'role-iam-sync')
on conflict do nothing;
insert into organization_application_relations (tenant_id, organization_id, application_id)
values ('default', 'org-tw', 'app-mkn-sync')
on conflict do nothing;

-- ===== App 3: CBVMS (he thong giam sat tau ca) =====
insert into applications (tenant_id, id, name, secret, type, oidc_client_metadata)
values ('default', 'app-cbvms-sync', 'CBVMS Sync Client', 'd7014dd654e5b128e057195aa84f4da7cf551a0c1ae2eacb', 'MachineToMachine',
        '{"redirectUris": [], "postLogoutRedirectUris": []}'::jsonb)
on conflict (id) do update set secret = excluded.secret;
insert into application_secrets (tenant_id, application_id, name, value)
values ('default', 'app-cbvms-sync', 'sync-secret', 'd7014dd654e5b128e057195aa84f4da7cf551a0c1ae2eacb')
on conflict do nothing;
insert into applications_roles (tenant_id, id, application_id, role_id)
values ('default', 'ar-app-cbvms-v2', 'app-cbvms-sync', 'role-iam-sync')
on conflict do nothing;
insert into organization_application_relations (tenant_id, organization_id, application_id)
values ('default', 'org-tw', 'app-cbvms-sync')
on conflict do nothing;
