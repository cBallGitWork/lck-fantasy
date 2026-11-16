import type { KeyboardEvent } from "react";

/** Enter or Space chooses, as on a button; Space doesn't scroll the page. */
export function chooseOnKey(onSelect: () => void) {
  return (e: Pick<KeyboardEvent, "key" | "preventDefault">) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    onSelect();
  };
}

/**
 * The props that let a tile or card that isn't a `<button>` be chosen by click, Enter or Space,
 * and say whether it is chosen. Nothing when it can't be chosen.
 */
export function selectable(onSelect: (() => void) | undefined, selected = false) {
  if (!onSelect) return {};
  return { role: "button", tabIndex: 0, "aria-pressed": selected, onClick: onSelect, onKeyDown: chooseOnKey(onSelect) };
}
