import type { ReactNode } from "react";
import "./OutlinedKey.css";

/** Any action but the screen's main one: an outlined key (`Join a league`, `Copy link`). */
export function OutlinedKey({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="outlined-key" onClick={onClick}>
      {children}
    </button>
  );
}
