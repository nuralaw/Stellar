"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { setAdminFlag } from "@/lib/admin-flag";
import { CONTACT_ICONS } from "@/lib/contacts";
import { REPORT_REASONS } from "@/lib/report-reasons";
import type { ReportItem } from "@/lib/reports";
import type { SupportRequest } from "@/lib/support";
import { supabaseBrowser } from "@/lib/supabase/client";
import { getSkill } from "@/lib/taxonomy";
import { PAGE } from "@/lib/ui";
import { AccountsTab } from "./AccountsTab";
import { CompetitionTab } from "./CompetitionTab";
import { ForgotPasswordLink } from "./ForgotPassword";
import { OverviewTab } from "./OverviewTab";
import { ReportsByQuestion } from "./ReportsByQuestion";

// /admin: sign in (email + password or Google, same admin email), then the admin tabs:
// Overview, support requests from the Support button, problem reports on questions, Competition.
// Uses useSearchParams (?tab=…), so app/admin/page.tsx wraps this in <Suspense>.

type Me = { configured: boolean; signedIn: boolean; admin: boolean; email: string | null };
type Inbox = { support: SupportRequest[]; reports: ReportItem[]; errors: { support?: string; reports?: string } };
type Filter = "open" | "resolved" | "all";

// ── Tabs ── To add a tab: add it here and a case in renderTab() (inside Dashboard).
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "accounts", label: "Accounts" },
  { id: "support", label: "Support requests" },
  { id: "reports", label: "Question reports" },
  { id: "competition", label: "Competition" },
] as const;
type Tab = (typeof TABS)[number]["id"];
/** The two inbox lists (filter + search + cards). */
type ListTab = "support" | "reports";
/** Tab shown when the URL has no (valid) ?tab=. */
const DEFAULT_TAB: Tab = "overview";
const isTab = (v: string | null): v is Tab => TABS.some((t) => t.id === v);

/** Google's "G" (sign-in button mark). */
const GOOGLE_G: [string, string][] = [
  ["#EA4335", "M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"],
  ["#4285F4", "M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"],
  ["#FBBC05", "M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"],
  ["#34A853", "M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"],
];
const LOGOUT = "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3";
const REFRESH = "M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4";
const GOOGLE_OFF = "Google sign-in isn't turned on yet — use email and password.";

const handle = (v: string) => v.trim().replace(/^https?:\/\/(www\.)?(t\.me|instagram\.com)\//i, "").replace(/^@/, "").replace(/\/$/, "");
const when = (at: number) => new Date(at).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

async function fetchMe(): Promise<Me> {
  try {
    const m: Me = await (await fetch("/api/admin/me", { cache: "no-store" })).json();
    setAdminFlag(m.admin);
    return m;
  } catch {
    return { configured: true, signedIn: false, admin: false, email: null };
  }
}

async function fetchInbox(): Promise<Inbox | "denied" | "offline"> {
  try {
    const res = await fetch("/api/admin/inbox", { cache: "no-store" });
    if (res.status === 401 || res.status === 403) return "denied";
    return await res.json();
  } catch {
    return "offline";
  }
}

/** Is the Google provider on in Supabase? (Public /auth/v1/settings.) null = couldn't tell, try anyway. */
async function googleEnabled(): Promise<boolean | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
    if (!res.ok) return null;
    const s: { external?: Record<string, boolean> } = await res.json();
    return Boolean(s.external?.google);
  } catch {
    return null;
  }
}

export function AdminPanel() {
  const [me, setMe] = useState<Me | null>(null);
  const loadMe = useCallback(() => fetchMe().then(setMe), []);

  useEffect(() => {
    let live = true;
    fetchMe().then((m) => live && setMe(m));
    return () => {
      live = false;
    };
  }, []);

  const signOut = async () => {
    await supabaseBrowser()?.auth.signOut();
    setAdminFlag(false);
    await loadMe();
  };

  if (!me) return <section className={PAGE}><p className="text-muted">Loading…</p></section>;
  if (!me.configured) {
    return (
      <Centered title="Admin sign-in isn't set up">
        <p className="text-sm text-muted">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to the environment, then reload.</p>
      </Centered>
    );
  }
  if (!me.signedIn) return <SignIn onSignedIn={loadMe} />;
  if (!me.admin) {
    return (
      <Centered title="Not an admin account">
        <p className="text-sm text-muted">
          You&apos;re signed in as <span className="font-medium break-all text-ink">{me.email}</span>. Sign out, then sign in with the admin email to open the Support list.
        </p>
        <button type="button" onClick={signOut} className="mt-6 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
          Sign out
        </button>
      </Centered>
    );
  }
  return <Dashboard email={me.email ?? ""} onSignOut={signOut} onDenied={loadMe} />;
}

