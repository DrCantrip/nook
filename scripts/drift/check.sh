#!/usr/bin/env bash
# scripts/drift/check.sh
#
# Session-start drift check. Compares CANONICAL-SHA (the commit the repo
# canonical is at) with LAST-SYNCED-PK (the commit Project Knowledge was
# last synced to), both declared in docs/CORNR_CANONICAL.md.
#
# Trust boundary:
#   This script trusts what the canonical declares about PK state. It
#   cannot verify PK contents directly — PK lives outside the repo. If
#   LAST-SYNCED-PK was bumped but PK was not actually re-uploaded, this
#   script will report in-sync while reality is not.
#
# Exit codes:
#   0 = in sync
#   1 = script error (malformed stamp, file missing, git unavailable)
#   2 = drift detected (not an error — an expected signal)

set -uo pipefail

CANONICAL="docs/CORNR_CANONICAL.md"

die() {
  echo "$1" >&2
  exit 1
}

[[ -f "$CANONICAL" ]] || die "error: $CANONICAL not found"
command -v git >/dev/null 2>&1 || die "error: git not available"

CANONICAL_SHA=$(sed -nE 's|^<!-- CANONICAL-SHA: ([^ ]+) -->.*|\1|p' "$CANONICAL" | head -n1)
LAST_SYNCED_PK=$(sed -nE 's|^<!-- LAST-SYNCED-PK: ([^ ]+) -->.*|\1|p' "$CANONICAL" | head -n1)

sha_re='^[a-f0-9]{7,40}$'
[[ "$CANONICAL_SHA" =~ $sha_re ]] || die "malformed stamp: CANONICAL-SHA"
[[ "$LAST_SYNCED_PK" =~ $sha_re ]] || die "malformed stamp: LAST-SYNCED-PK"

if ! git diff --quiet -- "$CANONICAL"; then
  echo "warning: $CANONICAL has uncommitted changes — declared SHA may be stale against working tree" >&2
fi

if [[ "$CANONICAL_SHA" == "$LAST_SYNCED_PK" ]]; then
  echo "PK in sync at $CANONICAL_SHA"
  exit 0
fi

count=$(git rev-list --count "$LAST_SYNCED_PK..$CANONICAL_SHA" -- "$CANONICAL" 2>/dev/null || echo "?")
{
  echo "DRIFT: canonical at $CANONICAL_SHA, PK last synced at $LAST_SYNCED_PK"
  echo "$CANONICAL_SHA is $count commits ahead of $LAST_SYNCED_PK on canonical:"
  git log --oneline "$LAST_SYNCED_PK..$CANONICAL_SHA" -- "$CANONICAL"
  echo "To resolve: re-upload docs/CORNR_CANONICAL.md to Project Knowledge, then bump LAST-SYNCED-PK to $CANONICAL_SHA in a commit."
} >&2
exit 2
