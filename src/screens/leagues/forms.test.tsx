// @vitest-environment node
import { describe, expect, test } from "vitest";
import { expectInOrder, html, noop, plain, text } from "../../testing/render";
import { JOINABLE, LEAGUE_NAME_MAX, MY_LEAGUES_NOW, NEW_LEAGUE, NEW_TABLE, PRIVATE_LEAGUE_CAP, REMOVED_FROM, SCORING_WEEKS } from "./fixtures";
import { codeOf, freeCode, joinOutcome, makeLeague, privateCount, removeManager, renameLeague, withLeague, withoutLeague } from "./forms";
import { CreatedSheet, CreateSheet, DeleteSheet, JoinSheet, LeaveSheet, RemoveSheet } from "./Sheets";
import { WORDS } from "./words";

const MINE = MY_LEAGUES_NOW;
const TWO_OF_CAP = { count: privateCount(MINE), cap: PRIVATE_LEAGUE_CAP };
const AT_CAP = { count: PRIVATE_LEAGUE_CAP, cap: PRIVATE_LEAGUE_CAP };
const OFFICE_RIFT = makeLeague(NEW_LEAGUE.name, SCORING_WEEKS[0].week, NEW_LEAGUE.code, NEW_TABLE);

const disabledKey = (out: string, label: string) => new RegExp(`<button[^>]*disabled=""[^>]*>${label}</button>`).test(out);

describe("each sheet holds its picture's content in order", () => {
  test("create.html: name with its count, the week scoring starts, Back, Create, the private count", () => {
    const sheet = <CreateSheet weeks={SCORING_WEEKS} nameMax={LEAGUE_NAME_MAX} privates={TWO_OF_CAP} initialName={NEW_LEAGUE.name} onCreate={noop} onClose={noop} />;
    expectInOrder(text(sheet), ["✕", "Create a league", "Name", "11 / 30", "Scoring starts", "Week 3 · Wed 13 Jan", "Back", "Create", "Private leagues: 2 of 25"]);
    expect(html(sheet)).toContain('value="Office Rift"');
    expect(html(sheet)).toContain('maxLength="30"');
  });

  test("create.html: this week is chosen first, and later weeks follow", () => {
    expectInOrder(html(<CreateSheet weeks={SCORING_WEEKS} nameMax={LEAGUE_NAME_MAX} privates={TWO_OF_CAP} onCreate={noop} onClose={noop} />), [
      '<option value="3" selected="">Week 3',
      "Week 4 · Wed 20 Jan",
      "Week 5 · Wed 27 Jan",
    ]);
  });

  test("create.html: Create waits for a name", () => {
    const empty = html(<CreateSheet weeks={SCORING_WEEKS} nameMax={LEAGUE_NAME_MAX} privates={TWO_OF_CAP} onCreate={noop} onClose={noop} />);
    expect(empty).toContain("No name");
    expect(disabledKey(empty, "Create")).toBe(true);
  });

  test("spec/08: at the cap, Create and Join refuse and say why", () => {
    const create = html(<CreateSheet weeks={SCORING_WEEKS} nameMax={LEAGUE_NAME_MAX} privates={AT_CAP} initialName="Full" onCreate={noop} onClose={noop} />);
    expect(create).toContain("25 leagues already");
    expect(disabledKey(create, "Create")).toBe(true);
    const join = html(<JoinSheet privates={AT_CAP} initialCode="GANK-4TQ1" onJoin={noop} onClose={noop} />);
    expect(join).toContain("25 leagues already");
    expect(disabledKey(join, "Join")).toBe(true);
  });

  test("created.html: the name, its first week, the code with Copy code and Copy link, then Open league", () => {
    const sheet = <CreatedSheet league={OFFICE_RIFT.view} onCopyCode={noop} onCopyLink={noop} onClose={noop} />;
    expectInOrder(text(sheet), ["Office Rift", "Scoring from Week 3", "OFF-9R3D", "Copy code", "Copy link", "Open league"]);
    expect(html(sheet)).toContain('href="/leagues/off-9r3d"');
  });

  test("join.html: a code or link, Back, Join, the private count", () => {
    const sheet = <JoinSheet privates={TWO_OF_CAP} initialCode="GANK-4TQ1" onJoin={noop} onClose={noop} />;
    expectInOrder(text(sheet), ["Join a league", "Code or link", "Back", "Join", "Private leagues: 2 of 25"]);
    expect(html(sheet)).toContain('value="GANK-4TQ1"');
  });

  test("join-bad.html: a code that finds nothing says the spec's line under the field, after the warning mark, the field edged", () => {
    const sheet = html(<JoinSheet privates={TWO_OF_CAP} initialCode="NOPE" error={WORDS.noSuchCode} onJoin={noop} onClose={noop} />);
    expect(plain(sheet)).toContain("No league with that code");
    expect(sheet).toContain("field__box--error");
    expect(sheet).toMatch(/<p [^>]*class="field__error"><svg class="warn-mark"/);
  });

  test("leave.html: the league, your rank of its size, Back, Leave on a red edge", () => {
    const sheet = <LeaveSheet name="Flol Discord" rank={14} size={86} onLeave={noop} onClose={noop} />;
    expectInOrder(text(sheet), ["Leave Flol Discord?", "14th of 86", "Back", "Leave"]);
    expect(html(sheet)).toContain('class="outlined-key outlined-key--ends"');
  });

  test("remove.html: the team, that they can't rejoin, Back, Remove on a red edge (spec/08)", () => {
    const sheet = <RemoveSheet team="Zeus Juice" onRemove={noop} onClose={noop} />;
    expectInOrder(text(sheet), ["Remove Zeus Juice?", "They can’t rejoin.", "Back", "Remove"]);
    expect(html(sheet)).toContain('class="outlined-key outlined-key--ends"');
  });

  test("delete.html: the league, its size and first week, Back, Delete league on a red edge, never gold", () => {
    const sheet = <DeleteSheet name="Pub League" size={12} scoringFrom={1} onDelete={noop} onClose={noop} />;
    expectInOrder(text(sheet), ["Delete Pub League?", "12 managers · scoring from Week 1", "Back", "Delete league"]);
    expect(html(sheet)).toContain('class="outlined-key outlined-key--ends"');
    expect(html(sheet)).not.toContain("main-action");
    expect(text(<DeleteSheet name="Office Rift" size={1} scoringFrom={3} onDelete={noop} onClose={noop} />)).toContain("1 manager · scoring from Week 3");
  });
});

