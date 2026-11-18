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
  buffs: "Buffs",
  cancel: "Cancel",
  on: "On",
  onUnsaved: "On · unsaved",
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

/** `2 left`: a buff's plays left this split. */
export const left = (n: number) => `${n} left`;

/** The Cancel key's name for a reader: `Cancel Bench Boost`. */
export const cancelBuff = (buff: string) => `${WORDS.cancel} ${buff}`;

export const dot = " · ";
