import { cx } from "../util/cx";
import "./WarnMark.css";

/**
 * The warning triangle every error carries, in `--down`, so red is never its only sign (plate.md, States;
 * Craig, 28 Nov 2026): before a field's line, or over a panel's title. The error's words say it, so a
 * screen reader skips the mark. `big` is the size over a title.
 */
export function WarnMark({ big = false }: { big?: boolean }) {
  return (
    <svg className={cx("warn-mark", big && "warn-mark--big")} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2.5 18.5 17h-17z" />
      <path d="M10 8v4.5M10 14.8v.2" />
    </svg>
  );
}
