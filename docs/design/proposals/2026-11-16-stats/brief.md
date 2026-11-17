# Stats: brief

**The screen.** Stats: every stat Flol holds, the scoring lines first (spec/12, The pages: "Whatever stats we have with scoring a priority", Craig, 13 Nov 2026). FPL's Statistics page is the model (SPEC.md, the base assumption). Reached from **Stats** in the top bar; a name in its list opens the [player card](../../approved/player-card/) or [coach card](../../approved/coach-card/) (player-card README: the card opens from Stats).

**Jobs**

1. Find players by what they score: sort by any scoring line (spec/12 Stats; lines in spec/05, The player table).
2. Weigh price against points before a transfer: price and last move, form, season total, owned (spec/12 The player card, Header; spec/12 Pick Team and Transfers, ▲ ▼).
3. Look at coaches by their own lines (spec/05, The coach; spec/12 Coach pop-up).
4. Open a player's or coach's card (player-card README).

**Data**

| Fact | Spec line | Placeholder issue |
|---|---|---|
| Player lines: kills, assists, deaths, gold lead at 15, solo kill, first blood, deathless, multikill, steal | spec/05 The player table | #36 (stats), #30 closed (scoring) |
| Coach lines: first tower, most drakes, barons, elders, quick win, series won, series lost | spec/05 The coach | #36 |
| Price in 억 and last move ▲ ▼ | spec/02 Money, Price moves; spec/12 Pick Team and Transfers | #22 closed, #23 |
| Form: average of the last 4 gameweeks | spec/12 The player card, Header | #36 |
| Season total, with rank in role | spec/12 Header ("2nd of 10 mids") | #36 |
| Owned by % | spec/12 Header | #36 |
| Transfers in and out this gameweek | spec/12 Header | #20 closed |
| Role by listed roster, not the day's | spec/01 Roles | #13 closed |
| Academy (LCK CL) players in the pool | spec/01 Academy players | #36 |
| Provisional points while live, final 3 hours after | spec/11 | #34, #33 |

There is no issue for the Stats page itself yet.

**Moment.** The Pick Team and Transfers pictures': LCK Cup Week 4, Tuesday 22:00 London, before the deadline, Weeks 1 to 3 final. Reuse their numbers: Faker T1 ₩18.5억 ▲0.5, form 19.3, 46% owned, 58 points, 2nd of 10 mids; Chovy GEN ₩17.5억 ▲, 61 points, 41% owned; Keria T1 ₩12.0억, 52, 47%. The coach card's kkOma, form 9.0.

**References.** FPL's Statistics: one list, a View filter (all, position, club), a Sorted by menu over 40 stats, Max cost, a caption saying what the sorted stat means. gol.gg's player table: role filter, one row per player, every stat a column. The Transfers picture's list: role, name, team, price, points, owned, ▲ ▼. Full notes: [references.md](references.md).

## Not settled by the spec

Each needs Craig's answer before the picture binds it. The recommendation is FPL's way, never a rule.

1. **One list or two?** Players and coaches score different lines. Example: kills means nothing for kkOma. Recommend: one page, a Players | Coaches switch, as FPL's View splits by position; each list shows only its own lines.
2. **Which columns show at once?** Example: Faker's row with all nine lines, or price, form, owned, points plus one sorted line. Recommend: FPL's way, the fixed few (price, form, owned, points) plus the sorted stat, so it reads at a glance.
3. **Points from a line, or the raw count?** Example: kills as 14 kills, or as +5 points. Flol also holds raw K/D/A, which the player card shows. Recommend: points per line, as the card's Season panel does, with raw K/D/A as sort options too.
4. **Totals or per game?** Example: Faker 58 points over 18 games, or 3.2 a game. Recommend: totals by default, with a Per game toggle, as the card shows both.
5. **Which filters?** Example: role, team, max price. Recommend: FPL's three: View (all, a role, a team), Sorted by, Max price; plus name search.
6. **Which time span?** Example: the season, Split 1, one gameweek, or last 4. Recommend: season by default, with a gameweek choice, as FPL's GW points sort; split tables already exist in spec/08.
7. **Academy players in the list?** Example: T1's academy mid with 0 games. Recommend: listed, as FPL lists players with 0 minutes, sorted last by points.
8. **Live points in the list?** Example: during T1 v DK, does Faker's total move? Recommend: final points only, since ranks and prices wait for final (spec/11); the card keeps live.
9. **Your own players marked?** Example: a dot by Faker if he is in your squad. Recommend: yes, as the coach card's Roster marks yours; FPL's list does not, so ask.
10. **Signed out?** Example: a visitor opens Stats with no account. Recommend: public, as FPL's Statistics is.
11. **How many rows?** Example: 10 teams × 5 roles plus academies is over 100 rows. Recommend: one long list with a sticky header, as FPL pages its list; or 50 a page.
12. **A route to Compare?** Example: tick two rows, then Compare. Recommend: not in the beta; Compare opens from the card (spec/12).
