import { C, Css, Svg } from "./kit";

// Question order: a Math module climbs steadily from easy to hard; a Reading and Writing module runs through
// four fixed groups whose difficulty only roughly rises (a few bars dip).
export const alt =
  "Math bars rise steadily from easiest to hardest. Reading and Writing runs in four groups (Craft and Structure, Information and Ideas, Conventions, Expression of Ideas) that only roughly rise.";

const P = "v-digital-sat-format--order-";

// Math lane: 22 bars, strictly rising.
const M_BASE = 58;
const M_N = 22;
const mBars = Array.from({ length: M_N }, (_, i) => ({ i, x: 26 + i * 12, h: 6 + i * 1.26 }));

// R&W lane: 27 bars in four blocks (7, 7, 7, 6); heights only roughly rise.
const R_BASE = 140;
const R_H = [8, 11, 13, 16, 10, 18, 19, 17, 20, 23, 16, 24, 26, 27, 24, 27, 21, 28, 30, 33, 31, 29, 31, 24, 33, 34, 34];
const R_DIP = new Set([4, 10, 16, 23]); // clear drops: a hard bar followed by an easy one
const BLOCKS = [
  { from: 0, n: 7, name: "Craft" },
  { from: 7, n: 7, name: "Ideas" },
  { from: 14, n: 7, name: "Conventions" },
  { from: 21, n: 6, name: "Expression" },
];
const BW = 6;
const rx = (i: number) => 26 + i * 8.6 + (i < 7 ? 0 : i < 14 ? 10 : i < 21 ? 20 : 30);
// Skill ribbon shades: runs of one shade = one skill; Conventions alternates (mixed skills).
const SKILL = [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1];

// Least-squares trend through the R&W bar tops.
const n = R_H.length;
const mx = (n - 1) / 2;
const my = R_H.reduce((a, b) => a + b, 0) / n;
const slope = R_H.reduce((a, h, i) => a + (i - mx) * (h - my), 0) / R_H.reduce((a, _, i) => a + (i - mx) ** 2, 0);
const fit = (i: number) => my + slope * (i - mx);
const tx1 = rx(0) + BW / 2;
const tx2 = rx(n - 1) + BW / 2;

const bar = (name: string, t: number, to: string, change?: { at: number; to: string }) => {
  const k = P + name;
  const mid = change ? `${t + 4}%, ${change.at}% { transform: scaleY(1); fill: ${C.muted} } ${change.at + 5}%, 100% { transform: scaleY(1); fill: ${change.to} }` : `${t + 4}%, 100% { transform: scaleY(1); fill: ${to} }`;
  return `.v-digital-sat-format--order-${name} { animation-name: ${k}; }
@keyframes ${k} { 0%, ${t}% { transform: scaleY(0); fill: ${C.muted} } ${mid} }`;
};

const barCss = [
  ...mBars.map(({ i }) => bar("m" + i, 5 + i * 0.9, C.muted, i >= M_N - 5 ? { at: 30, to: C.primary } : undefined)),
  ...R_H.map((_, i) => bar("r" + i, 38 + i * 0.7, C.muted, R_DIP.has(i) ? { at: 62, to: C.primary } : undefined)),
].join("\n");

const fade = (name: string, a: number, b: number) =>
  `.v-digital-sat-format--order-${name} { animation-name: ${P}${name}; }
@keyframes ${P}${name} { 0%, ${a}% { opacity: 0 } ${b}%, 100% { opacity: 1 } }`;

const css = `
.v-digital-sat-format--order-a { animation: 10s ease-in-out infinite; }
.v-digital-sat-format--order-scene { animation-name: ${P}scene; }
@keyframes ${P}scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }
.v-digital-sat-format--order-bar { transform-box: fill-box; transform-origin: center bottom; }
${barCss}
${fade("mcap", 28, 33)}
${fade("mlab", 26, 31)}
${fade("rcap", 64, 69)}
${fade("trend", 60, 68)}
${fade("ribbon", 74, 80)}
${fade("mixed", 80, 85)}
${BLOCKS.map((b, i) => fade("blk" + i, 38 + b.from * 0.7, 41 + b.from * 0.7)).join("\n")}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-digital-sat-format--order-a v-digital-sat-format--order-scene`}>
        {/* Math lane */}
        <text x={16} y={18} fontSize={13} fontWeight={700} fill={C.ink}>
          Math
        </text>
        <text className={`v-digital-sat-format--order-a v-digital-sat-format--order-mcap`} x={58} y={18} fontSize={12} fontWeight={700} fill={C.primaryText}>
          strictly easy to hard
        </text>
        <line x1={22} y1={M_BASE + 1} x2={298} y2={M_BASE + 1} stroke={C.line} strokeWidth={1.5} />
        {mBars.map((b) => (
          <rect
            key={b.i}
            className={`v-digital-sat-format--order-a v-digital-sat-format--order-bar`}
            style={{ animationName: `${P}m${b.i}` }}
            x={b.x}
            y={M_BASE - b.h}
            width={8}
            height={b.h}
            rx={2}
            fill={b.i >= M_N - 5 ? C.primary : C.muted}
          />
        ))}
        <g className={`v-digital-sat-format--order-a v-digital-sat-format--order-mlab`}>
          <text x={26} y={73} fontSize={12} fontWeight={600} fill={C.ink}>
            easiest
          </text>
          <text x={294} y={73} textAnchor="end" fontSize={12} fontWeight={600} fill={C.ink}>
            hardest
          </text>
        </g>

        {/* Reading and Writing lane */}
        <text x={16} y={94} fontSize={13} fontWeight={700} fill={C.ink}>
          R&amp;W
        </text>
        <text className={`v-digital-sat-format--order-a v-digital-sat-format--order-rcap`} x={58} y={94} fontSize={12} fontWeight={700} fill={C.primaryText}>
          only roughly
        </text>
        <g className={`v-digital-sat-format--order-a v-digital-sat-format--order-mixed`}>
          <text x={rx(17) + BW / 2} y={94} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
            mixed skills
          </text>
        </g>
        <line x1={22} y1={R_BASE + 1} x2={298} y2={R_BASE + 1} stroke={C.line} strokeWidth={1.5} />
        {R_H.map((h, i) => (
          <rect
            key={i}
            className={`v-digital-sat-format--order-a v-digital-sat-format--order-bar`}
            style={{ animationName: `${P}r${i}` }}
            x={rx(i)}
            y={R_BASE - h}
            width={BW}
            height={h}
            rx={2}
            fill={R_DIP.has(i) ? C.primary : C.muted}
          />
        ))}
        <g className={`v-digital-sat-format--order-a v-digital-sat-format--order-trend`}>
          <line x1={tx1} y1={R_BASE - fit(0)} x2={tx2} y2={R_BASE - fit(n - 1)} stroke={C.ink} strokeWidth={1.5} strokeDasharray="4 4" />
        </g>
        <g className={`v-digital-sat-format--order-a v-digital-sat-format--order-ribbon`}>
          {SKILL.map((s, i) => (
            <rect key={i} x={rx(i)} y={R_BASE + 5} width={BW} height={5} rx={1} fill={s ? C.line : C.ink} />
          ))}
        </g>
        {BLOCKS.map((b, i) => (
          <g key={b.name} className={`v-digital-sat-format--order-a v-digital-sat-format--order-blk${i}`}>
            <text x={(rx(b.from) + rx(b.from + b.n - 1) + BW) / 2} y={163} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
              {b.name}
            </text>
          </g>
        ))}
      </g>
    </Svg>
  );
}
