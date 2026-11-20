// Calendar math for the ranked leaderboards (docs/ELO.md section 7): seasons are UTC months ("YYYY-MM"), weeks run Monday 00:00 UTC
// to the next Monday ("YYYY-MM-DD" of the Monday). Pure functions, no server or browser APIs, so the API route, the page and
// the node:test file all share them.

export const BOARD_PAGE_SIZE = 50;
/** Only the top 100 is browsable: pages 1 and 2. */
export const BOARD_MAX_RANK = 100;
export const BOARD_MAX_PAGES = BOARD_MAX_RANK / BOARD_PAGE_SIZE;

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT_MONTHS = MONTHS.map((m) => m.slice(0, 3));

const pad = (n: number) => String(n).padStart(2, "0");

/** 'YYYY-MM' of the UTC month containing `now`. */
export function seasonKey(now: number): string {
  const d = new Date(now);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

/** 'YYYY-MM' of the UTC month before the one containing `now` (December -> January rolls the year). */
export function prevSeasonKey(now: number): string {
  const d = new Date(now);
  return seasonKey(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1));
}

/** [start, end) of a 'YYYY-MM' season in ms, or null for a malformed key. */
export function seasonRange(key: string): { from: number; to: number } | null {
  const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(key);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  return { from: Date.UTC(y, mo - 1, 1), to: Date.UTC(y, mo, 1) };
}

/** Monday 00:00 UTC (ms) of the week containing `now`. */
export function weekStart(now: number): number {
  const d = new Date(now);
  const sinceMonday = (d.getUTCDay() + 6) % 7;
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - sinceMonday);
}

/** 'YYYY-MM-DD' of the Monday of the week containing `now`. */
export function weekKey(now: number): string {
  const d = new Date(weekStart(now));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** [start, end) of the week whose Monday is `key` ('YYYY-MM-DD'), or null for a malformed key. */
export function weekRange(key: string): { from: number; to: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  const from = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(from) ? null : { from, to: from + 7 * DAY_MS };
}

/** "November 2026". */
export function seasonLabel(key: string): string {
  const r = seasonRange(key);
  if (!r) return key;
  const d = new Date(r.from);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "Nov 16 – 22" (or "Nov 30 – Dec 6" across months), the week starting on Monday `key`. */
export function weekLabel(key: string): string {
  const r = weekRange(key);
  if (!r) return key;
  const a = new Date(r.from);
  const b = new Date(r.to - DAY_MS);
  const left = `${SHORT_MONTHS[a.getUTCMonth()]} ${a.getUTCDate()}`;
  const right = a.getUTCMonth() === b.getUTCMonth() ? String(b.getUTCDate()) : `${SHORT_MONTHS[b.getUTCMonth()]} ${b.getUTCDate()}`;
  return `${left} – ${right}`;
}

/** "3d 4h" / "5h 12m" / "8m": time until `to`, never negative. */
export function timeUntil(to: number, now: number): string {
  const m = Math.max(0, Math.floor((to - now) / 60_000));
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}
