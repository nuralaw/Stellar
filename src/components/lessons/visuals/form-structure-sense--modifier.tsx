import { C, Css, Svg } from "./kit";

// An opening phrase describes the subject right after the comma. "3,000 patients" and "a new wing" cannot have been
// founded (red cross, shake, gone); "the clinic" can, so the link turns green and the sentence finishes.
export const alt =
  "The phrase Founded by a retired nurse needs a subject that was founded. 3,000 patients and a new wing are crossed out in red; the clinic fits, the link turns green and the sentence continues.";

const P = "v-form-structure-sense--modifier-";
const A = P + "a";
const cl = (n: string) => `${A} ${P}${n}`;
const hid = P + "hid";
const kf = (n: string, body: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${body} }`;

/** A candidate noun: slides up into the slot at s%, then (if wrong) shakes and leaves, or (if right) stays. */
const candKf = (n: string, s: number, wrong: boolean) =>
  wrong
    ? kf(
        n,
        `0%, ${s}% { opacity: 0; transform: translateY(30px) } ${s + 5}% { opacity: 1; transform: translateY(0) } ${s + 10}% { transform: translateX(0) } ${s + 12}% { transform: translateX(-3px) } ${s + 14}% { transform: translateX(3px) } ${s + 16}% { transform: translateX(-2px) } ${s + 18}%, ${s + 20}% { opacity: 1; transform: translateX(0) } ${s + 24}%, 100% { opacity: 0; transform: translateX(0) }`,
      )
    : kf(n, `0%, ${s}% { opacity: 0; transform: translateY(30px) } ${s + 6}%, 100% { opacity: 1; transform: translateY(0) }`);

const css = `
.${A} { animation: 10s ease-in-out infinite; }
${kf("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }")}
.${P + "hid"} { opacity: 0; }
.${P + "draw"} { stroke-dasharray: 100; stroke-dashoffset: 0; }

${kf("ask", "0%, 4% { opacity: 0 } 10%, 100% { opacity: 1 }")}
${candKf("c1", 10, true)}
${candKf("c2", 34, true)}
${candKf("c3", 58, false)}
${kf("x", "0%, 17% { opacity: 0 } 20%, 33% { opacity: 1 } 36%, 44% { opacity: 0 } 45%, 55% { opacity: 1 } 58%, 100% { opacity: 0 }")}
${kf("ok", "0%, 62% { opacity: 0 } 68%, 100% { opacity: 1 }")}
${kf("okLine", "0%, 62% { stroke-dashoffset: 100 } 68%, 100% { stroke-dashoffset: 0 }")}
${kf("rest", "0%, 70% { opacity: 0; transform: translateX(-6px) } 77%, 100% { opacity: 1; transform: none }")}
`;

const SX = 16; // slot left
const SY = 112;
const SW = 112;
const SH = 30;
const LX = 72; // link x
const word = { fontSize: 13, fontWeight: 700, stroke: "none" } as const;

function Cand({ name, children, mode, cls }: { name: string; children: string; mode: "bad" | "good"; cls: string }) {
  return (
    <g className={`${cl(cls)} ${mode === "bad" ? hid : ""}`}>
      <rect x={SX} y={SY} width={SW} height={SH} rx={15} fill={mode === "bad" ? C.badSoft : C.goodSoft} stroke={mode === "bad" ? C.bad : C.good} strokeWidth={1.5} />
      <text x={SX + SW / 2} y={SY + 20} textAnchor="middle" textLength={name === "a new wing" ? 70 : name === "the clinic" ? 66 : 92} lengthAdjust="spacingAndGlyphs" {...word} fill={mode === "bad" ? C.bad : C.ink}>
        {children}
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cl("scene")}>
        {/* The opening phrase */}
        <rect x={16} y={26} width={196} height={30} rx={9} fill={C.soft} stroke={C.primary} strokeWidth={2} />
        <text x={114} y={46} textAnchor="middle" textLength={172} lengthAdjust="spacingAndGlyphs" {...word} fill={C.ink}>
          Founded by a retired nurse,
        </text>

        {/* The link from the phrase to the subject slot, and its question */}
        <path d={`M ${LX} 57 V ${SY - 2}`} stroke={C.muted} strokeWidth={2} strokeDasharray="3 4" fill="none" />
        <text className={cl("ask")} x={90} y={86} fontSize={12} fontWeight={700} fill={C.primaryText} stroke="none">
          who or what was founded?
        </text>

        {/* The empty slot and the sentence that follows */}
        <rect x={SX} y={SY} width={SW} height={SH} rx={15} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
        <text className={cl("rest")} x={136} y={SY + 20} textLength={150} lengthAdjust="spacingAndGlyphs" {...word} fill={C.ink}>
          treats patients each year.
        </text>

        <Cand name="3,000 patients" mode="bad" cls="c1">
          3,000 patients
        </Cand>
        <Cand name="a new wing" mode="bad" cls="c2">
          a new wing
        </Cand>
        <Cand name="the clinic" mode="good" cls="c3">
          the clinic
        </Cand>

        {/* Red cross on the link while a wrong noun sits in the slot */}
        <g className={`${cl("x")} ${hid}`}>
          <path d={`M ${LX} 57 V ${SY - 2}`} stroke={C.bad} strokeWidth={2} fill="none" />
          <circle cx={LX} cy={86} r={9} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <path d={`M ${LX - 4} 82 L ${LX + 4} 90 M ${LX + 4} 82 L ${LX - 4} 90`} stroke={C.bad} strokeWidth={2} fill="none" />
        </g>

        {/* Green link and check when the right noun fits */}
        <path className={`${cl("okLine")} ${P + "draw"}`} d={`M ${LX} 57 V ${SY - 2}`} pathLength={100} stroke={C.good} strokeWidth={2.5} fill="none" />
        <g className={cl("ok")}>
          <circle cx={LX} cy={86} r={9} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <path d={`M ${LX - 4} 86 L ${LX - 1} 89 L ${LX + 4.5} 82.5`} stroke={C.good} strokeWidth={2} fill="none" />
        </g>
      </g>
    </Svg>
  );
}
