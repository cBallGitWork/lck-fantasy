// @vitest-environment node
import { describe, expect, test } from "vitest";
import { MANAGER } from "../../fixtures/week3";
import { expectInOrder, html, text } from "../../testing/render";
import { LCK_HUB } from "./fixtures";
import { nextHub, startHub, type HubAction } from "./hubState";
import { LckHub } from "./LckHub";
import { winPct } from "./StandingsTab";
import type { HubTab, LckHubData } from "./types";

const page = (tab: HubTab, data: LckHubData = LCK_HUB) => <LckHub data={data} account={MANAGER.team} tab={tab} />;

const HEAD = ["Split 1 2027", "스플릿 1", "Deadline", "Wed 07:45", "9h 45m"];
const TABS = ["Fixtures", "Results", "Standings", "Teams"];
const STAGES = ["Groups", "Play-In", "Playoffs"];
const NEWS = [
  "News",
  "Sheep Esports",
  "T1 win five in a row after their opening loss to GEN",
  "Mon 18 Jan ↗",
  'Kiin: "We know where we lost the GEN series"',
  "BNK FEARX bench their jungler for Week 4",
  "Sun 17 Jan ↗",
  "DK's Siwoo leads every top laner in solo kills",
  "Week 4 preview: T1 v GEN on Saturday",
  "Fri 15 Jan ↗",
  "More on Sheep Esports ↗",
];

