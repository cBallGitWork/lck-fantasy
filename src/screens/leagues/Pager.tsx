import { count, cx } from "../../parts";
import { WORDS } from "./words";

/** Pages shown before `⋯` and the last page, as the picture's `1 2 3 ⋯ 1,063`. */
const LEADING_PAGES = 3;

/** The table's pages and Find me, which turns to the page holding your row. */
export function Pager({ pages, page, onPage, onFindMe }: { pages: number; page: number; onPage: (page: number) => void; onFindMe: () => void }) {
  const leading = Array.from({ length: Math.min(pages, LEADING_PAGES) }, (_, i) => i + 1);
  const key = (n: number) => (
    <button key={n} type="button" className={cx("leagues__page", n === page && "leagues__page--on")} aria-pressed={n === page} onClick={() => onPage(n)}>
      {count(n)}
    </button>
  );
  return (
    <nav className="leagues__pager" aria-label={WORDS.pages}>
      {leading.map(key)}
      {pages > LEADING_PAGES && (
        <>
          <span className="leagues__page leagues__page--gap">⋯</span>
          {key(pages)}
        </>
      )}
      <button type="button" className="leagues__page" onClick={onFindMe}>
        {WORDS.findMe}
      </button>
    </nav>
  );
}
