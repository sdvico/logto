import Button from '@/ds-components/Button';
import DangerousRaw from '@/ds-components/DangerousRaw';

import { toCsv } from './csv';
import styles from './index.module.scss';
import { type RowOutcome } from './run-import';

type Props = {
  readonly outcomes: readonly RowOutcome[];
};

const resultHeader = [
  'line',
  'mkn_account_id',
  'username',
  'iam_user_id',
  'result',
  'error',
  'warnings',
];

/** Tải kết quả về CSV (không có mật khẩu) để lưu hồ sơ và báo cán bộ tên đăng nhập. */
const downloadResult = (outcomes: readonly RowOutcome[]) => {
  const csv = toCsv([
    resultHeader,
    ...outcomes.map((outcome) => [
      String(outcome.line),
      outcome.mknAccountId,
      outcome.username,
      outcome.userId ?? outcome.createdUserId ?? '',
      outcome.ok ? 'OK' : 'FAILED',
      outcome.error ?? '',
      (outcome.warnings ?? []).join('; '),
    ]),
  ]);
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  // eslint-disable-next-line @silverhand/fp/no-mutation -- configuring a detached download link
  link.href = url;
  // eslint-disable-next-line @silverhand/fp/no-mutation -- same as above
  link.download = `iam-staff-import-result-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

/** Kết quả từng dòng. */
function ResultPanel({ outcomes }: Props) {
  return (
    <>
      <div className={styles.toolbar}>
        <Button
          title={<DangerousRaw>Tải CSV kết quả</DangerousRaw>}
          onClick={() => {
            downloadResult(outcomes);
          }}
        />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Dòng</th>
              <th>Tên đăng nhập IAM</th>
              <th>Kết quả</th>
              <th>Lỗi / cảnh báo</th>
            </tr>
          </thead>
          <tbody>
            {outcomes.map((outcome) => (
              <tr key={outcome.line}>
                <td>{outcome.line}</td>
                <td>{outcome.username}</td>
                <td className={outcome.ok ? styles.ok : styles.error}>
                  {outcome.ok ? 'Đã nhập' : 'Lỗi'}
                </td>
                <td>
                  {outcome.error}
                  {outcome.warnings?.map((warning) => (
                    <div key={warning} className={styles.warning}>
                      {warning}
                    </div>
                  ))}
                  {!outcome.ok && outcome.createdUserId && (
                    <div className={styles.muted}>
                      Đã tạo người {outcome.createdUserId}; chạy lại sẽ làm tiếp.
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ResultPanel;
