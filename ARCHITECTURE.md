# Architecture

How the product in [SPEC.md](SPEC.md) will be built. No code exists yet.

**Who decides:** Craig picks the services, because they cost money and are hard to leave. Claude
picks the libraries inside them, because they are cheap to change. Both are written here with a
reason, and a change to either changes this file.

## Services (Craig's)

"Same as draft" (Craig, 11 Nov 2026): the services his Premier League draft product runs on.

| Job | Service | Why |
|---|---|---|
| Backend | [Convex](https://docs.convex.dev): database, live queries, timers, sign-in | live points reach browsers with no extra service; deadlines and price changes are timers saved with the data; one vendor, hard-capped free plan; Craig and Claude already know its rough edges |
| Pages | Vercel, free (Hobby) plan | Hobby is for non-commercial use, which fits: the game is free with no cash prizes. Payments, ads or a donate button would need the paid plan |
| Sign-in email | Resend, magic links | no passwords to keep; the free plan's 100 emails a day is the limit to watch at launch |
| LCK stats, live | GRID if it grants free non-commercial access; otherwise Riot's unofficial live stats feed, shown as provisional (Craig, 11 Nov 2026) | GRID is Riot's official data partner but commercial; the unofficial feed is free, unsupported, and can be switched off ([research](docs/research/live-data-sources.md)) |
| LCK stats, settled | not chosen; Oracle's Elixir's daily CSV is the proposal | free for fans, and it has the 15-minute stats the live feed lacks |

## Libraries (Claude's)

Chosen with the first code, each with a reason. The starting point is the draft product's set
(a Vite React app with TanStack Router, Convex Auth, Vitest with `convex-test`), because it is
proven on these services.

## Data

[docs/data-model.md](docs/data-model.md) is the proposal. Two rules are fixed:

- FPL's structure is the model for the game. The LCK's facts (teams, players, stages, formats,
  dates) are data held per competition and per season, never hardcoded, so the LCK Cup, the
  splits and later the LEC are rows, not code.
- Every stat a feed sends is kept as it arrived, so scoring can be re-run when a rule changes.

## Where code lives

Set with the first code.