function Centered({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={PAGE}>
      <div className="mx-auto max-w-sm rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className="mt-2">{children}</div>
      </div>
    </section>
  );
}

function SignIn({ onSignedIn }: { onSignedIn: () => unknown }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  // Back from Google with ?auth=failed (this form only renders in the browser, after /api/admin/me).
  const [error, setError] = useState<string | null>(() =>
    new URL(window.location.href).searchParams.get("auth") === "failed" ? "Google sign-in didn't work. Try again, or use email and password." : null,
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("auth")) return;
    url.searchParams.delete("auth");
    window.history.replaceState(null, "", url.pathname + url.search);
  }, []);

  const withPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = supabaseBrowser();
    if (!sb) return;
    setBusy(true);
    setError(null);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
    else onSignedIn();
  };

  const withGoogle = async () => {
    const sb = supabaseBrowser();
    if (!sb) return;
    setError(null);
    setGoogleBusy(true);
    // A disabled provider would land on a raw Supabase JSON error page, so check first.
    if ((await googleEnabled()) === false) {
      setGoogleBusy(false);
      return setError(GOOGLE_OFF);
    }
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/admin` },
    });
    if (error) {
      setGoogleBusy(false);
      setError(/provider is not enabled|unsupported provider/i.test(error.message) ? GOOGLE_OFF : error.message);
    }
  };

  const field = "w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  return (
    <Centered title="Admin sign in">
      <p className="text-sm text-muted">Use the admin email to open the Support list.</p>
      <button
        type="button"
        onClick={withGoogle}
        disabled={googleBusy}
        className="mt-6 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-line px-5 py-3 font-semibold hover:bg-surface-2 disabled:opacity-60"
      >
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
          {GOOGLE_G.map(([fill, d]) => (
            <path key={fill} d={d} fill={fill} />
          ))}
        </svg>
        {googleBusy ? "Opening Google…" : "Continue with Google"}
      </button>
      <div className="my-5 flex items-center gap-3 text-xs text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <form onSubmit={withPassword} className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Password</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
        </label>
        <div className="text-right">
          <ForgotPasswordLink />
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-2 min-h-12 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:opacity-40"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </Centered>
  );
}

function Dashboard({ email, onSignOut, onDenied }: { email: string; onSignOut: () => void; onDenied: () => unknown }) {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");
  const tab: Tab = isTab(urlTab) ? urlTab : DEFAULT_TAB;
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("open");
  const [query, setQuery] = useState<Record<ListTab, string>>({ support: "", reports: "" });
  const [error, setError] = useState<string | null>(null);

  /** The tab lives in the URL (?tab=support) so a refresh keeps it; Next keeps useSearchParams in sync with replaceState. */
  const selectTab = (id: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  const show = useCallback(
    (r: Awaited<ReturnType<typeof fetchInbox>>) => {
      setLoading(false);
      if (r === "denied") return onDenied();
      if (r === "offline") return setError("Couldn't load the list. Check your connection.");
      setInbox(r);
      setError(null);
    },
    [onDenied],
  );
  const load = () => {
    setLoading(true);
    fetchInbox().then(show);
  };

  useEffect(() => {
    let live = true;
    fetchInbox().then((r) => live && show(r));
    return () => {
      live = false;
    };
  }, [show]);

  /** Optimistic: flip it now, put it back if the server says no. */
  const update = async (kind: "support" | "report", id: string, patch: { resolved?: boolean; bugConfirmed?: boolean }) => {
    const apply = (p: typeof patch) =>
      setInbox((x) =>
        x && {
          ...x,
          support: kind === "support" ? x.support.map((r) => (r.id === id ? { ...r, ...p } : r)) : x.support,
          reports: kind === "report" ? x.reports.map((r) => (r.id === id ? { ...r, resolved: p.resolved ?? r.resolved } : r)) : x.reports,
        },
      );
    const before = kind === "support" ? inbox?.support.find((r) => r.id === id) : inbox?.reports.find((r) => r.id === id);
    apply(patch);
    try {
      const res = await fetch("/api/admin/inbox", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, id, ...patch }) });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Couldn't save");
    } catch (e) {
      if (before) apply({ resolved: before.resolved, bugConfirmed: "bugConfirmed" in before ? before.bugConfirmed : undefined });
      setError(e instanceof Error ? e.message : "Couldn't save");
    }
  };

  const support = inbox?.support ?? [];
  const reports = inbox?.reports ?? [];
  /** Badge numbers on the tabs (open items). */
  const counts: Partial<Record<Tab, number>> = { support: support.filter((r) => !r.resolved).length, reports: reports.filter((r) => !r.resolved).length };
  const keep = (r: { resolved?: boolean }) => (filter === "all" ? true : filter === "open" ? !r.resolved : Boolean(r.resolved));

  /** Support requests / Question reports: search + filter toolbar, then the cards. */
  const listView = <T extends { id: string; resolved?: boolean }>(t: ListTab, all: T[], text: (r: T) => string, card: (r: T) => ReactNode) => {
    const q = query[t].trim().toLowerCase();
    const items = all.filter(keep).filter((r) => !q || text(r).toLowerCase().includes(q));
    const tabError = inbox?.errors[t];
    const setQ = (v: string) => setQuery((x) => ({ ...x, [t]: v }));
    return (
      <>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBox value={query[t]} onChange={setQ} placeholder={t === "support" ? "Search messages and contacts" : "Search notes, contacts, question id"} />
          <div className="flex rounded-xl bg-surface-2 p-1 text-sm" role="group" aria-label="Show">
            {(["open", "resolved", "all"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`min-h-10 flex-1 rounded-lg px-4 font-medium capitalize sm:flex-none ${filter === f ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {tabError && <p className="mt-5 rounded-xl bg-accent-soft px-4 py-3 text-sm">{tabError}</p>}
        <div className="mt-5 space-y-4">
          {!inbox && loading && <p className="text-muted">Loading…</p>}
          {inbox &&
            (items.length ? (
              t === "reports" && filter === "open" && !q ? (
                <ReportsByQuestion reports={reports} onChange={(id, p) => update("report", id, p)} />
              ) : (
                items.map(card)
              )
            ) : q ? (
              <Empty>
                <p>
                  Nothing matches &ldquo;{query[t].trim()}&rdquo;{filter !== "all" && ` in ${filter}`}. Try other words or switch to All.
                </p>
                <button type="button" onClick={() => setQ("")} className="mt-4 inline-flex min-h-10 items-center rounded-xl border border-line px-4 text-sm font-semibold text-ink hover:bg-surface">
                  Clear search
                </button>
              </Empty>
            ) : (
              <Empty>
                <p>{EMPTY[t][filter]}</p>
              </Empty>
            ))}
        </div>
      </>
    );
  };

  // ── Tab content. To add a tab: add it to TABS (top of file) and a case here. ──
  const renderTab = (t: Tab): ReactNode => {
    switch (t) {
      case "overview":
        return (
          <div className="mt-5">
            <OverviewTab inbox={inbox} />
          </div>
        );
      case "support":
        return listView("support", support, (r) => [r.message, r.telegram, r.instagram, r.other].join(" "), (r) => <SupportCard key={r.id} r={r} update={update} />);
      case "reports":
        return listView("reports", reports, (r) => [r.note, r.telegram, r.instagram, r.qid, REPORT_REASONS[r.reason] ?? r.reason].join(" "), (r) => <ReportCard key={r.id} r={r} update={update} />);
      case "accounts":
        return <AccountsTab />;
      case "competition":
        return (
          <div className="mt-5">
            <CompetitionTab />
          </div>
        );
    }
  };

  return (
    <section className={PAGE}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Support list</h1>
          <p className="mt-2 text-sm break-all text-muted sm:text-base">
            Signed in as <span className="font-medium text-ink">{email}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            title="Refresh"
            aria-label="Refresh"
            className="grid h-11 w-11 place-items-center rounded-xl border border-line text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-50"
          >
            <Icon d={REFRESH} className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button type="button" onClick={onSignOut} className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface-2">
            <Icon d={LOGOUT} className="h-4.5 w-4.5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs scroll sideways on a phone instead of widening the page. */}
      <div className="-mx-4 mt-8 overflow-x-auto border-b border-line px-4 [scrollbar-width:none] md:mx-0 md:px-0">
        <div className="flex w-max gap-1" role="tablist">
          {TABS.map(({ id, label }) => {
            const n = counts[id] ?? 0;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => selectTab(id)}
                className={`-mb-px flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-semibold whitespace-nowrap transition-colors ${tab === id ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"}`}
              >
                {label}
                {n > 0 && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-accent tabular-nums">{n}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div role="tabpanel">{renderTab(tab)}</div>
    </section>
  );
}

/** What an empty list means, and what to do next. */
const EMPTY: Record<ListTab, Record<Filter, string>> = {
  support: {
    open: "No open requests. New ones show up here and by email; tap Refresh to check again.",
    resolved: "Nothing resolved yet. Mark a request Resolved under Open and it moves here.",
    all: "No support requests yet. They come from the Support button on the start pages.",
  },
  reports: {
    open: "No open question reports. Tap Refresh to check for new ones.",
    resolved: "Nothing resolved yet. Mark a report Resolved under Open and it moves here.",
    all: "No question reports yet. Students send them with the report button on a question.",
  },
};

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 flex flex-col items-center rounded-2xl bg-surface-2 px-6 py-12 text-center text-sm text-muted">
      <Icon d={I.inbox} className="mb-3 h-8 w-8" />
      {children}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Icon d={I.search} className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-xl border border-line bg-bg pr-11 pl-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-0.5 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-ink"
        >
          <Icon d={I.x} className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

type Update = (kind: "support" | "report", id: string, patch: { resolved?: boolean; bugConfirmed?: boolean }) => void;

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-colors ${
        on ? "border-primary bg-primary/10 text-accent" : "border-line text-ink hover:bg-surface-2"
      }`}
    >
      <span className={`grid h-4.5 w-4.5 place-items-center rounded-md border ${on ? "border-primary bg-primary text-primary-ink" : "border-line"}`}>
        {on && <Icon d={I.check} className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      {children}
    </button>
  );
}

function Contacts({ telegram, instagram, other }: { telegram: string; instagram: string; other?: string }) {
  const chip = "inline-flex min-h-10 max-w-full items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-sm break-all";
  if (!telegram && !instagram && !other) return <p className="mt-3 text-sm text-muted">No contacts left, so there&apos;s no way to reply.</p>;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {telegram && (
        <a href={`https://t.me/${handle(telegram)}`} target="_blank" rel="noreferrer" className={`${chip} hover:text-accent`}>
          <Icon d={CONTACT_ICONS.telegram} className="h-4 w-4 shrink-0 text-muted" />@{handle(telegram)}
        </a>
      )}
      {instagram && (
        <a href={`https://instagram.com/${handle(instagram)}`} target="_blank" rel="noreferrer" className={`${chip} hover:text-accent`}>
          <Icon d={CONTACT_ICONS.instagram} className="h-4 w-4 shrink-0 text-muted" />@{handle(instagram)}
        </a>
      )}
      {other && <span className={chip}>{other}</span>}
    </div>
  );
}

