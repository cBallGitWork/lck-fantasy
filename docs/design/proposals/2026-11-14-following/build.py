import pathlib
d = pathlib.Path(__file__).parent
css = (d / "base.css").read_text(); nav = (d / "nav.part").read_text()

STYLE = '''
.page { padding: 24px 32px 48px; }
h1 { font-size: 26px; letter-spacing: -.5px; } h1 small { font-size: 14px; color: var(--mid); font-weight: 400; margin-left: 10px; letter-spacing: 0; }
.grid { display: grid; grid-template-columns: 1fr 440px; gap: 36px; margin-top: 18px; }
.wk { display: flex; align-items: baseline; gap: 10px; margin: 22px 0 6px; font-size: 15px; font-weight: 700; } .wk:first-child { margin-top: 0; }
.it { display: grid; grid-template-columns: 190px 1fr 120px; gap: 16px; align-items: start; background: var(--paper); padding: 12px 16px; border-bottom: 1px solid var(--fill); }
.it .who b { display: block; font-size: 14px; } .it .who small { color: var(--mid); font-size: 12px; display: block; }
.it .what { font-size: 14px; } .it .what small { display: block; color: var(--mid); font-size: 12px; margin-top: 2px; }
.it .pts { font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 18px; margin-right: 6px; }
.it .when { color: var(--soft); font-size: 12px; display: block; margin-top: 3px; }
.bo { color: var(--mid); font-size: 12px; } .sf { color: var(--mid); font-size: 12px; margin-left: 6px; } .sw span:nth-child(2n) { font-weight: 600; }
.sw { font-family: "IBM Plex Mono", monospace; font-size: 13px; display: grid; grid-template-columns: 180px 40px; gap: 2px 10px; margin-top: 4px; } .sw span:nth-child(2n) { text-align: right; }
.tb { justify-self: end; border: 1.5px solid var(--ink); padding: 4px 12px; font-weight: 700; font-size: 13px; background: var(--paper); }
.tb.sent { border: 0; font-weight: 400; color: var(--mid); padding-right: 0; }
.side h2 { font-size: 15px; display: flex; justify-content: space-between; align-items: baseline; margin: 26px 0 8px; } .side h2:first-child { margin-top: 0; } .side h2 span { font-weight: 400; color: var(--mid); font-size: 13px; }
.rq { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: center; background: var(--paper); padding: 10px 14px; border-bottom: 1px solid var(--fill); font-size: 14px; } .rq small { display: block; color: var(--mid); font-size: 12px; }
.btn { border: 1.5px solid var(--ink); padding: 5px 12px; font-weight: 700; background: var(--paper); font-size: 13px; display: inline-block; } .btn.dark { background: var(--ink); color: #fff; } .lnk { color: var(--mid); font-size: 13px; text-decoration: underline; text-underline-offset: 3px; }
.led { background: #111; color: #fff; font: 600 13px/1.3 "IBM Plex Mono", monospace; padding: 10px 12px; min-height: 44px; display: flex; align-items: center; background-image: radial-gradient(circle, rgba(255,255,255,.14) 1px, transparent 1.4px); background-size: 4px 4px; }
.trk { background: var(--paper); margin-bottom: 10px; } .trk .by { display: flex; justify-content: space-between; padding: 6px 12px; font-size: 12px; color: var(--mid); } .trk .by b { color: var(--ink); }
.ppl { background: var(--paper); } .ppl div { display: grid; grid-template-columns: 1fr 0 auto; gap: 8px; align-items: baseline; padding: 8px 14px; border-bottom: 1px solid var(--fill); font-size: 14px; } .ppl small { color: var(--mid); font-size: 12px; } .ppl .n { font-family: "IBM Plex Mono", monospace; text-align: right; } .ppl .x { color: var(--mid); text-align: right; }
.made { color: var(--soft); font-size: 11px; margin-top: 28px; }
'''

def page(title, body, extra=""):
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title><style>{css}{STYLE}{extra}</style></head><body>{nav}<div class="page">{body}<div class="made">All sponsors are made up.</div></div></body></html>'

