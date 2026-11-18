import { C, Css, Svg } from "./kit";

// P = 400(2)^(x/3): the exponent x/3 grows by 1 every 3 hours, so the amount doubles every 3 hours.
export const alt =
  "P = 400 × 2^(x/3): at 0, 3 and 6 hours the exponent x/3 is 0, 1 and 2, and P is 400, 800 and 1,600. The amount doubles every 3 hours.";

const P = "v-nonlinear-functions--timeline-";
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const css = `
.v-nonlinear-functions--timeline-a { animation: 9s ease-in-out infinite; }
${[4, 20, 34, 48, 62, 76].map(fade).join("\n")}
`;
const a = `${P}a`;

// Axis at y = 112; 28 px per hour, 0 h at x = 76. Pills sit above the 0, 3 and 6 hour marks.
const X = (h: number) => 76 + 28 * h;
const STOPS = [
  { h: 0, v: "400", e: "0", t: 4 },
  { h: 3, v: "800", e: "1", t: 34 },
  { h: 6, v: "1,600", e: "2", t: 62 },
] as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Time axis */}
      <g className={`${a} ${fc(4)}`}>
        <line x1={X(-0.6)} y1={112} x2={X(6.8)} y2={112} stroke={C.muted} strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5, 6].map((h) => (
          <line key={h} x1={X(h)} y1={h % 3 === 0 ? 106 : 108} x2={X(h)} y2={h % 3 === 0 ? 118 : 116} stroke={C.muted} strokeWidth={h % 3 === 0 ? 2 : 1.5} />
        ))}
        <text x={16} y={130} fontSize={11} fill={C.muted}>
          hours
        </text>
        <text x={16} y={154} fontSize={11} fill={C.muted}>
          x/3
        </text>
      </g>

      {STOPS.map((s) => (
        <g key={s.h} className={`${a} ${fc(s.t)}`}>
          <rect x={X(s.h) - 28} y={44} width={56} height={30} rx={8} fill={s.h === 6 ? C.soft : C.fill} stroke={s.h === 6 ? C.primary : C.line} strokeWidth={1.5} />
          <text x={X(s.h)} y={65} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink}>
            {s.v}
          </text>
          <line x1={X(s.h)} y1={74} x2={X(s.h)} y2={106} stroke={C.line} strokeWidth={1.5} strokeDasharray="3 3" />
          <text x={X(s.h)} y={130} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            {s.h}
          </text>
          <text x={X(s.h)} y={154} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.primary}>
            {s.e}
          </text>
        </g>
      ))}

      {/* Doubling every 3 hours */}
      {[0, 1].map((i) => (
        <g key={i} className={`${a} ${fc(i === 0 ? 20 : 48)}`}>
          <path d={`M${X(3 * i) + 32} 59 H${X(3 * i + 3) - 32} M${X(3 * i + 3) - 38} 54 L${X(3 * i + 3) - 32} 59 L${X(3 * i + 3) - 38} 64`} fill="none" stroke={C.primary} strokeWidth={2} />
          <text x={(X(3 * i) + X(3 * i + 3)) / 2} y={50} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.primary}>
            × 2
          </text>
        </g>
      ))}
      <g className={`${a} ${fc(76)}`}>
        <text x={160} y={28} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.ink}>
          doubles every 3 hours
        </text>
      </g>
    </Svg>
  );
}
