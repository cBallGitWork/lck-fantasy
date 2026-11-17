// @vitest-environment node
import { expect, test, vi } from "vitest";
import { chooseOnKey, inertOutside, returnTo, selectable, wrapFocus, type InertNode } from ".";

// The parts' keyboard rules, as plain functions, so they are tested without a browser.

test("Tab wraps inside a modal: past the last to the first, back past the first to the last", () => {
  const inside = ["close", "name", "create"];
  expect(wrapFocus(inside, "create", false)).toBe("close");
  expect(wrapFocus(inside, "close", true)).toBe("create");
  expect(wrapFocus(inside, "name", false)).toBeUndefined();
});

test("coming back to the page a link left gives focus back to that link; any other arrival goes to the h1", () => {
  const opener = { path: "/pick-team", href: "/player/faker" };
  expect(returnTo("/pick-team", opener)).toBe("/player/faker");
  expect(returnTo("/player/faker", opener)).toBeNull();
  expect(returnTo("/transfers", opener)).toBeNull();
  expect(returnTo("/pick-team", null)).toBeNull();
  expect(returnTo("/pick-team", { path: "/pick-team", href: "/pick-team" })).toBeNull();
});

/** A made-up element tree, for inertOutside. */
function node(name: string, children: InertNode[] = [], live = false): InertNode & { name: string } {
  const n = { name, parentElement: null as InertNode | null, children, inert: false, matches: (s: string) => live && s === "[aria-live]" };
  for (const c of children) c.parentElement = n;
  return n;
}

test("an open pop-up makes the page behind it inert, save the live region, and closing frees only what it froze", () => {
  const modal = node("modal");
  const content = node("content");
  const main = node("main", [content, modal]);
  const bar = node("bar");
  const region = node("region", [], true);
  const already = node("already");
  already.inert = true;
  node("root", [bar, main, region, already]);
  const free = inertOutside(modal);
  expect([content.inert, bar.inert, region.inert, main.inert, modal.inert]).toEqual([true, true, false, false, false]);
  free();
  expect([content.inert, bar.inert, already.inert]).toEqual([false, false, true]);
});

test("a tile or card is chosen by click, Enter or Space, and Space doesn't scroll", () => {
  const onSelect = vi.fn();
  const props = selectable(onSelect, true);
  expect(props).toMatchObject({ role: "button", tabIndex: 0, "aria-pressed": true });
  const preventDefault = vi.fn();
  for (const key of ["Enter", " ", "a"]) chooseOnKey(onSelect)({ key, preventDefault });
  expect(onSelect).toHaveBeenCalledTimes(2);
  expect(preventDefault).toHaveBeenCalledTimes(2);
  expect(selectable(undefined)).toEqual({});
});
