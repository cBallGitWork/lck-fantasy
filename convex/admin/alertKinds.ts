// What an admin alert is about (Craig, 19 Nov 2026, #401): its kind, held apart from alerts.ts so the
// schema can read it.

/** A live game's feed went down; a live player has no lane opponent; a test manager's points, as
 *  the app scored them, differ from the backtest scorer's (spec/10, The road to launch, step 1). */
export const ALERT_KINDS = ["feedDown", "noLaneOpponent", "pointsMismatch"] as const;
export type AlertKind = (typeof ALERT_KINDS)[number];

/** An alert to raise: its kind, its line, and what it names (a game, a manager, a pick). */
export interface NewAlert {
  kind: AlertKind;
  message: string;
  names: string[];
}
