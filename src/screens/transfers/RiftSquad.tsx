import { formatWon, NONE } from "../../parts";
import { PLAN, Rift, ROLE_NAME, Tile, type PersonRole, type SquadSlot } from "../../rift";
import type { SlotHolder } from "./lineup";
import { weekAgainst, type Fixture } from "./plan";
import { groupAt } from "./spots";
import { buyA, keyFor, putBack, WORDS } from "./words";
import "./RiftSquad.css";

/**
 * Rift view (approved/transfers/, What binds 1 to 3): all nine on the Rift by role under the role's name,
 * said once, a role's players side by side. Each tile has `×` and the price in a dark strip over the shirt,
 * the name plate, and both of the week's opponents. A tile shows his card; a sold player's slot is dashed.
 */
export function RiftSquad({
  groups,
  fixtures,
  shown,
  isNew,
  onShow,
  onSell,
  onFill,
  onBack,
}: {
  groups: { role: PersonRole; holders: SlotHolder[] }[];
  fixtures: Record<string, Fixture[]>;
  /** Whose card shows. */
  shown: string | null;
  /** Bought and not yet confirmed: the green outline. */
  isNew: (holder: SlotHolder) => boolean;
  onShow: (holder: SlotHolder) => void;
  onSell: (slot: SquadSlot) => void;
  onFill: (slot: SquadSlot) => void;
  onBack: (slot: SquadSlot) => void;
}) {
  return (
    <div className="transfers__rift">
      <Rift>
        {groups.map(({ role, holders }) => {
          const [x, y] = groupAt(role, holders.length);
          return (
            <div key={role} className="transfers__group" style={{ left: `${(x / PLAN) * 100}%`, top: `${(y / PLAN) * 100}%` }}>
              <span className="transfers__group-role">{ROLE_NAME[role]}</span>
              <div className="transfers__group-tiles">
                {holders.map((holder) =>
                  holder.empty ? (
                    <EmptySlot key={holder.slot} holder={holder} onFill={() => onFill(holder.slot)} onBack={() => onBack(holder.slot)} />
                  ) : (
                    <Tile
                      key={holder.slot}
                      grouped
                      name={holder.player.name}
                      team={holder.player.team}
                      mark={holder.mark}
                      strip={<Strip holder={holder} onSell={() => onSell(holder.slot)} />}
                      line={weekAgainst(fixtures, holder.player.team) || NONE}
                      className={isNew(holder) ? "transfers__tile--new" : undefined}
                      selected={shown === holder.player.id}
                      onSelect={() => onShow(holder)}
                    />
                  ),
                )}
              </div>
            </div>
          );
        })}
      </Rift>
    </div>
  );
}

/** The strip over a tile's shirt: `×` to sell him at its left, his price. The tile itself shows his card. */
function Strip({ holder, onSell }: { holder: SlotHolder; onSell: () => void }) {
  return (
    <>
      <button
        type="button"
        className="transfers__x"
        aria-label={keyFor(WORDS.sell, holder.player.name)}
        onClick={(e) => {
          e.stopPropagation();
          onSell();
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        ×
      </button>
      <span className="num">{formatWon(holder.player.priceWon)}</span>
    </>
  );
}

/** A sold player's slot (spec/12): dashed, `+` to fill it from the list, and `↺ Siwoo` to put him back. */
function EmptySlot({ holder, onFill, onBack }: { holder: SlotHolder; onFill: () => void; onBack: () => void }) {
  return (
    <div className="transfers__empty">
      <button type="button" className="transfers__empty-plus" aria-label={buyA(ROLE_NAME[holder.player.role])} onClick={onFill}>
        +
      </button>
      <button type="button" className="transfers__empty-back" aria-label={keyFor(WORDS.restore, holder.player.name)} onClick={onBack}>
        {putBack(holder.player.name)}
      </button>
    </div>
  );
}
