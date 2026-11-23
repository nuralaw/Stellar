import { C, Css, Svg } from "./kit";

// Command of evidence (quantitative), "Two parts, two groups": a claim with two parts needs a choice that proves both parts, for both groups.
export const alt = "A claim splits into two locks. One part leaves a lock red; Aero only has nothing to compare; both bikes and both numbers open both locks.";

const P = "v-command-of-evidence-quantitative--two-parts-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const r = (n: string, body: string) => `.${P}${n} { ${body} }`;
const kf = (n: string, body: string) => `@keyframes ${P}${n} { ${body} }`;

const show = (n: string, t: number) => r(n, `animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 5}%, 100% { opacity: 1; transform: none }`);
const draw = (n: string, t: number, d = 6) => r(n, `stroke-dasharray: 100; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 0.5}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 100% { stroke-dashoffset: 0; opacity: 1 }`);
/** Visible only between a% and b% (a moment of attention); hidden in the final frame. */
const win = (n: string, a: number, b: number) => r(n, `opacity: 0; animation-name: ${P}${n};`) + kf(n, `0%, ${a}% { opacity: 0 } ${a + 2}%, ${b}% { opacity: 1 } ${b + 2}%, 100% { opacity: 0 }`);
const dim = (n: string, t: number) => r(n, `opacity: 0.45; animation-name: ${P}${n};`) + kf(n, `0%, ${t}% { opacity: 1 } ${t + 5}%, 100% { opacity: 0.45 }`);

const NEU = { fill: C.fill, stroke: C.line };
const GOOD = { fill: C.goodSoft, stroke: C.good };
const BAD = { fill: C.badSoft, stroke: C.bad };
const AMB = { fill: C.soft, stroke: C.primary };
type S = { fill: string; stroke: string };
/** A lock piece changes colour through a list of [from%, state] steps; the last state is the final frame. */
const steps = (n: string, list: [number, S][]) => {
  const last = list[list.length - 1][1];
  const frames = list.map(([t, s], i) => `${i === 0 ? `0%, ${t}%` : `${t}%`} { fill: ${s.fill}; stroke: ${s.stroke} }`).join(" ");
  return r(n, `fill: ${last.fill}; stroke: ${last.stroke}; animation-name: ${P}${n};`) + kf(n, `${frames} 100% { fill: ${last.fill}; stroke: ${last.stroke} }`);
};
const keySteps = (n: string, list: [number, S][]) => {
  const last = list[list.length - 1][1];
  const frames = list.map(([t, s], i) => `${i === 0 ? `0%, ${t}%` : `${t}%`} { stroke: ${s.stroke} }`).join(" ");
  return r(n, `stroke: ${last.stroke}; animation-name: ${P}${n};`) + kf(n, `${frames} 100% { stroke: ${last.stroke} }`);
};

const L1: [number, S][] = [[34, NEU], [38, GOOD], [50, GOOD], [54, AMB], [62, AMB], [68, GOOD]];
const L2: [number, S][] = [[34, NEU], [38, BAD], [50, BAD], [54, AMB], [62, AMB], [68, GOOD]];

