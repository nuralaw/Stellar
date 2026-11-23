import { C, Css, Svg } from "./kit";

// Main purpose: label each sentence's job, find the turn word, then name the job of the whole text.
export const alt =
  "Two sentences: a common belief about taste zones, then Actually and the evidence against it. The turn word lights up and the purpose card reads: To correct a common belief about taste.";

const P = "v-text-structure-purpose--turn-";
const k = (n: string) => P + n;
const cls = (n: string) => `${k("a")} ${k(n)}`;

const show = (n: string, t: number, from = "translateY(5px)") => `.${k(n)} { animation-name: ${k(n)}; }
@keyframes ${k(n)} { 0%, ${t}% { opacity: 0; transform: ${from} } ${t + 6}%, 100% { opacity: 1; transform: none } }`;

const css = `
.${k("a")} { animation: 10s ease-in-out infinite; }
.${k("scene")} { animation-name: ${k("scene")}; }
@keyframes ${k("scene")} { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("s1", 4)}
${show("tag1", 12, "translateX(-8px)")}
${show("s2", 20)}
${show("lab", 36)}
${show("tag2", 42, "translateX(-8px)")}
${show("note", 78)}

/* The turn word lights up and pulses */
.${k("word")} { fill: ${C.primaryText}; animation-name: ${k("word")}; }
@keyframes ${k("word")} { 0%, 28% { fill: ${C.ink} } 33%, 100% { fill: ${C.primaryText} } }
.${k("glow")} { transform-box: fill-box; transform-origin: center; animation-name: ${k("glow")}; }
@keyframes ${k("glow")} { 0%, 28% { opacity: 0; transform: scale(0.9) } 34% { opacity: 1; transform: scale(1.1) } 40%, 100% { opacity: 1; transform: scale(1) } }

/* The swing arrow draws between the blocks */
.${k("swing")} { stroke-dasharray: 100; animation-name: ${k("swing")}; }
@keyframes ${k("swing")} { 0%, 31% { stroke-dashoffset: 100 } 40%, 100% { stroke-dashoffset: 0 } }
.${k("head")} { animation-name: ${k("head")}; }
@keyframes ${k("head")} { 0%, 38% { opacity: 0 } 42%, 100% { opacity: 1 } }

/* Sentence 2 becomes the accent block */
.${k("b2")} { fill: ${C.soft}; stroke: ${C.primary}; animation-name: ${k("b2")}; }
@keyframes ${k("b2")} { 0%, 40% { fill: ${C.fill}; stroke: ${C.line} } 46%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }

/* Both blocks feed the purpose card */
.${k("feed")} { stroke-dasharray: 100; animation-name: ${k("feed")}; }
@keyframes ${k("feed")} { 0%, 58% { stroke-dashoffset: 100 } 68%, 100% { stroke-dashoffset: 0 } }
.${k("fhead")} { animation-name: ${k("fhead")}; }
@keyframes ${k("fhead")} { 0%, 66% { opacity: 0 } 70%, 100% { opacity: 1 } }
.${k("card")} { animation-name: ${k("card")}; }
@keyframes ${k("card")} { 0%, 54% { opacity: 0; transform: translateY(-10px) } 62% { opacity: 1; transform: none } 100% { opacity: 1; transform: none } }
.${k("pulse")} { transform-box: fill-box; transform-origin: center; animation-name: ${k("pulse")}; }
@keyframes ${k("pulse")} { 0%, 66% { transform: scale(1) } 72% { transform: scale(1.04) } 78%, 100% { transform: scale(1) } }
`;

/** A small label sitting on a block's top edge. */
function Tag({ x, y, w, word, accent }: { x: number; y: number; w: number; word: string; accent?: boolean }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={16} rx={8} fill={accent ? C.soft : C.bg} stroke={accent ? C.primary : C.muted} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={accent ? C.primaryText : C.ink} stroke="none">
        {word}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* Sentence 1: the common belief (muted) */}
        <g className={cls("s1")}>
          <rect x={16} y={20} width={276} height={38} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={26} y={38} fontSize={12.5} fontWeight={600} fill={C.muted}>
            Most people think the tongue has
          </text>
          <text x={26} y={52} fontSize={12.5} fontWeight={600} fill={C.muted}>
            separate zones for taste.
          </text>
        </g>
        <g className={cls("tag1")}>
          <Tag x={26} y={11} w={104} word="common belief" />
        </g>

        {/* The turn: a swing arrow from block 1 to block 2 */}
        <path className={cls("swing")} d="M262 59 C 292 63, 292 73, 264 77" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <path className={cls("head")} d="M270 73 L263 77 L270 81" fill="none" stroke={C.primary} strokeWidth={2} />
        <g className={cls("lab")}>
          <text x={246} y={72} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primaryText}>
            turn
          </text>
        </g>

        {/* Sentence 2: the evidence against it (accent) */}
        <g className={cls("s2")}>
          <rect className={cls("b2")} x={16} y={78} width={276} height={38} rx={8} strokeWidth={1.5} />
          <rect className={cls("glow")} x={23} y={86} width={56} height={14} rx={4} fill={C.soft} />
          <text x={26} y={97} fontSize={12.5} fontWeight={700} fill={C.ink}>
            <tspan className={cls("word")}>Actually,</tspan> researchers have shown that
          </text>
          <text x={26} y={111} fontSize={12.5} fontWeight={700} fill={C.ink}>
            every part can sense every taste.
          </text>
        </g>
        <g className={cls("tag2")}>
          <Tag x={26} y={70} w={134} word="evidence against it" accent />
        </g>

        {/* Both blocks feed the purpose card */}
        <path className={cls("feed")} d="M292 39 H302 V136 H294" pathLength={100} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <path className={cls("feed")} d="M292 97 H302" pathLength={100} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <path className={cls("fhead")} d="M299 132 L293 136 L299 140" fill="none" stroke={C.muted} strokeWidth={1.5} />
        <g className={cls("card")}>
          <g className={cls("pulse")}>
            <rect x={16} y={124} width={276} height={24} rx={12} fill={C.soft} stroke={C.primary} strokeWidth={2} />
            <text x={154} y={140.5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={C.primaryText}>
              Purpose: To correct a common belief
            </text>
          </g>
        </g>

        <g className={cls("note")}>
          <text x={154} y={164} textAnchor="middle" fontSize={11} fill={C.muted}>
            In fact = emphasis, not a turn
          </text>
        </g>
      </g>
    </Svg>
  );
}
