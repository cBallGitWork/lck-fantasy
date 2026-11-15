import type { ReactNode } from "react";
import { cx } from "./cx";
import "./PageFrame.css";
import { TopBar, type TopBarItem } from "./TopBar";

/**
 * The top bar, then the page: the main column and, when given, the 360px side column, 32px apart.
 * The side column is on the right, save Leagues (`sideFirst`).
 */
export function PageFrame({
  screen,
  active,
  account,
  side,
  sideFirst,
  children,
}: {
  /** The screen's folder name (`src/screens/<screen>`), marked on the page for tests. */
  screen: string;
  active?: TopBarItem;
  /** The account menu's team name; null for a visitor. */
  account: string | null;
  side?: ReactNode;
  sideFirst?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <TopBar active={active} account={account} />
      <div className={cx("page-frame", side !== undefined && "page-frame--two", sideFirst && "page-frame--side-first")} data-screen={screen}>
        <main className="page-frame__main">{children}</main>
        {side !== undefined && <aside className="page-frame__side">{side}</aside>}
      </div>
    </>
  );
}
