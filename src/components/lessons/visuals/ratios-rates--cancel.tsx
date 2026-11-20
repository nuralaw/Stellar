import { C, Css, Svg } from "./kit";

// Convert a rate: 90 km/h × (1,000 m)/(1 km) × (1 h)/(3,600 s). km cancels, h cancels, m/s is left: 25 m/s.
export const alt = "90 km per hour multiplied by 1,000 m per km and by 1 hour per 3,600 s. The kilometers cancel and the hours cancel, leaving meters per second: 25 m/s.";

const P = "v-ratios-rates--cancel-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const strike = (k: string, t: number) => `.${n(k)} { stroke-dasharray: 100; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 1}% { stroke-dashoffset: 100; opacity: 1 } ${t + 8}%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("expr", 2)}
${strike("s1", 30)}
${strike("s2", 36)}
${strike("s3", 48)}
${strike("s4", 54)}
${at("res", 68)}
`;

const NUM = 70;
const DEN = 98;
const BAR = 80;

// A strike-through for a unit word at (x, y) of width w.
const Strike = ({ k, x, y, w }: { k: string; x: number; y: number; w: number }) => (
  <line className={cls(k)} x1={x - w / 2 - 2} y1={y - 5} x2={x + w / 2 + 2} y2={y - 5} pathLength={100} stroke={C.bad} strokeWidth={2.5} />
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={cls("expr")} transform="translate(33 0)" fontSize={15} fontWeight={700} fill={C.ink} textAnchor="middle">
        {/* 90 km / h */}
        <text x={22} y={NUM}>
          90
        </text>
        <text x={48} y={NUM}>
          km
        </text>
        <text x={36} y={DEN}>
          h
        </text>
        <line x1={10} y1={BAR} x2={62} y2={BAR} stroke={C.ink} strokeWidth={1.5} />
        <text x={76} y={BAR + 5} fill={C.muted}>
          ×
        </text>

        {/* 1,000 m / 1 km */}
        <text x={106} y={NUM}>
          1,000
        </text>
        <text x={140} y={NUM}>
          m
        </text>
        <text x={112} y={DEN}>
          1
        </text>
        <text x={136} y={DEN}>
          km
        </text>
        <line x1={86} y1={BAR} x2={154} y2={BAR} stroke={C.ink} strokeWidth={1.5} />
        <text x={168} y={BAR + 5} fill={C.muted}>
          ×
        </text>

        {/* 1 h / 3,600 s */}
        <text x={192} y={NUM}>
          1
        </text>
        <text x={210} y={NUM}>
          h
        </text>
        <text x={196} y={DEN}>
          3,600
        </text>
        <text x={230} y={DEN}>
          s
        </text>
        <line x1={178} y1={BAR} x2={244} y2={BAR} stroke={C.ink} strokeWidth={1.5} />
      </g>

      {/* Strike the units that cancel */}
      <g transform="translate(33 0)">
      <Strike k="s1" x={48} y={NUM} w={20} />
      <Strike k="s2" x={136} y={DEN} w={20} />
      <Strike k="s3" x={36} y={DEN} w={10} />
      <Strike k="s4" x={210} y={NUM} w={10} />
      </g>

      {/* Result */}
      <g className={cls("res")} textAnchor="middle">
        <text x={160} y={150} fontSize={26} fontWeight={700} fill={C.primaryText}>
          = 25 m/s
        </text>
      </g>
    </Svg>
  );
}
