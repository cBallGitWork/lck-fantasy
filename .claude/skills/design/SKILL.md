---
name: design
description: Draw one screen and get it approved, with the same quality control code has. A brief from the spec, references, a 1440 mock-up, a look at the rendered picture, a review panel of agents and a sceptic, then Craig's yes and a docs PR saving the picture. The first round also writes docs/design/plate.md. Use before any screen's layout changes, or when Craig asks for a screen to be designed.
argument-hint: "[the screen, by its name or route]"
---

# Design one screen

**Contents:** [0. The first round writes the plate](#0-the-first-round-writes-the-plate) ·
[1. Brief](#1-brief) · [2. References](#2-references) · [3. Draw at 1440](#3-draw-at-1440) ·
[4. Look at it](#4-look-at-it) · [5. The review panel](#5-the-review-panel) ·
[6. Show Craig](#6-show-craig) · [7. Save the approved picture](#7-save-the-approved-picture)

Code has hooks, tests and a reviewer; this is the same loop for a screen. It ends in an approved
picture in `docs/design/approved/<screen>/`, which then binds the screen's layout: build to it,
and a look call the picture doesn't settle stops for Craig.

Every picture is drawn at 1440 wide. A phone picture is drawn only when Craig asks for one.

The goal Craig cares most about: far from the AI look. Never show a stock default. The feel is
Korean, and of the LCK's own culture (`CLAUDE.md`, Decided); FPL gives the structure, never the
look.

## 0. The first round writes the plate

`docs/design/plate.md` is the look, written down: the colour roles, type, shape, marks, controls,
a Never list and what Craig has decided. It does not exist until the first design round.

- **No plate yet.** This round is the look round. Draw the screen two or three ways that look
  nothing alike (step 3), each a different answer to "Korean feel, LCK culture", and let Craig
  pick. On his pick, write `docs/design/plate.md` from the picked look: every value it uses,
  named by its role, and a Never list that starts with the AI look's tells (rows of stat tiles,
  a card for every section, pills and tinted badges, indigo or slate grounds with a neon accent,
  gradient buttons, small tracked uppercase labels over big numbers). The plate goes in with the
  first approved picture (step 7).
- **A plate exists.** Read all of it first. Its Never list and Decided hold Craig's corrections.
  A value the screen needs that the plate lacks is added to the plate in the same PR.

## 1. Brief

Write the screen's brief before drawing, from `SPEC.md` and its `spec/NN-*.md` files only:

- the screen, and how a manager reaches it;
- the jobs a manager does here, each with the spec line it comes from;
- the data it shows, each fact with its spec line, and which are placeholders (not held yet, and
  the issue that brings them).

Anything the spec doesn't settle is a question for Craig, asked in chat. Never draw a guessed
rule. A want in `docs/to-grill.md` isn't the product until a grill settles it, and
`docs/decisions.md` is the history, not the spec.

## 2. References

Start from how FPL organises the same screen: what sits where, what a manager does first, how
the pages link. That is the structure. Then look at how the LCK shows the same facts: its
broadcast, its standings and schedule pages, how Korean fans and sites lay out teams, roles and
series. That is the feel. `docs/research/` holds what was looked up before. Other fantasy games
and other esports products are background, never the product.

Note the one or two ideas the picture borrows; they go in its README later. Keep reference shots
you rely on in `docs/design/references/`, each with a line saying what it shows.

## 3. Draw at 1440

One screen is one self-contained HTML file in the scratchpad: its styles inline, made-up data
that could happen in a real LCK week (real teams and roles, plausible series scores), every
placeholder greyed in its real place and size. No Figma. Values come from the plate once there
is one.

Short labels ("6th"), no caption that says what the screen already shows, nothing explained that
any fantasy manager knows. What is new to an FPL manager (roles, series, the flex and coach
slots, the buffs' names) gets a line where he meets it.
Every label on the picture is written in the Broadcast voice (`.claude/agents/broadcast.md`), because the builder copies it.

## 4. Look at it

Open the file in the Browser pane at 1440 wide and take a screenshot. Read the picture: a
picture you did not open is not evidence. Check there is no sideways scroll, no clipped text, no
font that failed to load, and no console error. Fix what the picture shows, and look again.

Stop after three rounds in a row that change nothing the picture shows: say what is still wrong,
what each round tried, and hand it to Craig instead of a fourth round.

## 5. The review panel

Read-only agents, run in parallel in one message, under `docs/design/panel-rules.md` (blind, lettered
pictures, a ringer when directions are compared; Craig, 18 Nov 2026):

| Agent | Lens | Runs |
|---|---|---|
| `design-fpl-player` | an FPL manager doing his weekly jobs: fast, where FPL puts it, what is new explained | always |
| `design-ucl-player` | a UCL Fantasy player: one squad picture, the week at a glance, points explained | always |
| `design-lol-player` | a League player who follows no league: roles, stats, sides and the Rift read as League, none of Riot's artwork | always |
| `design-lck-fan` | a long-time LCK viewer: does it feel like the LCK; roles, teams and series as fans think of them | an LCK picture |
| `design-lec-fan` | a long-time LEC viewer: the LEC, not the LCK in other colours | an LEC picture |
| `design-ux` | layout, density, scan speed, the plate and its Never list, far from the AI look | always |
| `design-visual` | a look of its own, or any app: side by side with real apps and a generic version | always |
| `design-mobile` | a phone at 390: thumb reach, nothing covered or cut, dense tables | a 390 shot |
| `design-pm` | matches SPEC and the brief, nothing invented, build cost, which screens it reaches | always |

Give each the lettered screenshot paths and the brief, nothing more. Then `design-sceptic` gets every
finding with the pictures and tries to knock each down; only what stands counts.
Fix the clear-cut findings that stand (a broken plate rule, an invented control, a missing fact the
brief holds, a role or team shown wrongly), then look again. Where two reviewers disagree, or a
finding is taste, it goes to Craig.

## 6. Show Craig

Send Craig the picture itself (a screenshot, not only a link) with a short list:

- what the panel changed, one line each;
- where they disagreed, and every Craig's call, each a question with the options and a
  recommendation, in plain words.

Pictures are drawn and approved only in a session Craig is watching. He comments until he says
it's right; each round goes back through steps 4 and 5. Once he has picked a look, small details
(a rim, an underline, a gap) are yours: decide, and say the call in one line.

## 7. Save the approved picture

On his yes, a `docs/` branch and PR adds `docs/design/approved/<screen>/`:

- `1440.png`, the shot of the approved mock-up;
- the mock-up's HTML file next to it, so the picture can be redrawn from its source;
- `README.md`: the screen and how it is reached, Craig's words approving it and the date, the
  ideas it borrows, interaction notes one line per control, and each placeholder with its data's
  issue.

The first round's PR also adds `docs/design/plate.md` (step 0); a later round's PR changes it
where the screen added a value. The PR quotes Craig's yes and the panel's findings.
