import "./base.css";
import { themeCss } from "./tokens";

/** Applies every token at `:root`. Rendered once, at the root of the app. */
export function ThemeStyle() {
  return <style>{themeCss()}</style>;
}
