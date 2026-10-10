import { type Organization } from '@logto/schemas';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';

import PageMeta from '@/components/PageMeta';
import Button from '@/ds-components/Button';
import Card from '@/ds-components/Card';
import CardTitle from '@/ds-components/CardTitle';
import DangerousRaw from '@/ds-components/DangerousRaw';
import InlineNotification from '@/ds-components/InlineNotification';
import Table from '@/ds-components/Table';
import Tag from '@/ds-components/Tag';
import useApi from '@/hooks/use-api';
import useTenantPathname from '@/hooks/use-tenant-pathname';
import pageLayout from '@/scss/page-layout.module.scss';

import { fetchAll } from '../IamStaffImport/lookup';
import { loadSystems } from '../IamSystems/system-api';
import { unitTypeLabel } from '../IamSystems/systems';

import SyncFilters from './SyncFilters';
import styles from './index.module.scss';
import {
  emptyFilter,
  filterUsers,
  summarize,
  type SyncFilter,
  type SyncSystem,
  type SyncUser,
  systemsOf,
  type TreeOrganization,
  unitsOf,
} from './sync-users';

type Loaded = {
  users: SyncUser[];
  registered: SyncSystem[];
  tree: ReadonlyMap<string, TreeOrganization>;
};

const treeOrganizationOf = ({ id, name, customData }: Organization): TreeOrganization => {
  const { type, parentOrgId } = customData;
  return {
    id,
    name,
    ...(typeof type === 'string' ? { type } : {}),
    ...(typeof parentOrgId === 'string' ? { parentOrgId } : {}),
  };
};

/**
 * Sdvico: đúng dữ liệu IAM Sync API (`/api/iam-sync-preview/users`) trả cho các hệ tích hợp — mỗi người
 * ở đơn vị nào, chức danh gì, mã ở từng hệ. Chỉ xem, dùng session admin, không qua M2M token.
 */
