// @vitest-environment node
import { describe, expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { DeleteSheet } from "./DeleteSheet";
import { BROWSER_ZONE, COUNTRIES, DEADLINE_AT, DELETE_ROWS, SAVED, SIGN_UP, SQUAD_SIZE } from "./fixtures";
import { Settings } from "./index";
import { canSaveTeam, capName, changedFields, changeLine, counter, dirtyTabs, timeIn, type SettingsTab } from "./settings";
import { SignUpStepOne, SignUpStepTwo } from "./SignUp";

const noop = () => {};

/** Fails unless every piece is in the markup, each after the one before. */
function expectInOrder(markup: string, pieces: string[]) {
  let from = 0;
  for (const piece of pieces) {
    const at = markup.indexOf(piece, from);
    expect(at, `"${piece}" after position ${from}`).toBeGreaterThanOrEqual(0);
    from = at + piece.length;
  }
}

const settingsOn = (tab: SettingsTab, props: Partial<Parameters<typeof Settings>[0]> = {}) =>
  html(<Settings firstTab={tab} browserZone={BROWSER_ZONE} {...props} />);

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
      'aria-pressed="true">Team •<',
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
      "T1 · United Kingdom",
      "Favourite team",
      ">T1<",
      "Locked",
      "Country",
      ">United Kingdom<",
      "Locked",
      ...SAVE_BAR,
      ...FOOT,
    ]);
  });

  test("Display: the browser's zone, the deadline in it and in KST, and the theme", () => {
    const out = settingsOn("Display");
    expectInOrder(out, [">Team •<", 'aria-pressed="true">Display<', "Time zone", "Browser · Europe/London", "Deadline", "Wed 07:45", "16:45 KST", "Theme"]);
    expectInOrder(text(<Settings firstTab="Display" browserZone={BROWSER_ZONE} />), ["DeviceLightDark", ...SAVE_BAR, ...FOOT]);
    expect(out).toMatch(/aria-pressed="true">Device</);
  });

  test("Emails: reminder on, recap off, and the address they go to", () => {
    const out = text(<Settings firstTab="Emails" browserZone={BROWSER_ZONE} />);
    expectInOrder(out, ["Deadline reminder", "24 hours before", "OnOff", "Weekly recap", "Once the week is final", "OnOff", "Sent to barons.steal.fc@gmail.com", ...SAVE_BAR, ...FOOT]);
    expectInOrder(settingsOn("Emails"), ['aria-pressed="true">On<', 'aria-pressed="true">Off<']);
  });

  test("Account: email and Sign out, what is public, Download my data, Delete account, and no save bar", () => {
    const out = text(<Settings firstTab="Account" browserZone={BROWSER_ZONE} />);
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

  test("with nothing unsaved there is no save bar and no tab carries a dot", () => {
    const out = text(<Settings draft={SAVED} browserZone={BROWSER_ZONE} />);
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
    "Team and squadBaron Steal FC",
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

  test("step 2 asks name, team and country, says when they lock, and holds Save team until a team and the tick", () => {
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
  });
});

describe("the rules", () => {
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

  test("Save team needs a team and the tick", () => {
    expect(canSaveTeam(null, true)).toBe(false);
    expect(canSaveTeam("T1", false)).toBe(false);
    expect(canSaveTeam("T1", true)).toBe(true);
  });
});
