# src/parts

Parts shared by two or more screens, each drawn one way everywhere (`docs/design/plate.md`, Parts and States). Each has its own CSS file, using theme tokens only. Import them from `src/parts` (`index.ts`), never from a folder inside it; the server (`convex/`) reads `text/money.ts`, `text/figures.ts`, `util/sum.ts` and `util/seeded.ts` alone. Parts never import `src/rift`; the Rift builds on the parts.

- `words.ts`: the shared parts' words, named once; a figure's format stays in `text/figures.ts`.


## frame/

The page's frame and its sections.

- `AppFrame.tsx`: the app's frame: the page's title, its one live region, and where focus goes when the page changes (`pageFocus.ts`).
- `TopBar.tsx`: the top bar: Flol, the eight items with `active`, the sponsor, the account menu; a visitor's only Stats, LCK and `Log in ›`.
- `PageFrame.tsx`: the top bar, then the main column and the 360px side column; the foot, Riot's notice (`RIOT_NOTICE`).
- `Columns.tsx`: the frame's two columns (main, then the 360px side) for a page whose head runs full width above them.
- `PageHead.tsx`: title and hangul, ‹ week ›, the key figure, its tags, up to three figures, a link.
- `SectionHead.tsx`: a main-column section's head: 2px `--text` rule, 16px bold title, its note in mid grey.
- `SideSection.tsx`: a side column section: 2px rule, 16px title, its count or state.
- `SponsorNote.tsx`: `All sponsors are made up.`
- `Placeholder.tsx`: a dashed box with one word (sponsor, photo).

## controls/

Keys, links, tabs, sheets and fields.

- `WeekArrow.tsx`: `WeekStep`, `‹ Week 3 ›` on every page that steps through weeks; each `WeekArrow` a 32px key, a link or a button, disabled where there is no week that way.
- `ViewToggle.tsx`: butted keys, the chosen one on paper (`Rift view | Card view`).
- `Tabs.tsx`: a page's or a card's sections, the chosen one underlined, as a tab list; `TabPanel`, the chosen one's section.
- `LinkGo.tsx`: a link ending `›` (`go`), or `↗` leaving Flol (`out`).
- `GoLink.tsx`: a link inside Flol through the router, typed by `src/paths.ts` (`Go`).
- `Menu.tsx`: a key that opens a list of links and actions (a league's Admin menu; the account menu once its items are settled).
- `Modal.tsx`: a card (1056) or sheet (544) over a dimmed page; ✕, Esc, focus kept inside. A sheet shows its title, or its own `head` (Points' breakdown).
- `Field.tsx`: a form field: label above, 40px, an error line under.
- `Select.tsx`: a choice from a list, 40px, edged, with its words before a choice (`Choose a team`); `plainOptions`, options that are their own words.
- `Toast.tsx`: a short message at the foot of the page that goes by itself after `TOAST_MS` (`Kingen added`, `Max 2 from T1`).
- `SheetKeys.tsx`: a sheet's foot: `Back`, a text link, then its main action (a league's Leave, Following's Block).
- `MainAction.tsx`: the screen's one filled key; disabled with its reason.
- `OutlinedKey.tsx`: any other key; disabled with its reason.

## display/

What shows a fact: tags, tables, lists, crests, states.

- `Tag.tsx`: a tag: plain, `Live` filled, `Not final` dashed; `LiveTag`, `NotFinalTag` and `FinalTag` (Final or Not final) say the states one way everywhere.
- `Deadline.tsx`: `Deadline Wed 07:45` in your time, and the countdown.
- `Time.tsx`: your time alone, with no zone (`Sat 22:00`); the head over a column of them (`YOUR_TIME`).
- `MeDot.tsx`: your player's dot.
- `Hint.tsx`: a word's hover (spec/12, Words): one short line on hover, or on tap on the phone; the words-alone lines (`HINTS`) and C's (`captainHint`).
- `Table.tsx`: 40px rows, figures right, long names truncated with their full text, a sorted head, column groups, a rule above a row starting a group (`ruleAbove`), a row's `›` (`open`); sticky head and name column for the wide table.
- `SeriesList.tsx`: the week's series: day, teams, then score and state, or the time.
- `SeriesStrip.tsx`: a card's series strip: the last 3 with points (`Live` while live), a 2px `--text` rule, the next 3 with `Bo3`, the first in `--text` (player card, coach card).
- `States.tsx`: `Loading` (fill bars), `Empty` (a title, one line), `ErrorState` (a title, one line, `Try again ›`).
- `BuffCard.tsx`: a buff: name, what it does, how many left, Play.
- `ProviderMark.tsx`: the sign-in provider's mark, `G` or `D` (Settings, the sign-up sheet).
- `Crest.tsx`: a team's crest at a measure, from `data/lck/crests/<code>.svg` (docs/design/approved/crests/); a dashed round box with the code where none is drawn.
- `PlayerPhoto.tsx`: a player's media-day portrait credited `Photo: LCK` (`PHOTO_CREDIT`), or his team's crest without one (spec/13).
- `TierShield.tsx`: Overall's tier shield, filled and outlined, no text on it (spec/08); the page sizes it through its class name.
- `TierMark.tsx`: a manager's tier, its shield and name, one way on Home, Points, the profile and the Overall table (spec/08).
- `Led.tsx`: a cheer's or jeer's line on its dotted LED panel, in capitals, drawn as Home's; `big` for the picker's preview; `TruckHire`, the credit under one received; the kinds' words and `Cheer / Jeer`, the key.
- `Move.tsx`: `PriceMove` (▲ 0.5, a page's class beside it) and `RankMove` (▲ 6,904, or a mid grey `—` when it held), the one rank move on every screen; no CSS of its own, base.css draws them.

## text/

How figures and money are written.

- `money.ts`: money as the league's sign and m (spec/02), the sign from its data (`src/region.ts`): `formatWon` for an amount in won, `money` for a price held in m, `mToWon` between them.
- `figures.ts`: counts, places (`2nd`, `2nd of 10 mids`), signed points, `+in / −out`, scores (`2–1`, `W 2–1`, `seriesResult` for a week's series), per-game and one-decimal figures, per cents, `Bo3`, a game (`G2`), a series' title (`Wed · v HLE`) and absence (`—`), written one way everywhere.
- `time.ts`: a moment in the manager's own zone, with its day, as `Time.tsx` draws it.

## util/

Helpers with no look of their own.

- `cx.ts`: joins class names.
- `selectable.ts`: makes a tile or card a key: click, Enter or Space.
- `sum.ts`: numbers added up; none gives 0.
- `seeded.ts`: a seeded random, the same each run (tests, test managers).
- `weeks.ts`: a week in the address (`/points/2`, `/perfect-game/3`).
- `rememberedView.ts`: the view a manager last chose, kept in the browser under `VIEW_KEYS` (Pick Team, Points and Perfect game share one; Transfers its own).
- `devState.ts`: `useDevState`, the approved picture's state a screen opens on `?state=` in dev only (`src/app/devStates.ts` lists them).
