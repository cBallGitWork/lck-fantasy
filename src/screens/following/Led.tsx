import { cx } from "../../parts";
import "./following.css";

/** A truck's line on a dotted LED panel, in capitals, the same on every screen (plate.md, Never 2). */
export function Led({ big, children }: { big?: boolean; children: string }) {
  return <div className={cx("following__led", big && "following__led--big")}>{children}</div>;
}
