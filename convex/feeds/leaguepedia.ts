// Leaguepedia's match data (spec/11, Final): its "V5 data:" page holds Riot's match-v5 JSON for a
// pro game, the one free source of solo kills and steals (docs/research/lol-fantasy-scoring-and-steals.md).
// The page holds the match flat: `participants` at the top level, not under match-v5's `info`.

/** The page key for an Oracle's Elixir game: the one an admin pasted in when the match isn't found
 *  on its own, else the game's id with a space for each `_`. */
export function leaguepediaGameKey(oeGameId: string, pasted?: string): string {
  return pasted?.trim() || oeGameId.replaceAll("_", " ");
}

export interface V5Extras {
  soloKills: number;
  /** Riot's `objectivesStolen`: any epic monster, as Riot counts it. */
  steals: number;
}

interface V5Participant {
  participantId?: unknown;
  objectivesStolen?: unknown;
  challenges?: { soloKills?: unknown };
}

/** Each participant's solo kills and steals, by participant id (1–10, the same as Oracle's
 *  Elixir's). Throws when a field is missing, rather than score it 0. */
export function v5Extras(payload: unknown): Map<number, V5Extras> {
  const participants = (payload as { participants?: unknown } | null)?.participants;
  if (!Array.isArray(participants)) throw new Error("Match data has no participants.");
  return new Map(
    (participants as V5Participant[]).map((p) => {
      const id = count(p.participantId, "participantId", "?");
      return [id, { soloKills: count(p.challenges?.soloKills, "challenges.soloKills", id), steals: count(p.objectivesStolen, "objectivesStolen", id) }];
    }),
  );
}

function count(value: unknown, field: string, participant: number | string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(`Match data: participant ${participant} has no ${field}.`);
  }
  return value;
}
