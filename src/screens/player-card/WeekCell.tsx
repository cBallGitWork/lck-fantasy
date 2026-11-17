/** The ids of the rows that open a week: each week's number and once-a-week figures show only there. */
export function weekStarts(rows: { id: string; week: number }[]): Set<string> {
  return new Set(rows.filter((r, i) => i === 0 || rows[i - 1]?.week !== r.week).map((r) => r.id));
}

/** A week's number on its first row, ruled above; blank on the rest. */
export function WeekCell({ week, starts }: { week: number; starts: boolean }) {
  return starts ? <span className="player-card__week-start player-card__quiet quiet">{week}</span> : null;
}
