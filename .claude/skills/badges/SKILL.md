---
name: badges
description: Make a competition's team badges and kits, Pro Evo style. A describer reads each real logo and kit from photos, two designers draw blind, an esports historian checks the facts, a fresh-eyes UX designer makes them one set, then Craig picks. Use when Craig asks for a competition's crests, badges, logos, shirts or kits.
argument-hint: "[the competition, e.g. LEC]"
---

# Badges and kits

**Contents:** [Rules](#rules) · [1. Describe](#1-describe) · [2. Draw blind](#2-draw-blind) ·
[3. Historian](#3-historian) · [4. Fresh eyes](#4-fresh-eyes) · [5. Kits](#5-kits) ·
[6. Show Craig](#6-show-craig) · [7. Save](#7-save)

Learnt on the LEC round of 17 Nov 2026, after Craig ditched the first two rounds. The LCK crests
(`docs/design/approved/crests/`) came first and lean on fan memes; a new competition follows this
skill unless Craig says otherwise.

## Rules

- **Pro Evo badges.** Each is what Pro Evolution Soccer did for unlicensed clubs: the real club at
  a glance (its colours, its mark's silhouette, what a fan spots first), redrawn so it isn't a
  copy. Never loose clip-art icons.
- **Football culture.** A club badge form fitting the team's home (English shield, German roundel,
  Spanish shield, French circle-in-shield, stripes, pennant, monogram), with football conventions:
  the full team name, the home city or country, "EST." and the founding year, a star only for a
  sourced international title, a Latin motto only where the team has one.
- **No two teams share a format.** Vary shape and layout as real clubs do (Craig: "all the same
  shape and format").
- **Every fact is sourced.** No invented meme, meaning or sponsor joke. A nation comes from where
  the team is founded and based, never from its mascot (G2's samurai doesn't make it Japanese) or
  from the league's studio city (the LEC plays in Berlin; that makes no team German).
- **The team's colours, from its kit.** A sponsor's colour is not the team's (Telekom's magenta on
  SK's shirt). Check the current kit, not just the logo (SK is purple, not black and white).
- **Respect.** Nothing built on a player's death or a scandal.

## 1. Describe

One describer agent per competition, writing to the scratchpad. For each team it fetches the
current logo and LOOKS at it (reads the SVG paths where it can), then writes, shape by shape: the
silhouette and proportions, every element and where it sits, exact hex colours, the lettering,
the two or three features a fan spots first, the home country and city and the founding year,
each with a source, and a one-line Pro Evo suggestion. Thin descriptions make bad badges: Craig
asked for "much better" ones. Anything unseen goes under **Unsure**.

## 2. Draw blind

Two designer agents, separately, each draw every team from the descriptions alone, never looking
up the logos: inline SVG, viewBox 0 0 120 120, flat colours, at most 116 of 120, legible at 24.
One HTML sheet each, 1440 wide, cream cards on the dark, each badge at 120, 56, 40 and 24, plus a
strip of all of them at 32 on the dark. Render with Playwright (`channel: "chrome"`) and look.

## 3. Historian

A LoL esports historian agent looks at both sheets: fact-checks every year, city and star with
sources, says which version a fan of that org would like, and gives one to three changes from
the org's own history and colours. Craig's corrections beat it (it got SK's colours wrong).

## 4. Fresh eyes

A UX designer agent who hasn't seen the work makes the picks one set: edges that hold on the
app's dark, one lettering family, emblems that read at 24 to 40, less clutter, and varied
formats. Give it the rules and Craig's fixed choices, not your own opinions.

## 5. Kits

Once Craig takes the badges: a describer reads each team's current jersey from photos (base
colour and print, bands, collar and cuffs, where crest and sponsor sit, which colours are the
sponsor's), then two designers draw every kit on the LCK shirt cut (`data/lck/shirts/`), with the
Flol maker mark top left and the new badge top right. The chest sponsor is a Pro Evo parody of
the team's real sponsor (same kind of company, a different made-up name, never its logo or type);
where the real kit carries the team name, so does ours; never a betting parody.

## 6. Show Craig

Send each sheet as a picture, with a table of picks (team, designer, why) and the weak spots.
His word on any team overrides every agent. Pictures are approved only by Craig.

## 7. Save

On his yes, a docs PR: `docs/design/approved/<competition>-crests/` and
`<competition>-shirts/` (sheets, pictures, a README of the picks and his calls, as the LCK's),
the research notes in `docs/research/`, and the drawings as data under
`data/<competition>/crests/` and `shirts/` once the app holds that competition.
