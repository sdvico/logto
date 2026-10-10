import classNames from 'classnames';

import Button from '@/ds-components/Button';
import Card from '@/ds-components/Card';
import DangerousRaw from '@/ds-components/DangerousRaw';
import Table from '@/ds-components/Table';
import Tag from '@/ds-components/Tag';
import TextLink from '@/ds-components/TextLink';

import { toCsv } from './csv';
import styles from './index.module.scss';
import { type RowOutcome, type RowOutcomeAction } from './run-import';
import { type DraftRow } from './staff-rows';

const actionTitles: Readonly<Record<RowOutcomeAction, string>> = Object.freeze({
  create: 'Tạo mới',
  link: 'Nối vào người đã có',
  update: 'Bổ sung tổ chức, chức danh',
});

const resultHeader = [
  'line',
  'account_id',
  'action',
  'username',
  'iam_user_id',
  'result',
  'error',
  'warnings',
];

/** Tải kết quả về CSV (không có mật khẩu) để lưu hồ sơ và báo người dùng tên đăng nhập. */
const downloadResult = (outcomes: readonly RowOutcome[]) => {
  const csv = toCsv([
    resultHeader,
    ...outcomes.map((outcome) => [
      String(outcome.line),
      outcome.sourceAccountId,
      outcome.action,
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
  link.download = `iam-user-import-result-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

type Props = {
  readonly outcomes: readonly RowOutcome[];
  /** Dòng đã soát, để biết ai được tạo mà không có mật khẩu. */
  readonly drafts: readonly DraftRow[];
  readonly failedCount: number;
  readonly onRetry: () => void;
  readonly onRestart: () => void;
};

/** Bước 4: số liệu, bảng từng dòng, và việc cần làm tiếp. */
function ResultPanel({ outcomes, drafts, failedCount, onRetry, onRestart }: Props) {
  const count = (action: RowOutcomeAction) =>
    outcomes.filter((outcome) => outcome.ok && outcome.action === action).length;
  const okLines = new Set(outcomes.filter(({ ok }) => ok).map(({ line }) => line));
  const withoutPassword = drafts
    .filter(
      ({ source, action, existingUserId }) =>
        okLines.has(source.line) && action === 'create' && !existingUserId && !source.passwordBcrypt
    )
    .map(({ source }) => source.line);

  return (
    <>
      <div className={styles.stats}>
        <Card className={styles.stat}>
          Tạo mới <strong>{count('create')}</strong>
        </Card>
        <Card className={styles.stat}>
          Nối vào người đã có <strong>{count('link')}</strong>
        </Card>
        <Card className={styles.stat}>
          Bổ sung <strong>{count('update')}</strong>
        </Card>
        <Card className={classNames(styles.stat, failedCount > 0 && styles.error)}>
          Lỗi <strong>{failedCount}</strong>
        </Card>
      </div>

      <div className={styles.toolbar}>
        {failedCount > 0 && (
          <Button
            type="primary"
            title={<DangerousRaw>Chạy lại {failedCount} dòng lỗi</DangerousRaw>}
            onClick={onRetry}
          />
        )}
        <Button
          title={<DangerousRaw>Tải CSV kết quả</DangerousRaw>}
          onClick={() => {
            downloadResult(outcomes);
          }}
        />
        <Button title={<DangerousRaw>Nhập tệp khác</DangerousRaw>} onClick={onRestart} />
      </div>

      <Table
        className={styles.table}
        rowIndexKey="line"
        rowGroups={[{ key: 'outcomes', data: outcomes.slice() }]}
        columns={[
          { title: 'Dòng', dataIndex: 'line', colSpan: 1, render: ({ line }) => line },
          {
            title: 'Người dùng',
            dataIndex: 'username',
            colSpan: 4,
            render: ({ username }) => username || '—',
          },
          {
            title: 'Việc',
            dataIndex: 'action',
            colSpan: 4,
            render: ({ action }) => actionTitles[action],
          },
          {
            title: 'Kết quả',
            dataIndex: 'ok',
            colSpan: 3,
            render: ({ ok }) => (
              <Tag type="result" status={ok ? 'success' : 'error'} variant="plain">
                <DangerousRaw>{ok ? 'Xong' : 'Lỗi'}</DangerousRaw>
              </Tag>
            ),
          },
          {
            title: 'Ghi chú',
            dataIndex: 'error',
            colSpan: 8,
            render: ({ error, warnings, createdUserId, ok }) => (
              <>
                {error}
                {warnings?.map((warning) => <div key={warning}>{warning}</div>)}
                {!ok && createdUserId && (
                  <div>Đã tạo người {createdUserId}; chạy lại sẽ làm tiếp.</div>
                )}
              </>
            ),
          },
        ]}
      />

      <Card>
        <h3 className={styles.cardTitle}>Việc tiếp theo</h3>
        <ol className={styles.nextSteps}>
          {withoutPassword.length > 0 && (
            <li>
              Báo người không có mật khẩu (dòng {withoutPassword.join(', ')}) đặt mật khẩu mới trên
              IAM.
            </li>
          )}
          <li>Xoá tệp CSV nguồn: tệp có mã băm mật khẩu.</li>
          <li>
            Kiểm lại ở <TextLink to="/iam-sync-users">Đồng bộ IAM</TextLink>: người đã nối phải
            thuộc ít nhất một tổ chức thì hệ mới thấy.
          </li>
        </ol>
      </Card>
    </>
  );
}

export default ResultPanel;
