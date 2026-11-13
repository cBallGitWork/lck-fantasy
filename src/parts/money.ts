// One way to show money: in 억, to one decimal, as the approved Transfers picture does ("7.5억").

export const WON_PER_EOK = 100_000_000;

/** The one-line note for overseas players (spec/02, Money). */
export const EOK_NOTE = "1억 = 100 million won, game money only";

const MINUS = "−";

export function formatEok(won: number): string {
  const eok = (Math.abs(won) / WON_PER_EOK).toFixed(1);
  return `${won < 0 ? MINUS : ""}${eok}억`;
}
