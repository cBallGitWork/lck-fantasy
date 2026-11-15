# src/theme

Every colour, font, size, weight, gap and width, and nothing else holds one. A basic LoL and LCK theme until the reskin. `theme.test.ts` fails on a colour or a px size anywhere else in `src/`, and on a `var(--name)` that isn't a token; a size a page needs becomes a measure here.

- `tokens.ts`: the tokens, named by the plate's roles (`ink`, `mid`, `paper`…), and `themeCss()`, which makes them CSS custom properties (`--ink`, `--size-title`, `--s-4`, `--m-row`, `--lh-mid`, `--ratio-stream`). `measureVar()` gives a measure to a part that takes one as a prop.
- `ThemeStyle.tsx`: applies the tokens at `:root`, once, at the app's root.
- `base.css`: the page's base: body, links, figures, a price's rise and fall (`.rise`, `.fall`), a rank's move in ink (`.rank-up`, `.rank-down`), the focus ring.
