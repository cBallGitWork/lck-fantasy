import { createMemoryHistory, RouterContextProvider, RouterProvider } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect } from "vitest";
import { makeRouter } from "../app/router";

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

/** A handler that does nothing, for props a test doesn't press. */
export const noop = () => {};
