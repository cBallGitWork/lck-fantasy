# Price changes: brief

**The screen.** Price changes: the week's rises and falls, past moves only, no prediction (spec/12, The pages). How a manager reaches it is not settled: the approved top bar (Home, Pick Team, Transfers, Points, Leagues, Stats, LCK, Live) has no slot for it. See question 1.

## Jobs

1. See which players and coaches rose and which fell at the last deadline (spec/12: "the week's rises and falls").
2. See by how much, in 억. Example: Faker ▲ ₩0.5억 (spec/12, Pick Team and Transfers; spec/02, Money).
3. Find out how prices move: the formula is public, on a help page (spec/02, Price moves).

No predictions, no "likely to rise" (spec/12; SPEC.md, Out of scope: a price predictor).

## Data

| Fact | Spec line | Placeholder |
|---|---|---|
| Prices move once a week, at the deadline | spec/02, Price moves; spec/11 (prices only at the deadline) | #23 |
| A move is mostly on points, a little on transfers, down when few own him | spec/02, Price moves | #23 |
| No price falls below a floor; steps, weights and floor are data | spec/02, Price moves | #23 |
| The coach moves by the same rule, on its own score | spec/02, Price moves | #23 |
| Money in 억, with the note "1억 = 100 million won, game money only" | spec/02, Money | #22 |
| ▲ or ▼ for the last move; nothing before a first move | spec/12, Pick Team and Transfers | #23 |
| Ownership, points, team, role | spec/12, The player card | #36 |
| Sponsor banner and "All sponsors are made up." | spec/13, Fake ads | spec/13, no issue |

## The moment

The Transfers picture's: LCK Cup Week 4, Tuesday 22:00 London, before the Wed 16:45 KST deadline. The moves shown are those made at the Week 3 deadline, the last one. They match the Transfers list's arrows and the player card:

- Rises: Faker T1 18.0 → 18.5 (▲0.5, as the player card's History); Chovy GEN 17.5; Kingen NS 6.5; Lucid DK 9.0; Hype KRX 5.5.
- Falls: Aiming DK 11.5; DuDu DNS 6.0; Clear BFX 5.5.
- Prices are from `approved/transfers/transfers.html`. Amounts other than Faker's are for the drawing to pick.

## References to borrow

- **Transfers** (approved): its price column and ▲/▼ arrows; role icons; the team chip.
- **Player card** (approved): the meta line's "18.5억 ▲0.5"; a row opens the card.
- **LCK hub** (approved): one week at a time with ‹ › arrows.
- **fpl.page Price Change History**: grouped by date, newest first, each date split into Price rises and Price falls.
- **Korean markets**: red for a rise, blue for a fall, the reverse of the West.
- Full notes: [references.md](references.md).

## Not settled by the spec

Each needs Craig's answer before the drawing binds it.

1. **How is it reached?** FPL puts Price Changes in its main nav. Flol's approved bar has no slot. Recommend: a **Price changes ›** link on Stats and beside the price column on Transfers, and no new nav item.
2. **One week, or every week?** FPL's history lists past days newest first. Recommend: the last deadline's moves, with ‹ Week 3 › arrows back to earlier weeks, as the LCK hub.
3. **Two lists or one?** fpl.page splits each date into rises and falls; FPL's own page filters Rise / Drop. Recommend: two columns side by side, Rises left, Falls right.
4. **Which columns?** Example: Chovy · GEN · Mid · 17.5억 · ▲0.5 · owned 41% (the Transfers picture's figures; the step is the drawing's). Recommend: player, team, role, new price, move, owned. Leave out the points behind the move, since the formula sits on Help.
5. **Is the coach listed?** The coach moves by the same rule (spec/02). Recommend: yes, with the coach icon, and Coach in the role filter.
6. **Filters?** FPL filters by position and team. Recommend: role and team filters, and none for owned players.
7. **Mark the manager's own players?** FPL's predictor filters by "your team"; fpl.page has My Team. Recommend: a dot by players in your squad, no filter. Signed out, no dot.
8. **Public or signed in?** FPL's price page loads signed out. Recommend: public, as FPL.
9. **Rising red or green?** Korean markets show a rise in red, a fall in blue. Flol's arrows are drawn in ink and grey so far, and there is no plate.md yet. Recommend: ask Craig; red up, blue down fits the Korean theme but may read wrong to Western managers.
10. **Before the first move?** Week 1, before any deadline, nothing has moved. Recommend: the empty lists with one line, "No moves yet · first at the Week 1 deadline", and no explainer.
11. **Show when the next move is?** Not a prediction, only the time. FPL shows a countdown. Recommend: "Next move: Week 4 deadline, Wed 07:45 · 16:45 KST", as the deadline card on Home.
12. **Sort order inside a list?** fpl.page sorts by name. Recommend: biggest move first, then by owned.
13. **A season view, risers since Week 1?** Not in the spec. Recommend: leave out of the beta; ask Craig before adding.
