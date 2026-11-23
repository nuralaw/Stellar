import { domainsFor, getDomain } from "./taxonomy";

// The one lesson order: the /lessons page shows it, and "Next lesson" follows it.
// Start here (in the order lessons.ts gives), then Reading and Writing, then Math, each by domain and skill (taxonomy.ts).

export type LessonTab = "strategy" | "rw" | "math";
export const LESSON_TABS: LessonTab[] = ["strategy", "rw", "math"];

interface Orderable {
  section: LessonTab;
  skill: string;
}

/** One group of a tab: a domain with its lessons in skill order (the strategy tab is one group with no name). */
export interface LessonGroup<T> {
  id: string;
  name: string | null;
  lessons: T[];
}

/** The groups of one tab, in display order. Lessons whose skill isn't in the taxonomy come last. */
export function lessonGroups<T extends Orderable>(lessons: T[], tab: LessonTab): LessonGroup<T>[] {
  const own = lessons.filter((l) => l.section === tab);
  if (tab === "strategy") return own.length ? [{ id: "strategy", name: null, lessons: own }] : [];
  const bySkill = new Map(own.map((l) => [l.skill, l]));
  const groups: LessonGroup<T>[] = domainsFor(tab)
    .map((d) => ({ id: d.id, name: d.name, lessons: d.skills.map((s) => bySkill.get(s.id)).filter((l): l is T => Boolean(l)) }))
    .filter((g) => g.lessons.length);
  const listed = new Set(groups.flatMap((g) => g.lessons));
  const rest = own.filter((l) => !listed.has(l));
  return rest.length ? [...groups, { id: `${tab}-other`, name: "More", lessons: rest }] : groups;
}

/** The lessons of one domain, in the domain's skill order. */
export function domainLessons<T extends { skill: string }>(lessons: T[], domainId: string): T[] {
  const bySkill = new Map(lessons.map((l) => [l.skill, l]));
  return (getDomain(domainId)?.skills ?? []).map((s) => bySkill.get(s.id)).filter((l): l is T => Boolean(l));
}

/** Every lesson in the order the /lessons page shows them. */
export function orderLessons<T extends Orderable>(lessons: T[]): T[] {
  return LESSON_TABS.flatMap((tab) => lessonGroups(lessons, tab).flatMap((g) => g.lessons));
}
