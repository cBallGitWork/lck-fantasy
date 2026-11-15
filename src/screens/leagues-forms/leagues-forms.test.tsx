// @vitest-environment node
import { describe, expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { JOINABLE_LEAGUES, LEAGUE_NAME_MAX, NEW_LEAGUE, PRIVATE_LEAGUE_CAP, PRIVATE_LEAGUES, SCORING_WEEKS, type PrivateLeague } from "./fixtures";
import { LeaguesFormsScreen } from "./index";
import { codeOf, findByCode, makeLeague, ordinal, renameLeague, withoutLeague } from "./leagueForms";
import { AdminMenu, CreatedSheet, CreateSheet, DeleteSheet, JoinSheet, LeaveSheet } from "./Sheets";

const [pubLeague, flolDiscord] = PRIVATE_LEAGUES as [PrivateLeague, PrivateLeague];
const none = () => {};

/** Fails unless each piece appears in the rendered text, in this order. */
function expectInOrder(rendered: string, pieces: string[]) {
  let from = 0;
  for (const piece of pieces) {
    const at = rendered.indexOf(piece, from);
    expect(at, `"${piece}" after position ${from}`).toBeGreaterThanOrEqual(0);
    from = at + piece.length;
  }
}

describe("each sheet holds its picture's content in order", () => {
  test("create.html: name with its count, the week scoring starts, Back, Create, the private count", () => {
    const sheet = (
      <CreateSheet
        weeks={SCORING_WEEKS}
        nameMax={LEAGUE_NAME_MAX}
        privateCount={PRIVATE_LEAGUES.length}
        privateCap={PRIVATE_LEAGUE_CAP}
        initialName={NEW_LEAGUE.name}
        onCreate={none}
        onClose={none}
      />
    );
    expectInOrder(text(sheet), ["✕", "Create a league", "Name", "11 / 30", "Scoring starts", "Week 4 · Wed 20 Jan", "Back", "Create", "Private leagues: 2 of 25"]);
    expect(html(sheet)).toContain('value="Office Rift"');
    expect(html(sheet)).toContain('maxLength="30"');
  });

  test("create.html: this week is chosen first, and later weeks follow", () => {
    expectInOrder(html(<CreateSheet weeks={SCORING_WEEKS} nameMax={30} privateCount={0} privateCap={25} onCreate={none} onClose={none} />), [
      '<option value="4" selected="">Week 4',
      "Week 5 · Wed 27 Jan",
      "Week 6 · Wed 3 Feb",
    ]);
  });

  test("create.html: Create waits for a name", () => {
    const empty = html(<CreateSheet weeks={SCORING_WEEKS} nameMax={30} privateCount={0} privateCap={25} onCreate={none} onClose={none} />);
    expect(empty).toContain("No name");
    expect(empty).toMatch(/<button[^>]*disabled=""[^>]*>Create<\/button>/);
  });

  test("spec/08: at the cap, Create and Join refuse and say why", () => {
    const create = html(
      <CreateSheet weeks={SCORING_WEEKS} nameMax={30} privateCount={25} privateCap={25} initialName="Full" onCreate={none} onClose={none} />,
    );
    expect(create).toContain("25 leagues already");
    expect(create).toMatch(/<button[^>]*disabled=""[^>]*>Create<\/button>/);
    const join = html(<JoinSheet privateCount={25} privateCap={25} initialCode="GANK-4TQ1" onJoin={none} onClose={none} />);
    expect(join).toContain("25 leagues already");
    expect(join).toMatch(/<button[^>]*disabled=""[^>]*>Join<\/button>/);
  });

  test("created.html: the name, its first week, the code with Copy code and Copy link, then Open league", () => {
    const league = makeLeague(NEW_LEAGUE.name, 4, NEW_LEAGUE.code);
    const sheet = <CreatedSheet league={league} onCopyCode={none} onCopyLink={none} onClose={none} />;
    expectInOrder(text(sheet), ["Office Rift", "Scoring from Week 4", "OFF-9R3D", "Copy code", "Copy link", "Open league"]);
    expect(html(sheet)).toContain('href="/leagues/off-9r3d"');
  });

  test("join.html: a code or link, Back, Join, the private count", () => {
    const sheet = <JoinSheet privateCount={2} privateCap={25} initialCode="GANK-4TQ1" onJoin={none} onClose={none} />;
    expectInOrder(text(sheet), ["Join a league", "Code or link", "Back", "Join", "Private leagues: 2 of 25"]);
    expect(html(sheet)).toContain('value="GANK-4TQ1"');
  });

  test("join.html: a code that finds nothing says so under the field", () => {
    expect(text(<JoinSheet privateCount={2} privateCap={25} initialCode="NOPE" error="No league has that code" onJoin={none} onClose={none} />)).toContain(
      "No league has that code",
    );
  });

  test("leave.html: the league, your rank of its size, Back, Leave", () => {
    expectInOrder(text(<LeaveSheet league={flolDiscord} onLeave={none} onClose={none} />), ["Leave Flol Discord?", "14th of 86", "Back", "Leave"]);
  });

  test("delete.html: the league, its size and first week, Back, Delete league", () => {
    expectInOrder(text(<DeleteSheet league={pubLeague} onDelete={none} onClose={none} />), [
      "Delete Pub League?",
      "12 managers · scoring from Week 1",
      "Back",
      "Delete league",
    ]);
  });

  test("admin.html: the maker's Admin key, closed until pressed", () => {
    const menu = html(<AdminMenu onRename={none} onRemove={none} onDelete={none} />);
    expect(menu).toContain("Admin ▾");
    expect(menu).toContain('aria-expanded="false"');
  });
});

describe("the page", () => {
  test("Create and Join, then each league's header: Admin for the maker, Leave for a member", () => {
    expectInOrder(text(<LeaguesFormsScreen />), [
      "Leagues",
      "리그",
      "Create a league",
      "Join a league",
      "Pub League",
      "Scoring from Week 1",
      "PUB-7K2Q",
      "Copy link",
      "Admin ▾",
      "Flol Discord",
      "Scoring from Week 3",
      "FLOL-22XB",
      "Copy link",
      "Leave",
    ]);
    expect(html(<LeaguesFormsScreen />)).toContain('data-screen="leagues-forms"');
  });

  test.each([
    [{ kind: "create" } as const, "Create a league"],
    [{ kind: "join" } as const, "Join a league"],
    [{ kind: "leave", league: flolDiscord } as const, "Leave Flol Discord?"],
    [{ kind: "delete", league: pubLeague } as const, "Delete Pub League?"],
  ])("opens the %o sheet", (form, title) => {
    expect(html(<LeaguesFormsScreen firstForm={form} />)).toContain(`aria-label="${title}"`);
  });
});

describe("what the forms do to the leagues", () => {
  test("a rank reads as the pictures write it", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 14, 21, 22, 101, 111].map(ordinal)).toEqual([
      "1st",
      "2nd",
      "3rd",
      "4th",
      "11th",
      "12th",
      "13th",
      "14th",
      "21st",
      "22nd",
      "101st",
      "111th",
    ]);
  });

  test("a new league has its maker first of one, scoring from the week picked", () => {
    expect(makeLeague("Office Rift", 5, "OFF-9R3D")).toEqual({
      id: "off-9r3d",
      name: "Office Rift",
      code: "OFF-9R3D",
      scoringFrom: 5,
      managers: 1,
      rank: 1,
      maker: true,
    });
  });

  test("leaving or deleting drops only that league", () => {
    expect(withoutLeague(PRIVATE_LEAGUES, "pub-league")).toEqual([flolDiscord]);
  });

  test("renaming changes only that league's name", () => {
    expect(renameLeague(PRIVATE_LEAGUES, "pub-league", "Pub Quiz").map((league) => league.name)).toEqual(["Pub Quiz", "Flol Discord"]);
  });

  test("a code finds its league typed in any case, or inside a link", () => {
    expect(codeOf(" gank-4tq1 ")).toBe("GANK-4TQ1");
    expect(findByCode(JOINABLE_LEAGUES, "https://example.test/join/gank-4tq1")?.name).toBe("Gank Squad");
    expect(findByCode(JOINABLE_LEAGUES, "NOPE-0000")).toBeUndefined();
  });
});
