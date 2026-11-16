// @vitest-environment node
import { afterEach, expect, test, vi } from "vitest";
import { appTree, NO_CONVEX_WARNING } from "./app";

afterEach(() => vi.restoreAllMocks());

test("without VITE_CONVEX_URL the app still builds its tree, and says so once", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  expect(appTree(undefined)).toBeTruthy();
  expect(warn).toHaveBeenCalledTimes(1);
  expect(warn).toHaveBeenCalledWith(NO_CONVEX_WARNING);
});

test("with a Convex URL it says nothing", () => {
  const warn = vi.spyOn(console, "warn");
  appTree("https://example.convex.cloud");
  expect(warn).not.toHaveBeenCalled();
});
