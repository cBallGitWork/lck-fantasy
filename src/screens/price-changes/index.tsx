import { useParams } from "@tanstack/react-router";
import { MANAGER } from "../../fixtures/week3";
import { Empty, PageFrame, weekInPath } from "../../parts";
import { helpGo, PATHS, PRICES_RULE, type Go } from "../../paths";
import { LATEST_PRICE_WEEK, PRICE_WEEKS } from "./fixtures";
import { PriceChangesPage } from "./PriceChangesPage";
import { WORDS } from "./words";

/** The week a path names: `/price-changes` the latest, `/price-changes/4` Week 4; undefined for any other. */
export const weekOf = (param: string | undefined) => weekInPath(param, PRICE_WEEKS, LATEST_PRICE_WEEK);

/** Where ‹ or › goes from `week`: the week that way's address, or none where there is no such week. */
export function stepWeek(week: number, step: -1 | 1): Go | undefined {
  const to = week + step;
  return PRICE_WEEKS.has(to) ? { to: PATHS.priceChangesWeek, params: { week: String(to) } } : undefined;
}

/** The Price changes routes, `/price-changes` and `/price-changes/$week`, on made-up weeks until the backend feeds them. */
export function PriceChangesScreen() {
  const { week: param } = useParams({ strict: false });
  const week = weekOf(param);
  const data = week === undefined ? undefined : PRICE_WEEKS.get(week);
  if (week === undefined || !data)
    return (
      <PageFrame screen="price-changes" active="stats" account={MANAGER.team}>
        <Empty title={WORDS.noWeek} />
      </PageFrame>
    );
  return <PriceChangesPage week={data} prev={stepWeek(week, -1)} next={stepWeek(week, 1)} howPricesMove={helpGo(PRICES_RULE)} />;
}
