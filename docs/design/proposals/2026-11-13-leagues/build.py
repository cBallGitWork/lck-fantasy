import pathlib
d = pathlib.Path(__file__).parent
css = (d / "base.css").read_text(); nav = (d / "nav.part").read_text()

STYLE = '''
.page { padding: 24px 32px 48px; }
h1 { font-size: 26px; letter-spacing: -.5px; }
.tabs { display: flex; gap: 0; border-bottom: 1px solid var(--line); margin: 14px 0 0; font-size: 14px; }
.tabs span { padding: 8px 16px; color: var(--mid); } .tabs span.on { color: var(--ink); font-weight: 700; border-bottom: 2px solid var(--ink); margin-bottom: -1px; } .tabs span.off { color: var(--soft); }
.seg { display: inline-flex; border: 1px solid var(--ink); font-size: 13px; } .seg span { padding: 5px 14px; } .seg span.on { background: var(--ink); color: #fff; font-weight: 700; }
table.st { width: 100%; border-collapse: collapse; background: var(--paper); font-size: 14px; }
table.st th { text-align: left; font-weight: 500; color: var(--mid); font-size: 12px; padding: 8px 10px; border-bottom: 1px solid var(--line); }
table.st th.n, table.st td.n { text-align: right; font-family: "IBM Plex Mono", monospace; }
table.st td { padding: 9px 10px; border-bottom: 1px solid var(--fill); } table.st td small { display: block; color: var(--mid); font-size: 12px; }
table.st td.rk { font-family: "IBM Plex Mono", monospace; font-weight: 600; width: 64px; } table.st td.mv { width: 70px; font-size: 12px; font-family: "IBM Plex Mono", monospace; }
table.st tr.me td { background: var(--fill); font-weight: 700; } table.st tr.me td small { font-weight: 400; }
table.st tr.gap td { text-align: center; color: var(--soft); padding: 4px; }
.btn { border: 1.5px solid var(--ink); padding: 8px 16px; font-weight: 700; background: var(--paper); font-size: 14px; display: inline-block; } .btn.dark { background: var(--ink); color: #fff; }
.idea { display: inline-block; background: #fffbe0; border: 1px solid #d8cf8a; color: #5a5420; font-size: 11px; padding: 2px 7px; font-weight: 400; }
.made { color: var(--soft); font-size: 11px; margin-top: 6px; }
table.st td.go { color: var(--mid); width: 24px; text-align: right; }
table.st td.cy { font-size: 13px; width: 150px; }
.pager { display: flex; gap: 6px; justify-content: flex-end; margin-top: 10px; font-size: 13px; } .pager span { border: 1px solid var(--line); padding: 3px 9px; background: var(--paper); } .pager span.on { border-color: var(--ink); font-weight: 700; }
'''

MINE = [("Overall", "48,211", "up", "6,904", "of 212,480"), ("United Kingdom", "1,402", "up", "233", "of 9,377"),
        ("T1 supporters", "3,118", "up", "510", "of 41,902")]
PRIV = [("Pub League", "2nd", "up", "1", "12 managers"), ("Flol Discord", "14th", "down", "2", "86 managers")]

PUB = [
 (1, "", "", "Kiin Bean", "Tom Reid", 61, "1,214"),
 (2, "up", "1", "Baron Steal FC", "Craig", 98, "1,198"),
 (3, "down", "1", "Chovy Was Right There", "Minji Park", 54, "1,187"),
 (4, "up", "2", "Peanut Butter Gank", "Dan Okafor", 77, "1,160"),
 (5, "", "", "Deft Tomorrow", "Jae Kim", 66, "1,151"),
 (6, "down", "2", "Guma Gang", "Sam Hill", 49, "1,139"),
 (7, "up", "1", "Zeus Juice", "Priya Shah", 70, "1,122"),
 (8, "down", "1", "Smeb Nostalgia", "Liam Byrne", 58, "1,108"),
 (9, "", "", "Ruler of None", "Ella Wong", 63, "1,097"),
 (10, "up", "1", "BeryL Backup Plan", "Joe Grant", 72, "1,080"),
 (11, "down", "1", "Ambition FC", "Chris Lee", 41, "1,052"),
 (12, "", "", "Gank Plank", "Ruth Ade", 55, "1,019"),
]

