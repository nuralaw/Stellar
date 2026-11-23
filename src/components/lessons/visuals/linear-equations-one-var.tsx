import { C, Css, Svg, Tex } from "./kit";

// Linear equations in one variable: an equation is a balance. Make the same move on both sides until x is alone.
export const alt = "3x + 2 = x + 8 on a balance: take x off both sides, then 2, then halve both sides. One x balances 3, so x = 3.";

const css = `
.v-linear-equations-one-var-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-linear-equations-one-var-scene { animation-name: v-linear-equations-one-var-scene; }
@keyframes v-linear-equations-one-var-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }

/* The equation line follows the balance: 3x + 2 = x + 8, then 2x + 2 = 8, then 2x = 6, then x = 3 */
.v-linear-equations-one-var-s0 { opacity: 0; animation-name: v-linear-equations-one-var-s0; }
@keyframes v-linear-equations-one-var-s0 { 0%, 19% { opacity: 1 } 21%, 100% { opacity: 0 } }
.v-linear-equations-one-var-s1 { opacity: 0; animation-name: v-linear-equations-one-var-s1; }
@keyframes v-linear-equations-one-var-s1 { 0%, 21% { opacity: 0 } 23%, 35% { opacity: 1 } 37%, 100% { opacity: 0 } }
.v-linear-equations-one-var-s2 { opacity: 0; animation-name: v-linear-equations-one-var-s2; }
@keyframes v-linear-equations-one-var-s2 { 0%, 37% { opacity: 0 } 39%, 51% { opacity: 1 } 53%, 100% { opacity: 0 } }
.v-linear-equations-one-var-s3 { animation-name: v-linear-equations-one-var-s3; }
@keyframes v-linear-equations-one-var-s3 { 0%, 53% { opacity: 0 } 55%, 100% { opacity: 1 } }
.v-linear-equations-one-var-pop { transform-box: view-box; transform-origin: 160px 60px; animation-name: v-linear-equations-one-var-pop; }
@keyframes v-linear-equations-one-var-pop { 0%, 59% { transform: scale(1) } 63% { transform: scale(1.14) } 68%, 100% { transform: scale(1) } }

/* The given equation stays above as a small note */
.v-linear-equations-one-var-given { animation-name: v-linear-equations-one-var-given; }
@keyframes v-linear-equations-one-var-given { 0%, 19% { opacity: 0; transform: translateY(8px) } 24%, 100% { opacity: 1; transform: none } }

/* The move, written under both sides: the newest one carries the accent */
.v-linear-equations-one-var-c1 { animation-name: v-linear-equations-one-var-c1; }
@keyframes v-linear-equations-one-var-c1 { 0%, 11% { opacity: 0; transform: translateY(4px) } 14%, 100% { opacity: 1; transform: none } }
.v-linear-equations-one-var-c2 { animation-name: v-linear-equations-one-var-c2; }
@keyframes v-linear-equations-one-var-c2 { 0%, 27% { opacity: 0; transform: translateY(4px) } 30%, 100% { opacity: 1; transform: none } }
.v-linear-equations-one-var-c3 { animation-name: v-linear-equations-one-var-c3; }
@keyframes v-linear-equations-one-var-c3 { 0%, 43% { opacity: 0; transform: translateY(4px) } 46%, 100% { opacity: 1; transform: none } }
.v-linear-equations-one-var-p1 { fill: ${C.fill}; animation-name: v-linear-equations-one-var-p1; }
@keyframes v-linear-equations-one-var-p1 { 0%, 27% { fill: ${C.soft} } 30%, 100% { fill: ${C.fill} } }
.v-linear-equations-one-var-p2 { fill: ${C.fill}; animation-name: v-linear-equations-one-var-p2; }
@keyframes v-linear-equations-one-var-p2 { 0%, 43% { fill: ${C.soft} } 46%, 100% { fill: ${C.fill} } }
.v-linear-equations-one-var-p3 { fill: ${C.fill}; animation-name: v-linear-equations-one-var-p3; }
@keyframes v-linear-equations-one-var-p3 { 0%, 59% { fill: ${C.soft} } 63%, 100% { fill: ${C.fill} } }
.v-linear-equations-one-var-t1 { animation-name: v-linear-equations-one-var-t1; }
@keyframes v-linear-equations-one-var-t1 { 0%, 27% { opacity: 1 } 30%, 100% { opacity: 0 } }
.v-linear-equations-one-var-m1 { animation-name: v-linear-equations-one-var-m1; }
@keyframes v-linear-equations-one-var-m1 { 0%, 27% { opacity: 0 } 30%, 100% { opacity: 1 } }
.v-linear-equations-one-var-t2 { animation-name: v-linear-equations-one-var-t2; }
@keyframes v-linear-equations-one-var-t2 { 0%, 43% { opacity: 1 } 46%, 100% { opacity: 0 } }
.v-linear-equations-one-var-m2 { animation-name: v-linear-equations-one-var-m2; }
@keyframes v-linear-equations-one-var-m2 { 0%, 43% { opacity: 0 } 46%, 100% { opacity: 1 } }
.v-linear-equations-one-var-t3 { animation-name: v-linear-equations-one-var-t3; }
@keyframes v-linear-equations-one-var-t3 { 0%, 59% { opacity: 1 } 63%, 100% { opacity: 0 } }
.v-linear-equations-one-var-m3 { animation-name: v-linear-equations-one-var-m3; }
@keyframes v-linear-equations-one-var-m3 { 0%, 59% { opacity: 0 } 63%, 100% { opacity: 1 } }

/* The pieces a move takes away light up with it ... */
.v-linear-equations-one-var-b1 { animation-name: v-linear-equations-one-var-b1; }
@keyframes v-linear-equations-one-var-b1 { 0%, 11% { fill: ${C.fill}; stroke: ${C.ink} } 14%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.v-linear-equations-one-var-x1 { animation-name: v-linear-equations-one-var-x1; }
@keyframes v-linear-equations-one-var-x1 { 0%, 11% { fill: ${C.ink} } 14%, 100% { fill: ${C.primaryText} } }
.v-linear-equations-one-var-d2 { animation-name: v-linear-equations-one-var-d2; }
@keyframes v-linear-equations-one-var-d2 { 0%, 27% { fill: ${C.muted} } 30%, 100% { fill: ${C.primary} } }
.v-linear-equations-one-var-b3 { animation-name: v-linear-equations-one-var-b3; }
@keyframes v-linear-equations-one-var-b3 { 0%, 43% { fill: ${C.fill}; stroke: ${C.ink} } 46%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.v-linear-equations-one-var-x3 { animation-name: v-linear-equations-one-var-x3; }
@keyframes v-linear-equations-one-var-x3 { 0%, 43% { fill: ${C.ink} } 46%, 100% { fill: ${C.primaryText} } }
.v-linear-equations-one-var-d3 { animation-name: v-linear-equations-one-var-d3; }
@keyframes v-linear-equations-one-var-d3 { 0%, 43% { fill: ${C.muted} } 46%, 100% { fill: ${C.primary} } }

/* ... then leave both sides together: x, then 2, then half */
.v-linear-equations-one-var-out1 { opacity: 0; animation-name: v-linear-equations-one-var-out1; }
@keyframes v-linear-equations-one-var-out1 { 0%, 15% { opacity: 1; transform: none } 22%, 100% { opacity: 0; transform: translateY(-12px) } }
.v-linear-equations-one-var-out2 { opacity: 0; animation-name: v-linear-equations-one-var-out2; }
@keyframes v-linear-equations-one-var-out2 { 0%, 31% { opacity: 1; transform: none } 38%, 100% { opacity: 0; transform: translateY(-12px) } }
.v-linear-equations-one-var-out3 { opacity: 0; animation-name: v-linear-equations-one-var-out3; }
@keyframes v-linear-equations-one-var-out3 { 0%, 47% { opacity: 1; transform: none } 54%, 100% { opacity: 0; transform: translateY(-12px) } }

/* What is left is the answer: it turns green */
.v-linear-equations-one-var-eqInk { animation-name: v-linear-equations-one-var-eqInk; }
@keyframes v-linear-equations-one-var-eqInk { 0%, 59% { opacity: 1 } 64%, 100% { opacity: 0 } }
.v-linear-equations-one-var-eqOk { animation-name: v-linear-equations-one-var-eqOk; }
@keyframes v-linear-equations-one-var-eqOk { 0%, 59% { opacity: 0 } 64%, 100% { opacity: 1 } }
.v-linear-equations-one-var-okInk { fill: ${C.good}; animation-name: v-linear-equations-one-var-okInk; }
@keyframes v-linear-equations-one-var-okInk { 0%, 59% { fill: ${C.ink} } 64%, 100% { fill: ${C.good} } }
.v-linear-equations-one-var-okBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-linear-equations-one-var-okBox; }
@keyframes v-linear-equations-one-var-okBox { 0%, 59% { fill: ${C.fill}; stroke: ${C.ink} } 64%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
.v-linear-equations-one-var-okDot { fill: ${C.good}; animation-name: v-linear-equations-one-var-okDot; }
@keyframes v-linear-equations-one-var-okDot { 0%, 59% { fill: ${C.muted} } 64%, 100% { fill: ${C.good} } }
`;

