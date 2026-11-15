import type { ChangeEvent, ReactNode } from "react";
import { TEAMS, type TeamCode } from "../../fixtures/week3";
import { cx, formatEok, GoLink, MeDot, PageFrame, PageHead, Table, Tabs, ViewToggle, WON_PER_EOK, type Column } from "../../parts";
import { PATHS, type Go } from "../../paths";
import { ROLE_NAME, RoleIcon, type RoleKey } from "../../rift";
import {
  ALL,
  FIGURES,
  linesFor,
  listRows,
  pageCount,
  pageLabel,
  pageRows,
  perGame,
  priceChoices,
  TABS,
  type Figures,
  type Line,
  type SortKey,
  type StatsRow,
  type StatsView,
} from "./stats";
import "./stats.css";

const ROLES: readonly RoleKey[] = ["top", "jng", "mid", "bot", "sup"];

type Ranked = StatsRow & { rank: number };

export interface StatsPageProps {
  /** The account menu's team name; null for a visitor. */
  account: string | null;
  view: StatsView;
  /** Every player or coach on the chosen tab, over the chosen span, before the filters. */
  rows: readonly StatsRow[];
  spans: readonly { value: string; label: string }[];
  /** A control changed: the new values. */
  onChange: (change: Partial<StatsView>) => void;
}

/** Stats: every player's or coach's stats in one sortable list (docs/design/approved/stats/). */
export function StatsPage({ account, view, rows, spans, onChange }: StatsPageProps) {
  const listed = listRows(rows, view);
  const pages = pageCount(listed.length);
  const page = Math.min(view.page, pages);
  return (
    <PageFrame screen="stats" active="stats" account={account}>
      <div className="stats">
        <PageHead title="Stats" hangul="통계" link={{ label: "Patch update", go: { to: PATHS.patchUpdate } }} />
        <Tabs tabs={TABS} chosen={view.tab} onChoose={(tab) => onChange({ tab })} label="Players or coaches" />
        <Controls view={view} rows={rows} spans={spans} onChange={onChange} />
        <Table<Ranked>
          columns={columns(view, onChange)}
          rows={pageRows(listed, page)}
          rowKey={(r) => r.id}
          stickyHead
          stickyFirst
          label={view.tab}
        />
        <div className="stats__foot">
          <span>{pageLabel(listed.length, page)}</span>
          <Pages page={page} pages={pages} onPage={(p) => onChange({ page: p })} />
        </div>
      </div>
    </PageFrame>
  );
}

