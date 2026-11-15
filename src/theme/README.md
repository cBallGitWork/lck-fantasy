# src/theme

Every colour, font, size, weight, gap and width, and nothing else holds one (a test fails on a colour anywhere else in `src/`). A basic LoL and LCK theme until the reskin.

- `tokens.ts`: the tokens, named by the plate's roles (`ink`, `mid`, `paper`…), and `themeCss()`, which makes them CSS custom properties (`--ink`, `--size-title`, `--s-4`, `--m-row`).
- `ThemeStyle.tsx`: applies the tokens at `:root`, once, at the app's root.
- `base.css`: the page's base: body, links, figures, rise and fall, the focus ring.
