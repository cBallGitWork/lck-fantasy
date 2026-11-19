#!/usr/bin/env python3
"""UserPromptSubmit hook: keeps Craig's latest message, so guard_mode.py can tell talk from a go.
The message's first PROMPT_BYTES go to a file named for the session under STATE_DIR; a message
that is a slash command or a pasted block still counts (it is what he sent). Also a PostToolUse hook on
AskUserQuestion: the answers Craig picked on a question card are his latest words, never the questions
(19 Nov 2026: "Ship it now" picked on a card was refused as talk, and he had to type "ship both"). A payload that isn't
JSON exits 1 with one line on stderr (hook_payload.py); a write that fails says nothing, and
guard_mode.py then judges by the message before. Stdlib only, Python 3.9+.
"""

from __future__ import annotations

import re
import sys
import tempfile
from pathlib import Path

from hook_payload import BadPayload, field, read_payload, report

STATE_DIR = Path(tempfile.gettempdir()) / "lck-fantasy-last-prompt"
PROMPT_BYTES = 4000
NOTICE_TAGS = ("system-reminder", "task-notification", "agent-message", "side-sessions-event", "ci-monitor-event")
NOTICE = re.compile(r"<(%s)\b[^>]*>.*?</\1[^>]*>" % "|".join(NOTICE_TAGS), re.S)


def state_file(session):
    return STATE_DIR / ("".join(c for c in session if c.isalnum() or c in "-_") or "unknown")


def own_words(prompt):
    """The prompt without the app's notices (a finished background task, an agent's report), which arrive as
    prompts but aren't Craig's: one must never stand in for his latest message (CTO review, 5 Nov 2026)."""
    return NOTICE.sub("", prompt).strip()


def remember(session, prompt):
    prompt = own_words(prompt)
    if not prompt:
        return  # only a notice: his message before still stands
    try:
        STATE_DIR.mkdir(exist_ok=True)
        state_file(session).write_text(prompt[:PROMPT_BYTES], encoding="utf-8")
    except OSError:
        pass


def answers(payload):
    """The answers Craig picked on a question card, one a line; the questions and the options he didn't pick
    are Claude's words and never count."""
    for source in ("tool_input", "tool_response"):
        picked = field(payload, source, dict, {}).get("answers")
        if isinstance(picked, dict):
            return "\n".join(str(answer) for answer in picked.values())
    return ""


def main():
    try:
        payload = read_payload()
        session = field(payload, "session_id", str, "")
        if field(payload, "tool_name", str, "") == "AskUserQuestion":
            remember(session, answers(payload))
        else:
            remember(session, field(payload, "prompt", str, ""))
    except BadPayload as error:
        return report(error, "Craig's latest message wasn't kept")
    return 0


if __name__ == "__main__":
    sys.exit(main())
