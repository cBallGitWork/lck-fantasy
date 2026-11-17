import { createMemoryHistory, RouterContextProvider, RouterProvider } from "@tanstack/react-router";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect } from "vitest";
import { makeRouter } from "../app/router";
import { TRUCK_HIRE } from "../parts";

// Renders a part or a screen to HTML for a test, inside the app's router so its links resolve.
const router = makeRouter(createMemoryHistory({ initialEntries: ["/"] }));

export const html = (node: ReactNode) => renderToStaticMarkup(<RouterContextProvider router={router}>{node}</RouterContextProvider>);

/** The app's HTML at a path, through the router as the browser opens it. */
export async function htmlAt(path: string): Promise<string> {
  const atPath = makeRouter(createMemoryHistory({ initialEntries: [path] }));
  await atPath.load();
  return renderToStaticMarkup(<RouterProvider router={atPath} />);
}

/** Markup's text alone, entities decoded. */
export const plain = (markup: string) =>
  markup
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

/** The rendered text alone, entities decoded. */
export const text = (node: ReactNode) => plain(html(node));

/** Fails unless every piece is in `out`, each after the end of the one before. */
export function expectInOrder(out: string, pieces: readonly string[]) {
  let from = 0;
  for (const piece of pieces) {
    const at = out.indexOf(piece, from);
    expect(at, `"${piece}" after position ${from}`).toBeGreaterThanOrEqual(0);
    from = at + piece.length;
  }
}

/** Fails unless `out` draws its deadline as the Deadline part, its local time in the part's bold, and no countdown. */
export function expectDeadlinePart(out: string, local: string) {
  expect(out).toContain(`<span class="deadline">Deadline <b class="num">${local}</b>`);
  expect(out).not.toContain("deadline__count");
}

/** A handler that does nothing, for props a test doesn't press. */
export const noop = () => {};

/** Every "truck" in a screen's text outside the truck-hire credit: none, since a screen says Cheer and Jeer (plate.md, One name per thing). */
export const trucksOutsideCredit = (out: string) => out.replaceAll(TRUCK_HIRE, "").match(/truck/gi) ?? [];

/** Presses the key a screen reader names `label` in what a hook-free part returns, as a click would: its `onClick` runs. Fails when there is no such key. */
export function press(node: ReactNode, label: string): void {
  const key = findLabelled(node, label);
  expect(key, `a key named "${label}"`).toBeDefined();
  key?.props.onClick?.();
}

type Pressable = ReactElement<{ "aria-label"?: string; onClick?: () => void; children?: ReactNode }>;

function findLabelled(node: ReactNode, label: string): Pressable | undefined {
  if (Array.isArray(node)) {
    for (const child of node as ReactNode[]) {
      const found = findLabelled(child, label);
      if (found) return found;
    }
    return undefined;
  }
  if (!isValidElement(node)) return undefined;
  const element = node as Pressable;
  if (element.props["aria-label"] === label) return element;
  return findLabelled(element.props.children, label);
}
