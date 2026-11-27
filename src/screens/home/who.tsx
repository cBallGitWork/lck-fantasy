import { FactMark, MeDot, TeamBar } from "../../parts";
import { MarkBadge } from "../../rift";
import type { FactKind, Named } from "./types";
import { FACT_WORD } from "./words";

/** A player named in a row: his team's bar and code, then his name, `T1 Faker` (plate.md, Parts); the dot when he is yours. */
export function Who({ who }: { who: Named }) {
  return (
    <span className="home__who">
      <TeamBar team={who.team} />
      <span className="home__who-team">{who.team}</span> <b>{who.name}</b>
      {who.mine && <MeDot />}
    </span>
  );
}

/** A fact's word with its 20px mark before it (plate.md, Parts, A fact's mark): Most captained's is the Captain's C. */
export function FactLabel({ kind }: { kind: FactKind }) {
  return (
    <span className="home__fact quiet">
      {kind === "captained" ? <MarkBadge mark="C" fact /> : <FactMark kind={kind} />}
      {FACT_WORD[kind]}
    </span>
  );
}
