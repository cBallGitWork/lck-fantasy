// Draws Pick Team from window.TRIAL (data.js) into #app. One markup for the three directions: each
// direction's page holds only its own tokens and styles, so they differ in look, never in facts.
(function () {
  const T = window.TRIAL;
  const ROLE = { top: "Top", jng: "Jungle", mid: "Mid", bot: "Bot", sup: "Support", coach: "Coach" };
  // A tile's centre on the Rift, of 720. The app's places (src/rift/slots.ts) moved to suit this map: Bot and
  // Support side by side where bot lane turns, level with the Coach, Top level with the Flex, Coach under Top and Support under Flex (Craig, 19 Nov 2026), the Jungle a little lower, in the middle of his jungle, the Coach beside the blue nexus and the Flex beside the red, each nexus left showing (Craig, 19 Nov 2026).
  const SLOT = { top: [132, 124], jng: [196, 340], mid: [372, 372], bot: [470, 600], sup: [592, 600], coach: [132, 600], flex: [592, 124] };
  // The same places on a phone, where a tile is a bigger share of the map: pulled in so none hangs off the Rift (Craig, 19 Nov 2026).
  const SLOT_PHONE = { top: [150, 150], jng: [196, 362], mid: [372, 366], bot: [396, 572], sup: [563, 572], coach: [150, 572], flex: [563, 150] };
  const W = 720;
  const RIOT = 'Flol was created under Riot Games\' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.';

  // Which picture: arena.html is Rift view with Faker tapped; ?v=cards is Card view; ?s=swap is mid-swap, the Flex
  // tapped, Bench Boost played and not yet saved (approved/pick-team/README.md).
  const Q = new URLSearchParams(location.search);
  const CARDS = Q.get("v") === "cards";
  const SWAP = Q.get("s") === "swap";
  if (SWAP) T.buffs[0].on = true;
  const changes = SWAP ? 1 : 0;
  const selected = SWAP ? "siwoo" : T.selected;
  const sel = T.players[selected];
  const slotOf = (id) => Object.keys(T.slots).find((k) => T.slots[k] === id);
  const isBench = (slot) => slot.startsWith("bench");
  // Two trade places when each fits the other's slot (spec/01): a role slot takes its role, the Flex and the bench
  // anyone but the coach. Faker tapped: only Bdd, the bench Mid. Siwoo, a Top in the Flex: Zeus and both of the bench.
  const fits = (id, slot) => (slot === "coach" ? T.players[id].role === "coach" : slot === "flex" || isBench(slot) ? T.players[id].role !== "coach" : T.players[id].role === slot);
  const options = new Set(Object.values(T.slots).filter((id) => id !== selected && !(isBench(slotOf(id)) && isBench(slotOf(selected))) && fits(id, slotOf(selected)) && fits(selected, slotOf(id))));

  // The repo's own kits and crests (data/lck/), the same files the built app draws.
  const KIT = "../../../../data/lck/";
  const shirt = (team) => `<img class="shirt" src="${KIT}shirts/${team}.svg" alt="">`;
  const crest = (team) => `<img class="crest" src="${KIT}crests/${team}.svg" alt="${team}">`;

  const tile = (id, slot) => {
    const p = T.players[id];
    // Every starter's tile says its place: the slot's role, FLEX, or Coach (Craig, 19 Nov 2026: "make their positions a little more obvious").
    const label = slot === "flex" ? `<span class="tile__label" title="Any role">Flex</span>` : p.role === "coach" ? `<span class="tile__label">Coach</span>` : ROLE[slot] ? `<span class="tile__label">${ROLE[slot]}</span>` : "";
    const state = id === selected ? " is-selected" : options.has(id) ? " is-option" : selected ? " is-dim" : "";
    return `<button class="tile${state}" type="button">
      <span class="tile__card">${label}${p.news ? `<span class="tile__flag" role="img" aria-label="${p.news.flag} ${p.news.note}" title="${p.news.flag} ${p.news.note}"><svg class="flag-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M8 1.5 15 14.5H1z" fill="#F2C230" stroke="#16181B" stroke-width="1" stroke-linejoin="round"/><rect x="7.25" y="5.5" width="1.5" height="5" fill="#16181B"/><rect x="7.25" y="11.5" width="1.5" height="1.5" fill="#16181B"/></svg></span>` : ""}${id === T.captain ? `<span class="tile__c" title="Scores ×1.5 this week">C</span>` : ""}${shirt(p.team)}</span>
      <span class="tile__plate"><span class="tile__team">${p.team}</span> ${p.name}</span>
      <span class="tile__band">v ${p.opponents.join(", ")}</span>
    </button>`;
  };

  // Card view: the seven as a broadcast lineup, one card each. The role strip and the C are the Rift tile's own; the portrait slot holds the team's crest until photos exist (spec/13).
  const lineupCard = (slot, label) => {
    const id = T.slots[slot];
    const p = T.players[id];
    const state = id === selected ? " is-selected" : options.has(id) ? " is-option" : selected ? " is-dim" : "";
    return `<button class="lcard${state}" type="button">
      <span class="lcard__role">${label || (slot === "flex" ? "Flex" : ROLE[slot])}</span>
      <span class="lcard__photo">${crest(p.team)}${id === T.captain ? `<span class="tile__c" title="Scores ×1.5 this week">C</span>` : ""}${p.news ? `<span class="tag" title="${p.news.note}">${p.news.flag}</span>` : ""}</span>
      <span class="lcard__name">${p.name}</span>
      <span class="lcard__team">${p.team}${slot === "flex" ? ` · ${ROLE[p.role]}` : ""}</span>
      <span class="lcard__row">v ${p.opponents.join(", ")}</span>
      <span class="lcard__row lcard__figs"><span>Form <b class="fig">${p.form.toFixed(1)}</b></span><b class="fig">₩${p.priceM}m</b></span>
    </button>`;
  };

  // The map is one drawing, shared by every picture (map.js).
  const map = window.RIFT_MAP("calm");

  const starters = ["top", "jng", "mid", "bot", "sup", "flex", "coach"];
  const rift = `<div class="rift">${map}${starters
    .map((slot) => `<div class="rift__spot" style="--x:${(SLOT[slot][0] / W) * 100}%;--y:${(SLOT[slot][1] / W) * 100}%;--px:${(SLOT_PHONE[slot][0] / W) * 100}%;--py:${(SLOT_PHONE[slot][1] / W) * 100}%">${tile(T.slots[slot], slot)}</div>`)
    .join("")}</div>`;
  const lineup = `<div class="lineup">${starters.map((slot) => lineupCard(slot)).join("")}</div>`;

  const bench = `<div class="bench"><span class="bench__title">Bench</span>${["bench1", "bench2"]
    .map((slot, i) => {
      const id = T.slots[slot];
      const order = `${i + 1}. ${ROLE[T.players[id].role]}`;
      // Card view's bench is the starters' own card, its strip the bench order (Craig, 25 Nov 2026).
      if (CARDS) return lineupCard(slot, order);
      return `<div class="bench__spot"><span class="bench__order">${order}</span>${tile(id, slot)}</div>`;
    })
    .join("")}</div>`;

  // One of each a split, one a week: played earlier, on this week, unavailable while another is on, or available.
  const onNow = T.buffs.some((x) => x.on);
  const buffState = (b) => (b.played ? `Played Week ${b.played}` : b.on ? "On this week" : onNow ? "Unavailable" : "Available");
  // An icon a buff, drawn here so every look has it; a look shows it or not (base.css hides it).
  const svg = (body) => `<svg class="buff__icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const BUFF_ICON = {
    "Bench Boost": svg('<path d="M3 16h18M4 13h16M5 16v4M19 16v4M12 10V3M8.5 6.5 12 3l3.5 3.5"/>'),
    "Double Captain": svg('<circle cx="15.5" cy="10" r="6.5" fill="currentColor" opacity=".55" stroke="none"/><circle cx="9.5" cy="14" r="7" fill="currentColor" style="stroke:var(--bg)" stroke-width="1.5"/><path d="M12 11.6a3.2 3.2 0 1 0 0 4.8" style="stroke:var(--bg)" stroke-width="2"/>'),
    "Coach Diff": svg('<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1"/><rect x="17" y="13" width="4" height="6" rx="1"/><path d="M19 19c0 2-3 2.5-6 2.5"/>'),
  };
  const buffs = `<section class="buffs" aria-label="Buffs">${T.buffs
    .map((b) => `<button class="buff" type="button" title="${b.does}">${BUFF_ICON[b.name] ?? ""}<b class="buff__name">${b.name}</b><span class="buff__left">${buffState(b)}</span></button>`)
    .join("")}</section>`;

  const d = T.deadline;
  const deadline = `<span class="deadline"><span class="deadline__word">Deadline</span> <b class="fig">${d.local}</b> <span class="deadline__count fig">${d.countdown}</span></span>`;
  const bar = `<div class="bar"><span class="bar__changes">${changes ? `<b>${changes} change${changes > 1 ? "s" : ""}</b>` : "No changes"}</span>${changes ? `<button class="bar__reset link" type="button">Reset</button>` : `<span class="bar__reset">Reset</span>`}<span class="bar__gap"></span>${deadline}<button class="save${changes ? "" : " key-off"}" type="button"${changes ? "" : " disabled"}>Save team</button></div>`;

  const ord = (n) => n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th");
  const card = `<section class="card" aria-label="${sel.name}">
    <div class="card__head">${crest(sel.team)}<div class="card__who"><h2 class="card__name">${sel.name}</h2><span class="card__meta">${sel.team} · ${ROLE[sel.role]} · <span class="fig">₩${sel.priceM}m</span> ${sel.priceMove ? `<span class="rise fig">▲₩${sel.priceMove}m</span>` : ""}</span></div><button class="card__close" type="button" aria-label="Close">✕</button></div>
    ${sel.news ? `<p class="card__news"><span class="tag">${sel.news.flag}</span> ${sel.news.note}</p>` : ""}
    <dl class="card__rows">
      <div class="card__ranks"><dt></dt><dd class="small mid">Among ${sel.formRank.of}</dd></div>
      <div><dt>Form</dt><dd><b class="fig">${sel.form}</b><span class="card__rank fig">${ord(sel.formRank.place)}</span></dd></div>
      <div><dt>Owned</dt><dd><b class="fig">${sel.ownedPct}%</b><span class="card__rank fig">${ord(sel.ownedRank.place)}</span></dd></div>
      <div><dt>Season</dt><dd><b class="fig">${sel.season}</b><span class="card__rank fig">${ord(sel.seasonRank.place)}</span></dd></div>
      <div><dt>Last 3 series</dt><dd class="fig card__last3">${sel.last3.map((n) => `<b>${n}</b>`).join("")}</dd></div>
    </dl>
    <div class="card__keys">${selected === T.captain ? `<button class="key is-on" type="button">✓ Captain</button>` : isBench(slotOf(selected)) || sel.role === "coach" ? "" : `<button class="key" type="button">Make Captain</button>`}<a class="link" href="#">Full card ›</a></div>
  </section>`;

  const series = `<section class="series" aria-label="This week's series"><h2 class="side__title">This week's series</h2><table>${T.series
    .map((s, i) => {
      const day = i === 0 || T.series[i - 1].day !== s.day ? s.day : "";
      return `<tr><td class="series__day">${day}</td><td class="series__teams"><b>${s.home}</b> v <b>${s.away}</b></td><td class="fig series__local">${s.local}</td></tr>`;
    })
    .join("")}</table></section>`;

  const nav = T.nav
    .map((n) => (n === "Live" ? `<a class="nav__live" href="#"><span class="dot"></span>Live</a>` : `<a href="#"${n === T.title ? ' class="is-here"' : ""}>${n}</a>`))
    .join("");

  document.getElementById("app").innerHTML = `
  <header class="top"><b class="wordmark">Flol</b><nav class="nav">${nav}</nav><span class="top__gap"></span><span class="sponsor-top">presented by <span class="placeholder">Sponsor</span></span><button class="top__menu" type="button">Menu ▾</button><span class="account">${T.account} ▾</span></header>
  <div class="page">
    <main class="main">
      <div class="head"><h1 class="title"><span class="title__en">${T.title}</span> <span class="title__ko" lang="ko">${T.hangul}</span></h1><span class="head__week">${T.week}</span><div class="views" role="tablist"><button${CARDS ? "" : ' class="is-here"'} type="button">Rift view</button><button${CARDS ? ' class="is-here"' : ""} type="button">Card view</button></div></div>
      ${buffs}
      <div class="object${CARDS ? " object--cards" : ""}">
        ${CARDS ? lineup : `<div class="rift-stage">${rift}</div>`}
        <div class="squad-foot">${bench}${bar}</div>
      </div>
    </main>
    <aside class="side">${card}${series}<div class="placeholder sponsor-side">Sponsor</div><p class="small mid">All sponsors are made up.</p></aside>
  </div>
  <footer class="foot small mid">${RIOT}</footer>`;

  // The bench's tiles take the Rift tiles' size, which follows the Rift's width (base.css).
  const riftEl = document.querySelector(".rift");
  if (riftEl) new ResizeObserver(() => document.documentElement.style.setProperty("--rift-w", `${riftEl.getBoundingClientRect().width}px`)).observe(riftEl);
})();
