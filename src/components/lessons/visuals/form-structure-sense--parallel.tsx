import { C, Css, Svg } from "./kit";

// Same form, same kind. Block shapes stand for forms: "create" must be the same shape as "increase", and "that of
// Bergen" the same kind of thing as "population". Mismatched shapes shake and fade in red; the match locks in green.
export const alt =
  "Two sentences with blanks. Creates and creating do not match the shape of increase and are rejected; create fits. Bergen alone does not match population; that of Bergen fits.";

const P = "v-form-structure-sense--parallel-";
const A = P + "a";
const cl = (n: string) => `${A} ${P}${n}`;
const hid = P + "hid";
const kf = (n: string, body: string) => `.${P}${n} { animation-name: ${P}${n}; }\n@keyframes ${P}${n} { ${body} }`;
const tryKf = (n: string, s: number) =>
  kf(
    n,
    `0%, ${s}% { opacity: 0; transform: translateX(0) } ${s + 2}% { opacity: 1 } ${s + 3}% { transform: translateX(-3px) } ${s + 4}% { transform: translateX(3px) } ${s + 5}% { transform: translateX(-2px) } ${s + 6}%, ${s + 8}% { opacity: 1; transform: translateX(0) } ${s + 11}%, 100% { opacity: 0; transform: translateX(0) }`,
  );
const inKf = (n: string, s: number) => kf(n, `0%, ${s}% { opacity: 0 } ${s + 5}%, 100% { opacity: 1 }`);
const drawKf = (n: string, s: number) => kf(n, `0%, ${s}% { stroke-dashoffset: 100 } ${s + 7}%, 100% { stroke-dashoffset: 0 }`);

const css = `
.${A} { animation: 12s ease-in-out infinite; }
${kf("scene", "0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 }")}
.${P + "hid"} { opacity: 0; }
.${P + "draw"} { stroke-dasharray: 100; stroke-dashoffset: 0; }

${tryKf("t1", 5)}
${tryKf("t2", 18)}
${inKf("w1", 32)}
${drawKf("br1", 38)}
${inKf("tag1", 43)}
${inKf("row2", 47)}
${tryKf("t3", 55)}
${inKf("w2", 68)}
${drawKf("br2", 74)}
${inKf("tag2", 78)}
`;

type Kind = "pill" | "sq" | "tag";
type Tone = "ink" | "bad" | "good" | "slot";

/** A block whose outline is its "form": pill, square or pointed tag. */
function Block({ kind, x, y, w, tone, word, tl, cls }: { kind: Kind; x: number; y: number; w: number; tone: Tone; word?: string; tl?: number; cls?: string }) {
  const h = 22;
  const r = h / 2;
  const d =
    kind === "pill"
      ? `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`
      : kind === "sq"
        ? `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`
        : `M ${x} ${y} H ${x + w - 9} L ${x + w} ${y + r} L ${x + w - 9} ${y + h} H ${x} Z`;
  const fill = tone === "good" ? C.goodSoft : tone === "bad" ? C.badSoft : tone === "ink" ? C.soft : "none";
  const stroke = tone === "good" ? C.good : tone === "bad" ? C.bad : tone === "ink" ? C.primary : C.muted;
  return (
    <g className={cls}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={tone === "slot" ? "4 4" : undefined} />
      {word && (
        <text x={x + (kind === "tag" ? (w - 9) / 2 : w / 2)} y={y + 15.5} textAnchor="middle" fontSize={12} fontWeight={700} fill={tone === "bad" ? C.bad : C.ink} stroke="none" textLength={tl} lengthAdjust="spacingAndGlyphs">
          {word}
        </text>
      )}
    </g>
  );
}

const txt = { fontSize: 12, fontWeight: 600, fill: C.ink, stroke: "none" } as const;
const tagTxt = { fontSize: 11, fontWeight: 700, fill: C.primaryText, stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cl("scene")}>
        {/* Row 1: parallel verbs */}
        <text x={24} y={32} textLength={82} lengthAdjust="spacingAndGlyphs" {...txt}>
          The lock would
        </text>
        <Block kind="pill" x={112} y={16} w={66} tone="ink" word="increase" tl={46} />
        <text x={184} y={32} textLength={74} lengthAdjust="spacingAndGlyphs" {...txt}>
          the salinity
        </text>
        <text x={24} y={72} textLength={22} lengthAdjust="spacingAndGlyphs" {...txt}>
          and
        </text>
        <Block kind="pill" x={52} y={56} w={66} tone="slot" />
        <Block kind="sq" x={52} y={56} w={66} tone="bad" word="creates" tl={44} cls={`${cl("t1")} ${hid}`} />
        <Block kind="tag" x={52} y={56} w={70} tone="bad" word="creating" tl={46} cls={`${cl("t2")} ${hid}`} />
        <Block kind="pill" x={52} y={56} w={66} tone="good" word="create" tl={40} cls={cl("w1")} />
        <text x={126} y={72} textLength={62} lengthAdjust="spacingAndGlyphs" {...txt}>
          a barrier.
        </text>
        <path className={`${cl("br1")} ${P + "draw"}`} d="M 145 40 V 48 H 85 V 54" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <text className={cl("tag1")} x={204} y={72} {...tagTxt}>
          same form
        </text>

        {/* Row 2: compare like with like */}
        <g className={cl("row2")}>
          <text x={24} y={112} textLength={20} lengthAdjust="spacingAndGlyphs" {...txt}>
            The
          </text>
          <Block kind="sq" x={50} y={96} w={84} tone="ink" word="population" tl={62} />
          <text x={140} y={112} textLength={100} lengthAdjust="spacingAndGlyphs" {...txt}>
            of Oslo is larger
          </text>
          <text x={24} y={152} textLength={28} lengthAdjust="spacingAndGlyphs" {...txt}>
            than
          </text>
          <Block kind="sq" x={58} y={136} w={104} tone="slot" />
          <Block kind="tag" x={58} y={136} w={70} tone="bad" word="Bergen" tl={42} cls={`${cl("t3")} ${hid}`} />
          <Block kind="sq" x={58} y={136} w={104} tone="good" word="that of Bergen" tl={80} cls={cl("w2")} />
          <path className={`${cl("br2")} ${P + "draw"}`} d="M 92 120 V 128 H 110 V 134" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
          <text className={cl("tag2")} x={172} y={152} {...tagTxt}>
            same kind
          </text>
        </g>
      </g>
    </Svg>
  );
}
