import type { ReactNode } from "react";
import { cx } from "../util/cx";
import "./ViewToggle.css";

/** A key: its value alone, or a value with what the key shows (a role icon and a word on Stats). */
export type ToggleOption<T extends string> = T | { value: T; label: ReactNode };

const valueOf = <T extends string>(o: ToggleOption<T>): T => (typeof o === "string" ? o : o.value);

/** Butted keys on `--fill`, the chosen one on `--paper`: `Rift view | Card view`. */
export function ViewToggle<T extends string>({
  options,
  chosen,
  onChoose,
  label,
}: {
  options: readonly ToggleOption<T>[];
  chosen: T;
  onChoose?: (option: T) => void;
  label?: string;
}) {
  return (
    <span className="view-toggle" role="group" aria-label={label}>
      {options.map((option) => {
        const value = valueOf(option);
        return (
          <button
            key={value}
            type="button"
            className={cx("view-toggle__key", value === chosen && "view-toggle__key--on")}
            aria-pressed={value === chosen}
            onClick={() => onChoose?.(value)}
          >
            {typeof option === "string" ? option : option.label}
          </button>
        );
      })}
    </span>
  );
}
