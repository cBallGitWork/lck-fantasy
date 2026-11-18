# Flol: one core, a brand layer per region (LCK, LEC, more later)

Written 18 Nov 2026 from four notes in this folder (`brand_riot_lol_core.md`, `brand_lck_brand.md`,
`brand_lec_brand.md`, `brand_multibrand_systems.md`), `docs/design/plate.md` and `src/theme/`.
Every claim below is in one of those notes with its source; the source is named here. **Unverified**
marks anything the notes could not confirm. "Inference" marks our reading, not a source's.

**Contents:** [1. The core](#1-the-core) · [2. The brand layer](#2-the-brand-layer) ·
[3. Korean, European, beyond colour](#3-korean-european-beyond-colour) ·
[4. Stopping drift, and today's theme](#4-stopping-drift-and-todays-theme) ·
[5. Trademark lines](#5-trademark-lines) · [6. Questions for Craig](#6-questions-for-craig)

## 1. The core

What every region shares. Rule of thumb from the research: the core is the *grammar* (layout,
spacing, sizes, parts, behaviour); a brand changes *values* (colour, font, one motif, voice).

| Shared | Why |
|---|---|
| Frame: 1440, main column plus 360 side column, top bar | Every sports family shares layout and information design; only colour, mark and motif vary (UEFA family of brands, Turquoise Branding; LTA, Design Compass). |
| Spacing scale 4–48 | "The core of a brand's visual language comes from colour and font, not space"; spacing and grids shared (Clearleft). |
| Six type sizes, three weights, line heights | Infinum's four brands kept type *roles* shared and varied only the family (Infinum). |
| Every part and state (tables, tags, Rift, bench, Card view, modal, form, hover, focus, loading, empty) | Shared components and behaviour are what make a multi-brand system cheap: a fix lands in every brand (Infinum). |
| Density: 40px table rows, 12px heads; one main action per screen | Korean stats pages are table-dense while Toss-style screens give one next action (Toss Feed; StockHub); that blend also suits FPL players anywhere. Inference that it travels to Europe. |
| The "Never" list (no pills, gradients, glow, rounded corners save the tile) and the accessibility rules | Clearleft builds accessibility into each token role, fixed across themes. Flol is stricter than Infinum, which let radius vary per brand: here a brand may not buy back a rounded corner. |
| League-native marks: K/D/A as `3/1/7`, CS, gold, role order Top–Jungle–Mid–Bot–Support, blue side left / red side right, the ten ranked tiers, `GD@15` with sign (`+1,800`) | One game, so one vocabulary: players read League by its data shapes more than its colours (LoL Wiki, Rank; RFT.GG stats guide; LHM.gg). Gold as `12.3k` is **unverified** convention. |
| Flol's own drawn icons and crest shape (PES-style club badge) | Riot's crest art and icons are its IP; Flol draws its own in every region (Riot legal). |
| Token *names* and roles (`--bg`, `--paper`, `--text`, `--ink`…) | "Tokens are universal and never change across themes"; only values do (Clearleft; Style Dictionary multi-brand example). |
| The Flol wordmark | The LTA kept a neutral master accent over regional colours (Design Compass, eat.studio). Note: Riot retired the LTA after 2025 (LoL Esports, LCS 2026 address), so it is a walked-back precedent. |

## 2. The brand layer

What changes per region. Everything else is core.

| Lever (token or asset) | LCK | LEC |
|---|---|---|
| Ground, paper, text | Violet-cast near-black and cool pale, near the LCK's own family (`#1C192B`, `#E2E4F2`; Namu Wiki, **unofficial**). Today's values are LoL-client Hextech, which reads "the game", not "the LCK" (repo `lck-visual-research.md`; inference in `brand_lck_brand.md`). | Near-black ground; the LEC pairs vivid colours against black (Engadget). **No official hexes found**; student-manual hexes rejected. |
| Main accent (`--ink`) | One cool accent, near the LCK's violet-blue (`#6454ED`, Namu, unofficial), not CHZZK green or SOOP blue, which read as a platform tie-in (Design Compass on CHZZK/SOOP). | One hot accent, orange (Engadget; Creative Boom captions). |
| Second accent (`--teal` today) | Peach or warm red as the second (`#FBC3AE`, `#F0383B`, Namu, unofficial). | Teal or turquoise (Engadget "white and teal"; turquoise on black only in Creative Boom captions). |
| Rise and fall | Red up, blue down, as Korean markets show them (StockHub; WikiDocs). | Green up, red down. **Inference**: StockHub says the US is the reverse of Korea; no source read on European apps. |
| Body face (Hangul + Latin) | A Korean UI gothic with matched Latin, tightly tracked: Pretendard (OFL; built on Inter + Source Han Sans; Pretendard README) or keep IBM Plex Sans KR. | A Latin-first sans. The LEC's clean face is spelt Gatica / Gattica / Gratica across sources: **unsettled**. |
| Display face (titles, card names, key figure) | Narrow, heavy sans, the Korean league habit (KFA Gothic, KLeague Dynamic; Goal Korea, Sandoll). Free options in the repo: Gmarket Sans, Black Han Sans. | Heavy condensed poster face, after the LEC's Druk "old European boxing posters" (Creative Boom; It's Nice That). Druk is paid; Anton or Bebas Neue give the weight (inference). |
| Heading tracking | Negative, about −0.025 to −0.04em (Toss estimates via oppadu: **third party**). | Default (no source). |
| Second-language label | Hangul after each title and on LCK-borrowed names (`Coach 감독`), set at contrasting scale, as the LCK's own Hangul–English weave (DesignStudio, via Visuelle and Design Week snippet). | None, or the player's local language. Inference; no source. |
| Motif (one, structural) | Angular geometry after the 2021 two-triangle mark, quiet data-first motion "with no distractions" (Inven Global, Jan 2021). | One hard diagonal cut, after the LEC's angled grid (Creative Boom). Its textures and gradients stay out: plate bans gradients. |
| Crest and kit treatment | Same badge shape (core). LCK clubs are corporate-owned; team colours as solid fields (T1's May Lee, Inven Global). | Same badge shape. Clubs behave like football clubs (KC's Blue Wall, Inven Global; G2's voice, esports.gg): club colours on fixture rows, a small country code (inference). Kit makers are in `docs/research/lec-team-kits.md` (full.life). |
| Fixture extras | One home: CHZZK LoL Park, Seoul (Inven Global). | A venue or city tag (Berlin, Évry, Madrid) for Roadtrips (lolesports.com, 2026 Roadtrips). |
| Times | Viewer's time, then `KST` (plate). | Viewer's time, then `CET` (inference; LEC is in Berlin, rft.gg). |
| Voice (`words.ts`) | Crisp, respectful, LCK terms (series, POG, Bo3, 감독); game slang as labels in the CHZZK habit (buff/nerf; Design Compass). | Cheeky, self-mocking, caster-ish: the LEC's "weaponised cringe" (NME, Quickshot). Football words like "mercato" (MPG, Konbini). Never a caster's catchphrase. |
| Cultural feel | Calm, prestige, sky-bright minimalism, players as "the real stars" (Inven Global). | Loud, poster-like, "clash" of colours, touring arenas, ultras (Engadget; Further; NME). |
| Money | `₩18.5m` (spec/02). | **Open**: see question 3. |

Sizing the job: today's `tokens.ts` holds 26 colours and 2 fonts; a brand re-values those and nothing
in `size`, `space`, `weight`, `measure` or `lineHeight` (count from the repo). About 8–10 colours are
true accents; the rest are surfaces that may barely differ (a judgement, **unverified**).

## 3. Korean, European, beyond colour

**LCK feels Korean when** (`brand_lck_brand.md` §5, from the sources above):
1. Hangul is set in a real Korean gothic, matched in weight to the Latin and tightly tracked, not in a
   fallback face beside a Western display face.
2. Hangul is a design element at contrasting scale (title 28 + hangul 16; name 40 + hangul 20), not a
   translation footnote.
3. Red rises, blue falls.
4. Dense stats tables, then single-action screens to confirm (Save team, a transfer).
5. Game slang and the social habits of Korean esports pages: 응원 (cheering) and 승부예측 (match
   prediction; SOOP's 2026 esports page, Inven Global). Cheer and Jeer already fit.
6. LCK words: series, POG, Bo3, 감독.

The failure, "Western with Korean words": a Western display face, Hangul in a fallback font,
green-up arrows, gold fantasy ornament, taegeuk or hanbok clichés.

**LEC feels European when** (`brand_lec_brand.md` §4–7):
1. The voice winks: puns, deadpan, a joke at a collapse, the LEC's self-aware silliness (NME).
2. Clubs are tribes: club colour and country carry more weight than in the LCK (Inven Global on KC).
3. Football habits: "transfer window", "mercato", a venue tag like a stadium.
4. Poster type: one heavy condensed face at scale, set against a clean sans.
5. Green up, red down (inference).

## 4. Stopping drift, and today's theme

**What stops a brand drifting the core** (`brand_multibrand_systems.md` §5):
- Names and roles are fixed; a brand changes values only (Clearleft).
- Raw values are banned outside the token home, by lint or test (Atlassian's
  `ensure-design-token-usage`). Flol already has this: `theme.test.ts`.
- Brand-only pieces live in brand files, so shared parts stay shared (Infinum).
- A brand may not reference another brand; overrides stay one level deep (DTCG Resolver 2025.10).

**How today's `src/theme` fits.** Well, in shape: one `color` object, `themeCss()` turns it into CSS
properties at `:root`, `ThemeStyle` applies them once, and the test bans colours and sizes anywhere
else. A brand is a second value map with the same keys.

**What must change** (inference, each small):
1. Split `color` and `font` into a core key list and one value map per competition, typed
   `Record<keyof CoreColour, string>`, so a brand missing or adding a key fails to compile. Today's
   values become the LCK map (or a neutral one, per question 1).
2. Pick the map by the competition id the game data already uses (CLAUDE.md: league facts are data,
   held per competition), e.g. `:root[data-competition="lec"]` or by passing the id to `ThemeStyle`.
3. Rename value-named tokens to roles: `gold`, `goldRule`, `teal` say a colour, not a job
   (`bannerAccent`, `bannerRule`, `accent2` or similar). Otherwise the LEC's `gold` is orange.
4. Tests: every brand map has exactly the core's keys; no brand adds a `size`, `space`, `weight` or
   `measure`; every brand's text and mark pairs pass the plate's 4.5:1 and 3:1. Today's contrast tests
   run on one map; they must loop over all.
5. Move the plate's "Korean feel" section, red-up/blue-down, the hangul rule, `KST` and `₩` out of the
   core into an LCK brand section, so the LEC doesn't inherit them by accident.
6. Region leaks in code, not tokens: `KST` sits in `src/parts/text/time.ts`, `Deadline.tsx`,
   `Time.tsx` and several screens; `₩` in `src/parts/text/money.ts`. These become per-competition
   data. Hangul sits in five `words.ts` files; voice needs a per-competition words override, which
   no source covers (Flol's own call).
7. Once `ui-verifier` exists, shoot every approved screen in both brands: a change that only looks
   right in one is a brand change made in the core.

## 5. Trademark lines

Riot's "Legal Jibber Jabber" (riotgames.com/en/legal, dated Aug 2018) and the LCK creator guideline
(lolesports.com, Jun 2022). Not legal advice.

- **No Riot, LoL Esports, LCK or LEC logo or trademark anywhere** in Flol, its site, ads or socials,
  and no domain or account using them, without a written licence. This rule has no API-key exception.
- **Plain-text league and team names** to describe real fixtures: our reading is nominative use, not a
  source's.
- **Off-limits marks and assets:** the LCK two-triangle mark and "We Make Legends"; the LEC crown,
  its Rush/Surge/Strike/Blaze/Blast textures, the Daggers for Teeth illustrations; Riot's crest
  art for ranked tiers; CHZZK and SOOP marks; team crests and sponsor logos (third-party IP needs the
  owner's permission).
- **Fonts:** not Beaufort, Spiegel, Riot Dimension, LCP Ignite, Druk or the KLeague faces
  (non-commercial only, banned from logos). Use OFL or free faces.
- **Palettes:** near a league's, not copied; copying palette and face together reads as an official
  Riot product (repo research, `brand_multibrand_systems.md` §6).
- **Apps and money:** a native app using Riot IP needs a written licence or a valid API key. Any paid
  feature or a company running Flol may make it "commercial", which needs a written licence. The
  sponsor slot is worth a legal check before beta.
- **The notice** goes on every page: "[Project] was created under Riot Games' 'Legal Jibber Jabber'
  policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project."
- **Unverified:** whether a fantasy game using player names and stats, with no Riot art, counts as
  "using Riot IP"; Riot's terms for third-party fantasy products were not found.

## 6. Questions for Craig

1. **Is the core neutral, or is LCK the default?** Say the Hextech navy-and-gold stays as Flol's own
   look and each region only swaps accents, or every region gets its own ground too.
   *Recommend:* neutral core ground, each region owns two accents, gold kept only for the Flol
   wordmark. Riot's own esports brands moved off client gold (BUCK "less myth, more sport").
2. **One font family everywhere, or a display face per region?** Say Pretendard for every region's
   body, plus a heavy LCK display face and a condensed LEC one.
   *Recommend:* yes: shared body face with Hangul (Pretendard), one display face per region. Drop
   IBM Plex Mono for Pretendard's tabular figures (one family).
3. **What money does the LEC show?** Say `€18.5m`, or keep one made-up Flol unit everywhere.
   *Recommend:* currency per competition as data (`₩` LCK, `€` LEC), since prices are already per
   competition.
4. **How cheeky may the LEC voice be?** Say an empty Transfers page reads "Nothing yet. Bold." in the
   LEC, and "No moves yet" in the LCK.
   *Recommend:* labels identical in both; only empty states, toasts and banners change voice, run
   through a per-region `broadcast` pass.
5. **Does the LCK keep Hangul titles when the LEC launches?** Say `Leagues 리그` stays on LCK pages
   only.
   *Recommend:* yes, Hangul is an LCK brand trait, not core; the LEC gets no second language for now.
