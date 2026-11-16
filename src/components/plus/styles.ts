// Shared class strings for the Stellar Plus UI (/plus and the lock panels). Callers may append `w-full sm:w-auto` or
// `text-sm`. No size or padding class appears twice in one string. Contrast numbers: see the plan notes in globals.css.
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong";
export const FOCUS_ON_DARK = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const BASE = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-colors";
export const BTN_PRIMARY = `${BASE} px-5 py-2.5 bg-primary-strong text-primary-ink hover:bg-primary-strong-hover ${FOCUS}`;
export const BTN_SECONDARY = `${BASE} px-5 py-2.5 border border-line bg-surface text-ink hover:bg-surface-2 ${FOCUS}`;
export const BTN_QUIET = `${BASE} px-4 py-2 text-sm border border-primary-strong/30 text-primary-strong hover:bg-primary-soft ${FOCUS}`;
export const BTN_ON_DARK = `${BASE} px-5 py-2.5 bg-accent text-side hover:brightness-110 ${FOCUS_ON_DARK}`;
export const BTN_GHOST_DARK = `${BASE} px-5 py-2.5 border border-white/20 text-side-ink hover:bg-white/10 ${FOCUS_ON_DARK}`;
export const LINK_STRONG = `font-semibold text-primary-strong underline-offset-4 hover:underline ${FOCUS}`;
export const LINK_ON_DARK = `font-semibold text-side-ink underline decoration-white/40 underline-offset-4 hover:decoration-white ${FOCUS_ON_DARK}`;
export const PLUS_SURFACE = "plus-surface ring-1 ring-white/10 shadow-[0_30px_80px_-40px_rgb(234_88_12/0.45)] dark:shadow-none";
export const EYEBROW = "text-sm font-semibold text-primary-strong";
export const SECTION = "mt-20 scroll-mt-20 md:mt-28 lg:scroll-mt-8";
