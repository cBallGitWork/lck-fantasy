import { PATHS } from "../../paths";
import { GoLink } from "../controls/GoLink";
import { Menu, type MenuItem } from "../controls/Menu";
import { cx } from "../util/cx";
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
export function TopBar({
  active,
  account,
  accountMenu,
}: {
  active?: TopBarItem;
  account: string | null;
  /** The account menu's items. Until a picture settles them, the team name links to Settings. */
  accountMenu?: MenuItem[];
}) {
  return (
    <nav className="top-bar" aria-label="Flol">
      <GoLink className="top-bar__word" go={{ to: PATHS.home }}>
        Flol
      </GoLink>
      {TOP_BAR_ITEMS.map(([key, label]) => (
        <GoLink
          key={key}
          go={{ to: PATHS[key] }}
          className={cx("top-bar__item", key === active && "top-bar__item--on", key === "live" && "top-bar__item--live")}
          current={key === active}
        >
          {label}
        </GoLink>
      ))}
      <span className="top-bar__space" />
      <span className="top-bar__presented quiet">
        presented by <Placeholder word="Sponsor" width="sponsorTopW" height="target" />
      </span>
      {account === null ? (
        <GoLink className="top-bar__me" go={{ to: PATHS.pickTeam }}>
          Sign in
        </GoLink>
      ) : accountMenu ? (
        <Menu label={`${account} ▾`} items={accountMenu} className="top-bar__me" />
      ) : (
        <GoLink className="top-bar__me" go={{ to: PATHS.settings }}>
          {account} ▾
        </GoLink>
      )}
    </nav>
  );
}
