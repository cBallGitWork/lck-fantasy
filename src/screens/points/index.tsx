import { POINTS_FIXTURE } from "./fixtures";
import { PointsPage } from "./PointsPage";
import { POINTS_VIEWS, type PointsView } from "./types";

/** The browser storage key the manager's last Points view is kept under (spec/12: then remembered). */
export const POINTS_VIEW_KEY = "flol.pointsView";

/** The view kept in this browser, or Rift view on the first visit or where storage can't be read. */
export function rememberedView(storage: Pick<Storage, "getItem"> | undefined): PointsView {
  try {
    const kept = storage?.getItem(POINTS_VIEW_KEY);
    return POINTS_VIEWS.find((v) => v === kept) ?? POINTS_VIEWS[0];
  } catch {
    return POINTS_VIEWS[0];
  }
}

function rememberView(view: PointsView) {
  try {
    localStorage.setItem(POINTS_VIEW_KEY, view);
  } catch {
    // Storage blocked (a private window): the view is simply not remembered.
  }
}

const browserStorage = () => (typeof localStorage === "undefined" ? undefined : localStorage);

/** The Points route, on Week 3's made-up data until the backend feeds it. */
export function PointsScreen() {
  return <PointsPage data={POINTS_FIXTURE} view={rememberedView(browserStorage())} onView={rememberView} />;
}
