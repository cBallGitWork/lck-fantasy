import { photoOf } from "../../fixtures/photos";
import { NONE } from "../../parts";
import { Lineup, Rift, RIFT_SLOTS, Tile } from "../../rift";
import type { PointsPlayer, PointsSeries, PointsStarter } from "./types";
import { dot, stillToPlay, versus, WORDS } from "./words";

/**
 * A Rift tile's band (approved/points/, What binds 2): the week's total alone; with a series still to
 * come, the total so far and that opponent (`7, v GEN`). A live series is under way, so it shows the total alone.
 */
export function TileTotal({ player }: { player: PointsPlayer }) {
  const next = player.series.find((s) => s.state === "next");
  return (
    <>
      {player.points ?? NONE}
      {next && <span className="points__next">{stillToPlay(next.opponent)}</span>}
    </>
  );
}

/** Each series' points after its opponent, as a lineup card shows them: `v HLE 12 · v DK 5`. */
export function SeriesLine({ series }: { series: PointsSeries[] }) {
  if (series.length === 0) return <>{WORDS.didntPlay}</>;
  return (
    <>
      {series.map((s, i) => (
        <span key={s.id}>
          {i > 0 && dot}
          {versus(s.opponent)} {s.points}
        </span>
      ))}
    </>
  );
}

interface TeamProps {
  starters: PointsStarter[];
  /** The player whose breakdown is open. */
  open?: string;
  onOpen: (name: string) => void;
}

/** Rift view: each starter in his lane, his week's total on his band. */
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
          points={<TileTotal player={p} />}
          line={p.series.length === 0 ? WORDS.didntPlay : undefined}
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
        photo: photoOf(p.name),
        mark: p.mark,
        next: <SeriesLine series={p.series} />,
        footer: <span className="points__card-points num">{p.points ?? NONE}</span>,
        selected: p.name === open,
        onSelect: () => onOpen(p.name),
      }))}
    />
  );
}
