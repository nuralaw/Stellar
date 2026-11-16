import type { Access } from "./access-core";
import type { TestIndexRow } from "./test-types";

// Free students may open the practice tests of the two most recent months in the test index; the rest is Plus.
// Computed from the data, so it rolls forward by itself when newer tests are added. Safe on client and server.

/** Ids of the free tests: every test of the two latest distinct year-months present in `rows`. */
export function freeTestIds(rows: ReadonlyArray<Pick<TestIndexRow, "id" | "year" | "month">>): Set<string> {
  const months = [...new Set(rows.map((t) => t.year * 12 + t.month))].sort((a, b) => b - a).slice(0, 2);
  return new Set(rows.filter((t) => months.includes(t.year * 12 + t.month)).map((t) => t.id));
}

/** Whether this visitor may open the test: it's free, or the plan includes "all-tests". */
export function canOpenTest(access: Pick<Access, "can">, id: string, freeIds: ReadonlySet<string>): boolean {
  return freeIds.has(id) || access.can("all-tests");
}
