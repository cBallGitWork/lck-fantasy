// Leagues' own marks (approved/leagues/render.js): the 20px mark before each league in the list, and
// the calendar over a table that hasn't started. Drawn for Flol, in `--text`; the name beside each says it.
import type { ReactNode } from "react";
import { Crest, Flag, TierShield } from "../../parts";
import type { LeagueMark as Mark } from "./types";
import "./Marks.css";

/** A private league's mark: a group of two. */
const GROUP = (
  <>
    <circle cx="7" cy="7" r="3" />
    <path d="M1.5 17a5.5 5.5 0 0 1 11 0" />
    <circle cx="14.5" cy="8" r="2.4" />
    <path d="M14 12.2a4.6 4.6 0 0 1 4.8 4.8" />
  </>
);

/** A line-drawn mark, 20 across. */
const Drawn = ({ big = false, children }: { big?: boolean; children: ReactNode }) => (
  <svg className={big ? "leagues__mark leagues__mark--big" : "leagues__mark"} viewBox="0 0 20 20" aria-hidden="true">
    {children}
  </svg>
);

/** The mark before a league in the list (plate.md, A league's mark): Overall's tier shield, a country's flag, a team's crest, a private league's group. */
export function LeagueMark({ mark }: { mark: Mark }) {
  switch (mark.kind) {
    case "tier":
      return (
        <span className="leagues__mark">
          <TierShield tier={mark.tier.tier} className="leagues__mark-shield" />
        </span>
      );
    case "flag":
      return (
        <span className="leagues__mark">
          <Flag country={mark.country} className="leagues__mark-flag" />
        </span>
      );
    case "crest":
      return (
        <span className="leagues__mark leagues__mark--crest">
          <Crest team={mark.team} size="mark" />
        </span>
      );
    case "group":
      return <Drawn>{GROUP}</Drawn>;
  }
}

/** The private section's line before any private league: the group mark. */
export const GroupMark = () => <Drawn>{GROUP}</Drawn>;

/** Over a table that hasn't started: a calendar. */
export const CalendarMark = () => (
  <Drawn big>
    <rect x="2.5" y="4" width="15" height="13" />
    <path d="M2.5 8h15M6.5 2v4M13.5 2v4" />
  </Drawn>
);
