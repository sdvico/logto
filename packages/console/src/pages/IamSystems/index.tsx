import { type Application } from '@logto/schemas';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Plus from '@/assets/icons/plus.svg?react';
import PageMeta from '@/components/PageMeta';
import Button from '@/ds-components/Button';
import Card from '@/ds-components/Card';
import CardTitle from '@/ds-components/CardTitle';
import DangerousRaw from '@/ds-components/DangerousRaw';
import InlineNotification from '@/ds-components/InlineNotification';
import useApi from '@/hooks/use-api';
import useTenantPathname from '@/hooks/use-tenant-pathname';
import pageLayout from '@/scss/page-layout.module.scss';

import AddSystemModal from './AddSystemModal';
import RegisterModal from './RegisterModal';
import SystemDetail from './SystemDetail';
import SystemList from './SystemList';
import styles from './index.module.scss';
import { loadSystems, type SystemList as Systems } from './system-api';
import { type SyncUserSummary } from './systems';

const pathname = '/iam-systems';
const createPathname = `${pathname}/create`;

/**
 * SDVICO: "Hệ tích hợp" — các hệ (MKN, IUU, eLogbook, …) dùng chung tài khoản IAM. Mỗi hệ là một app
 * đồng bộ M2M có `custom_data.iamSystem`, kèm app đăng nhập. Danh sách đọc từ dữ liệu, không cố định.
 * Bố cục như thiết kế: danh sách hệ bên trái, chi tiết hệ đang chọn bên phải.
 */
function IamSystems() {
  const api = useApi({ hideErrorToast: true });
  const { syncAppId } = useParams();
  const { navigate, match } = useTenantPathname();
  const isCreating = match(createPathname);
  const [systems, setSystems] = useState<Systems>();
  const [users, setUsers] = useState<SyncUserSummary[]>([]);
  const [error, setError] = useState<string>();
  const [registering, setRegistering] = useState<Application>();

  const reload = useCallback(async () => {
    setError(undefined);
    try {
      const [loaded, preview] = await Promise.all([
        loadSystems(api),
        api.get('api/iam-sync-preview/users').json<{ data: SyncUserSummary[] }>(),
      ]);
      setSystems(loaded);
      setUsers(preview.data);
    } catch (loadError: unknown) {
      setError(`Không tải được danh sách hệ: ${String(loadError)}`);
    }
  }, [api]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const selectedId =
    syncAppId && syncAppId !== 'create' ? syncAppId : systems?.systems[0]?.syncApp.id;
  const usedKeys = new Set(systems?.systems.map(({ system }) => system.key));

  return (
    <div className={pageLayout.container}>
      <PageMeta titleKey="tabs.iam_systems" />
      <div className={pageLayout.headline}>
        <CardTitle
          title={<DangerousRaw>Hệ tích hợp</DangerousRaw>}
          subtitle={
            <DangerousRaw>
              Các hệ dùng chung tài khoản IAM. Ở đây quyết định ai được đăng nhập vào hệ nào, hệ
              được thấy những ai, và lấy cấu hình giao cho đội phát triển của hệ.
            </DangerousRaw>
          }
        />
        <Button
          icon={<Plus />}
          type="primary"
          size="large"
          title={<DangerousRaw>Thêm hệ</DangerousRaw>}
          onClick={() => {
            navigate(createPathname);
          }}
        />
      </div>

      {error && (
        <InlineNotification severity="error" className={styles.notice}>
          {error}
        </InlineNotification>
      )}

      {systems && (
        <div className={styles.layout}>
          <SystemList
            systems={systems}
            users={users}
            selectedId={selectedId}
            onRegister={setRegistering}
          />
          {selectedId ? (
            <SystemDetail key={selectedId} syncAppId={selectedId} onChanged={reload} />
          ) : (
            <Card className={styles.emptyCard}>
              Chưa có hệ nào. Bấm Thêm hệ để tạo mới, hoặc khai báo một app M2M có sẵn ở cột bên
              trái.
            </Card>
          )}
        </div>
      )}

      {isCreating && (
        <AddSystemModal
          usedKeys={usedKeys}
          onClose={(createdId) => {
            if (createdId) {
              void reload();
            }
            navigate(createdId ? `${pathname}/${createdId}` : pathname);
          }}
        />
      )}
      {registering && (
        <RegisterModal
          application={registering}
          usedKeys={usedKeys}
          onClose={(isRegistered) => {
            setRegistering(undefined);
            if (isRegistered) {
              void reload();
              navigate(`${pathname}/${registering.id}`);
            }
          }}
        />
      )}
    </div>
  );
}

export default IamSystems;
