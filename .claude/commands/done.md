# Task Completion

Run these checks in order:

## 1. Type Check
Run `npx tsc --noEmit`. If it fails, show errors and ask if the user wants to fix them before completing the task.

## 2. Update BUILD_LOG.md
Read docs/BUILD_LOG.md. Add a new row to the Completed Tasks table:
- Sprint: current sprint number
- Task: current task ID
- Date: today's date (YYYY-MM-DD)
- Description: brief description of what was done
- Verified By: "tsc" if type check passed, "manual" if skipped
- Notes: any relevant notes

## 3. Update CLAUDE.md
Read CLAUDE.md. Update the "Current task" line to the NEXT task ID. Update "Last completed" to the task just finished.

## 4. Show Changes
Run `git diff --stat` and display the output.

## 5. Suggest Commit
Suggest a commit message in this format:
```
Sprint X TY — [brief description]
```

## 6. Lessons Learned
Ask: "Any lessons learned from this task?"

If the user provides lessons:
- Read docs/LESSONS.md
- Append each lesson as a new numbered entry
- Write the updated file

If the user says no or skips, move on.

## 7. Commit
Say: "Ready to commit. Type 'commit' to proceed."

NEVER auto-commit. Wait for the user to type "commit" before running any git commands.

When the user types "commit":
1. Stage all changed files
2. Create the commit with the suggested message (or user-modified message)
3. Show `git status` to confirm
