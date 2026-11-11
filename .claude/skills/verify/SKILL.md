---
name: verify
description: Run the local gate before a commit or a pull request (the contents-list check and the hook checks) and report what ran. Use before any commit, after /refactor and before pr-reviewer, and whenever Craig asks whether it passes.
---

# Verify

```bash
npm run verify   # scripts/contents-lists.mjs (a doc over 100 lines opens with a contents list),
                 # then .claude/hooks/test.sh (every hook's checks, and their wiring in settings.json)
.claude/hooks/tests/<suite>.sh   # one hook's checks alone
```

`npm run verify` is the whole gate today: the repo holds docs and its working setup, no app code.
It needs Node, Python 3.9+, git and `/usr/bin/jq`, and no `npm install`. When app code arrives,
its tests, typecheck and lint join the `verify` script in `package.json`, and this file lists them.

**A gate you did not run did not pass.** If one is skipped (no Node, no `jq`), say so in those
words.

**Say what it printed.** "hooks: all checks pass" is the hook runner's own last line; a suite
that fails prints `FAIL` lines naming the hook, what it expected and the payload. Quote those
before anything else.

**Never cut a test** to get to green (`docs/PHILOSOPHY.md`). A check that is wrong is fixed in
the open, in the same pull request, with the reason in its commit message.

## Report

```
contents   every long doc has one / FAILED (<which docs>)
hooks      all checks pass / <n> FAIL (<which suites>)
```
