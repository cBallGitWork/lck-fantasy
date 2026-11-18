import { Deadline, formatWon, MainAction, Modal } from "../../parts";
import { costLabel } from "./Confirmed";
import type { ListPlayer, SquadPlayer } from "./plan";
import { usedOf, WORDS } from "./words";
import "./ConfirmSheet.css";

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
    <Modal kind="sheet" title={WORDS.sheetTitle} onClose={onBack} strong>
      <ol className="transfers__sheet-moves">
        {transfers.map((t) => (
          <li key={t.out.slot}>
            <span className="transfers__sheet-out">
              {t.out.name} <small>{t.out.team}</small> <span className="num">{formatWon(t.out.priceWon)}</span>
            </span>
            <span aria-label={WORDS.for}>→</span>
            <b>
              {t.in.name} <small>{t.in.team}</small> <span className="num">{formatWon(t.in.priceWon)}</span>
            </b>
          </li>
        ))}
      </ol>
      <table className="transfers__sheet">
        <tbody>
          <tr>
            <th scope="row">{WORDS.cost}</th>
            <td className="num">{costLabel(hit)}</td>
          </tr>
          <tr>
            <th scope="row">{WORDS.bank}</th>
            <td className="num">
              {formatWon(bankFrom)} → <b>{formatWon(bankTo)}</b>
            </td>
          </tr>
          <tr>
            <th scope="row">{WORDS.freeUsed}</th>
            <td className="num">{usedOf(freeUsed, freeHad)}</td>
          </tr>
        </tbody>
      </table>
      <div className="transfers__sheet-keys">
        <button type="button" className="transfers__back" onClick={onBack}>
          {WORDS.back}
        </button>
        <MainAction onClick={onConfirm}>{WORDS.confirm}</MainAction>
      </div>
      <p className="transfers__sheet-deadline quiet">
        <Deadline local={deadline.local} kst={deadline.kst} />
      </p>
    </Modal>
  );
}
