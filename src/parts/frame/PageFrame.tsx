import type { ReactNode } from "react";
import { PRODUCT } from "../../paths";
import "./Columns.css";
import { cx } from "../util/cx";
import "./PageFrame.css";
import { TopBar, type TopBarItem } from "./TopBar";

/** The main column's id, which `Skip to content` jumps to. */
export const MAIN_ID = "main";

/** Riot's Legal Jibber Jabber notice, word for word as its policy requires (spec/13, Shirts and crests). */
export const RIOT_NOTICE = `${PRODUCT} was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.`;

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
  children,
}: {
  /** The screen's folder name (`src/screens/<screen>`), marked on the page for tests. */
  screen: string;
  active?: TopBarItem;
  /** The account menu's team name; null for a visitor. */
  account: string | null;
  side?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <a className="page-frame__skip" href={`#${MAIN_ID}`}>
        Skip to content
      </a>
      <TopBar active={active} account={account} />
      <div className={cx("page-frame", side !== undefined && "page-frame--two columns")} data-screen={screen}>
        <main id={MAIN_ID} className="page-frame__main" tabIndex={-1}>
          {children}
        </main>
        {side !== undefined && <aside className="page-frame__side">{side}</aside>}
      </div>
      <footer className="page-frame__foot quiet">
        <p>{RIOT_NOTICE}</p>
      </footer>
    </>
  );
}