function Controls({ view, rows, spans, onChange }: Omit<StatsPageProps, "account">) {
  const players = view.tab === "Players";
  const who = players ? "player" : "coach";
  return (
    <div className="stats__controls">
      {players && (
        <ViewToggle<RoleKey | typeof ALL>
          options={[
            { value: ALL, label: "All" },
            ...ROLES.map((role) => ({
              value: role,
              label: (
                <span className="stats__role">
                  <RoleIcon role={role} className="stats__role-icon" />
                  {ROLE_NAME[role]}
                </span>
              ),
            })),
          ]}
          chosen={view.role}
          onChoose={(role) => onChange({ role })}
          label="Role"
        />
      )}
      <Select
        label="Team"
        value={view.team}
        options={[{ value: ALL, label: "All" }, ...(Object.keys(TEAMS) as TeamCode[]).map((code) => ({ value: code, label: code }))]}
        onChange={(team) => onChange({ team: team as TeamCode | typeof ALL })}
      />
      <Select
        label="Max price"
        value={view.maxPrice === null ? ALL : String(view.maxPrice)}
        options={[{ value: ALL, label: "Any" }, ...priceChoices(rows).map((p) => ({ value: String(p), label: eok(p) }))]}
        onChange={(price) => onChange({ maxPrice: price === ALL ? null : Number(price) })}
      />
      <Select label="Span" value={view.span} options={spans} onChange={(span) => onChange({ span })} />
      <ViewToggle<Figures>
        options={FIGURES}
        chosen={view.figures}
        onChoose={(figures) => onChange({ figures })}
        label="Totals or per game"
      />
      <span className="stats__gap" />
      <input
        className="stats__find"
        type="search"
        placeholder={`Find a ${who}`}
        aria-label={`Find a ${who}`}
        value={view.search}
        onChange={(e) => onChange({ search: e.target.value })}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="stats__select">
      <span className="stats__select-label">{label}</span>
      <select className="stats__select-input" value={value} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const eok = (priceEok: number) => formatEok(priceEok * WON_PER_EOK);

const cardOf = (r: StatsRow): Go =>
  r.role === "coach" ? { to: PATHS.coachCard, params: { coachId: r.id } } : { to: PATHS.playerCard, params: { playerId: r.id } };

/** A count as the toggle shows it: as it is, or over games to one decimal. Zero in mid grey. */
function Count({ n, games, figures }: { n: number; games: number; figures: Figures }) {
  return <span className={cx(n === 0 && "stats__zero")}>{figures === "Per game" ? perGame(n, games).toFixed(1) : n}</span>;
}

function Move({ moveEok }: { moveEok: number }) {
  if (moveEok === 0) return null;
  return (
    <span className="stats__move">
      <span className={moveEok > 0 ? "rise" : "fall"}>{Math.abs(moveEok).toFixed(1)}</span>
    </span>
  );
}

/** The list's columns: the name, price and move, form, owned, Pts, then Games and the lines. */
function columns(view: StatsView, onChange: StatsPageProps["onChange"]): Column<Ranked>[] {
  const sortable = (key: SortKey, head: string, cell: Column<Ranked>["cell"], group = false): Column<Ranked> => ({
    key,
    head: (
      <button type="button" className="stats__sort" onClick={() => onChange({ sort: key })}>
        {head}
      </button>
    ),
    cell: (r) => (view.sort === key ? <span className="stats__sorted">{cell(r)}</span> : cell(r)),
    figure: true,
    sorted: view.sort === key,
    group,
  });
  const line = ({ key, head }: Line) => sortable(key, head, (r) => <Count n={r.lines[key] ?? 0} games={r.games} figures={view.figures} />);
  const coaches = view.tab === "Coaches";
  return [
    {
      key: "name",
      head: <span className="stats__lead-head">{coaches ? "Coach" : "Player"}</span>,
      cell: (r) => <Lead row={r} />,
      fullText: (r) => r.name,
    },
    sortable("priceEok", "Price", (r) => eok(r.priceEok)),
    { key: "move", head: "", cell: (r) => <Move moveEok={r.moveEok} /> },
    sortable("form", "Form", (r) => r.form.toFixed(1)),
    sortable("ownedPct", "Owned", (r) => `${r.ownedPct}%`),
    sortable("points", "Pts", (r) => <Count n={r.points} games={r.games} figures={view.figures} />),
    sortable("games", "Games", (r) => r.games, true),
    ...(coaches ? [seriesColumn] : []),
    ...linesFor(view.tab).map(line),
  ];
}

const seriesColumn: Column<Ranked> = {
  key: "series",
  head: "Series",
  cell: (r) => (r.series ? `${r.series[0]}–${r.series[1]}` : ""),
  figure: true,
};

/** Rank, role icon, then the name (to his card), team and your dot. */
function Lead({ row }: { row: Ranked }) {
  return (
    <span className="stats__lead">
      <span className="stats__rank num">{row.rank}</span>
      <RoleIcon role={row.role} className="stats__lead-icon" />
      <GoLink go={cardOf(row)} className="stats__name">
        {row.name}
      </GoLink>
      <small className="stats__team num">{row.team}</small>
      {row.mine && <MeDot />}
    </span>
  );
}

function Pages({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  const key = (to: number, body: ReactNode, label: string, on = false) => (
    <button
      key={label}
      type="button"
      className={cx("stats__page num", on && "stats__page--on")}
      aria-label={label}
      aria-current={on ? "page" : undefined}
      disabled={to < 1 || to > pages}
      onClick={() => onPage(to)}
    >
      {body}
    </button>
  );
  return (
    <span className="stats__pages">
      {key(page - 1, "‹", "Page before")}
      {Array.from({ length: pages }, (_, i) => key(i + 1, i + 1, `Page ${i + 1}`, i + 1 === page))}
      {key(page + 1, "›", "Page after")}
    </span>
  );
}
