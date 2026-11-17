import pathlib
d = pathlib.Path(__file__).parent
css = (d / "base.css").read_text(); nav = (d / "nav.part").read_text()

STYLE = '''
.page { padding: 24px 32px 48px; }
.ban { display: flex; align-items: center; gap: 22px; background: #111; border-bottom: 4px solid #b39550; color: #fff; padding: 16px 24px; }
.ban .hg { font-size: 30px; font-weight: 700; letter-spacing: -.5px; color: #d9bd7a; } .ban .en b { color: #fff; font-size: 18px; display: block; } .ban .en { color: #aaa; font-size: 13px; }
.ban .sp { flex: 1; } .ban .fol { border: 1.5px solid #fff; padding: 6px 14px; font-weight: 700; font-size: 13px; }
.tabs { display: flex; border-bottom: 1px solid var(--line); margin: 16px 0 0; font-size: 14px; } .tabs span { padding: 8px 16px; color: var(--mid); } .tabs span.on { color: var(--ink); font-weight: 700; border-bottom: 2px solid var(--ink); margin-bottom: -1px; }
.grid { display: grid; grid-template-columns: 1fr 360px; gap: 36px; margin-top: 18px; }
.gwn { display: flex; align-items: baseline; gap: 14px; margin-bottom: 12px; } .gwn h2 { font-size: 22px; } .gwn button { border: 1px solid var(--line); background: var(--paper); padding: 3px 10px; font: inherit; color: var(--mid); }
.gwn .pts { font: 600 22px "IBM Plex Mono", monospace; margin-left: 10px; } .gwn .av { color: var(--mid); font-size: 13px; } .gwn .av b { color: var(--ink); font-family: "IBM Plex Mono", monospace; }
table.t { width: 100%; border-collapse: collapse; background: var(--paper); font-size: 14px; }
table.t th { text-align: left; font-weight: 500; color: var(--mid); font-size: 12px; padding: 8px 10px; border-bottom: 1px solid var(--line); }
table.t td { padding: 8px 10px; border-bottom: 1px solid var(--fill); } table.t .n { text-align: right; font-family: "IBM Plex Mono", monospace; }
table.t td small { color: var(--mid); font-size: 12px; } table.t tr.sub td { background: var(--bg); color: var(--mid); font-size: 12px; padding: 6px 10px; } table.t tr.sub td b { color: var(--ink); }
table.t td.go { color: var(--mid); width: 20px; text-align: right; }
.mk { display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 10px; text-align: center; line-height: 16px; margin-left: 6px; vertical-align: 1px; } .mk.v { background: var(--paper); color: var(--ink); border: 1px solid var(--ink); line-height: 14px; }
.side h3 { font-size: 15px; margin: 22px 0 8px; display: flex; justify-content: space-between; } .side h3:first-child { margin-top: 0; } .side h3 span { font-weight: 400; color: var(--mid); font-size: 13px; }
.kv { background: var(--paper); } .kv div { display: flex; justify-content: space-between; padding: 8px 14px; border-bottom: 1px solid var(--fill); } .kv b { font-family: "IBM Plex Mono", monospace; }
.led { background: #111; color: #fff; font: 600 12px/1.3 "IBM Plex Mono", monospace; padding: 10px 12px; min-height: 44px; display: flex; align-items: center; background-image: radial-gradient(circle, rgba(255,255,255,.14) 1px, transparent 1.4px); background-size: 4px 4px; }
.trk { background: var(--paper); margin-bottom: 8px; } .trk .by { padding: 5px 12px; font-size: 12px; color: var(--mid); } .trk .by b { color: var(--ink); }
.left { color: var(--mid); font-size: 13px; margin-top: 14px; } .left b { color: var(--ink); font-weight: 500; }
.made { color: var(--soft); font-size: 11px; margin-top: 28px; }
.mv { font-size: 12px; }
'''

def page(title, body):
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title><style>{css}{STYLE}</style></head><body>{nav}<div class="page">{body}<div class="made">All sponsors are made up.</div></div></body></html>'

BAN = '''<div class="ban"><span class="hg">쵸비는 바로 거기 있었다</span><span class="en"><b>Chovy Was Right There</b>Minji Park</span><span class="sp"></span><span class="fol">Following ✓</span></div>'''

def tabs(on):
    return '<div class="tabs">' + "".join(f'<span class="{"on" if t == on else ""}">{t}</span>' for t in ["Points", "History", "Transfers"]) + '</div>'

def side(trucks=False):
    lg = [("Overall", "21,804", "up", "3,112"), ("South Korea", "2,310", "up", "402"), ("GEN supporters", "1,977", "up", "288"), ("Pub League", "3rd", "down", "1")]
    rows = "".join(f'<div><span>{n}</span><span><b>{r}</b> <span class="mv {c}">{m}</span></span></div>' for n, r, c, m in lg)
    t = ""
    if trucks:
        tl = [("Protest from", "Dan Okafor", "THE TEMPLATE WAS RIGHT THERE, MATE."), ("Coffee from", "Jae Kim", "THIS COFFEE IS KERIA-TIER SUPPORT.")]
        t = '<h3>Trucks · Week 3 <span>2</span></h3>' + "".join(f'<div class="trk"><div class="led">{l}</div><div class="by">{k} <b>{n}</b></div></div>' for k, n, l in tl)
    return f'<div class="side"><h3>Leagues</h3><div class="kv">{rows}</div>{t}</div>'

