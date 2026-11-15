// The LCK hub picture's made-up data (docs/design/approved/lck-hub/hub.html): the LCK Cup seen on
// Week 4's Tuesday, after Week 3. Records, sets and form are after Week 3. Rosters are 2026's, a
// placeholder; the academy and its prices are made up. Headlines are made up and link to Sheep
// Esports' front page until #116 brings its LCK tag page.

import { ROSTERS, T1_PRICES_EOK } from "../../fixtures/rosters";
import { BEST_OF, COMPETITION, playerId, WEEK3_SERIES_FINAL, WEEK4_DEADLINE, WEEK4_SERIES, type TeamCode } from "../../fixtures/week3";
import { eokToWon } from "../../parts";
import type { PersonRole } from "../../rift";
import type { LckHubData, Roster, RosterMember, StandingsRow, TeamRosters } from "./types";

const row = (team: TeamCode, won: number, lost: number, setsWon: number, setsLost: number, last5: string): StandingsRow => ({
  team,
  won,
  lost,
  setsWon,
  setsLost,
  last5: [...last5].map((r) => (r === "W" ? "W" : "L")),
});

const ROLE_ORDER: readonly PersonRole[] = ["top", "jng", "mid", "bot", "sup", "coach"];

/** A roster in role order, Top to Support then the coach: game name, hangul, and price in 억 where set. */
const roster = (name: string, league: string, people: readonly (readonly [string, string])[], pricesEok?: readonly number[]): Roster => ({
  name,
  league,
  members: people.map(([game, hangul], i): RosterMember => {
    const eok = pricesEok?.[i];
    return { id: playerId(game), name: game, hangul, role: ROLE_ORDER[i] ?? "coach", ...(eok === undefined ? {} : { priceWon: eokToWon(eok) }) };
  }),
});

const LCK = "LCK";
const LCK_CL = "LCK CL";

const lck = (team: TeamCode, pricesEok?: readonly number[]): TeamRosters => ({ team, lck: roster(team, LCK, ROSTERS[team], pricesEok) });

/** Academy players are in the pool like FPL's reserves, at cheap-pick prices; there is no academy coach. */
const T1_ACADEMY_PRICES = [5.0, 5.0, 5.5, 5.0, 5.0];

const SHEEP = "https://www.sheepesports.com/";

export const LCK_HUB: LckHubData = {
  title: `${COMPETITION} 2027`,
  hangul: "LCK 컵",
  bestOf: BEST_OF,
  deadline: WEEK4_DEADLINE,
  stages: [
    {
      name: "Groups",
      fixtures: [{ label: "Week 4", dates: "20–24 Jan", series: WEEK4_SERIES }],
      results: [{ label: "Week 3", dates: "13–17 Jan", series: WEEK3_SERIES_FINAL }],
      openFixtures: 0,
      openResults: 0,
      groups: [
        {
          name: "Baron group",
          hangul: "바론 그룹",
          rows: [
            row("T1", 5, 1, 11, 4, "WWWWW"),
            row("DK", 3, 3, 8, 7, "WLWWL"),
            row("KRX", 3, 3, 7, 8, "LWLWW"),
            row("NS", 2, 4, 5, 8, "WWLLL"),
            row("BRO", 1, 5, 4, 11, "WLLLL"),
          ],
        },
        {
          name: "Elder group",
          hangul: "장로 그룹",
          rows: [
            row("GEN", 5, 1, 11, 5, "LWWWW"),
            row("HLE", 4, 2, 9, 6, "WWWLL"),
            row("DNS", 3, 3, 8, 8, "LWLWW"),
            row("KT", 3, 3, 7, 8, "LWLLW"),
            row("BFX", 1, 5, 4, 9, "LWLLL"),
          ],
        },
      ],
    },
    { name: "Play-In", fixtures: [], results: [], openFixtures: 0, openResults: 0, groups: [] },
    { name: "Playoffs", fixtures: [], results: [], openFixtures: 0, openResults: 0, groups: [] },
  ],
  teams: [
    {
      ...lck("T1", T1_PRICES_EOK),
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
