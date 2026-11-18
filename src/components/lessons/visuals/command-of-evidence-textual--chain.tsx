import { C, Css, Svg } from "./kit";

// Command of evidence (textual), "Test the last link": a hypothesis is a chain; a finding about the middle link misses it, a finding about the end result breaks it.
export const alt = "A chain: roots slow water, mud settles, the coast rises. A finding about thicker roots breaks no link and is rejected. A finding that coasts rose no faster hits the end result and breaks it.";

const P = "v-command-of-evidence-textual--chain-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;

const css = `
.v-command-of-evidence-textual--chain-a { animation: 10s ease-in-out infinite; }
.v-command-of-evidence-textual--chain-scene { animation-name: v-command-of-evidence-textual--chain-scene; }
@keyframes v-command-of-evidence-textual--chain-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("b1", 6)}
${show("b2", 16)}
${show("b3", 26)}
${show("end", 34)}
${show("fa", 46)}
${show("fb", 64)}
.v-command-of-evidence-textual--chain-broken { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: v-command-of-evidence-textual--chain-broken; }
@keyframes v-command-of-evidence-textual--chain-broken { 0%, 72% { fill: ${C.soft}; stroke: ${C.primary} } 80%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }
`;

const BOX_Y = 40;
const BOX_H = 38;

function Box({ cx, cls, l1, l2, end }: { cx: number; cls: string; l1: string; l2: string; end?: boolean }) {
  return (
    <g className={`v-command-of-evidence-textual--chain-a ${cls}`}>
      {end ? (
        <rect className={`v-command-of-evidence-textual--chain-a v-command-of-evidence-textual--chain-broken`} x={cx - 42} y={BOX_Y} width={84} height={BOX_H} rx={9} strokeWidth={2} />
      ) : (
        <rect x={cx - 42} y={BOX_Y} width={84} height={BOX_H} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      )}
      <text x={cx} y={BOX_Y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
        {l1}
      </text>
      <text x={cx} y={BOX_Y + 31} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
        {l2}
      </text>
    </g>
  );
}

function Arrow({ x1, x2, cls }: { x1: number; x2: number; cls: string }) {
  const y = BOX_Y + BOX_H / 2;
  return <path className={`v-command-of-evidence-textual--chain-a ${cls}`} d={`M${x1} ${y} H${x2} M${x2 - 5} ${y - 5} L${x2} ${y} L${x2 - 5} ${y + 5}`} fill="none" stroke={C.muted} strokeWidth={1.5} />;
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-command-of-evidence-textual--chain-a v-command-of-evidence-textual--chain-scene`}>
        <Box cx={58} cls={`v-command-of-evidence-textual--chain-b1`} l1="roots slow" l2="the water" />
        <Arrow x1={104} x2={114} cls={`v-command-of-evidence-textual--chain-b2`} />
        <Box cx={160} cls={`v-command-of-evidence-textual--chain-b2`} l1="mud" l2="settles" />
        <Arrow x1={206} x2={216} cls={`v-command-of-evidence-textual--chain-b3`} />
        <Box cx={262} cls={`v-command-of-evidence-textual--chain-b3`} l1="coast" l2="rises" end />

        <text className={`v-command-of-evidence-textual--chain-a v-command-of-evidence-textual--chain-end`} x={262} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary}>
          end result
        </text>

        {/* (A): a middle link, rejected */}
        <g className={`v-command-of-evidence-textual--chain-a v-command-of-evidence-textual--chain-fa`}>
          <path d="M58 112 V84" fill="none" stroke={C.bad} strokeWidth={1.5} strokeDasharray="4 3" />
          <rect x={16} y={112} width={84} height={28} rx={9} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <text x={58} y={130} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
            thicker roots
          </text>
          <text x={16} y={160} fontSize={11} fontWeight={600} fill={C.bad}>
            (A) breaks nothing
          </text>
        </g>

        {/* (B): the end result, breaks the chain */}
        <g className={`v-command-of-evidence-textual--chain-a v-command-of-evidence-textual--chain-fb`}>
          <path d="M262 112 V84 M256 91 L262 83 L268 91" fill="none" stroke={C.good} strokeWidth={2} />
          <rect x={220} y={112} width={84} height={28} rx={9} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text x={262} y={130} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
            no faster rise
          </text>
          <text x={304} y={160} textAnchor="end" fontSize={11} fontWeight={600} fill={C.good}>
            (B) breaks the end
          </text>
        </g>
      </g>
    </Svg>
  );
}
