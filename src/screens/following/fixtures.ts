// The Following picture's made-up LCK Cup Week 3 (docs/design/approved/following/), mid-week.
// Names, teams and numbers are examples, not roster data. Truck lines are the unapproved drafts
// (docs/research/truck-lines.md), filled with each receiver's numbers.
import { seriesById } from "../../fixtures/series";
import { WEEK3_SERIES_AT_POINTS } from "../../fixtures/week3";
import type { FollowingData, Manager, SeriesItem } from "./feed";

const MINJI: Manager = { id: "minji", name: "Minji Park", team: "Chovy Was Right There" };
const JAE: Manager = { id: "jae", name: "Jae Kim", team: "Deft Tomorrow" };
const DAN: Manager = { id: "dan", name: "Dan Okafor", team: "Peanut Butter Gank" };
const ELLA: Manager = { id: "ella", name: "Ella Wong", team: "Ruler of None" };
const JOE: Manager = { id: "joe", name: "Joe Grant", team: "BeryL Backup Plan" };
const TOM: Manager = { id: "tom", name: "Tom Reid", team: "Kiin Bean" };
const SAM: Manager = { id: "sam", name: "Sam Hill", team: "Guma Gang" };
const PRIYA: Manager = { id: "priya", name: "Priya Shah", team: "Zeus Juice" };

/** A Week 3 series' teams and score, as the shared fixture holds them. */
function week3(seriesId: string): Pick<SeriesItem, "home" | "away" | "score" | "bestOf"> {
  const s = seriesById(WEEK3_SERIES_AT_POINTS, seriesId);
  if (!s.score) throw new Error(`No Week 3 series ${seriesId} with a score.`);
  return { home: s.home, away: s.away, score: s.score, bestOf: 3 };
}

const DEADLINE = { local: "Wed 07:45", kst: "16:45" } as const;
const WEEK2_GEN_DNS = { home: "GEN", away: "DNS", score: [2, 0], bestOf: 3 } as const;
const WEEK2_ENDED = { local: "Sun 12:30", kst: "21:30" } as const;

export const FOLLOWING: FollowingData = {
  week: 3,
  followCap: 50,
  carryMultiplier: 1.5,
  feed: [
    {
      week: 3,
      notFinal: true,
      truckable: true,
      items: [
        {
          kind: "series",
          id: "f1",
          manager: MINJI,
          points: 20,
          ...week3("w3-sat-1"),
          players: [
            { name: "Kiin", points: 5 },
            { name: "Canyon", points: 7 },
            { name: "Chovy", points: 8 },
          ],
          ended: { local: "Sat 10:20", kst: "19:20" },
        },
        {
          kind: "series",
          id: "f2",
          manager: JAE,
          points: 9,
          ...week3("w3-fri-2"),
          players: [
            { name: "Rich", points: 4 },
            { name: "ucal", points: 2, carry: {} },
            { name: "Lehends", points: 3 },
          ],
          ended: { local: "Fri 13:00", kst: "22:00" },
        },
        {
          kind: "series",
          id: "f3",
          manager: DAN,
          points: 34,
          ...week3("w3-wed-1"),
          players: [
            { name: "Oner", points: 11 },
            { name: "Faker", points: 18, carry: { before: 12 } },
            { name: "Keria", points: 5 },
          ],
          ended: { local: "Wed 10:20", kst: "19:20" },
        },
        {
          kind: "deadline",
          id: "f4",
          manager: MINJI,
          buff: "Limitless",
          transfers: 5,
          swaps: [
            { out: "Doran", in: "Kiin", soFar: 9 },
            { out: "Peyz", in: "Ruler", soFar: 4 },
            { out: "Lehends", in: "Keria", soFar: -1 },
            { out: "Oner", in: "Canyon", soFar: 2 },
            { out: "Bdd", in: "Chovy", soFar: 3 },
          ],
          at: DEADLINE,
        },
        {
          kind: "deadline",
          id: "f5",
          manager: DAN,
          transfers: 2,
          hit: 6,
          swaps: [
            { out: "Lucid", in: "Oner", soFar: 0 },
            { out: "Chovy", in: "Faker", soFar: 24 },
          ],
          at: DEADLINE,
        },
        { kind: "deadline", id: "f6", manager: JAE, transfers: 0, swaps: [], at: DEADLINE },
      ],
    },
    {
      week: 2,
      truckable: false,
      items: [
        {
          kind: "series",
          id: "f7",
          manager: JAE,
          points: 21,
          ...WEEK2_GEN_DNS,
          bigCarry: true,
          players: [{ name: "Ruler", points: 21, carry: { before: 14 } }],
          ended: WEEK2_ENDED,
        },
        {
          kind: "series",
          id: "f8",
          manager: MINJI,
          points: 21,
          ...WEEK2_GEN_DNS,
          players: [{ name: "Chovy", points: 21 }],
          ended: WEEK2_ENDED,
        },
      ],
    },
  ],
  requests: [ELLA, JOE],
  trucks: [
    { id: "t1", kind: "coffee", text: "CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅!", from: MINJI },
    { id: "t2", kind: "protest", text: "THIS TRUCK WAS FUNDED BY YOUR −6.", from: DAN },
    { id: "t3", kind: "sponsor", text: "WINNER WINNER, GANK CHICKEN. 98 PTS.", league: "Pub League", sponsor: "갱 치킨 Gank Chicken" },
  ],
  following: [MINJI, DAN, JAE],
  followers: [MINJI, DAN, TOM, SAM, PRIYA],
  sent: { dan: "coffee" },
  receivers: {
    jae: {
      pointsSoFar: 31,
      lines: [
        { id: "c13", kind: "coffee", text: "CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅!" },
        { id: "c14", kind: "coffee", text: "THIS COFFEE IS KERIA-TIER SUPPORT." },
        { id: "c18", kind: "coffee", text: "AUTO-SUB SAVIOUR? NO, MATE. YOU ARE." },
        { id: "p01", kind: "protest", text: "MANAGEMENT MUST EXPLAIN THIS CARRY PICK. 2 PTS." },
        { id: "p15", kind: "protest", text: "NO TRANSFER AGAIN. IS ANYONE AT HEADQUARTERS?" },
        { id: "p16", kind: "protest", text: "SET AND FORGET IS NOT A PHILOSOPHY. IT'S A NAP." },
        { id: "p24", kind: "protest", text: "31 POINTS. WE ARE NOT ANGRY. WE ARE GUTTED." },
        { id: "p26", kind: "protest", text: "THE TEMPLATE WAS RIGHT THERE, MATE." },
      ],
    },
    minji: {
      pointsSoFar: 58,
      lines: [
        { id: "c09", kind: "coffee", text: "REMAKE OR LIMITLESS, EITHER WAY: CHEEKY. 화이팅!" },
        { id: "c13", kind: "coffee", text: "CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅!" },
        { id: "c14", kind: "coffee", text: "THIS COFFEE IS KERIA-TIER SUPPORT." },
        { id: "p26", kind: "protest", text: "THE TEMPLATE WAS RIGHT THERE, MATE." },
        { id: "p27", kind: "protest", text: "WE PARKED HERE. YOUR SQUAD ISN'T MOVING EITHER." },
        { id: "p28", kind: "protest", text: "THE TRUCK DRIVER HAS ALSO LOST FAITH." },
      ],
    },
  },
};

/** The truck picker as drawn (truck.html): opened from Jae's row, Protest picked. */
export const PICKER_AS_DRAWN = { managerId: JAE.id, kind: "protest", lineId: "p01" } as const;
