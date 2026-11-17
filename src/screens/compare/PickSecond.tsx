import { useState } from "react";
import { cx, money, selectable } from "../../parts";
import { ROLE_PLURAL, searchGroups } from "./rules";
import type { ComparePlayer, SearchRow } from "./fixtures";

const FIND = "Find a player";

/**
 * The second player not picked yet: a search, his role listed first, then `All mids · Other roles ›`.
 * A row is picked only where Compare has his lines (`canPick`).
 */
export function PickSecond({
  first,
  rows,
  canPick,
  onPick,
}: {
  first: ComparePlayer;
  rows: readonly SearchRow[];
  canPick: (name: string) => boolean;
  onPick: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [wide, setWide] = useState(false);
  const groups = searchGroups(rows, first, query, wide);
  // A coach is listed only against a coach, so a coach's list already holds every coach.
  const showMore = first.role !== "coach" && !wide && !query.trim();
  return (
    <div className="compare__pick">
      <input
        className="compare__find"
        type="search"
        placeholder={FIND}
        aria-label={FIND}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {groups.map((group) => (
        <section key={group.role}>
          <h3 className="compare__group quiet">{ROLE_PLURAL[group.role]}</h3>
          <table className="compare__results">
            <colgroup>
              <col />
              <col className="compare__team-col" />
              <col className="compare__price-col" />
              <col className="compare__score-col" />
            </colgroup>
            <tbody>
              {group.rows.map((row) => {
                const pick = canPick(row.name) ? () => onPick(row.name) : undefined;
                return (
                  <tr key={row.name} className={cx(pick && "compare__result--pick")} {...selectable(pick)}>
                    <td className="compare__result-name">{row.name}</td>
                    <td className="quiet">{row.team}</td>
                    <td className="compare__result-price">{money(row.priceM)}</td>
                    <td className="compare__result-points">{row.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
      {showMore && (
        <button type="button" className="compare__go key-bare hover-line compare__more" onClick={() => setWide(true)}>
          All {ROLE_PLURAL[first.role].toLowerCase()} · Other roles ›
        </button>
      )}
    </div>
  );
}