function SupportCard({ r, update }: { r: SupportRequest; update: Update }) {
  return (
    <article className={`rounded-2xl border border-line bg-surface p-4 sm:p-5 ${r.resolved ? "opacity-70" : ""}`}>
      <time className="text-sm text-muted">{when(r.at)}</time>
      <p className="mt-2 whitespace-pre-wrap break-words">{r.message}</p>
      {r.screenshot && (
        <a href={`/api/admin/screenshot/${r.screenshot}`} target="_blank" rel="noreferrer" className="mt-3 block w-fit max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- private, admin-only image */}
          <img
            src={`/api/admin/screenshot/${r.screenshot}`}
            alt="Screenshot from the request (opens full size)"
            loading="lazy"
            decoding="async"
            className="max-h-64 max-w-full rounded-xl bg-surface-2 object-contain ring-1 ring-line"
          />
        </a>
      )}
      <Contacts telegram={r.telegram} instagram={r.instagram} other={r.other} />
      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
        <Toggle on={Boolean(r.bugConfirmed)} onClick={() => update("support", r.id, { bugConfirmed: !r.bugConfirmed })}>
          Real bug · 50% off
        </Toggle>
        <Toggle on={Boolean(r.resolved)} onClick={() => update("support", r.id, { resolved: !r.resolved })}>
          Resolved
        </Toggle>
      </div>
    </article>
  );
}

