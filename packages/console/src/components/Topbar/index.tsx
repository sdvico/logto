import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import CloudLogo from '@/assets/images/cloud-logo.svg?react';
import Logo from '@/assets/images/logo.svg?react';
import { isCloud } from '@/consts/env';
import Spacer from '@/ds-components/Spacer';
import useTenantPathname from '@/hooks/use-tenant-pathname';

import EnterpriseSubscriptions from './EnterpriseSubscriptions';
import InkeepAskAi from './InkeepAskAi';
import TenantSelector from './TenantSelector';
import UserInfo from './UserInfo';
import styles from './index.module.scss';

type Props = {
  readonly className?: string;
  /* eslint-disable react/boolean-prop-naming */
  readonly hideTenantSelector?: boolean;
  readonly hideTitle?: boolean;
  /* eslint-enable react/boolean-prop-naming */
};

function Topbar({ className, hideTenantSelector, hideTitle }: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });
  const { navigate } = useTenantPathname();
  const LogtoLogo = isCloud ? CloudLogo : Logo;

  return (
    <div className={classNames(styles.topbar, className)}>
      <LogtoLogo
        className={styles.logo}
        onClick={() => {
          navigate('/');
        }}
      />
      {isCloud && !hideTenantSelector && <TenantSelector />}
      {!isCloud && !hideTitle && (
        <>
          <div className={styles.line} />
          <div className={styles.text}>{t('title')}</div>
        </>
      )}
      <Spacer />
      {isCloud && <InkeepAskAi className={styles.button} />}
      {isCloud && <EnterpriseSubscriptions className={styles.button} />}
      <UserInfo />
    </div>
  );
}

export default Topbar;
