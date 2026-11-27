// Draws Home in Pick Team's look (../pick-team/look.css) into #app. Players and places are Pick Team's
// (../pick-team/data.js); the week's points and results are Points' (../points/render.js).
// Which picture: home.html is a series live (Split 1 Week 3, Saturday, T1 v DK in game 2); ?s=idle is nothing live
// (Tuesday evening before Week 4's deadline).
(function () {
  const T = window.TRIAL;
  const idle = new URLSearchParams(location.search).get("s") === "idle";
  // ?b=bb: Bench Boost played. Before the deadline it is a row in the Deadline panel, with its gold icon as Pick Team
  // draws it (../pick-team/render.js, BUFF_ICON), and the lineup shows all nine; in
  // the week it is on, a tag by the week's total (Craig, 27 Nov 2026).
  const boost = new URLSearchParams(location.search).get("b") === "bb";
  const ROLE = { top: "Top", jng: "Jungle", mid: "Mid", bot: "Bot", sup: "Support", coach: "Coach" };
  const RIOT = 'Flol was created under Riot Games\' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.';
  const KIT = "../../../../data/lck/";
  const BAR = { T1: "#E2012D", GEN: "#AA8A00", HLE: "#F3741B", DK: "#F5F5F5", KT: "#EC1B23", DNS: "#1F4FD8", NS: "#ED1C24", KRX: "#E4007F", BRO: "#F37021", BFX: "#FFC20E" };
  const bar = (code) => `<i class="team__bar" style="background:${BAR[code]}"></i>`;
  // A player named in a row reads as a tile's plate: his team's bar and code, then his name (Craig, 27 Nov 2026).
  const TEAM = { Chovy: "GEN", Kiin: "GEN", Zeka: "HLE", Oner: "T1", Faker: "T1", Siwoo: "DK", kkOma: "T1" };
  const who = (name) => `${bar(TEAM[name])}<span class="who__team">${TEAM[name]}</span> <b>${name}</b>`;
  const live = `<span class="live"><span class="dot"></span>Live</span>`;
  const yours = '<i class="yours" title="Yours"></i>';
  const FLAG = '<svg class="flag-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M8 1.5 15 14.5H1z" fill="#F2C230" stroke="#16181B" stroke-width="1" stroke-linejoin="round"/><rect x="7.25" y="5.5" width="1.5" height="5" fill="#16181B"/><rect x="7.25" y="11.5" width="1.5" height="1.5" fill="#16181B"/></svg>';

  const C = '<span class="tile__c mini-c">C</span>';
  // The object, a series live: the stream, muted, the Live page's picker beside it (spec/12, Home), and under
  // the picker your players in this series with their points so far.
  const STREAMS = [["LCK · English", "Twitch"], ["LCK · English", "YouTube"], ["LCK · 한국어", "YouTube"], ["Caedrel · English", "Twitch"], ["Kameto · Français", "Twitch"]];
  const stream = `<section class="stream" aria-label="Live">
    <div class="stream__title"><span class="tag tag--live">Live</span><b>T1 <span class="fig">1–0</span> DK</b><span>Game 2 · Bo3</span><a class="link" href="#">Live ›</a></div>
    <div class="stream__screen">LCK · English · Twitch<span class="stream__muted">Muted</span></div>
    <div class="picker"><span class="picker__head">Streams<button class="picker__more" type="button">More ▾</button></span>${STREAMS.map(([name, on], i) => `<button type="button"${i === 0 ? ' class="is-on"' : ""}>${name}<span>${on}</span></button>`).join("")}
      <span class="picker__sub"><span>Your players</span><span>Pts</span></span>${[["Faker", 5, true], ["Siwoo", 3], ["kkOma", 2]].map(([name, pts, c]) => `<span class="picker__who"><span><span>${who(name)}</span>${c ? C : ""}</span><b class="fig">${pts}</b></span>`).join("")}</div>
  </section>`;

  // The object, nothing live: the week's seven starters as a broadcast lineup, then the bench in its order as one row (Craig, 27 Nov 2026).
  // With Bench Boost on, the bench stands in the lineup as two more cards and the row goes.
  const lcard = (slot) => {
    const p = T.players[T.slots[slot]];
    return `<div class="lcard">
      <span class="lcard__role">${slot === "flex" ? "Flex" : slot.startsWith("bench") ? `${slot.slice(5)}. ${ROLE[p.role]}` : ROLE[slot]}</span>
      <span class="lcard__photo"><img class="crest" src="${KIT}crests/${p.team}.svg" alt="">${T.slots[slot] === T.captain ? '<span class="tile__c" title="Scores ×1.5 this week">C</span>' : ""}${p.news ? `<span class="tag">${p.news.flag}</span>` : ""}</span>
      <span class="lcard__name">${p.name}</span>
      <span class="lcard__team">${bar(p.team)}${p.team}${slot === "flex" ? ` · ${ROLE[p.role]}` : ""}</span>
      <span class="lcard__row">v ${p.opponents.join(", ")}</span>
    </div>`;
  };
  const benchRow = `<p class="lineup__next"><span class="mid">Bench</span>${["bench1", "bench2"].map((slot, i) => { const p = T.players[T.slots[slot]]; return `<span><span class="mid">${i + 1}. ${ROLE[p.role]}</span>&nbsp; ${bar(p.team)}${p.team} <b>${p.name}</b></span>`; }).join("")}</p>`;
  const lineup = `<section class="lineup-panel" aria-label="Week 4 lineup">
    <div class="stream__title"><b>Week 4 lineup</b>${boost ? '<span class="tag">Bench Boost</span>' : ""}</div>
    <div class="lineup${boost ? " lineup--9" : ""}">${["top", "jng", "mid", "bot", "sup", "flex", "coach"].concat(boost ? ["bench1", "bench2"] : []).map(lcard).join("")}</div>
    ${boost ? "" : benchRow}
  </section>`;

  // Under the object: the week's series (Points' panel), Following (spec/14), and the game's own facts.
  const SERIES = idle
    ? [["Wed", "HLE", "DK", "8:00am"], ["Wed", "T1", "KT", "10:30am"], ["Thu", "GEN", "BRO", "8:00am"], ["Thu", "DNS", "KRX", "10:30am"], ["Fri", "NS", "BRO", "8:00am"], ["Fri", "BFX", "DNS", "10:30am"], ["Sat", "HLE", "NS", "8:00am"], ["Sat", "DK", "KT", "10:30am"], ["Sun", "KRX", "BFX", "8:00am"], ["Sun", "T1", "GEN", "10:30am"]]
    : [["Wed", "T1", "HLE", "2–1"], ["Wed", "GEN", "KT", "2–0"], ["Thu", "DK", "NS", "2–0"], ["Thu", "BRO", "DNS", "1–2"], ["Fri", "KT", "BFX", "2–1"], ["Fri", "NS", "KRX", "0–2"], ["Sat", "T1", "DK", "1–0", "Live"], ["Sat", "GEN", "HLE", "10:30am"], ["Sun", "KRX", "BRO", "8:00am"], ["Sun", "BFX", "DNS", "10:30am"]];
  const series = `<section class="tpanel" aria-label="This week's series"><h2 class="tpanel__title">${idle ? "Week 4 series" : "Week 3 series"}</h2>
    <table class="ws">${SERIES.map(([day, home, away, score, state], i) => `<tr><td class="small mid">${i === 0 || SERIES[i - 1][0] !== day ? day : ""}</td><td>${bar(home)}<b>${home}</b> <span class="ws__v">v</span> ${bar(away)}<b>${away}</b></td><td class="num">${state === "Live" ? live : ""} <span class="fig${/m$/.test(score) ? " mid" : ""}">${score}</span></td></tr>`).join("")}</table>
  </section>`;

  const FOLLOWING = [["Minji", "GEN v KT", 20], ["Dan", "T1 v HLE", 34], ["Jae", "NS v KRX", 9]];
  const following = `<section class="tpanel" aria-label="Following"><h2 class="tpanel__title">Following</h2>
    <table class="fol"><tr class="sub"><td>Week 3${idle ? "" : ' <span class="tag tag--dash">Not final</span>'}</td><td class="num">Pts</td><td></td></tr>${FOLLOWING.map(([who, what, pts]) => `<tr><td><b>${who}</b> <span class="fol__what">· ${what}</span></td><td class="num"><b class="fig">${pts}</b></td><td class="num"><a class="link" href="#">Cheer / Jeer ›</a></td></tr>`).join("")}</table>
    <div class="dl__row" style="display:block;padding-top:0"><span class="led">Sell your bot laner</span><p class="led__by">Jeer from <b>Minji</b> · Week 3</p></div>
    <p class="tpanel__foot tpanel__foot--end"><a class="link" href="#">Following ›</a></p>
  </section>`;

  // All managers: the week's most captained, bought and sold. Each fact has its mark before its word (Craig, 27 Nov 2026:
  // the pages read dull): the Captain's own C, a green plus and a red minus as Transfers' Buy and Sell, a gold star, a red fall.
  const ico = (body, cls) => `<svg class="ico ico--${cls}" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const ICON = {
    "Most captained": '<span class="tile__c mini-c">C</span>',
    "Most bought": ico('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>', "add"),
    "Most sold": ico('<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>', "sell"),
    Star: ico('<path d="M12 3l2.700 5.600 6.100.8-4.500 4.300 1.100 6.100L12 16.900 6.600 19.800l1.100-6.100L3.200 9.400l6.100-.8z" fill="currentColor"/>', "star"),
    Flop: ico('<path d="M3 7l6 6 4-4 8 8M21 11v6h-6"/>', "flop"),
  };
  const label = (word) => `<span class="fact">${ICON[word]}${word}</span>`;
  const fact = (word, name, mine, fig) => `<tr><td>${label(word)}</td><td>${who(name)}${mine ? yours : ""}</td><td class="num fig" colspan="2">${fig}</td></tr>`;
  const pick = (word, name, mine, pts, owned) => `<tr><td>${label(word)}</td><td>${who(name)}${mine ? yours : ""}</td><td class="num pts"><b class="fig">${pts}</b></td><td class="num fig own">${owned}%</td></tr>`;
  const all = `<section class="tpanel" aria-label="All managers"><h2 class="tpanel__title">All managers</h2>
    <table class="all">${idle ? "" : `<tr class="sub"><td colspan="4">Week 3</td></tr>${fact("Most captained", "Chovy", false, "38%")}`}<tr class="sub"><td colspan="4">Week 4 so far</td></tr>
      ${idle ? fact("Most captained", "Faker", true, "34%") : ""}${fact("Most bought", "Kiin", false, idle ? "41,208" : "36,750")}${fact("Most sold", "Zeka", false, idle ? "31,412" : "28,930")}
    </table>
  </section>`;

  // The side column. The deadline first: the countdown, Pick Team (the page's one filled key) and Transfers, a starter who
  // may not play, then the next three deadlines.
  const deadline = `<section class="tpanel" aria-label="Deadline"><h2 class="tpanel__title">Week 4 deadline</h2>
    <p class="dl__count"><b class="fig">${(idle ? "9h 45m" : "3d 22h 45m").replace(/([dhm])/g, "<i>$1</i>")}</b><span class="mid">Wed 7:45am</span></p>
    <p class="dl__keys"><a class="key save" href="#">Pick Team</a><a class="key" href="#">Transfers</a></p>
    <p class="dl__row"><span class="mid">Free transfers</span><b class="fig">1</b></p>
    ${boost && idle ? '<p class="dl__row"><span class="mid">Buff</span><span class="dl__buff"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16h18M4 13h16M5 16v4M19 16v4M12 10V3M8.500 6.500 12 3l3.500 3.500"/></svg><b>Bench Boost</b></span></p>' : ""}
    <a class="dl__row" href="#" title="Pick Team">${FLAG}<span>${who("Siwoo")}</span><span class="mid">Top</span><span class="dl__warn"><span class="tag">Not starting</span><span class="mid">Wed</span><span>›</span></span></a>
    <dl class="figs"><div class="sub"><dt>Next</dt><dd></dd></div>${[["Week 5", "Wed 14 Apr 7:45am"], ["Week 6", "Wed 21 Apr 7:45am"], ["Week 7", "Wed 28 Apr 7:45am"]].map(([w, when]) => `<div><dt>${w}</dt><dd style="font-weight:400">${when}</dd></div>`).join("")}</dl>
  </section>`;

  // The week: your total between Average and Highest (with Bench Boost on, the bench's points are in it: 69 and Cuzz's 9), then the last gameweek's star and flop (spec/12, Home), the same pair
  // for every manager, each with its points and effective ownership.
  const starFlop = (week, rows) => `<table class="all"><tr class="sub"><td colspan="2">${week}</td><td class="num pts">Pts</td><td class="num own">Owned</td></tr>${rows}</table>`;
  const yourWeek = idle
    ? `<section class="tpanel" aria-label="Week 3"><h2 class="tpanel__title">Week 3<a class="link" href="#">Points ›</a></h2>
      <p class="week__big"><b class="fig">109</b><span class="tag">Final</span></p>
      <dl class="figs"><div><dt>Average</dt><dd class="fig">79</dd></div><div><dt>Highest</dt><dd><a class="link" href="#"><span class="fig">136</span> ›</a></dd></div></dl>
      ${starFlop("Week 3", pick("Star", "Kiin", false, 19, 9) + pick("Flop", "Oner", false, 3, 52))}
    </section>`
    : `<section class="tpanel" aria-label="Week 3"><h2 class="tpanel__title">Week 3<a class="link" href="#">Points ›</a></h2>
      <p class="week__big"><b class="fig">${boost ? 78 : 69}</b>${boost ? '<span class="tag">Bench Boost</span>' : ""}<span class="tag tag--dash">Not final</span></p>
      <dl class="figs"><div><dt>Average</dt><dd class="fig">58</dd></div><div><dt>Highest</dt><dd><a class="link" href="#"><span class="fig">104</span> ›</a></dd></div></dl>
      ${starFlop("Week 2", pick("Star", "Kiin", false, 15, 8) + pick("Flop", "Faker", true, 2, 62))}
    </section>`;

  // Leagues, Overall left out: the head shows it.
  const LEAGUES = [["United Kingdom", "1,402", 1, "233"], ["T1 supporters", "3,118", 1, "510"], ["Pub League", "2nd", 1, "1"], ["Flol Discord", "14th", -1, "2"]];
  const leagues = `<section class="tpanel" aria-label="Leagues"><h2 class="tpanel__title">Leagues<a class="link" href="#">All leagues ›</a></h2>
    <table class="lg">${LEAGUES.map(([name, rank, dir, by]) => `<tr><td>${name}</td><td class="num"><b class="fig">${rank}</b></td><td class="num fig ${dir > 0 ? "up" : "down"}">${dir > 0 ? "▲" : "▼"} ${by}</td></tr>`).join("")}</table>
  </section>`;

  const tier = `<div class="tier"><svg class="tier__shield" viewBox="0 0 28 32" aria-hidden="true"><path d="M14 1 27 5v12c0 7-5.5 11.500-13 14C6.500 28.500 1 24 1 17V5z" fill="currentColor"/></svg>
    <div><p class="tier__name">Emerald I<span lang="ko">에메랄드 1</span></p><p class="tier__rank"><b class="fig">48,211</b><span class="fig up">▲ 6,904</span></p></div>
    <span class="placeholder">Badge</span></div>`;

  const nav = T.nav.map((n) => (n === "Live" ? `<a class="nav__live" href="#"><span class="dot"></span>Live</a>` : `<a href="#"${n === "Home" ? ' class="is-here"' : ""}>${n}</a>`)).join("");

  document.getElementById("app").innerHTML = `
  <header class="top"><b class="wordmark">Flol</b><nav class="nav">${nav}</nav><span class="top__gap"></span><span class="sponsor-top">presented by <span class="placeholder">Sponsor</span></span><span class="account">${T.account} ▾</span></header>
  <div class="page">
    <main class="main">
      <div class="head"><h1 class="title"><span class="title__en">${T.account}</span> <span class="title__ko" lang="ko">바론 스틸 FC</span></h1>${tier}</div>
      ${idle ? lineup : stream}
      <div class="under">${series}${following}${all}</div>
    </main>
    <aside class="side">${deadline}${yourWeek}${leagues}<div class="placeholder sponsor-side">Sponsor</div><p class="small mid">All sponsors are made up.</p></aside>
  </div>
  <footer class="foot small mid">${RIOT}</footer>`;
})();
