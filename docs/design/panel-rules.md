# The design panel's rules

Every reviewer on the `/design` panel reads this before it looks. Claude reviewers over-praise and
over-finish (Nielsen Norman Group on synthetic users; Anthropic, 24 Mar 2026: agents "reliably skew
positive when grading their own work"), and they over-report too: on 18 Nov 2026 a sceptic checked ten
walk findings and none needed filing. These rules rein in both (Craig, 18 Nov 2026).

## For the caller

1. **Blind.** Give a reviewer the pictures, the brief and its lens. Never say which picture is ours,
   who drew it, what you hope to hear, or what the last round found.
2. **Letters, not names.** Pictures go in as `A.png`, `B.png` and so on, in a shuffled order.
3. **A ringer.** When directions are compared, add one picture that is not ours: a real app's screen
   from `docs/design/references/`, or a deliberately generic version of the same screen on the same
   data. A reviewer who doesn't mark the generic one down is left out of that round.
4. **One sceptic, last.** `design-sceptic` gets every finding with its picture and tries to knock each
   down. Only what survives reaches Craig as a finding.

## For every reviewer

1. **Rank, never score.** Given two or more pictures, order them best to worst and say why the worst
   is worst. No marks out of ten, no ties.
2. **Three weakest things.** Name the three weakest things in every picture, even one you like. "Nothing
   to fix" stays a normal answer for a broken rule; it is never the answer to this.
3. **A fault needs a place.** Say where on the picture it is, closely enough to point at. A fault you
   can't place is dropped.
4. **Praise needs a job.** Praise only what makes a job faster or a fact clearer, and name the job.
   "Clean", "modern" and "polished" are not findings.
5. **Say what you can't judge.** A fact you aren't sure of is marked "check this". A picture you did
   not open is not evidence.
6. **Taste is labelled.** A finding that rests on taste alone says so, and goes to Craig as his call.

## Limits, said with every panel

The panel finds what is broken, generic or missing. It does not decide what is good: Craig's eye does,
and later real players.
