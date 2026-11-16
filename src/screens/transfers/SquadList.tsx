import { Fragment } from "react";
import { cx, formatWon, oneDecimal } from "../../parts";
import { ROLE_NAME, Shirt, type PersonRole, type SquadSlot } from "../../rift";
import type { SlotHolder } from "./lineup";
import { nextAgainst, type Fixture } from "./plan";
import "./SquadList.css";

/**
 * List view (Craig, 16 Nov 2026), as FPL's Transfers list: the nine grouped by role, each row his shirt,
 * name and team, last week's points, price, form, total, his next opponent, and `×` to sell him (`↺`
 * puts a sold one back).
 */
export function SquadList({
  groups,
  fixtures,
  lastWeek,
  replacing,
  onTap,
}: {
  groups: { role: PersonRole; holders: SlotHolder[] }[];
  fixtures: Record<string, Fixture[]>;
  /** The last week whose points the list shows. */
  lastWeek: number;
  replacing: SquadSlot | null;
  onTap: (holder: SlotHolder) => void;
}) {
  return (
    <table className="transfers__squad">
      <thead>
        <tr>
          <th aria-label="Shirt" />
          <th>Player</th>
          <th className="transfers__num">Wk {lastWeek}</th>
          <th className="transfers__num">Price</th>
          <th className="transfers__num">Form</th>
          <th className="transfers__num">Total</th>
          <th>Next</th>
          <th aria-label="Sell" />
        </tr>
      </thead>
      <tbody>
        {groups.map(({ role, holders }) => (
          <Fragment key={role}>
            <tr className="transfers__group">
              <th colSpan={8} scope="rowgroup">
                {ROLE_NAME[role]}
              </th>
            </tr>
            {holders.map((holder) => (
              <tr key={holder.slot} className={cx(holder.empty && "transfers__row--sold", replacing === holder.slot && "transfers__row--picked")}>
                <td>
                  <Shirt team={holder.player.team} small />
                </td>
                <td className="transfers__name truncate">
                  <b>{holder.player.name}</b> {holder.player.team}
                </td>
                <td className="transfers__num num">{holder.player.weekPoints}</td>
                <td className="transfers__num num">{formatWon(holder.player.priceWon)}</td>
                <td className="transfers__num num">{oneDecimal(holder.player.form)}</td>
                <td className="transfers__num num">{holder.player.points}</td>
                <td className="transfers__next">{nextAgainst(fixtures, holder.player.team)}</td>
                <td>
                  <button type="button" className="transfers__add" aria-label={`${holder.empty ? "Restore" : "Sell"} ${holder.player.name}`} onClick={() => onTap(holder)}>
                    {holder.empty ? "↺" : "×"}
                  </button>
                </td>
              </tr>
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