CARRY = {"Kiin Bean": "Chovy", "Baron Steal FC": "Faker", "Chovy Was Right There": "Chovy", "Peanut Butter Gank": "Peyz",
 "Deft Tomorrow": "Ruler", "Guma Gang": "Gumayusi", "Zeus Juice": "Zeus", "Smeb Nostalgia": "Kiin", "Ruler of None": "Aiming",
 "BeryL Backup Plan": "Keria", "Ambition FC": "Canyon", "Gank Plank": "Faker", "Unkillable FC": "Faker", "Bang Bang Bot": "Ruler",
 "Showmaker's Shadow": "ShowMaker", "GenG Got Game": "Chovy", "Viper's Nest": "Viper", "Rookie Mistake": "Bdd", "Smolder Shoulders": "Aiming",
 "Doran's Ring Bearer": "Doran"}
def mv(c, n):
    return f'<td class="mv {c}">{n}</td>' if c else '<td class="mv" style="color:var(--soft)">–</td>'

def rows(data, me="Baron Steal FC"):
    return "".join(f'<tr class="{"me" if t == me else ""}"><td class="rk">{r}</td>{mv(c, n)}<td>{t}<small>{m}</small></td><td class="cy">{CARRY.get(t, "Faker")}</td><td class="n">{g}</td><td class="n">{tot}</td><td class="go">›</td></tr>' for r, c, n, t, m, g, tot in data)

HEAD = '<tr><th>Rank</th><th></th><th>Team · Manager</th><th>Carry</th><th class="n">Week 14</th><th class="n">Total</th><th></th></tr>'

def page(title, body, extra=""):
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title><style>{css}{STYLE}{extra}</style></head><body>{nav}<div class="page">{body}<div class="made" style="margin-top:28px">All sponsors are made up.</div></div></body></html>'

# ---------- A: FPL structure. My leagues list on the left, the open league on the right.
A_CSS = '''
.grid { display: grid; grid-template-columns: 400px 1fr; gap: 32px; margin-top: 18px; }
.lst h2 { font-size: 13px; color: var(--mid); font-weight: 500; margin: 18px 0 6px; } .lst h2:first-child { margin-top: 0; }
.lst a.r { display: grid; grid-template-columns: 1fr auto 64px; gap: 8px; align-items: baseline; padding: 10px 12px; background: var(--paper); border-bottom: 1px solid var(--fill); font-size: 15px; }
.lst a.r b { font-family: "IBM Plex Mono", monospace; } .lst a.r small { grid-column: 1; color: var(--soft); font-size: 12px; margin-top: -6px; }
.lst a.r .m { font-family: "IBM Plex Mono", monospace; font-size: 12px; text-align: right; }
.lst a.r.on { border-left: 3px solid var(--ink); background: var(--paper); font-weight: 700; }
.lst .acts { display: flex; gap: 8px; margin-top: 16px; }
.hd { display: flex; align-items: center; gap: 14px; } .hd .sp { flex: 1; } .hd small { color: var(--mid); }
.code { font-family: "IBM Plex Mono", monospace; border: 1px dashed var(--ink); padding: 3px 8px; font-size: 13px; }
'''
def lst_row(n, rk, c, m, sub, on=False):
    return f'<a class="r {"on" if on else ""}"><span>{n}</span><b>{rk}</b><span class="m {c}">{m}</span><small>{sub}</small></a>'

A = f'''<h1>Leagues</h1>
<div class="grid"><div class="lst">
<h2>General</h2>{"".join(lst_row(*x) for x in MINE)}
<h2>Private</h2>{lst_row(*PRIV[0], on=True)}{lst_row(*PRIV[1])}
<div class="acts"><span class="btn dark">Create a league</span><span class="btn">Join a league</span></div>

</div>
<div><div class="hd"><h1>Pub League</h1><small>scoring from Week 1</small><span class="sp"></span><span class="code">PUB-7K2Q</span><span class="btn">Copy link</span><span class="btn">Admin ▾</span></div>
<div class="tabs"><span class="on">Season</span><span>Split 1</span><span>Split 2</span></div>
<table class="st">{HEAD}{rows(PUB)}</table></div></div>'''

