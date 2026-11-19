// @vitest-environment node
import { describe, expect, test } from "vitest";
import season from "../../../data/lck/season-2027.json";
import { SPEC_TIER_CUTOFFS } from "../../../convex/leagues/fixtures";
import { SPEC_COACH_TABLE, SPEC_PLAYER_TABLE } from "../../../convex/scoring/fixtures";
import { BUFFS } from "../../fixtures/competition";
import { ACCOUNT_MENU } from "../../parts/frame/TopBar";
import { MINUS, RIOT_NOTICE } from "../../parts";
import { helpGo, PATHS, pathTo, PRICES_RULE, RULES_HASH } from "../../paths";
import { expectInOrder, html, htmlAt, plain } from "../../testing/render";
import { coachRows, playerRows, tierRows, type HelpData } from "./facts";
import { GUIDE } from "./guide";
import { HelpPage, viewOf } from "./HelpPage";
import { HELP_DATA } from "./index";
import { FIRST_RULE, RULES } from "./rules";
import { coachLine, DEADLINE_RULE, playerLine } from "./words";

const DATA: HelpData = { ...HELP_DATA, zone: "UTC" };
const page = (hash: string, data = DATA) => html(<HelpPage hash={hash} data={data} />);
/** The open rule's title, as the page draws it. */
const openRule = (out: string) => out.match(/<details id="([\w-]+)" class="help__rule" open="">/g)?.map((m) => m.match(/id="([\w-]+)"/)?.[1]);

