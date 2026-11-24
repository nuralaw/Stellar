/** A word's example sentence with the word's form highlighted (or a blank in its place). Server-safe: no hooks, no browser APIs. */
export function Example({ w, blank = false }: { w: { example: string; form: string }; blank?: boolean }) {
  const i = w.example.toLowerCase().indexOf(w.form.toLowerCase());
  if (i < 0) return <>{w.example}</>;
  return (
    <>
      {w.example.slice(0, i)}
      {blank ? (
        <span className="mx-0.5 inline-block w-20 border-b-2 border-primary align-baseline" aria-label="blank" />
      ) : (
        <strong className="font-semibold text-primary-strong">{w.example.slice(i, i + w.form.length)}</strong>
      )}
      {w.example.slice(i + w.form.length)}
    </>
  );
}
