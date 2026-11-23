import { C, Css, Svg, Tex } from "./kit";

// Solve for C in F = (9/5)C + 32: the same balance moves, undone in reverse order, F treated like a number.
export const alt =
  "F = 9/5 C + 32 solved for C. C is wrapped first by times 9/5, then by plus 32, so undo in reverse order: subtract 32 from both sides, then multiply both sides by 5/9. C = 5/9 (F − 32), not 5/9 F − 32.";

const P = "v-linear-equations-one-var--rearrange-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const span = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 4}%, ${t1}% { opacity: 1 } ${t1 + 4}%, 100% { opacity: 0 }`, "opacity: 0;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 3%, 95% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("top", 3),
  span("l1", 8, 22),
  // the diagram steps aside for the rejected answer, then returns
  r("dgm", "0%, 12% { opacity: 0 } 16%, 72% { opacity: 1 } 76%, 88% { opacity: 0 } 92%, 100% { opacity: 1 }"),
  pop("l2", 26),
  pop("mv1", 34),
  pop("la", 38),
  // peeling the outer layer, then the inner one
  r("out", "0%, 36% { stroke: " + C.ink + " } 41%, 100% { stroke: " + C.line + " }"),
  r("outT", "0%, 36% { opacity: 1 } 41%, 100% { opacity: 0 }"),
  r("outM", "0%, 36% { opacity: 0 } 41%, 100% { opacity: 1 }"),
  pop("mv2", 52),
  pop("lb", 56),
  r("inn", "0%, 54% { stroke: " + C.ink + " } 59%, 100% { stroke: " + C.line + " }"),
  r("innT", "0%, 54% { opacity: 1 } 59%, 100% { opacity: 0 }"),
  r("innM", "0%, 54% { opacity: 0 } 59%, 100% { opacity: 1 }"),
  r("grpI", "0%, 62% { opacity: 1 } 66%, 100% { opacity: 0 }"),
  r("grpA", "0%, 62% { opacity: 0 } 66%, 100% { opacity: 1 }"),
  span("wrong", 74, 86),
].join("\n");

const lab = { stroke: "none" } as const;
const T = (x: number, y: number, s: string, o: { anchor?: "start" | "middle" | "end"; color?: string; size?: number; w?: number } = {}) => (
  <Tex x={x} y={y} size={o.size ?? 16} anchor={o.anchor ?? "middle"} width={o.w ?? 100} color={o.color ?? C.ink}>
    {s}
  </Tex>
);

// An equation as parts; each layer shows some parts and keeps the rest as invisible spacers, so layers line up exactly.
const layer = (parts: string[], show: number[]) => parts.map((p, i) => (show.includes(i) ? p : String.raw`\phantom{${p}}`)).join("");
const TOP = ["F", "=", String.raw`\dfrac{9}{5}`, "C", "+32"];
const LA = ["F-32", String.raw`=\dfrac{9}{5}C`];
const LB = [String.raw`C=\dfrac{5}{9}`, "(F-32)"];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* 1. F = 9/5 C + 32: C is the target, F is just a number */}
        <g className={cls("top")}>
          {T(82, 36, layer(TOP, [1, 2, 4]), { size: 20, w: 150 })}
          {T(82, 36, layer(TOP, [0]), { size: 20, w: 150, color: C.muted })}
          {T(82, 36, layer(TOP, [3]), { size: 20, w: 150, color: C.primaryText })}
        </g>
        <text className={cls("l1")} x={82} y={72} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} {...lab}>
          treat F like a number
        </text>
        <text className={cls("l2")} x={82} y={72} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} {...lab}>
          undo in reverse order
        </text>

        {/* 2. the layers around C, peeled from the outside */}
        <g className={cls("dgm")}>
          <rect className={cls("out")} x={16} y={82} width={132} height={74} rx={12} fill={C.fill} stroke={C.line} strokeWidth={2} />
          <rect className={cls("inn")} x={34} y={104} width={96} height={44} rx={10} fill={C.bg} stroke={C.line} strokeWidth={2} />
          <rect x={66} y={126} width={32} height={18} rx={6} fill={C.primary} />
          <text x={82} y={139} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.onPrimary} {...lab}>
            C
          </text>
          <g className={cls("outT")}>{T(82, 94, "+32", { size: 15, w: 70, color: C.ink })}</g>
          <g className={cls("outM")}>{T(82, 94, "+32", { size: 15, w: 70, color: C.muted })}</g>
          <g className={cls("innT")}>{T(82, 115, String.raw`\times 9/5`, { size: 15, w: 80, color: C.ink })}</g>
          <g className={cls("innM")}>{T(82, 115, String.raw`\times 9/5`, { size: 15, w: 80, color: C.muted })}</g>
        </g>
        {/* the rejected answer takes the diagram's place for a moment */}
        <g className={cls("wrong")}>
          {T(82, 108, String.raw`C=\dfrac{5}{9}F-32`, { size: 16, w: 130, color: C.bad })}
          <path d="M 72 134 L 92 152 M 92 134 L 72 152" stroke={C.bad} strokeWidth={3} />
        </g>

        {/* 3. undo +32, then times 9/5, on both sides */}
        <g className={cls("mv1")}>{T(168, 24, String.raw`-32\text{ both sides}`, { size: 13, anchor: "start", w: 140, color: C.primaryText })}</g>
        <g className={cls("la")}>
          {T(168, 60, layer(LA, [1]), { size: 17, w: 140, anchor: "start" })}
          {T(168, 60, layer(LA, [0]), { size: 17, w: 140, anchor: "start", color: C.primaryText })}
        </g>
        <g className={cls("mv2")}>{T(168, 98, String.raw`\times 5/9\text{ both sides}`, { size: 13, anchor: "start", w: 140, color: C.primaryText })}</g>
        <g className={cls("lb")}>
          {T(168, 136, layer(LB, [0]), { size: 17, w: 140, anchor: "start" })}
          <g className={cls("grpI")}>{T(168, 136, layer(LB, [1]), { size: 17, w: 140, anchor: "start" })}</g>
          <g className={cls("grpA")}>{T(168, 136, layer(LB, [1]), { size: 17, w: 140, anchor: "start", color: C.primaryText })}</g>
        </g>
      </g>
    </Svg>
  );
}
