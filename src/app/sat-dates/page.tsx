import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { LINK_STRONG } from "@/components/plus/styles";
import { MoreTools } from "@/components/resources/MoreTools";
import { OfficialDates } from "@/components/resources/OfficialDates";
import { ResourceCta } from "@/components/resources/ResourceCta";
import { CARD, H1, H2, LEAD, PROSE, SECTION } from "@/components/resources/styles";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { satCalendar } from "@/lib/sat-calendar";
import { SAT_DATES_CHECKED, SAT_DATES_SOURCE } from "@/lib/sat-dates";
import { dateWithYear, seasonLabel } from "@/lib/sat-format";
import { OG_BASE } from "@/lib/site";
import { PAGE } from "@/lib/ui";

// Public and static: the dates come from lib/sat-dates.ts through a cached function (lib/sat-calendar.ts), so the HTML has no
// request-time clock. The "Next SAT" card and the table hide dates that are already over, in the browser (OfficialDates).

const PATH = "/sat-dates";

function Day({ iso }: { iso: string }) {
  return <time dateTime={iso}>{dateWithYear(iso)}</time>;
}

export async function generateMetadata(): Promise<Metadata> {
  const { official } = await satCalendar();
  const season = seasonLabel(official.map((d) => d.date));
  const title = `SAT Test Dates${season ? ` ${season}` : ""} and Deadlines | Stellar`;
  const description = `Official SAT test dates${season ? ` for ${season}` : ""} with registration and late registration deadlines. Checked ${dateWithYear(SAT_DATES_CHECKED)}.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: PATH },
    openGraph: { ...OG_BASE, title, description, url: PATH },
  };
}

export default async function Page() {
  const { official, anticipated } = await satCalendar();

  return (
    <div className={PAGE}>
      <JsonLd json={breadcrumbJsonLd([{ name: "SAT test dates", path: PATH }])} />
      <h1 className={H1}>SAT test dates and deadlines</h1>
      <p className={LEAD}>Official SAT weekend test dates, with the registration and late registration deadline for each.</p>

      <OfficialDates official={official} />

      {anticipated.length > 0 && (
        <section aria-labelledby="anticipated-title" className={SECTION}>
          <h2 id="anticipated-title" className={H2}>
            Anticipated dates
          </h2>
          <p className={PROSE}>Anticipated by College Board, not confirmed, no deadlines yet.</p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {anticipated.map((d) => (
              <li key={d.date} className={`${CARD} px-4 py-3 font-semibold`}>
                <Day iso={d.date} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="notes-title" className={SECTION}>
        <h2 id="notes-title" className={H2}>
          Good to know
        </h2>
        <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 leading-relaxed text-ink/90">
          <li>The dates are the same for students in the U.S. and in other countries.</li>
          <li>Deadlines expire at 11:59 p.m. ET.</li>
          <li>Late registration is available worldwide for an additional fee.</li>
          <li>To borrow a device from College Board, register and request it at least 30 days before test day.</li>
        </ul>
        <p className="mt-5 max-w-2xl text-sm text-muted">
          Source:{" "}
          <a href={SAT_DATES_SOURCE} rel="noopener" className={LINK_STRONG}>
            College Board, SAT dates and deadlines
          </a>
          . Checked on <Day iso={SAT_DATES_CHECKED} />. Dates can change, so confirm on College Board before you register.
        </p>
      </section>

      <ResourceCta text="Set your test date and Stellar counts down with you." href="/" label="Open your dashboard" />
      <MoreTools current={PATH} />
    </div>
  );
}