function ReportCard({ r, update }: { r: ReportItem; update: Update }) {
  const q = r.question;
  const sectionName = q?.section === "math" ? "Math" : "R&W";
  return (
    <article className={`rounded-2xl border border-line bg-surface p-4 sm:p-5 ${r.resolved ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {q ? (
          <Link href={`/practice?section=${q.section}&q=${q.n}`} target="_blank" className="inline-flex min-h-10 items-center font-semibold hover:text-accent">
            {sectionName} #{q.n} · {getSkill(q.skill)?.name ?? q.skill}
          </Link>
        ) : (
          <span className="font-semibold break-all">{r.qid}</span>
        )}
        <time className="text-sm text-muted">{when(r.at)}</time>
      </div>
      <p className="mt-2 text-sm font-medium text-accent">{REPORT_REASONS[r.reason] ?? r.reason}</p>
      {r.note && <p className="mt-1 whitespace-pre-wrap break-words">{r.note}</p>}
      {q && (
        <div className="mt-3 rounded-xl bg-surface-2 px-3.5 py-3 text-sm">
          <p className="line-clamp-2 text-muted">{q.text}</p>
          <p className="mt-1.5">
            Answer key: <span className="font-semibold">{q.answer}</span>
          </p>
        </div>
      )}
      <Contacts telegram={r.telegram} instagram={r.instagram} />
      <div className="mt-4 border-t border-line pt-4">
        <Toggle on={r.resolved} onClick={() => update("report", r.id, { resolved: !r.resolved })}>
          Resolved
        </Toggle>
      </div>
    </article>
  );
}
