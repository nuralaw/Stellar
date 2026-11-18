import type { Metadata } from "next";
import { PricingGrid, Watermark } from "@/components/auth/auth-views";
import { FreeCardCta } from "@/components/plus/FreeCardCta";
import { PlusBuyFooter, PlusBuyPicker, PlusBuyProvider } from "@/components/plus/PlusBuyPicker";
import { MemberPanel } from "@/components/plus/PlusCta";
import { PlusMark } from "@/components/plus/PlusMark";
import { FaqSection, FinalBand } from "@/components/plus/sections";
import { EYEBROW } from "@/components/plus/styles";
import { authFacts } from "@/lib/auth-facts";
import { PLAN_ORDER, PLUS } from "@/lib/plus-config";
import { PAGE } from "@/lib/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { tests: t, lessons: l } = authFacts();
  const description = `Stellar stays free. Plus adds all ${t.total} past-paper practice tests, the full question bank, ${l.total} interactive lessons, a predicted score and spaced review of your mistakes.`;
  return { title: "Stellar Plus", description, openGraph: { title: "Stellar Plus: every past paper, every lesson", description, type: "website" } };
}

export default function Page() {
  const facts = authFacts();
  const { tests: t, lessons: l, free: f } = facts;
  const anyPrice = PLAN_ORDER.some((id) => PLUS.plans[id].amountCents !== null);

  return (
    <div className={PAGE}>
      {/* Pricing: the same Free card + Plus showcase as the sign-up screen's Pricing tab, with working checkout. id="plans" is linked from other pages. */}
      <section id="plans" aria-labelledby="plus-title" className="relative isolate scroll-mt-20 overflow-hidden px-1 pb-24 sm:pb-32 lg:scroll-mt-8 lg:pb-36">
        <Watermark />
        <div className="xl:flex xl:items-end xl:justify-between xl:gap-6">
          <div>
            <p className="lesson-in flex items-center gap-2.5">
              <PlusMark size="sm" />
              <span className={EYEBROW}>Stellar Plus</span>
            </p>
            <h1 id="plus-title" className="lesson-in mt-2 text-2xl font-bold tracking-tight text-balance [animation-delay:70ms] md:text-3xl">
              Start free. Add Plus when you need it.
            </h1>
          </div>
          <div className="lesson-in mt-2 [animation-delay:140ms] xl:mt-0 xl:text-right">
            <p className="mt-1 text-[12px] text-muted empty:hidden">
              {anyPrice && PLUS.priceNote}
            </p>
          </div>
        </div>

        <MemberPanel tests={t.total} lessons={l.total} />

        <PlusBuyProvider>
          <PricingGrid facts={facts} freeCta={<FreeCardCta />} picker={<PlusBuyPicker />} footer={<PlusBuyFooter />} />
        </PlusBuyProvider>
      </section>

      <FaqSection t={t} l={l} f={f} />
      <FinalBand />
    </div>
  );
}
