import { cx } from "../util/cx";
import "./Led.css";

/** A truck's line on its dotted LED panel, in capitals, the same on every screen (plate.md, Never 2); `big` for the picker's preview. */
export function Led({ big, children }: { big?: boolean; children: string }) {
  return <div className={cx("led", big && "led--big")}>{children}</div>;
}
