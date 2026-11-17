// @vitest-environment node
import { describe, expect, test } from "vitest";
import { timeIn } from "../../parts";
import { expectDeadlinePart, expectInOrder, html, noop, text } from "../../testing/render";
import { DeleteSheet } from "./DeleteSheet";
import { BROWSER_ZONE, COUNTRIES, DEADLINE_AT, DELETE_ROWS, DRAFT, REMINDER_HOURS, SAVED, SIGN_UP, SQUAD_SIZE } from "./fixtures";
import { Settings } from "./index";
import { canSaveTeam, capName, changedFields, changeLine, counter, dirtyTabs, hoursBefore, joinedCheer, type SettingsTab } from "./settings";
import { SignUpStepOne, SignUpStepTwo } from "./SignUp";

const PICTURE = { draft: DRAFT, browserZone: BROWSER_ZONE };

const settingsOn = (tab: SettingsTab, props: Partial<Parameters<typeof Settings>[0]> = {}) =>
  html(<Settings firstTab={tab} {...PICTURE} {...props} />);

const SAVE_BAR = ["1 change: hangul banner", "Reset", "Save"];
const FOOT = ["Privacy ›", "Terms ›", "privacy email"];

describe("Settings, each tab as its picture draws it", () => {
  test("Team: name, banner and its preview, locked favourite team and country, the save bar, the foot", () => {
    const out = settingsOn("Team");
    expect(out).toContain('data-screen="settings"');
    expectInOrder(out, [
      "Baron Steal FC ▾",
      "Settings",
      "설정",
      'aria-selected="true"',
      ">Team •<",
      ">Display<",
      ">Emails<",
      ">Account<",
      "Team name",
      'value="Baron Steal FC"',
      "14/20",
      "Hangul banner",
      "Optional",
      'value="바론 스틸 FC"',
      "8/20",
      ">바론 스틸 FC<",
      "Baron Steal FC",
      "Favourite team",
      ">T1<",
      "Locked",
      "Country",
      ">United Kingdom<",
      "Locked",
      ...SAVE_BAR,
      ...FOOT,
    ]);
    expect(out).not.toContain("T1 · United Kingdom");
  });

  test("with no banner, the preview greys 배너 in the hangul's place", () => {
    const out = settingsOn("Team", { draft: { ...DRAFT, banner: "" } });
    expectInOrder(out, ["0/20", 'class="settings__banner-hangul settings__banner-hangul--empty" lang="ko">배너<', "Baron Steal FC"]);
    expect(settingsOn("Team")).not.toContain("settings__banner-hangul--empty");
  });

  test("the foot links Privacy and Terms", () => {
    expectInOrder(settingsOn("Team"), ['href="/privacy"', "Privacy ›", 'href="/terms"', "Terms ›"]);
  });

  test("Display: the browser's zone, the deadline in it and in KST, and the theme", () => {
    const out = settingsOn("Display");
    expectInOrder(out, [">Team •<", 'aria-selected="true"', ">Display<", "Time zone", "Browser · Europe/London", "Deadline", "Wed 07:45", "16:45 KST", "Theme"]);
    expectInOrder(text(<Settings firstTab="Display" {...PICTURE} />), ["DeviceLightDark", ...SAVE_BAR, ...FOOT]);
    expect(out).toMatch(/aria-pressed="true">Device</);
  });

  test("Display's deadline is the Deadline part, as on Pick Team", () => {
    expectDeadlinePart(settingsOn("Display"), "Wed 07:45");
  });

  test("Emails: both off by default (spec/12), the reminder's lead time, and the address they go to", () => {
    const out = text(<Settings firstTab="Emails" {...PICTURE} />);
    expectInOrder(out, ["Deadline reminder", hoursBefore(REMINDER_HOURS), "OnOff", "Weekly recap", "Once the week is final", "OnOff", "Sent to barons.steal.fc@gmail.com", ...SAVE_BAR, ...FOOT]);
    expect([SAVED.deadlineReminder, SAVED.weeklyRecap]).toEqual([false, false]);
    const markup = settingsOn("Emails");
    expectInOrder(markup, ['aria-pressed="true">Off<', 'aria-pressed="true">Off<']);
    expect(markup).not.toContain('aria-pressed="true">On<');
  });

  test("Emails: the reminder's lead time comes from data, not the page", () => {
    expect(hoursBefore(24)).toBe("24 hours before");
    expect(hoursBefore(1)).toBe("1 hour before");
    expect(text(<Settings firstTab="Emails" browserZone={BROWSER_ZONE} reminderHours={12} />)).toContain("12 hours before");
  });

  test("Account: email and Sign out, what is public, Download my data, Delete account, and no save bar", () => {
    const out = text(<Settings firstTab="Account" {...PICTURE} />);
    expectInOrder(out, [
      "Email",
      "G",
      "barons.steal.fc@gmail.com",
      "from Google",
      "Sign out",
      "Public",
      "Team name, favourite team, country, banner, points",
      "Your data",
      "Download my data",
      "Delete account",
      ...FOOT,
    ]);
    expect(out).not.toContain("change:");
  });

  test("it opens with nothing unsaved: no save bar and no tab carries a dot", () => {
    const out = text(<Settings browserZone={BROWSER_ZONE} />);
    expect(out).not.toContain("change:");
    expect(out).not.toContain("•");
  });

  test("before the first deadline, favourite team and country are dropdowns", () => {
    const out = settingsOn("Team", { locked: false });
    expect(out).not.toContain("Locked");
    expectInOrder(out, ['aria-label="Favourite team"', ">Gen.G<", 'aria-label="Country"', ">South Korea<"]);
  });
});

