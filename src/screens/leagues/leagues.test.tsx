// @vitest-environment node
import { describe, expect, test } from "vitest";
import { MANAGERS, MINJI_WEEK3 } from "../../fixtures/managers";
import { MY_SEASON_TOTAL } from "../../fixtures/myLeagues";
import { MANAGER, MY_WEEK3, SEASON } from "../../fixtures/week3";
import { expectInOrder, html, htmlAt, noop, plain, text } from "../../testing/render";
import { COMPETITION, LEAGUE_NAME_MAX, LEAGUES } from "./fixtures";
import { adminItems, LeagueTable, type LeagueActions, type TableProps } from "./LeagueTable";
import { OverallTable } from "./OverallTable";
import { BEFORE_DEADLINE } from "./stateFixtures";
import { tableKey, type LeagueView } from "./types";
import { chaseText } from "./words";

const ACTIONS: LeagueActions = { onCopyLink: noop, onRename: noop, onRemove: noop, onDelete: noop, onLeave: noop };

/** A league's table props on its opening tab, from the fixture. */
function tableProps(league: LeagueView): TableProps {
  const group = league.kind === "overall" ? league.openGroup : undefined;
  return {
    competition: COMPETITION,
    tab: league.openTab,
    onTab: noop,
    table: league.tables[tableKey(COMPETITION, league.openTab, group)],
    onRetry: noop,
    page: 1,
    onPage: noop,
    onFindMe: noop,
  };
}

function privateLeague(id: string) {
  const league = LEAGUES[id];
  if (league?.kind !== "private") throw new Error(`${id} is not a private league in the fixture`);
  return league;
}

function overallOf(league: LeagueView | undefined) {
  if (league?.kind !== "overall") throw new Error("overall is not Overall in the fixture");
  return league;
}

