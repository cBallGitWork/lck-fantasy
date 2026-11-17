// The Following picture's made-up Split 1 Week 3 (docs/design/approved/following/), mid-week.
// Names, teams and numbers are examples, not roster data. Truck lines are the unapproved drafts
// (docs/research/truck-lines.md), filled with each receiver's numbers.
import { FOLLOWED_WEEK3, MANAGERS } from "../../fixtures/managers";
import { seriesById } from "../../fixtures/series";
import { CARRY_MULTIPLIER, HIT_POINTS, WEEK2_SERIES, WEEK3_DEADLINE, WEEK3_SERIES_AT_POINTS, type Series } from "../../fixtures/week3";
import type { FollowingData, SeriesItem } from "./feed";

const { minji: MINJI, jae: JAE, dan: DAN, ella: ELLA, joe: JOE, tom: TOM, sam: SAM, priya: PRIYA } = MANAGERS;

/** A series' teams and score, as the shared fixture holds them. */
function scored(list: readonly Series[], seriesId: string): Pick<SeriesItem, "home" | "away" | "score"> {
  const s = seriesById(list, seriesId);
  if (!s.score) throw new Error(`No series ${seriesId} with a score.`);
  return { home: s.home, away: s.away, score: s.score };
}

const week3 = (seriesId: string) => scored(WEEK3_SERIES_AT_POINTS, seriesId);

const DEADLINE = { local: `${WEEK3_DEADLINE.day} ${WEEK3_DEADLINE.time}`, kst: WEEK3_DEADLINE.kst };
const WEEK2_GEN_BRO = scored(WEEK2_SERIES, "w2-wed-2");
const WEEK2_ENDED = { local: "Sun 12:30", kst: "21:30" } as const;

export const FOLLOWING: FollowingData = {
  week: 3,
  followCap: 50,
  carryMultiplier: CARRY_MULTIPLIER,
  feed: [
    {
      week: 3,
      notFinal: true,
      deadline: DEADLINE,
      truckable: true,
      items: [
        {
          kind: "series",
          id: "f1",
          manager: MINJI,
          points: FOLLOWED_WEEK3.minji.points,
          ...week3(FOLLOWED_WEEK3.minji.seriesId),
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
          points: FOLLOWED_WEEK3.jae.points,
          ...week3(FOLLOWED_WEEK3.jae.seriesId),
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
          points: FOLLOWED_WEEK3.dan.points,
          ...week3(FOLLOWED_WEEK3.dan.seriesId),
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
        },
        {
          kind: "deadline",
          id: "f5",
          manager: DAN,
          transfers: 2,
          hit: HIT_POINTS,
          swaps: [
            { out: "Lucid", in: "Oner", soFar: 0 },
            { out: "Chovy", in: "Faker", soFar: 24 },
          ],
        },
        { kind: "deadline", id: "f6", manager: JAE, transfers: 0, swaps: [] },
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
          ...WEEK2_GEN_BRO,
          bigCarry: true,
          players: [{ name: "Ruler", points: 21, carry: { before: 14 } }],
          ended: WEEK2_ENDED,
        },
        {
          kind: "series",
          id: "f8",
          manager: MINJI,
          points: 21,
          ...WEEK2_GEN_BRO,
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
