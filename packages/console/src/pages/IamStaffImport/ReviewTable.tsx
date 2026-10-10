import { conditional } from '@silverhand/essentials';
import classNames from 'classnames';

import Select from '@/ds-components/Select';

import styles from './index.module.scss';
import { roleCodes, type RoleCode } from './review-rules';
import { type DraftRow, type ImportOrganization } from './staff-rows';

const roleTitles: Readonly<Record<RoleCode, string>> = Object.freeze({
  TRUONG: 'Trưởng',
  PHO: 'Phó',
  CHUYEN_VIEN: 'Chuyên viên',
});

type Props = {
  readonly drafts: readonly DraftRow[];
  readonly organizations: readonly ImportOrganization[];
  /** Trả dòng mới thay cho dòng `line`; trang chính tính lại lỗi cả lô. */
  readonly onChange: (line: number, update: (draft: DraftRow) => DraftRow) => void;
};

/** Bảng Soát: mỗi dòng một cán bộ, sửa được tên đăng nhập, tổ chức, chức danh; bỏ chọn để không nhập. */
function ReviewTable({ drafts, organizations, onChange }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nhập</th>
            <th>Dòng</th>
            <th>Tên đăng nhập IAM</th>
            <th>Họ tên</th>
            <th>Tổ chức</th>
            <th>Chức danh</th>
            <th>Quyền ở MKN</th>
            <th>Cần xem</th>
          </tr>
        </thead>
        <tbody>
          {drafts.map((draft) => {
            const { line } = draft.source;
            const update = (patch: Partial<DraftRow>) => {
              onChange(line, (current) => ({ ...current, ...patch }));
            };
            const pickable = organizations.filter(
              ({ id }) => !draft.organizations.some((organization) => organization.id === id)
            );

            return (
              <tr key={line} className={conditional(!draft.include && styles.excluded)}>
                <td>
                  <input
                    type="checkbox"
                    checked={draft.include}
                    aria-label={`Nhập dòng ${line}`}
                    onChange={({ target }) => {
                      update({ include: target.checked });
                    }}
                  />
                </td>
                <td>{line}</td>
                <td>
                  <input
                    className={styles.usernameInput}
                    value={draft.username}
                    disabled={Boolean(draft.existingUserId)}
                    aria-label={`Tên đăng nhập dòng ${line}`}
                    onChange={({ target }) => {
                      update({ username: target.value });
                    }}
                  />
                  {draft.username !== draft.source.username && (
                    <div className={styles.muted}>MKN: {draft.source.username}</div>
                  )}
                </td>
                <td>{draft.source.fullName}</td>
                <td>
                  {draft.organizations.map((organization) => (
                    <span key={organization.id} className={styles.pill}>
                      {organization.name}
                      <button
                        type="button"
                        className={styles.pillRemove}
                        aria-label={`Bỏ ${organization.name}`}
                        onClick={() => {
                          update({
                            organizations: draft.organizations.filter(
                              ({ id }) => id !== organization.id
                            ),
                          });
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className={styles.picker}>
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
                </td>
                <td>
                  <Select<RoleCode>
                    size="small"
                    value={draft.role}
                    options={roleCodes.map((code) => ({ value: code, title: roleTitles[code] }))}
                    onChange={(role) => {
                      if (role) {
                        update({ role });
                      }
                    }}
                  />
                </td>
                <td className={styles.muted}>
                  {draft.source.mknGroups || '-'}
                  <br />
                  {draft.source.mknScopes || '-'}
                </td>
                <td>
                  <ul className={styles.issues}>
                    {draft.issues.map(({ code, level, message }) => (
                      <li key={code} className={classNames(styles[level])}>
                        {message}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewTable;
