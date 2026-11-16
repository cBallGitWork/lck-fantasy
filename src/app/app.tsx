import { RouterProvider } from "@tanstack/react-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { router } from "./router";

/** Said once when the app starts without Convex. */
export const NO_CONVEX_WARNING = "VITE_CONVEX_URL is not set, so the app runs without Convex: run `npx convex dev` once to create .env.local.";

/** The app, inside Convex when its URL is set; no page reads Convex yet, so without one it warns and runs on its made-up data. */
export function appTree(convexUrl: string | undefined) {
  const app = <RouterProvider router={router} />;
  if (!convexUrl) console.warn(NO_CONVEX_WARNING);
  return <StrictMode>{convexUrl ? <ConvexProvider client={new ConvexReactClient(convexUrl)}>{app}</ConvexProvider> : app}</StrictMode>;
}
