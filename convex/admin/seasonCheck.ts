// The sim's check (spec/10, The road to launch, step 1): each test manager's gameweek, as the game
// scored it, against the backtest scorer's re-derivation. Any difference, exact to the point, in his
// week total, a pick's game points, or the Captain's or the buff's share is a mismatch, one alert
// each (Craig, 19 Nov 2026, #401).
import type { MutationCtx } from "../_generated/server";
import type { WeekScore } from "../gameweeks/weekPoints";
import type { NewAlert } from "./alertKinds";
import { raiseAlert } from "./alerts";

export type MismatchPart = "total" | "gamePoints" | "captainShare" | "buffShare";

export interface Mismatch {
  manager: string;
  gameweek: number;
  part: MismatchPart;
  /** The pick and his game, by number in the week, for `gamePoints`. */
  pick?: string;
  game?: number;
  /** What the game gave, and what the backtest scorer gives; null where one has no such game. */
  app: number | null;
  backtest: number | null;
}

/** Every difference between the game's score and the backtest's, total first. */
export function weekMismatches(manager: string, gameweek: number, app: WeekScore, backtest: WeekScore): Mismatch[] {
  const found: Mismatch[] = [];
  const differs = (part: Exclude<MismatchPart, "gamePoints">) => {
    if (app[part] !== backtest[part]) found.push({ manager, gameweek, part, app: app[part], backtest: backtest[part] });
  };
  differs("total");
  for (const pick of new Set([...app.gamePoints.keys(), ...backtest.gamePoints.keys()])) {
    const ours = app.gamePoints.get(pick) ?? [];
    const theirs = backtest.gamePoints.get(pick) ?? [];
    for (let i = 0; i < Math.max(ours.length, theirs.length); i++) {
      const [a, b] = [ours[i] ?? null, theirs[i] ?? null];
      if (a !== b) found.push({ manager, gameweek, part: "gamePoints", pick, game: i + 1, app: a, backtest: b });
    }
  }
  differs("captainShare");
  differs("buffShare");
  return found;
}

const PART_LINE: Record<MismatchPart, string> = {
  total: "week total",
  gamePoints: "game points",
  captainShare: "Captain's share",
  buffShare: "buff's share",
};

/** A mismatch as an admin alert: `Faker fan, GW3: week total 47 in the game, 46 in the backtest.` */
export function mismatchAlert(m: Mismatch): NewAlert {
  const what = m.pick === undefined ? PART_LINE[m.part] : `${m.pick} game ${m.game}'s ${PART_LINE[m.part]}`;
  const value = (n: number | null) => (n === null ? "missing" : String(n));
  return {
    kind: "pointsMismatch",
    message: `${m.manager}, GW${m.gameweek}: ${what} ${value(m.app)} in the game, ${value(m.backtest)} in the backtest.`,
    names: [m.manager, `GW${m.gameweek}`, ...(m.pick === undefined ? [] : [m.pick])],
  };
}

/** Raises one alert per mismatch, dated in the competition's `zone`. */
export async function raiseMismatches(ctx: MutationCtx, mismatches: readonly Mismatch[], zone: string): Promise<void> {
  for (const m of mismatches) await raiseAlert(ctx, mismatchAlert(m), zone);
}
