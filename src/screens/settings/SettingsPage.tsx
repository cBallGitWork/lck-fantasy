import { useId, type ReactNode } from "react";
import { TEAMS } from "../../fixtures/week3";
import { MainAction, OutlinedKey, PageFrame, PageHead, Placeholder, TabPanel, Tabs, Tag, Time, timeIn, ViewToggle } from "../../parts";
import { CappedInput, LegalNames, plainOptions, ProviderMark, Row, Select, TEAM_OPTIONS } from "./form";
import {
  BROWSER,
  changedFields,
  changeLine,
  dirtyTabs,
  hoursBefore,
  TABS,
  THEMES,
  zoneOf,
  type Account,
  type SettingsTab,
  type SettingsValues,
  type ThemeChoice,
} from "./settings";
import "./settings.css";

const ON_OFF = ["On", "Off"] as const;
const DIRTY_MARK = " •";

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
  const tabLabel = (t: SettingsTab) => (dirty.has(t) ? `${t}${DIRTY_MARK}` : t);
  const tabsId = useId();
  return (
    <PageFrame screen="settings" account={saved.teamName}>
      <PageHead title="Settings" hangul="설정" />
      <Tabs
        id={tabsId}
        label="Settings"
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
            Reset
          </button>
          <MainAction onClick={onSave}>Save</MainAction>
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
      {values.banner && (
        <span className="settings__banner-hangul" lang="ko">
          {values.banner}
        </span>
      )}
      <b className="settings__banner-name">{values.teamName}</b>
    </div>
  );
}

function Locked({ children }: { children: ReactNode }) {
  return (
    <span className="settings__locked">
      <b className="settings__locked-value">{children}</b>
      <Tag>Locked</Tag>
    </span>
  );
}

/** Team: name, hangul banner and its preview, favourite team, country. */
function TeamTab({ draft, onChange, locked, countries }: SettingsProps) {
  return (
    <section>
      <Row label="Team name">
        <CappedInput label="Team name" value={draft.teamName} onChange={(teamName) => onChange({ teamName })} />
      </Row>
      <Row label="Hangul banner" note="Optional">
        <CappedInput label="Hangul banner" value={draft.banner} onChange={(banner) => onChange({ banner })} />
        <Banner values={draft} />
      </Row>
      <Row label="Favourite team">
        {locked ? (
          <Locked>{TEAMS[draft.favouriteTeam]}</Locked>
        ) : (
          <Select label="Favourite team" value={draft.favouriteTeam} options={TEAM_OPTIONS} onChange={(favouriteTeam) => onChange({ favouriteTeam })} />
        )}
      </Row>
      <Row label="Country">
        {locked ? (
          <Locked>{draft.country}</Locked>
        ) : (
          <Select label="Country" value={draft.country} options={plainOptions(countries)} onChange={(country) => onChange({ country })} />
        )}
      </Row>
    </section>
  );
}

/** Display: time zone, with the next deadline in it and in KST; theme. */
function DisplayTab({ draft, onChange, browserZone, zones, deadlineAt }: SettingsProps) {
  const zoneOptions = [{ value: BROWSER, label: `Browser · ${browserZone}` }, ...plainOptions(zones)];
  const deadline = timeIn(deadlineAt, zoneOf(draft.timeZone, browserZone));
  return (
    <section>
      <Row label="Time zone">
        <Select label="Time zone" value={draft.timeZone} options={zoneOptions} onChange={(timeZone) => onChange({ timeZone })} />
        <p className="settings__sub quiet">
          Deadline <Time {...deadline} />
        </p>
      </Row>
      <Row label="Theme">
        <ViewToggle<ThemeChoice> label="Theme" options={THEMES} chosen={draft.theme} onChoose={(theme) => onChange({ theme })} />
      </Row>
    </section>
  );
}

function OnOffRow({ label, when, on, onChoose }: { label: string; when: string; on: boolean; onChoose: (on: boolean) => void }) {
  return (
    <Row label={label}>
      <span className="settings__switch">
        <span className="settings__switch-when">{when}</span>
        <ViewToggle label={label} options={ON_OFF} chosen={on ? "On" : "Off"} onChoose={(choice) => onChoose(choice === "On")} />
      </span>
    </Row>
  );
}

/** Emails: the deadline reminder and the weekly recap, and the address they go to. */
function EmailsTab({ draft, onChange, account, reminderHours }: SettingsProps) {
  return (
    <section>
      <OnOffRow label="Deadline reminder" when={hoursBefore(reminderHours)} on={draft.deadlineReminder} onChoose={(deadlineReminder) => onChange({ deadlineReminder })} />
      <OnOffRow label="Weekly recap" when="Once the week is final" on={draft.weeklyRecap} onChoose={(weeklyRecap) => onChange({ weeklyRecap })} />
      <p className="settings__sub quiet settings__sent-to">Sent to {account.email}</p>
    </section>
  );
}

/** Account: the email and Sign out, what is public, Download my data, then Delete account. */
function AccountTab({ account, onSignOut, onDownload, onDelete }: SettingsProps) {
  return (
    <>
      <section>
        <Row label="Email">
          <span className="settings__acts">
            <span className="settings__email">
              <span>
                <ProviderMark provider={account.provider} />
                {account.email}
              </span>
              <span className="quiet">from {account.provider}</span>
            </span>
            <OutlinedKey onClick={onSignOut}>Sign out</OutlinedKey>
          </span>
        </Row>
        <Row label="Public">
          <p className="settings__public">Team name, favourite team, country, banner, points</p>
        </Row>
        <Row label="Your data">
          <OutlinedKey onClick={onDownload}>Download my data</OutlinedKey>
        </Row>
      </section>
      <div className="settings__danger">
        <OutlinedKey onClick={onDelete}>Delete account</OutlinedKey>
      </div>
    </>
  );
}

function LegalFoot() {
  return (
    <div className="settings__foot quiet">
      <LegalNames />
      <Placeholder word="privacy email" />
    </div>
  );
}
