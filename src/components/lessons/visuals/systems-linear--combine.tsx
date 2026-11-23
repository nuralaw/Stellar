import { C, Css, Svg, Tex } from "./kit";

// When the question asks for x + y, add the two equations whole and divide: no need to find x and y separately.
export const alt =
  "Question: x + y = ? The equations 4x + 5y = 100 and 5x + 4y = 62 are added to 9x + 9y = 162, then divided by 9 to give x + y = 18. Subtracting instead gives -x + y = 38, not what is asked.";

const P = "v-systems-linear--combine-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fade in at t% (rising dy px), stay until `until`% (default: the end of the loop), then fade out. Hidden in the still frame when until < 90. */
const show = (n: string, t: number, until = 90, dy = 0) =>
  r(
    n,
    `0%, ${t}% { opacity: 0; transform: translateY(${dy}px) } ${t + 5}%, ${until}% { opacity: 1; transform: none } ${until + (until >= 90 ? 7 : 4)}%, 100% { opacity: 0; transform: none }`,
    until < 90 ? "opacity: 0;" : "",
  );
const css = [
  `.${a} { animation: 11s ease-in-out infinite; }`,
  show("eq", 4),
  show("tag", 4),
  show("inkl", 4, 22),
  show("hot", 20),
  show("plus", 28),
  show("sum", 38, 90, -14),
  show("div", 52),
  show("res", 58, 90, -8),
  show("sub", 72),
].join(" ");

const SZ = 20;
const X0 = 32;
const EM: Record<string, number> = { x: 0.578, y: 0.489, "+": 1.222 };
const wd = (s: string) => [...s].reduce((n, c) => n + (EM[c] ?? 0.5), 0) * SZ;
const R1 = 30;
const R2 = 60;
const R3 = 104;
const R4 = 142;

const tex = (x: number, y: number, s: string, color: string = C.ink, size = SZ) => (
  <Tex x={x} y={y} size={size} anchor="start" width={150} color={color}>
    {s}
  </Tex>
);

export default function Visual() {
  const lw = wd("4x+5y");
  const rw = wd("x+y");
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The two equations; the left sides turn orange when they are added */}
      <g className={cls("inkl")}>
        {tex(X0, R1, String.raw`4x+5y`)}
        {tex(X0, R2, String.raw`5x+4y`)}
      </g>
      <g className={cls("hot")}>
        {tex(X0, R1, String.raw`4x+5y`, C.primaryText)}
        {tex(X0, R2, String.raw`5x+4y`, C.primaryText)}
      </g>
      <g className={cls("eq")}>
        {tex(X0 + lw, R1, String.raw`{}=100`)}
        {tex(X0 + lw, R2, String.raw`{}=62`)}
      </g>

      {/* The question tag */}
      <g className={cls("tag")}>
        <rect x={200} y={16} width={112} height={36} rx={10} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <Tex x={256} y={34} size={20} color={C.primaryText} width={108}>
          {String.raw`x+y=\,?`}
        </Tex>
        <text x={256} y={72} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          Read the question
        </text>
        <text x={256} y={87} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          first
        </text>
      </g>

      {/* Add the two equations */}
      <g className={cls("plus")}>
        <text x={14} y={R2 + 6} fontSize={22} fontWeight={700} fill={C.muted} stroke="none">
          +
        </text>
        <line x1={14} y1={80} x2={176} y2={80} stroke={C.muted} strokeWidth={1.5} />
      </g>
      <g className={cls("sum")}>
        {tex(X0, R3, String.raw`9x+9y`, C.primaryText)}
        {tex(X0 + lw, R3, String.raw`{}=162`)}
      </g>

      {/* Divide by 9 */}
      <g className={cls("div")}>
        <rect x={162} y={R3 + 7} width={56} height={26} rx={13} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <Tex x={190} y={R3 + 20} size={16} color={C.primaryText} width={54}>
          {String.raw`\div 9`}
        </Tex>
      </g>
      <g className={cls("res")}>
        {tex(X0, R4, String.raw`x+y`, C.good)}
        {tex(X0 + rw, R4, String.raw`{}=18`, C.good)}
      </g>

      {/* Subtracting also works when it gives what is asked: here it does not */}
      <g className={cls("sub")}>
        <text x={256} y={124} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
          or subtract
        </text>
        <Tex x={256} y={146} size={18} color={C.muted} width={108}>
          {String.raw`-x+y=38`}
        </Tex>
      </g>
    </Svg>
  );
}
