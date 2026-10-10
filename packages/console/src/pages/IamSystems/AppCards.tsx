import { useState } from 'react';

import Button from '@/ds-components/Button';
import Card from '@/ds-components/Card';
import CopyToClipboard from '@/ds-components/CopyToClipboard';
import DangerousRaw from '@/ds-components/DangerousRaw';
import InlineNotification from '@/ds-components/InlineNotification';
import Select from '@/ds-components/Select';
import TextLink from '@/ds-components/TextLink';
import useApi from '@/hooks/use-api';

import styles from './index.module.scss';
import {
  grantSyncRole,
  joinNationwide,
  nationwideOrganizationId,
  registerSystem,
  removeSyncRole,
  type SystemDetail,
} from './system-api';
import { extraSyncRoles } from './systems';

type Props = {
  readonly detail: SystemDetail;
  readonly onSaved: () => Promise<void>;
};

/** Chạy một thao tác ghi, rồi nạp lại; trả lỗi để hiện trong thẻ. */
const useSaver = (onSaved: () => Promise<void>) => {
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

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

  return { error, isSaving, run };
};

function LoginAppCard({ detail, onSaved }: Props) {
  const api = useApi({ hideErrorToast: true });
  const { loginApp, system, syncApp, loginCandidates } = detail;
  const [candidateId, setCandidateId] = useState<string>();
  const { error, isSaving, run } = useSaver(onSaved);

  return (
    <Card className={styles.appCard}>
      <div>
        <h3 className={styles.cardTitle}>App đăng nhập</h3>
        <div className={styles.cardSubtitle}>
          {loginApp ? `${loginApp.type} · OIDC` : 'Chưa gắn app đăng nhập'}
        </div>
      </div>
      {loginApp ? (
        <>
          <dl className={styles.facts}>
            <dt>Tên</dt>
            <dd>{loginApp.name}</dd>
            <dt>Client ID</dt>
            <dd>
              <CopyToClipboard value={loginApp.id} variant="text" />
            </dd>
            <dt>Redirect URI</dt>
            <dd>
              {loginApp.oidcClientMetadata.redirectUris.length > 0
                ? loginApp.oidcClientMetadata.redirectUris.join(', ')
                : '—'}
            </dd>
          </dl>
          <TextLink to={`/applications/${loginApp.id}`}>Mở app trong Ứng dụng</TextLink>
        </>
      ) : (
        <div className={styles.linkRow}>
          <Select
            isSearchEnabled
            value={candidateId}
            placeholder="Chọn app web, SPA, native…"
            options={loginCandidates.map(({ id, name }) => ({ value: id, title: name }))}
            onChange={setCandidateId}
          />
          <Button
            title={<DangerousRaw>Gắn</DangerousRaw>}
            disabled={!candidateId}
            isLoading={isSaving}
            onClick={() => {
              if (candidateId) {
                void run(async () =>
                  registerSystem(api, syncApp.id, { ...system, loginAppId: candidateId })
                );
              }
            }}
          />
        </div>
      )}
      {error && <InlineNotification severity="error">{error}</InlineNotification>}
    </Card>
  );
}

function SyncAppCard({ detail, onSaved }: Props) {
  const api = useApi({ hideErrorToast: true });
  const { syncApp, syncRoles, syncOrganizations, organizations, users } = detail;
  const { error, isSaving, run } = useSaver(onSaved);

  const extraRoles = extraSyncRoles(syncRoles);
  const hasSyncRole = syncRoles.length > extraRoles.length;
  const isNationwide = syncOrganizations.some(({ id }) => id === nationwideOrganizationId);
  const scope = isNationwide
    ? `Toàn quốc (${organizations.length} đơn vị, ${users.length} người)`
    : syncOrganizations.length > 0
      ? `${syncOrganizations.map(({ name }) => name).join(', ')} và đơn vị con`
      : 'Chưa là thành viên tổ chức nào';

  return (
    <Card className={styles.appCard}>
      <div>
        <h3 className={styles.cardTitle}>App đồng bộ</h3>
        <div className={styles.cardSubtitle}>M2M · quyền iam-sync:read</div>
      </div>
      <dl className={styles.facts}>
        <dt>Tên</dt>
        <dd>{syncApp.name}</dd>
        <dt>Client ID</dt>
        <dd>
          <CopyToClipboard value={syncApp.id} variant="text" />
        </dd>
        <dt>Được thấy</dt>
        <dd>{scope}</dd>
      </dl>
      {!hasSyncRole && (
        <InlineNotification severity="error">
          Thiếu vai trò machine:iam-sync: hệ không lấy được token cho IAM Sync API.{' '}
          <Button
            size="small"
            type="text"
            title={<DangerousRaw>Gán vai trò</DangerousRaw>}
            isLoading={isSaving}
            onClick={() => {
              void run(async () => grantSyncRole(api, syncApp.id));
            }}
          />
        </InlineNotification>
      )}
      {syncOrganizations.length === 0 && (
        <InlineNotification severity="error">
          App chưa là thành viên tổ chức nào: IAM Sync API trả lỗi 403.{' '}
          <Button
            size="small"
            type="text"
            title={<DangerousRaw>Thêm vào Toàn quốc</DangerousRaw>}
            isLoading={isSaving}
            onClick={() => {
              void run(async () => joinNationwide(api, syncApp.id));
            }}
          />
        </InlineNotification>
      )}
      {extraRoles.length > 0 && (
        <InlineNotification severity="alert">
          App còn quyền thừa ({extraRoles.map(({ name }) => name).join(', ')}). Hệ chỉ cần
          iam-sync:read.{' '}
          <Button
            size="small"
            type="text"
            title={<DangerousRaw>Gỡ quyền thừa</DangerousRaw>}
            isLoading={isSaving}
            onClick={() => {
              void run(async () =>
                Promise.all(extraRoles.map(async ({ id }) => removeSyncRole(api, syncApp.id, id)))
              );
            }}
          />
        </InlineNotification>
      )}
      <TextLink to={`/applications/${syncApp.id}`}>Mở app trong Ứng dụng</TextLink>
      {error && <InlineNotification severity="error">{error}</InlineNotification>}
    </Card>
  );
}

/** Hai thẻ cạnh nhau: app đăng nhập và app đồng bộ của hệ. */
function AppCards(props: Props) {
  return (
    <div className={styles.apps}>
      <LoginAppCard {...props} />
      <SyncAppCard {...props} />
    </div>
  );
}

export default AppCards;
