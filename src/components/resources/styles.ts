// Class strings shared by the public resource pages (/sat-score-calculator, /sat-dates, /sat-vocabulary).
// Headings follow /vocabulary and /plus; buttons come from components/plus/styles.ts.
export const H1 = "text-3xl font-bold tracking-tight text-balance md:text-4xl";
export const LEAD = "mt-2 max-w-2xl text-muted";
export const H2 = "text-2xl font-bold tracking-tight text-balance";
export const H3 = "text-lg font-bold tracking-tight";
/** A page section with room above it; `scroll-mt` keeps in-page anchors clear of the mobile top bar. */
export const SECTION = "mt-12 scroll-mt-20 md:mt-16 lg:scroll-mt-8";
export const CARD = "rounded-2xl border border-line bg-surface";
export const PROSE = "mt-3 max-w-2xl leading-relaxed text-ink/90";
/** Wide tables get their own horizontal scroll, so the page itself never scrolls sideways. */
export const TABLE_WRAP = `${CARD} overflow-x-auto`;
export const TABLE = "w-full text-left text-xs sm:text-sm";
export const TH = "px-2.5 py-2.5 text-[11px] font-semibold tracking-wide text-muted uppercase sm:px-4 sm:text-xs";
export const TD = "px-2.5 py-2.5 tabular-nums sm:px-4";
export const TR = "border-t border-line";
