import { measureVar, type MeasureKey } from "../theme/tokens";
import { cx } from "./cx";
import "./Placeholder.css";

/** A dashed box with one word, where a sponsor or a photo will go. Sizes are the theme's measures; `fill` takes its box. */
export function Placeholder({ word, width, height, fill }: { word: string; width?: MeasureKey; height?: MeasureKey; fill?: boolean }) {
  return (
    <span
      className={cx("placeholder", fill && "placeholder--fill")}
      style={{ width: width && measureVar(width), height: height && measureVar(height) }}
    >
      {word}
    </span>
  );
}
