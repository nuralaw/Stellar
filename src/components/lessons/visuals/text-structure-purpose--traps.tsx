import { C, Css, Svg } from "./kit";

// Trap choices: a true choice can still miss the job (too narrow, too broad, an invented half); the right size fits the whole text.
export const alt =
  "A dashed frame holds a whole text. A choice covering one sentence is too narrow, one spilling over the frame is too broad, one that fits is right, and one with an invented second half fails.";

const P = "v-text-structure-purpose--traps-";
const k = (n: string) => P + n;
const cls = (n: string) => `${k("a")} ${k(n)}`;

/** Visible only between a and b (percent of the loop), hidden at the loop's final frame. */
const flash = (n: string, a: number, b: number) => `.${k(n)} { opacity: 0; animation-name: ${k(n)}; }
@keyframes ${k(n)} { 0%, ${a - 4}% { opacity: 0; transform: translateY(6px) } ${a}%, ${b}% { opacity: 1; transform: none } ${b + 4}%, 100% { opacity: 0; transform: none } }`;
const row = (n: string, t: number) => `.${k(n)} { animation-name: ${k(n)}; }
@keyframes ${k(n)} { 0%, ${t}% { opacity: 0; transform: translateX(-6px) } ${t + 5}%, 100% { opacity: 1; transform: none } }`;

const css = `
.${k("a")} { animation: 12s ease-in-out infinite; }
.${k("scene")} { animation-name: ${k("scene")}; }
@keyframes ${k("scene")} { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${flash("c1", 13, 27)}
${flash("cov1", 13, 27)}
${flash("c2", 33, 47)}
${flash("cov2", 33, 47)}
${flash("c3", 53, 67)}
.${k("cov3")} { animation-name: ${k("cov3")}; }
@keyframes ${k("cov3")} { 0%, 51% { opacity: 0 } 56%, 100% { opacity: 1 } }
.${k("c4")} { animation-name: ${k("c4")}; }
@keyframes ${k("c4")} { 0%, 72% { opacity: 0; transform: translateY(6px) } 77%, 100% { opacity: 1; transform: none } }
${row("r1", 17)}
${row("r2", 37)}
${row("r3", 57)}
${row("r4", 77)}
`;

const BARS = [
  { y: 32, w: 90 },
  { y: 56, w: 74 },
  { y: 80, w: 82 },
];

function Row({ y, word, good, c }: { y: number; word: string; good?: boolean; c: string }) {
  return (
    <g className={cls(c)}>
      {good ? (
        <path d={`M156 ${y} l4 4 l8 -8`} fill="none" stroke={C.good} strokeWidth={2.5} />
      ) : (
        <path d={`M157 ${y - 4} l8 8 m0 -8 l-8 8`} fill="none" stroke={C.bad} strokeWidth={2.5} />
      )}
      <text x={176} y={y + 4} fontSize={12} fontWeight={700} fill={good ? C.good : C.bad}>
        {word}
      </text>
    </g>
  );
}

/** A choice card at the bottom; its edge colour says right or wrong. */
function Card({ c, text, good }: { c: string; text: string; good?: boolean }) {
  return (
    <g className={cls(c)}>
      <rect x={16} y={132} width={288} height={26} rx={13} fill={good ? C.goodSoft : C.fill} stroke={good ? C.good : C.bad} strokeWidth={2} />
      <text x={160} y={149} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={C.ink}>
        {text}
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <defs>
        <pattern id="v-text-structure-purpose--traps-hatch" width={6} height={6} patternUnits="userSpaceOnUse">
          <path d="M0 6 L6 0" stroke={C.muted} strokeWidth={1} fill="none" />
        </pattern>
      </defs>
      <g className={cls("scene")}>
        {/* The whole text: a dashed frame with three sentence bars */}
        <rect x={16} y={20} width={114} height={92} rx={8} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 4" />
        {BARS.map((b) => (
          <rect key={b.y} x={28} y={b.y} width={b.w} height={12} rx={6} fill={C.line} />
        ))}

        {/* Where each choice reaches */}
        <rect className={cls("cov1")} x={22} y={28} width={102} height={20} rx={7} fill="none" stroke={C.bad} strokeWidth={2} />
        <rect className={cls("cov2")} x={6} y={8} width={134} height={116} rx={10} fill={C.badSoft} fillOpacity={0.45} stroke={C.bad} strokeWidth={2} />
        <rect className={cls("cov3")} x={20} y={24} width={106} height={84} rx={6} fill="none" stroke={C.good} strokeWidth={2.5} />

        {/* Verdicts */}
        <Row y={34} word="too narrow" c="r1" />
        <Row y={60} word="too broad" c="r2" />
        <Row y={86} word="fits the whole text" good c="r3" />
        <Row y={112} word="invented half" c="r4" />

        {/* The choice cards */}
        <Card c="c1" text="Saffron is a spice" />
        <Card c="c2" text="Spices of the world" />
        <Card c="c3" text="Why saffron is costly: the hand harvest" good />
        <g className={cls("c4")}>
          <rect x={16} y={132} width={288} height={26} rx={13} fill={C.fill} stroke={C.bad} strokeWidth={2} />
          <path d="M142 133 V157" stroke={C.bad} strokeWidth={1.5} fill="none" />
          <rect x={144} y={134} width={150} height={22} rx={11} fill="url(#v-text-structure-purpose--traps-hatch)" opacity={0.3} />
          <text x={79} y={149} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.ink}>
            Describes a house,
          </text>
          <text x={219} y={149} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.ink}>
            then says why it is empty
          </text>
        </g>
      </g>
    </Svg>
  );
}
