// The LCK hub picture's made-up data (docs/design/approved/lck-hub/hub.html): the LCK Cup seen on
// Week 4's Tuesday, after Week 3. Records, sets and form are after Week 3. Rosters are 2026's, a
// placeholder; the academy and its prices are made up. Headlines are made up and link to Sheep
// Esports' front page until #116 brings its LCK tag page.

import { COMPETITION, WEEK3_SERIES_FINAL, WEEK4_DEADLINE, WEEK4_SERIES, type TeamCode } from "../../fixtures/week3";
import { WON_PER_EOK } from "../../parts";
import type { RoleKey } from "../../rift";
import type { LckHubData, Roster, RosterMember, StandingsRow, TeamRosters } from "./types";

const eokToWon = (eok: number) => eok * WON_PER_EOK;

const row = (team: TeamCode, won: number, lost: number, setsWon: number, setsLost: number, last5: string): StandingsRow => ({
  team,
  won,
  lost,
  setsWon,
  setsLost,
  last5: [...last5].map((r) => (r === "W" ? "W" : "L")),
});

const ROLE_ORDER: readonly (RoleKey | "coach")[] = ["top", "jng", "mid", "bot", "sup", "coach"];

/** A roster in role order, Top to Support then the coach: game name, hangul, and price in 억 where set. */
const roster = (name: string, league: string, people: [string, string][], pricesEok?: number[]): Roster => ({
  name,
  league,
  members: people.map(([game, hangul], i): RosterMember => {
    const eok = pricesEok?.[i];
    return { id: game.toLowerCase(), name: game, hangul, role: ROLE_ORDER[i] ?? "coach", ...(eok === undefined ? {} : { priceWon: eokToWon(eok) }) };
  }),
});

const LCK = "LCK";
const LCK_CL = "LCK CL";

const lck = (team: TeamCode, people: [string, string][], pricesEok?: number[]): TeamRosters => ({ team, lck: roster(team, LCK, people, pricesEok) });

/** T1's prices are the coach card's Roster tab; the coach is the team's slot at 7.0억. */
const T1_PRICES = [12.5, 14.0, 18.5, 15.0, 14.5, 7.0];
/** Academy players are in the pool like FPL's reserves, at cheap-pick prices; there is no academy coach. */
const T1_ACADEMY_PRICES = [5.0, 5.0, 5.5, 5.0, 5.0];

const SHEEP = "https://www.sheepesports.com/";

export const LCK_HUB: LckHubData = {
  title: `${COMPETITION} 2027`,
  hangul: "LCK 컵",
  bestOf: 3,
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
      ...lck("T1", [["Doran", "최현준"], ["Oner", "문현준"], ["Faker", "이상혁"], ["Peyz", "김수환"], ["Keria", "류민석"], ["kkOma", "김정균"]], T1_PRICES),
      academy: roster(
        "T1 Esports Academy",
        LCK_CL,
        [["Haru", "김하루"], ["Sejin", "박세진"], ["Dowon", "이도원"], ["Minjae", "최민재"], ["Yunho", "정윤호"]],
        T1_ACADEMY_PRICES,
      ),
    },
    lck("GEN", [["Kiin", "김기인"], ["Canyon", "김건부"], ["Chovy", "정지훈"], ["Ruler", "박재혁"], ["Duro", "주민규"], ["Ryu", "류상욱"]]),
    lck("HLE", [["Zeus", "최우제"], ["Kanavi", "서진혁"], ["Zeka", "김건우"], ["Gumayusi", "이민형"], ["Delight", "유환중"], ["Homme", "윤성영"]]),
    lck("DK", [["Siwoo", "전시우"], ["Lucid", "최용혁"], ["ShowMaker", "허수"], ["Aiming", "김하람"], ["BeryL", "조건희"], ["cvMax", "김대호"]]),
    lck("KT", [["PerfecT", "이승민"], ["Cuzz", "문우찬"], ["Bdd", "곽보성"], ["deokdam", "서대길"], ["Peter", "정윤수"], ["Score", "고동빈"]]),
    lck("DNS", [["DuDu", "이동주"], ["Pyosik", "홍창현"], ["BuLLDoG", "이태영"], ["Berserker", "김민철"], ["Life", "김정민"], ["Ssong", "송경호"]]),
    lck("NS", [["Kingen", "황성훈"], ["Sponge", "배영준"], ["Scout", "이예찬"], ["Taeyoon", "김태윤"], ["Lehends", "손시우"], ["DanDy", "최인규"]]),
    lck("KRX", [["Rich", "이재원"], ["Willer", "김정현"], ["ucal", "손우현"], ["Hype", "변정현"], ["Andil", "문관빈"], ["Joker", "조재읍"]]),
    lck("BRO", [["Casting", "신민제"], ["GIDEON", "김민성"], ["Clozer", "이주현"], ["Teddy", "박진성"], ["Pollu", "오동규"], ["Edgar", "최승민"]]),
    lck("BFX", [["Clear", "송현민"], ["Raptor", "전어진"], ["VicLa", "이대광"], ["Diable", "남대근"], ["Kellin", "김형규"], ["Mowgli", "이재하"]]),
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
