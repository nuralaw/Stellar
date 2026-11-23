import { C, Css, Svg } from "./kit";

// Transitions, concession: the writer admits a small point (the scale dips a little), then turns back (the scale
// swings past level to the claim's side).
export const alt =
  "A scale holds the claim \"Best café in town.\" A small weight, \"Admittedly, it is small.\", dips it a little; then \"Still, its coffee wins.\" turns it back, and the claim outweighs the admission.";

const P = "v-transitions--concession-";
const A = P + "a";
const n = (s: string) => P + s;

// Beam pivot and half-length; final tilt 14 degrees (claim side down).
const PX = 160;
const PY = 46;
const L = 96;
const LX = 66.9; // left beam end at the final tilt
const LY = 69.2;
const RX = 253.1; // right beam end at the final tilt
const RY = 22.8;

// Pan offsets (px) that follow the beam: tilt 10 deg, 3 deg, 14 deg (final).
const css = `
.${A} { animation: 11s ease-in-out infinite; }
.${n("scene")} { animation-name: ${n("scene")}; }
@keyframes ${n("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

.${n("beam")} { transform-box: view-box; transform-origin: ${PX}px ${PY}px; transform: rotate(-14deg); animation-name: ${n("beam")}; }
@keyframes ${n("beam")} {
  0%, 24% { transform: rotate(-10deg) }
  34%, 52% { transform: rotate(-3deg) }
  64%, 100% { transform: rotate(-14deg) }
}
.${n("left")} { animation-name: ${n("left")}; }
@keyframes ${n("left")} {
  0%, 6% { opacity: 0; transform: translateY(-6.5px) }
  14%, 24% { opacity: 1; transform: translateY(-6.5px) }
  34%, 52% { opacity: 1; transform: translateY(-18.2px) }
  64%, 100% { opacity: 1; transform: none }
}
.${n("right")} { animation-name: ${n("right")}; }
@keyframes ${n("right")} {
  0%, 24% { transform: translateY(6.5px) }
  34%, 52% { transform: translateY(18.2px) }
  64%, 100% { transform: none }
}
.${n("weight")} { animation-name: ${n("weight")}; }
@keyframes ${n("weight")} { 0%, 24% { opacity: 0; transform: translateY(-26px) } 32%, 100% { opacity: 1; transform: none } }
.${n("arrow")} { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: ${n("arrow")}; }
@keyframes ${n("arrow")} { 0%, 50% { stroke-dashoffset: 100; opacity: 0 } 64%, 100% { stroke-dashoffset: 0; opacity: 1 } }
.${n("turn")} { animation-name: ${n("turn")}; }
@keyframes ${n("turn")} { 0%, 58% { opacity: 0; transform: translateY(6px) } 68%, 100% { opacity: 1; transform: none } }
.${n("tag")} { animation-name: ${n("tag")}; }
@keyframes ${n("tag")} { 0%, 66% { opacity: 0 } 74%, 100% { opacity: 1 } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${n("scene")}`}>
        {/* Stand */}
        <path d={`M${PX} ${PY} V108 M130 108 H190`} fill="none" stroke={C.muted} strokeWidth={3} />

        {/* Beam */}
        <path className={`${A} ${n("beam")}`} d={`M${PX - L} ${PY} H${PX + L}`} fill="none" stroke={C.ink} strokeWidth={4} />
        <circle cx={PX} cy={PY} r={5} fill={C.ink} />

        {/* Claim, the heavy side */}
        <g className={`${A} ${n("left")}`}>
          <path d={`M${LX} ${LY} V${LY + 10}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
          <rect x={LX - 44} y={LY + 10} width={88} height={38} rx={8} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={LX} y={LY + 26} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
            Best café
          </text>
          <text x={LX} y={LY + 42} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
            in town.
          </text>
        </g>

        {/* The admission, a small weight */}
        <g className={`${A} ${n("right")}`}>
          <path d={`M${RX} ${RY} V${RY + 10}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
          <g className={`${A} ${n("weight")}`}>
            <rect x={RX - 38} y={RY + 10} width={76} height={32} rx={8} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
            <text x={RX} y={RY + 24} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.ink} stroke="none">
              Admittedly,
            </text>
            <text x={RX} y={RY + 37} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={C.ink} stroke="none">
              it is small.
            </text>
            <text x={RX - 13} y={RY + 56} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
              admit
            </text>
          </g>
        </g>

        {/* The turn back */}
        <path
          className={`${A} ${n("arrow")}`}
          d="M282 94 C282 158 67 158 67 127 L62 134 L67 127 L72 134"
          pathLength={100}
          fill="none"
          stroke={C.primary}
          strokeWidth={2.5}
          strokeDasharray="100"
        />
        <g className={`${A} ${n("tag")}`}>
          <text x={PX} y={133} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
            turn back
          </text>
        </g>
        <g className={`${A} ${n("turn")}`}>
          <text x={PX} y={164} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink} stroke="none">
            <tspan fill={C.primaryText} fontWeight={700}>
              Still,
            </tspan>{" "}
            its coffee wins.
          </text>
        </g>
      </g>
    </Svg>
  );
}
