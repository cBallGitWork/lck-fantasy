// @vitest-environment node
import { expect, test } from "vitest";
import { expectInOrder, html, text } from "../../testing/render";
import { POINTS_FIXTURE } from "./fixtures";
import { PointsPage } from "./PointsPage";

// The coach's and the bench's breakdowns (spec/12, Points; Craig, 17 Nov 2026).

test("the Coach's sheet (coach.png): his lines, each series' result its own row under its games, no C or Captains averaged, and his coach card", () => {
  const coach = <PointsPage data={POINTS_FIXTURE} open="kkOma" />;
  expect(html(coach)).toContain('href="/coach/kkoma"');
  const out = text(coach);
  expect(out).not.toContain("Captains averaged");
  expectInOrder(out, [
    "kkOma김정균",
    "T1 · Coach",
    "10Not final",
    "Wed v HLE W 2–1 ›8",
    "G1WFirst tower · Most drakes2",
    "G2L0",
    "G3WFirst tower · Most drakes · Most barons3",
    "Series win+3",
    "Sat v DK 1–0 ›2",
    "G1WFirst tower · Most barons2",
    "G2Live 14:200",
  ]);
});

test("a coach's lost series ends with Series loss −1, and the live one with no row", () => {
  const coach = POINTS_FIXTURE.starters.find((p) => p.role === "coach");
  if (!coach) throw new Error("No coach");
  const lost = { ...coach, series: coach.series.map((s, i) => (i === 0 ? { ...s, score: [1, 2] as const, coachResult: -1 } : s)) };
  const data = { ...POINTS_FIXTURE, starters: POINTS_FIXTURE.starters.map((p) => (p === coach ? lost : p)) };
  const out = text(<PointsPage data={data} open="kkOma" />);
  expectInOrder(out, ["Wed v HLE L 1–2 ›", "G3", "Series loss−1", "Sat v DK 1–0 ›", "G2Live 14:200", "Full stats ›"]);
  expect(out.match(/Series (win|loss)/g)).toHaveLength(1);
});

test("both bench players open their breakdown, the one who didn't play too", () => {
  const bench = html(<PointsPage data={POINTS_FIXTURE} />).split('class="panel bench-bar"')[1] ?? "";
  expect(bench.match(/role="button"/g)).toHaveLength(2);
});

test("a bench player's breakdown greys his points, which don't count with no Bench Boost or auto-sub", () => {
  const cuzz = <PointsPage data={POINTS_FIXTURE} open="Cuzz" />;
  expect(text(cuzz)).toContain("KT · Jungle9Wed v GEN L 0–2 ›1");
  const sheet = html(cuzz).split('role="dialog"')[1] ?? "";
  expect(sheet).toContain("points__breakdown-total--off");
  expect(sheet).not.toContain("points__breakdown-counted");
  expect(sheet.match(/points__breakdown-game--dropped/g)).toHaveLength(5);
});

test("a bench player with no games opens a breakdown that says Didn't play", () => {
  const out = text(<PointsPage data={POINTS_FIXTURE} open="Bdd" />);
  const sheet = out.slice(out.lastIndexOf("Bdd"));
  expectInOrder(sheet, ["Bdd", "KT · Mid", "—", "Didn't play", "Full stats ›"]);
  expect(sheet).not.toMatch(/ v [A-Z]+ /);
});
