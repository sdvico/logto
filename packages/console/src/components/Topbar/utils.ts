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

/**
 * Sdvico: `cc00fa5 · 12/10/2026 10:30` from the commit and build time baked in at build time, so an
 * admin can tell which build a server runs. Leaves out whatever is unknown; undefined if nothing is.
 */
export const formatBuildVersion = ({ commit, time }: { commit?: string; time?: string }) => {
  const date = time ? new Date(time) : undefined;
  const parts = [
    commit?.slice(0, shortCommitLength),
    date && !Number.isNaN(date.getTime())
      ? buildTimeFormat.format(date).replace(', ', ' ')
      : undefined,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : undefined;
};
