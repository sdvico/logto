import { errors } from 'oidc-provider';

import { assertUserHasApplicationAccessForOidc } from './application-access-control.js';

const { jest } = import.meta;

describe('assertUserHasApplicationAccessForOidc()', () => {
  const assertUserHasApplicationAccess = jest.fn<
    Promise<void>,
    [applicationId: string, userId: string, enabled?: boolean]
  >();
  const library = { assertUserHasApplicationAccess };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Sdvico: the IAM "block all sign-ins" switch is carried on the client metadata.
  it('denies a blocked application before checking access-control rules', async () => {
    await expect(
      assertUserHasApplicationAccessForOidc(library, 'app-id', 'user-id', false, true)
    ).rejects.toBeInstanceOf(errors.AccessDenied);

    expect(assertUserHasApplicationAccess).not.toHaveBeenCalled();
  });

  it('delegates to the access-control library when the application is not blocked', async () => {
    await assertUserHasApplicationAccessForOidc(library, 'app-id', 'user-id', true, false);

    expect(assertUserHasApplicationAccess).toHaveBeenCalledWith('app-id', 'user-id', true);
  });
});
