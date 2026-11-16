import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { pageTitle } from "../../paths";
import { focusPage, openerOf, type Opener } from "./pageFocus";

/** Says a line through the page's one live region. Outside the app's frame (a part's test) it does nothing. */
const AnnounceContext = createContext<(line: string) => void>(() => {});

/** The page's announcer: `announce("Saved")` reads the line out once, politely (WCAG 4.1.3). */
export const useAnnounce = () => useContext(AnnounceContext);

/** The one polite live region, unseen; a new `n` reads the same line again. */
export function LiveRegion({ line, n }: { line: string; n: number }) {
  return (
    <div className="unseen" role="status" aria-live="polite">
      <span key={n}>{line}</span>
    </div>
  );
}

/**
 * Round every route: the tab's title (`Pick Team · Flol`), focus moved on arriving at a page
 * (pageFocus.ts), and the live region every page announces through.
 */
export function AppFrame({ routeId, path, children }: { routeId: string | undefined; path: string; children: ReactNode }) {
  const [said, setSaid] = useState({ line: "", n: 0 });
  const announce = useCallback((line: string) => setSaid((s) => ({ line, n: s.n + 1 })), []);
  const opener = useRef<Opener | null>(null);
  const shown = useRef(path);
  useEffect(() => {
    const remember = (e: MouseEvent) => {
      const followed = openerOf(e.target, window.location.pathname);
      if (followed) opener.current = followed;
    };
    document.addEventListener("click", remember, true);
    return () => document.removeEventListener("click", remember, true);
  }, []);
  useEffect(() => {
    if (shown.current === path) return;
    shown.current = path;
    // After the new page has drawn, and after a pop-up on it has taken focus.
    const frame = requestAnimationFrame(() => focusPage(path, opener));
    return () => cancelAnimationFrame(frame);
  }, [path]);
  return (
    <AnnounceContext value={announce}>
      <title>{pageTitle(routeId)}</title>
      {children}
      <LiveRegion {...said} />
    </AnnounceContext>
  );
}
