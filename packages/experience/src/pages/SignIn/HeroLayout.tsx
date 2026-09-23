import type { ReactNode } from 'react';
import { useContext } from 'react';
import type { TFuncKey } from 'i18next';

import PageContext from '@/Providers/PageContextProvider/PageContext';
import satAlertIamMark from '@/assets/images/sat-alert-iam-mark.svg';
import PageMeta from '@/shared/components/PageMeta';
import { getBrandingLogoUrl } from '@/shared/utils/logo';

import styles from './heroLayout.module.scss';

type Props = {
  readonly children: ReactNode;
  readonly title: TFuncKey;
};

/**
 * sdvico: trang dang nhap rieng, clone bo cuc 2 cot theo iuu-report.vercel.app/login —
 * cot trai la hero gioi thieu he thong, cot phai la khung dang nhap (dung lai cac form component
 * co san cua Logto qua children). Chi dung cho trang SignIn, khong dung chung voi cac trang khac.
 */
const HeroLayout = ({ children, title }: Props) => {
  const { experienceSettings, theme } = useContext(PageContext);

  if (!experienceSettings) {
    return null;
  }

  const {
    color: { isDarkModeEnabled },
    branding,
  } = experienceSettings;
  const orgLogo = getBrandingLogoUrl({ theme, branding, isDarkModeEnabled: isDarkModeEnabled ?? false });

  return (
    <div className={styles.page}>
      <PageMeta titleKey={title} />
      <header className={styles.topbar}>
        <div className={styles.orgBlock}>
          {orgLogo && <img className={styles.emblem} src={orgLogo} alt="" />}
          <div className={styles.orgText}>
            <div>Bộ Nông nghiệp và Môi trường</div>
            <div className={styles.orgTextStrong}>Cục Thủy sản và Kiểm ngư</div>
          </div>
        </div>
        <div className={styles.systemTag}>HỆ THỐNG SAT-ALERT IAM</div>
      </header>

      <div className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.markRow}>
            <img className={styles.mark} src={satAlertIamMark} alt="" />
            <span className={styles.markLabel}>Sat-Alert IAM</span>
          </div>
          <h1 className={styles.heading}>
            Hệ thống quản lý định danh
            <br />
            <span className={styles.highlight}>và phân quyền truy cập</span>
          </h1>
          <p className={styles.description}>
            Quản lý tài khoản, tổ chức và phân quyền truy cập cho các phần mềm nghiệp vụ ngành thủy
            sản — một đầu mối đăng nhập thống nhất cho Sat Alert, eLogbook, IUU và các hệ thống
            khác.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>Tài khoản</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.badge}>Phân quyền</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.badge}>Ứng dụng nghiệp vụ</span>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardIcon} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect
                x="5"
                y="11"
                width="14"
                height="9"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 11V8a4 4 0 0 1 8 0v3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className={styles.cardTitle}>Đăng nhập hệ thống</h2>
          <p className={styles.cardSubtitle}>Truy cập bằng tài khoản được cơ quan cấp.</p>
          {children}
          <p className={styles.cardFooter}>
            Liên hệ Cục Thủy sản và Kiểm ngư để được cấp tài khoản.
          </p>
        </section>
      </div>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} · Cục Thủy sản và Kiểm ngư
      </footer>
    </div>
  );
};

export default HeroLayout;
