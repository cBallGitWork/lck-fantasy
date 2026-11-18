# Design kit: core

**Contents:** [What it is](#what-it-is) · [The files](#the-files) · [How a project adopts it](#how-a-project-adopts-it) ·
[What /design must produce](#what-design-must-produce) · [Check marks](#check-marks) · [Evidence](#evidence)

## What it is

A kit that stops Claude drawing generic screens. Claude goes generic wherever a decision is left open: it
takes the safest default (Anthropic: "distributional convergence"). So the kit:

1. **Decides the look first,** in one file of exact values, approved by the owner.
2. **Bans the tells by name,** with a short Never list and a Watch list that grows each round.
3. **Checks the rendered screen,** with a script for the hard rules and a panel that did not build it.

For dense product apps (tables, figures, live states), not landing pages. Draft; nothing installed.

## The files

| File | Holds |
|---|---|
| `rules.md` | The rules every project shares, each with an ID and a check mark |
| `never.md` | Never (data-app tells), Watch, and the generic tells as a lint appendix, each graded |
| `checks.md` | The gate: token test, plan audit, lint, render, panel, verifier, owner, taste log |
| `lint-spec.md` | The slop lint, as a spec |
| `DESIGN.template.md` | The blanks a project fills: its values, choices and exceptions |

## How a project adopts it

1. The five files are kit files: copied in by Forge, pinned, never edited in the project.
2. Copy `DESIGN.template.md` once to the project's design file and fill every slot. A slot not needed says
   `None` and why.
3. The design file never repeats a kit rule. It cites IDs: what it turns off, with the owner's reason and
   date, and what it adds.
4. Values live once, in the token file; the design file names tokens, not hex.
5. Lint config, widths, limits and rule levels go in `.studio/design.json`; panel personas in
   `.studio/qa-panel.json`.
6. Start a taste log (`checks.md`).

## What /design must produce

The project's `/design` skill owns the procedure. This is what each step must leave behind; a step with no
output did not happen.

| Step | Output |
|---|---|
| 1. Brief | The screen, how it is reached, its jobs and data, each traced to the spec |
| 2. References | One to three, each with the one idea borrowed ("translate, never copy") |
| 3. Directions (look rounds) | Three or four that differ on look and on how data is shown (`checks.md`) |
| 4. Plan audit | The plan, and one line per choice changed and why (`checks.md`) |
| 5. Build | One mock-up on the project's one dataset |
| 6. Render | Shots at every configured width, opened and read |
| 7. Lint | Clean, or each finding answered |
| 8. Panel | Numbered findings from agents that did not build it |
| 9. Owner | The owner's words and date, saved with the picture |

After approval the picture binds the build; steps 6 to 8 run again on the built screen, plus the verifier.
Three render rounds in a row that change nothing end the loop; hand it to the owner.

## Check marks

| Mark | Caught by | When |
|---|---|---|
| `[test]` | The token test | Every commit |
| `[lint]` | The slop lint, rule ID after it | Every render |
| `[render]` | The render check | Every render |
| `[panel]` | The review panel | Every round |
| `[owner]` | The owner | Approval |

A rule with no mark is a wish. A rule only the panel can see is a candidate for a script.

## Evidence

Strong: a look with exact values plus named tells, a plan audit, a separate reviewer of the rendered screen,
scripts for rules with no exceptions (all Anthropic). Moderate: directions before building; real copy and
one dataset. Weak: the expected-change rule (one comment), third-party skill packs. Each Never line carries
its grade; sources and tool options are in Forge's `sources.md`, kept beside the kit and not copied.
