import { Panel } from "../frame/Panel";
import { cx } from "../util/cx";
import { SeriesList, type SeriesRow } from "./SeriesList";
import "./SeriesPanel.css";

/**
 * The week's series panel, one part on Points and Home (approved/points/, What binds 8; approved/home/,
 * What binds 4): its title on the band, then each series in a ruled row with both teams' bars, its
 * result, `Live` with the score, or its time.
 */
export function SeriesPanel({ title, series, className }: { title: string; series: readonly SeriesRow[]; className?: string }) {
  return (
    <Panel title={title} band className={cx("series-panel", className)}>
      <SeriesList series={series} ruled />
    </Panel>
  );
}
