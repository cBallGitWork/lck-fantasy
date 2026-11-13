# UCL Fantasy: page inventory and differences from FPL

**Contents:** navigation and page grouping; pages one by one; new-user flow; live points and app-only features; unusual features.

Researched 13 Nov 2026. Caveat for the whole file: gaming.uefa.com is a JavaScript app. A plain fetch of `gaming.uefa.com/en/uclfantasy` returns only the UEFA.com shell (header, footer), no game screens, so the screen-by-screen inventory below is built from rules pages and guides, not from the screens themselves. UEFA's rules article keeps one URL and is rewritten each season: the copy read today is the **2026/27** edition (dated 1 June 2026). Where a 2025/26 source exists it is cited; where only the 2026/27 text was found, that is said.

## Top navigation and page grouping, signed in and signed out

### Takeaway
No source describes the game's own tab bar. What is confirmed: Fantasy sits inside a "Gaming" area of UEFA.com and a separate UEFA Gaming app, alongside other UEFA games; the rules name "My Team" and "Leagues" as places in the game.

### Cited Findings
- The UEFA.com shell around the Fantasy page has an "Explore" menu of Matches, UEFA.tv, Draws, Gaming, Stats, and a main menu of Teams, News, History, About, Store; no sign-in state or create-team button appears in the fetched HTML — [gaming.uefa.com/en/uclfantasy](https://gaming.uefa.com/en/uclfantasy) (fetched 13 Nov 2026)
- The app is "UEFA Gaming: Fantasy Football", UEFA's free games app for the Champions League, Europa League and Conference League; it holds Champions League Fantasy and Predict Six, and over time has added Bracket, Women's Champions League Fantasy and Women's EURO 2025 games — [App Store listing](https://apps.apple.com/app/id1107602457)
- Pages named in guides: "My Team" (subs, captain) — [Fantasy Football Scout, subs and captain changes, 17 Sep 2025](https://www.fantasyfootballscout.co.uk/2025/09/17/ucl-fantasy-2025-26-how-to-make-subs-captain-changes); "Leagues" (create league via "Create league") — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)

### Inferences
- The structure is a hub (several UEFA games under one account and one app), unlike FPL, which is a single game on premierleague.com.

### Gaps
- The game's own tabs (e.g. whether Points, Transfers, Stats, Fixtures are separate tabs as in FPL) and the signed-out vs signed-in navigation: not found. Needs a manual look at the site or app, or screenshots.

## Each page: what it shows and what the manager does

### Takeaway
The rules give a clear picture of the actions (pick, transfer, boosters, subs, captain, leagues) and where two of them live; per-page layouts are unsourced.

### Cited Findings
**Squad and pick team**
- 15 players: 2 GK, 5 DEF, 5 MID, 3 FWD; €100m, rising to €105m after the league phase; XI from the 15 with at least 1 GK, 3 DEF, 2 MID, 1 FWD — [FFScout how-to-play 2025/26](https://www.fantasyfootballscout.co.uk/2025/09/01/how-to-play-uefa-champions-league-ucl-fantasy-2025-26)
- Club cap rises by stage: 3 (league phase), 4 (play-offs, R16), 5 (QF), 6 (SF), 8 (final) — [FFScout 2025/26](https://www.fantasyfootballscout.co.uk/2025/09/01/how-to-play-uefa-champions-league-ucl-fantasy-2025-26)
- Team name is chosen at creation and editable until the next matchday — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- A player whose club is knocked out stays in the squad and scores nothing — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)

**Transfers (matchday vs knockout)**
- Unlimited before MD1; league phase 2 free per matchday, carry at most 1; extra cost 4 points each — [FFScout 2025/26](https://www.fantasyfootballscout.co.uk/2025/09/01/how-to-play-uefa-champions-league-ucl-fantasy-2025-26)
- Unlimited again before the play-offs and before R16; then 2 (play-off 2nd leg), 3 (R16 2nd leg), 5 (QF), 3 (QF 2nd leg), 5 (SF), 3 (SF 2nd leg), 5 (final) — [FFScout 2025/26](https://www.fantasyfootballscout.co.uk/2025/09/01/how-to-play-uefa-champions-league-ucl-fantasy-2025-26); same table in [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- 2026/27 text: hits come off the overall total, not the matchday score; free transfers stop carrying once the knockouts start — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- Prices fixed until the MD2 deadline, then move with performance from MD3 — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)

**Boosters (chips)**
- Two, each once: Wildcard (unlimited transfers, normal budget, squad kept) and Limitless (unlimited transfers, no budget, squad reverts after the matchday) — [UEFA article on top managers](https://www.uefa.com/uefachampionsleague/news/02aa-21ebc39d7cb6-3b56800d9938-1000--champions-league-fantasy-football-learn-from-the-top-man/); [FFScout 2025/26](https://www.fantasyfootballscout.co.uk/2025/09/01/how-to-play-uefa-champions-league-ucl-fantasy-2025-26)
- Not playable on MD1, MD9 (play-off 1st leg) or MD11 (R16 1st leg), which already give unlimited transfers — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- Activation flow: select "Activate wildcard" or "Activate Limitless", confirm transfers, then save; transfers already made that matchday and their hits are cancelled on activation; once played it cannot be cancelled — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- Usage: MD2 was the most popular Wildcard week (21.9%); under 15% of 1.9m managers played both chips, over 95% of the top 5k did — [UEFA article on top managers](https://www.uefa.com/uefachampionsleague/news/02aa-21ebc39d7cb6-3b56800d9938-1000--champions-league-fantasy-football-learn-from-the-top-man/) (season of the data not stated in what was read)

**Points and scoring**
- Points usually calculated within 3 hours of the last final whistle of each day, then fixed; ball recoveries are not adjusted later — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- No bonus points system; Player of the Match gives 3; every 3 ball recoveries gives 1; goal from outside the box +1; winning a penalty 2 — [FFScout 2025/26](https://www.fantasyfootballscout.co.uk/2025/09/01/how-to-play-uefa-champions-league-ucl-fantasy-2025-26)

**Leagues**
- Private leagues: "Leagues" > "Create league", invite by code — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- Automatic public leagues: overall, country, and a league for fans of the club you chose; no favourite club before MD1 puts you in a "no favourite team" league; changing country of residence in settings moves you after the next calculation — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- Join a private league by code or by an auto-join link (link needs you logged in) — [Fantasy Football Reports](https://www.fantasyfootballreports.com/how-to-join-league-ucl-fantasy/) (season not stated)
- Older limit: a manager could be in at most 20 private leagues; no league size cap — older UEFA guide via [UEFA how-to-play (older)](https://uefa.com/uefachampionsleague/news/0262-1097ad9a3920-61ba814ff71f-1000--how-to-play-champions-league-fantasy-football) (pre-2025/26; not confirmed current)

**Prizes, help**
- Prizes range from final tickets to PlayStation 5s and replica shirts — [FFScout 2025/26](https://www.fantasyfootballscout.co.uk/2025/09/01/how-to-play-uefa-champions-league-ucl-fantasy-2025-26)
- Help is by email, fantasy@support.uefa.com, quoting username and team name — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)

### Inferences
- Wildcard and Limitless share one flow (activate, confirm, save), started from the transfers screen, and are final once saved. FPL also confirms chips; UCL adds the "cancels earlier transfers and hits" step.
- Private, overall, country and club leagues match FPL's set (FPL's club league is by favourite team too).

### Gaps
- No source on: a home/dashboard page, a separate points page per matchday, the player list and player card, a fixtures page, viewing another manager's team, a team history page, a settings page beyond "country of residence".
- Head-to-head leagues: none of the sources mention them. Not confirmed either way.
- Tie-breaks: not covered.

## New-user flow: can you build a team before signing in?

**Update, 13 Nov 2026:** yes. The live site, opened signed out after Craig pointed to it, goes to /create-team and offers "Try as a guest"; log-in is asked for on Continue. See the survey report. The notes below predate that check.

### Takeaway
Not confirmed. Every source found puts registration (or login) first, then team building. The premise that UCL Fantasy lets you pick a team and then sign up is unsourced; it needs a manual check of the live site or app.

### Cited Findings
- Entry requires registering an account on a UEFA platform; 18 or over — UEFA terms, as summarised in search results for [Fantasy Football terms and conditions](https://www.uefa.com/uefachampionsleague/news/0260-1012d7b47f8a-301490b25ad9-1000/) (the result named the 2026/27 terms; page not opened)
- "Once you've created your account", managers get €100m for 15 players — [UEFA how-to-play](https://www.uefa.com/uefachampionsleague/news/0254-0e99d7d63b6f-a677a2c202ec-1000--how-to-play-uefa-champions-league-fantasy-football/) (via search snippet; season not confirmed)
- Guides tell readers to sign up or log in first, then build — [RotoBaller 2025/26 guide](https://www.rotoballer.com/uefa-champions-league-fantasy-overview-guide-tips-chips-and-rules-2025-26/1679019) (via search snippet; the page body would not load)
- Late joiners can create a team at any point; between matchdays they score from the next one; mid-matchday they score from the next day; no autosubs in that first partial matchday — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)

### Inferences
- If UCL Fantasy does allow building as a guest, it is not written down in the rules or the main guides; it would show only on the site itself.

### Gaps
- Whether the pitch and player list can be used signed out, and at which step the UEFA login appears (on "Save", or on entry). Needs a person to try it.
- Whether favourite club and country are asked at sign-up (the rules imply a favourite club is chosen somewhere before MD1).

## Live points and app-only features

### Takeaway
The official rules describe points as calculated after each day's matches, within 3 hours, not live. No source describes a live points view. The app's distinct feature found is push notifications.

### Cited Findings
- Points calculated within 3 hours of the day's last final whistle; stats may change in that window; fixed afterwards — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- The rules suggest turning on notifications in the UEFA Gaming app for deadlines — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- App: 4.8 stars from 8.4K ratings; v11.0.0 (14 Aug 2025) opened the 2025/26 season and added Predict Six; v11.1.0 (20 Sep 2025) added Women's Champions League Fantasy; v11.4.0 (3 Mar 2026) added Bracket — [App Store listing](https://apps.apple.com/app/id1107602457)

### Inferences
- With points posted per day rather than live, the manual-sub window (between nights) is when managers look at their scores; the points screen likely matters most then.

### Gaps
- Whether the site or app shows provisional live points during matches: not found.
- Any app-only screens beyond notifications: not found.

## Anything unusual

### Takeaway
UCL Fantasy's big differences from FPL are mid-matchday changes: up to 4 manual subs between nights, a captain switch to a player yet to play, and autosubs that switch off once you touch the team. It also ships alongside other UEFA games.

### Cited Findings
- Manual subs: between the end of one night and the next kick-off within a matchday, up to 4 swaps, only to bench players who haven't played; on "My Team" click the player, "Sub out", pick the replacement; captain via "Make captain" — [FFScout subs and captain, 17 Sep 2025](https://www.fantasyfootballscout.co.uk/2025/09/17/ucl-fantasy-2025-26-how-to-make-subs-captain-changes)
- No mid-matchday subs on MD8 (all games at once) or MD17 (the final) — [FFScout 2025/26](https://www.fantasyfootballscout.co.uk/2025/09/01/how-to-play-uefa-champions-league-ucl-fantasy-2025-26)
- Captain switch cannot be undone; if the captain doesn't play and no other manual change was made he is autosubbed but the replacement gets no double; if other changes were made, nobody gets double — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- Red-carded captain: the 2026/27 rules say the armband can move to a starter yet to play — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/); contradicted for 2025/26 by a guide saying it cannot — [UEFA scout notes, Sep 2025](https://www.uefa.com/uefachampionsleague/news/029d-1ebd016a4bc9-8141c2b02787-1000--champions-league-fantasy-football-scout-notes-17-september/) (via search snippet). Likely a rule change between seasons; not confirmed.
- Autosubs only if no manual change all matchday; any saved change (sub, captain, bench order) turns them off, even if reverted — [UEFA rules, 2026/27 edition](https://www.uefa.com/uefachampionsleague/news/025f-0fd4b42cc0a7-74498b7df63b-1000/)
- Captain changes between gamedays: 9.8% of all managers vs 57.9% of the top 5k — [UEFA article on top managers](https://www.uefa.com/uefachampionsleague/news/02aa-21ebc39d7cb6-3b56800d9938-1000--champions-league-fantasy-football-learn-from-the-top-man/) (via search snippet)
- Deadline is the first kick-off of the matchday (usually Tuesday evening), not 90 minutes before as in FPL — [FFScout 2025/26](https://www.fantasyfootballscout.co.uk/2025/09/01/how-to-play-uefa-champions-league-ucl-fantasy-2025-26)
- "Team of the Week" / all-star XI from the top-scoring players was published as UEFA.com articles, picked in a legal formation, tie-broken by fewer minutes, then total points, then lower price — [UEFA Team of the Week (older)](https://www.uefa.com/uefachampionsleague/news/026d-135db0655d83-0bcef3502b07-1000--champions-league-fantasy-football-team-of-the-week) (roughly 2019 to 2023; not confirmed in-game or current)
- Bundled games: Predict Six (six results per matchday, scorelines, first scorer team, a 2x booster) and Bracket (knockout predictions) — [App Store listing](https://apps.apple.com/app/id1107602457); Bracket Predictor 2025/26 terms — [UEFA](https://www.uefa.com/uefachampionsleague/news/0273-14af9882d9cf-d28d5720bae8-1000--uefa-champions-league-bracket-predictor-2025-26-terms-and-)
- No rolling captain found in any source.

### Inferences
- Mid-matchday subs and captain switches need a "My Team" screen that knows which players have played; the rest of the game's screens are close to FPL.

### Gaps
- EURO Fantasy differences in pages: not researched within the call budget; the app was branded "EURO 2024: Fantasy Football" in 2024 ([apkmirror 7.3.2](https://apkmirror.com/apk/uefa/uefa-champions-league-gaming-hub/uefa-champions-league-gaming-hub-7-3-2-release)) but no page differences were found.
- Reddit r/UCLfantasy and Fantasy Football Hub were not reached.
- Whether "Team of the Matchday" exists as an in-game page: not found.
