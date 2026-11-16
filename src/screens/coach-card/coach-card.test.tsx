// @vitest-environment node
import { describe, expect, test } from "vitest";
import { PATHS } from "../../paths";
import { expectInOrder, html, htmlAt, noop, text } from "../../testing/render";
import { CoachCard, EMPTY_TAB } from "./CoachCard";
import { FROM_PICK_TEAM, FROM_POINTS } from "./fixtures";
import { CoachCardPage, FIRST_TAB, TRANSFER_OUT } from "./index";
import type { CoachCardData, CoachFrom, CoachTab } from "./types";

const card = (data: CoachCardData, from: CoachFrom, tab: CoachTab) => <CoachCard data={data} from={from} tab={tab} onTab={noop} />;

describe("the page", () => {
  test("is the coach-card screen: the card over the page, opened on the picture's tab", () => {
    const out = html(<CoachCardPage data={FROM_PICK_TEAM} from="pickTeam" onClose={noop} />);
    expect(out).toContain('data-screen="coach-card"');
    expect(out).toContain('role="dialog"');
    expect(out).toMatch(/aria-current="page"[^>]*>Pick Team/);
    expect(out).toMatch(/aria-selected="true"[^>]*>History</);
    expect(FIRST_TAB).toEqual({ pickTeam: "History", points: "This week" });
  });

  test("Transfer out opens Transfers with the coach sold, his slot picked for the list to fill", async () => {
    const soldTile = /class="tile tile--selected tile--dim"(?:(?!class="tile ).)*title="kkOma"/;
    expect(TRANSFER_OUT).toBe("/transfers?sell=coach");
    expect(await htmlAt(TRANSFER_OUT)).toMatch(soldTile);
    expect(await htmlAt(PATHS.transfers)).not.toContain("tile--dim");
    expect(await htmlAt("/transfers?sell=nobody")).not.toContain("tile--dim");
  });

  test("from Points, opens on This week with Points marked", () => {
    const out = html(<CoachCardPage data={FROM_POINTS} from="points" onClose={noop} />);
    expect(out).toMatch(/aria-current="page"[^>]*>Points/);
    expect(out).toMatch(/aria-selected="true"[^>]*>This week</);
  });
});

describe("a tab without data", () => {
  test("shows its empty state, never a blank panel", () => {
    expect(FROM_POINTS.history).toBeUndefined();
    expect(FROM_POINTS.roster).toBeUndefined();
    expect(FROM_PICK_TEAM.week).toBeUndefined();
    expect(text(card(FROM_POINTS, "points", "History"))).toContain(EMPTY_TAB.History);
    expect(text(card(FROM_POINTS, "points", "Roster"))).toContain(EMPTY_TAB.Roster);
    expect(text(card(FROM_PICK_TEAM, "pickTeam", "This week"))).toContain(EMPTY_TAB["This week"]);
    expect(text(card(FROM_PICK_TEAM, "pickTeam", "History"))).not.toContain(EMPTY_TAB.History);
  });
});

describe("History, from Pick Team (1440.png)", () => {
  const out = text(card(FROM_PICK_TEAM, "pickTeam", "History"));

  test("holds the header, meta, strip, tabs, history and season in the picture's order", () => {
    expectInOrder(out, [
      "Coach · T1",
      "kkOma",
      "김정균",
      "Kim Jeong-gyun",
      "27",
      "Season · 1st of 10 coaches",
      "Transfer out",
      "Compare ›",
      "₩7.0m",
      "price 0.5",
      "9.0",
      "form · 1st",
      "24%",
      "owned · 2nd",
      "+310 / −95 this week",
      "W2 · Fri",
      "4",
      "v BFX",
      "W3 · Wed",
      "8",
      "v HLE",
      "W3 · Sat",
      "8",
      "v DK",
      "W4 · Wed · Bo3",
      "v KT",
      "W4 · Sat · Bo3",
      "v GEN",
      "W5 · Thu · Bo3",
      "v BRO",
      "This week",
      "Fixtures",
      "History",
      "Roster",
      "Split 1 2027",
      "WeekSeriesGamesPricePtsWeek",
      "2Wed · W 2–0 DNS2₩6.5m48",
      "1Sat · W 2–0 NS2₩6.5m33",
      "Wed · L 1–2 GEN30",
      "Past seasons",
      "T1, scored by Flol",
      "LCK 2026982.9284",
      "LCK 20251043.1322",
      "Season",
      "15 games",
      "TotalPer gamePts",
      "First tower80.5+6",
      "Most drakes70.5+5",
      "Most barons30.2+2",
      "Most elders10.10",
      "Quick win00.00",
      "Series won5+15",
      "Series lost1−1",
    ]);
  });

  test("marks the price's rise and links Compare", () => {
    const out = html(card(FROM_PICK_TEAM, "pickTeam", "History"));
    expect(out).toContain('<span class="rise">0.5</span>');
    expect(out).toContain('href="/compare"');
  });
});

describe("This week, from Points (1440-week.png)", () => {
  const out = text(card(FROM_POINTS, "points", "This week"));

  test("holds each series, its games, the series line and the week, in order", () => {
    expectInOrder(out, [
      "11",
      "Season · 3rd of 10 coaches",
      "Compare ›",
      "₩7.0m",
      "price",
      "5.5",
      "form · 2nd",
      "+204 / −58 this week",
      "W3 · Sat",
      "2Live",
      "Wed · v HLE W 2–18",
      "G1WFirst tower · Most drakes2",
      "G2L—0",
      "G3WFirst tower · Most drakes · Most barons3",
      "Series won+3",
      "Sat · v DK 1–02",
      "G1WFirst tower · Most barons2",
      "G214:200",
      "Series · +3 if won, −1 if lost—",
      "Week 310",
      "Season",
      "10 games",
      "First tower30.3+1",
      "Series won3+9",
    ]);
  });

  test("offers Compare only, and strikes the game that doesn't count", () => {
    expect(out).not.toContain("Transfer out");
    const marked = html(card(FROM_POINTS, "points", "This week"));
    expect(marked.match(/coach-card__drop/g)).toHaveLength(1);
  });

  test("says Live once, on the strip, and never Final", () => {
    expect(html(card(FROM_POINTS, "points", "This week")).match(/tag--live/g)).toHaveLength(1);
    expect(out).not.toContain("Final");
  });
});

describe("the strip's series show once", () => {
  test("History starts after the strip's 3 played, Fixtures after its 3 to come", () => {
    const history = text(card(FROM_PICK_TEAM, "pickTeam", "History"));
    expect(history).not.toContain("Sat · W 2–0 DK");
    expect(history).not.toContain("Fri · W 2–1 BFX");
    const fixtures = text(card(FROM_PICK_TEAM, "pickTeam", "Fixtures"));
    expect(fixtures).not.toContain("T1 v KT");
    expect(fixtures).not.toContain("T1 v BRO");
  });

  test("the head names the coach once, without his job", () => {
    expect(text(card(FROM_PICK_TEAM, "pickTeam", "History"))).not.toContain("head coach");
  });
});

describe("Roster (1440-roster.png)", () => {
  test("lists the team's players with role, price, season and owned; yours marked", () => {
    const out = text(card(FROM_PICK_TEAM, "pickTeam", "Roster"));
    expectInOrder(out, [
      "RolePlayerPriceSeasonOwned",
      "TopDoran₩12.5m4518%",
      "JungleOner₩14.0m4322%",
      "MidFaker",
      "₩18.5m5846%",
      "BotPeyz₩15.0m5233%",
      "SupportKeria₩12.0m5247%",
      "Season",
    ]);
    expect(html(card(FROM_PICK_TEAM, "pickTeam", "Roster")).match(/aria-label="Your player"/g)).toHaveLength(1);
  });
});

describe("Fixtures (the player card's 1440-fixtures.png)", () => {
  test("lists T1's next series, each week's number once, your time and KST", () => {
    const out = text(card(FROM_PICK_TEAM, "pickTeam", "Fixtures"));
    expectInOrder(out, [
      "WeekSeriesYour timeKST",
      "5Sun · T1 v KRX · Bo310:3019:30",
      "6Wed · T1 v DK · Bo308:0017:00",
      "Sat · T1 v HLE · Bo310:3019:30",
    ]);
  });
});

test("a news line shows above the header, as on the player card", () => {
  const out = text(card({ ...FROM_PICK_TEAM, news: "Out for Wednesday's series" }, "pickTeam", "History"));
  expectInOrder(out, ["! Out for Wednesday's series", "Coach · T1"]);
});
