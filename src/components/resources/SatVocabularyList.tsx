import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BTN_QUIET } from "@/components/plus/styles";
import { Example } from "@/components/vocab/Example";
import { breadcrumbJsonLd, type Crumb } from "@/lib/breadcrumbs";
import { OG_BASE } from "@/lib/site";
import { PAGE } from "@/lib/ui";
import { LISTS, getVocabSets, type VocabList, type VocabSet, type VocabWord } from "@/lib/vocab";
import { MoreTools } from "./MoreTools";
import { ResourceCta } from "./ResourceCta";
import { H1, H2, LEAD, SECTION } from "./styles";

// The public vocabulary pages (/sat-vocabulary, /sat-vocabulary/advanced, /sat-vocabulary/math-terms): the same sets as the
// app's /vocabulary, as plain server HTML (no client component per word). Text is plain text: "$" is a dollar sign here.

const PATHS: Record<VocabList, string> = { core: "/sat-vocabulary", power: "/sat-vocabulary/advanced", math: "/sat-vocabulary/math-terms" };
const HOME = "/sat-vocabulary";

const name = (w: Pick<VocabWord, "word" | "with">) => (w.with ? `${w.word} (${w.with})` : w.word);
const listSets = (list: VocabList): VocabSet[] => getVocabSets().filter((s) => s.list === list);
const countWords = (sets: VocabSet[]) => sets.reduce((n, s) => n + s.words.length, 0);

/** Same size for every set, or null. */
function setSize(sets: VocabSet[]): number | null {
  return sets.length > 1 && sets.every((s) => s.words.length === sets[0].words.length) ? sets[0].words.length : null;
}

interface Copy {
  title: string;
  h1: string;
  description: string;
  intro: string;
  crumb: string;
}

function copy(list: VocabList): Copy {
  const sets = listSets(list);
  const n = countWords(sets);
  if (list === "core") {
    const size = setSize(sets);
    return {
      title: `SAT Vocabulary List: ${n} Words | Stellar`,
      h1: `SAT vocabulary list: ${n} words`,
      description: `${n} words that keep showing up in SAT passages${size ? `, in ${sets.length} sets of ${size}` : ""}, with definitions, example sentences and synonyms. Study them with free flashcards.`,
      intro: `${n} words that keep showing up in SAT passages${size ? `, in ${sets.length} sets of ${size}` : ""}. Each has a definition, an example sentence and synonyms. Read a set here, then practice it with flashcards.`,
      crumb: "SAT vocabulary list",
    };
  }
  if (list === "power") {
    const must = sets.find((s) => s.id === "must-know");
    return {
      title: `Advanced SAT Vocabulary: ${n} Hard Words | Stellar`,
      h1: `Advanced SAT vocabulary: ${n} words`,
      description: `${n} harder SAT words for a top score${must ? `, including the ${must.words.length} to learn first` : ""}, with definitions, examples and synonyms. Free flashcards with an account.`,
      intro: `${n} harder words for a top score${must ? `, starting with the ${must.words.length} to know first` : ""}. Each has a definition, an example sentence and synonyms.`,
      crumb: "Advanced",
    };
  }
  return {
    title: `SAT Math Vocabulary: ${n} Terms and Definitions | Stellar`,
    h1: `SAT math vocabulary: ${n} terms`,
    description: `${n} math terms used in SAT questions, grouped into ${sets.length} topics, with definitions and examples. Free flashcards with an account.`,
    intro: `${n} terms that SAT math questions use, grouped into ${sets.length} topics. Each has a definition, an example and related terms.`,
    crumb: "Math terms",
  };
}

export function vocabMetadata(list: VocabList): Metadata {
  const { title, description } = copy(list);
  const url = PATHS[list];
  return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { ...OG_BASE, title, description, url } };
}

// The look of the cards is set once, on the wrapper below (arbitrary variants), so a word's markup carries no class text.
const WORDS_LOOK = [
  "[&_dl>div]:rounded-2xl [&_dl>div]:bg-surface [&_dl>div]:p-4 [&_dl>div]:ring-1 [&_dl>div]:ring-line sm:[&_dl>div]:p-5",
  "[&_dt]:text-lg [&_dt]:font-bold [&_dt_small]:text-sm [&_dt_small]:font-normal [&_dt_small]:text-muted",
  "[&_dd]:mt-1.5 [&_dd]:text-[15px] [&_dd]:leading-relaxed",
  "[&_dd:nth-of-type(2)]:mt-2 [&_dd:nth-of-type(2)]:border-l-2 [&_dd:nth-of-type(2)]:border-line [&_dd:nth-of-type(2)]:pl-3 [&_dd:nth-of-type(2)]:text-sm [&_dd:nth-of-type(2)]:text-muted [&_dd:nth-of-type(2)]:italic",
  "[&_dd:nth-of-type(3)]:mt-2 [&_dd:nth-of-type(3)]:text-xs [&_dd:nth-of-type(3)]:text-muted",
].join(" ");

/** dt: word and part of speech; dd 1: meaning; dd 2: example; dd 3 (if any): synonyms, or related terms for math. */
function WordCard({ w, related }: { w: VocabWord; related: boolean }) {
  return (
    <div>
      <dt>
        {name(w)} <small>{w.pos}</small>
      </dt>
      <dd>{w.def}</dd>
      <dd>
        <Example w={w} />
      </dd>
      {w.syn.length > 0 && (
        <dd>
          {related ? "Related terms" : "Synonyms"}: {w.syn.join(", ")}
        </dd>
      )}
    </div>
  );
}

export function VocabListPage({ list }: { list: VocabList }) {
  const sets = listSets(list);
  const c = copy(list);
  const trail: Crumb[] = [{ name: copy("core").crumb, path: HOME }];
  if (list !== "core") trail.push({ name: c.crumb, path: PATHS[list] });

  return (
    <div className={PAGE}>
      <JsonLd json={breadcrumbJsonLd(trail)} />
      <h1 className={H1}>{c.h1}</h1>
      <p className={LEAD}>{c.intro}</p>

      <nav aria-label="Vocabulary lists" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {LISTS.map((l) => {
            const current = l.id === list;
            return (
              <li key={l.id}>
                <Link
                  href={PATHS[l.id]}
                  aria-current={current ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${current ? "border-primary bg-primary-soft text-primary-strong" : "border-line bg-surface text-ink hover:bg-surface-2"}`}
                >
                  {l.label} <span className="ml-1.5 font-normal text-muted tabular-nums">{countWords(listSets(l.id))}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav aria-label="Jump to a set" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {sets.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="inline-flex min-h-9 items-center rounded-lg border border-line px-3 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={WORDS_LOOK}>
        {sets.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className={SECTION}>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <div>
                <h2 id={`${s.id}-title`} className={H2}>
                  {s.title}
                </h2>
                <p className="mt-1 text-sm text-muted tabular-nums">
                  {s.words.length} {list === "math" ? "terms" : "words"}
                </p>
              </div>
              <Link href={`/vocabulary/${s.id}`} prefetch={false} className={BTN_QUIET}>
                Practice this set with flashcards
              </Link>
            </div>
            <dl className="mt-4 grid gap-3 md:grid-cols-2">
              {s.words.map((w) => (
                <WordCard key={w.id} w={w} related={list === "math"} />
              ))}
            </dl>
          </section>
        ))}
      </div>

      <ResourceCta text="Flashcards and quizzes for every set are free with an account." href="/vocabulary" label="Open vocabulary" />
      <MoreTools current={HOME} />
    </div>
  );
}
