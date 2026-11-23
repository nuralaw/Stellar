import { C, Css, Svg, Tex } from "./kit";

// Word cues become symbols and shapes: "more than" is an open circle, "at least" a closed one, "between" a bar.
export const alt =
  "On a number line: more than 4 is an open circle and an arrow right, at least 4 a closed one, at most 7 a closed circle with an arrow left, between 4 and 7 a bar.";

const P = "v-linear-inequalities--words-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fade in at t%, stay until `until`% (default: the end of the loop), then fade out. Hidden in the still frame when until < 90. */
const show = (n: string, t: number, until = 90) =>
  r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, ${until}% { opacity: 1 } ${until + (until >= 90 ? 7 : 4)}%, 100% { opacity: 0 }`, until < 90 ? "opacity: 0;" : "");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  show("axis", 3),
  show("w1", 6, 25),
  show("s1", 8, 25),
  show("open4", 6, 25),
  show("rayR", 8, 45),
  show("w2", 25, 45),
  show("s2", 27, 45),
  show("fill4", 25, 45),
  show("w3", 45, 65),
  show("s3", 47, 65),
  show("ray7", 45, 65),
  show("w4", 65),
  show("s4a", 67, 79),
  show("s4b", 79),
  show("bar", 65),
  show("open47", 65, 79),
  show("fill47", 79),
].join(" ");

const NY = 120;
const NX = (n: number) => 30 + 26 * n;
const open = (n: number, cn: string) => <circle className={cls(cn)} cx={NX(n)} cy={NY} r={7} fill={C.bg} stroke={C.primary} strokeWidth={3} />;
const closed = (n: number, cn: string) => <circle className={cls(cn)} cx={NX(n)} cy={NY} r={7} fill={C.primary} stroke={C.primary} strokeWidth={3} />;
const word = (cn: string, head: string, n: string) => (
  <text className={cls(cn)} x={160} y={36} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.ink} stroke="none">
    {head} <tspan fill={C.primaryText}>{n}</tspan>
  </text>
);
const sym = (cn: string, s: string) => (
  <g className={cls(cn)}>
    <Tex x={160} y={72} size={24} color={C.primaryText} width={160}>
      {s}
    </Tex>
  </g>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The number line, 0 to 10 */}
      <g className={cls("axis")}>
        <line x1={NX(-0.4)} y1={NY} x2={NX(10.4)} y2={NY} stroke={C.muted} strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <g key={n}>
            <line x1={NX(n)} y1={NY - 5} x2={NX(n)} y2={NY + 5} stroke={C.muted} strokeWidth={1.5} />
            <text x={NX(n)} y={NY + 24} textAnchor="middle" fontSize={12} fontWeight={n === 4 || n === 7 ? 700 : 500} fill={n === 4 || n === 7 ? C.ink : C.muted} stroke="none">
              {n}
            </text>
          </g>
        ))}
      </g>

      {/* more than 4 / at least 4 */}
      {word("w1", "more than", "4")}
      {sym("s1", String.raw`x>4`)}
      {word("w2", "at least", "4")}
      {sym("s2", String.raw`x\ge 4`)}
      <g className={cls("rayR")}>
        <line x1={NX(4)} y1={NY} x2={NX(10.2)} y2={NY} stroke={C.primary} strokeWidth={5} />
        <polygon points={`${NX(10.5)},${NY} ${NX(10.1)},${NY - 7} ${NX(10.1)},${NY + 7}`} fill={C.primary} stroke={C.primary} strokeWidth={1} />
      </g>
      {open(4, "open4")}
      {closed(4, "fill4")}

      {/* at most 7 */}
      {word("w3", "at most", "7")}
      {sym("s3", String.raw`x\le 7`)}
      <g className={cls("ray7")}>
        <line x1={NX(7)} y1={NY} x2={NX(-0.2)} y2={NY} stroke={C.primary} strokeWidth={5} />
        <polygon points={`${NX(-0.5)},${NY} ${NX(-0.1)},${NY - 7} ${NX(-0.1)},${NY + 7}`} fill={C.primary} stroke={C.primary} strokeWidth={1} />
        <circle cx={NX(7)} cy={NY} r={7} fill={C.primary} stroke={C.primary} strokeWidth={3} />
      </g>

      {/* between 4 and 7 */}
      <text className={cls("w4")} x={160} y={36} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.ink} stroke="none">
        between <tspan fill={C.primaryText}>4</tspan> and <tspan fill={C.primaryText}>7</tspan>
      </text>
      {sym("s4a", String.raw`4<x<7`)}
      {sym("s4b", String.raw`4\le x\le 7`)}
      <line className={cls("bar")} x1={NX(4)} y1={NY} x2={NX(7)} y2={NY} stroke={C.primary} strokeWidth={5} />
      {open(4, "open47")}
      {open(7, "open47")}
      {closed(4, "fill47")}
      {closed(7, "fill47")}
    </Svg>
  );
}
