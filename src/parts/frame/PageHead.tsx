import type { ReactNode } from "react";
import type { Go } from "../../paths";
import { GoLink } from "../controls/GoLink";
import { LinkGo } from "../controls/LinkGo";
import "./PageHead.css";
import { WeekArrow } from "../controls/WeekArrow";

export interface HeadFigure {
  label: string;
  value: ReactNode;
  /** Where the figure leads (`Highest 131 ›`). */
  go?: Go;
}

export interface WeekNav {
  label: string;
  /** The week before and after; absent where there is none. */
  prev?: Go;
  next?: Go;
}

/**
 * The page head: title and hangul (`Leagues 리그`); ‹ week ›; the key figure, its tags, and up to
 * three figures beside it in mid grey with the figure in `--text` (`Average 79  Highest 136 ›`).
 */
export function PageHead({
  title,
  hangul,
  link,
  week,
  sub,
  figure,
  tags,
  figures = [],
  children,
}: {
  title: string;
  hangul?: string;
  /** A link on the title's line (`Patch update ›`). */
  link?: { label: string; go: Go };
  week?: WeekNav;
  /** A plain line under the title, where there are no week arrows (`LCK Cup Week 4`). */
  sub?: ReactNode;
  /** The page's one key figure, 44px. */
  figure?: ReactNode;
  tags?: ReactNode;
  figures?: HeadFigure[];
  /** Anything that sits under the head, such as the live bar. */
  children?: ReactNode;
}) {
  if (figures.length > 3) throw new Error(`PageHead takes up to three figures, not ${figures.length}`);
  return (
    <header className="page-head">
      <div className="page-head__title-line">
        <h1 className="page-head__title">
          {title}
          {hangul && (
            <span className="page-head__hangul" lang="ko">
              {hangul}
            </span>
          )}
        </h1>
        {link && <LinkGo go={link.go}>{link.label}</LinkGo>}
      </div>
      {week && (
        <div className="page-head__week">
          <WeekArrow go={week.prev} label="Week before">
            ‹
          </WeekArrow>
          {week.label}
          <WeekArrow go={week.next} label="Week after">
            ›
          </WeekArrow>
        </div>
      )}
      {sub !== undefined && <div className="page-head__sub">{sub}</div>}
      {(figure !== undefined || tags !== undefined || figures.length > 0) && (
        <div className="page-head__key-line">
          {figure !== undefined && <b className="page-head__figure num">{figure}</b>}
          {tags}
          {figures.length > 0 && (
            <span className="page-head__figures">
              {figures.map((f) => {
                const body = (
                  <>
                    {f.label} <b className="num">{f.value}</b>
                  </>
                );
                return f.go ? (
                  <GoLink key={f.label} className="page-head__fig page-head__fig--link" go={f.go}>
                    {body}
                    <i>›</i>
                  </GoLink>
                ) : (
                  <span key={f.label} className="page-head__fig">
                    {body}
                  </span>
                );
              })}
            </span>
          )}
        </div>
      )}
      {children}
    </header>
  );
}
