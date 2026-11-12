import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VocabSetView } from "@/components/vocab/VocabSetView";
import { PAGE } from "@/lib/ui";
import { LISTS, getVocabSet, getVocabSets } from "@/lib/vocab";

// Shared by /vocabulary/<set> (word list) and /vocabulary/<set>/cards (opens on the flashcards).

export function setStaticParams() {
  return getVocabSets().map((s) => ({ set: s.id }));
}

export function setMetadata(id: string): Metadata {
  const s = getVocabSet(id);
  return s ? { title: `${s.title} — Vocabulary`, description: `${s.words.length} SAT words: ${s.subtitle}` } : { title: "Vocabulary" };
}

export function SetPage({ id, mode }: { id: string; mode: "words" | "cards" }) {
  const s = getVocabSet(id);
  if (!s) notFound();
  const sets = getVocabSets();
  const after = sets[sets.findIndex((x) => x.id === s.id) + 1];
  return (
    <section className={PAGE}>
      <VocabSetView
        startMode={mode}
        next={after && after.list === s.list ? { id: after.id, title: after.title } : null}
        set={{
          id: s.id,
          title: s.title,
          list: LISTS.find((l) => l.id === s.list)?.label ?? "",
          words: s.words.map(({ id, word, pos, def, example, form, syn, with: w }) => ({ id, word, pos, def, example, form, syn, ...(w ? { with: w } : {}) })),
        }}
      />
    </section>
  );
}
