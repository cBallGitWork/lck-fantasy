import { photoOf } from "../../fixtures/photos";
import { MANAGER } from "../../fixtures/week3";
import { FinalTag, PageFrame, PageHead, Placeholder, SeriesList, SideSection, SponsorNote, sum, ViewToggle, type WeekNav } from "../../parts";
import { PATHS } from "../../paths";
import { flexPlays, Lineup, Rift, RIFT_SLOTS, Tile } from "../../rift";
import { GamesPanel } from "./GamesPanel";
import "./perfect-game.css";
import { RIFT_VIEW, VIEWS, type PerfectGameData, type PerfectView, type Selection } from "./types";
import { WORDS } from "./words";

/** Rift view: the seven on the Rift, each with his points and series, C on the Captain. */
export function PerfectGameRift({ game, selected, onSelect }: { game: PerfectGameData } & Selection) {
  return (
    <Rift>
      {game.players.map((p) => (
        <Tile
          key={p.slot}
          slot={p.slot}
          name={p.name}
          team={p.team}
          at={RIFT_SLOTS[p.slot]}
          mark={p.captain ? "C" : undefined}
          me={p.mine}
          points={p.points}
          line={p.line}
          selected={selected === p.slot}
          onSelect={onSelect && (() => onSelect(p.slot))}
        />
      ))}
    </Rift>
  );
}

/** Card view: the seven as the broadcast lineup, each card's series and points at its foot. */
export function PerfectGameCards({ game, selected, onSelect }: { game: PerfectGameData } & Selection) {
  return (
    <div className="perfect-game__cards">
      <Lineup
        cards={game.players.map((p) => ({
          slot: p.slot,
          plays: flexPlays(p.slot, p.role),
          name: p.name,
          team: p.team,
          photo: photoOf(p.name),
          mark: p.captain ? "C" : undefined,
          me: p.mine,
          next: p.line.split(" · ").map((series) => (
            <span key={series} className="perfect-game__card-series">
              {series}
            </span>
          )),
          footer: <b className="perfect-game__card-points">{p.points}</b>,
          selected: selected === p.slot,
          onSelect: onSelect && (() => onSelect(p.slot)),
        }))}
      />
    </div>
  );
}

/** Perfect game: the week's best team in the view saved on Points, the tapped starter's games on the right. */
export function PerfectGame({
  game,
  view,
  onView,
  weekNav,
  selected,
  onSelect,
}: {
  game: PerfectGameData;
  view: PerfectView;
  onView?: (view: PerfectView) => void;
  /** The week before and after, by the router. */
  weekNav?: Omit<WeekNav, "label">;
} & Selection) {
  const total = sum(game.players.map((p) => p.points));
  const tapped = game.players.find((p) => p.slot === selected);
  const viewProps = { game, selected, onSelect };
  return (
    <PageFrame
      screen="perfect-game"
      active="points"
      account={MANAGER.team}
      side={
        <>
          {tapped && <GamesPanel player={tapped} week={game.series} onClose={onSelect && (() => onSelect(undefined))} />}
          <SideSection title={game.seriesTitle}>
            <SeriesList series={game.series} />
          </SideSection>
          <Placeholder word={WORDS.sponsor} height="sponsorH" />
          <SponsorNote />
        </>
      }
    >
      <PageHead
        title={WORDS.title}
        hangul={WORDS.hangul}
        week={{ label: game.week, ...weekNav }}
        figure={total}
        tags={<FinalTag final={game.final} />}
        figures={[
          { label: WORDS.average, value: game.average },
          { label: WORDS.highest, value: game.highest },
          { label: WORDS.yours, value: game.yours, go: { to: PATHS.points } },
        ]}
      />
      <div className="perfect-game__toggle">
        <ViewToggle options={VIEWS} chosen={view} onChoose={onView} label={WORDS.view} />
      </div>
      {view === RIFT_VIEW ? <PerfectGameRift {...viewProps} /> : <PerfectGameCards {...viewProps} />}
    </PageFrame>
  );
}
