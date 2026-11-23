import { C, Css, Svg, Tex } from "./kit";

// Part and whole: the bar is the whole (100%). part = p/100 × whole, so 20 of 80 is 25%, 18 is 30% of 60, and a part can pass 100%.
export const alt = "A bar for the whole, 80, with a shaded part of 20: 20 out of 80 is 25%. Then 18 is 30% of a whole of 60, and a part of 140% sticks out past the end of the whole.";

const P = "v-percentages--part-whole-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const grow = (k: string, t: number, d: number) => `.${n(k)} { transform-box: fill-box; transform-origin: left center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleX(0) } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

// Case 1 is the still frame. Cases 2 and 3 only show in their own window.
const css = `
.${n("a")} { animation: 12s ease-in-out infinite; }
.${n("c1")} { animation-name: ${n("c1")}; }
@keyframes ${n("c1")} { 0% { opacity: 0 } 3%, 33% { opacity: 1 } 37%, 100% { opacity: 0 } }
.${n("c2")} { opacity: 0; animation-name: ${n("c2")}; }
@keyframes ${n("c2")} { 0%, 35% { opacity: 0 } 39%, 62% { opacity: 1 } 66%, 100% { opacity: 0 } }
.${n("c3")} { opacity: 0; animation-name: ${n("c3")}; }
@keyframes ${n("c3")} { 0%, 65% { opacity: 0 } 69%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }
${grow("p1", 8, 8)}
${at("q1", 15)}
${at("e1", 21)}
${at("e1b", 27)}
${at("t1", 28)}
${grow("p2", 40, 6)}
${at("q2", 43)}
${at("e2", 48)}
${at("e2b", 54)}
${at("w2", 56)}
.${n("wq")} { opacity: 0; animation-name: ${n("wq")}; }
@keyframes ${n("wq")} { 0%, 38% { opacity: 0 } 42%, 56% { opacity: 1 } 59%, 100% { opacity: 0 } }
${grow("p3", 70, 8)}
${at("b3", 78)}
${at("cap3", 84)}
.${n("pulse")} { animation-name: ${n("pulse")}; }
@keyframes ${n("pulse")} { 0%, 40% { opacity: 0 } 44%, 50% { opacity: 1 } 53% { opacity: 0.35 } 56%, 60% { opacity: 1 } 62%, 100% { opacity: 0 } }
`;

const X0 = 40;
const W = 240;

function Bar({ y, w, k }: { y: number; w: number; k: string }) {
  const ticks = [0, 25, 50, 75, 100];
  return (
    <>
      <rect x={X0} y={y} width={w} height={26} rx={3} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
      {ticks.map((t) => (
        <g key={`${k}${t}`}>
          <line x1={X0 + (t / 100) * w} y1={y + 26} x2={X0 + (t / 100) * w} y2={y + 32} stroke={C.muted} strokeWidth={1.5} />
          <text x={X0 + (t / 100) * w} y={y + 44} textAnchor="middle" fontSize={11} fill={C.muted}>
            {t}%
          </text>
        </g>
      ))}
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Case 1: 20 is what percent of 80? (the still frame) */}
      <g className={cls("c1")}>
        <Bar y={50} w={W} k="a" />
        <text x={X0 + W} y={42} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink}>
          whole 80
        </text>
        <rect className={cls("p1")} x={X0} y={50} width={60} height={26} rx={3} fill={C.primary} />
        <text className={cls("p1")} x={X0 + 30} y={68} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.onPrimary}>
          20
        </text>
        <text x={X0} y={42} fontSize={12} fontWeight={700} fill={C.primaryText}>
          part
        </text>
        <g className={cls("q1")}>
          <path d={`M${X0} 104 V108 H${X0 + 60} V104`} fill="none" stroke={C.primaryText} strokeWidth={1.5} />
          <text x={X0 + 30} y={121} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>
            25%
          </text>
        </g>
        <g className={cls("e1")}>
          <Tex x={16} y={148} size={12} anchor="start" width={130}>{String.raw`\dfrac{p}{100}\times80=20`}</Tex>
        </g>
        <g className={cls("e1b")}>
          <Tex x={304} y={148} size={12} anchor="end" width={150} color={C.primaryText}>{String.raw`p=\dfrac{20}{80}\times100=25`}</Tex>
        </g>
      </g>

      {/* Case 2: 18 is 30% of what? */}
      <g className={cls("c2")}>
        <Bar y={50} w={W} k="b" />
        <text className={cls("wq")} x={X0 + W} y={42} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink}>
          whole <tspan fill={C.primaryText}>?</tspan>
        </text>
        <rect className={cls("p2")} x={X0} y={50} width={0.3 * W} height={26} rx={3} fill={C.primary} />
        <text className={cls("p2")} x={X0 + 0.15 * W} y={68} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.onPrimary}>
          18
        </text>
        <text x={X0} y={42} fontSize={12} fontWeight={700} fill={C.primaryText}>
          part
        </text>
        <g className={cls("q2")}>
          <path d={`M${X0} 104 V108 H${X0 + 0.3 * W} V104`} fill="none" stroke={C.primaryText} strokeWidth={1.5} />
          <text x={X0 + 0.15 * W} y={121} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>
            30%
          </text>
        </g>
        <g className={cls("e2")}>
          <Tex x={16} y={148} size={13} anchor="start" width={110}>{String.raw`0.3w=18`}</Tex>
        </g>
        <g className={cls("e2b")}>
          <Tex x={304} y={148} size={13} anchor="end" width={130} color={C.primaryText}>{String.raw`w=\dfrac{18}{0.3}=60`}</Tex>
        </g>
        <text className={cls("w2")} x={X0 + W} y={42} textAnchor="end" fontSize={12} fontWeight={700} fill={C.good}>
          whole 60
        </text>
        <rect x={X0 + W - 76} y={30} width={80} height={16} className={cls("pulse")} rx={4} fill="none" stroke={C.primary} strokeWidth={1.5} />
      </g>

      {/* Case 3: a part over 100% */}
      <g className={cls("c3")}>
        <rect x={X0} y={46} width={160} height={24} rx={3} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={X0 + 80} y={63} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          whole = 100%
        </text>
        <rect className={cls("p3")} x={X0} y={78} width={224} height={24} rx={3} fill={C.primary} />
        <text className={cls("p3")} x={X0 + 112} y={95} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.onPrimary}>
          part
        </text>
        <line x1={X0 + 160} y1={40} x2={X0 + 160} y2={112} stroke={C.ink} strokeWidth={1.5} strokeDasharray="4 3" />
        <g className={cls("b3")}>
          <path d={`M${X0} 116 V120 H${X0 + 224} V116`} fill="none" stroke={C.primaryText} strokeWidth={1.5} />
          <text x={X0 + 112} y={136} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.primaryText}>
            140%
          </text>
        </g>
        <text className={cls("cap3")} x={160} y={158} textAnchor="middle" fontSize={12} fill={C.muted}>
          over 100%: the part is bigger
        </text>
      </g>
    </Svg>
  );
}