GEN = "GEN 2–1 HLE · Wed"; TK = "T1 2–0 KT · Thu"; DK = "KT 2–1 DK · Wed"
TEAM = [("Top", "Kiin", "GEN", GEN, "9", ""), ("Jungle", "Canyon", "GEN", GEN, "7", ""),
        ("Mid", "Chovy", "GEN", GEN, "18", "V"), ("Bot", "Ruler", "DK", DK, "15", "C"),
        ("Support", "Keria", "T1", TK, "5", ""), ("Flex · Top", "Kingen", "NS", "NS v DNS · Sat 10:30 · 19:30 KST", "–", ""),
        ("Coach", "kkOma", "T1", TK, "8", "")]
BENCH = [("Bench 1 · Mid", "Bdd", "KT", DK, "6"), ("Bench 2 · Jungle", "Cuzz", "KT", DK, "4")]
def trow(r):
    role, n, tm, s, p, m = r
    mk = f'<span class="mk {"v" if m == "V" else ""}">{m}</span>' if m else ""
    return f'<tr><td><small>{role}</small></td><td><b>{n}</b>{mk} <small>{tm}</small></td><td class="n">{p}</td><td><small>{s}</small></td></tr>'

POINTS = f'''{BAN}{tabs("Points")}<div class="grid"><div>
<div class="gwn"><button>‹</button><h2>Week 3</h2><button>›</button><span class="pts">62</span><span class="av">Average <b>52</b> · Highest <b>121</b></span><span class="tag prov">not final</span><span class="tag">Limitless</span></div>
<table class="t"><colgroup><col style="width:150px"><col style="width:230px"><col style="width:60px"><col></colgroup><tr><th>Slot</th><th>Player</th><th class="n">Pts</th><th>Series</th></tr>{"".join(trow(r) for r in TEAM)}
<tr class="sub"><td colspan="4">Bench</td></tr>{"".join(trow(r + ("",)) for r in BENCH)}</table>
</div>{side(True)}</div>'''
(d / "points.html").write_text(page("Minji Park · Points", POINTS))

HIST = [("3", "62", "219", "–", "21,804", "up", "3,112", "5", "0", "0.5", "100.9", "Limitless"),
        ("2", "98", "157", "4,211", "24,916", "up", "9,870", "1", "0", "1.0", "100.6", ""),
        ("1", "59", "59", "34,786", "34,786", "", "", "–", "–", "2.5", "100.0", "")]
hr = "".join(f'<tr><td>Week {w}</td><td class="n">{p}</td><td class="n">{tot}</td><td class="n">{gr}</td><td class="n">{orr}</td><td class="mv {c}">{m}</td><td class="n">{tr}</td><td class="n">{h}</td><td class="n">{bk}억</td><td class="n">{v}억</td><td>{b}</td><td class="go">›</td></tr>' for w, p, tot, gr, orr, c, m, tr, h, bk, v, b in HIST)
HISTORY = f'''{BAN}{tabs("History")}<div class="grid"><div>
<table class="t"><tr><th>Week</th><th class="n">Pts</th><th class="n">Total</th><th class="n">Week rank</th><th class="n">Overall</th><th>Move</th><th class="n">Transfers</th><th class="n">Hits</th><th class="n">Bank</th><th class="n">Value</th><th>Buff</th><th></th></tr>{hr}</table>
<div class="left">Buffs left: <b>Remake · Bench Boost · Dual Carry</b></div>
</div>{side()}</div>'''
(d / "history.html").write_text(page("Minji Park · History", HISTORY))

TR = [("3", "Tue 09:00 · 18:00 KST", "Limitless · 0 hits", [("Top", "Doran", "HLE", "6.5", "Kiin", "GEN", "8.0", "+9"), ("Bot", "Peyz", "T1", "13.0", "Ruler", "DK", "17.0", "+4"),
       ("Support", "Lehends", "NS", "7.5", "Keria", "T1", "12.0", "−1"), ("Flex", "Siwoo", "DK", "7.5", "Kingen", "NS", "6.5", "–"), ("Jungle", "Peanut", "NS", "8.0", "Canyon", "GEN", "15.5", "+2")]),
      ("2", "Mon 12:40 · 21:40 KST", "1 free", [("Bot", "Smash", "T1", "6.0", "Peyz", "T1", "13.0", "+6")])]
tr = ""
for w, when, cost, moves in TR:
    tr += f'<tr class="sub"><td colspan="4"><b>Week {w}</b> · {when}</td><td class="n" colspan="2">{cost}</td></tr>'
    tr += "".join(f'<tr><td><small>{r}</small></td><td>{o} <small>{ot} · {op}억</small></td><td>→</td><td><b>{i}</b> <small>{it} · {ip}억</small></td><td></td><td class="n">{so}</td></tr>' for r, o, ot, op, i, it, ip, so in moves)
TRANSFERS = f'''{BAN}{tabs("Transfers")}<div class="grid"><div>
<table class="t"><colgroup><col style="width:90px"><col style="width:240px"><col style="width:30px"><col style="width:260px"><col><col style="width:90px"></colgroup>
<tr><th>Slot</th><th>Out</th><th></th><th>In</th><th></th><th class="n">Pts gained</th></tr>{tr}</table>
</div>{side()}</div>'''
(d / "transfers.html").write_text(page("Minji Park · Transfers", TRANSFERS))
