import { cx, Empty, formatWon, GoLink, Menu, pct, SideSection } from "../../parts";
import { cardGo } from "../../paths";
import { ROLE_KEYS, ROLE_NAME, RoleIcon } from "../../rift";
import { ALL, listRows, nextAgainst, outOf, type Fixture, type ListFilters, type ListPlayer, type Plan, type RoleFilter, type SortKey, type SquadPlayer } from "./plan";

const SORTS: Record<SortKey, string> = { points: "Points", price: "Price", owned: "Owned" };
const ROLE_CHIPS: { value: RoleFilter; label: string }[] = [{ value: ALL, label: "All roles" }, ...ROLE_KEYS.map((role) => ({ value: role, label: ROLE_NAME[role] }))];

/** The list: who can be bought, with role chips, search, sort and team; none greyed (Craig, 16 Nov 2026). */
export function PlayerList({
  squad,
  players,
  fixtures,
  teams,
  plan,
  filters,
  onFilters,
  onBuy,
}: {
  squad: SquadPlayer[];
  players: ListPlayer[];
  fixtures: Record<string, Fixture[]>;
  teams: string[];
  plan: Plan;
  filters: ListFilters;
  onFilters: (filters: ListFilters) => void;
  onBuy: (player: ListPlayer) => void;
}) {
  const rows = listRows(squad, plan, players, filters);
  const out = plan.replacing ? outOf(squad, plan.replacing) : undefined;
  return (
    <SideSection title={out ? `Replacing ${out.name}` : "Players"}>
      <div className="transfers__roles">
        {ROLE_CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            className={cx("transfers__chip", filters.role === chip.value && "transfers__chip--on")}
            aria-pressed={filters.role === chip.value}
            onClick={() => onFilters({ ...filters, role: chip.value })}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <div className="transfers__tools">
        <input
          className="transfers__search"
          type="search"
          placeholder="Search a player"
          aria-label="Search a player"
          value={filters.search}
          onChange={(e) => onFilters({ ...filters, search: e.target.value })}
        />
        <Menu
          className="transfers__tool"
          label={`Sort: ${SORTS[filters.sort]} ▾`}
          items={(Object.keys(SORTS) as SortKey[]).map((sort) => ({ label: SORTS[sort], onChoose: () => onFilters({ ...filters, sort }) }))}
        />
        <Menu
          className="transfers__tool"
          label={`Team: ${filters.team === ALL ? "All" : filters.team} ▾`}
          items={[ALL, ...teams].map((team) => ({ label: team === ALL ? "All" : team, onChoose: () => onFilters({ ...filters, team }) }))}
        />
      </div>
      {rows.length === 0 ? (
        <Empty title="No players" />
      ) : (
        <table className="transfers__list">
          <thead>
            <tr>
              <th aria-label="Role" />
              <th>Player</th>
              <th className="transfers__num">Price</th>
              <th className="transfers__num">Pts</th>
              <th className="transfers__num">Owned</th>
              <th>Next</th>
              <th aria-label="Buy" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <ListRow key={p.id} p={p} next={nextAgainst(fixtures, p.team)} onBuy={onBuy} />
            ))}
          </tbody>
        </table>
      )}
    </SideSection>
  );
}

/** One row: role, name and team, price, points, owned, next opponent, `+`. A buy that can't be made is refused when tried. */
function ListRow({ p, next, onBuy }: { p: ListPlayer; next: string; onBuy: (p: ListPlayer) => void }) {
  return (
    <tr>
      <td>
        <RoleIcon role={p.role} />
      </td>
      <td className="transfers__name" title={p.name}>
        <GoLink go={cardGo(p.id, p.role === "coach")}>
          <b>{p.name}</b> {p.team}
        </GoLink>
      </td>
      <td className="transfers__num num">{formatWon(p.priceWon)}</td>
      <td className="transfers__num num">{p.points}</td>
      <td className="transfers__num num">{pct(p.ownedPct)}</td>
      <td className="transfers__next">{next}</td>
      <td>
        <button type="button" className="transfers__add" aria-label={`Buy ${p.name}`} onClick={() => onBuy(p)}>
          +
        </button>
      </td>
    </tr>
  );
}
