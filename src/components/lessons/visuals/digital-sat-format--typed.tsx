import { C, Css, Svg } from "./kit";

// Typed math answers: a mixed number is not accepted. 4¼ must be entered as 17/4 or 4.25;
// "4 1/4" is rejected and "41/4" is read as 41 ÷ 4 = 10.25.
export const alt =
  "The answer 4¼ typed four ways: 4 1/4 is rejected as a mixed number, 41/4 is read as 10.25 and rejected, 17/4 is accepted and 4.25 is accepted.";

const P = "v-digital-sat-format--typed-";
/** Row n: its entry is typed at t%, the verdict lands at t + 7%. */
const row = (n: number, t: number, ok: boolean) => {
  const e = P + "e" + n;
  const b = P + "b" + n;
  const v = P + "v" + n;
  const col = ok ? C.good : C.bad;
  const soft = ok ? C.goodSoft : C.badSoft;
  const shake = ok ? "" : ` ${t + 8.5}% { transform: translateX(-3px) } ${t + 10}% { transform: translateX(3px) } ${t + 11.5}% { transform: translateX(0) }`;
  return `.${e} { animation-name: ${e}; }
@keyframes ${e} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 } }
.${b} { stroke: ${col}; fill: ${soft}; animation-name: ${b}; }
@keyframes ${b} { 0%, ${t + 6}% { stroke: ${C.line}; fill: ${C.fill}; transform: translateX(0) } ${t + 7}% { transform: translateX(0) }${shake} ${t + 12}%, 100% { stroke: ${col}; fill: ${soft}; transform: translateX(0) } }
.${v} { transform-box: fill-box; transform-origin: center; animation-name: ${v}; }
@keyframes ${v} { 0%, ${t + 7}% { opacity: 0; transform: scale(0.4) } ${t + 12}%, 100% { opacity: 1; transform: none } }`;
};

const css = `
.v-digital-sat-format--typed-a { animation: 10s ease-in-out infinite; }
.v-digital-sat-format--typed-scene { animation-name: v-digital-sat-format--typed-scene; }
@keyframes v-digital-sat-format--typed-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }
${row(1, 8, false)}
${row(2, 28, false)}
${row(3, 50, true)}
${row(4, 68, true)}
`;

const ROWS = [
  { n: 1, y: 22, entry: "4 1/4", ok: false, note: "no mixed" },
  { n: 2, y: 60, entry: "41/4", ok: false, note: "= 10.25" },
  { n: 3, y: 98, entry: "17/4", ok: true, note: "" },
  { n: 4, y: 136, entry: "4.25", ok: true, note: "" },
] as const;

const CLS = {
  1: ["v-digital-sat-format--typed-a v-digital-sat-format--typed-b1", "v-digital-sat-format--typed-a v-digital-sat-format--typed-e1", "v-digital-sat-format--typed-a v-digital-sat-format--typed-v1"],
  2: ["v-digital-sat-format--typed-a v-digital-sat-format--typed-b2", "v-digital-sat-format--typed-a v-digital-sat-format--typed-e2", "v-digital-sat-format--typed-a v-digital-sat-format--typed-v2"],
  3: ["v-digital-sat-format--typed-a v-digital-sat-format--typed-b3", "v-digital-sat-format--typed-a v-digital-sat-format--typed-e3", "v-digital-sat-format--typed-a v-digital-sat-format--typed-v3"],
  4: ["v-digital-sat-format--typed-a v-digital-sat-format--typed-b4", "v-digital-sat-format--typed-a v-digital-sat-format--typed-e4", "v-digital-sat-format--typed-a v-digital-sat-format--typed-v4"],
} as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-digital-sat-format--typed-a v-digital-sat-format--typed-scene">
        {/* The answer to enter */}
        <text x={58} y={72} textAnchor="middle" fontSize={11} fill={C.muted}>
          answer
        </text>
        <text x={58} y={108} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.ink}>
          4¼
        </text>
        <path d="M96 92 H112 M107 87 L112 92 L107 97" fill="none" stroke={C.muted} strokeWidth={1.5} />

        {/* Four ways to type it */}
        {ROWS.map((r) => (
          <g key={r.n}>
            <rect className={CLS[r.n][0]} x={122} y={r.y} width={84} height={26} rx={7} strokeWidth={1.5} />
            <text className={CLS[r.n][1]} x={134} y={r.y + 18} fontSize={15} fontWeight={700} fill={C.ink} style={{ whiteSpace: "pre" }}>
              {r.entry}
            </text>
            <g className={CLS[r.n][2]}>
              {r.ok ? (
                <path d={`M${217} ${r.y + 13} l4 4.5 l8 -9`} fill="none" stroke={C.good} strokeWidth={2.5} />
              ) : (
                <path d={`M${218} ${r.y + 8} l10 10 M${228} ${r.y + 8} l-10 10`} fill="none" stroke={C.bad} strokeWidth={2.5} />
              )}
              {r.note && (
                <text x={240} y={r.y + 17} fontSize={11} fontWeight={600} fill={C.muted}>
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
