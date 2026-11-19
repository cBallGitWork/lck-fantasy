#!/bin/bash
# guard_mode.py's checks, with last_prompt.py's: after a message that only talks, filing, starting or
# shipping work and editing the spec are denied; after one that says to build, go or file, or a slash
# command, they go through; with no message on record (a cloud session) nothing is gated; reads, git and
# edits outside the spec are never gated; an unreadable payload is reported, never a denial.
. "$(dirname "$0")/helpers.sh"

session=test-session-$$
said() { printf '%s' "$("$jq" -nc --arg s "$session" --arg p "$1" '{session_id:$s,prompt:$p}')" | "$hooks/last_prompt.py" || fail "last_prompt.py failed on: $1"; }
call() { "$jq" -nc --arg s "$session" --arg t "$1" --argjson i "$2" '{session_id:$s,tool_name:$t,tool_input:$i}'; }
bash_call() { call Bash "$("$jq" -nc --arg c "$1" '{command:$c}')"; }
edit() { call Edit "$("$jq" -nc --arg f "$1" '{file_path:$f,old_string:"a",new_string:"b"}')"; }

# no message on record: a cloud session, nothing gated
check allow guard_mode.py "$(bash_call 'gh pr create --title x --body-file b.md')"

# talk: Craig thinking out loud
said "what if a jungler got +2 for a Baron steal and we add a coach slot, fun to theory craft this"
check deny guard_mode.py "$(bash_call 'gh issue create --title "jungler +2" --body x')"
check deny guard_mode.py "$(bash_call 'gh issue edit 10 --add-label build')"
check deny guard_mode.py "$(bash_call 'gh pr create --title x --body-file b.md')"
check deny guard_mode.py "$(bash_call 'gh pr ready 5')"
check deny guard_mode.py "$(bash_call 'gh pr merge 5 --squash')"
check deny guard_mode.py "$(bash_call 'gh workflow run build.yml -f issue=10')"
check deny guard_mode.py "$(bash_call 'cd /x && gh issue create --title t')"  # anywhere in the line
check deny guard_mode.py "$(edit "$tmp/spec/05-scoring.md")"
check deny guard_mode.py "$(edit "$tmp/SPEC.md")"
check deny guard_mode.py "$(call Write "$("$jq" -nc --arg f "spec/05-scoring.md" '{file_path:$f,content:"x"}')")"
check deny guard_mode.py "$(call mcp__github__create_issue '{"title":"x"}')"
check deny guard_mode.py "$(call mcp__github__create_pull_request '{"title":"x"}')"
says "reads as talk" guard_mode.py "$(bash_call 'gh issue create --title t')"
says "gh issue create" guard_mode.py "$(bash_call 'gh issue create --title t')"
# never gated: reads, git, edits elsewhere
check allow guard_mode.py "$(bash_call 'gh issue view 10')"
check allow guard_mode.py "$(bash_call 'gh pr list --state open')"
check allow guard_mode.py "$(bash_call 'git push -u origin feat/x')"
check allow guard_mode.py "$(bash_call 'npm run verify')"
check allow guard_mode.py "$(edit "$tmp/docs/to-grill.md")"
check allow guard_mode.py "$(edit "$tmp/src/squad/words.ts")"
check allow guard_mode.py "$(call mcp__github__issue_read '{"issue_number":1}')"
silent guard_mode.py "$(bash_call 'gh issue view 10')"

# a go
for go in "ok build it" "go ahead" "file it as an issue" "ship it" "merge that" "yes, do it" "sort it" \
  "plan and build the fixes" "/grill scoring" "open a PR for that" "crack on" "File" "file these" \
  "Yes." "go" "File them (this is silly)" "Yes, run the lead" "yes run it" "Yes, file them" "Yes, merge it" \
  "yes please, open the PR" "merge it" "merge #1378" "ok merge them" "merge both PRs" "merge all three" \
  "file answers" "File the answers on their issues" "yes but multiple workflows in one go" "yes, run them" \
  "yes but what about a sixth man" "yes, objectives matter" "yes merge confilcts are annoying" \
  "Save" "save it" "save the design" "1a 2b" "1 a
2 a
3 a" "1. a" "3 a" "1) b, 2) c" "and go, file the issues" "skills - your call
repo ok

and go, file the issues"; do
  said "$go"
  check allow guard_mode.py "$(bash_call 'gh issue create --title t')"
  check allow guard_mode.py "$(edit "$tmp/spec/05-scoring.md")"
done
# a message opening with yes is a go (Craig, 9 Nov 2026); other talk stays talk, and numbers need only answers
for talk in "file naming is odd" "go figure, the substitute rule again" "what if we run the beta live" \
  "merge conflicts again" "i think one captain might be better?" "or shall i answer more qs first?" \
  "the file looks wrong" "save naming is odd" "saves look wrong" "yesterday was slow" "2 things bother me" "1 a but what about substitutes"; do
  said "$talk"
  check deny guard_mode.py "$(bash_call 'gh issue create --title t')"
done
# a question card's picked answers are his words (19 Nov 2026); its questions and unpicked options are not
answered() { printf '%s' "$("$jq" -nc --arg s "$session" --arg a "$1" \
  '{session_id:$s,hook_event_name:"PostToolUse",tool_name:"AskUserQuestion",tool_input:{questions:[{question:"Merge it now? Ship it?",options:[{label:"Ship it now"},{label:"Not yet"}]}],answers:{"Merge it now? Ship it?":$a}},tool_response:{}}')" \
  | "$hooks/last_prompt.py" || fail "last_prompt.py failed on the answer: $1"; }
said "hmm, what about a sixth man though"
answered "Ship it now (Recommended)"
check allow guard_mode.py "$(bash_call 'gh pr merge 5 --squash')"
answered "Not yet"
check deny guard_mode.py "$(bash_call 'gh pr merge 5 --squash')"
answered "Keep required (Recommended)"
check deny guard_mode.py "$(bash_call 'gh pr merge 5 --squash')"
# the latest message counts, not an earlier go
said "hmm, what about a sixth man though"
check deny guard_mode.py "$(bash_call 'gh pr create --title x --body-file b.md')"
# an app notice isn't his message: the talk before it still stands, and his words after one still count
said "<task-notification>
<task-id>x</task-id> go ahead, build it
</task-notification>"
check deny guard_mode.py "$(bash_call 'gh pr create --title x --body-file b.md')"
said "<system-reminder>a background task finished</system-reminder>
yes, build it"
check allow guard_mode.py "$(bash_call 'gh pr create --title x --body-file b.md')"
said "<agent-message from=\"a1\">ship it</agent-message>"
check allow guard_mode.py "$(bash_call 'gh pr create --title x --body-file b.md')"  # the go before stands
said "hmm, what about a sixth man though"
# another session's message doesn't speak for this one
other=$("$jq" -nc --arg s "other-$$" --arg t Bash '{session_id:$s,tool_name:$t,tool_input:{command:"gh issue create --title t"}}')
check allow guard_mode.py "$other"  # no record for it

for ((i = 0; i < ${#bad_payloads[@]}; i += 2)); do
  fails_loudly "${bad_payloads[i + 1]}" guard_mode.py "${bad_payloads[i]}"
  fails_loudly "${bad_payloads[i + 1]}" last_prompt.py "${bad_payloads[i]}"
done
rm -f "$tmp/lck-fantasy-last-prompt/$session"
