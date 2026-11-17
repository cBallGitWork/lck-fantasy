import { useEffect, useRef, type ReactNode } from "react";
import { inertOutside } from "../frame/pageFocus";
import { cx } from "../util/cx";
import "./Modal.css";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Where Tab moves focus to keep it inside: the first after the last, the last before the first; else nowhere. */
export function wrapFocus<T>(inside: readonly T[], active: T | null, back: boolean): T | undefined {
  const first = inside[0];
  const last = inside[inside.length - 1];
  if (back && active === first) return last;
  if (!back && active === last) return first;
  return undefined;
}

/**
 * A card (1056 wide) or a sheet (544) over a dimmed page: ✕ top right, Esc closes, the page behind
 * is inert and focus stays inside until it closes, then returns to where it was.
 */
export function Modal({
  kind,
  title,
  onClose,
  strong,
  head,
  children,
}: {
  kind: "card" | "sheet";
  /** A sheet that must stand out from the page (Transfers' confirm): a heavy `--text` frame on `fill`. */
  strong?: boolean;
  /** The sheet's 20px title, and the dialog's name. */
  title: string;
  /** A sheet's own head, drawn in place of its title (a player's breakdown); the title still names the dialog. */
  head?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  const shell = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  // A page may pass a new onClose each render. The focus effect runs once per opening and reads
  // the latest onClose from here, so typing in a field inside never throws focus to the first one.
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const freePage = shell.current ? inertOutside(shell.current) : () => {};
    box.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== "Tab" || !box.current) return;
      const next = wrapFocus([...box.current.querySelectorAll<HTMLElement>(FOCUSABLE)], document.activeElement as HTMLElement | null, e.shiftKey);
      if (next) {
        e.preventDefault();
        next.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      freePage();
      before?.focus();
    };
  }, []);
  return (
    <div ref={shell} className="modal">
      <div className="modal__dim" onClick={onClose} />
      <div ref={box} className={cx("modal__box", `modal__box--${kind}`, strong && "modal__box--strong")} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="modal__close key-bare" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        {kind === "sheet" && (head ?? <h2 className="modal__title">{title}</h2>)}
        {children}
      </div>
    </div>
  );
}
