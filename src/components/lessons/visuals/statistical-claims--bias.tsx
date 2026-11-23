import { C, Css, Svg } from "./kit";

// A volunteer pick (those who walk into the café) leans one way and size does not repair it; a random pick mirrors the population.
export const alt = "A neighborhood of dots, 60% yes. Customers who chose to come in are 92% yes, even in a bigger sample, so it is biased. A random pick from the whole circle gives 58%, close to the 60%.";

const P = "v-statistical-claims--bias-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const win = (k: string, a: number, b: number) => `.${n(k)} { opacity: 0; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${a}% { opacity: 0 } ${a + 4}%, ${b}% { opacity: 1 } ${b + 4}%, 100% { opacity: 0 } }`;
const pop = (k: string, t: number) => `.${n(k)} { transform-box: fill-box; transform-origin: center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scale(0.4) } ${t + 3}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const grow = (k: string, t: number, d: number) => `.${n(k)} { transform-box: fill-box; transform-origin: left center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleX(0) } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

// The neighborhood: 40 dots, 24 yes (orange) and 16 no (grey). The 12 dots nearest the café door (right side) are all yes but one.
const CX = 68;
const CY = 84;
const POP = Array.from({ length: 40 }, (_, i) => {
  const r = 44 * Math.sqrt((i + 0.5) / 40);
  const a = i * 2.39996;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
});
const YES = new Set([0, 2, 7, 8, 10, 11, 13, 15, 16, 18, 19, 21, 22, 25, 26, 27, 29, 31, 33, 34, 35, 37, 38, 39]);
const DOOR = [34, 39, 29, 26, 21, 37, 13, 16, 18, 31, 8, 24]; // who walks in: 11 yes, 1 no (24)
const CHANCE = [4, 33, 28, 2, 31, 5, 34, 8, 11, 6, 35, 9]; // a random pick over the whole circle: 7 yes, 5 no

// Samples in the right column.
const SX = (c: number) => 176 + 11.4 * (c % 12);
const BIASED_NO = new Set([7, 15, 21]); // 3 grey dots in 36, so 33 of 36 = 92% yes
const BY = [38, 49, 60];

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("pop", 1)}
${at("door", 12)}
${at("rings1", 15)}
${win("lab1", 15, 32)}
${at("lab2", 36)}
${DOOR.map((_, i) => pop(`s1-${i}`, 17 + i * 1.5)).join("\n")}
${grow("bar1", 30, 6)}
${grow("bar1b", 36, 5)}
${at("pct1", 34)}
${at("ref", 34)}
${Array.from({ length: 24 }, (_, i) => pop(`s2-${i}`, 48 + i * 0.5)).join("\n")}
${at("cap", 58)}
${at("coin", 64)}
${at("lab3", 64)}
${at("rings2", 67)}
${CHANCE.map((_, i) => pop(`s3-${i}`, 69 + i * 1.5)).join("\n")}
${grow("bar2", 86, 5)}
${at("pct2", 88)}
`;

const fill = (yes: boolean) => (yes ? C.primary : C.muted);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The neighborhood */}
      <g className={cls("pop")}>
        <circle cx={CX} cy={CY} r={54} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        {POP.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill={fill(YES.has(i))} />
        ))}
        <text x={CX} y={156} fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle">
          population
        </text>
      </g>
      <g className={cls("door")}>
        <rect x={121} y={72} width={12} height={24} rx={2} fill={C.bg} stroke={C.ink} strokeWidth={1.5} />
        <text x={127} y={66} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
          café
        </text>
      </g>
      <g className={cls("rings1")} fill="none" stroke={C.bad} strokeWidth={1.5}>
        {DOOR.map((i) => (
          <circle key={i} cx={POP[i][0]} cy={POP[i][1]} r={7.5} />
        ))}
      </g>

      {/* Biased sample: 12 people who came in, then 36 */}
      <text className={cls("lab1")} x={176} y={26} fontSize={12} fontWeight={600} fill={C.ink}>
        chose to come in
      </text>
      <text className={cls("lab2")} x={176} y={26} fontSize={12} fontWeight={700} fill={C.bad}>
        biased sample
      </text>
      {DOOR.map((i, k) => (
        <circle key={i} className={cls(`s1-${k}`)} cx={SX(k)} cy={BY[0]} r={4.5} fill={fill(YES.has(i))} />
      ))}
      {Array.from({ length: 24 }, (_, j) => {
        const k = 12 + j;
        return <circle key={k} className={cls(`s2-${j}`)} cx={SX(k)} cy={BY[Math.floor(k / 12)]} r={4.5} fill={fill(!BIASED_NO.has(k))} />;
      })}
      <rect x={176} y={71} width={100} height={8} rx={4} fill={C.fill} />
      <rect className={cls("bar1")} x={176} y={71} width={60} height={8} rx={4} fill={C.primary} />
      <rect className={cls("bar1b")} x={236} y={71} width={32} height={8} fill={C.bad} />
      <text className={cls("pct1")} x={284} y={79} fontSize={12} fontWeight={700} fill={C.bad}>
        92%
      </text>
      <text className={cls("cap")} x={176} y={108} fontSize={11} fontWeight={600} fill={C.bad}>
        bigger, still biased
      </text>

      {/* Random sample from the whole circle */}
      <g className={cls("rings2")} fill="none" stroke={C.ink} strokeWidth={1.5}>
        {CHANCE.map((i) => (
          <circle key={i} cx={POP[i][0]} cy={POP[i][1]} r={7.5} />
        ))}
      </g>
      <text className={cls("lab3")} x={176} y={123} fontSize={12} fontWeight={700} fill={C.ink}>
        random sample
      </text>
      <g className={cls("coin")}>
        <circle cx={290} cy={119} r={8} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <circle cx={290} cy={119} r={4} fill="none" stroke={C.primary} strokeWidth={1.5} />
      </g>
      {CHANCE.map((i, k) => (
        <circle key={i} className={cls(`s3-${k}`)} cx={SX(k)} cy={136} r={4.5} fill={fill(YES.has(i))} />
      ))}
      <rect x={176} y={147} width={100} height={8} rx={4} fill={C.fill} />
      <rect className={cls("bar2")} x={176} y={147} width={58} height={8} rx={4} fill={C.primary} />
      <text className={cls("pct2")} x={284} y={155} fontSize={12} fontWeight={700} fill={C.ink}>
        58%
      </text>

      {/* The population's share */}
      <g className={cls("ref")} stroke={C.ink} strokeWidth={2}>
        <line x1={236} y1={68} x2={236} y2={82} />
        <line x1={236} y1={144} x2={236} y2={158} />
        <text x={236} y={94} fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle" stroke="none">
          population 60%
        </text>
      </g>
    </Svg>
  );
}
