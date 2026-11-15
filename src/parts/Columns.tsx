import type { ReactNode } from "react";
import "./Columns.css";
import { cx } from "./cx";

/**
 * The frame's two columns, the main then the 360px side, 32px apart; `sideFirst` puts the side on
 * the left (Leagues). For a page whose head runs full width above them; `className` carries the
 * page's own margins.
 */
export function Columns({ sideFirst, className, children }: { sideFirst?: boolean; className?: string; children: ReactNode }) {
  return <div className={cx("columns", sideFirst && "columns--side-first", className)}>{children}</div>;
}
