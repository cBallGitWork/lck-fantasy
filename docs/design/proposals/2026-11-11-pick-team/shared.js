// Example content for the three Pick team looks. Players, teams and prices are examples
// only: 2027 rosters, prices, squad size and the bench are not decided.
const ROLES = [
  { key: "top", en: "Top", ko: "탑" },
  { key: "jng", en: "Jungle", ko: "정글" },
  { key: "mid", en: "Mid", ko: "미드" },
  { key: "bot", en: "Bot", ko: "원딜" },
  { key: "sup", en: "Support", ko: "서폿" },
  { key: "coach", en: "Coach", ko: "감독" },
];
const PRICE_UNIT = "억";
const BUDGET = 100;
const PLAYERS = [
  ["Chovy", "GEN", "mid", 15.0, 41], ["Faker", "T1", "mid", 14.5, 63], ["Ruler", "GEN", "bot", 14.5, 38],
  ["Viper", "HLE", "bot", 14.0, 29], ["Zeus", "HLE", "top", 13.5, 34], ["Canyon", "GEN", "jng", 13.5, 36],
  ["Kiin", "GEN", "top", 13.0, 22], ["Oner", "T1", "jng", 13.0, 31], ["Keria", "T1", "sup", 12.5, 47],
  ["Zeka", "HLE", "mid", 12.5, 12], ["ShowMaker", "DK", "mid", 11.5, 18], ["Doran", "T1", "top", 11.5, 15],
  ["Aiming", "DK", "bot", 11.5, 14], ["Bdd", "KT", "mid", 11.0, 9], ["Delight", "HLE", "sup", 11.0, 17],
  ["Duro", "GEN", "sup", 10.5, 13], ["Lucid", "DK", "jng", 10.0, 11], ["BeryL", "DK", "sup", 9.5, 8],
  ["Cuzz", "KT", "jng", 9.0, 6], ["Kingen", "NS", "top", 9.0, 7], ["Siwoo", "DK", "top", 8.0, 19],
  ["PerfecT", "KT", "top", 7.5, 4], ["kkOma", "T1", "coach", 6.0, 52], ["KIM", "GEN", "coach", 6.0, 33],
].map(([name, team, role, price, owned]) => ({ name, team, role, price, owned }));
const NEXT = { GEN: "KT · DK", T1: "HLE · NS", HLE: "T1 · BRO", DK: "KRX · GEN", KT: "GEN · BFX", NS: "DNS · T1" };
const SQUAD = [
  { slot: "top", name: "Zeus" }, { slot: "jng", name: "Canyon" }, { slot: "mid", name: "Faker", mark: "C" },
  { slot: "bot", name: "Ruler" }, { slot: "sup", name: "Keria", mark: "V" }, { slot: "flex", name: "ShowMaker" },
  { slot: "coach", name: "kkOma" }, { slot: "bench", name: "Siwoo" }, { slot: "bench", name: null },
];
const SLOT_LABEL = { flex: { en: "Flex", ko: "플렉스" }, bench: { en: "Bench", ko: "벤치" } };
ROLES.forEach((r) => (SLOT_LABEL[r.key] = r));

const byName = (n) => PLAYERS.find((p) => p.name === n);
const won = (n) => `${n.toFixed(1)}${PRICE_UNIT}`;
const spent = SQUAD.reduce((s, x) => s + (x.name ? byName(x.name).price : 0), 0);

function fill(sel, html) {
  document.querySelectorAll(sel).forEach((el) => (el.innerHTML = html));
}
function playerRows() {
  const picked = new Set(SQUAD.map((s) => s.name));
  return PLAYERS.map((p) => {
    const role = SLOT_LABEL[p.role];
    return `<tr class="${picked.has(p.name) ? "in" : ""}">
      <td class="r r-${p.role}"><span>${role.en}</span><i>${role.ko}</i></td>
      <td class="n"><b>${p.name}</b><span>${p.team}</span></td>
      <td class="f">${NEXT[p.team] || ""}</td>
      <td class="o">${p.owned}%</td>
      <td class="p">${won(p.price)}</td>
      <td class="a"><button>${picked.has(p.name) ? "In" : "Add"}</button></td></tr>`;
  }).join("");
}
function slots() {
  return SQUAD.map((s, i) => {
    const l = SLOT_LABEL[s.slot];
    const p = s.name && byName(s.name);
    const body = p
      ? `<b>${p.name}</b><span class="t">${p.team}</span><span class="nx">${NEXT[p.team]}</span><span class="pr">${won(p.price)}</span>`
      : `<b class="empty">Add a player</b>`;
    const mark = s.mark ? `<em class="mark">${s.mark}</em>` : "";
    return `<div class="slot s-${s.slot} i${i} ${p ? "r-" + p.role : "is-empty"}"><label>${l.en}<i>${l.ko}</i></label>${mark}${body}</div>`;
  }).join("");
}
fill("[data-rows]", playerRows());
fill("[data-slots]", slots());
fill("[data-spent]", won(spent));
fill("[data-bank]", won(BUDGET - spent));
fill("[data-budget]", won(BUDGET));
fill("[data-count]", `${SQUAD.filter((s) => s.name).length} / ${SQUAD.length}`);
