// @vitest-environment node
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { MANAGER } from "../../fixtures/week3";
import { makeRouter } from "../../router";
import { html, text } from "../../testing/render";
import { COMPETITION, LEAGUES } from "./fixtures";
import { chaseText, ordinal } from "./format";
import { adminItems, LeagueTable, type LeagueActions, type TableProps } from "./LeagueTable";
import { OverallTable } from "./OverallTable";
import { tableKey, type LeagueView } from "./types";

const none = () => {};
const ACTIONS: LeagueActions = { onCopyLink: none, onRename: none, onRemoveManager: none, onDelete: none, onLeave: none };

/** A league's table props on its opening tab, from the fixture. */
function tableProps(league: LeagueView): TableProps {
  const group = league.kind === "overall" ? league.openGroup : undefined;
  return { competition: COMPETITION, tab: league.openTab, onTab: none, table: league.tables[tableKey(COMPETITION, league.openTab, group)], page: 1, onPage: none, onFindMe: none };
}

function privateLeague(id: string) {
  const league = LEAGUES[id];
  if (league?.kind !== "private") throw new Error(`${id} is not a private league in the fixture`);
  return league;
}

/** Fails unless each piece appears in `out`, in this order. */
function expectInOrder(out: string, pieces: string[]) {
  let from = 0;
  for (const piece of pieces) {
    const at = out.indexOf(piece, from);
    expect(at, `"${piece}" after position ${from}`).toBeGreaterThanOrEqual(0);
    from = at + piece.length;
  }
}

async function renderRoute(path: string) {
  const router = makeRouter(createMemoryHistory({ initialEntries: [path] }));
  await router.load();
  return renderToStaticMarkup(<RouterProvider router={router} />);
}

describe("a league you made (league.html)", () => {
  const league = privateLeague("pub-league");
  const out = text(<LeagueTable league={league} actions={ACTIONS} {...tableProps(league)} />);

  test("heads with the name, scoring week, code, Copy link and Admin, then the tabs and table head", () => {
    expectInOrder(out, ["Pub League", "Scoring from Week 1", "PUB-7K2Q", "Copy link", "Admin ▾", "Season", "Split 1", "Split 2", "Rank", "Team · Manager", "Carry", "Week 14", "Total"]);
    expect(out).not.toContain("Leave");
  });

  test("lists all 12 rows in rank order, your row with its chase tag", () => {
    expectInOrder(out, ["1—Kiin BeanTom ReidChovy611,214", `21${MANAGER.team}${MANAGER.name}16 pts to 1stFaker981,198`, "Chovy Was Right There", "Gank PlankRuth AdeFaker551,019"]);
    expect(html(<LeagueTable league={league} actions={ACTIONS} {...tableProps(league)} />)).toMatch(/class="leagues__mine"[^]*Baron Steal FC/);
  });

  test("has no pager on a one-page table", () => {
    expect(out).not.toContain("Find me");
  });

  test("the Admin menu holds Rename, Remove a manager, then Delete league… set apart", () => {
    const items = adminItems(ACTIONS, none);
    expect(items.map((i) => i.label)).toEqual(["Rename", "Remove a manager", "Delete league…"]);
    expect(items.map((i) => i.apart ?? false)).toEqual([false, false, true]);
  });
});

describe("a league you're a member of (member.html)", () => {
  const league = privateLeague("flol-discord");
  const out = text(<LeagueTable league={league} actions={ACTIONS} {...tableProps(league)} />);

  test("has Leave in place of Admin", () => {
    expectInOrder(out, ["Flol Discord", "Scoring from Week 3", "FLOL-22XB", "Copy link", "Leave", "Season"]);
    expect(out).not.toContain("Admin");
  });

  test("shows the top five, a gap, the rows round yours, then the pager", () => {
    expectInOrder(out, ["Canyon Diff", "T1 Til I Die", "⋯", "Bdd Wolf", "Siwoo Sweep", MANAGER.team, "11 pts to 13th", "Clid Was Here", "12Find me"]);
  });
});

describe("Overall in Split 2, Legend (overall.html)", () => {
  const league = LEAGUES.overall!;
  if (league.kind !== "overall") throw new Error("overall is not Overall in the fixture");
  const out = text(<OverallTable league={league} group="Legend" onGroup={none} {...tableProps(league)} />);

  test("heads with the season and split, Legend, Rise and All, the tabs, the sponsor and a Split 2 column", () => {
    expectInOrder(out, ["Overall", "LCK 2027 · Split 2", "Legend", "Rise", "All", "Season", "Split 1", "Split 2", "Sponsor", "Rank", "Carry", "Week 14", "Split 2", "Total"]);
  });

  test("shows the top 7, a gap, your neighbourhood, and a pager to the last page with Find me", () => {
    expectInOrder(out, ["1—Unkillable FCHa-eun SeoFaker1124021,642", "Viper's Nest", "⋯", "48,209", "Rookie Mistake", `48,2116,904${MANAGER.team}`, "Kiin Bean", "123⋯1,063Find me"]);
  });

  test("hides the groups off Split 2", () => {
    const season = text(<OverallTable league={league} group="Legend" onGroup={none} {...tableProps(league)} tab="Season" table={undefined} />);
    expect(season).not.toContain("Legend");
    expect(season).toContain("LCK 2027");
  });
});

describe("the page", () => {
  test("/leagues opens the list beside Pub League, the sponsor note last", async () => {
    const out = await renderRoute("/leagues");
    expect(out).toContain('data-screen="leagues"');
    expectInOrder(out.replace(/<[^>]+>/g, ""), ["Leagues", "리그", "General", "Overall", "48,211", "6,904", "of 212,480", "United Kingdom", "T1 supporters", "Private", "Pub League", "2nd", "12 managers", "Flol Discord", "14th", "86 managers", "Create a league", "Join a league", "Pub League", "PUB-7K2Q", "All sponsors are made up."]);
    expect(out).toMatch(/leagues__list-row--on[^>]*>.*?Pub League/);
  });

  test("a league in the list opens its table", async () => {
    expect(await renderRoute("/leagues/flol-discord")).toContain("FLOL-22XB");
    expect(await renderRoute("/leagues/overall")).toContain("Legend");
  });

  test("a row opens that manager's team", async () => {
    expect(await renderRoute("/leagues")).toContain('href="/manager/tom-reid"');
  });

  test("a table with no made-up data says so, never loads forever", async () => {
    const out = await renderRoute("/leagues/united-kingdom");
    expect(out).toContain("No table yet");
    expect(out).not.toContain("Loading");
  });
});

describe("words", () => {
  test("ranks read as ordinals, teens included", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 112].map(ordinal)).toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "112th"]);
  });

  test("the chase tag reads points to the rank above, or the lead when 1st", () => {
    expect(chaseText({ kind: "chasing", points: 16, rank: 1 })).toBe("16 pts to 1st");
    expect(chaseText({ kind: "clear", points: 16 })).toBe("+16 clear");
  });
});
