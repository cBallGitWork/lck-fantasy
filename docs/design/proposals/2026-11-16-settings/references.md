# Settings: references

Research for Settings and the sign-up sheet (spec/12, spec/09). Gathered 15 Nov 2026 with web search and fetch only. Anything not seen on a fetched page or in a search result is marked **Unverified**. FPL's signed-in screens were not seen; the repo's survey could not see them either (`docs/research/fantasy-site-pages-survey.md`).

## 1. FPL: Team Details

- The team name is changed on **Team Details**, reached from the **Admin** panel on Pick Team (left on desktop, at the foot on a phone browser). Source: https://www.fantasyfootballhub.co.uk/articles/how-to-change-your-fpl-team-name
- Up to 20 characters, spaces included, changeable any number of times, no points lost. Source: same; search summary of https://onefpl.com/blog/fantasy-premier-league-change-team-name
- The FAQ asks "How do I change my team name or the team I support?"; its answer was collapsed. Source: repo `docs/research/fantasy-site-pages/fpl.md`, citing https://fantasy.premierleague.com/en/help/faqs
- Whether kit and favourite club sit on the same page: **Unverified**.
- The PL may change, suspend or delete offensive names; each entry page has "Report Offensive Name". Source: repo `fpl.md`.

**Teaches:** the team's details live with the game, not the account. A 20-character cap.

## 2. FPL: the account, emails and reminders

- On the web, log in, click your initials top right, then **myPL Settings > Email preferences** and turn on "Premier League emails". Source: https://www.premierleague.com/news/4490908
- Deadline reminders: in the app, **More > myPL Settings > Notifications > Fantasy Premier League > Deadline reminders**. By email they come in the Friday newsletter before the deadline. A calendar feed (ECAL) is a third way. Source: same.
- The PL site footer has an **Appearance** setting (`premierleague.com/en/settings/appearance`). Source: repo `fpl.md`.
- Delete: from the account settings' management area, then confirm; it removes access to FPL. Source: search summary of https://www.premierleague.com/en/about/faq/website
- An older FAQ: logging back in within 21 days reactivates a deleted account; Google, Facebook, X or Apple sign-ins cannot. Source: https://premierleague.com/news/844577

**Teaches:** the account sits under the initials, top right; emails are opt-in toggles; delete is one confirm. Flol's two emails are its own: FPL folds the reminder into a newsletter.

## 3. Sign-in

- spec/09 copies UCL Fantasy: pick first, sign up on Save. The survey's notes on UCL's flow are in `docs/research/onboarding-acquisition.md` and `fantasy-onboarding-standards.md`.
- "Continue with Google" and Discord are the providers' own buttons; their brand rules apply to the drawing. Google's: https://developers.google.com/identity/branding-guidelines (not fetched this round, **Unverified** detail).

**Teaches:** the sheet is two steps: a provider button, then three fields.

## 4. Korean feel

- Naver puts 회원탈퇴 (leave the service) at the foot of the page; you agree to a notice listing what is deleted, then confirm. Source: search summary of https://specialmanual.com/%EB%84%A4%EC%9D%B4%EB%B2%84-%ED%9A%8C%EC%9B%90-%ED%83%88%ED%87%B4-%EB%B0%A9%EB%B2%95-2%EA%B0%80%EC%A7%80-%EC%95%84%EC%9D%B4%EB%94%94-%EA%B3%84%EC%A0%95-%EC%82%AD%EC%A0%9C/ (a blog, not Naver's help).
- A 2025 privacy check found sites signed into with Naver often kept data after the user left. Source: https://m.boannews.com/html/detail.html?idx=135941

**Teaches:** delete as a quiet last step at the foot, with what goes listed plainly. Flol's "and its data" (spec/12) should be meant.

- Korean labels a drawing could pair with English, as Home pairs tiers with hangul: 설정 (settings), 내 정보 (my details), 알림 (notifications), 로그아웃 (sign out), 회원 탈퇴. Common usage; no single page checked, **Unverified** per site.
- The hangul banner preview: the profile picture's GEN black and gold banner (`approved/profile/`).

## 5. Flol's own approved parts

- `approved/profile/`: the hangul banner in the favourite team's colours.
- `approved/home/`: "Wed 07:45 your time · 16:45 KST" on the deadline card.
- `approved/leagues/` (`1440-delete.png`): the Delete league confirm.
- `approved/transfers/` (`1440-confirm.png`): a confirm sheet, Back or Confirm.
- `approved/pick-team/`: Save in a bar, disabled with no changes.
