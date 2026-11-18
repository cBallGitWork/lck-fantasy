import { useId, type ReactNode } from "react";
import { TEAMS } from "../../fixtures/week3";
import {
  cx,
  Deadline,
  MainAction,
  OutlinedKey,
  PageFrame,
  PageHead,
  Placeholder,
  plainOptions,
  ProviderMark,
  Select,
  TabPanel,
  Tabs,
  Tag,
  timeIn,
  ViewToggle,
} from "../../parts";
import { CappedInput, LegalNames, Row, TEAM_OPTIONS } from "./form";
import {
  BROWSER,
  changedFields,
  dirtyTabs,
  TABS,
  THEMES,
  zoneOf,
  type Account,
  type SettingsTab,
  type SettingsValues,
  type ThemeChoice,
} from "./settings";
import "./settings.css";
import { browserZoneLabel, changeLine, fromProvider, hoursBefore, sentTo, TAB_NAMES, THEME_NAMES, WORDS } from "./words";

const ON_OFF = [
  { value: "on", label: WORDS.on },
  { value: "off", label: WORDS.off },
] as const;
const THEME_OPTIONS = THEMES.map((value) => ({ value, label: THEME_NAMES[value] }));

/** Settings' data from the backend, and what the manager does with it. */
export interface SettingsProps {
  tab: SettingsTab;
  onTab: (tab: SettingsTab) => void;
  saved: SettingsValues;
  draft: SettingsValues;
  onChange: (patch: Partial<SettingsValues>) => void;
  onReset: () => void;
  onSave: () => void;
  account: Account;
  /** The first deadline has passed: favourite team and country no longer change. */
  locked: boolean;
  /** The next deadline, as an instant. */
  deadlineAt: string;
  /** How many hours before a deadline the reminder email goes. */
  reminderHours: number;
  browserZone: string;
  zones: string[];
  countries: string[];
  onSignOut: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

/** Settings: the head, the four tabs, the chosen tab, the save bar while anything is unsaved, then the foot. */
export function SettingsPage(props: SettingsProps) {
  const { tab, onTab, saved, draft, onReset, onSave } = props;
  const changed = changedFields(saved, draft);
  const dirty = dirtyTabs(changed);
  const tabLabel = (t: SettingsTab) => (dirty.has(t) ? `${TAB_NAMES[t]}${WORDS.dirtyMark}` : TAB_NAMES[t]);
  const tabsId = useId();
  return (
    <PageFrame screen="settings" account={saved.teamName}>
      <PageHead title={WORDS.title} hangul={WORDS.hangul} />
      <Tabs
        id={tabsId}
        label={WORDS.tabs}
        tabs={TABS.map(tabLabel)}
        chosen={tabLabel(tab)}
        onChoose={(label) => onTab(TABS.find((t) => tabLabel(t) === label) ?? tab)}
      />
      <TabPanel id={tabsId} className="settings__column">
        {tab === "Team" && <TeamTab {...props} />}
        {tab === "Display" && <DisplayTab {...props} />}
        {tab === "Emails" && <EmailsTab {...props} />}
        {tab === "Account" && <AccountTab {...props} />}
      </TabPanel>
      {tab !== "Account" && changed.length > 0 && (
        <div className="settings__save-bar">
          <span className="settings__save-line">{changeLine(changed)}</span>
          <button type="button" className="settings__text-key" onClick={onReset}>
            {WORDS.reset}
          </button>
          <MainAction onClick={onSave}>{WORDS.save}</MainAction>
        </div>
      )}
      <LegalFoot />
    </PageFrame>
  );
}

/** Your team's banner as Profile shows it, redrawn as you type: the hangul and the team name (favourite team and country are the rows below). */
function Banner({ values }: { values: SettingsValues }) {
  return (
    <div className="settings__banner">
      <span className={cx("settings__banner-hangul", !values.banner && "settings__banner-hangul--empty")} lang="ko">
        {values.banner || WORDS.emptyBanner}
      </span>
      <b className="settings__banner-name">{values.teamName}</b>
    </div>
  );
}

function Locked({ children }: { children: ReactNode }) {
  return (
    <span className="settings__locked">
      <b className="settings__locked-value">{children}</b>
      <Tag>{WORDS.locked}</Tag>
    </span>
  );
}

/** Team: name, hangul banner and its preview, favourite team, country. */
function TeamTab({ draft, onChange, locked, countries }: SettingsProps) {
  return (
    <section>
      <Row label={WORDS.teamName}>
        <CappedInput label={WORDS.teamName} value={draft.teamName} onChange={(teamName) => onChange({ teamName })} />
      </Row>
      <Row label={WORDS.banner} note={WORDS.optional}>
        <CappedInput label={WORDS.banner} value={draft.banner} onChange={(banner) => onChange({ banner })} />
        <Banner values={draft} />
      </Row>
      <Row label={WORDS.favouriteTeam}>
        {locked ? (
          <Locked>{TEAMS[draft.favouriteTeam]}</Locked>
        ) : (
          <Select label={WORDS.favouriteTeam} value={draft.favouriteTeam} options={TEAM_OPTIONS} onChange={(favouriteTeam) => onChange({ favouriteTeam })} />
        )}
      </Row>
      <Row label={WORDS.country}>
        {locked ? (
          <Locked>{draft.country}</Locked>
        ) : (
          <Select label={WORDS.country} value={draft.country} options={plainOptions(countries)} onChange={(country) => onChange({ country })} />
        )}
      </Row>
    </section>
  );
}

/** Display: time zone, with the next deadline in it and in KST; theme. */
function DisplayTab({ draft, onChange, browserZone, zones, deadlineAt }: SettingsProps) {
  const zoneOptions = [{ value: BROWSER, label: browserZoneLabel(browserZone) }, ...plainOptions(zones)];
  const deadline = timeIn(deadlineAt, zoneOf(draft.timeZone, browserZone));
  return (
    <section>
      <Row label={WORDS.timeZone}>
        <Select label={WORDS.timeZone} value={draft.timeZone} options={zoneOptions} onChange={(timeZone) => onChange({ timeZone })} />
        <p className="settings__sub quiet">
          <Deadline {...deadline} />
        </p>
      </Row>
      <Row label={WORDS.theme}>
        <ViewToggle<ThemeChoice> label={WORDS.theme} options={THEME_OPTIONS} chosen={draft.theme} onChoose={(theme) => onChange({ theme })} />
      </Row>
    </section>
  );
}

function OnOffRow({ label, when, on, onChoose }: { label: string; when: string; on: boolean; onChoose: (on: boolean) => void }) {
  return (
    <Row label={label}>
      <span className="settings__switch">
        <span className="settings__switch-when">{when}</span>
        <ViewToggle label={label} options={ON_OFF} chosen={on ? "on" : "off"} onChoose={(choice) => onChoose(choice === "on")} />
      </span>
    </Row>
  );
}

/** Emails: the deadline reminder and the weekly recap, and the address they go to. */
function EmailsTab({ draft, onChange, account, reminderHours }: SettingsProps) {
  return (
    <section>
      <OnOffRow label={WORDS.deadlineReminder} when={hoursBefore(reminderHours)} on={draft.deadlineReminder} onChoose={(deadlineReminder) => onChange({ deadlineReminder })} />
      <OnOffRow label={WORDS.weeklyRecap} when={WORDS.recapWhen} on={draft.weeklyRecap} onChoose={(weeklyRecap) => onChange({ weeklyRecap })} />
      <p className="settings__sub quiet settings__sent-to">{sentTo(account.email)}</p>
    </section>
  );
}

/** Account: the email and Sign out, what is public, Download my data, then Delete account. */
function AccountTab({ account, onSignOut, onDownload, onDelete }: SettingsProps) {
  return (
    <>
      <section>
        <Row label={WORDS.email}>
          <span className="settings__acts">
            <span className="settings__email">
              <span>
                <ProviderMark provider={account.provider} />
                {account.email}
              </span>
              <span className="quiet">{fromProvider(account.provider)}</span>
            </span>
            <OutlinedKey onClick={onSignOut}>{WORDS.signOut}</OutlinedKey>
          </span>
        </Row>
        <Row label={WORDS.public}>
          <p className="settings__public">{WORDS.publicList}</p>
        </Row>
        <Row label={WORDS.yourData}>
          <OutlinedKey onClick={onDownload}>{WORDS.download}</OutlinedKey>
        </Row>
      </section>
      <div className="settings__danger">
        <OutlinedKey onClick={onDelete}>{WORDS.deleteAccount}</OutlinedKey>
      </div>
    </>
  );
}

function LegalFoot() {
  return (
    <div className="settings__foot quiet">
      <LegalNames />
      <Placeholder word={WORDS.privacyEmail} />
    </div>
  );
}
