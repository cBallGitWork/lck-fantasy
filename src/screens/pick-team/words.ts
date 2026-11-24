// Pick Team's words, named once. Every word a player reads on this screen lives here.

export const WORDS = {
  title: "Pick Team",
  hangul: "팀 선택",
  seriesTitle: "This week's series",
  sponsor: "Sponsor",
  view: "View",
  noChanges: "No changes",
  reset: "Reset",
  save: "Save team",
  /** The Save panel's name for a screen reader: it has no title. */
  saveLabel: "Your changes",
  buffs: "Buffs",
  form: "Form",
  owned: "Owned",
  season: "Season",
  last3: "Last 3 series",
  plays: "plays",
  fullCard: "Full card",
  versus: "v",
} as const;

/** `1 change`, `2 changes`. */
export const changes = (n: number) => `${n} ${n === 1 ? "change" : "changes"}`;

/** Said once over the card's ranks: `Among 10 mids`. */
export const among = (group: string) => `Among ${group}`;

export const dot = " · ";
