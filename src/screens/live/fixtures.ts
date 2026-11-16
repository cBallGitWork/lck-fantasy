// The Live picture's made-up data (docs/design/approved/live/live.html), built on Week 3 at the
// Points picture's moment. Each player's week is the shared squad's (MY_WEEK3), so Live, Points
// and Home agree; the backend computes them later (#33, #34).
import {
  BEST_OF,
  COMPETITION,
  kdaText,
  LIVE_SERIES_ID,
  MY_WEEK3,
  playedIn,
  playerId,
  POINTS_SQUAD,
  POINTS_WEEK,
  WEEK3_FINAL,
  WEEK3_SERIES_AT_POINTS,
  WEEK3_SERIES_FINAL,
  weekGamesOf,
  type PointsPick,
  type Series,
} from "../../fixtures/week3";
import { MANAGERS } from "../../fixtures/managers";
import { seriesById } from "../../fixtures/series";
import { STREAMS, type Stream } from "../../fixtures/streams";
import { bestOf } from "../../parts";
import type { LiveDownProps, LiveIdleProps, LiveNowProps, PanelPlayer, RestPlayer } from "./types";

/** With nothing live, every stream is greyed. */
export const IDLE_STREAMS: Stream[] = STREAMS.map((s) => ({ ...s, live: false }));

/** The made-up manager with the week's Highest at every moment: Highest › opens his Points. */
const TOP_MANAGER = MANAGERS.priya.id;

const STAGE = `${COMPETITION} Week ${POINTS_WEEK.week}`;
const FORMAT = bestOf(BEST_OF);

const LIVE_SERIES = seriesById(WEEK3_SERIES_AT_POINTS, LIVE_SERIES_ID);
const LAST_SERIES = seriesById(WEEK3_SERIES_FINAL, LIVE_SERIES_ID);
const NEXT_SERIES = seriesById(WEEK3_SERIES_AT_POINTS, "w3-sun-1");

const starters = POINTS_SQUAD.filter((p) => p.slot !== "bench");
const playsIn = (p: PointsPick) => p.series.some((s) => s.id === LIVE_SERIES.id);
const base = (p: PointsPick) => ({ id: playerId(p.name), name: p.name, team: p.team, role: p.role, mark: p.mark });
const liveGames = (p: PointsPick) => p.series.find((s) => s.id === LIVE_SERIES.id)?.games ?? [];

/** Each player's week points at each moment, from the shared squad. */
const WEEK_POINTS: Record<"live" | "down" | "idle", Readonly<Record<string, number>>> = {
  live: MY_WEEK3.live,
  down: MY_WEEK3.down,
  idle: MY_WEEK3.final,
};
/** A player's K/D/A in the live game, as every page shows it (src/fixtures/games.ts). */
const liveKda = (p: PointsPick) => {
  const kda = weekGamesOf(p.name, LIVE_SERIES.id)[(LIVE_SERIES.liveGame ?? 0) - 1]?.kda;
  return kda && kdaText(kda);
};
/** The finished T1 2–0 DK from the shared squad: each player's games, and a coach's series result. */
const finalIn = (p: PointsPick) => playedIn(p.name, LIVE_SERIES.id, true);

const points = (moment: keyof typeof WEEK_POINTS, p: PointsPick) => {
  const week = WEEK_POINTS[moment][playerId(p.name)];
  if (week === undefined) throw new Error(`No ${moment} points for ${p.name}`);
  return week;
};
const rest = (moment: keyof typeof WEEK_POINTS): RestPlayer[] =>
  starters.filter((p) => !playsIn(p)).map((p) => ({ ...base(p), points: points(moment, p) }));

const livePlayers: PanelPlayer[] = starters
  .filter(playsIn)
  .map((p) => ({ ...base(p), games: liveGames(p), liveGame: true, kda: liveKda(p), points: points("live", p) }));
const downPlayers: PanelPlayer[] = starters
  .filter(playsIn)
  .map((p) => ({ ...base(p), games: liveGames(p).map(() => null), points: points("down", p) }));
const finalPlayers: PanelPlayer[] = starters
  .filter(playsIn)
  .map((p) => ({ ...base(p), games: finalIn(p).games, won: finalIn(p).coachResult, points: points("idle", p) }));

const bug = (s: Series) => {
  if (!s.score) throw new Error(`Series ${s.id} has no score`);
  return { home: s.home, away: s.away, score: s.score };
};

/** A series live: T1 1–0 DK, game 2 (`1440.png`). */
export const LIVE_NOW: Omit<LiveNowProps, "picker"> = {
  bug: { ...bug(LIVE_SERIES), game: LIVE_SERIES.liveGame ?? 1, format: FORMAT, stage: STAGE },
  panel: {
    week: { total: MY_WEEK3.liveTotal, average: POINTS_WEEK.average, highest: POINTS_WEEK.highest, highestBy: TOP_MANAGER, notFinal: true },
    series: { home: LIVE_SERIES.home, away: LIVE_SERIES.away },
    players: livePlayers,
    rest: rest("live"),
  },
};

/** The live feed down at the same moment: T1 v DK left out of the total (`1440-down.png`). */
export const LIVE_DOWN: Omit<LiveDownProps, "picker"> = {
  bug: LIVE_NOW.bug,
  panel: {
    week: { total: MY_WEEK3.downTotal, average: 66, highest: 118, highestBy: TOP_MANAGER, notFinal: true },
    series: LIVE_NOW.panel.series,
    players: downPlayers,
    rest: rest("down"),
  },
};

/** Nothing live: Sunday morning before KRX v BRO; Saturday's T1 2–0 DK final (`1440-idle.png`). */
export const LIVE_IDLE: Omit<LiveIdleProps, "picker"> = {
  next: {
    home: NEXT_SERIES.home,
    away: NEXT_SERIES.away,
    day: "Sunday",
    stage: STAGE,
    format: FORMAT,
    local: NEXT_SERIES.local,
    kst: NEXT_SERIES.kst,
    countdown: { hours: 1, minutes: 20 },
  },
  last: { ...bug(LAST_SERIES), day: "Saturday", format: FORMAT, stage: STAGE },
  panel: {
    week: { total: MY_WEEK3.finalTotal, ...WEEK3_FINAL, highestBy: TOP_MANAGER, notFinal: false },
    series: { home: LAST_SERIES.home, away: LAST_SERIES.away },
    players: finalPlayers,
    rest: rest("idle"),
  },
};
