import { Fragment } from "react";
import { cx, formatEok, oneDecimal } from "../../parts";
import { ROLE_NAME, Shirt, type PersonRole, type SquadSlot } from "../../rift";
import type { Standing } from "./lineup";
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
  groups: { role: PersonRole; standing: Standing[] }[];
  fixtures: Record<string, Fixture[]>;
  lastWeek: string;
  replacing: SquadSlot | null;
  onTap: (s: Standing) => void;
}) {
  return (
    <table className="transfers__squad">
      <thead>
        <tr>
          <th aria-label="Shirt" />
          <th>Player</th>
          <th className="transfers__num">{lastWeek}</th>
          <th className="transfers__num">Price</th>
          <th className="transfers__num">Form</th>
          <th className="transfers__num">Total</th>
          <th>Next</th>
          <th aria-label="Sell" />
        </tr>
      </thead>
      <tbody>
        {groups.map(({ role, standing }) => (
          <Fragment key={role}>
            <tr className="transfers__group">
              <th colSpan={8} scope="rowgroup">
                {ROLE_NAME[role]}
              </th>
            </tr>
            {standing.map((s) => (
              <tr key={s.slot} className={cx(s.empty && "transfers__row--sold", replacing === s.slot && "transfers__row--picked")}>
                <td>
                  <Shirt team={s.p.team} small />
                </td>
                <td className="transfers__name">
                  <b>{s.p.name}</b> {s.p.team}
                </td>
                <td className="transfers__num num">{s.p.weekPoints}</td>
                <td className="transfers__num num">{formatEok(s.p.price)}</td>
                <td className="transfers__num num">{oneDecimal(s.p.form)}</td>
                <td className="transfers__num num">{s.p.points}</td>
                <td className="transfers__next">{nextAgainst(fixtures, s.p.team)}</td>
                <td>
                  <button type="button" className="transfers__add" aria-label={`${s.empty ? "Restore" : "Sell"} ${s.p.name}`} onClick={() => onTap(s)}>
                    {s.empty ? "↺" : "×"}
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
