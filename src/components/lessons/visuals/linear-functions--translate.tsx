import { C, Css, Svg, Tex } from "./kit";

// Shifting a line: add to the output and it moves up or down; replace x by x - h and it moves right. The slope never changes.
export const alt =
  "The line f(x) = 2x + 5 moves down 3 to 2x + 2, and right 4 to 2x - 3. Its y-intercept goes from 5 to 2 to -3, but the slope stays 2.";

const P = "v-linear-functions--translate-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fades in at s% (taking d%), optionally from a transform, holds, then leaves with the scene. */
const fx = (n: string, s: number, d = 4, from = "none") =>
  r(n, `0%, ${s}% { opacity: 0; transform: ${from} } ${s + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none }`, "transform-box: fill-box; transform-origin: center;");

// Grid: 15 px per 1 across, 7.3 px per 1 up; origin (100, 124). The lines have slope 2.
const gx = (n: number) => 100 + 15 * n;
const gy = (n: number) => 124 - 7.3 * n;
const DOWN = 3 * 7.3; // 3 up/down units in px
const RIGHT = 4 * 15; // 4 across units in px
const lab = { stroke: "none" } as const;

/** A copy of the line: shown on the original, then slides by `to`, and stays there. */
const slide = (n: string, s: number, to: string) =>
  r(
    n,
    `0%, ${s}% { opacity: 0; transform: none } ${s + 3}% { opacity: 1; transform: none } ${s + 13}%, 92% { opacity: 1; transform: ${to} } 97%, 100% { opacity: 0; transform: ${to} }`,
    `transform: ${to};`,
  );

const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  fx("grid", 0, 5),
  r("orig", "0%, 4% { stroke-dashoffset: 100; opacity: 1 } 15%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 }", "stroke-dasharray: 100;"),
  fx("eq1", 12, 5),
  fx("d0", 15, 4, "scale(0)"),
  slide("c1", 22, `translateY(${DOWN}px)`),
  fx("eq2", 36, 5),
  fx("ar1", 37, 4),
  fx("d1", 38, 4, "scale(0)"),
  slide("c2", 50, `translateX(${RIGHT}px)`),
  fx("eq3", 64, 5),
  fx("ar2", 65, 4),
  fx("d2", 66, 4, "scale(0)"),
  fx("tri", 74, 6),
  fx("note", 78, 5),
].join("\n");

