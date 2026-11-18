import { describe, expect, test } from "vitest";
import type { LeagueMember } from "../leagues/tables";
import type { Receiver } from "./fit";
import { following, LINE_SETTINGS, NO_FOLLOWS } from "./fixtures";
import { block, type Follows } from "./follows";
import { addLine, approveLine, type NewLine, type CheerLine } from "./lines";
import { leagueCheers, parkedCheers, sendCheer, sponsorCheers, type CheerProblem, type CheerSend } from "./cheers";
import { Refused } from "./refused";

const GAMEWEEK = 4;

const refusal = (problem: CheerProblem) => new Refused("Cheer", problem);

const rows: NewLine[] = [
  { id: "c1", kind: "cheer", text: "{points} POINTS! 화이팅!", trigger: "any", weight: 1 },
  { id: "p1", kind: "jeer", text: "THIS TRUCK WAS FUNDED BY YOUR -{hits}.", trigger: "took_hits", weight: 1 },
  { id: "s1", kind: "sponsor", text: "TOP OF {league}. {points} PTS.", trigger: "top_of_league", weight: 1, sponsor: "갱 치킨 Gank Chicken" },
];
const lines: CheerLine[] = rows.reduce<CheerLine[]>((all, row) => approveLine(addLine(all, row), row.id), []);

const minji: Receiver = {
  team: "Minji FC",
  week: {
    points: 58,
    band: "middle",
    hits: 0,
    transfers: 1,
    rankMove: 0,
    buffPlayed: false,
    globalAverage: 45,
    carry: null,
    starters: [],
    benchPoints: 0,
  },
  leagues: { topOf: [], bottomOf: [] },
};

/** Jun follows Minji; Minji doesn't follow Jun. */
const follows: Follows = following(NO_FOLLOWS, "jun", "minji");

const cheer: CheerSend = { from: "jun", to: "minji", kind: "cheer", lineId: "c1", gameweek: GAMEWEEK };

describe("cheers (spec/14, Cheers and jeers)", () => {
  test("a manager sends a cheer or jeer to anyone they follow, once per gameweek", () => {
    const sent = sendCheer([], follows, cheer, lines, minji, LINE_SETTINGS);
    expect(sent).toEqual([{ kind: "cheer", from: "jun", to: "minji", gameweek: GAMEWEEK, lineId: "c1", text: "58 POINTS! 화이팅!" }]);
    expect(() => sendCheer(sent, follows, cheer, lines, minji, LINE_SETTINGS)).toThrow(refusal({ rule: "alreadySent" }));
    expect(sendCheer(sent, follows, { ...cheer, gameweek: GAMEWEEK + 1 }, lines, minji, LINE_SETTINGS)).toHaveLength(2);
  });

  test("never to someone not followed, blocked, or with a sponsor cheer", () => {
    const back = { ...cheer, from: "minji", to: "jun" };
    expect(() => sendCheer([], follows, back, lines, minji, LINE_SETTINGS)).toThrow(refusal({ rule: "notFollowing" }));
    expect(() => sendCheer([], block(follows, "minji", "jun"), cheer, lines, minji, LINE_SETTINGS)).toThrow(
      refusal({ rule: "notFollowing" }),
    );
    expect(() => sendCheer([], follows, { ...cheer, kind: "sponsor", lineId: "s1" }, lines, minji, LINE_SETTINGS)).toThrow(
      refusal({ rule: "sponsorOnly" }),
    );
  });

  test("only with a line that fits the receiver's week", () => {
    const jeer = { ...cheer, kind: "jeer" as const, lineId: "p1" };
    expect(() => sendCheer([], follows, jeer, lines, minji, LINE_SETTINGS)).toThrow(refusal({ rule: "lineDoesNotFit", lineId: "p1" }));
    const hit = { ...minji, week: { ...minji.week!, hits: 6 } };
    expect(sendCheer([], follows, jeer, lines, hit, LINE_SETTINGS)[0]?.text).toBe("THIS TRUCK WAS FUNDED BY YOUR -6.");
  });

  test("a cheer parks on the receiver's profile for the gameweek, with the sender's name", () => {
    const sent = sendCheer([], follows, cheer, lines, minji, LINE_SETTINGS);
    expect(parkedCheers(sent, "minji", GAMEWEEK).map((cheer) => cheer.from)).toEqual(["jun"]);
    expect(parkedCheers(sent, "minji", GAMEWEEK + 1)).toEqual([]);
    expect(parkedCheers(sent, "jun", GAMEWEEK)).toEqual([]);
  });

  test("a private league's top manager of the gameweek gets a sponsor cheer, on their profile and in the league", () => {
    const member = (entryId: string, lastWeek: number, points: number, transfers: number): LeagueMember => ({
      entryId,
      gameweeks: [
        { gameweek: GAMEWEEK - 1, points: lastWeek, transfers: 0 },
        { gameweek: GAMEWEEK, points, transfers },
      ],
    });
    // Sora leads the season, but Minji tops the gameweek; Jun ties her points with more transfers.
    const office = { name: "Office", members: [member("sora", 90, 40, 0), member("minji", 10, 58, 0), member("jun", 10, 58, 2)] };
    const cheers = sponsorCheers([office], GAMEWEEK, lines, () => minji, LINE_SETTINGS, () => 0);
    expect(cheers).toEqual([
      { kind: "sponsor", from: "갱 치킨 Gank Chicken", to: "minji", gameweek: GAMEWEEK, lineId: "s1", text: "TOP OF Office. 58 PTS.", league: "Office" },
    ]);
    expect(parkedCheers(cheers, "minji", GAMEWEEK)).toEqual(cheers);
    expect(leagueCheers(cheers, "Office", GAMEWEEK)).toEqual(cheers);
  });
});
