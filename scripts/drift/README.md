# Drift check

Session-start check for Project Knowledge drift.

## What it does

Compares two values declared in `docs/CORNR_CANONICAL.md`:

- `CANONICAL-SHA` — the commit the repo canonical is at
- `LAST-SYNCED-PK` — the commit Project Knowledge was last synced to

If they differ, PK is stale against the repo. The script reports the
drift and lists the commits PK is missing.

## When to run

At the start of any session that will read, edit, or produce work based
on the canonical. Drift surfaces before stale context gets baked into
output, not after.

## How to run

    bash scripts/drift/check.sh

## Exit codes

- `0` — in sync. PK matches the repo canonical.
- `1` — script error. Malformed stamp, file missing, or git unavailable.
- `2` — drift detected. Not an error — the script is doing its job.
  Resolve by re-uploading the canonical to PK and bumping
  `LAST-SYNCED-PK` in a commit.

## Relationship to KI-01 and KI-02

- **KI-01** declares the contract: the canonical carries `CANONICAL-SHA`
  and `LAST-SYNCED-PK` stamps.
- **KI-02** enforces the contract on write: the pre-commit hook blocks
  canonical edits that don't bump `CANONICAL-SHA`.
- **KI-03** (this script) enforces the contract on read: surfaces drift
  at session start before any canonical-dependent work begins.

## Trust boundary

This script trusts what the canonical declares about PK state. It cannot
verify PK contents directly — PK lives outside the repo. If
`LAST-SYNCED-PK` was bumped without actually re-uploading PK, the script
reports in-sync while reality is not. The contract is only as strong as
the discipline of bumping `LAST-SYNCED-PK` *after* re-uploading.
