import { C, Css, Svg } from "./kit";

// Tense clues on a timeline: "Since 2010" is a span that reaches now (has welcomed); "By the time they came" points
// back to an earlier event (had sat). Wrong tries shake red once, the right one locks in green.
export const alt =
  "Two timelines. Since 2010 reaches up to now, so has welcomed locks in. By the time they came points back to an earlier event, so had sat locks in.";

const P = "v-form-structure-sense--timeline-";
const A = P + "a";
const cl = (n: string) => `${A} ${P}${n}`;

/** Keyframes: `body` is the frame list. */
const kf = (n: string, body: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${body} }`;
/** A wrong try: shows in the slot, shakes, goes away. */
const tryKf = (n: string, s: number) =>
  kf(
    n,
    `0%, ${s}% { opacity: 0; transform: translateX(0) } ${s + 2}% { opacity: 1 } ${s + 3}% { transform: translateX(-3px) } ${s + 4}% { transform: translateX(3px) } ${s + 5}% { transform: translateX(-2px) } ${s + 6}%, ${s + 8}% { opacity: 1; transform: translateX(0) } ${s + 11}%, 100% { opacity: 0; transform: translateX(0) }`,
  );
/** Fade in once at s% and stay. */
const inKf = (n: string, s: number) => kf(n, `0%, ${s}% { opacity: 0 } ${s + 5}%, 100% { opacity: 1 }`);
/** Draw a line at s% (dashoffset 100 -> 0). */
const drawKf = (n: string, s: number) => kf(n, `0%, ${s}% { stroke-dashoffset: 100 } ${s + 8}%, 100% { stroke-dashoffset: 0 }`);

const css = `
.${A} { animation: 12s ease-in-out infinite; }
${kf("scene", "0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 }")}
.${P + "hid"} { opacity: 0; }
.${P + "draw"} { stroke-dasharray: 100; stroke-dashoffset: 0; }

${drawKf("br1", 8)}
${inKf("tag1", 14)}
${tryKf("try1", 20)}
${inKf("win1", 33)}
${inKf("row2", 40)}
${drawKf("arc", 47)}
${inKf("tag2", 53)}
${tryKf("try2", 58)}
${inKf("win2", 71)}
`;

/** The slot (dashed), a wrong try and the winner share one box. */
function Box({ x, y, w, mode, word, tl, cls }: { x: number; y: number; w: number; mode: "bad" | "good" | "slot"; word?: string; tl?: number; cls?: string }) {
  const stroke = mode === "good" ? C.good : mode === "bad" ? C.bad : C.muted;
  const fill = mode === "good" ? C.goodSoft : mode === "bad" ? C.badSoft : "none";
  return (
    <g className={cls}>
      <rect x={x} y={y} width={w} height={22} rx={11} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={mode === "slot" ? "4 4" : undefined} />
      {word && (
        <text x={x + w / 2} y={y + 15.5} textAnchor="middle" fontSize={12} fontWeight={700} fill={mode === "good" ? C.ink : C.bad} stroke="none" textLength={tl} lengthAdjust="spacingAndGlyphs">
          {word}
        </text>
      )}
    </g>
  );
}

const txt = { fontSize: 12, fontWeight: 600, fill: C.ink, stroke: "none" } as const;
const lab = { fontSize: 11, fontWeight: 600, fill: C.muted, stroke: "none" } as const;

function Axis({ y }: { y: number }) {
  return (
    <g fill="none" stroke={C.line} strokeWidth={2}>
      <path d={`M 24 ${y} H 294`} />
      <path d={`M 288 ${y - 5} L 294 ${y} L 288 ${y + 5}`} />
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cl("scene")}>
        {/* Row 1: since 2010 */}
        <text x={20} y={32} textLength={130} lengthAdjust="spacingAndGlyphs" {...txt}>
          Since 2010, the museum
        </text>
        <Box x={156} y={16} w={86} mode="slot" />
        <Box x={156} y={16} w={86} mode="bad" word="welcomed" tl={50} cls={`${cl("try1")} ${P + "hid"}`} />
        <Box x={156} y={16} w={86} mode="good" word="has welcomed" tl={74} cls={cl("win1")} />
        <text x={248} y={32} textLength={52} lengthAdjust="spacingAndGlyphs" {...txt}>
          visitors.
        </text>

        <Axis y={62} />
        <text x={24} y={52} {...lab}>
          past
        </text>
        <circle cx={80} cy={62} r={4} fill={C.ink} />
        <text x={80} y={52} textAnchor="middle" {...lab} fill={C.ink}>
          2010
        </text>
        <circle cx={250} cy={62} r={4} fill={C.ink} />
        <text x={250} y={52} textAnchor="middle" {...lab} fill={C.ink}>
          now
        </text>
        <path className={`${cl("br1")} ${P + "draw"}`} d="M 80 68 V 74 H 250 V 68" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
        <g className={cl("tag1")}>
          <rect x={134} y={67} width={62} height={14} fill={C.bg} />
          <text x={165} y={78} textAnchor="middle" {...lab} fill={C.primaryText}>
            up to now
          </text>
        </g>

        {/* Row 2: by the time */}
        <g className={cl("row2")}>
          <text x={28} y={108} textLength={152} lengthAdjust="spacingAndGlyphs" {...txt}>
            By the time they came, it
          </text>
          <Box x={186} y={92} w={64} mode="slot" />
          <Box x={186} y={92} w={64} mode="bad" word="sat" tl={20} cls={`${cl("try2")} ${P + "hid"}`} />
          <Box x={186} y={92} w={64} mode="good" word="had sat" tl={42} cls={cl("win2")} />
          <text x={256} y={108} textLength={37} lengthAdjust="spacingAndGlyphs" {...txt}>
            there.
          </text>

          <Axis y={138} />
          <circle cx={100} cy={138} r={4} fill={C.ink} />
          <text x={100} y={128} textAnchor="middle" {...lab} fill={C.ink}>
            tablet in drawer
          </text>
          <circle cx={230} cy={138} r={4} fill={C.ink} />
          <text x={230} y={128} textAnchor="middle" {...lab} fill={C.ink}>
            team returns 1990
          </text>
          <path className={`${cl("arc")} ${P + "draw"}`} d="M 224 143 Q 165 166 106 144" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
          <path className={cl("tag2")} d="M 111 140 L 105 144 L 112 149" fill="none" stroke={C.primary} strokeWidth={2.5} />
          <g className={cl("tag2")}>
            <rect x={124} y={147} width={82} height={14} fill={C.bg} />
            <text x={165} y={157} textAnchor="middle" {...lab} fill={C.primaryText}>
              earlier = had
            </text>
          </g>
        </g>
      </g>
    </Svg>
  );
}
