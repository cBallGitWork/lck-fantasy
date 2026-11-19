# Flol

Flol is a free, season-long fantasy game for the LCK (League of Legends Champions Korea) that copies FPL's structure. You get a budget, a squad with a bench, weekly transfers, a captain, buffs with LCK-themed names, and global and supporter leagues. The theme is Korean.

The app is being built. The plan: a simulated season on 2026's data, closed tests on the LEC's Winter split and the LCK Cup, then a public launch in spring with the LCK's Split 1.

- [SPEC.md](SPEC.md): the product, in Craig's answers only.
- [To grill](docs/to-grill.md): what's still open.
- [ARCHITECTURE.md](ARCHITECTURE.md): the services, and why.
- [Data model](docs/data-model.md): how the LCK is held.
- [The build pipeline](docs/PIPELINE.md): how issues get built.
- [Decisions so far](docs/decisions.md): the history of what Craig said and when.
- [Research](docs/research/): the competitors, the LCK season, scoring and pricing, weekly logic and onboarding.

## Running it

```bash
npm install
npm run verify   # doc checks, hook checks, lint, typecheck and tests
npm run dev      # the app; /dev/states opens every approved state. Without VITE_CONVEX_URL (`npx convex dev` writes it) it warns and runs without Convex
```
