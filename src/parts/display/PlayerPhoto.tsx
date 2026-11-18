import type { MeasureKey } from "../../theme/tokens";
import { Crest } from "./Crest";
import { PHOTO_CREDIT } from "../words";
import "./PlayerPhoto.css";

/**
 * A player's media-day portrait, filling its box and credited `Photo: LCK`; his team's crest at
 * `crest` until his split's photo is saved (spec/13). Flol serves the file, never hotlinks it.
 */
export function PlayerPhoto({ photo, name, team, crest }: { photo?: string; name: string; team: string; crest?: MeasureKey }) {
  if (!photo) {
    return (
      <span className="player-photo player-photo--crest">
        <Crest team={team} size={crest} />
      </span>
    );
  }
  return (
    <figure className="player-photo">
      <img className="player-photo__img" src={photo} alt={name} />
      <figcaption className="player-photo__credit">{PHOTO_CREDIT}</figcaption>
    </figure>
  );
}
