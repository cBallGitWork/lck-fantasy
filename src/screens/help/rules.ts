// Help's Rules: every rule, in groups, each item opening and closing, as FPL's Rules (spec/12, Help).
import { captained, HIT_POINTS, TEAM_CAP } from "../../fixtures/competition";
import { MINUS, plural, signed } from "../../parts";
import { PRICES_RULE } from "../../paths";
import { BANK_CAP, BENCH, BUDGET, CAPTAIN_CHOICES, FREE_AFTER_UNLIMITED, FREE_PER_WEEK, SQUAD_SIZE, STARTERS } from "./facts";
import { CAPTAIN_EXAMPLE, CAPTAIN_TIMES, DEADLINE_RULE, KNOCKOUT_TEAM_CAP, type Item } from "./words";

/** A Captain's minus score, shown rounding towards zero. */
const MINUS_EXAMPLE = -3;

/** The rule the guide's Full scoring table › opens. */
export const SCORING_RULE = "scoring";

/** The rule Rules opens with when no other is asked for. */
export const FIRST_RULE = "squad-size";

export const RULES: readonly { group: string; items: readonly Item[] }[] = [
  {
    group: "Selecting your squad",
    items: [
      {
        id: FIRST_RULE,
        title: "Squad size",
        blocks: [{ list: [`Your squad is ${SQUAD_SIZE} players: ${STARTERS} starters and ${BENCH} on the bench.`, `The ${STARTERS} starters are one player in each position (Top, Jungle, Mid, Bot and Support), a Flex, and a coach.`] }],
      },
      {
        id: "positions",
        title: "Positions",
        blocks: [{ list: ["Your squad needs at least one player for each position. Beyond that, your Flex and bench can be anyone.", "A player counts as the position his team lists him in, even if he plays somewhere else for a game."] }],
      },
      { id: "budget", title: "Budget", blocks: [{ list: [`Your squad must cost no more than ${BUDGET} of game money. In the playoffs you get more.`] }] },
      { id: "per-team", title: "Players per team", blocks: [{ list: [`You can have no more than ${TEAM_CAP} from one LCK team, counting the coach. In the playoffs it's ${KNOCKOUT_TEAM_CAP}.`] }] },
    ],
  },
  {
    group: "Managing your squad",
    items: [
      {
        id: "starters",
        title: "Choosing your starters",
        blocks: [{ list: [`Before each deadline, choose your ${STARTERS} starters on Pick Team. All your points for the week come from them, unless one doesn't play and a bench player comes on.`, "A starter in a position can swap with a bench player of the same position, or with your Flex if the Flex plays that position."] }],
      },
      { id: "flex", title: "The Flex", blocks: [{ list: ["Your sixth starter can be a player from any position, so a second Mid is fine. The coach can't be your Flex."] }] },
      {
        id: "coach",
        title: "The coach 감독",
        blocks: [{ list: ["Your seventh starter is a whole LCK team, shown by its head coach (감독 is Korean for coach). It scores for what the team does, not for its players' points.", "If that team changes head coach during the season, your pick stays and shows the new one."] }],
      },
      {
        id: "captain",
        title: "Captain",
        blocks: [
          {
            captainMark: true,
            list: [
              `Each week, pick one of your ${CAPTAIN_CHOICES} starting players as Captain. His points count ${CAPTAIN_TIMES}. Anything after the point is dropped, so ${CAPTAIN_EXAMPLE} becomes ${captained(CAPTAIN_EXAMPLE)} and ${signed(MINUS_EXAMPLE)} becomes ${signed(captained(MINUS_EXAMPLE))}. The coach can't be Captain.`,
              "There's no vice-captain. If your Captain plays no games that week, nobody gets the extra points, even if a bench player comes on for him.",
              "If you move your Captain to the bench yourself before the deadline, the player who takes his place becomes Captain.",
              "If you sell your Captain, whoever starts in his place once Flol has sorted your squad becomes Captain.",
            ],
          },
        ],
      },
      {
        id: "auto-subs",
        title: "Bench order and automatic substitutions",
        blocks: [
          {
            list: [
              "If a starter plays no games that week, a bench player comes on for him once the week is over.",
              "Your bench players are tried in the order you set. Each one fills the first gap he fits: his own position first, then the Flex.",
              "A bench player who also played no games is skipped.",
              "Nobody comes on for your coach. If that team doesn't play that week, it scores 0.",
            ],
          },
          { ex: "Say your Top laner doesn't play. Your first bench player is a Support and your second a Top laner, so your second one comes on." },
        ],
      },
    ],
  },
  {
    group: "Transfers",
    items: [
      {
        id: "transfers",
        title: "Transfer rules",
        blocks: [
          {
            facts: [
              ["Before a split starts", "Free and unlimited"],
              ["Its second week", plural(FREE_AFTER_UNLIMITED, "free transfer")],
              ["Every week after", `${plural(FREE_PER_WEEK, "free transfer")}; unused ones carry over, up to ${BANK_CAP}`],
              ["Each extra transfer", `${MINUS}${HIT_POINTS} points off that week's score`],
              ["Playoffs", "Unlimited, never cost points"],
            ],
          },
          { list: ["You can swap a player for one in another position, as long as you still have one in every position. A coach can only be swapped for another coach."] },
        ],
      },
      {
        id: "undo",
        title: "Undoing transfers",
        blocks: [{ list: ["Each time you confirm transfers, you can undo that whole batch until the deadline, latest first. Your old players come back at their old prices, and any free transfers and points it used are given back.", "Selling a player and buying him back before the deadline costs nothing."] }],
      },
      {
        id: "between-splits",
        title: "Between the splits",
        blocks: [
          {
            list: [
              "Once Split 1 ends, transfers are locked until 2 weeks before Split 2's first deadline. Then they're free and unlimited.",
              "Each split starts with new prices. Your squad is priced at them, so your bank can go below zero. Your squad must be back within budget, and back to the limit per team, by the deadline.",
              "If it isn't, Flol fixes it for you at no points cost, selling your most expensive extra players and buying the cheapest who fit.",
            ],
          },
        ],
      },
      {
        id: PRICES_RULE,
        title: "Player prices",
        blocks: [
          {
            list: [
              "Every player and coach has a price. Prices change once a week, at the deadline.",
              "Scoring well lately is what mostly pushes a price up, and scoring badly pulls it down.",
              "If lots of people playing Flol buy a player, his price goes up a little; if lots sell, it goes down a little.",
              "A player hardly anyone picks slowly gets cheaper. No price drops below a set minimum.",
              "When you sell a player, you get his full current price.",
            ],
          },
          { ex: "Say Faker, T1's star Mid, scored 22 in Week 2, more than any other Mid, and lots of people bought him. At the Week 3 deadline his price went up ₩0.5m, from ₩15.0m to ₩15.5m." },
          { link: "priceChanges" },
        ],
      },
    ],
  },
  {
    group: "Buffs",
    items: [
      {
        id: "buffs",
        title: "The buffs",
        blocks: [
          { table: "buffs" },
          {
            list: [
              "You get one of each per split. One you haven't played when the split ends is lost.",
              "You can play only one in any week, in any stage, playoffs included.",
              "Play them on Pick Team. They count once you save, and you can cancel one until the deadline.",
              "Under Double Captain, either Captain playing no games just scores nothing; nobody steps in.",
            ],
          },
        ],
      },
    ],
  },
  {
    group: "Deadlines",
    items: [
      {
        id: "deadlines",
        title: "Deadlines",
        blocks: [{ list: ["Every change to your team (starters, Captain, bench order, transfers and buffs) must be saved by the week's deadline to count that week.", DEADLINE_RULE] }, { table: "deadlines" }],
      },
    ],
  },
  {
    group: "Scoring",
    items: [
      { id: SCORING_RULE, title: "How players score", blocks: [{ notes: "players" }, { table: "players" }] },
      { id: "coach-scoring", title: "How the coach scores", blocks: [{ table: "coach" }, { notes: "coach" }] },
      {
        id: "live",
        title: "Live and final points",
        blocks: [{ list: ["Points go up live while a game is played, for the things the live feed shows: kills, deaths, assists, gold and more. They're marked Live until confirmed.", "A series' points are final about 3 hours after it ends, and the league tables move then.", "If the live feed is down, there are no live points, but final points still arrive."] }],
      },
    ],
  },
  {
    group: "Leagues",
    items: [
      {
        id: "leagues",
        title: "Leagues you're in",
        blocks: [{ list: ["When you join, you're put in three leagues: Overall, which is everyone; one for the country you picked when you signed up; and one for fans of your favourite LCK team.", "You can change your favourite team or country until your first week's deadline."] }],
      },
      {
        id: "tables",
        title: "Tables and splits",
        blocks: [{ list: ["Every league is ranked on total points, with a table for the whole season and one for each split.", "In Split 2, Overall is cut in two. The top half from Split 1 go into Legend and the rest into Rise, and everyone keeps their points. If you join in Split 2, you start in Rise."] }],
      },
      {
        id: "private",
        title: "Private leagues",
        blocks: [{ list: ["Anyone can start a private league and invite friends with a code or link. You can be in up to 25, and there's no limit on how many people join one.", "When you make a league, choose the week it starts counting from: this week or a later one.", "The person who made it can rename it, remove someone or delete it. Anyone else can leave."] }],
      },
      { id: "ties", title: "Ties", blocks: [{ list: ["If two people have the same points, the one who made fewer transfers goes ahead."] }] },
      {
        id: "ranks",
        title: "Ranks",
        blocks: [
          {
            list: [
              "Your place in Overall is shown as a League of Legends rank, from Iron at the bottom to Challenger at the top. Only Overall has ranks.",
              "Everyone is Unranked until the first week's points are final. After that, your rank can change whenever a series is confirmed.",
              "Iron to Diamond each have four steps, IV up to I, and I is the best, as in League.",
            ],
          },
          { table: "tiers" },
        ],
      },
    ],
  },
];
