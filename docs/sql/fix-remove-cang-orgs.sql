-- SUA LOI THIET KE: dung dung dac ta goc "Organization chi 2 cap Trung uong/Tinh",
-- "Cang" phai la Data Scope tren User (custom_data.dataScope.port), KHONG phai Organization
-- rieng. Truoc do da lo tao 12 Organization cap "cang" (level=cang) lam con cua Tinh qua
-- parentOrgId - sai spec. Script nay: chuyen thanh vien tu Cang len thang Tinh (cha), giu
-- nguyen dataScope.port da co san tren user (khong doi), roi xoa cac Organization cap Cang.
-- Idempotent: chay lai an toan (sau lan dau se khong con org level=cang de xu ly).

-- 1) Chuyen thanh vien (organization_user_relations) tu Cang len Tinh cha
insert into organization_user_relations (tenant_id, organization_id, user_id)
select o.tenant_id, o.custom_data->>'parentOrgId', our.user_id
from organization_user_relations our
join organizations o on o.id = our.organization_id
where o.custom_data->>'level' = 'cang'
  and o.custom_data->>'parentOrgId' is not null
on conflict do nothing;

-- 2) Chuyen vai tro (organization_role_user_relations) tu Cang len Tinh cha
insert into organization_role_user_relations (tenant_id, organization_id, organization_role_id, user_id)
select o.tenant_id, o.custom_data->>'parentOrgId', orur.organization_role_id, orur.user_id
from organization_role_user_relations orur
join organizations o on o.id = orur.organization_id
where o.custom_data->>'level' = 'cang'
  and o.custom_data->>'parentOrgId' is not null
on conflict do nothing;

-- 3) Xoa quan he cu tai cap Cang (role truoc, vi co FK tham chieu organization_user_relations)
delete from organization_role_user_relations
where organization_id in (select id from organizations where custom_data->>'level' = 'cang');

delete from organization_user_relations
where organization_id in (select id from organizations where custom_data->>'level' = 'cang');

-- 4) Don dep quan he app (neu co) tai cap Cang
delete from organization_role_application_relations
where organization_id in (select id from organizations where custom_data->>'level' = 'cang');

delete from organization_application_relations
where organization_id in (select id from organizations where custom_data->>'level' = 'cang');

-- 5) Xoa han cac Organization cap Cang - gio chi con Trung uong + Tinh
delete from organizations where custom_data->>'level' = 'cang';