def who(name, team):
    return f'<div class="who"><b>{name}</b><small>{team}</small></div>'

def tb(sent=None):
    return f'<span class="tb sent">{sent} sent</span>' if sent else '<span class="tb">Truck</span>'

MINJI = ("Minji Park", "Chovy Was Right There"); DAN = ("Dan Okafor", "Peanut Butter Gank"); JAE = ("Jae Kim", "Deft Tomorrow")

FEED = f'''
<div class="wk">Week 3 <span class="tag prov">not final</span></div>
<div class="it">{who(*MINJI)}<div class="what"><span class="pts">34</span>GEN 2–1 HLE <span class="bo">Bo3</span><small>Kiin 9 · Canyon 7 · Chovy 18</small><span class="when">Ended 10:40 · 19:40 KST</span></div>{tb()}</div>
<div class="it">{who(*DAN)}<div class="what"><span class="pts">58</span>T1 2–0 KT <span class="bo">Bo3</span> <span class="tag">Big Carry</span><small>Oner 11 · Faker 42 (28 × 1.5) · Keria 5</small><span class="when">Ended 08:10 · 17:10 KST</span></div>{tb("☕ Coffee")}</div>
<div class="it">{who(*JAE)}<div class="what"><span class="pts">9</span>KRX 0–2 BRO <span class="bo">Bo3</span><small>Rich 4 · Clozer 2 (Carry) · Peter 3</small><span class="when">Ended Wed 10:30 · 19:30 KST</span></div>{tb()}</div>
<div class="it">{who(*MINJI)}<div class="what">Deadline: Limitless, 5 transfers <span class="sf">so far</span>
 <div class="sw"><span>Doran → Kiin</span><span>+9</span><span>Peyz → Ruler</span><span>+4</span><span>Lehends → Keria</span><span>−1</span></div><small>+ 2 more</small><span class="when">Tue 09:00 · 18:00 KST</span></div>{tb()}</div>
<div class="it">{who(*DAN)}<div class="what">Deadline: 2 transfers, −6 <span class="sf">so far</span>
 <div class="sw"><span>Lucid → Oner</span><span>0</span><span>Chovy → Faker</span><span>+24</span></div><span class="when">Tue 09:00 · 18:00 KST</span></div>{tb("☕ Coffee")}</div>
<div class="it">{who(*JAE)}<div class="what">Deadline: no transfers<span class="when">Tue 09:00 · 18:00 KST</span></div>{tb()}</div>
<div class="wk">Week 2</div>
<div class="it">{who(*JAE)}<div class="what"><span class="pts">21</span>GEN 2–0 DNF <span class="bo">Bo3</span> <span class="tag">Big Carry</span><small>Ruler 21 (14 × 1.5)</small><span class="when">Ended Sun 08:20 · 17:20 KST</span></div><span></span></div>
<div class="it">{who(*MINJI)}<div class="what"><span class="pts">21</span>GEN 2–0 DNF <span class="bo">Bo3</span><small>Chovy 21</small><span class="when">Ended Sun 08:20 · 17:20 KST</span></div><span></span></div>
'''

def side():
    trucks = [("Coffee from", "Minji Park", "CHOVY CS. RULER DPS. YOUR SQUAD. 화이팅!"),
              ("Protest from", "Dan Okafor", "THIS TRUCK WAS FUNDED BY YOUR −6."),
              ("Sponsor truck,", "Pub League top", "WINNER WINNER, GANK CHICKEN. 98 PTS.")]
    t = "".join(f'<div class="trk"><div class="led">{l}</div><div class="by"><span>{k} <b>{n}</b></span><span>{"갱 치킨 Gank Chicken" if k.startswith("Sponsor") else ""}</span></div></div>' for k, n, l in trucks)
    fol = "".join(f'<div><span>{n}<br><small>{tm}</small></span><span></span><span class="x lnk">Unfollow</span></div>' for n, tm, p in
                  [("Minji Park", "Chovy Was Right There", "81"), ("Dan Okafor", "Peanut Butter Gank", "77"), ("Jae Kim", "Deft Tomorrow", "31")])
    frs = "".join(f'<div><span>{n}<br><small>{tm}</small></span><span></span><span class="x lnk">Remove · Block</span></div>' for n, tm, p in
                  [("Minji Park", "Chovy Was Right There", "81"), ("Dan Okafor", "Peanut Butter Gank", "77"), ("Tom Reid", "Kiin Bean", "61"), ("Sam Hill", "Guma Gang", "49"), ("Priya Shah", "Zeus Juice", "70")])
    return f'''<div class="side">
<h2>Requests <span>2</span></h2>
<div class="rq"><span>Ella Wong<small>Ruler of None</small></span><span class="btn dark">Accept</span><span class="btn">Decline</span></div>
<div class="rq"><span>Joe Grant<small>BeryL Backup Plan</small></span><span class="btn dark">Accept</span><span class="btn">Decline</span></div>
<h2>Trucks · Week 3</h2>{t}
<h2>Following <span>3 of 50</span></h2><div class="ppl">{fol}</div>
<h2>Followers <span>5</span></h2><div class="ppl">{frs}</div>
</div>'''

