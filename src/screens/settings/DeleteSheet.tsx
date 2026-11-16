import { MainAction, Modal } from "../../parts";
import type { DeleteRow } from "./settings";
import "./settings.css";

/** The Delete account sheet: what goes (the team named once, in the sentence), who each private league passes to, then Back or Delete account. */
export function DeleteSheet({
  team,
  rows,
  onBack,
  onDelete,
  onDownload,
}: {
  team: string;
  rows: DeleteRow[];
  onBack: () => void;
  onDelete: () => void;
  onDownload: () => void;
}) {
  return (
    <Modal kind="sheet" title="Delete account?" onClose={onBack}>
      <p className="settings__lead">{team} is erased at once and can&apos;t be brought back.</p>
      <ul className="settings__list">
        {rows.map((row) => (
          <li key={row.what} className="settings__list-row">
            <b className="settings__list-what">{row.what}</b>
            {row.detail && <span className="quiet">{row.detail}</span>}
          </li>
        ))}
      </ul>
      <p className="settings__warn quiet">
        Backups clear within 30 days.{" "}
        <button type="button" className="settings__inline-key key-bare" onClick={onDownload}>
          Download my data
        </button>{" "}
        first to keep a copy.
      </p>
      <div className="settings__sheet-keys">
        <button type="button" className="settings__text-key key-bare" onClick={onBack}>
          Back
        </button>
        <MainAction onClick={onDelete}>Delete account</MainAction>
      </div>
    </Modal>
  );
}
