// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { expect, test } from "vitest";

// All CSS is global, so each screen's classes carry its folder's name: `.points__side`, never
// `.side`. Two screens can then never restyle each other, nor a screen restyle a shared part.
const SCREENS = import.meta.dirname;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

/** The classes a stylesheet names that don't start with its screen's name. */
function strayClasses(screen: string, css: string): string[] {
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\{[^{}]*\}/g, "{}");
  const classes = [...selectors.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1] as string);
  return classes.filter((name) => name !== screen && !name.startsWith(`${screen}__`) && !name.startsWith(`${screen}--`));
}

test("every class in a screen's CSS starts with the screen's name", () => {
  const stray = readdirSync(SCREENS)
    .filter((name) => statSync(join(SCREENS, name)).isDirectory())
    .flatMap((screen) =>
      files(join(SCREENS, screen))
        .filter((path) => path.endsWith(".css"))
        .flatMap((path) => strayClasses(screen, readFileSync(path, "utf8")).map((name) => `${relative(SCREENS, path)}: .${name}`)),
    );
  expect(stray).toEqual([]);
});

test("the class check passes a screen's own classes and catches any other", () => {
  expect(strayClasses("points", ".points { } .points__side .points__row:hover { } .points--live { }")).toEqual([]);
  expect(strayClasses("points", ".row { } .points__side .table { } .stats__x { }")).toEqual(["row", "table", "stats__x"]);
});
