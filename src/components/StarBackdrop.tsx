import { makeStars } from "@/lib/stars";

// Quiet star-themed background: a soft glow, a dot grid, a starfield, a faint constellation and a shooting star.
// Server-safe (CSS animations only, see globals.css art-*). Decorative: aria-hidden, no pointer events.
// "account" sits inside the sign-up screen (its wrapper must be `relative isolate`);
// "app" is fixed behind every page of the signed-in app (components/AppShell.tsx).

export type StarVariant = "account" | "app";

const CONSTELLATION: Record<StarVariant, [number, number][]> = {
  account: [[20, 100], [70, 60], [130, 80], [180, 30], [240, 70], [280, 140]],
  app: [[20, 120], [75, 95], [120, 110], [170, 60], [230, 75], [280, 30]],
};
const SEED: Record<StarVariant, number> = { account: 3000, app: 4000 };

interface Placement {
  /** The outer box. */
  wrapper: string;
  glowA: string;
  glowB: string;
  constellation: string;
  shoot: string;
}

const PANEL = "pointer-events-none absolute inset-0 -z-10 overflow-hidden";

/** Where the glows, the constellation and the shooting star sit. The account panel has the art on its right, so its decorations lean left. */
const PLACEMENT: Record<StarVariant, Placement> = {
  account: {
    wrapper: PANEL,
    glowA: "-top-40 -left-40",
    glowB: "-right-24 -bottom-48",
    constellation: "top-4 left-10 w-[11rem] opacity-25 xl:block dark:opacity-35",
    shoot: "left-[34%] [animation-delay:2s]",
  },
  // Fixed behind the whole page, right of the desktop sidebar (follows its collapsed width); hidden in focus mode.
  app: {
    wrapper: "pointer-events-none fixed inset-0 -z-10 overflow-hidden lg:left-64 lg:sb-collapsed:left-[72px] focus-mode:hidden print:hidden",
    glowA: "-top-40 -right-40",
    glowB: "-bottom-48 -left-24",
    constellation: "top-16 right-6 w-[14rem] opacity-20 lg:block dark:opacity-30",
    shoot: "left-[60%] [animation-delay:6s]",
  },
};

export function StarBackdrop({ variant }: { variant: StarVariant }) {
  const pts = CONSTELLATION[variant];
  const pos = PLACEMENT[variant];
  const last = pts[pts.length - 1];
  // The app backdrop sits behind every page: a twinkling star repaints the whole full-screen SVG each frame
  // (SVG opacity isn't GPU-composited), so there the stars stay still. The sign-up screens keep the twinkle.
  const twinkle = variant !== "app";
  return (
    <div aria-hidden="true" data-chrome={variant === "app" ? "" : undefined} className={pos.wrapper}>
      <div className={`absolute ${pos.glowA} h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_10%,transparent),transparent)]`} />
      <div className={`absolute ${pos.glowB} h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_6%,transparent),transparent)]`} />
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(var(--color-line)_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      <svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-ink opacity-40 dark:opacity-60">
        {makeStars(60, SEED[variant]).map((st, i) => (
          <circle
            key={i}
            cx={st.cx}
            cy={st.cy}
            r={st.r}
            fill="currentColor"
            opacity={st.o}
            className={twinkle && st.twinkle ? "art-twinkle" : undefined}
            style={twinkle && st.twinkle ? { animationDelay: `${st.delay}s`, animationDuration: `${st.dur}s` } : undefined}
          />
        ))}
      </svg>
      <svg viewBox="0 0 300 200" className={`absolute hidden text-ink ${pos.constellation}`}>
        <polyline pathLength={1} fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" className="stat-line" points={pts.map((p) => p.join(",")).join(" ")} />
        {pts.slice(0, -1).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" />
        ))}
        <circle cx={last[0]} cy={last[1]} r="3.5" fill="var(--accent)" className="art-pulse" />
      </svg>
      <span className={`art-shoot absolute top-[14%] h-px w-32 bg-linear-to-r from-transparent via-ink/50 to-transparent ${pos.shoot}`} />
    </div>
  );
}
