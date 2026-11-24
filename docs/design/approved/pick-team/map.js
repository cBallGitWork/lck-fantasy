// Summoner's Rift, drawn from the game's own minimap (docs/design/references/rift/, the game's file
// first): the plan is that picture's, measured off it: lanes, jungle paths, river, pits, the two bases.
// It is one drawing, the same in every theme and every league (Craig, 19 Nov 2026: "the rift is
// sacred"); a look may change the frame round it, never this. None of Riot's image files: every shape is
// drawn here, in a 720 square. The blue side's base is bottom-left, the red side's top-right.
// Three ways of painting the one plan, until Craig picks: "flat", the minimap's own colours; "painted",
// the map's own art as it looks in play (earth lanes, grass, mossy stone, teal water); and "pitch", the
// plan as a fantasy game draws its pitch: grass, the three lanes, the river and the two bases, the jungle
// only a shade darker, nothing standing on it, so the tiles are the loudest thing.
// A fourth, "calm", is what the reviewers asked for (19 Nov 2026): the painted map's plan and colours with
// the pitch's quiet: plain dark walls with no outline, quieter lanes, small grey bases the lanes run into, and little standing on it: the lane towers, and in each
// base its inhibitors and nexus (the second review, 19 Nov 2026: the jungle only a shade darker than the grass).
// Sets RIFT_MAP on the window, or on globalThis under node: RIFT_MAP(), or RIFT_MAP("painted" | "pitch" | "calm").
(function (root) {
  const W = 720;

  // The walls: the dark left between the lanes and the jungle's paths. Each is a ring of points.
  const WALLS = [
    "72,74 79,77 82,82 68,96 65,96 59,88 68,86 71,82",
    "269,82 321,82 323,84 323,91 320,97 307,97 291,103 269,103 266,99 266,89",
    "342,82 407,82 413,92 413,108 405,115 385,121 375,121 362,105 340,97",
    "221,81 240,82 240,93 236,98 215,104 204,113 197,127 200,150 196,153 191,153 181,144 157,96 166,89 179,83",
    "433,82 447,82 450,120 458,152 457,156 437,167 432,166 426,148 413,134 414,131 428,120 433,111",
    "330,115 342,117 349,123 349,152 316,152 297,158 285,165 281,165 261,148 245,141 227,138 217,129 219,127 243,132 266,134 297,122 303,134 309,137 318,138 328,131",
    "386,148 397,149 404,153 412,161 416,169 415,195 404,218 398,214 397,197 390,177 380,166 370,160 375,152",
    "94,167 120,179 139,193 152,214 165,242 155,240 139,213 117,213 106,225 105,239 95,246 84,249 84,196",
    "219,153 235,156 251,164 267,178 273,186 278,200 280,216 284,229 291,241 300,250 288,263 266,260 232,245 234,238 245,238 252,235 263,222 264,207 259,195 253,191 245,187 233,187 222,193 214,205 213,216 217,227 212,230 200,219 186,200 180,189 183,180 203,176 210,172",
    "326,167 335,169 326,180 324,186 326,198 333,205 343,210 356,207 364,199 368,186 375,199 376,215 364,224 349,229 320,231 310,229 307,224 305,207 302,196 302,186 314,172",
    "448,180 468,180 486,207 457,235 446,233 438,238 430,238 425,234 424,228 439,205 441,184",
    "393,230 403,233 406,248 412,255 432,258 384,303 356,278 342,271 341,254 357,252 359,262 364,270 375,275 389,273 397,266 400,256 398,243 392,237",
    "522,240 546,255 574,264 570,278 569,288 572,295 584,302 586,308 586,325 582,343 574,341 575,321 568,301 551,282 540,277 527,275 512,276 496,281 484,280",
    "173,255 176,255 198,276 234,292 234,295 229,300 217,300 198,297 186,290 173,279 169,271 169,259",
    "127,237 131,237 138,246 143,276 148,286 164,305 164,309 154,315 134,316 127,312 121,304 121,291 127,269 125,241",
    "311,279 323,281 338,289 359,305 370,316 356,330 353,330 338,314 305,287 305,281",
    "105,255 108,258 110,276 105,289 94,300 91,305 91,315 98,325 105,328 125,326 130,330 135,346 126,356 123,356 106,340 83,333 83,269 94,264",
    "603,270 634,271 634,368 618,361 604,347 608,336 609,318 605,302 595,285 596,276",
    "475,293 482,295 482,302 474,325 475,342 479,352 477,358 473,358 468,354 463,331 465,306 470,297",
    "523,293 530,293 530,296 525,300 520,308 520,320 524,326 534,333 546,333 554,330 551,338 537,347 524,348 514,345 506,338 501,325 502,311 506,303 515,295",
    "183,308 205,311 212,316 218,335 219,352 210,357 191,363 169,363 152,359 153,353 165,342 181,351 191,349 196,344 199,335 198,329 192,321 182,317",
    "258,315 264,315 304,348 304,376 288,390 284,390 278,384 262,366 259,349",
    "430,335 435,335 457,358 462,405 462,409 459,411 456,410 418,373 418,346",
    "537,358 565,360 569,364 563,373 557,375 552,375 542,371 535,371 527,374 522,382 522,396 526,402 536,406 537,411 512,411 505,403 505,371 509,366 516,363",
    "596,365 615,378 634,388 634,425 622,426 630,415 629,402 623,396 609,393 598,397 591,391 587,374",
    "191,372 201,373 210,377 219,387 221,394 221,409 218,415 211,423 201,428 193,427 203,411 203,401 199,394 187,387 179,387 171,391 168,390 176,378",
    "238,360 242,360 252,373 259,395 257,416 252,428 248,430 243,429 238,424 243,400 242,383 236,369",
    "84,353 102,359 118,374 115,388 115,411 118,420 127,435 125,444 120,449 108,449 83,446",
    "361,395 383,419 413,438 414,441 393,437 371,425 353,406 353,403",
    "572,404 588,406 599,418 600,450 594,480 589,475 588,461 581,442 560,416 561,410 565,406",
    "138,377 145,378 146,396 152,409 160,419 173,431 191,439 203,439 223,436 231,441 231,449 198,480 174,465 145,455 148,448 148,435 134,411 134,393",
    "338,419 361,439 380,450 380,466 365,466 363,456 352,446 335,446 326,453 321,463 322,473 332,487 320,487 312,472 295,463 294,460",
    "494,423 501,423 527,432 555,449 571,470 572,487 570,493 566,496 559,495 555,489 554,480 548,470 521,449 492,433 491,426",
    "625,442 634,442 634,510 621,506 612,497 610,491 610,484 617,466 618,444",
    "288,481 293,482 297,489 280,511 274,535 259,544 238,512 264,488 278,487",
    "385,489 413,491 419,496 416,510 419,529 402,548 390,552 387,551 392,548 398,538 398,527 392,516 382,511 369,512 359,521 354,534 347,522 346,513 346,506 354,499 369,492",
    "435,457 461,461 491,475 489,482 470,487 460,499 459,514 468,527 478,532 487,532 497,527 506,514 507,505 504,494 508,491 513,491 527,506 539,525 543,532 540,538 516,544 508,551 503,563 480,558 463,548 447,529 437,488 423,471",
    "593,506 597,506 605,518 613,526 635,538 637,541 615,567 598,557 585,541 582,532 582,513",
    "318,501 321,503 321,520 326,536 346,556 346,566 341,571 327,571 317,566 309,558 302,544 302,529 304,520",
    "438,558 443,558 461,572 499,584 499,591 496,593 480,586 463,585 442,589 426,596 425,590 418,583 403,581 393,587 390,594 390,604 377,600 370,593 368,587 368,577 375,567 415,568",
    "287,552 289,553 298,574 311,586 297,598 291,608 290,625 292,636 277,636 274,589 266,562",
    "536,560 542,560 571,584 570,598 563,615 547,630 536,598 517,577 522,567",
    "330,595 343,596 361,612 381,622 382,636 310,636 307,627 309,614 322,599",
    "466,605 479,606 491,615 513,616 520,623 524,636 468,636 464,626 453,612 458,608",
    "432,617 440,624 447,636 401,636 401,625 416,624",
    "651,624 655,624 661,633 649,637 644,649 637,645 635,641",
  ];
  // The ground a champion can walk: one band round the edge for top and bot lane, a loop at each far corner.
  const FIELD = "M184.5 34.5 H684 V536 C684 613 611.5 685.5 534.5 685.5 H36 V184 C36 107 108 34.5 184.5 34.5 Z";
  const LOOPS = [[73, 81], [647, 639]];
  const LOOP_R = 26.5;
  // The lanes' middles, for the painted version's earth.
  const LANES = ["M184 60 H660 V536 A125 125 0 0 1 535 661 H60 V184 A124 124 0 0 1 184 60 Z", "M130 590 L590 130"];
  // The river's two halves, each running out past where it fades: into mid lane, and into the side
  // lane's bend. Each has its pit's alcove: Baron's upper left of centre, the Dragon's lower right.
  const RIVER = [
    "150,90 164,113 169,118 174,132 183,145 181,160 185,179 180,189 200,219 210,229 214,229 217,227 213,216 214,205 222,193 233,187 245,187 253,191 259,195 264,207 263,222 252,235 245,238 234,238 232,245 257,257 281,263 305,277 307,278 304,283 305,287 334,312 360,336 326,370 302,345 264,315 261,315 245,298 201,277 188,268 173,254 165,242 152,214 139,193 129,184 104,171 84,154",
    "394,350 416,366 419,375 456,410 461,410 463,405 478,420 489,426 492,433 512,443 537,460 553,477 557,493 562,496 568,496 581,519 582,532 586,544 605,563 636,566 570,630 574,593 571,594 570,582 541,560 538,539 543,532 532,512 513,491 508,491 504,494 507,505 506,514 497,527 487,532 470,529 460,516 460,499 470,487 489,482 491,475 468,464 446,458 419,444 413,438 390,425 374,411 373,406 360,384",
  ];
  // Where each half fades, measured along the corner-to-corner line: nothing at the first number, full
  // by the second, full until the third, nothing again at the fourth. The two halves are not alike.
  const FADE = [[121, 156, 297, 346], [597, 569, 401, 377]];
  const PITS = [[240, 212], [482, 508]];
  const PIT_R = 26;
  // Each base's stone, as the minimap draws it: the two are not the same drawing.
  const BASE = {
    blue: {
      edge: "60,455 77,461 88,472 112,473 137,478 167,491 184,502 195,503 210,510 215,523 217,536 228,552 240,582 246,610 246,634 257,644 264,658 259,674 250,685 224,685 210,698 71,698 69,708 63,720 0,720 0,661 9,655 23,652 23,503 37,490 37,468 48,460",
      rings: [[58, 662, 168, 7], [58, 662, 112, 8]],
      slabs: ["23,503 83,503 83,650 23,650"],
      arms: ["49,597 49,497 43,491 43,471 60,462 78,471 78,491 75,497 75,597", "99,601 163,523 170,513 198,514 204,538 125,624", "122,649 232,649 240,644 252,650 258,665 252,682 240,688 232,686 122,686"],
      plinth: ["36,608 92,608 112,630 112,684 36,684", "41,613 89,613 107,633 107,679 41,679"],
      fountain: [28, 692],
    },
    red: {
      edge: "661,0 680,0 669,8 664,19 663,34 669,49 684,58 701,59 713,53 720,46 720,63 706,70 698,72 698,217 683,230 683,257 671,266 658,271 645,266 636,259 632,248 608,248 587,243 567,236 540,220 536,222 521,221 508,214 502,201 501,187 503,184 487,157 479,135 474,110 474,86 473,84 466,84 460,77 453,58 458,45 466,35 496,35 510,22 651,22 654,11",
      rings: [[590, 37, 56, 5], [590, 125, 36, 5], [672, 128, 40, 5]],
      slabs: [],
      arms: ["500,43 610,43 610,76 500,76 494,82 474,80 464,62 472,42 494,38", "598,99 622,121 553,195 538,196 528,184 529,173", "645,120 673,120 673,232 678,238 678,254 659,264 640,254 640,238 645,232"],
      plinth: ["608,36 682,36 682,112 608,112", "613,41 677,41 677,107 613,107"],
      fountain: [692, 28],
    },
  };
  const FOUNTAIN_R = [41, 29];
  // Towers, inhibitors and each nexus where the game stands them: outer, inner and inhibitor tower for
  // top, mid and bot, then the nexus pair.
  const SIDE = {
    blue: {
      towers: [[53, 216], [78, 395], [62, 510], [287, 409], [248, 485], [181, 538], [510, 665], [338, 644], [211, 655], [90, 606], [110, 628]],
      inhibs: [[62, 544], [160, 561], [172, 655]],
      nexus: [77, 643],
    },
    red: {
      towers: [[213, 53], [387, 75], [509, 63], [436, 309], [475, 232], [541, 180], [672, 500], [646, 322], [660, 210], [612, 90], [633, 113]],
      inhibs: [[547, 62], [563, 158], [659, 175]],
      nexus: [645, 77],
    },
  };

  // The jungle's camps, each side's six, then the two epic monsters' pits are PITS above.
  const CAMPS = [[189, 338], [107, 311], [187, 407], [341, 455], [379, 523], [409, 588], [533, 382], [616, 407], [535, 314], [383, 258], [345, 191], [309, 135]];

  const points = (s) => s.split(" ").map((p) => p.split(",").map(Number));
  const n1 = (v) => Math.round(v * 10) / 10;
  // A closed shape through a ring of points, each corner rounded by up to r.
  const soft = (ring, r) => {
    const pts = points(ring);
    const toward = (p, q, by) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; const k = Math.min(by, d / 2) / d; return `${n1(p[0] + (q[0] - p[0]) * k)} ${n1(p[1] + (q[1] - p[1]) * k)}`; };
    return pts.map((p, i) => { const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length]; return `${i ? "L" : "M"}${toward(p, a, r)} Q${p[0]} ${p[1]} ${toward(p, b, r)}`; }).join(" ") + " Z";
  };
  const WALL_PATH = WALLS.map((w) => soft(w, 4)).join(" ");
  const RIVER_PATH = RIVER.map((r) => soft(r, 5));
  const poly = (s, fill) => `<polygon points="${s}" fill="${fill}"/>`;
  const disc = ([x, y], r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const fade = (id, [from, full, until, to], colour) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${from}" y1="${from}" x2="${to}" y2="${to}"><stop offset="0" stop-color="${colour}" stop-opacity="0"/><stop offset="${n1(((full - from) / (to - from)) * 100)}%" stop-color="${colour}"/><stop offset="${n1(((until - from) / (to - from)) * 100)}%" stop-color="${colour}"/><stop offset="1" stop-color="${colour}" stop-opacity="0"/></linearGradient>`;

  // What stands on the map: a tower is a small shield, an inhibitor a ring, the nexus a gem, a camp a dot, as the
  // minimap shows them in play.
  const marks = (C, camps = true, at = (p) => p, keep = () => true) => (camps ? CAMPS : []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${C.camp}" stroke="${C.ink}" stroke-width="1.2"/>`).join("") + ["blue", "red"].map((team) => {
    const s = { towers: SIDE[team].towers.filter(keep).map(at), inhibs: SIDE[team].inhibs.map(at), nexus: at(SIDE[team].nexus) }, fill = C[team];
    const tower = ([x, y]) => `<path d="M${x - 6} ${y - 7} H${x + 6} V${y + 1} Q${x + 6} ${y + 6} ${x} ${y + 8} Q${x - 6} ${y + 6} ${x - 6} ${y + 1} Z" fill="${fill}" stroke="${C.ink}" stroke-width="${C.thin ? 1.2 : 1.8}"/>`;
    const inhib = ([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${C.ink}" stroke="${fill}" stroke-width="3"/>`;
    const [x, y] = s.nexus;
    return s.towers.map(tower).join("") + s.inhibs.map(inhib).join("") + (C.round ? `<circle cx="${x}" cy="${y}" r="15" fill="${fill}" stroke="${C.light}" stroke-width="3"/>` : `<path d="M${x} ${y - 14} L${x + 12} ${y - 7} L${x + 12} ${y + 7} L${x} ${y + 14} L${x - 12} ${y + 7} L${x - 12} ${y - 7} Z" fill="${fill}" stroke="${C.light}" stroke-width="2.5"/>`);
  }).join("");

  // One base: its stone inside its own edge, then its fountain in its side's colour.
  const base = (team, C, id, extra = "") => {
    const b = BASE[team];
    return `<g clip-path="url(#${id}-${team}-base)">
    <path d="${soft(b.edge, 3)}" fill="${C.stone}" stroke="${C.rim}" stroke-width="18"/>
    ${b.rings.map(([x, y, r, w]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.ring}" stroke-width="${w}"/>`).join("")}
    ${b.slabs.map((s) => poly(s, C.stone)).join("")}${b.arms.map((s) => poly(s, C.arm)).join("")}
    ${poly(b.plinth[0], C.rim)}${poly(b.plinth[1], C.arm)}${extra}
  </g>${disc(b.fountain, FOUNTAIN_R[0], C.arm)}${disc(b.fountain, FOUNTAIN_R[1], C[team + "Side"])}`;
  };
  const baseClips = (id) => ["blue", "red"].map((team) => `<clipPath id="${id}-${team}-base"><path d="${soft(BASE[team].edge, 3)}"/></clipPath>`).join("");

  // The minimap's own colours, flat.
  function flat() {
    const C = { ground: "#000408", lane: "#919A6F", river: "#0F7B9B", stone: "#658A8F", rim: "#56797F", ring: "#537982", arm: "#73969F", blueSide: "#496B8D", redSide: "#7D5D67", blue: "#4FA3E8", red: "#E2564F", ink: "#000408", light: "#E9EEF0", camp: "#E6B94A" };
    return `<svg class="map" viewBox="0 0 ${W} ${W}" aria-hidden="true">
  <defs>${fade("rift-f-river-0", FADE[0], C.river)}${fade("rift-f-river-1", FADE[1], C.river)}${baseClips("rift-f")}</defs>
  <rect width="${W}" height="${W}" fill="${C.ground}"/>
  <path d="${FIELD}" fill="${C.lane}"/>${LOOPS.map((p) => disc(p, LOOP_R, C.lane)).join("")}
  ${RIVER_PATH.map((d, i) => `<path d="${d}" fill="url(#rift-f-river-${i})"/>`).join("")}${PITS.map((p) => disc(p, PIT_R, C.river)).join("")}
  <path d="${WALL_PATH}" fill="${C.ground}"/>
  ${base("blue", C, "rift-f")}${base("red", C, "rift-f")}
  ${marks(C)}
</svg>`;
  }

  // The map's own art: earth lanes, grass in the jungle, mossy stone at the walls' feet, teal water,
  // each base lit in its side's colour.
  function painted() {
    const C = { forest: "#0D1A17", canopy: "#1B3327", grass: "#4A5F33", earth: "#8B7148", river: "#2B8D9A", deep: "#1C6877", foam: "#8AD3D0", rock: "#B7BBA3", stone: "#7E8C85", rim: "#59665F", ring: "#6A7871", arm: "#A3AEA3", blueSide: "#3E86E0", redSide: "#D4504A", blue: "#4FA3E8", red: "#E2564F", ink: "#0A1211", light: "#EEF1EA", camp: "#F0C24E" };
    const noise = (id, freq, seed, rgb, gain, lift) => `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="4" seed="${seed}"/><feColorMatrix values="0 0 0 0 ${rgb[0]}  0 0 0 0 ${rgb[1]}  0 0 0 0 ${rgb[2]}  ${gain} 0 0 0 ${lift}"/></filter>`;
    const wash = (id, opacity = 1) => `<rect width="${W}" height="${W}" filter="url(#${id})" opacity="${opacity}"/>`;
    const glow = (team, [x, y]) => `<radialGradient id="rift-p-${team}-glow" gradientUnits="userSpaceOnUse" cx="${x}" cy="${y}" r="250"><stop offset="0" stop-color="${C[team + "Side"]}" stop-opacity=".7"/><stop offset=".45" stop-color="${C[team + "Side"]}" stop-opacity=".28"/><stop offset="1" stop-color="${C[team + "Side"]}" stop-opacity="0"/></radialGradient>`;
    const lit = (team) => `<rect width="${W}" height="${W}" fill="url(#rift-p-${team}-glow)"/>`;
    return `<svg class="map" viewBox="0 0 ${W} ${W}" aria-hidden="true">
  <defs>
    ${fade("rift-p-river-0", FADE[0], C.river)}${fade("rift-p-river-1", FADE[1], C.river)}${baseClips("rift-p")}${glow("blue", BASE.blue.fountain)}${glow("red", BASE.red.fountain)}
    ${noise("rift-p-shade", 0.014, 4, [0.02, 0.07, 0.05], 2.2, -0.82)}${noise("rift-p-sun", 0.02, 9, [0.86, 0.78, 0.45], 1.7, -0.78)}${noise("rift-p-leaf", 0.045, 2, [0.2, 0.4, 0.26], 2, -0.9)}${noise("rift-p-grain", 0.5, 5, [0, 0, 0], 0.9, -0.33)}
    <filter id="rift-p-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="rift-p-soft"><feGaussianBlur stdDeviation="0.7"/></filter>
    <filter id="rift-p-edge" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feOffset dx="3" dy="5" result="cast"/>
      <feComposite in="SourceAlpha" in2="cast" operator="out" result="shade"/><feFlood flood-color="#04100C" flood-opacity=".7"/><feComposite in2="shade" operator="in" result="shadow"/>
      <feMorphology in="SourceAlpha" operator="erode" radius="2.8" result="inner"/><feComposite in="SourceAlpha" in2="inner" operator="out" result="band"/><feFlood flood-color="${C.rock}" flood-opacity=".9"/><feComposite in2="band" operator="in" result="rock"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="rock"/></feMerge>
    </filter>
    <mask id="rift-p-walk" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${W}"><path d="${FIELD}" fill="#fff"/>${LOOPS.map((p) => disc(p, LOOP_R, "#fff")).join("")}<path d="${WALL_PATH}" fill="#000"/></mask>
    <clipPath id="rift-p-water">${RIVER_PATH.map((d) => `<path d="${d}"/>`).join("")}${PITS.map((p) => disc(p, PIT_R, "#000")).join("")}</clipPath>
  </defs>
  <rect width="${W}" height="${W}" fill="${C.forest}"/>${wash("rift-p-leaf", 0.7)}${wash("rift-p-shade", 0.6)}
  <g mask="url(#rift-p-walk)">
    <rect width="${W}" height="${W}" fill="${C.grass}"/>
    <g filter="url(#rift-p-blur)" fill="none" stroke="${C.earth}">${LANES.map((d, i) => `<path d="${d}" stroke-width="${i ? 40 : 36}"/>`).join("")}</g>
    ${wash("rift-p-sun", 0.4)}${wash("rift-p-shade", 0.75)}
    <g filter="url(#rift-p-soft)">${RIVER_PATH.map((d, i) => `<path d="${d}" fill="url(#rift-p-river-${i})"/>`).join("")}${PITS.map((p) => disc(p, PIT_R, C.deep)).join("")}</g>
    <g clip-path="url(#rift-p-water)" opacity=".35">${wash("rift-p-sun")}</g>
    ${PITS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${PIT_R - 7}" fill="none" stroke="${C.foam}" stroke-opacity=".35" stroke-width="2"/>`).join("")}
    <g filter="url(#rift-p-edge)"><rect width="${W}" height="${W}" fill="#fff" mask="url(#rift-p-walk)"/></g>
  </g>
  ${base("blue", C, "rift-p", lit("blue") + wash("rift-p-shade", 0.5))}${base("red", C, "rift-p", lit("red") + wash("rift-p-shade", 0.5))}
  ${wash("rift-p-grain", 0.1)}
  ${marks(C)}
</svg>`;
  }

  // The plan as a pitch: the classic Rift's grass and tan lanes, quiet enough to sit under the tiles.
  function pitch() {
    const C = { out: "#12301F", grass: "#2F6A3A", wall: "#275832", lane: "#9C9259", river: "#3E8CAD" };
    const side = { blue: { stone: "#335B8C", rim: "#2B4E79", ring: "#2F5584", arm: "#3F699C", blueSide: "#6FA3E0" }, red: { stone: "#8A4543", rim: "#763A38", ring: "#82403E", arm: "#9A5250", redSide: "#DE8B86" } };
    return `<svg class="map" viewBox="0 0 ${W} ${W}" aria-hidden="true">
  <defs>${fade("rift-g-river-0", FADE[0], C.river)}${fade("rift-g-river-1", FADE[1], C.river)}${baseClips("rift-g")}
    <mask id="rift-g-walk" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${W}"><path d="${FIELD}" fill="#fff"/>${LOOPS.map((p) => disc(p, LOOP_R, "#fff")).join("")}<path d="${WALL_PATH}" fill="#000"/></mask>
  </defs>
  <rect width="${W}" height="${W}" fill="${C.out}"/>
  <path d="${FIELD}" fill="${C.wall}"/>${LOOPS.map((p) => disc(p, LOOP_R, C.wall)).join("")}
  <g mask="url(#rift-g-walk)">
    <rect width="${W}" height="${W}" fill="${C.grass}"/>
    <g fill="none" stroke="${C.lane}"><path d="${LANES[0]}" stroke-width="50"/><path d="${LANES[1]}" stroke-width="46"/></g>
    ${RIVER_PATH.map((d, i) => `<path d="${d}" fill="url(#rift-g-river-${i})"/>`).join("")}${PITS.map((p) => disc(p, PIT_R, C.river)).join("")}
  </g>
  ${base("blue", side.blue, "rift-g")}${base("red", side.red, "rift-g")}
</svg>`;
  }

  // The painted map made quiet: the maze still reads, but nothing on it is louder than a tile.
  // Its bases are drawn as the minimap draws them, less the paths (Craig, 19 Nov 2026: "its grey straight
  // into jngle", "theres no lanes inside the bae", "you have 2 blue circles, make one for the nexus", then
  // "like a kid took the grey crayon" and a crop of the minimap's base): a quarter of a round stone court,
  // cut to the playfield's own outline, stepped in rings of close tones, the well a plain stone disc in the corner.
  // No outline, no plinth (the panel, 19 Nov). The two far corners' loops are left out: off the lane they
  // showed as stray green patches.
  const COURT = {
    blue: { centre: [58, 662], corner: [36, 685.5] },
    red: { centre: [662, 58], corner: [684, 34.5] },
  };
  // Each ring out from the court's centre: its radius and its tone, widest first.
  const COURT_RINGS = [[200, "rim"], [184, "line"], [180, "court"], [124, "line"], [121, "floor"]];
  const WELL_R = 44;
  // Every lane's three towers stand on the map; the pair by each nexus is left out.
  const BASE_REACH = 80;
  const inBase = ([x, y]) => Object.values(COURT).some(({ centre }) => Math.hypot(x - centre[0], y - centre[1]) < BASE_REACH);
  const court = (team, C) => {
    const b = COURT[team];
    return `<g clip-path="url(#rift-c-field)">
    ${COURT_RINGS.map(([r, tone]) => disc(b.centre, r, C[tone])).join("")}${disc(b.corner, WELL_R + 3, C.line)}${disc(b.corner, WELL_R, C.rim)}
  </g>`;
  };
  function calm() {
    const C = { out: "none", wall: "#22392A", grass: "#46663C", lane: "#6C6B49", river: "#2E7E92", pit: "#2E7E92", blue: "#6E9FD6", red: "#D68782", ink: "#12231C", light: "#D9DED6", camp: "#000", round: true, thin: true };
    const stone = { rim: "#6B7B82", line: "#4C5A60", court: "#5C6B72", floor: "#64747B" }; // the minimap's blue-grey stone, for both sides: only the nexus shows the side
    return `<svg class="map" viewBox="0 0 ${W} ${W}" aria-hidden="true">
  <defs>${fade("rift-c-river-0", FADE[0], C.river)}${fade("rift-c-river-1", FADE[1], C.river)}${baseClips("rift-c")}
    <clipPath id="rift-c-field"><path d="${FIELD}"/></clipPath>
    <filter id="rift-c-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2"/></filter>
    <mask id="rift-c-walk" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${W}"><path d="${FIELD}" fill="#fff"/><path d="${WALL_PATH}" fill="#000"/></mask>
  </defs>
  <rect width="${W}" height="${W}" fill="${C.out}"/>
  <path d="${FIELD}" fill="${C.wall}"/>
  <g mask="url(#rift-c-walk)">
    <rect width="${W}" height="${W}" fill="${C.grass}"/>
    <g filter="url(#rift-c-blur)" fill="none" stroke="${C.lane}"><path d="${LANES[0]}" stroke-width="44"/><path d="${LANES[1]}" stroke-width="50"/></g>
    ${RIVER_PATH.map((d, i) => `<path d="${d}" fill="url(#rift-c-river-${i})"/>`).join("")}${PITS.map((p) => disc(p, PIT_R, C.pit)).join("")}
  </g>
  ${court("blue", stone)}${court("red", stone)}
  <g opacity=".7">${marks(C, false, (p) => p, (p) => !inBase(p))}</g>
</svg>`;
  }

  root.RIFT_MAP = (style) => ({ painted, pitch, calm }[style] || flat)();
})(typeof window !== "undefined" ? window : globalThis);
