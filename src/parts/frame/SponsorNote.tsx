import "./SponsorNote.css";

/** Ends a page that shows a sponsor (spec/13). */
const SPONSOR_NOTE = "All sponsors are made up.";

export function SponsorNote() {
  return <p className="sponsor-note quiet">{SPONSOR_NOTE}</p>;
}