describe("a league you made (league.html)", () => {
  const league = privateLeague("pub-league");
  const table = (props: Partial<Parameters<typeof LeagueTable>[0]> = {}) => (
    <LeagueTable league={league} nameMax={LEAGUE_NAME_MAX} actions={ACTIONS} {...tableProps(league)} {...props} />
  );
  const out = text(table());

  test("heads with the name and scoring week on the band, then the tabs, the code, Copy link and Admin, then the table head", () => {
    expectInOrder(out, ["Pub League", "Scoring from Week 1", "Season", "Split 1", "Split 2", "PUB-7K2Q", "Copy link", "Admin ▾", "Rank", "Team · Manager", "Captain", "Week 3", "Total"]);
    expect(out).not.toContain("Leave");
    expect(html(table())).toMatch(/<h2 class="panel__title">Pub League<span class="panel__sub">Scoring from Week 1<\/span><\/h2>/);
  });

  test("lists all 12 rows in rank order, each Captain as his team's bar and code then his name, your row with its chase tag", () => {
    expectInOrder(out, [
      `1—${MANAGERS.minji.team}${MANAGERS.minji.name}GEN Ruler93315`,
      `21${MANAGER.team}${MANAGER.name}13 pts to 1stT1 Faker94302`,
      "Peanut Butter Gank",
      "Gank PlankRuth AdeT1 Faker55223",
    ]);
  });

  test("ranks 1 to 3 are the podium's squares, gold, silver and bronze; 4th on is a plain figure", () => {
    const markup = html(table());
    expectInOrder(markup, ["leagues__pod leagues__pod--1", "leagues__pod leagues__pod--2", "leagues__pod leagues__pod--3"]);
    expect(markup).not.toContain("leagues__pod--4");
  });

  test("is the Table part's: your row selected, and each row ends in its centred ›", () => {
    const markup = html(table());
    expect(markup).toMatch(/class="table__row--selected"[^]*Baron Steal FC/);
    expect(markup).toMatch(/<td class="table__go"><a[^>]*aria-label="Open Baron Steal FC"/);
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

  test("remove-pick.html: a Remove key on every row but yours, Done in Admin's place, no › to open a row", () => {
    const markup = html(table({ startMode: "removing" }));
    expect(markup.match(/aria-label="Remove [^"]+"/g)).toHaveLength(11);
    expect(markup).not.toContain('aria-label="Remove Baron Steal FC"');
    expect(plain(markup)).toContain("Done");
    expect(plain(markup)).not.toContain("Admin");
    expect(markup).not.toContain("table__go");
  });

  test("remove.html: the picked row filled behind the confirm", () => {
    expect(html(table({ startMode: "removing", picked: "priya-shah" }))).toMatch(/<tr class="leagues__picked">[^]*?Zeus Juice/);
  });

  test("rename.html: the name as a box with its count on the band, then Save and Back", () => {
    const markup = html(table({ startMode: "renaming" }));
    expectInOrder(plain(markup), ["10 / 30", "Save", "Back", "Season"]);
    expect(markup).toContain('value="Pub League"');
    expect(plain(markup)).not.toContain("Scoring from Week 1");
  });
});

describe("a league you're a member of (member.html)", () => {
  const league = privateLeague("flol-discord");
  const out = text(<LeagueTable league={league} nameMax={LEAGUE_NAME_MAX} actions={ACTIONS} {...tableProps(league)} />);

  test("has Leave in place of Admin", () => {
    expectInOrder(out, ["Flol Discord", "Scoring from Week 3", "Season", "FLOL-22XB", "Copy link", "Leave"]);
    expect(out).not.toContain("Admin");
  });

  test("shows the top five, a gap, the rows round yours, then the pager", () => {
    expectInOrder(out, ["Canyon Diff", "T1 Til I Die", "⋯", "Bdd Wolf", "Siwoo Sweep", MANAGER.team, "2 pts to 13th", "Clid Was Here", "12Find me"]);
    expect(html(<LeagueTable league={league} nameMax={LEAGUE_NAME_MAX} actions={ACTIONS} {...tableProps(league)} />).match(/class="table__gap"/g)).toHaveLength(1);
  });

  test("scoring from Week 3, every total is Week 3's alone", () => {
    const rows = league.tables.Season?.runs.flat() ?? [];
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) expect(r.total).toBe(r.week);
  });
});

describe("Overall in Split 1 (overall.html's layout)", () => {
  const league = overallOf(LEAGUES.overall);
  const overall = (props: Partial<TableProps> = {}, view = league) => <OverallTable league={view} group={view.openGroup} onGroup={noop} {...tableProps(view)} {...props} />;
  const out = text(overall());

  test("opens on the split being played: the season and split on the band, the three tabs, then the table head", () => {
    expectInOrder(out, ["Overall", `${SEASON} · Split 1`, "Season", "Split 1", "Split 2", "Rank", "Captain", "Week 3", "Total"]);
  });

  test("hides the groups off Split 2", () => {
    expect(out).not.toContain("Legend");
  });

  test("shows the top 7, a gap, your neighbourhood, and a pager to the last page with Find me", () => {
    expectInOrder(out, ["1—Unkillable FCHa-eun SeoT1 Faker112352", "Viper's Nest", "⋯", "48,209", "Rookie Mistake", `48,2116,904${MANAGER.team}`, "Moss Rock", "123⋯1,063Find me"]);
  });

  test("Overall's table has no chase tag: Points shows the gap to the next tier (spec/08)", () => {
    expect(league.tables.Season?.runs.flat().every((r) => r.chase === null)).toBe(true);
    expect(out).not.toMatch(/pts to|clear/);
  });

  test("Season and Split 1 are one table until Split 2 starts", () => {
    expect(league.tables.Season).toBe(league.tables["Split 1"]);
  });

  test("a split's table has no Tier column (spec/08: one tier for the season)", () => {
    expect(out.split("Captains and buffs")[0]).not.toContain("Tier");
  });

  test("the season's table has a Tier column before the team: the small shield in its tier's colour and the short name (spec/08)", () => {
    const markup = html(overall({ tab: COMPETITION.seasonTab }));
    expectInOrder(plain(markup), ["Rank", "Tier", "Team · Manager", "Captain", "Challenger", "Unkillable FC", "Emerald I", "Rookie Mistake", "Emerald I", MANAGER.team]);
    expect(markup).toContain('<span class="tier-tag"><svg class="tier-shield tier-ink--challenger tier-tag__shield"');
  });

  test("once the deadline has passed: Captains and buffs by tier, Challenger to Iron, a Captain's share as a bar in the tier's colour, no bar for a buff, a dash where none was played", () => {
    const markup = html(overall());
    expectInOrder(plain(markup), ["Captains and buffs", "Week 3", "Tier", "Top Captain", "Share", "Top buff", "Share", "Challenger", "GEN Chovy", "61%", "Double Captain", "9%", "Iron", "T1 Faker", "58%", "—"]);
    expect(markup).toContain('class="leagues__share-bar tier-ink--challenger"><i style="width:61%">');
    expect(markup.match(/leagues__share-bar/g)).toHaveLength(10);
    expect(markup).toMatch(/class="table__row--selected"><td[^>]*><span class="tier-tag"><svg class="tier-shield tier-ink--emerald/);
  });

  test("before the deadline: no Week or Captain column, not a column of dashes, and no tier panel (spec/08)", () => {
    const before = overallOf(BEFORE_DEADLINE.views.overall);
    const markup = plain(html(overall({}, before)));
    expectInOrder(markup, ["Rank", "Team · Manager", "Total", "Unkillable FC"]);
    expect(markup).not.toMatch(/Captain|Week \d/);
    expect(markup).not.toContain("Captains and buffs");
  });

  test("a table on its way: its heads and bars where the figures go, no rows yet", () => {
    const markup = html(overall({ status: "loading" }));
    expect(markup).toContain('role="status" aria-label="Table loading"');
    expect(markup.match(/leagues__skel/g)?.length).toBeGreaterThan(12);
    expect(plain(markup)).not.toContain("Unkillable FC");
  });

  test("a table that didn't load: the warning mark, its title and line, Try again", () => {
    const markup = html(overall({ status: "error" }));
    expectInOrder(plain(markup), ["Table didn’t load", "Check your connection.", "Try again ›"]);
    expect(markup).toMatch(/role="alert"><svg class="warn-mark warn-mark--big"/);
  });
});

describe("Overall in Split 2, Legend (overall.html)", () => {
  const overall = overallOf(LEAGUES.overall);
  const key = tableKey(COMPETITION, COMPETITION.groupedTab, "Legend");
  const league = { ...overall, tables: { [key]: { ...overall.tables.Season!, splitColumn: COMPETITION.groupedTab } } };
  const props = { ...tableProps(league), tab: COMPETITION.groupedTab, table: league.tables[key] };

  test("heads with the season and split, the tabs with Legend, Rise and All at their right, and a Split 2 column", () => {
    const grouped = text(<OverallTable league={league} group="Legend" onGroup={noop} {...props} />);
    expectInOrder(grouped, ["Overall", `${SEASON} · Split 2`, "Season", "Split 1", "Split 2", "Legend", "Rise", "All", "Rank", "Captain", "Week 3", "Split 2", "Total"]);
  });
});

describe("the page", () => {
  test("/leagues opens Pub League, then your leagues on the right, the sponsor and its note last", async () => {
    const out = await htmlAt("/leagues");
    expect(out).toContain('data-screen="leagues"');
    expectInOrder(plain(out), ["Leagues", "리그", "Pub League", "PUB-7K2Q", "Your leagues", "Overall · Emerald I", "48,211", "6,904", "of 712,480", "Create a league", "Join a league", "Sponsor", "All sponsors are made up."]);
    expect(out).toMatch(/leagues__list-row--on[^>]*>.*?Pub League/);
  });

  test("a league in the list opens its table", async () => {
    expect(await htmlAt("/leagues/flol-discord")).toContain("FLOL-22XB");
    expect(await htmlAt("/leagues/overall")).toContain("Unkillable FC");
  });

  test("spec/08: a league's link opens Join a league with its code in, and joins nobody until Join is pressed", async () => {
    const out = await htmlAt("/leagues/join/gank-4tq1");
    expectInOrder(plain(out), ["Join a league", "Code or link", "Back", "Join"]);
    expect(out).toContain('value="GANK-4TQ1"');
    expect(plain(out)).not.toContain("Gank Squad");
  });

  test("a row opens that manager's team", async () => {
    expect(await htmlAt("/leagues")).toContain('href="/manager/tom-reid"');
  });

  test("a table with no made-up data says so, never loads forever", async () => {
    const out = await htmlAt("/leagues/united-kingdom");
    expect(out).toContain("No table yet");
    expect(out).not.toContain("Loading");
  });

  test("unranked.html: before gameweek 1 is final, Overall has no table, only when Week 1 starts (spec/08)", async () => {
    const out = plain(await htmlAt("/leagues/overall?state=unranked"));
    expectInOrder(out, ["Overall", "Season", "No table yet", "Week 1 starts Wed 30 Dec", "Overall · Unranked"]);
    expect(out).not.toContain("Legend");
    expect(out).not.toContain("Find me");
  });

  test("soon.html: a league whose scoring hasn't started says when its first week starts", async () => {
    expectInOrder(plain(await htmlAt("/leagues?state=soon")), ["Office Rift", "Scoring from Week 4", "No table yet", "Week 4 starts Wed 20 Jan"]);
  });
});

describe("words", () => {
  test("the chase tag reads points to the rank above, or the lead when 1st", () => {
    expect(chaseText({ kind: "chasing", points: 16, rank: 1 })).toBe("16 pts to 1st");
    expect(chaseText({ kind: "clear", points: 16 })).toBe("+16 clear");
  });
});
