import { cx, MainAction, Modal, ViewToggle } from "../../parts";
import { TRUCK_HANGUL, TRUCK_KINDS, TRUCK_WORD, type Manager, type SentKind, type TruckLine } from "./feed";
import { Led } from "./Led";
import "./following.css";

const KIND_OPTIONS = TRUCK_KINDS.map((kind) => ({
  value: kind,
  label: (
    <>
      {TRUCK_WORD[kind]} <span lang="ko">{TRUCK_HANGUL[kind]}</span>
    </>
  ),
}));

/**
 * The truck picker (1440-truck.png): Coffee or Protest, the lines that fit the receiver's week,
 * a preview of the picked line, then Cancel and Send truck.
 */
export function TruckPicker({
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
  lines: TruckLine[];
  kind: SentKind;
  picked?: string;
  onKind: (kind: SentKind) => void;
  onPick: (lineId: string) => void;
  onSend: () => void;
  onClose: () => void;
}) {
  const shown = lines.filter((l) => l.kind === kind);
  const preview = shown.find((l) => l.id === picked);
  const first = receiver.name.split(" ")[0];
  return (
    <Modal kind="sheet" title={`Truck ${receiver.name}`} onClose={onClose}>
      <p className="following__picker-sub">{line}</p>
      <div className="following__kinds">
        <ViewToggle options={KIND_OPTIONS} chosen={kind} onChoose={onKind} label="Truck" />
      </div>
      <div className="following__lines" role="radiogroup" aria-label="Line">
        {shown.map((l) => (
          <label key={l.id} className={cx("following__line", l.id === picked && "following__line--on")}>
            <input type="radio" className="following__radio" name="truck-line" checked={l.id === picked} onChange={() => onPick(l.id)} />
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
        <small className="following__foot-note quiet">One truck to {first} a week.</small>
        <button type="button" className="following__act key-bare hover-line" onClick={onClose}>
          Cancel
        </button>
        {/* With no line picked there is nothing to send; the picture draws no reason for it. */}
        <MainAction onClick={onSend} disabledReason={preview ? undefined : ""}>
          Send truck
        </MainAction>
      </div>
    </Modal>
  );
}
