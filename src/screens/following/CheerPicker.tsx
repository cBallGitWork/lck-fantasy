import { CHEER_KINDS, CHEER_LABEL, CHEER_WORD, cx, Led, MainAction, Modal, ViewToggle, type CheerKind } from "../../parts";
import { firstName, type CheerLine, type Manager } from "./feed";
import { pickerNote, pickerTitle, WORDS } from "./words";
import "./following.css";

const KIND_OPTIONS = CHEER_KINDS.map((kind) => ({ value: kind, label: CHEER_WORD[kind] }));

/**
 * The cheer picker (1440-truck.png): Cheer or Jeer, the lines that fit the receiver's week,
 * a preview of the picked line, then Cancel and Send.
 */
export function CheerPicker({
  receiver,
  line,
  lines,
  kind,
  picked,
  onKind,
  onPick,
  onSend,
  onClose,
}: {
  receiver: Manager;
  /** `Deft Tomorrow · Week 3 · 31 pts so far, no transfers`. */
  line: string;
  lines: CheerLine[];
  kind: CheerKind;
  picked?: string;
  onKind: (kind: CheerKind) => void;
  onPick: (lineId: string) => void;
  onSend: () => void;
  onClose: () => void;
}) {
  const shown = lines.filter((l) => l.kind === kind);
  const preview = shown.find((l) => l.id === picked);
  const first = firstName(receiver);
  return (
    <Modal kind="sheet" title={pickerTitle(receiver.name)} onClose={onClose}>
      <p className="following__picker-sub">{line}</p>
      <div className="following__kinds">
        <ViewToggle options={KIND_OPTIONS} chosen={kind} onChoose={onKind} label={CHEER_LABEL} />
      </div>
      <div className="following__lines" role="radiogroup" aria-label={WORDS.line}>
        {shown.map((l) => (
          <label key={l.id} className={cx("following__line", l.id === picked && "following__line--on")}>
            <input type="radio" className="following__radio" name="cheer-line" checked={l.id === picked} onChange={() => onPick(l.id)} />
            <span>{l.text}</span>
          </label>
        ))}
      </div>
      {preview && (
        <div className="following__preview">
          <Led big>{preview.text}</Led>
        </div>
      )}
      <div className="following__foot">
        <small className="following__foot-note quiet">{pickerNote(first)}</small>
        <button type="button" className="following__act key-bare hover-line" onClick={onClose}>
          {WORDS.cancel}
        </button>
        {/* With no line picked there is nothing to send; the picture draws no reason for it. */}
        <MainAction onClick={onSend} disabledReason={preview ? undefined : ""}>
          {WORDS.send}
        </MainAction>
      </div>
    </Modal>
  );
}
