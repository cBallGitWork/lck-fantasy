#!/usr/bin/env python3
"""PostToolUse note for Write|Edit: a words file was written, so point at the Broadcast voice.

Every word a player reads lives in a `words.ts` under src/ and is written in the Broadcast voice
(.claude/agents/broadcast.md). A style guide alone gets ignored by builders, so this reminds the
builder at the moment the words change. It notes and never blocks: the tests hold the hard rules.
A payload it can't read (hook_payload.py) exits 1 with the error on stderr. Stdlib only, Python 3.9+.
"""

from __future__ import annotations

import json
import os
import sys

from hook_payload import BadPayload, field, project_dir, read_payload, report

WRITER = ".claude/agents/broadcast.md"
TESTS = "tests/voice.test.ts and tests/glossary.test.ts"


def is_words_file(rel: str) -> bool:
    """A screen's or part's words: a `words.ts` under src/."""
    return rel.startswith("src/") and os.path.basename(rel) == "words.ts"


def main():
    try:
        path = field(field(read_payload(), "tool_input", dict, {}), "file_path", str, "")
    except BadPayload as error:
        return report(error, "no note on the Broadcast voice was given")
    if not path:
        return 0
    rel = os.path.relpath(os.path.abspath(path), project_dir()).replace(os.sep, "/")
    if not is_words_file(rel):
        return 0
    note = (
        f"{rel} holds words a player reads: they are written in the Broadcast voice ({WRITER}). "
        f"Run the broadcast agent on {rel} before the PR; {TESTS} check its Never table and the Glossary."
    )
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": note}}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
