# Beta testing

Craig's answers only, from the `/grill` of 18 Nov 2026. A busy game simulated on staging, so the
site is tested full before real managers arrive. Built once the site is basically complete
(Craig, 18 Nov 2026). FPL has nothing like it, so all of this is Flol's own.

**Contents:** [Where](#where) · [The replay](#the-replay) · [The clock](#the-clock) · [Bots](#bots) · [Leagues](#leagues) · [Feed trouble](#feed-trouble) · [Playing along](#playing-along) · [Tests](#tests)

## Where

- On staging, a Convex deployment of its own, wiped and seeded again for each run. Never on the
  live game.
- Bots are staging only: none in the live beta, so real ranks stay real.

## The replay

- A past split replayed as a test competition: LEC Spring 2026 first.
- Its data is a snapshot kept in the repo (Oracle's Elixir's rows for the split, and the
  Leaguepedia pages for it), read by the same loaders as live data. A run needs no internet and
  comes out the same each time.
- Prices from the price formula run on the split before (LEC Versus 2026), with no hand edits.

## The clock

- Staging's clock can be moved, two ways:
  - stepped: to the next event (a deadline, a series starting, a series turning final), or to
    the end of the week; the same every run;
  - sped up: it runs by itself, faster than real time, to watch the screens fill. The speed is a
    setting.

## Bots

- 5,000 bot managers; the number is a setting.
- Every bot acts through the same server functions as a real manager, so no rule is skipped.
- Seven kinds:
  - template: picks the most-owned players and captains the favourite;
  - differential: picks the least-owned;
  - gone quiet: stops from week 3;
  - buff spammer: plays every buff at the first chance;
  - late panicker: makes its transfers in the last 15 minutes before the deadline;
  - rule-breaker: tries what the rules forbid (over budget, after the deadline), and each try
    must be refused;
  - social: follows, cheers, jeers and joins leagues.

## Leagues

- Every bot in Overall.
- Private leagues of 3 to 200 managers.
- Supporter leagues weighted to the big teams, such as G2 and FNC.
- Set cases: tied ranks, late joiners, a removed member.

## Feed trouble

The replay throws each of these at the game, and points and ranks must end up right:

- stats that land late, and stats that land wrong and are then corrected;
- a game remade, and a series moved into the next week;
- a player changing teams mid-split;
- the live feed dropping mid-series and coming back.

## Playing along

- Craig signs in on staging and plays his own squad among the bots.
- An admin page starts, steps and wipes a run.

## Tests

- The replayed split, with its fixed bots, is kept as a test: its final points and ranks are
  saved, and a change that moves them fails until it is checked. It runs in memory, on every PR.
- A deadline-rush load test: about 2,000 connections all making transfers in the last 15 minutes,
  on staging, reporting errors, slow replies and the quota used. Run once, before launch.