# ---------- B: LCK standings board. My leagues as a strip, then the open league as a broadcast board.
B_CSS = '''
.strip { display: flex; gap: 0; background: var(--paper); border: 1px solid var(--line); }
.strip a { flex: 1; padding: 12px 16px; border-right: 1px solid var(--line); font-size: 13px; color: var(--mid); }
.strip a b { display: block; font-family: "IBM Plex Mono", monospace; color: var(--ink); font-size: 22px; margin-top: 2px; }
.strip a.on { background: var(--ink); color: #ccc; } .strip a.on b { color: #fff; } .strip a .mv { font-family: "IBM Plex Mono", monospace; font-size: 12px; margin-left: 6px; }
.strip a.on .mv { color: #fff; }
.strip .plus { flex: 0 0 150px; display: flex; flex-direction: column; justify-content: center; gap: 6px; padding: 10px 14px; border-right: 0; } .strip .plus span { font-weight: 700; color: var(--ink); }
.board { margin-top: 22px; display: grid; grid-template-columns: 1fr 380px; gap: 28px; }
.band { background: var(--ink); color: #fff; display: flex; align-items: center; gap: 16px; padding: 14px 18px; }
.band h2 { font-size: 24px; letter-spacing: -.3px; } .band .ko { color: #aaa; font-size: 15px; } .band .sp { flex: 1; }
.band .seg { border-color: #fff; } .band .seg span.on { background: #fff; color: var(--ink); }
table.st td.rk { font-size: 18px; }
.side h3 { font-size: 15px; margin-bottom: 8px; display: flex; justify-content: space-between; } .side h3 span { font-weight: 400; color: var(--mid); font-size: 13px; }
.grp { background: var(--paper); border-top: 2px solid var(--ink); padding: 14px 16px; margin-bottom: 20px; font-size: 14px; }
.grp .r { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--fill); } .grp .r b { font-family: "IBM Plex Mono", monospace; }
.chase { display: inline-block; border: 1px solid var(--ink); font-size: 11px; padding: 0 5px; margin-left: 8px; font-weight: 400; }
'''
LEG = [
 (1, "", "", "Unkillable FC", "Ha-eun Seo", 112, "1,642"), (2, "up", "3", "Bang Bang Bot", "Marco Ruiz", 121, "1,631"),
 (3, "down", "1", "Faker's Fan Club", "Yuna Choi", 88, "1,628"), (4, "down", "1", "Showmaker's Shadow", "Ben Price", 94, "1,619"),
 (5, "up", "2", "GenG Got Game", "Kenji Sato", 109, "1,611"), (6, "", "", "Faker Ate My Homework", "Ollie Dunn", 97, "1,604"),
 (7, "down", "2", "Viper's Nest", "Mina Lee", 80, "1,598"),
]
NEAR = [
 ("48,209", "up", "6,880", "Rookie Mistake", "Jon Park", 97, "1,199"), ("48,210", "up", "6,901", "Smolder Shoulders", "Aisha Bello", 98, "1,198"),
 ("48,211", "up", "6,904", "Baron Steal FC", "Craig", 98, "1,198"), ("48,212", "down", "40", "Doran's Ring Bearer", "Tim Fox", 52, "1,198"),
 ("48,213", "up", "2,114", "Kiin Bean", "Tom Reid", 61, "1,197"),
]
def strip():
    items = [("Overall", "48,211", "up", "6,904", True), ("United Kingdom", "1,402", "up", "233", False), ("T1 supporters", "3,118", "up", "510", False),
             ("Pub League", "2nd", "up", "1", False), ("Flol Discord", "14th", "down", "2", False)]
    s = "".join(f'<a class="{"on" if on else ""}">{n}<b>{r}<span class="mv {c}">{m}</span></b></a>' for n, r, c, m, on in items)
    return f'<div class="strip">{s}<div class="plus"><span>+ Create</span><span>→ Join</span></div></div>'

B = f'''{strip()}
<div class="board"><div>
<div class="band"><h2>Overall</h2><span class="ko">LCK 2027 · Split 2</span><span class="sp"></span><span class="seg"><span class="on">Legend</span><span>Rise</span><span>All</span></span></div>
<div class="tabs" style="background:var(--paper);margin:0"><span>Season</span><span>Split 1</span><span class="on">Split 2</span></div>
<table class="st">{HEAD}{rows(LEG)}<tr class="gap"><td colspan="7">⋯</td></tr>{rows(NEAR)}</table>
<div class="pager"><span class="on">1</span><span>2</span><span>3</span><span>⋯</span><span>1,061</span><span>Find me</span></div>
</div>
<aside class="side">
<div class="grp"><h3>Legend <span>106,240 managers</span></h3>
<div class="r">You<b>48,211</b></div></div>
<div class="grp"><h3>Rise <span>106,240 managers</span></h3>
<div class="r">You<b>–</b></div></div>
<div class="ph" style="height:180px">sponsor badge · Overall</div><div class="made">All sponsors are made up.</div>
</aside></div>'''

