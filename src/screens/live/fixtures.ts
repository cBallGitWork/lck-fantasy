// The Live picture's made-up data (docs/design/approved/live/live.html), built on Week 3 at the
// Points picture's moment. Every week figure is the picture's own: the backend computes them later
// (#33, #34), so nothing here scores.
import {
  BEST_OF,
  COMPETITION,
  playerId,
  POINTS_SQUAD,
  POINTS_WEEK,
  WEEK3_SERIES_AT_POINTS,
  WEEK3_SERIES_FINAL,
  type PointsPick,
  type Series,
} from "../../fixtures/week3";
import { seriesById } from "../../fixtures/series";
import { bestOf } from "../../parts";
import type { LiveDownProps, LiveIdleProps, LiveNowProps, PanelPlayer, RestPlayer, Stream } from "./types";

/** The streams list: admin data (spec/12). The first is the official English stream it opens on. */
export const LIVE_STREAMS: Stream[] = [
  { id: "lck-en-twitch", name: "LCK", language: "English", platform: "Twitch", channel: "twitch.tv/lck", live: true },
  { id: "lck-en-youtube", name: "LCK", language: "English", platform: "YouTube", channel: "youtube.com/@LCKglobal", live: true },
  { id: "lck-ko-youtube", name: "LCK", language: "한국어", platform: "YouTube", channel: "youtube.com/@LCK", live: true },
  { id: "caedrel", name: "Caedrel", language: "English", platform: "Twitch", channel: "twitch.tv/caedrel", live: true },
  { id: "lck-vi-youtube", name: "LCK", language: "Tiếng Việt", platform: "YouTube", channel: "youtube.com/@LCKVietnam", live: false },
  { id: "kameto", name: "Kameto", language: "Français", platform: "Twitch", channel: "twitch.tv/kamet0", live: false },
];

/** With nothing live, every stream is greyed. */
export const IDLE_STREAMS: Stream[] = LIVE_STREAMS.map((s) => ({ ...s, live: false }));

export const DEFAULT_STREAM = LIVE_STREAMS[0]!.id;

const STAGE = `${COMPETITION} Week ${POINTS_WEEK.week}`;
const FORMAT = bestOf(BEST_OF);

const LIVE_SERIES = seriesById(WEEK3_SERIES_AT_POINTS, "w3-sat-2");
const LAST_SERIES = seriesById(WEEK3_SERIES_FINAL, "w3-sat-2");
const NEXT_SERIES = seriesById(WEEK3_SERIES_AT_POINTS, "w3-sun-1");

const starters = POINTS_SQUAD.filter((p) => p.slot !== "bench");
const playsIn = (p: PointsPick) => p.series.some((s) => s.id === LIVE_SERIES.id);
const base = (p: PointsPick) => ({ id: playerId(p.name), name: p.name, team: p.team, role: p.role, mark: p.mark });
const liveGames = (p: PointsPick) => p.series.find((s) => s.id === LIVE_SERIES.id)?.games ?? [];

/** Each player's week points at each moment, as the picture gives them. */
const WEEK_POINTS: Record<"live" | "down" | "idle", Record<string, number>> = {
  live: { faker: 25, siwoo: 8, kkoma: 10, zeus: 14, canyon: 14, ruler: 14, delight: 9 },
  down: { faker: 18, siwoo: 5, kkoma: 8, zeus: 14, canyon: 14, ruler: 14, delight: 9 },
  idle: { faker: 33, siwoo: 9, kkoma: 16, zeus: 14, canyon: 14, ruler: 14, delight: 9 },
};
/** The live game's K/D/A, per player in it. */
const LIVE_KDA: Record<string, string> = { faker: "3/0/2", siwoo: "1/0/1" };
/** The finished T1 2–0 DK as the Series page has it, and kkOma's +3 for a series won. */
const FINAL_GAMES: Record<string, number[]> = { faker: [4, 6], siwoo: [2, 2], kkoma: [2, 3] };
const FINAL_WON: Record<string, number> = { kkoma: 3 };

const points = (moment: keyof typeof WEEK_POINTS, p: PointsPick) => {
  const week = WEEK_POINTS[moment][playerId(p.name)];
  if (week === undefined) throw new Error(`No ${moment} points for ${p.name}`);
  return week;
};
const rest = (moment: keyof typeof WEEK_POINTS): RestPlayer[] =>
  starters.filter((p) => !playsIn(p)).map((p) => ({ ...base(p), points: points(moment, p) }));

const livePlayers: PanelPlayer[] = starters
  .filter(playsIn)
  .map((p) => ({ ...base(p), games: liveGames(p), liveGame: true, kda: LIVE_KDA[playerId(p.name)], points: points("live", p) }));
const downPlayers: PanelPlayer[] = starters
  .filter(playsIn)
  .map((p) => ({ ...base(p), games: liveGames(p).map(() => null), points: points("down", p) }));
const finalPlayers: PanelPlayer[] = starters
  .filter(playsIn)
  .map((p) => ({ ...base(p), games: FINAL_GAMES[playerId(p.name)] ?? [], won: FINAL_WON[playerId(p.name)], points: points("idle", p) }));

const bug = (s: Series) => {
  if (!s.score) throw new Error(`Series ${s.id} has no score`);
  return { home: s.home, away: s.away, score: s.score };
};

/** A series live: T1 1–0 DK, game 2 (`1440.png`). */
export const LIVE_NOW: Omit<LiveNowProps, "picker"> = {
  bug: { ...bug(LIVE_SERIES), game: LIVE_SERIES.liveGame ?? 1, format: FORMAT, stage: STAGE },
  panel: {
    week: { total: 94, average: POINTS_WEEK.average, highest: POINTS_WEEK.highest, notFinal: true },
    series: { home: LIVE_SERIES.home, away: LIVE_SERIES.away },
    players: livePlayers,
    rest: rest("live"),
  },
};

/** The live feed down at the same moment: T1 v DK left out of the total (`1440-down.png`). */
export const LIVE_DOWN: Omit<LiveDownProps, "picker"> = {
  bug: LIVE_NOW.bug,
  panel: {
    week: { total: 82, average: 66, highest: 118, notFinal: true },
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
    week: { total: 109, average: 79, highest: 136, notFinal: false },
    series: { home: LAST_SERIES.home, away: LAST_SERIES.away, score: LAST_SERIES.score },
    players: finalPlayers,
    rest: rest("idle"),
  },
};
