-- Sua mo hinh: Cang truc thuoc Chi cuc (co quan he cha-con that), khong phai cay phang
-- nam ngang duoi Trung uong. Idempotent, chay lai an toan.
--
-- Object cua cha: organizations.custom_data.parentOrgId. Route iam-sync.ts tu dong mo rong:
-- app duoc gan o cap Tinh se tu dong thay them user cua moi Cang truc thuoc tinh do, khong
-- can gan rieng tung Cang.
--
-- CHI xac nhan duoc quan he cha-con cho 3 Cang co ten dia danh trung khop ro rang voi 1 tinh/
-- chi cuc da co trong du lieu (Da Nang, Quang Tri). 8 Cang con lai KHONG du du lieu de xac dinh
-- chac chan thuoc chi cuc nao (vd Nhat Le/Song Gianh/Quang Phuc nghe nhu dia danh Quang Binh,
-- nhung khong co "Chi cuc Quang Binh" nao trong bien ban goc de xac nhan) -- de parentOrgId=null,
-- gan co parentNote de biet la CAN XAC NHAN THEM, khong tu bia.

update organizations set custom_data = custom_data || '{"parentOrgId":"org-chi-cuc-bien-ao-"}'::jsonb
where id = 'org-ban-quan-ly-au-t';

update organizations set custom_data = custom_data || '{"parentOrgId":"org-chi-cuc-thuy-san"}'::jsonb
where id in ('org-cang-ca-cua-tung', 'org-cang-ca-cua-viet', 'org-cang-ca-ben-ca-c');

update organizations set custom_data = custom_data || '{"parentOrgId":null,"parentNote":"chua-xac-dinh-chi-cuc-quan-ly-can-xac-nhan"}'::jsonb
where id in (
  'org-ben-dich-vu-hau-', 'org-bql-cang-ca-va-a', 'org-cang-ca-binh-cha',
  'org-cang-ca-nhat-le', 'org-cang-ca-song-gia', 'org-cang-ca-viet-tru',
  'org-cang-dvhc-nghe-c', 'org-cho-thuy-san-cau'
);
