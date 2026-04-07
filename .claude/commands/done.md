Run these checks in order:

## 1. Type Check
Run `npx tsc --noEmit`. If it fails, show errors and ask if the user wants to fix them before completing the task.

## 2. Design Spec Check
Read docs/DESIGN_SPECS.md. For every screen or component touched in this task, verify:
- Spacing values match the spec (screen padding 20px, button height 52px, gaps between elements)
- Colours match the spec (primary-900 for CTAs, neutral-500 minimum for text, warmstone backgrounds)
- Typography matches the spec (correct size, weight, tracking for each text role)
- Touch targets are 44pt minimum on all interactive elements
- Press states use activeOpacity={0.85}, never 0.5
- Button border-radius is 10px, card border-radius is 16px

If ANY value doesn't match, fix it now before proceeding. List what you checked and confirmed.

## 3. Manual Test Checklist
Read the current sprint file from docs/sprints/ and find the "Done when" checks for the current task. Print them as a numbered list with the message:

"Before committing — test these on your iPhone, then return and confirm."

Wait for the user to confirm before proceeding.

## 4. Update BUILD_LOG.md
Read docs/BUILD_LOG.md. Add a new row to the Completed Tasks table:
- Sprint: current sprint number
- Task: current task ID
- Date: today's date
- Description: brief description
- Verified By: "tsc" if type check passed, "manual" if skipped
- Notes: any relevant notes

## 5. Update CLAUDE.md
Read CLAUDE.md. Update the "Current task" line to the NEXT task ID. Update "Last completed" to the task just finished.

## 6. Show Changes
Run `git diff --stat` and display the output.

## 7. Suggest Commit
Suggest a commit message in this format:
```
Sprint X TY — [brief description]
```

## 8. Lessons Learned
Ask: "Any lessons learned from this task?"

If the user provides lessons:
1. Read docs/LESSONS.md
2. Add new lessons under the current sprint heading
3. Keep each lesson to one line

If the user says no or skips, move on.

## 9. Voice Gate
If this commit adds or modifies user-facing strings:
1. List every string added or modified in this commit
2. Scan each string for banned words from CLAUDE.md voice gate (curated, bespoke, journey, unlock, stunning, AI-powered, discover, elevate, reimagine, transform, algorithm, optimise, leverage, synergy)
3. If any banned word found: STOP. Report the violation. Suggest a replacement using the preferred phrases or plain Cornr voice. Do not commit until fixed.
4. For error messages specifically, verify all four error state rules hold (explain, next step, reassure, no blame/tech).
5. If no user-facing strings were added or modified, skip this step and note "Voice gate: no user-facing strings in this commit".

## 10. Commit
Say: "Ready to commit. Type 'commit' to proceed."

NEVER auto-commit. Wait for the user to type "commit" before running any git commands.