A = f'<h1>Following</h1><div class="grid"><div>{FEED}</div>{side()}</div>'
(d / "following.html").write_text(page("Following", A))

# ---------- The truck picker, opened from Jae's item.
M_CSS = '''
.shade { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 10; }
.modal { position: absolute; top: 120px; left: 50%; transform: translateX(-50%); width: 620px; background: var(--paper); z-index: 11; padding: 22px 24px; }
.modal h2 { font-size: 20px; } .modal h2 small { display: block; font-size: 13px; color: var(--mid); font-weight: 400; margin-top: 2px; }
.seg { display: inline-flex; border: 1px solid var(--ink); font-size: 14px; margin: 16px 0 12px; } .seg span { padding: 6px 18px; } .seg span.on { background: var(--ink); color: #fff; font-weight: 700; }
.ln { display: grid; grid-template-columns: 18px 1fr; gap: 10px; padding: 9px 4px; border-bottom: 1px solid var(--fill); font: 500 13px/1.35 "IBM Plex Mono", monospace; } .ln i { font-style: normal; width: 14px; height: 14px; border: 1.5px solid var(--ink); border-radius: 50%; margin-top: 1px; } .ln.on i { background: radial-gradient(circle, var(--ink) 4px, transparent 4.5px); } .ln.on { font-weight: 700; }
.ln small { display: block; font: 400 11px "IBM Plex Sans KR", sans-serif; color: var(--mid); }
.prev { margin: 16px 0 6px; } .prev .led { font-size: 16px; min-height: 72px; }
.foot { display: flex; align-items: center; gap: 14px; margin-top: 16px; } .foot .sp { flex: 1; } .foot small { color: var(--mid); }
'''
LINES = [("MANAGEMENT MUST EXPLAIN THIS CARRY PICK. 2 PTS.", "", True),
         ("NO TRANSFER AGAIN. IS ANYONE AT HEADQUARTERS?", "", False),
         ("SET AND FORGET IS NOT A PHILOSOPHY. IT'S A NAP.", "", False),
         ("31 POINTS. WE ARE NOT ANGRY. WE ARE GUTTED.", "", False),
         ("THE TEMPLATE WAS RIGHT THERE, MATE.", "", False)]
ln = "".join(f'<div class="ln {"on" if on else ""}"><i></i><span>{t}</span></div>' for t, why, on in LINES)
B = A + f'''<div class="shade"></div><div class="modal">
<h2>Truck Jae Kim<small>Deft Tomorrow · Week 3 · 31 pts so far, no transfers</small></h2>
<div class="seg"><span>☕ Coffee 커피차</span><span class="on">Protest 시위 트럭</span></div>
{ln}
<div class="prev"><div class="led">MANAGEMENT MUST EXPLAIN THIS CARRY PICK. 2 PTS.</div></div>
<div class="foot"><small>One truck to Jae a week.</small><span class="sp"></span><span class="lnk">Cancel</span><span class="btn dark">Send truck</span></div>
</div>'''
(d / "truck.html").write_text(page("Following · truck", B, M_CSS))