describe("Help: the guide, one page at a time (spec/12, Help)", () => {
  test("opens on Flol in 60 seconds, the intro above it and Next under it", () => {
    const out = plain(page(""));
    expectInOrder(out, ["Help", "도움말", "Help", "Rules", "Flol is a free fantasy game", "Flol in 60 seconds", "Squad", "9", "Starters", "7", "Bench", "2", "Budget", "₩100.0m", "Captain", "×1.5", "Buffs", `${BUFFS.length}`, "How a week works ›"]);
    expect(out).not.toContain("‹ ");
  });

  test("each guide page opens from its hash, without the intro, with Back and Next", () => {
    for (const [i, item] of GUIDE.entries()) {
      const out = plain(page(item.id));
      expect(out).toContain(item.title);
      if (i > 0) expect(out).not.toContain("Flol is a free fantasy game");
      const back = GUIDE[i - 1];
      const next = GUIDE[i + 1];
      if (back) expect(out).toContain(`‹ ${back.title}`);
      if (next) expect(out).toContain(`${next.title} ›`);
    }
  });

  test("the Help menu lists every page, the seven steps numbered, the open one marked", () => {
    const out = page("points-scored");
    expectInOrder(plain(out), ["Help menu", "Flol in 60 seconds", "How a week works", "1Build your squad", "4Understand how points are scored", "7Join leagues", "Your weekly checklist", "Flol glossary"]);
    expect(out).toMatch(/help__menu-line--on"[^>]*>.*Understand how points are scored/);
  });

  test("step 4 links the full scoring table in Rules", () => {
    expect(page("points-scored")).toContain(`href="${pathTo(helpGo("scoring"))}"`);
  });
});

describe("Rules: every rule in groups that open and close", () => {
  test("lists the groups in order, with only Squad size open", () => {
    const out = page(RULES_HASH);
    expectInOrder(plain(out), RULES.map((g) => g.group));
    expect(openRule(out)).toEqual([FIRST_RULE]);
  });

  test("its tunable figures are the season data's, never typed in", () => {
    const text = (id: string) => JSON.stringify(RULES.flatMap((g) => g.items).find((i) => i.id === id)?.blocks);
    const { settings } = season;
    expect(text("per-team")).toContain(`In the playoffs it's ${settings.knockoutTeamCap}.`);
    expect(text("between-splits")).toContain(`${settings.splitBreakReopenWeeks} weeks before the next split's first deadline`);
    expect(text("live")).toContain(`about ${settings.finalAfterHours} hours after it ends`);
    expect(text("private")).toContain(`You can be in up to ${settings.privateLeagueCap}, and there's no limit`);
    expect(DEADLINE_RULE).toBe(`The deadline is ${settings.deadlineMinutesBefore} minutes before the week's first series.`);
  });

  test("covers Squad, Transfers, Captain, Scoring, Buffs, Prices, Leagues and Ranks", () => {
    const titles = RULES.flatMap((g) => g.items.map((i) => i.title));
    for (const title of ["Squad size", "Transfer rules", "Captain", "How players score", "The buffs", "Player prices", "Leagues you're in", "Ranks"]) expect(titles).toContain(title);
  });

  test("each rule's hash opens Rules with that rule open, and only it", () => {
    for (const item of RULES.flatMap((g) => g.items)) {
      const view = viewOf(item.id);
      expect(view).toEqual({ tab: "Rules", open: item.id });
      expect(openRule(page(item.id))).toEqual([item.id]);
    }
  });

  test("/help#prices lands on Player prices, open, explained in words with one example and a link to Price changes", async () => {
    const out = await htmlAt(pathTo(helpGo(PRICES_RULE)));
    expect(out).toContain('data-screen="help"');
    expect(openRule(out)).toEqual([PRICES_RULE]);
    expectInOrder(plain(out), ["Player prices", "Prices change once a week, at the deadline.", "Say Faker", "from ₩15.0m to ₩15.5m", "Price changes ›"]);
    expect(out).toContain(`href="${PATHS.priceChanges}"`);
  });

  test("the Captain rule shows C and works ×1.5 rounding towards zero", () => {
    const out = page("captain");
    expect(out).toContain('aria-label="Captain"');
    expect(plain(out)).toContain(`so 9 becomes 13 and ${MINUS}3 becomes ${MINUS}4`);
    expect(plain(out)).toContain("There's no vice-captain.");
  });

  test("the buffs are the season's three, with no Remake or Limitless anywhere", () => {
    const out = plain(page("buffs"));
    expectInOrder(out, ["Bench Boost", "Double Captain", "both score ×2", "Coach Diff", "×3"]);
    for (const hash of [...GUIDE.map((g) => g.id), RULES_HASH]) {
      expect(plain(page(hash))).not.toMatch(/Remake|Limitless/);
    }
  });
});

describe("Scoring's tables are the scoring's own data (spec/05)", () => {
  const out = plain(page("scoring"));

  test("every players' line that is on, with its points and cap", () => {
    const rows = playerRows(SPEC_PLAYER_TABLE);
    expect(rows).toHaveLength(10);
    expectInOrder(out, rows.map((row) => playerLine(row)));
    expectInOrder(out, ["Every 3 kills, or every 2 for a Top or Support", "+1", "+3", "Every 5 assists", "+1", "+3", "Every 3 deaths, or every 4 for a Support", `${MINUS}1`, `${MINUS}3`, "More gold at 15 minutes", "A penta kill", "+2"]);
    expect(out).toContain("their best 2 games count");
  });

  test("the coach's game lines, then the series won and lost", () => {
    const coach = plain(page("coach-scoring"));
    const { game, series } = coachRows(SPEC_COACH_TABLE, DATA.series);
    expectInOrder(coach, [...game, ...series].map((row) => coachLine(row.line, SPEC_COACH_TABLE.quickWin.underMinutes)));
    expectInOrder(coach, ["Wins in under 25 minutes", "+1", "In the series, the team", "Wins", "+3", "Loses", `${MINUS}1`]);
  });

  test("a line turned off leaves the table, and a new value shows at once", () => {
    const player = { ...SPEC_PLAYER_TABLE, steal: { ...SPEC_PLAYER_TABLE.steal, on: false }, assists: { ...SPEC_PLAYER_TABLE.assists, per: 4 } };
    const tuned = plain(page("scoring", { ...DATA, player }));
    expect(tuned).not.toContain("Each monster stolen");
    expect(tuned).toContain("Every 4 assists");
  });
});

describe("Ranks holds the tier cut-offs (spec/08)", () => {
  test("each tier, best first, with its divisions' top %", () => {
    const out = plain(page("ranks"));
    expect(tierRows(SPEC_TIER_CUTOFFS).map((r) => r.tier)).toEqual(["challenger", "grandmaster", "master", "diamond", "emerald", "platinum", "gold", "silver", "bronze", "iron"]);
    expectInOrder(out, ["Top % of everyone", "I", "II", "III", "IV", "Challenger", "0.02", "—", "Master", "0.7", "Diamond", "1.5", "2.4", "3.3", "4.4", "Iron", "97", "98", "99", "100"]);
  });
});

test("Deadlines lists the split's weeks from the season's data", () => {
  expectInOrder(plain(page("deadlines")), ["Week 1", "Wed 30 Dec 07:45", "16:45 KST", "Week 4", "Wed 20 Jan 07:45"]);
});

describe("Help is reached from every page's foot and the team-name menu", () => {
  test("the foot links Help, Privacy and Terms, then Riot's notice", async () => {
    const out = await htmlAt(PATHS.stats);
    const foot = out.slice(out.indexOf("<footer"));
    expectInOrder(foot, [`href="${PATHS.help}"`, ">Help<", `href="${PATHS.privacy}"`, `href="${PATHS.terms}"`, RIOT_NOTICE.slice(0, 20)]);
  });

  test("the team-name ▾ menu holds Settings and Help", () => {
    expect(ACCOUNT_MENU.map((item) => [item.label, "go" in item && item.go.to])).toEqual([
      ["Settings", PATHS.settings],
      ["Help", PATHS.help],
    ]);
  });

  test("Price changes' How prices move › opens /help#prices", async () => {
    expect(await htmlAt(PATHS.priceChanges)).toContain(`href="${pathTo(helpGo(PRICES_RULE))}"`);
  });
});
