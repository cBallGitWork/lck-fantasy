# Squad and slots

Craig's answers only, from the `/grill` of 11 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

## The squad

- A squad is 9: seven starters and a bench of two.
- The seven starters are one per role (top, jungle, mid, bot, support), a flex player and the
  coach. All seven score each gameweek.
- The flex slot holds a player of any role, never the coach. Example: Gumayusi at bot and Ruler
  in flex.
- The bench is two players of any roles, ordered 1 and 2, as in FPL.
- On Pick Team, tap a player, then one of those lit up, to swap them, as in FPL. A role starter
  swaps with a bench player or the Flex of his role. Example: Zeus at top and a top laner in flex
  trade places (Craig, 16 Nov 2026).
- There is no bench coach.
- The sizes are data per competition, like every value Craig may tune ([CLAUDE.md](../CLAUDE.md)).

## Roles

- A player's slot follows his listed role on his team's roster, not the role he plays on the day.
  Example: a mid stand-in who jungles one game still fills a mid slot.

## Auto-subs

FPL's rule, with role in place of formation:

- A starter who plays no game in the gameweek is replaced by a bench player, in bench order.
- A bench player comes on only into his own role or the flex slot. Example: your top laner sits
  out; bench 1 is a support, bench 2 a top laner, so bench 2 comes on.
- If the flex starter is out, the first bench player who played comes on into the flex, whatever
  his role.
- Each bench player, in bench order, takes the first open slot he fits: his own role before the
  flex. Example: your mid and flex are out and both bench players are mids, so bench 1 goes to mid
  and bench 2 to flex.
- A bench player who also played no game is skipped, and the next one is tried.

## The coach

- The coach slot is the team. It scores the team's play (wins, towers, drakes and the like),
  never its players' points. The head coach is only its face and name. What it scores and how
  much is settled by the scoring grill ([spec/05](05-scoring.md)).
- A team with no series in the gameweek scores 0 in the coach slot.
- The coach counts toward the cap on players from one team ([spec/10](10-season-and-gameweeks.md)
  makes the cap's value a stage setting). Example: with a cap of 2, T1's coach and Faker fill T1.
- If a team changes head coach mid-season, the pick stays and shows the new coach.

## Academy players

- Each team's academy (LCK CL) players are in the pool from the start, like FPL's reserves
  (Craig, 15 Nov 2026). They score when subbed into an LCK game ("in the pool as they get
  subbed in"). They are priced like any player.
- They count toward the cap as their LCK team. Example: with a cap of 2, Faker and T1's academy
  mid fill T1.
- There is no academy coach: the coach slot is the team.
