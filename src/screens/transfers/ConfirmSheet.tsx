import { formatWon, MainAction, Modal, Time } from "../../parts";
import { costLabel } from "./Confirmed";
import type { ListPlayer, SquadPlayer } from "./plan";
import "./ConfirmSheet.css";

const SHEET_TITLE = "Confirm your transfers";

/**
 * The confirm sheet (confirm.html, changed by Craig 16 Nov 2026): one row per transfer, out → in with
 * each price, then the cost, the bank and the free transfers used; Back or Confirm, with the deadline.
 */
export function ConfirmSheet({
  transfers,
  hit,
  freeUsed,
  freeHad,
  bankFrom,
  bankTo,
  deadline,
  onBack,
  onConfirm,
}: {
  transfers: { out: SquadPlayer; in: ListPlayer }[];
  hit: number;
  freeUsed: number;
  /** Free transfers before these. */
  freeHad: number;
  bankFrom: number;
  bankTo: number;
  deadline: { local: string; kst: string };
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal kind="sheet" title={SHEET_TITLE} onClose={onBack} strong>
      <ol className="transfers__sheet-moves">
        {transfers.map((t) => (
          <li key={t.out.slot}>
            <span className="transfers__sheet-out">
              {t.out.name} <small>{t.out.team}</small> <span className="num">{formatWon(t.out.price)}</span>
            </span>
            <span aria-label="for">→</span>
            <b>
              {t.in.name} <small>{t.in.team}</small> <span className="num">{formatWon(t.in.price)}</span>
            </b>
          </li>
        ))}
      </ol>
      <table className="transfers__sheet">
        <tbody>
          <tr>
            <th scope="row">Cost</th>
            <td className="num">{costLabel(hit)}</td>
          </tr>
          <tr>
            <th scope="row">Bank</th>
            <td className="num">
              {formatWon(bankFrom)} → <b>{formatWon(bankTo)}</b>
            </td>
          </tr>
          <tr>
            <th scope="row">Free transfers used</th>
            <td className="num">
              {freeUsed} of {freeHad}
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
      <p className="transfers__sheet-deadline quiet">
        Deadline <Time {...deadline} />
      </p>
    </Modal>
  );
}
