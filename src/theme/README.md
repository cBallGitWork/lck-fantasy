# src/theme

Every colour, font, size, weight, gap and width, and nothing else holds one. The LCK's look is Arena, the look trial's pick (`docs/design/plate.md`). `theme.test.ts` fails on a colour or a px size anywhere else in `src/`, and on a `var(--name)` that isn't a token; a size a page needs becomes a measure here.

- Three layers with the same keys: `core.ts` (Flol's sizes, weights, tracking, gaps and widths), `game.ts` (League's shared marks: rise and fall, the Rift's map and a news warning) and `league.ts` (each league's colours and fonts, one typed map each; the LCK's today). Colours are named by job, never hue (`banner`, `signal`).
- `tokens.ts`: the layers merged for the active league (the region's), named by the plate's roles (`ink`, `mid`, `paper`…), and `themeCss()`, which makes them CSS custom properties (`--ink`, `--size-title`, `--s-4`, `--m-row`, `--lh-mid`, `--track-head`, `--ratio-stream`). `measureVar()` gives a measure to a part that takes one as a prop.
- `ThemeStyle.tsx`: applies the tokens at `:root`, once, at the app's root.
- `base.css`: the page's base: body, links, figures, a price's rise and fall (`.rise`, `.fall`), a rank's move in `--text` (`.rank-up`, `.rank-down`), the focus ring, and five shared looks: small grey words (`.quiet`), a button drawn as bare text (`.key-bare`), a boxed count (`.counted`), the hover underline (`.hover-line`) and a key that can't be pressed (`.key-off`). It loads first, so a part's own CSS wins.
