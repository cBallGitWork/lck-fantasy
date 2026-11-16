import { useId, useState, type ReactNode } from "react";
import type { Go } from "../../paths";
import { cx } from "../util/cx";
import { GoLink } from "./GoLink";
import "./Menu.css";

/** One item: a link, or an action. `apart` sets it off under a rule, as `Delete league…` is. */
export type MenuItem = { label: string; apart?: boolean } & ({ go: Go } | { onChoose: () => void });

/**
 * A key that opens a list of links and actions under it (the account menu, a league's Admin menu).
 * Esc or a choice closes it. `startOpen` opens it at once, as a picture draws it.
 */
export function Menu({ label, items, className, startOpen = false }: { label: ReactNode; items: MenuItem[]; className?: string; startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const id = useId();
  return (
    <span className="menu" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <button
        type="button"
        className={cx("menu__key", className)}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {label}
      </button>
      {open && (
        <span id={id} className="menu__list">
          {items.map((item) => {
            const cls = cx("menu__item", item.apart && "menu__item--apart");
            return "go" in item ? (
              <GoLink key={item.label} className={cls} go={item.go}>
                {item.label}
              </GoLink>
            ) : (
              <button
                key={item.label}
                type="button"
                className={cls}
                onClick={() => {
                  setOpen(false);
                  item.onChoose();
                }}
              >
                {item.label}
              </button>
            );
          })}
        </span>
      )}
    </span>
  );
}
