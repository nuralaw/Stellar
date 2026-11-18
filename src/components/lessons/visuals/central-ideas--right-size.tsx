import { C, Css, Svg } from "./kit";

// Central ideas, "The right size": three answer cards laid over a dashed frame the size of the whole text.
export const alt = "Three answer cards on a dashed frame the size of the text: a tiny card is too narrow, a card that spills over the frame is too broad, and the card that fits exactly is right.";

const P = "v-central-ideas--right-size-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;

const css = `
.v-central-ideas--right-size-a { animation: 9s ease-in-out infinite; }
.v-central-ideas--right-size-scene { animation-name: v-central-ideas--right-size-scene; }
@keyframes v-central-ideas--right-size-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("p1", 10)}
${show("p2", 34)}
${show("p3", 58)}
`;

const FRAME_W = 60;
const FRAME_H = 48;

/** One panel: the dashed frame (the text), a card laid over it, the choice in words and a verdict. */
function Panel({ cx, cls, card, phrase, verdict, ok }: { cx: number; cls: string; card: { x: number; y: number; w: number; h: number }; phrase: string; verdict: string; ok: boolean }) {
  return (
    <g>
      <rect x={cx - FRAME_W / 2} y={40} width={FRAME_W} height={FRAME_H} rx={4} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
      <g className={`v-central-ideas--right-size-a ${cls}`}>
        <rect x={card.x} y={card.y} width={card.w} height={card.h} rx={5} fill={ok ? C.goodSoft : C.badSoft} stroke={ok ? C.good : C.bad} strokeWidth={1.5} opacity={0.9} />
        <text x={cx} y={116} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
          {phrase}
        </text>
        <text x={cx} y={134} textAnchor="middle" fontSize={12} fontWeight={700} fill={ok ? C.good : C.bad}>
          {verdict}
        </text>
      </g>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-central-ideas--right-size-a v-central-ideas--right-size-scene`}>
        <Panel cx={64} cls={`v-central-ideas--right-size-p1`} card={{ x: 64 - 14, y: 52, w: 28, h: 24 }} phrase="rent hives" verdict="too narrow" ok={false} />
        <Panel cx={160} cls={`v-central-ideas--right-size-p2`} card={{ x: 160 - 42, y: 28, w: 84, h: 72 }} phrase="all insects" verdict="too broad" ok={false} />
        <Panel cx={256} cls={`v-central-ideas--right-size-p3`} card={{ x: 256 - FRAME_W / 2, y: 40, w: FRAME_W, h: FRAME_H }} phrase="bees help crops" verdict="just right" ok />
        <rect x={86} y={152} width={18} height={12} rx={2} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={110} y={162} fontSize={11} fill={C.muted}>
          = everything the text says
        </text>
      </g>
    </Svg>
  );
}