# ---------- C: fun ideas on A.
C = A.replace('<table class="st">', '<div style="margin:10px 0 6px"><span class="idea">Fun idea 1 · chase line: points to the team above</span></div><table class="st">', 1)
C = C.replace('<td>Baron Steal FC<small>Craig</small></td>', '<td>Baron Steal FC <span class="chase">16 pts to 1st</span><small>Craig</small></td>')
story = '''<div style="margin-top:18px;background:var(--paper);border-top:2px solid var(--ink);padding:14px 16px">
<div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700">Pub League's season <span class="idea">Fun idea 2 · the league's season, week by week</span></div>
<svg viewBox="0 0 800 120" style="width:100%;height:120px;margin-top:8px"><g stroke="#cfcfcf"><line x1="0" y1="10" x2="800" y2="10"/><line x1="0" y1="60" x2="800" y2="60"/><line x1="0" y1="110" x2="800" y2="110"/></g>
<polyline fill="none" stroke="#1d1d1d" stroke-width="3" points="0,100 60,90 120,70 180,80 240,60 300,40 360,50 420,30 480,35 540,25 600,30 660,20 720,18 780,18"/>
<polyline fill="none" stroke="#9a9a9a" stroke-width="2" points="0,20 60,15 120,12 180,10 240,12 300,10 360,15 420,10 480,12 540,10 600,10 660,12 720,10 780,10"/>
<g font-size="11" fill="#6b6b6b" font-family="IBM Plex Sans KR"><text x="0" y="8">1st</text><text x="0" y="118">12th</text><text x="700" y="34">You</text><text x="700" y="24" fill="#9a9a9a">Kiin Bean</text></g></svg></div>'''
C = C.replace('<table class="st">' + HEAD + rows(PUB).replace('<td>Baron Steal FC<small>Craig</small></td>', '') , '<table class="st">' + HEAD + rows(PUB).replace('<td>Baron Steal FC<small>Craig</small></td>', ''))
C = C.replace('</table></div></div>', '</table>' + story + '</div></div>', 1)

CH = ".chase { display:inline-block; border:1px solid var(--ink); font-size:11px; padding:0 5px; margin-left:8px; font-weight:400; }"
A = A.replace('<td>Baron Steal FC<small>Craig</small></td>', '<td>Baron Steal FC <span class="chase">16 pts to 1st</span><small>Craig</small></td>')
(d / "a.html").write_text(page("Leagues · A · List and table", A, A_CSS + CH))
(d / "b.html").write_text(page("Leagues · B · Standings board", B, B_CSS))
(d / "c.html").write_text(page("Leagues · C · Fun ideas", C, A_CSS + ".chase { display:inline-block; border:1px solid var(--ink); font-size:11px; padding:0 5px; margin-left:8px; font-weight:400; }"))

# ---------- A2: A's frame with B's Overall view (Craig: "a and some of the elements of B").
OV_ROW = lst_row(*MINE[0], on=True)
A2 = A.replace(lst_row(*MINE[0]), OV_ROW).replace(lst_row(*PRIV[0], on=True), lst_row(*PRIV[0]))
a2_right = f'''<div><div class="hd"><h1>Overall</h1><small>LCK 2027 · Split 2</small><span class="sp"></span><span class="seg"><span class="on">Legend</span><span>Rise</span><span>All</span></span></div>
<div class="tabs"><span>Season</span><span>Split 1</span><span class="on">Split 2</span><span style="flex:1;border:0"></span><span style="border:0"><span class="ph" style="width:130px;height:22px;font-size:10px">sponsor badge</span></span></div>
<table class="st">{HEAD}{rows(LEG)}<tr class="gap"><td colspan="7">⋯</td></tr>{rows(NEAR)}</table>
<div class="pager"><span class="on">1</span><span>2</span><span>3</span><span>⋯</span><span>1,063</span><span>Find me</span></div></div>'''
start = A2.index('<div><div class="hd"><h1>Pub League</h1>')
A2 = A2[:start] + a2_right + '</div>'
A2 = A2.replace('<td>Baron Steal FC <span class="chase">16 pts to 1st</span><small>Craig</small></td>', '<td>Baron Steal FC <span class="chase">1 to climb</span><small>Craig</small></td>')
(d / "a2.html").write_text(page("Leagues · A2 · Overall in Split 2", A2, A_CSS + CH))

