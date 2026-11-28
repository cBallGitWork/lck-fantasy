// Draws Leagues in Pick Team's look (../pick-team/look.css) into #app: a made-up LCK 2027, Split 2, Week 14.
// Which picture, by ?v=: (none) a private league you made; overall, Overall in Split 2, Legend, after the deadline;
// before, the same before Week 15's deadline (no Captain or Week column, no tier panel); admin, create, created, join, delete
// over your league; member and leave, a league you joined. The states (plate.md, States): join-bad, a code no league
// has; remove, the Remove confirm; cap, 25 private leagues; none, no private league yet; soon, a league whose scoring
// hasn't started; loading and error, a table on its way or not come; unranked, before gameweek 1 is final.
(function () {
  const V = new URLSearchParams(location.search).get("v") || "league";
  const RIOT = 'Flol was created under Riot Games\' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.';
  const BAR = { T1: "#E2012D", GEN: "#AA8A00", HLE: "#F3741B", DK: "#F5F5F5", KT: "#EC1B23" };
  const TEAM = { Faker: "T1", Doran: "T1", Oner: "T1", Peyz: "T1", Keria: "T1", Chovy: "GEN", Ruler: "GEN", Kiin: "GEN", Canyon: "GEN", Zeka: "HLE", Zeus: "HLE", Gumayusi: "HLE", ShowMaker: "DK", Aiming: "DK", Bdd: "KT" };
  // A player named in a row: his team's bar and code, then his name (plate.md, Parts).
  const who = (name) => `<i class="team__bar" style="background:${BAR[TEAM[name]]}"></i><span class="who__team">${TEAM[name]}</span> <b>${name}</b>`;
  const KIT = "../../../../data/lck/";
  // A tier's crest in its colour (../tier-crests/crest.js; Craig, 28 Nov 2026, over 27 Nov's coloured shield).
  const TIER_INK = window.TIER_INK;
  const shield = (tier, size = 24) => window.tierCrest(tier.split(" ")[0], size).replace("<svg", '<svg class="shield"');
  // The mark before each of your leagues: its tier, its flag, its team's crest, a group on a private one.
  const ico = (body, cls) => `<svg class="lmark ${cls}" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
  const GROUP = '<circle cx="7" cy="7" r="3"/><path d="M1.5 17a5.5 5.5 0 0 1 11 0"/><circle cx="14.5" cy="8" r="2.4"/><path d="M14 12.2a4.6 4.6 0 0 1 4.8 4.8"/>';
  const MARK = {
    Overall: `<span class="lmark lmark--box">${shield("Emerald", 24)}</span>`,
    "United Kingdom": '<span class="lmark lmark--box"><svg viewBox="0 0 60 40" width="20" height="14" aria-hidden="true"><rect width="60" height="40" fill="#1F3A93"/><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="8"/><path d="M0 0 60 40M60 0 0 40" stroke="#E2012D" stroke-width="3"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#E2012D" stroke-width="7"/></svg></span>',
    "T1 supporters": `<img class="lmark" src="${KIT}crests/T1.svg" alt="">`,
    "Pub League": ico(GROUP, ""),
    "Flol Discord": ico(GROUP, ""),
  };
  const move = (m) => (m === 0 ? '<td class="mv nil">–</td>' : `<td class="mv ${m > 0 ? "up" : "down"}">${m > 0 ? "▲" : "▼"} ${Math.abs(m).toLocaleString("en")}</td>`);

  const overall = V === "overall" || V === "before" || V === "none" || V === "unranked", before = V === "before" || V === "none" || V === "unranked";
  const unranked = V === "unranked";
  const soon = V === "soon", loading = V === "loading", failed = V === "error";
  const joined = V === "member" || V === "leave";
  const open = overall ? "Overall" : joined ? "Flol Discord" : soon ? "Office Rift" : "Pub League";
  const week = before ? "Week 15" : "Week 14";

  // [rank, move, team, manager, Captain, week, total, split 2, tier, chase]
  const ROWS = overall
    ? [["1", 0, "Unkillable FC", "Ha-eun Seo", "Chovy", 112, "1,642", 402, "Challenger"], ["2", 3, "Bang Bang Bot", "Marco Ruiz", "Ruler", 121, "1,631", 415, "Challenger"], ["3", -1, "Faker's Fan Club", "Yuna Choi", "Faker", 88, "1,628", 377, "Challenger"], ["4", -1, "Showmaker's Shadow", "Ben Price", "ShowMaker", 94, "1,619", 390, "Challenger"], ["5", 2, "GenG Got Game", "Kenji Sato", "Chovy", 109, "1,611", 398, "Challenger"], ["6", 0, "Faker Ate My Homework", "Ollie Dunn", "Chovy", 97, "1,604", 371, "Challenger"], ["7", -3, "Viper's Nest", "Mina Lee", "Chovy", 80, "1,598", 366, "Challenger"], null,
       ["48,209", 6880, "Rookie Mistake", "Jon Park", "Bdd", 97, "1,199", 301, "Emerald I"], ["48,210", 6901, "Smolder Shoulders", "Aisha Bello", "Aiming", 98, "1,198", 298, "Emerald I"], ["48,211", 6904, "Baron Steal FC", "Craig", "Faker", 98, "1,198", 298, "Emerald I"], ["48,212", -40, "Doran's Ring Bearer", "Tim Fox", "Doran", 52, "1,198", 298, "Emerald I"], ["48,213", 2114, "Kiin Bean", "Tom Reid", "Chovy", 61, "1,197", 260, "Emerald I"]]
    : joined
      ? [["1", 1, "Canyon Diff", "Hye-jin Lim", "Canyon", 104, "1,402"], ["2", -1, "Smash Mouth Kiin", "Leo Grant", "Kiin", 88, "1,377"], ["3", 0, "Ward Hoarders", "Ama Owusu", "Keria", 91, "1,360"], ["4", 1, "Lehends Never Die", "Rui Tan", "Faker", 79, "1,341"], ["5", -1, "T1 Til I Die", "Nadia Khan", "Faker", 70, "1,330"], null,
         ["12", 3, "Bdd Wolf", "Owen Shaw", "Bdd", 81, "1,214"], ["13", 0, "Siwoo Sweep", "Mei Lin", "Chovy", 64, "1,209"], ["14", -2, "Baron Steal FC", "Craig", "Faker", 98, "1,198", null, null, "11 pts to 13th"], ["15", 1, "Oner Way Ticket", "Sean Doyle", "Oner", 77, "1,190"], ["16", -1, "Clid Was Here", "Ines Silva", "Zeka", 52, "1,186"]]
      : [["1", 0, "Kiin Bean", "Tom Reid", "Chovy", 61, "1,214"], ["2", 1, "Baron Steal FC", "Craig", "Faker", 98, "1,198", null, null, "16 pts to 1st"], ["3", -1, "Chovy Was Right There", "Minji Park", "Chovy", 54, "1,187"], ["4", 2, "Peanut Butter Gank", "Dan Okafor", "Peyz", 77, "1,160"], ["5", 0, "Deft Tomorrow", "Jae Kim", "Ruler", 66, "1,151"], ["6", -2, "Guma Gang", "Sam Hill", "Gumayusi", 49, "1,139"], ["7", 1, "Zeus Juice", "Priya Shah", "Zeus", 70, "1,122"], ["8", -1, "Smeb Nostalgia", "Liam Byrne", "Kiin", 58, "1,108"], ["9", 0, "Ruler of None", "Ella Wong", "Aiming", 63, "1,097"], ["10", 1, "BeryL Backup Plan", "Joe Grant", "Keria", 72, "1,080"], ["11", -1, "Ambition FC", "Chris Lee", "Canyon", 41, "1,052"], ["12", 0, "Gank Plank", "Ruth Ade", "Faker", 55, "1,019"]];
  const cols = 7 + (overall ? 2 : 0) - (before ? 2 : 0);
  const picking = V === "remove-pick", renaming = V === "rename";
  const row = (r) => r === null ? `<tr class="gap"><td colspan="${cols}">⋯</td></tr>`
    : `<tr${r[3] === "Craig" ? ' class="is-me"' : V === "remove" && r[2] === "Zeus Juice" ? ' class="is-picked"' : ""}><td class="rk">${+r[0] <= 3 ? `<span class="pod pod--${r[0]}">${r[0]}</span>` : r[0]}</td>${move(r[1])}${overall ? `<td class="tr">${shield(r[8])}${r[8]}</td>` : ""}<td>${r[2]}<small>${r[3]}</small>${r[9] ? `<span class="tag chase">${r[9]}</span>` : ""}</td>${before ? "" : `<td class="cy">${who(r[4])}</td>`}${before ? "" : `<td class="num fig">${r[5]}</td>`}${overall ? `<td class="num fig">${r[7]}</td>` : ""}<td class="num fig">${r[6]}</td><td class="go">${picking ? (r[3] === "Craig" ? "" : '<button class="key key--row" type="button">Remove</button>') : '<a href="#">›</a>'}</td></tr>`;
  const skel = (w) => `<i class="skel" style="width:${w}px"></i>`;
  const ALERT = '<path d="M10 2.5 18.5 17h-17z"/><path d="M10 8v4.5M10 14.8v.2"/>';
  const STATE = soon || unranked ? `<div class="state">${ico('<rect x="2.5" y="4" width="15" height="13"/><path d="M2.5 8h15M6.5 2v4M13.5 2v4"/>', "state__mark")}<h3>No table yet</h3><p>Week ${unranked ? "1 starts Wed 13 Jan" : "15 starts Wed 11 Aug"}</p></div>`
    : failed ? `<div class="state">${ico(ALERT, "state__mark state__mark--bad")}<h3>Table didn’t load</h3><p>Check your connection.</p><a href="#">Try again ›</a></div>`
    : loading ? `<table class="st"><tr><th>Rank</th><th></th><th>Team · Manager</th><th>Captain</th><th class="num">${week}</th><th class="num">Total</th><th></th></tr>${[150, 190, 120, 170, 140, 200, 130, 160, 180, 125, 155, 145].map((w) => `<tr><td class="rk">${skel(20)}</td><td class="mv">${skel(28)}</td><td>${skel(w)}</td><td class="cy">${skel(88)}</td><td class="num">${skel(24)}</td><td class="num">${skel(44)}</td><td class="go"></td></tr>`).join("")}</table>` : "";
  const table = STATE || `<table class="st"><tr><th>Rank</th><th></th>${overall ? "<th>Tier</th>" : ""}<th>Team · Manager</th>${before ? "" : "<th>Captain</th>"}${before ? "" : `<th class="num">${week}</th>`}${overall ? '<th class="num">Split 2</th>' : ""}<th class="num">Total</th><th></th></tr>${ROWS.map(row).join("")}</table>`;

  const tabs = (here) => `<div class="tabs">${["Season", "Split 1", "Split 2"].map((t) => `<span${t === here ? ' class="is-here"' : ""}>${t}</span>`).join("")}</div>`;
  const league = overall
    ? `<section class="tpanel" aria-label="Overall"><h2 class="tpanel__title">Overall<span>LCK 2027${unranked ? "" : " · Split 2"}</span></h2>
        <div class="bar2">${tabs(unranked ? "Season" : "Split 2")}<div class="views"${unranked ? " hidden" : ""}><button class="is-here" type="button">Legend</button><button type="button">Rise</button><button type="button">All</button></div></div>
        ${table}<div class="pager"${unranked ? " hidden" : ""}><span class="is-here">1</span><span>2</span><span>3</span><span>⋯</span><span>7,125</span><span class="pager__find">Find me</span></div></section>`
    : `<section class="tpanel" aria-label="${open}"><h2 class="tpanel__title">${renaming ? '<span class="rename">Pub Legends<i class="caret"></i><small>11 / 30</small></span><button class="key key--gold" type="button">Save</button><button class="key" type="button">Back</button>' : open}<span>Scoring from Week ${joined ? 3 : soon ? 15 : 1}</span></h2>
        <div class="bar2">${tabs("Season")}<span class="code">${joined ? "FLOL-22XB" : soon ? "OFF-9R3D" : "PUB-7K2Q"}</span><button class="key" type="button">Copy link</button><button class="key" type="button">${joined ? "Leave" : picking ? "Done" : "Admin ▾"}</button></div>
        ${table}${joined ? '<div class="pager"><span class="is-here">1</span><span>2</span><span class="pager__find">Find me</span></div>' : ""}</section>`;

  // Captains and buffs by tier (spec/08; Craig, 27 Nov 2026): the gameweek in the Week column, once its deadline has passed.
  // The buffs' icons, as Pick Team draws them (../pick-team/render.js, BUFF_ICON), at a row's size.
  const svg = (body) => `<svg class="bicon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const BUFF_ICON = {
    "Bench Boost": svg('<path d="M3 16h18M4 13h16M5 16v4M19 16v4M12 10V3M8.5 6.5 12 3l3.5 3.5"/>'),
    "Double Captain": svg('<circle cx="15.5" cy="10" r="6.5" fill="currentColor" opacity=".55" stroke="none"/><circle cx="9.5" cy="14" r="7" fill="currentColor" style="stroke:var(--paper)" stroke-width="1.5"/><path d="M12 11.6a3.2 3.2 0 1 0 0 4.8" style="stroke:var(--paper)" stroke-width="2"/>'),
    "Coach Diff": svg('<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1"/><rect x="17" y="13" width="4" height="6" rx="1"/><path d="M19 19c0 2-3 2.5-6 2.5"/>'),
  };
  // A Captain's share as a bar out of 100%, in its tier's colour (a buff's share is too small for one).
  const bar = (pct, ink) => `<span class="sbar"><i style="width:${pct}%;background:${ink}"></i></span>`;
  const TIERS = [["Challenger", "Chovy", 61, "Double Captain", 9], ["Grandmaster", "Chovy", 54, "Double Captain", 7], ["Master", "Faker", 47, "Bench Boost", 6], ["Diamond", "Faker", 44, "Bench Boost", 5], ["Emerald", "Faker", 41, "Coach Diff", 4], ["Platinum", "Faker", 39, "Bench Boost", 4], ["Gold", "Faker", 43, "Bench Boost", 3], ["Silver", "Faker", 48, "Coach Diff", 3], ["Bronze", "Faker", 52, "Bench Boost", 2], ["Iron", "Faker", 58, null, null]];
  const tiers = overall && !before ? `<section class="tpanel" aria-label="Captains and buffs by tier"><h2 class="tpanel__title">Captains and buffs<span>Week 14</span></h2>
    <table class="tiers"><tr><th>Tier</th><th>Top Captain</th><th class="share"><b>Share</b></th><th>Top buff</th><th class="share"><b>Share</b></th></tr>
    ${TIERS.map(([t, c, cs, b, bs]) => `<tr${t === "Emerald" ? ' class="is-me"' : ""}><td>${shield(t)}${t}</td><td class="name">${who(c)}</td><td class="share"><b>${cs}%</b>${bar(cs, TIER_INK[t])}</td><td class="name">${b ? BUFF_ICON[b] + b : '<span class="mid">–</span>'}</td><td class="share">${bs === null ? "" : `<b>${bs}%</b>`}</td></tr>`).join("")}</table></section>` : "";

  const capped = V === "cap", CAP = 25;
  const MORE = ["Sunday Scrims", "Uni Mates", "LCK Nerds", "Mid Diff", "Top Gap", "Jungle Diff", "Bot Lane Besties", "Baron Buddies", "Family League", "Work Chat", "Pick Ban", "Solo Queue Survivors", "Inting Together", "Ward Bros", "Faker Fans UK", "Night Shift", "The Group Chat", "Drake Stakes", "Elder Gods", "Nexus Blitz", "Old School", "School Run", "Office Rift"];
  const nth = (n) => n + (n % 100 > 10 && n % 100 < 14 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
  const PRIVATE = V === "none" ? [["", null]] : [["Pub League", "2nd", 1, "12 managers"], ["Flol Discord", "14th", -2, "86 managers"],
    ...(soon ? [["Office Rift", "–", 0, "1 manager"]] : []),
    ...(capped ? MORE.map((n, i) => [n, nth(2 + (i * 7) % 19), [1, 0, -2, 3, -1][i % 5], `${6 + (i * 11) % 40} managers`]) : [])];
  // Before gameweek 1 is final: the crest's ring and Unranked, no rank under it; no league has a rank yet.
  const NO_RANK = shield("Unranked", 24);
  const LIST = unranked ? [["General"], ["Overall · Unranked", "", 0, ""], ["United Kingdom", "–", 0, ""], ["T1 supporters", "–", 0, ""], ["Private"], ["Pub League", "–", 0, "9 managers"]] : [["General"], ["Overall · Emerald I", "48,211", 6904, "of 712,480"], ["United Kingdom", "1,402", 233, "of 9,377"], ["T1 supporters", "3,118", 510, "of 41,902"], ["Private"], ...PRIVATE];
  const list = `<section class="tpanel" aria-label="Your leagues"><h2 class="tpanel__title">Your leagues</h2><div class="lst">
    ${LIST.map(([name, rank, m, sub], i) => (capped && name === "Private" && rank === undefined ? '<div class="lst__sub">Private</div><div class="lst__scroll"><i class="lst__thumb"></i>' : "") + (capped && name === "Private" && rank === undefined ? "" :  rank === undefined ? `<div class="lst__sub">${name}</div>` : rank === null ? `<div class="lst__none">${ico(GROUP, "")}None yet</div>` : `<a class="lst__row${name.startsWith(open) ? " is-here" : ""}" href="#"><span>${unranked && name.startsWith("Overall") ? `<span class="lmark lmark--box">${NO_RANK}</span>` : MARK[name.split(" · ")[0]] || ico(GROUP, "")}${name}</span><b>${rank}</b>${rank === "" ? "" : m === 0 ? '<span class="m nil">–</span>' : `<span class="m ${m > 0 ? "up" : "down"}">${m > 0 ? "▲" : "▼"} ${Math.abs(m).toLocaleString("en")}</span>`}<small>${sub}</small></a>`)).join("")}${capped ? "</div>" : ""}
    ${capped ? `<div class="lst__acts"><button class="key key-off" type="button" disabled>Create a league</button><button class="key key-off" type="button" disabled>Join a league</button></div><p class="lst__cap small">Private leagues: ${CAP} of ${CAP}<span class="mid">${CAP} leagues already</span></p>`
      : '<div class="lst__acts"><button class="key key--gold" type="button">Create a league</button><button class="key" type="button">Join a league</button></div>'}</div></section>`;

  const x = '<a class="sheet__x" href="#">✕</a>';
  const back = '<button class="key" type="button">Back</button>';
  const count = '<p class="sheet__count small mid">Private leagues: 2 of 25</p>';
  const SHEET = {
    create: `<h2>Create a league</h2><label>Name</label><div class="sheet__in">Office Rift<span class="mid small">11 / 30</span></div><label>Scoring starts</label><div class="sheet__in">Week 14 · Wed 4 Aug<span>▾</span></div><div class="sheet__row">${back}<button class="key key--gold" type="button">Create</button></div>${count}`,
    created: `<h2>Office Rift</h2><p class="mid">Scoring from Week 14</p><div class="sheet__done"><b>OFF-9R3D</b><button class="key" type="button">Copy code</button><button class="key" type="button">Copy link</button></div><div class="sheet__row"><button class="key key--gold" type="button">Open league</button></div>`,
    join: `<h2>Join a league</h2><label>Code or link</label><div class="sheet__in sheet__in--code">GANK-4TQ1</div><div class="sheet__row">${back}<button class="key key--gold" type="button">Join</button></div>${count}`,
    "join-bad": `<h2>Join a league</h2><label>Code or link</label><div class="sheet__in sheet__in--code sheet__in--bad">GANK-4TQ9</div><p class="sheet__err small">${ico(ALERT, "sheet__mark")}No league with that code</p><div class="sheet__row">${back}<button class="key key--gold" type="button">Join</button></div>${count}`,
    remove: `<h2>Remove Zeus Juice?</h2><p>They can’t rejoin.</p><div class="sheet__row">${back}<button class="key key--end" type="button">Remove</button></div>`,
    delete: `<h2>Delete Pub League?</h2><p>12 managers · scoring from Week 1</p><div class="sheet__row">${back}<button class="key key--end" type="button">Delete league</button></div>`,
    leave: `<h2>Leave Flol Discord?</h2><p>14th of 86</p><div class="sheet__row">${back}<button class="key key--end" type="button">Leave</button></div>`,
  };
  const sheet = SHEET[V] ? `<div class="scrim"></div><div class="sheet">${x}${SHEET[V]}</div>` : "";
  const menu = V === "admin" ? '<div class="menu"><a href="#">Rename</a><a href="#">Remove a manager</a><a class="menu__last" href="#">Delete league…</a></div>' : "";

  const nav = ["Home", "Pick Team", "Transfers", "Points", "Leagues", "Stats", "LCK", "Live"].map((n) => (n === "Live" ? `<a class="nav__live" href="#"><span class="dot"></span>Live</a>` : `<a href="#"${n === "Leagues" ? ' class="is-here"' : ""}>${n}</a>`)).join("");
  document.getElementById("app").innerHTML = `
  <header class="top"><b class="wordmark">Flol</b><nav class="nav">${nav}</nav><span class="top__gap"></span><span class="sponsor-top">presented by <span class="placeholder">Sponsor</span></span><span class="account">Baron Steal FC ▾</span></header>
  <div class="page">
    <main class="main"><div class="head"><h1 class="title">Leagues <span class="title__ko">리그</span></h1></div>${league}${tiers}</main>
    <aside class="side">${list}<div class="placeholder">Sponsor</div><p class="small mid">All sponsors are made up.</p></aside>
  </div>
  <footer class="foot small mid">${RIOT}</footer>${menu}${sheet}`;
})();
