# Scoring

Craig's answers only, from chat on 26–29 Oct and 11–13 Nov 2026 and the `/grill` of 12 Nov 2026.
Where this file is silent the rule is FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base
assumption). Open questions are in [docs/to-grill.md](../docs/to-grill.md).

## The philosophy

- Points are whole numbers, never decimals.
- Point values stay low, like FPL's.
- Scoring is about even for quick and long games. Cumulative scoring, as other LoL fantasy games
  use, makes long games good; this game must not, so raw kill totals are out.
- Every role is worth picking. One team may have five players in the top 20; a whole team in the
  top 10 is a problem, unless one team dominated the year, as Gen.G did in 2025 (Craig, 12 Nov
  2026).

## How it works

- Scoring is a set of toggles, each with weights by role. The toggles and their values are data.
- Points work per series: a series scores a player's best 2 games (Craig, 11 Nov 2026).
- Every table is backtested on LCK data before it is used.

## The player table

Per game. Every value below is data, held per competition. "Per 2" and the like round down, as
whole numbers must. Kills and deaths go by the role played in the game, not the listed one: a
support playing top dies per 3 (Craig, 14 Nov 2026). First blood is the killer's only, not the
assists' (Craig, 14 Nov 2026).

| Line | Points |
|---|---|
| Kills | +1 per 2 kills for tops and supports, +1 per 3 for junglers, mids and bots; at most +3 |
| Assists | +1 per 5; at most +3 |
| Deaths | −1 per 3 deaths, −1 per 4 for supports; at most −3 |
| Gold lead at 15 minutes | +1 if ahead of the lane opponent; level scores 0 |
| Solo kill | +1 each: a kill with no assist |
| First blood | +1, the killer only |
| Deathless game | +1 |
| Multikill | quadra +1, penta +2, the biggest only; a triple scores 0 |
| Steal | +1 per objective stolen, any monster |

- Example: a mid who goes 7/2/11 with a gold lead at 15, and no solo kill, first blood,
  multikill or steal, scores 2 (kills) + 2 (assists) + 0 (deaths) + 1 (gold) = 5.
- No points for a win, no role quests, no CS line (too linked to gold), no vision line, and no
  quick-win point for players (Craig, 12 Nov 2026).
- No points for playing (Craig, 13 Nov 2026).

## The coach

The coach is the team ([spec/01](01-squad-and-slots.md)). Per game:

| Line | Points |
|---|---|
| First tower | +1 |
| Most drakes | +1 |
| Most barons | +1 |
| Most elders | +1 |
| Quick win | +1: a game won in under 25 minutes |

- "Most" means more than the opponent; on a tie nobody scores (Craig, 13 Nov 2026).
- A series scores the coach's best 2 games, plus +3 if the team wins the series and −1 if it
  loses (Craig, 13 Nov 2026). No point for a game won (Craig, 13 Nov 2026). So a coach can go
  below 0.
- A coach scores a little under the lowest role (Craig, 12 Nov 2026).

## The Captain

- The Captain's points are multiplied by 1.5 and rounded down: a 9 becomes 13
  ([spec/04](04-captain.md)). The multiplier is data.
- A minus rounds towards zero: a −3 becomes −4, not −5 (Craig, 14 Nov 2026).
