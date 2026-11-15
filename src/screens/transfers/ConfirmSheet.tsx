import { formatEok, MainAction, Modal, Time } from "../../parts";
import { ROLE_NAME } from "../../rift";
import { costLabel } from "./Confirmed";
import type { ListPlayer, SquadPlayer, SquadSlot } from "./plan";

const SHEET_TITLE = "Confirm your transfers";

/** A slot's name on the sheet: `Flex`, `Bench 1`. */
const SLOT_NAME: Record<SquadSlot, string> = { ...ROLE_NAME, bench1: "Bench 1", bench2: "Bench 2" };

/** `Flex, plays Top` for the Flex; the slot's name for the rest. */
function slotFor(slot: SquadSlot, p: ListPlayer): string {
  return slot === "flex" && p.role !== "coach" ? `${SLOT_NAME.flex}, plays ${ROLE_NAME[p.role]}` : SLOT_NAME[slot];
}

/** `−6 · no free transfers left`, `Free · 1 free transfer left`. */
function costLine(hit: number, freeLeft: number): string {
  const left = `${freeLeft === 0 ? "no" : freeLeft} free transfer${freeLeft === 1 ? "" : "s"} left`;
  return `${costLabel(hit)} · ${left}`;
}

/** The confirm sheet (confirm.html): out, in, cost, bank; Back or Confirm, with the deadline. */
export function ConfirmSheet({
  transfers,
  hit,
  freeLeft,
  bankFrom,
  bankTo,
  deadline,
  onBack,
  onConfirm,
}: {
  transfers: { out: SquadPlayer; in: ListPlayer }[];
  hit: number;
  freeLeft: number;
  bankFrom: number;
  bankTo: number;
  deadline: { local: string; kst: string };
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal kind="sheet" title={SHEET_TITLE} onClose={onBack}>
      <table className="transfers__sheet">
        <tbody>
          {transfers.map((t) => [
            <tr key={`${t.out.slot}-out`}>
              <th scope="row">Out</th>
              <td>
                <b>{t.out.name}</b> {t.out.team} · {SLOT_NAME[t.out.slot]} · {formatEok(t.out.price)}
              </td>
            </tr>,
            <tr key={`${t.out.slot}-in`}>
              <th scope="row">In</th>
              <td>
                <b>{t.in.name}</b> {t.in.team} · {slotFor(t.out.slot, t.in)} · {formatEok(t.in.price)}
              </td>
            </tr>,
          ])}
          <tr>
            <th scope="row">Cost</th>
            <td>{costLine(hit, freeLeft)}</td>
          </tr>
          <tr>
            <th scope="row">Bank</th>
            <td>
              {formatEok(bankFrom)} → <b>{formatEok(bankTo)}</b>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="transfers__sheet-keys">
        <button type="button" className="transfers__back" onClick={onBack}>
          Back
        </button>
        <MainAction onClick={onConfirm}>Confirm</MainAction>
      </div>
      <p className="transfers__sheet-deadline">
        Deadline <Time {...deadline} />
      </p>
    </Modal>
  );
}
