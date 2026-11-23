import { C, Css, Svg, Tex } from "./kit";

// Scale: 2 cm on the map stands for 5 km. 7 cm holds 3.5 copies of the scale, so the real distance is 3.5 × 5 = 17.5 km.
export const alt = "A map strip with towns A and B 7 cm apart. The scale 2 cm = 5 km is copied 3.5 times along it, giving 5 + 5 + 5 + 2.5 km. The proportion 2 over 5 equals 7 over x gives x = 17.5 km.";

const P = "v-ratios-rates--scale-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 11s ease-in-out infinite; }
${at("map", 2)}
${at("c1", 10)}
${at("c2", 18)}
${at("c3", 25)}
${at("c4", 32)}
${at("real", 42)}
${at("prop", 54)}
${at("res", 68)}
${at("cap", 80)}
`;

const X0 = 44;
const U = 28; // canvas units per map cm
const MAP_Y = 36;
const CP_Y = 62; // copies row
const RL_Y = 88; // real-life row
const RH = 16;

// Four copies of the scale: three of 2 cm and a half copy (1 cm), laid end to end.
const placed = [
  { k: "c1", x: X0, w: 2 * U, km: "5 km" },
  { k: "c2", x: X0 + 2 * U, w: 2 * U, km: "5 km" },
  { k: "c3", x: X0 + 4 * U, w: 2 * U, km: "5 km" },
  { k: "c4", x: X0 + 6 * U, w: U, km: "2.5" },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The map strip: A and B are 7 cm apart */}
      <g className={cls("map")}>
        <path d={`M${X0} ${MAP_Y - 14} V${MAP_Y - 18} H${X0 + 7 * U} V${MAP_Y - 14}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <text x={X0 + 3.5 * U} y={MAP_Y - 23} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          7 cm
        </text>
        <line x1={X0} y1={MAP_Y} x2={X0 + 7 * U} y2={MAP_Y} stroke={C.muted} strokeWidth={2} strokeDasharray="3 4" />
        {[X0, X0 + 7 * U].map((cx, i) => (
          <g key={cx}>
            <circle cx={cx} cy={MAP_Y} r={8} fill={C.ink} />
            <text x={cx} y={MAP_Y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>
              {i === 0 ? "A" : "B"}
            </text>
          </g>
        ))}
      </g>

      {/* The scale, copied along the strip */}
      <g className={cls("c1")}>
        <Tex x={X0} y={CP_Y - 9} size={12} anchor="start" width={100} color={C.primaryText}>{String.raw`2\ \text{cm}=5\ \text{km}`}</Tex>
      </g>
      {placed.map((c) => (
        <g key={c.k} className={cls(c.k)}>
          <rect x={c.x} y={CP_Y} width={c.w} height={RH} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={c.x + c.w / 2} y={CP_Y + 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            {c.k === "c4" ? "1 cm" : "2 cm"}
          </text>
        </g>
      ))}

      {/* The same pieces in real life */}
      <g className={cls("real")}>
        {placed.map((c) => (
          <g key={c.k}>
            <rect x={c.x} y={RL_Y} width={c.w} height={RH} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
            <text x={c.x + c.w / 2} y={RL_Y + 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
              {c.km}
            </text>
          </g>
        ))}
      </g>
      <text className={cls("res")} x={X0 + 7 * U + 8} y={RL_Y + 12} fontSize={13} fontWeight={700} fill={C.good}>
        17.5 km
      </text>

      {/* The proportion and its solution */}
      <g className={cls("prop")}>
        <Tex x={16} y={128} size={13} anchor="start" width={150}>{String.raw`\dfrac{2\ \text{cm}}{5\ \text{km}}=\dfrac{7\ \text{cm}}{x\ \text{km}}`}</Tex>
      </g>
      <g className={cls("res")}>
        <Tex x={304} y={128} size={13} anchor="end" width={140} color={C.good}>{String.raw`2x=35,\ x=17.5\ \text{km}`}</Tex>
      </g>

      {/* Area: use the real lengths */}
      <g className={cls("cap")}>
        <Tex x={160} y={156} size={12} width={260} color={C.muted}>{String.raw`\text{area: }7.5\times5=37.5\ \text{km}^2`}</Tex>
      </g>
    </Svg>
  );
}
