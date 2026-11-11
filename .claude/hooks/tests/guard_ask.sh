#!/bin/bash
# guard_ask.py's checks: a question one of Craig's standing answers settles (a small look detail, a
# fix or upkeep) is denied, in AskUserQuestion and in the next-step box's ask; a product rule or a
# look call is let through; more than five in a batch is denied; a question Craig answered is not
# asked again within a week; an unreadable payload is reported, never a denial.
. "$(dirname "$0")/helpers.sh"

ask() { "$jq" -nc --arg q "$1" '{tool_name:"AskUserQuestion",tool_input:{questions:[{header:"H",question:$q,options:[]}]}}'; }
box() { "$jq" -nc --arg q "$1" '{tool_name:"mcp__ccd_turn__wrap_up",tool_input:{recap:"r",ask:$q}}'; }

# settled by a standing answer
check deny guard_ask.py "$(ask "Shall I make the player card's padding 12px?")"
check deny guard_ask.py "$(ask "Is it OK to give the captain's badge a thinner border?")"
check deny guard_ask.py "$(ask "The contents-list check fails on one research doc. Shall I let it skip that file?")"
check deny guard_ask.py "$(ask "The hook tests only run on my side. Shall I make them a real GitHub check?")"
check deny guard_ask.py "$(ask "Want me to rerun the failed check?")"
check deny guard_ask.py "$(box "Shall I fix the red check on #7?")"
# one settled question among real ones denies the call, so the rest are asked again without it
check deny guard_ask.py '{"tool_name":"AskUserQuestion","tool_input":{"questions":[
  {"header":"Subs","question":"Does a substitute score for the games he sat out?"},{"header":"Check","question":"OK to rerun the red check?"}]}}'
says "keeping the hooks, checks and services running are Claude's" guard_ask.py "$(ask "OK to rerun the red check?")"
says "small calls: just decide" guard_ask.py "$(ask "Shall I set the row spacing to 8?")"

# Craig's to answer: product rules and look calls ask what should happen
check allow guard_ask.py "$(ask "Captain (#4): does the captain's double count in a series his team forfeits?")"
check allow guard_ask.py "$(ask "Squad size (#5): five starters and how many on the bench?")"
check allow guard_ask.py "$(ask "Deadline (#6): does the week lock at the first series or the first game?")"
check allow guard_ask.py "$(ask "Transfers (#8): there's no rule yet for a player who changes team mid-split. Add one?")"
check allow guard_ask.py "$(ask "Should a week with two series for one team count both?")"
check allow guard_ask.py "$(ask "Shall I merge it once green?")"  # no standing answer here yet
check allow guard_ask.py "$(box "Which change first?")"
silent guard_ask.py "$(ask "How should a remake be scored?")"
silent guard_ask.py "$("$jq" -nc '{tool_name:"mcp__ccd_turn__wrap_up",tool_input:{recap:"r"}}')"  # no ask
silent guard_ask.py "$("$jq" -nc '{tool_name:"Bash",tool_input:{command:"echo shall I fix it"}}')"  # not a question

# an unreadable payload is said, and the question goes ahead
for ((i = 0; i < ${#bad_payloads[@]}; i += 2)); do
  fails_loudly "${bad_payloads[i + 1]}" guard_ask.py "${bad_payloads[i]}"
done
fails_loudly "questions is str" guard_ask.py '{"tool_name":"AskUserQuestion","tool_input":{"questions":"x"}}'

# at most five questions in one batch
six='{"tool_name":"AskUserQuestion","tool_input":{"questions":[{"header":"A","question":"Which day does the week lock?"},{"header":"B","question":"How many on the bench?"},{"header":"C","question":"Who captains a team left alone?"},{"header":"D","question":"Does a remake count?"},{"header":"E","question":"What are the chips called?"},{"header":"F","question":"Which team logos?"}]}}'
check deny guard_ask.py "$six"
says "at most 5 in one batch" guard_ask.py "$six"
# a question is asked once Craig answers it: the same words again within a week are refused, a new one isn't
answered() { # question answer: the PostToolUse payload of an AskUserQuestion Craig answered ("" for no answer)
  "$jq" -nc --arg q "$1" --arg a "$2" '{hook_event_name:"PostToolUse",tool_name:"AskUserQuestion",
    tool_input:{questions:[{header:"H",question:$q,options:[]}]},tool_response:{answers:{($q):$a}}}'; }
order="Chips (#9): where does the Play chip button sit?"
check allow guard_ask.py "$(ask "$order")"
check allow guard_ask.py "$(ask "$order")"  # asked but not answered (refused, or met with a message): not a repeat
silent guard_ask.py "$(answered "$order" "Under the squad")"
check deny guard_ask.py "$(ask "$order")"
says "Already asked" guard_ask.py "$(ask "chips (#9): where does the play chip button sit")"  # words, not case or marks
check allow guard_ask.py "$(ask "Chips (#9): can a chip be taken back before the lock?")"
# a result with no answer, or no answers at all, records nothing
lineup="Lineup check (#10): does it list each player whose team has no series?"
silent guard_ask.py "$(answered "$lineup" "")"
silent guard_ask.py "$("$jq" -nc --arg q "$lineup" '{hook_event_name:"PostToolUse",tool_name:"AskUserQuestion",
  tool_input:{questions:[{header:"H",question:$q}]},tool_response:"The user sent a message instead"}')"
check allow guard_ask.py "$(ask "$lineup")"
check allow guard_ask.py "$(ask "$lineup")"  # one call's hooks can run twice: still not a repeat
# the full shape Claude Code sends (tool_response as a session transcript recorded an answered
# AskUserQuestion's result, 9 Nov 2026: {questions, answers}, answers keyed on each question's words)
logos="Logo set (#11): team logos or plain colours?"
real=$("$jq" -nc --arg q "$logos" '{session_id:"s",transcript_path:"/t.jsonl",cwd:"/p",permission_mode:"default",
  hook_event_name:"PostToolUse",tool_name:"AskUserQuestion",tool_use_id:"toolu_1",
  tool_input:{questions:[{question:$q,header:"Logos",multiSelect:false,
    options:[{label:"Logos",description:"Real team logos"},{label:"Colours",description:"Plain colours"}]}]},
  tool_response:{questions:[{question:$q,header:"Logos",multiSelect:false,
    options:[{label:"Logos",description:"Real team logos"},{label:"Colours",description:"Plain colours"}]}],
    answers:{($q):"Logos"}}}')
silent guard_ask.py "$real"
check deny guard_ask.py "$(ask "$logos")"
# a result whose shape changed (no answers dict) is said on stderr, never recorded in silence
odd=$("$jq" -nc --arg q "Which jersey colour?" '{hook_event_name:"PostToolUse",tool_name:"AskUserQuestion",
  tool_input:{questions:[{header:"H",question:$q}]},tool_response:{questions:[],replies:{($q):"Red"}}}')
err=$(printf '%s' "$odd" | "$hooks/guard_ask.py" 2>&1 >/dev/null)
printf '%s' "$err" | grep -qF "no answers dict" || fail "guard_ask.py: expected a stderr line for a result with no answers: $err"
check allow guard_ask.py "$(ask "Which jersey colour?")"
