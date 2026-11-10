import katex from "katex";

// Renders text with $inline$ and $$display$$ math (KaTeX). A literal dollar sign is written as \$.
// Blank lines split paragraphs.

const MATH = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
const ESCAPED_DOLLAR = "\u0000";

function renderSegment(seg: string, key: number) {
  if (seg.startsWith("$$")) {
    const html = katex.renderToString(seg.slice(2, -2), { displayMode: true, throwOnError: false });
    return <span key={key} className="block overflow-x-auto py-1" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  if (seg.startsWith("$") && seg.length > 1) {
    const html = katex.renderToString(seg.slice(1, -1), { throwOnError: false });
    return <span key={key} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <span key={key}>{seg.replaceAll(ESCAPED_DOLLAR, "$")}</span>;
}

function renderInline(text: string) {
  return text.replaceAll("\\$", ESCAPED_DOLLAR).split(MATH).filter(Boolean).map(renderSegment);
}

export function MathText({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/);
  if (paragraphs.length === 1) return <span className={className}>{renderInline(text)}</span>;
  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>{renderInline(p)}</p>
      ))}
    </div>
  );
}
