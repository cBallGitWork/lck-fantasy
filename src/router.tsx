import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";

// Screens join as routes once each has its approved picture (docs/design/approved/).
const rootRoute = createRootRoute({ component: Outlet });
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: () => <h1>Flol</h1> });

export const router = createRouter({ routeTree: rootRoute.addChildren([homeRoute]) });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
