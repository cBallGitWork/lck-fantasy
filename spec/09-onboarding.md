# Onboarding

Craig's answers only, from chat on 11 Nov 2026 and the `/grill` of 13 Nov 2026. Where this file
is silent the rule is FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open
questions are in [docs/to-grill.md](../docs/to-grill.md).

Copies UCL Fantasy: the first page is one where you can just pick a team, with no sign-up wall.
"Its a great way to get people in" (Craig, 11 Nov 2026).

## Picking as a guest

- A new visitor lands straight on the pick-a-team page, as UCL Fantasy's visitors do. A returning
  manager has a Log in link there.
- An Auto-fill button fills the empty slots with a valid squad under budget, as UCL Fantasy and
  FPL have. It picks at random, different each press, but spends close to the budget, so it
  suggests a half-decent team (Craig, 17 Nov 2026).
- A guest's squad is kept in that browser if they leave before signing up. Example: close the
  tab, come back tomorrow, and the squad is still there. It is not entered or scored until
  sign-up.

## Signing up

- Sign-up is asked on Save, once all 9 are picked and the squad is valid.
- The guest signs in with Google or Discord ("Continue with Google"). Flol stores no passwords
  (Craig, 13 Nov 2026: "Google only so we don't store passwords"; Discord added on his "Your
  call"). The email comes from that account.
- Sign-up then asks three things: team name, favourite team and country.
  The favourite team and country place the manager in their supporter and country leagues
  ([spec/08](08-leagues.md)).
- Country is filled in from where the visitor is; the favourite team has no default. Both can
  change until the manager's first gameweek starts, then are fixed (Craig, 15 Nov 2026). The
  sheet says when: "Both lock when your first gameweek starts: Wed 07:45."
- One tick: "I'm 16 or over and accept the Terms and Privacy", unticked. Save team stays off
  until it is ticked, a team picked and a team name typed (spaces alone count as empty; Craig,
  17 Nov 2026), and the account is made on Save team, not at the Google
  or Discord step (Craig, 15 Nov 2026). The account keeps when they agreed and to which version.
- On Save team, one cheer: "Baron Steal FC is in. 화이팅!" (the team's own name; Craig, 17 Nov
  2026).
- On Save team the squad is bought at that moment's prices. If a deadline has moved prices since
  it was picked and it no longer fits, Save team stays off and the bar says by how much, such
  as ₩0.3m over, until a swap (Craig, 17 Nov 2026).
- After Save team the new manager lands on Pick Team, their saved team, as FPL. Their Captain
  starts as the highest-priced starter, changeable there (Craig, 17 Nov 2026).
- Team names are as in FPL: free text, need not be unique, with a length cap, and offensive names
  can be removed. Example: two managers can both be called Faker's Chair.

## Signing in again

- A returning manager uses the Log in link on the pick-a-team page, with the same Google or
  Discord account.
- A guest with a saved squad who logs in to an account that already has a team gets the
  account's team; the guest squad is dropped, with no question (Craig, 17 Nov 2026).
- A manager stays signed in on that device until they sign out, as in FPL. Sign out is in
  Settings ([spec/12](12-pages.md)).

## Joining late

- As in FPL: a manager who joins mid-season starts on 0 points, scores from their first deadline,
  and can change their squad freely until then. Example: join in gameweek 5 and the squad first
  scores in gameweek 6 if gameweek 5's deadline has passed.

## Later

- A guided tour or rules walkthrough for newcomers. The beta has the Help page only.
