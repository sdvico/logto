import { conditional } from '@silverhand/essentials';
import { useCallback, useMemo, useState } from 'react';

import PageMeta from '@/components/PageMeta';
import Button from '@/ds-components/Button';
import DangerousRaw from '@/ds-components/DangerousRaw';
import useApi from '@/hooks/use-api';
import pageLayout from '@/scss/page-layout.module.scss';

import ResultPanel from './ResultPanel';
import ReviewTable from './ReviewTable';
import styles from './index.module.scss';
import { loadImportData } from './lookup';
import { runImport, type RowOutcome } from './run-import';
import {
  checkRows,
  draftFromRow,
  type DraftRow,
  hasBlockingIssue,
  type ImportLookup,
  type ImportOrganization,
  parseStaffFile,
} from './staff-rows';

const stepTitles = ['1 · Tệp', '2 · Soát', '3 · Chạy', '4 · Kết quả'] as const;
type Step = 0 | 1 | 2 | 3;

const filters = ['all', 'selected', 'blocked', 'warning'] as const;
type Filter = (typeof filters)[number];
const filterTitles: Readonly<Record<Filter, string>> = Object.freeze({
  all: 'Tất cả',
  selected: 'Đang chọn',
  blocked: 'Có lỗi chặn',
  warning: 'Có cảnh báo',
});

const matchesFilter = (draft: DraftRow, filter: Filter) =>
  filter === 'all' ||
  (filter === 'selected' && draft.include) ||
  (filter === 'blocked' && hasBlockingIssue(draft)) ||
  (filter === 'warning' && draft.issues.some(({ level }) => level === 'warning'));

/**
 * SDVICO: nhập cán bộ từ tệp CSV do `export-staff-to-iam.js` của MKN sinh ra. Bốn bước như "Tạo hàng
 * loạt" của MKN: Tệp → Soát (chọn, sửa từng dòng) → Chạy (gọi Management API từng dòng) → Kết quả.
 * Tệp có mã băm mật khẩu: chỉ đọc trong trình duyệt, không lưu lại ở đâu.
 */
