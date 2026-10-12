import { version } from '../../../../core/package.json';

/** Check if the target version is greater than the current Logto version. */
export const isGreaterThanCurrentVersion = (target: string) => {
  const latestComponents = (target.startsWith('v') ? target.slice(1) : target).split('.');
  const currentComponents = version.split('.');

  for (const [index, component] of latestComponents.entries()) {
    const current = currentComponents[index];
    if (!current || Number(current) < Number(component)) {
      return true;
    }

    if (Number(current) > Number(component)) {
      return false;
    }
  }
  return false;
};

const shortCommitLength = 7;

// Sdvico: build time in Vietnam time, `12/10/2026 10:30`.
const buildTimeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** Sdvico: `12/10/2026 10:30` (Vietnam time), or undefined for a missing or invalid time. */
export const formatBuildTime = (time?: string) => {
  const date = time ? new Date(time) : undefined;
  return date && !Number.isNaN(date.getTime())
    ? buildTimeFormat.format(date).replace(', ', ' ')
    : undefined;
};

/** `git describe --tags` output: `v1.0.4`, or `v1.0.4-3-gf9be67ad1` three commits later. */
const describeRegEx = /^(v\d[^\s-]*)(?:-\d+-g[\da-f]+)?$/;

/**
 * Sdvico: the version shown under the Console logo, so an admin can tell which build a server
 * runs: the latest release tag (`v1.0.4`, also for builds after it). Without a
 * release tag it falls back to the short commit and build time. Undefined if nothing is known.
 */
export const formatBuildVersion = ({
  version,
  commit,
  time,
}: {
  version?: string;
  commit?: string;
  time?: string;
}) => {
  const shortCommit = commit?.slice(0, shortCommitLength);
  const [, tag] = describeRegEx.exec(version ?? '') ?? [];

  if (tag) {
    return tag;
  }

  const parts = [shortCommit, formatBuildTime(time)].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : undefined;
};
