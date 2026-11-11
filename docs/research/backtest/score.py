"""LCK fantasy scoring backtest on Oracle's Elixir match data.

Run: python3 -I score.py <oe.csv> <out_dir>
Writes <out_dir>/backtest-series-points.csv and <out_dir>/backtest-tables.md
(tables the report is built from). Standard library only.
"""
import csv
import math
import statistics as st
import sys
from collections import defaultdict

LEAGUE = "LCK"
ROLES = ["top", "jng", "mid", "bot", "sup"]

# --- Toggles (all placeholders for Craig to tune) ---
KA_PER_POINT = 3            # A: 1 pt per 3 kills+assists, floor
GOLD15_BIG = 1500           # B tiered: >0 -> +1, >= this -> +2
FAST_WIN_MIN = 25           # D: win in under this many minutes -> +1
DEATHS_PER_MINUS = 4        # deaths toggle: -1 per N deaths (default off)
DEATHS_ON = False
FAST_THRESHOLDS = [22, 24, 25, 26, 28, 30]


def f(x):
    return float(x) if x not in ("", None) else None


def pearson(xs, ys):
    mx, my = st.mean(xs), st.mean(ys)
    sx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    sy = math.sqrt(sum((y - my) ** 2 for y in ys))
    if sx == 0 or sy == 0:
        return float("nan")
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (sx * sy)


