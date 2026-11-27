import type { ReactNode } from "react";
import { PATHS, SCREEN_NAME } from "../../paths";
import { GoLink } from "../controls/GoLink";
import "./Columns.css";
import { cx } from "../util/cx";
import { RIOT_NOTICE, WORDS } from "../words";
import "./PageFrame.css";
import { TopBar, type TopBarItem } from "./TopBar";

/** The main column's id, which `Skip to content` jumps to. */
export const MAIN_ID = "main";

/** The foot's links, on every page: Help beside Privacy and Terms (spec/12, Help). */
const FOOT_LINKS = ["help", "privacy", "terms"] as const;

/**
 * `Skip to content` (unseen until focused), the top bar, then the page: the main column and, when
 * given, the 360px side column, 32px apart. The side column is on the right on every page. The
 * columns are Columns.css's. Every page's foot carries Riot's notice.
 */
export function PageFrame({
  screen,
  active,
  account,
  side,
  wideSide,
  stickMain,
  children,
}: {
  /** The screen's folder name (`src/screens/<screen>`), marked on the page for tests. */
  screen: string;
  active?: TopBarItem;
  /** The account menu's team name; null for a visitor. */
  account: string | null;
  side?: ReactNode;
  /** Transfers' frame: a 424 side column, and the main column kept on screen while the side scrolls (approved/transfers/). */
  wideSide?: boolean;
  /** The main column kept on screen while the side scrolls (Points, approved/points/; Transfers, with `wideSide`). */
  stickMain?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <a className="page-frame__skip" href={`#${MAIN_ID}`}>
        {WORDS.skip}
      </a>
      <TopBar active={active} account={account} />
      <div
        className={cx("page-frame", side !== undefined && "page-frame--two columns", wideSide && "page-frame--wide-side", (wideSide || stickMain) && "page-frame--stick")}
        data-screen={screen}
      >
        <main id={MAIN_ID} className="page-frame__main" tabIndex={-1}>
          {children}
        </main>
        {side !== undefined && <aside className="page-frame__side">{side}</aside>}
      </div>
      <footer className="page-frame__foot quiet">
        <nav className="page-frame__foot-links" aria-label="Foot">
          {FOOT_LINKS.map((key) => (
            <GoLink key={key} go={{ to: PATHS[key] }} className="page-frame__foot-link">
              {SCREEN_NAME[key]}
            </GoLink>
          ))}
        </nav>
        <p>{RIOT_NOTICE}</p>
      </footer>
    </>
  );
}
