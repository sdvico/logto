import {
  PermissionAuditSnapshots,
  type CreatePermissionAuditSnapshot,
  type PermissionAuditSnapshot,
  type PermissionAuditSnapshotKeys,
} from '@logto/schemas';
import { type CommonQueryMethods, sql } from '@silverhand/slonik';

import SchemaQueries from '#src/utils/SchemaQueries.js';
import { convertToIdentifiers } from '#src/utils/sql.js';

/**
 * sdvico: query cho bang audit quyen han (chi doc/ghi snapshot, KHONG dung de doc/ghi
 * organization_scopes that). Xem docs/permission-manifest-sync-design.md.
 */
export default class PermissionAuditSnapshotQueries extends SchemaQueries<
  PermissionAuditSnapshotKeys,
  CreatePermissionAuditSnapshot,
  PermissionAuditSnapshot
> {
  constructor(pool: CommonQueryMethods) {
    super(pool, PermissionAuditSnapshots);
  }

  /** Snapshot gan nhat cua 1 app (theo fetched_at), hoac undefined neu chua tung lay lan nao. */
  async findLatestByApplicationId(
    applicationId: string
  ): Promise<PermissionAuditSnapshot | null> {
    const { table, fields } = convertToIdentifiers(PermissionAuditSnapshots, true);

    return this.pool.maybeOne<PermissionAuditSnapshot>(sql`
      select ${sql.join(Object.values(fields), sql`, `)}
      from ${table}
      where ${fields.applicationId} = ${applicationId}
      order by ${fields.fetchedAt} desc
      limit 1
    `);
  }

  /** Lich su snapshot cua 1 app, moi nhat truoc. */
  async findByApplicationId(
    applicationId: string,
    limit = 50
  ): Promise<readonly PermissionAuditSnapshot[]> {
    const { table, fields } = convertToIdentifiers(PermissionAuditSnapshots, true);

    return this.pool.any<PermissionAuditSnapshot>(sql`
      select ${sql.join(Object.values(fields), sql`, `)}
      from ${table}
      where ${fields.applicationId} = ${applicationId}
      order by ${fields.fetchedAt} desc
      limit ${limit}
    `);
  }
}
