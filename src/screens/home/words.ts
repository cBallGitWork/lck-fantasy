// Home's words, named once. Every word a player reads on this screen lives here.

export const WORDS = {
  /** The countdown's units: `3d 14h 22m`. */
  days: "d",
  hours: "h",
  minutes: "m",
  pickTeam: "Pick Team",
  transfers: "Transfers",
  /** The sponsor's badge, beside the tier, until its art is approved. */
  badge: "Badge",
  /** The sponsor's slot under the band, until its art is approved. */
  sponsor: "Sponsor",
  nextOnStream: "Next on stream",
  /** Before the time until the next series starts: `in 2d 6h`. */
  startsIn: "in",
  /** The star and flop list, for a reader: spec/12's name for it. */
  starAndFlop: "Star and flop",
  star: "Star",
  flop: "Flop",
  points: "Points",
  /** The link over the stream to the Live page. */
  live: "Live",
  /** The stream picker, for a reader. */
  stream: "Stream",
  /** The picker's last key, for the streams past its rows. */
  moreStreams: "More ▾",
  inThisSeries: "In this series",
  stillToPlay: "Still to play",
  /** Still to play, when no one is. */
  none: "None",
  /** The side's head while a series is live. */
  yourWeek: "Your week",
  /** A received cheer's sender: `Cheer from Minji Park`. */
  from: "from",
  following: "Following",
  leagues: "Leagues",
  league: "League",
  rank: "Rank",
  move: "Move",
  allLeagues: "All leagues",
  average: "Average",
  highest: "Highest",
} as const;

/** `Week 3`: a week where the split is clear. */
export const weekHead = (n: number) => `Week ${n}`;

/** `Split 1 Week 3`: a week with its split. */
export const splitWeek = (split: string, n: number) => `${split} ${weekHead(n)}`;

/** A series by its teams: `T1 v DK`. */
export const versus = (home: string, away: string) => `${home} v ${away}`;

/** The deadline bar's head: `Week 4 deadline`. */
export const deadlineHead = (n: number) => `${weekHead(n)} deadline`;

/** After the free transfers' figure, drawn apart: `1 free transfer`, `2 free transfers`. */
export const freeTransfers = (n: number) => (n === 1 ? "free transfer" : "free transfers");

/** The lineup stage's head: `Week 4 lineup`. */
export const lineupHead = (n: number) => `${weekHead(n)} lineup`;

/** `2d 6h`: the time until the next series. */
export const daysHours = (days: number, hours: number) => `${days}${WORDS.days} ${hours}${WORDS.hours}`;

/** Under the stream's score: `Game 2`. */
export const gameHead = (n: number) => `Game ${n}`;

/** A feed row's big Captain: `Captained Faker`. */
export const captainOf = (player: string) => `Captained ${player}`;

/** `31 pts`. */
const pts = (points: number) => `${points} pts`;

/** A series row's line, the manager's points from it: `Scored 31 pts`. */
export const scored = (points: number) => `Scored ${pts(points)}`;

/** A Captain row's line: `31 pts in T1 v DK`. */
export const ptsIn = (points: number, series: string) => `${pts(points)} in ${series}`;

/** `Cheer sent`. */
export const sent = (kind: string) => `${kind} sent`;
