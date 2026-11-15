import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { PATHS, pathTo } from "../../paths";
import { LEAGUE_LIST, LEAGUES, OPEN_LEAGUE_ID } from "./fixtures";
import { LeagueList } from "./LeagueList";
import { LeaguesPage } from "./LeaguesPage";
import { LeagueTable, type LeagueActions } from "./LeagueTable";
import { OverallTable } from "./OverallTable";
import { tableKey, type OverallGroup, type TableTab } from "./types";

/** The page the made-up tables are: the top rows and the rows round yours. */
const FIRST_PAGE = 1;

/** Opens a sheet the league forms (#139) draw; nothing until they are wired here. */
const toSheet = () => {};

/** Leagues and one league's table (`/leagues/$leagueId`), on the picture's made-up Split 2 Week 14. */
export function LeaguesScreen() {
  const { leagueId = OPEN_LEAGUE_ID } = useParams({ strict: false });
  const league = LEAGUES[leagueId] ?? LEAGUES[OPEN_LEAGUE_ID]!;
  const [names, setNames] = useState<Record<string, string>>({});
  const [tabs, setTabs] = useState<Record<string, TableTab>>({});
  const [chosenGroup, setGroup] = useState<OverallGroup | null>(null);
  const group = league.kind === "overall" ? (chosenGroup ?? league.openGroup) : undefined;
  const [pages, setPages] = useState<Record<string, number>>({});
  const page = pages[league.id] ?? FIRST_PAGE;
  const setPage = (next: number) => setPages({ ...pages, [league.id]: next });

  const renamed = <L extends { id: string; name: string }>(l: L): L => ({ ...l, name: names[l.id] ?? l.name });
  const named = renamed(league);
  const tab = tabs[league.id] ?? league.openTab;
  const table = {
    tab,
    onTab: (next: TableTab) => {
      setTabs({ ...tabs, [league.id]: next });
      setPage(FIRST_PAGE);
    },
    table: page === FIRST_PAGE ? league.tables[tableKey(tab, group)] : undefined,
    page,
    onPage: setPage,
    onFindMe: () => setPage(FIRST_PAGE),
  };
  const actions: LeagueActions = {
    onCopyLink: () => {
      const link = new URL(pathTo({ to: PATHS.league, params: { leagueId: league.id } }), location.origin).href;
      if (!navigator.clipboard) return console.error("Copy link: no clipboard here", link);
      navigator.clipboard.writeText(link).catch((err: unknown) => console.error("Copy link failed", err));
    },
    onRename: (name) => setNames({ ...names, [league.id]: name }),
    onRemoveManager: toSheet,
    onDelete: toSheet,
    onLeave: toSheet,
  };

  return (
    <LeaguesPage
      account={MANAGER.team}
      list={<LeagueList leagues={LEAGUE_LIST.map(renamed)} openId={league.id} onCreate={toSheet} onJoin={toSheet} />}
    >
      {named.kind === "overall" ? (
        <OverallTable
          league={named}
          group={group ?? named.openGroup}
          onGroup={(next) => {
            setGroup(next);
            setPage(FIRST_PAGE);
          }}
          {...table}
        />
      ) : (
        <LeagueTable key={league.id} league={named} actions={actions} {...table} />
      )}
    </LeaguesPage>
  );
}
