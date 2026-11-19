# data

Seed data held per region, competition and season: teams, kit colours, stages. Data, never constants in code. Each region is one folder, `data/<region>/`, such as `data/lck/`; a new region is a new folder, not new code (#374).

- `invites.json`: how many personal invites to the closed tests Craig can make, across every region (spec/10, The road to launch). `convex/signIn/invites.ts` reads it.
- `testManagers.json`: the test managers (spec/10, The road to launch): how many play each competition in the sim and in January, their favourite-team and country weights, the made-up names they show in tables, and how they play. `convex/admin/testManagerStore.ts` reads it.
- `lck/crests/<code>.svg`: each LCK team's crest, by team code (docs/design/approved/crests/). `src/parts/display/Crest.tsx` draws them.
- `lck/photos/<year>/split-<n>/<handle>.<jpg|png|webp>`: each player's LCK media-day portrait for the split, saved from the LCK's Flickr and served by Flol, never hotlinked (spec/13). None yet: the 2027 media days aren't shot, so cards show the crest. `src/fixtures/photos.ts` reads them.
- `lck/season-2027.json`: the 2027 season's settings, Split 1's gameweeks and every pick's price in won, made up until the 2027 fixtures are out (spec/10). `convex/world/season.ts` loads it; `src/region.ts` reads the region's name and the season's year from it; the screens' fixtures read their prices and Week 4's deadline from it.
- `lck/shirts/<code>.svg`: each LCK team's shirt, by team code, viewBox 0 0 100 100, every id prefixed by team so all ten sit inline on one page. Inline them (or load IBM Plex Sans KR) so the hangul sponsor word keeps its font.
- `lck/teams.json`: each team's kit colours (primary body, secondary pattern, accent trim), by team code, and its Oracle's Elixir id, so a code finds its stored team. Their shirts are approved in docs/design/approved/shirts/ (Craig, 16 Nov 2026), with where shirts and crests show.

## Kit colour sources

Hex values are sampled from logo files, not published brand guides.

| Team | Colours | Source | Confidence |
|---|---|---|---|
| T1 | red #E2012D, black, white | Wikipedia logo SVG (docs/research/lck-team-logos-and-memes.md) | Medium |
| GEN | black, gold #AA8A00, pale gold #D2B984 | Gen.G brand guide gold, Liquipedia 2026 file | Medium |
| HLE | orange #F3741B, black, grey #BCBEC1 | Wikimedia logo SVG; black kit per thegamingwear.pages.dev | Medium |
| DK | white, black | Team site and Wikimedia logo, black only; Kia's Midnight Black and Polar White | Low: no kit source read |
| KT | red #EC1B23, black, white | Sampled from kt sports brand page | Medium |
| DNS | blue #1F4FD8, navy | SOOP's blue; no source gives the 2026 kit's colours | Low: guess, check en-freecs.shop |
| NS | red #ED1C24, black, gold #CF8F3A | Liquipedia logo; Shin Ramyun red and black (Nongshim launch, Dec 2020) | Medium |
| KRX | navy #1E2C5D, pink #E4007F | Official 2026 logo PNG; Kiwoom sponsor colours (Namu Wiki) | Medium |
| BRO | green #00563A (Liquipedia's #004B29, lifted to read on navy), orange #F37021 | Liquipedia file; orange kit accent since 2023 (Namu Wiki) | Medium |
| BFX | yellow #FFC20E, black | Crest shield yellow to orange on a black band (research note) | Low: no kit source read |
