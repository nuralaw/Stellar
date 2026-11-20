import type { Metadata } from "next";
import { DuskLanding } from "@/components/landing/dusk/DuskLanding";
import { duskFacts, faqItems, jsonLd, satClock } from "@/components/landing/dusk/facts";
import { JsonLd } from "@/components/JsonLd";
import { authFacts } from "@/lib/auth-facts";
import { OG_BASE } from "@/lib/site";

// The public home page. Nobody links here: src/proxy.ts answers "/" with this page for a signed-out visitor (the address stays "/"),
// so its canonical is "/". Static page: the counts are computed at build time, like /plus, /register and /login; the SAT
// dates still ahead come from a cached function (components/landing/dusk/facts.ts), and the browser does the live countdown.

export async function generateMetadata(): Promise<Metadata> {
  const { tests: t, lessons: l, questions } = authFacts();
  const description = `Digital SAT prep: ${questions !== null ? `${questions.toLocaleString("en-US")} practice questions, ` : "practice questions, "}${t.total} past-paper practice tests and ${l.total} interactive lessons for Math and Reading & Writing.`;
  const title = "Stellar: Digital SAT Practice Tests, Questions & Lessons";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { ...OG_BASE, title, description, url: "/" },
  };
}

export default async function Page() {
  const facts = authFacts();
  return (
    <>
      {/* WebSite, Organization and the FAQPage: the same list (faqItems) as the visible FAQ */}
      <JsonLd json={jsonLd(faqItems(duskFacts(facts)))} />
      <DuskLanding facts={facts} clock={await satClock()} />
    </>
  );
}
