import { Link, type LinkComponentProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Go } from "../../paths";

/**
 * A link inside Flol, through the router: no page reload, and a path or param that doesn't exist
 * fails the typecheck (`Go`). Every part's internal link is one of these.
 */
export function GoLink({
  go,
  className,
  label,
  current,
  children,
}: {
  go: Go;
  className?: string;
  /** The link's name for screen readers, where its text is only `›`. */
  label?: string;
  /**
   * Marks the top bar's chosen item where it isn't the page's own path (Perfect game is under
   * Points). The router marks a link to the page you are on itself.
   */
  current?: boolean;
  children: ReactNode;
}) {
  // `Go` is checked against PATHS, the router's own paths, so this one cast is safe.
  const target = go as unknown as LinkComponentProps;
  return (
    <Link {...target} className={className} aria-label={label} aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}
