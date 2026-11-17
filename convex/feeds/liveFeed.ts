// Riot's unofficial live feed (spec/11, Live): its 10-second windows folded into one running
// reading per game. Points from it are provisional; solo kills and steals come only when final.
// The feed's shape: docs/research/live-data-sources.md, section 3.
import type { PlayerGameStats, TeamGameStats } from "../scoring/game";
import type { PlayerRole } from "../squads/squad";

interface FeedParticipant {
  participantId: number;
  totalGold: number;
  kills: number;
  deaths: number;
  assists: number;
}

interface FeedTeam {
  totalGold: number;
  towers: number;
  barons: number;
  dragons: string[];
  participants: FeedParticipant[];
}

interface FeedFrame {
  rfc460Timestamp: string;
  gameState: string;
  blueTeam: FeedTeam;
  redTeam: FeedTeam;
}

interface FeedTeamMetadata {
  esportsTeamId: string;
  participantMetadata: { participantId: number; esportsPlayerId: string; summonerName: string; championId: string; role: string }[];
}

export interface LiveWindow {
  esportsGameId: string;
  gameMetadata: { blueTeamMetadata: FeedTeamMetadata; redTeamMetadata: FeedTeamMetadata };
  frames: FeedFrame[];
}

/** The feed's role names. A source's spelling, not a rule. */
const FEED_ROLES: Record<string, PlayerRole> = { top: "top", jungle: "jungle", mid: "mid", bottom: "bot", support: "support" };
const PLAYERS_PER_TEAM = 5;
const ELDER = "elder";
const FINISHED = "finished";
const GOLD_AT_MS = 15 * 60 * 1000;
/** LoL's own multikill timers: each kill within 10 s of the last, a penta within 30 s of the quadra. */
const MULTIKILL_GAP_MS = 10_000;
const PENTA_GAP_MS = 30_000;
const PENTA = 5;
/** Frames further apart than this mean the feed skipped a stretch, so kills seen then have no
 *  known time and can't make a multikill. */
const FRAME_GAP_MS = 5_000;

export interface LivePlayer {
  participantId: number;
  esportsPlayerId: string;
  name: string;
  champion: string;
  teamId: string;
  role: PlayerRole;
  kills: number;
  deaths: number;
  assists: number;
  totalGold: number;
  /** Total gold at 15:00, once the game has reached it. */
  goldAt15: number | null;
  firstBloodKill: boolean;
  /** When each kill was seen, for multikills; null when the feed skipped the moment. */
  killTimes: (number | null)[];
}

export interface LiveTeam {
  teamId: string;
  side: "blue" | "red";
  towers: number;
  barons: number;
  drakes: number;
  elders: number;
  firstTower: boolean;
}

export interface LiveReading {
  gameId: string;
  /** The first frame with any gold: the game clock's 0:00. Null while the game loads. */
  startedAt: number | null;
  lastFrameAt: number;
  finished: boolean;
  players: LivePlayer[];
  teams: [LiveTeam, LiveTeam];
}

/** The window as the feed sent it, checked. Throws on an unexpected shape, so a changed feed is
 *  an admin alert, never a silent gap (#34). */
export function parseLiveWindow(json: unknown): LiveWindow {
  const window = json as Partial<LiveWindow> | null;
  const metadata = window?.gameMetadata;
  if (typeof window?.esportsGameId !== "string" || !metadata?.blueTeamMetadata || !metadata.redTeamMetadata || !Array.isArray(window.frames)) {
    throw new Error("Live feed window has an unexpected shape.");
  }
  for (const frame of window.frames) {
    if (Number.isNaN(Date.parse(frame.rfc460Timestamp))) throw new Error(`Live feed frame time "${frame.rfc460Timestamp}" can't be read.`);
    for (const team of [frame.blueTeam, frame.redTeam]) {
      if (!Array.isArray(team?.participants) || team.participants.length !== PLAYERS_PER_TEAM || !Array.isArray(team.dragons)) {
        throw new Error(`Live feed frame ${frame.rfc460Timestamp} has an unexpected shape.`);
      }
    }
  }
  return window as LiveWindow;
}

/** The reading after one more window: every frame folded in, in order. */
export function readWindow(previous: LiveReading | null, window: LiveWindow): LiveReading {
  let reading = previous ?? emptyReading(window);
  for (const frame of window.frames) reading = readFrame(reading, frame);
  return reading;
}

function emptyReading(window: LiveWindow): LiveReading {
  const { blueTeamMetadata: blue, redTeamMetadata: red } = window.gameMetadata;
  const players = [blue, red].flatMap((team) =>
    team.participantMetadata.map((p): LivePlayer => {
      const role = FEED_ROLES[p.role];
      if (role === undefined) throw new Error(`Unknown live feed role "${p.role}".`);
      return {
        participantId: p.participantId, esportsPlayerId: p.esportsPlayerId, name: p.summonerName, champion: p.championId,
        teamId: team.esportsTeamId, role, kills: 0, deaths: 0, assists: 0, totalGold: 0, goldAt15: null, firstBloodKill: false, killTimes: [],
      };
    }),
  );
  const team = (meta: FeedTeamMetadata, side: "blue" | "red"): LiveTeam => ({ teamId: meta.esportsTeamId, side, towers: 0, barons: 0, drakes: 0, elders: 0, firstTower: false });
  return { gameId: window.esportsGameId, startedAt: null, lastFrameAt: 0, finished: false, players, teams: [team(blue, "blue"), team(red, "red")] };
}

