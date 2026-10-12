-- Gan ma he 'vmsalert' cho cac app co san cua VMS Alert, de IAM Admin API (GET /systems) gom chung
-- mot he. Xem docs/iam-admin-api-design.md muc 3. Idempotent; chi gop khoa vao custom_data, khong
-- dong vao role (app dong bo giu nguyen role "Logto Management API access" theo quyet dinh 12/10).
--
-- Id app khac nhau tren tung moi truong: doc tu setting cua VMS Alert (oidc.iam.client_id,
-- oidc.iam.sync_client_id), roi truyen vao:
--   psql "$DB_URL" -v ON_ERROR_STOP=1 -v login_app=<oidc.iam.client_id> \
--     -v sync_app=<oidc.iam.sync_client_id> -f docs/sql/tag-iam-system-vmsalert.sql
-- app-vmsalert-admin da co ma he tu docs/sql/declare-iam-admin.sql.
--
-- Hoan tac:
--   update applications set custom_data = custom_data - 'system' - 'systemName'
--   where tenant_id = 'default' and id in (:'login_app', :'sync_app');

\set ON_ERROR_STOP on

begin;

-- Kiem truoc: phai thay dung 2 app; it hon la sai id, script dung lai.
select id, name, type, custom_data->>'system' as system_hien_tai
from applications
where tenant_id = 'default' and id in (:'login_app', :'sync_app');

select count(*) = 2 as du_hai_app
from applications
where tenant_id = 'default' and id in (:'login_app', :'sync_app') \gset

\if :du_hai_app
\else
  \echo 'Khong thay du 2 app voi id da truyen; khong sua gi.'
  rollback;
  \quit
\endif

update applications
set custom_data = custom_data || '{"system": "vmsalert", "systemName": "VMS Alert"}'::jsonb
where tenant_id = 'default' and id in (:'login_app', :'sync_app', 'app-vmsalert-admin');

commit;
