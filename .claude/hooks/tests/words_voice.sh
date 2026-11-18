#!/bin/bash
# words_voice.py's checks: a note pointing at the Broadcast voice writer for a words.ts under src/,
# silence for any other file, and a payload it can't read said loudly.
. "$(dirname "$0")/helpers.sh"

edited() { "$jq" -nc --arg p "$1" '{tool_input:{file_path:$p}}'; }  # path: a Write or Edit of it
says ".claude/agents/broadcast.md" words_voice.py "$(edited "$tmp/src/screens/pick-team/words.ts")"
says "Run the broadcast agent on src/screens/live/words.ts" words_voice.py "$(edited "$tmp/src/screens/live/words.ts")"
says "src/parts/words.ts" words_voice.py "$(edited "$tmp/src/parts/words.ts")"
silent words_voice.py "$(edited "$tmp/src/screens/pick-team/PickTeam.tsx")"
silent words_voice.py "$(edited "$tmp/src/screens/pick-team/words.test.tsx")"
silent words_voice.py "$(edited "$tmp/src/screens/pick-team/keywords.ts")"
silent words_voice.py "$(edited "$tmp/scripts/words.ts")"  # not under src/: no player reads it
silent words_voice.py '{"tool_input":null}'  # no file named: nothing to note
rejects_bad_payloads words_voice.py
fails_loudly "file_path is int where str was expected" words_voice.py '{"tool_input":{"file_path":7}}'
