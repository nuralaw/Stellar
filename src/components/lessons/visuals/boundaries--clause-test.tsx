import { C, Css, Svg } from "./kit";

// Clause test: cut the line at the blank, check each side alone for subject + verb, then the verdict.
// A counter-example (a fragment) flashes at the end.
export const alt =
  "A sentence is cut at its blank; each side has a subject and a verb, so both are full sentences. A fragment fails the test.";

const P = "v-boundaries--clause-test-";
const K = (n: string) => P + n;
const A = K("a");
const X0 = 28;
/** Fade (and rise) one element in between a% and b%, then stay. */
const fade = (n: string, a: number, b: number, dy = 4) =>
  `.${K(n)} { animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { opacity: 0; transform: translateY(${dy}px) } ${b}%, 100% { opacity: 1; transform: none } }`;
/** Draw a line (dash offset 100 -> 0). */
const draw = (n: string, a: number, b: number) =>
  `.${K(n)} { stroke-dasharray: 100; animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { stroke-dashoffset: 100 } ${b}%, 100% { stroke-dashoffset: 0 } }`;
/** A little pulse of a tick, centered on itself. */
const pulse = (n: string, a: number) =>
  `.${K(n)} { transform-box: fill-box; transform-origin: center; animation-name: ${K(n)}; }
@keyframes ${K(n)} { 0%, ${a}% { transform: none } ${a + 3}% { transform: scale(1.35) } ${a + 6}%, 100% { transform: none } }`;

const css = `
.${A} { animation: 12s ease-in-out infinite; }
.${K("scene")} { animation-name: ${K("scene")}; }
@keyframes ${K("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* The slot pulses, then the cut line draws through it and the halves slide apart */
.${K("slot")} { opacity: 0; animation-name: ${K("slot")}; }
@keyframes ${K("slot")} { 0%, 5% { opacity: 0 } 9% { opacity: 1 } 12% { opacity: .35 } 15% { opacity: 1 } 18% { opacity: .35 } 21% { opacity: 1 } 24%, 100% { opacity: 0 } }
.${K("cut")} { opacity: 0; animation-name: ${K("cut")}; }
@keyframes ${K("cut")} { 0%, 17% { opacity: 0 } 19%, 25% { opacity: 1 } 31%, 100% { opacity: 0 } }
${draw("cutline", 17, 23)}
.${K("up")} { animation-name: ${K("up")}; }
@keyframes ${K("up")} { 0%, 24% { transform: translateY(24px) } 34%, 100% { transform: none } }
.${K("dn")} { animation-name: ${K("dn")}; }
@keyframes ${K("dn")} { 0%, 24% { transform: translateY(-24px) } 34%, 100% { transform: none } }
${fade("card", 28, 34, 0)}

/* Left side, then right side */
${fade("ls", 36, 40)}
${fade("lv", 42, 46)}
${fade("lk", 48, 52, 0)}
${pulse("lkp", 72)}
${fade("rs", 55, 59)}
${fade("rv", 61, 65)}
${fade("rk", 67, 71, 0)}
${pulse("rkp", 72)}

/* Verdict */
${fade("verdict", 66, 72, 6)}

/* Counter-example: a fragment fails the test */
.${K("frag")} { opacity: 0; animation-name: ${K("frag")}; }
@keyframes ${K("frag")} { 0%, 79% { opacity: 0 } 84%, 100% { opacity: 1 } }
`;

/** One half of the sentence in a card: text, subject underline, verb pill, labels and the verdict tick. */
function Card({
  t,
  text,
  subj,
  verb,
  k,
}: {
  t: number;
  text: string;
  subj: [number, number]; // x and width of the subject word (measured on the rendered text)
  verb: [number, number];
  k: "l" | "r";
}) {
  const b = t + 20; // text baseline
  const [sx, sw] = subj;
  const [vx, vw] = verb;
  return (
    <g>
      <g className={`${A} ${K("card")}`}>
        <rect x={16} y={t} width={288} height={50} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      </g>
      {/* verb pill sits behind the text */}
      <g className={`${A} ${K(k + "v")}`}>
        <rect x={vx - 3} y={b - 14} width={vw + 6} height={20} rx={6} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
      </g>
      <text x={X0} y={b} fontSize={14} fontWeight={600} fill={C.ink}>
        {text}
      </text>
      <g className={`${A} ${K(k + "s")}`}>
        <path d={`M${sx} ${b + 5} H${sx + sw}`} stroke={C.ink} strokeWidth={2.5} fill="none" />
        <text x={sx + sw / 2} y={b + 19} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>
          subject
        </text>
      </g>
      <g className={`${A} ${K(k + "v")}`}>
        <text x={vx + vw / 2} y={b + 19} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.primaryText}>
          verb
        </text>
      </g>
      <g className={`${A} ${K(k + "k")}`}>
        <circle cx={205} cy={b + 15} r={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <path className={`${A} ${K(k + "kp")}`} d={`M${201} ${b + 15} l3 3 l5 -6`} fill="none" stroke={C.good} strokeWidth={2} />
        <text x={218} y={b + 19} fontSize={12} fontWeight={700} fill={C.good}>
          full sentence
        </text>
      </g>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${K("scene")}`}>
        {/* The sentence is wrapped around the blank, the blank is a slot between its halves */}
        <g className={`${A} ${K("slot")}`}>
          <rect x={136} y={74} width={48} height={22} rx={7} fill="none" stroke={C.primary} strokeWidth={2} strokeDasharray="4 4" />
        </g>
        <g className={`${A} ${K("cut")}`}>
          <path className={`${A} ${K("cutline")}`} d="M16 85 H304" pathLength={100} fill="none" stroke={C.primary} strokeWidth={4} />
        </g>

        <g className={`${A} ${K("up")}`}>
          <Card t={14} text="The harbor froze in January" subj={[55.7, 46.6]} verb={[104, 33.3]} k="l" />
        </g>
        <g className={`${A} ${K("dn")}`}>
          <Card t={116} text="the ferries stopped running." subj={[54, 47.7]} verb={[102.3, 53.4]} k="r" />
        </g>

        {/* Verdict bar between the halves */}
        <g className={`${A} ${K("verdict")}`}>
          <rect x={16} y={74} width={288} height={30} rx={15} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={160} y={94} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
            {"full + full  →  "}
            <tspan fill={C.primaryText} fontSize={20}>
              {".  ;  ,"}
            </tspan>
            <tspan fill={C.primaryText}>{"  + FANBOYS"}</tspan>
          </text>
        </g>

        {/* Counter-example covers the right card for a moment */}
        <g className={`${A} ${K("frag")}`}>
          <rect x={16} y={116} width={288} height={50} rx={10} fill={C.bg} stroke={C.bad} strokeWidth={1.5} />
          <text x={X0} y={136} fontSize={14} fontWeight={600} fill={C.ink}>
            <tspan fill={C.bad} fontWeight={700}>
              After
            </tspan>
            {" the ferries stopped"}
          </text>
          <circle cx={205} cy={151} r={8} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <path d="M201 147 l8 8 M209 147 l-8 8" stroke={C.bad} strokeWidth={2} fill="none" />
          <text x={218} y={155} fontSize={12} fontWeight={700} fill={C.bad}>
            fragment
          </text>
        </g>
      </g>
    </Svg>
  );
}
