# Verify Current Task

1. Read CLAUDE.md to find the current task ID and sprint number
2. Read the matching sprint file from docs/sprints/
3. Find the "Done when" checklist for the current task

For each checklist item, evaluate whether it passes:
- **PASS**: Can be verified programmatically (file exists, type check passes, component renders, etc.) — run the check and confirm
- **MANUAL**: Requires visual inspection or device testing — cannot be automated
- **FAIL**: Check ran and failed

Report each item as:
```
[PASS]   Description of check
[MANUAL] Description of check
[FAIL]   Description of check — reason for failure
```

End with summary:
```
X of Y passed. Z remaining need manual check.
```

If any items FAIL, suggest specific fixes. Do NOT auto-fix — wait for user instruction.
