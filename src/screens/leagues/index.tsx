import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { useDevState } from "../../parts";
import { PATHS, pathTo } from "../../paths";
import {
  COMPETITION,
  JOINABLE,
  LEAGUE_LIST,
  LEAGUE_NAME_MAX,
  LEAGUES,
  NEW_LEAGUE,
  NEW_TABLE,
  NO_SUCH_CODE,
  OPEN_LEAGUE_ID,
  PRIVATE_LEAGUE_CAP,
  SCORING_WEEKS,
} from "./fixtures";
import { capReason, findByCode, freeCode, makeLeague, privateCount, renameLeague, withLeague, withoutLeague, type MyLeagues, type OpenForm } from "./forms";
import { LeagueList } from "./LeagueList";
import { LeaguesPage } from "./LeaguesPage";
import { LeagueTable, type LeagueActions } from "./LeagueTable";
import { OverallTable } from "./OverallTable";
import { CreatedSheet, CreateSheet, DeleteSheet, JoinSheet, LeaveSheet } from "./Sheets";
import { tableKey, type OverallGroup, type PrivateEntry, type TableTab } from "./types";

/** The page the made-up tables are: the top rows and the rows round yours. */
const FIRST_PAGE = 1;

/**
 * The made-up leagues, kept here so a league made or left survives the move between `/leagues` and
 * `/leagues/$leagueId`, two routes that each mount this screen. The backend holds them once wired (#38).
 */
let kept: MyLeagues = { list: LEAGUE_LIST, views: LEAGUES };

/** A league's link, as Copy link gives it. */
const leagueLink = (leagueId: string) => new URL(pathTo({ to: PATHS.league, params: { leagueId } }), location.origin).href;

/** Copies to the clipboard; a missing or refused clipboard is logged, never dropped. */
function copy(what: string, words: string) {
  if (!navigator.clipboard) return console.error(`${what}: no clipboard here`, words);
  navigator.clipboard.writeText(words).catch((err: unknown) => console.error(`${what} failed`, err));
}

/** Remove a manager picks a row then confirms (README); no picture draws either yet. */
const removeManager = () => console.warn("Remove a manager: no picture of its row pick or confirm yet");

/**
 * Leagues and one league's table (`/leagues/$leagueId`), on the shared Week 3 of Split 1, with the league forms as sheets over it.
 * In dev, `?state=` opens a picture's sheet over the league (`create`, `created`, `join`, `delete`, `leave`) or its Admin menu (`admin`).
 */
