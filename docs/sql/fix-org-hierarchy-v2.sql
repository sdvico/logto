-- v2: bo sung 2 Chi cuc cap tinh chua co trong bien ban goc (Quang Ngai, Quang Binh), suy luan
-- tu vi tri dia ly cac Cang qua tim kiem web (nguon dinh kem trong docs/TAI-LIEU-IAM-sdvico.md
-- muc 1), va gan lai parentOrgId cho 8 Cang truoc do de trong. Idempotent.

insert into organizations (tenant_id, id, name, description, custom_data)
values
  ('default', 'org-cc-quang-ngai', 'Chi cuc Thuy san tinh Quang Ngai (suy luan, chua co trong bien ban goc)',
   'Cap tinh - suy luan tu vi tri dia ly cang, can xac nhan nghiep vu', '{"level":"tinh","inferred":true}'::jsonb),
  ('default', 'org-cc-quang-binh', 'Chi cuc Thuy san tinh Quang Binh (suy luan, chua co trong bien ban goc)',
   'Cap tinh - suy luan tu vi tri dia ly cang, can xac nhan nghiep vu', '{"level":"tinh","inferred":true}'::jsonb)
on conflict (id) do nothing;

update organizations
set custom_data = (custom_data - 'parentNote') || '{"parentOrgId":"org-cc-quang-ngai","parentInferred":true}'::jsonb
where id in ('org-cang-dvhc-nghe-c', 'org-cang-ca-binh-cha');

update organizations
set custom_data = (custom_data - 'parentNote') || '{"parentOrgId":"org-cc-quang-binh","parentInferred":true}'::jsonb
where id in ('org-cang-ca-nhat-le', 'org-cang-ca-song-gia', 'org-cang-ca-viet-tru', 'org-cho-thuy-san-cau', 'org-ben-dich-vu-hau-');

update organizations
set custom_data = (custom_data - 'parentNote') || '{"parentOrgId":"org-chi-cuc-thuy-san","parentInferred":true}'::jsonb
where id = 'org-bql-cang-ca-va-a';
