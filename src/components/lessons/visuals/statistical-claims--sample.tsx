import { C, Css, Svg } from "./kit";

// Who the results fit: a random sample picked from a population describes that population.
export const alt = "A big circle of dots, the population. A few dots are picked at random into a small circle, the random sample. An arrow back shows the results fit the whole population.";

const P = "v-statistical-claims--sample-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const pop = (k: string, t: number) => `.${n(k)} { transform-box: fill-box; transform-origin: center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scale(0.4) } ${t + 6}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("pop", 2)}
${pop("pick", 16)}
${at("arr1", 30)}
${at("smp", 38)}
${at("arr2", 56)}
`;

// Dots in a disc (sunflower layout).
const disc = (cx: number, cy: number, R: number, count: number) =>
  Array.from({ length: count }, (_, i) => {
    const r = R * Math.sqrt((i + 0.5) / count);
    const a = i * 2.39996;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
const PICKED = [3, 8, 14, 19, 25, 29, 34, 38];
const POP = disc(92, 86, 50, 40);
const SAMPLE = disc(248, 86, 24, 8);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Population */}
      <g className={cls("pop")}>
        <circle cx={92} cy={86} r={58} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <g fill={C.muted}>
          {POP.map(([x, y], i) => (PICKED.includes(i) ? null : <circle key={i} cx={x} cy={y} r={3} />))}
        </g>
        <text x={92} y={166} fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle">
          population
        </text>
      </g>
      {/* The dots that get picked */}
      <g fill={C.primary}>
        {PICKED.map((i) => (
          <circle key={i} className={cls("pick")} cx={POP[i][0]} cy={POP[i][1]} r={4.5} />
        ))}
      </g>

      {/* Population to sample */}
      <g className={cls("arr1")}>
        <path d="M160 76 H208 M202 71 L208 76 L202 81" fill="none" stroke={C.ink} strokeWidth={2} />
        <text x={184} y={66} fontSize={11} fontWeight={600} fill={C.ink} textAnchor="middle">
          random pick
        </text>
      </g>

      {/* Sample */}
      <g className={cls("smp")}>
        <circle cx={248} cy={86} r={32} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <g fill={C.primary}>
          {SAMPLE.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4.5} />
          ))}
        </g>
        <text x={248} y={166} fontSize={12} fontWeight={600} fill={C.primaryText} textAnchor="middle">
          random sample
        </text>
      </g>

      {/* Results go back to the whole population */}
      <g className={cls("arr2")}>
        <path d="M208 100 H160 M166 95 L160 100 L166 105" fill="none" stroke={C.good} strokeWidth={2} />
        <text x={184} y={120} fontSize={11} fontWeight={700} fill={C.good} textAnchor="middle">
          results fit
        </text>
      </g>
    </Svg>
  );
}
