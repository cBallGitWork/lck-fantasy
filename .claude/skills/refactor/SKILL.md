---
name: refactor
description: The refactor checklist. Runs a four-point checklist once over the branch's diff or a given range, code and docs alike, covering what pr-reviewer doesn't, and reports every finding. Use before a pull request's final verify, or when Craig asks for a refactor pass or "one more pass".
allowed-tools: Bash(git diff:*), Bash(git status:*)
---

# The refactor check

Craig's refactor checklist (16 Oct 2026).

## The branch's diff
Committed and uncommitted, against where the branch left `main`, then any new files:
!`git diff --stat --merge-base origin/main`
!`git status --short`

Given a range instead, run `git diff --stat <range>` and work over that.

Work over the whole branch's diff, not only the last edit. Change only what the branch already
changed: something older that breaks a rule becomes an issue, unless it sits in a file the task
already touches.

## What is never a refactor

Each of these needs its own pull request and its own reason, never a cleanup. Report it; don't
make it here:

- **Scoring, prices, deadlines and transfers.** A change to what a manager's points, bank or
  squad become is a product change, however small the diff.
- **Saved data.** Renaming a stored field, or anything persisted, is a migration.
- **The LCK's facts as data.** Lifting a competition's fact or a value Craig may tune into a
  constant is never a tidy-up: it stays data, per competition (`CLAUDE.md`, Decided).
- **Building ahead.** "While I'm in here" pulling towards an unbuilt feature: stop and file it.

## The checklist, one pass

pr-reviewer runs after and checks what is written twice, dead code, a new file's home, an older
twin for a new helper or fixture, and LCK facts as constants (its checks 3 and 7). This checklist
covers what it doesn't.

1. **Improve:** is this the clearest way to say it?
2. **Find bugs:** a test that can't fail; a test name promising what its body doesn't check; a
   test double joining downstream of the logic it should protect (delete the fix, run the test:
   if it still passes, it pins the wrong thing); a silent catch.
3. **Naming:** every variable, function, file and test says what it is: `daysUntilExpiration`,
   not `d` (`docs/PHILOSOPHY.md`); a function needing a comment to explain it is renamed. The
   glossary's words (`SPEC.md`), one word for one thing. A test is named for its action and its
   outcome, and checks what its name says.
4. **Lean, nothing hardcoded:** comments that restate the code, anything not carrying its weight
   (a first draft usually cuts to a third or a half). A value (a number, a string, a path, a URL)
   written twice is lifted; logic written three times is lifted, unless it's only similar
   (`docs/PHILOSOPHY.md`: "the same pattern 3 times"); two copies of logic stay; an abstraction
   with one use goes. No bare number or string that means something in a function body: name it,
   even a key name, in one home. Setup a test repeats goes in a shared helper, not the test body.

Report every finding with its file and line, including the ones you chose not to act on. A pass
that finds nothing is a valid result; never invent changes to look busy. A green pull request is
not reworked over borderline duplication: say it in one line and move on.

This skill doesn't run the checks: `/verify` does, after it.
