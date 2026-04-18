# Git hooks

Repo-tracked hooks for the Cornr project. These enforce local invariants
that are too project-specific for CI but too load-bearing to skip.

## Hooks

### pre-commit

Enforces the canonical drift-detection contract (KI-01): any commit that
modifies `docs/CORNR_CANONICAL.md` must also update the
`<!-- CANONICAL-SHA: ... -->` line in the same commit. Without this, the
repo canonical and the Project Knowledge copy drift silently.

Escape hatch: `git commit --no-verify` — use only for genuine exceptions.

## Activation

Hooks do not run until git is pointed at `.githooks/`:

    git config core.hooksPath .githooks

This is a one-time setup per clone. The config is local (not tracked),
so every contributor and every fresh clone must run it.

Verify with:

    git config core.hooksPath
    # expected output: .githooks
