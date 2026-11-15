import { cx } from "./cx";
import "./Placeholder.css";

/** A dashed box with one word, where a sponsor or a photo will go. Sizes in px; `fill` takes its box. */
export function Placeholder({ word, width, height, fill }: { word: string; width?: number; height?: number; fill?: boolean }) {
  return (
    <span className={cx("placeholder", fill && "placeholder--fill")} style={{ width, height }}>
      {word}
    </span>
  );
}
