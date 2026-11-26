import { Fragment } from "react";
import { cx, Empty, formatWon, Menu, Panel, pct, TeamBar } from "../../parts";
import { PERSON_ROLES, ROLE_NAME } from "../../rift";
import { ALL, listRows, outOf, weekAgainst, type Fixture, type ListFilters, type ListPlayer, type Plan, type RoleFilter, type SortKey, type SquadPlayer } from "./plan";
import { keyFor, replacing, SORT_WORDS, sortLabel, teamLabel, WORDS } from "./words";
import "./PlayerList.css";

/** All roles, the five roles, then Coach, so coaches can be browsed without selling yours first (Craig, 18 Nov 2026). */
const ROLE_TABS: { value: RoleFilter; label: string }[] = [{ value: ALL, label: WORDS.allRoles }, ...PERSON_ROLES.map((role) => ({ value: role, label: ROLE_NAME[role] }))];

/**
 * The player list, a panel in the side column (approved/transfers/, What binds 8 to 10): what the last
 * `+` did at its top; role tabs; Find a player, Sort and Team; then rows grouped by role, each name, team
 * bar and code, Price, Pts, Owned, both of the week's opponents and `+`. None greyed, your own left out,
 * no price arrows. A row shows his card under the Rift.
 */
export function PlayerList({
  squad,
  players,
  fixtures,
  teams,
  plan,
  filters,
  note,
  shown,
  onFilters,
  onShow,
  onBuy,
}: {
  squad: SquadPlayer[];
  players: ListPlayer[];
  fixtures: Record<string, Fixture[]>;
  teams: string[];
  plan: Plan;
  filters: ListFilters;
  /** What the last `+` did: `Kingen added`, or why a buy was refused. */
  note: string | null;
  /** Whose card shows. */
  shown: string | null;
  onFilters: (filters: ListFilters) => void;
  onShow: (player: ListPlayer) => void;
  onBuy: (player: ListPlayer) => void;
}) {
  const rows = listRows(squad, plan, players, filters);
  const out = plan.replacing ? outOf(squad, plan.replacing) : undefined;
  const groups = PERSON_ROLES.map((role) => ({ role, rows: rows.filter((p) => p.role === role) })).filter((g) => g.rows.length > 0);
  return (
    <Panel title={out ? replacing(out.name) : WORDS.players} band className="transfers__players">
      <p className="transfers__note" role="status">
        {note}
      </p>
      <div className="transfers__tabs">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={cx("transfers__tab", filters.role === tab.value && "transfers__tab--on")}
            aria-pressed={filters.role === tab.value}
            onClick={() => onFilters({ ...filters, role: tab.value })}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="transfers__tools">
        <input
          className="transfers__search"
          type="search"
          placeholder={WORDS.search}
          aria-label={WORDS.search}
          value={filters.search}
          onChange={(e) => onFilters({ ...filters, search: e.target.value })}
        />
        <Menu
          className="transfers__tool"
          label={sortLabel(SORT_WORDS[filters.sort])}
          items={(Object.keys(SORT_WORDS) as SortKey[]).map((sort) => ({ label: SORT_WORDS[sort], onChoose: () => onFilters({ ...filters, sort }) }))}
        />
        <Menu
          className="transfers__tool"
          label={teamLabel(filters.team === ALL ? WORDS.all : filters.team)}
          items={[ALL, ...teams].map((team) => ({ label: team === ALL ? WORDS.all : team, onChoose: () => onFilters({ ...filters, team }) }))}
        />
      </div>
      {groups.length === 0 ? (
        <Empty title={WORDS.noPlayers} />
      ) : (
        <table className="transfers__list transfers__table">
          {groups.map(({ role, rows }, i) => (
            <Fragment key={role}>
              <thead>
                <tr className="transfers__role">
                  <th scope="colgroup">{ROLE_NAME[role]}</th>
                  {i === 0 ? (
                    <>
                      <th className="transfers__num">{WORDS.price}</th>
                      <th className="transfers__num">{WORDS.pts}</th>
                      <th className="transfers__num">{WORDS.owned}</th>
                      <th>{WORDS.next}</th>
                      <th aria-label={WORDS.buy} />
                    </>
                  ) : (
                    <th colSpan={5} />
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className={cx(shown === p.id && "transfers__row--shown")}>
                    <td className="transfers__who">
                      <button type="button" className="key-bare" aria-pressed={shown === p.id} onClick={() => onShow(p)}>
                        <b>{p.name}</b>
                      </button>
                      <span className="transfers__team quiet">
                        <TeamBar team={p.team} wide />
                        {p.team}
                      </span>
                    </td>
                    <td className="transfers__num num">{formatWon(p.priceWon)}</td>
                    <td className="transfers__num num">{p.points}</td>
                    <td className="transfers__num num">{pct(p.ownedPct)}</td>
                    <td>{weekAgainst(fixtures, p.team)}</td>
                    <td className="transfers__act">
                      <button type="button" className="transfers__add" aria-label={keyFor(WORDS.buy, p.name)} onClick={() => onBuy(p)}>
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Fragment>
          ))}
        </table>
      )}
    </Panel>
  );
}
