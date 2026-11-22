import type { RankedErrorCode } from "@/lib/elo-api-types";
import { getUserId } from "@/lib/store";

// Browser side of /api/ranked/**: every call is no-store JSON. Errors arrive as { error, code } (elo-api-types.ts).
// userId = this browser's guest id, the same one the tournament sends: without Supabase (local dev) the API identifies
// the player by it; signed in, the server uses the account and ignores it.

export class RankedApiError extends Error {
  code: RankedErrorCode | "network" | "fullscreen";
  status: number;
  constructor(message: string, code: RankedErrorCode | "network" | "fullscreen", status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { cache: "no-store", ...init });
  } catch {
    throw new RankedApiError("Couldn't reach the server. Check your connection and try again.", "network", 0);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new RankedApiError(typeof json.error === "string" ? json.error : `HTTP ${res.status}`, (json.code as RankedErrorCode | undefined) ?? "bad_request", res.status);
  return json as T;
}

export function rankedGet<T>(path: string): Promise<T> {
  const id = getUserId();
  return call<T>(`${path}${path.includes("?") ? "&" : "?"}userId=${id}&anonId=${id}`);
}

export function rankedPost<T>(path: string, body: Record<string, unknown> = {}): Promise<T> {
  const id = getUserId();
  return call<T>(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, userId: id, anonId: id }) });
}

export function rankedDelete<T>(path: string): Promise<T> {
  const id = getUserId();
  return call<T>(`${path}${path.includes("?") ? "&" : "?"}userId=${id}&anonId=${id}`, { method: "DELETE" });
}

/** Fire-and-forget DELETE that survives the page going away (leaving the search screen: unmount, reload, close). */
export function rankedDeleteKeepalive(path: string) {
  const id = getUserId();
  void fetch(`${path}${path.includes("?") ? "&" : "?"}userId=${id}&anonId=${id}`, { method: "DELETE", keepalive: true, cache: "no-store" }).catch(() => {});
}

/** Fire-and-forget POST that survives the page going away (reload / close). */
export function rankedBeacon(path: string, body: Record<string, unknown>) {
  const id = getUserId();
  navigator.sendBeacon?.(path, new Blob([JSON.stringify({ ...body, userId: id, anonId: id })], { type: "application/json" }));
}

/** "0:07", "2:35": elapsed or remaining time as m:ss. */
export function fmtClock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** A countdown as m:ss, rounded up: "0:01" stays until the last second has really passed. */
export function fmtCountdown(ms: number): string {
  return fmtClock(Math.ceil(Math.max(0, ms) / 1000) * 1000);
}

/** "+12", "−8", "0" (real minus sign). */
export function fmtDelta(n: number): string {
  return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : "0";
}

/** "12.4 s" */
export function fmtSeconds(ms: number | null): string {
  return ms === null ? "–" : `${(ms / 1000).toFixed(1)} s`;
}
