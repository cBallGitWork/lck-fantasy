import { money, GoLink, signed, Table, Time, type Column } from "../../parts";
import { cardGo } from "../../paths";
import { ROLE_NAME } from "../../rift";
import type { Transfer, TransferWeek } from "./fixtures";
import { weekNo, WORDS } from "./words";

/** A swap and its week, whose head sits above the week's first swap. */
type SwapRow = { week: TransferWeek; swap: Transfer };

/** Transfers: each week's swaps by slot, out → in with team and price, the week's cost and points gained. */
export function ProfileTransfers({ weeks }: { weeks: TransferWeek[] }) {
  const rows = weeks.flatMap((week) => week.transfers.map((swap): SwapRow => ({ week, swap })));
  return (
    <section className="profile__transfers">
      <Table
        columns={SWAP_COLUMNS}
        rows={rows}
        rowKey={(r) => `${r.week.week}-${r.swap.slot}`}
        subAbove={({ week, swap }) =>
          swap === week.transfers[0]
            ? {
                head: (
                  <>
                    <b>{weekNo(week.week)}</b> · <Time local={week.at.local} />
                  </>
                ),
                aside: week.cost,
              }
            : undefined
        }
      />
    </section>
  );
}

const SWAP_COLUMNS: Column<SwapRow>[] = [
  { key: "slot", head: WORDS.slot, width: "colSwap", cell: ({ swap }) => <small>{ROLE_NAME[swap.slot]}</small> },
  {
    key: "out",
    head: WORDS.out,
    width: "colOut",
    cell: ({ swap }) => (
      <>
        <GoLink go={cardGo(swap.out.id, swap.slot === "coach")}>{swap.out.name}</GoLink>{" "}
        <small>
          {swap.out.team} · {money(swap.out.priceM)}
        </small>
      </>
    ),
  },
  { key: "arrow", head: "", width: "colArrow", cell: () => "→" },
  {
    key: "in",
    head: WORDS.in,
    width: "colIn",
    cell: ({ swap }) => (
      <>
        <GoLink className="profile__name" go={cardGo(swap.in.id, swap.slot === "coach")}>
          {swap.in.name}
        </GoLink>{" "}
        <small>
          {swap.in.team} · {money(swap.in.priceM)}
        </small>
      </>
    ),
  },
  { key: "space", head: "", cell: () => null },
  { key: "gained", head: WORDS.ptsGained, figure: true, width: "colSwap", cell: ({ swap }) => signed(swap.gained) },
];