describe("each state renders from the fixture, in the picture's order", () => {
  test("Fixtures: Week 4 by day, each series with your time alone and both records", () => {
    const out = text(page("Fixtures"));
    expect(out).not.toContain("KST");
    expectInOrder(out, [
      ...HEAD,
      ...TABS,
      ...STAGES,
      "‹Week 4›",
      "20–24 Jan · Bo3Wed20 Jan",
      "4–2HLE08:00DK3–3›",
      "5–1T110:30KT3–3›",
      "Thu21 Jan",
      "5–1GEN08:00BRO1–5›",
      "2–4NS10:30DNS3–3›",
      "Fri22 Jan",
      "3–3KRX08:00BFX1–5›",
      "3–3DK10:30KT3–3›",
      "Sat23 Jan",
      "5–1T108:00GEN5–1›",
      "4–2HLE10:30NS2–4›",
      "Sun24 Jan",
      "1–5BRO08:00BFX1–5›",
      "3–3KRX10:30DNS3–3›",
      ...NEWS,
    ]);
  });

  test("Results: Week 3 by day, the winner bold and the loser plain", () => {
    const out = text(page("Results"));
    expectInOrder(out, [
      ...HEAD,
      ...TABS,
      ...STAGES,
      "‹Week 3›",
      "13–17 Jan · Bo3",
      "Wed13 Jan",
      "T12–1HLE›",
      "GEN2–0KT›",
      "Thu14 Jan",
      "DK2–0NS›",
      "BRO1–2DNS›",
      "Fri15 Jan",
      "KT2–1BFX›",
      "NS0–2KRX›",
      "Sat16 Jan",
      "GEN2–1HLE›",
      "T12–0DK›",
      "Sun17 Jan",
      "KRX2–1BRO›",
      "BFX0–2DNS›",
      ...NEWS,
    ]);
    expect(html(page("Results"))).toMatch(/lck-hub__loser">HLE</);
    expect(html(page("Results"))).not.toMatch(/lck-hub__loser">T1</);
  });

  test("Standings: the two groups, each team named once by its code, its W, L, games, +/−, Win % and last 5", () => {
    const out = text(page("Standings"));
    expectInOrder(out, [
      ...HEAD,
      ...TABS,
      ...STAGES,
      "Baron group",
      "바론 그룹",
      "TeamWLGames WGames L+/−Win %Last 5",
      "1T151114+783%WWWWW",
      "2DK3387+150%WLWWL",
      "3KRX3378−150%LWLWW",
      "4NS2458−333%WWLLL",
      "5BRO15411−717%WLLLL",
      "Elder group",
      "장로 그룹",
      "1GEN51115+683%LWWWW",
      "2HLE4296+367%WWWLL",
      "3DNS338805",
      "4KT3378−150%LWLLW",
      "5BFX1549−517%LWLLL",
      ...NEWS,
    ]);
    expect(out).not.toContain("Dplus KIA");
  });

  test("Teams: the picker, T1's roster in role order with prices, beside its academy; no stage toggle", () => {
    const out = text(page("Teams"));
    expectInOrder(out, [
      ...HEAD,
      ...TABS,
      "T1GENHLEDKKTDNSNSKRXBROBFX",
      "T1LCK",
      "TopDoran 최현준₩12.5m",
      "JungleOner 문현준₩14.0m",
      "MidFaker 이상혁₩18.5m",
      "BotPeyz 김수환₩15.0m",
      "SupportKeria 류민석₩12.0m",
      "CoachkkOma 김정균₩7.0m",
      "T1 Esports AcademyLCK CL",
      "TopHaru 김하루₩5.0m",
      "JungleSejin 박세진₩5.0m",
      "MidDowon 이도원₩5.5m",
      "BotMinjae 최민재₩5.0m",
      "SupportYunho 정윤호₩5.0m",
      ...NEWS,
    ]);
    expect(out).not.toContain("Play-In");
    expect(out).not.toContain("Coach—");
  });
});

describe("links", () => {
  test("a series opens the Series page; a player and a coach open their cards; a headline leaves Flol", () => {
    expect(html(page("Fixtures"))).toContain('href="/series/w4-wed-1"');
    expect(html(page("Results"))).toContain('href="/series/w3-sun-2"');
    const teams = html(page("Teams"));
    expect(teams).toContain('href="/player/faker"');
    expect(teams).toContain('href="/coach/kkoma"');
    expect(html(page("Fixtures"))).toMatch(/href="https:\/\/www\.sheepesports\.com\/" target="_blank"/);
  });

  test("the top bar marks LCK", () => {
    expect(html(page("Fixtures"))).toMatch(/aria-current="page"[^>]*>LCK</);
  });
});

describe("controls", () => {
  const run = (actions: HubAction[], data: LckHubData = LCK_HUB) => actions.reduce((s, a) => nextHub(data, s, a), startHub(data));

  const groups = LCK_HUB.stages[0];
  if (!groups) throw new Error("The fixture has a Groups stage");
  const twoWeeks: LckHubData = {
    ...LCK_HUB,
    stages: [{ ...groups, results: [{ label: "Week 2", dates: "6–10 Jan", series: [] }, ...groups.results], openResults: 1 }, ...LCK_HUB.stages.slice(1)],
  };

  test("a tab and a stage switch the view; a stage opens on its own weeks", () => {
    expect(run([{ type: "tab", tab: "Standings" }]).tab).toBe("Standings");
    expect(run([{ type: "stage", stage: 1 }]).stage).toBe(1);
    const back = run([{ type: "week", tab: "Results", step: -1 }, { type: "stage", stage: 1 }, { type: "stage", stage: 0 }], twoWeeks);
    expect(back.resultsWeek).toBe(1);
  });

  test("a team in the picker becomes the chosen team", () => {
    const state = run([{ type: "tab", tab: "Teams" }, { type: "team", team: "GEN" }]);
    expect(state.team).toBe("GEN");
  });

  test("‹ and › step through the stage's weeks and stop at its ends", () => {
    expect(run([{ type: "week", tab: "Results", step: -1 }], twoWeeks).resultsWeek).toBe(0);
    expect(run([{ type: "week", tab: "Results", step: -1 }, { type: "week", tab: "Results", step: -1 }], twoWeeks).resultsWeek).toBe(0);
    expect(run([{ type: "week", tab: "Results", step: 1 }], twoWeeks).resultsWeek).toBe(1);
    expect(run([{ type: "week", tab: "Fixtures", step: 1 }], twoWeeks).fixturesWeek).toBe(0);
  });

  test("an arrow is a key only where there is a week that way", () => {
    const out = html(page("Results", twoWeeks));
    expect(out).toMatch(/<button[^>]*aria-label="Previous week"(?![^>]*disabled)/);
    expect(out).toMatch(/<button[^>]*aria-label="Next week"[^>]*disabled/);
    expect(html(page("Fixtures"))).toMatch(/<button[^>]*aria-label="Previous week"[^>]*disabled/);
  });

  test("a stage with no series yet says when it starts, from the competition's data", () => {
    const noGroups: LckHubData = { ...LCK_HUB, stages: LCK_HUB.stages.slice(1) };
    for (const tab of ["Fixtures", "Results", "Standings"] as const) expect(text(page(tab, noGroups))).toContain("Starts Wed 10 Mar");
  });

  test("Fixtures opens on this week, and its ‹ is off: past weeks are on Results", () => {
    const week = (label: string) => ({ label, dates: "", series: [] });
    const midSplit: LckHubData = {
      ...LCK_HUB,
      stages: [{ ...groups, fixtures: [week("Week 2"), week("Week 3"), week("Week 4"), week("Week 5")], thisWeek: 2 }, ...LCK_HUB.stages.slice(1)],
    };
    const out = html(page("Fixtures", midSplit));
    expect(text(page("Fixtures", midSplit))).toContain("‹Week 4›");
    expect(out).toMatch(/<button[^>]*aria-label="Previous week"[^>]*disabled/);
    expect(out).toMatch(/<button[^>]*aria-label="Next week"(?![^>]*disabled)/);
    expect(run([{ type: "week", tab: "Fixtures", step: -1 }], midSplit).fixturesWeek).toBe(0);
    expect(run([{ type: "week", tab: "Fixtures", step: 1 }, { type: "week", tab: "Fixtures", step: 1 }], midSplit).fixturesWeek).toBe(1);
  });
});

test("Win % is rounded, and a dash before a team's first series", () => {
  expect([winPct({ won: 2, lost: 1 }), winPct({ won: 0, lost: 0 })]).toEqual(["67%", "—"]);
});
