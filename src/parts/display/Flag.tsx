import { cx } from "../util/cx";
import "./Flag.css";

/** Each country's flag, held as data (`data/flags/<country>.svg`), keyed by its file name. */
const FLAGS: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>("../../../data/flags/*.svg", { eager: true, query: "?url", import: "default" })).map(
    ([path, url]) => [path.match(/([^/]+)\.svg$/)?.[1] ?? path, url],
  ),
);

/** A country's file name: `United Kingdom` is `united-kingdom`. */
const fileOf = (country: string) => country.toLowerCase().replace(/\s+/g, "-");

/** A country league's flag (Leagues' side list; plate.md, A league's mark); a dashed box where none is drawn yet. The name beside it says the country. */
export function Flag({ country, className }: { country: string; className?: string }) {
  const url = FLAGS[fileOf(country)];
  return url ? <img className={cx("flag", className)} src={url} alt="" /> : <span className={cx("flag", "flag--none", className)} />;
}
