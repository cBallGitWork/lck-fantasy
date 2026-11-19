// Help's guide: the intro, the pages the Help menu steps through, and the glossary (spec/12, Help).
import { BUFFS, CAPTAIN_MULTIPLIER, captained, HIT_POINTS, TEAM_CAP, TEAMS } from "../../fixtures/competition";
import { plural } from "../../parts";
import { BANK_CAP, BENCH, BUDGET, FREE_PER_WEEK, KNOCKOUT_TEAM_CAP, SQUAD_SIZE, STARTERS } from "./facts";
import { CAPTAIN_EXAMPLE, CAPTAIN_TIMES, DEADLINE_RULE, FINAL_AFTER, orList, type Item } from "./words";

export const INTRO = {
  big: "Flol is a free fantasy game where you pick real LCK players, from Korea's League of Legends league, and score points from how they play in their actual games.",
  rest: "You start by building a squad, choosing your starters, picking a Captain each week, and then managing your team across the whole season. You play against everyone else on Flol, and you can make leagues to take on your friends.",
};

const TEAM_COUNT = Object.keys(TEAMS).length;
/** The made-up week a hit is shown on. */
const HIT_EXAMPLE_WEEK = 48;

/** The guide, one page at a time, in the Help menu's order. */
export const GUIDE: readonly Item[] = [
  {
    id: "in-60",
    title: "Flol in 60 seconds",
    blocks: [
      {
        facts: [
          ["Squad", `${SQUAD_SIZE}`, "real LCK players"],
          ["Starters", `${STARTERS}`, "one in each position, a Flex, and a whole LCK team as your coach"],
          ["Bench", `${BENCH}`, "come on if a starter doesn't play"],
          ["Budget", BUDGET, "game money, not real money"],
          ["Captain", `×${CAPTAIN_MULTIPLIER}`, `his points count ${CAPTAIN_TIMES}`],
          ["Buffs", `${BUFFS.length}`, "one-offs you play, one a week at most"],
        ],
      },
      { p: "Your players score for what they do in real games, such as kills, assists and staying alive. Transfers let you swap players as the season goes on. The aim is the most points over the season: climb the rankings and beat your friends in leagues." },
    ],
  },
  {
    id: "weeks",
    title: "How a week works",
    blocks: [
      { p: "A Flol week is one LCK week. Week 1, Week 2 and so on." },
      {
        facts: [
          ["Days", "Usually Wednesday to Sunday"],
          ["Series", `Each of the ${TEAM_COUNT} teams plays two, at about 17:00 and 19:30 Korea time. A series is two teams playing best of 3 games, or best of 5 in the playoffs.`],
          ["Deadline", `${DEADLINE_RULE} Save your changes by then. Home shows it in your own time.`],
          ["Points", `Go up live during the games, and are final ${FINAL_AFTER} each series`],
        ],
      },
      { p: "In the playoffs, a team might play no series in a week, or several." },
    ],
  },
  {
    id: "build-squad",
    step: 1,
    title: "Build your squad",
    blocks: [
      { p: `Pick ${SQUAD_SIZE} players on Pick Team, spending no more than ${BUDGET}. You need at least one player in each of the five positions, and no more than ${TEAM_CAP} from one LCK team. You'll be asked to sign up when you save.` },
      { p: "A good first squad usually has:" },
      {
        list: [
          "Players who start every series for their team.",
          "Good players in every position, not just Mids and Bots. Tops and Supports need fewer kills to score, so they can keep up.",
          "A team in your coach slot that wins a lot, since winning a series scores well.",
          `Cheaper players on your bench, so more of your money goes on the ${STARTERS} who score.`,
          "One or two players who score well week after week, to captain.",
        ],
      },
    ],
  },
  {
    id: "pick-starters",
    step: 2,
    title: "Pick your starters",
    blocks: [
      { p: `Each week you choose ${STARTERS} starters from your ${SQUAD_SIZE} on Pick Team. To swap two players, tap one, then tap one of the players that lights up. Press Save team when you're done; nothing changes until you do.` },
      { p: `Your ${BENCH} bench players sit in an order you choose. If a starter plays no games that week, your first bench player comes on for him if he fits, then your second.` },
      { p: "When picking your starters, ask:" },
      { list: ["Who is sure to start for his team?", "Whose team has an easy week, or two series instead of one?", "Is your bench in the right order?"] },
    ],
  },
  {
    id: "choose-captain",
    step: 3,
    title: "Choose your Captain",
    blocks: [
      { p: `Your Captain is your biggest call each week, because his points count ${CAPTAIN_TIMES}. Tap a starter on Pick Team, press Make Captain, then save.` },
      { p: "Pick someone who is very likely to play and who usually scores well. There's no vice-captain, so if your Captain plays no games that week, nobody gets the extra points." },
      { ex: `Say you captain Chovy and he scores ${CAPTAIN_EXAMPLE}. He gives you ${captained(CAPTAIN_EXAMPLE)}: ${CAPTAIN_EXAMPLE} × ${CAPTAIN_MULTIPLIER} is ${CAPTAIN_EXAMPLE * CAPTAIN_MULTIPLIER}, and anything after the point is dropped.` },
    ],
  },
  {
    id: "points-scored",
    step: 4,
    title: "Understand how points are scored",
    blocks: [
      { p: "Players score in every game of a series, and their best games count. The main ways to score are:" },
      { list: ["Kills and assists", "Not dying, or dying little", "Having more gold than the player opposite early in the game", "Solo kills, first blood, multikills and stealing monsters"] },
      { p: "Your coach slot scores for what the whole team does: the first tower, killing more dragons and barons than the other team, quick wins, and winning the series. A team can lose points for losing a series." },
      { link: "fullScoring" },
    ],
  },
  {
    id: "make-transfers",
    step: 5,
    title: "Make transfers to improve your squad",
    blocks: [
      { p: "Transfers let you change your squad during the season, on Transfers. Use them to:" },
      { list: ["Replace a player who has lost his place to a stand-in.", "Bring in players in good form, or whose teams have an easy week.", "Move money between positions."] },
      { p: `You get ${plural(FREE_PER_WEEK, "free transfer")} a week. Each extra one takes ${HIT_POINTS} points off that week's score, often called a hit. If you don't use your free transfer, it carries over, and you can save up to ${BANK_CAP}.` },
      { ex: `Say you have ${plural(FREE_PER_WEEK, "free transfer")} and make ${FREE_PER_WEEK + 1}. The extra one costs ${HIT_POINTS}, so a week of ${HIT_EXAMPLE_WEEK} points counts as ${HIT_EXAMPLE_WEEK - HIT_POINTS}.` },
    ],
  },
  {
    id: "using-buffs",
    step: 6,
    title: "Use buffs at the right time",
    blocks: [
      { p: "Buffs are for big weeks. You get each one once a split, and can play only one in any week." },
      { table: "buffs" },
      { p: "Play them on Pick Team; you can cancel one until the deadline." },
    ],
  },
  {
    id: "join-leagues",
    step: 7,
    title: "Join leagues and take on your friends",
    blocks: [
      { p: "You're put in three leagues when you join: Overall, your country, and fans of your favourite LCK team." },
      { p: "To play your friends, go to Leagues and press Create a league, then send them its code or link. If a friend sends you a code, press Join a league on Leagues and enter it." },
    ],
  },
  {
    id: "weekly-checklist",
    title: "Your weekly checklist",
    blocks: [
      { p: "Before each deadline, check:" },
      {
        check: true,
        list: [
          `Have you picked your ${STARTERS} starters?`,
          "Have you picked your Captain?",
          "Is your bench in the right order?",
          "Is any of your players not starting, or is his team not playing?",
          "Do you need a transfer?",
          "Do you want to play a buff?",
        ],
      },
    ],
  },
  { id: "glossary", title: "Flol glossary", blocks: [{ table: "glossary" }] },
];

