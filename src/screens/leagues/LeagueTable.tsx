import { useId, useState, type ReactNode } from "react";
import { BACK, Empty, ErrorState, MainAction, Menu, OutlinedKey, Panel, Table, TabPanel, Tabs, type Column, type MenuItem } from "../../parts";
import { CalendarMark } from "./Marks";
import { Pager } from "./Pager";
import { Standings, type Removing } from "./Standings";
import type { CompetitionTabs, LeagueView, StandingRow, Standings as StandingsData, TableTab } from "./types";
import { nameCount, scoringFrom, weekHead, weekStartsOn, WORDS } from "./words";

/** A table on its way, or one that didn't come (plate.md, States). */
export type TableStatus = "loading" | "error";

/** The table shown, and turning its tabs and pages. */
export interface TableProps {
  /** The competition's tabs and Overall's groups. */
  competition: CompetitionTabs;
  tab: TableTab;
  onTab: (tab: TableTab) => void;
  /** The table on this tab and page; absent when there is none yet. */
  table?: StandingsData;
  /** Set while the table loads, or when it didn't. */
  status?: TableStatus;
  onRetry: () => void;
  page: number;
  onPage: (page: number) => void;
  onFindMe: () => void;
}

/** What a member, or the maker, can do to a private league. */
export interface LeagueActions {
  onCopyLink: () => void;
  onRename: (name: string) => void;
  /** A manager picked to remove: the confirm opens. */
  onRemove: (row: StandingRow) => void;
  onDelete: () => void;
  onLeave: () => void;
}

/** What the maker is doing in the league's head: nothing, the Admin menu open, renaming, or picking a manager to remove. */
export type MakerMode = "idle" | "admin" | "renaming" | "removing";

/** A league's panel: its name on the band with what's beside it, then a line with the tabs at the left and the league's own keys at the right. */
export function LeaguePanel({
  title,
  sub,
  label,
  tabs,
  keys,
  children,
}: {
  title: ReactNode;
  sub?: string;
  label: string;
  tabs: ReactNode;
  keys?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Panel title={title} sub={sub} label={label} band className="leagues__panel">
      <div className="leagues__bar">
        {tabs}
        <span className="leagues__keys">{keys}</span>
      </div>
      <div className="leagues__body">{children}</div>
    </Panel>
  );
}

/** Rows a loading table draws, bars where its figures go. */
const LOADING_ROWS = 12;

/** The table, and its pager where it holds more than one page; or its state: on its way, didn't load, or none yet. `tiered`: Overall's season table, with its Tier column. */
export function TableBody({
  league,
  table,
  status,
  onRetry,
  page,
  onPage,
  onFindMe,
  tiered = false,
  removing,
}: { league: LeagueView; tiered?: boolean; removing?: Removing } & Omit<TableProps, "competition" | "tab" | "onTab">) {
  if (status === "loading") return <LoadingTable week={league.week} deadlinePassed={league.deadlinePassed} />;
  if (status === "error") return <ErrorState title={WORDS.tableFailed} line={WORDS.checkConnection} onRetry={onRetry} centre />;
  if (!table) {
    const starts = league.startsOn;
    return starts ? <Empty title={WORDS.noTable} line={weekStartsOn(starts.week, starts.starts)} mark={<CalendarMark />} centre /> : <Empty title={WORDS.noTable} centre />;
  }
  return (
    <>
      <Standings table={table} week={league.week} deadlinePassed={league.deadlinePassed} tiered={tiered} removing={removing} />
      {table.pages > 1 && <Pager pages={table.pages} page={page} onPage={onPage} onFindMe={onFindMe} />}
    </>
  );
}

/** A table on its way: its heads, and `--fill` bars where each row's figures go (plate.md, States). */
function LoadingTable({ week, deadlinePassed }: { week: number; deadlinePassed: boolean }) {
  const bar = () => <span className="leagues__skel" />;
  const columns: Column<number>[] = [
    { key: "rank", head: WORDS.rank, cell: bar },
    { key: "move", head: "", cell: bar },
    { key: "name", head: WORDS.teamManager, cell: bar },
    ...(deadlinePassed
      ? [
          { key: "captain", head: WORDS.captain, cell: bar },
          { key: "week", head: weekHead(week), figure: true, cell: bar },
        ]
      : []),
    { key: "total", head: WORDS.total, figure: true, cell: bar },
  ];
  return (
    <div role="status" aria-label={WORDS.tableLoading}>
      <Table
        columns={columns}
        rows={Array.from({ length: LOADING_ROWS }, (_, i) => i)}
        rowKey={String}
      />
    </div>
  );
}

