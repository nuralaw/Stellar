import { C, Css, Svg } from "./kit";

// Emphasis: size needs the number, order needs a sequence word, significance needs the note that says why it matters. Each row ticks when its signal lands.
export const alt =
  "Three emphasis goals and their signals: size takes the number 14 meters tall, order takes followed by between 2017 and 2018, significance takes first Croatian woman. Each row ticks when done.";

const P = "v-rhetorical-synthesis--emphasis-";
const rule = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, steps: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${steps} }`;
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const rise = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const fade = (n: string, t: number) => kf(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
/** A chip that lands: slides in from (dx, dy), then glows. */
const land = (n: string, t: number, dx: number, dy: number) =>
  kf(n, `0%, ${t}% { opacity: 0; transform: translate(${dx}px, ${dy}px) } ${t + 7}%, 100% { opacity: 1; transform: none }`);
/** Neutral until t, then the accent. */
const glow = (n: string, t: number) =>
  kf(n, `0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.soft}; stroke: ${C.primary} }`);
const ink = (n: string, t: number) => kf(n, `0%, ${t}% { fill: ${C.muted} } ${t + 5}%, 100% { fill: ${C.ink} }`);
const tick = (n: string, t: number) => kf(n, `0%, ${t}% { stroke: ${C.muted}; fill: none } ${t + 4}%, 100% { stroke: ${C.good}; fill: ${C.goodSoft} }`);

const css = `
${rule("a", "animation: 11s ease-in-out infinite;")}
${kf("scene", `0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 }`)}
${rise("row", 6)}
${land("chip1", 14, 0, 18)}
${glow("chip1Box", 20)}
${ink("txt1", 20)}
${tick("c1", 28)}
${fade("k1", 28)}
${kf("chip2a", `0%, 36% { transform: translateX(30px) } 44%, 100% { transform: none }`)}
${kf("chip2b", `0%, 36% { transform: translateX(-30px) } 44%, 100% { transform: none }`)}
${glow("chip2Box", 40)}
${kf("arrow", `0%, 38% { stroke-dashoffset: 100 } 44%, 100% { stroke-dashoffset: 0 }`)}
${fade("head", 44)}
${fade("label", 42)}
${tick("c2", 50)}
${fade("k2", 50)}
${land("chip3", 56, 0, -12)}
${glow("chip3Box", 60)}
${ink("txt3", 60)}
${kf("star", `0%, 64% { opacity: 0; transform: scale(0.2) } 70% { opacity: 1; transform: scale(1.25) } 74%, 100% { opacity: 1; transform: scale(1) }`)}
${tick("c3", 72)}
${fade("k3", 72)}
`;

const A = "a";
const rowY = (i: number) => 14 + i * 52;
const cy = (i: number) => rowY(i) + 21;

/** A five-pointed star centred on (0, 0). */
const STAR = Array.from({ length: 10 }, (_, k) => {
  const r = k % 2 === 0 ? 9 : 4;
  const a = (Math.PI / 5) * k - Math.PI / 2;
  return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

/** The row frame, its label and its tick circle (green when the signal is in place). */
function Row({ i, label, n }: { i: number; label: string; n: number }) {
  return (
    <g className={cls(A, "row")}>
      <rect x={16} y={rowY(i)} width={288} height={42} rx={10} fill="none" stroke={C.line} strokeWidth={1.5} />
      <circle className={cls(A, `c${n}`)} cx={30} cy={cy(i)} r={7} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
      <path className={cls(A, `k${n}`)} d={`M26.5 ${cy(i)} L29 ${cy(i) + 3} L33.5 ${cy(i) - 3}`} fill="none" stroke={C.good} strokeWidth={1.8} />
      <text x={44} y={cy(i) + 4} fontSize={12} fontWeight={700} fill={C.ink}>
        {label}
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls(A, "scene")}>
        {/* Size: the number slides into the sentence */}
        <Row i={0} label="size" n={1} />
        <text className={cls(A, "txt1")} x={126} y={cy(0) + 4} fontSize={12} fontWeight={600} fill={C.ink}>
          Tide Gate is
        </text>
        <rect x={198} y={cy(0) - 12} width={98} height={24} rx={12} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
        <g className={cls(A, "chip1")}>
          <rect className={cls(A, "chip1Box")} x={198} y={cy(0) - 12} width={98} height={24} rx={12} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={247} y={cy(0) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            14 meters tall
          </text>
        </g>

        {/* Order: two dates snap onto an arrow */}
        <Row i={1} label="order" n={2} />
        <path className={cls(A, "arrow")} d={`M172 ${cy(1) + 4} L250 ${cy(1) + 4}`} pathLength={100} strokeDasharray={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <g className={cls(A, "head")}>
          <path d={`M245 ${cy(1) - 1} L251 ${cy(1) + 4} L245 ${cy(1) + 9}`} fill="none" stroke={C.primary} strokeWidth={2} />
        </g>
        <g className={cls(A, "label")}>
          <text x={211} y={cy(1) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            followed by
          </text>
        </g>
        <g className={cls(A, "chip2a")}>
          <rect className={cls(A, "chip2Box")} x={126} y={cy(1) - 11} width={42} height={22} rx={11} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={147} y={cy(1) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            2017
          </text>
        </g>
        <g className={cls(A, "chip2b")}>
          <rect className={cls(A, "chip2Box")} x={254} y={cy(1) - 11} width={42} height={22} rx={11} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={275} y={cy(1) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            2018
          </text>
        </g>

        {/* Significance: a chip snaps onto a plain fact and a star appears */}
        <Row i={2} label="significance" n={3} />
        <text className={cls(A, "txt3")} x={126} y={cy(2) + 16} fontSize={12} fontWeight={600} fill={C.ink}>
          flew solo in 1987
        </text>
        <g className={cls(A, "chip3")}>
          <rect className={cls(A, "chip3Box")} x={126} y={cy(2) - 17} width={130} height={19} rx={9.5} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={191} y={cy(2) - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            first Croatian woman
          </text>
        </g>
        <g transform={`translate(278 ${cy(2)})`}>
          <polygon className={cls(A, "star")} points={STAR} fill={C.primary} stroke="none" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        </g>
      </g>
    </Svg>
  );
}
