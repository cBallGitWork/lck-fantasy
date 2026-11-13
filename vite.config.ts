import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    // convex-test runs Convex functions in the edge runtime they run in on the server.
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
    exclude: [...configDefaults.exclude, ".claude/**"],
    passWithNoTests: true,
  },
});
