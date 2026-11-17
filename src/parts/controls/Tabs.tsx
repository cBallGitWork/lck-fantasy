import type { ReactNode } from "react";
import { cx } from "../util/cx";
import "./Tabs.css";

const tabId = (id: string) => `${id}-tab`;
const panelId = (id: string) => `${id}-panel`;

/**
 * A page's or a card's sections: words in a row, the chosen one with a 2px underline. A tab list
 * whose tabs each control the one `TabPanel` given the same `id`; the keyboard reaches each with Tab.
 */
export function Tabs<T extends string>({
  id,
  tabs,
  chosen,
  onChoose,
  label,
}: {
  /** Shared with this switch's `TabPanel`, such as from `useId()`. */
  id: string;
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
          id={tab === chosen ? tabId(id) : undefined}
          className={cx("tabs__tab key-bare", tab === chosen && "tabs__tab--on")}
          aria-selected={tab === chosen}
          aria-controls={panelId(id)}
          onClick={() => onChoose?.(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/** The chosen tab's section, named by that tab. */
export function TabPanel({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <div className={className} role="tabpanel" id={panelId(id)} aria-labelledby={tabId(id)}>
      {children}
    </div>
  );
}
