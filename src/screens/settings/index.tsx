import { useState } from "react";
import { DeleteSheet } from "./DeleteSheet";
import { ACCOUNT, BROWSER_ZONE, COUNTRIES, DEADLINE_AT, DELETE_ROWS, DRAFT, LOCKED, SAVED, ZONES } from "./fixtures";
import type { Account, DeleteRow, SettingsTab, SettingsValues } from "./settings";
import { SettingsPage } from "./SettingsPage";

const DATA_FILE = "flol-data.json";

/** Saves the manager's data as a JSON file at once. */
function saveJson(data: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = DATA_FILE;
  link.click();
  URL.revokeObjectURL(url);
}

/** The Settings route, on the picture's made-up data until the backend (#42) feeds it. */
export function SettingsScreen() {
  return <Settings />;
}

/** Settings (docs/design/approved/settings/), holding the draft until Save; the backend saves, signs out and deletes for real. */
export function Settings({
  saved: savedAtStart = SAVED,
  draft: draftAtStart = DRAFT,
  account = ACCOUNT,
  locked = LOCKED,
  deadlineAt = DEADLINE_AT,
  browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone || BROWSER_ZONE,
  zones = ZONES,
  countries = COUNTRIES,
  deleteRows = DELETE_ROWS,
  firstTab = "Team",
  onSave,
  onSignOut = () => {},
  onDeleteAccount = () => {},
}: {
  saved?: SettingsValues;
  draft?: SettingsValues;
  account?: Account;
  locked?: boolean;
  deadlineAt?: string;
  browserZone?: string;
  zones?: string[];
  countries?: string[];
  deleteRows?: DeleteRow[];
  firstTab?: SettingsTab;
  onSave?: (values: SettingsValues) => void;
  onSignOut?: () => void;
  onDeleteAccount?: () => void;
}) {
  const [tab, setTab] = useState<SettingsTab>(firstTab);
  const [saved, setSaved] = useState(savedAtStart);
  const [draft, setDraft] = useState(draftAtStart);
  const [deleting, setDeleting] = useState(false);
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
          onSave?.(draft);
        }}
        account={account}
        locked={locked}
        deadlineAt={deadlineAt}
        browserZone={browserZone}
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
