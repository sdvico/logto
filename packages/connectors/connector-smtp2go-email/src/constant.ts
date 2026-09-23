import type { ConnectorMetadata } from '@logto/connector-kit';
import { ConnectorConfigFormItemType } from '@logto/connector-kit';

export const endpoint = 'https://api.smtp2go.com/v3/email/send';

export const defaultMetadata: ConnectorMetadata = {
  id: 'smtp2go-email-service',
  target: 'smtp2go-email',
  platform: null,
  name: {
    en: 'SMTP2GO Email',
    'zh-CN': 'SMTP2GO 邮件',
    de: 'SMTP2GO E-Mail',
  },
  logo: './logo.svg',
  logoDark: null,
  description: {
    en: 'SMTP2GO is a reliable email delivery service for transactional and marketing emails.',
    'zh-CN': 'SMTP2GO 是一个可靠的事务性和营销电子邮件服务。',
    de: 'SMTP2GO ist ein zuverlässiger E-Mail-Zustelldienst für transaktionale und Marketing-E-Mails.',
  },
  readme: './README.md',
  formItems: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: ConnectorConfigFormItemType.Text,
      required: true,
      placeholder: '<your-smtp2go-api-key>',
    },
    {
      key: 'sender',
      label: 'Sender Email',
      type: ConnectorConfigFormItemType.Text,
      required: true,
      placeholder: 'noreply@example.com',
    },
    {
      key: 'senderName',
      label: 'Sender Name',
      type: ConnectorConfigFormItemType.Text,
      required: false,
      placeholder: 'sdvico',
    },
    {
      key: 'templates',
      label: 'Templates',
      type: ConnectorConfigFormItemType.Json,
      required: true,
      defaultValue: [
        {
          usageType: 'SignIn',
          type: 'text/plain',
          subject: 'sdvico Sign-In Verification Code',
          content:
            'Your sdvico sign-in verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'Register',
          type: 'text/plain',
          subject: 'sdvico Registration Verification Code',
          content:
            'Your sdvico sign-up verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'ForgotPassword',
          type: 'text/plain',
          subject: 'sdvico Password Reset Verification Code',
          content:
            'Your sdvico password reset verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'OrganizationInvitation',
          type: 'text/plain',
          subject: 'sdvico Organization Invitation',
          content:
            'You have been invited to join an organization. Your invitation link is {{link}}.',
        },
        {
          usageType: 'Generic',
          type: 'text/plain',
          subject: 'sdvico Verification Code',
          content:
            'Your sdvico verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'UserPermissionValidation',
          type: 'text/plain',
          subject: 'sdvico Permission Validation Code',
          content:
            'Your sdvico permission validation code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'BindNewIdentifier',
          type: 'text/plain',
          subject: 'sdvico New Identifier Binding Code',
          content:
            'Your sdvico new identifier binding code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'MfaVerification',
          type: 'text/plain',
          subject: 'sdvico MFA Verification Code',
          content:
            'Your sdvico MFA verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'BindMfa',
          type: 'text/plain',
          subject: 'sdvico 2-Step Verification Setup Code',
          content:
            'Your sdvico 2-step verification setup code is {{code}}. The code will remain active for 10 minutes.',
        },
      ],
    },
  ],
};
