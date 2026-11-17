import { useState } from "react";
import { browserZone, SAVED_NEWS, useAnnounce, useDevState } from "../../parts";
import { DeleteSheet } from "./DeleteSheet";
import { ACCOUNT, BROWSER_ZONE, COUNTRIES, DEADLINE_AT, DELETE_ROWS, DRAFT, LOCKED, REMINDER_HOURS, SAVED, ZONES } from "./fixtures";
import type { Account, DeleteRow, SettingsTab, SettingsValues } from "./settings";
import { SettingsPage } from "./SettingsPage";

const DATA_FILE = "flol-data.json";

/** Until the backend (#42) feeds an action, using it warns rather than doing nothing. */
const notConnected = (action: string) => () => console.warn(`Settings: ${action} is not connected to the backend yet (#42)`);

/** Saves the manager's data as a JSON file at once; until #42 it holds settings and account only. */
function saveJson(data: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = DATA_FILE;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * The Settings route, on the picture's made-up data until the backend (#42) feeds it, opening with nothing
 * changed. `?state=` opens a picture, in dev: the Team, Display or Emails tab with its unsaved banner, Account,
 * or the Delete account sheet.
 */
export function SettingsScreen() {
  const dev = useDevState<{ firstTab: SettingsTab; draft?: SettingsValues; deleting?: true }>({
    settings: { firstTab: "Team", draft: DRAFT },
    display: { firstTab: "Display", draft: DRAFT },
    emails: { firstTab: "Emails", draft: DRAFT },
    account: { firstTab: "Account" },
    delete: { firstTab: "Account", deleting: true },
  });
  return <Settings {...dev} />;
}

/** Settings (docs/design/approved/settings/), holding the draft (the saved settings, unless given) until Save; the backend saves, signs out and deletes for real. */
export function Settings({
  saved: savedAtStart = SAVED,
  draft: draftAtStart = savedAtStart,
  account = ACCOUNT,
  locked = LOCKED,
  deadlineAt = DEADLINE_AT,
  reminderHours = REMINDER_HOURS,
  browserZone: zone = browserZone() || BROWSER_ZONE,
  zones = ZONES,
  countries = COUNTRIES,
  deleteRows = DELETE_ROWS,
  firstTab = "Team",
  deleting: deletingAtStart = false,
  onSave = notConnected("Save"),
  onSignOut = notConnected("Sign out"),
  onDeleteAccount = notConnected("Delete account"),
}: {
  saved?: SettingsValues;
  draft?: SettingsValues;
  account?: Account;
  locked?: boolean;
  deadlineAt?: string;
  reminderHours?: number;
  browserZone?: string;
  zones?: string[];
  countries?: string[];
  deleteRows?: DeleteRow[];
  firstTab?: SettingsTab;
  /** The Delete account sheet opens at once. */
  deleting?: boolean;
  onSave?: (values: SettingsValues) => void;
  onSignOut?: () => void;
  onDeleteAccount?: () => void;
}) {
  const [tab, setTab] = useState<SettingsTab>(firstTab);
  const [saved, setSaved] = useState(savedAtStart);
  const announce = useAnnounce();
  const [draft, setDraft] = useState(draftAtStart);
  const [deleting, setDeleting] = useState(deletingAtStart);
  const download = () => saveJson({ settings: saved, account });
  return (
    <>
      <SettingsPage
        tab={tab}
        onTab={setTab}
        saved={saved}
        draft={draft}
        onChange={(patch) => setDraft({ ...draft, ...patch })}
        onReset={() => setDraft(saved)}
        onSave={() => {
          setSaved(draft);
          onSave(draft);
          announce(SAVED_NEWS);
        }}
        account={account}
        locked={locked}
        deadlineAt={deadlineAt}
        reminderHours={reminderHours}
        browserZone={zone}
        zones={zones}
        countries={countries}
        onSignOut={onSignOut}
        onDownload={download}
        onDelete={() => setDeleting(true)}
      />
      {deleting && (
        <DeleteSheet team={saved.teamName} rows={deleteRows} onBack={() => setDeleting(false)} onDelete={onDeleteAccount} onDownload={download} />
      )}
    </>
  );
}
