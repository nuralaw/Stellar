import { Fragment, type ReactNode } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { formatMath } from "@/components/RichText";
import { TOKEN_RE } from "@/lib/lesson-format";

// Renders the small Markdown subset used by lessons (content/lessons/README.md):
// ## / ### headings, paragraphs, - bullets, 1. numbered lists, tables, > **Label:** callouts,
// **bold**, *italic*, `code`, [links](https://…), formulas \( … \) / \[ … \] (KaTeX), and, outside formulas,
// older math notation in text (x^2, 2^(x+1), x_1, sqrt(x)).

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[`*_[\]()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ---------------- math (KaTeX) ---------------- */

// Formulas are written \( … \) (inline) and \[ … \] (display), always on one line. Not $…$: money like $12 stays text.
// A line that is only \[ … \] is a centered block; anywhere else (examples, quiz options, list items, mid-sentence)
// \[ … \] is set in display style (big fractions) but stays inline. `code spans` stay raw: no formula inside them.

/** A line that is only one display formula. */
const DISPLAY_LINE = /^\\\[((?:(?!\\\]).)+)\\\]$/;

const texCache = new Map<string, string | null>();

/** KaTeX HTML (with MathML for screen readers) for a formula, or null when KaTeX can't render it. */
function renderTex(tex: string, displayMode: boolean): string | null {
  const key = (displayMode ? "D" : "I") + tex;
  const hit = texCache.get(key);
  if (hit !== undefined) return hit;
  let html: string | null;
  try {
    html = katex.renderToString(tex, { displayMode, throwOnError: true, strict: "ignore", output: "htmlAndMathml" });
    // Commands KaTeX doesn't trust (\href, \url, \includegraphics, \htmlId) come out red instead of throwing.
    if (html.includes("#cc0000")) html = null;
  } catch {
    html = null;
  }
  texCache.set(key, html);
  return html;
}

export function Tex({ tex, display = false, block = false }: { tex: string; display?: boolean; block?: boolean }) {
  // Inside a sentence "display" means display style without the block layout.
  const html = renderTex(!block && display ? `\\displaystyle ${tex}` : tex, block);
  if (html === null) return <code className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-ink">{tex}</code>;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/** A title or label as plain text (for title="" / aria-label): the formulas lose their delimiters. */
export function plain(text: string): string {
  return text.replace(TOKEN_RE, (m, a?: string, b?: string) => a ?? b ?? m);
}

/* ---------------- inline ---------------- */

const INLINE = /(\*\*(?:[^*]|\*(?!\*))+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g;

type Formula = { tex: string; display: boolean };
// A formula is swapped for a placeholder (private-use characters) before the Markdown patterns run, so its content is
// never read as ** * or `.
const OPEN = "";
const CLOSE = "";
const PLACEHOLDER = /(\d+)/;

function renderText(part: string, f: Formula[]): ReactNode[] {
  return part.split(/(\d+)/).map((seg, i) => {
    const m = seg.match(PLACEHOLDER);
    const formula = m ? f[+m[1]] : undefined;
    if (formula) return <Tex key={i} tex={formula.tex} display={formula.display} />;
    return seg ? <Fragment key={i}>{formatMath(seg)}</Fragment> : null;
  });
}

function render(text: string, f: Formula[]): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold text-ink">{render(part.slice(2, -2), f)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
          {part.slice(1, -1)}
        </code>
      );
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const external = /^https?:\/\//.test(link[2]);
      return (
        <a key={i} href={link[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-medium text-primary-strong underline-offset-2 hover:underline">
          {renderText(link[1], f)}
        </a>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{render(part.slice(1, -1), f)}</em>;
    return <Fragment key={i}>{renderText(part, f)}</Fragment>;
  });
}

export function inline(text: string): ReactNode[] {
  const formulas: Formula[] = [];
  // One pass: code spans stay as they are (so a `\(` and a `\)` in two code spans never pair up), formulas are masked.
  const masked = text.replace(TOKEN_RE, (raw, a?: string, b?: string) => {
    if (a === undefined && b === undefined) return raw;
    formulas.push({ tex: (a ?? b ?? "").trim(), display: a === undefined });
    return `${OPEN}${formulas.length - 1}${CLOSE}`;
  });
  return render(masked, formulas);
}

/* ---------------- blocks ---------------- */

type Block =
  | { t: "h2" | "h3" | "p"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "quote"; lines: string[] }
  | { t: "pre"; text: string }
  | { t: "math"; tex: string };

