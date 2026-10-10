import classNames from 'classnames';
import { useState } from 'react';

import Upload from '@/assets/icons/cloud-upload.svg?react';
import Card from '@/ds-components/Card';
import RadioGroup, { Radio } from '@/ds-components/RadioGroup';
import TextLink from '@/ds-components/TextLink';

import styles from './index.module.scss';
import { type ImportSource, optionalColumns, requiredColumns } from './staff-rows';

type Props = {
  /** Các hệ ở Hệ tích hợp; `undefined` khi đang tải. */
  readonly sources?: readonly ImportSource[];
  readonly sourceKey: string;
  readonly isDisabled: boolean;
  readonly onSource: (key: string) => void;
  readonly onFile: (file: File) => void;
};

/** Bước 1: chọn hệ nguồn (từ Hệ tích hợp, không cố định), rồi kéo thả hoặc chọn tệp CSV. */
function SourceStep({ sources, sourceKey, isDisabled, onSource, onFile }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const source = sources?.find(({ key }) => key === sourceKey);
  const isDropDisabled = isDisabled || !source;

  return (
    <>
      <Card>
        <h3 className={styles.cardTitle}>Hệ nguồn</h3>
        <div className={styles.cardSubtitle}>
          Lấy từ danh sách <TextLink to="/iam-systems">Hệ tích hợp</TextLink>; thêm hệ ở đó thì hệ
          hiện ở đây.
        </div>
        {sources?.length === 0 ? (
          <div className={styles.note}>
            Chưa có hệ nào. Khai báo ở <TextLink to="/iam-systems">Hệ tích hợp</TextLink> trước.
          </div>
        ) : (
          <RadioGroup
            name="iam-import-source"
            type="card"
            className={styles.sources}
            value={sourceKey}
            onChange={onSource}
          >
            {(sources ?? []).map(({ key, label }) => (
              <Radio key={key} value={key}>
                <div className={styles.sourceText}>
                  <span className={styles.sourceLabel}>{label}</span>
                  <span className={styles.sourceKey}>Mã lưu vào external_ids.{key}</span>
                </div>
              </Radio>
            ))}
          </RadioGroup>
        )}
      </Card>

      <label
        className={classNames(
          styles.dropzone,
          isDragging && styles.dragging,
          isDropDisabled && styles.disabled
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(!isDropDisabled);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files[0];
          if (file && !isDropDisabled) {
            onFile(file);
          }
        }}
      >
        <Upload />
        <span className={styles.dropTitle}>
          {source ? `Kéo tệp CSV xuất từ ${source.label} vào đây` : 'Chọn hệ nguồn trước'}
        </span>
        <span className={styles.dropHint}>
          hoặc <span>chọn tệp từ máy</span> · một tệp .csv
        </span>
        <input
          type="file"
          accept=".csv,text/csv"
          disabled={isDropDisabled}
          aria-label="Chọn tệp CSV người dùng"
          onChange={({ target }) => {
            const file = target.files?.[0];
            // Xoá giá trị để chọn lại đúng tệp đó (sau khi sửa) vẫn gọi được onChange.
            // eslint-disable-next-line @silverhand/fp/no-mutation -- resetting a native file input is the only way to re-pick the same file
            target.value = '';
            if (file) {
              onFile(file);
            }
          }}
        />
      </label>

      <Card>
        <h3 className={styles.cardTitle}>Định dạng tệp chung cho mọi hệ</h3>
        <div className={styles.cardSubtitle}>Đọc theo tên cột; thứ tự cột không quan trọng.</div>
        <div className={styles.label}>Cột bắt buộc</div>
        <div className={styles.columns}>
          {requiredColumns.map((column) => (
            <span key={column} className={styles.column}>
              {column}
            </span>
          ))}
        </div>
        <div className={styles.label}>Cột chỉ để đọc, giúp soát</div>
        <div className={styles.columns}>
          {optionalColumns.map((column) => (
            <span key={column} className={styles.column}>
              {column}
            </span>
          ))}
        </div>
        <div className={styles.note}>
          <b>account_id</b> là mã tài khoản ở hệ nguồn; IAM lưu vào{' '}
          <span className={styles.code}>external_ids</span> theo hệ đã chọn. Sửa được trên Excel
          trước khi nhập: <b>role</b> và <b>units</b>. Tệp MKN cũ (mkn_account_id, mkn_groups,
          mkn_scopes, mkn_scope_places) vẫn nhận.
        </div>
      </Card>
    </>
  );
}

export default SourceStep;
