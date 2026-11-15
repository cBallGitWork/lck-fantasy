import { cx } from "./cx";
import "./ViewToggle.css";

/** Butted keys on `--fill`, the chosen one on `--paper`: `Rift view | Card view`. */
export function ViewToggle<T extends string>({
  options,
  chosen,
  onChoose,
  label,
}: {
  options: readonly T[];
  chosen: T;
  onChoose?: (option: T) => void;
  label?: string;
}) {
  return (
    <span className="view-toggle" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={cx("view-toggle__key", option === chosen && "view-toggle__key--on")}
          aria-pressed={option === chosen}
          onClick={() => onChoose?.(option)}
        >
          {option}
        </button>
      ))}
    </span>
  );
}
