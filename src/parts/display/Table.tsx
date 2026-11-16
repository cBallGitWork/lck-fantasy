import type { ReactNode } from "react";
import type { Go } from "../../paths";
import { measureVar, type MeasureKey } from "../../theme/tokens";
import { cx } from "../util/cx";
import { GoLink } from "../controls/GoLink";
import "./Table.css";

export interface Column<R> {
  key: string;
  /** The head, 12px mid grey; empty for a column of marks. */
  head: ReactNode;
  cell: (row: R) => ReactNode;
  /** Figures are right-aligned, in mono. */
  figure?: boolean;
  /** A width from the theme's measures; the other columns share what is left. */
  width?: MeasureKey;
  /** A long name ends in `…` at the column's width; this is its full text, shown on hover. */
  fullText?: (row: R) => string;
  /** The column the table is sorted by: its head in `--text`, with ▼. */
  sorted?: boolean;
  /** Starts a group of columns, with a 1px rule on its left (Stats). */
  group?: boolean;
}

/** A row that opens something ends with `›`: a link (`go`) or a key (`onOpen`), named for screen readers. */
type RowOpen<R> = { name: (row: R) => string } & ({ go: (row: R) => Go } | { onOpen: (row: R) => void });

/**
 * A table: name far left, figures right-aligned, 40px rows, 12px heads in mid grey. For the wide
 * table (Stats), `stickyHead` and `stickyFirst` keep the head and the name column in place while the
 * table scrolls under them.
 */
export function Table<R>({
  columns,
  rows,
  rowKey,
  selected,
  open,
  stickyHead,
  stickyFirst,
  label,
}: {
  columns: Column<R>[];
  rows: R[];
  rowKey: (row: R) => string;
  /** The row drawn bold on `--fill`, such as yours in a league. */
  selected?: (row: R) => boolean;
  open?: RowOpen<R>;
  stickyHead?: boolean;
  stickyFirst?: boolean;
  label?: string;
}) {
  const table = (
    <table className={cx("table", stickyHead && "table--sticky-head", stickyFirst && "table--sticky-first")} aria-label={label}>
      <colgroup>
        {columns.map((c) => (
          <col key={c.key} style={c.width === undefined ? undefined : { width: measureVar(c.width) }} />
        ))}
        {open && <col className="table__go-col" />}
      </colgroup>
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              scope="col"
              className={cx(c.figure && "table__figure", c.group && "table__group", c.sorted && "table__sorted")}
              aria-sort={c.sorted ? "descending" : undefined}
            >
              {c.head}
            </th>
          ))}
          {open && <th scope="col" aria-label="Open" />}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={rowKey(row)} className={cx(selected?.(row) && "table__row--selected")}>
            {columns.map((c) => {
              const full = c.fullText?.(row);
              return (
                <td
                  key={c.key}
                  className={cx(c.figure && "table__figure num", c.group && "table__group", full !== undefined && "table__truncate")}
                  title={full}
                >
                  {c.cell(row)}
                </td>
              );
            })}
            {open && (
              <td className="table__go">
                <OpenRow open={open} row={row} />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return stickyHead || stickyFirst ? <div className="table__scroll">{table}</div> : table;
}

function OpenRow<R>({ open, row }: { open: RowOpen<R>; row: R }) {
  const label = `Open ${open.name(row)}`;
  return "go" in open ? (
    <GoLink go={open.go(row)} label={label}>
      ›
    </GoLink>
  ) : (
    <button type="button" aria-label={label} onClick={() => open.onOpen(row)}>
      ›
    </button>
  );
}
