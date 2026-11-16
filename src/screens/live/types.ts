// What the Live page takes. The fixture feeds it until the backend does (#33, #34, #36).
import type { TeamCode } from "../../fixtures/week3";
import type { Score } from "../../parts";
import type { IconKey, Mark } from "../../rift";

/** One stream in the picker: admin data (spec/12). Twitch and YouTube only in the beta. */
export interface Stream {
  id: string;
  name: string;
  language: string;
  platform: "Twitch" | "YouTube";
  channel: string;
  live: boolean;
}

/** The picker: the streams, the manager's pick, and what a chip or More ▾ does. */
export interface Picker {
  streams: Stream[];
  picked: string;
  onPick: (id: string) => void;
}

interface Pick {
  id: string;
  name: string;
  team: TeamCode;
  role: IconKey;
  mark?: Mark;
  /** His week points, the Carry ×1.5 included. */
  points: number;
}

/** One of your players in the panel's series: this series' games beneath his name. */
export interface PanelPlayer extends Pick {
  /** Each game's points; null where the feed is down. */
  games: (number | null)[];
  /** The last game is the live one. */
  liveGame?: boolean;
  /** The live game's K/D/A. */
  kda?: string;
  /** A coach's points for the series won. */
  won?: number;
}

/** The rest of your week: one row each. */
export type RestPlayer = Pick;

export interface WeekTotal {
  total: number;
  average: number;
  highest: number;
  final: boolean;
}

export interface Panel {
  week: WeekTotal;
  /** The series the panel's players are in; the scorebug carries its score. */
  series: { home: TeamCode; away: TeamCode };
  players: PanelPlayer[];
  rest: RestPlayer[];
}

interface Bug {
  home: TeamCode;
  away: TeamCode;
  score: Score;
  format: string;
  /** `Split 1 Week 3`. */
  stage: string;
}

/** The scorebug while live: the game being played. */
export interface LiveBug extends Bug {
  game: number;
}

/** The scorebug with nothing live: the last series, final. */
export interface FinalBug extends Bug {
  day: string;
}

/** The next series on the idle stage, with a countdown to it. */
export interface NextSeries {
  home: TeamCode;
  away: TeamCode;
  day: string;
  stage: string;
  format: string;
  local: string;
  kst: string;
  countdown: { hours: number; minutes: number };
}

export interface LiveNowProps {
  bug: LiveBug;
  panel: Panel;
  picker: Picker;
}

export type LiveDownProps = LiveNowProps;

export interface LiveIdleProps {
  next: NextSeries;
  last: FinalBug;
  panel: Panel;
  picker: Picker;
}
