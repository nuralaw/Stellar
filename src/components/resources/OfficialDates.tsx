"use client";

import { useNow } from "@/lib/store";
import { daysUntil, type SatDate } from "@/lib/sat-dates";
import { dateWithYear } from "@/lib/sat-format";
import { CARD, H2, PROSE, SECTION, TABLE, TABLE_WRAP, TD, TH, TR } from "./styles";

// The "Next SAT" card and the table of official dates on /sat-dates. The page is static and its date list can be a day or more
// old, so the server renders the list as given and the browser drops the dates that are already over (by the visitor's own
// calendar day). useNow() is 0 during server render and hydration, so the first client render matches the server HTML.

const pad = (n: number) => String(n).padStart(2, "0");
const localDay = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

function Day({ iso }: { iso: string }) {
  return <time dateTime={iso}>{dateWithYear(iso)}</time>;
}

function Deadline({ label, iso }: { label: string; iso?: string }) {
  if (!iso) return null;
  return (
    <p className="mt-1.5">
      <span className="text-muted">{label}: </span>
      <span className="font-semibold">
        <Day iso={iso} />
      </span>
    </p>
  );
}

export function OfficialDates({ official }: { official: SatDate[] }) {
  const now = useNow();
  const today = now ? localDay(now) : null;
  const list = today ? official.filter((d) => d.date >= today) : official;

  if (list.length === 0) {
    return (
      <section aria-labelledby="none-title" className={SECTION}>
        <h2 id="none-title" className={H2}>
          Upcoming official dates
        </h2>
        <p className={PROSE}>No official dates are left right now. Check College Board&apos;s page below for new ones.</p>
      </section>
    );
  }
  return <Sections list={list} today={today} />;
}

function Sections({ list, today }: { list: SatDate[]; today: string | null }) {
  const next = list[0];
  const n = today ? daysUntil(next.date, today) : null;
  return (
    <>
      <section aria-labelledby="next-title" className={SECTION}>
        <h2 id="next-title" className={H2}>
          Next SAT
        </h2>
        <div className={`${CARD} mt-4 p-5 sm:p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-2xl font-bold tracking-tight md:text-3xl">
              <Day iso={next.date} />
            </p>
            {n !== null && (
              <span className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary-strong">{n === 0 ? "Today" : n === 1 ? "Tomorrow" : `In ${n} days`}</span>
            )}
          </div>
          <Deadline label="Registration deadline" iso={next.register} />
          <Deadline label="Late registration deadline" iso={next.late} />
        </div>
      </section>

      <section aria-labelledby="upcoming-title" className={SECTION}>
        <h2 id="upcoming-title" className={H2}>
          Upcoming official dates
        </h2>
        <div className={`${TABLE_WRAP} mt-4`}>
          <table className={TABLE}>
            <caption className="sr-only">Upcoming official SAT test dates with their registration deadlines</caption>
            <thead>
              <tr>
                <th scope="col" className={TH}>
                  Test date
                </th>
                <th scope="col" className={TH}>
                  Registration deadline
                </th>
                <th scope="col" className={TH}>
                  Late registration deadline
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.date} className={TR}>
                  <th scope="row" className={`${TD} text-left font-semibold whitespace-nowrap`}>
                    <Day iso={d.date} />
                  </th>
                  <td className={`${TD} whitespace-nowrap`}>{d.register ? <Day iso={d.register} /> : "Not published yet"}</td>
                  <td className={`${TD} whitespace-nowrap`}>{d.late ? <Day iso={d.late} /> : "Not published yet"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
