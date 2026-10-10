import { useMemo, useState } from 'react';

import Button from '@/ds-components/Button';
import Card from '@/ds-components/Card';
import Checkbox from '@/ds-components/Checkbox';
import DangerousRaw from '@/ds-components/DangerousRaw';
import InlineNotification from '@/ds-components/InlineNotification';
import RadioGroup, { Radio } from '@/ds-components/RadioGroup';
import useApi from '@/hooks/use-api';

import styles from './index.module.scss';
import { saveLogin, type SystemDetail } from './system-api';
import {
  availableUnitTypes,
  type IamLogin,
  loginModes,
  loginModeTitles,
  organizationIdsForUnitTypes,
  parseIamLogin,
  splitBySignIn,
  unitTypeLabel,
} from './systems';

type Props = {
  readonly detail: SystemDetail;
  readonly onSaved: () => Promise<void>;
};

const modeDescriptions: Readonly<Record<IamLogin['mode'], string>> = Object.freeze({
  open: 'Ai có tài khoản IAM cũng vào được.',
  limited: 'Chỉ người thuộc các loại đơn vị được chọn.',
  blocked: 'Không ai đăng nhập được, kể cả quản trị. Dùng khi bảo trì, sự cố.',
});

const isSameLogin = (left: IamLogin, right: IamLogin) =>
  left.mode === right.mode &&
  (left.mode !== 'limited' ||
    left.unitTypes.slice().sort().join(',') === right.unitTypes.slice().sort().join(','));

const loginModeSet: ReadonlySet<string> = new Set(loginModes);

const isLoginMode = (value: string): value is IamLogin['mode'] => loginModeSet.has(value);

/** Ai được đăng nhập vào hệ: mở, giới hạn theo loại đơn vị, hoặc chặn toàn bộ. */
function LoginCard({ detail, onSaved }: Props) {
  const api = useApi({ hideErrorToast: true });
  const { loginApp, system, organizations, users } = detail;
  const saved = parseIamLogin(loginApp?.customData);
  const [draft, setDraft] = useState<IamLogin>(saved);
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const unitTypes = useMemo(() => availableUnitTypes(organizations), [organizations]);
  const unitCount = (types: readonly string[]) =>
    organizationIdsForUnitTypes(organizations, types).length;
  const { allowed, denied } = splitBySignIn(users, draft);
  const isChanged = !isSameLogin(draft, saved);
  const isDraftValid = draft.mode !== 'limited' || draft.unitTypes.length > 0;

  if (!loginApp) {
    return (
      <Card>
        <h3 className={styles.cardTitle}>Ai được đăng nhập vào {system.label}</h3>
        <div className={styles.cardSubtitle}>
          Hệ chưa gắn app đăng nhập. Gắn app ở thẻ App đăng nhập bên dưới.
        </div>
      </Card>
    );
  }

  const save = async () => {
    setIsSaving(true);
    setError(undefined);
    try {
      await saveLogin(api, loginApp.id, draft, organizations);
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
          <h3 className={styles.cardTitle}>Ai được đăng nhập vào {system.label}</h3>
          <div className={styles.cardSubtitle}>
            Kiểm ngay khi đăng nhập. Tài khoản vẫn dùng được ở các hệ khác.
          </div>
        </div>
      </div>

      <RadioGroup
        name={`iam-login-${loginApp.id}`}
        type="card"
        className={styles.modes}
        value={draft.mode}
        onChange={(value) => {
          if (isLoginMode(value)) {
            setDraft({ ...draft, mode: value });
          }
        }}
      >
        {loginModes.map((mode) => (
          <Radio key={mode} value={mode}>
            <div className={styles.modeText}>
              <span className={styles.modeTitle}>{loginModeTitles[mode]}</span>
              <span className={styles.modeDescription}>{modeDescriptions[mode]}</span>
            </div>
          </Radio>
        ))}
      </RadioGroup>

      {draft.mode === 'limited' && (
        <div className={styles.limitBox}>
          <div className={styles.limitLabel}>Theo loại đơn vị</div>
          <div className={styles.unitTypes}>
            {unitTypes.map((type) => (
              <Checkbox
                key={type}
                checked={draft.unitTypes.includes(type)}
                label={`${unitTypeLabel(type)} (${unitCount([type])})`}
                onChange={(isChecked) => {
                  setDraft({
                    ...draft,
                    unitTypes: isChecked
                      ? [...draft.unitTypes, type]
                      : draft.unitTypes.filter((value) => value !== type),
                  });
                }}
              />
            ))}
          </div>
          <div className={styles.hint}>
            Đã chọn {draft.unitTypes.length} loại = {unitCount(draft.unitTypes)} đơn vị. Đơn vị thêm
            vào cây sau này chỉ được tính sau khi bấm Lưu lại.
          </div>
        </div>
      )}

      {draft.mode === 'blocked' && (
        <InlineNotification severity="alert" className={styles.notice}>
          Chặn toàn bộ: mọi tài khoản, kể cả quản trị, không vào được {system.label}; người đang
          đăng nhập cũng không làm mới được phiên.
        </InlineNotification>
      )}

      <div className={styles.saveBar}>
        <span>
          <b>{allowed.length}</b> người hiện có được đăng nhập · <b>{denied.length}</b> người bị
          chặn
          {denied.length > 0 &&
            ` (${denied
              .slice(0, 3)
              .map(({ username }) => username ?? '?')
              .join(', ')}${denied.length > 3 ? ', …' : ''})`}
        </span>
        <Button
          type="primary"
          title={<DangerousRaw>Lưu</DangerousRaw>}
          disabled={!isChanged || !isDraftValid}
          isLoading={isSaving}
          onClick={() => {
            void save();
          }}
        />
      </div>
      {!isDraftValid && (
        <InlineNotification severity="error" className={styles.notice}>
          Chọn ít nhất một loại đơn vị.
        </InlineNotification>
      )}
      {error && (
        <InlineNotification severity="error" className={styles.notice}>
          {error}
        </InlineNotification>
      )}
    </Card>
  );
}

export default LoginCard;
