/** A payload in the shape of Riot's match-v5 JSON, as Leaguepedia's "V5 data:" pages hold it, cut
 *  to the fields Flol reads. The values are made up for the tests, not a real game's: every
 *  participant, 1 to 10, with no solo kills or steals unless `extra` says so. */
export function v5Game(extra: Record<number, { soloKills?: number; objectivesStolen?: number }> = {}) {
  const participants = Array.from({ length: 10 }, (_, i) => ({ soloKills: 0, objectivesStolen: 0, ...extra[i + 1], participantId: i + 1 }));
  return {
    metadata: { matchId: "fixture" },
    info: {
      participants: participants.map(({ participantId, soloKills, objectivesStolen }) => ({
        participantId,
        objectivesStolen,
        challenges: { soloKills },
      })),
    },
  };
}
