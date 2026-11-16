// The made-up Split 1 Week 3 the approved pictures share (docs/design/approved/). Every name, score
// and price is an example, not roster data. Pages are built on it until the backend wires real data.
//
// The pictures catch the season at three moments, kept apart where they differ rather than merged:
// - Points (points.html): Week 3, Saturday 21:10 KST, T1 v DK game 2 live, GEN v HLE not final.
// - Perfect game (perfect.html) and the LCK hub: Week 3 final, seen on Week 4's Tuesday.
// - Pick Team (pick.html) and Stats (stats.html): Week 4, Tuesday 22:00 London, before the deadline.
// Times show in the manager's zone (London, UTC+0 in January), then KST.
//
// This file gathers the week's parts, each held in its own file.

export * from "./competition";
export * from "./weeks";
export * from "./squads";
export * from "./players";
