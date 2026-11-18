import { useParams } from "@tanstack/react-router";
import { MANAGER } from "../../fixtures/week3";
import { Empty, LinkGo, PageFrame, useDevState } from "../../parts";
import { PATHS } from "../../paths";
import { SERIES_BY_ID, SERIES_VIEWS } from "./fixtures";
import { SeriesPage } from "./SeriesPage";
import { WORDS } from "./words";

/** The route `/series/$seriesId`, fed by the picture's made-up data until the backend wires it (#36). `?state=live` opens the live picture, in dev. */
export function SeriesScreen() {
  const { seriesId } = useParams({ strict: false });
  const view = useDevState({ live: SERIES_VIEWS.live }) ?? (seriesId === undefined ? undefined : SERIES_BY_ID[seriesId]);
  if (!view)
    return (
      <PageFrame screen="series" active="lckHub" account={MANAGER.team}>
        <Empty title={WORDS.noSuchSeries}>
          <LinkGo go={{ to: PATHS.lckHub }}>{WORDS.lckHub}</LinkGo>
        </Empty>
      </PageFrame>
    );
  return <SeriesPage view={view} account={MANAGER.team} />;
}
