import { C, Css, Svg, Tex } from "./kit";

// Percent change is change over the OLD value (23 vs 20 is +15%). "p% greater than 50" uses 50 as the base: 200 is 400% of 50 and 300% greater than 50.
export const alt = "From 20 to 23 is a gain of 3, which is 3 over the old 20: 15%. Then 200 against 50: 200 is 400% of 50, but only 300% greater than 50, because the base is the number after the word than.";

const P = "v-percentages--change-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

// Scene 1 (20 to 23) plays first and is hidden in the still frame, which shows scene 2.
const css = `
.${n("a")} { animation: 12s ease-in-out infinite; }
.${n("s1")} { opacity: 0; animation-name: ${n("s1")}; }
@keyframes ${n("s1")} { 0%, 1% { opacity: 0 } 5%, 38% { opacity: 1 } 43%, 100% { opacity: 0 } }
${at("g1", 12)}
${at("f1", 20)}
${at("p1", 30)}
.${n("s2")} { animation-name: ${n("s2")}; }
@keyframes ${n("s2")} { 0%, 42% { opacity: 0 } 47%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }
${at("b2", 52)}
${at("c2", 62)}
${at("sent", 78)}
`;

const BASE_Y = 128;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Scene 1: 20 to 23, the old value is the base */}
      <g className={cls("s1")}>
        <line x1={50} y1={BASE_Y} x2={250} y2={BASE_Y} stroke={C.muted} strokeWidth={1.5} />
        <rect x={80} y={BASE_Y - 60} width={50} height={60} rx={3} fill={C.fill} stroke={C.ink} strokeWidth={2} />
        <rect x={160} y={BASE_Y - 60} width={50} height={60} rx={3} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <g className={cls("g1")}>
          <rect x={160} y={BASE_Y - 69} width={50} height={9} rx={2} fill={C.primary} />
          <line x1={80} y1={BASE_Y - 60} x2={210} y2={BASE_Y - 60} stroke={C.ink} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={216} y={BASE_Y - 62} fontSize={13} fontWeight={700} fill={C.primaryText}>
            +3
          </text>
        </g>
        <text x={105} y={BASE_Y + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
          old 20 (base)
        </text>
        <text x={185} y={BASE_Y + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted}>
          new 23
        </text>
        <g className={cls("f1")}>
          <Tex x={160} y={31} size={13} width={180}>{String.raw`\dfrac{\text{new}-\text{old}}{\text{old}}=\dfrac{23-20}{20}=0.15`}</Tex>
        </g>
        <text className={cls("p1")} x={216} y={BASE_Y - 40} fontSize={14} fontWeight={700} fill={C.good}>
          15%
        </text>
      </g>

      {/* Scene 2: 200 against 50 (the still frame) */}
      <g className={cls("s2")}>
        <line x1={40} y1={BASE_Y} x2={280} y2={BASE_Y} stroke={C.muted} strokeWidth={1.5} />
        {/* base: 50 */}
        <rect x={80} y={BASE_Y - 20} width={44} height={20} rx={2} fill={C.fill} stroke={C.ink} strokeWidth={2} />
        <text x={102} y={BASE_Y + 15} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
          50 (base)
        </text>
        {/* 200 = four blocks of 50 */}
        <rect x={170} y={BASE_Y - 20} width={44} height={20} fill={C.fill} stroke={C.ink} strokeWidth={2} />
        <rect x={170} y={BASE_Y - 80} width={44} height={60} fill={C.primary} stroke={C.ink} strokeWidth={1.5} />
        <path d={`M170 ${BASE_Y - 40} H214 M170 ${BASE_Y - 60} H214`} stroke={C.ink} strokeWidth={1} />
        <text x={192} y={BASE_Y + 15} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          200
        </text>
        <line x1={124} y1={BASE_Y - 20} x2={214} y2={BASE_Y - 20} stroke={C.ink} strokeWidth={1.5} strokeDasharray="4 3" />

        {/* 400% of 50: the whole tall bar */}
        <g className={cls("b2")}>
          <path d={`M222 ${BASE_Y - 80} H227 V${BASE_Y} H222`} fill="none" stroke={C.ink} strokeWidth={1.5} />
          <text x={233} y={BASE_Y - 36} fontSize={12} fontWeight={700} fill={C.ink}>
            400%
          </text>
          <text x={233} y={BASE_Y - 22} fontSize={12} fontWeight={700} fill={C.ink}>
            of 50
          </text>
        </g>
        {/* 300% greater than 50: only the extra three blocks */}
        <g className={cls("c2")}>
          <path d={`M162 ${BASE_Y - 80} H157 V${BASE_Y - 20} H162`} fill="none" stroke={C.primaryText} strokeWidth={2} />
          <text x={152} y={BASE_Y - 58} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primaryText}>
            300%
          </text>
          <text x={152} y={BASE_Y - 44} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primaryText}>
            greater than
          </text>
        </g>
        <text className={cls("sent")} x={160} y={160} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.ink}>
          200 is p% greater <tspan fontWeight={700} fill={C.primaryText}>than 50</tspan>
        </text>
      </g>
    </Svg>
  );
}
