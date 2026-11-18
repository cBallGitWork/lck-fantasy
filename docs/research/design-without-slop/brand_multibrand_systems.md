# One core design, a brand layer per region: how others do it, and what it means for Flol

**Contents:** [1. How do sports and esports run one product across several competitions?](#1-how-do-sports-and-esports-run-one-product-across-several-competitions) · [2. What belongs in the core and what in the brand layer?](#2-what-belongs-in-the-core-and-what-in-the-brand-layer) · [3. How many tokens typically change per brand?](#3-how-many-tokens-typically-change-per-brand) · [4. Token tooling for brands and modes](#4-token-tooling-for-brands-and-modes) · [5. How do teams stop brands drifting the core?](#5-how-do-teams-stop-brands-drifting-the-core) · [6. What is protected: brand-layer limits from Riot and the leagues](#6-what-is-protected-brand-layer-limits-from-riot-and-the-leagues) · [Checked](#checked)


Scope: how products run one shared design with a per-competition or per-region brand on top, so
Flol can run the LCK and the LEC (and later regions) from one system. Covers sports and esports
precedents, token tooling, and design-system practice.

What the repo already holds (read first, not repeated here): `docs/design/plate.md` (the core:
frame, 7-step spacing scale, six type sizes, three weights, parts, states, "Never" list, a Korean
feel section); `src/theme/tokens.ts` (every colour, font, size, gap and measure; nothing outside
`src/theme/` holds a colour, enforced by `theme.test.ts`); `docs/research/lck-visual-research.md`
(LCK palette from Namu, LoL/Hextech palette, Korean cues, Riot's fan policy and the LCK creator
guideline); `lck-team-logos-and-memes.md`, `lec-team-logos.md`, `lec-team-kits.md` (crest and kit
descriptions for blind redraws); `esports-fantasy-design-ideas.md` (game mechanics, not look).

Method and limits: about 20 searches and fetches. Several key primary pages failed (Atlassian's
token blog 404, Style Dictionary examples page 404, a UX Collective Figma article 403, TEAM
Marketing's UEFA case study returned only a shell). Where a fact rests on a secondary or fan source
it says so.

## 1. How do sports and esports run one product across several competitions?

### Takeaway
The common pattern is a "family of brands": one master system (typeface, layout, motion, broadcast
grammar) shared by every competition, with each competition owning its colour, its mark and one
signature motif. Riot does this itself: the LoL Esports umbrella since 2020, and the LTA (2025 only;
retired after one season, the LCS and CBLOL returned in 2026) as an explicit master brand with blue
and red sub-brands sharing one typeface. UEFA does it for the Europa League and Conference League,
which share a "wave" device but differ in its shape (a shared font is unconfirmed).

### Cited Findings
- Riot launched "LoL Esports" in July 2020 as the umbrella brand tying its regional leagues
  together; it "will serve as the platform and voice for global competition for all regions", with
  its own logo and visuals drawn from Summoner's Rift, and LoLEsports.com as the hub for the 12
  regional leagues. The article does not say regional logos or colours changed. —
  [GamesBeat, 21 Jul 2020](https://gamesbeat.com/riot-games-unveils-lol-esports-brand-unifying-its-regional-events/)
- The LTA (Riot's 2025 merger of LCS, LLA and CBLOL) uses a "composite brand architecture": LTA
  North in blue with an upward arrow, LTA South in red with a downward arrow, the gold LTA logo at
  the centre for the whole. All share one typeface, Riot Dimension, for "consistency across all of
  LTA's communications". Agency not named on the page (it links eat.studio/work/lta, whose case
  study gives the same colours, arrows, gold accent and typeface). —
  [Design Compass, 21 Apr 2025](https://designcompass.org/en/2025/04/21/league-of-legends-america-league/);
  [eat.studio: LTA](https://eat.studio/work/lta)
- The LTA was retired after its 2025 season: "With the LTA now sunset, the LCS returns in 2026 as
  a standalone league" (reported causes: low viewership and community pushback, not the brand
  system as such). —
  [LoL Esports: LCS 2026 address, 12 Jan 2026](https://lolesports.com/en-us/news/lcs-2026-address)
- Further (agency) made the LEC's 2018/19 name, identity and broadcast package, using "a flexible
  design system" across films, stage, events and trophy; it later worked for the LCK, LPL, LLA and
  VCS, but the page gives no detail on a shared cross-region system. —
  [Further: Riot Games Europe](https://further.group/work/riot-games-europe)
- The LCS broadcast package (Troika with Devlin Design Group) had to scale from phones to 4K TVs,
  and Troika made versions in each team's colours: the same graphics, re-coloured per team. —
  [Promax Brief, via search snippet](https://oldbrief.promax.org/article/troika-devlin-riot-lcs-broadcast-package)
  (snippet only; page not opened)
- UEFA's Europa League and Conference League identities were built as a "family of brands" that
  work side by side on the same match night and also "function as strong independent brands when
  required"; both use an "energy wave", the Conference League's wave "more curved and fluid",
  drawn from its trophy, the Europa League's angular and geometric; same anthem for the two. The
  commercial reason: both are played the same night and sold as one rights package. A shared font
  (with the Champions League and Europa League) came from an NSS Magazine snippet only; the
  Turquoise page does not mention type and the NSS page now returns 404, so it is unverified. —
  [Turquoise Branding](https://www.tqbranding.com/?p=10218) (page read in full, 18 Nov 2026) and
  [NSS Magazine](https://www.nssmag.com/en/sports/26330/brand-identity-conference-league)
  (snippet only; page now 404)
- 2024/25 UEFA logo changes (Champions League unchanged; Europa League given an angular orange
  border; "Europa" dropped from the Conference League name) come only from a fan site. —
  [Footy Headlines, Mar 2024](https://www.footyheadlines.com/2024/03/uefa-24-25-club-competition-logos-confirmed.html)
  (unverified against UEFA)
- Formula 1's 2017/18 identity (Wieden+Kennedy London, team led by Richard Turley) is a logo plus a
  trio of typefaces (F1 Regular, F1 Torque, F1 Turbo) with guidelines letting F1 mix them. —
  [Design Week](https://www.designweek.co.uk/issues/27-november-3-december-2017/formula-1-given-new-race-car-identity-wiedenkennedy/);
  [W+K London](https://wklondon.com/work/formula-1/)

### Inferences
- The shared layer in every sports example is the "grammar": typeface, layout, motion and
  information design. The per-competition layer is colour, mark and one motif. UEFA even keeps the
  motif family the same and varies only its shape (sharp wave vs fluid wave).
- The LTA is the closest model to Flol's case: one Riot product, two regions, one shared typeface,
  each region owning a colour and a directional motif, and a neutral master accent (gold) for the
  whole. Caveat: Riot retired it after one season and went back to separate LCS and CBLOL brands,
  so it is a precedent that was walked back, not a lasting one. For Flol: the Flol wordmark and the core stay neutral; LCK and LEC each own a colour pair
  and one motif.
- Riot's own leagues do not share one look today (LCK's violet/peach "sky" palette vs the LEC's own
  Further-made identity), so "feel like the LCK" and "feel like the LEC" means two genuinely
  different brand layers, not one palette recoloured.

### Gaps
- No primary source found describing a single Riot-wide broadcast graphics system shared by the
  LCK and LEC. Search surfaced only per-league agency work.
- Fantasy apps that run several leagues on one design (e.g. a fantasy product covering the
  Premier League and other leagues, Sofascore or FotMob competition theming): not researched in
  depth; no written source found on how they theme per competition. From general knowledge
  (unverified), Sofascore and FotMob keep one app look and show competition identity mainly through
  the competition's logo and team crests, not a re-skin.
- F2 and F3 brand relationship to F1: nothing found.
- NBA and WNBA: not researched (ran out of budget).

## 2. What belongs in the core and what in the brand layer?

### Takeaway
Practice converges on: the core holds structure (layout, spacing, sizes, component shapes and
behaviour, token names and roles, accessibility rules); the brand layer holds values (colour
palette, font family, sometimes corner radius, icons, imagery and motifs), plus a small set of
brand-only components (banners, hero-type pieces). Spacing and grids are almost always shared.

### Cited Findings
- Infinum built four brands (Virgin Mobile markets and FRiENDi) on one system: shared core
  components (buttons, inputs, checkboxes, navigation), behaviour, and the token structure and
  naming, built "in grayscale first"; varied per brand: primitive palettes, fonts (Poppins plus
  Tajawal for Arabic for Virgin, Open Sans for FRiENDi), corner radius ("Virgin brands use more
  rounded corners"), icons and typography modes per brand, language and platform; customised
  banners, cards and templates moved to brand-specific files. —
  [Infinum](https://infinum.com/blog/multibrand-design-system-tokens/)
- Infinum's tiers: primitive tokens (raw values, each brand its own set), semantic tokens (role
  names like `background-interactive-primary` with hover, pressed and disabled states; typography
  grouped as titles, subtitles, body, labels; "appearance" tokens such as radius). No component
  tokens; the author would add them next time for single-brand overrides. —
  [Infinum](https://infinum.com/blog/multibrand-design-system-tokens/)
- Clearleft (multi-brand system, apparently for Incisive Media): "The core of a brand's visual
  language comes from colour and font, not space"; spacing and grids shared; each token documented
  as brand theme, token, role, value. —
  [Clearleft](https://clearleft.com/thinking/designing-with-tokens-for-a-flexible-multi-brand-design-system)
- GitHub's Primer ships nine colour themes (light, dark, dark dimmed, high contrast, colourblind,
  tritanopia variants) as separate "functional" theme files, switched with `data-color-mode`,
  `data-light-theme` and `data-dark-theme` attributes on a high-level element; size and typography
  sit in shared "base" and "functional" folders. —
  [Primer primitives](https://primer.style/foundations/primitives/getting-started)
- Style Dictionary's official multi-brand, multi-platform example builds every brand × platform
  pair: each build pulls global tokens, the brand's file and the platform's file; generic tokens
  like `color.primary` are aliases whose values come from the brand file included at build time. —
  [Style Dictionary example README (unpkg, v5.0.1)](https://app.unpkg.com/style-dictionary@5.0.1/files/examples/advanced/multi-brand-multi-platform/README.md)

### Inferences
- Mapped onto Flol's existing files:
  - **Core (plate.md, shared):** frame and columns, the 4–48 spacing scale, the six type sizes and
    three weights, every part and state, radius 0 and the one rounded tile, the "Never" list, the
    accessibility rules, the words rules, and the role names of colour tokens (`--bg`, `--paper`,
    `--text`, `--mid`, `--ink`, `--rise`, `--fall`, `--teal`...).
  - **Brand layer (per competition):** the values behind those colour roles; the font family (LCK:
    a Korean-capable face such as the current IBM Plex Sans KR; LEC: possibly a Latin-first face);
    the second-language label (hangul after titles is an LCK brand trait, not core); motifs (the
    Rift map's ground colours, any edge pattern such as the dancheong band idea); crest and kit
    treatment data; voice (the LCK's own words such as `Coach 감독`, Korean red-up/blue-down);
    times (`KST` vs `CET`); currency (`₩18.5m` is an LCK value); the sponsor placeholder.
- Rise-red/fall-blue is a cultural convention (Korean markets), so it belongs to the brand layer:
  a European player expects green up, red down. The plate's "Korean feel" section is in effect
  the LCK brand layer already and could move out of the core.
- The plate's "Never" list (no pills, gradients, glow, stat tiles) is core and should bind every
  brand; a brand may not buy back a rounded corner. Infinum let radius vary by brand; Flol's plate
  makes radius 0 a core rule, which is a deliberate stricter choice.

### Gaps
- No source states a rule for where "voice" or copy lives in a token system; Flol's `words.ts` per
  screen is its own answer. A per-competition words override is not covered by any source found.

## 3. How many tokens typically change per brand?

### Takeaway
No source gave a reliable number. Case studies describe it qualitatively: brands swap the colour
primitives and the font, sometimes radius and icons, and inherit everything else. Flol's own token
file gives a concrete bound: 26 colour tokens and 2 font tokens are the whole surface a brand would
re-value today.

### Cited Findings
- Infinum, Clearleft and Southleft give no counts; Southleft's page mentions "44 tokens" only for
  its own site's theme console. —
  [Infinum](https://infinum.com/blog/multibrand-design-system-tokens/);
  [Clearleft](https://clearleft.com/thinking/designing-with-tokens-for-a-flexible-multi-brand-design-system);
  [Southleft](https://www.southleft.com/insights/design-systems/building-multi-brand-design-systems-the-developers-perspective)
- A general guide recommends audits to find brand tokens that have converged to the same value and
  fold them back into the base layer. —
  [Design System Problems: multi-brand token architecture](https://designsystemproblems.pages.dev/token-management/multi-brand-token-architecture)
  (secondary, via search snippet)
- Flol today: `src/theme/tokens.ts` holds 26 colour tokens (lines 11–59) and 2 font tokens
  (`sans`, `mono`); sizes, weights, line heights, the space scale and measures are separate groups.
  (Read from the repo, 18 Nov 2026.)

### Inferences
- For Flol, a brand file would re-value roughly 26 colours and 1–2 fonts, and nothing in `space`,
  `size`, `weight`, `measure` or `lineHeight`. That is a useful test: if a brand needs to change a
  space or size token, it is asking to change the core, which is a plate change Craig decides.
- About a third of Flol's colours are generic surfaces (`bg`, `paper`, `line`, `fill`, `text`,
  `mid`, `soft`, `dim`) that may barely differ between LCK and LEC (both dark broadcast grounds);
  the real brand difference sits in about 8–10 accents (`ink`, `onInk`, `gold`, `goldRule`, `rise`,
  `fall`, `over`, `teal`, and the five map colours, all navy and blue-grey today). This split is
  a judgement, not a count any source gives.

### Gaps
- No published per-brand override count from Spotify, Atlassian, Booking or Delivery Hero was
  found. Delivery Hero's Marshmallow system has a talk (Amber Jabeen) but no token detail surfaced.

## 4. Token tooling for brands and modes

### Takeaway
The W3C Design Tokens Community Group now has a stable way to express this: a "resolver" with
sets (always on) and modifiers (pick one context each, e.g. `brand: lck`, `mode: dark`). Figma
variable modes, Style Dictionary builds and plain CSS custom properties scoped by a data attribute
(which Tailwind v4 also uses) all implement the same idea: same names, different values.

### Cited Findings
- DTCG Resolver Module 2025.10, published 28 Oct 2025, "considered stable": no separate concept for
  theme, mode or brand; all are **modifiers**, each with named **contexts** (e.g. `light`, `dark`);
  **sets** are unconditional; `resolutionOrder` lists sets and modifiers, later wins on conflict;
  the caller passes one context per modifier (`{ "theme": "dark" }`); a modifier may not reference
  another modifier; possible outputs = product of context counts. —
  [DTCG Resolver Module 2025.10](https://www.designtokens.org/tr/2025.10/resolver/)
- Figma variable modes let one collection hold several value sets so a design switches context;
  "If we need a third color theme, all we need to do is create a new mode"; the limit "depends on
  your plan". —
  [Figma Help: Modes for variables](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)
- Mode limits per plan conflict between sources: forum posts say Professional 4 and Enterprise 40;
  a later UX Collective piece says Professional 10, Organization 20, Enterprise unlimited with
  "extended collections". —
  [Figma forum](https://forum.figma.com/suggest-a-feature-11/launched-all-plans-should-offer-more-than-4-variable-modes-13979/index8.html);
  contradicted by
  [UX Collective](https://uxdesign.cc/what-do-figmas-updates-mean-for-design-systems-323fb0cc8495)
  (snippet only; page returned 403)
- Tailwind v4 `@theme` variables compile to CSS custom properties on `:root`, and utilities read the
  variable, so overriding the variable in a scoped selector re-themes; `@theme static` emits all
  variables so they exist to be overridden; the docs warn a `var()` reference resolves where it is
  defined. The docs do not themselves show a data-attribute pattern. —
  [Tailwind: Theme variables](https://tailwindcss.com/docs/theme)

### Inferences
- Flol already has the right shape: `themeCss()` turns `tokens.ts` into CSS custom properties at
  `:root`. A brand layer is a second value map with the same keys, applied by competition
  (e.g. `:root[data-competition="lec"]` or by choosing the map when the app renders), with the
  current values becoming the LCK map. In DTCG terms: core = a set; `competition` = a modifier with
  contexts `lck`, `lec`; later `mode` (dark/light) or `contrast` would be a second modifier.
- Because the competition is data per competition (CLAUDE.md: "the LCK's facts... are data, held
  per competition"), the brand map can be keyed by the same competition id the game data uses.
- A native app later: Style Dictionary's brand × platform build is the standard route to emit the
  same tokens for iOS/Android, which favours keeping tokens as plain data (JSON or a TS object), as
  Flol does, not locked in CSS.

### Gaps
- Exact current Figma mode limits per plan: conflicting, unconfirmed. Flol does not use Figma
  (pictures are drawn through `/design`), so this matters little.

## 5. How do teams stop brands drifting the core?

### Takeaway
Three mechanisms recur: (1) names and roles are fixed and only values vary per brand; (2) lint or
tests forbid raw values outside the token home; (3) brand-only pieces live in separate, named
files so the core stays clean. Flol already has (2) via `theme.test.ts`.

### Cited Findings
- Clearleft: "Tokens are universal and never change across themes", and roles "cannot be changed
  between themes", with accessibility criteria built into each role. —
  [Clearleft](https://clearleft.com/thinking/designing-with-tokens-for-a-flexible-multi-brand-design-system)
- Atlassian enforces tokens in code with the ESLint rule `ensure-design-token-usage` (flags
  hard-coded colours and spacing; fix is `token()` from `@atlaskit/tokens`), plus
  `no-unsafe-design-token-usage` and `no-deprecated-design-token-usage`, and a matching Stylelint
  rule for CSS. —
  [Atlassian: ensure-design-token-usage](https://atlassian.design/components/eslint-plugin-design-system/ensure-design-token-usage);
  [Atlassian: Use tokens in code](https://atlassian.design/foundations/tokens/use-tokens-in-code)
- Infinum: changes "automatically propagated across all brands via the shared token system";
  brand-specific components (banners, cards, templates) moved to brand files so shared components
  stay shared. —
  [Infinum](https://infinum.com/blog/multibrand-design-system-tokens/)
- DTCG resolver forbids a modifier from referencing another modifier, which keeps brand overrides
  one level deep. —
  [DTCG Resolver Module 2025.10](https://www.designtokens.org/tr/2025.10/resolver/)

### Inferences
- For Flol, drift guards that fit the existing setup: every brand map must have exactly the core's
  keys (a type check: `Record<keyof typeof color, string>`), no brand may add a size, space or
  weight token, and each brand's text/ground pairs must pass the plate's 4.5:1 and 3:1 contrast
  rules (a test over every brand map, since Clearleft builds accessibility into roles).
- Screenshot both brands of every approved screen (the planned `ui-verifier`) so a core change is
  seen in both; a change that looks right only in one is a brand change made in the core.
- The plate should say which of its rules are core and which are LCK brand (the "Korean feel"
  section, red-up/blue-down, hangul labels, KST, won), so a second brand does not inherit Korean
  traits by accident.

### Gaps
- No source found with numbers on drift (how often brands fork components) or on visual
  regression across brands specifically.

## 6. What is protected: brand-layer limits from Riot and the leagues

### Takeaway
A brand layer may evoke a league (colour, mood, cultural cues, plain-text names) but must not
reuse its marks. Riot's fan policy bars its logos and trademarks without a written licence and
bans its IP in games and apps; it does not name teams or sponsors, but says a third party's IP needs
that party's permission, so team crests and sponsor marks are not Riot's to grant through it. The
LCK's guideline is non-commercial only.

### Cited Findings
- Riot's "Legal Jibber Jabber": "you may not use any of our logos or trademarks anywhere in your
  Project" without a written licence; "We prohibit the use of our IP in games and apps"; third
  parties' IP needs their permission; a required attribution line. —
  [Riot Games legal](https://www.riotgames.com/en/legal) (as quoted in
  `docs/research/lck-visual-research.md`, read 2026)
- LCK creator guideline (13 Jun 2022): LCK IP for personal, non-commercial use only; never cover,
  remove or alter sponsor logos. —
  [LoL Esports: LCK content creator guideline](https://lolesports.com/ko-KR/news/lck-content-creator-guideline)
  (as quoted in the same repo file)
- Riot's LTA brand uses a proprietary typeface, Riot Dimension. —
  [Design Compass](https://designcompass.org/en/2025/04/21/league-of-legends-america-league/)

### Inferences
- Per-region brand layers must be built from Flol's own parts: its own colour values (near, not
  copied from, league palettes), free fonts (not Beaufort, Spiegel or Riot Dimension), its own
  motifs, and redrawn crests and kits as the repo's crest work already does. League names (LCK,
  LEC) appear as plain text only, never their logos.
- A brand layer that copies a league's exact palette and typeface would read as an official Riot
  product, which the repo's earlier research already flags as the thing to avoid.

### Gaps
- Whether the LEC publishes a creator guideline like the LCK's: not checked.
- The LEC's current palette and type (for drawing a "near, not copied" LEC brand layer): not
  researched here; the repo has LEC crests and kits but no LEC league-identity notes.

## Checked

Sceptic pass, 18 Nov 2026: each claim checked at its source and, where one exists, one other.

1. **LTA composite brand (blue/up North, red/down South, gold master, Riot Dimension).** Confirmed
   at Design Compass and independently at eat.studio/work/lta. Correction to "uses": the LTA was
   retired after 2025; the LCS and CBLOL returned as standalone leagues in 2026 (LoL Esports, LCS
   2026 address). Still a precedent, but one Riot walked back. Body fixed.
2. **LoL Esports umbrella, July 2020, 12 regional leagues; no regional restyle stated.** Confirmed
   (GamesBeat, 21 Jul 2020: "unites 12 different regional events"; only the umbrella gets a new
   logo). The "so the LCK and LEC layers must be genuinely different" is an inference, not a
   sourced fact: unverified.
3. **UEFA family of brands, wave shape differs, side by side yet standalone.** Confirmed (agency
   page now at tqbranding.com, read in full, not just a snippet). **Shared font: unverified**: the
   agency page does not mention type, the NSS page is 404, and no other source found says it.
   Body fixed.
4. **Infinum four brands; shared components, behaviour, token names, greyscale first; per-brand
   palettes, fonts, radius, icons; banners, cards, templates to brand files.** Confirmed at source
   (brands: Virgin Mobile, FRiENDi Mobile, Virgin Connect Roam, FRiENDi Pay). No independent
   source: it is the agency's own account.
5. **Clearleft: colour and font not space; spacing and grids shared; token names and roles fixed;
   accessibility built into roles.** Confirmed at source, verbatim. No independent source (own
   account).
6. **DTCG Resolver 2025.10: modifiers with contexts over unconditional sets; later wins; no
   modifier-to-modifier reference.** Confirmed. Note: the page calls itself both "considered
   stable" and a Candidate Recommendation / Final Community Group Report, and brand and theme
   appear as examples of modifiers, not required names.
7. **Style Dictionary multi-brand example: brand × platform from global, brand, platform files;
   `color.primary` aliased from the brand file.** Confirmed in the v5.0.1 README. "The route to a
   native app" is an inference: unverified.
8. **Atlassian `ensure-design-token-usage` flags hard-coded colour and spacing, with
   `no-unsafe-` and `no-deprecated-design-token-usage` and a Stylelint twin.** Confirmed via
   Atlassian's "Use tokens in code" page (`domains: ['color', 'spacing']`) and the
   `@atlaskit/stylelint-design-system` README; the rule's own page rendered empty to the fetcher.
   "theme.test.ts does the same job": confirmed for colour and size literals outside
   `src/theme/` (and unknown `var(--…)` names), by a test, not a lint rule.
9. **26 colour and 2 font tokens in `src/theme/tokens.ts`.** Confirmed by count (colour block is
   lines 11–59, not 11–60; body fixed). "About 8 to 10 are the real brand accents": a judgement,
   unverified; the body's "map greens/blues" was wrong (the map colours are navy and blue-grey),
   body fixed.
10. **Riot fan policy: no logos or trademarks without a written licence; no IP in games and apps;
    can't license teams' or sponsors' marks.** First two confirmed verbatim on riotgames.com/en/legal
    (apps on the App Store or Google Play need a written licence or a valid API key). **Third part
    wrong as worded**: the page never mentions teams or sponsors' marks; it says "You may not use a
    third party's IP in your Project without their permission." The outcome (crests and sponsor
    marks need their owners' permission) stands. The "so each brand layer must be Flol's own
    colours, free fonts, redrawn crests, plain-text names" is an inference. Body fixed.
