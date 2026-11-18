import { C, Css, Svg } from "./kit";

// Words in context, "How strong is it?": the clue "slightly less pain" is a small effect, so the mild word (eases) fits; eliminates and worsens do not.
export const alt = "A pain scale from more pain to no pain. The clue slightly less pain marks a small band. Worsens and eliminates fall outside it and are rejected; eases falls inside it and locks in.";

const P = "v-words-in-context--strength-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const bad = (n: string, t: number) => `.${P}${n} { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }`;
const mark = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 100% { opacity: 1 } }`;

const css = `
.v-words-in-context--strength-a { animation: 10s ease-in-out infinite; }
.v-words-in-context--strength-scene { animation-name: v-words-in-context--strength-scene; }
@keyframes v-words-in-context--strength-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("clue", 4)}
${show("chips", 14)}
${bad("bw", 34)}
${bad("be", 48)}
${mark("xw", 34)}
${mark("xe", 48)}
.v-words-in-context--strength-ok { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-words-in-context--strength-ok; }
@keyframes v-words-in-context--strength-ok { 0%, 62% { fill: ${C.fill}; stroke: ${C.line} } 68%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
.v-words-in-context--strength-band { animation-name: v-words-in-context--strength-band; }
@keyframes v-words-in-context--strength-band { 0%, 6% { opacity: 0 } 14%, 100% { opacity: 1 } }
`;

const AXIS_Y = 114;

function Chip({ cx, ax = cx, w, word, cls, rejected, xcls }: { cx: number; ax?: number; w: number; word: string; cls: string; rejected?: boolean; xcls?: string }) {
  return (
    <>
      <rect className={`v-words-in-context--strength-a ${cls}`} x={cx - w / 2} y={56} width={w} height={26} rx={13} strokeWidth={1.5} />
      <text x={rejected ? cx - 8 : cx} y={73} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
        {word}
      </text>
      <path d={`M${cx} 82 L${ax} ${AXIS_Y - 5}`} stroke={rejected ? C.bad : C.good} strokeWidth={1.5} fill="none" />
      <circle cx={ax} cy={AXIS_Y} r={5} fill={rejected ? C.badSoft : C.goodSoft} stroke={rejected ? C.bad : C.good} strokeWidth={2} />
      {rejected && xcls && (
        <path className={`v-words-in-context--strength-a ${xcls}`} d={`M${cx + w / 2 - 16} 64 l8 8 m0 -8 l-8 8`} stroke={C.bad} strokeWidth={2} fill="none" />
      )}
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-words-in-context--strength-a v-words-in-context--strength-scene`}>
        <g className={`v-words-in-context--strength-a v-words-in-context--strength-clue`}>
          <text x={160} y={30} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primary}>
            “slightly less pain, none cured”
          </text>
        </g>

        {/* the band the clue allows */}
        <g className={`v-words-in-context--strength-a v-words-in-context--strength-band`}>
          <rect x={122} y={94} width={56} height={40} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={150} y={152} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primary}>
            slightly less
          </text>
        </g>

        <path d={`M24 ${AXIS_Y} H296`} stroke={C.muted} strokeWidth={2} fill="none" />
        <text x={24} y={170} fontSize={11} fill={C.muted}>
          more pain
        </text>
        <text x={296} y={170} textAnchor="end" fontSize={11} fill={C.muted}>
          no pain
        </text>

        <g className={`v-words-in-context--strength-a v-words-in-context--strength-chips`}>
          <Chip cx={62} ax={34} w={92} word="worsens" cls={`v-words-in-context--strength-bw`} rejected xcls={`v-words-in-context--strength-xw`} />
          <Chip cx={150} w={56} word="eases" cls={`v-words-in-context--strength-ok`} />
          <Chip cx={246} ax={288} w={108} word="eliminates" cls={`v-words-in-context--strength-be`} rejected xcls={`v-words-in-context--strength-xe`} />
        </g>
      </g>
    </Svg>
  );
}
