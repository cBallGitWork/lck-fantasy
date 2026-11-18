import { useNavigate } from "@tanstack/react-router";
import { COUNTRIES } from "../../fixtures/managers";
import { useAnnounce, useDevState } from "../../parts";
import { PATHS } from "../../paths";
import { COMPETITION_ID, NAME_MAX, NEXT, PART_SQUAD, PLAYERS, RULES, TEAMS, WEEK } from "./fixtures";
import { FrontDoor } from "./FrontDoor";
import { forgetGuestSquad, keepGuestSquad, readGuestSquad } from "./guestSquad";
import { countryFrom, EMPTY_SQUAD } from "./pick";
import { joinedCheer } from "./words";

/** This browser's storage; none outside a browser. */
const browserStorage = () => (typeof localStorage === "undefined" ? undefined : localStorage);

/** Runs `run` on the browser's storage; where it is blocked (a private window), says so and goes on. */
function withStorage<T>(run: (storage: Storage) => T, otherwise: T): T {
  const storage = browserStorage();
  if (storage === undefined) return otherwise;
  try {
    return run(storage);
  } catch (error) {
    console.error("The guest squad can't be kept in this browser:", error);
    return otherwise;
  }
}

/** The squad this browser kept, or none; a kept squad that can't be read is said, then forgotten (spec/09). */
const keptSquad = () =>
  withStorage((storage) => {
    const kept = readGuestSquad(storage, COMPETITION_ID);
    if (kept.kept === "squad") return kept.squad;
    if (kept.kept === "unreadable") {
      console.error(`The kept guest squad couldn't be read (${kept.reason}); starting empty.`);
      forgetGuestSquad(storage);
    }
    return EMPTY_SQUAD;
  }, EMPTY_SQUAD);

/**
 * The front door (docs/design/approved/front-door/), on its made-up Week 4 until the backend feeds it.
 * The squad is kept in this browser as it changes. Save team, until Convex Auth is wired, drops the
 * kept squad, cheers the new team and lands on Pick Team (spec/09). `?state=part` opens the
 * part-picked picture, in dev.
 */
export function FrontDoorScreen() {
  const navigate = useNavigate();
  const announce = useAnnounce();
  const dev = useDevState({ part: PART_SQUAD });
  return (
    <FrontDoor
      {...WEEK}
      players={PLAYERS}
      rules={RULES}
      next={NEXT}
      teams={TEAMS}
      countries={COUNTRIES}
      country={countryFrom(typeof navigator === "undefined" ? undefined : navigator.language, COUNTRIES)}
      nameMax={NAME_MAX}
      initialSquad={dev ?? keptSquad()}
      onSquad={(squad) => withStorage((storage) => keepGuestSquad(storage, COMPETITION_ID, squad), undefined)}
      onSave={({ answers }) => {
        withStorage(forgetGuestSquad, undefined);
        announce(joinedCheer(answers.teamName));
        void navigate({ to: PATHS.pickTeam });
      }}
    />
  );
}
