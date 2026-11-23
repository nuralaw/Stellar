import { C, Css, Svg } from "./kit";

// One part's job: the underlined sentence contrasts with the one before and is the reason for the one after.
export const alt =
  "Three sentences about coral reefs. The underlined middle one contrasts with the sentence before it and is the reason for the nickname after it; the verdict card names that job.";

const P = "v-text-structure-purpose--neighbors-";
const k = (n: string) => P + n;
const cls = (n: string) => `${k("a")} ${k(n)}`;

const show = (n: string, t: number) => `.${k(n)} { animation-name: ${k(n)}; }
@keyframes ${k(n)} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const draw = (n: string, t: number, d: number) => `.${k(n)} { stroke-dasharray: 100; animation-name: ${k(n)}; }
@keyframes ${k(n)} { 0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 } }`;
const mark = (n: string, t: number) => `.${k(n)} { animation-name: ${k(n)}; }
@keyframes ${k(n)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 } }`;

const css = `
.${k("a")} { animation: 10s ease-in-out infinite; }
.${k("scene")} { animation-name: ${k("scene")}; }
@keyframes ${k("scene")} { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("b1", 4)}
${show("b2", 10)}
${show("b3", 16)}
${draw("under", 24, 8)}
.${k("b2box")} { fill: ${C.soft}; stroke: ${C.primary}; animation-name: ${k("b2box")}; }
@keyframes ${k("b2box")} { 0%, 26% { fill: ${C.fill}; stroke: ${C.line} } 32%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.${k("pulse")} { transform-box: fill-box; transform-origin: center; animation-name: ${k("pulse")}; }
@keyframes ${k("pulse")} { 0%, 30% { transform: scale(1) } 35% { transform: scale(1.03) } 40%, 100% { transform: scale(1) } }
${draw("arr1", 42, 8)}
${mark("hd1", 48)}
${show("lab1", 46)}
${draw("arr2", 56, 8)}
${mark("hd2", 62)}
${show("lab2", 60)}
.${k("card")} { animation-name: ${k("card")}; }
@keyframes ${k("card")} { 0%, 70% { opacity: 0; transform: translateY(-8px) } 78%, 100% { opacity: 1; transform: none } }
`;

/** A small muted caption above a block. */
function Cap({ y, word, accent }: { y: number; word: string; accent?: boolean }) {
  return (
    <text x={16} y={y} fontSize={11} fontWeight={700} fill={accent ? C.primaryText : C.muted}>
      {word}
    </text>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* Before */}
        <g className={cls("b1")}>
          <Cap y={20} word="before" />
          <rect x={16} y={24} width={288} height={22} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={26} y={39} fontSize={12} fontWeight={600} fill={C.ink}>
            Reefs cover under 1% of the ocean floor.
          </text>
        </g>

        {/* The underlined part */}
        <g className={cls("b2")}>
          <Cap y={62} word="underlined" accent />
          <g className={cls("pulse")}>
            <rect className={cls("b2box")} x={16} y={68} width={288} height={22} rx={8} strokeWidth={1.5} />
            <text x={26} y={83} fontSize={12} fontWeight={700} fill={C.ink}>
              Yet a quarter of sea species live there.
            </text>
          </g>
        </g>
        <path className={cls("under")} d="M26 86.5 H244" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />

        {/* After */}
        <g className={cls("b3")}>
          <Cap y={106} word="after" />
          <rect x={16} y={112} width={288} height={22} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={26} y={127} fontSize={12} fontWeight={600} fill={C.ink}>
            So reefs are called the sea&apos;s rainforests.
          </text>
        </g>

        {/* Arrow 1: before -> underlined */}
        <path className={cls("arr1")} d="M262 48 V66" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <path className={cls("hd1")} d="M257 61 L262 67 L267 61" fill="none" stroke={C.primary} strokeWidth={2} />
        <g className={cls("lab1")}>
          <text x={252} y={62} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primaryText}>
            contrast
          </text>
        </g>

        {/* Arrow 2: underlined -> after */}
        <path className={cls("arr2")} d="M262 92 V110" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <path className={cls("hd2")} d="M257 105 L262 111 L267 105" fill="none" stroke={C.primary} strokeWidth={2} />
        <g className={cls("lab2")}>
          <text x={252} y={106} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primaryText}>
            reason
          </text>
        </g>

        {/* Verdict */}
        <g className={cls("card")}>
          <rect x={16} y={142} width={288} height={22} rx={11} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={160} y={157} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            Job: a contrast that explains the nickname
          </text>
        </g>
      </g>
    </Svg>
  );
}
