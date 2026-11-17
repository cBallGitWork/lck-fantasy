// Where focus goes when the page changes (WCAG 2.4.3, 4.1.3): back to the link that left a page
// when you come back to it (a player's pop-up closing), else to the new page's h1.

/** The link last followed: the page it was on, and its href. */
export interface Opener {
  path: string;
  href: string;
}

/** The href to give focus back to on arriving at `path`: the opener's, when it left this very page; else none, and the h1 takes it. */
export function returnTo(path: string, opener: Opener | null): string | null {
  return opener && opener.path === path && opener.href !== path ? opener.href : null;
}

/** The link a click followed, as an opener; null when it wasn't on a link. */
export function openerOf(target: EventTarget | null, path: string): Opener | null {
  const link = target instanceof Element ? target.closest("a[href]") : null;
  const href = link?.getAttribute("href");
  return href ? { path, href } : null;
}

/**
 * Moves focus on arriving at `path`: nowhere when a pop-up already holds it, else to the opener's
 * link (then forgotten), else to the page's h1, made focusable for it.
 */
export function focusPage(path: string, opener: { current: Opener | null }) {
  if (document.activeElement?.closest('[role="dialog"]')) return;
  const href = returnTo(path, opener.current);
  const link = href ? [...document.querySelectorAll<HTMLElement>("a[href]")].find((a) => a.getAttribute("href") === href) : undefined;
  if (link) {
    opener.current = null;
    link.focus();
    return;
  }
  const h1 = document.querySelector<HTMLElement>("main h1") ?? document.querySelector<HTMLElement>("h1");
  if (!h1) return;
  h1.tabIndex = -1;
  h1.focus();
}

/** What `inertOutside` needs of an element, so it is tested without a browser. */
export interface InertNode {
  parentElement: InertNode | null;
  readonly children: ArrayLike<InertNode>;
  /** An HTML element's; absent on an SVG one. */
  inert?: boolean;
  matches(selector: string): boolean;
}

/** Kept live while a pop-up is open: the page's live region. */
const KEEP = "[aria-live]";

/**
 * Makes everything outside `el` inert (WCAG 2.4.3): each sibling of `el` and of each of its
 * ancestors, save the live region. Gives back the undo, which frees only what it made inert.
 */
export function inertOutside(el: InertNode): () => void {
  const made: InertNode[] = [];
  for (let at = el; at.parentElement; at = at.parentElement) {
    for (const sibling of Array.from(at.parentElement.children)) {
      if (sibling === at || sibling.inert || sibling.matches(KEEP)) continue;
      sibling.inert = true;
      made.push(sibling);
    }
  }
  return () => {
    for (const node of made) node.inert = false;
  };
}
