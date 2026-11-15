import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "./cx";
import "./Modal.css";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A card (1056 wide) or a sheet (544) over a dimmed page: ✕ top right, Esc closes, focus stays
 * inside until it closes, then returns to where it was.
 */
export function Modal({
  kind,
  title,
  onClose,
  children,
}: {
  kind: "card" | "sheet";
  /** The sheet's 20px title, and the dialog's name. */
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !box.current) return;
      const inside = [...box.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = inside[0];
      const last = inside[inside.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      before?.focus();
    };
  }, [onClose]);
  return (
    <div className="modal">
      <div className="modal__dim" onClick={onClose} />
      <div ref={box} className={cx("modal__box", `modal__box--${kind}`)} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        {kind === "sheet" && <h2 className="modal__title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
