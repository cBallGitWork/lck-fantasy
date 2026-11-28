import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { useDevState } from "../../parts";
import { leagueGo, leagueJoinGo, pathTo } from "../../paths";
import {
  BAD_CODE,
  COMPETITION,
  JOINABLE,
  LEAGUE_NAME_MAX,
  LEAGUES,
  MY_LEAGUES_NOW,
  NEW_LEAGUE,
  NEW_TABLE,
  OPEN_LEAGUE_ID,
  PRIVATE_LEAGUE_CAP,
  REMOVE_PICK,
  REMOVED_FROM,
  SCORING_WEEKS,
} from "./fixtures";
import { capReason, codeOf, freeCode, joinOutcome, makeLeague, privateCount, removeManager, renameLeague, withLeague, withoutLeague, type MyLeagues, type OpenForm } from "./forms";
import { LeagueList } from "./LeagueList";
import { LeaguesPage } from "./LeaguesPage";
import { LeagueTable, type LeagueActions, type MakerMode, type TableStatus } from "./LeagueTable";
import { OverallTable } from "./OverallTable";
import { CreatedSheet, CreateSheet, DeleteSheet, JoinSheet, LeaveSheet, RemoveSheet } from "./Sheets";
import { AT_CAP, BEFORE_DEADLINE, NO_PRIVATE, SOON, SOON_ID, UNRANKED } from "./stateFixtures";
import { tableKey, type OverallGroup, type PrivateEntry, type TableTab } from "./types";
import { WORDS } from "./words";

/** The page the made-up tables are: the top rows and the rows round yours. */
const FIRST_PAGE = 1;

/**
 * The made-up leagues, kept here so a league made or left survives the move between `/leagues` and
 * `/leagues/$leagueId`, two routes that each mount this screen. The backend holds them once wired (#38).
 */
let kept: MyLeagues = MY_LEAGUES_NOW;

/** A private league's link, as Copy link gives it: it opens Join a league with the code in (spec/08). */
const joinLink = (code: string) => new URL(pathTo(leagueJoinGo(code)), location.origin).href;

/** Copies to the clipboard; a missing or refused clipboard is logged, never dropped. */
function copy(what: string, words: string) {
  if (!navigator.clipboard) return console.error(`${what}: no clipboard here`, words);
  navigator.clipboard.writeText(words).catch((err: unknown) => console.error(`${what} failed`, err));
}

/** A picture's state (docs/design/approved/leagues/README.md): a sheet, the maker's mode, the leagues as they stand, the table's state, the league open. */
interface DevLeagues {
  form?: OpenForm;
  mode?: MakerMode;
  mine?: MyLeagues;
  status?: TableStatus;
  joinCode?: string;
  open?: string;
}

/** The Remove pictures' picked row, as the confirm opens on it. */
const removePicked: OpenForm = REMOVE_PICK ? { kind: "remove", id: OPEN_LEAGUE_ID, managerId: REMOVE_PICK.managerId, team: REMOVE_PICK.team } : null;

/**
 * Leagues and one league's table (`/leagues/$leagueId`), on the shared Week 3 of Split 1, with the league forms as sheets over it.
 * A league's link (`/leagues/join/$code`) opens Join a league with its code in; the manager still presses Join (spec/08).
 * In dev, `?state=` opens a picture's state: a sheet over the league, the maker's Admin menu, Rename or Remove, the cap, no private
 * league, a league yet to start, a table loading or failed, Overall before the deadline, or everyone Unranked.
 */
