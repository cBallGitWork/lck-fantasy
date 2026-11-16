import { NONE } from "../../parts";
import { Lineup, Rift, RIFT_SLOTS, Tile } from "../../rift";
import { DIDNT_PLAY, type PointsSeries, type PointsStarter } from "./types";

/** Each series' points after its opponent, as a starter's line shows them: `v HLE 12 · v DK 5`. Live is the head's bar. */
export function SeriesLine({ series }: { series: PointsSeries[] }) {
  if (series.length === 0) return <>{DIDNT_PLAY}</>;
  return (
    <>
      {series.map((s, i) => (
        <span key={s.id}>
          {i > 0 && " · "}v {s.opponent} {s.points}
        </span>
      ))}
    </>
  );
}

interface TeamProps {
  starters: PointsStarter[];
  /** The player whose games are open. */
  open?: string;
  onOpen: (name: string) => void;
}

/** Rift view: each starter in his lane, with his points and his series under the shirt. */
export function PointsRift({ starters, open, onOpen }: TeamProps) {
  return (
    <Rift>
      {starters.map((p) => (
        <Tile
          key={p.slot}
          slot={p.slot}
          name={p.name}
          team={p.team}
          at={RIFT_SLOTS[p.slot]}
          mark={p.mark}
          birthday={p.birthday}
          points={p.points ?? NONE}
          line={<SeriesLine series={p.series} />}
          selected={p.name === open}
          onSelect={() => onOpen(p.name)}
        />
      ))}
    </Rift>
  );
}

/** Card view: the seven as the broadcast's lineup, each with his series and his points. */
export function PointsCards({ starters, open, onOpen }: TeamProps) {
  return (
    <Lineup
      cards={starters.map((p) => ({
        slot: p.slot,
        plays: p.plays,
        name: p.name,
        team: p.team,
        mark: p.mark,
        next: <SeriesLine series={p.series} />,
        footer: (
<span className="points__card-points num">{p.points ?? NONE}</span>
        ),
        selected: p.name === open,
        onSelect: () => onOpen(p.name),
      }))}
    />
  );
}
