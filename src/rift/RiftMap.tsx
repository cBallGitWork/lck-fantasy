import "./RiftMap.css";

// Summoner's Rift, flat: the river, the three lanes, both bases, the towers and the two pits
// (points.html). Stretched to its box.
const TOWERS: [number, number][] = [
  [54, 400], [54, 220], [250, 54], [430, 54], [270, 614],
  [450, 614], [614, 440], [614, 260], [250, 424], [420, 254],
];

export function RiftMap() {
  return (
    <svg className="rift-map" viewBox="0 0 680 680" preserveAspectRatio="none" aria-hidden="true">
      <rect className="rift-map__ground" x="0" y="0" width="680" height="680" />
      <path className="rift-map__river" d="M0 40 L40 0 L680 640 L640 680 Z" />
      <path className="rift-map__lane" d="M60 640 L60 60 L640 60" strokeWidth="44" />
      <path className="rift-map__lane" d="M40 620 L620 620 L620 40" strokeWidth="44" />
      <path className="rift-map__lane" d="M60 620 L620 60" strokeWidth="40" />
      <path className="rift-map__base" d="M0 520 A160 160 0 0 1 160 680 L0 680 Z" />
      <path className="rift-map__base" d="M520 0 A160 160 0 0 0 680 160 L680 0 Z" />
      <g className="rift-map__tower">
        {TOWERS.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="12" height="12" />
        ))}
      </g>
      <circle className="rift-map__pit" cx="200" cy="200" r="16" />
      <circle className="rift-map__pit" cx="480" cy="480" r="16" />
    </svg>
  );
}
