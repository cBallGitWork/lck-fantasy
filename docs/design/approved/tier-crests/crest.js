// Overall's tier crest (plate.md, Marks): Flol's own winged crest, drawn after League's ranked crests (Craig, 28 Nov 2026).
// tierCrest(tier, width) gives the SVG; a tier's colour is TIER_INK[tier], the plate's --tier-* tokens.
(function (root) {
const INK = { Unranked: "#5A6690", Iron: "#948D86", Bronze: "#B0733F", Silver: "#A9B6C6", Gold: "#E3B552", Platinum: "#3FB0A6", Emerald: "#2FBF74", Diamond: "#6F94FF", Master: "#B46AE6", Grandmaster: "#F0606B", Challenger: "#5CCFF2" };
// Each tier's wings: blades a side, spread, rise, lower fangs, spikes over the gem. After League's ranked crests.
const SHAPE = { Iron: [1, 11, 7, 0, 0], Bronze: [1, 13, 9, 0, 0], Silver: [2, 15, 11, 0, 0], Gold: [2, 17, 13, 1, 0], Platinum: [2, 18, 15, 1, 0], Emerald: [3, 19, 16, 1, 0], Diamond: [3, 20, 17, 1, 1], Master: [3, 21, 19, 2, 1], Grandmaster: [4, 22, 19, 2, 3], Challenger: [4, 23, 20, 2, 3] };
const TIERS = Object.keys(INK);
const SH = '<defs><linearGradient id="tier-sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient></defs>';
function crest(tier, size) {
  const c = INK[tier], h = Math.round(size * 40 / 48), fine = size >= 40;
  if (tier === "Unranked") return `<svg viewBox="0 0 48 40" width="${size}" height="${h}" aria-hidden="true"><circle cx="24" cy="21" r="12" fill="none" stroke="${c}" stroke-width="2.6"/><path d="M24 12 29 20 24 31 19 20z" fill="${c}"/></svg>`;
  const [n, s, r, fangs, spikes] = SHAPE[tier], gold = tier === "Challenger" ? "#E8BC55" : c;
  const rim = fine ? ' stroke="#fff" stroke-opacity=".4" stroke-width=".5"' : "";
  let wing = "";
  for (let k = 0; k < n; k++) {
    const tx = 24 + s - k * 4.4, ty = 22 - r + k * 4.2;
    const d = `M25 ${28 - k * 0.8} C ${tx - 3} ${32 - k * 1.5} ${tx + 4} ${ty + 13} ${tx} ${ty} C ${tx - 2.2} ${ty + 9} ${tx - 9 + k} ${20 + k} 25 ${19 + k * 1.4} Z`;
    wing += `<path d="${d}" fill="${c}"${rim}/><path d="${d}" fill="url(#tier-sh)"/>${k ? `<path d="${d}" fill="#000" opacity="${k * 0.13}"/>` : ""}`;
  }
  for (let f = 0; f < fangs; f++) { const d = `M25 ${27 + f} L ${33 + f * 4} ${31 - f * 1.5} L ${29.5 + f * 2.5} ${36.5 - f * 2} L 25.5 ${32} Z`; wing = `<path d="${d}" fill="${c}"/><path d="${d}" fill="#000" opacity=".3"/>` + wing; }
  const spike = (x, top, w) => `<path d="M${x} ${top} L${x + w} 12 L${x} 10.4 L${x - w} 12 Z" fill="${gold}"/><path d="M${x} ${top} L${x + w} 12 L${x} 10.4 Z" fill="#000" opacity=".25"/>`;
  const crown = spikes === 0 ? "" : spikes === 1 ? spike(24, 2, 2.6) : spike(24, 1, 2.6) + spike(19.4, 5, 2) + spike(28.6, 5, 2);
  return `<svg viewBox="0 0 48 40" width="${size}" height="${h}" aria-hidden="true">${SH}<g>${wing}</g><g transform="translate(48 0) scale(-1 1)">${wing}</g>${crown}
    <path d="M16.500 18 24 25 31.500 18 33 21.500 24 31 15 21.500z" fill="${gold}"/><path d="M16.500 18 24 25 31.500 18 33 21.500 24 31 15 21.500z" fill="#000" opacity=".42"/>
    <path d="M24 10 29.500 18 24 37 18.500 18z" fill="${gold}"${rim}/><path d="M24 10 29.500 18 24 37z" fill="#000" opacity=".3"/><path d="M24 10 18.500 18 24 22 29.500 18z" fill="#fff" opacity=".38"/></svg>`.replaceAll(".500", ".5");
}
root.TIER_INK = INK;
root.tierCrest = crest;
})(typeof window === "undefined" ? globalThis : window);
