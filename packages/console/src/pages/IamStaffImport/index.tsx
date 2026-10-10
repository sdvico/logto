import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import PageMeta from '@/components/PageMeta';
import ProgressBar from '@/components/ProgressBar';
import Card from '@/ds-components/Card';
import CardTitle from '@/ds-components/CardTitle';
import DangerousRaw from '@/ds-components/DangerousRaw';
import InlineNotification from '@/ds-components/InlineNotification';
import useApi from '@/hooks/use-api';
import pageLayout from '@/scss/page-layout.module.scss';

import { loadSystems } from '../IamSystems/system-api';

import ResultPanel from './ResultPanel';
import ReviewStep from './ReviewStep';
import SourceStep from './SourceStep';
import Steps from './Steps';
import styles from './index.module.scss';
import { loadImportData } from './lookup';
import { runImport, type RowOutcome } from './run-import';
import {
  checkRows,
  draftFromRow,
  type DraftRow,
  type ImportLookup,
  type ImportOrganization,
  type ImportSource,
  parseStaffFile,
} from './staff-rows';

type Step = 0 | 1 | 2 | 3;

/**
 * SDVICO: nhập người dùng từ tệp CSV do một hệ tích hợp xuất (MKN: `export-staff-to-iam.js`). Bốn bước
 * như "Tạo hàng loạt" của MKN: Nguồn và tệp → Soát (chọn, sửa, tạo mới hay nối từng dòng) → Chạy (gọi
 * Management API từng dòng) → Kết quả. Tệp có mã băm mật khẩu: chỉ đọc trong trình duyệt, không lưu lại.
 */
function IamStaffImport() {
  const api = useApi({ hideErrorToast: true });
  const [searchParams] = useSearchParams();
  const [sources, setSources] = useState<ImportSource[]>();
  const [sourceKey, setSourceKey] = useState(searchParams.get('source') ?? '');
  const [step, setStep] = useState<Step>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [lookup, setLookup] = useState<ImportLookup>();
  const [organizations, setOrganizations] = useState<ImportOrganization[]>([]);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [outcomes, setOutcomes] = useState<RowOutcome[]>([]);
  const [progress, setProgress] = useState(0);
  const [runTotal, setRunTotal] = useState(0);

  useEffect(() => {
    const loadSources = async () => {
      try {
        const { systems } = await loadSystems(api);
        setSources(systems.map(({ system: { key, label } }) => ({ key, label })));
      } catch (loadError: unknown) {
        setError(`Không tải được danh sách hệ: ${String(loadError)}`);
      }
    };
    void loadSources();
  }, [api]);

  const source = sources?.find(({ key }) => key === sourceKey);

  const readFile = async (file: File) => {
    setError(undefined);
    if (!source) {
      setError('Chọn hệ nguồn trước.');
      return;
    }
    const parsed = parseStaffFile(await file.text());
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    setIsLoading(true);
    try {
      const { lookup: loaded, organizations: allOrganizations } = await loadImportData(api, source);
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
      <div className={pageLayout.headline}>
        <CardTitle
          title={<DangerousRaw>Nhập người dùng</DangerousRaw>}
          subtitle={
            <DangerousRaw>
              {source && step > 0
                ? `Nguồn ${source.label} · ${drafts.length} dòng · mã lưu vào external_ids.${source.key}`
                : 'Đưa tài khoản đang có ở một hệ tích hợp vào IAM: gán tổ chức, chức danh, mang theo mật khẩu cũ và lưu mã của hệ đó. Người đã có trên IAM được nối vào, không tạo trùng.'}
            </DangerousRaw>
          }
        />
      </div>

      <div className={styles.body}>
        <Steps current={step} />

        {error && <InlineNotification severity="error">{error}</InlineNotification>}

        {step === 0 && (
          <SourceStep
            sources={sources}
            sourceKey={sourceKey}
            isDisabled={isLoading}
            onSource={setSourceKey}
            onFile={(file) => {
              void readFile(file);
            }}
          />
        )}
        {isLoading && (
          <InlineNotification severity="info">
            Đang tải người dùng, tổ chức, vai trò của IAM…
          </InlineNotification>
        )}

        {step === 1 && (
          <ReviewStep
            drafts={drafts}
            organizations={organizations}
            sourceLabel={source?.label ?? ''}
            onChange={changeRow}
            onBack={() => {
              setStep(0);
            }}
            onRun={(rows) => {
              void run(rows);
            }}
          />
        )}

        {step === 2 && (
          <Card className={styles.running}>
            Đang nhập {progress}/{runTotal} dòng…
            <ProgressBar currentStep={progress} totalSteps={Math.max(runTotal, 1)} />
          </Card>
        )}

        {step === 3 && (
          <ResultPanel
            outcomes={outcomes}
            drafts={drafts}
            failedCount={failedLines.size}
            onRetry={() => {
              void run(failedDrafts);
            }}
            onRestart={() => {
              setDrafts([]);
              setOutcomes([]);
              setStep(0);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default IamStaffImport;
