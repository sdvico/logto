import classNames from 'classnames';

import styles from './index.module.scss';

const stepTitles = Object.freeze(['Nguồn và tệp', 'Soát', 'Chạy', 'Kết quả'] as const);

type Props = {
  readonly current: number;
};

/** Thanh bốn bước của màn nhập; bước đã qua có dấu ✓. */
function Steps({ current }: Props) {
  return (
    <ol className={styles.steps} aria-label="Các bước">
      {stepTitles.map((title, index) => (
        <li
          key={title}
          className={classNames(
            styles.step,
            index === current && styles.current,
            index < current && styles.done
          )}
          aria-current={index === current ? 'step' : undefined}
        >
          <span className={styles.stepNumber}>{index < current ? '✓' : index + 1}</span>
          {title}
        </li>
      ))}
    </ol>
  );
}

export default Steps;
