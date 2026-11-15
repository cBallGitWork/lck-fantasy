import { cx } from "./cx";
import "./Tabs.css";

/**
 * A page's or a card's sections: words in a row, the chosen one with a 2px underline. Each is a
 * pressed-or-not key, as the view toggle's are, so the keyboard reaches each with Tab.
 */
export function Tabs<T extends string>({
  tabs,
  chosen,
  onChoose,
  label,
}: {
  tabs: readonly T[];
  chosen: T;
  onChoose?: (tab: T) => void;
  label?: string;
}) {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={cx("tabs__tab", tab === chosen && "tabs__tab--on")}
          aria-pressed={tab === chosen}
          onClick={() => onChoose?.(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
