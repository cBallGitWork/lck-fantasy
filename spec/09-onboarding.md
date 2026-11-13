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
  FPL have.
- A guest's squad is kept in that browser if they leave before signing up. Example: close the
  tab, come back tomorrow, and the squad is still there. It is not entered or scored until
  sign-up.

## Signing up

- Sign-up is asked on Save, once all 9 are picked and the squad is valid.
- It asks four things: email (sign-in by an emailed link), team name, favourite team and country.
  The favourite team and country place the manager in their supporter and country leagues
  ([spec/08](08-leagues.md)).
- Country is filled in from where the visitor is. Like the favourite team, it can change until
  the manager's first gameweek scores; after that it is fixed.
- Team names are as in FPL: free text, need not be unique, with a length cap, and offensive names
  can be removed. Example: two managers can both be called Faker's Chair.

## Joining late

- As in FPL: a manager who joins mid-season starts on 0 points, scores from their first deadline,
  and can change their squad freely until then. Example: join in gameweek 5 and the squad first
  scores in gameweek 6 if gameweek 5's deadline has passed.

## Later

- A guided tour or rules walkthrough for newcomers. The beta has the Help page only.