/**
 * A league that isn't Overall: its name on the band and when its scoring starts; the competition's tabs, and for a private
 * league its code, Copy link, and Admin ▾ for the maker or Leave for a member; the table. The maker renames in place on the
 * band, and removes a manager by a Remove key on each row, Done in Admin's place.
 */
export function LeagueTable({
  league,
  nameMax,
  actions,
  startMode = "idle",
  picked,
  ...table
}: {
  league: Exclude<LeagueView, { kind: "overall" }>;
  /** The longest name Rename takes. */
  nameMax: number;
  actions: LeagueActions;
  /** What the maker is doing as it opens (the pictures' admin, rename and remove-pick). */
  startMode?: MakerMode;
  /** The manager picked to remove, filled behind the confirm. */
  picked?: string;
} & TableProps) {
  const [mode, setMode] = useState<MakerMode>(startMode);
  const tabsId = useId();
  const renaming = mode === "renaming";
  const title = renaming ? (
    <RenameField
      name={league.name}
      maxLength={nameMax}
      onDone={(next) => {
        setMode("idle");
        if (next) actions.onRename(next);
      }}
    />
  ) : (
    league.name
  );
  const keys =
    league.kind === "private" ? (
      <>
        <span className="leagues__code num">{league.code}</span>
        <OutlinedKey onClick={actions.onCopyLink}>{WORDS.copyLink}</OutlinedKey>
        {league.role === "member" ? (
          <OutlinedKey onClick={actions.onLeave}>{WORDS.leave}</OutlinedKey>
        ) : mode === "removing" ? (
          <OutlinedKey onClick={() => setMode("idle")}>{WORDS.done}</OutlinedKey>
        ) : (
          <Menu label={WORDS.admin} className="leagues__admin" items={adminItems(actions, setMode)} startOpen={mode === "admin"} />
        )}
      </>
    ) : undefined;
  return (
    <LeaguePanel
      title={title}
      sub={league.kind === "private" && !renaming ? scoringFrom(league.scoringFrom) : undefined}
      label={league.name}
      tabs={<Tabs id={tabsId} tabs={table.competition.tabs} chosen={table.tab} onChoose={table.onTab} label={WORDS.table} />}
      keys={keys}
    >
      <TabPanel id={tabsId}>
        <TableBody league={league} removing={mode === "removing" ? { onPick: actions.onRemove, picked } : undefined} {...table} />
      </TabPanel>
    </LeaguePanel>
  );
}

/** The maker's Admin menu: Rename edits the name in place; Remove a manager puts a Remove key on each row; Delete league… opens its sheet. */
export const adminItems = (actions: LeagueActions, setMode: (mode: MakerMode) => void): MenuItem[] => [
  { label: WORDS.rename, onChoose: () => setMode("renaming") },
  { label: WORDS.removeManager, onChoose: () => setMode("removing") },
  { label: WORDS.deleteLeague, onChoose: actions.onDelete, apart: true },
];

/** Rename, in place on the band: the name as a box with its count, then Save and Back. Enter saves, Esc goes back. A blank or unchanged name keeps the old. */
function RenameField({ name, maxLength, onDone }: { name: string; maxLength: number; onDone: (name: string | null) => void }) {
  const [value, setValue] = useState(name);
  const save = () => {
    const next = value.trim();
    onDone(next && next !== name ? next : null);
  };
  return (
    <span className="leagues__rename">
      <span className="leagues__rename-box">
        <input
          aria-label={WORDS.leagueName}
          value={value}
          maxLength={maxLength}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") onDone(null);
          }}
        />
        <small className="num">{nameCount(value.length, maxLength)}</small>
      </span>
      <MainAction onClick={save}>{WORDS.save}</MainAction>
      <OutlinedKey onClick={() => onDone(null)}>{BACK}</OutlinedKey>
    </span>
  );
}
