// The Following picture's made-up Split 1 Week 3 (docs/design/approved/following/), mid-week.
// Names, teams and numbers are examples, not roster data. Cheer and jeer lines are the unapproved drafts
// (docs/research/truck-lines.md), filled with each receiver's numbers.
import { FOLLOWED_WEEK3, MANAGERS } from "../../fixtures/managers";
import { seriesById } from "../../fixtures/series";
import { CAPTAIN_MULTIPLIER, HIT_POINTS, WEEK2_SERIES, WEEK3_DEADLINE, WEEK3_SERIES_AT_POINTS, type Series } from "../../fixtures/week3";
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
  captainMultiplier: CAPTAIN_MULTIPLIER,
  feed: [
    {
      week: 3,
      notFinal: true,
      deadline: DEADLINE,
      cheerable: true,
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
            { name: "ucal", points: 2, captain: {} },
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
            { name: "Faker", points: 18, captain: { before: 12 } },
            { name: "Keria", points: 5 },
          ],
          ended: { local: "Wed 10:20", kst: "19:20" },
        },
        {
          kind: "deadline",
          id: "f4",
          manager: MINJI,
          buff: "Bench Boost",
          transfers: 5,
          hit: 3 * HIT_POINTS,
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
      cheerable: false,
      items: [
        {
          kind: "series",
          id: "f7",
          manager: JAE,
          points: 21,
          ...WEEK2_GEN_BRO,
          bigCaptain: true,
          players: [{ name: "Ruler", points: 21, captain: { before: 14 } }],
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
  cheers: [
    { id: "t1", kind: "cheer", text: "CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅!", from: MINJI },
    { id: "t2", kind: "jeer", text: "−6 FOR A SIDEWAYS TRANSFER. WHO SIGNED THIS OFF?", from: DAN },
    { id: "t3", kind: "sponsor", text: "WINNER WINNER, GANK CHICKEN. 98 PTS.", league: "Pub League", sponsor: "갱 치킨 Gank Chicken" },
  ],
  following: [MINJI, DAN, JAE],
  followers: [MINJI, DAN, TOM, SAM, PRIYA],
  sent: { dan: "cheer" },
  receivers: {
    jae: {
      pointsSoFar: 31,
      lines: [
        { id: "c13", kind: "cheer", text: "CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅!" },
        { id: "c14", kind: "cheer", text: "THIS COFFEE IS KERIA-TIER SUPPORT." },
        { id: "c18", kind: "cheer", text: "AUTO-SUB SAVIOUR? NO, MATE. YOU ARE." },
        { id: "p01", kind: "jeer", text: "MANAGEMENT MUST EXPLAIN THIS CAPTAIN PICK. 2 PTS." },
        { id: "p15", kind: "jeer", text: "NO TRANSFER AGAIN. IS ANYONE AT HEADQUARTERS?" },
        { id: "p16", kind: "jeer", text: "SET AND FORGET IS NOT A PHILOSOPHY. IT'S A NAP." },
        { id: "p24", kind: "jeer", text: "31 POINTS. WE ARE NOT ANGRY. WE ARE GUTTED." },
        { id: "p26", kind: "jeer", text: "THE TEMPLATE WAS RIGHT THERE, MATE." },
      ],
    },
    minji: {
      pointsSoFar: 58,
      lines: [
        { id: "c09", kind: "cheer", text: "BENCH BOOST IN WEEK 3? BIG PLAY." },
        { id: "c13", kind: "cheer", text: "CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅!" },
        { id: "c14", kind: "cheer", text: "THIS COFFEE IS KERIA-TIER SUPPORT." },
        { id: "p26", kind: "jeer", text: "THE TEMPLATE WAS RIGHT THERE, MATE." },
        { id: "p27", kind: "jeer", text: "WE PARKED HERE. YOUR SQUAD ISN'T MOVING EITHER." },
        { id: "p29", kind: "jeer", text: "MANAGEMENT IS STILL IN BASE. RECALL IS NOT A PLAN." },
      ],
    },
  },
};

/** A manager new to Following: no one followed, no requests, nothing received, no one following. */
export const FOLLOWING_EMPTY: FollowingData = { ...FOLLOWING, feed: [], requests: [], cheers: [], following: [], followers: [], sent: {}, receivers: {} };

/** The cheer picker as drawn (truck.html): opened from Jae's row, Jeer picked. */
export const PICKER_AS_DRAWN = { managerId: JAE.id, kind: "jeer", lineId: "p01" } as const;
