import { WORDS } from "../words";
import "./MeDot.css";

/** Your player: an 8px round dot after his name, on every screen. */
export function MeDot() {
  return <span className="me-dot" role="img" aria-label={WORDS.yourPlayer} />;
}
