import type { ConnectorMetadata } from '@logto/connector-kit';
import { ConnectorConfigFormItemType } from '@logto/connector-kit';

export const endpoint = 'https://api.sendgrid.com/v3/mail/send';

export const defaultMetadata: ConnectorMetadata = {
  id: 'sendgrid-email-service',
  target: 'sendgrid-mail',
  platform: null,
  name: {
    en: 'SendGrid Email',
    'zh-CN': 'SendGrid 邮件',
  },
  logo: './logo.svg',
  logoDark: null,
  description: {
    en: 'SendGrid is a communication platform for transactional and marketing email.',
    'zh-CN': 'SendGrid 是一个面向消费者的邮件通讯平台。',
    'tr-TR': 'SendGrid, operasyonel ve pazarlama e- postaları için bir iletişim platformudur.',
    ko: 'SendGrids는 마케팅 및 이메일을 전송할 수 있는 플랫폼 입니다.',
  },
  readme: './README.md',
  formItems: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: ConnectorConfigFormItemType.Text,
      required: true,
      placeholder: '<your-sendgrid-api-key>',
    },
    {
      key: 'fromEmail',
      label: 'From Email',
      type: ConnectorConfigFormItemType.Text,
      required: true,
      placeholder: 'foo@example.com',
    },
    {
      key: 'fromName',
      label: 'From Name',
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
          subject: 'sdvico SignIn Template',
          content:
            'Your sdvico sign-in verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'Register',
          type: 'text/plain',
          subject: 'sdvico Register Template',
          content:
            'Your sdvico sign-up verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'ForgotPassword',
          type: 'text/plain',
          subject: 'sdvico ForgotPassword Template',
          content:
            'Your sdvico password change verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'OrganizationInvitation',
          type: 'text/plain',
          subject: 'sdvico OrganizationInvitation Template',
          content:
            'Your sdvico organization invitation code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'Generic',
          type: 'text/plain',
          subject: 'sdvico Generic Template',
          content:
            'Your sdvico verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'UserPermissionValidation',
          type: 'text/plain',
          subject: 'sdvico UserPermissionValidation Template',
          content:
            'Your sdvico permission validation code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'BindNewIdentifier',
          type: 'text/plain',
          subject: 'sdvico BindNewIdentifier Template',
          content:
            'Your sdvico new identifier binding code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'MfaVerification',
          type: 'text/plain',
          subject: 'sdvico MfaVerification Template',
          content:
            'Your sdvico MFA verification code is {{code}}. The code will remain active for 10 minutes.',
        },
        {
          usageType: 'BindMfa',
          type: 'text/plain',
          subject: 'sdvico BindMfa Template',
          content:
            'Your sdvico 2-step verification setup code is {{code}}. The code will remain active for 10 minutes.',
        },
      ],
    },
  ],
};
