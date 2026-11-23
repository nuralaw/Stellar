import { C, Css, Svg, Tex } from "./kit";

// Typed math answers: 5 characters (6 with a minus sign). A decimal that doesn't fit must fill the box:
// for 2/3, 0.66 is too short; 0.666 and .6667 are accepted. For −2/3, -.6667 uses all 6.
export const alt =
  "The answer 2/3 as a decimal in a 5-character box: 0.66 leaves a space empty and is rejected; 0.666 and .6667 fill the box and are accepted. For −2/3 the box has 6 characters: −.6667.";

const P = "v-digital-sat-format--decimal-";
/** Row n: typed at t%, verdict at t + 7%. */
const row = (n: number, t: number) => {
  const e = P + "e" + n;
  const v = P + "v" + n;
  return `.${e} { animation-name: ${e}; }
@keyframes ${e} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 } }
.${v} { transform-box: fill-box; transform-origin: center; animation-name: ${v}; }
@keyframes ${v} { 0%, ${t + 7}% { opacity: 0; transform: scale(0.4) } ${t + 12}%, 100% { opacity: 1; transform: none } }`;
};

const css = `
.v-digital-sat-format--decimal-a { animation: 10s ease-in-out infinite; }
.v-digital-sat-format--decimal-scene { animation-name: v-digital-sat-format--decimal-scene; }
@keyframes v-digital-sat-format--decimal-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }
${row(1, 7)}
${row(2, 26)}
${row(3, 43)}
${row(4, 64)}
.v-digital-sat-format--decimal-gap { stroke: ${C.bad}; fill: ${C.badSoft}; animation-name: v-digital-sat-format--decimal-gap; }
@keyframes v-digital-sat-format--decimal-gap { 0%, 13% { stroke: ${C.line}; fill: ${C.fill} } 18%, 100% { stroke: ${C.bad}; fill: ${C.badSoft} } }
.v-digital-sat-format--decimal-neg { animation-name: v-digital-sat-format--decimal-neg; }
@keyframes v-digital-sat-format--decimal-neg { 0%, 59% { opacity: 0 } 64%, 100% { opacity: 1 } }
.v-digital-sat-format--decimal-six { stroke: ${C.primary}; fill: ${C.soft}; animation-name: v-digital-sat-format--decimal-six; }
@keyframes v-digital-sat-format--decimal-six { 0%, 70% { stroke: ${C.line}; fill: ${C.fill} } 75%, 100% { stroke: ${C.primary}; fill: ${C.soft} } }
`;

const X0 = 88;
const ROWS = [
  { n: 1, y: 20, chars: ["0", ".", "6", "6", ""], ok: false, note: "too short" },
  { n: 2, y: 52, chars: ["0", ".", "6", "6", "6"], ok: true, note: "" },
  { n: 3, y: 84, chars: [".", "6", "6", "6", "7"], ok: true, note: "" },
  { n: 4, y: 136, chars: ["−", ".", "6", "6", "6", "7"], ok: true, note: "6 with −" },
] as const;

const E = {
  1: "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-e1",
  2: "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-e2",
  3: "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-e3",
  4: "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-e4",
} as const;
const V = {
  1: "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-v1",
  2: "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-v2",
  3: "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-v3",
  4: "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-v4",
} as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-digital-sat-format--decimal-a v-digital-sat-format--decimal-scene">
        {/* The answers to enter */}
        <Tex x={46} y={52} size={24} width={64} color={C.ink}>{String.raw`\frac{2}{3}`}</Tex>
        <Tex x={46} y={82} size={12} width={80} color={C.muted}>{String.raw`=0.6666\ldots`}</Tex>
        <g className="v-digital-sat-format--decimal-a v-digital-sat-format--decimal-neg">
          <Tex x={46} y={150} size={24} width={72} color={C.ink}>{String.raw`-\frac{2}{3}`}</Tex>
        </g>
        <line x1={16} y1={122} x2={304} y2={122} stroke={C.line} strokeWidth={1.5} strokeDasharray="3 5" />

        {ROWS.map((r) => (
          <g key={r.n}>
            {/* One cell per character */}
            {r.chars.map((ch, i) => {
              const x = X0 + i * 23;
              const cls = r.n === 1 && i === 4 ? "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-gap" : r.n === 4 && i === 0 ? "v-digital-sat-format--decimal-a v-digital-sat-format--decimal-six" : undefined;
              return (
                <g key={i}>
                  <rect className={cls} x={x} y={r.y} width={20} height={24} rx={5} fill={cls ? undefined : C.fill} stroke={cls ? undefined : C.line} strokeWidth={1.5} strokeDasharray={r.n === 1 && i === 4 ? "3 3" : undefined} />
                  <text className={E[r.n]} x={x + 10} y={r.y + 17.5} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
                    {ch}
                  </text>
                </g>
              );
            })}
            {/* Verdict */}
            <g className={V[r.n]}>
              {r.ok ? (
                <path d={`M${X0 + r.chars.length * 23 + 5} ${r.y + 12} l4 4.5 l8 -9`} fill="none" stroke={C.good} strokeWidth={2.5} />
              ) : (
                <path d={`M${X0 + 121} ${r.y + 7} l10 10 M${X0 + 131} ${r.y + 7} l-10 10`} fill="none" stroke={C.bad} strokeWidth={2.5} />
              )}
              {r.note && (
                <text x={X0 + r.chars.length * 23 + (r.ok ? 24 : 24)} y={r.y + 16} fontSize={11} fontWeight={600} fill={C.muted}>
                  {r.note}
                </text>
              )}
            </g>
          </g>
        ))}
      </g>
    </Svg>
  );
}
