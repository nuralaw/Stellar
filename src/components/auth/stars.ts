// Deterministic pseudo-random numbers: the same stars on the server and in the browser.
export const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export interface Star {
  cx: number;
  cy: number;
  r: number;
  o: number;
  twinkle: boolean;
  delay: number;
  dur: number;
}

/** `count` stars in an 800 x 800 box; a different `seed` gives a different sky. Every 8th star twinkles (art-twinkle). */
export function makeStars(count: number, seed: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    cx: rnd(i + seed) * 800,
    cy: rnd(i + 100 + seed) * 800,
    r: 0.6 + rnd(i + 200 + seed) * 1.3,
    o: 0.2 + rnd(i + 300 + seed) * 0.5,
    twinkle: i % 8 === 0,
    delay: -rnd(i + 400 + seed) * 3,
    dur: 2.5 + rnd(i + 500 + seed) * 2.5,
  }));
}