def game_points(r, length_min):
    k, d, a = int(f(r["kills"])), int(f(r["deaths"])), int(f(r["assists"]))
    g15, c15 = f(r["golddiffat15"]), f(r["csdiffat15"])
    won = r["result"] == "1"
    comp = {
        "A": (k + a) // KA_PER_POINT,
        "B": 1 if (g15 or 0) > 0 else 0,
        "B2": (2 if (g15 or 0) >= GOLD15_BIG else 1 if (g15 or 0) > 0 else 0),
        "C": 1 if (c15 or 0) > 0 else 0,
        "D": 1 if (won and length_min < FAST_WIN_MIN) else 0,
        "X": -(d // DEATHS_PER_MINUS),
    }
    return comp, k, d, a


def main(src, out):
    games = defaultdict(list)  # gameid -> rows
    teamrows = {}
    leagues = defaultdict(int)
    for r in csv.DictReader(open(src, newline="", encoding="utf-8")):
        if "LCK" in r["league"]:
            leagues[(r["league"], r["split"], r["playoffs"])] += 1
        if r["league"] != LEAGUE:
            continue
        if r["position"] == "team":
            teamrows[(r["gameid"], r["teamname"])] = r
        else:
            games[r["gameid"]].append(r)

    # series = same day + same two teams
    series = defaultdict(set)
    meta = {}
    for gid, rows in games.items():
        teams = sorted({x["teamname"] for x in rows})
        day = rows[0]["date"][:10]
        sid = f"{day}|{teams[0]}|{teams[1]}"
        series[sid].add(gid)
        meta[gid] = (sid, float(rows[0]["gamelength"]) / 60, rows[0]["split"], rows[0]["playoffs"])

    # per game per player
    pg = []  # dicts
    for gid, rows in games.items():
        sid, lm, split, po = meta[gid]
        for r in rows:
            comp, k, d, a = game_points(r, lm)
            base = comp["A"] + comp["B"] + comp["C"] + comp["D"]
            pg.append(dict(gid=gid, sid=sid, len=lm, split=split, po=po, player=r["playername"],
                           team=r["teamname"], role=r["position"], won=r["result"] == "1",
                           k=k, d=d, a=a, pts=base, ptsB2=base - comp["B"] + comp["B2"],
                           ptsX=base + comp["X"], **comp))

    # per player per series
    ps = defaultdict(list)
    for g in pg:
        ps[(g["sid"], g["player"], g["team"])].append(g)
    srows = []
    for (sid, player, team), gs in ps.items():
        n = len(gs)
        tot_len = sum(x["len"] for x in gs)
        wins = sum(x["won"] for x in gs)
        opp = [t for t in sid.split("|")[1:] if t != team]
        rec = dict(series=sid, date=sid[:10], split=gs[0]["split"], playoffs=gs[0]["po"], team=team,
                   opponent=opp[0] if opp else "", player=player, role=gs[0]["role"], games=n,
                   game_wins=wins, series_len_min=round(tot_len, 1),
                   avg_game_min=round(tot_len / n, 1),
                   kills=sum(x["k"] for x in gs), deaths=sum(x["d"] for x in gs),
                   assists=sum(x["a"] for x in gs))
        for c in ["A", "B", "B2", "C", "D", "X"]:
            rec["sum_" + c] = sum(x[c] for x in gs)
        rec["best"] = max(x["pts"] for x in gs)
        rec["sum"] = sum(x["pts"] for x in gs)
        rec["mean"] = round(rec["sum"] / n, 3)
        rec["best_B2"] = max(x["ptsB2"] for x in gs)
        rec["sum_B2tier"] = sum(x["ptsB2"] for x in gs)
        rec["best_deaths"] = max(x["ptsX"] for x in gs)
        rec["sum_deaths"] = sum(x["ptsX"] for x in gs)
        srows.append(rec)
    srows.sort(key=lambda r: (r["date"], r["series"], r["team"], ROLES.index(r["role"])))
    with open(f"{out}/backtest-series-points.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(srows[0].keys()))
        w.writeheader()
        w.writerows(srows)

    L = []
    p = L.append
    p("## Data")
    p("| league | split | playoffs | rows |\n|---|---|---|---|")
    for k, v in sorted(leagues.items()):
        p(f"| {k[0]} | {k[1]} | {k[2]} | {v} |")
    nser = len(series)
    gper = defaultdict(int)
    for s in series.values():
        gper[len(s)] += 1
    p(f"\nLCK games: {len(games)}; series: {nser}; games per series: {dict(sorted(gper.items()))}; "
      f"player-game rows: {len(pg)}; player-series rows: {len(srows)}")

    # win lengths
    winlen = sorted(meta[g][1] for g in games)
    p("\n## Game lengths (min)")
    q = st.quantiles(winlen, n=10)
    p(f"min {winlen[0]:.1f}, p10 {q[0]:.1f}, p25 {st.quantiles(winlen, n=4)[0]:.1f}, median {st.median(winlen):.1f}, "
      f"p75 {st.quantiles(winlen, n=4)[2]:.1f}, p90 {q[8]:.1f}, max {winlen[-1]:.1f}")
    p("\n| game under | share of games |\n|---|---|")
    for t in FAST_THRESHOLDS:
        p(f"| {t} min | {sum(x < t for x in winlen) / len(winlen):.0%} |")

    # per-game distribution
    p("\n## Per-game points (base A+B+C+D) distribution")
    dist = defaultdict(int)
    for g in pg:
        dist[g["pts"]] += 1
    p("| pts | " + " | ".join(str(k) for k in sorted(dist)) + " |")
    p("|---|" + "---|" * len(dist))
    p("| share | " + " | ".join(f"{dist[k] / len(pg):.1%}" for k in sorted(dist)) + " |")

    # per-role per-variant
    p("\n## Per-role points per series: mean (sd) [p90]")
    variants = [("best", "Best game"), ("sum", "Series sum"), ("mean", "Series mean/game"),
                ("best_B2", "Best, B tiered"), ("sum_B2tier", "Sum, B tiered"),
                ("best_deaths", "Best, deaths on"), ("sum_deaths", "Sum, deaths on")]
    p("| variant | " + " | ".join(ROLES) + " | all |\n|---|" + "---|" * 6)
    for key, name in variants:
        cells = []
        for role in ROLES + [None]:
            xs = [r[key] for r in srows if role is None or r["role"] == role]
            cells.append(f"{st.mean(xs):.2f} ({st.pstdev(xs):.2f}) [{st.quantiles(xs, n=10)[8]:.1f}]")
        p(f"| {name} | " + " | ".join(cells) + " |")

    # component contribution (per game, sum)
    p("\n## Component share of base points (all games), and mean per game by role")
    tot = {c: sum(g[c] for g in pg) for c in ["A", "B", "C", "D"]}
    allp = sum(tot.values())
    p("| component | share | " + " | ".join(ROLES) + " |\n|---|---|" + "---|" * 5)
    names = {"A": "A K+A/3", "B": "B gold@15>0", "C": "C cs@15>0", "D": f"D win<{FAST_WIN_MIN}m",
             "B2": "B tiered (alt)", "X": f"deaths -1/{DEATHS_PER_MINUS} (alt)"}
    for c in ["A", "B", "C", "D", "B2", "X"]:
        share = f"{tot[c] / allp:.0%}" if c in tot else "—"
        cells = [f"{st.mean([g[c] for g in pg if g['role'] == r]):.2f}" for r in ROLES]
        p(f"| {names[c]} | {share} | " + " | ".join(cells) + " |")

    # length bias
    p("\n## Game-length bias (Pearson r)")
    lens = [g["len"] for g in pg]
    p("| measure | r |\n|---|---|")
    for c in ["A", "B", "C", "D", "X"]:
        p(f"| per game: {names[c]} vs game length | {pearson(lens, [g[c] for g in pg]):.2f} |")
    p(f"| per game: base points vs game length | {pearson(lens, [g['pts'] for g in pg]):.2f} |")
    p(f"| per game: raw K+A vs game length | {pearson(lens, [g['k'] + g['a'] for g in pg]):.2f} |")
    winners = [g for g in pg if g["won"]]
    losers = [g for g in pg if not g["won"]]
    p(f"| winners only: base points vs length | {pearson([g['len'] for g in winners], [g['pts'] for g in winners]):.2f} |")
    p(f"| losers only: base points vs length | {pearson([g['len'] for g in losers], [g['pts'] for g in losers]):.2f} |")
    for key in ["best", "sum", "mean"]:
        p(f"| per series: {key} vs games played | {pearson([r['games'] for r in srows], [r[key] for r in srows]):.2f} |")
        p(f"| per series: {key} vs total series minutes | {pearson([r['series_len_min'] for r in srows], [r[key] for r in srows]):.2f} |")

    p("\n### Mean points per series by games played and series result")
    p("| games | won series? | n | best | sum | mean |\n|---|---|---|---|---|---|")
    for n in sorted({r["games"] for r in srows}):
        for won in (True, False):
            xs = [r for r in srows if r["games"] == n and (r["game_wins"] > n / 2) == won]
            if xs:
                p(f"| {n} | {'yes' if won else 'no'} | {len(xs)} | {st.mean(r['best'] for r in xs):.2f} | "
                  f"{st.mean(r['sum'] for r in xs):.2f} | {st.mean(r['mean'] for r in xs):.2f} |")

    p("\n### Mean per-game points by game-length band, winners vs losers")
    p("| length | n games | winners | losers | K+A/3 (all) |\n|---|---|---|---|---|")
    bands = [(0, 25), (25, 30), (30, 35), (35, 40), (40, 99)]
    for lo, hi in bands:
        b = [g for g in pg if lo <= g["len"] < hi]
        if not b:
            continue
        w_ = [g["pts"] for g in b if g["won"]]
        l_ = [g["pts"] for g in b if not g["won"]]
        p(f"| {lo}-{hi if hi < 99 else '+'} | {len(b) // 10} | {st.mean(w_):.2f} | {st.mean(l_):.2f} | "
          f"{st.mean(g['A'] for g in b):.2f} |")

    # top 15 per season
    agg = defaultdict(lambda: defaultdict(float))
    for r in srows:
        a = agg[(r["player"], r["team"], r["role"])]
        a["series"] += 1
        a["games"] += r["games"]
        for k in ["best", "sum", "sum_A", "sum_B", "sum_C", "sum_D"]:
            a[k] += r[k]
    for key, name in [("best", "best game per series"), ("sum", "series sum")]:
        p(f"\n## Top 15 by season total ({name})")
        p("| # | player | team | role | series | games | best-game total | sum total | sum/game | A | B | C | D |\n"
          "|---|---|---|---|---|---|---|---|---|---|---|---|---|")
        top = sorted(agg.items(), key=lambda kv: -kv[1][key])[:15]
        for i, ((pl, tm, rl), a) in enumerate(top, 1):
            p(f"| {i} | {pl} | {tm} | {rl} | {int(a['series'])} | {int(a['games'])} | {int(a['best'])} | "
              f"{int(a['sum'])} | {a['sum'] / a['games']:.2f} | {int(a['sum_A'])} | {int(a['sum_B'])} | "
              f"{int(a['sum_C'])} | {int(a['sum_D'])} |")

    # season totals vs games played (players with >= 10 series)
    regs = [(a["games"], a["sum"], a["best"], a["series"]) for a in agg.values() if a["series"] >= 10]
    p(f"\nSeason totals, players with 10+ series (n={len(regs)}): r(sum total, games played) = "
      f"{pearson([x[0] for x in regs], [x[1] for x in regs]):.2f}; r(best total, series played) = "
      f"{pearson([x[3] for x in regs], [x[2] for x in regs]):.2f}")

    # role parity: share of top-50 by role
    top50 = sorted(agg.items(), key=lambda kv: -kv[1]["best"] / kv[1]["series"] if kv[1]["series"] >= 10 else 0)[:50]
    rc = defaultdict(int)
    for (pl, tm, rl), _ in top50:
        rc[rl] += 1
    p(f"\nTop 50 by best-game points per series (10+ series), by role: {dict(rc)}")

    # supports: cs@15 noise
    sup = [g for g in pg if g["role"] == "sup"]
    p(f"\nSupports: share of games with csdiffat15 > 0 = {st.mean(g['C'] for g in sup):.0%}; "
      f"blank golddiffat15/csdiffat15 rows in LCK: see console")
    open(f"{out}/backtest-tables.md", "w").write("\n".join(L) + "\n")
    print("\n".join(L))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
