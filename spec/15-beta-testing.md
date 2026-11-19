# Beta testing

Craig's answers only, from the `/grill`s of 18 Nov 2026. A busy game simulated on staging, so the
site is tested full before real managers arrive. It is step 1 of the road to launch
([spec/10](10-season-and-gameweeks.md#the-road-to-launch)), which holds the season replayed, the
test managers' number and styles, the clock and when the sim is done; where the two differ,
spec/10 wins. Built once the site is basically complete (Craig, 18 Nov 2026). FPL has nothing like
it, so all of this is Flol's own.

**Contents:** [Where](#where) · [The replay](#the-replay) · [The clock](#the-clock) · [Test managers](#test-managers) · [Leagues](#leagues) · [Feed trouble](#feed-trouble) · [Playing along](#playing-along) · [Tests](#tests)

## Where

- On staging, a Convex deployment of its own, wiped and seeded again for each run. Never on the
  live game.
- Test managers play the simulated season and the January closed tests, never the public game,
  so real ranks stay real.

## The replay

- The LCK's whole 2026 season, replayed under 2027's format, as
  [spec/10](10-season-and-gameweeks.md#the-road-to-launch) sets out.
- Its data is a snapshot kept in the repo (Oracle's Elixir's rows for the season, and the
  Leaguepedia pages for it), read by the same loaders as live data. A run needs no internet and
  comes out the same each time.
- Prices from the price formula run on 2025's data, with no hand edits.

## The clock

- Time moves by an admin's **Next day** and **Play to end**
  ([spec/10](10-season-and-gameweeks.md#the-road-to-launch)); the same every run.

## Test managers

- 1,000 test managers; the number is a setting.
- Every test manager acts through the same server functions as a real manager, so no rule is
  skipped.
- Mixed styles, as in [spec/10](10-season-and-gameweeks.md#the-road-to-launch): chases form, loyal
  to one team, the cheap stars, close to random.
- Some also test the edges:
  - gone quiet: stops from week 3;
  - buff spammer: plays every buff at the first chance;
  - late panicker: makes its transfers in the last 15 minutes before the deadline;
  - rule-breaker: tries what the rules forbid (over budget, after the deadline), and each try
    must be refused;
  - social: follows, cheers, jeers and joins leagues.

## Leagues

- Every test manager in Overall.
- Private leagues of 3 to 200 managers.
- Supporter leagues weighted to the big teams, such as T1 and Gen.G.
- Set cases: tied ranks, late joiners, a removed member.

## Feed trouble

The replay throws each of these at the game, and points and ranks must end up right:

- stats that land late, and stats that land wrong and are then corrected;
- a game remade, and a series moved into the next week;
- a player changing teams mid-split;
- the live feed dropping mid-series and coming back.

## Playing along

- Craig signs in on staging and plays his own squad among the test managers.
- An admin page starts and wipes a run, beside Next day and Play to end.

## Tests

- The replayed season, with its fixed test managers, is kept as a test: its final points and
  ranks are saved, and a change that moves them fails until it is checked. It runs in memory, on
  every PR.
- A deadline-rush load test: about 2,000 connections all making transfers in the last 15 minutes,
  on staging, reporting errors, slow replies and the quota used. Run once, before launch.
