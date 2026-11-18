import { C, Css, Svg } from "./kit";

// Factoring x² + 5x + 6: the tiles x², five x-strips and six 1-squares fit into a rectangle (x + 3) by (x + 2).
export const alt =
  "Tiles for x² + 5x + 6 snap together into a rectangle that is x + 3 wide and x + 2 tall. So x² + 5x + 6 = (x + 2)(x + 3), because 2 × 3 = 6 and 2 + 3 = 5.";

const P = "v-equivalent-expressions--tiles-";
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
// Tiles start scattered and slide to their place between 20% and 44%.
const slide = (i: number, dx: number, dy: number) => {
  const n = `${P}s${i}`;
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} {
  0%, 6% { transform: translate(${dx}px, ${dy}px); opacity: 0 }
  10% { transform: translate(${dx}px, ${dy}px); opacity: 1 }
  44%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: none; opacity: 0 }
}`;
};
const OFF: [number, number][] = [
  [-30, -10],
  [60, -18],
  [40, 26],
  [-22, 34],
  [70, 8],
  [-12, -22],
  [28, -30],
  [-40, 6],
];
const css = `
.v-equivalent-expressions--tiles-a { animation: 9s ease-in-out infinite; }
${[4, 46, 58, 72].map(fade).join("\n")}
${OFF.map(([dx, dy], i) => slide(i, dx, dy)).join("\n")}
`;
const a = `${P}a`;
const sc = (i: number) => `${P}s${i}`;

// Unit u = 16 px, x = 48 px. Rectangle at (60, 40): width x + 3u = 96, height x + 2u = 80.
const OX = 60;
const OY = 40;
const U = 16;
const XS = 48;

export default function Visual() {
  const strokeW = 1.5;
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The x² tile */}
      <g className={`${a} ${sc(0)}`}>
        <rect x={OX} y={OY} width={XS} height={XS} fill={C.soft} stroke={C.primary} strokeWidth={strokeW} />
        <text x={OX + XS / 2} y={OY + XS / 2 + 5} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink}>
          x²
        </text>
      </g>

      {/* Three vertical x-strips (the right side) */}
      {[0, 1, 2].map((k) => (
        <g key={`v${k}`} className={`${a} ${sc(1 + k)}`}>
          <rect x={OX + XS + k * U} y={OY} width={U} height={XS} fill={C.goodSoft} stroke={C.good} strokeWidth={strokeW} />
          <text x={OX + XS + k * U + U / 2} y={OY + XS / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            x
          </text>
        </g>
      ))}

      {/* Two horizontal x-strips (the bottom) */}
      {[0, 1].map((k) => (
        <g key={`h${k}`} className={`${a} ${sc(4 + k)}`}>
          <rect x={OX} y={OY + XS + k * U} width={XS} height={U} fill={C.goodSoft} stroke={C.good} strokeWidth={strokeW} />
          <text x={OX + XS / 2} y={OY + XS + k * U + U / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            x
          </text>
        </g>
      ))}

      {/* Six 1-squares fill the corner: 3 across, 2 down */}
      <g className={`${a} ${sc(6)}`}>
        {[0, 1, 2].map((i) =>
          [0, 1].map((j) => (
            <rect key={`${i}${j}`} x={OX + XS + i * U} y={OY + XS + j * U} width={U} height={U} fill={C.fill} stroke={C.muted} strokeWidth={strokeW} />
          )),
        )}
      </g>

      {/* Side lengths */}
      <g className={`${a} ${fc(46)}`}>
        <text x={OX + (XS + 3 * U) / 2} y={OY - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primary}>
          x + 3
        </text>
        <text x={OX - 8} y={OY + (XS + 2 * U) / 2 + 4} textAnchor="end" fontSize={13} fontWeight={700} fill={C.primary}>
          x + 2
        </text>
      </g>

      {/* The result */}
      <g className={`${a} ${fc(58)}`}>
        <text x={176} y={72} fontSize={15} fontWeight={600} fill={C.muted}>
          x² + 5x + 6
        </text>
        <text x={176} y={100} fontSize={15} fontWeight={700} fill={C.good}>
          = (x + 2)(x + 3)
        </text>
      </g>
      <g className={`${a} ${fc(72)}`}>
        <text x={160} y={152} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primary}>
          2 × 3 = 6 and 2 + 3 = 5
        </text>
      </g>
    </Svg>
  );
}
