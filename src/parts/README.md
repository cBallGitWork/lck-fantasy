# src/parts

Parts shared by two or more screens, each drawn one way everywhere (`docs/design/plate.md`, Parts and States). Each has its own CSS file, using theme tokens only. Import them from `src/parts` (`index.ts`), never from a folder inside it; the server (`convex/`) reads `text/money.ts`, `text/figures.ts` and `util/sum.ts` alone. Parts never import `src/rift`; the Rift builds on the parts.


## frame/

The page's frame and its sections.

- `TopBar.tsx`: the top bar: Flol, the eight items with `active`, the sponsor, the account menu or `Sign in`.
- `PageFrame.tsx`: the top bar, then the main column and the 360px side column.
- `Columns.tsx`: the frame's two columns (main, then the 360px side) for a page whose head runs full width above them.
- `PageHead.tsx`: title and hangul, ‹ week ›, the key figure, its tags, up to three figures, a link.
- `SectionHead.tsx`: a main-column section's head: 2px `--text` rule, 14px bold title, its note in mid grey.
- `SideSection.tsx`: a side column section: 2px rule, 14px title, its count or state.
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
- `Toast.tsx`: a short message at the foot of the page that goes by itself after `TOAST_MS` (`Kingen added`, `Team full: 2 from T1`).
- `MainAction.tsx`: the screen's one filled key; disabled with its reason.
- `OutlinedKey.tsx`: any other key; disabled with its reason.

## display/

What shows a fact: tags, tables, lists, crests, states.

- `Tag.tsx`: a tag: plain, `Live` filled, `Not final` dashed; `LiveTag`, `NotFinalTag` and `FinalTag` (Final or Not final) say the states one way everywhere.
- `Deadline.tsx`: `Deadline Wed 07:45  16:45 KST` and the countdown.
- `Time.tsx`: your time, then KST in mid grey; the words over such times (`YOUR_TIME`, `TIME_NOTE`).
- `MeDot.tsx`: your player's dot.
- `Table.tsx`: 40px rows, figures right, long names truncated with their full text, a sorted head, column groups, a rule above a row starting a group (`ruleAbove`), a row's `›` (`open`); sticky head and name column for the wide table.
- `SeriesList.tsx`: the week's series: day, teams, then score and state, or the time.
- `SeriesStrip.tsx`: a card's series strip: the last 3 with points (`Live` while live), a 2px `--text` rule, the next 3 with `Bo3`, the first in `--text` (player card, coach card).
- `States.tsx`: `Loading` (fill bars), `Empty` (a title, one line), `ErrorState` (a title, one line, `Try again ›`).
- `BuffCard.tsx`: a buff: name, what it does, how many left, Play.
- `Crest.tsx`: a team's crest at a measure, from `data/lck/crests/<code>.svg` (docs/design/approved/crests/); a dashed round box with the code where none is drawn.
- `TierShield.tsx`: Overall's tier shield, no text on it (spec/08); the page sizes and colours it through its class names.
- `Move.tsx`: `PriceMove` (▲ 0.5, a page's class beside it) and `RankMove` (▲ 6,904, or a mid grey `—` when it held), the one rank move on every screen; no CSS of its own, base.css draws them.

## text/

How figures and money are written.

- `money.ts`: money as ₩ and m (spec/02): `formatWon` for an amount in won, `money` for a price held in m, `mToWon` between them.
- `figures.ts`: counts, places (`2nd`, `2nd of 10 mids`), signed points, `+in / −out`, scores (`2–1`, `W 2–1`, `seriesResult` for a week's series), per-game and one-decimal figures, per cents, `Bo3`, a game (`G2`), a series' title (`Wed · v HLE`) and absence (`—`), written one way everywhere.

## util/

Helpers with no look of their own.

- `cx.ts`: joins class names.
- `selectable.ts`: makes a tile or card a key: click, Enter or Space.
- `sum.ts`: numbers added up; none gives 0.
- `devState.ts`: `useDevState`, the approved picture's state a screen opens on `?state=` in dev only (`src/app/devStates.ts` lists them).