const css = [
  r("a", "animation: 10s ease-in-out infinite;"),
  r("scene", `animation-name: ${P}scene;`),
  kf("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  show("claim", 4),
  show("locks", 12),
  steps("l1", L1),
  steps("l2", L2),
  keySteps("k1", L1),
  keySteps("k2", L2),
  r("open", `transform: translateY(-3px); animation-name: ${P}open;`),
  kf("open", "0%, 66% { transform: none } 72%, 100% { transform: translateY(-3px) }"),
  show("cards", 24),
  win("hA", 36, 50),
  win("hB", 52, 62),
  dim("dA", 50),
  dim("dB", 62),
  win("thalf", 38, 50),
  win("tnone", 54, 62),
  r("ok", `fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: ${P}ok;`),
  kf("ok", `0%, 64% { fill: ${C.fill}; stroke: ${C.line} } 70%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }`),
  show("tbl", 72),
  draw("up", 78, 5),
  draw("dn", 80, 5),
  show("leg", 82),
].join("\n");

function T({ x, y, t, color = C.ink, w = 700, size = 11.5, anchor = "start" }: { x: number; y: number; t: string; color?: string; w?: number; size?: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={w} fill={color}>
      {t}
    </text>
  );
}

function Lock({ x, part, word, c, k }: { x: number; part: string; word: string; c: string; k: string }) {
  return (
    <>
      <rect className={cls("a", c)} x={x} y={24} width={136} height={30} rx={9} strokeWidth={1.5} />
      <g transform={`translate(${x + 11} ${31})`}>
        <g className={cls("a", "open")}>
          <path d="M2.5 8 V5 a3.5 3.5 0 0 1 7 0 V8" stroke={C.ink} strokeWidth={1.8} fill="none" />
        </g>
        <rect x={0} y={8} width={12} height={9} rx={2} fill={C.ink} />
      </g>
      <T x={x + 32} y={36} t={part} color={C.muted} size={11} />
      <T x={x + 32} y={49} t={word} />
      <g transform={`translate(${x + 108} ${39})`}>
        <circle className={cls("a", k)} cx={0} cy={0} r={4} fill="none" strokeWidth={1.8} />
        <path className={cls("a", k)} d="M4 0 H20 M15 0 V4 M19 0 V3" fill="none" strokeWidth={1.8} />
      </g>
    </>
  );
}

function Card({ y, text, c }: { y: number; text: string; c?: string }) {
  return (
    <>
      <rect className={c ? cls("a", c) : undefined} x={16} y={y} width={176} height={22} rx={11} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <T x={28} y={y + 15} t={text} />
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        <g className={cls("a", "claim")}>
          <T x={16} y={14} t="Aero goes farther and weighs less than the Trek" size={11.5} />
        </g>
        <g className={cls("a", "locks")}>
          <Lock x={16} part="part 1" word="farther" c="l1" k="k1" />
          <Lock x={168} part="part 2" word="lighter" c="l2" k="k2" />
        </g>

        {/* the choices */}
        <g className={cls("a", "cards")}>
          <g className={cls("a", "dA")}>
            <Card y={78} text="Aero ran 60 km" />
          </g>
          <g className={cls("a", "dB")}>
            <Card y={104} text="Aero: 60 km, 11 kg" />
          </g>
          <Card y={130} text="Aero 60, 11 · Trek 45, 14" c="ok" />
        </g>
        <rect className={cls("a", "hA")} x={16} y={78} width={176} height={22} rx={11} fill="none" stroke={C.primary} strokeWidth={2} />
        <rect className={cls("a", "hB")} x={16} y={104} width={176} height={22} rx={11} fill="none" stroke={C.primary} strokeWidth={2} />
        <g className={cls("a", "thalf")}>
          <T x={160} y={70} t="half the claim" color={C.bad} anchor="middle" size={11} />
        </g>
        <g className={cls("a", "tnone")}>
          <T x={160} y={70} t="nothing to compare" color={C.primaryText} anchor="middle" size={11} />
        </g>

        {/* the data, with the two directions */}
        <g className={cls("a", "tbl")}>
          <rect x={200} y={78} width={104} height={18} rx={4} fill={C.fill} />
          <T x={248} y={91} t="km" size={11} anchor="middle" />
          <T x={281} y={91} t="kg" size={11} anchor="middle" />
          <path d="M200 114 H304 M200 132 H304" stroke={C.line} strokeWidth={1} fill="none" />
          <T x={204} y={110} t="Aero" size={11} w={600} />
          <T x={254} y={110} t="60" size={11} w={600} anchor="middle" />
          <T x={287} y={110} t="11" size={11} w={600} anchor="middle" />
          <T x={204} y={128} t="Trek" size={11} w={600} />
          <T x={254} y={128} t="45" size={11} w={600} anchor="middle" />
          <T x={287} y={128} t="14" size={11} w={600} anchor="middle" />
        </g>
        <path className={cls("a", "up")} d="M264 94 V80 M260 84 L264 79 L268 84" pathLength={100} stroke={C.primary} strokeWidth={2} fill="none" />
        <path className={cls("a", "dn")} d="M297 80 V94 M293 90 L297 95 L301 90" pathLength={100} stroke={C.good} strokeWidth={2} fill="none" />
        <g className={cls("a", "leg")}>
          <T x={204} y={150} t="range up" color={C.primaryText} size={11} />
          <T x={204} y={165} t="weight down" color={C.good} size={11} />
        </g>
      </g>
    </Svg>
  );
}
