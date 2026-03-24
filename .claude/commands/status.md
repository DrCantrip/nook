# Quick Status

Read CLAUDE.md and docs/BUILD_LOG.md silently.

Output exactly 5 lines in this format:
```
Sprint:  [current sprint]
Task:    [current task ID + name]
Blockers: [blockers from CLAUDE.md, or NONE]
Issues:  [count of rows in Known Issues table in BUILD_LOG.md]
Git:     [clean/dirty + branch name]
```

Do NOT add suggestions, commentary, or next steps unless the user explicitly asks.
