import { PATHS, PRODUCT, SCREEN_NAME } from "../../paths";
import { GoLink } from "../controls/GoLink";
import { Menu, type MenuItem } from "../controls/Menu";
import { cx } from "../util/cx";
import { Placeholder } from "./Placeholder";
import "./TopBar.css";

const TOP_BAR_ITEMS = ["home", "pickTeam", "transfers", "points", "leagues", "stats", "lckHub", "live"] as const;

export type TopBarItem = (typeof TOP_BAR_ITEMS)[number];

/** A visitor's items: only what needs no team (front door picture, Craig 17 Nov 2026). */
const VISITOR_ITEMS: readonly TopBarItem[] = ["stats", "lckHub"];

/** The team-name ▾ menu: Settings, and Help (spec/12, Help). */
export const ACCOUNT_MENU: MenuItem[] = (["settings", "help"] as const).map((key) => ({ label: SCREEN_NAME[key], go: { to: PATHS[key] } }));

/** The link a visitor with an account takes (spec/09, Signing in again). */
export const LOG_IN = "Log in ›";

/**
 * The same on every screen: Flol, the eight items (Live's dot always shown), `presented by` the
 * sponsor, then the account menu. A visitor (`account` null) gets Stats and LCK, then `Log in ›`.
 */
export function TopBar({
  active,
  account,
  accountMenu,
}: {
  active?: TopBarItem;
  account: string | null;
  /** The account menu's items: Settings and Help, until a picture settles more. */
  accountMenu?: MenuItem[];
}) {
  const menu = accountMenu ?? ACCOUNT_MENU;
  return (
    <nav className="top-bar" aria-label={PRODUCT}>
      <GoLink className="top-bar__word" go={{ to: PATHS.home }}>
        {PRODUCT}
      </GoLink>
      {(account === null ? VISITOR_ITEMS : TOP_BAR_ITEMS).map((key) => (
        <GoLink
          key={key}
          go={{ to: PATHS[key] }}
          className={cx("top-bar__item", key === active && "top-bar__item--on", key === "live" && "top-bar__item--live")}
          current={key === active}
        >
          {SCREEN_NAME[key]}
        </GoLink>
      ))}
      <span className="top-bar__space" />
      <span className="top-bar__presented quiet">
        presented by <Placeholder word="Sponsor" width="sponsorTopW" height="target" />
      </span>
      {account === null ? (
        <GoLink className="top-bar__me" go={{ to: PATHS.pickTeam }}>
          {LOG_IN}
        </GoLink>
      ) : (
        <Menu label={`${account} ▾`} items={menu} className="top-bar__me" />
      )}
    </nav>
  );
}
