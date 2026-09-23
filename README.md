<p align="center">
  <picture>
    <source width="200" media="(prefers-color-scheme: dark)" srcset="assets/sdvico-logo-dark.svg">
    <source width="200" media="(prefers-color-scheme: light)" srcset="assets/sdvico-logo-light.svg">
    <img width="200" src="assets/sdvico-logo-light.svg" alt="sdvico logo">
  </picture>
</p>

[![checks](https://img.shields.io/github/checks-status/sdvico/logto/master)](https://github.com/sdvico/logto/actions?query=branch%3Amaster)
[![release](https://img.shields.io/github/v/release/sdvico/logto?color=3a3c3f)](https://github.com/sdvico/logto/releases)

# sdvico

**sdvico là nền tảng hạ tầng xác thực (auth) mã nguồn mở, hiện đại, dành cho các ứng dụng SaaS và AI.**

sdvico giúp loại bỏ phần phức tạp của OIDC và OAuth 2.1, cho phép xây dựng hệ thống xác thực an toàn, sẵn sàng cho môi trường thực tế với đa tenant (multi-tenancy), SSO cho doanh nghiệp và RBAC.

> Dự án này được rebrand nội bộ từ mã nguồn mở [Logto](https://github.com/logto-io/logto) để phục vụ triển khai cho sdvico. Đây là bản fork nội bộ, chưa đẩy lên GitHub công khai.

![sdvico features](./assets/logto-features.png)

## Vì sao chọn sdvico?

Được xây dựng cho các nhóm phát triển SaaS, AI và các nền tảng dựa trên agent mà không phải đau đầu với các vấn đề xác thực thường gặp.

Với sdvico, bạn có:

- **Đa tenant, SSO doanh nghiệp và RBAC**: dùng được ngay, không cần giải pháp vòng vo.
- **Luồng đăng nhập dựng sẵn**, giao diện tùy biến, và SDK cho hơn 30 framework.
- **Hỗ trợ đầy đủ OIDC, OAuth 2.1 và SAML** mà không phải vật lộn với các giao thức.
- **Sẵn sàng dùng ngay cho Model Context Protocol và các kiến trúc dựa trên AI agent**.

## Bắt đầu

Chọn cách phù hợp với bạn:

- **Phát triển cục bộ (local):**

  ```bash
  # Dùng Docker Compose (cần Docker Desktop)
  curl -fsSL https://raw.githubusercontent.com/sdvico/logto/HEAD/docker-compose.yml | \
  docker compose -p sdvico -f - up

  # Dùng Node.js (cần PostgreSQL)
  npm init @logto
  ```

## Tích hợp mọi nơi

sdvico hỗ trợ mọi ứng dụng, API và dịch vụ của bạn với các giao thức chuẩn công nghiệp.

- **SDK cho hơn 30 framework**: React, Next.js, Angular, Vue, Flutter, Go, Python, và nhiều hơn nữa.
- **Kết nối với mọi IdP**: Google, Facebook, Azure AD, Okta, và nhiều hơn nữa.
- **Tích hợp linh hoạt**: SPA, web app, mobile app, API, M2M, công cụ CLI.
- **Sẵn sàng cho Model Context Protocol và các kiến trúc dựa trên agent**.

## Giới thiệu tính năng

**SDK ưu tiên cho lập trình viên**: cài đặt trong vài phút với hướng dẫn rõ ràng.

![sdvico auth SDK showcase](./assets/showcase-logto-auth-sdks.gif)

**Luồng xác thực thân thiện với người dùng**: đăng ký, đăng nhập, đăng nhập qua mạng xã hội, Google One Tap, MFA, SSO.

![sdvico sign-in experience showcase](./assets/showcase-logto-sign-in-exeperience.gif)

**Đa tenant & tổ chức**: RBAC theo tổ chức, mời thành viên, cấp quyền tự động khi cần (just-in-time provisioning), và nhiều hơn nữa.

![sdvico multi-tenancy showcase](./assets/showcase-logto-multi-tenancy.gif)

## Bản quyền

[MPL-2.0](LICENSE).

<p align="right">
⬆️ <a href="#sdvico">Về đầu trang</a>
</p>
