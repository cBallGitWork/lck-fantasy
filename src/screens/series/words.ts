// The Series page's words, named once. Every word a player reads on this screen lives here.

export const WORDS = {
  /** The way back to the LCK hub, above the scorebug. */
  backToLck: "‹ LCK",
  /** Between the two codes before a series starts. */
  versus: "v",
  /** By the Live and Not final tags: what isn't scored until the series is final. */
  liveNote: "Solo kills, steals at final",
  watch: "Watch",
  vod: "VOD",
  /** Player of the Game's badge. */
  pog: "POG",
  /** The grid's role and name columns, for a reader. */
  role: "Role",
  name: "Name",
  /** The grid's last column: the player's points for the series. */
  series: "Series",
  noSuchSeries: "No such series",
  /** The way on from a missing series. */
  lckHub: "LCK hub",
} as const;

/** `Split 1 · Week 3`: the competition and week a series is in. */
export const weekLine = (competition: string, week: number) => `${competition} · Week ${week}`;

/** `Mid · sub`: a sub's role. */
export const subRole = (role: string) => `${role} · sub`;
