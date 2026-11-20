const R = 20;
const C = 2 * Math.PI * R;

/**
 * Circular countdown for one question. Green until half the time is gone, orange up to 80%, red for the last 20%.
 * It only draws what it's given: the caller derives `leftMs` from the server's clock (limitS and serverNow - issuedAt).
 */
export function TimerRing({ leftMs, limitMs }: { leftMs: number; limitMs: number }) {
  const frac = limitMs > 0 ? Math.min(1, Math.max(0, leftMs / limitMs)) : 0;
  const tone = frac > 0.5 ? "text-success" : frac > 0.2 ? "text-primary-strong" : "text-danger";
  const secs = Math.ceil(Math.max(0, leftMs) / 1000);
  return (
    <div className={`relative grid h-12 w-12 shrink-0 place-items-center ${tone}`} role="timer" aria-label={`Time left: ${secs} seconds`}>
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={R} fill="none" strokeWidth="4" className="stroke-surface-2" />
        <circle cx="24" cy="24" r={R} fill="none" strokeWidth="4" strokeLinecap="round" stroke="currentColor" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} />
      </svg>
      <span className="relative font-mono text-sm font-bold text-ink tabular-nums">{secs}</span>
    </div>
  );
}
