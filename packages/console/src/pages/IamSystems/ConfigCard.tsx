import { useContext, useState } from 'react';

import { AppDataContext } from '@/contexts/AppDataProvider';
import { TenantsContext } from '@/contexts/TenantsProvider';
import Button from '@/ds-components/Button';
import Card from '@/ds-components/Card';
import CopyToClipboard from '@/ds-components/CopyToClipboard';
import DangerousRaw from '@/ds-components/DangerousRaw';
import InlineNotification from '@/ds-components/InlineNotification';
import useApi from '@/hooks/use-api';

import styles from './index.module.scss';
import { createSecret, deleteSecret, type SystemDetail } from './system-api';
import { buildConfigBlock } from './systems';

type Props = {
  readonly detail: SystemDetail;
  readonly onSaved: () => Promise<void>;
};

const secretNameOf = (now: Date) => `secret-${now.toISOString().slice(0, 10)}-${now.getTime()}`;

/** Cấu hình giao cho đội của hệ, và secret của app đồng bộ (tạo mới hiện đúng một lần). */
function ConfigCard({ detail, onSaved }: Props) {
  const api = useApi({ hideErrorToast: true });
  const { tenantEndpoint } = useContext(AppDataContext);
  const { currentTenantId } = useContext(TenantsContext);
  const { system, syncApp, loginApp, secrets } = detail;
  const [newSecret, setNewSecret] = useState<string>();
  const [deleting, setDeleting] = useState<string>();
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const config = buildConfigBlock({
    tenantEndpoint: tenantEndpoint?.href,
    tenantId: currentTenantId,
    key: system.key,
    loginAppId: loginApp?.id,
    redirectUri: loginApp?.oidcClientMetadata.redirectUris[0],
    syncAppId: syncApp.id,
  });

  const run = async (action: () => Promise<unknown>) => {
    setIsSaving(true);
    setError(undefined);
    try {
      await action();
      await onSaved();
    } catch (saveError: unknown) {
      setError(`Không lưu được: ${String(saveError)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <div className={styles.cardHead}>
        <div>
          <h3 className={styles.cardTitle}>Cấu hình giao cho {system.label}</h3>
          <div className={styles.cardSubtitle}>
            Đội {system.label} dán vào cấu hình của hệ. Secret không hiện lại; tạo mới thì giao qua
            kênh riêng.
          </div>
        </div>
        <div className={styles.cardActions}>
          <CopyToClipboard value={config} variant="icon" />
          <Button
            title={<DangerousRaw>Tạo secret mới</DangerousRaw>}
            isLoading={isSaving}
            onClick={() => {
              void run(async () => {
                setNewSecret(await createSecret(api, syncApp.id, secretNameOf(new Date())));
              });
            }}
          />
        </div>
      </div>
      <pre className={styles.config}>{config}</pre>

      {newSecret && (
        <InlineNotification severity="success" className={styles.notice}>
          Secret mới của app đồng bộ, chỉ hiện lần này. Giao qua kênh riêng; hệ đổi xong thì xoá
          secret cũ ở dưới.
          <CopyToClipboard hasVisibilityToggle value={newSecret} variant="border" />
        </InlineNotification>
      )}

      <div className={styles.secrets}>
        {secrets.map(({ name, createdAt, expiresAt }) => (
          <div key={name} className={styles.secretRow}>
            <span>
              <span className={styles.code}>{name}</span>{' '}
              <span className={styles.hint}>
                tạo {new Date(createdAt).toLocaleDateString('vi-VN')}
                {expiresAt && ` · hết hạn ${new Date(expiresAt).toLocaleDateString('vi-VN')}`}
              </span>
            </span>
            {secrets.length > 1 && (
              <Button
                size="small"
                type={deleting === name ? 'danger' : 'default'}
                title={
                  <DangerousRaw>{deleting === name ? 'Bấm lần nữa để xoá' : 'Xoá'}</DangerousRaw>
                }
                disabled={isSaving}
                onClick={() => {
                  if (deleting !== name) {
                    setDeleting(name);
                    return;
                  }
                  setDeleting(undefined);
                  void run(async () => deleteSecret(api, syncApp.id, name));
                }}
              />
            )}
          </div>
        ))}
      </div>
      {error && (
        <InlineNotification severity="error" className={styles.notice}>
          {error}
        </InlineNotification>
      )}
    </Card>
  );
}

export default ConfigCard;
