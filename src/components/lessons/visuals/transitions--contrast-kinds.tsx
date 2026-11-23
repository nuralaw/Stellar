import { C, Css, Svg } from "./kit";

// Transitions, "but" bucket: four kinds of contrast, one panel at a time.
export const alt =
  "Four kinds of but: Still goes past what you expect, By contrast sets two things side by side, Instead swaps the expected thing for the real one, On the contrary rejects the claim.";

const P = "v-transitions--contrast-kinds-";
const A = P + "a";
const n = (s: string) => P + s;

const CELLS = [
  { x: 16, y: 16, chip: "Still,", cw: 48, tag: "despite" },
  { x: 164, y: 16, chip: "By contrast,", cw: 84, tag: "side by side" },
  { x: 16, y: 92, chip: "Instead,", cw: 62, tag: "replaces" },
  { x: 164, y: 92, chip: "On the contrary,", cw: 104, tag: "rejects" },
];
const CW = 140;
const CH = 72;

const T = (i: number) => 6 + i * 20;

/** A class + keyframes: hidden (`from`) until s%, reaching the normal style at e%. */
function anim(name: string, s: number, e: number, from: string) {
  return `.${name} { animation-name: ${name}; }
@keyframes ${name} { 0%, ${s}% { ${from} } ${e}%, 100% { opacity: 1; transform: none; stroke-dashoffset: 0 } }`;
}

const cellCss = CELLS.map((_, i) => {
  const t = T(i);
  const h = n("h" + i);
  return `${anim(n("c" + i), t, t + 5, "opacity: 0; transform: translateY(6px)")}
.${h} { opacity: 0; animation-name: ${h}; }
@keyframes ${h} { 0%, ${t}% { opacity: 0 } ${t + 4}%, ${t + 17}% { opacity: 1 } ${t + 22}%, 100% { opacity: 0 } }`;
}).join("\n");

const css = `
.${A} { animation: 10s ease-in-out infinite; }
.${n("scene")} { animation-name: ${n("scene")}; }
@keyframes ${n("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${cellCss}
${anim(n("still1"), T(0) + 4, T(0) + 9, "stroke-dashoffset: 100; opacity: 0")}
${anim(n("still2"), T(0) + 9, T(0) + 16, "stroke-dashoffset: 100; opacity: 0")}
.${n("bar")} { transform-box: fill-box; transform-origin: center bottom; }
${anim(n("bar1"), T(1) + 4, T(1) + 10, "opacity: 0; transform: scaleY(0.05)")}
${anim(n("bar2"), T(1) + 8, T(1) + 14, "opacity: 0; transform: scaleY(0.05)")}
${anim(n("cross1"), T(2) + 5, T(2) + 9, "stroke-dashoffset: 100; opacity: 0")}
${anim(n("new1"), T(2) + 9, T(2) + 15, "opacity: 0; transform: translateX(26px)")}
${anim(n("cross2"), T(3) + 5, T(3) + 9, "stroke-dashoffset: 100; opacity: 0")}
${anim(n("new2"), T(3) + 9, T(3) + 15, "opacity: 0; transform: translateX(-14px)")}
`;

const draw = { pathLength: 100, strokeDasharray: 100, fill: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${n("scene")}`}>
        {CELLS.map((c, i) => {
          const { x, y } = c;
          const cx = x + CW / 2;
          return (
            <g key={c.chip} className={`${A} ${n("c" + i)}`}>
              <rect x={x} y={y} width={CW} height={CH} rx={10} fill="none" stroke={C.line} strokeWidth={1.5} />
              <rect className={`${A} ${n("h" + i)}`} x={x} y={y} width={CW} height={CH} rx={10} fill="none" stroke={C.primary} strokeWidth={2.5} />
              <rect x={x + 8} y={y + 5} width={c.cw} height={19} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
              <text x={x + 8 + c.cw / 2} y={y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
                {c.chip}
              </text>
              <text x={cx} y={y + 67} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
                {c.tag}
              </text>

              {i === 0 && (
                <g transform="translate(0 -4)">
                  <path d={`M${x + 70} ${y + 33} V${y + 54}`} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" />
                  <path
                    className={`${A} ${n("still1")}`}
                    d={`M${x + 14} ${y + 38} H${x + 64} L${x + 59} ${y + 34} L${x + 64} ${y + 38} L${x + 59} ${y + 42}`}
                    {...draw}
                    stroke={C.muted}
                    strokeWidth={2}
                  />
                  <path
                    className={`${A} ${n("still2")}`}
                    d={`M${x + 14} ${y + 49} H${x + 126} L${x + 120} ${y + 45} L${x + 126} ${y + 49} L${x + 120} ${y + 53}`}
                    {...draw}
                    stroke={C.primary}
                    strokeWidth={2.5}
                  />
                </g>
              )}

              {i === 1 && (
                <g transform="translate(0 -4)">
                  <path d={`M${x + 20} ${y + 54} H${x + 120}`} fill="none" stroke={C.line} strokeWidth={1.5} />
                  <rect className={`${A} ${n("bar")} ${n("bar1")}`} x={x + 34} y={y + 32} width={22} height={22} rx={3} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
                  <rect className={`${A} ${n("bar")} ${n("bar2")}`} x={x + 84} y={y + 44} width={22} height={10} rx={3} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
                </g>
              )}

              {i === 2 && (
                <g transform="translate(0 -4)">
                  <rect x={x + 22} y={y + 32} width={36} height={22} rx={4} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
                  <path className={`${A} ${n("cross1")}`} d={`M${x + 26} ${y + 35} L${x + 54} ${y + 51} M${x + 54} ${y + 35} L${x + 26} ${y + 51}`} {...draw} stroke={C.muted} strokeWidth={2} />
                  <rect className={`${A} ${n("new1")}`} x={x + 82} y={y + 32} width={36} height={22} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={2} />
                </g>
              )}

              {i === 3 && (
                <g transform="translate(0 -4)">
                  <rect x={x + 16} y={y + 32} width={40} height={20} rx={6} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
                  <path d={`M${x + 24} ${y + 52} l4 5 l4 -5`} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
                  <path d={`M${x + 36} ${y + 47} V${y + 37} M${x + 31} ${y + 41} L${x + 36} ${y + 36} L${x + 41} ${y + 41}`} fill="none" stroke={C.muted} strokeWidth={2} />
                  <path className={`${A} ${n("cross2")}`} d={`M${x + 20} ${y + 34} L${x + 52} ${y + 50} M${x + 52} ${y + 34} L${x + 20} ${y + 50}`} {...draw} stroke={C.bad} strokeWidth={2.5} />
                  <g className={`${A} ${n("new2")}`}>
                    <rect x={x + 84} y={y + 32} width={40} height={20} rx={6} fill={C.soft} stroke={C.primary} strokeWidth={2} />
                    <path d={`M${x + 112} ${y + 52} l4 5 l4 -5`} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
                    <path d={`M${x + 104} ${y + 37} V${y + 47} M${x + 99} ${y + 43} L${x + 104} ${y + 48} L${x + 109} ${y + 43}`} fill="none" stroke={C.primary} strokeWidth={2} />
                  </g>
                </g>
              )}
            </g>
          );
        })}
      </g>
    </Svg>
  );
}
