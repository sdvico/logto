import { useState } from 'react';
import ReactModal from 'react-modal';

import Button from '@/ds-components/Button';
import DangerousRaw from '@/ds-components/DangerousRaw';
import FormField from '@/ds-components/FormField';
import InlineNotification from '@/ds-components/InlineNotification';
import ModalLayout from '@/ds-components/ModalLayout';
import RadioGroup, { Radio } from '@/ds-components/RadioGroup';
import TextInput from '@/ds-components/TextInput';
import useApi from '@/hooks/use-api';
import modalStyles from '@/scss/modal.module.scss';

import styles from './index.module.scss';
import { callbackUriOf, createSystem, type NewSystemInput } from './system-api';
import { checkSystemKey } from './systems';

type Props = {
  readonly usedKeys: ReadonlySet<string>;
  /** `createdId`: id app đồng bộ của hệ vừa tạo; không có nghĩa là huỷ. */
  readonly onClose: (createdId?: string) => void;
};

const isHttpUrl = (value: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

/**
 * SDVICO: thêm hệ mới trong một lần — app đăng nhập (web truyền thống), app đồng bộ M2M chỉ có
 * `machine:iam-sync`, thành viên Toàn quốc, bản ghi hệ. Mặc định chặn đăng nhập đến khi hệ sẵn sàng.
 */
function AddSystemModal({ usedKeys, onClose }: Props) {
  const api = useApi({ hideErrorToast: true });
  const [input, setInput] = useState<NewSystemInput>({
    key: '',
    label: '',
    origin: '',
    initialMode: 'blocked',
  });
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const keyError = input.key ? checkSystemKey(input.key, usedKeys) : undefined;
  const originError =
    input.origin && !isHttpUrl(input.origin)
      ? 'Địa chỉ phải bắt đầu bằng http:// hoặc https://'
      : undefined;
  const isValid =
    Boolean(input.label.trim() && input.key && input.origin) && !keyError && !originError;
  const label = input.label.trim() || '<tên hệ>';

  const update = (patch: Partial<NewSystemInput>) => {
    setInput({ ...input, ...patch });
  };

  const submit = async () => {
    setIsSaving(true);
    setError(undefined);
    try {
      onClose(await createSystem(api, { ...input, label: input.label.trim() }));
    } catch (createError: unknown) {
      setError(
        `Tạo hệ dở dang: ${String(createError)}. Xem các app đã tạo ở mục Ứng dụng trước khi thử lại.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ReactModal
      isOpen
      shouldCloseOnEsc
      className={modalStyles.content}
      overlayClassName={modalStyles.overlay}
      onRequestClose={() => {
        // Đang tạo thì không cho đóng, kẻo tạo xong lại tự chuyển trang sau khi người dùng đã rời đi.
        if (!isSaving) {
          onClose();
        }
      }}
    >
      <ModalLayout
        title={<DangerousRaw>Thêm hệ</DangerousRaw>}
        subtitle={
          <DangerousRaw>
            Một lần tạo đủ cho hệ mới: app đăng nhập, app đồng bộ có đúng quyền, và cấu hình để giao
            cho đội phát triển.
          </DangerousRaw>
        }
        size="large"
        footer={
          <Button
            type="primary"
            size="large"
            title={<DangerousRaw>Tạo hệ</DangerousRaw>}
            disabled={!isValid}
            isLoading={isSaving}
            onClick={() => {
              void submit();
            }}
          />
        }
        onClose={() => {
          if (!isSaving) {
            onClose();
          }
        }}
      >
        <div className={styles.modalForm}>
          <FormField isRequired title={<DangerousRaw>Tên hiển thị</DangerousRaw>}>
            <TextInput
              value={input.label}
              placeholder="vd eLogbook"
              onChange={({ currentTarget }) => {
                update({ label: currentTarget.value });
              }}
            />
          </FormField>
          <FormField
            isRequired
            title={<DangerousRaw>Khoá</DangerousRaw>}
            description={
              <DangerousRaw>
                Mã người dùng ở hệ này lưu vào external_ids.{input.key || '<khoá>'}. Không đổi được
                sau khi đã có người nối.
              </DangerousRaw>
            }
          >
            <TextInput
              value={input.key}
              placeholder="vd elogbook"
              error={keyError}
              onChange={({ currentTarget }) => {
                update({ key: currentTarget.value.trim() });
              }}
            />
          </FormField>
          <FormField
            isRequired
            title={<DangerousRaw>Địa chỉ của hệ</DangerousRaw>}
            description={
              <DangerousRaw>
                Redirect URI tự điền là{' '}
                {input.origin ? callbackUriOf(input.origin) : '<địa chỉ>/auth/callback'}, sửa được
                sau ở mục Ứng dụng.
              </DangerousRaw>
            }
          >
            <TextInput
              value={input.origin}
              placeholder="https://elogbook.example.vn"
              error={originError}
              onChange={({ currentTarget }) => {
                update({ origin: currentTarget.value.trim() });
              }}
            />
          </FormField>
          <FormField title={<DangerousRaw>Đăng nhập lúc mới tạo</DangerousRaw>}>
            <RadioGroup
              name="iam-initial-mode"
              value={input.initialMode}
              onChange={(value) => {
                update({ initialMode: value === 'open' ? 'open' : 'blocked' });
              }}
            >
              <Radio
                value="blocked"
                title={<DangerousRaw>Chặn toàn bộ, mở khi hệ sẵn sàng</DangerousRaw>}
              />
              <Radio value="open" title={<DangerousRaw>Mọi tài khoản IAM</DangerousRaw>} />
            </RadioGroup>
          </FormField>
          <InlineNotification severity="info">
            IAM sẽ tạo:
            <ol className={styles.willCreate}>
              <li>App đăng nhập &quot;{label}&quot; (web truyền thống, OIDC).</li>
              <li>App đồng bộ &quot;{label} sync&quot;: M2M, chỉ quyền iam-sync:read.</li>
              <li>Phạm vi đồng bộ Toàn quốc: app đồng bộ thành viên tổ chức toan-quoc.</li>
              <li>Khoá external_ids.{input.key || '<khoá>'} cho người dùng của hệ.</li>
            </ol>
          </InlineNotification>
          {error && <InlineNotification severity="error">{error}</InlineNotification>}
        </div>
      </ModalLayout>
    </ReactModal>
  );
}

export default AddSystemModal;
