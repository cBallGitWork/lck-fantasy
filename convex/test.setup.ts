/// <reference types="vite/client" />
// Every Convex module, for `convexTest(schema, modules)`: Convex functions run in memory, with no
// deployment (ARCHITECTURE.md, Libraries). Its name's two dots keep it out of the deployment.
export const modules = import.meta.glob(["./**/*.ts", "./_generated/*.js", "!./**/*.test.ts", "!./**/*.d.ts"]);
