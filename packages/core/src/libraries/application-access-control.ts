import { isBuiltInApplicationId } from '@logto/schemas';
import { z } from 'zod';

import RequestError from '#src/errors/RequestError/index.js';
import type Queries from '#src/tenants/Queries.js';

const signInBlockGuard = z.object({ iamLogin: z.object({ mode: z.literal('blocked') }) });

/**
 * Sdvico: the IAM "Integrated systems" page can block every sign-in to an application by setting
 * `custom_data.iamLogin.mode = 'blocked'`. Logto access control cannot express this on its own
 * because enabling it requires at least one rule.
 */
export const isApplicationSignInBlocked = (customData: unknown) =>
  signInBlockGuard.safeParse(customData).success;

const isApplicationNotFoundError = (error: unknown) =>
  error instanceof RequestError && error.code === 'entity.not_exists_with_id';

export const createApplicationAccessControlLibrary = (queries: Queries) => {
  const {
    applications: { findApplicationById },
    applicationAccessControl: { hasUserApplicationAccess },
  } = queries;

  const findAppLevelAccessControlEnabled = async (applicationId: string) => {
    try {
      const { appLevelAccessControlEnabled, customData } = await findApplicationById(applicationId);

      if (isApplicationSignInBlocked(customData)) {
        throw new RequestError('oidc.access_denied');
      }

      return appLevelAccessControlEnabled;
    } catch (error: unknown) {
      if (isApplicationNotFoundError(error)) {
        throw new RequestError('oidc.access_denied');
      }

      throw error;
    }
  };

  const assertUserHasApplicationAccess = async (
    applicationId: string,
    userId: string,
    appLevelAccessControlEnabled?: boolean
  ) => {
    if (isBuiltInApplicationId(applicationId)) {
      return;
    }

    const isEnabled =
      appLevelAccessControlEnabled ?? (await findAppLevelAccessControlEnabled(applicationId));

    if (!isEnabled) {
      return;
    }

    if (await hasUserApplicationAccess(applicationId, userId)) {
      return;
    }

    throw new RequestError('oidc.access_denied');
  };

  return {
    assertUserHasApplicationAccess,
  };
};
