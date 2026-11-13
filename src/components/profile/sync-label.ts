import type { SyncState } from "@/lib/sync-status";

// How the account sync reads in the sidebar card and on /profile (signed-in students only).

/** text: short label; title: tooltip; detail: extra words where there is room (/profile); dot: status-dot classes. */
export type SyncLabel = { text: string; title?: string; detail?: string; dot: string };

const time = (at: number) => new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function syncLabel(s: SyncState): SyncLabel {
  switch (s.status) {
    case "synced":
      return { text: "Synced", title: s.at ? `Last synced ${time(s.at)}` : undefined, detail: s.at ? `last at ${time(s.at)}` : undefined, dot: "bg-success" };
    case "syncing":
      return { text: "Syncing…", dot: "bg-muted animate-pulse" };
    case "offline":
      return { text: "Offline — will sync", title: "No connection. Your progress is kept here and syncs when you're back online.", dot: "bg-muted" };
    case "error":
      return { text: "Sync error", title: s.error || "The server refused the sync.", detail: s.error || undefined,dot: "bg-danger" };
    default:
      // Signed in, but the first sync hasn't reported yet.
      return { text: "Signed in", dot: "bg-muted" };
  }
}

/** /login link that comes back to `path` afterwards. */
export const loginHref = (path: string | null) => `/login?next=${encodeURIComponent(!path || path.startsWith("/login") ? "/" : path)}`;
