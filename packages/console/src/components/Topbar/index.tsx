import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import CloudLogo from '@/assets/images/cloud-logo.svg?react';
import Logo from '@/assets/images/logo.svg?react';
import { buildCommit, buildTime, isCloud } from '@/consts/env';
import Spacer from '@/ds-components/Spacer';
import useTenantPathname from '@/hooks/use-tenant-pathname';

import EnterpriseSubscriptions from './EnterpriseSubscriptions';
import InkeepAskAi from './InkeepAskAi';
import TenantSelector from './TenantSelector';
import UserInfo from './UserInfo';
import styles from './index.module.scss';
import { formatBuildVersion } from './utils';

const buildVersion = formatBuildVersion({ commit: buildCommit, time: buildTime });

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
      <div className={styles.brand}>
        <LogtoLogo
          className={styles.logo}
          onClick={() => {
            navigate('/');
          }}
        />
        {/* Sdvico: which build is running, to check a deployment. */}
        {!isCloud && buildVersion && (
          <span className={styles.version} title={buildTime}>
            {buildVersion}
          </span>
        )}
      </div>
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
