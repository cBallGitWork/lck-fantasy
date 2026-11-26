import { cx, formatWon, MainAction, NONE, Panel, signed } from "../../parts";
import type { ListPlayer, SquadPlayer } from "./plan";
import { WORDS } from "./words";

/**
 * Your transfers, the panel beside the Rift (approved/transfers/, What binds 4): Free transfers, Cost and
 * Bank, the draft's rows (out → in with each price and its hit), why the key is off, Reset, and Review
 * and confirm ›, the page's one main action. Green on the bank, red on a cost and a bank below zero.
 */
export function YourTransfers({
  free,
  hit,
  bank,
  draft,
  block,
  onReset,
  onReview,
}: {
  free: number;
  hit: number;
  bank: number;
  /** Each sold slot: who went out, who came in (none yet), and what it costs. */
  draft: { out: SquadPlayer; in: ListPlayer | null; hit: number }[];
  /** Why Review and confirm is off, or nothing. */
  block?: string;
  onReset: () => void;
  onReview: () => void;
}) {
  return (
    <Panel title={WORDS.yourTransfers} band className="transfers__yours">
      <dl className="transfers__figs">
        <div>
          <dt>{WORDS.freeTransfers}</dt>
          <dd className="num">{free}</dd>
        </div>
        <div>
          <dt>{WORDS.cost}</dt>
          <dd className={cx("num", hit > 0 && "transfers__chip-red")}>{signed(-hit)}</dd>
        </div>
        <div>
          <dt>{WORDS.bank}</dt>
          <dd className={cx("num", bank < 0 ? "transfers__chip-red" : "transfers__chip-green")}>{formatWon(bank)}</dd>
        </div>
      </dl>
      <ul className="transfers__draft">
        {draft.map((m) => (
          <li key={m.out.slot}>
            <span>
              <s className="quiet">{m.out.name}</s> <span className="num">{formatWon(m.out.priceWon)}</span> →{" "}
              {m.in ? (
                <>
                  <b>{m.in.name}</b> <span className="num">{formatWon(m.in.priceWon)}</span>
                </>
              ) : (
                <span className="quiet">{NONE}</span>
              )}
            </span>
            {m.in && m.hit > 0 && <b className="num">{signed(-m.hit)}</b>}
          </li>
        ))}
      </ul>
      {block && <p className="transfers__block quiet">{block}</p>}
      <div className="transfers__keys">
        <button type="button" className="transfers__reset key-bare hover-line" onClick={onReset}>
          {WORDS.reset}
        </button>
        {/* Why it is off is said above, so the key's own reason stays empty. */}
        <MainAction wide disabledReason={block === undefined ? undefined : ""} onClick={onReview}>
          {WORDS.review}
        </MainAction>
      </div>
    </Panel>
  );
}
