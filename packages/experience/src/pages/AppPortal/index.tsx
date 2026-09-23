import { useContext } from 'react';
import { Helmet } from 'react-helmet';

import PageContext from '@/Providers/PageContextProvider/PageContext';
import satAlertIamMark from '@/assets/images/sat-alert-iam-mark.svg';
import { getBrandingLogoUrl } from '@/shared/utils/logo';

import styles from './index.module.scss';

type BusinessApp = {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  /** URL to trigger the OIDC sign-in flow for this app. */
  readonly signInUrl: string;
};

/**
 * sdvico: link that cua tung ung dung nghiep vu (domain rieng, ngoai repo nay). Cac app nay chua
 * tich hop OIDC voi Sat-Alert IAM — khi da tich hop, app se tu redirect qua /oidc/auth cua IAM
 * (dung Logto SDK) thay vi nguoi dung bam thang vao domain nhu hien tai.
 */
const BUSINESS_APPS: readonly BusinessApp[] = [
  {
    code: 'SA',
    name: 'Sat Alert',
    description: 'Hệ thống cảnh báo giám sát tàu cá qua vệ tinh',
    signInUrl: 'https://cbvms.tongcucthuysan.gov.vn/',
  },
  {
    code: 'EL',
    name: 'eLogbook',
    description: 'Nhật ký khai thác thủy sản điện tử',
    signInUrl: 'http://gstc.tongcucthuysan.gov.vn/nkkt/',
  },
  {
    code: 'IUU',
    name: 'IUU',
    description: 'Hệ thống báo cáo điều hành chống khai thác IUU',
    signInUrl: 'http://iuu.tongcucthuysan.gov.vn/',
  },
];

/**
 * sdvico: trang thay the man hinh loi "unknown-session" mac dinh cua Logto — thay vi bao loi,
 * hien thi danh sach cac ung dung nghiep vu de nguoi dung chon, bam vao la di qua dung luong SSO
 * (OIDC authorize) cua tung app.
 */
const AppPortal = () => {
  const { experienceSettings, theme } = useContext(PageContext);
  const orgLogo = experienceSettings
    ? getBrandingLogoUrl({
        theme,
        branding: experienceSettings.branding,
        isDarkModeEnabled: experienceSettings.color.isDarkModeEnabled ?? false,
      })
    : null;

  return (
    <div className={styles.page}>
      <Helmet title="Sat-Alert IAM" />
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
        <div className={styles.markRow}>
          <img className={styles.mark} src={satAlertIamMark} alt="" />
          <span className={styles.markLabel}>Sat-Alert IAM</span>
        </div>
        <h1 className={styles.heading}>Ứng dụng nghiệp vụ ngành thủy sản</h1>
        <p className={styles.description}>
          Chọn ứng dụng bạn cần truy cập. Đăng nhập một lần bằng tài khoản Sat-Alert IAM dùng chung
          cho tất cả hệ thống.
        </p>

        <div className={styles.grid}>
          {BUSINESS_APPS.map((app) => (
            <a key={app.code} className={styles.card} href={app.signInUrl}>
              <div className={styles.cardIcon}>{app.code.slice(0, 1)}</div>
              <div className={styles.cardName}>{app.name}</div>
              <div className={styles.cardDescription}>{app.description}</div>
              <div className={styles.cardAction}>Truy cập →</div>
            </a>
          ))}
        </div>

        <p className={styles.note}>
          Các ứng dụng trên chưa tích hợp SSO — bấm vào sẽ mở thẳng trang của ứng dụng đó.
        </p>

        <a href="/demo-app" className={styles.demoLink}>
          Dùng app demo để test đăng nhập SSO →
        </a>
      </div>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} · Cục Thủy sản và Kiểm ngư
      </footer>
    </div>
  );
};

export default AppPortal;
