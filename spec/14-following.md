# Following and trucks

Craig's answers only, from the `/grill` of 14 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). FPL has no following, so most
of this is Flol's own. Open questions are in [docs/to-grill.md](../docs/to-grill.md).

**Contents:** [Following](#following) · [The feed](#the-feed) · [Trucks](#trucks) · [Truck lines](#truck-lines) · [Where it shows](#where-it-shows)

## Following

- In the LCK Cup beta.
- By request, one-way: a manager asks to follow Minji, she accepts, and Minji's week shows in his
  feed. She sees his only if she asks too.
- A manager can unfollow, and can remove or block a follower.
- Profiles stay public, as in FPL ([spec/12](12-pages.md)); the feed is what needs the yes.
- A follow request is sent from the manager's profile, which opens from any league table. There
  is no search (Craig, 14 Nov 2026).
- A manager can follow up to a cap, held as data per competition (drawn as 50).

## The feed

One timeline of every manager followed, newest first, split by gameweek (Craig, 14 Nov 2026).
For each manager followed:

- their points at the end of each series;
- a big Carry: a Carry scoring 20 or more in a series after the ×1.5, about 1 series in 10 on
  2026's data. The 20 is data;
- at each deadline, their transfers and buff, then how each swap is doing as series finish.
  Example: Chovy → Faker, +6 so far.

## Trucks

Trucks are the feed's reaction, after LCK fans' LED trucks
([research](../docs/research/truck-culture.md)).

- A manager can truck anyone they follow on any feed item of the live gameweek, or of the
  previous gameweek until the next one starts (Craig, 14 Nov 2026): one truck per manager
  followed per gameweek.
- Two trucks a manager sends: a **coffee truck** (커피차) to cheer, a **protest truck** to jeer.
- A truck parks on the receiver's profile for the gameweek, with the sender's name.
- A **sponsor truck** sends itself: each private league's top manager of the gameweek gets one
  from a made-up sponsor ([spec/13](13-korean-touches.md)), shown on their profile and in the
  league.

## Truck lines

- Lines are preset, never free text, so nothing needs moderating.
- Lines are a database, as Football Manager's dialogue is: each line has its kind (coffee,
  protest, sponsor), the week it fits (a trigger, such as the Carry blanked, a hit taken, a green
  arrow, top of the league, or any week), and a weight for how often it comes up. A manager picks
  from the lines that fit the receiver's week. An admin adds lines, and Craig approves each
  before it goes live.
- Lines fill in the receiver's own numbers. Example: WE DID NOT PAY ₩12억 FOR A BENCH WARMER.
- A protest line never names a real player; it mocks the manager's own picks, in the trucks'
  formal-demand style. Example: MANAGEMENT MUST EXPLAIN THIS CARRY PICK. Coffee lines may cheer
  real players.
- Lines use FPL's lingo (green arrow, hit, bench headache, template) and LCK's, in UK English.
- The first draft set, written 14 Nov 2026 and not yet approved, is in
  [docs/research/truck-lines.md](../docs/research/truck-lines.md).

## Where it shows

- Home's Following card shows the latest feed items ([spec/12](12-pages.md#home)).
- **Following ›** opens the Following page: the feed, who the manager follows, requests, and
  the trucks received. Its layout is the approved picture (`docs/design/approved/following/`).
