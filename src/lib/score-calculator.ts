import { MODULE_INFO } from "./test-types";

// The Digital SAT's size and score ranges, in one place: the score calculator, its page and the FAQ read them from here.
// (Safe for the browser too: no server-only imports.)

/** Questions per section: 2 modules of 27 in Reading and Writing, 2 modules of 22 in Math. */
export const SCORE_QUESTIONS = { rw: 54, math: 44 } as const;

/** What the calculator shows before the visitor moves a slider (the server-rendered result). */
export const SCORE_DEFAULTS = { rw: 40, math: 32 } as const;

export const SECTION_SCORE = { min: 200, max: 800 } as const;
export const TOTAL_SCORE = { min: 400, max: 1600 } as const;

export const SECTION_MINUTES = {
  rw: MODULE_INFO.rw1.minutes + MODULE_INFO.rw2.minutes,
  math: MODULE_INFO.math1.minutes + MODULE_INFO.math2.minutes,
} as const;

/** The break between the two sections. */
export const BREAK_MINUTES = 10;
