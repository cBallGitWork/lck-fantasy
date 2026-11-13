import { RouterProvider } from "@tanstack/react-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not set: run `npx convex dev` once to create .env.local.");
}
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("index.html has no #root element.");

createRoot(rootElement).render(
  <StrictMode>
    <ConvexProvider client={new ConvexReactClient(convexUrl)}>
      <RouterProvider router={router} />
    </ConvexProvider>
  </StrictMode>,
);
