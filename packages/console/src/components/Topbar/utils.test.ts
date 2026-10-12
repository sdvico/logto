import { version as currentVersion } from '../../../../core/package.json';

import { formatBuildTime, formatBuildVersion, isGreaterThanCurrentVersion } from './utils';

describe('isGreaterThanCurrentVersion', () => {
  it('should return true if the target version is greater than the current Logto version', () => {
    expect(isGreaterThanCurrentVersion('v10.0')).toBe(true);
    expect(isGreaterThanCurrentVersion('10.0')).toBe(true);
    expect(isGreaterThanCurrentVersion('v1.999.0')).toBe(true);
    expect(isGreaterThanCurrentVersion('1.999.0')).toBe(true);
  });

  it('should return false if the target version is less than the current Logto version', () => {
    expect(isGreaterThanCurrentVersion('v0.1.1')).toBe(false);
    expect(isGreaterThanCurrentVersion('0.1.1')).toBe(false);
    expect(isGreaterThanCurrentVersion('v1.15')).toBe(false);
    expect(isGreaterThanCurrentVersion('1.15')).toBe(false);
  });

  it('should return false if the target version is malformed', () => {
    expect(isGreaterThanCurrentVersion('vv8')).toBe(false);
    expect(isGreaterThanCurrentVersion('foo')).toBe(false);
  });

  it('should return false if the target version is equal to the current Logto version', () => {
    expect(isGreaterThanCurrentVersion(currentVersion)).toBe(false);
  });
});

// Sdvico: build version shown under the Console logo to tell which build is deployed.
describe('formatBuildVersion', () => {
  it('shows the release tag of a tagged build', () => {
    expect(formatBuildVersion({ version: 'v1.0.4', commit: 'cc00fa54b2d9' })).toBe('v1.0.4');
  });

  it('shows only the release tag for a build after it', () => {
    expect(formatBuildVersion({ version: 'v1.0.4-3-gf9be67ad1', commit: 'f9be67ad1aa' })).toBe(
      'v1.0.4'
    );
  });

  it('falls back to the short commit and build time without a release tag', () => {
    expect(
      formatBuildVersion({ commit: 'cc00fa54b2d9cc0b8fd24c37', time: '2026-10-12T03:30:00.000Z' })
    ).toBe('cc00fa5 · 12/10/2026 10:30');
    expect(formatBuildVersion({ version: 'f9be67a', commit: 'f9be67ad1aa' })).toBe('f9be67a');
    expect(formatBuildVersion({})).toBeUndefined();
  });
});

describe('formatBuildTime', () => {
  it('shows the build time in Vietnam time', () => {
    expect(formatBuildTime('2026-10-12T03:30:00.000Z')).toBe('12/10/2026 10:30');
    expect(formatBuildTime('not a date')).toBeUndefined();
    expect(formatBuildTime()).toBeUndefined();
  });
});
