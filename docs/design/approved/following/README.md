# Following

The feed of managers you follow, your requests, trucks, follows and followers. Reached from **Following ›** on Home's Following card; not in the top bar. Drawn at 1440 in the shared frame.

**Approved:** Craig, 14 Nov 2026. In the round he picked a follow request from the profile only, one timeline newest first, and a following cap held as data; on trucking past weeks, "live or previous week (if next gameweek hasnt started)"; then "Yes, save it". Names, teams and numbers are a made-up LCK Cup Week 3, not roster data. Redrawn to [plate.md](../../plate.md) on 15 Nov 2026; this binds layout, content and order, and plate.md how it is drawn. The source is [docs/design/proposals/2026-11-14-following/](../../proposals/2026-11-14-following/) (`build.py`, `brief.md`).

| File | Shows |
|---|---|
| `1440.png`, `following.html` | Mid-Week 3: the feed, requests, trucks received, following, followers |
| `1440-truck.png`, `truck.html` | The truck picker, opened from Jae's row, Protest picked |

## Borrowed

- **LiveFPL's favourite managers**: each manager's deadline swaps with how each is doing so far.
- **LCK fans' LED trucks**: each truck line on a dotted LED panel ([docs/research/truck-culture.md](../../../research/truck-culture.md)), as on Home's card.
- **lolesports.com's series line**: "GEN 2–1 HLE Bo3".

## Layout

- **Left, the feed:** one timeline, newest first, under a header per gameweek (a Not final tag on the live one). Each row: the manager and team; a series with its points and players in role order, a Big Carry tagged on its series row; or a deadline with the buff, transfers, −6s and each swap's score so far. Times show your time and KST.
- **Right:** Requests (Accept, Decline); Trucks this week, each with its sender, a sponsor truck with its sponsor; Following with "3 of 50"; Followers.

## Controls

- **Truck ›** on a row: opens the picker. One truck per manager a gameweek: once sent, every row of that manager reads "Coffee sent" or "Protest sent". Rows of the live week, or last week's until the next starts, have it.
- **The picker:** Coffee 커피차 | Protest 시위 트럭; the lines that fit the receiver's week, filled with their numbers; a preview of the picked line; Cancel, Send truck.
- **Accept, Decline** on a request.
- **Unfollow** on a manager you follow; **Remove** and **Block** on a follower, Block last and apart.
- A manager's name opens their profile.

## Not drawn

- Empty states (no requests, no trucks, nobody followed): one line each, no picture.
- The Follow button: on the manager's profile, which has no picture yet.

## Placeholders

| What | Issue |
|---|---|
| Follows, requests, the feed and its items | #89 |
| Trucks, lines and sponsor trucks | #90; the lines are unapproved drafts ([docs/research/truck-lines.md](../../../research/truck-lines.md)) |
| Live and final series points | #34, #33 |
| Sponsor names | spec/13, no issue yet |