export function LeaguesScreen() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const dev = useDevState<DevLeagues>({
    admin: { mode: "admin" },
    rename: { mode: "renaming" },
    "remove-pick": { mode: "removing" },
    remove: { mode: "removing", form: removePicked },
    create: { form: { kind: "create" } },
    created: { form: { kind: "created", league: makeLeague(NEW_LEAGUE.name, SCORING_WEEKS[0].week, NEW_LEAGUE.code, NEW_TABLE).view } },
    join: { form: { kind: "join" } },
    "join-bad": { form: { kind: "join" }, joinCode: BAD_CODE },
    delete: { form: { kind: "delete", id: params.leagueId ?? OPEN_LEAGUE_ID } },
    leave: { form: { kind: "leave", id: params.leagueId ?? OPEN_LEAGUE_ID } },
    cap: { mine: AT_CAP },
    none: { mine: NO_PRIVATE, open: "overall" },
    soon: { mine: SOON, open: SOON_ID },
    loading: { status: "loading" },
    error: { status: "error" },
    before: { mine: BEFORE_DEADLINE, open: "overall" },
    unranked: { mine: UNRANKED, open: "overall" },
  });
  const leagueId = params.leagueId ?? dev?.open ?? OPEN_LEAGUE_ID;
  const linkedCode = params.code;
  const [mine, setMineState] = useState(dev?.mine ?? kept);
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
  const [status, setStatus] = useState(dev?.status);
  // A sheet belongs to the league it opened over, so Open league, moving to another, closes it.
  const [sheet, setSheet] = useState<{ on: string; form: OpenForm }>({ on: leagueId, form: dev?.form ?? (linkedCode ? { kind: "join" } : null) });
  const form = sheet.on === leagueId ? sheet.form : null;
  const open = (next: OpenForm) => setSheet({ on: leagueId, form: next });
  const close = () => open(null);
  const [joinError, setJoinError] = useState<string | undefined>(dev?.joinCode ? WORDS.noSuchCode : undefined);
  const privates = { count: privateCount(mine), cap: PRIVATE_LEAGUE_CAP };

  const add = (entry: PrivateEntry) => setMine(withLeague(mine, entry));
  const drop = (id: string) => {
    setMine(withoutLeague(mine, id));
    close();
  };
  const create = (name: string, scoringFrom: number) => {
    if (capReason(privates.count, privates.cap)) return;
    const startsOn = SCORING_WEEKS.find((w) => w.week === scoringFrom && w.week > NEW_TABLE.week);
    const made = makeLeague(name, scoringFrom, freeCode(NEW_LEAGUE.code, mine), NEW_TABLE, startsOn);
    add(made);
    open({ kind: "created", league: made.view });
  };
  const join = (codeOrLink: string) => {
    const outcome = joinOutcome(mine, JOINABLE, REMOVED_FROM, codeOrLink);
    if (outcome.kind === "none") return setJoinError(WORDS.noSuchCode);
    setJoinError(undefined);
    close();
    if (outcome.kind === "open") return void navigate(leagueGo(outcome.id));
    if (capReason(privates.count, privates.cap)) return;
    add(outcome.entry);
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
    status,
    onRetry: () => setStatus(undefined),
    page,
    onPage: setPage,
    onFindMe: () => setPage(FIRST_PAGE),
  };
  const actions: LeagueActions = {
    onCopyLink: () => {
      if (league.kind === "private") copy("Copy link", joinLink(league.code));
    },
    onRename: (name) => setMine(renameLeague(mine, league.id, name)),
    onRemove: (row) => open({ kind: "remove", id: league.id, managerId: row.managerId, team: row.team }),
    onDelete: () => open({ kind: "delete", id: league.id }),
    onLeave: () => open({ kind: "leave", id: league.id }),
  };
  const summary = mine.list.find((l) => l.id === league.id);

  return (
    <LeaguesPage
      account={MANAGER.team}
      list={<LeagueList leagues={mine.list} openId={league.id} privates={privates} onCreate={() => open({ kind: "create" })} onJoin={() => open({ kind: "join" })} />}
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
        <LeagueTable
          key={league.id}
          league={league}
          nameMax={LEAGUE_NAME_MAX}
          actions={actions}
          startMode={dev?.mode}
          picked={form?.kind === "remove" ? form.managerId : undefined}
          {...table}
        />
      )}

      {form?.kind === "create" && (
        <CreateSheet weeks={SCORING_WEEKS} nameMax={LEAGUE_NAME_MAX} privates={privates} initialName={NEW_LEAGUE.name} onCreate={create} onClose={close} />
      )}
      {form?.kind === "created" && (
        <CreatedSheet
          league={form.league}
          onCopyCode={() => copy("Copy code", form.league.code)}
          onCopyLink={() => copy("Copy link", joinLink(form.league.code))}
          onClose={close}
        />
      )}
      {form?.kind === "join" && (
        <JoinSheet
          privates={privates}
          initialCode={dev?.joinCode ?? (linkedCode ? codeOf(linkedCode) : JOINABLE[0]?.view.code)}
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
      {form?.kind === "remove" && (
        <RemoveSheet
          team={form.team}
          onRemove={() => {
            setMine(removeManager(mine, form.id, form.managerId));
            close();
          }}
          onClose={close}
        />
      )}
    </LeaguesPage>
  );
}
