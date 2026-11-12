import type { Metadata } from "next";
import { VocabHome } from "@/components/vocab/VocabHome";
import { PAGE } from "@/lib/ui";
import { LISTS, getVocabSets, getVocabWords } from "@/lib/vocab";

export const metadata: Metadata = {
  title: "Vocabulary",
  description: "SAT vocabulary: 700 words that show up in SAT passages and the math terms, with flashcards and quizzes.",
};

export default function Page() {
  const sets = getVocabSets();
  const all = getVocabWords();
  // Where a search hit opens: the first set that has the word (a Must-know word opens in its SAT set if it has one).
  const home = new Map<string, string>();
  for (const s of sets) for (const w of s.words) if (!home.has(w.id)) home.set(w.id, s.id);
  return (
    <section className={PAGE}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Vocabulary</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {all.length} words that matter on the SAT. Flip through flashcards, quiz yourself on meaning and context, and watch what you know grow.
      </p>
      <VocabHome
        lists={LISTS}
        sets={sets.map((s) => ({ id: s.id, list: s.list, title: s.title, subtitle: s.subtitle, ids: s.words.map((w) => w.id) }))}
        words={all.map((w) => ({ id: w.id, word: w.word, pos: w.pos, def: w.def, set: home.get(w.id) ?? "" }))}
      />
    </section>
  );
}
