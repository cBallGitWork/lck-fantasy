import { Hint, HINTS } from "../parts";
import type { SlotKey } from "./roles";

/** A slot's label as a tile or a lineup card shows it; the Flex's carries its hover, Any role (spec/12, Words). */
export function SlotName({ slot, label }: { slot: SlotKey; label: string }) {
  return slot === "flex" ? <Hint line={HINTS.flex}>{label}</Hint> : label;
}
