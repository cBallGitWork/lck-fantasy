import { useId } from "react";
import { BASE_REACH, COURT, COURT_RINGS, FADE, FIELD, LANES, PIT_R, PITS, PLAN, RIVER, STANDING, WALLS, WELL_R, type Point, type Side } from "./riftPlan";
import "./RiftMap.css";

const SIDES: readonly Side[] = ["blue", "red"];

const points = (ring: string): Point[] => ring.split(" ").map((p) => p.split(",").map(Number) as unknown as Point);
const tenth = (v: number) => Math.round(v * 10) / 10;

/** A closed shape through a ring of points, each corner rounded by up to `r`. */
function soft(ring: string, r: number): string {
  const pts = points(ring);
  const toward = (p: Point, q: Point) => {
    const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    const k = Math.min(r, d / 2) / d;
    return `${tenth(p[0] + (q[0] - p[0]) * k)} ${tenth(p[1] + (q[1] - p[1]) * k)}`;
  };
  return (
    pts
      .map((p, i) => {
        const before = pts[(i + pts.length - 1) % pts.length] as Point;
        const after = pts[(i + 1) % pts.length] as Point;
        return `${i ? "L" : "M"}${toward(p, before)} Q${p[0]} ${p[1]} ${toward(p, after)}`;
      })
      .join(" ") + " Z"
  );
}

/** The whole square with each wall a hole in it (even-odd), so the walls show the dark under them. */
const OPEN_PATH = `M0 0 H${PLAN} V${PLAN} H0 Z ${WALLS.map((w) => soft(w, 4)).join(" ")}`;
const RIVER_PATHS = RIVER.map((r) => soft(r, 5));
const inBase = ([x, y]: Point) => Object.values(COURT).some(({ centre }) => Math.hypot(x - centre[0], y - centre[1]) < BASE_REACH);

/** A tower as the minimap shows it in play: a small shield. */
const shield = ([x, y]: Point) => `M${x - 6} ${y - 7} H${x + 6} V${y + 1} Q${x + 6} ${y + 6} ${x} ${y + 8} Q${x - 6} ${y + 6} ${x - 6} ${y + 1} Z`;

/**
 * Summoner's Rift, drawn from the game's own minimap as the approved picture draws it
 * (docs/design/approved/pick-team/map.js, its calm painting): the jungle's walls, the lanes, the river
 * fading into mid lane with its two pits, a stone court in each base, the lanes' towers, the inhibitors
 * and each nexus. The same drawing in every league (Craig, 19 Nov 2026: "the rift is sacred"); its
 * colours are the game's (`src/theme/game.ts`).
 */
export function RiftMap() {
  const id = useId();
  const ref = (name: string) => `${id}-${name}`;
  return (
    <svg className="rift-map" viewBox={`0 0 ${PLAN} ${PLAN}`} aria-hidden="true">
      <defs>
        {FADE.map(([from, full, until, to], i) => (
          <linearGradient key={i} id={ref(`river-${i}`)} gradientUnits="userSpaceOnUse" x1={from} y1={from} x2={to} y2={to}>
            <stop className="rift-map__water rift-map__water--clear" offset="0" />
            <stop className="rift-map__water" offset={(full - from) / (to - from)} />
            <stop className="rift-map__water" offset={(until - from) / (to - from)} />
            <stop className="rift-map__water rift-map__water--clear" offset="1" />
          </linearGradient>
        ))}
        <clipPath id={ref("field")}>
          <path d={FIELD} />
        </clipPath>
        <filter id={ref("blur")} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <clipPath id={ref("open")}>
          <path d={OPEN_PATH} clipRule="evenodd" />
        </clipPath>
      </defs>
      <path className="rift-map__wall" d={FIELD} />
      {/* The ground you walk: the field, less its walls. */}
      <g clipPath={`url(#${ref("field")})`}>
        <g clipPath={`url(#${ref("open")})`}>
        <rect className="rift-map__grass" width={PLAN} height={PLAN} />
        <g className="rift-map__lane" filter={`url(#${ref("blur")})`}>
          <path d={LANES[0]} strokeWidth="44" />
          <path d={LANES[1]} strokeWidth="50" />
        </g>
        {RIVER_PATHS.map((d, i) => (
          <path key={i} d={d} fill={`url(#${ref(`river-${i}`)})`} />
        ))}
        {PITS.map(([x, y]) => (
          <circle key={`${x}-${y}`} className="rift-map__pit" cx={x} cy={y} r={PIT_R} />
        ))}
        </g>
      </g>
      {SIDES.map((side) => {
        const { centre, corner } = COURT[side];
        return (
          <g key={side} clipPath={`url(#${ref("field")})`}>
            {COURT_RINGS.map(([r, stone]) => (
              <circle key={r} className={`rift-map__stone--${stone}`} cx={centre[0]} cy={centre[1]} r={r} />
            ))}
            <circle className="rift-map__stone--line" cx={corner[0]} cy={corner[1]} r={WELL_R + 3} />
            <circle className="rift-map__stone--rim" cx={corner[0]} cy={corner[1]} r={WELL_R} />
          </g>
        );
      })}
      <g className="rift-map__marks">
        {SIDES.map((side) => {
          const { towers, inhibs, nexus } = STANDING[side];
          return (
            <g key={side} className={`rift-map__side--${side}`}>
              {towers
                .filter((t) => !inBase(t))
                .map((t) => (
                  <path key={`${t[0]}-${t[1]}`} className="rift-map__tower" d={shield(t)} strokeWidth="1.2" />
                ))}
              {inhibs.map(([x, y]) => (
                <circle key={`${x}-${y}`} className="rift-map__inhib" cx={x} cy={y} r="5.5" strokeWidth="3" />
              ))}
              <circle className="rift-map__nexus" cx={nexus[0]} cy={nexus[1]} r="15" strokeWidth="3" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
