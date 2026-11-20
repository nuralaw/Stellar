import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";
import { authFacts } from "@/lib/auth-facts";
import { OG_BASE } from "@/lib/site";

// The public home page. Nobody links here: src/proxy.ts answers "/" with this page for a signed-out visitor (the address stays "/"),
// so its canonical is "/". Static page: the counts are computed at build time, like /plus, /register and /login.

export async function generateMetadata(): Promise<Metadata> {
  const { tests: t, lessons: l, questions } = authFacts();
  const description = `Free Digital SAT prep: ${questions !== null ? `${questions.toLocaleString("en-US")} practice questions, ` : "practice questions, "}${t.total} past-paper practice tests and ${l.total} interactive lessons for Math and Reading & Writing.`;
  const title = "Stellar: Free Digital SAT Practice Tests, Questions & Lessons";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { ...OG_BASE, title, description, url: "/" },
  };
}

export default function Page() {
  return <Landing facts={authFacts()} />;
}