# ---------- A3–A5 (14 Nov): the Admin menu, Create and Join, on A's Pub League.
SHEET_CSS = '''
.menu { position: absolute; right: 32px; top: 176px; width: 220px; background: var(--paper); border: 1.5px solid var(--ink); z-index: 4; font-size: 14px; }
.menu a { display: block; padding: 10px 14px; border-bottom: 1px solid var(--fill); } .menu a:last-child { border-bottom: 0; }
.menu a.bad { border-top: 1.5px solid var(--ink); } .menu small { display: block; color: var(--mid); font-size: 12px; padding: 8px 14px; border-top: 1px solid var(--line); }
.dim { position: absolute; left: 0; top: 0; width: 1440px; height: 1000px; background: rgba(29,29,29,.45); z-index: 6; }
.sheet { position: absolute; left: 470px; top: 150px; width: 500px; background: var(--paper); border-top: 4px solid var(--ink); z-index: 7; padding: 24px 28px 28px; }
.sheet h2 { font-size: 22px; letter-spacing: -.3px; margin-bottom: 18px; display: flex; justify-content: space-between; } .sheet h2 span { font-weight: 400; color: var(--mid); font-size: 18px; }
.sheet label { display: block; font-size: 13px; color: var(--mid); margin: 14px 0 6px; }
.sheet .in { border: 1.5px solid var(--ink); padding: 10px 12px; font-size: 15px; display: flex; justify-content: space-between; }
.sheet .in.mono { font-family: "IBM Plex Mono", monospace; letter-spacing: 1px; } .sheet .in .soft { color: var(--soft); }
.sheet a.back { align-self: center; text-decoration: underline; text-underline-offset: 3px; margin-right: 8px; }
.sheet .row { display: flex; gap: 10px; margin-top: 22px; justify-content: flex-end; }
.sheet .or { text-align: center; color: var(--soft); font-size: 12px; margin: 14px 0 0; }
.sheet .done { border: 1px dashed var(--ink); padding: 14px; margin-top: 18px; display: flex; align-items: center; gap: 12px; }
.sheet .done b { font-family: "IBM Plex Mono", monospace; font-size: 22px; letter-spacing: 1px; flex: 1; }
.sheet .count { color: var(--mid); font-size: 12px; margin-top: 16px; }
body { position: relative; }
'''
A_BASE = page("x", A, "")  # unused; A is the body
MENU = '''<div class="menu"><a>Rename</a><a>Remove a manager</a><a class="bad">Delete league…</a></div>'''
(d / "a3.html").write_text(page("Leagues · A3 · Admin menu", A + MENU, A_CSS + CH + SHEET_CSS))

CREATE = '''<div class="dim"></div><div class="sheet"><h2>Create a league</h2>
<label>Name</label><div class="in">Office Rift<span class="soft">11 / 30</span></div>
<label>Scoring starts</label><div class="in">Week 14 · Wed 10 Feb<span>▾</span></div>
<div class="row"><a class="back">Back</a><span class="btn dark">Create</span></div>
<div class="count">Private leagues: 2 of 25</div></div>'''
(d / "a4.html").write_text(page("Leagues · A4 · Create", A + CREATE, A_CSS + CH + SHEET_CSS))

CREATED = '''<div class="dim"></div><div class="sheet"><h2>Office Rift</h2>
<div style="color:var(--mid);font-size:13px">Scoring from Week 14</div>
<div class="done"><b>OFF-9R3D</b><span class="btn">Copy code</span><span class="btn">Copy link</span></div>
<div class="row"><span class="btn dark">Open league</span></div></div>'''
(d / "a4b.html").write_text(page("Leagues · A4b · Created", A + CREATED, A_CSS + CH + SHEET_CSS))

JOIN = '''<div class="dim"></div><div class="sheet"><h2>Join a league</h2>
<label>Code or link</label><div class="in mono">GANK-4TQ1<span></span></div>
<div class="row"><a class="back">Back</a><span class="btn dark">Join</span></div>
<div class="count">Private leagues: 2 of 25</div></div>'''
(d / "a5.html").write_text(page("Leagues · A5 · Join", A + JOIN, A_CSS + CH + SHEET_CSS))

# A member's view of a league they didn't make: Leave, no Admin.
MEMBER = A.replace('<h1>Pub League</h1><small>scoring from Week 1</small>', '<h1>Flol Discord</h1><small>scoring from Week 3</small>').replace('<span class="code">PUB-7K2Q</span>', '<span class="code">FLOL-22XB</span>').replace('<span class="btn">Admin ▾</span>', '<span class="btn">Leave</span>')
MEMBER = MEMBER.replace(lst_row(*PRIV[0], on=True), lst_row(*PRIV[0])).replace(lst_row(*PRIV[1]), lst_row(*PRIV[1], on=True))
(d / "a6.html").write_text(page("Leagues · A6 · A member's league", MEMBER, A_CSS + CH))

