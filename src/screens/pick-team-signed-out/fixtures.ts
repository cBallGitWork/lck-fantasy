// The front door picture's moment (docs/design/approved/front-door/): Split 1 Week 4 before its
// deadline, built on the shared made-up week. Its rules are data/lck's season settings.

import season from "../../../data/lck/season-2027.json";
import type { Squad } from "../../../convex/squads/squad";
import { opponent, seriesOf } from "../../fixtures/series";
import { COMPETITION, MANAGER, OFF_PAGE_PLAYERS, STATS_PLAYERS, WEEK4_DEADLINE, WEEK4_SERIES } from "../../fixtures/week3";
import { mToWon } from "../../parts";
import { pickOf, type FrontDoorRules, type GuestPlayer } from "./pick";

/** Every player and coach the list offers, at Stats' prices, points and owned %. */
export const PLAYERS: GuestPlayer[] = [...STATS_PLAYERS, ...OFF_PAGE_PLAYERS]
  .map((p) => ({ name: p.name, team: p.team, role: p.role, priceWon: mToWon(p.priceM), points: p.points, ownedPct: p.ownedPct }))
  .sort((a, b) => b.points - a.points);

/** The season's squad shape, budget and Auto-fill gap, as data/lck holds them. */
export const RULES: FrontDoorRules = {
  squad: season.settings.squad,
  budget: season.settings.budget,
  autoFillGap: season.settings.autoFillGap,
};

/** The season's cap on a team name. */
export const NAME_MAX = season.settings.teamNameMaxLength;

/** The competition the guest's squad is kept for (guestSquad.ts). */
export const COMPETITION_ID = `${season.competition.name}-${season.year}`;

/** Each team's next opponent this week: `v BRO`. */
export const NEXT: Record<string, string> = Object.fromEntries(
  [...new Set(WEEK4_SERIES.flatMap((s) => [s.home, s.away]))].map((team) => [team, opponent(seriesOf(WEEK4_SERIES, team)[0]!, team)]),
);

export const WEEK = { competition: COMPETITION, week: "Week 4", deadline: WEEK4_DEADLINE };

/** The teams the Team filter offers. */
export const TEAMS = [...new Set(PLAYERS.map((p) => p.team))].sort();

const named = (name: string) => {
  const p = PLAYERS.find((player) => player.name === name);
  if (!p) throw new Error(`${name} isn't in the front door's list`);
  return pickOf(p);
};

/** The part-picked picture: Zeus, Faker, Ruler and kkOma. */
export const PART_SQUAD: Squad = {
  starters: [
    { slot: "top", pick: named("Zeus") },
    { slot: "mid", pick: named("Faker") },
    { slot: "bot", pick: named("Ruler") },
    { slot: "coach", pick: named("kkOma") },
  ],
  bench: [],
};

/** The sign-up sheet's team name, as the Settings picture draws it. */
export const SAMPLE_TEAM = MANAGER.team;
