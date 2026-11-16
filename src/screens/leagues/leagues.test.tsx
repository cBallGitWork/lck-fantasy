// @vitest-environment node
import { describe, expect, test } from "vitest";
import { MANAGERS, MINJI_WEEK3 } from "../../fixtures/managers";
import { MY_SEASON_TOTAL } from "../../fixtures/myLeagues";
import { MANAGER, MY_WEEK3, SEASON } from "../../fixtures/week3";
import { expectInOrder, html, htmlAt, noop, plain, text } from "../../testing/render";
import { COMPETITION, LEAGUE_NAME_MAX, LEAGUES } from "./fixtures";
import { chaseText } from "./format";
import { adminItems, LeagueTable, type LeagueActions, type TableProps } from "./LeagueTable";
import { OverallTable } from "./OverallTable";
import { tableKey, type LeagueView } from "./types";

const ACTIONS: LeagueActions = { onCopyLink: noop, onRename: noop, onRemoveManager: noop, onDelete: noop, onLeave: noop };

/** A league's table props on its opening tab, from the fixture. */
function tableProps(league: LeagueView): TableProps {
  const group = league.kind === "overall" ? league.openGroup : undefined;
  return { competition: COMPETITION, tab: league.openTab, onTab: noop, table: league.tables[tableKey(COMPETITION, league.openTab, group)], page: 1, onPage: noop, onFindMe: noop };
}

function privateLeague(id: string) {
  const league = LEAGUES[id];
  if (league?.kind !== "private") throw new Error(`${id} is not a private league in the fixture`);
  return league;
}

describe("a league you made (league.html)", () => {
  const league = privateLeague("pub-league");
  const out = text(<LeagueTable league={league} nameMax={LEAGUE_NAME_MAX} actions={ACTIONS} {...tableProps(league)} />);

  test("heads with the name, scoring week, code, Copy link and Admin, then the tabs and table head", () => {
    expectInOrder(out, ["Pub League", "Scoring from Week 1", "PUB-7K2Q", "Copy link", "Admin ▾", "Season", "Split 1", "Split 2", "Rank", "Team · Manager", "Carry", "Week 3", "Total"]);
    expect(out).not.toContain("Leave");
  });

  test("lists all 12 rows in rank order, your row with its chase tag", () => {
    expectInOrder(out, [`1—${MANAGERS.minji.team}${MANAGERS.minji.name}Ruler93315`, `21${MANAGER.team}${MANAGER.name}13 pts to 1stFaker94302`, "Peanut Butter Gank", "Gank PlankRuth AdeFaker55223"]);
    expect(html(<LeagueTable league={league} nameMax={LEAGUE_NAME_MAX} actions={ACTIONS} {...tableProps(league)} />)).toMatch(/class="leagues__mine"[^]*Baron Steal FC/);
  });

  test("your week is Points' Week 3 so far, your total the season's, Minji's her profile's", () => {
    const rows = league.tables.Season?.runs.flat() ?? [];
    expect(rows.find((r) => r.mine)).toMatchObject({ week: MY_WEEK3.liveTotal, total: MY_SEASON_TOTAL });
    expect(rows.find((r) => r.manager === MANAGERS.minji.name)).toMatchObject({ week: MINJI_WEEK3.points, total: MINJI_WEEK3.total });
  });

  test("has no pager on a one-page table", () => {
    expect(out).not.toContain("Find me");
  });

  test("the Admin menu holds Rename, Remove a manager, then Delete league… set apart", () => {
    const items = adminItems(ACTIONS, noop);
    expect(items.map((i) => i.label)).toEqual(["Rename", "Remove a manager", "Delete league…"]);
    expect(items.map((i) => i.apart ?? false)).toEqual([false, false, true]);
  });
});

describe("a league you're a member of (member.html)", () => {
  const league = privateLeague("flol-discord");
  const out = text(<LeagueTable league={league} nameMax={LEAGUE_NAME_MAX} actions={ACTIONS} {...tableProps(league)} />);

  test("has Leave in place of Admin", () => {
    expectInOrder(out, ["Flol Discord", "Scoring from Week 3", "FLOL-22XB", "Copy link", "Leave", "Season"]);
    expect(out).not.toContain("Admin");
  });

  test("shows the top five, a gap, the rows round yours, then the pager", () => {
    expectInOrder(out, ["Canyon Diff", "T1 Til I Die", "⋯", "Bdd Wolf", "Siwoo Sweep", MANAGER.team, "2 pts to 13th", "Clid Was Here", "12Find me"]);
  });

  test("scoring from Week 3, every total is Week 3's alone", () => {
    const rows = league.tables.Season?.runs.flat() ?? [];
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) expect(r.total).toBe(r.week);
  });
});

