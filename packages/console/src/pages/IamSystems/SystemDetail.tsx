import { useCallback, useEffect, useState } from 'react';

import Button from '@/ds-components/Button';
import Card from '@/ds-components/Card';
import DangerousRaw from '@/ds-components/DangerousRaw';
import InlineNotification from '@/ds-components/InlineNotification';
import Spacer from '@/ds-components/Spacer';
import useApi from '@/hooks/use-api';
import useTenantPathname from '@/hooks/use-tenant-pathname';

import AppCards from './AppCards';
import ConfigCard from './ConfigCard';
import LoginCard from './LoginCard';
import styles from './index.module.scss';
import { loadSystemDetail, type SystemDetail as Detail } from './system-api';
import { countLinked } from './systems';

type Props = {
  readonly syncAppId: string;
  /** Gọi sau mỗi lần lưu để danh sách bên trái cập nhật. */
  readonly onChanged: () => Promise<void>;
};

/** SDVICO: chi tiết một hệ — ai được đăng nhập, hai app, cấu hình giao cho đội của hệ. */
function SystemDetail({ syncAppId, onChanged }: Props) {
  const api = useApi({ hideErrorToast: true });
  const { navigate } = useTenantPathname();
  const [detail, setDetail] = useState<Detail>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>();

  const reload = useCallback(async () => {
    setError(undefined);
    try {
      setDetail(await loadSystemDetail(api, syncAppId));
      setIsLoaded(true);
    } catch (loadError: unknown) {
      setError(`Không tải được hệ: ${String(loadError)}`);
    }
  }, [api, syncAppId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const refresh = useCallback(async () => {
    await Promise.all([reload(), onChanged()]);
  }, [reload, onChanged]);

  if (error) {
    return <InlineNotification severity="error">{error}</InlineNotification>;
  }

  if (!isLoaded) {
    return <Card className={styles.emptyCard}>Đang tải…</Card>;
  }

  if (!detail) {
    return <Card className={styles.emptyCard}>Không có hệ nào với app đồng bộ này.</Card>;
  }

  const { system } = detail;

  return (
    <section className={styles.detail} aria-label={`Chi tiết hệ ${system.label}`}>
      <Card>
        <div className={styles.detailHeader}>
          <div>
            <h2 className={styles.detailTitle}>{system.label}</h2>
            <div className={styles.detailMeta}>
              Khoá <span className={styles.code}>{system.key}</span> ·{' '}
              {countLinked(detail.users, system.key)} người đã nối · mã lưu ở{' '}
              <span className={styles.code}>external_ids.{system.key}</span>
            </div>
            {system.description && <div className={styles.detailMeta}>{system.description}</div>}
          </div>
          <Spacer />
          <Button
            title={<DangerousRaw>Nhập người dùng từ {system.label}</DangerousRaw>}
            onClick={() => {
              navigate({ pathname: '/iam-staff-import', search: `?source=${system.key}` });
            }}
          />
        </div>
      </Card>
      <LoginCard key={detail.loginApp?.id} detail={detail} onSaved={refresh} />
      <AppCards detail={detail} onSaved={refresh} />
      <ConfigCard detail={detail} onSaved={refresh} />
    </section>
  );
}

export default SystemDetail;
