import { cx } from "./cx";
import "./Tabs.css";

/** A page's or a card's sections: words in a row, the chosen one with a 2px underline. */
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
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          className={cx("tabs__tab", tab === chosen && "tabs__tab--on")}
          aria-selected={tab === chosen}
          onClick={() => onChoose?.(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