/** The glossary, in groups. */
export const GLOSSARY: readonly { group: string; terms: readonly (readonly [string, string])[] }[] = [
  {
    group: "The week",
    terms: [
      ["Week", "One LCK week, usually Wednesday to Sunday. Most teams play two series in it, and your players score for what they do in them."],
      ["Deadline", `${DEADLINE_RULE} Make your changes before it.`],
      ["Series", "Two LCK teams playing best of 3 or best of 5 games."],
      ["Split", "Half of the LCK season. Buffs reset each split."],
      ["Playoffs", `The knockout end of a split, with unlimited transfers and up to ${KNOCKOUT_TEAM_CAP} players from one team.`],
    ],
  },
  {
    group: "Your squad",
    terms: [
      ["Squad", `Your ${SQUAD_SIZE} players.`],
      ["Starters", `The ${STARTERS} who score for you this week.`],
      ["Bench", `Your other ${BENCH}, who come on if a starter doesn't play.`],
      ["Positions", "Top, Jungle, Mid, Bot and Support: the five places in a League of Legends team."],
      ["Flex", "A starter from any position."],
      ["Coach 감독", "Your starter that is a whole LCK team, shown by its head coach."],
      ["Captain", `The player whose points count ${CAPTAIN_TIMES}.`],
      ["Transfer", "Selling one player and buying another."],
      ["Free transfer", "A transfer that costs no points."],
      ["Hit", `The ${HIT_POINTS} points taken off for each extra transfer.`],
      ["Buff", `A one-off you play in a week: ${orList(BUFFS)}.`],
    ],
  },
  {
    group: "In a game",
    terms: [
      ["Kill, assist, death", "Killing an enemy, helping a teammate kill one, and being killed."],
      ["Solo kill", "A kill with no help from a teammate."],
      ["First blood", "The first kill of a game."],
      ["Multikill", "A quadra (four kills close together) or a penta (five)."],
      ["Gold lead", "Having more gold early in the game than the player in the same position on the other team."],
      ["Tower", "A defensive building. A team destroys towers on the way to winning."],
      ["Dragon, baron, elder dragon", "Big monsters the two teams fight over for boosts."],
      ["Steal", "Killing a monster the other team was fighting."],
      ["Stand-in", "A player who plays in place of a team's usual starter."],
    ],
  },
  {
    group: "Prices and leagues",
    terms: [
      ["Price change", "When a player's price goes up or down, once a week at the deadline."],
      ["Overall", "The league with everyone in it."],
      ["Legend and Rise", "The top and bottom halves of Overall in Split 2."],
      ["Tier", "Your place in Overall, shown as a League of Legends tier from Iron to Challenger."],
    ],
  },
];
