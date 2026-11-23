# Settings

The manager's team, display, emails and account, in four tabs (spec/12, Settings), and the sign-up sheet on Save over Pick Team (spec/09, Signing up). Settings opens from the team name at the right of the top bar.

**Approved:** Craig, 15 Nov 2026. He asked for GDPR to be covered and took every recommendation (Download my data, no cookie banner, a 16+ tick, Privacy and Terms with a contact, a public-data line, erase at once). Then he said "maybe get differen tparts into tabs", that the favourite team can't change in the season, that both lock "once your first gameweek starts", and answered the last calls: "1 save team 2 your call 3 ok 4 your call 5 just text is fine no need for draw, do some basics and file". The names and numbers are a made-up LCK Cup Week 4, the Transfers picture's moment, with Home's Baron Steal FC; not roster data. There is no `plate.md` yet, so this binds layout, content and order, not colour or type. The source is `settings.html`, and its brief is [docs/design/proposals/2026-11-16-settings/](../../proposals/2026-11-16-settings/).

**Changed by Craig, 16 Nov 2026:** the banner preview is the hangul and team name, as Profile's banner (no favourite team and country line); the Delete sheet names the team in its sentence only.

| File | Shows |
|---|---|
| `1440.png`, `settings.html` | Team tab, one unsaved change |
| `1440-display.png`, `settings.html#display` | Display tab |
| `1440-emails.png`, `settings.html#emails` | Emails tab |
| `1440-account.png`, `settings.html#account` | Account tab |
| `1440-delete.png`, `settings.html#delete` | The Delete account sheet |
| `1440-signup1.png`, `settings.html#signup1` | Sign-up step 1, over Pick Team |
| `1440-signup2.png`, `settings.html#signup2` | Sign-up step 2, before a team is picked |

## Borrowed

- **FPL**: Team Details apart from the account; a 20-character team name with a counter.
- **Profile** (approved): the hangul banner in the favourite team's colours, here as a live preview.
- **Leagues** (approved): the tabs, and the delete sheet's shape and black button.
- **Pick Team** (approved): the change bar with Reset and Save.
- **Korean sites**: 회원 탈퇴, leaving the service, as its own quiet step at the foot.

## Controls

- **Team name** (top bar, with ▾): opens Settings and Sign out.
- **Tabs**: Team | Display | Emails | Account. A tab with unsaved changes carries a dot (Team •).
- **Team name, Hangul banner**: text, 20 characters each, with a counter. The banner is optional; its preview redraws as you type.
- **Favourite team, Country**: plain text with the tag `Locked` once the first deadline has passed; before then, dropdowns.
- **Time zone**: Browser (the zone it reports) or one picked from a list; the next deadline shows in it.
- **Theme**: Device | Light | Dark.
- **Deadline reminder, Weekly recap**: On | Off each, both Off for a new manager. The address they go to is shown.
- **Save bar**: the changes on every tab, Reset and Save. Absent when nothing has changed, and on Account.
- **Sign out**: signs out on this device.
- **Download my data**: saves a JSON file at once.
- **Delete account**: opens the sheet: what goes, each private league you made and who it passes to, then Back or Delete account.
- **Privacy, Terms**: the two text pages ([docs/legal/](../../../legal/)).
- **Sign-up step 1**: Continue with Google or Discord.
- **Sign-up step 2**: team name, favourite team (no default), country (filled in from where the visitor is), the 16+ tick. Save team is grey until a team is picked and the box ticked; the account is made on Save team.

## Placeholders

| What | Issue |
|---|---|
| Sign-in, sign-up, team name, favourite team, country | #42 |
| Leagues and their ranks | #38 |
| Gameweeks and the lock's deadline | #33 |
| Follows | #90 |
| The privacy email, until Flol has a domain | none |
| Hangul banner | spec/13, no issue |
