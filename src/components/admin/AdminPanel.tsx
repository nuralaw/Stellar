"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { adminFetch, getSealKey, onKeysChange, openBytesAny, promotePendingDeviceKey } from "@/lib/admin-keys";
import { setAdminFlag } from "@/lib/admin-flag";
import { CONTACT_ICONS } from "@/lib/contacts";
import { REPORT_REASONS } from "@/lib/report-reasons";
import type { ReportItem } from "@/lib/reports";
import { PLUS } from "@/lib/plus-config";
import type { SupportRequest } from "@/lib/support";
import { supabaseBrowser } from "@/lib/supabase/client";
import { getSkill } from "@/lib/taxonomy";
import { FOCUS_ON_DARK } from "@/components/plus/styles";
import { PAGE } from "@/lib/ui";
import { AccountsTab } from "./AccountsTab";
import { CompetitionTab } from "./CompetitionTab";
import { ForgotPasswordLink } from "./ForgotPassword";
import { LOCKED_TEXT, loadInbox, type Inbox } from "./inbox-data";
import { formatMoney } from "./money";
import { OverviewTab } from "./OverviewTab";
import { RankedTab } from "./RankedTab";
import { ReportsByQuestion } from "./ReportsByQuestion";
import { RevenueTab } from "./RevenueTab";
import { SearchBox } from "./SearchBox";
import { SecurityTab, type SecurityMe } from "./SecurityTab";
import { useRevenueKpis } from "./revenue-data";
import { TrafficTab } from "./TrafficTab";

// /admin: sign in (email + password or Google, same admin email), then the admin tabs:
// Overview, Revenue (Gumroad sales), Accounts, Traffic, support requests from the Support button, problem reports on questions, Competition.
// Uses useSearchParams (?tab=…), so app/admin/page.tsx wraps this in <Suspense>.

type Me = { configured: boolean; signedIn: boolean; admin: boolean; email: string | null } & SecurityMe;
/** What the PATCH answers about the discount when a bug is (un)confirmed, in words. */
const DISCOUNT_NOTICE: Record<string, string> = {
  granted: "Bug confirmed: the discount was sent to the student's account.",
  already: "Bug confirmed. That account already has this discount (or one is open), so nothing new was added.",
  revoked: "Bug un-confirmed: the unused discount was taken back.",
  "no-account": "Bug confirmed, but the reporter wasn't signed in, so there's no account to give it to. Use Accounts → \"50% off 1st month\".",
  off: "Bug confirmed. Discounts are turned off (bugDiscountPercent in plus-config.ts).",
  error: "Bug confirmed, but the discount couldn't be saved. Check the discounts table (supabase/discounts.sql) or give it from Accounts.",
};
type Filter = "open" | "resolved" | "all";

// ── Tabs ── To add a tab: add it here and a case in renderTab() (inside Dashboard).
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "revenue", label: "Revenue" },
  { id: "accounts", label: "Accounts" },
  { id: "traffic", label: "Traffic" },
  { id: "support", label: "Support requests" },
  { id: "reports", label: "Question reports" },
  { id: "competition", label: "Competition" },
  { id: "ranked", label: "Ranked" },
  { id: "security", label: "Security" },
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
    await promotePendingDeviceKey().catch(() => {}); // a replacement device key the server accepts by now becomes the active one
    const m: Me = await (await adminFetch("/api/admin/me", { cache: "no-store" })).json();
    setAdminFlag(m.admin);
    return m;
  } catch {
    return { configured: true, signedIn: false, admin: false, email: null };
  }
}

const fetchInbox = loadInbox;

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
  // Admin account, but this browser isn't an allowed device yet: only the setup screen (every admin API would answer 403).
  if (me.device !== "ok") return <SecurityGate me={me} onReload={loadMe} onSignOut={signOut} />;
  return <Dashboard me={me} onSignOut={signOut} onDenied={loadMe} />;
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

/** Header card (the same plus-surface as the dashboard's), so text is side-ink / side-ink/80 only. */
function SetupHeader({ title, email, children }: { title: string; email: string; children: ReactNode }) {
  return (
    <header className="plus-surface flex flex-wrap items-start justify-between gap-4 rounded-3xl p-6 text-side-ink ring-1 ring-white/10">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight text-side-ink md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm break-all text-side-ink/80 sm:text-base">
          Signed in as <span className="font-medium text-side-ink">{email}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </header>
  );
}

const HEADER_BTN = `inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm font-semibold text-side-ink hover:bg-white/10 ${FOCUS_ON_DARK}`;

