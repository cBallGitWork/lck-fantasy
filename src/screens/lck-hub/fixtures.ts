// The LCK hub picture's made-up data (docs/design/approved/lck-hub/hub.html): the Split 1 seen on
// Week 4's Tuesday, after Week 3. Records, sets and form are after Week 3. Rosters are 2026's, a
// placeholder; the academy and its prices are made up. Headlines are made up and link to Sheep
// Esports' front page until #116 brings its LCK tag page.

import { ROSTERS, T1_PRICES_M } from "../../fixtures/rosters";
import { WEEK3_STANDINGS, type Standing } from "../../fixtures/standings";
import { BEST_OF, COMPETITION_TITLE, playerId, WEEK3_SERIES_FINAL, WEEK4_DEADLINE, WEEK4_SERIES, type TeamCode } from "../../fixtures/week3";
import { mToWon } from "../../parts";
import { PERSON_ROLES } from "../../rift";
import type { LckHubData, Roster, RosterMember, StandingsRow, TeamRosters } from "./types";

/** A standing as the table draws it: its last five as results. */
const row = ({ last5, ...rest }: Standing): StandingsRow => ({ ...rest, last5: [...last5].map((r) => (r === "W" ? "W" : "L")) });

/** A roster in role order, Top to Support then the coach: game name, hangul, and price in m where set. */
const roster = (name: string, league: string, people: readonly (readonly [string, string])[], pricesM?: readonly number[]): Roster => ({
  name,
  league,
  members: people.map(([game, hangul], i): RosterMember => {
    const money = pricesM?.[i];
    return { id: playerId(game), name: game, hangul, role: PERSON_ROLES[i] ?? "coach", ...(money === undefined ? {} : { priceWon: mToWon(money) }) };
  }),
});

const LCK = "LCK";
const LCK_CL = "LCK CL";

const lck = (team: TeamCode, pricesM?: readonly number[]): TeamRosters => ({ team, lck: roster(team, LCK, ROSTERS[team], pricesM) });

/** Academy players are in the pool like FPL's reserves, at cheap-pick prices; there is no academy coach. */
const T1_ACADEMY_PRICES = [5.0, 5.0, 5.5, 5.0, 5.0];

const SHEEP = "https://www.sheepesports.com/";

export const LCK_HUB: LckHubData = {
  title: COMPETITION_TITLE,
  hangul: "스플릿 1",
  bestOf: BEST_OF,
  deadline: WEEK4_DEADLINE,
  stages: [
    {
      name: "Groups",
      fixtures: [{ label: "Week 4", dates: "20–24 Jan", series: WEEK4_SERIES }],
      results: [{ label: "Week 3", dates: "13–17 Jan", series: WEEK3_SERIES_FINAL }],
      thisWeek: 0,
      openResults: 0,
      starts: "Wed 6 Jan",
      groups: WEEK3_STANDINGS.map((g) => ({ ...g, rows: g.rows.map(row) })),
    },
    { name: "Play-In", fixtures: [], results: [], thisWeek: 0, openResults: 0, starts: "Wed 10 Mar", groups: [] },
    { name: "Playoffs", fixtures: [], results: [], thisWeek: 0, openResults: 0, starts: "Wed 24 Mar", groups: [] },
  ],
  teams: [
    {
      ...lck("T1", T1_PRICES_M),
      academy: roster(
        "T1 Esports Academy",
        LCK_CL,
        [["Haru", "김하루"], ["Sejin", "박세진"], ["Dowon", "이도원"], ["Minjae", "최민재"], ["Yunho", "정윤호"]],
        T1_ACADEMY_PRICES,
      ),
    },
    lck("GEN"),
    lck("HLE"),
    lck("DK"),
    lck("KT"),
    lck("DNS"),
    lck("NS"),
    lck("KRX"),
    lck("BRO"),
    lck("BFX"),
  ],
  news: {
    source: "Sheep Esports",
    headlines: [
      { headline: "T1 win five in a row after their opening loss to GEN", date: "Mon 18 Jan", url: SHEEP },
      { headline: 'Kiin: "We know where we lost the GEN series"', date: "Mon 18 Jan", url: SHEEP },
      { headline: "BNK FEARX bench their jungler for Week 4", date: "Sun 17 Jan", url: SHEEP },
      { headline: "DK's Siwoo leads every top laner in solo kills", date: "Sun 17 Jan", url: SHEEP },
      { headline: "Week 4 preview: T1 v GEN on Saturday", date: "Fri 15 Jan", url: SHEEP },
    ],
    moreUrl: SHEEP,
  },
};
