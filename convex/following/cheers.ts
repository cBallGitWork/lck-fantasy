// Cheers (spec/14-following.md, Cheers and jeers): a manager sends a cheer or jeer to anyone they
// follow, one per manager followed per gameweek, and it parks on the receiver's profile for the
// gameweek with the sender's name. A sponsor cheer sends itself to each private league's top
// manager of the gameweek.
import { leagueTable, type LeagueMember } from "../leagues/tables";
import { linesThatFit, pickWeighted, type LineSettings, type Receiver } from "./fit";
import { followedBy, type Follows } from "./follows";
import type { CheerKind, CheerLine } from "./lines";
import { refuseFirst, Refused } from "./refused";

export interface Cheer {
  kind: CheerKind;
  /** The sender's manager id, or for a sponsor cheer the made-up sponsor's name. */
  from: string;
  to: string;
  gameweek: number;
  lineId: string;
  /** The line as filled in when sent, so it reads the same all week. */
  text: string;
  /** The private league a sponsor cheer comes from. */
  league?: string;
}

export type CheerProblem =
  | { rule: "notFollowing" }
  | { rule: "sponsorOnly" }
  | { rule: "alreadySent" }
  | { rule: "lineDoesNotFit"; lineId: string };

/** What a cheer refuses as (`Refused`). */
const CHEER = "Cheer";

export interface CheerSend {
  from: string;
  to: string;
  kind: CheerKind;
  lineId: string;
  /** The current gameweek: the cheer parks for it. */
  gameweek: number;
}

/** Why a cheer can't be sent; empty when it can. `receiver` is the receiver's week as seen by the
 *  sender (their shared leagues). */
export function cheerProblems(
  cheers: readonly Cheer[],
  follows: Follows,
  send: CheerSend,
  lines: readonly CheerLine[],
  receiver: Receiver,
  settings: LineSettings,
): CheerProblem[] {
  if (send.kind === "sponsor") return [{ rule: "sponsorOnly" }];
  if (!followedBy(follows, send.from).includes(send.to)) return [{ rule: "notFollowing" }];
  const sent = cheers.some((cheer) => cheer.from === send.from && cheer.to === send.to && cheer.gameweek === send.gameweek);
  if (sent) return [{ rule: "alreadySent" }];
  const fits = linesThatFit(lines, send.kind, receiver, settings).some((one) => one.line.id === send.lineId);
  return fits ? [] : [{ rule: "lineDoesNotFit", lineId: send.lineId }];
}

/** A manager sends a cheer or jeer with a line that fits the receiver's week. */
export function sendCheer(
  cheers: readonly Cheer[],
  follows: Follows,
  send: CheerSend,
  lines: readonly CheerLine[],
  receiver: Receiver,
  settings: LineSettings,
): Cheer[] {
  refuseFirst(CHEER, cheerProblems(cheers, follows, send, lines, receiver, settings));
  const fitting = linesThatFit(lines, send.kind, receiver, settings).find((one) => one.line.id === send.lineId);
  if (!fitting) throw new Refused<CheerProblem>(CHEER, { rule: "lineDoesNotFit", lineId: send.lineId }); // narrows only
  const { from, to, kind, lineId, gameweek } = send;
  return [...cheers, { kind, from, to, gameweek, lineId, text: fitting.text }];
}

/** The cheers parked on a manager's profile for a gameweek. */
export function parkedCheers(cheers: readonly Cheer[], manager: string, gameweek: number): Cheer[] {
  return cheers.filter((cheer) => cheer.to === manager && cheer.gameweek === gameweek);
}

export interface PrivateLeague {
  name: string;
  members: readonly LeagueMember[];
}

/** Each private league's sponsor cheers for a gameweek: to its top manager of the gameweek, ranked
 *  as the league's table ranks (spec/08: ties on points go to fewer transfers, then share first).
 *  The line is drawn by weight from the sponsor lines that fit the manager's week, the league as
 *  the one they top; a league whose top has no fitting line sends none. `roll` gives numbers in
 *  [0, 1). */
export function sponsorCheers(
  leagues: readonly PrivateLeague[],
  gameweek: number,
  lines: readonly CheerLine[],
  receiverOf: (entryId: string) => Omit<Receiver, "leagues">,
  settings: LineSettings,
  roll: () => number,
): Cheer[] {
  const week = { first: gameweek, last: gameweek };
  return leagues.flatMap((league) => {
    const tops = leagueTable(league.members, week, gameweek, gameweek).filter((row) => row.rank === 1);
    return tops.flatMap((top): Cheer[] => {
      const receiver = { ...receiverOf(top.entryId), leagues: { topOf: [league.name], bottomOf: [] } };
      const drawn = pickWeighted(linesThatFit(lines, "sponsor", receiver, settings), roll());
      if (!drawn) return [];
      if (!drawn.line.sponsor) throw new Error(`Sponsor line ${drawn.line.id} has no sponsor.`);
      const { id: lineId, sponsor: from } = drawn.line;
      return [{ kind: "sponsor", from, to: top.entryId, gameweek, lineId, text: drawn.text, league: league.name }];
    });
  });
}

/** The sponsor cheers a private league shows for a gameweek. */
export function leagueCheers(cheers: readonly Cheer[], league: string, gameweek: number): Cheer[] {
  return cheers.filter((cheer) => cheer.league === league && cheer.gameweek === gameweek);
}
