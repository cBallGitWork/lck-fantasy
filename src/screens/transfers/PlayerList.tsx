import { cx, Empty, formatEok, GoLink, Menu, pct, SideSection } from "../../parts";
import { ROLE_KEYS, ROLE_NAME, RoleIcon } from "../../rift";
import { listRows, type Fixture, type ListFilters, type ListPlayer, type Plan, type RoleFilter, type Row, type SortKey, type SquadPlayer, type TransferRules } from "./plan";

const SORTS: Record<SortKey, string> = { points: "Points", price: "Price", owned: "Owned" };
const ROLE_CHIPS: { value: RoleFilter; label: string }[] = [{ value: "all", label: "All roles" }, ...ROLE_KEYS.map((role) => ({ value: role, label: ROLE_NAME[role] }))];
export const ALL_TEAMS = "all";

/** The list: who can fill the slot being sold, with role chips, search, sort and team. */
export function PlayerList({
  squad,
  players,
  rules,
  fixtures,
  teams,
  plan,
  filters,
  onFilters,
  onBuy,
}: {
  squad: SquadPlayer[];
  players: ListPlayer[];
  rules: TransferRules;
  fixtures: Record<string, Fixture[]>;
  teams: string[];
  plan: Plan;
  filters: ListFilters;
  onFilters: (filters: ListFilters) => void;
  onBuy: (player: ListPlayer) => void;
}) {
  const rows = listRows(squad, plan, players, filters, rules);
  const out = plan.replacing ? squad.find((p) => p.slot === plan.replacing) : undefined;
  const filling = plan.replacing ? plan.sold[plan.replacing] : undefined;
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
          label={`Team: ${filters.team === ALL_TEAMS ? "All" : filters.team} ▾`}
          items={[ALL_TEAMS, ...teams].map((team) => ({ label: team === ALL_TEAMS ? "All" : team, onChoose: () => onFilters({ ...filters, team }) }))}
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
              <th aria-label="Price move" />
              <th className="transfers__num">Pts</th>
              <th className="transfers__num">Owned</th>
              <th>Next</th>
              <th aria-label="Buy" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <ListRow
                key={row.player.id}
                row={row}
                next={fixtures[row.player.team]?.[0]}
                picked={filling?.id === row.player.id}
                canBuy={plan.replacing !== null}
                onBuy={onBuy}
              />
            ))}
          </tbody>
        </table>
      )}
    </SideSection>
  );
}

/** One row: role, name and team (why he can't be bought under it), price, its move, points, owned, next, `+`. */
function ListRow({ row, next, picked, canBuy, onBuy }: { row: Row; next?: Fixture; picked: boolean; canBuy: boolean; onBuy: (p: ListPlayer) => void }) {
  const { player: p, why } = row;
  const card = p.role === "coach" ? ({ to: "/coach/$coachId", params: { coachId: p.id } } as const) : ({ to: "/player/$playerId", params: { playerId: p.id } } as const);
  return (
    <tr className={cx(why && "transfers__row--off", picked && "transfers__row--picked")}>
      <td>
        <RoleIcon role={p.role} />
      </td>
      <td className="transfers__name" title={p.name}>
        <GoLink go={card}>
          <b>{p.name}</b> {p.team}
        </GoLink>
        {why && <small className="transfers__why">{why}</small>}
      </td>
      <td className="transfers__num num">{formatEok(p.price)}</td>
      <td className="transfers__move">{p.move !== 0 && <span className={p.move > 0 ? "rise" : "fall"} title={p.move > 0 ? "Price rose" : "Price fell"} />}</td>
      <td className="transfers__num num">{p.points}</td>
      <td className="transfers__num num">{pct(p.ownedPct)}</td>
      <td className="transfers__next">{next && `v ${next.against} ${next.day}`}</td>
      <td>
        {canBuy && (
          <button
            type="button"
            className="transfers__add"
            disabled={why !== undefined}
            aria-pressed={picked}
            aria-label={why ? `${p.name}: ${why}` : `Buy ${p.name}`}
            onClick={() => onBuy(p)}
          >
            {picked ? "✓" : "+"}
          </button>
        )}
      </td>
    </tr>
  );
}
