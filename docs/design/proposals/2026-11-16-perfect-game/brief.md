# Perfect game: brief

**The screen.** The gameweek's best team, a Carry and 7 starters, picked under the squad rules, such as the team cap (spec/12 lines 44–45; SPEC glossary line 97). FPL's equivalent is Team of the Week, once called Dream Team. Craig, 13 Nov 2026: "Perfect game. Carry and 7 starters", "Perfect game includes the rules such as 2 per team" (docs/decisions.md line 204).

**How a manager reaches it.** No spec line says. See Q1.

## Jobs

- See the week's best team (spec/12 line 44).
- See its Carry (SPEC glossary line 97), scoring ×1.5, rounded down (spec/05 lines 68–70).
- See it in the squad's shape: top, jungle, mid, bot, support, a flex of any role and the coach (spec/01 lines 9–13). The flex is never the coach (spec/01 line 12); the Carry is never the coach (spec/04 lines 14–15).
- See that it keeps the team cap, the coach counting (spec/12 line 45; spec/01 line 43). The cap is the stage's: 2 in the regular season, 3 in knockouts (spec/10 lines 42–44).

## Data

| Fact | Spec line | Issue |
|---|---|---|
| Each player's and coach's week points | spec/05 lines 20, 30–63 | #36, #30 (closed) |
| Every series in a knockout week counts | spec/10 lines 49–50 | #36 |
| Final points, when every series is final | spec/11 lines 23–26 | #33 |
| Carry ×1.5, rounded down; the multiplier is data | spec/05 lines 68–70 | #19 (closed) |
| Slots, flex, team cap with the coach | spec/01 lines 9–15, 43 | #13 (closed) |
| The cap per stage | spec/10 lines 18–23, 42 | spec/10; data per competition |
| Academy players eligible when subbed in | spec/01 lines 49–53 | #36 |

There is no issue for picking the Perfect game, nor for the page.

## The moment

Week 3 of the made-up LCK Cup, final, seen at the hub's moment: Week 4, Tuesday 22:00 London. Groups stage, so the cap is 2.

Numbers must agree with the approved pictures. Points (Saturday) gives Zeus 14, Canyon 14, Ruler 14, Delight 9, and Faker 17 before the ×1.5 with game 2 still live; the Killer, Chovy, 15, is the top scorer Baron Steal FC didn't own. Highest was 131 on Saturday. Sunday's KRX v BRO and BFX v DNS are free to fill. T1 won 2–0 v DK (hub Results).

Draw a Rift view and a Card view, as Points.

## References to borrow

- **FPL's Team of the Week**: the XI on the pitch, its total, Player of the Week, the gameweek arrows; the Points view's Pitch and List toggle.
- **Points' Rift view** (approved points): each starter in his lane, Coach and Flex in the base, C on the Carry.
- **LTA Fantasy**: the Dream Team of the Week on Home.
- **LCK All-Pro teams**: one player per role, the way fans already rank a split.

Full notes: [references.md](references.md).

## Not settled by the spec

Each is a question for Craig. The recommendation is FPL's way, or its logic.

1. **Where is it reached?** Example: a link on Points by Highest ›, on Home by star and flop, in Stats, or in the top bar. FPL's Status page, its home, shows it beside Player Availability (docs/research/home-page-references.md). Recommend: a link on Points and on Home, not the top bar.
2. **Is it 7 people, or 8?** "A Carry and 7 starters" could mean the 7 starters with one as Carry, or 7 plus a Carry. spec/01 has 7 starters. Recommend: the 7 starter slots, one of the six players marked Carry.
3. **Does the Carry's ×1.5 count in its total?** Example: Faker 17 shows as 25. FPL's Team of the Week has no captain: its total is the plain sum, so the top manager often beats it (GW2 2026/27: 161 against 143). Recommend: yes, ×1.5, since Craig named a Carry.
4. **Which player is the Carry?** Example: the top-scoring player, never the coach. Recommend: the top scorer, as FPL's Player of the Week. Show no separate Player of the week.
5. **Does the budget apply?** Example: Faker 18.5억, Chovy, Zeus and Canyon may total over ₩100억. FPL's ignores price, and ignores its own 3-per-club rule (GW7 2026/27 has 4 from one club). Craig kept the cap. Recommend: cap yes, budget no.
6. **Best means the top total?** Example: cap 2, T1's Faker 17, Keria 14 and kkOma 13 (made up beyond Points); the best total may leave out a high scorer elsewhere. Recommend: the highest total under the rules, Carry included, not the top scorer per slot.
7. **Ties.** Example: two supports on 11. FPL publishes no tie-break; UEFA's older Team of the Week used fewer minutes, then season points, then lower price. Recommend: fewer games played, then lower price.
8. **A bench?** FPL shows the XI only. Recommend: no bench.
9. **When does it show?** Example: building live on Saturday, or only once every series is final. Whether FPL's fills during the gameweek is **Unverified**. Recommend: provisional during the week with a Not final tag, as Points.
10. **Past weeks.** Recommend: ‹ week › arrows as on Points; no › past the current week.
11. **Ownership on each player?** Example: Faker, owned by 46%. FPL's shows points only. Recommend: points only.
12. **"In the Perfect game" counts.** FPL's player card has "Times in Dream Team". Recommend: not now; it would be a new line on the player card.
