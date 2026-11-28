// Data model of the Admission section: destinations (places you can study abroad) and their universities.

export interface Destination {
  /** URL segment, e.g. "hong-kong". */
  slug: string;
  /** Shown in the UI, e.g. "Hong Kong". */
  name: string;
  /** Globe marker, degrees (north and east positive). */
  lat: number;
  lon: number;
  /** One or two sentences under the heading of the destination page. */
  intro: string;
}

export type TestPolicy = "required" | "accepted" | "not-required";

export interface SourceRef {
  label: string;
  url: string;
}

/** Facts come from the university's own site only (see `sources`); anything not confirmed there is null and is not rendered. */
export interface University {
  slug: string;
  /** Destination.slug */
  destination: string;
  name: string;
  /** Short name, also the monogram when there is no logo file. */
  abbr: string;
  /** Local file under public/, e.g. "/admission/logos/hku.svg": the emblem alone, without the wordmark; null = monogram tile. */
  logo: string | null;
  city: string | null;
  founded: number | null;
  /** Card text, 2–3 lines. */
  summary: string | null;
  /** Paragraphs for the university page. */
  overview: string[] | null;
  /** SAT / ACT for international undergraduate applicants. */
  tests: { policy: TestPolicy; note: string | null; sat: string | null; act: string | null } | null;
  /** One line per accepted English test / route. */
  english: string[] | null;
  deadlines: { label: string; date: string }[] | null;
  /** Tuition for non-local students. */
  tuition: { amount: string; note: string | null } | null;
  scholarships: { name: string; detail: string | null }[] | null;
  links: { website: string; admissions: string | null };
  sources: SourceRef[];
  /** ISO date the facts were last checked against the sources, e.g. "2026-11-27". */
  verifiedOn: string | null;
}

export interface DestinationData {
  destination: Destination;
  universities: University[];
}
