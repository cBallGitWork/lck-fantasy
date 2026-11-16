import { measure } from "../theme/tokens";
import "./RiftMap.css";

// Summoner's Rift, flat: the river, the three lanes, both bases, the towers and the two pits
// (points.html). Drawn in the Rift's own 984 × 560, the shape its box keeps, so towers stay
// square, pits round and lanes one width.
const W = measure.riftW;
const H = measure.riftH;
/** Each tower's top left corner: two on each side lane's arms, two on mid. */
const TOWERS: [number, number][] = [
  [54, 330],
  [54, 190],
  [330, 54],
  [600, 54],
  [380, 494],
  [650, 494],
  [918, 360],
  [918, 210],
  [354, 341],
  [614, 209],
];

export function RiftMap() {
  return (
    <svg className="rift-map" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <rect className="rift-map__ground" x="0" y="0" width={W} height={H} />
      <path className="rift-map__river" d={`M0 40 L40 0 L${W} ${H - 40} L${W - 40} ${H} Z`} />
      <path className="rift-map__lane" d={`M60 ${H - 40} L60 60 L${W - 40} 60`} strokeWidth="40" />
      <path className="rift-map__lane" d={`M40 ${H - 60} L${W - 60} ${H - 60} L${W - 60} 40`} strokeWidth="40" />
      <path className="rift-map__lane" d={`M60 ${H - 60} L${W - 60} 60`} strokeWidth="36" />
      <path className="rift-map__base" d={`M0 ${H - 150} A150 150 0 0 1 150 ${H} L0 ${H} Z`} />
      <path className="rift-map__base" d={`M${W - 150} 0 A150 150 0 0 0 ${W} 150 L${W} 0 Z`} />
      <g className="rift-map__tower">
        {TOWERS.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="12" height="12" />
        ))}
      </g>
      <circle className="rift-map__pit" cx="300" cy="175" r="16" />
      <circle className="rift-map__pit" cx="684" cy="386" r="16" />
    </svg>
  );
}
