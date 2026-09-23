/* init_order = 2 */

/** sdvico: audit quyen han tu ung dung nghiep vu (IUU/MKN/CBVMS), KHONG dung/ghi de organization_scopes that. Xem docs/permission-manifest-sync-design.md. */
create table permission_audit_snapshots (
  tenant_id varchar(21) not null
    references tenants (id) on update cascade on delete cascade,
  id varchar(21) not null,
  application_id varchar(21) not null
    references applications (id) on update cascade on delete cascade,
  /** Nguyen ket qua app tra ve luc lay (organizations/roles/scopes/permissions). */
  payload jsonb /* @use JsonObject */ not null,
  /** true neu payload khac lan lay gan nhat truoc do cua cung app. */
  changed_from_previous boolean not null default false,
  /** Loi neu lay khong thanh cong. */
  error text,
  fetched_at timestamptz not null default (now()),
  primary key (id)
);

create index permission_audit_snapshots__application_id
  on permission_audit_snapshots (tenant_id, application_id, fetched_at desc);
