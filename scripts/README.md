# scripts/

Tooling that runs outside the app bundle.

## Token-derived documentation pipeline

Auto-generates the token sections of `CLAUDE.md` and the design-system
markdown from `src/theme/tokens.ts`. Single source of truth lives in
the code; the docs are derived.

### Regenerate (after touching tokens.ts)

    npm run docs:tokens

Commit the changes alongside your `tokens.ts` edit.

### Drift check

    npm run docs:tokens:check

Exits 0 if all generated sections match `tokens.ts`. Exits 1 if drift
is present (someone edited `tokens.ts` without re-running the
generator). Exits 2 if `tokens.ts` contains forbidden runtime patterns
(`process.`, `require(`, dynamic `import(...)`). Exits 3 if a target
doc has structural marker problems (unpaired markers, or nested
`TOKEN-DOCS` literals inside marker content).

### Files this touches

- `CLAUDE.md` — palette + typography tables
- `docs/strategy/cornr-design-system-for-claude-design.md` — palette
  (Tier 1 + Tier 2 + Tier 3), typography, spacing, radii, shadows

Each generated section is wrapped in markers like:

    <!-- TOKEN-DOCS:START name=palette -->
    > ⚠️ AUTO-GENERATED ... do not edit by hand ...

    (regenerated content)

    <!-- TOKEN-DOCS:END name=palette -->

### Add a new generated section

1. In the target file, wrap the section in markers (any name matching
   `[a-z0-9_-]+`):

       <!-- TOKEN-DOCS:START name=my-section -->
       (existing content; will be replaced on first regeneration)
       <!-- TOKEN-DOCS:END name=my-section -->

2. In `scripts/generate-token-docs.mts`, add a generator function for
   `my-section` and register it in the `buildTargets` table.
3. Run `npm run docs:tokens`.

### Constraints baked into the script

- Plain `node` (no flags) — Node 24's native TypeScript stripping is
  used. Pinned via `.nvmrc` and `engines.node` in `package.json`.
- Zero new npm dependencies.
- No emoji or chrome in regenerated output beyond the single ⚠️ in the
  warning header.
- Marker content is regex-replaced; the regex is non-greedy and uses
  a backreference on the close-tag name, so adjacent markers, nested
  HTML comments, and trailing whitespace on marker lines are handled.

## Other scripts

- `drift/` — KI-01 canonical drift check (bash; pre-commit hook)
- `verify/` — environment + type checks (bash)
