import { createMemoryHistory, RouterContextProvider } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { makeRouter } from "../app/router";

// Renders a part or a screen to HTML for a test, inside the app's router so its links resolve.
const router = makeRouter(createMemoryHistory({ initialEntries: ["/"] }));

export const html = (node: ReactNode) => renderToStaticMarkup(<RouterContextProvider router={router}>{node}</RouterContextProvider>);

/** The rendered text alone, entities decoded. */
export const text = (node: ReactNode) =>
  html(node)
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
