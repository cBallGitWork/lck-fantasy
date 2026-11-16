import { Fragment } from "react";
import { money, GoLink, signed, Time } from "../../parts";
import { cardGo } from "../../paths";
import { ROLE_NAME } from "../../rift";
import type { Transfer, TransferWeek } from "./fixtures";

/** Transfers: each week's swaps by slot, out → in with team and price, the week's cost and points gained. */
export function ProfileTransfers({ weeks }: { weeks: TransferWeek[] }) {
  return (
    <section>
      <table className="table profile__table">
        <colgroup>
          <col className="profile__col-swap-slot" />
          <col className="profile__col-out" />
          <col className="profile__col-arrow" />
          <col className="profile__col-in" />
          <col />
          <col className="profile__col-gained" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Slot</th>
            <th scope="col">Out</th>
            <th scope="col" aria-label="For" />
            <th scope="col">In</th>
            <th scope="col" aria-hidden="true" />
            <th scope="col" className="profile__figure">
              Pts gained
            </th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <Fragment key={week.week}>
              <tr className="profile__sub">
                <td colSpan={4}>
                  <b>Week {week.week}</b> · <Time local={week.at.local} kst={week.at.kst} />
                </td>
                <td colSpan={2} className="profile__figure">
                  {week.cost}
                </td>
              </tr>
              {week.transfers.map((t) => (
                <SwapRow key={t.slot} swap={t} />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function SwapRow({ swap }: { swap: Transfer }) {
  return (
    <tr>
      <td>
        <small className="quiet">{ROLE_NAME[swap.slot]}</small>
      </td>
      <td>
        <GoLink go={cardGo(swap.out.id, swap.slot)}>{swap.out.name}</GoLink>{" "}
        <small className="quiet">
          {swap.out.team} · {money(swap.out.priceM)}
        </small>
      </td>
      <td>→</td>
      <td>
        <GoLink className="profile__name" go={cardGo(swap.in.id, swap.slot)}>
          {swap.in.name}
        </GoLink>{" "}
        <small className="quiet">
          {swap.in.team} · {money(swap.in.priceM)}
        </small>
      </td>
      <td />
      <td className="profile__figure num">{signed(swap.gained)}</td>
    </tr>
  );
}
