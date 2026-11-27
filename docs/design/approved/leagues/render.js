// Draws Leagues in Pick Team's look (../pick-team/look.css) into #app: a made-up LCK 2027, Split 2, Week 14.
// Which picture, by ?v=: (none) a private league you made; overall, Overall in Split 2, Legend, after the deadline;
// before, the same before Week 15's deadline (no Captain column, no tier panel); admin, create, created, join, delete
// over your league; member and leave, a league you joined.
(function () {
  const V = new URLSearchParams(location.search).get("v") || "league";
  const RIOT = 'Flol was created under Riot Games\' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.';
  const BAR = { T1: "#E2012D", GEN: "#AA8A00", HLE: "#F3741B", DK: "#F5F5F5", KT: "#EC1B23" };
  const TEAM = { Faker: "T1", Doran: "T1", Oner: "T1", Peyz: "T1", Keria: "T1", Chovy: "GEN", Ruler: "GEN", Kiin: "GEN", Canyon: "GEN", Zeka: "HLE", Zeus: "HLE", Gumayusi: "HLE", ShowMaker: "DK", Aiming: "DK", Bdd: "KT" };
  // A player named in a row: his team's bar and code, then his name (plate.md, Parts).
  const who = (name) => `<i class="team__bar" style="background:${BAR[TEAM[name]]}"></i><span class="who__team">${TEAM[name]}</span> <b>${name}</b>`;
  const SHIELD = '<svg class="shield" viewBox="0 0 12 14" width="12" height="14" aria-hidden="true"><path d="M6 0 12 2v6c0 3-2.5 5-6 6-3.5-1-6-3-6-6V2z" fill="currentColor"/></svg>';
  const move = (m) => (m === 0 ? '<td class="mv nil">–</td>' : `<td class="mv ${m > 0 ? "up" : "down"}">${m > 0 ? "▲" : "▼"} ${Math.abs(m).toLocaleString("en")}</td>`);

  const overall = V === "overall" || V === "before", before = V === "before";
  const joined = V === "member" || V === "leave";
  const open = overall ? "Overall" : joined ? "Flol Discord" : "Pub League";
  const week = before ? "Week 15" : "Week 14";

  // [rank, move, team, manager, Captain, week, total, split 2, tier, chase]
  const ROWS = overall
    ? [["1", 0, "Unkillable FC", "Ha-eun Seo", "Faker", 112, "1,642", 402, "Challenger"], ["2", 3, "Bang Bang Bot", "Marco Ruiz", "Ruler", 121, "1,631", 415, "Challenger"], ["3", -1, "Faker's Fan Club", "Yuna Choi", "Faker", 88, "1,628", 377, "Challenger"], ["4", -1, "Showmaker's Shadow", "Ben Price", "ShowMaker", 94, "1,619", 390, "Challenger"], ["5", 2, "GenG Got Game", "Kenji Sato", "Chovy", 109, "1,611", 398, "Challenger"], ["6", 0, "Faker Ate My Homework", "Ollie Dunn", "Faker", 97, "1,604", 371, "Challenger"], ["7", -2, "Viper's Nest", "Mina Lee", "Zeka", 80, "1,598", 366, "Challenger"], null,
       ["48,209", 6880, "Rookie Mistake", "Jon Park", "Bdd", 97, "1,199", 301, "Emerald I"], ["48,210", 6901, "Smolder Shoulders", "Aisha Bello", "Aiming", 98, "1,198", 298, "Emerald I"], ["48,211", 6904, "Baron Steal FC", "Craig", "Faker", 98, "1,198", 298, "Emerald I"], ["48,212", -40, "Doran's Ring Bearer", "Tim Fox", "Doran", 52, "1,198", 298, "Emerald I"], ["48,213", 2114, "Kiin Bean", "Tom Reid", "Chovy", 61, "1,197", 260, "Emerald I"]]
    : joined
      ? [["1", 2, "Canyon Diff", "Hye-jin Lim", "Canyon", 104, "1,402"], ["2", -1, "Smash Mouth Kiin", "Leo Grant", "Kiin", 88, "1,377"], ["3", 0, "Ward Hoarders", "Ama Owusu", "Keria", 91, "1,360"], ["4", 1, "Lehends Never Die", "Rui Tan", "Faker", 79, "1,341"], ["5", -2, "T1 Til I Die", "Nadia Khan", "Faker", 70, "1,330"], null,
         ["12", 3, "Bdd Wolf", "Owen Shaw", "Bdd", 81, "1,214"], ["13", 0, "Siwoo Sweep", "Mei Lin", "Chovy", 64, "1,209"], ["14", -2, "Baron Steal FC", "Craig", "Faker", 98, "1,198", null, null, "11 pts to 13th"], ["15", 1, "Oner Way Ticket", "Sean Doyle", "Oner", 77, "1,190"], ["16", -1, "Clid Was Here", "Ines Silva", "Zeka", 52, "1,186"]]
      : [["1", 0, "Kiin Bean", "Tom Reid", "Chovy", 61, "1,214"], ["2", 1, "Baron Steal FC", "Craig", "Faker", 98, "1,198", null, null, "16 pts to 1st"], ["3", -1, "Chovy Was Right There", "Minji Park", "Chovy", 54, "1,187"], ["4", 2, "Peanut Butter Gank", "Dan Okafor", "Peyz", 77, "1,160"], ["5", 0, "Deft Tomorrow", "Jae Kim", "Ruler", 66, "1,151"], ["6", -2, "Guma Gang", "Sam Hill", "Gumayusi", 49, "1,139"], ["7", 1, "Zeus Juice", "Priya Shah", "Zeus", 70, "1,122"], ["8", -1, "Smeb Nostalgia", "Liam Byrne", "Kiin", 58, "1,108"], ["9", 0, "Ruler of None", "Ella Wong", "Aiming", 63, "1,097"], ["10", 1, "BeryL Backup Plan", "Joe Grant", "Keria", 72, "1,080"], ["11", -1, "Ambition FC", "Chris Lee", "Canyon", 41, "1,052"], ["12", 0, "Gank Plank", "Ruth Ade", "Faker", 55, "1,019"]];
  const cols = 7 + (overall ? 2 : 0) - (before ? 1 : 0);
  const row = (r) => r === null ? `<tr class="gap"><td colspan="${cols}">⋯</td></tr>`
    : `<tr${r[3] === "Craig" ? ' class="is-me"' : ""}><td class="rk">${r[0]}</td>${move(r[1])}${overall ? `<td class="tr">${SHIELD}${r[8]}</td>` : ""}<td>${r[2]}<small>${r[3]}</small>${r[9] ? `<span class="tag chase">${r[9]}</span>` : ""}</td>${before ? "" : `<td class="cy">${who(r[4])}</td>`}<td class="num fig">${before ? "–" : r[5]}</td>${overall ? `<td class="num fig">${r[7]}</td>` : ""}<td class="num fig">${r[6]}</td><td class="go"><a href="#">›</a></td></tr>`;
  const table = `<table class="st"><tr><th>Rank</th><th></th>${overall ? "<th>Tier</th>" : ""}<th>Team · Manager</th>${before ? "" : "<th>Captain</th>"}<th class="num">${week}</th>${overall ? '<th class="num">Split 2</th>' : ""}<th class="num">Total</th><th></th></tr>${ROWS.map(row).join("")}</table>`;

  const tabs = (here) => `<div class="tabs">${["Season", "Split 1", "Split 2"].map((t) => `<span${t === here ? ' class="is-here"' : ""}>${t}</span>`).join("")}</div>`;
  const league = overall
    ? `<section class="tpanel" aria-label="Overall"><h2 class="tpanel__title">Overall<span>LCK 2027 · Split 2</span></h2>
        <div class="bar2">${tabs("Split 2")}<div class="views"><button class="is-here" type="button">Legend</button><button type="button">Rise</button><button type="button">All</button></div></div>
        ${table}<div class="pager"><span class="is-here">1</span><span>2</span><span>3</span><span>⋯</span><span>1,063</span><span class="pager__find">Find me</span></div></section>`
    : `<section class="tpanel" aria-label="${open}"><h2 class="tpanel__title">${open}<span>Scoring from Week ${joined ? 3 : 1}</span></h2>
        <div class="bar2">${tabs("Season")}<span class="code">${joined ? "FLOL-22XB" : "PUB-7K2Q"}</span><button class="key" type="button">Copy link</button><button class="key" type="button">${joined ? "Leave" : "Admin ▾"}</button></div>
        ${table}</section>`;

  // Captains and buffs by tier (spec/08; Craig, 27 Nov 2026): the gameweek in the Week column, once its deadline has passed.
  const TIERS = [["Challenger", "Chovy", 61, "Double Captain", 9], ["Grandmaster", "Chovy", 54, "Double Captain", 7], ["Master", "Faker", 47, "Bench Boost", 6], ["Diamond", "Faker", 44, "Bench Boost", 5], ["Emerald", "Faker", 41, "Coach Diff", 4], ["Platinum", "Faker", 39, "Bench Boost", 4], ["Gold", "Faker", 43, "Bench Boost", 3], ["Silver", "Faker", 48, "Coach Diff", 3], ["Bronze", "Faker", 52, "Bench Boost", 2], ["Iron", "Faker", 58, null, null]];
  const tiers = overall && !before ? `<section class="tpanel" aria-label="Captains and buffs by tier"><h2 class="tpanel__title">Captains and buffs<span>Week 14</span></h2>
    <table class="tiers"><tr><th>Tier</th><th>Top Captain</th><th class="share"></th><th>Top buff</th><th class="share"></th><th></th></tr>
    ${TIERS.map(([t, c, cs, b, bs]) => `<tr${t === "Emerald" ? ' class="is-me"' : ""}><td>${SHIELD}${t}</td><td class="name">${who(c)}</td><td class="share">${cs}%</td><td class="name">${b ?? '<span class="mid">–</span>'}</td><td class="share">${bs === null ? "" : `${bs}%`}</td><td></td></tr>`).join("")}</table></section>` : "";

  const LIST = [["General"], ["Overall · Emerald I", "48,211", 6904, "of 212,480"], ["United Kingdom", "1,402", 233, "of 9,377"], ["T1 supporters", "3,118", 510, "of 41,902"], ["Private"], ["Pub League", "2nd", 1, "12 managers"], ["Flol Discord", "14th", -2, "86 managers"]];
  const list = `<section class="tpanel" aria-label="Your leagues"><h2 class="tpanel__title">Your leagues</h2><div class="lst">
    ${LIST.map(([name, rank, m, sub]) => rank === undefined ? `<div class="lst__sub">${name}</div>` : `<a class="lst__row${name.startsWith(open) ? " is-here" : ""}" href="#"><span>${name.startsWith("Overall") ? SHIELD : ""}${name}</span><b>${rank}</b><span class="m ${m > 0 ? "up" : "down"}">${m > 0 ? "▲" : "▼"} ${Math.abs(m).toLocaleString("en")}</span><small>${sub}</small></a>`).join("")}
    <div class="lst__acts"><button class="key key--gold" type="button">Create a league</button><button class="key" type="button">Join a league</button></div></div></section>`;

  const x = '<a class="sheet__x" href="#">✕</a>';
  const back = '<a class="sheet__back" href="#">Back</a>';
  const count = '<p class="sheet__count small mid">Private leagues: 2 of 25</p>';
  const SHEET = {
    create: `<h2>Create a league</h2><label>Name</label><div class="sheet__in">Office Rift<span class="mid small">11 / 30</span></div><label>Scoring starts</label><div class="sheet__in">Week 14 · Wed 10 Feb<span>▾</span></div><div class="sheet__row">${back}<button class="key key--gold" type="button">Create</button></div>${count}`,
    created: `<h2>Office Rift</h2><p class="mid">Scoring from Week 14</p><div class="sheet__done"><b>OFF-9R3D</b><button class="key" type="button">Copy code</button><button class="key" type="button">Copy link</button></div><div class="sheet__row"><button class="key key--gold" type="button">Open league</button></div>`,
    join: `<h2>Join a league</h2><label>Code or link</label><div class="sheet__in sheet__in--code">GANK-4TQ1</div><div class="sheet__row">${back}<button class="key key--gold" type="button">Join</button></div>${count}`,
    delete: `<h2>Delete Pub League?</h2><p>12 managers · scoring from Week 1</p><div class="sheet__row">${back}<button class="key" type="button">Delete league</button></div>`,
    leave: `<h2>Leave Flol Discord?</h2><p>14th of 86</p><div class="sheet__row">${back}<button class="key" type="button">Leave</button></div>`,
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
