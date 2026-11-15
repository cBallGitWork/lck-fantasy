import { useRef, useState, type ReactNode } from "react";
import { Empty, Menu, OutlinedKey, Tabs, type MenuItem } from "../../parts";
import { Pager } from "./Pager";
import { Standings } from "./Standings";
import type { CompetitionTabs, LeagueView, Standings as StandingsData, TableTab } from "./types";

/** The table shown, and turning its tabs and pages. */
export interface TableProps {
  /** The competition's tabs and Overall's groups. */
  competition: CompetitionTabs;
  tab: TableTab;
  onTab: (tab: TableTab) => void;
  /** The table on this tab and page; absent when there is none yet. */
  table?: StandingsData;
  page: number;
  onPage: (page: number) => void;
  onFindMe: () => void;
}

/** What a member, or the maker, can do to a private league. */
export interface LeagueActions {
  onCopyLink: () => void;
  onRename: (name: string) => void;
  onRemoveManager: () => void;
  onDelete: () => void;
  onLeave: () => void;
}

/** A league's head: its name and what's beside it, then whatever sits on the right. */
export function LeagueHead({ name, sub, children }: { name: ReactNode; sub?: string; children?: ReactNode }) {
  return (
    <div className="leagues__head">
      {name}
      {sub && <small className="leagues__sub">{sub}</small>}
      <span className="leagues__spacer" />
      {children}
    </div>
  );
}

/** The table, and its pager where it holds more than one page. */
export function TableBody({ league, table, page, onPage, onFindMe }: { league: LeagueView } & Omit<TableProps, "competition" | "tab" | "onTab">) {
  if (!table) return <Empty title="No table yet" />;
  return (
    <>
      <Standings table={table} week={league.week} carryShown={league.carryShown} />
      {table.pages > 1 && <Pager pages={table.pages} page={page} onPage={onPage} onFindMe={onFindMe} />}
    </>
  );
}

/**
 * A league that isn't Overall: name and when its scoring starts; for a private league its code,
 * Copy link, and Admin ▾ for the maker or Leave for a member; Season, Split 1 and Split 2; the table.
 */
export function LeagueTable({ league, actions, ...table }: { league: Exclude<LeagueView, { kind: "overall" }>; actions: LeagueActions } & TableProps) {
  const [renaming, setRenaming] = useState(false);
  const name = renaming ? (
    <RenameField
      name={league.name}
      onDone={(next) => {
        setRenaming(false);
        if (next) actions.onRename(next);
      }}
    />
  ) : (
    <h2 className="leagues__name-head">{league.name}</h2>
  );
  return (
    <section className="leagues__panel" aria-label={league.name}>
      {league.kind === "private" ? (
        <LeagueHead name={name} sub={`Scoring from Week ${league.scoringFrom}`}>
          <span className="leagues__code num">{league.code}</span>
          <OutlinedKey onClick={actions.onCopyLink}>Copy link</OutlinedKey>
          {league.role === "maker" ? (
            <Menu label="Admin ▾" className="leagues__admin" items={adminItems(actions, () => setRenaming(true))} />
          ) : (
            <OutlinedKey onClick={actions.onLeave}>Leave</OutlinedKey>
          )}
        </LeagueHead>
      ) : (
        <LeagueHead name={name} />
      )}
      <Tabs tabs={table.competition.tabs} chosen={table.tab} onChoose={table.onTab} label="Table" />
      <TableBody league={league} {...table} />
    </section>
  );
}

/** The maker's Admin menu: Rename edits the name in place; the other two open their sheets. */
export const adminItems = (actions: LeagueActions, onRename: () => void): MenuItem[] => [
  { label: "Rename", onChoose: onRename },
  { label: "Remove a manager", onChoose: actions.onRemoveManager },
  { label: "Delete league…", onChoose: actions.onDelete, apart: true },
];

/** Rename, in place: Enter keeps the new name, Esc keeps the old. A blank name keeps the old. */
function RenameField({ name, onDone }: { name: string; onDone: (name: string | null) => void }) {
  const [value, setValue] = useState(name);
  const done = useRef(false);
  const finish = (keep: boolean) => {
    if (done.current) return;
    done.current = true;
    const next = value.trim();
    onDone(keep && next && next !== name ? next : null);
  };
  return (
    <input
      className="leagues__rename"
      aria-label="League name"
      value={value}
      autoFocus
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => finish(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") finish(false);
      }}
    />
  );
}
