import { type Application } from '@logto/schemas';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import Button from '@/ds-components/Button';
import DangerousRaw from '@/ds-components/DangerousRaw';
import useTenantPathname from '@/hooks/use-tenant-pathname';

import LoginModeTag from './LoginModeTag';
import styles from './index.module.scss';
import { type SystemList as Systems } from './system-api';
import { countLinked, parseIamLogin, type SyncUserSummary } from './systems';

type Props = {
  readonly systems: Systems;
  readonly users: readonly SyncUserSummary[];
  readonly selectedId?: string;
  readonly onRegister: (application: Application) => void;
};

/** Cột trái: mỗi hệ một thẻ (tên, chế độ đăng nhập, số người đã nối), và app M2M chưa khai báo. */
function SystemList({ systems, users, selectedId, onRegister }: Props) {
  const { getTo } = useTenantPathname();

  return (
    <nav className={styles.list} aria-label="Danh sách hệ">
      {systems.systems.map(({ system, syncApp, loginApp }) => {
        const isSelected = syncApp.id === selectedId;
        return (
          <Link
            key={syncApp.id}
            to={getTo(`/iam-systems/${syncApp.id}`)}
            className={classNames(styles.systemItem, isSelected && styles.selected)}
            aria-current={isSelected ? 'page' : undefined}
          >
            <div className={styles.itemHead}>
              <span className={styles.itemTitle}>{system.label}</span>
              <LoginModeTag login={loginApp ? parseIamLogin(loginApp.customData) : undefined} />
            </div>
            {system.description && (
              <div className={styles.itemDescription}>{system.description}</div>
            )}
            <div className={styles.itemMeta}>
              <span>{countLinked(users, system.key)} người đã nối</span>
              <span>
                khoá <span className={styles.code}>{system.key}</span>
              </span>
            </div>
          </Link>
        );
      })}

      {systems.unregisteredSyncApps.length > 0 && (
        <>
          <div className={styles.sectionLabel}>App M2M chưa khai báo hệ</div>
          {systems.unregisteredSyncApps.map((application) => (
            <div key={application.id} className={styles.unregisteredItem}>
              <div>
                <div>{application.name}</div>
                <div className={styles.mono}>{application.id}</div>
              </div>
              <Button
                size="small"
                title={<DangerousRaw>Khai báo</DangerousRaw>}
                onClick={() => {
                  onRegister(application);
                }}
              />
            </div>
          ))}
        </>
      )}
    </nav>
  );
}

export default SystemList;
