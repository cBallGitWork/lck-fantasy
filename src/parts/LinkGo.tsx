import type { ReactNode } from "react";
import "./LinkGo.css";

/** A link that names where it goes and ends with `›`; one leaving Flol ends with `↗`. */
export function LinkGo({ href, out, children }: { href: string; out?: boolean; children: ReactNode }) {
  return (
    <a className="link-go" href={href} {...(out && { target: "_blank", rel: "noreferrer" })}>
      {children} {out ? "↗" : "›"}
    </a>
  );
}