/** Shown instead of the dashboard while this browser can't use the admin APIs. */
function SecurityGate({ me, onReload, onSignOut }: { me: Me; onReload: () => unknown; onSignOut: () => void }) {
  return (
    <section className={PAGE}>
      <SetupHeader title="Admin security" email={me.email ?? ""}>
        <button type="button" onClick={onReload} className={HEADER_BTN}>
          Check again
        </button>
        <button type="button" onClick={onSignOut} className={HEADER_BTN}>
          <Icon d={LOGOUT} className="h-4.5 w-4.5" />
          Sign out
        </button>
      </SetupHeader>
      <p className="mt-5 rounded-xl bg-accent-soft px-4 py-3 text-sm">The admin pages are locked to approved devices. Set this browser up below; the dashboard opens as soon as the server accepts it.</p>
      <SecurityTab me={me} onChanged={onReload} />
    </section>
  );
}

/** Does this browser hold the key the server seals for? Drives the banner on the dashboard. */
function useSealState(server: string | null | undefined): "loading" | "ok" | "no-server" | "no-key" | "mismatch" {
  const [key, setKey] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    const read = () => getSealKey().then((k) => live && setKey(k?.spki ?? null));
    read();
    const off = onKeysChange(read);
    return () => {
      live = false;
      off();
    };
  }, []);
  if (key === undefined) return "loading";
  if (!server) return "no-server";
  if (!key) return "no-key";
  return key === server ? "ok" : "mismatch";
}

const SEAL_BANNER = {
  "no-server": "Personal data isn't encrypted yet: new support requests and reports are refused until you create a decryption key.",
  "no-key": "This browser has no decryption key, so encrypted requests, reports and buyer emails can't be read here.",
  mismatch: "The key in this browser doesn't match the server's, so new encrypted data can't be read here.",
} as const;

