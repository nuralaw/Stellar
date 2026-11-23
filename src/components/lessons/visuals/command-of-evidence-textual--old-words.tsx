import { C, Css, Svg } from "./kit";

// Command of evidence (textual), "Old words first": translate an old or figurative line into plain words, then match the feeling the claim names.
export const alt = "Fain would I flee this din is translated: fain is gladly, din is loud noise. The plain line links to the claim that the speaker longs to leave the noisy city. A line about shining halls has no link.";

const P = "v-command-of-evidence-textual--old-words-";
const cls = (...n: string[]) => n.map((x) => P + x).join(" ");
const k = (n: string, body: string) => `.@@${n} { animation-name: @@${n}; }\n@keyframes @@${n} { ${body} }`;
const show = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none }`);
const lift = (n: string, t: number) => k(n, `0%, ${t}% { opacity: 0; transform: translateY(-14px) } ${t + 7}%, 100% { opacity: 1; transform: none }`);
const draw = (n: string, t: number) => `.@@${n} { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: @@${n}; }\n@keyframes @@${n} { 0%, ${t}% { stroke-dashoffset: 100 } ${t + 6}%, 100% { stroke-dashoffset: 0 } }`;

const css = `
.@@a { animation: 12s ease-in-out infinite; }
${k("scene", "0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }")}
${show("q1", 5)}
${lift("c1", 20)}
${lift("c2", 25)}
${show("p1", 34)}
${show("card", 44)}
${draw("link", 52)}
${show("q2", 62)}
${show("p2", 70)}
${draw("nolink", 76)}
${k("note", "0%, 76% { opacity: 0 } 82%, 100% { opacity: 1 }")}
`.replaceAll("@@", P);

const SERIF = "Georgia, 'Times New Roman', serif";

function Chip({ x, w, text, cn }: { x: number; w: number; text: string; cn: string }) {
  return (
    <g className={cls("a", cn)}>
      <rect x={x} y={52} width={w} height={17} rx={8.5} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
      <text x={x + w / 2} y={64.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>{text}</text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("a", "scene")}>
        {/* a line in old words */}
        <g className={cls("a", "q1")}>
          <text x={16} y={26} fontSize={11} fontWeight={600} fill={C.muted}>old words</text>
          <text x={16} y={44} fontSize={15} fontStyle="italic" fontFamily={SERIF} fill={C.ink}>
            <tspan fill={C.primaryText} fontWeight={700} textDecoration="underline">Fain</tspan> would I flee this <tspan fill={C.primaryText} fontWeight={700} textDecoration="underline">din</tspan>
          </text>
        </g>
        <Chip x={16} w={82} text="fain = gladly" cn="c1" />
        <Chip x={104} w={100} text="din = loud noise" cn="c2" />

        {/* the same line in plain words */}
        <g className={cls("a", "p1")}>
          <text x={16} y={83} fontSize={11} fontWeight={600} fill={C.muted}>plain words</text>
          <text x={16} y={99} fontSize={12} fontWeight={700} fill={C.ink}>
            I would <tspan fill={C.primaryText}>gladly</tspan> flee this <tspan fill={C.primaryText}>noise</tspan>
          </text>
        </g>

        {/* the claim, linked */}
        <g className={cls("a", "card")}>
          <text x={232} y={34} fontSize={11} fontWeight={600} fill={C.muted}>claim</text>
          <rect x={232} y={42} width={72} height={62} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text x={268} y={58} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>the speaker</text>
          <text x={268} y={71} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>longs to</text>
          <text x={268} y={84} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>leave the</text>
          <text x={268} y={97} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>noisy city</text>
        </g>
        <path className={cls("a", "link")} pathLength={100} d="M214 94 H232" fill="none" stroke={C.good} strokeWidth={2.5} />

        {/* a second line: no link */}
        <g className={cls("a", "q2")}>
          <path d="M16 110 H216" stroke={C.line} strokeWidth={1.5} fill="none" />
          <text x={16} y={124} fontSize={12} fontStyle="italic" fontFamily={SERIF} fill={C.ink}>
            The city&apos;s <tspan fill={C.primaryText} fontWeight={700} textDecoration="underline">gilded</tspan> halls
          </text>
          <text x={16} y={138} fontSize={12} fontStyle="italic" fontFamily={SERIF} fill={C.ink}>do shine so bright</text>
        </g>
        <g className={cls("a", "p2")}>
          <text x={16} y={156} fontSize={12} fontWeight={700} fill={C.muted}>golden halls shine brightly</text>
        </g>
        <path className={cls("a", "nolink")} pathLength={100} d="M196 152 H220" fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="100" />
        <g className={cls("a", "note")}>
          <path d="M221 147 L229 157 M229 147 L221 157" stroke={C.muted} strokeWidth={2} fill="none" />
          <text x={236} y={150} fontSize={11} fontWeight={600} fill={C.muted}>no wish</text>
          <text x={236} y={162} fontSize={11} fontWeight={600} fill={C.muted}>to leave</text>
        </g>
      </g>
    </Svg>
  );
}
