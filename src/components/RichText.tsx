import { Fragment, type ReactNode } from "react";

// Renders question-bank text:
//  - blank lines → paragraphs, single newlines → line breaks
//  - <u>…</u> → underline
//  - math notation (when math=true): x^2, x^(n+1) → superscript; x_1, x_(n) → subscript;
//    sqrt( ) → √( ), cbrt( ) → ∛( ), root[n]( ) → ⁿ√( )

const SUPERSCRIPT_DIGITS: Record<string, string> = { "2": "²", "3": "³", "4": "⁴", n: "ⁿ" };

/** Index of the ")" matching the "(" at `open`, or -1. */
function matchParen(s: string, open: number) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")" && --depth === 0) return i;
  }
  return -1;
}

function formatMath(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = "";
  let key = 0;
  const flush = () => {
    if (buf) out.push(buf);
    buf = "";
  };

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    // ^ / _ followed by (group) or a simple token
    if ((ch === "^" || ch === "_") && i + 1 < s.length) {
      let inner: string | null = null;
      let end = i;
      if (s[i + 1] === "(") {
        const close = matchParen(s, i + 1);
        if (close > 0) {
          inner = s.slice(i + 2, close);
          end = close;
        }
      } else {
        // Without parentheses the exponent is a number (x^2, x^-1, 1.5^0.5) or a single letter (e^x).
        const m = s.slice(i + 1).match(/^-?(\d+(\.\d+)?|[A-Za-z])/);
        if (m) {
          inner = m[0];
          end = i + inner.length;
        }
      }
      if (inner !== null && inner !== "") {
        flush();
        const Tag = ch === "^" ? "sup" : "sub";
        out.push(<Tag key={key++}>{formatMath(inner)}</Tag>);
        i = end;
        continue;
      }
    }

    // sqrt( ), cbrt( ), root[n]( )
    const rest = s.slice(i);
    const root = rest.match(/^(sqrt|cbrt|root\[(\w+)\])\(/);
    if (root) {
      const open = i + root[0].length - 1;
      const close = matchParen(s, open);
      if (close > 0) {
        flush();
        const sign = root[1] === "sqrt" ? "√" : root[1] === "cbrt" ? "∛" : `${SUPERSCRIPT_DIGITS[root[2]] ?? root[2]}√`;
        out.push(
          <Fragment key={key++}>
            {sign}
            <span className="border-t border-current">({formatMath(s.slice(open + 1, close))})</span>
          </Fragment>,
        );
        i = close;
        continue;
      }
    }

    buf += ch;
  }
  flush();
  return out;
}

function formatInline(text: string, math: boolean): ReactNode[] {
  // Split on <u>…</u>, then format each piece; line breaks become <br>.
  return text.split(/(<u>[\s\S]*?<\/u>)/g).flatMap((part, i) => {
    const underline = part.startsWith("<u>") && part.endsWith("</u>");
    const body = underline ? part.slice(3, -4) : part;
    const lines = body.split("\n").flatMap((line, j) => [
      ...(j > 0 ? [<br key={`br${i}-${j}`} />] : []),
      <Fragment key={`l${i}-${j}`}>{math ? formatMath(line) : line}</Fragment>,
    ]);
    return underline ? [<u key={`u${i}`} className="decoration-2 underline-offset-2">{lines}</u>] : lines;
  });
}

export function RichText({ text, math = false, className = "" }: { text: string; math?: boolean; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/);
  if (paragraphs.length === 1) return <span className={className}>{formatInline(text, math)}</span>;
  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>{formatInline(p, math)}</p>
      ))}
    </div>
  );
}
