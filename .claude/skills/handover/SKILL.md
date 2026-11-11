---
name: handover
description: Write the session's handover for the next one, with the facts gathered first so the numbers in it are real: what merged, what is open, what waits on Craig, what to do next. Saved to memory and indexed there. Use before clearing the chat, or when Craig asks for a handover.
argument-hint: "[topic] [--dry-run]"
disable-model-invocation: true
---

# Write the handover

A handover is how a session's findings survive it. The next session reads it first, so its top
has to carry the load.

## 1. Gather the facts before writing prose

```bash
git fetch origin && git log --oneline -5 origin/main      # where main is now
gh pr list --state open                                    # open pull requests, with their branches
gh pr list --state merged --limit 10                       # what merged, to find this session's
gh issue list --state open                                 # the build queue
npm run verify                                             # only if this session changed anything
```

Read the previous handover in the memory folder: it records the commit `main` was at. That is
your range start. If there is none, say so rather than inventing a range.

A number goes in only with the command that gave it or the date it was true on. A check you did
not run is written "not run", never "passes".

## 2. Fill the template

`${CLAUDE_SKILL_DIR}/template.md` is the shape. What makes a handover work:

- **Lead with the finding that reorders the rest**, not with what you built. If something learned
  late changed an earlier answer, say so first.
- **Craig's answers, in his words**, each with its date, and where each was filed (`SPEC.md`, a
  `spec/NN-*.md` file, an issue, `docs/decisions.md`). An answer filed nowhere is filed now.
- **What waits on Craig** is numbered, each a question in plain words with the options. Nothing
  his standing answers already settle goes on it.
- **Next** names issues and pull requests by their full GitHub URL. A "next" is not a go-ahead:
  the next session still waits for Craig's word before it builds.
- Say what you deliberately did not do, and why.

## 3. Save it

Write it to the session's memory folder as `handover-<YYYY-MM-DD>-<topic>.md`, and add one line
for it at the top of the handovers in `MEMORY.md`: the date, the topic and the one thing the next
session must know. With `--dry-run`, print it and write nothing.

Before stopping, commit and push any work in the tree on its own branch, staged by named path: a
worktree with nothing committed can be removed when the session ends.
