# Following, cheers and jeers

Craig's answers only, from the `/grill`s of 14 Nov 2026 and of 16 Nov 2026 (the words). Where this
file is silent the rule is FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). FPL
has no following, so most of this is Flol's own. Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

**Contents:** [Following](#following) · [The feed](#the-feed) · [Cheers and jeers](#cheers-and-jeers) · [Lines](#lines) · [Where it shows](#where-it-shows)

## Following

- In the beta, Split 1 (Craig, 16 Nov 2026).
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

## Cheers and jeers

Cheers and jeers are the feed's reaction, after LCK fans' LED trucks
([research](../docs/research/truck-culture.md)). They were called trucks until 16 Nov 2026,
when a QA panel of five testers couldn't tell what a truck was (Craig: "Cheer jeer and we can add
truck hire as a sponsor").

- A manager can cheer or jeer anyone they follow on any feed item of the live gameweek, or of the
  previous gameweek until the next one starts (Craig, 14 Nov 2026): one cheer or jeer per manager
  followed per gameweek.
- A **cheer** praises the receiver's week, as the LCK's coffee trucks (커피차) do; a **jeer**
  mocks it, as the protest trucks do.
- The key on a feed row reads `Cheer / Jeer ›` and opens the picker, on Home and on Following
  (Craig, 16 Nov 2026).
- What arrives is drawn as the truck's dotted LED panel, with the sender's name and a small
  credit to a made-up truck-hire sponsor (Craig, 16 Nov 2026). Example: SELL YOUR BOT LANER,
  Jeer from Minji, Truck hire by …. The sponsor's name is drafted with the other made-up sponsors
  ([spec/13](13-korean-touches.md)), and Craig approves it before it goes live.
- It parks on the receiver's profile for the gameweek.
- A **sponsor cheer** sends itself: each private league's top manager of the gameweek gets one
  from a made-up sponsor ([spec/13](13-korean-touches.md)), shown on their profile and in the
  league.

## Lines

- Lines are preset, never free text, so nothing needs moderating.
- Lines are a database, as Football Manager's dialogue is: each line has its kind (cheer,
  jeer, sponsor), the week it fits (a trigger, such as the Carry blanked, a hit taken, a green
  arrow, top of the league, or any week), and a weight for how often it comes up. A manager picks
  from the lines that fit the receiver's week. An admin adds lines, and Craig approves each
  before it goes live.
- What the triggers mean (Craig, 15 Nov 2026). Every number is data:
  - **Which week:** a line fits the receiver's last final gameweek, and the cheer or jeer parks for
    the current one. Before the first week is final, only any-week lines show.
  - **Carry blank:** a Carry on 2 or fewer after the ×1.5, as FPL counts a blank. **A dear
    player's flop:** the receiver's dearest starter on 2 or fewer; `{price}` is his price.
  - **High and low score:** the global top 10% and bottom 10% of the gameweek.
  - **Top and bottom of the league:** first or last in a private league the sender and receiver
    are both in; `{league}` names it. If they share none, these lines don't show.
  - **Green and red arrow:** the gameweek's move in overall rank. **Buff wasted:** played, and
    the week ends below the global average; otherwise **buff played**.
- Lines fill in the receiver's own numbers. Example: WE DID NOT PAY ₩12M FOR A BENCH WARMER.
- A jeer's line never names a real player; it mocks the manager's own picks, in the protest trucks'
  formal-demand style. Example: MANAGEMENT MUST EXPLAIN THIS CARRY PICK. A cheer's line may praise
  real players.
- Lines use FPL's lingo (green arrow, hit, bench headache, template) and LCK's, in UK English.
- The first draft set, written 14 Nov 2026 and not yet approved, is in
  [docs/research/truck-lines.md](../docs/research/truck-lines.md).

## Where it shows

- Home's Following card shows the latest feed items ([spec/12](12-pages.md#home)).
- **Following ›** opens the Following page: the feed, who the manager follows, requests, and the
  cheers and jeers received. Its layout is the approved picture (`docs/design/approved/following/`).
