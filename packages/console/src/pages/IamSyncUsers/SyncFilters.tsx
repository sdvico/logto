import Search from '@/ds-components/Search';
import Select from '@/ds-components/Select';

import { unitTypeLabel } from '../IamSystems/systems';

import styles from './index.module.scss';
import {
  noSystem,
  type SyncFilter,
  type SyncSystem,
  type SyncUser,
  unitTypesOf,
  untypedUnit,
} from './sync-users';

type Props = {
  readonly filter: SyncFilter;
  readonly systems: readonly SyncSystem[];
  readonly users: readonly SyncUser[];
  readonly onChange: (filter: SyncFilter) => void;
};

const statusOptions: Array<{ value: SyncFilter['status']; title: string }> = [
  { value: 'active', title: 'Hoạt động' },
  { value: 'suspended', title: 'Đang khoá' },
];

/** Tìm, lọc theo hệ đã nối, loại đơn vị, trạng thái. Hệ và loại đơn vị lấy từ dữ liệu. */
function SyncFilters({ filter, systems, users, onChange }: Props) {
  const update = (patch: Partial<SyncFilter>) => {
    onChange({ ...filter, ...patch });
  };

  return (
    <div className={styles.filters}>
      <Search
        isClearable
        defaultValue={filter.search}
        placeholder="Tìm theo họ tên, tên đăng nhập"
        onSearch={(search) => {
          update({ search });
        }}
        onClearSearch={() => {
          update({ search: '' });
        }}
      />
      <Select<string>
        isClearable
        className={styles.filter}
        value={filter.system || undefined}
        placeholder="Hệ đã nối: tất cả"
        options={[
          ...systems.map(({ key, label }) => ({ value: key, title: `Đã nối ${label}` })),
          { value: noSystem, title: 'Chưa nối hệ nào' },
        ]}
        onChange={(system) => {
          update({ system: system ?? '' });
        }}
      />
      <Select<string>
        isClearable
        className={styles.filter}
        value={filter.unitType || undefined}
        placeholder="Loại đơn vị: tất cả"
        options={[
          ...unitTypesOf(users).map((type) => ({ value: type, title: unitTypeLabel(type) })),
          { value: untypedUnit, title: 'Thiếu loại' },
        ]}
        onChange={(unitType) => {
          update({ unitType: unitType ?? '' });
        }}
      />
      <Select<SyncFilter['status']>
        isClearable
        className={styles.filter}
        value={filter.status || undefined}
        placeholder="Trạng thái: tất cả"
        options={statusOptions}
        onChange={(status) => {
          update({ status: status ?? '' });
        }}
      />
    </div>
  );
}

export default SyncFilters;
