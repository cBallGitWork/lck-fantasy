import { LinkGo, Placeholder, SideSection } from "../../parts";
import type { HubNews } from "./types";

/** News: the source's latest LCK headlines, each with its thumbnail and date, linking out; then `More on <source> ↗`. */
export function News({ news }: { news: HubNews }) {
  return (
    <SideSection title="News" note={news.source}>
      {news.headlines.map((h) => (
        <a key={h.headline} className="lck-hub__story" href={h.url} target="_blank" rel="noreferrer">
          <span className="lck-hub__thumb">
            <Placeholder word="thumbnail" fill />
          </span>
          <span>
            <b className="lck-hub__headline">{h.headline}</b>
            <small className="quiet">{h.date} ↗</small>
          </span>
        </a>
      ))}
      <div className="lck-hub__more">
        <LinkGo out={news.moreUrl}>More on {news.source}</LinkGo>
      </div>
    </SideSection>
  );
}
