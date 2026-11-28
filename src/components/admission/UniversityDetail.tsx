import Link from "next/link";
import type { ReactNode } from "react";
import type { Destination, TestPolicy, University } from "@/lib/admission";
import { PAGE } from "@/lib/ui";
import { UniversityLogo } from "./UniversityLogo";

// /admission/[destination]/[university]. Every fact block is optional: a null field renders nothing (no placeholder, no "TBA"),
// and a university with no facts yet still gets its header, the official links and nothing else.

const POLICY: Record<TestPolicy, { label: string; className: string }> = {
  required: { label: "Required", className: "bg-primary-soft text-primary-strong" },
  accepted: { label: "Accepted", className: "bg-surface-2 text-ink" },
  "not-required": { label: "Not required", className: "bg-success-soft text-success" },
};

const CARD = "rounded-2xl border border-line bg-surface p-5";
const PILL = "inline-flex items-center rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-primary";
const EXTERNAL = "inline-flex items-center gap-1.5 rounded-lg font-semibold text-primary-strong underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={CARD}>
      <h3 className="font-semibold text-ink">{title}</h3>
      <div className="mt-3 space-y-3 text-sm text-ink">{children}</div>
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={EXTERNAL}>
      {children}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-3.5 shrink-0">
        <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
      </svg>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

const formatDate = (iso: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso));

export function UniversityDetail({ destination, university: u }: { destination: Destination; university: University }) {
  const meta = [u.city, u.founded !== null ? `Founded ${u.founded}` : null].filter((x): x is string => !!x);
  const hasRequirements = !!(u.tests || u.english?.length || u.deadlines?.length || u.tuition || u.scholarships?.length);

  return (
    <section className={PAGE}>
      <Link
        href={`/admission/${destination.slug}`}
        prefetch
        className="inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-muted outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span aria-hidden="true">←</span> Universities in {destination.name}
      </Link>

      <header className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center md:gap-6">
        {/* square tile: the logos are emblems without the wordmark */}
        <UniversityLogo university={u} className="h-20 w-20 shrink-0 text-lg md:h-24 md:w-24 md:text-xl" />
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{u.name}</h1>
          {meta.length > 0 && <p className="mt-1 text-muted">{meta.join(" · ")}</p>}
        </div>
      </header>

      {u.overview && u.overview.length > 0 && (
        <div className="mt-6 max-w-3xl space-y-3 text-ink">
          {u.overview.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {hasRequirements && (
        <div className="mt-10">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">For international undergraduate applicants</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {u.tests && (
              <Block title="SAT / ACT">
                <p>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${POLICY[u.tests.policy].className}`}>{POLICY[u.tests.policy].label}</span>
                </p>
                {u.tests.note && <p>{u.tests.note}</p>}
                {(u.tests.sat || u.tests.act) && (
                  <dl className="space-y-1">
                    {u.tests.sat && (
                      <div className="flex gap-2">
                        <dt className="w-10 shrink-0 font-semibold text-muted">SAT</dt>
                        <dd>{u.tests.sat}</dd>
                      </div>
                    )}
                    {u.tests.act && (
                      <div className="flex gap-2">
                        <dt className="w-10 shrink-0 font-semibold text-muted">ACT</dt>
                        <dd>{u.tests.act}</dd>
                      </div>
                    )}
                  </dl>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link href="/test" prefetch className={PILL}>
                    Take a full practice test
                  </Link>
                  <Link href="/practice" prefetch className={PILL}>
                    Practice SAT questions
                  </Link>
                </div>
              </Block>
            )}
            {u.english && u.english.length > 0 && (
              <Block title="English requirements">
                <ul className="list-disc space-y-1 pl-5">
                  {u.english.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </Block>
            )}
            {u.deadlines && u.deadlines.length > 0 && (
              <Block title="Application deadlines">
                <dl className="space-y-1.5">
                  {u.deadlines.map((d, i) => (
                    <div key={i} className="flex flex-wrap justify-between gap-x-4">
                      <dt className="text-muted">{d.label}</dt>
                      <dd className="font-semibold">{d.date}</dd>
                    </div>
                  ))}
                </dl>
              </Block>
            )}
            {u.tuition && (
              <Block title="Tuition for non-local students">
                <p className="text-lg font-bold">{u.tuition.amount}</p>
                {u.tuition.note && <p className="text-muted">{u.tuition.note}</p>}
              </Block>
            )}
            {u.scholarships && u.scholarships.length > 0 && (
              <Block title="Scholarships">
                <ul className="list-disc space-y-1.5 pl-5">
                  {u.scholarships.map((s, i) => (
                    <li key={i}>
                      <span className="font-semibold">{s.name}</span>
                      {s.detail && <span className="text-muted"> — {s.detail}</span>}
                    </li>
                  ))}
                </ul>
              </Block>
            )}
          </div>
        </div>
      )}

      <div className={`${CARD} mt-6`}>
        <h2 className="font-semibold text-ink">Official links</h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <ExternalLink href={u.links.website}>Official website</ExternalLink>
          </li>
          {u.links.admissions && (
            <li>
              <ExternalLink href={u.links.admissions}>Undergraduate admissions</ExternalLink>
            </li>
          )}
        </ul>
      </div>

      {u.sources.length > 0 && (
        <div className="mt-6 text-sm text-muted">
          <h2 className="font-semibold text-ink">Sources</h2>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
            {u.sources.map((s) => (
              <li key={s.url}>
                <ExternalLink href={s.url}>{s.label}</ExternalLink>
              </li>
            ))}
          </ul>
          {u.verifiedOn && <p className="mt-3">Checked on {formatDate(u.verifiedOn)}. Requirements change — confirm the details on the university&apos;s own site.</p>}
        </div>
      )}
    </section>
  );
}
