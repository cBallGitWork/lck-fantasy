# convex/signIn

Google and Discord sign-in (ARCHITECTURE.md), and turning a squad picked signed out into an entry.

- `autoFill.ts`: fills a guest's empty slots with a valid squad under budget (spec/09).
- `signUp.ts`: what a Save needs to become an entry, and the first gameweek a late joiner scores.
- `store.ts`: Save team stored (`saveNewTeam`): the manager, the entry and its picks at that moment's prices, its first Captain, and its three leagues; `hasTeam` for log-in. The signed-in account is passed in until Convex Auth is wired.
