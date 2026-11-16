import { measure } from "../theme/tokens";
import "./RiftMap.css";

// Summoner's Rift, flat and square (Craig, 16 Nov 2026): the river corner to corner, the three lanes,
// both bases, the towers and the two pits. Drawn in the Rift's own square, the shape its box keeps,
// so towers stay square, pits round and lanes one width.
const W = measure.rift;
/** The side lanes' centre line, in from the map's edge. */
const LANE = 48;
/** How far a lane runs into a base, which is drawn over it. */
const INTO_BASE = 60;
const BASE = 132;
const RIVER = 56;
const TOWER = 12;
/** Each tower's centre: two on each side lane's arms and two on mid, the red side the blue side turned about the centre. */
const BLUE_TOWERS: [number, number][] = [
  [LANE, 470],
  [LANE, 290],
  [290, W - LANE],
  [470, W - LANE],
  [270, W - 270],
];
const TOWERS = [...BLUE_TOWERS, ...BLUE_TOWERS.map(([x, y]): [number, number] => [W - x, W - y])];
/** Baron's pit above mid, Dragon's below it, both by the river. */
const PITS: [number, number][] = [
  [250, 210],
  [W - 250, W - 210],
];

export function RiftMap() {
  return (
    <svg className="rift-map" viewBox={`0 0 ${W} ${W}`} aria-hidden="true">
      <rect className="rift-map__ground" x="0" y="0" width={W} height={W} />
      <path className="rift-map__river" d={`M0 ${RIVER} L${RIVER} 0 L${W} ${W - RIVER} L${W - RIVER} ${W} Z`} />
      <path className="rift-map__lane" d={`M${LANE} ${W - INTO_BASE} L${LANE} ${LANE} L${W - INTO_BASE} ${LANE}`} strokeWidth="32" />
      <path className="rift-map__lane" d={`M${INTO_BASE} ${W - LANE} L${W - LANE} ${W - LANE} L${W - LANE} ${INTO_BASE}`} strokeWidth="32" />
      <path className="rift-map__lane" d={`M${INTO_BASE} ${W - INTO_BASE} L${W - INTO_BASE} ${INTO_BASE}`} strokeWidth="30" />
      <path className="rift-map__base" d={`M0 ${W - BASE} A${BASE} ${BASE} 0 0 1 ${BASE} ${W} L0 ${W} Z`} />
      <path className="rift-map__base" d={`M${W - BASE} 0 A${BASE} ${BASE} 0 0 0 ${W} ${BASE} L${W} 0 Z`} />
      <g className="rift-map__tower">
        {TOWERS.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - TOWER / 2} y={y - TOWER / 2} width={TOWER} height={TOWER} />
        ))}
      </g>
      {PITS.map(([x, y]) => (
        <circle key={`${x}-${y}`} className="rift-map__pit" cx={x} cy={y} r="16" />
      ))}
    </svg>
  );
}
