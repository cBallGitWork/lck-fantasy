import { MainAction, Modal } from "../../parts";
import type { DeleteRow } from "./settings";
import "./settings.css";
import { erased, WORDS } from "./words";

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
    <Modal kind="sheet" title={WORDS.deleteTitle} onClose={onBack}>
      <p className="settings__lead">{erased(team)}</p>
      <ul className="settings__list">
        {rows.map((row) => (
          <li key={row.what} className="settings__list-row">
            <b className="settings__list-what">{row.what}</b>
            {row.detail && <span className="quiet">{row.detail}</span>}
          </li>
        ))}
      </ul>
      <p className="settings__warn quiet">
        {WORDS.backups}{" "}
        <button type="button" className="settings__inline-key" onClick={onDownload}>
          {WORDS.download}
        </button>{" "}
        {WORDS.keepCopy}
      </p>
      <div className="settings__sheet-keys">
        <button type="button" className="settings__text-key" onClick={onBack}>
          {WORDS.back}
        </button>
        <MainAction onClick={onDelete}>{WORDS.deleteAccount}</MainAction>
      </div>
    </Modal>
  );
}
