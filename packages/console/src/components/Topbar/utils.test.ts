import { version as currentVersion } from '../../../../core/package.json';

import { formatBuildVersion, isGreaterThanCurrentVersion } from './utils';

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
  it('shows the short commit and the build time in Vietnam time', () => {
    expect(
      formatBuildVersion({ commit: 'cc00fa54b2d9cc0b8fd24c37', time: '2026-10-12T03:30:00.000Z' })
    ).toBe('cc00fa5 · 12/10/2026 10:30');
  });

  it('shows only what is known', () => {
    expect(formatBuildVersion({ time: '2026-10-12T03:30:00.000Z' })).toBe('12/10/2026 10:30');
    expect(formatBuildVersion({ commit: 'cc00fa54b2d9', time: 'not a date' })).toBe('cc00fa5');
    expect(formatBuildVersion({})).toBeUndefined();
  });
});
