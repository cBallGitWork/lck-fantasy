// @vitest-environment node
import { describe, expect, test } from "vitest";
import { expectInOrder, html, noop, plain } from "../../testing/render";
import { LEAGUE_LIST, NEW_LEAGUE, NEW_TABLE, PRIVATE_LEAGUE_CAP } from "./fixtures";
import { makeLeague, privateCount } from "./forms";
import { LeagueList } from "./LeagueList";
import { AT_CAP, UNRANKED } from "./stateFixtures";

const PRIVATES = { count: 2, cap: PRIVATE_LEAGUE_CAP };

describe("your leagues (the side list)", () => {
  const list = (leagues = LEAGUE_LIST, privates = PRIVATES) => html(<LeagueList leagues={leagues} openId="pub-league" privates={privates} onCreate={noop} onJoin={noop} />);

  test("Overall with your tier, `Overall · Emerald I`, then your country and team; each with its mark: the tier's shield, the flag, the crest, the group", () => {
    const markup = list();
    expectInOrder(plain(markup), ["Your leagues", "General", "Overall · Emerald I", "48,211", "of 712,480", "United Kingdom", "T1 supporters", "Private", "Pub League", "2nd", "12 managers", "Flol Discord"]);
    expectInOrder(markup, ['class="tier-shield tier-ink--emerald', 'class="flag', "T1 crest", 'class="leagues__mark"', "Pub League"]);
  });

  test("a new league, its maker alone, reads 1 manager", () => {
    const made = makeLeague(NEW_LEAGUE.name, 3, NEW_LEAGUE.code, NEW_TABLE);
    const out = plain(list([...LEAGUE_LIST, made.summary]));
    expectInOrder(out, ["Office Rift", "1st", "1 manager", "Create a league"]);
    expect(out).not.toContain("1 managers");
  });

  test("cap.html: at 25 private leagues, Create and Join are off, the count and the reason under them, and the private leagues scroll in place", () => {
    const capped = { count: privateCount(AT_CAP), cap: PRIVATE_LEAGUE_CAP };
    expect(capped.count).toBe(25);
    const markup = list(AT_CAP.list, capped);
    expectInOrder(plain(markup), ["Pub League", "School Run", "Office Rift", "Create a league", "Join a league", "Private leagues: 25 of 25", "25 leagues already"]);
    expect(markup.match(/<button[^>]*disabled=""[^>]*>(Create a league|Join a league)<\/button>/g)).toHaveLength(2);
    expect(markup).toMatch(/<div class="leagues__list-scroll">(<a [^>]*leagues__list-row[^]*?<\/a>){25}<\/div>/);
  });

  test("below the cap, no count line under the keys", () => {
    expect(plain(list())).not.toContain("Private leagues:");
  });

  test("none.html: no private league yet reads None yet, with the group mark", () => {
    expect(plain(list(LEAGUE_LIST.filter((l) => l.kind === "general")))).toContain("None yet");
  });

  test("unranked.html: Overall's shield outlined and `Overall · Unranked`, with no rank in any league (spec/08)", () => {
    const markup = list(UNRANKED.list);
    expect(plain(markup)).toContain("Overall · Unranked");
    expect(markup).toContain('class="tier-shield tier-shield--unranked');
    expect(plain(markup)).not.toMatch(/48,211|of 712,480|2nd|14th/);
  });
});
