# Settings: brief

**The screen.** Settings: the manager's team details, account, display and emails (spec/12, Settings). It was grilled with sign-in on 13 Nov 2026 (docs/decisions.md, Settings and sign-in grill), and the sign-up questions are the same fields, so this round draws two pictures: Settings, and the sign-up sheet on Save (spec/09, Signing up). How a manager reaches Settings is not settled: the approved top bar has no account item. See question 1.

## Jobs

1. Change the team name, any time (spec/12, Settings; spec/09: free text, need not be unique, a length cap).
2. See the email the account uses, from Google or Discord (spec/12; spec/09).
3. Type or change the hangul banner text (spec/12; spec/13, Hangul banner: optional, moderated).
4. Change the favourite team and country until the first gameweek scores; after that see them locked, with why (spec/12; spec/08, Leagues every manager joins).
5. Pick a time zone: the browser's, or one picked. Example: a 16:45 KST deadline shows as 08:45 in London (spec/12).
6. Pick light, dark, or follow the device (spec/12).
7. Turn on or off two emails, both off by default: a deadline reminder 24 hours before, and a weekly recap once the gameweek is final (spec/12).
8. Sign out (spec/12; spec/09, Signing in again).
9. Delete the account and its data (spec/12).
10. **Sign-up sheet:** continue with Google or Discord, then team name, favourite team and country, the country filled in from where the visitor is (spec/09, Signing up).

## Data

| Fact | Spec line | Placeholder |
|---|---|---|
| Sign-in with Google or Discord; no passwords stored; stays signed in | spec/09 | #42 |
| Team name, favourite team, country | spec/09, spec/08 | #42, #38 |
| The lock: first gameweek scored | spec/08; spec/10 (gameweeks) | #33 |
| Hangul banner, shown in the favourite team's colours | spec/13 | spec/13, no issue |
| Deadlines stored in UTC, shown in local time | SPEC.md, What it is | none |
| Emails sent by Resend, 100 a day on the free plan | spec/12 | none |
| Recap: points, rank moves in each league, best player, any protest truck | spec/12; spec/14 | #33, #38, #90 |
| Theme | spec/12 | none |
| Delete account | spec/12 | none |

No issue covers the Settings page itself. #42 covers guest picking and sign-up.

## The moment

The Transfers picture's: LCK Cup Week 4, Tuesday 22:00 London. Weeks 1 to 3 have scored, so the favourite team and country show locked. The manager is Home's: Baron Steal FC, hangul 바론 스틸 FC, a T1 supporter in the United Kingdom, time zone Europe/London from the browser, signed in with Google. The email address is made up. Emails: deadline reminder on, recap off, to show both states.

The sign-up sheet: a guest's valid squad of 9, Save pressed, over the Pick Team picture.

## References to borrow

- **Profile** (approved): the hangul banner in the favourite team's colours, for a preview.
- **Home** (approved): the deadline card's "your time · KST", for the time-zone example.
- **Leagues** (approved): the confirm sheet for Delete league, for Delete account.
- **Transfers** (approved): the confirm sheet's shape: what changes, Back or Confirm.
- **FPL**: Team Details (team name, 20 characters) apart from the account's My Details and Email preferences.
- **Korean sites**: 회원 탈퇴 (leave the service) as its own quiet step at the foot.
- Full notes: [references.md](references.md).

## Not settled by the spec

1. **How is it reached?** FPL's web puts the account under your initials, top right; Team Details sits in Pick Team's Admin panel. Flol's bar ends with the sponsor line. Recommend: the team name or initials at the bar's right, opening Settings and Sign out.
2. **One page, or tabs?** FPL splits the team's details from the account's. Recommend: one page in four parts: Team, Account, Display, Emails.
3. **How do changes save?** FPL's Team Details has a Save. Recommend: toggles and theme save at once; the text fields save with one Save, as Pick Team's.
4. **Team name cap?** spec/09 says a cap, no number. FPL's is 20 characters. Recommend: 20, with a counter.
5. **Hangul banner cap and check?** Not set. Recommend: 12 characters, hangul and spaces only, with a live preview in the team's colours.
6. **The lock's words?** "Locked, with why" is set; the words are not. Example: "Locked: Week 1 has scored." Before the lock, show when it closes? Recommend: yes, "Changeable until Week 1 scores".
7. **The email: read only?** It comes from the Google or Discord account. Recommend: read only, with the provider's mark; no linking of a second provider in the beta.
8. **Time-zone picker?** Recommend: "Browser (Europe/London)" first, then a searchable list of zones, with a preview line: "Deadline Wed 07:45 · 16:45 KST".
9. **Theme default?** The 13 Nov grill says the theme follows the device; spec/12 lists three choices. Recommend: Device by default, three-way switch.
10. **Delete account: what of a private league the manager made?** The maker can't leave without deleting it (spec/08). Example: deleting Baron Steal FC deletes Pub League for all its members? Recommend: ask Craig; FPL's rule was not found.
11. **Delete account: the confirm step, and a grace period?** FPL deletes from account settings after one confirm; an older FAQ gave 21 days to undo by logging back in. Naver lists what will be lost and asks you to agree. Recommend: one sheet listing what goes (team, history, leagues, follows), one Delete, no grace period.
12. **Blocked managers listed here?** Block is on the Following page's followers (approved). Recommend: no list here in the beta.
13. **Sign-up sheet: when does it lock?** Recommend: show the lock rule beside favourite team and country at sign-up, in the same words as question 6.
