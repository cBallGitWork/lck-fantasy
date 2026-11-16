/** A name holds what was typed, ignoring case and outer spaces. */
export const nameMatches = (name: string, typed: string) => name.toLowerCase().includes(typed.trim().toLowerCase());
