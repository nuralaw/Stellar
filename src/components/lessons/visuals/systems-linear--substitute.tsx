import { C, Css, Svg, Tex } from "./kit";

// Substitution: one letter is alone (y = 2x), so drop that expression, in brackets, into the other equation.
export const alt =
  "In y = 2x and 3x + y = 10, the y of the second equation is replaced by (2x): 3x + (2x) = 10, so 5x = 10 and x = 2. Putting 2 back gives y = 4, the point (2, 4) where the two lines cross.";

const P = "v-systems-linear--substitute-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fade in at t%, stay until `until`% (default: the end of the loop), then fade out. Hidden in the still frame when until < 90. */
const show = (n: string, t: number, until = 90) =>
  r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, ${until}% { opacity: 1 } ${until + (until >= 90 ? 7 : 4)}%, 100% { opacity: 0 }`, until < 90 ? "opacity: 0;" : "");
const SZ = 22;
const X0 = 20;
const EM: Record<string, number> = { x: 0.578, y: 0.489, "+": 1.222, "=": 1.333, "(": 0.389, ")": 0.389 };
const em = (s: string) => [...s].reduce((n, c) => n + (EM[c] ?? 0.5), 0);
const wd = (s: string) => em(s) * SZ;
const R1 = 30;
const R2 = 62;
const R3 = 94;
const R4 = 126;
const R5 = 158;
const chipX = X0 + wd("y=") - wd("("); // the (2x) chip sits over the 2x of y = 2x
const landX = X0 + wd("3x+"); // where the swapped-in (2x) sits in the second equation
const DX1 = Math.round(landX - chipX);
const DY1 = R2 - R1;
const DX2 = Math.round(wd("y=") - wd("x="));
const DY2 = R1 - R4;
const MX = 110; // the 2 swings out to the right of the equations on its way up

const css = [
  `.${a} { animation: 11s ease-in-out infinite; }`,
  show("rowa", 4, 38), // 3x + y = 10
  show("hl", 10, 36),
  show("rowb", 38),
  show("c3", 52),
  show("c4", 62, 80),
  show("c4g", 80),
  show("c5", 82),
  show("graph", 82),
  show("swap", 28, 44),
  r("chip", `0%, 28% { opacity: 0; transform: none } 31% { opacity: 1; transform: none } 40%, 42% { opacity: 1; transform: translate(${DX1}px, ${DY1}px) } 47%, 100% { opacity: 0; transform: translate(${DX1}px, ${DY1}px) }`, "opacity: 0;"),
  r(
    "chip2",
    `0%, 72% { opacity: 0; transform: none } 74% { opacity: 1; transform: none } 78% { opacity: 1; transform: translate(${MX}px, -24px) } 82% { opacity: 1; transform: translate(${MX}px, ${DY2 + 24}px) } 87% { opacity: 1; transform: translate(${DX2}px, ${DY2}px) } 91%, 100% { opacity: 0; transform: translate(${DX2}px, ${DY2}px) }`,
    "opacity: 0;",
  ),
].join(" ");

// Graph: origin (206, 146), 14 px per unit.
const GX = (x: number) => 206 + 14 * x;
const GY = (y: number) => 146 - 14 * y;

const tex = (x: number, y: number, s: string, color: string = C.ink) => (
  <Tex x={x} y={y} size={SZ} anchor="start" width={170} color={color}>
    {s}
  </Tex>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* y = 2x */}
      <g className={cls("hl")}>
        <rect x={X0 - 3} y={R1 - 14} width={17} height={26} rx={5} fill="none" stroke={C.primary} strokeWidth={1.5} />
        <rect x={landX - 3} y={R2 - 14} width={17} height={26} rx={5} fill="none" stroke={C.primary} strokeWidth={1.5} />
      </g>
      <g>{tex(X0, R1, String.raw`y=2x`)}</g>

      {/* 3x + y = 10, then 3x + (2x) = 10 */}
      <g className={cls("rowa")}>{tex(X0, R2, String.raw`3x+y=10`)}</g>
      <g className={cls("rowb")}>
        {tex(X0, R2, String.raw`3x+{}`)}
        {tex(landX, R2, String.raw`(2x)`, C.primaryText)}
        {tex(landX + wd("(2x)"), R2, String.raw`{}=10`)}
      </g>

      {/* The chip that carries 2x across */}
      <g className={cls("chip")}>
        <rect x={chipX - 3} y={R1 - 14} width={wd("(2x)") + 6} height={27} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        {tex(chipX, R1, String.raw`(2x)`, C.primaryText)}
      </g>
      <text className={cls("swap")} x={100} y={47} fontSize={12} fontWeight={700} fill={C.primaryText} stroke="none">
        swap in
      </text>

      {/* 5x = 10, x = 2 */}
      <g className={cls("c3")}>{tex(X0, R3, String.raw`5x=10`)}</g>
      <g className={cls("c4")}>{tex(X0, R4, String.raw`x=2`)}</g>
      <g className={cls("c4g")}>{tex(X0, R4, String.raw`x=2`, C.good)}</g>

      {/* 2 goes back into y = 2x */}
      <g className={cls("chip2")}>
        <rect x={X0 + wd("x=") - 3} y={R4 - 14} width={wd("2") + 6} height={27} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        {tex(X0 + wd("x="), R4, String.raw`2`, C.good)}
      </g>
      <g className={cls("c5")}>{tex(X0, R5, String.raw`y=4`, C.good)}</g>

      {/* The tiny graph: the two lines cross at (2, 4) */}
      <g className={cls("graph")}>
        <path d={`M${GX(0)} ${GY(8.4)} V${GY(0)} H${GX(6.6)}`} fill="none" stroke={C.line} strokeWidth={1.5} />
        <line x1={GX(0)} y1={GY(0)} x2={GX(4.1)} y2={GY(8.2)} stroke={C.muted} strokeWidth={2} />
        <line x1={GX(0.6)} y1={GY(8.2)} x2={GX(3.4)} y2={GY(-0.2)} stroke={C.muted} strokeWidth={2} />
        <circle cx={GX(2)} cy={GY(4)} r={5} fill={C.good} stroke={C.bg} strokeWidth={1.5} />
        <text x={GX(2) + 10} y={GY(4) - 4} fontSize={13} fontWeight={700} fill={C.good} stroke="none">
          (2, 4)
        </text>
      </g>
    </Svg>
  );
}