function IamStaffImport() {
  const api = useApi({ hideErrorToast: true });
  const [step, setStep] = useState<Step>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [lookup, setLookup] = useState<ImportLookup>();
  const [organizations, setOrganizations] = useState<ImportOrganization[]>([]);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [outcomes, setOutcomes] = useState<RowOutcome[]>([]);
  const [progress, setProgress] = useState(0);
  const [runTotal, setRunTotal] = useState(0);

  const readFile = async (file: File) => {
    setError(undefined);
    const parsed = parseStaffFile(await file.text());
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    setIsLoading(true);
    try {
      const { lookup: loaded, organizations: allOrganizations } = await loadImportData(api);
      setLookup(loaded);
      setOrganizations(allOrganizations);
      setDrafts(
        checkRows(
          parsed.rows.map((row) => draftFromRow(row, loaded)),
          loaded
        )
      );
      setOutcomes([]);
      setStep(1);
    } catch (loadError: unknown) {
      setError(`Không tải được dữ liệu IAM: ${String(loadError)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const changeRow = useCallback(
    (line: number, update: (draft: DraftRow) => DraftRow) => {
      if (!lookup) {
        return;
      }
      setDrafts((current) =>
        checkRows(
          current.map((draft) => (draft.source.line === line ? update(draft) : draft)),
          lookup
        )
      );
    },
    [lookup]
  );

  const selected = drafts.filter(({ include }) => include);
  const blocked = selected.filter((draft) => hasBlockingIssue(draft));
  const warned = selected.filter(({ issues }) => issues.some(({ level }) => level === 'warning'));
  const visible = useMemo(
    () => drafts.filter((draft) => matchesFilter(draft, filter)),
    [drafts, filter]
  );

  const run = async (rows: readonly DraftRow[]) => {
    if (!lookup) {
      return;
    }
    setStep(2);
    setProgress(0);
    setRunTotal(rows.length);
    const createdUserIds = new Map(
      outcomes.flatMap(
        ({ line, createdUserId }): Array<[number, string]> =>
          createdUserId ? [[line, createdUserId]] : []
      )
    );
    const results = await runImport(rows, {
      api,
      lookup,
      createdUserIds,
      onProgress: () => {
        setProgress((count) => count + 1);
      },
    });
    const retried = new Set(results.map(({ line }) => line));
    setOutcomes((previous) =>
      [...previous.filter(({ line }) => !retried.has(line)), ...results]
        .slice()
        .sort((left, right) => left.line - right.line)
    );
    setStep(3);
  };

  const failedLines = new Set(outcomes.filter(({ ok }) => !ok).map(({ line }) => line));
  const failedDrafts = drafts.filter(({ source }) => failedLines.has(source.line));

  return (
    <div className={pageLayout.container}>
      <PageMeta titleKey="tabs.iam_staff_import" />
      <div className={styles.container}>
        <p className={styles.subtitle}>
          Nhập cán bộ từ tệp CSV do MKN xuất (scripts/export-staff-to-iam.js). Tệp có mã băm mật
          khẩu: không gửi qua chat/email, xoá sau khi nhập.
        </p>
        <div className={styles.steps}>
          {stepTitles.map((title, index) => (
            <span key={title} className={conditional(index === step && styles.activeStep)}>
              {title}
            </span>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {step === 0 && (
          <input
            type="file"
            accept=".csv,text/csv"
            disabled={isLoading}
            aria-label="Chọn tệp CSV cán bộ"
            onChange={({ target }) => {
              const file = target.files?.[0];
              if (file) {
                void readFile(file);
              }
            }}
          />
        )}
        {isLoading && <p>Đang tải người dùng, tổ chức, vai trò của IAM…</p>}

        {step === 1 && (
          <>
            <div className={styles.toolbar}>
              <span className={styles.summary}>
                {drafts.length} dòng · chọn {selected.length} · lỗi chặn {blocked.length} · cảnh báo{' '}
                {warned.length}
              </span>
              <select
                value={filter}
                aria-label="Lọc dòng"
                onChange={({ target }) => {
                  setFilter(filters.find((value) => value === target.value) ?? 'all');
                }}
              >
                {filters.map((value) => (
                  <option key={value} value={value}>
                    {filterTitles[value]}
                  </option>
                ))}
              </select>
              <Button
                title={<DangerousRaw>Chọn tệp khác</DangerousRaw>}
                onClick={() => {
                  setStep(0);
                }}
              />
              <Button
                type="primary"
                disabled={selected.length === 0 || blocked.length > 0}
                title={<DangerousRaw>Nhập {selected.length} dòng</DangerousRaw>}
                onClick={() => {
                  void run(selected);
                }}
              />
            </div>
            {blocked.length > 0 && (
              <p className={styles.error}>
                Còn {blocked.length} dòng đang chọn có lỗi chặn: sửa hoặc bỏ chọn trước khi nhập.
              </p>
            )}
            <ReviewTable drafts={visible} organizations={organizations} onChange={changeRow} />
          </>
        )}

        {step === 2 && (
          <p>
            Đang nhập… {progress}/{runTotal}
          </p>
        )}

        {step === 3 && (
          <>
            <div className={styles.toolbar}>
              <span className={styles.summary}>
                Đạt {outcomes.filter(({ ok }) => ok).length} · lỗi {failedLines.size}
              </span>
              {failedDrafts.length > 0 && (
                <Button
                  type="primary"
                  title={<DangerousRaw>Chạy lại {failedDrafts.length} dòng lỗi</DangerousRaw>}
                  onClick={() => {
                    void run(failedDrafts);
                  }}
                />
              )}
              <Button
                title={<DangerousRaw>Nhập tệp khác</DangerousRaw>}
                onClick={() => {
                  setDrafts([]);
                  setOutcomes([]);
                  setStep(0);
                }}
              />
            </div>
            <ResultPanel outcomes={outcomes} />
          </>
        )}
      </div>
    </div>
  );
}

export default IamStaffImport;