# A6 fix: Flol Discord's own rows, Craig 14th of 86.
DISC_TOP = [(1, "up", "2", "Canyon Diff", "Hye-jin Lim", 104, "1,402"), (2, "down", "1", "Smash Mouth Kiin", "Leo Grant", 88, "1,377"),
 (3, "", "", "Ward Hoarders", "Ama Owusu", 91, "1,360"), (4, "up", "1", "Lehends Never Die", "Rui Tan", 79, "1,341"),
 (5, "down", "2", "T1 Til I Die", "Nadia Khan", 70, "1,330")]
DISC_NEAR = [(12, "up", "3", "Bdd Wolf", "Owen Shaw", 81, "1,214"), (13, "", "", "Siwoo Sweep", "Mei Lin", 64, "1,209"),
 (14, "down", "2", "Baron Steal FC", "Craig", 98, "1,198"), (15, "up", "1", "Oner Way Ticket", "Sean Doyle", 77, "1,190"),
 (16, "down", "1", "Clid Was Here", "Ines Silva", 52, "1,186")]
CARRY.update({"Canyon Diff": "Canyon", "Smash Mouth Kiin": "Kiin", "Ward Hoarders": "Keria", "Lehends Never Die": "Faker", "T1 Til I Die": "Faker",
 "Bdd Wolf": "Bdd", "Siwoo Sweep": "Chovy", "Oner Way Ticket": "Oner", "Clid Was Here": "Viper"})
disc_tbl = f'<table class="st">{HEAD}{rows(DISC_TOP)}<tr class="gap"><td colspan="7">⋯</td></tr>{rows(DISC_NEAR)}</table><div class="pager"><span class="on">1</span><span>2</span><span>Find me</span></div>'
s0 = MEMBER.index('<table class="st">'); s1 = MEMBER.index('</table>', s0) + len('</table>')
MEMBER2 = MEMBER[:s0] + disc_tbl + MEMBER[s1:]
MEMBER2 = MEMBER2.replace('<td>Baron Steal FC<small>Craig</small></td>', '<td>Baron Steal FC <span class="chase">11 pts to 13th</span><small>Craig</small></td>')
(d / "a6.html").write_text(page("Leagues · A6 · A member's league", MEMBER2, A_CSS + CH))

# Confirms (14 Nov): Delete for the maker, Leave for a member, in the Transfers confirm's style.
DEL = '''<div class="dim"></div><div class="sheet"><h2>Delete Pub League?</h2>
<div style="font-size:15px">12 managers · scoring from Week 1</div>
<div class="row"><a class="back">Back</a><span class="btn dark">Delete league</span></div></div>'''
(d / "a7.html").write_text(page("Leagues · A7 · Delete", A + DEL, A_CSS + CH + SHEET_CSS))
LEAVE = '''<div class="dim"></div><div class="sheet"><h2>Leave Flol Discord?</h2>
<div style="font-size:15px">14th of 86</div>
<div class="row"><a class="back">Back</a><span class="btn dark">Leave</span></div></div>'''
(d / "a8.html").write_text(page("Leagues · A8 · Leave", MEMBER2 + LEAVE, A_CSS + CH + SHEET_CSS))

# Split 2 on Legend/Rise (Craig, 14 Nov): Total is season points, with a Split 2 column beside it.
SP2 = {"1,642": "402", "1,631": "415", "1,628": "377", "1,619": "390", "1,611": "398", "1,604": "371", "1,598": "366",
       "1,199": "301", "1,198": "298", "1,197": "260"}
import re as _re
A2b = A2.replace('<th class="n">Week 14</th><th class="n">Total</th>', '<th class="n">Week 14</th><th class="n">Split 2</th><th class="n">Total</th>')
A2b = _re.sub(r'<td class="n">(\d+)</td><td class="n">([\d,]+)</td>', lambda m: f'<td class="n">{m.group(1)}</td><td class="n">{SP2.get(m.group(2), "300")}</td><td class="n">{m.group(2)}</td>', A2b)
A2b = A2b.replace('colspan="7"', 'colspan="8"')
(d / "a2.html").write_text(page("Leagues · A2 · Overall in Split 2", A2b, A_CSS + CH))