describe("what the forms do to the leagues", () => {
  test("the private count counts only private leagues", () => {
    expect(privateCount(MINE)).toBe(2);
  });

  test("a new league has its maker first of one, scoring from the week picked, its table not started", () => {
    const made = makeLeague("Office Rift", 15, "OFF-9R3D", NEW_TABLE);
    expect(made.summary).toEqual({ id: "off-9r3d", name: "Office Rift", kind: "private", mark: { kind: "group" }, rank: 1, move: null, size: 1 });
    expect(made.view).toMatchObject({ id: "off-9r3d", code: "OFF-9R3D", scoringFrom: 15, role: "maker", tables: {} });
  });

  test("a league made or joined joins the list's end and opens its own table", () => {
    const after = withLeague(MINE, OFFICE_RIFT);
    expect(after.list.map((l) => l.name).slice(-2)).toEqual(["Flol Discord", "Office Rift"]);
    expect(after.views["off-9r3d"]?.name).toBe("Office Rift");
  });

  test("a second league made gets a code of its own", () => {
    expect(freeCode(NEW_LEAGUE.code, MINE)).toBe("OFF-9R3D");
    expect(freeCode(NEW_LEAGUE.code, withLeague(MINE, OFFICE_RIFT))).toBe("OFF-9R3D-2");
  });

  test("leaving or deleting drops only that league, from the list and its table", () => {
    const after = withoutLeague(MINE, "pub-league");
    expect(after.list.map((l) => l.id)).toEqual(["overall", "united-kingdom", "t1-supporters", "flol-discord"]);
    expect("pub-league" in after.views).toBe(false);
    expect("flol-discord" in after.views).toBe(true);
  });

  test("renaming changes only that league's name, in the list and its table", () => {
    const after = renameLeague(MINE, "pub-league", "Pub Quiz");
    expect(after.list.filter((l) => l.kind === "private").map((l) => l.name)).toEqual(["Pub Quiz", "Flol Discord"]);
    expect(after.views["pub-league"]?.name).toBe("Pub Quiz");
    expect(after.views["flol-discord"]?.name).toBe("Flol Discord");
  });

  test("removing a manager drops their row from the league's tables, the league one smaller", () => {
    const after = removeManager(MINE, "pub-league", "priya-shah");
    const rows = after.views["pub-league"]?.tables.Season?.runs.flat() ?? [];
    expect(rows.map((r) => r.manager)).not.toContain("Priya Shah");
    expect(rows).toHaveLength(11);
    expect(after.list.find((l) => l.id === "pub-league")?.size).toBe(11);
  });
});

describe("Join's three outcomes (spec/08, Private leagues)", () => {
  const join = (code: string) => joinOutcome(MINE, JOINABLE, REMOVED_FROM, code);

  test("a code finds its league typed in any case, or inside a link, to join", () => {
    expect(codeOf(" gank-4tq1 ")).toBe("GANK-4TQ1");
    const found = join("https://example.test/join/gank-4tq1");
    expect(found.kind === "join" && found.entry.view.name).toBe("Gank Squad");
  });

  test("a code no league has finds nothing", () => {
    expect(join("NOPE-0000")).toEqual({ kind: "none" });
  });

  test("a removed manager's code finds nothing either, so the ban isn't announced", () => {
    expect(join("DRGN-5PX3")).toEqual({ kind: "none" });
  });

  test("a code for a league the manager is in opens its table, with no error", () => {
    expect(join("pub-7k2q")).toEqual({ kind: "open", id: "pub-league" });
  });
});