/** A short thick arrow from (x1,y1) to (x2,y2), straight up/down or left/right. */
function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const vertical = x1 === x2;
  const s = Math.sign(vertical ? y2 - y1 : x2 - x1);
  const head = vertical
    ? `M${x2 - 4.5} ${y2 - 6 * s} L${x2} ${y2} L${x2 + 4.5} ${y2 - 6 * s}`
    : `M${x2 - 6 * s} ${y2 - 4.5} L${x2} ${y2} L${x2 - 6 * s} ${y2 + 4.5}`;
  return <path d={`M${x1} ${y1} L${x2} ${y2} ${head}`} fill="none" stroke={C.primary} strokeWidth={3} />;
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <defs>
        <clipPath id="v-linear-functions--translate-clip">
          <rect x={gx(-5)} y={gy(14)} width={150} height={7.3 * 18} />
        </clipPath>
      </defs>

      {/* Grid and axes */}
      <g className={cls("grid")}>
        <g stroke={C.line} strokeWidth={1}>
          {[-4, -3, -2, -1, 1, 2, 3, 4].map((n) => (
            <line key={`x${n}`} x1={gx(n)} y1={gy(14)} x2={gx(n)} y2={gy(-4)} />
          ))}
          {[-4, -2, 2, 4, 6, 8, 10, 12].map((n) => (
            <line key={`y${n}`} x1={gx(-5)} y1={gy(n)} x2={gx(5)} y2={gy(n)} />
          ))}
        </g>
        <path d={`M${gx(0)} ${gy(14)} V${gy(-4)} M${gx(-5)} ${gy(0)} H${gx(5)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      </g>

      <g clipPath="url(#v-linear-functions--translate-clip)">
        {/* The original: neutral */}
        <line className={cls("orig")} x1={gx(-6)} y1={gy(-7)} x2={gx(6)} y2={gy(17)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />
        {/* The copies: the one that moves is the accent */}
        <line className={cls("c1")} x1={gx(-6)} y1={gy(-7)} x2={gx(6)} y2={gy(17)} stroke={C.primary} strokeWidth={2.5} />
        <line className={cls("c2")} x1={gx(-6)} y1={gy(-7)} x2={gx(6)} y2={gy(17)} stroke={C.primary} strokeWidth={2.5} />
      </g>

      {/* y-intercepts: 5, then 2, then -3 */}
      <g className={cls("d0")}>
        <circle cx={gx(0)} cy={gy(5)} r={4} fill={C.ink} stroke={C.bg} strokeWidth={1.5} />
        <text x={gx(0) - 7} y={gy(5) - 3} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>5</text>
      </g>
      <g className={cls("d1")}>
        <circle cx={gx(0)} cy={gy(2)} r={4.5} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />
        <text x={gx(0) + 7} y={gy(2) + 5} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>2</text>
      </g>
      <g className={cls("d2")}>
        <circle cx={gx(0)} cy={gy(-3)} r={4.5} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />
        <text x={gx(0) + 7} y={gy(-3) + 5} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>−3</text>
      </g>

      {/* The shifts: one short arrow each */}
      <g className={cls("ar1")}>
        <Arrow x1={gx(2)} y1={gy(9) + 1} x2={gx(2)} y2={gy(6)} />
        <text x={gx(2) - 4} y={gy(9) - 4} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>down 3</text>
      </g>
      <g className={cls("ar2")}>
        <Arrow x1={gx(0) + 5} y1={gy(5)} x2={gx(4) - 5} y2={gy(5)} />
        <text x={gx(4) + 6} y={gy(5) + 4} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>right 4</text>
      </g>

      {/* The same slope triangle (run 1, rise 2) on both copies */}
      <g className={cls("tri")} fill={C.soft} stroke={C.primary} strokeWidth={1.5}>
        <path d={`M${gx(3)} ${gy(8)} H${gx(4)} V${gy(10)} Z`} />
        <path d={`M${gx(2.5)} ${gy(2)} H${gx(3.5)} V${gy(4)} Z`} />
        <g fill={C.primaryText} stroke="none" fontSize={11} fontWeight={700}>
          <text x={gx(3.5)} y={gy(8) + 11} textAnchor="middle">1</text>
          <text x={gx(4) + 4} y={gy(9) + 4}>2</text>
          <text x={gx(3)} y={gy(2) + 11} textAnchor="middle">1</text>
          <text x={gx(3.5) + 4} y={gy(3) + 4}>2</text>
        </g>
      </g>

      {/* The rules, level with the line each one names */}
      <g className={cls("eq1")}>
        <Tex x={190} y={24} size={15} anchor="start" width={124}>{String.raw`f(x)=2x+5`}</Tex>
      </g>
      <g className={cls("eq2")}>
        <Tex x={190} y={54} size={14} anchor="start" width={124} color={C.primaryText}>{String.raw`f(x)-3=2x+2`}</Tex>
      </g>
      <g className={cls("eq3")}>
        <Tex x={190} y={110} size={14} anchor="start" width={124} color={C.primaryText}>{String.raw`f(x-4)=2x-3`}</Tex>
      </g>
      <g className={cls("note")}>
        <text x={190} y={140} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>slope unchanged</text>
        <Tex x={190} y={156} size={13} anchor="start" width={100} color={C.muted}>{String.raw`m=2\text{ for all three}`}</Tex>
      </g>
    </Svg>
  );
}
