import { C, Css, Svg } from "./kit";

// A random pick mirrors the population (60% vs 63%); a pick from the easy-to-reach corner does not (60% vs 13%), and size does not fix it.
export const alt = "40 dots, 24 orange and 16 grey. A random sample of 8 matches the mix. A sample taken only near the door is almost all grey, so the bars differ: biased, and a bigger sample stays biased.";

const P = "v-inference-sample--fair-pick-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const pop = (k: string, t: number) => `.${n(k)} { transform-box: fill-box; transform-origin: center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scale(0.4) } ${t + 3}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const grow = (k: string, t: number, d: number) => `.${n(k)} { transform-box: fill-box; transform-origin: left center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleX(0) } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

// The population: 8 x 5 dots, A = orange (24), B = grey (16). The last two columns are the "door" side.
const GRID = ["ABAAAAAB", "AAAABABB", "BAAAABBB", "AABAAABA", "BABAABBB"];
const gx = (c: number) => 24 + 16 * c;
const gy = (r: number) => 46 + 16 * r;
// Random pick: scattered over the whole grid, 5 orange + 3 grey.
const RAND = [[0, 2], [1, 0], [2, 3], [3, 5], [4, 4], [0, 1], [2, 0], [4, 2]]; // [row, col]
const RAND_COL = ["A", "B", "A", "A", "B", "A", "B", "A"]; // order shown in the sample row
// Door pick: only columns 6 and 7.
const DOOR = [[0, 6], [1, 6], [1, 7], [2, 6], [2, 7], [3, 6], [4, 6], [4, 7]];
const DOOR_COL = ["B", "B", "A", "B", "B", "B", "B", "B"];

const sx = (i: number) => 184 + 16 * i;
const R1 = 50;
const R2 = 128;
const dotFill = (k: string) => (k === "A" ? C.primary : C.muted);

const T1 = 14; // random row starts
const T2 = 48; // biased row starts
const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("pop", 1)}
${at("lab1", T1 - 2)}
${at("rings1", T1)}
${RAND.map((_, i) => pop(`d1-${i}`, T1 + i * 1.5)).join("\n")}
${grow("bar1", 28, 5)}
${at("pct1", 30)}
${at("cap1", 33)}
${at("ref", 30)}
${at("door", T2 - 4)}
${at("lab2", T2 - 2)}
${at("rings2", T2)}
${DOOR.map((_, i) => pop(`d2-${i}`, T2 + i * 1.5)).join("\n")}
${grow("bar2", 62, 5)}
${at("pct2", 64)}
${at("big", 76)}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The population */}
      <g className={cls("pop")}>
        <text x={80} y={28} fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle">
          population
        </text>
        {GRID.map((row, r) =>
          row.split("").map((k, c) => <circle key={`${r}-${c}`} cx={gx(c)} cy={gy(r)} r={6.5} fill={dotFill(k)} />),
        )}
      </g>

      {/* Random pick: rings spread over everything */}
      <g className={cls("rings1")} fill="none" stroke={C.ink} strokeWidth={1.5}>
        {RAND.map(([r, c]) => (
          <circle key={`${r}-${c}`} cx={gx(c)} cy={gy(r)} r={9} />
        ))}
      </g>
      <text className={cls("lab1")} x={176} y={34} fontSize={12} fontWeight={700} fill={C.ink}>
        random sample
      </text>
      {RAND_COL.map((k, i) => (
        <circle key={i} className={cls(`d1-${i}`)} cx={sx(i)} cy={R1} r={6.5} fill={dotFill(k)} />
      ))}
      <rect className={cls("lab1")} x={176} y={64} width={100} height={8} rx={4} fill={C.fill} />
      <rect className={cls("bar1")} x={176} y={64} width={62.5} height={8} rx={4} fill={C.primary} />
      <text className={cls("pct1")} x={284} y={72} fontSize={12} fontWeight={700} fill={C.ink}>
        63%
      </text>
      <text className={cls("cap1")} x={176} y={90} fontSize={11} fontWeight={600} fill={C.good}>
        same chance for all
      </text>

      {/* The door corner: only these are easy to reach */}
      <g className={cls("door")}>
        <rect x={110} y={36} width={36} height={84} rx={8} fill="none" stroke={C.bad} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={146} y={135} fontSize={11} fontWeight={600} fill={C.bad} textAnchor="end">
          easy to reach
        </text>
      </g>
      <g className={cls("rings2")} fill="none" stroke={C.bad} strokeWidth={1.5}>
        {DOOR.map(([r, c]) => (
          <circle key={`${r}-${c}`} cx={gx(c)} cy={gy(r)} r={9} />
        ))}
      </g>
      <text className={cls("lab2")} x={176} y={112} fontSize={12} fontWeight={700} fill={C.bad}>
        biased sample
      </text>
      {DOOR_COL.map((k, i) => (
        <circle key={i} className={cls(`d2-${i}`)} cx={sx(i)} cy={R2} r={6.5} fill={dotFill(k)} />
      ))}
      <rect className={cls("lab2")} x={176} y={142} width={100} height={8} rx={4} fill={C.fill} />
      <rect className={cls("bar2")} x={176} y={142} width={12.5} height={8} rx={4} fill={C.bad} />
      <text className={cls("pct2")} x={284} y={150} fontSize={12} fontWeight={700} fill={C.bad}>
        13%
      </text>

      {/* The population share the samples are compared with */}
      <g className={cls("ref")} stroke={C.ink} strokeWidth={2}>
        <line x1={236} y1={60} x2={236} y2={76} />
        <line x1={236} y1={138} x2={236} y2={154} />
        <text x={236} y={166} fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle" stroke="none">
          population 60%
        </text>
      </g>

      {/* A bigger biased sample is still biased */}
      <g className={cls("big")}>
        <text x={22} y={153} fontSize={11} fontWeight={600} fill={C.bad}>
          bigger does not fix it
        </text>
        {Array.from({ length: 20 }, (_, i) => (
          <circle key={i} cx={24 + 7.5 * i} cy={162} r={2.8} fill={i === 4 || i === 13 ? C.primary : C.muted} />
        ))}
      </g>
    </Svg>
  );
}