function Dashboard({ me, onSignOut, onDenied }: { me: Me; onSignOut: () => void; onDenied: () => unknown }) {
  const email = me.email ?? "";
  const sealState = useSealState(me.sealPublicKey);
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");
  const tab: Tab = isTab(urlTab) ? urlTab : DEFAULT_TAB;
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("open");
  const [query, setQuery] = useState<Record<ListTab, string>>({ support: "", reports: "" });
  const [error, setError] = useState<string | null>(null);
  /** Result of the last bug confirmation (the discount), shown under the tabs. */
  const [notice, setNotice] = useState<string | null>(null);
  /** Revenue KPIs: the header pill and the Overview strip share this one fetch. */
  const revenue = useRevenueKpis();

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
    revenue.reload();
  };

  useEffect(() => {
    let live = true;
    fetchInbox().then((r) => live && show(r));
    return () => {
      live = false;
    };
  }, [show]);

  // A key made or restored in the Security tab: read the lists again so the rows open.
  const reload = useRef(load);
  useEffect(() => {
    reload.current = load;
  });
  useEffect(() => onKeysChange(() => reload.current()), []);

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
    setNotice(null);
    try {
      const res = await adminFetch("/api/admin/inbox", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, id, ...patch }) });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Couldn't save");
      if (kind === "support" && patch.bugConfirmed !== undefined) {
        const out: { discount?: string } | null = await res.json().catch(() => null);
        if (out?.discount && DISCOUNT_NOTICE[out.discount]) setNotice(DISCOUNT_NOTICE[out.discount]);
        fetchInbox().then(show); // the card's discount status comes from the server
      }
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
        {t === "support" && inbox?.bugCode === false && <p className="mt-5 rounded-xl bg-accent-soft px-4 py-3 text-sm">Set GUMROAD_BUG_CODE to apply discounts (they are still recorded).</p>}
        {t === "support" && notice && (
          <p role="status" className="mt-5 rounded-xl bg-accent-soft px-4 py-3 text-sm">
            {notice}
          </p>
        )}
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
            <OverviewTab inbox={inbox} revenue={revenue.result} />
          </div>
        );
      case "revenue":
        return <RevenueTab />;
      case "support":
        return listView("support", support, (r) => [r.message, r.telegram, r.instagram, r.other].join(" "), (r) => <SupportCard key={r.id} r={r} update={update} />);
      case "reports":
        return listView("reports", reports, (r) => [r.note, r.telegram, r.instagram, r.qid, REPORT_REASONS[r.reason] ?? r.reason].join(" "), (r) => <ReportCard key={r.id} r={r} update={update} />);
      case "accounts":
        return <AccountsTab />;
      case "traffic":
        return <TrafficTab onDenied={onDenied} />;
      case "competition":
        return (
          <div className="mt-5">
            <CompetitionTab />
          </div>
        );
      case "ranked":
        return (
          <div className="mt-5">
            <RankedTab />
          </div>
        );
      case "security":
        return <SecurityTab me={me} onChanged={onDenied} />;
    }
  };

  return (
    <section className={PAGE}>
      {/* Header card: plus-surface, so text is side-ink / side-ink/80 only (see globals.css). */}
      <header className="plus-surface flex flex-wrap items-start justify-between gap-4 rounded-3xl p-6 text-side-ink ring-1 ring-white/10">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-side-ink md:text-4xl">Admin</h1>
          <p className="mt-2 text-sm break-all text-side-ink/80 sm:text-base">
            Signed in as <span className="font-medium text-side-ink">{email}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {revenue.result?.kind === "ok" && (
            <button
              type="button"
              onClick={() => selectTab("revenue")}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/10 px-4 text-sm text-side-ink/80 hover:bg-white/15 ${FOCUS_ON_DARK}`}
            >
              Revenue this month:
              <span className="font-semibold text-side-ink tabular-nums">{formatMoney(revenue.result.data.kpis.month.gross_cents, revenue.result.data.kpis.currency)}</span>
            </button>
          )}
          <button
            type="button"
            onClick={load}
            disabled={loading}
            title="Refresh"
            aria-label="Refresh"
            className={`grid h-11 w-11 place-items-center rounded-xl border border-white/20 text-side-ink hover:bg-white/10 disabled:opacity-50 ${FOCUS_ON_DARK}`}
          >
            <Icon d={REFRESH} className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className={`inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm font-semibold text-side-ink hover:bg-white/10 ${FOCUS_ON_DARK}`}
          >
            <Icon d={LOGOUT} className="h-4.5 w-4.5" />
            Sign out
          </button>
        </div>
      </header>

      {/* Pill-style tabs; they scroll sideways on a phone instead of widening the page. */}
      <div className="-mx-4 mt-6 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:px-0">
        <div className="flex w-max gap-1 rounded-2xl bg-surface p-1 ring-1 ring-line" role="tablist">
          {TABS.map(({ id, label }) => {
            const n = counts[id] ?? 0;
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectTab(id)}
                className={`flex min-h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${active ? "bg-primary text-primary-ink" : "text-muted hover:text-ink"}`}
              >
                {label}
                {n > 0 && <span className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${active ? "bg-white/35 text-primary-ink" : "bg-primary/15 text-primary-strong"}`}>{n}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {sealState !== "ok" && sealState !== "loading" && tab !== "security" && (
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-accent-soft px-4 py-3 text-sm">
          {SEAL_BANNER[sealState]}
          <button type="button" onClick={() => selectTab("security")} className="font-semibold underline underline-offset-2">
            Open Security
          </button>
        </p>
      )}

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

type Update = (kind: "support" | "report", id: string, patch: { resolved?: boolean; bugConfirmed?: boolean }) => void;

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-colors ${
        on ? "border-primary bg-primary/10 text-primary-strong" : "border-line text-ink hover:bg-surface-2"
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
        <a href={`https://t.me/${handle(telegram)}`} target="_blank" rel="noreferrer" className={`${chip} hover:text-primary-strong`}>
          <Icon d={CONTACT_ICONS.telegram} className="h-4 w-4 shrink-0 text-muted" />@{handle(telegram)}
        </a>
      )}
      {instagram && (
        <a href={`https://instagram.com/${handle(instagram)}`} target="_blank" rel="noreferrer" className={`${chip} hover:text-primary-strong`}>
          <Icon d={CONTACT_ICONS.instagram} className="h-4 w-4 shrink-0 text-muted" />@{handle(instagram)}
        </a>
      )}
      {other && <span className={chip}>{other}</span>}
    </div>
  );
}

/** Placeholder for a sealed row this browser can't open. */
export function Locked({ why }: { why: "no-key" | "wrong-key" }) {
  return <p className="mt-2 rounded-xl bg-surface-2 px-3.5 py-3 text-sm text-muted">{LOCKED_TEXT[why]}</p>;
}

/**
 * A support request's screenshot. The file is fetched with the device signature (an <img src> can't carry it), opened here when it's
 * sealed (*.enc), and shown from a blob URL that is revoked on unmount. Loads when the card scrolls near the screen.
 */