const A = "v-linear-equations-one-var-a v-linear-equations-one-var-";
const BEAM = 118; // top of the beam: everything on the balance rests on this line

/** An unknown: a box marked x. `box` and `ink` are the color classes of its outline and its letter. */
function X({ x, box, ink }: { x: number; box: string; ink: string }) {
  return (
    <>
      <rect className={A + box} x={x} y={BEAM - 24} width={24} height={24} rx={6} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
      <text className={A + ink} x={x + 12} y={BEAM - 7} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
        x
      </text>
    </>
  );
}

/** A unit: one dot = 1. Row 0 rests on the beam, row 1 on top of it. `dot` is its color class. */
function One({ x, row = 0, dot }: { x: number; row?: number; dot: string }) {
  return <circle className={A + dot} cx={x} cy={BEAM - 6 - row * 14} r={6} fill={C.muted} />;
}

/** The two sides of one line of the equation; its = sign sits above the pivot. */
function Sides({ l, r, y, size, color = C.ink }: { l: string; r: string; y: number; size: number; color?: string }) {
  return (
    <>
      <Tex x={160 - size * 0.75} y={y - size / 3} size={size + 1} anchor="end" width={110} color={color}>
        {l}
      </Tex>
      <Tex x={160 + size * 0.75} y={y - size / 3} size={size + 1} anchor="start" width={110} color={color}>
        {r}
      </Tex>
    </>
  );
}

