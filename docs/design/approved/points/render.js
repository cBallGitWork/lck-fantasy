// Draws Points in Pick Team's look (../pick-team/look.css) into #app: a made-up Split 1 Week 3, Saturday, T1 v DK live
// in game 2. Players and places are Pick Team's (../pick-team/data.js); the week's points and results are here.
// Which picture: points.html has Faker, the Captain, tapped; ?p=kkoma taps the coach; ?p=bdd a bench player with no games.
(function () {
  const T = window.TRIAL;
  const ROLE = { top: "Top", jng: "Jungle", mid: "Mid", bot: "Bot", sup: "Support", coach: "Coach" };
  const SLOT = { top: [132, 124], jng: [196, 340], mid: [372, 372], bot: [470, 600], sup: [592, 600], coach: [132, 600], flex: [592, 124] };
  const W = 720;
  const RIOT = 'Flol was created under Riot Games\' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.';
  const Q = new URLSearchParams(location.search);
  const selected = Q.get("p") || "faker";
  const KIT = "../../../../data/lck/";
  const shirt = (team) => `<img class="shirt" src="${KIT}shirts/${team}.svg" alt="">`;
  const BAR = { T1: "#E2012D", GEN: "#AA8A00", HLE: "#F3741B", DK: "#F5F5F5", KT: "#EC1B23", DNS: "#1F4FD8", NS: "#ED1C24", KRX: "#E4007F", BRO: "#F37021", BFX: "#FFC20E" };
  const live = `<span class="live"><span class="dot"></span>Live</span>`;

  // The week: each player's series with its points (a series scores his best 2 games), the Captain's total after ×1.5.
  const g = (champ, won, kda, lines, pts, counted = true, clock = "") => ({ champ, won, kda, lines, pts, counted, clock });
  const WEEK = {
    zeus: { total: 7, next: "GEN", series: [{ opp: "T1", pts: 7 }] },
    canyon: { total: 7, next: "HLE", series: [{ opp: "KT", pts: 7 }] },
    faker: {
      total: 25,
      series: [
        { day: "Wed", opp: "HLE", result: "W 2–1", pts: 12, games: [g("Azir", true, "6/1/9", "Gold · Solo", 5), g("Taliyah", false, "2/4/5", "Gold · First blood", 2, false), g("Galio", true, "4/0/14", "Gold · First blood · Solo · Deathless", 7)] },
        { day: "Sat", opp: "DK", result: "1–0", live: true, pts: 5, games: [g("Orianna", true, "5/2/8", "Gold · First blood", 4), g("Sylas", null, "1/0/2", "Solo", 1, true, "14:20")] },
      ],
    },
    ruler: { total: 7, next: "HLE", series: [{ opp: "KT", pts: 7 }] },
    delight: { total: 5, next: "GEN", series: [{ opp: "T1", pts: 5 }] },
    siwoo: { total: 8, series: [{ opp: "NS", pts: 5 }, { opp: "T1", pts: 3, live: true }] },
    kkoma: {
      total: 10,
      series: [
        { day: "Wed", opp: "HLE", result: "W 2–1", pts: 8, end: ["Series win", "+3"], games: [g("", true, "", "First tower · Most drakes · Quick win", 3), g("", false, "", "Most drakes", 1, false), g("", true, "", "First tower · Most barons", 2)] },
        { day: "Sat", opp: "DK", result: "1–0", live: true, pts: 2, games: [g("", true, "", "First tower · Most drakes", 2), g("", null, "", "", 0, true, "14:20")] },
      ],
    },
    bdd: { total: null, series: [] },
    cuzz: { total: 9, series: [{ opp: "GEN", pts: 4 }, { opp: "BFX", pts: 5 }] },
  };
  const HANGUL = { faker: "페이커", kkoma: "꼬마", bdd: "비디디" };
  const isBench = (slot) => slot.startsWith("bench");

  // A tile as Pick Team's, its band the week's total alone (Craig, 27 Nov 2026: each series' points are too much here;
  // they are in his breakdown). With a series still to come, the total so far and that opponent: `7, v GEN`. A player with no games shows a dash and Didn't play.
  const tile = (id, slot) => {
    const p = T.players[id];
    const w = WEEK[id];
    const label = isBench(slot) ? "" : `<span class="tile__label">${slot === "flex" ? "Flex" : ROLE[slot]}</span>`;
    return `<button class="tile ptile${id === selected ? " is-selected" : ""}${isBench(slot) ? " ptile--bench" : ""}" type="button">
      <span class="tile__card">${label}${shirt(p.team)}${id === T.captain ? `<span class="tile__c" title="Scores ×1.5 this week">C</span>` : ""}</span>
      <span class="tile__plate"><span class="tile__team">${p.team}</span> ${p.name}</span>
      <span class="tile__band ptile__pts"><b class="fig">${w.total ?? "—"}</b>${w.next ? `<span class="ptile__next">, v ${w.next}</span>` : ""}</span>
      ${w.total === null ? `<span class="tile__band ptile__split">Didn't play</span>` : ""}
    </button>`;
  };
  const rift = `<div class="rift">${window.RIFT_MAP("calm")}${Object.keys(SLOT).map((slot) => `<div class="rift__spot" style="--x:${(SLOT[slot][0] / W) * 100}%;--y:${(SLOT[slot][1] / W) * 100}%">${tile(T.slots[slot], slot)}</div>`).join("")}</div>`;

  // Beside the Rift: the week's total and the bench. Your week sits in the side column, under the series (Craig, 16 Nov 2026).
  const total = `<section class="tpanel total" aria-label="Total"><h2 class="tpanel__title">Total</h2>
    <p class="total__big"><b class="fig">69</b><span class="tag tag--dash">Not final</span></p>
    <dl class="figs"><div><dt>Average</dt><dd class="fig">58</dd></div><div><dt>Highest</dt><dd><a class="link" href="#"><span class="fig">104</span> ›</a></dd></div></dl>
    <p class="total__live">${live}<b>T1 v DK, game 2</b><a class="link" href="#">Watch ›</a></p>
  </section>`;
  const bench = `<div class="bench" aria-label="Bench"><span class="bench__title">Bench</span>${["bench1", "bench2"].map((slot, i) => `<div class="bench__spot"><span class="bench__order">${i + 1}. ${ROLE[T.players[T.slots[slot]].role]}</span>${tile(T.slots[slot], slot)}</div>`).join("")}</div>`;
  // Star, Flop and Killer each carry their mark before the word, and the player his team's bar and code, as Home's rows
  // (plate.md, Parts: A fact's mark; A player named in a row). Star and Flop are Home's marks; Killer is crossed swords.
  const ico = (body, cls) => `<svg class="ico ico--${cls}" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const ICON = {
    Star: ico('<path d="M12 3l2.700 5.600 6.100.8-4.500 4.300 1.100 6.100L12 16.900 6.600 19.800l1.100-6.100L3.200 9.400l6.100-.8z" fill="currentColor"/>', "star"),
    Flop: ico('<path d="M3 7l6 6 4-4 8 8M21 11v6h-6"/>', "flop"),
    Killer: ico('<path d="M14.500 17.500 3 6V3h3l11.500 11.500M13 19l6-6M16 16l4 4M19 21l2-2M14.500 6.500 18 3h3v3l-3.500 3.500M5 14l4 4M7 17l-3 3M3 19l2 2"/>', "killer"),
  };
  const PICK_TEAM = { Faker: "T1", kkOma: "T1", Siwoo: "DK", Delight: "HLE", Chovy: "GEN", Zeka: "HLE", Kiin: "GEN" };
  const who = (name) => `<i class="team__bar" style="background:${BAR[PICK_TEAM[name]]}"></i><span class="who__team">${PICK_TEAM[name]}</span> <b>${name}</b>`;
  // Three Stars, the Flop, three Killers (spec/12, Points, Your own week): the word and its mark head each group, on its
  // first row only. Stars are your starters by points x (1 - effective ownership), Killers the players you don't own by
  // points x effective ownership; the sum picks each three and is never shown; the three are listed by points (Craig, 27 Nov 2026). Owned is effective ownership.
  // No dot here: Stars and the Flop are always yours and Killers never (Craig, 27 Nov 2026).
  const pick = (word, name, mine, pts, owned, first = true) => `<div class="pick${first ? " pick--first" : ""}"><dt class="fact">${first ? ICON[word === "Stars" ? "Star" : word === "Killers" ? "Killer" : word] + word : ""}</dt><dd>${who(name)}</dd><dd class="pick__figs"><b class="fig">${pts}</b><span class="small mid fig">${owned}%</span></dd></div>`;
  const group = (word, rows, mine) => rows.map(([name, pts, owned], i) => pick(word, name, mine, pts, owned, i === 0)).join("");
  const yourWeek = `<section class="tpanel side-panel side-panel--pad" aria-label="Your week"><h2 class="tpanel__title">Your week</h2>
    <dl class="picks"><div class="pick pick--head small mid"><dt></dt><dd></dd><dd class="pick__figs"><span>Pts</span><span>Owned</span></dd></div>${group("Stars", [["Faker", 25, 46], ["kkOma", 10, 18], ["Siwoo", 8, 6]], true)}${pick("Flop", "Delight", true, 5, 12)}${group("Killers", [["Chovy", 15, 41], ["Zeka", 14, 22], ["Kiin", 12, 33]], false)}</dl>
  </section>`;

  // Under the Rift: the tapped player's week, a series a column, a game a row; the points boxed when counted.
  const sel = T.players[selected];
  const sw = WEEK[selected];
  const coach = sel.role === "coach";
  // The final card of the card round (27 Nov 2026): the panels' blue band holding one line, as a Rift tile reads: his
  // role strip, the team's bar and code, his name, then his total at the right (Craig, 27 Nov 2026: no line under the name); then one ruled table, a series a header row, a game a row with K, D and A in columns; W and L outlined,
  // Live filled; the points boxed when counted, grey when dropped.
  const res = (x) => (x.won === null ? `<span class="chip chip--live">Live</span>` : `<span class="chip chip--${x.won ? "w" : "l"}">${x.won ? "W" : "L"}</span>`);
  const mini = (t) => `<img class="mini" src="${KIT}crests/${t}.svg" alt="">`;
  const game = (x, i) => {
    const [k, d, a] = x.kda ? x.kda.split("/") : ["", "", ""];
    return `<tr${x.counted ? "" : ' class="is-dropped"'}><td class="l"><span class="small mid">G${i + 1}</span>&nbsp; ${res(x)}&nbsp; ${coach ? "" : `<b>${x.champ}</b>`}${x.clock ? ` <span class="fig mid small">${x.clock}</span>` : ""}</td>${coach ? "" : `<td class="fig k">${k}</td><td class="fig k d">${d}</td><td class="fig k">${a}</td>`}<td class="l small mid"${coach ? ' colspan="4"' : ""}>${x.lines.replace("Gold", "Gold lead")}</td><td><b class="fig bd__pts">${x.pts}</b></td></tr>`;
  };
  const oneSeries = (s) => `<tr class="ser"><td class="l" colspan="5"><span class="small mid">${s.day}</span>&nbsp; ${mini(s.opp)}<a class="link" href="#">v ${s.opp} ›</a>&nbsp; ${s.live ? `<span class="chip chip--live">Live</span> <span class="fig mid">${s.result}</span>` : `<span class="chip chip--${s.result.startsWith("W") ? "w" : "l"}">${s.result}</span>`}</td><td><b class="fig">${s.pts}</b></td></tr>${s.games.map(game).join("")}${s.end ? `<tr><td class="l" colspan="5">${s.end[0]}</td><td><b class="fig bd__pts">${s.end[1]}</b></td></tr>` : ""}`;
  const note = selected === T.captain ? "17 ×1.5 · Captains averaged 19" : sw.total === null ? "Didn't play" : "";
  const breakdown = `<section class="bd" aria-label="${sel.name}">
    <div class="bd__head"><img class="crest" src="${KIT}crests/${sel.team}.svg" alt=""><span class="bd__role">${ROLE[sel.role]}</span><h2 class="card__name"><span class="bd__team"><i class="team__bar" style="background:${BAR[sel.team]}"></i>${sel.team}</span> ${sel.name}</h2>${HANGUL[selected] ? `<span class="bd__ko" lang="ko">${HANGUL[selected]}</span>` : ""}${selected === T.captain ? '<span class="tile__c bd__c">C</span>' : ""}
      <span class="bd__total"><span class="small">${note}</span><b class="fig">${sw.total ?? "—"}</b></span></div>
    ${sw.series.length ? `<table><tr><th>Game</th>${coach ? '<th class="l" colspan="4">Scored</th>' : '<th>K</th><th>D</th><th>A</th><th class="l">Scored</th>'}<th>Pts</th></tr>${sw.series.map(oneSeries).join("")}</table>` : ""}
    <p class="bd__foot"><a class="link" href="#">Full stats ›</a></p>
  </section>`;

  // The side column: leagues with each rank's move, the week's series with results.
  const LEAGUES = [["Overall · Emerald I", "48,211", 1, "6,904"], ["United Kingdom", "1,402", 1, "233"], ["T1 supporters", "3,118", 1, "510"], ["Pub League", "2nd", 1, "1"], ["Flol Discord", "14th", -1, "2"]];
  // Overall's tier shield: one --text fill for every tier (plate.md, Colour).
  const SHIELD = '<svg class="shield" viewBox="0 0 12 14" width="12" height="14" aria-hidden="true"><path d="M6 0 12 2v6c0 3-2.5 5-6 6-3.5-1-6-3-6-6V2z" fill="currentColor"/></svg>';
  // Both tier gaps, under Overall's row: the points to promote and the points clear of demotion (spec/08, Overall tiers).
  const GAPS = '<tr class="lg__gaps"><td colspan="3"><span class="mid"><b class="fig">≈6</b> pts to Diamond IV</span><span class="mid"><b class="fig">≈5</b> pts clear of Emerald II</span></td></tr>';
  const leagues = `<section class="tpanel side-panel" aria-label="Leagues"><h2 class="tpanel__title">Leagues</h2>
    <table class="lg">${LEAGUES.map(([name, rank, dir, by]) => `<tr><td>${name.startsWith("Overall") ? SHIELD : ""}${name}</td><td class="num"><b class="fig">${rank}</b></td><td class="num fig ${dir > 0 ? "up" : "down"}">${dir > 0 ? "▲" : "▼"} ${by}</td></tr>${name.startsWith("Overall") ? GAPS : ""}`).join("")}</table>
    <p class="lg__foot"><a class="link" href="#">All leagues ›</a></p>
  </section>`;
  const SERIES = [["Wed", "T1", "HLE", "2–1"], ["Wed", "GEN", "KT", "2–0"], ["Thu", "DK", "NS", "2–0"], ["Thu", "BRO", "DNS", "1–2"], ["Fri", "KT", "BFX", "2–1"], ["Fri", "NS", "KRX", "0–2"], ["Sat", "T1", "DK", "1–0", "Live"], ["Sat", "GEN", "HLE", "10:30am"], ["Sun", "KRX", "BRO", "8:00am"], ["Sun", "BFX", "DNS", "10:30am"]];
  const bar = (code) => `<i class="team__bar" style="background:${BAR[code]}"></i>`;
  const series = `<section class="tpanel side-panel" aria-label="This week's series"><h2 class="tpanel__title">This week's series</h2>
    <table class="ws">${SERIES.map(([day, home, away, score, state], i) => `<tr><td class="small mid">${i === 0 || SERIES[i - 1][0] !== day ? day : ""}</td><td>${bar(home)}<b>${home}</b> <span class="ws__v">v</span> ${bar(away)}<b>${away}</b></td><td class="num">${state === "Live" ? live : state ? `<span class="tag tag--dash">${state}</span>` : ""} <span class="fig${/m$/.test(score) ? " mid" : ""}">${score}</span></td></tr>`).join("")}</table>
  </section>`;

  const nav = T.nav.map((n) => (n === "Live" ? `<a class="nav__live" href="#"><span class="dot"></span>Live</a>` : `<a href="#"${n === "Points" ? ' class="is-here"' : ""}>${n}</a>`)).join("");

  document.getElementById("app").innerHTML = `
  <header class="top"><b class="wordmark">Flol</b><nav class="nav">${nav}</nav><span class="top__gap"></span><span class="sponsor-top">presented by <span class="placeholder">Sponsor</span></span><span class="account">${T.account} ▾</span></header>
  <div class="page">
    <main class="main">
      <div class="head"><h1 class="title"><span class="title__en">${T.account}</span> <span class="title__ko" lang="ko">바론 스틸 FC</span></h1><span class="weeknav"><button class="key weeknav__key" type="button" aria-label="Week 2">‹</button><span class="head__week">Split 1 Week 3</span><button class="key weeknav__key" type="button" aria-label="Week 4" disabled>›</button></span><div class="views" role="tablist"><button class="is-here" type="button">Rift view</button><button type="button">Card view</button></div></div>
      <div class="object">
        <div class="rift-stage">${rift}</div>
        <div class="squad-foot">${total}${bench}</div>
      </div>
      ${breakdown}
    </main>
    <aside class="side">${leagues}${series}${yourWeek}<div class="placeholder sponsor-side">Sponsor</div><p class="small mid">All sponsors are made up.</p></aside>
  </div>
  <footer class="foot small mid">${RIOT}</footer>`;

  const riftEl = document.querySelector(".rift");
  if (riftEl) new ResizeObserver(() => document.documentElement.style.setProperty("--rift-w", `${riftEl.getBoundingClientRect().width}px`)).observe(riftEl);
})();
