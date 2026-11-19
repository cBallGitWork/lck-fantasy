# convex/signIn

Google and Discord sign-in (ARCHITECTURE.md), and turning a squad picked signed out into an entry.

- `autoFill.ts`: fills a guest's empty slots with a valid squad under budget (spec/09).
- `invites.ts`: the closed tests' personal invites (spec/10, The road to launch): Craig makes them up to data/invites.json's cap and sees which are used; while a season's `signUpOpen` is false, Save team signs up only an account holding one.
- `signUp.ts`: what a Save needs to become an entry, and the first gameweek a late joiner scores.
- `store.ts`: Save team stored (`saveNewTeam`): the manager, the entry and its picks at that moment's prices, its first Captain, and its three leagues, its store (`storeNewTeam`) shared with the test managers' sign-up; `hasTeam` for log-in. The signed-in account is passed in until Convex Auth is wired.