test("the Delete sheet lists what goes, then Back and Delete account", () => {
  const out = text(<DeleteSheet team={SAVED.teamName} rows={DELETE_ROWS} onBack={noop} onDelete={noop} onDownload={noop} />);
  expectInOrder(out, [
    "Delete account?",
    "Baron Steal FC is erased at once and can't be brought back.",
    "Team and squad",
    "Points and historyWeeks 1–3 · 187 pts",
    "Ranks in 5 leaguesOverall, United Kingdom, T1, 2 private",
    "Follows12 following · 9 followers",
    "Pub Leaguepasses to Haru's Tower Divers",
    "Backups clear within 30 days. Download my data first to keep a copy.",
    "Back",
    "Delete account",
  ]);
});

describe("sign-up", () => {
  test("step 1 offers Google and Discord", () => {
    const out = text(<SignUpStepOne squadSize={SQUAD_SIZE} onContinue={noop} onClose={noop} />);
    expectInOrder(out, ["Save your team", "1 of 2", "Your squad of 9 is kept while you sign up.", "GContinue with Google", "DContinue with Discord", "No password is stored.", ...FOOT.slice(0, 2)]);
  });

  test("step 2 asks name, team and country, says when they lock, and holds Save team until a name, a team and the tick", () => {
    const step = (answers = SIGN_UP) =>
      html(
        <SignUpStepTwo
          answers={answers}
          onChange={noop}
          countries={COUNTRIES}
          deadline={timeIn(DEADLINE_AT, BROWSER_ZONE)}
          onBack={noop}
          onSave={noop}
          onClose={noop}
        />,
      );
    const out = step();
    expectInOrder(out, [
      "Your team",
      "2 of 2",
      "Team name",
      'value="Baron Steal FC"',
      "14/20",
      "Favourite team",
      "Choose a team",
      "Country",
      'value="United Kingdom" selected',
      "Both lock at your first deadline:",
      "Wed 07:45",
      "16:45 KST",
      "I&#x27;m 16 or over and accept the",
      "Terms",
      "Privacy",
      "Back",
      "Save team",
    ]);
    expect(out).toMatch(/disabled="">Save team/);
    expect(step({ ...SIGN_UP, favouriteTeam: "T1", ticked: true })).not.toMatch(/disabled="">Save team/);
    expect(step({ ...SIGN_UP, teamName: "  ", favouriteTeam: "T1", ticked: true })).toMatch(/disabled="">Save team/);
    expectInOrder(out, ["accept the", 'href="/terms"', ">Terms<", 'href="/privacy"', ">Privacy<"]);
  });
});

describe("the rules", () => {
  test("Save team cheers the new team by its name", () => {
    expect(joinedCheer("Baron Steal FC")).toBe("Baron Steal FC is in. 화이팅!");
    expect(joinedCheer("  Baron Steal FC ")).toBe("Baron Steal FC is in. 화이팅!");
  });

  test("the save bar names every change, and their tabs carry the dot", () => {
    const draft = { ...SAVED, banner: "바론", theme: "Dark" as const, weeklyRecap: true };
    const changed = changedFields(SAVED, draft);
    expect(changeLine(changed)).toBe("3 changes: hangul banner, theme, weekly recap");
    expect([...dirtyTabs(changed)]).toEqual(["Team", "Display", "Emails"]);
    expect(changedFields(SAVED, SAVED)).toEqual([]);
  });

  test("names count hangul one each and stop at 20", () => {
    expect(counter("바론 스틸 FC")).toBe("8/20");
    expect(capName("Baron Steal FC Baron Steal")).toBe("Baron Steal FC Baron");
    expect(capName("가".repeat(25))).toBe("가".repeat(20));
  });

  test("the deadline shows in the chosen zone, then KST", () => {
    expect(timeIn(DEADLINE_AT, "Europe/London")).toEqual({ local: "Wed 07:45", kst: "16:45" });
    expect(timeIn(DEADLINE_AT, "America/New_York")).toEqual({ local: "Wed 02:45", kst: "16:45" });
    expect(timeIn(DEADLINE_AT, "Asia/Seoul")).toEqual({ local: "Wed 16:45", kst: "16:45" });
  });

  test("Save team needs a name, a team and the tick; spaces alone are no name", () => {
    expect(canSaveTeam("Baron Steal FC", null, true)).toBe(false);
    expect(canSaveTeam("Baron Steal FC", "T1", false)).toBe(false);
    expect(canSaveTeam("", "T1", true)).toBe(false);
    expect(canSaveTeam("   ", "T1", true)).toBe(false);
    expect(canSaveTeam("Baron Steal FC", "T1", true)).toBe(true);
  });
});
