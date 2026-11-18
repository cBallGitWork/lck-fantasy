import { useEffect } from "react";
import { useAnnounce } from "../frame/AppFrame";
import "./Toast.css";

/** How long a toast stays, in ms. */
const TOAST_MS = 3000;

/**
 * A short message at the foot of the page that goes by itself (`Kingen added`, `Max 2 from T1`),
 * as FPL's. `n` counts the messages, so the same words twice still show again. A screen reader hears
 * it through the page's one live region, not from the toast.
 */
export function Toast({ message, n, onDone }: { message: string; n: number; onDone: () => void }) {
  const announce = useAnnounce();
  useEffect(() => {
    announce(message);
  }, [n, message, announce]);
  useEffect(() => {
    const timer = setTimeout(onDone, TOAST_MS);
    return () => clearTimeout(timer);
  }, [n, onDone]);
  return (
    <div className="toast" aria-hidden="true">
      {message}
    </div>
  );
}
