// What a student types into Desmos for a lesson's Desmos LaTeX, and the LaTeX we actually send to the calculator.
// No imports (the lesson checker runs this file directly with Node).
//
// Typing differs from LaTeX in four ways that matter (sat-lessons/research/math-algebra-systems-desmos.md):
//   - a fraction keeps everything typed after "/" in its denominator until the right arrow (→) is pressed:
//     \frac{2}{5}x+3 is typed 2/5→x+3, not 2/5x+3 (that would be 2/(5x+3));
//   - an exponent keeps what follows it until an operator (+ − = …) or →: x^{2}y is typed x^2→y;
//   - typing "sqrt" opens the radical at once and everything after it stays inside until →: \sqrt{x}+1 is typed
//     sqrt x→+1 (typing "sqrt(" would add a literal bracket). Where several structures end together (1/x^2 then +1),
//     one → is typed per open structure: 1/x^2→→+1;
//   - a digit typed right after a letter becomes a subscript by itself, so x_{1} is typed x1 (typing the underscore
//     keeps the cursor in the subscript, and a "~" typed there is an error): y_{1}\sim mx_{1}+b is y1~mx1+b.

const ARROW = "→";

/** Statistics functions Desmos writes as \operatorname{name}; lessons may write them as \name. */
const OPERATORNAMES = ["mean", "median", "stdev", "stdevp", "var", "varp", "total", "quartile", "mad", "corr", "cov", "covp", "count"];

/** The LaTeX handed to Desmos: \mean(L) becomes \operatorname{mean}(L), which Desmos reads. */
export function desmosLatex(latex: string): string {
  return latex.replace(new RegExp(`\\\\(${OPERATORNAMES.join("|")})(?![a-zA-Z])`, "g"), "\\operatorname{$1}");
}

const COMMANDS: Record<string, string> = {
  sim: "~",
  pi: "pi",
  theta: "theta",
};

/** Commands that are operators: they end an exponent or subscript by themselves. */
const OPERATORS: Record<string, string> = {
  le: "<=",
  leq: "<=",
  ge: ">=",
  geq: ">=",
  cdot: "*",
  times: "*",
  ne: "!=",
  neq: "!=",
};

/** The text of the brace group starting at s[i] === "{", and the index after its closing brace. */
function group(s: string, i: number): [string, number] {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === "{") depth++;
    else if (s[j] === "}" && --depth === 0) return [s.slice(i + 1, j), j + 1];
  }
  return [s.slice(i + 1), s.length];
}

/** One argument: a brace group, or a single character (\frac12, x^2). */
function arg(s: string, i: number): [string, number] {
  while (s[i] === " ") i++;
  if (s[i] === "{") return group(s, i);
  return [s.slice(i, i + 1), i + 1];
}

const simple = (t: string) => /^(?:\d+\.?\d*|\.\d+|[A-Za-z])$/.test(t);
const wrapped = (t: string) => {
  if (!t.startsWith("(") || !t.endsWith(")")) return false;
  let depth = 0;
  for (let j = 0; j < t.length; j++) {
    if (t[j] === "(") depth++;
    else if (t[j] === ")" && --depth === 0 && j < t.length - 1) return false;
  }
  return true;
};

type Open = "frac" | "exp" | "sqrt";

/**
 * Translates LaTeX to keystrokes. Returns the text and the structures still open at its end (a denominator, a radical,
 * an exponent or subscript): each needs one → before anything more is typed, except that an operator leaves a
 * trailing exponent by itself.
 */
function conv(s: string): [string, Open[]] {
  let out = "";
  let open: Open[] = [];
  // Called before every token: close what is open. Only exponents/subscripts end by themselves, and only at an operator.
  const close = (operator: boolean) => {
    if (open.length && !(operator && open.every((k) => k === "exp"))) out += ARROW.repeat(open.length);
    open = [];
  };
  for (let i = 0; i < s.length; ) {
    const c = s[i];
    if (c === "\\") {
      const name = s.slice(i + 1).match(/^[a-zA-Z]+/)?.[0] ?? "";
      if (!name) {
        i += 2; // "\ " "\," "\;": spacing only
        continue;
      }
      i += 1 + name.length;
      if (name === "frac" || name === "dfrac") {
        close(false);
        const [a, ia] = arg(s, i);
        const [b, ib] = arg(s, ia);
        i = ib;
        const [n, ns] = conv(a);
        const [d, ds] = conv(b);
        const num = n + (ns.length && !ns.every((k) => k === "exp") ? ARROW.repeat(ns.length) : "");
        out += `${simple(num) || wrapped(num) ? num : `(${num})`}/${d}`;
        open = ["frac", ...ds];
      } else if (name === "sqrt") {
        close(false);
        const [a, ia] = arg(s, i);
        i = ia;
        const [t, ts] = conv(a);
        // typing "sqrt" opens the radical at once (a "(" would be a literal bracket inside it)
        out += `sqrt ${t}`;
        open = ["sqrt", ...ts];
      } else if (name === "right") {
        close(true);
      } else if (name === "left") {
        // nothing: the bracket that follows is typed as itself
      } else if (name in OPERATORS) {
        close(true);
        out += OPERATORS[name];
      } else {
        close(false);
        if (name === "operatorname") {
          const [a, ia] = arg(s, i);
          i = ia;
          out += a;
        } else out += COMMANDS[name] ?? name;
      }
    } else if (c === "^" || c === "_") {
      const [a, ia] = arg(s, i + 1);
      i = ia;
      const [inner, is] = conv(a);
      const prev = out.slice(-1);
      if (c === "_" && !open.length && /[A-Za-z]/.test(prev) && /^\d+$/.test(inner)) out += inner; // x_{1} → x1
      else if (/^[A-Za-z0-9.]+$/.test(inner)) {
        // an exponent/subscript directly after an open exponent would nest: leave it first
        if (open.length) close(false);
        out += c + inner;
        open = ["exp"];
      } else {
        if (open.length) close(false);
        out += `${c}(${inner}${is.length && !is.every((k) => k === "exp") ? ARROW.repeat(is.length) : ""})`;
        open = ["exp"];
      }
    } else if (c === "{" || c === "}" || /\s/.test(c)) i++;
    else {
      // an operator, bracket or comma ends an exponent by itself; anything else (letter, digit, "(") is typed inside it
      close(/[+\-=<>,)\]*|]/.test(c));
      out += c;
      i++;
    }
  }
  return [out, open];
}

/** What the student would type for a Desmos LaTeX expression (shown as keystrokes; → is the right arrow key). */
export function keystrokes(latex: string): string {
  return conv(latex)[0];
}