describe("Overall in Split 1 (overall.html's layout)", () => {
  const league = LEAGUES.overall!;
  if (league.kind !== "overall") throw new Error("overall is not Overall in the fixture");
  const out = text(<OverallTable league={league} group={league.openGroup} onGroup={noop} {...tableProps(league)} />);

  test("opens on the split being played: the season and split, the three tabs, the sponsor, then the table head", () => {
    expectInOrder(out, ["Overall", `${SEASON} · Split 1`, "Season", "Split 1", "Split 2", "Sponsor", "Rank", "Carry", "Week 3", "Total"]);
  });

  test("hides the groups off Split 2", () => {
    expect(out).not.toContain("Legend");
  });

  test("shows the top 7, a gap, your neighbourhood, and a pager to the last page with Find me", () => {
    expectInOrder(out, ["1—Unkillable FCHa-eun SeoFaker112352", "Viper's Nest", "⋯", "48,209", "Rookie Mistake", `48,2116,904${MANAGER.team}`, "Moss Rock", "123⋯1,063Find me"]);
  });

  test("Season and Split 1 are one table until Split 2 starts", () => {
    expect(league.tables.Season).toBe(league.tables["Split 1"]);
  });
});

describe("Overall in Split 2, Legend (overall.html)", () => {
  const overall = LEAGUES.overall!;
  if (overall.kind !== "overall") throw new Error("overall is not Overall in the fixture");
  const key = tableKey(COMPETITION, COMPETITION.groupedTab, "Legend");
  const league = { ...overall, tables: { [key]: { ...overall.tables.Season!, splitColumn: COMPETITION.groupedTab } } };
  const props = { ...tableProps(league), tab: COMPETITION.groupedTab, table: league.tables[key] };

  test("heads with the season and split, Legend, Rise and All, the tabs, the sponsor and a Split 2 column", () => {
    const grouped = text(<OverallTable league={league} group="Legend" onGroup={noop} {...props} />);
    expectInOrder(grouped, ["Overall", `${SEASON} · Split 2`, "Legend", "Rise", "All", "Season", "Split 1", "Split 2", "Sponsor", "Rank", "Carry", "Week 3", "Split 2", "Total"]);
  });
});

describe("the page", () => {
  test("/leagues opens Pub League, then the list on the right, the sponsor note last", async () => {
    const out = await htmlAt("/leagues");
    expect(out).toContain('data-screen="leagues"');
    expectInOrder(plain(out), ["Leagues", "리그", "Pub League", "PUB-7K2Q", "General", "Overall", "48,211", "6,904", "of 212,480", "United Kingdom", "T1 supporters", "Private", "Pub League", "2nd", "12 managers", "Flol Discord", "14th", "86 managers", "Create a league", "Join a league", "All sponsors are made up."]);
    expect(out).toMatch(/leagues__list-row--on[^>]*>.*?Pub League/);
  });

  test("a league in the list opens its table", async () => {
    expect(await htmlAt("/leagues/flol-discord")).toContain("FLOL-22XB");
    expect(await htmlAt("/leagues/overall")).toContain("Unkillable FC");
  });

  test("a row opens that manager's team", async () => {
    expect(await htmlAt("/leagues")).toContain('href="/manager/tom-reid"');
  });

  test("a table with no made-up data says so, never loads forever", async () => {
    const out = await htmlAt("/leagues/united-kingdom");
    expect(out).toContain("No table yet");
    expect(out).not.toContain("Loading");
  });
});

describe("words", () => {
  test("the chase tag reads points to the rank above, or the lead when 1st", () => {
    expect(chaseText({ kind: "chasing", points: 16, rank: 1 })).toBe("16 pts to 1st");
    expect(chaseText({ kind: "clear", points: 16 })).toBe("+16 clear");
  });
});