function readFrame(reading: LiveReading, frame: FeedFrame): LiveReading {
  const at = Date.parse(frame.rfc460Timestamp);
  if (at <= reading.lastFrameAt) return reading;
  const startedAt = reading.startedAt ?? (frame.blueTeam.totalGold + frame.redTeam.totalGold > 0 ? at : null);
  const firstBloodTaken = reading.players.some((p) => p.firstBloodKill);
  const reaches15 = startedAt !== null && at >= startedAt + GOLD_AT_MS;
  const byId = new Map([...frame.blueTeam.participants, ...frame.redTeam.participants].map((p) => [p.participantId, p]));
  // A reading's first frame is its baseline: kills and towers already there when it started
  // mid-game have no known order, so first blood and first tower wait for the final stats.
  const baseline = reading.lastFrameAt === 0;
  const timed = !baseline && at - reading.lastFrameAt <= FRAME_GAP_MS;
  // First blood is credited only when one player's kills rose in the frame; two at once (after a
  // skipped stretch) leave it to the final stats.
  const scorers = baseline ? 0 : reading.players.filter((p) => (byId.get(p.participantId)?.kills ?? 0) > p.kills).length;
  const players = reading.players.map((player) => {
    const now = byId.get(player.participantId);
    if (now === undefined) throw new Error(`Live feed frame ${frame.rfc460Timestamp} has no participant ${player.participantId}.`);
    const gained = Math.max(0, now.kills - player.kills);
    return {
      ...player,
      kills: now.kills, deaths: now.deaths, assists: now.assists, totalGold: now.totalGold,
      goldAt15: player.goldAt15 ?? (reaches15 ? now.totalGold : null),
      firstBloodKill: player.firstBloodKill || (!firstBloodTaken && scorers === 1 && gained > 0),
      killTimes: [...player.killTimes, ...Array<number | null>(gained).fill(timed ? at : null)],
    };
  });
  const fedTeam = (team: LiveTeam) => (team.side === "blue" ? frame.blueTeam : frame.redTeam);
  // First tower, like first blood, goes to one team only; both taking one in the same frame
  // (after a skipped stretch) leaves it to the final stats.
  const noTowerYet = !baseline && reading.teams.every((t) => t.towers === 0);
  const towerTakers = reading.teams.filter((t) => fedTeam(t).towers > 0).length;
  const teamNow = (team: LiveTeam): LiveTeam => {
    const fed = fedTeam(team);
    const elders = fed.dragons.filter((d) => d === ELDER).length;
    const firstTower = team.firstTower || (noTowerYet && towerTakers === 1 && fed.towers > 0);
    return { ...team, towers: fed.towers, barons: fed.barons, elders, drakes: fed.dragons.length - elders, firstTower };
  };
  return { ...reading, startedAt, lastFrameAt: at, finished: frame.gameState === FINISHED, players, teams: [teamNow(reading.teams[0]), teamNow(reading.teams[1])] };
}

/** The biggest multikill in a run of kill times: each kill within 10 s of the last, a penta 30 s. */
export function biggestMultikill(killTimes: readonly (number | null)[]): number {
  let biggest = 0;
  let run = 0;
  killTimes.forEach((at, i) => {
    const before = killTimes[i - 1];
    const gap = at === null || before === null || before === undefined ? Infinity : at - before;
    const limit = run === PENTA - 1 ? PENTA_GAP_MS : MULTIKILL_GAP_MS;
    run = gap <= limit && run < PENTA ? run + 1 : 1;
    biggest = Math.max(biggest, run);
  });
  return biggest >= 2 ? biggest : 0;
}

/** A player's live stats in the scoring's shape. Gold lead at 15 is against the other team's
 *  player in the same role. Solo kills and steals are 0 until the series is final (spec/11). */
export function livePlayerStats(reading: LiveReading, participantId: number): PlayerGameStats {
  const player = reading.players.find((p) => p.participantId === participantId);
  if (player === undefined) throw new Error(`No participant ${participantId} in live game ${reading.gameId}.`);
  const opponent = reading.players.find((p) => p.teamId !== player.teamId && p.role === player.role);
  const goldDiffAt15 = player.goldAt15 !== null && opponent?.goldAt15 != null ? player.goldAt15 - opponent.goldAt15 : null;
  return {
    role: player.role, kills: player.kills, deaths: player.deaths, assists: player.assists, goldDiffAt15,
    soloKills: 0, firstBlood: player.firstBloodKill, biggestMultikill: biggestMultikill(player.killTimes), steals: 0,
  };
}

/** A team's live lines for its coach. The feed names no winner, so `won` is false and a quick
 *  win waits for the final stats. */
export function liveTeamStats(reading: LiveReading, teamId: string): TeamGameStats {
  const ours = reading.teams.find((t) => t.teamId === teamId);
  const theirs = reading.teams.find((t) => t.teamId !== teamId);
  if (ours === undefined || theirs === undefined) throw new Error(`Team ${teamId} isn't in live game ${reading.gameId}.`);
  return {
    won: false,
    lengthSeconds: reading.startedAt === null ? 0 : Math.round((reading.lastFrameAt - reading.startedAt) / 1000),
    firstTower: ours.firstTower, drakes: ours.drakes, barons: ours.barons, elders: ours.elders,
    opponent: { drakes: theirs.drakes, barons: theirs.barons, elders: theirs.elders },
  };
}

/** True when no frame has come in `maxAgeMs` while the game isn't finished: the feed is down, so
 *  live points stop and an admin is told (spec/11; #34). */
export function feedStale(reading: LiveReading, now: number, maxAgeMs: number): boolean {
  return !reading.finished && now - reading.lastFrameAt > maxAgeMs;
}
