---
name: deepen
description: The architecture pass. Looks across the whole codebase, not one diff, for shallow modules, missing seams and a rule kept in two places, then hands Craig up to six candidates in plain words. Craig picks one, it goes to /grill, and the grill ends in issues. Use only when Craig asks for an architecture pass, once the repo holds app code.
argument-hint: "[an area, by its folder, or nothing for the whole codebase]"
---

# The architecture pass

`/refactor` is tactical: it tidies what is there. This pass is strategic: it asks whether the
code is cut into the right pieces. Agents find the candidates; Craig decides which are worth it,
because that is a judgement about the product's future, not a fact in the code. After Matt
Pocock's `improve-codebase-architecture` (Oct 2026).

With no app code in the repo yet, say so and stop: there is nothing to deepen.

## The words

Use these and only these, in the reports and with Craig. They are John Ousterhout's, from
*A Philosophy of Software Design*:

- **Module:** a unit of the code with one job: scoring a series, the weekly deadline, a screen
  with its parts.
- **Interface:** everything a caller must know to use a module correctly: its functions, what
  they take and return, and the rules for calling them (call this before that).
- **Implementation:** what the module does inside, which a caller never needs to know.
- **Deep / shallow:** a deep module hides a lot behind a small interface; a shallow one has an
  interface nearly as big as what it does. Deep is better: callers learn less.
- **Seam:** where one module meets another, through its interface. Tests poke a module at its
  seam.
- **Adapter:** a thing that plugs in at a seam, such as one data feed among several behind the
  same reads.
- **Locality:** for whoever changes a module: a change, or a bug, sits in one place, not spread
  across many.
- **Leverage:** for whoever calls a module: how much it does per thing they must learn.

## 1. Explore, split by area

Given an area, explore that alone. Given nothing, read `ARCHITECTURE.md` for where code lives,
then run one `Explore` agent per area in one message, "very thorough", each over a group of
folders of about 5,000 lines, and one more over the seams *between* areas: where two areas each
work out the same thing, and where one reaches into another's internals instead of its
interface. Each agent gets the words above, the signs below, and returns candidates with the
file and line each rests on.

The signs:
- **Shallow:** a module whose interface is nearly as big as what it does; a function that only
  passes its arguments on; a caller that must call three things in the right order.
- **Low locality:** one rule (a points weight, a deadline, who may transfer) worked out in two
  places, so a change to it means finding both; the last few fixes in one area touched many files
  (`git log --stat -20 -- <area>`).
- **No seam:** logic that can only be tested through the screen or a whole server function, so
  its tests are slow or missing; a test double replacing the logic it should protect.
- **Leaking:** a caller that knows a module's internals (a table's field names, a feed's raw
  shape).

## 2. Check before reporting

Read the code each candidate rests on yourself. Drop any that:
- is only similar, not the same rule (`/refactor`'s rule of two and three holds here too);
- turns an LCK fact, or a value Craig may tune, into a constant (`CLAUDE.md`, Decided);
- deepens for a feature not yet in `SPEC.md` (YAGNI, `docs/PHILOSOPHY.md`).

## 3. Up to six, in plain words

Rank by what Craig gets for the cost. Each candidate, for someone who doesn't read the code:

```
1. <What is wrong, in one line, no file names.>
   For example: <one concrete case, as a manager or as the next change would meet it>.
   The fix: <the deeper module, its interface in a sentence>.
   You get: <fewer places to change / a test that can now be written / ...>.
   Size: <about N files, M pull requests>. Touches scoring, prices or saved data: <yes/no>.
```

Then the file and line evidence under each, for the builder, not for Craig. A pass that finds
nothing worth it says so; never pad the list.

## 4. Craig picks, then /grill

Stop and wait for Craig's pick. The pick goes to `/grill`, which settles the module's interface in
rounds (the functions, what each takes and returns, where the seam and its test sit) and ends in
issues, its step 6. A candidate that touches scoring, prices or saved data is never a refactor
(`/refactor`, What is never a refactor): it gets its own pull requests, each proved by a test
that shows nothing a manager sees changed.

When Craig is away, the list goes into the session's handover for him and nothing is built from
it. The candidates he didn't pick are dropped, not filed: the next pass finds them again if they
still matter.
