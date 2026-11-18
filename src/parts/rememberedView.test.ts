// @vitest-environment node
import { expect, test } from "vitest";
import { rememberedView, rememberView, VIEW_KEYS } from ".";
import { blockedStorage, keptStorage } from "../testing/storage";

// A remembered view, kept in the browser (spec/12, Pick Team and Transfers).
const BOARD = ["Rift view", "Card view"] as const;

test("the first view opens on the first visit, with no storage, and for a value no view has", () => {
  expect(rememberedView(VIEW_KEYS.board, BOARD, undefined)).toBe("Rift view");
  expect(rememberedView(VIEW_KEYS.board, BOARD, keptStorage())).toBe("Rift view");
  expect(rememberedView(VIEW_KEYS.board, BOARD, keptStorage({ [VIEW_KEYS.board]: "Pitch" }))).toBe("Rift view");
});

test("a view kept is the one that opens next time, under its own key only", () => {
  const storage = keptStorage();
  rememberView(VIEW_KEYS.board, "Card view", storage);
  expect(rememberedView(VIEW_KEYS.board, BOARD, storage)).toBe("Card view");
  expect(rememberedView(VIEW_KEYS.transfers, ["Rift view", "List view"] as const, storage)).toBe("Rift view");
});

test("where storage is blocked, the first view opens and keeping one throws nothing", () => {
  expect(rememberedView(VIEW_KEYS.board, BOARD, blockedStorage)).toBe("Rift view");
  expect(() => rememberView(VIEW_KEYS.board, "Card view", blockedStorage)).not.toThrow();
});