function Screenshot({ file, mime }: { file: string; mime?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((x) => x.isIntersecting)) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    let live = true;
    let made: string | null = null;
    (async () => {
      try {
        const res = await adminFetch(`/api/admin/screenshot/${file}`, { cache: "no-store" });
        if (!res.ok) throw new Error("The screenshot couldn't be loaded.");
        let blob: Blob;
        if (file.endsWith(".enc")) {
          const opened = await openBytesAny(new Uint8Array(await res.arrayBuffer()));
          if (!opened.ok) throw new Error(LOCKED_TEXT[opened.why]);
          blob = new Blob([opened.data], { type: mime && /^image\/(jpeg|png|webp)$/.test(mime) ? mime : "image/png" });
        } else blob = await res.blob();
        if (!live) return;
        made = URL.createObjectURL(blob);
        setUrl(made);
      } catch (e) {
        if (live) setFailed(e instanceof Error ? e.message : "The screenshot couldn't be opened.");
      }
    })();
    return () => {
      live = false;
      if (made) URL.revokeObjectURL(made);
    };
  }, [near, file, mime]);

  return (
    <div ref={box} className="mt-3 w-fit max-w-full">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="block w-fit max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- private, admin-only image */}
          <img src={url} alt="Screenshot from the request (opens full size)" decoding="async" className="max-h-64 max-w-full rounded-xl bg-surface-2 object-contain ring-1 ring-line" />
        </a>
      ) : (
        <p className="rounded-xl bg-surface-2 px-3.5 py-3 text-sm text-muted">{failed ?? "Loading the screenshot…"}</p>
      )}
    </div>
  );
}

function SupportCard({ r, update }: { r: SupportRequest; update: Update }) {
  return (
    <article className={`rounded-2xl border border-line bg-surface p-4 sm:p-5 ${r.resolved ? "opacity-70" : ""}`}>
      <time className="text-sm text-muted">{when(r.at)}</time>
      {r.locked ? (
        <Locked why={r.locked} />
      ) : (
        <>
          <p className="mt-2 whitespace-pre-wrap break-words">{r.message}</p>
          {r.screenshot && <Screenshot file={r.screenshot} mime={r.shotMime} />}
          <Contacts telegram={r.telegram} instagram={r.instagram} other={r.other} />
        </>
      )}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
        <Toggle on={Boolean(r.bugConfirmed)} onClick={() => update("support", r.id, { bugConfirmed: !r.bugConfirmed })}>
          Real bug · 50% off
        </Toggle>
        <Toggle on={Boolean(r.resolved)} onClick={() => update("support", r.id, { resolved: !r.resolved })}>
          Resolved
        </Toggle>
        {r.bugConfirmed && (
          <span className="inline-flex min-h-11 items-center text-sm text-muted">
            {r.discount === "open"
              ? `${PLUS.bugDiscountPercent ?? 50}% off sent to account`
              : r.discount === "used"
                ? "Discount used"
                : r.discount === "revoked"
                  ? "Discount taken back"
                  : "No discount recorded (give it from Accounts)"}
          </span>
        )}
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
          <Link href={`/practice?section=${q.section}&q=${q.n}`} target="_blank" className="inline-flex min-h-10 items-center font-semibold hover:text-primary-strong">
            {sectionName} #{q.n} · {getSkill(q.skill)?.name ?? q.skill}
          </Link>
        ) : (
          <span className="font-semibold break-all">{r.qid}</span>
        )}
        <time className="text-sm text-muted">{when(r.at)}</time>
      </div>
      <p className="mt-2 text-sm font-medium text-primary-strong">{REPORT_REASONS[r.reason] ?? r.reason}</p>
      {r.locked ? <Locked why={r.locked} /> : r.note && <p className="mt-1 whitespace-pre-wrap break-words">{r.note}</p>}
      {q && (
        <div className="mt-3 rounded-xl bg-surface-2 px-3.5 py-3 text-sm">
          <p className="line-clamp-2 text-muted">{q.text}</p>
          <p className="mt-1.5">
            Answer key: <span className="font-semibold">{q.answer}</span>
          </p>
        </div>
      )}
      {!r.locked && <Contacts telegram={r.telegram} instagram={r.instagram} />}
      <div className="mt-4 border-t border-line pt-4">
        <Toggle on={r.resolved} onClick={() => update("report", r.id, { resolved: !r.resolved })}>
          Resolved
        </Toggle>
      </div>
    </article>
  );
}
