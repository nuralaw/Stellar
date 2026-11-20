// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test src/lib/elo-season.test.ts  (node:test, Node 24 runs the .ts file directly).

import { test } from "node:test";
import assert from "node:assert/strict";
import { prevSeasonKey, seasonKey, seasonLabel, seasonRange, timeUntil, weekKey, weekLabel, weekRange, weekStart } from "./elo-season.ts";

const at = (iso: string) => Date.parse(iso);

test("seasonKey is the UTC month, including the boundary instants", () => {
  assert.equal(seasonKey(at("2026-11-20T12:00:00Z")), "2026-11");
  assert.equal(seasonKey(at("2026-11-01T00:00:00Z")), "2026-11");
  assert.equal(seasonKey(at("2026-10-31T23:59:59.999Z")), "2026-10");
  // 00:30 on Dec 1 in UTC+2 is 22:30 on Nov 30 in UTC: the instant decides, not the offset in the string.
  assert.equal(seasonKey(at("2026-12-01T00:30:00+02:00")), "2026-11");
});

test("prevSeasonKey rolls the year back from January", () => {
  assert.equal(prevSeasonKey(at("2026-11-20T00:00:00Z")), "2026-10");
  assert.equal(prevSeasonKey(at("2027-01-01T00:00:00Z")), "2026-12");
  assert.equal(prevSeasonKey(at("2027-01-31T23:59:59Z")), "2026-12");
  assert.equal(prevSeasonKey(at("2026-03-31T10:00:00Z")), "2026-02");
  assert.equal(prevSeasonKey(at("2026-12-31T23:59:59Z")), "2026-11");
});

test("seasonRange covers [first of month, first of next month), Dec -> Jan, and rejects bad keys", () => {
  assert.deepEqual(seasonRange("2026-12"), { from: at("2026-12-01T00:00:00Z"), to: at("2027-01-01T00:00:00Z") });
  assert.deepEqual(seasonRange("2028-02"), { from: at("2028-02-01T00:00:00Z"), to: at("2028-03-01T00:00:00Z") });
  for (const bad of ["2026-13", "2026-00", "2026-1", "26-11", "", "2026-11-01"]) assert.equal(seasonRange(bad), null, bad);
});

test("weeks start on Monday 00:00 UTC", () => {
  // 2026-11-16 is a Monday.
  assert.equal(weekKey(at("2026-11-16T00:00:00Z")), "2026-11-16");
  assert.equal(weekKey(at("2026-11-16T00:00:00.001Z")), "2026-11-16");
  assert.equal(weekKey(at("2026-11-22T23:59:59.999Z")), "2026-11-16"); // Sunday night
  assert.equal(weekKey(at("2026-11-23T00:00:00Z")), "2026-11-23"); // next Monday
  assert.equal(weekKey(at("2026-11-15T23:59:59.999Z")), "2026-11-09"); // Sunday before
  assert.equal(weekStart(at("2026-11-20T12:00:00Z")), at("2026-11-16T00:00:00Z"));
});

test("a week can start in the previous month or year", () => {
  assert.equal(weekKey(at("2027-01-01T10:00:00Z")), "2026-12-28"); // Friday
  assert.equal(weekKey(at("2026-12-31T23:59:59Z")), "2026-12-28");
  assert.equal(weekKey(at("2027-01-04T00:00:00Z")), "2027-01-04");
  assert.equal(weekKey(at("2026-12-01T05:00:00Z")), "2026-11-30"); // Tuesday
});

test("weekRange is seven days and rejects bad keys", () => {
  assert.deepEqual(weekRange("2026-11-16"), { from: at("2026-11-16T00:00:00Z"), to: at("2026-11-23T00:00:00Z") });
  assert.deepEqual(weekRange("2026-12-28"), { from: at("2026-12-28T00:00:00Z"), to: at("2027-01-04T00:00:00Z") });
  for (const bad of ["2026-11", "nope", "", "2026-1-1"]) assert.equal(weekRange(bad), null, bad);
});

test("labels", () => {
  assert.equal(seasonLabel("2026-11"), "November 2026");
  assert.equal(seasonLabel("2027-01"), "January 2027");
  assert.equal(weekLabel("2026-11-16"), "Nov 16 – 22");
  assert.equal(weekLabel("2026-11-30"), "Nov 30 – Dec 6");
  assert.equal(weekLabel("2026-12-28"), "Dec 28 – Jan 3");
});

test("timeUntil", () => {
  const now = at("2026-11-20T00:00:00Z");
  assert.equal(timeUntil(now + (3 * 1440 + 4 * 60 + 5) * 60_000, now), "3d 4h");
  assert.equal(timeUntil(now + (5 * 60 + 12) * 60_000, now), "5h 12m");
  assert.equal(timeUntil(now + 8 * 60_000, now), "8m");
  assert.equal(timeUntil(now - 5000, now), "0m");
});
