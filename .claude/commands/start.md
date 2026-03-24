# Session Startup

Read the following files silently (do NOT output their contents):
- CLAUDE.md
- docs/BUILD_LOG.md

Then report in this exact format:

```
Sprint: [current sprint from CLAUDE.md]
Task:   [current task from CLAUDE.md]
Blockers: [any blocking issues from CLAUDE.md, or NONE]
Git: [clean/dirty + branch name]
Next: [next task name from docs/sprints/ file] (~Xh estimated)
```

If there are blockers listed in CLAUDE.md:
- List each blocker
- Suggest fixing those BEFORE proceeding to the next task
- Ask: "Fix blockers first, or skip to next task?"

If there are no blockers:
- Ask: "Ready to proceed? Type 'go'."

When the user types "go":
1. Read the current sprint file from docs/sprints/ to find the current task
2. Display the full task prompt including description, steps, and "Done when" checklist
3. Begin working on the task

Do NOT suggest changes, do NOT start coding, do NOT run commands until the user says "go".
