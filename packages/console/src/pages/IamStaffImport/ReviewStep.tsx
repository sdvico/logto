import { useMemo, useState } from 'react';

import Button from '@/ds-components/Button';
import DangerousRaw from '@/ds-components/DangerousRaw';
import InlineNotification from '@/ds-components/InlineNotification';
import TabNav, { TabNavItem } from '@/ds-components/TabNav';

import RowCard from './RowCard';
import styles from './index.module.scss';
import { isCreating, isLinking } from './review-rules';
import { type DraftRow, hasBlockingIssue, type ImportOrganization } from './staff-rows';

const filters = Object.freeze(['all', 'create', 'link', 'review'] as const);
type Filter = (typeof filters)[number];

const filterTitles: Readonly<Record<Filter, string>> = Object.freeze({
  all: 'Tất cả',
  create: 'Tạo mới',
  link: 'Nối vào người đã có',
  review: 'Cần xem',
});

const matchesFilter = (draft: DraftRow, filter: Filter) =>
  filter === 'all' ||
  (filter === 'create' && isCreating(draft)) ||
  (filter === 'link' && isLinking(draft)) ||
  (filter === 'review' && draft.issues.some(({ level }) => level !== 'info'));

type Props = {
  readonly drafts: readonly DraftRow[];
  readonly organizations: readonly ImportOrganization[];
  readonly sourceLabel: string;
  readonly onChange: (line: number, update: (draft: DraftRow) => DraftRow) => void;
  readonly onBack: () => void;
  readonly onRun: (rows: readonly DraftRow[]) => void;
};

/** Bước 2: lọc theo tab, đếm lỗi, và danh sách thẻ từng dòng. */
function ReviewStep({ drafts, organizations, sourceLabel, onChange, onBack, onRun }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const selected = drafts.filter(({ include }) => include);
  const blocked = selected.filter((draft) => hasBlockingIssue(draft));
  const warned = selected.filter(({ issues }) => issues.some(({ level }) => level === 'warning'));
  const visible = useMemo(
    () => drafts.filter((draft) => matchesFilter(draft, filter)),
    [drafts, filter]
  );

  return (
    <>
      <div className={styles.toolbar}>
        <TabNav className={styles.tabs}>
          {filters.map((value) => (
            <TabNavItem
              key={value}
              isActive={filter === value}
              onClick={() => {
                setFilter(value);
              }}
            >
              {filterTitles[value]} {drafts.filter((draft) => matchesFilter(draft, value)).length}
            </TabNavItem>
          ))}
        </TabNav>
        <span className={styles.counters}>
          <span>
            <b>{blocked.length}</b> lỗi chặn
          </span>
          <span>
            <b>{warned.length}</b> cảnh báo
          </span>
        </span>
        <Button title={<DangerousRaw>Chọn tệp khác</DangerousRaw>} onClick={onBack} />
        <Button
          type="primary"
          disabled={selected.length === 0 || blocked.length > 0}
          title={<DangerousRaw>Nhập {selected.length} dòng</DangerousRaw>}
          onClick={() => {
            onRun(selected);
          }}
        />
      </div>
      {blocked.length > 0 && (
        <InlineNotification severity="error">
          Còn {blocked.length} dòng đang chọn có lỗi chặn: sửa hoặc bỏ chọn trước khi nhập.
        </InlineNotification>
      )}
      <div className={styles.rows}>
        {visible.map((draft) => (
          <RowCard
            key={draft.source.line}
            draft={draft}
            organizations={organizations}
            sourceLabel={sourceLabel}
            onChange={onChange}
          />
        ))}
      </div>
    </>
  );
}

export default ReviewStep;
