import { useParams } from "@tanstack/react-router";
import { MANAGER } from "../../fixtures/week3";
import { Empty, PageFrame, rememberedView, rememberView, VIEW_KEYS, weekInPath } from "../../parts";
import { LATEST_WEEK, POINTS_WEEKS } from "./fixtures";
import { PointsPage } from "./PointsPage";
import { POINTS_VIEWS, type PointsView } from "./types";
import { WORDS } from "./words";

/** Points shares its view with Pick Team and Perfect game (spec/12). */
const keepView = (view: PointsView) => rememberView(VIEW_KEYS.board, view);

/** The week a path names: `/points` the latest, `/points/2` Week 2; undefined for any other. */
export const weekOf = (param: string | undefined) => weekInPath(param, POINTS_WEEKS, LATEST_WEEK);

/** The Points routes, `/points` and `/points/$week`, on made-up Weeks 1 to 3 until the backend feeds them. */
export function PointsScreen() {
  const { week: param } = useParams({ strict: false });
  const week = weekOf(param);
  const data = week === undefined ? undefined : POINTS_WEEKS.get(week);
  if (!data)
    return (
      <PageFrame screen="points" active="points" account={MANAGER.team}>
        <Empty title={WORDS.noWeek} />
      </PageFrame>
    );
  // Keyed by week, so stepping to another week closes the open breakdown.
  return <PointsPage key={week} data={data} view={rememberedView(VIEW_KEYS.board, POINTS_VIEWS)} onView={keepView} />;
}