function IamSyncUsers() {
  const api = useApi({ hideErrorToast: true });
  const { navigate } = useTenantPathname();
  const [loaded, setLoaded] = useState<Loaded>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<SyncFilter>(emptyFilter);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const [preview, { systems }, organizations] = await Promise.all([
        api.get('api/iam-sync-preview/users').json<{ data: SyncUser[] }>(),
        loadSystems(api),
        fetchAll<Organization>(api, 'api/organizations'),
      ]);
      setLoaded({
        users: preview.data,
        registered: systems.map(({ system: { key, label } }) => ({ key, label })),
        tree: new Map(
          organizations.map((organization) => [organization.id, treeOrganizationOf(organization)])
        ),
      });
    } catch (loadError: unknown) {
      setError(`Không tải được dữ liệu: ${String(loadError)}`);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const systems = useMemo(
    () => (loaded ? systemsOf(loaded.registered, loaded.users) : []),
    [loaded]
  );
  const summary = loaded && summarize(loaded.users, systems);
  const visible = useMemo(
    () => (loaded ? filterUsers(loaded.users, filter) : []),
    [loaded, filter]
  );
  const labelOf = (key: string) => systems.find((system) => system.key === key)?.label ?? key;

  return (
    <div className={pageLayout.container}>
      <PageMeta titleKey="tabs.iam_sync_users" />
      <div className={pageLayout.headline}>
        <CardTitle
          title={<DangerousRaw>Đồng bộ IAM</DangerousRaw>}
          subtitle={
            <DangerousRaw>
              Đúng dữ liệu IAM Sync API trả cho các hệ tích hợp: mỗi người ở đơn vị nào, chức danh
              gì, và mã của họ ở từng hệ. Chỉ xem; người chưa thuộc tổ chức nào không có ở đây.
            </DangerousRaw>
          }
        />
        <div className={styles.actions}>
          <Button
            size="large"
            title={<DangerousRaw>Làm mới</DangerousRaw>}
            isLoading={isLoading}
            onClick={() => {
              void reload();
            }}
          />
          <Button
            type="primary"
            size="large"
            title={<DangerousRaw>Nhập người dùng</DangerousRaw>}
            onClick={() => {
              navigate('/iam-staff-import');
            }}
          />
        </div>
      </div>

      {error && (
        <InlineNotification severity="error" className={styles.notice}>
          {error}
        </InlineNotification>
      )}

      {summary && (
        <div className={styles.summary}>
          <Card className={styles.stat}>
            Người dùng
            <strong>{summary.total}</strong>
          </Card>
          <Card className={styles.stat}>
            Đã nối với hệ (có mã trong external_ids)
            <div className={styles.linked}>
              {summary.linked.length === 0 && <span>Chưa có hệ</span>}
              {summary.linked.map(({ key, label, count }) => (
                <Tag key={key} variant="cell">
                  {label} {count}
                </Tag>
              ))}
            </div>
          </Card>
          <Card className={styles.stat}>
            Đang khoá
            <strong>{summary.suspended}</strong>
          </Card>
          <Card className={classNames(styles.stat, summary.untypedUnits > 0 && styles.warning)}>
            Đơn vị thiếu loại (type)
            <strong>{summary.untypedUnits}</strong>
          </Card>
        </div>
      )}

      <Table
        className={styles.table}
        rowIndexKey="id"
        isLoading={!loaded && !error}
        rowGroups={[{ key: 'users', data: visible }]}
        filter={
          loaded && (
            <SyncFilters
              filter={filter}
              systems={systems}
              users={loaded.users}
              onChange={setFilter}
            />
          )
        }
        placeholder={<div className={styles.muted}>Không có người nào khớp bộ lọc.</div>}
        columns={[
          {
            title: 'Người dùng',
            dataIndex: 'name',
            colSpan: 4,
            render: ({ name, username }) => (
              <>
                <div className={styles.name}>{name ?? '—'}</div>
                <div className={styles.muted}>{username ?? '—'}</div>
              </>
            ),
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            colSpan: 3,
            render: ({ status }) => (
              <Tag type="state" status={status === 'active' ? 'success' : 'error'} variant="plain">
                <DangerousRaw>{status === 'active' ? 'Hoạt động' : 'Đang khoá'}</DangerousRaw>
              </Tag>
            ),
          },
          {
            title: 'Đơn vị và chức danh',
            dataIndex: 'organizations',
            colSpan: 8,
            render: (user) =>
              loaded &&
              unitsOf(user, loaded.tree).map((unit) => (
                <div key={unit.id} className={styles.unit}>
                  <div className={styles.unitHead}>
                    {unit.name}
                    <span className={unit.type ? styles.typeTag : styles.missingTag}>
                      {unit.type ? unitTypeLabel(unit.type) : 'Thiếu loại'}
                    </span>
                  </div>
                  <div className={styles.muted}>
                    {[unit.title, unit.place].filter(Boolean).join(' · ')}
                  </div>
                </div>
              )),
          },
          {
            title: 'Mã ở các hệ',
            dataIndex: 'external_ids',
            colSpan: 5,
            render: ({ external_ids }) => {
              const ids = Object.entries(external_ids ?? {});
              return ids.length === 0 ? (
                <span className={styles.muted}>Chưa nối hệ nào</span>
              ) : (
                <div className={styles.ids}>
                  {ids.map(([key, id]) => (
                    <Tag key={key} variant="cell">
                      {labelOf(key)}{' '}
                      <span className={styles.code} title={id}>
                        {id.length > 12 ? `${id.slice(0, 8)}…` : id}
                      </span>
                    </Tag>
                  ))}
                </div>
              );
            },
          },
          {
            title: 'Phạm vi riêng',
            dataIndex: 'scopes',
            colSpan: 3,
            render: ({ scopes }) =>
              scopes.length === 0 ? '—' : scopes.map(({ type, id }) => `${type}: ${id}`).join(', '),
          },
          {
            title: 'Cập nhật',
            dataIndex: 'updated_at',
            colSpan: 3,
            render: ({ updated_at }) => (
              <span className={styles.muted}>{new Date(updated_at).toLocaleString('vi-VN')}</span>
            ),
          },
        ]}
      />
    </div>
  );
}

export default IamSyncUsers;
