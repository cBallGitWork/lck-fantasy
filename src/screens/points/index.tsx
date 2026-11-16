import { useParams } from "@tanstack/react-router";
import { MANAGER } from "../../fixtures/week3";
import { Empty, PageFrame } from "../../parts";
import { BOARD_VIEWS, type BoardView } from "../../rift";
import { LATEST_WEEK, POINTS_WEEKS } from "./fixtures";
import { PointsPage } from "./PointsPage";

/** The browser storage key the manager's last Points view is kept under (spec/12: then remembered). */
export const POINTS_VIEW_KEY = "flol.pointsView";

/** The view kept in this browser, or Rift view on the first visit or where storage can't be read. */
export function rememberedView(storage: Pick<Storage, "getItem"> | undefined): BoardView {
  try {
    const kept = storage?.getItem(POINTS_VIEW_KEY);
    return BOARD_VIEWS.find((v) => v === kept) ?? BOARD_VIEWS[0];
  } catch {
    return BOARD_VIEWS[0];
  }
}

function rememberView(view: BoardView) {
  try {
    localStorage.setItem(POINTS_VIEW_KEY, view);
  } catch {
    // Storage blocked (a private window): the view is simply not remembered.
  }
}

const browserStorage = () => (typeof localStorage === "undefined" ? undefined : localStorage);

/** The week a path names: `/points` the latest, `/points/2` Week 2; undefined for any other. */
export function weekOf(param: string | undefined): number | undefined {
  if (param === undefined) return LATEST_WEEK;
  const week = /^\d+$/.test(param) ? Number(param) : NaN;
  return POINTS_WEEKS.has(week) ? week : undefined;
}

/** The Points routes, `/points` and `/points/$week`, on made-up Weeks 1 to 3 until the backend feeds them. */
export function PointsScreen() {
  const { week: param } = useParams({ strict: false });
  const week = weekOf(param);
  const data = week === undefined ? undefined : POINTS_WEEKS.get(week);
  if (!data)
    return (
      <PageFrame screen="points" active="points" account={MANAGER.team}>
        <Empty title="No such week" />
      </PageFrame>
    );
  // Keyed by week, so stepping to another week closes the open breakdown.
  return <PointsPage key={week} data={data} view={rememberedView(browserStorage())} onView={rememberView} />;
}
