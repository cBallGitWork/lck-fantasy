import { playerId } from "../../fixtures/week3";
import { cx, Empty, formatWon, GoLink, Menu, pct, SideSection } from "../../parts";
import { cardGo } from "../../paths";
import { ROLE_KEYS, ROLE_NAME, RoleIcon, type RoleKey } from "../../rift";
import type { GuestPlayer } from "./pick";
import { keyFor, SORT_WORDS, sortLabel, teamLabel, WORDS, type SortKey } from "./words";

/** The list's filters: a role (null for all; an empty Coach slot sets coach), a search, a team (null for all), a sort. */
export interface ListFilters {
  role: RoleKey | "coach" | null;
  search: string;
  team: string | null;
  sort: SortKey;
}

const ROLE_CHIPS: { value: RoleKey | null; label: string }[] = [{ value: null, label: WORDS.allRoles }, ...ROLE_KEYS.map((role) => ({ value: role, label: ROLE_NAME[role] }))];

const SORTS: Record<SortKey, (p: GuestPlayer) => number> = { points: (p) => p.points, price: (p) => p.priceWon, owned: (p) => p.ownedPct };

/** The players a filter shows, highest first by its sort. */
export function listed(players: readonly GuestPlayer[], f: ListFilters): GuestPlayer[] {
  const search = f.search.trim().toLowerCase();
  return players
    .filter((p) => (f.role === null || p.role === f.role) && (f.team === null || p.team === f.team) && p.name.toLowerCase().includes(search))
    .sort((a, b) => SORTS[f.sort](b) - SORTS[f.sort](a));
}

/** The list beside the squad: role chips, search, sort and team, then each player's `+` (front door picture, as Transfers'). */
export function PlayerList({
  players,
  next,
  teams,
  filters,
  onFilters,
  onPick,
}: {
  players: GuestPlayer[];
  next: Record<string, string>;
  teams: string[];
  filters: ListFilters;
  onFilters: (filters: ListFilters) => void;
  onPick: (player: GuestPlayer) => void;
}) {
  const rows = listed(players, filters);
  return (
    <SideSection title={WORDS.players}>
      <div className="pick-team-signed-out__roles">
        {ROLE_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            className={cx("pick-team-signed-out__chip", filters.role === chip.value && "pick-team-signed-out__chip--on")}
            aria-pressed={filters.role === chip.value}
            onClick={() => onFilters({ ...filters, role: chip.value })}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <div className="pick-team-signed-out__tools">
        <input
          className="pick-team-signed-out__search"
          type="search"
          placeholder={WORDS.search}
          aria-label={WORDS.search}
          value={filters.search}
          onChange={(e) => onFilters({ ...filters, search: e.target.value })}
        />
        <Menu
          className="pick-team-signed-out__tool"
          label={sortLabel(SORT_WORDS[filters.sort])}
          items={(Object.keys(SORT_WORDS) as SortKey[]).map((sort) => ({ label: SORT_WORDS[sort], onChoose: () => onFilters({ ...filters, sort }) }))}
        />
        <Menu
          className="pick-team-signed-out__tool"
          label={teamLabel(filters.team ?? WORDS.all)}
          items={[null, ...teams].map((team) => ({ label: team ?? WORDS.all, onChoose: () => onFilters({ ...filters, team }) }))}
        />
      </div>
      {rows.length === 0 ? (
        <Empty title={WORDS.noPlayers} />
      ) : (
        <table className="pick-team-signed-out__list">
          <thead>
            <tr>
              <th aria-label={WORDS.role} />
              <th>{WORDS.player}</th>
              <th className="pick-team-signed-out__num">{WORDS.price}</th>
              <th className="pick-team-signed-out__num">{WORDS.pts}</th>
              <th className="pick-team-signed-out__num">{WORDS.owned}</th>
              <th>{WORDS.next}</th>
              <th aria-label={WORDS.pick} />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={`${p.role}:${p.team}:${p.name}`}>
                <td>
                  <RoleIcon role={p.role} />
                </td>
                <td className="pick-team-signed-out__name" title={p.name}>
                  <GoLink go={cardGo(playerId(p.name), p.role === "coach")}>
                    <b>{p.name}</b> {p.team}
                  </GoLink>
                </td>
                <td className="pick-team-signed-out__num num">{formatWon(p.priceWon)}</td>
                <td className="pick-team-signed-out__num num">{p.points}</td>
                <td className="pick-team-signed-out__num num">{pct(p.ownedPct)}</td>
                <td className="pick-team-signed-out__next">{next[p.team] ? `${WORDS.versus} ${next[p.team]}` : ""}</td>
                <td>
                  <button type="button" className="pick-team-signed-out__add" aria-label={keyFor(WORDS.pick, p.name)} onClick={() => onPick(p)}>
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </SideSection>
  );
}
