import type { ReactNode } from "react";
import "./Columns.css";
import { cx } from "../util/cx";
import "./PageFrame.css";
import { TopBar, type TopBarItem } from "./TopBar";

/**
 * The top bar, then the page: the main column and, when given, the 360px side column, 32px apart.
 * The side column is on the right on every page. The columns are Columns.css's.
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
      <TopBar active={active} account={account} />
      <div className={cx("page-frame", side !== undefined && "page-frame--two columns")} data-screen={screen}>
        <main>{children}</main>
        {side !== undefined && <aside>{side}</aside>}
      </div>
    </>
  );
}
