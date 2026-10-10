import { type Application } from '@logto/schemas';
import { useState } from 'react';
import ReactModal from 'react-modal';

import Button from '@/ds-components/Button';
import DangerousRaw from '@/ds-components/DangerousRaw';
import FormField from '@/ds-components/FormField';
import InlineNotification from '@/ds-components/InlineNotification';
import ModalLayout from '@/ds-components/ModalLayout';
import TextInput from '@/ds-components/TextInput';
import useApi from '@/hooks/use-api';
import modalStyles from '@/scss/modal.module.scss';

import styles from './index.module.scss';
import { registerSystem } from './system-api';
import { checkSystemKey } from './systems';

type Props = {
  readonly application: Application;
  readonly usedKeys: ReadonlySet<string>;
  readonly onClose: (isRegistered: boolean) => void;
};

/** Khai báo một app M2M có sẵn là app đồng bộ của một hệ. */
function RegisterModal({ application, usedKeys, onClose }: Props) {
  const api = useApi({ hideErrorToast: true });
  const [label, setLabel] = useState(application.name.replace(/ sync( client)?$/i, ''));
  const [key, setKey] = useState('');
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const keyError = key ? checkSystemKey(key, usedKeys) : undefined;

  const save = async () => {
    setIsSaving(true);
    setError(undefined);
    try {
      await registerSystem(api, application.id, { key, label: label.trim() });
      onClose(true);
    } catch (saveError: unknown) {
      setError(`Không lưu được: ${String(saveError)}`);
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
        onClose(false);
      }}
    >
      <ModalLayout
        title={<DangerousRaw>Khai báo hệ cho {application.name}</DangerousRaw>}
        subtitle={
          <DangerousRaw>
            App đồng bộ tạo trước khi có trang này. Khai báo tên và khoá để quản lý ở Hệ tích hợp.
          </DangerousRaw>
        }
        footer={
          <Button
            type="primary"
            size="large"
            title={<DangerousRaw>Khai báo</DangerousRaw>}
            disabled={!key || Boolean(keyError) || !label.trim()}
            isLoading={isSaving}
            onClick={() => {
              void save();
            }}
          />
        }
        onClose={() => {
          onClose(false);
        }}
      >
        <div className={styles.modalForm}>
          <FormField isRequired title={<DangerousRaw>Tên hiển thị</DangerousRaw>}>
            <TextInput
              value={label}
              placeholder="vd MKN"
              onChange={({ currentTarget }) => {
                setLabel(currentTarget.value);
              }}
            />
          </FormField>
          <FormField
            isRequired
            title={<DangerousRaw>Khoá</DangerousRaw>}
            description={
              <DangerousRaw>
                Phải đúng khoá hệ đang đọc trong external_ids (MKN là mkn). Không đổi được sau khi
                đã có người nối.
              </DangerousRaw>
            }
          >
            <TextInput
              value={key}
              placeholder="vd mkn"
              error={keyError}
              onChange={({ currentTarget }) => {
                setKey(currentTarget.value.trim());
              }}
            />
          </FormField>
          {error && <InlineNotification severity="error">{error}</InlineNotification>}
        </div>
      </ModalLayout>
    </ReactModal>
  );
}

export default RegisterModal;
