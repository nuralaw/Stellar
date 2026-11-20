// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --conditions=react-server --test src/lib/elo-admin-data.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { AdminBadRequest, createSupabaseAdminData, flagMatch, pairTime, parseListFilter } from "./elo-admin-data.ts";
import type { EloMatch } from "./elo-store.ts";

const H = 3_600_000;
const T0 = Date.UTC(2026, 10, 18, 12, 0, 0);

/** A fake PostgREST: serves `rows` of one table, honouring offset / limit but never more than `maxRows` per response (Max Rows). */
function fakePostgrest(table: string, all: Record<string, unknown>[], maxRows = 1000) {
  const seen: string[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: unknown) => {
    const u = new URL(String(input));
    seen.push(u.pathname + u.search);
    assert.ok(u.pathname.endsWith(`/rest/v1/${table}`), `unexpected table ${u.pathname}`);
    let rows = all;
    const inList = u.searchParams.get("match_id");
    if (inList?.startsWith("in.(")) {
      const ids = new Set(inList.slice(4, -1).split(","));
      rows = rows.filter((r) => ids.has(String(r.match_id)));
    }
    const offset = Number(u.searchParams.get("offset") ?? 0);
    const limit = Math.min(Number(u.searchParams.get("limit") ?? maxRows), maxRows);
    const page = rows.slice(offset, offset + limit);
    const range = `${page.length ? offset : "*"}${page.length ? `-${offset + page.length - 1}` : ""}/${rows.length}`;
    return new Response(JSON.stringify(page), { status: 200, headers: { "content-range": range } });
  }) as typeof fetch;
  return { seen, restore: () => void (globalThis.fetch = realFetch) };
}

function answerRows(matches: number) {
  const out: Record<string, unknown>[] = [];
  const ids: string[] = [];
  for (let m = 0; m < matches; m++) {
    const id = randomUUID();
    ids.push(id);
    for (const user of ["u1", "u2"]) {
      for (let idx = 0; idx < 10; idx++) {
        out.push({ match_id: id, user_id: user, idx, qid: `q${idx}`, section: "rw", difficulty: "easy", limit_s: 60, issued_at: new Date(T0).toISOString(), status: "answered", correct: true, base: 100, bonus: 0, points: 100 });
      }
    }
  }
  return { rows: out, ids };
}

test("answers: a 1600-row set (80 matches x 20) is read completely despite the 1000-row cap", async () => {
  const { rows, ids } = answerRows(80);
  assert.equal(rows.length, 1600);
  const fake = fakePostgrest("elo_answers", rows);
  try {
    const got = await createSupabaseAdminData("http://sb.test", "key").answers(ids);
    assert.equal(got.length, 1600);
    assert.equal(new Set(got.map((a) => `${a.matchId}|${a.userId}|${a.idx}`)).size, 1600, "no row twice");
    assert.ok(fake.seen.length >= 2, "80 matches go out in more than one request");
    assert.ok(fake.seen.every((p) => p.includes("order=match_id.asc,user_id.asc,idx.asc")), "stable order on every page");
  } finally {
    fake.restore();
  }
});

test("a chunk is paged until the total is reached, whatever Max Rows the server has", async () => {
  const { rows, ids } = answerRows(60); // 1200 rows
  const fake = fakePostgrest("elo_answers", rows);
  try {
    // One chunk of 45 matches = 900 rows: a single page under the real cap.
    const got = await createSupabaseAdminData("http://sb.test", "key").answers(ids.slice(0, 45));
    assert.equal(got.length, 900);
  } finally {
    fake.restore();
  }
  const capped = fakePostgrest("elo_answers", rows, 400); // the server returns at most 400 rows whatever limit says
  try {
    const got = await createSupabaseAdminData("http://sb.test", "key").answers(ids.slice(0, 45));
    assert.equal(got.length, 900, "pages of 400 are followed to the end");
    assert.equal(capped.seen.length, 3);
  } finally {
    capped.restore();
  }
});

test("same pair is dated by when B joined, not when A created the match", () => {
  const m = { bStartedAt: T0 + 40 * H, createdAt: T0 } as EloMatch;
  assert.equal(pairTime(m), T0 + 40 * H);
  assert.equal(pairTime({ bStartedAt: null, createdAt: T0 } as EloMatch), T0);
  const full: EloMatch = {
    id: "m", mode: "mixed", status: "finished", playerA: "a", playerB: "b", questionIds: [], createdAt: T0, aFinishedAt: T0, bStartedAt: T0 + 40 * H, finishedAt: T0 + 41 * H,
    expiresAt: null, pointsA: 1, pointsB: 2, forfeit: null, result: "b", ratingABefore: 1000, ratingBBefore: 1000, deltaA: -10, deltaB: 10,
  };
  assert.equal(flagMatch(full).createdAt, T0 + 40 * H);
});

test("list filter: impossible calendar dates are rejected, real ones and the leap day pass", () => {
  const f = (q: string) => parseListFilter(new URLSearchParams(q));
  assert.throws(() => f("from=2026-02-31"), AdminBadRequest);
  assert.throws(() => f("to=2026-13-01"), AdminBadRequest);
  assert.throws(() => f("from=2026-02-29"), AdminBadRequest); // 2026 is not a leap year
  assert.throws(() => f("from=2026-2-3"), AdminBadRequest);
  assert.equal(f("from=2028-02-29").from, Date.UTC(2028, 1, 29));
  assert.equal(f("to=2026-11-20").to, Date.UTC(2026, 10, 21), "`to` includes its whole day");
  assert.throws(() => f("from=2026-11-20&to=2026-11-19"), AdminBadRequest);
});