/** A move, written under the left side and under the right side. */
function Move({ n, label }: { n: number; label: string }) {
  return (
    <g className={`v-linear-equations-one-var-a v-linear-equations-one-var-c${n}`}>
      {[17 + n * 34, 167 + n * 34].map((x) => (
        <g key={x}>
          <rect className={`v-linear-equations-one-var-a v-linear-equations-one-var-p${n}`} x={x - 15} y={132} width={30} height={18} rx={9} />
          <g className={`v-linear-equations-one-var-a v-linear-equations-one-var-t${n}`}>
            <Tex x={x} y={141} size={13} width={30} color={C.primaryText}>
              {label}
            </Tex>
          </g>
          <g className={`v-linear-equations-one-var-a v-linear-equations-one-var-m${n}`}>
            <Tex x={x} y={141} size={13} width={30} color={C.muted}>
              {label}
            </Tex>
          </g>
        </g>
      ))}
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-linear-equations-one-var-a v-linear-equations-one-var-scene">
        {/* The given equation, kept as a note once the solving starts */}
        <g className="v-linear-equations-one-var-a v-linear-equations-one-var-given" fontSize={13} fontWeight={600} fill={C.muted}>
          <Sides l="3x+2" r="x+8" y={38} size={13} color={C.muted} />
          <Tex x={160} y={38 - 4} size={14} width={20} color={C.muted}>
            =
          </Tex>
        </g>

        {/* The equation as it stands now */}
        <g className="v-linear-equations-one-var-a v-linear-equations-one-var-pop" fontSize={18} fontWeight={700} fill={C.ink}>
          <g className="v-linear-equations-one-var-a v-linear-equations-one-var-eqInk">
            <Tex x={160} y={60} size={19} width={20} color={C.ink}>
              =
            </Tex>
          </g>
          <g className="v-linear-equations-one-var-a v-linear-equations-one-var-eqOk">
            <Tex x={160} y={60} size={19} width={20} color={C.good}>
              =
            </Tex>
          </g>
          <g className="v-linear-equations-one-var-a v-linear-equations-one-var-s0">
            <Sides l="3x+2" r="x+8" y={66} size={18} />
          </g>
          <g className="v-linear-equations-one-var-a v-linear-equations-one-var-s1">
            <Sides l="2x+2" r="8" y={66} size={18} />
          </g>
          <g className="v-linear-equations-one-var-a v-linear-equations-one-var-s2">
            <Sides l="2x" r="6" y={66} size={18} />
          </g>
          <g className="v-linear-equations-one-var-a v-linear-equations-one-var-s3">
            <Sides l="x" r="3" y={66} size={18} color={C.good} />
          </g>
        </g>

        {/* The balance */}
        <rect x={30} y={BEAM} width={260} height={4} rx={2} fill={C.ink} />
        <path d="M160 123 L173 145 L147 145 Z" fill={C.fill} stroke={C.ink} strokeWidth={1.5} />

        {/* Left side: 3x + 2. Right side: x + 8. Grouped by the move that takes them away. */}
        <g className="v-linear-equations-one-var-a v-linear-equations-one-var-out1">
          <X x={101} box="b1" ink="x1" />
          <X x={173} box="b1" ink="x1" />
        </g>
        <g className="v-linear-equations-one-var-a v-linear-equations-one-var-out2">
          <One x={137} dot="d2" />
          <One x={137} row={1} dot="d2" />
          <One x={207} dot="d2" />
          <One x={207} row={1} dot="d2" />
        </g>
        <g className="v-linear-equations-one-var-a v-linear-equations-one-var-out3">
          <X x={45} box="b3" ink="x3" />
          <One x={221} row={1} dot="d3" />
          <One x={235} row={1} dot="d3" />
          <One x={249} row={1} dot="d3" />
        </g>

        {/* What stays: one x on the left, three on the right */}
        <X x={73} box="okBox" ink="okInk" />
        <One x={221} dot="okDot" />
        <One x={235} dot="okDot" />
        <One x={249} dot="okDot" />

        {/* The same three moves under both sides */}
        <Move n={1} label="-x" />
        <Move n={2} label="-2" />
        <Move n={3} label="\div 2" />
      </g>
    </Svg>
  );
}
