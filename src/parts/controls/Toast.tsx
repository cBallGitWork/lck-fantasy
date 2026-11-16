import { useEffect } from "react";
import "./Toast.css";

/** How long a toast stays, in ms. */
export const TOAST_MS = 3000;

/**
 * A short message at the foot of the page that goes by itself (`Kingen added`, `Team full: 2 from T1`),
 * as FPL's. `n` counts the messages, so the same words twice still show again.
 */
export function Toast({ message, n, onDone }: { message: string; n: number; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, TOAST_MS);
    return () => clearTimeout(timer);
  }, [n, onDone]);
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
