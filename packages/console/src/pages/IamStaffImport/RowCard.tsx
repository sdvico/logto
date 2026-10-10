import classNames from 'classnames';
import { memo } from 'react';

import Card from '@/ds-components/Card';
import Checkbox from '@/ds-components/Checkbox';
import DangerousRaw from '@/ds-components/DangerousRaw';
import RadioGroup, { Radio } from '@/ds-components/RadioGroup';
import Select from '@/ds-components/Select';
import Tag from '@/ds-components/Tag';
import TextInput from '@/ds-components/TextInput';

import styles from './index.module.scss';
import { isLinking, roleCodes, type RoleCode } from './review-rules';
import { type DraftRow, type ImportOrganization, type Issue, roleTitleOf } from './staff-rows';

const roleTitles: Readonly<Record<RoleCode, string>> = Object.freeze({
  TRUONG: 'Trưởng',
  PHO: 'Phó',
  CHUYEN_VIEN: 'Chuyên viên',
});

const issueTags: Readonly<
  Record<Issue['level'], { status: 'error' | 'alert' | 'info'; text: string }>
> = Object.freeze({
  error: { status: 'error', text: 'Lỗi chặn' },
  warning: { status: 'alert', text: 'Cảnh báo' },
  info: { status: 'info', text: 'Lưu ý' },
});

type Props = {
  readonly draft: DraftRow;
  readonly organizations: readonly ImportOrganization[];
  /** Tên hệ nguồn, vd "MKN". */
  readonly sourceLabel: string;
  readonly onChange: (line: number, update: (draft: DraftRow) => DraftRow) => void;
};

/** Phần "Vào IAM" khi tạo mới: tên đăng nhập, tổ chức, chức danh. */
function CreateFields({ draft, organizations, onChange }: Omit<Props, 'sourceLabel'>) {
  const { line } = draft.source;
  const update = (patch: Partial<DraftRow>) => {
    onChange(line, (current) => ({ ...current, ...patch }));
  };
  const pickable = organizations.filter(
    ({ id }) => !draft.organizations.some((organization) => organization.id === id)
  );

  return (
    <>
      <div className={styles.stack}>
        <span className={styles.sectionLabel}>Tổ chức</span>
        <div className={styles.chips}>
          {draft.organizations.map((organization) => (
            <span key={organization.id} className={styles.chip}>
              {organization.name}
              <button
                type="button"
                aria-label={`Bỏ ${organization.name}`}
                onClick={() => {
                  update({
                    organizations: draft.organizations.filter(({ id }) => id !== organization.id),
                  });
                }}
              >
                ×
              </button>
            </span>
          ))}
          {draft.organizations.length === 0 && draft.source.unitNames && (
            <span className={styles.meta}>Tệp gợi ý: {draft.source.unitNames}</span>
          )}
        </div>
        <Select<string>
          isSearchEnabled
          size="small"
          placeholder="Thêm tổ chức…"
          options={pickable.map(({ id, name }) => ({ value: id, title: name }))}
          onChange={(id) => {
            const picked = organizations.find((organization) => organization.id === id);
            if (picked) {
              update({ organizations: [...draft.organizations, picked] });
            }
          }}
        />
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.stack}>
          <span className={styles.sectionLabel}>Tên đăng nhập IAM</span>
          <TextInput
            value={draft.username}
            disabled={Boolean(draft.existingUserId)}
            aria-label={`Tên đăng nhập dòng ${line}`}
            onChange={({ currentTarget }) => {
              update({ username: currentTarget.value });
            }}
          />
        </div>
        <div className={styles.stack}>
          <span className={styles.sectionLabel}>Chức danh</span>
          <Select<RoleCode>
            value={draft.role}
            options={roleCodes.map((code) => ({ value: code, title: roleTitles[code] }))}
            onChange={(role) => {
              if (role) {
                update({ role });
              }
            }}
          />
          <span className={styles.meta}>{roleTitleOf(draft) || ' '}</span>
        </div>
      </div>
    </>
  );
}

/** Một dòng tệp ở bước Soát, dạng thẻ ba cột như thiết kế: người · ở hệ nguồn · vào IAM. */
function RowCard({ draft, organizations, sourceLabel, onChange }: Props) {
  const { source, match } = draft;
  const isLink = isLinking(draft);

  return (
    <Card className={classNames(styles.row, !draft.include && styles.excluded)}>
      <div className={styles.who}>
        <Checkbox
          checked={draft.include}
          tooltip={`Chọn dòng ${source.line} để nhập`}
          onChange={(isChecked) => {
            onChange(source.line, (current) => ({ ...current, include: isChecked }));
          }}
        />
        <div className={styles.stack}>
          <span className={styles.name}>{source.fullName || '—'}</span>
          <span className={styles.meta}>{source.username}</span>
          <span className={styles.meta}>
            Dòng {source.line} · mã {sourceLabel} {source.sourceAccountId || '—'}
          </span>
        </div>
      </div>

      <div className={styles.stack}>
        <span className={styles.sectionLabel}>Ở {sourceLabel}</span>
        <span className={styles.meta}>{source.agencyName || '—'}</span>
        <span className={styles.meta}>{source.scopePlaces || source.sourceScopes || '—'}</span>
        <span className={styles.meta}>Nhóm: {source.sourceGroups || '—'}</span>
      </div>

      <div className={styles.stack}>
        <span className={styles.sectionLabel}>Vào IAM</span>
        {draft.existingUserId ? (
          <span className={styles.meta}>Đã nhập trước đó: chỉ bổ sung tổ chức, chức danh.</span>
        ) : (
          match && (
            <RadioGroup
              name={`iam-import-action-${source.line}`}
              type="small"
              value={draft.action}
              onChange={(value) => {
                onChange(source.line, (current) => ({
                  ...current,
                  action: value === 'link' ? 'link' : 'create',
                }));
              }}
            >
              <Radio value="create" title={<DangerousRaw>Tạo mới</DangerousRaw>} />
              <Radio value="link" title={<DangerousRaw>Nối vào người đã có</DangerousRaw>} />
            </RadioGroup>
          )
        )}
        {isLink && match ? (
          <div className={styles.matchBox}>
            <span className={styles.name}>
              {match.user.name || '—'} <span className={styles.meta}>{match.user.username}</span>
            </span>
            <span className={styles.meta}>
              {Object.keys(match.user.externalIds).length > 0
                ? `Đã nối ${Object.keys(match.user.externalIds).join(', ')}`
                : 'Chưa nối hệ nào'}
            </span>
            <span className={styles.meta}>
              Chỉ thêm mã {sourceLabel} vào người này. Không đổi tổ chức, chức danh, mật khẩu đang
              có trên IAM.
            </span>
          </div>
        ) : (
          <CreateFields draft={draft} organizations={organizations} onChange={onChange} />
        )}
      </div>

      <ul className={styles.issues}>
        {draft.issues.length === 0 && (
          <li className={styles.issue}>
            <Tag type="state" status="success" variant="plain">
              <DangerousRaw>Sẵn sàng</DangerousRaw>
            </Tag>
            {isLink ? 'Nối vào người đã có.' : 'Tạo người mới.'}
          </li>
        )}
        {draft.issues.map(({ code, level, message }) => (
          <li key={code} className={styles.issue}>
            <Tag type="state" status={issueTags[level].status} variant="plain">
              <DangerousRaw>{issueTags[level].text}</DangerousRaw>
            </Tag>
            {message}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default memo(RowCard);
