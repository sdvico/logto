import useSWR from 'swr';

import PageMeta from '@/components/PageMeta';
import { type RequestError } from '@/hooks/use-api';
import pageLayout from '@/scss/page-layout.module.scss';

import styles from './index.module.scss';

type SyncUser = {
  id: string;
  username: string | null;
  name: string | null;
  status: 'active' | 'suspended';
  organizations: Array<{ id: string; name: string }>;
  roles: Array<{ code: string; name: string }>;
  scopes: Array<{ type: string; id: string }>;
  updated_at: string;
};

/**
 * sdvico: man hinh xem nhanh du lieu ma IAM Sync API (`/api/iam-sync-preview/users`) tra ve cho
 * cac he thong ngoai (Sat Alert/eLogbook/IUU) — chi doc, dung session admin thuong, khong qua M2M
 * token. Xem docs/iam-sync-api-design.md.
 */
const IamSyncUsers = () => {
  const { data, error } = useSWR<{ data: SyncUser[] }, RequestError>('api/iam-sync-preview/users');
  const isLoading = !data && !error;

  return (
    <div className={pageLayout.container}>
      <PageMeta titleKey="tabs.iam_sync_users" />
      <div className={styles.container}>
        <p className={styles.subtitle}>
          Dữ liệu mà IAM Sync API trả về cho các hệ thống ngoài (Sat Alert / eLogbook / IUU) — chỉ
          xem, không chỉnh sửa được ở đây.
        </p>

        {isLoading && <div>Đang tải...</div>}
        {error && <div className={styles.error}>Không tải được dữ liệu.</div>}

        {data && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên đăng nhập</th>
                <th>Họ tên</th>
                <th>Trạng thái</th>
                <th>Tổ chức</th>
                <th>Vai trò</th>
                <th>Phạm vi dữ liệu</th>
                <th>Cập nhật lúc</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((user) => (
                <tr key={user.id}>
                  <td>{user.username ?? '-'}</td>
                  <td>{user.name ?? '-'}</td>
                  <td>{user.status}</td>
                  <td>
                    {user.organizations.map((org) => (
                      <span key={org.id} className={styles.pill}>
                        {org.name}
                      </span>
                    ))}
                  </td>
                  <td>
                    {user.roles.map((role) => (
                      <span key={role.code} className={styles.pill}>
                        {role.name}
                      </span>
                    ))}
                  </td>
                  <td>
                    {user.scopes.map((scope) => (
                      <span key={`${scope.type}-${scope.id}`} className={styles.pill}>
                        {scope.type}: {scope.id}
                      </span>
                    ))}
                  </td>
                  <td>{new Date(user.updated_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default IamSyncUsers;
