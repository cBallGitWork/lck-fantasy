// Trucks (spec/14-following.md, Trucks): a manager sends a coffee or protest truck to anyone they
// follow, one per manager followed per gameweek, and it parks on the receiver's profile for the
// gameweek with the sender's name. A sponsor truck sends itself to each private league's top
// manager of the gameweek.
import { leagueTable, type LeagueMember } from "../leagues/tables";
import { linesThatFit, pickWeighted, type LineSettings, type Receiver } from "./fit";
import { followedBy, type Follows } from "./follows";
import type { TruckKind, TruckLine } from "./lines";

export interface Truck {
  kind: TruckKind;
  /** The sender's manager id, or for a sponsor truck the made-up sponsor's name. */
  from: string;
  to: string;
  gameweek: number;
  lineId: string;
  /** The line as filled in when sent, so it reads the same all week. */
  text: string;
  /** The private league a sponsor truck comes from. */
  league?: string;
}

export type TruckProblem =
  | { rule: "notFollowing" }
  | { rule: "sponsorOnly" }
  | { rule: "alreadySent" }
  | { rule: "lineDoesNotFit"; lineId: string };

/** Thrown by a truck that breaks a rule, never sent silently. */
export class TruckError extends Error {
  constructor(readonly problem: TruckProblem) {
    super(`Truck refused: ${problem.rule}.`);
  }
}

export interface TruckSend {
  from: string;
  to: string;
  kind: TruckKind;
  lineId: string;
  /** The current gameweek: the truck parks for it. */
  gameweek: number;
}

/** Why a truck can't be sent; empty when it can. `receiver` is the receiver's week as seen by the
 *  sender (their shared leagues). */
export function truckProblems(
  trucks: readonly Truck[],
  follows: Follows,
  send: TruckSend,
  lines: readonly TruckLine[],
  receiver: Receiver,
  settings: LineSettings,
): TruckProblem[] {
  if (send.kind === "sponsor") return [{ rule: "sponsorOnly" }];
  if (!followedBy(follows, send.from).includes(send.to)) return [{ rule: "notFollowing" }];
  const sent = trucks.some((truck) => truck.from === send.from && truck.to === send.to && truck.gameweek === send.gameweek);
  if (sent) return [{ rule: "alreadySent" }];
  const fits = linesThatFit(lines, send.kind, receiver, settings).some((one) => one.line.id === send.lineId);
  return fits ? [] : [{ rule: "lineDoesNotFit", lineId: send.lineId }];
}

/** A manager sends a coffee or protest truck with a line that fits the receiver's week. */
export function sendTruck(
  trucks: readonly Truck[],
  follows: Follows,
  send: TruckSend,
  lines: readonly TruckLine[],
  receiver: Receiver,
  settings: LineSettings,
): Truck[] {
  const [problem] = truckProblems(trucks, follows, send, lines, receiver, settings);
  if (problem) throw new TruckError(problem);
  const fitting = linesThatFit(lines, send.kind, receiver, settings).find((one) => one.line.id === send.lineId);
  if (!fitting) throw new TruckError({ rule: "lineDoesNotFit", lineId: send.lineId }); // narrows only
  const { from, to, kind, lineId, gameweek } = send;
  return [...trucks, { kind, from, to, gameweek, lineId, text: fitting.text }];
}

/** The trucks parked on a manager's profile for a gameweek. */
export function parkedTrucks(trucks: readonly Truck[], manager: string, gameweek: number): Truck[] {
  return trucks.filter((truck) => truck.to === manager && truck.gameweek === gameweek);
}

export interface PrivateLeague {
  name: string;
  members: readonly LeagueMember[];
}

/** Each private league's sponsor trucks for a gameweek: to its top manager of the gameweek, ranked
 *  as the league's table ranks (spec/08: ties on points go to fewer transfers, then share first).
 *  The line is drawn by weight from the sponsor lines that fit the manager's week, the league as
 *  the one they top; a league whose top has no fitting line sends none. `roll` gives numbers in
 *  [0, 1). */
export function sponsorTrucks(
  leagues: readonly PrivateLeague[],
  gameweek: number,
  lines: readonly TruckLine[],
  receiverOf: (entryId: string) => Omit<Receiver, "leagues">,
  settings: LineSettings,
  roll: () => number,
): Truck[] {
  const week = { first: gameweek, last: gameweek };
  return leagues.flatMap((league) => {
    const tops = leagueTable(league.members, week, gameweek, gameweek).filter((row) => row.rank === 1);
    return tops.flatMap((top): Truck[] => {
      const receiver = { ...receiverOf(top.entryId), leagues: { topOf: [league.name], bottomOf: [] } };
      const drawn = pickWeighted(linesThatFit(lines, "sponsor", receiver, settings), roll());
      if (!drawn) return [];
      if (!drawn.line.sponsor) throw new Error(`Sponsor line ${drawn.line.id} has no sponsor.`);
      const { id: lineId, sponsor: from } = drawn.line;
      return [{ kind: "sponsor", from, to: top.entryId, gameweek, lineId, text: drawn.text, league: league.name }];
    });
  });
}

/** The sponsor trucks a private league shows for a gameweek. */
export function leagueTrucks(trucks: readonly Truck[], league: string, gameweek: number): Truck[] {
  return trucks.filter((truck) => truck.league === league && truck.gameweek === gameweek);
}
