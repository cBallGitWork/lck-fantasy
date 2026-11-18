import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { Empty, PageFrame, rememberedView, rememberView, useDevState, VIEW_KEYS, weekInPath, weekSteps } from "../../parts";
import { PATHS, type Go } from "../../paths";
import type { SlotKey } from "../../rift";
import { PERFECT_LATEST_WEEK, PERFECT_WEEKS } from "./fixtures";
import { PerfectGame } from "./PerfectGame";
import { RIFT_VIEW, VIEWS, type PerfectGameData, type PerfectView } from "./types";
import { WORDS } from "./words";

/** The week a path names: `/perfect-game` the current week, `/perfect-game/3` Week 3; undefined for any other. */
export const perfectWeekOf = (param: string | undefined) => weekInPath(param, PERFECT_WEEKS, PERFECT_LATEST_WEEK);

/** The week's ‹ and ›: the week in the path (`/perfect-game/2`); none before Week 1 or past the current week. */
export const perfectWeekNav = (week: number) =>
  weekSteps(week, PERFECT_LATEST_WEEK, (n): Go => ({ to: PATHS.perfectGameWeek, params: { week: String(n) } }));

/**
 * The Perfect game routes, `/perfect-game` and `/perfect-game/$week`, on made-up Week 3 until the
 * backend picks each week's best team (docs/design/approved/perfect-game/).
 */
export function PerfectGameScreen() {
  const { week: param } = useParams({ strict: false });
  const week = perfectWeekOf(param);
  const game = week === undefined ? undefined : PERFECT_WEEKS.get(week);
  if (week === undefined || !game)
    return (
      <PageFrame screen="perfect-game" active="points" account={MANAGER.team}>
        <Empty title={WORDS.noWeek} />
      </PageFrame>
    );
  // Keyed by week, so stepping to another week opens with no one tapped.
  return <PerfectGameWeek key={week} game={game} week={week} />;
}

/**
 * One week's best team. It opens on the view shared with Pick Team and Points (spec/12); no one
 * tapped until a tap. `?state=rift` (Faker tapped) or `card` opens those pictures, in dev.
 */
function PerfectGameWeek({ game, week }: { game: PerfectGameData; week: number }) {
  const dev = useDevState<{ view: PerfectView; selected?: SlotKey }>({ rift: { view: RIFT_VIEW, selected: "mid" }, card: { view: VIEWS[1] } });
  const [view, setView] = useState<PerfectView>(() => dev?.view ?? rememberedView(VIEW_KEYS.board, VIEWS));
  const [selected, setSelected] = useState<SlotKey | undefined>(dev?.selected);
  const chooseView = (next: PerfectView) => {
    setView(next);
    rememberView(VIEW_KEYS.board, next);
  };
  return (
    <PerfectGame game={game} view={view} onView={chooseView} weekNav={perfectWeekNav(week)} selected={selected} onSelect={setSelected} />
  );
}
