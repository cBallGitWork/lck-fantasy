import { Fragment } from "react";
import { cx, formatWon, oneDecimal, TeamBar } from "../../parts";
import { ROLE_NAME, Shirt, type PersonRole } from "../../rift";
import type { SlotHolder } from "./lineup";
import { weekAgainst, type Fixture } from "./plan";
import { keyFor, weekHead, WORDS } from "./words";
import "./SquadList.css";

/**
 * List view (approved/transfers/1440-list.png), as FPL's Transfers list in the Rift's place: the nine
 * grouped by role, each row his shirt and name, team, last week's points, price, form, total, both of the
 * week's opponents, and `×` to sell him (`↺` puts a sold one back). A row's name shows his card.
 */
export function SquadList({
  groups,
  fixtures,
  lastWeek,
  shown,
  isNew,
  onShow,
  onTap,
}: {
  groups: { role: PersonRole; holders: SlotHolder[] }[];
  fixtures: Record<string, Fixture[]>;
  /** The last week whose points the list shows. */
  lastWeek: number;
  /** Whose card shows. */
  shown: string | null;
  /** Bought and not yet confirmed. */
  isNew: (holder: SlotHolder) => boolean;
  onShow: (holder: SlotHolder) => void;
  onTap: (holder: SlotHolder) => void;
}) {
  return (
    <div className="transfers__squad-panel">
    <table className="transfers__squad transfers__table">
      {groups.map(({ role, holders }, i) => (
        <Fragment key={role}>
          <thead>
            <tr className="transfers__role">
              <th scope="colgroup">{ROLE_NAME[role]}</th>
              {i === 0 ? (
                <>
                  <th />
                  <th className="transfers__num">{weekHead(lastWeek)}</th>
                  <th className="transfers__num">{WORDS.price}</th>
                  <th className="transfers__num">{WORDS.form}</th>
                  <th className="transfers__num">{WORDS.total}</th>
                  <th>{WORDS.next}</th>
                  <th aria-label={WORDS.sell} />
                </>
              ) : (
                <th colSpan={7} />
              )}
            </tr>
          </thead>
          <tbody>
            {holders.map((holder) => {
              const p = holder.player;
              return (
                <tr
                  key={holder.slot}
                  className={cx(holder.empty && "transfers__row--sold", isNew(holder) && "transfers__row--new", shown === p.id && "transfers__row--shown")}
                >
                  <td className="transfers__who">
                    <Shirt team={p.team} small />
                    <button type="button" className="key-bare" aria-pressed={shown === p.id} onClick={() => onShow(holder)}>
                      <b>{p.name}</b>
                    </button>
                  </td>
                  <td className="transfers__team quiet">
                    <TeamBar team={p.team} wide />
                    {p.team}
                  </td>
                  <td className="transfers__num num">{p.weekPoints}</td>
                  <td className="transfers__num num">{formatWon(p.priceWon)}</td>
                  <td className="transfers__num num">{oneDecimal(p.form)}</td>
                  <td className="transfers__num num">{p.points}</td>
                  <td>{weekAgainst(fixtures, p.team)}</td>
                  <td className="transfers__act">
                    <button
                      type="button"
                      className={holder.empty ? "transfers__back-key" : "transfers__sell"}
                      aria-label={keyFor(holder.empty ? WORDS.restore : WORDS.sell, p.name)}
                      onClick={() => onTap(holder)}
                    >
                      {holder.empty ? "↺" : "×"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Fragment>
      ))}
    </table>
    </div>
  );
}
