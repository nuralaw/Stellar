"use client";

import { useEffect, useRef, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import type { DesmosMove } from "@/lib/lesson-format";
import { loadDesmos, type DesmosCalculator } from "@/lib/desmos";
import { Lines } from "./Example";
import { inline } from "./Markdown";

// Desmos colors for graphs (the calculator stays white, like on the real test); the answer point uses our orange.
const COLORS = ["#2d70b3", "#c74440", "#388c46", "#6042a6"];
const ANSWER = "#ea580c";

/** What the student would type for a Desmos LaTeX expression (shown as keystrokes). */
export function keystrokes(latex: string): string {
  let s = latex;
  for (let k = 0; k < 4; k++) s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2").replace(/\\sqrt\{([^{}]*)\}/g, "sqrt($1)");
  return s
    .replace(/\\left|\\right/g, "")
    .replace(/\\le(q)?\b/g, "<=")
    .replace(/\\ge(q)?\b/g, ">=")
    .replace(/\\cdot|\\times/g, "*")
    .replace(/\\sim/g, "~")
    .replace(/\\pi/g, "pi")
    .replace(/\\theta/g, "theta")
    .replace(/\\(sin|cos|tan|ln|log)/g, "$1")
    .replace(/\^\{([^{}]*)\}/g, "^$1")
    .replace(/_\{([^{}]*)\}/g, "_$1")
    .replace(/\\/g, "")
    .replace(/\s+/g, "");
}

const fmt = (n: number) => String(Math.round(n * 1000) / 1000).replace("-", "−");

/** Shows at least the window asked for, with equal units on both axes (circles stay round, right angles right). */
function fit(c: DesmosCalculator, xmin: number, xmax: number, ymin: number, ymax: number) {
  const px = c.graphpaperBounds?.pixelCoordinates;
  if (!px?.width || !px?.height) return c.setMathBounds({ left: xmin, right: xmax, bottom: ymin, top: ymax });
  const unit = Math.max((xmax - xmin) / px.width, (ymax - ymin) / px.height);
  const cx = (xmin + xmax) / 2;
  const cy = (ymin + ymax) / 2;
  c.setMathBounds({ left: cx - (unit * px.width) / 2, right: cx + (unit * px.width) / 2, bottom: cy - (unit * px.height) / 2, top: cy + (unit * px.height) / 2 });
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** The text of a move for the no-Desmos fallback list. */
function describe(m: DesmosMove): string {
  switch (m.a) {
    case "type":
      return `Type \`${keystrokes(m.latex)}\``;
    case "point":
      return `Read the point (${fmt(m.x)}, ${fmt(m.y)})`;
    case "slider":
      return m.to === null ? `Make a slider ${m.name} = ${fmt(m.from)}` : `Drag ${m.name} from ${fmt(m.from)} to ${fmt(m.to)}`;
    case "zoom":
      return "Zoom to fit";
    case "table":
      return `Add a table: ${m.cols.map((c) => c.name).join(", ")}`;
    default:
      return "";
  }
}

/**
 * A Desmos walkthrough played on the real calculator: each move types an expression (keystrokes shown), drags a
 * slider, zooms or marks the answer point, with a short caption. Starts by itself; Replay runs it again. After it
 * ends the graph stays live, so the student can poke at it.
 */
export function DesmosDemo({ moves, prompt, label = "In Desmos", reveal = false }: { moves: DesmosMove[]; prompt?: string; label?: string; reveal?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);

  // Shown after a wrong answer: bring it into view so the student sees it start.
  useEffect(() => {
    if (reveal) box.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [reveal]);
  const calc = useRef<DesmosCalculator | null>(null);
  const token = useRef(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [at, setAt] = useState(-1);
  const [keys, setKeys] = useState("");
  const [done, setDone] = useState(false);
  const playRef = useRef<(() => Promise<void>) | null>(null);

  // Load Desmos, then start playing by itself.
  useEffect(() => {
    let alive = true;
    const tk = token;
    loadDesmos().then(
      (Desmos) => {
        if (!alive || !host.current) return;
        calc.current = Desmos.GraphingCalculator(host.current, {
          keypad: false,
          // On a phone the expression list would squeeze the graph to a strip; the keystroke chip shows the typing.
          expressions: host.current.clientWidth >= 560,
          settingsMenu: false,
          zoomButtons: false,
          expressionsTopbar: false,
          border: false,
          autosize: true,
          invertedColors: false,
          pointsOfInterest: true,
          trace: true,
        });
        setReady(true);
        void playRef.current?.();
      },
      () => alive && setFailed(true),
    );
    return () => {
      alive = false;
      tk.current++;
      calc.current?.destroy();
      calc.current = null;
    };
  }, []);

  const play = async () => {
    const c = calc.current;
    if (!c) return;
    const me = ++token.current;
    const still = () => me === token.current && calc.current === c;
    const calm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    c.setBlank();
    fit(c, -10, 10, -10, 10);
    setDone(false);
    setKeys("");
    let color = 0;
    for (let i = 0; i < moves.length; i++) {
      if (!still()) return;
      const m = moves[i];
      setAt(i);
      setKeys("");
      await sleep(calm ? 150 : 450);
      if (!still()) return;
      if (m.a === "type") {
        const typed = keystrokes(m.latex);
        if (!calm)
          for (let k = 1; k <= typed.length; k++) {
            if (!still()) return;
            setKeys(typed.slice(0, k));
            await sleep(55);
          }
        setKeys(typed);
        c.setExpression({ id: `m${i}`, latex: m.latex, color: COLORS[color++ % COLORS.length] });
        setTimeout(() => {
          const a = calc.current?.expressionAnalysis?.[`m${i}`];
          if (a?.isError) console.warn(`[desmos-demo] "${m.latex}": ${a.errorMessage ?? "error"}`);
        }, 600);
      } else if (m.a === "point") {
        // secret: drawn and labelled on the graph, but no editable row in the expression list
        c.setExpression({ id: `m${i}`, latex: `(${m.x},${m.y})`, color: ANSWER, label: `(${fmt(m.x)}, ${fmt(m.y)})`, showLabel: true, pointSize: 14, dragMode: "NONE", secret: true });
      } else if (m.a === "slider") {
        const to = m.to ?? m.from;
        const lo = Math.min(m.from, to);
        const hi = Math.max(m.from, to);
        const pad = Math.max(1, Math.ceil((hi - lo) / 2));
        const bounds = { min: String(Math.floor(lo - pad)), max: String(Math.ceil(hi + pad)), step: "" };
        setKeys(`${m.name}=${fmt(m.from).replace("−", "-")}`);
        c.setExpression({ id: `s_${m.name}`, latex: `${m.name}=${m.from}`, sliderBounds: bounds });
        if (m.to !== null && m.to !== m.from) {
          await sleep(calm ? 100 : 500);
          const t0 = performance.now();
          const dur = calm ? 1 : 1800;
          for (;;) {
            if (!still()) return;
            const p = Math.min(1, (performance.now() - t0) / dur);
            const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
            const v = p === 1 ? m.to : m.from + (m.to - m.from) * e;
            c.setExpression({ id: `s_${m.name}`, latex: `${m.name}=${Math.round(v * 100) / 100}` });
            if (p === 1) break;
            await sleep(40);
          }
        }
      } else if (m.a === "zoom") {
        fit(c, m.xmin, m.xmax, m.ymin, m.ymax);
      } else if (m.a === "table") {
        c.setExpression({
          id: `m${i}`,
          type: "table",
          columns: m.cols.map((col, j) => ({ latex: col.name, values: col.values.map(String), ...(j ? { color: COLORS[color++ % COLORS.length] } : {}) })),
        });
      }
      await sleep(calm ? 600 : m.a === "say" ? 1600 : 1500 + Math.min(1200, (m.caption?.length ?? 0) * 18));
    }
    if (still()) setDone(true);
  };

  useEffect(() => {
    playRef.current = play;
  });

  const move = at >= 0 ? moves[at] : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-start gap-3 border-b border-line bg-surface-2/40 px-4 py-3 sm:px-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">{label}</p>
          {prompt && (
            <div className="mt-1 text-[16px] leading-relaxed font-semibold text-ink">
              <Lines text={prompt} />
            </div>
          )}
          <div className="mt-1.5 flex min-h-12 flex-wrap items-center gap-x-3 gap-y-1">
            {keys && (
              <code className="rounded-md bg-surface px-2 py-1 font-mono text-[13px] text-ink ring-1 ring-line">
                {keys}
                {!done && move?.a === "type" && <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-ink" />}
              </code>
            )}
            {move?.caption && (
              <p key={at} className="lesson-in text-[15px] leading-snug text-ink">
                {inline(move.caption)}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => void play()}
          disabled={!ready}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-40"
          title="Play it again"
        >
          <Icon d={I.undo} className="h-4 w-4" />
          <span className="hidden sm:inline">Replay</span>
        </button>
      </div>
      {failed ? (
        <ol className="list-decimal space-y-1.5 py-4 pr-4 pl-9 text-[15px] leading-relaxed">
          {moves.map((m, i) => (
            <li key={i}>
              {describe(m) && <span className="font-medium">{inline(describe(m))}</span>}
              {m.caption && <span className="text-muted"> {inline(m.caption)}</span>}
            </li>
          ))}
        </ol>
      ) : (
        <div ref={box} className="relative h-[300px] bg-white sm:h-[320px]" data-calculator>
          {!ready && <p className="absolute inset-0 grid place-content-center text-sm text-neutral-500">Loading Desmos…</p>}
          <div ref={host} className="absolute inset-0" />
        </div>
      )}
      <div className="flex items-center gap-1.5 border-t border-line px-4 py-2.5" aria-hidden="true">
        {moves.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === at && !done ? "w-5 bg-primary" : i <= at ? "w-1.5 bg-primary/50" : "w-1.5 bg-line"}`} />
        ))}
        {done && <span className="lesson-in ml-auto text-xs font-medium text-muted">Your turn: the graph is live</span>}
      </div>
    </div>
  );
}
