import { Deadline, formatWon, MainAction, Modal, TeamBar } from "../../parts";
import { costLabel } from "./Confirmed";
import type { ListPlayer, SquadPlayer } from "./plan";
import { WORDS } from "./words";
import "./ConfirmSheet.css";

/** A side of a move: name, team bar and code, price. */
function Side({ p }: { p: ListPlayer }) {
  return (
    <>
      <b>{p.name}</b> <span className="quiet"><TeamBar team={p.team} wide />{p.team}</span> <span className="num">{formatWon(p.priceWon)}</span>
    </>
  );
}

/**
 * The confirm sheet (transfers.html?s=confirm, approved/transfers/1440-confirm.png): in a heavy frame,
 * one row a transfer, out → in with each price; then Free transfers used, Cost and Bank; the deadline,
 * Back and Confirm.
 */
export function ConfirmSheet({
  transfers,
  hit,
  freeUsed,
  bankFrom,
  bankTo,
  deadline,
  onBack,
  onConfirm,
}: {
  transfers: { out: SquadPlayer; in: ListPlayer }[];
  hit: number;
  freeUsed: number;
  bankFrom: number;
  bankTo: number;
  deadline: { local: string };
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal kind="sheet" title={WORDS.sheetTitle} onClose={onBack} strong>
      <table className="transfers__sheet-moves">
        <thead>
          <tr>
            <th>{WORDS.out}</th>
            <th aria-label={WORDS.for} />
            <th>{WORDS.in}</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((t) => (
            <tr key={t.out.slot}>
              <td>
                <Side p={t.out} />
              </td>
              <td className="transfers__sheet-arrow quiet">→</td>
              <td>
                <Side p={t.in} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="transfers__figs">
        <div>
          <dt>{WORDS.freeUsed}</dt>
          <dd className="num">{freeUsed}</dd>
        </div>
        <div>
          <dt>{WORDS.cost}</dt>
          <dd className="num">{costLabel(hit)}</dd>
        </div>
        <div>
          <dt>{WORDS.bank}</dt>
          <dd className="num">
            {formatWon(bankFrom)} → {formatWon(bankTo)}
          </dd>
        </div>
      </dl>
      <div className="transfers__sheet-keys">
        <span className="transfers__sheet-deadline">
          <Deadline local={deadline.local} />
        </span>
        <button type="button" className="transfers__back" onClick={onBack}>
          {WORDS.back}
        </button>
        <MainAction onClick={onConfirm}>{WORDS.confirm}</MainAction>
      </div>
    </Modal>
  );
}
