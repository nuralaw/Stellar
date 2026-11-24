import { VocabListPage, vocabMetadata } from "@/components/resources/SatVocabularyList";

// Public and static (docs/SEO.md): the vocabulary list as plain HTML, from lib/vocab.ts.
export const generateMetadata = () => vocabMetadata("core");

export default function Page() {
  return <VocabListPage list="core" />;
}
