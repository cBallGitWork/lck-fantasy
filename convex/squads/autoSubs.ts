// Auto-subs (spec/01-squad-and-slots.md, Auto-subs): FPL's rule, with role in place of formation.
import { fitsSlot, pickKey, type Pick, type Squad, type SquadPick } from "./squad";

export interface AutoSub {
  slot: SquadPick["slot"];
  out: Pick;
  in: Pick;
}

export interface ScoringLineup {
  /** The starters who score, after subs; a starter nobody could replace stays, scoring 0. */
  lineup: SquadPick[];
  subs: AutoSub[];
}

/** The line-up that scores the gameweek. `played` holds the `pickKey` of every pick who played at
 *  least one game; for the coach, of every team that had a series. The coach slot is never
 *  replaced: there is no bench coach (spec/01, The coach). */
export function autoSubs(squad: Squad, played: ReadonlySet<string>): ScoringLineup {
  const lineup = squad.starters.map((starter) => ({ ...starter }));
  const open = lineup.filter((starter) => starter.slot !== "coach" && !played.has(pickKey(starter.pick)));
  const subs: AutoSub[] = [];

  for (const benchPick of squad.bench) {
    if (!played.has(pickKey(benchPick))) continue;
    // His own role before the flex (spec/01: "his own role before the flex").
    const target =
      open.find((starter) => starter.slot !== "flex" && fitsSlot(benchPick.role, starter.slot)) ??
      open.find((starter) => starter.slot === "flex");
    if (!target) continue;
    subs.push({ slot: target.slot, out: target.pick, in: benchPick });
    target.pick = benchPick;
    open.splice(open.indexOf(target), 1);
  }
  return { lineup, subs };
}
