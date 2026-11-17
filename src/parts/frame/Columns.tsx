import type { ReactNode } from "react";
import "./Columns.css";
import { cx } from "../util/cx";

/**
 * The frame's two columns, the main then the 360px side, 32px apart. For a page whose head runs
 * full width above them; `className` carries the page's own margins.
 */
export function Columns({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("columns", className)}>{children}</div>;
}
