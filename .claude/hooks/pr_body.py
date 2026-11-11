"""The pull-request body check, for guard_bash.py: denies a gh pr create or gh pr edit whose body
(--body, or the file --body-file names) holds a local path or a closing word near an issue number
anywhere but a bare "Closes #n" line. On gh pr create it also denies a body that lacks "## What" or
its "Part of #n" / "Closes #n" line, and a pull request from a branch that starts with none of
BRANCH_PREFIXES (--head, else the folder's branch; one it can't read is let through). A body the
guard can't read is denied too.
A title past TITLE_HARD characters is denied; one past TITLE_SOFT gets a note, not a denial
(pr_title_note; Craig, 22 Oct 2026).
Stdlib only, Python 3.9+.
"""

from __future__ import annotations

import os
import re

from parsing import MARKED
from where import BRANCH_PREFIXES, current_branch, options, runs_at

PR_CALLS = (["pr", "create"], ["pr", "edit"])
BODY_OPTS = {"-b", "--body"}
BODY_FILE_OPTS = {"-F", "--body-file"}
TITLE_OPTS = {"-t", "--title"}
HEAD_OPTS = {"-H", "--head"}
TITLE_SOFT, TITLE_HARD = 100, 120  # characters
REQUIRED = ("## What",)  # the headings every body has
ISSUE_LINE = re.compile(r"^(Part of|Closes) #\d+", re.M)  # the body's issue line
LOCAL_PATHS = ("/Users/", "/private/tmp/")  # a Mac home folder, the session scratchpad
# One line at a time, by design: "Closes" at a line's end with "#12" starting the next, and
# "Closes https://…/issues/5", both get through. A known limit, not a promise.
CLOSING = re.compile(r"(?i)\b(close[sd]?|fix(e[sd])?|resolve[sd]?)\b[^\n#]{0,40}#\d+")
BARE_CLOSES = re.compile(r"^Closes #\d+\s*$")
USE_A_FILE = "Write the body to a file and pass it with --body-file <file>."


def pr_call(words):
    """'create' or 'edit' and the args after it, if this simple command runs gh pr create or edit."""
    i = runs_at(words, "gh")
    if i is None or words[i + 1 : i + 3] not in PR_CALLS:
        return None
    return words[i + 2], words[i + 3 :]


def bodies(args, cwd):
    """Each body these gh args give, as text; raises ValueError saying why one can't be read."""
    out, i = [], 0
    while i < len(args):
        found, i = options(args, i, BODY_OPTS | BODY_FILE_OPTS)
        for opt, value in found:
            if opt in BODY_OPTS:
                if MARKED.search(value):
                    raise ValueError("its --body is filled in by the shell ($(…) or backticks). " + USE_A_FILE)
                out.append(value)
            elif opt in BODY_FILE_OPTS:
                out.append(_read(value, cwd))
        i += 1
    return out


def titles(args):
    """Each title these gh args give; one the shell fills in ($(…)) can't be measured, so is skipped."""
    out, i = [], 0
    while i < len(args):
        found, i = options(args, i, TITLE_OPTS | BODY_OPTS | BODY_FILE_OPTS)
        out += [value for opt, value in found if opt in TITLE_OPTS and not MARKED.search(value)]
        i += 1
    return out


def long_titles(cmds, limit):
    """The titles of gh pr create or edit calls among cmds longer than limit characters."""
    calls = (pr_call(words) for words, _ in cmds)
    return [title for call in calls if call for title in titles(call[1]) if len(title) > limit]


def pr_title_note(cmds):
    """A note, never a denial, for a pull request title past the soft limit, else None."""
    long = long_titles(cmds, TITLE_SOFT)
    if not long:
        return None
    return (f"That pull request title is {len(long[0])} characters, past the soft limit of {TITLE_SOFT} "
            f"(denied past {TITLE_HARD}). Say what was wrong and what is now true in fewer words.")


def branch_problem(args, folder):
    """What is wrong with the branch a gh pr create opens its pull request from, or None: --head's
    (owner:branch counts as branch), else the folder's own. One the guard can't read is let through."""
    named, i = [], 0
    while i < len(args):
        found, i = options(args, i, HEAD_OPTS | TITLE_OPTS | BODY_OPTS | BODY_FILE_OPTS)
        named += [value for opt, value in found if opt in HEAD_OPTS]
        i += 1
    branch = named[-1].rpartition(":")[2] if named else current_branch(folder)
    if not branch or MARKED.search(branch) or branch.startswith(BRANCH_PREFIXES):
        return None
    return (f"The branch {branch} starts with none of {' '.join(BRANCH_PREFIXES)}. One task is one branch "
            "with one of those prefixes: git branch -m <type>/<thing>, push it, then open the pull request.")


def _read(path, cwd):
    if path == "-" or MARKED.search(path):
        raise ValueError(f"its --body-file ({path}) is stdin or filled in by the shell. Name a file.")
    try:
        with open(os.path.join(cwd, path), encoding="utf-8") as f:
            return f.read()
    except OSError as error:
        raise ValueError(f"its --body-file can't be read ({error.strerror}: {path}).") from None


def body_problem(body, creating):
    """What breaks the rules in this body, with the fix, or None."""
    if creating:
        missing = [heading for heading in REQUIRED if heading not in body]
        if missing:
            return (f"The body lacks {', '.join(missing)}. Start it with that heading, then a few plain lines "
                    "saying what a manager or the repo has after this merges.")
        if not ISSUE_LINE.search(body):
            return "The body names no issue. Add a line 'Part of #n', or 'Closes #n' for an issue this PR finishes."
    local = next((path for path in LOCAL_PATHS if path in body), None)
    if local:
        return f"The body names a local path ({local}…). Name the file by its path in the repo."
    for line in body.splitlines():
        if CLOSING.search(line) and not BARE_CLOSES.match(line):
            return (f"A closing word sits next to an issue number ({line.strip()!r}), so merging shuts "
                    "that issue. Only a line holding just 'Closes #n' (no comment after it) may close one, "
                    "for an issue this PR finishes; elsewhere write 'Part of #n' or 'Refs #n'.")
    return None


def pr_body_problem(cmds, cwd):
    """A deny reason if a gh pr create or edit among cmds (every simple command, with its folder:
    commands.py) breaks the body rules or can't be checked, or has a title past the hard limit, else None."""
    long = long_titles(cmds, TITLE_HARD)
    if long:
        return (f"Pull request title: it is {len(long[0])} characters, past the limit of {TITLE_HARD}. "
                f"Keep it under {TITLE_SOFT}: what was wrong, and what is now true.")
    for words, here in cmds:
        call = pr_call(words)
        if not call:
            continue
        sub, args = call
        try:
            texts = bodies(args, here or cwd)
        except ValueError as error:
            return f"Can't check that pull request's body: {error}"
        if sub == "create" and not texts:
            return "gh pr create needs its body given, so the guard can check it. " + USE_A_FILE
        if sub == "create":
            problem = branch_problem(args, here or cwd)
            if problem:
                return "Pull request branch: " + problem
        for text in texts:
            problem = body_problem(text, sub == "create")
            if problem:
                return "Pull request body: " + problem
    return None
