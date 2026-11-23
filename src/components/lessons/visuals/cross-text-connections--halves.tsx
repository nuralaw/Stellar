import { C, Css, Svg } from "./kit";

// Cross-text connections, "Two halves": a "difference" answer has two halves, each checked against its own text.
export const alt = "Text 1 credits the bike lanes, Text 2 doubts they caused the drop. A choice with both halves true turns green, a swapped one turns red, one good and one bent half is half-right.";

const P = "v-cross-text-connections--halves-";
type Tone = { stroke: string; fill: string };
const G: Tone = { stroke: C.good, fill: C.goodSoft };
const B: Tone = { stroke: C.bad, fill: C.badSoft };

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const win = (n: string, s: number, e: number, hidden = false) => `.${P}${n} { ${hidden ? "opacity: 0; " : ""}animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${s}% { opacity: 0 } ${s + 3}%, ${e}% { opacity: 1 } ${e + 3}%, 100% { opacity: 0 } }`;
/** Lines and boxes start neutral and turn to their verdict colour at t. */
const verdict = (n: string, t: number, to: { stroke: string; fill: string }) => `.${P}${n} { stroke: ${to.stroke}; fill: ${to.fill}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { stroke: ${C.muted}; fill: ${C.fill} } ${t + 5}%, 100% { stroke: ${to.stroke}; fill: ${to.fill} } }`;
const fade = (n: string, t: number) => `.${P}${n} { opacity: 1; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 } }`;

const WIN: [number, number][] = [[6, 38], [41, 61], [64, 88]];
const phaseCss = (k: number, l: Tone, r: Tone) => {
  const [s, e] = WIN[k - 1];
  return `${win(`p${k}`, s, e, k > 1)}
${verdict(`p${k}-b1`, s + 12, l)}
${verdict(`p${k}-b2`, s + 12, r)}
${verdict(`p${k}-l1`, s + 12, { stroke: l.stroke, fill: "none" })}
${verdict(`p${k}-l2`, s + 12, { stroke: r.stroke, fill: "none" })}
${fade(`p${k}-m1`, s + 14)}
${fade(`p${k}-m2`, s + 14)}`;
};

const css = `
.v-cross-text-connections--halves-a { animation: 12s ease-in-out infinite; }
.v-cross-text-connections--halves-scene { animation-name: v-cross-text-connections--halves-scene; }
@keyframes v-cross-text-connections--halves-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("views", 2)}
${show("cap", 30)}
${phaseCss(1, G, G)}
${phaseCss(2, B, B)}
${phaseCss(3, G, B)}
`;

/** Class list of an element of phase k. */
const cx = (k: number, n?: string) => `${P}a ${P}p${k}${n ? `-${n}` : ""}`;

const mk = (ok: boolean, k: number, m: string, x: number) => (
  <g className={cx(k, m)} transform={`translate(${x} 76)`}>
    <circle r={7.5} fill={C.bg} stroke={ok ? C.good : C.bad} strokeWidth={1.5} />
    {ok ? (
      <path d="M-3.5 0.5 L-1 3 L3.5 -3" fill="none" stroke={C.good} strokeWidth={2} />
    ) : (
      <path d="M-3 -3 L3 3 M3 -3 L-3 3" fill="none" stroke={C.bad} strokeWidth={2} />
    )}
  </g>
);

/** One choice card: two halves, each tied to its text by a line. */
function Phase({ k, l, r, left, right, label, labelColor }: { k: number; l: boolean; r: boolean; left: [string, string]; right: [string, string]; label: string; labelColor: string }) {
  return (
    <g className={cx(k)}>
      <path className={cx(k, "l1")} d="M84 66 V88" strokeWidth={2.5} />
      <path className={cx(k, "l2")} d="M236 66 V88" strokeWidth={2.5} />
      <rect className={cx(k, "b1")} x={16} y={88} width={136} height={38} rx={9} strokeWidth={1.5} />
      <rect className={cx(k, "b2")} x={168} y={88} width={136} height={38} rx={9} strokeWidth={1.5} />
      <text fontSize={12} fontWeight={600} fill={C.ink}>
        <tspan x={26} y={104}>{left[0]}</tspan>
        <tspan x={26} y={118}>{left[1]}</tspan>
      </text>
      <text fontSize={12} fontWeight={600} fill={C.ink}>
        <tspan x={178} y={104}>{right[0]}</tspan>
        <tspan x={178} y={118}>{right[1]}</tspan>
      </text>
      {mk(l, k, "m1", 84)}
      {mk(r, k, "m2", 236)}
      <text x={160} y={146} textAnchor="middle" fontSize={13} fontWeight={700} fill={labelColor}>{label}</text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-cross-text-connections--halves-a v-cross-text-connections--halves-scene">
        {/* The two views */}
        <g className="v-cross-text-connections--halves-a v-cross-text-connections--halves-views">
          <rect x={16} y={26} width={136} height={40} rx={9} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <rect x={168} y={26} width={136} height={40} rx={9} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <text fontSize={12} fontWeight={700} fill={C.ink}>
            <tspan x={26} y={46}>credits the</tspan>
            <tspan x={26} y={60}>bike lanes</tspan>
          </text>
          <text fontSize={12} fontWeight={700} fill={C.ink}>
            <tspan x={178} y={46}>doubts the lanes</tspan>
            <tspan x={178} y={60}>caused the drop</tspan>
          </text>
          <rect x={26} y={19} width={46} height={14} rx={7} fill={C.muted} />
          <text x={49} y={29.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>Text 1</text>
          <rect x={178} y={19} width={46} height={14} rx={7} fill={C.muted} />
          <text x={201} y={29.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>Text 2</text>
        </g>

        <Phase k={1} l r left={["Text 1 credits", "the lanes"]} right={["Text 2 doubts they", "caused the drop"]} label="both halves true" labelColor={C.good} />
        <Phase k={2} l={false} r={false} left={["Text 1 doubts the", "drop is real"]} right={["Text 2 credits", "the lanes"]} label="swapped" labelColor={C.bad} />
        <Phase k={3} l r={false} left={["Text 1 credits", "the lanes"]} right={["Text 2 focuses", "only on flaws"]} label="half-right" labelColor={C.primaryText} />

        <g className="v-cross-text-connections--halves-a v-cross-text-connections--halves-cap">
          <text x={160} y={170} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>Both halves true, right owner.</text>
        </g>
      </g>
    </Svg>
  );
}
