import { C, Css, Svg, Tex } from "./kit";

// A word problem becomes two equations: one counts the tickets, one adds up the money.
export const alt =
  "A story card: 90 tickets, $715 total, student $6, adult $11. The count 90 builds s + a = 90, and the money facts 6, 11 and 715 build 6s + 11a = 715. Both equations form a system.";

const P = "v-systems-linear--story-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fade in at t%, stay until `until`% (default: the end of the loop), then fade out. Hidden in the still frame when until < 90. */
const show = (n: string, t: number, until = 90) =>
  r(n, `0%, ${t}% { opacity: 0 } ${t + 5}%, ${until}% { opacity: 1 } ${until + (until >= 90 ? 7 : 4)}%, 100% { opacity: 0 }`, until < 90 ? "opacity: 0;" : "");
/** A chip that flies from the story card (offset dx, dy from its resting place) to its place in an equation, then fades into it. */
const fly = (n: string, t0: number, t1: number, dx: number, dy: number) =>
  r(
    n,
    `0%, ${t0}% { opacity: 0; transform: translate(${dx}px, ${dy}px) } ${t0 + 2}% { opacity: 1; transform: translate(${dx}px, ${dy}px) } ${t1}% { opacity: 1; transform: none } ${t1 + 4}%, 100% { opacity: 0; transform: none }`,
    "opacity: 0;",
  );

const SZ = 22;
const X0 = 62;
const R1 = 114;
const R2 = 150;
const EM: Record<string, number> = { s: 0.47, a: 0.529, "+": 1.222, "=": 1.333 };
const wd = (s: string) => [...s].reduce((n, c) => n + (EM[c] ?? 0.5), 0) * SZ;
// Where the facts land in the equations (centers).
const c90 = X0 + wd("s+a=") + 0.5 * SZ;
const c6 = X0 + 0.25 * SZ;
const c11 = X0 + wd("6s+") + 0.5 * SZ;
const c715 = X0 + wd("6s+11a=") + 0.75 * SZ;

const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  show("card", 4),
  show("chips", 12),
  show("boxes", 22),
  show("eq1", 42),
  show("tag1", 46),
  fly("f90", 33, 41, 59 - c90, 26 - R1),
  fly("f715", 50, 60, 127 - c715, 26 - R2),
  fly("f6", 52, 60, 77 - c6, 48 - R2),
  fly("f11", 54, 60, 140 - c11, 48 - R2),
  show("eq2", 60),
  show("tag2", 63),
  show("brace", 68),
  show("tick1", 74),
  show("tick2", 79),
].join(" ");

const tex = (x: number, y: number, s: string, color: string = C.ink, size = SZ, anchor: "start" | "middle" = "start") => (
  <Tex x={x} y={y} size={size} anchor={anchor} width={170} color={color}>
    {s}
  </Tex>
);
const chip = (cx: number, cy: number, w: number, label: string, money: boolean, size = 13) => (
  <g>
    <rect x={cx - w / 2} y={cy - 11} width={w} height={22} rx={8} fill={money ? C.soft : C.fill} stroke={money ? C.primary : C.ink} strokeWidth={1.5} />
    <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize={size} fontWeight={700} fill={money ? C.primaryText : C.ink} stroke="none">
      {label}
    </text>
  </g>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The story card */}
      <g className={cls("card")}>
        <rect x={16} y={8} width={288} height={52} rx={12} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={156} y={30} fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          total.
        </text>
        <text x={24} y={50} fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          Student <tspan fill={C.primaryText} fontWeight={700}>$6</tspan>, adult <tspan fill={C.primaryText} fontWeight={700}>$11</tspan>.
        </text>
      </g>
      <g className={cls("chips")}>
        <rect x={24} y={15} width={70} height={22} rx={8} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
        <rect x={106} y={15} width={42} height={22} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
      </g>
      <g className={cls("card")}>
        <text x={59} y={30.5} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
          90 tickets
        </text>
        <text x={127} y={30.5} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} stroke="none">
          $715
        </text>
      </g>

      {/* s and a */}
      <g className={cls("boxes")}>
        <rect x={40} y={68} width={106} height={22} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        {tex(52, 79, String.raw`s`, C.ink, 15)}
        <text x={68} y={83.5} fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          students
        </text>
        <rect x={174} y={68} width={106} height={22} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        {tex(186, 79, String.raw`a`, C.ink, 15)}
        <text x={202} y={83.5} fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          adults
        </text>
      </g>

      {/* The count equation */}
      <g className={cls("eq1")}>{tex(X0, R1, String.raw`s+a=90`)}</g>
      <g className={cls("tag1")}>
        <text x={222} y={R1 + 4.5} fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
          how many
        </text>
      </g>
      <g className={cls("f90")}>{chip(c90, R1, 34, "90", false, 15)}</g>

      {/* The money equation */}
      <g className={cls("eq2")}>
        {tex(X0, R2, String.raw`6s+11a=715`, C.ink)}
      </g>
      <g className={cls("tag2")}>
        <text x={222} y={R2 + 4.5} fontSize={12} fontWeight={700} fill={C.primaryText} stroke="none">
          how much
        </text>
      </g>
      <g className={cls("f6")}>{chip(c6, R2, 24, "6", true, 15)}</g>
      <g className={cls("f11")}>{chip(c11, R2, 32, "11", true, 15)}</g>
      <g className={cls("f715")}>{chip(c715, R2, 44, "715", true, 15)}</g>

      {/* The system bracket and one tick per fact used */}
      <g className={cls("brace")}>
        <path d={`M52 ${R1 - 14} Q44 ${R1 - 14} 44 ${R1 - 6} V${(R1 + R2) / 2 - 6} Q44 ${(R1 + R2) / 2} 38 ${(R1 + R2) / 2} Q44 ${(R1 + R2) / 2} 44 ${(R1 + R2) / 2 + 6} V${R2 + 6} Q44 ${R2 + 14} 52 ${R2 + 14}`} fill="none" stroke={C.muted} strokeWidth={1.8} />
        <text x={26} y={(R1 + R2) / 2} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none" transform={`rotate(-90 26 ${(R1 + R2) / 2})`}>
          system
        </text>
      </g>
      <path className={cls("tick1")} d={`M290 ${R1 - 1} l5 5 l9 -10`} fill="none" stroke={C.good} strokeWidth={2.5} />
      <path className={cls("tick2")} d={`M290 ${R2 - 1} l5 5 l9 -10`} fill="none" stroke={C.good} strokeWidth={2.5} />
    </Svg>
  );
}
