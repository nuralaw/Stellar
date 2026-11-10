// Time zones for test day: the student's device zone by default, or the country they test in (set in Profile).

import { COUNTRY_ZONES } from "./tz-data";

// Old names some browsers still report → the names used in COUNTRY_ZONES.
const ALIASES: Record<string, string> = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Asia/Katmandu": "Asia/Kathmandu",
  "Asia/Saigon": "Asia/Ho_Chi_Minh",
  "Asia/Rangoon": "Asia/Yangon",
  "Europe/Kiev": "Europe/Kyiv",
  "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
  "Atlantic/Faeroe": "Atlantic/Faroe",
  "Pacific/Truk": "Pacific/Chuuk",
  "Pacific/Ponape": "Pacific/Pohnpei",
  "America/Godthab": "America/Nuuk",
  "Asia/Ulan_Bator": "Asia/Ulaanbaatar",
  "Asia/Dacca": "Asia/Dhaka",
  "Asia/Thimbu": "Asia/Thimphu",
  "Asia/Ujung_Pandang": "Asia/Makassar",
  "Asia/Chongqing": "Asia/Shanghai",
  "Asia/Harbin": "Asia/Shanghai",
  "UTC": "Etc/UTC",
};

export const canonicalZone = (tz: string) => ALIASES[tz] ?? tz;

export function isValidZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** The device's time zone (browser only). */
export function deviceZone(): string {
  try {
    return canonicalZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "Etc/UTC");
  } catch {
    return "Etc/UTC";
  }
}

/** Saved zone if valid, else the device zone. */
export function effectiveZone(saved: string | null): string {
  return saved && isValidZone(saved) ? saved : deviceZone();
}

const ZONE_COUNTRY = new Map<string, string>();
for (const [cc, zones] of Object.entries(COUNTRY_ZONES)) for (const [z] of zones) ZONE_COUNTRY.set(z, cc);

export function countryOfZone(tz: string): string | undefined {
  return ZONE_COUNTRY.get(canonicalZone(tz));
}

let regionNames: Intl.DisplayNames | undefined;
export function countryName(cc: string): string {
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(cc) ?? cc;
  } catch {
    return cc;
  }
}

/** Every country, sorted by English name. */
export function countryList(): { code: string; name: string }[] {
  return Object.keys(COUNTRY_ZONES)
    .map((code) => ({ code, name: countryName(code) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Main zone for countries with several (usually the capital / most people).
const MAIN_ZONE: Record<string, string> = {
  US: "America/New_York",
  CA: "America/Toronto",
  MX: "America/Mexico_City",
  BR: "America/Sao_Paulo",
  AR: "America/Argentina/Buenos_Aires",
  CL: "America/Santiago",
  EC: "America/Guayaquil",
  RU: "Europe/Moscow",
  UA: "Europe/Kyiv",
  KZ: "Asia/Almaty",
  UZ: "Asia/Tashkent",
  MN: "Asia/Ulaanbaatar",
  CN: "Asia/Shanghai",
  ID: "Asia/Jakarta",
  MY: "Asia/Kuala_Lumpur",
  AU: "Australia/Sydney",
  NZ: "Pacific/Auckland",
  ES: "Europe/Madrid",
  PT: "Europe/Lisbon",
  DE: "Europe/Berlin",
  CY: "Asia/Nicosia",
  CD: "Africa/Kinshasa",
  PS: "Asia/Gaza",
};

/** Default zone when a country is picked. */
export function mainZone(cc: string): string | undefined {
  const zones = COUNTRY_ZONES[cc];
  if (!zones) return undefined;
  return MAIN_ZONE[cc] ?? zones.find(([, note]) => note?.includes("most"))?.[0] ?? zones[0][0];
}

/** "Asia/Almaty" → "Almaty" */
export const zoneCity = (tz: string) => tz.split("/").pop()!.replace(/_/g, " ");

/** Milliseconds the zone is ahead of UTC at the given instant. */
export function zoneOffsetMs(tz: string, utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(new Date(utcMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** "UTC+5", "UTC−3:30" */
export function utcOffsetLabel(tz: string, at: number): string {
  const m = Math.round(zoneOffsetMs(tz, at) / 60_000);
  if (m === 0) return "UTC";
  const h = Math.floor(Math.abs(m) / 60);
  const mm = Math.abs(m) % 60;
  return `UTC${m > 0 ? "+" : "−"}${h}${mm ? `:${String(mm).padStart(2, "0")}` : ""}`;
}

/** The instant (Unix ms) of `hour`:00 on local date "YYYY-MM-DD" in the given zone. */
export function zonedInstant(iso: string, hour: number, tz: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, hour);
  const first = guess - zoneOffsetMs(tz, guess);
  return guess - zoneOffsetMs(tz, first); // second pass settles DST changes
}

/** Today's date "YYYY-MM-DD" in the given zone. */
export function todayIn(tz: string, now: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(now));
  const get = (t: string) => parts.find((p) => p.type === t)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
