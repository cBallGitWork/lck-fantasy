import { measure } from "../theme/tokens";
import { PATHS } from "../paths";
import { cx } from "./cx";
import { Placeholder } from "./Placeholder";
import "./TopBar.css";

export const TOP_BAR_ITEMS = [
  ["home", "Home"],
  ["pickTeam", "Pick Team"],
  ["transfers", "Transfers"],
  ["points", "Points"],
  ["leagues", "Leagues"],
  ["stats", "Stats"],
  ["lckHub", "LCK"],
  ["live", "Live"],
] as const;

export type TopBarItem = (typeof TOP_BAR_ITEMS)[number][0];

/**
 * The same on every screen: Flol, the eight items (Live's dot always shown), `presented by` the
 * sponsor, then the account menu, or `Sign in` for a visitor (`account` null).
 */
export function TopBar({ active, account }: { active?: TopBarItem; account: string | null }) {
  return (
    <nav className="top-bar" aria-label="Flol">
      <a className="top-bar__word" href={PATHS.home}>
        Flol
      </a>
      {TOP_BAR_ITEMS.map(([key, label]) => (
        <a
          key={key}
          href={PATHS[key]}
          className={cx("top-bar__item", key === active && "top-bar__item--on", key === "live" && "top-bar__item--live")}
          aria-current={key === active ? "page" : undefined}
        >
          {label}
        </a>
      ))}
      <span className="top-bar__space" />
      <span className="top-bar__presented">
        presented by <Placeholder word="Sponsor" width={measure.sponsorTopW} height={measure.target} />
      </span>
      {account === null ? (
        <a className="top-bar__me" href={PATHS.pickTeam}>
          Sign in
        </a>
      ) : (
        <a className="top-bar__me" href={PATHS.settings}>
          {account} ▾
        </a>
      )}
    </nav>
  );
}
