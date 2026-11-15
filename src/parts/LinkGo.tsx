import type { ReactNode } from "react";
import type { Go } from "../paths";
import { GoLink } from "./GoLink";
import "./LinkGo.css";

/** A link that names where it goes and ends with `›`; one leaving Flol (`out`, its address) ends with `↗`. */
export function LinkGo({ children, ...to }: { children: ReactNode } & ({ go: Go } | { out: string })) {
  if ("out" in to) {
    return (
      <a className="link-go" href={to.out} target="_blank" rel="noreferrer">
        {children} ↗
      </a>
    );
  }
  return (
    <GoLink go={to.go} className="link-go">
      {children} ›
    </GoLink>
  );
}
