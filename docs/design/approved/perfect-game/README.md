# Perfect game

The gameweek's best team: the 7 starter slots, one of them the Carry, under the team cap (spec/12). Reached from **Highest ›** on Points and from **Star and flop** on Home. Drawn at 1440 in the shared frame.

**Approved:** Craig, 15 Nov 2026: "Yes, save". Before that he settled three things: the view is the one saved on Points ("we use that preference here"), your own players are marked, and both links (Points and Home). Names, teams and numbers are a made-up LCK Cup Week 3, final, that agree with Points; they are not roster data. Redrawn to [plate.md](../../plate.md) on 15 Nov 2026; this binds layout, content and order, and plate.md how it is drawn. The source is [docs/design/proposals/2026-11-16-perfect-game/](../../proposals/2026-11-16-perfect-game/) (`perfect.html`, `brief.md`).

| File | Shows |
|---|---|
| `1440.png`, `perfect.html#rift` | Rift view: the seven on the Rift, Faker as Carry and tapped |
| `1440-card.png`, `perfect.html#card` | Card view: the seven as the broadcast lineup, Faker as Carry |

## Changed by Craig, 16 Nov 2026

After using the built page; these override the picture.

- The Rift is square, as Points, 720 a side, centred in the main column, and the map redrawn for it: lanes, river, bases, towers and pits (`measure.rift`).
- Each starter in his place: top in top lane, jungle in the jungle, mid in mid lane, Bot over Support (Craig, 16 Nov 2026) together in bot lane, Coach and Flex by the blue base.
- Tiles as FPL's: the shirt on a faint lighter card, C or V at its top right and a news flag `!` at its top left, a white name plate, then a dark band (fixtures, or points and series). No role icon on a tile: his place on the Rift says it; the Flex's and Coach's place is a label over the shirt (`FLEX`, `Coach 감독`), and nothing goes under a Flex's tile: no `Flex · plays Top`, no `Not starting` tag (his flag `!` stays at the shirt's corner, the words in his card). No team crests on the tiles.
- Nothing said twice: the week's series carry no Final note; the Carry's games say `T1 · Mid`, his C and his sum's label already name him.

- No `Cap 2` (Craig, 16 Nov 2026): the cap is the same every week. The head's tag is `Final`, or `Not final` while the week isn't.

## Borrowed

- **FPL's Team of the Week**: the team, its total, the gameweek arrows.
- **Points' Rift view and Card view**: each starter in his lane, Coach and Flex in the base, C on the Carry.
- **LCK All-Pro teams**: one player per role.

## Layout

- **Header:** Perfect game and hangul; ‹ week ›; the total, Not final while not final; Average, Highest, Your points ›.
- **Left:** Rift view | Card view (Card view is the broadcast lineup, no bench: redrawn 15 Nov 2026 from a table); each player's points and series; C on the Carry, his points the result only (Craig, 16 Nov 2026, on Points); the dot after each player you own; Flex shows the role it plays; Coach 감독.
- **Right:** the tapped player's games, the week's series, the sponsor slot.

## Controls

- **Rift view | Card view**: the view saved on Points; switching here saves it there too.
- **A player**: opens his games on the right; ✕ closes. **Full stats ›**: the player card.
- **‹ ›**: the week before or after; no › past the current week.
- **Your points ›**: Points.

## Placeholders

| Placeholder | Data |
|---|---|
| Week points, Carry ×1.5 | #36, #33 |
| Picking the best team under the cap | no issue yet |
| Sponsor | made up |
