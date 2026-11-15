import { describe, expect, test } from "vitest";
import type { LeagueMember } from "../leagues/tables";
import type { LineSettings, Receiver } from "./fit";
import { acceptFollow, block, requestFollow, type Follows } from "./follows";
import { addLine, approveLine, type NewLine, type TruckLine } from "./lines";
import { leagueTrucks, parkedTrucks, sendTruck, sponsorTrucks, TruckError, type TruckSend } from "./trucks";

// Fixture values: the real ones are the competition's data.
const SETTINGS: LineSettings = { blankPoints: 2, flopPoints: 2, bigCarryPoints: 20 };
const GAMEWEEK = 4;

const rows: NewLine[] = [
  { id: "c1", kind: "coffee", text: "{points} POINTS! 화이팅!", trigger: "any", weight: 1 },
  { id: "p1", kind: "protest", text: "THIS TRUCK WAS FUNDED BY YOUR -{hits}.", trigger: "took_hits", weight: 1 },
  { id: "s1", kind: "sponsor", text: "TOP OF {league}. {points} PTS.", trigger: "top_of_league", weight: 1, sponsor: "갱 치킨 Gank Chicken" },
];
const lines: TruckLine[] = rows.reduce<TruckLine[]>((all, row) => approveLine(addLine(all, row), row.id), []);

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
const follows: Follows = acceptFollow(requestFollow({ follows: [], blocks: [] }, "jun", "minji"), "minji", "jun");

const coffee: TruckSend = { from: "jun", to: "minji", kind: "coffee", lineId: "c1", gameweek: GAMEWEEK };

describe("trucks (spec/14, Trucks)", () => {
  test("a manager sends a coffee or protest truck to anyone they follow, once per gameweek", () => {
    const sent = sendTruck([], follows, coffee, lines, minji, SETTINGS);
    expect(sent).toEqual([{ kind: "coffee", from: "jun", to: "minji", gameweek: GAMEWEEK, lineId: "c1", text: "58 POINTS! 화이팅!" }]);
    expect(() => sendTruck(sent, follows, coffee, lines, minji, SETTINGS)).toThrow(new TruckError({ rule: "alreadySent" }));
    expect(sendTruck(sent, follows, { ...coffee, gameweek: GAMEWEEK + 1 }, lines, minji, SETTINGS)).toHaveLength(2);
  });

  test("never to someone not followed, blocked, or with a sponsor truck", () => {
    const back = { ...coffee, from: "minji", to: "jun" };
    expect(() => sendTruck([], follows, back, lines, minji, SETTINGS)).toThrow(new TruckError({ rule: "notFollowing" }));
    expect(() => sendTruck([], block(follows, "minji", "jun"), coffee, lines, minji, SETTINGS)).toThrow(
      new TruckError({ rule: "notFollowing" }),
    );
    expect(() => sendTruck([], follows, { ...coffee, kind: "sponsor", lineId: "s1" }, lines, minji, SETTINGS)).toThrow(
      new TruckError({ rule: "sponsorOnly" }),
    );
  });

  test("only with a line that fits the receiver's week", () => {
    const protest = { ...coffee, kind: "protest" as const, lineId: "p1" };
    expect(() => sendTruck([], follows, protest, lines, minji, SETTINGS)).toThrow(new TruckError({ rule: "lineDoesNotFit", lineId: "p1" }));
    const hit = { ...minji, week: { ...minji.week!, hits: 4 } };
    expect(sendTruck([], follows, protest, lines, hit, SETTINGS)[0]?.text).toBe("THIS TRUCK WAS FUNDED BY YOUR -4.");
  });

  test("a truck parks on the receiver's profile for the gameweek, with the sender's name", () => {
    const sent = sendTruck([], follows, coffee, lines, minji, SETTINGS);
    expect(parkedTrucks(sent, "minji", GAMEWEEK).map((truck) => truck.from)).toEqual(["jun"]);
    expect(parkedTrucks(sent, "minji", GAMEWEEK + 1)).toEqual([]);
    expect(parkedTrucks(sent, "jun", GAMEWEEK)).toEqual([]);
  });

  test("a private league's top manager of the gameweek gets a sponsor truck, on their profile and in the league", () => {
    const member = (entryId: string, lastWeek: number, points: number, transfers: number): LeagueMember => ({
      entryId,
      gameweeks: [
        { gameweek: GAMEWEEK - 1, points: lastWeek, transfers: 0 },
        { gameweek: GAMEWEEK, points, transfers },
      ],
    });
    // Sora leads the season, but Minji tops the gameweek; Jun ties her points with more transfers.
    const office = { name: "Office", members: [member("sora", 90, 40, 0), member("minji", 10, 58, 0), member("jun", 10, 58, 2)] };
    const trucks = sponsorTrucks([office], GAMEWEEK, lines, () => minji, SETTINGS, () => 0);
    expect(trucks).toEqual([
      { kind: "sponsor", from: "갱 치킨 Gank Chicken", to: "minji", gameweek: GAMEWEEK, lineId: "s1", text: "TOP OF Office. 58 PTS.", league: "Office" },
    ]);
    expect(parkedTrucks(trucks, "minji", GAMEWEEK)).toEqual(trucks);
    expect(leagueTrucks(trucks, "Office", GAMEWEEK)).toEqual(trucks);
  });
});