// Table cells split on "|" outside formulas and `code spans` (so \(|x - 3|\) stays in one cell).
const BAR = "\u0001";
const cells = (line: string) =>
  line
    .trim()
    .replace(TOKEN_RE, (m) => m.replaceAll("|", BAR))
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim().replaceAll(BAR, "|"));

export function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (!t) {
      i++;
      continue;
    }
    const display = t.match(DISPLAY_LINE);
    if (display) {
      out.push({ t: "math", tex: display[1].trim() });
      i++;
      continue;
    }
    if (t.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) buf.push(lines[i++]);
      i++;
      out.push({ t: "pre", text: buf.join("\n") });
      continue;
    }
    if (t.startsWith("### ")) {
      out.push({ t: "h3", text: t.slice(4) });
      i++;
      continue;
    }
    if (t.startsWith("## ")) {
      out.push({ t: "h2", text: t.slice(3) });
      i++;
      continue;
    }
    if (t.startsWith("#")) {
      // A stray "# Title": the page already shows the title.
      i++;
      continue;
    }
    if (t.startsWith("|") && lines[i + 1]?.trim().match(/^\|?\s*:?-{2,}/)) {
      const head = cells(t);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out.push({ t: "table", head, rows });
      continue;
    }
    if (t.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) buf.push(lines[i++].trim().replace(/^>\s?/, ""));
      out.push({ t: "quote", lines: buf });
      continue;
    }
    if (/^[-*]\s+/.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
        // continuation lines (indented, not a new item)
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i])) items[items.length - 1] += " " + lines[i++].trim();
      }
      out.push({ t: "ul", items });
      continue;
    }
    if (/^\d+[.)]\s+/.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i])) items[items.length - 1] += " " + lines[i++].trim();
      }
      out.push({ t: "ol", items });
      continue;
    }
    const buf: string[] = [t];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|>|[-*]\s|\d+[.)]\s|\||```)/.test(lines[i].trim()) && !DISPLAY_LINE.test(lines[i].trim())) buf.push(lines[i++].trim());
    // A single newline inside a paragraph is kept (e.g. the two equations of a system, one per line).
    out.push({ t: "p", text: buf.join("\n") });
  }
  return out;
}

const CALLOUT: Record<string, string> = {
  tip: "border-success/40 bg-success-soft/60",
  trap: "border-danger/40 bg-danger-soft/60",
  warning: "border-danger/40 bg-danger-soft/60",
};

function Callout({ lines }: { lines: string[] }) {
  const text = lines.join(" ");
  const label = text.match(/^\*\*([^*:]+):?\*\*:?/)?.[1]?.toLowerCase().trim() ?? "";
  const tone = CALLOUT[label] ?? "border-primary/40 bg-primary-soft/50";
  return <div className={`my-5 rounded-xl border-l-4 px-4 py-3 text-[15px] leading-relaxed ${tone}`}>{inline(text)}</div>;
}

/** A step's teaching text. */
export function Markdown({ source }: { source: string }) {
  return (
    <div className="text-[16px] leading-[1.75] text-ink/90">
      <Blocks blocks={parseBlocks(source)} />
    </div>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h2":
            return (
              <h2 key={i} id={slugify(b.text)} className="mt-12 mb-4 scroll-mt-24 border-t border-line pt-8 text-2xl font-bold tracking-tight text-ink first:mt-0 first:border-0 first:pt-0">
                {inline(b.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-8 mb-3 text-lg font-semibold text-ink">
                {inline(b.text)}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="my-4">
                {b.text.split("\n").map((line, j) => (
                  <Fragment key={j}>
                    {j > 0 && <br />}
                    {inline(line)}
                  </Fragment>
                ))}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="my-4 space-y-2 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden="true" />
                    <span className="min-w-0">{inline(it)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="my-4 space-y-2.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary-strong tabular-nums">{j + 1}</span>
                    <span className="min-w-0">{inline(it)}</span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="my-5 overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-[14px] leading-snug">
                  <thead className="bg-surface-2/70">
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} className="px-3.5 py-2.5 font-semibold text-ink">
                          {inline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-t border-line">
                        {r.map((c, k) => (
                          <td key={k} className="px-3.5 py-2.5 align-top">
                            {inline(c)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "quote":
            return <Callout key={i} lines={b.lines} />;
          case "math":
            return (
              <div key={i} className="math-block my-5">
                <Tex tex={b.tex} block />
              </div>
            );
          case "pre":
            return (
              <pre key={i} className="my-5 overflow-x-auto rounded-xl bg-surface-2 px-4 py-3 font-mono text-[14px]">
                {b.text}
              </pre>
            );
        }
      })}
    </>
  );
}
