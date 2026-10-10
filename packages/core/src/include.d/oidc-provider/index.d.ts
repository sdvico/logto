import type { CustomClientMetadata } from '@logto/schemas';

declare module 'oidc-provider' {
  export interface AllClientMetadata extends CustomClientMetadata {
    appLevelAccessControlEnabled?: boolean;
    /** Sdvico: see `isApplicationSignInBlocked`. */
    iamSignInBlocked?: boolean;
  }
}
