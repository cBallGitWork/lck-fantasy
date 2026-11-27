// @vitest-environment node
import { expect, test } from "vitest";
import { expectInOrder, html, text } from "../../testing/render";
import { POINTS_FIXTURE } from "./fixtures";
import { PointsPage } from "./PointsPage";

// The coach's and the bench's weeks on the card under the Rift (approved/points/1440-coach.png, 1440-bench.png; spec/12, Points).

/** The docked card's markup, from its section to the side column. */
const card = (out: string) => (out.split('class="rift-card ')[1] ?? "").split('class="page-frame__side"')[0] ?? "";

test("the Coach's card (1440-coach.png): his lines, no K D A, each series' result its own row under its games, no C or Captains averaged, and his coach card", () => {
  const coach = <PointsPage data={POINTS_FIXTURE} open="kkOma" />;
  expect(html(coach)).toContain('href="/coach/kkoma"');
  const out = text(coach);
  expect(out).not.toContain("Captains averaged");
  expectInOrder(out, [
    "CoachT1 kkOma김정균10",
    "GameScoredPts",
    "Wedv HLE ›W 2–18",
    "G1WFirst tower · Most drakes2",
    "G2L0",
    "G3WFirst tower · Most drakes · Most barons3",
    "Series win+3",
    "Satv DK ›Live 1–02",
    "G1WFirst tower · Most barons2",
    "G2Live14:200",
  ]);
});

test("a coach's lost series ends with Series loss −1, and the live one with no row", () => {
  const coach = POINTS_FIXTURE.starters.find((p) => p.role === "coach");
  if (!coach) throw new Error("No coach");
  const lost = { ...coach, series: coach.series.map((s, i) => (i === 0 ? { ...s, score: [1, 2] as const, coachResult: -1 } : s)) };
  const data = { ...POINTS_FIXTURE, starters: POINTS_FIXTURE.starters.map((p) => (p === coach ? lost : p)) };
  const out = text(<PointsPage data={data} open="kkOma" />);
  expectInOrder(out, ["Wedv HLE ›L 1–2", "G3", "Series loss−1", "Satv DK ›Live 1–0", "G2Live14:200", "Full stats ›"]);
  expect(out.match(/Series (win|loss)/g)).toHaveLength(1);
});

test("both bench players open their week, the one who didn't play too", () => {
  const bench = (html(<PointsPage data={POINTS_FIXTURE} />).split("bench-bar points__bench")[1] ?? "").split('class="rift-card')[0] ?? "";
  expect(bench.match(/role="button"/g)).toHaveLength(2);
});

test("a bench player's card greys his points, which don't count with no Bench Boost or auto-sub", () => {
  const cuzz = <PointsPage data={POINTS_FIXTURE} open="Cuzz" />;
  expect(text(cuzz)).toContain("JungleKT Cuzz문우찬9GameKDAScoredPtsWedv GEN ›L 0–21");
  const sheet = card(html(cuzz));
  expect(sheet).toContain('<span class="points__off">9</span>');
  expect(sheet).not.toContain("num counted");
  expect(sheet.match(/points__card-game--dropped/g)).toHaveLength(5);
});

test("a bench player with no games (1440-bench.png): his head, Didn't play and a dash, then Full stats alone", () => {
  const out = text(<PointsPage data={POINTS_FIXTURE} open="Bdd" />);
  const sheet = out.slice(out.lastIndexOf("MidKT Bdd"), out.lastIndexOf("Leagues"));
  expectInOrder(sheet, ["MidKT Bdd", "Didn't play—", "Full stats ›"]);
  expect(sheet).not.toMatch(/Game|v [A-Z]+ ›/);
  expect(card(html(<PointsPage data={POINTS_FIXTURE} open="Bdd" />))).not.toContain("<table");
});