export function LeaguesScreen() {
  const { leagueId = OPEN_LEAGUE_ID } = useParams({ strict: false });
  const dev = useDevState<{ form?: OpenForm; adminOpen?: true }>({
    admin: { adminOpen: true },
    create: { form: { kind: "create" } },
    created: { form: { kind: "created", league: makeLeague(NEW_LEAGUE.name, SCORING_WEEKS[0].week, NEW_LEAGUE.code, NEW_TABLE).view } },
    join: { form: { kind: "join" } },
    delete: { form: { kind: "delete", id: leagueId } },
    leave: { form: { kind: "leave", id: leagueId } },
  });
  const [mine, setMineState] = useState(kept);
  const setMine = (next: MyLeagues) => {
    kept = next;
    setMineState(next);
  };
  // A league left or deleted while open gives way to the first league, then Overall.
  const league = mine.views[leagueId] ?? mine.views[OPEN_LEAGUE_ID] ?? LEAGUES.overall!;
  const [tabs, setTabs] = useState<Record<string, TableTab>>({});
  const [chosenGroup, setGroup] = useState<OverallGroup | null>(null);
  const group = league.kind === "overall" ? (chosenGroup ?? league.openGroup) : undefined;
  const [pages, setPages] = useState<Record<string, number>>({});
  const page = pages[league.id] ?? FIRST_PAGE;
  const setPage = (next: number) => setPages({ ...pages, [league.id]: next });
  // A sheet belongs to the league it opened over, so Open league, moving to another, closes it.
  const [sheet, setSheet] = useState<{ on: string; form: OpenForm }>({ on: leagueId, form: dev?.form ?? null });
  const form = sheet.on === leagueId ? sheet.form : null;
  const open = (next: OpenForm) => setSheet({ on: leagueId, form: next });
  const close = () => open(null);
  const [joinError, setJoinError] = useState<string>();
  const privates = { count: privateCount(mine), cap: PRIVATE_LEAGUE_CAP };

  const add = (entry: PrivateEntry) => setMine(withLeague(mine, entry));
  const drop = (id: string) => {
    setMine(withoutLeague(mine, id));
    close();
  };
  const create = (name: string, scoringFrom: number) => {
    if (capReason(privates.count, privates.cap)) return;
    const made = makeLeague(name, scoringFrom, freeCode(NEW_LEAGUE.code, mine), NEW_TABLE);
    add(made);
    open({ kind: "created", league: made.view });
  };
  const join = (codeOrLink: string) => {
    const found = findByCode(JOINABLE, codeOrLink);
    if (!found) return setJoinError(NO_SUCH_CODE);
    setJoinError(undefined);
    if (!(found.view.id in mine.views)) {
      if (capReason(privates.count, privates.cap)) return;
      add(found);
    }
    close();
  };

  const tab = tabs[league.id] ?? league.openTab;
  const table = {
    competition: COMPETITION,
    tab,
    onTab: (next: TableTab) => {
      setTabs({ ...tabs, [league.id]: next });
      setPage(FIRST_PAGE);
    },
    table: page === FIRST_PAGE ? league.tables[tableKey(COMPETITION, tab, group)] : undefined,
    page,
    onPage: setPage,
    onFindMe: () => setPage(FIRST_PAGE),
  };
  const actions: LeagueActions = {
    onCopyLink: () => copy("Copy link", leagueLink(league.id)),
    onRename: (name) => setMine(renameLeague(mine, league.id, name)),
    onRemoveManager: removeManager,
    onDelete: () => open({ kind: "delete", id: league.id }),
    onLeave: () => open({ kind: "leave", id: league.id }),
  };
  const summary = mine.list.find((l) => l.id === league.id);

  return (
    <LeaguesPage
      account={MANAGER.team}
      list={<LeagueList leagues={mine.list} openId={league.id} onCreate={() => open({ kind: "create" })} onJoin={() => open({ kind: "join" })} />}
    >
      {league.kind === "overall" ? (
        <OverallTable
          league={league}
          group={group ?? league.openGroup}
          onGroup={(next) => {
            setGroup(next);
            setPage(FIRST_PAGE);
          }}
          {...table}
        />
      ) : (
        <LeagueTable key={league.id} league={league} nameMax={LEAGUE_NAME_MAX} actions={actions} adminOpen={dev?.adminOpen} {...table} />
      )}

      {form?.kind === "create" && (
        <CreateSheet weeks={SCORING_WEEKS} nameMax={LEAGUE_NAME_MAX} privates={privates} initialName={NEW_LEAGUE.name} onCreate={create} onClose={close} />
      )}
      {form?.kind === "created" && (
        <CreatedSheet
          league={form.league}
          onCopyCode={() => copy("Copy code", form.league.code)}
          onCopyLink={() => copy("Copy link", leagueLink(form.league.id))}
          onClose={close}
        />
      )}
      {form?.kind === "join" && (
        <JoinSheet
          privates={privates}
          initialCode={JOINABLE[0]?.view.code}
          error={joinError}
          onJoin={join}
          onClose={() => {
            setJoinError(undefined);
            close();
          }}
        />
      )}
      {form?.kind === "leave" && summary && <LeaveSheet name={summary.name} rank={summary.rank} size={summary.size} onLeave={() => drop(form.id)} onClose={close} />}
      {form?.kind === "delete" && summary && league.kind === "private" && (
        <DeleteSheet name={league.name} size={summary.size} scoringFrom={league.scoringFrom} onDelete={() => drop(form.id)} onClose={close} />
      )}
    </LeaguesPage>
  );
}
