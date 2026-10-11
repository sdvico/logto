import type { TFuncKey } from 'i18next';
import type { ReactNode } from 'react';
import { useContext } from 'react';

import PageContext from '@/Providers/PageContextProvider/PageContext';
import agencyLogo from '@/assets/images/agency-logo.png';
import satAlertIamMark from '@/assets/images/sat-alert-iam-mark.svg';
import PageMeta from '@/shared/components/PageMeta';

import styles from './heroLayout.module.scss';

type Props = {
  readonly children: ReactNode;
  readonly title: TFuncKey;
};

/**
 * Sdvico: trang dang nhap rieng, clone bo cuc 2 cot theo iuu-report.vercel.app/login —
 * cot trai la hero gioi thieu he thong, cot phai la khung dang nhap (dung lai cac form component
 * co san cua Logto qua children). Chi dung cho trang SignIn, khong dung chung voi cac trang khac.
 */
const HeroLayout = ({ children, title }: Props) => {
  const { experienceSettings } = useContext(PageContext);

  if (!experienceSettings) {
    return null;
  }

  return (
    <div className={styles.page}>
      <PageMeta titleKey={title} />
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.orgBlock}>
            {/* Logo Cục đi cùng tên Cục viết cứng bên cạnh, không lấy từ cài đặt Thương hiệu. */}
            <img className={styles.emblem} src={agencyLogo} alt="" />
            <div className={styles.orgText}>
              <div>Bộ Nông nghiệp và Môi trường</div>
              <div className={styles.orgTextStrong}>Cục Thủy sản và Kiểm ngư</div>
            </div>
          </div>
          <div className={styles.systemTag}>Hệ thống Sat-Alert IAM</div>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.markRow}>
            <img className={styles.mark} src={satAlertIamMark} alt="" />
            <div className={styles.markText}>
              <span className={styles.markLabel}>Sat-Alert IAM</span>
              <span className={styles.tagline}>
                Quản lý định danh và <span className={styles.highlight}>phân quyền truy cập</span>
              </span>
            </div>
          </div>
          <h1 className={styles.heading}>
            Hệ thống quản lý định danh{' '}
            <span className={styles.highlight}>và phân quyền truy cập</span>
          </h1>
          <p className={styles.description}>
            Một đầu mối đăng nhập cho các phần mềm nghiệp vụ ngành thủy sản: Sat Alert, eLogbook,
            IUU và các hệ thống khác.
          </p>
          <ol className={styles.steps}>
            {['Tài khoản', 'Phân quyền', 'Ứng dụng nghiệp vụ'].map((step, index) => (
              <li key={step} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.card} aria-labelledby="sign-in-title">
          <div aria-hidden className={styles.cardIcon}>
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
          <h2 id="sign-in-title" className={styles.cardTitle}>
            Đăng nhập hệ thống
          </h2>
          <p className={styles.cardSubtitle}>Dùng tài khoản do cơ quan cấp.</p>
          {children}
          <p className={styles.cardFooter}>
            Chưa có tài khoản? Liên hệ Cục Thủy sản và Kiểm ngư để được cấp.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} · Cục Thủy sản và Kiểm ngư
      </footer>
    </div>
  );
};

export default HeroLayout;
