// @vitest-environment node
import { expect, test, vi } from "vitest";
import { chooseOnKey, selectable, wrapFocus } from ".";

// The parts' keyboard rules, as plain functions, so they are tested without a browser.

test("Tab wraps inside a modal: past the last to the first, back past the first to the last", () => {
  const inside = ["close", "name", "create"];
  expect(wrapFocus(inside, "create", false)).toBe("close");
  expect(wrapFocus(inside, "close", true)).toBe("create");
  expect(wrapFocus(inside, "name", false)).toBeUndefined();
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
