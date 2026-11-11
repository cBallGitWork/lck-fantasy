---
name: grill
description: Interview Craig about the product, or one feature of it, before any code exists. Maps the decisions, asks the open ones in numbered rounds with a recommended answer each, settles the words, and writes only his answers into SPEC.md. Craig starts it.
argument-hint: "[the product, or one feature in a sentence]"
disable-model-invocation: true
---

# Grill before building

A one-sentence ask leaves gaps, and an agent fills every gap with a silent guess. This skill
turns those guesses into questions Craig answers before the first line is written. After Matt
Pocock's `grill-me` (skills v1.3, Oct 2026).

## 1. Map the decisions

Draw the ask as a tree: the ask at the top, every decision it implies underneath, and the
decisions those imply. A decision belongs here when two reasonable builds would differ on it.

**The frontier** is every decision whose parent is settled. Ask only the frontier.

## 2. Facts are yours, decisions are Craig's

Never ask Craig a fact you can look up: how FPL does it, how the LCK's season, teams and series
work, what `CLAUDE.md`, `SPEC.md` or `docs/decisions.md` already settles. Quote a settled answer;
do not re-ask it. `docs/research/` holds what was looked up before; it rests on search snippets,
so check a fact there before a recommendation leans on it.

FPL's structure is the model (`CLAUDE.md`, Decided). So for each decision, say first how FPL does
it, then what the LCK changes (five roles, series of games, splits, a coach), and recommend FPL's
way unless the LCK breaks it. What other esports fantasy games do is background, never the
product: don't put a feature on the tree because another game has it.

A want in `docs/to-grill.md` is the grill's raw material: it isn't the product until Craig
answers it here. Never offer a rule only the code holds as a recommendation; flag it as a rule
nobody chose.

## 3. One numbered round at a time

```
Round 2 — 4 open

1. A question, in one line.
   Recommend: an answer — one clause of why.
2. ...
```

Every question carries your recommendation, so most answers are "yes, yes, no, 3: the other
one". When you have no grounds to recommend, say so rather than invent one. Past about thirty
questions on one feature, it is two features; say so.

Phrase each question so that "yes" means taking the recommendation; a question whose
recommendation is "not now" is asked as "later?", never "this?". Plain words, with an example
from a real LCK week where one helps. At most five questions go in one AskUserQuestion
(`guard_ask.py`).

Some questions don't settle by talking, usually what a screen looks like. Offer two or three
throwaway mock-ups that look nothing alike, and let Craig pick.

## 4. One word for one thing

When Craig uses two words for what might be one thing, or one word for two, stop and ask:
"is a *game* the same as a *series*?" Record the answer in SPEC.md's glossary: the term, one
line of meaning, and the words to avoid. Where FPL and the LCK each have a word for the same
thing (gameweek and week, club and team), the glossary says which one the game uses.

## 5. Done is an empty frontier and a yes

Write no code while the frontier has a question on it. When it is empty, ask once: "same page?"
On yes, write or update the spec. `SPEC.md` at the repo root is the index:

- **What it is**, in Craig's words, a paragraph.
- **Features**, a numbered table, each with a status (`not built` to start), the one place a
  test will check it, and a link to its file. The status lives only in this table.
- **Later**: what Craig wants after the first release, as he places it.
- **Out of scope**: everything Craig said no to, so it isn't re-asked.
- **Glossary**.

Each feature's detail is its own file, `spec/NN-name.md`, so a session building one feature reads
the index and that file, not the whole spec. A feature `/grill` writes or rewrites its file and
its table row. In the same PR, delete the lines this grill settled from `docs/to-grill.md`.

Only Craig's answers go in. A recommendation he didn't take stays out. An LCK fact the answer
rests on (ten teams, best of three) is written as that competition's data, with the date it was
checked, never as the rule itself. SPEC.md goes in on its own branch and PR, like any change.

Before "same page?", list every no Craig gave in this grill, and the Out of scope line each one
becomes, then every "later" and its Later line. When `pr-reviewer` checks the spec, give it the
grill's questions with his answers, or it can't tell his words from yours.

## 6. Then the tickets

A feature grilled for building ends in GitHub issues, which are the build queue:

- **Title** says what is missing or wrong, not what to add.
- **The stories**, numbered: *as a manager who …, I …*, one per settled decision, each pointing
  at its line in `spec/NN-*.md`.
- **The seam**: where the tests will poke the feature. Aim for one.
- **Done**: the check that proves it, which a session can rerun.
- **Blocked by**: name the data the ticket reads, the screen it sits on and the menu that reaches
  it, then the issue that builds each. Those issues are its blockers.
- **Reuses**: the existing reads, parts and test fixtures the ticket builds on, and the folder
  its code goes in (`ARCHITECTURE.md`).

A feature bigger than one fresh session (~150k tokens) is cut into several issues, each a thin
slice through every layer that works on its own, with the blocking order named. So is one past
the pull request size in `docs/PHILOSOPHY.md`'s header (about 400 changed lines of non-test
code); its pull requests merge in that order. The spec file stays: it is the product's record;
the issue closes by merge.
