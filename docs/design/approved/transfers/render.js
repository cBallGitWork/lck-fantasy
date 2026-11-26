// Draws Transfers from Pick Team's made-up week (../pick-team/data.js) into #app, in the same look (../pick-team/look.css).
// Which picture: transfers.html is Rift view mid-transfer (Siwoo sold, Kingen bought at −6); ?s=none is before anyone is
// sold; ?s=sold is Siwoo just sold, his slot empty and a buy refused; ?s=over is Viper bought over the budget;
// ?s=confirm is the confirm sheet; ?v=list is List view (README.md).
(function () {
  const T = window.TRIAL;
  const ROLE = { top: "Top", jng: "Jungle", mid: "Mid", bot: "Bot", sup: "Support", coach: "Coach" };
  const ROLES = Object.keys(ROLE);
  const RIOT = 'Flol was created under Riot Games\' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.';
  const Q = new URLSearchParams(location.search);
  const LIST = Q.get("v") === "list";
  const NONE = Q.get("s") === "none";
  const SOLD = Q.get("s") === "sold";
  const OVER = Q.get("s") === "over";
  const CONFIRM = Q.get("s") === "confirm";
  // The colour round's recipe (Craig, 26 Nov 2026), scoped to this page by a body class.
  document.body.classList.add("c-u");
  const INK = { DK: "#0A1226", BFX: "#0A1226" };

  // The player bought, and the rest of the market: made up, as the built screen's (src/screens/transfers/fixtures.ts).
  const KINGEN = { name: "Kingen", team: "NS", role: "top", priceM: 6.5, form: 9.5, ownedPct: 9, season: 38, last3: [8, 6, 5], opponents: ["DNS", "HLE"] };
  const MARKET = [
    ["Kingen", "NS", "top", 6.5, 38, 9, "DNS"], ["PerfecT", "KT", "top", 7, 27, 3, "T1"], ["DuDu", "DNS", "top", 6, 23, 2, "NS"], ["Clear", "BFX", "top", 5.5, 14, 1, "KRX"],
    ["Lucid", "DK", "jng", 9, 26, 5, "HLE"], ["Oner", "T1", "jng", 13, 25, 22, "KT"], ["Peanut", "HLE", "jng", 10.5, 21, 12, "DK"],
    ["Chovy", "GEN", "mid", 17.5, 61, 41, "BRO"], ["ShowMaker", "DK", "mid", 13, 33, 9, "HLE"], ["Clozer", "BRO", "mid", 5, 28, 2, "GEN"],
    ["Aiming", "DK", "bot", 13.5, 31, 8, "HLE"], ["Viper", "HLE", "bot", 15, 30, 26, "DK"], ["Hype", "KRX", "bot", 5.5, 15, 1, "BFX"],
    ["Keria", "T1", "sup", 12, 52, 47, "KT"], ["Lehends", "NS", "sup", 8, 19, 6, "DNS"], ["Pollu", "BRO", "sup", 4.5, 14, 1, "GEN"],
    ["Ryu", "GEN", "coach", 7, 26, 21, "BRO"], ["Homme", "HLE", "coach", 6.5, 18, 9, "DK"], ["Ssong", "DNS", "coach", 5.5, 14, 3, "NS"],
  ].map(([name, team, role, priceM, pts, owned, next]) => ({ name, team, role, priceM, pts, owned, next }));

  // The nine by role, as they stand after the draft: Kingen takes Siwoo's place among the tops.
  const VIPER = { name: "Viper", team: "HLE", role: "bot", priceM: 15, form: 14.5, ownedPct: 26, season: 30, last3: [9, 8, 6], opponents: ["DK", "NS"] };
  const P = { ...T.players, kingen: KINGEN, viper: VIPER };
  const inId = NONE || SOLD ? null : OVER ? "viper" : "kingen";
  const squadIds = Object.values(T.slots).map((id) => (id === "siwoo" && !NONE ? inId : id));
  const byRole = Object.fromEntries(ROLES.map((r) => [r, squadIds.filter((id) => id && P[id].role === r)]));
  const bought = inId ? [inId] : [];

  const money = (m) => `₩${m.toFixed(1)}m`;
  const bankStart = 0.5;
  const bank = NONE ? bankStart : bankStart + P.siwoo.priceM - (inId ? P[inId].priceM : 0);
  const cost = inId ? -6 : 0;
  // Why Review and confirm is off, said beside it (plate.md, States).
  const off = NONE ? "No changes" : SOLD ? "1 player to buy" : OVER ? "Over budget" : "";

  // Both of the week's opponents, in the order played (Craig, 26 Nov 2026: Next shows both), from the week's series.
  const OPP = {};
  for (const g of T.series) { (OPP[g.home] ??= []).push(g.away); (OPP[g.away] ??= []).push(g.home); }
  const next = (team) => `v ${OPP[team].join(", ")}`;
  const KIT = "../../../../data/lck/";
  const shirt = (team) => `<img class="shirt" src="${KIT}shirts/${team}.svg" alt="">`;
  // A team's bar: its kit's first colour that shows on the navy (approved/team-colour/README.md).
  const BAR = { T1: "#E2012D", GEN: "#AA8A00", HLE: "#F3741B", DK: "#F5F5F5", KT: "#EC1B23", DNS: "#1F4FD8", NS: "#ED1C24", KRX: "#E4007F", BRO: "#F37021", BFX: "#FFC20E" };
  const team = (code) => `<span class="team"><i class="team__bar" style="background:${BAR[code]}"></i>${code}</span>`;

  // A tile as FPL's Transfers pitch: × to sell and the price in the dark strip over the shirt, the name, the next opponent.
  const tile = (id) => {
    const p = P[id];
    return `<div class="tile${bought.includes(id) ? " is-new" : ""}${NONE && id === "faker" ? " is-selected" : ""}" style="--team:${BAR[p.team]};--team-ink:${INK[p.team] ?? "#FFFFFF"}">
      <span class="tile__card"><span class="tile__label ttile__top"><button class="ttile__x" type="button" aria-label="Sell ${p.name}">×</button><span class="fig">${money(p.priceM)}</span></span>${shirt(p.team)}</span>
      <span class="tile__plate"><span class="tile__team">${p.team}</span> ${p.name}</span>
      <span class="tile__band">${next(p.team)}</span>
    </div>`;
  };
  // A sold player's slot: dashed, its role and +, and ↺ to put him back (spec/12).
  const empty = (role, was) => `<div class="tile tile--empty">
      <button class="tile__card" type="button" aria-label="Buy a ${ROLE[role]}"><span class="empty__plus">+</span></button>
      <button class="tile__plate empty__back" type="button">↺ ${P[was].name}</button>
    </div>`;

  // Each role's place on the Rift, of 720: its players side by side under the role's name, said once.
  const PLACE = { top: [190, 132], jng: [172, 338], mid: [432, 392], bot: [470, 588], sup: [592, 588], coach: [132, 588] };
  const W = 720;
  const map = window.RIFT_MAP("calm");
  const rift = `<div class="rift">${map}${ROLES.map((r) => {
    const tiles = byRole[r].map(tile).join("") + (SOLD && r === "top" ? empty("top", "siwoo") : "");
    // A second Bot stands to the left, clear of the Support.
    const x = PLACE[r][0] - (r === "bot" ? 60 * (byRole[r].length - 1) : 0);
    return `<div class="rift__spot group" style="--x:${(x / W) * 100}%;--y:${(PLACE[r][1] / W) * 100}%"><span class="group__role">${ROLE[r]}</span><div class="group__tiles">${tiles}</div></div>`;
  }).join("")}</div>`;

  // List view: the nine grouped by role, FPL's list with prices and fixtures.
  const week = (p) => p.last3[0] + p.last3[1];
  const squadList = `<div class="slist"><table>${ROLES.map((r) => `<tr class="slist__role"><th>${ROLE[r]}</th>${r === "top" ? `<th></th><th class="num">Week 3</th><th class="num">Price</th><th class="num">Form</th><th class="num">Total</th><th>Next</th><th></th>` : `<th colspan="7"></th>`}</tr>${byRole[r]
    .map((id) => {
      const p = P[id];
      return `<tr${bought.includes(id) ? ' class="is-new"' : ""}><td class="slist__who"><img class="slist__shirt" src="${KIT}shirts/${p.team}.svg" alt=""><b>${p.name}</b></td><td>${team(p.team)}</td><td class="num fig">${week(p)}</td><td class="num fig">${money(p.priceM)}</td><td class="num fig">${p.form.toFixed(1)}</td><td class="num fig">${p.season}</td><td>${next(p.team)}</td><td class="act"><button class="rowkey rowkey--sell" type="button" aria-label="Sell ${p.name}">×</button></td></tr>`;
    })
    .join("")}`).join("")}</table></div>`;

  // The column beside the Rift: what the draft costs, the draft itself and its one key; then the week's confirms.
  const draft = NONE
    ? ""
    : `<p class="draft__row"><span><s>Siwoo</s> <span class="fig">${money(P.siwoo.priceM)}</span> → ${inId ? `<b>${P[inId].name}</b> <span class="fig">${money(P[inId].priceM)}</span>` : `<span class="mid">—</span>`}</span>${inId ? `<b class="fig">−6</b>` : ""}</p>`;
  const yours = `<section class="tpanel tpanel--yours" aria-label="Your transfers"><h2 class="tpanel__title">Your transfers</h2>
    <dl class="figs"><div><dt>Free transfers</dt><dd class="fig">0</dd></div><div><dt>Cost</dt><dd class="fig cost${cost ? " is-hit" : ""}">${cost ? "−6" : "0"}</dd></div><div><dt>Bank</dt><dd class="fig bank ${bank < 0 ? "is-over rise" : "is-ok"}">${bank < 0 ? "−" : ""}${money(Math.abs(bank))}</dd></div></dl>
    <div class="draft">${draft}</div>
    ${off ? `<p class="off small mid">${off}</p>` : ""}<div class="tpanel__keys">${NONE ? `<span class="bar__reset">Reset</span>` : `<button class="link" type="button">Reset</button>`}<button class="save${off ? " key-off" : ""}" type="button"${off ? " disabled" : ""}>Review and confirm ›</button></div>
  </section>`;
  const confirmed = `<section class="tpanel" aria-label="Confirmed"><h2 class="tpanel__title">Confirmed · Week 4</h2>
    <div class="conf"><div><b>Kiin → Zeus</b><span class="small mid">Tue 9:10pm · <span class="fig">−6</span></span></div><button class="key" type="button">Undo</button></div>
    <div class="conf"><div><b>Peyz → Ruler, Lehends → Delight</b><span class="small mid">Mon 6:02pm · No cost</span></div></div>
  </section>`;

  // The player list: grouped by role under All roles, as FPL's; no row greyed, a refused buy says why at the list's top.
  const inSquad = new Set(squadIds.filter(Boolean).map((id) => P[id].name));
  // Once a player is sold the list opens on his role (the panel, 26 Nov 2026); before any sale, all roles.
  const SHOWN = SOLD ? ["top"] : ROLES;
  const rows = SHOWN.map((r) => `<tr class="plist__role"><th>${ROLE[r]}</th>${r === "top" ? `<th class="num">Price</th><th class="num">Pts</th><th class="num">Owned</th><th>Next</th><th></th>` : `<th colspan="5"></th>`}</tr>${MARKET.filter((m) => m.role === r && !inSquad.has(m.name))
    .map((m) => `<tr${SOLD && m.name === "PerfecT" ? ' class="is-tapped"' : ""}><td class="plist__who"><b>${m.name}</b>${team(m.team)}</td><td class="num fig">${money(m.priceM)}</td><td class="num fig">${m.pts}</td><td class="num fig">${m.owned}%</td><td>${next(m.team)}</td><td class="act"><button class="rowkey" type="button" aria-label="Buy ${m.name}">+</button></td></tr>`)
    .join("")}`).join("");
  const chips = ["All roles", ...ROLES.map((r) => ROLE[r])].map((c, i) => `<button class="chip${i === (SOLD ? 1 : 0) ? " is-here" : ""}" type="button">${c}</button>`).join("");
  // What the last + did, said where it was pressed: an add, or why a buy was refused.
  const note = NONE ? "Sell a player first" : SOLD ? "Max 2 from GEN" : `${P[inId].name} added`;
  const players = `<section class="tpanel plist" aria-label="Players"><h2 class="tpanel__title">${SOLD ? "Replacing Siwoo" : "Players"}</h2>
    <p class="note" role="status">${note}</p>
    <div class="chips">${chips}</div>
    <div class="plist__find"><span class="field">Find a player</span><button class="field field--pick" type="button">Sort: Points ▾</button><button class="field field--pick" type="button">Team: All ▾</button></div>
    <table>${rows}</table>
  </section>`;

  // The confirm sheet: a heavy frame, one row a transfer, then what it costs.
  const sheet = `<div class="scrim"></div><section class="sheet" role="dialog" aria-label="Confirm transfers"><button class="card__close sheet__close" type="button" aria-label="Close">✕</button><h2 class="sheet__title">Confirm your transfers</h2>
    <table class="sheet__moves"><tr><th>Out</th><th></th><th>In</th></tr><tr><td><b>Siwoo</b>${team("DK")}<span class="fig">${money(P.siwoo.priceM)}</span></td><td class="sheet__arrow">→</td><td><b>Kingen</b>${team("NS")}<span class="fig">${money(KINGEN.priceM)}</span></td></tr></table>
    <dl class="figs"><div><dt>Free transfers used</dt><dd class="fig">0</dd></div><div><dt>Cost</dt><dd class="fig">−6</dd></div><div><dt>Bank</dt><dd class="fig">${money(bankStart)} → ${money(bank)}</dd></div></dl>
    <div class="sheet__keys"><span class="deadline"><span class="deadline__word">Deadline</span> <b class="fig">${T.deadline.local}</b></span><button class="key" type="button">Back</button><button class="save" type="button">Confirm</button></div>
  </section>`;

  // The tapped player's card, docked under the Rift on desktop (Craig, 26 Nov 2026: the gap under the Rift holds the card).
  // It is the card's front (spec/12, The player card): season points and owned with their rank, the scoring lines'
  // season figures in Form's place (Craig, 26 Nov 2026: no Form here, kills and the like), the last 3 series each with
  // its opponent and the next 3, and
  // the one key Transfers gives it: × to sell a player of yours, + to buy one from the list.
  // Made-up season lines for the card: the scoring lines only (spec/05), kills, deaths and assists per game, the rest totals.
  const LINES = {
    Kingen: { seasonRank: 4, ownedRank: 5, of: "10 tops", kda: [2.8, 2.6, 5.1], gold: "5 of 10", solo: 3, fb: 1, was: ["KT", "GEN", "BRO"] },
    PerfecT: { seasonRank: 6, ownedRank: 8, of: "10 tops", kda: [2.1, 2.9, 4.4], gold: "4 of 10", solo: 2, fb: 1, was: ["NS", "HLE", "KRX"] },
    Viper: { seasonRank: 4, ownedRank: 2, of: "10 bots", kda: [4.6, 1.8, 5.9], gold: "7 of 10", solo: 1, fb: 2, was: ["T1", "BFX", "KT"] },
    Faker: { seasonRank: 2, ownedRank: 1, of: "10 mids", kda: [3.9, 1.7, 6.8], gold: "8 of 10", solo: 4, fb: 2, was: ["GEN", "DK", "HLE"] },
  };
  const PERFECT = { name: "PerfecT", team: "KT", role: "top", priceM: 7, ownedPct: 3, season: 27, last3: [9, 4, 6] };
  const sel = NONE ? P.faker : SOLD ? PERFECT : OVER ? VIPER : KINGEN;
  const L = LINES[sel.name];
  const mine = !SOLD;
  // His next 3 series: the week's two, then next week's first (made up).
  const AFTER = { T1: ["DK", "Wed"], KT: ["BRO", "Thu"], NS: ["KT", "Wed"], HLE: ["GEN", "Thu"] };
  const next3 = [...T.series.filter((g) => g.home === sel.team || g.away === sel.team).map((g) => [g.home === sel.team ? g.away : g.home, g.day]), AFTER[sel.team]];
  const ord = (n) => n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th");
  const stat = (word, fig, rank) => `<div><dt class="small mid">${word}</dt><dd><b class="fig">${fig}</b>${rank ? `<span class="small mid${rank > 0 ? " fig" : ""}">${rank > 0 ? ord(rank) : rank}</span>` : ""}</dd></div>`;
  const pcard = `<section class="pcard" aria-label="${sel.name}">
    <div class="pcard__who"><div class="card__head"><img class="crest" src="${KIT}crests/${sel.team}.svg" alt="${sel.team}"><div class="card__who"><h2 class="card__name">${sel.name}</h2><span class="card__meta">${sel.team} · ${ROLE[sel.role]} · <span class="fig">${money(sel.priceM)}</span></span></div></div>
      <div class="pcard__keys">${mine ? `<button class="key pcard__sell" type="button">× Sell</button>` : `<button class="key pcard__buy" type="button">+ Buy</button>`}<a class="link" href="#">Full card ›</a></div></div>
    <div class="pcard__mid"><p class="small mid pcard__of">Season · among ${L.of}</p>
      <dl class="pcard__stats">${stat("Points", sel.season, L.seasonRank)}${stat("Owned", `${sel.ownedPct}%`, L.ownedRank)}${stat("Gold lead at 15", L.gold, "games")}${stat("Solo kills", L.solo)}${stat("Kills per game", L.kda[0].toFixed(1))}${stat("Deaths per game", L.kda[1].toFixed(1))}${stat("Assists per game", L.kda[2].toFixed(1))}${stat("First blood", L.fb)}</dl></div>
    <div class="pcard__series"><p class="small mid">Last 3 series</p><div class="pcard__cells">${sel.last3.map((n, i) => `<span><b class="fig">${n}</b><span class="small mid">v ${L.was[i]}</span></span>`).join("")}</div>
      <p class="small mid">Next 3 series</p><div class="pcard__cells">${next3.map(([opp, day]) => `<span><b>v ${opp}</b><span class="small mid">${day} · Bo3</span></span>`).join("")}</div></div>
  </section>`;

  const nav = T.nav.map((n) => (n === "Live" ? `<a class="nav__live" href="#"><span class="dot"></span>Live</a>` : `<a href="#"${n === "Transfers" ? ' class="is-here"' : ""}>${n}</a>`)).join("");
  const d = T.deadline;
  const deadline = `<span class="deadline"><span class="deadline__word">Deadline</span> <b class="fig">${d.local}</b> <span class="deadline__count fig">${d.countdown}</span></span>`;

  document.getElementById("app").innerHTML = `
  <header class="top"><b class="wordmark">Flol</b><nav class="nav">${nav}</nav><span class="top__gap"></span><span class="sponsor-top">presented by <span class="placeholder">Sponsor</span></span><span class="account">${T.account} ▾</span></header>
  <div class="page">
    <main class="main">
      <div class="head"><h1 class="title"><span class="title__en">Transfers</span> <span class="title__ko" lang="ko">이적</span></h1><span class="head__week">${T.week}</span>${deadline}<div class="views" role="tablist"><button${LIST ? "" : ' class="is-here"'} type="button">Rift view</button><button${LIST ? ' class="is-here"' : ""} type="button">List view</button></div></div>
      <div class="object${LIST ? " object--list" : ""}">
        ${LIST ? squadList : `<div class="rift-stage">${rift}</div>`}
        <div class="squad-foot">${yours}${confirmed}</div>
      </div>
      ${pcard}
    </main>
    <aside class="side">${players}<div class="placeholder sponsor-side">Sponsor</div><p class="small mid">All sponsors are made up.</p></aside>
  </div>
  <footer class="foot small mid">${RIOT}</footer>
  ${CONFIRM ? sheet : ""}`;

  const riftEl = document.querySelector(".rift");
  if (riftEl) new ResizeObserver(() => document.documentElement.style.setProperty("--rift-w", `${riftEl.getBoundingClientRect().width}px`)).observe(riftEl);
})();
