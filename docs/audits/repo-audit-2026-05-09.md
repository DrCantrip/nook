# Cornr Repo Audit — 2026-05-09

Read-only inventory. Step 2 of a locked sequence (investigations A/B/C precede MC + canonical updates). No mutations performed.

**Gate status:** all stop-and-report gates clear.
- Repo root: `C:/Projects/Nook` ✅
- Branch: `feat/reveal-1b-two-experience` ✅
- Working tree: clean (no modified/staged files) ✅
- `scripts/drift/check.sh`: `PK in sync at 2185b7e`, exit 0 ✅ (exit 0 expected post-LR-PROD-SYNC-closure)

---

## 1. Branch and tree state

- **Current branch:** `feat/reveal-1b-two-experience`
- **HEAD SHA:** `ad5e052b59d1ec6eb4c6f02635a2cab019cba439` (`ad5e052`)

### `git log --oneline main..HEAD` (full)

```
ad5e052 docs: capture LR-PROD-SYNC closure on prod side
a8f29a9 docs(ops): strip Packet 2 cron callout (PROD-SYNC-PACKETS-CLEANUP)
2943019 docs(ops): add prod-sync-packets for LR-PROD-SYNC dispatch
1f289e7 chore(canonical): stamp-bump LAST-SYNCED-PK to 2185b7e (PK re-uploaded after CD-CANONICAL-SYNC).
e7c4e0f chore(canonical): stamp-bump CANONICAL-SHA to 2185b7e
801ed62 chore(docs): close TEAL-DEPRECATION-PROSE-RELOCATE follow-up
deb6ec0 chore(docs): canonical Section 14 — design system updates
18b4a3f chore(docs): canonical Section 13 — R-33 through R-37 added
2185b7e chore(docs): canonical Section 0 — 6 themed entries covering 22 Apr to 6 May 2026
bf95710 Merge: ICON-CAPITALISATION-CASCADE — wordmark capitalisation aligned to icon decision
c7fa205 chore(docs): capture REPO-RENAME-CORNR + PACKAGE-JSON-NAME-RENAME P3 follow-ups
e923aa1 chore(canonical): bump CANONICAL-SHA to 5ed5103
5ed5103 chore(docs): update canonical narrative wordmark refs to "Cornr"
fe2fe95 chore(brand): capitalise in-app wordmark renderings (ICON-CAPITALISATION-CASCADE)
eceae8d fix(tokens-script): normalize CRLF before drift comparison
23e42af Merge: DESIGN-TOKENS-CANONICAL-SOT pipeline (v1)
6de803e chore(tokens-script): document MODULE_TYPELESS warning suppression
2462c09 chore(docs): retire docs/DESIGN_SPECS.md (stale, superseded)
7d18723 chore(docs): regenerate token sections from tokens.ts (first run)
d96bff2 chore(docs): wrap existing token sections in TOKEN-DOCS markers (no content change)
4093c7c fix(tokens-script): scope palette generator to Tier 1 cluster only
2502337 feat(tokens): add scripts/generate-token-docs.mts + npm scripts (DESIGN-TOKENS-CANONICAL-SOT)
c77db57 feat(brand): commit Cornr master icon production assets (v6)
477cf6a feat(reveal): retry state + revealBusy + AbortController on resolution query (REVEAL-RETRY-STATE)
0d3177c docs(design-system): re-derive cornr-design-system.md from tokens.ts (CD-MARKDOWN-SYNC)
af1ce20 feat(profile): wire useAuth.signOut to Profile screen (HOME-SIGNOUT-01)
2c31abe feat(db): add handle_new_user trigger + FK on public.users.id (SIGNUP-PUBLIC-USERS-SYNC)
93329e2 docs(motion): capture reanimated reactivity asymmetry + SWIPECARD-MOTION-CONSUME follow-up
bd08612 feat(motion): add motion.ts registers + useMotionPreference + gate 4 surfaces
e0c55ec feat(errors): migrate reveal failure copy to canonical errors.ts (REVEAL-ERROR-COPY)
23c01bf fix: guard dev-only buttons with __DEV__ (DEV-LEAKAGE-FIX)
720b58b audit: off-ramp as-is snapshot (artefact, see OFFRAMP-LINT-RULE for follow-up)
07f5ede docs(canonical): bump SHA + PK stamp to c86d6e3 post R-25..R-32
f256a29 feat(dev): add temporary __DEV__ sign-out button to onboarding swipe
c86d6e3 docs(canonical): add R-25 through R-32 standing rules
aa3d92f docs(claude): add Testing & Debugging Discipline section
95042c7 chore(logging): add lib/log.ts wrapper, check script, and seed three call sites
7768c70 feat(posthog): implement+verify identified_only + identify/reset (SEC-AUDIT-04)
9738221 feat(sentry): implement+verify beforeSend PII scrubbing (SEC-AUDIT-03)
3ce9f0b docs(handover): add reusable next-session warm-up prompt
a555b91 docs(handover): append audit findings from full-conversation review
7978697 docs(handover): 24 April evening — REVEAL-1B production-tested + shipped
588c0c9 fix(profile, support): regressions surfaced during REVEAL-1B phone test
8a7e06c chore(db): add journey_stage, home_status, created_at to users
8df70d5 fix(routing): signed-in-no-profile users on (auth) redirect to quiz
8fb92db chore: gitignore .claude/settings.local.json (machine-specific)
238643c fix(reveal-1b): wire production routes + gate first-visit events on DB state
b6721ea feat(reveal-1b): two-experience reveal architecture — essence, share, depth
```

**48 commits** ahead of `main` (handover estimated ~16 — see §10). Includes `ad5e052` (LR-PROD-SYNC closure) and 2 merge commits (`bf95710`, `23e42af`).

### Diff size (`git diff --stat main..HEAD | tail -1`)

```
 74 files changed, 7017 insertions(+), 852 deletions(-)
```

### Working tree status (`git status --short`)

Empty — clean tree.

### Drift check (`bash scripts/drift/check.sh; echo "exit: $?"`)

```
PK in sync at 2185b7e
exit: 0
```

### `git stash list`

| Ref | Message | Date |
|---|---|---|
| `stash@{0}` | `On feat/reveal-1b-two-experience: lr-prod-sync-canonical-pending-pk-ritual-20260509` | 2026-05-12 08:46 +0100 |
| `stash@{1}` | `On feat/reveal-1b-two-experience: reveal-1b WIP, parked 20260421-1227 for drift fix` | 2026-04-21 12:27 +0100 |

`stash@{0}` holds the deferred `docs/CORNR_CANONICAL.md` LR-PROD-SYNC DECISIONS_LOG entry (+12 lines), parked because committing it requires a `CANONICAL-SHA` bump (KI-02) — to be unstashed at the next PK-sync ritual. `stash@{1}` is ~3 weeks old (21 April), purpose unknown to this audit; flagged for the planning session to adjudicate (may be duplicative of already-committed work if it was `git stash apply`'d without a subsequent `drop`).

### `git tag --list "wip-*"`

| Tag | Points at |
|---|---|
| `wip-canonical-lr-prod-sync-20260509-backup` | `ad5e052` — `docs: capture LR-PROD-SYNC closure on prod side` |
| `wip-reveal-1b-20260421-1227-predrift-backup` | `7e74121` — `Merge: CONTENT-03 prompts.ts fixes (R-26 em-dash purge, R-24 lexicon isolation, R-16 cache structure)` (not reachable from current HEAD) |

---

## 2. Existing hook infrastructure

| Item | Exists | Path | Assessment |
|---|---|---|---|
| `.claude/settings.json` | **No** | — | No committed project-level Claude settings. |
| `.claude/settings.local.json` | **Yes** (gitignored) | `.claude/settings.local.json` | Machine-local; `defaultMode: bypassPermissions`; contains a permissive `Bash(*)`/`Edit(*)`/`Write(*)`/`Read(*)` allowlist plus a number of `PowerShell(...)` entries referencing an unrelated `C:\PZProject` directory (not a Cornr path) — see §10. |
| `.husky/` | **No** | — | No Husky. |
| `.githooks/` | **Yes** | `.githooks/pre-commit`, `.githooks/README.md` | Active hooks dir (`git config core.hooksPath` → `.githooks`). `pre-commit` enforces the KI-02 canonical drift contract: blocks any commit that changes `docs/CORNR_CANONICAL.md` content without bumping the `CANONICAL-SHA` stamp in the same commit (stamp-only changes exempt). |
| `package.json` `"scripts"` | — | — | See below. |
| `prepare` script | **No** | — | No `prepare` or `postinstall` script. `simple-git-hooks` (devDep) is configured (`"simple-git-hooks": { "pre-commit": "npx tsc --noEmit" }`) and a `.git/hooks/pre-commit` shim exists, but with `core.hooksPath` pointed at `.githooks/`, that tsc shim **does not run** — see §10. |
| Hook refs in `CLAUDE.md` | **Yes** | `CLAUDE.md` | Lines: 22 (logging applies to `hooks/`), 71 (`Hook:` tag-naming examples), 218 (`src/hooks/` key path), 285 (`Never call useAuth() inside another hook`), 440–441 (`## Pre-commit hook (v4)` — describes the `simple-git-hooks` / `npx tsc --noEmit` hook; this description is stale relative to the active `.githooks/` setup). |

### `package.json` `"scripts"` (full)

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "test": "jest",
  "test:watch": "jest --watch",
  "check": "tsc --noEmit",
  "_docs_tokens_note": "MODULE_TYPELESS_PACKAGE_JSON warning is suppressed: this is an Expo project (Metro bundles), not published as ES module — adding type:module would break RN's CJS expectation. The .mts script is ESM-explicit; tokens.ts is .ts and triggers Node's reparse warning on import. Functionally fine, just noisy.",
  "docs:tokens": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/generate-token-docs.mts",
  "docs:tokens:check": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/generate-token-docs.mts --check"
}
```

Also present at top level of `package.json`: `"simple-git-hooks": { "pre-commit": "npx tsc --noEmit" }` and `"jest": { ... }` (inline jest config — see §4).

---

## 3. Existing skill infrastructure

### `.claude/skills/`

**Absent** — no `.claude/skills/` directory.

### `.claude/commands/` (7 files)

```
done.md  eval-haiku-status.md  eval-haiku.md  start.md  status.md  verify.md  week.md
```

**`done.md`** (first 20 lines):
```
Run these checks in order:

## 1. Type Check
Run `npx tsc --noEmit`. If it fails, show errors and ask if the user wants to fix them before completing the task.

## 2. Design Spec Check
Read docs/strategy/cornr-design-system-for-claude-design.md. For every screen or component touched in this task, verify:
- Spacing values match the spec (screen padding 20px, button height 52px, gaps between elements)
- Colours match the spec (ink for headings, accent for interactive, cream for screen backgrounds — never hardcode hex)
- Typography matches the spec (correct size, weight, tracking for each text role)
- Touch targets are 44pt minimum on all interactive elements
- Press states use activeOpacity={0.85}, never 0.5
- Button border-radius is 10px, card border-radius is 16px

If ANY value doesn't match, fix it now before proceeding. List what you checked and confirmed.

## 3. Manual Test Checklist
Read the current sprint file from docs/sprints/ and find the "Done when" checks for the current task. Print them as a numbered list with the message:
```

**`eval-haiku-status.md`** (first 20 lines):
```
# /eval-haiku-status

Reports the current state of synthetic persona evaluation infrastructure.

## Output

    Part A (SP-1):  ✓ Landed
    Part B (SP-1B): ⏳ Awaiting S3-T1A (recommend-products Edge Function)

    Fixtures available:
      20 primary  — src/content/synthetic-personas.ts
      8  adversarial — src/content/synthetic-personas.adversarial.ts

    Sanitiser library:
      Available at src/lib/catalogue-sanitise.ts
      Wire-up pending S3-T1A

    Coverage map: evals/COVERAGE.md
    R-19: synthetic personas supplement, never substitute
```

**`eval-haiku.md`** (first 20 lines):
```
# /eval-haiku

Runs the Cornr Haiku recommendation prompt eval suite.

## STATUS: STUB — Part B not yet landed

This command is intentionally inert until SP-1B lands the promptfoo harness,
which depends on Sprint 3 T1A scaffolding the `recommend-products` Edge
Function. Running this command before SP-1B produces an explicit error
rather than a silent no-op.

## When this command will activate

After SP-1B lands (depends on S3-T1A). At that point this command will:

1. Invoke `npx promptfoo eval --config evals/haiku-recommendation.promptfoo.yaml`
2. Run all 20 primary fixtures and 8 adversarial fixtures against the
   live Haiku prompt
3. Include a Sonnet LLM-as-judge Barnum swap-test per primary fixture
```

**`start.md`** (first 20 lines):
```
# Session Startup

Read the following files silently (do NOT output their contents):
- CLAUDE.md
- docs/strategy/cornr-design-system-for-claude-design.md — load all visual design specifications (spacing, colours, typography, touch targets, press states). Every screen built this session must match these specs exactly.
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
```

**`status.md`** (first 20 lines):
```
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
```

**`verify.md`** (first 20 lines):
```
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
```

**`week.md`** (first 20 lines):
```
# Weekly Review (Sunday)

Read docs/BUILD_LOG.md and CLAUDE.md silently.

## Output these sections:

### Completed This Week
List all tasks from BUILD_LOG.md completed in the last 7 days. Format:
- [Task ID] — [Description] ([Date])

### Blockers
List any current blockers from CLAUDE.md or Known Issues in BUILD_LOG.md.
If none: "None."

### Priority for Next Week
Identify the single highest-priority item for the coming week based on:
- Current sprint progress
- Known issues severity
- Any blockers that need resolving
```

### `CLAUDE.md`

- **Size:** 472 lines.
- **Table of contents (headings only):**
  - `# CLAUDE.md — Cornr Project Rules`
  - `## Current build status` (says: Sprint 1, Current task T9, Last completed T8 Home screen shell, Blocking issues NONE)
  - `## Staging test users (permanent — do not delete)`
  - `## Testing & Debugging Discipline (read every session)` → `### Logging — the only allowed pattern` · `### Banned patterns` · `### Tag naming convention` · `### Test strategy (the only one that exists right now)` · `### Self-test before declaring done — mandatory checklist` · `### Debugging escalation order` · `### RLS verification snippet (use when touching policies)` · `### PostHog / Sentry development hygiene` · `### Commit hygiene during testing`
  - `## Stack`
  - `## Key paths`
  - `## Critical rules`
  - `## Voice gate — applies to any task touching user-facing copy` → `### R-26 — LLM fingerprint patterns`
  - `## Supabase patterns`
  - `## Design System` → `### Philosophy` · `### Prohibited patterns` · `### Styling pattern` · `### Palette — semantic roles` · `### Archetype visual themes` · `### Gradient rules` · `### Typography` · `### Radius` · `### Shadows` · `### Spacing` · `### Component behaviour` · `### Grain overlay` · `### Icons`
  - `## Pre-commit hook (v4)`
  - `## Navigation rules`
  - `## ProductCard rules`
  - `## Trades v1 rules`
  - `## DO NOT`
  - `## Build rules (added 12 April 2026)`
- **Sections relating to skills / commands / AC / testing / commit hygiene:**
  - **Skills/commands:** none — CLAUDE.md does not reference `.claude/skills` or `.claude/commands`.
  - **AC:** `### Self-test before declaring done` (lines 101–123) and `## Voice gate` reference "Acceptance Criteria" (lines 91, 116, 122, 204) — AC is treated as something Claude.ai writes into task prompts, not stored in-repo.
  - **Testing:** `### Test strategy (the only one that exists right now)` (lines 83–99) — states "There are NO unit test suites and NONE will be added without explicit instruction"; "Do not propose adding Jest, Vitest, Detox, Maestro …". (Stale: jest is configured and 5 test files exist — see §4 and §10.)
  - **Commit hygiene:** `### Commit hygiene during testing` (lines 196–205) — "One observable change per commit, matching the Acceptance Criteria granularity"; don't commit speculative debug logs; don't modify `lib/log.ts`; don't commit `// TODO` without a ticket. Also `## Pre-commit hook (v4)` (lines 440–441).

---

## 4. AC / spec / test footprint

- **`tests/` / `__tests__/`:** `__tests__/` exists at repo root, **1 file** — `__tests__/result-fallback.test.tsx` (**100 lines**; last touched in commit `238643c`). No `tests/` dir. Additionally, **4 colocated test files in `src/`**: `src/content/synthetic-personas.test.ts`, `src/content/synthetic-personas.adversarial.test.ts`, `src/lib/catalogue-sanitise.test.ts`, `src/lib/journey-stage-mapping.test.ts`. → **5 test files total.**
- **`jest.config.js` / `jest.config.ts`:** neither exists. Jest config is **inline in `package.json`**:
  ```json
  "jest": {
    "preset": "jest-expo",
    "setupFiles": ["./jest.setup.ts"],
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ]
  }
  ```
  `jest.setup.ts` exists (2,059 bytes) — shared mocks for `expo/src/winter/runtime.native`, `src/lib/supabase`, `expo-router`, `expo-linear-gradient`, `react-native-reanimated`, `@sentry/react-native`; comment says "First test lands 14 April 2026 (S2-T4 reveal screen fallback path)".
- **Test-related dependencies (`devDependencies`):** `@testing-library/jest-native@^5.4.3`, `@testing-library/react-native@^13.3.3`, `@types/jest@^30.0.0`, `jest@^30.3.0`, `jest-expo@^55.0.16`, `react-test-renderer@^19.1.0`. (`simple-git-hooks@^2.13.1` also a devDep, not test-related.) No test deps in `dependencies`.
- **`test`-prefixed scripts:** `"test": "jest"`, `"test:watch": "jest --watch"`.
- **Grep for `acceptance criteria` / `Acceptance Criteria` / `AC:` in `.md` files:**
  - `CLAUDE.md:91` — "Manual smoke checklist — written into every task's Acceptance Criteria"
  - `CLAUDE.md:116` — "Verified: which acceptance criteria are now machine-checkable-true"
  - `CLAUDE.md:122` — "If 5 cannot be filled in because the acceptance criteria were vague, stop"
  - `CLAUDE.md:204` — "One observable change per commit, matching the Acceptance Criteria granularity"
  - `docs/CORNR_CANONICAL.md:93` — diagnostic re "acceptance criteria absent or vague in Claude Code prompts"
  - `docs/CORNR_CANONICAL.md:97` — "R-25 (acceptance criteria mandatory in every Claude Code prompt)"
  - `docs/CORNR_CANONICAL.md:1551–1632` — R-25 full text: "`## Acceptance Criteria` block is mandatory in every Claude Code prompt", with sub-rules on observable behaviour, RLS dual-role verification, two-paste pattern, etc.
- **`docs/specs/` / `docs/features/`:** neither exists. Spec-like material lives in:
  - `docs/sprints/` — `sprint-1.md` … `sprint-6.md` plus `bridge-sprint-2-prime-task-prompts-10apr2026.md`, `canonical-section-0-entry-10apr2026.md`, `canonical-section-2-rewrite-10apr2026.md`, `canonical-section-6-sql-10apr2026.sql`
  - `docs/strategy/` — `archetype-research.md`, `archetype-writing-brief.md`, `cornr-design-system-for-claude-design.md`, `palette-revision-candidate.md`
  - `docs/CORNR_CANONICAL.md` Section 7 ("Sprint Plan") is the authoritative task list.

---

## 5. PII boundary state

### `src/services/sentry.ts` (full)

```typescript
import * as Sentry from "@sentry/react-native";

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const POSTCODE_RE = /\b[A-Z]{1,2}[0-9R][0-9A-Z]? ?[0-9][A-Z]{2}\b/gi;
const SECRET_KEY_RE = /email|password|token|api[_-]?key|secret/i;

function scrubString(value: string): string {
  return value
    .replace(EMAIL_RE, "[email scrubbed]")
    .replace(UUID_RE, "[uuid scrubbed]")
    .replace(POSTCODE_RE, "[postcode scrubbed]");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function scrubValue(value: unknown, key?: string): unknown {
  if (key && SECRET_KEY_RE.test(key)) {
    return "[scrubbed]";
  }
  if (typeof value === "string") {
    return scrubString(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => scrubValue(item));
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = scrubValue(v, k);
    }
    return out;
  }
  if (value && typeof value === "object") {
    return scrubString(String(value));
  }
  return value;
}

function scrubEvent(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  if (event.message) {
    event.message = scrubString(event.message);
  }
  if (event.transaction) {
    event.transaction = scrubString(event.transaction);
  }
  if (event.fingerprint) {
    event.fingerprint = event.fingerprint.map((f) =>
      typeof f === "string" ? scrubString(f) : f,
    );
  }
  if (event.tags) {
    event.tags = scrubValue(event.tags) as typeof event.tags;
  }
  if (event.extra) {
    event.extra = scrubValue(event.extra) as typeof event.extra;
  }
  if (event.contexts) {
    event.contexts = scrubValue(event.contexts) as typeof event.contexts;
  }
  if (event.user) {
    event.user = scrubValue(event.user) as typeof event.user;
  }
  if (event.breadcrumbs) {
    event.breadcrumbs = scrubValue(event.breadcrumbs) as typeof event.breadcrumbs;
  }
  if (event.exception) {
    event.exception = scrubValue(event.exception) as typeof event.exception;
  }
  if (event.request) {
    event.request = scrubValue(event.request) as typeof event.request;
  }
  return event;
}

export function initSentry() {
  if (!DSN) {
    console.warn("[Sentry] DSN not set — skipping init");
    return;
  }

  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0.1,
    environment: __DEV__ ? "development" : "production",
    debug: __DEV__,
    beforeSend(event) {
      return scrubEvent(event as Sentry.ErrorEvent);
    },
  });
}

export { Sentry };
```

### PostHog — `src/services/posthog.ts` (full)

(No `src/services/analytics.ts`; PostHog lives in `src/services/posthog.ts`. `src/services/` also contains `engagement.ts`.)

```typescript
import PostHog from "posthog-react-native";

const API_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

let posthog: PostHog | null = null;

export function initPostHog() {
  if (!API_KEY) {
    console.warn("[PostHog] API key not set — skipping init");
    return;
  }

  posthog = new PostHog(API_KEY, {
    host: HOST,
    personProfiles: "identified_only",
  });
}

export function capture(event: string, properties?: Record<string, string | number | boolean>) {
  if (!posthog) return;
  posthog.capture(event, properties);
}

export async function identify(userId: string, properties?: Record<string, string | number | boolean>) {
  if (!posthog) return;
  await posthog.identify(userId, properties);
}

export async function reset() {
  if (!posthog) return;
  await posthog.reset();
}
```

### `src/hooks/useAuth.ts` (full)

```typescript
import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { reset as resetPostHog } from "../services/posthog";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch(() => {
        setSession(null);
      })
      .finally(() => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const user: User | null = session?.user ?? null;

  const isAnonymous = session?.user?.is_anonymous === true;

  const signUp = (email: string, password: string) => {
    if (isAnonymous) {
      // Upgrade anonymous user — preserves existing user_id and linked data
      return supabase.auth.updateUser({ email, password });
    }
    return supabase.auth.signUp({ email, password });
  };

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    await resetPostHog();
    return result;
  };

  return { session, user, loading, signUp, signIn, signOut };
}
```

### `identify(` across `src/`

- `src/services/posthog.ts:25` — `export async function identify(userId: string, properties?: ...)` (definition)
- `src/services/posthog.ts:27` — `await posthog.identify(userId, properties);` (the SDK call inside that wrapper)

No other call sites under `src/`. **Note:** the wrapper *is* invoked from UI code at `app/(auth)/sign-up.tsx:182` (`await identify(userId);`) — outside `src/`, so not in the grep above but material to the PII boundary.

### `reset(` across `src/`

- `src/services/posthog.ts:30` — `export async function reset()` (definition)
- `src/services/posthog.ts:32` — `await posthog.reset();` (SDK call inside that wrapper)

No other literal `reset(` matches under `src/`. **Note:** the wrapper is consumed by `src/hooks/useAuth.ts` as `reset as resetPostHog` and called at `useAuth.ts:49` (`await resetPostHog();`) — the literal grep pattern `reset(` doesn't match `resetPostHog(`, so it isn't listed, but the call exists.

### `beforeSend` across `src/`

- `src/services/sentry.ts:93` — `beforeSend(event) { return scrubEvent(event as Sentry.ErrorEvent); }` — the only match.

---

## 6. HOME-SIGNOUT-01 verification

- **`useAuth.signOut` definition:** `src/hooks/useAuth.ts:47` (`const signOut = async () => { … }`; calls `supabase.auth.signOut()` at line 48, then `await resetPostHog()` at line 49; exported in the return object at line 53).
- **`signOut(` across the repo (excluding `node_modules`, `.git`):**
  - `src/hooks/useAuth.ts:48` — inside the hook definition itself:
    ```
    47    const signOut = async () => {
    48      const result = await supabase.auth.signOut();
    49      await resetPostHog();
    ```
  - `app/(app)/profile.tsx:123` — **the one UI call site:**
    ```
    121    const onSignOut = async () => {
    122      Haptics.selectionAsync();
    123      await signOut();
    124      // Auth guard in app/_layout.tsx detects null session and replaces to /(auth)/welcome.
    125    };
    ```
  - Doc-only mentions (not code): `docs/audits/off-ramp-audit-as-is.md:226`, `docs/audits/off-ramp-graph.json:304`, `docs/CORNR_CANONICAL.md:59`, `docs/operations/security.md:103,150,171,204`.
- **Expectation ("zero call sites in UI code"):** **does NOT hold** — there is exactly **one** UI call site (`app/(app)/profile.tsx:123`). That call site is the deliberate **HOME-SIGNOUT-01 wire-up** landed in commit `af1ce20` ("wire `useAuth.signOut` to Profile screen … replacing the dev-only test button"), not a leak. The earlier `__DEV__` sign-out button in `app/(onboarding)/swipe.tsx` (commit `f256a29`) has been removed — no `signOut(` reference in `swipe.tsx` today. So the *current* state is "one intentional UI call site (Profile), no stray dev sign-outs"; the audit's stated expectation appears to predate `af1ce20`.

---

## 7. SIGNUP current code

### `app/(auth)/sign-up.tsx` (full)

```typescript
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, CaretDown, CaretUp } from "phosphor-react-native";
import { useAuth } from "../../src/hooks/useAuth";
import { supabase } from "../../src/lib/supabase";
import { capture, identify } from "../../src/services/posthog";
import { recordEvent } from "../../src/services/engagement";
import { STRINGS } from "../../src/content/strings";
import { colors, spacing, radius, typography } from "../../src/theme/tokens";
import { useMotionPreference } from "../../src/hooks/useMotionPreference";

const S = STRINGS.signUp;

function WhyWeAskExpander({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const { reduceMotion } = useMotionPreference();

  return (
    <View style={styles.expanderContainer}>
      <Pressable
        style={styles.expanderTrigger}
        onPress={() => {
          if (!reduceMotion) {
            LayoutAnimation.easeInEaseOut();
          }
          setExpanded((v) => !v);
        }}
      >
        <Text style={styles.expanderLabel}>{S.whyWeAsk}</Text>
        {expanded ? (
          <CaretUp size={14} color={colors.accent} weight="light" />
        ) : (
          <CaretDown size={14} color={colors.accent} weight="light" />
        )}
      </Pressable>
      {expanded && <Text style={styles.expanderBody}>{text}</Text>}
    </View>
  );
}

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [audienceDataOptIn, setAudienceDataOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const canSubmit = emailValid && passwordValid && ageConfirmed && !loading;

  async function handleSignUp() {
    setError(null);
    setSuccess(null);

    if (!ageConfirmed) {
      setError(S.ageError);
      return;
    }

    setLoading(true);
    setSubmitted(true);
    try {
      const { data, error: authError } = await signUp(email.trim(), password);
      if (authError) {
        setError(authError.message);
        return;
      }

      const userId = data?.user?.id;
      if (userId) {
        await identify(userId);
        try {
          await Promise.resolve(
            supabase
              .from("users")
              .update({
                email_marketing_opt_in: marketingOptIn,
                audience_data_opt_in: audienceDataOptIn,
              })
              .eq("id", userId)
          );
          await Promise.resolve(
            supabase.from("consent_events").insert([
              {
                user_id: userId,
                event_type: "marketing_opt_in_at_signup",
                consent_given: marketingOptIn,
                consent_text: S.marketingOptIn,
              },
              {
                user_id: userId,
                event_type: "audience_data_opt_in_at_signup",
                consent_given: audienceDataOptIn,
                consent_text: S.audienceDataOptIn,
              },
            ])
          );
          capture("signup_completed", {
            marketing_opt_in: marketingOptIn,
            audience_data_opt_in: audienceDataOptIn,
          });
          recordEvent(data?.user ?? null, "signup_completed", {
            marketing_opt_in: marketingOptIn,
            audience_data_opt_in: audienceDataOptIn,
            source: "sign_up_screen",
          });
        } catch (e) {
          console.warn("Failed to save consent:", e);
        }
      }

      setSuccess(S.checkEmail);
    } catch {
      setError(S.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color={colors.ink} />
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{S.title}</Text>

          <Text style={styles.label}>{S.emailLabel}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            placeholder={S.emailLabel}
            placeholderTextColor={colors.warm400}
          />

          <Text style={styles.label}>{S.passwordLabel}</Text>
          <TextInput
            style={[styles.input, { marginBottom: spacing.xs }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            placeholder={S.passwordLabel}
            placeholderTextColor={colors.warm400}
          />
          <Text style={styles.hint}>{S.passwordHint}</Text>

          {/* 18+ checkbox (required) */}
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAgeConfirmed((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: ageConfirmed }}
          >
            <View
              style={[
                styles.checkbox,
                ageConfirmed ? styles.checkboxChecked : styles.checkboxUnchecked,
              ]}
            >
              {ageConfirmed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{S.ageCheckbox}</Text>
          </Pressable>

          {/* Marketing opt-in toggle */}
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setMarketingOptIn((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: marketingOptIn }}
          >
            <View
              style={[
                styles.checkbox,
                marketingOptIn ? styles.checkboxChecked : styles.checkboxUnchecked,
              ]}
            >
              {marketingOptIn && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{S.marketingOptIn}</Text>
          </Pressable>
          <WhyWeAskExpander text={S.marketingWhyWeAsk} />

          {/* Audience data opt-in toggle */}
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAudienceDataOptIn((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: audienceDataOptIn }}
          >
            <View
              style={[
                styles.checkbox,
                audienceDataOptIn
                  ? styles.checkboxChecked
                  : styles.checkboxUnchecked,
              ]}
            >
              {audienceDataOptIn && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{S.audienceDataOptIn}</Text>
          </Pressable>
          <WhyWeAskExpander text={S.audienceDataWhyWeAsk} />

          {/* Privacy policy */}
          <View style={styles.privacyRow}>
            <Text style={styles.privacyText}>{S.privacyPolicy} </Text>
            <Pressable
              onPress={() =>
                Alert.alert(S.privacyPolicyLink, S.privacyPolicyNotice)
              }
            >
              <Text style={styles.privacyLink}>{S.privacyPolicyLink}</Text>
            </Pressable>
          </View>

          {submitted && success && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
            onPress={handleSignUp}
            disabled={!canSubmit}
          >
            <Text
              style={[
                styles.submitLabel,
                !canSubmit && styles.submitLabelDisabled,
              ]}
            >
              {loading ? "Creating account..." : S.submitButton}
            </Text>
          </Pressable>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>{S.hasAccount} </Text>
            <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
              <Text style={styles.linkAccent}>{S.signInLink}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  backButton: {
    marginLeft: spacing.lg,
    marginTop: spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
  },
  title: {
    ...typography.screenTitle,
    color: colors.ink,
    marginBottom: spacing["3xl"],
  },
  label: {
    ...typography.uiLabel,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.warm200,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  hint: {
    fontSize: 12,
    color: colors.warm400,
    marginBottom: spacing.xl,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.badge,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxUnchecked: {
    backgroundColor: colors.white,
    borderColor: colors.warm200,
  },
  checkmark: { color: colors.white, fontSize: 12, fontWeight: "700" },
  checkboxLabel: { ...typography.body, color: colors.warm600, flex: 1 },
  expanderContainer: {
    marginBottom: spacing.lg,
  },
  expanderTrigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 36,
    minHeight: 28,
  },
  expanderLabel: {
    fontFamily: "DMSans-Medium",
    fontSize: 13,
    fontWeight: "500",
    color: colors.accent,
    marginRight: spacing.xs,
  },
  expanderBody: {
    fontFamily: "DMSans-Regular",
    fontSize: 13,
    lineHeight: 18,
    color: colors.warm600,
    paddingLeft: 36,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  privacyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.xl,
  },
  privacyText: { ...typography.uiLabel, color: colors.warm600 },
  privacyLink: {
    ...typography.uiLabel,
    color: colors.accent,
    fontFamily: "DMSans-SemiBold",
    textDecorationLine: "underline",
  },
  successBox: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  successText: { ...typography.body, color: colors.ink, textAlign: "center" },
  errorText: { color: colors.error, fontSize: 14, marginBottom: spacing.lg },
  submitButton: {
    backgroundColor: colors.accentSurface,
    borderRadius: radius.button,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  submitDisabled: { backgroundColor: colors.warm200 },
  submitLabel: { ...typography.cta, color: colors.white },
  submitLabelDisabled: { color: colors.warm400 },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  linkText: { ...typography.body, color: colors.warm600 },
  linkAccent: {
    ...typography.body,
    color: colors.accent,
    fontFamily: "DMSans-SemiBold",
  },
});
```

> **Observations (not fixes):** `sign-up.tsx` still does `supabase.from("users").update(...)` *after* `auth.signUp()` — the same pattern the `handle_new_user` trigger was added to make resilient (the trigger now guarantees the `public.users` row exists before this update runs). There's a bare `console.warn("Failed to save consent:", e)` at line 219 (not via `lib/log.ts`) — relevant to the logging-discipline rule but pre-existing on this branch.

### `signUp` / `signup` references in `src/hooks/`

Only `src/hooks/useAuth.ts`:
```
36    const signUp = (email: string, password: string) => {
37      if (isAnonymous) {
38        // Upgrade anonymous user — preserves existing user_id and linked data
39        return supabase.auth.updateUser({ email, password });
40      }
41      return supabase.auth.signUp({ email, password });
42    };
…
53    return { session, user, loading, signUp, signIn, signOut };
```
(`signUp` distinguishes anonymous-upgrade — `updateUser` — from new-account — `auth.signUp`. No `public.users` write here; that's done in `sign-up.tsx`.)

### `supabase/migrations/` (6 files, name + first 20 lines)

**`20260407_add_consent_events_email_opt_in_rate_limit.sql`** (1,155 B):
```sql
-- Migration: add_consent_events_email_opt_in_rate_limit
-- Applied: 2026-04-07 via Supabase MCP
-- Branch: feature/april-update-a-schema

-- 1. Email marketing opt-in column
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_marketing_opt_in BOOLEAN DEFAULT false;

-- 2. Consent events table for GDPR demonstrable consent
CREATE TABLE IF NOT EXISTS consent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  consent_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consent_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own consent events"
```

**`20260407132012_bridge_sprint_data_architecture.sql`** (4,087 B):
```sql
-- Bridge Sprint: data architecture foundation
-- Reference: CORNR_CANONICAL.md Sections 4, 6

-- 1. Consent split: audience data opt-in
ALTER TABLE users ADD COLUMN IF NOT EXISTS audience_data_opt_in BOOLEAN DEFAULT false;

-- 2. Editorial content table
CREATE TABLE IF NOT EXISTS editorial_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  body_text TEXT,
  image_url TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  archetype_filter VARCHAR(50),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);
ALTER TABLE editorial_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editorial_content_read" ON editorial_content
```

**`20260413000000_s2_t3b_archetype_scores_and_version_logging.sql`** (1,271 B):
```sql
-- S2-T3B: full 7-dim L2-normalised archetype score vector + rewrite-loop version logging
-- Reference: CORNR_CANONICAL.md Section 6 (schema), Section 13 (archetype description rewrite loop)

-- 13 April 2026: full 7-dim L2-normalised archetype score vector for blended-identity reveal generation
ALTER TABLE archetype_history ADD COLUMN IF NOT EXISTS archetype_scores JSONB NOT NULL DEFAULT '{}'::jsonb;
COMMENT ON COLUMN archetype_history.archetype_scores IS 'L2-normalised 7-dim score vector keyed by archetypeId. Sums to ~1.0. Consumed by S2-T4-INSIGHT Edge Function for blended reveal composition. Format: {"curator": 0.42, "nester": 0.08, ...}';

-- 13 April 2026: archetype version logging for description rewrite loop (canonical Section 13)
ALTER TABLE engagement_events ADD COLUMN IF NOT EXISTS archetype_version INTEGER;
COMMENT ON COLUMN engagement_events.archetype_version IS 'Logs which archetype description version was active when this event fired. Enables A/B comparison of archetype description rewrites against baseline metrics per canonical Section 13 rewrite loop standing rule.';
CREATE INDEX IF NOT EXISTS engagement_events_archetype_version ON engagement_events(archetype_version, event_type, occurred_at DESC) WHERE archetype_version IS NOT NULL;
```

**`20260421000000_reveal_1b_timestamps.sql`** (1,671 B):
```sql
-- REVEAL-1B: two-experience reveal state (timestamps, not booleans)
-- Reference: docs/CORNR_CANONICAL.md Section 0 (20 April evening entry,
-- two-experience architecture), Section 7 (Sprint 2 T4 revised), REVEAL-1B spec
-- locked via 19-voice end-to-end panel on 21 April 2026.

ALTER TABLE users
ADD COLUMN IF NOT EXISTS reveal_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS depth_first_seen_at TIMESTAMPTZ;

COMMENT ON COLUMN users.reveal_completed_at IS 'Timestamp of first successful completion of the two-experience reveal (screen 1 mount). NULL until set. Set once; not updated on return visits. Cascades with user row on account deletion.';
COMMENT ON COLUMN users.depth_first_seen_at IS 'Timestamp of first open of archetype depth view from Profile tab. NULL until set. Set once; used for re-encounter analytics (seconds_since_first_visit in reveal_depth_visited event).';

-- Cohort version on completion records for legacy-vs-new-reveal analytics.
-- Version 1 = legacy 4-panel tap-through reveal (pre-REVEAL-1B).
-- Version 2 = two-experience reveal (this build).
-- Staging has zero archetype_history rows today, so DEFAULT 2 is correct here.
-- Production migration must backfill existing rows to version 1 before this
-- DEFAULT applies. See LR-PROD-SYNC follow-up.
ALTER TABLE archetype_history
ADD COLUMN IF NOT EXISTS reveal_version INTEGER NOT NULL DEFAULT 2;
```

**`20260424130000_users_journey_home_status_member.sql`** (3,278 B):
```sql
-- Adds three columns to public.users that the useProfile hook (REVEAL-1B) requires.
-- The hook was written against a schema that didn't yet include these columns.
-- This migration corrects the inconsistency.
--
-- journey_stage: 5-value enum mirroring src/lib/journey-stage-mapping.ts canonical values.
-- home_status: 3-value enum from src/hooks/useProfile.ts.
-- created_at: provisioning timestamp, backfilled from auth.users.created_at.
--
-- Indexes: partial indexes on the two enum columns enable cohort segmentation
-- analytics (journey_stage funnels, home_status by archetype) without overhead
-- on rows where the column is NULL.
--
-- Production migration (LR-PROD-SYNC) will need staged 3-step pattern for created_at:
--   1. ADD COLUMN created_at TIMESTAMPTZ NULL (nullable)
--   2. UPDATE public.users SET created_at = auth.users.created_at FROM auth.users WHERE public.users.id = auth.users.id
--   3. ALTER COLUMN created_at SET NOT NULL DEFAULT now()
-- Staging is safe to do all three in one migration because zero existing real users.
--
-- ROLLBACK: ALTER TABLE public.users DROP COLUMN IF EXISTS journey_stage,
--                                    DROP COLUMN IF EXISTS home_status,
```

**`20260505140000_create_handle_new_user_trigger.sql`** (3,531 B):
```sql
-- SIGNUP-PUBLIC-USERS-SYNC — handle_new_user trigger + FK + backfill
-- Date: 5 May 2026
--
-- WHAT:
--   1. Add FK constraint public.users.id → auth.users(id) ON DELETE CASCADE.
--      This relationship was assumed by the entire app since schema creation
--      but never enforced at the database level — public.users.id had its
--      own gen_random_uuid() default and could drift from auth.uid().
--   2. Create handle_new_user() — SECURITY DEFINER function that inserts a
--      public.users row from NEW (id, email, created_at) on every auth.users
--      insert. search_path is locked to (public, pg_temp) per Postgres
--      SECURITY DEFINER best practice (search_path injection guard).
--   3. Create the AFTER INSERT trigger on auth.users.
--   4. Backfill the 3 staging accounts that were stranded (created via the
--      app's broken sign-up flow before the trigger existed). Production was
--      empty at investigation, so this INSERT-FROM-SELECT is a no-op there.
--
-- WHY:
--   Pre-flight investigation (5 May 2026) found 100% of accounts created via
--   the app's sign-up flow were missing their public.users row. Sign-up.tsx
```

### `handle_new_user` across the repo

- `supabase/migrations/20260505140000_create_handle_new_user_trigger.sql` — lines 1, 9, 40, 52, 53, 70 (definition, comments, `CREATE OR REPLACE FUNCTION public.handle_new_user()`, trigger `EXECUTE FUNCTION public.handle_new_user()`)
- `docs/operations/prod-sync-packets.md` — lines 417, 438, 446, 477, 489–490, 507, 524, 551, 592, 597, 653, 682 (Packet 6 = this migration; verification queries; run log)
- `docs/operations/security.md` — lines 284, 297 (notes the trigger backstops the `data.length === 0` logging case; LR-PROD-SYNC RESOLVED entry)
- `docs/CORNR_CANONICAL.md` — line 69 (4–5 May entry: "`20260505140000_create_handle_new_user_trigger.sql` committed but not yet applied to `jsrscopoddxoluwaoyak`" — note this line is now superseded by the stashed LR-PROD-SYNC closure entry, not yet committed)

### `public.users` / `from('users')` across the repo

App/code call sites of `from('users')`:
- `app/(app)/archetype-depth.tsx:68`, `:104`
- `app/(auth)/dev-result.tsx:108`
- `app/(auth)/sign-up.tsx:96`
- `app/(onboarding)/reveal-essence.tsx:140`, `:156`
- `src/hooks/useProfile.ts:83`
- `supabase/functions/generate-share-insight/index.ts:79`

`public.users` references in migrations/docs:
- `supabase/migrations/20260424130000_users_journey_home_status_member.sql` — lines 1, 15, 19, 29, 37, 40–41, 44, 49–50, 52–54
- `supabase/migrations/20260505140000_create_handle_new_user_trigger.sql` — lines 5, 7, 10, 20–21, 27, 33, 41, 47–48, 60, 76, 79
- `docs/operations/prod-sync-packets.md` — lines 330, 336, 350, 354, 364, 372, 375–376, 379, 384–389, 401, 419, 442, 444, 447, 457–458, 464, 470, 478, 484–485, 497, 513, 516, 601, 606, 688
- `docs/operations/security.md` — line 295

---

## 8. Canonical / drift state

> Note: `docs/CORNR_CANONICAL.md` in the working tree is the **committed-state version** (the LR-PROD-SYNC +12-line DECISIONS_LOG entry is in `stash@{0}`, not applied). All figures below are committed state.

- **File size:** **1,837 lines** (175,522 bytes).
- **`CANONICAL-SHA` stamp:** `2185b7e` (line 6: `<!-- CANONICAL-SHA: 2185b7e -->`).
- **`LAST-SYNCED-PK` stamp:** `2185b7e` (line 7: `<!-- LAST-SYNCED-PK: 2185b7e -->`).
  - → Stamps are equal, so `drift/check.sh` reports "PK in sync". **But:** three commits *after* `2185b7e` have modified canonical content without re-stamping (`18b4a3f` Section 13, `deb6ec0` Section 14, `801ed62` TEAL-DEPRECATION; then `e7c4e0f` bumped `CANONICAL-SHA` to `2185b7e` and `1f289e7` bumped `LAST-SYNCED-PK` to `2185b7e`). So `CANONICAL-SHA` currently points at an *older* commit than the latest canonical-content commit on the branch — the stamp is conservative/stale, not ahead. See §10.
- **Table of contents (headings, `#`/`##`/`###`):**
  - `# Cornr Canonical Context`
  - `## Recent updates`
  - `## How to use this file`
  - `## Section 0 — Strategic Decisions Log` (≈60 dated `###` entries, 6 May 2026 down to 7/8 April 2026 — most recent: "6 May 2026 — Brand presentation crystallised")
  - `## Section 1 — Personas (revised)` → `### Archetype mapping (hybrid naming)`
  - `## Section 2 — Onboarding & Room Context Capture (v1)` → `### Screen 1` · `### Screen 2` · `### Post-Recommendation Refinement` · `### Settled product decisions — do not reopen`
  - `## Section 3 — Consent Architecture (v1)`
  - `## Section 4 — Engagement Data Architecture (v1)` → `### Engagement Event Payload Schema Registry`
  - `## Section 5 — Editorial Surface (v1)`
  - `## Section 6 — Database Schema (v1, 9 tables)` → `### pg_cron jobs (4 total)` · `### Schema migration SQL (consolidated …)`
  - `## Section 7 — Sprint Plan` → `### Sprint 1 — COMPLETE` · `### Bridge Sprint — COMPLETE` · `### Sprint 2 — Swipe Deck and Archetype Result` · `### Sprint 3 additions from 11 April evening session` · `### Sprint 3 — AI Recommendations` · `### Sprints 4–6 — high-level summary`
  - `## Section 8 — v2 Roadmap (annotated with v1 enablers)`
  - `## Section 9 — Task-Level Critique Workflow` → `### Sizing` · `### Personas` · `### Rules` · `### Anti-patterns`
  - `## Section 10 — Workflow Rules` → `### Session start gate (mandatory)` · `### Document update rule` · `### Mission Control rules` · `### Build quality rules` · `### Recall-before-produce rule` · `### Provisional-until-proven rule` · `### Standing rules (added 11 April 2026)`
  - `## Section 11 — Open Questions (live)`
  - `## Section 12 — Reading order for fresh sessions`
  - `## Section 13 — Standing Rules` → `### Data & Brand Reports` · `### Recommendations & AI` · `### Products & Catalogue` · `### Commercial & Growth` · `### Privacy & Legal` · `### AI-Native Feedback Loops` · `### Content & Voice` · `### Future Features` · `### Workflow & Source of Truth` · `### Archetype description rewrite loop` · plus `### R-14` … `### R-37` rule entries (R-25 through R-37 are the most recent additions)
  - `## Section 14 — Design System` → `### 14.1 Two-Phase Colour System` · `### 14.5 Archetype-invariant interactive design` · `### 14.6 Motion language principles` · `### 14.7 Reveal sequence` · `### 14.8 Tappable motif specification` · `### 14.9 — Icon master v6` · `### 14.10 — Wordmark presentation rule` · `### 14.11 — Token doc auto-regeneration architecture` · `### 14.12 — Motion vocabulary` · `### 14.13 — Reveal retry/abort architecture`
- **`scripts/drift/check.sh` (full contents):**
  ```bash
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
  ```
- **Most recent 5 commits touching `docs/CORNR_CANONICAL.md`** (`git log -5 --oneline -- docs/CORNR_CANONICAL.md`):
  ```
  1f289e7 chore(canonical): stamp-bump LAST-SYNCED-PK to 2185b7e (PK re-uploaded after CD-CANONICAL-SYNC).
  e7c4e0f chore(canonical): stamp-bump CANONICAL-SHA to 2185b7e
  deb6ec0 chore(docs): canonical Section 14 — design system updates
  18b4a3f chore(docs): canonical Section 13 — R-33 through R-37 added
  2185b7e chore(docs): canonical Section 0 — 6 themed entries covering 22 Apr to 6 May 2026
  ```
  (`ad5e052` did **not** touch the canonical — the canonical change for LR-PROD-SYNC closure is in `stash@{0}`.)

---

## 9. Feature branch shape assessment

48 commits on `feat/reveal-1b-two-experience` ahead of `main` (2 are merge commits with no diffstat). Per-commit (chronological, oldest first):

| # | SHA | Subject | Files | +ins | -del | Assessment |
|---|---|---|---|---|---|---|
| 1 | `b6721ea` | feat(reveal-1b): two-experience reveal architecture — essence, share, depth | 17 | 2394 | 471 | **large** (>500 lines; one coherent feature across screens/hooks/migration/docs) |
| 2 | `238643c` | fix(reveal-1b): wire production routes + gate first-visit events on DB state | 6 | 34 | 29 | clean |
| 3 | `8fb92db` | chore: gitignore .claude/settings.local.json (machine-specific) | 2 | 3 | 16 | clean |
| 4 | `8df70d5` | fix(routing): signed-in-no-profile users on (auth) redirect to quiz | 1 | 1 | 1 | clean |
| 5 | `8a7e06c` | chore(db): add journey_stage, home_status, created_at to users | 1 | 54 | 0 | clean |
| 6 | `588c0c9` | fix(profile, support): regressions surfaced during REVEAL-1B phone test | 2 | 19 | 6 | clean |
| 7 | `7978697` | docs(handover): 24 April evening — REVEAL-1B production-tested + shipped | 1 | 350 | 0 | clean (single doc) |
| 8 | `a555b91` | docs(handover): append audit findings from full-conversation review | 1 | 57 | 3 | clean |
| 9 | `3ce9f0b` | docs(handover): add reusable next-session warm-up prompt | 1 | 78 | 0 | clean |
| 10 | `9738221` | feat(sentry): implement+verify beforeSend PII scrubbing (SEC-AUDIT-03) | 2 | 206 | 0 | clean |
| 11 | `7768c70` | feat(posthog): implement+verify identified_only + identify/reset (SEC-AUDIT-04) | 5 | 128 | 11 | clean |
| 12 | `95042c7` | chore(logging): add lib/log.ts wrapper, check script, and seed three call sites | 5 | 39 | 2 | clean |
| 13 | `aa3d92f` | docs(claude): add Testing & Debugging Discipline section | 1 | 189 | 0 | clean |
| 14 | `c86d6e3` | docs(canonical): add R-25 through R-32 standing rules | 1 | 92 | 0 | clean |
| 15 | `f256a29` | feat(dev): add temporary __DEV__ sign-out button to onboarding swipe | 1 | 32 | 0 | clean (explicitly-temporary, later removed by `af1ce20`) |
| 16 | `07f5ede` | docs(canonical): bump SHA + PK stamp to c86d6e3 post R-25..R-32 | 1 | 2 | 2 | clean (stamp bump) |
| 17 | `720b58b` | audit: off-ramp as-is snapshot (artefact, see OFFRAMP-LINT-RULE for follow-up) | 2 | 920 | 0 | **large** (>500 lines; audit doc + JSON, single purpose, clear subject) |
| 18 | `23c01bf` | fix: guard dev-only buttons with __DEV__ (DEV-LEAKAGE-FIX) | 2 | 24 | 20 | clean |
| 19 | `e0c55ec` | feat(errors): migrate reveal failure copy to canonical errors.ts (REVEAL-ERROR-COPY) | 4 | 41 | 73 | clean |
| 20 | `bd08612` | feat(motion): add motion.ts registers + useMotionPreference + gate 4 surfaces | 6 | 144 | 7 | clean |
| 21 | `93329e2` | docs(motion): capture reanimated reactivity asymmetry + SWIPECARD-MOTION-CONSUME follow-up | 2 | 16 | 0 | clean |
| 22 | `2c31abe` | feat(db): add handle_new_user trigger + FK on public.users.id (SIGNUP-PUBLIC-USERS-SYNC) | 2 | 103 | 0 | clean |
| 23 | `af1ce20` | feat(profile): wire useAuth.signOut to Profile screen (HOME-SIGNOUT-01) | 2 | 15 | 33 | clean |
| 24 | `0d3177c` | docs(design-system): re-derive cornr-design-system.md from tokens.ts (CD-MARKDOWN-SYNC) | 1 | 315 | 0 | clean (single doc, under 500) |
| 25 | `477cf6a` | feat(reveal): retry state + revealBusy + AbortController on resolution query (REVEAL-RETRY-STATE) | 4 | 221 | 74 | clean |
| 26 | `c77db57` | feat(brand): commit Cornr master icon production assets (v6) | 17 | 72 | 0 | clean (17 binary icon assets, clear subject) |
| 27 | `2502337` | feat(tokens): add scripts/generate-token-docs.mts + npm scripts (DESIGN-TOKENS-CANONICAL-SOT) | 6 | 627 | 16 | **large** (>500 lines; new generator + scripts, clear subject) |
| 28 | `4093c7c` | fix(tokens-script): scope palette generator to Tier 1 cluster only | 1 | 5 | 26 | clean |
| 29 | `d96bff2` | chore(docs): wrap existing token sections in TOKEN-DOCS markers (no content change) | 2 | 14 | 0 | clean |
| 30 | `7d18723` | chore(docs): regenerate token sections from tokens.ts (first run) | 3 | 108 | 49 | clean |
| 31 | `2462c09` | chore(docs): retire docs/DESIGN_SPECS.md (stale, superseded) | 4 | 5 | 283 | clean (deletion of stale doc) |
| 32 | `6de803e` | chore(tokens-script): document MODULE_TYPELESS warning suppression | 1 | 1 | 0 | clean |
| 33 | `23e42af` | Merge: DESIGN-TOKENS-CANONICAL-SOT pipeline (v1) | — | — | — | clean (merge) |
| 34 | `eceae8d` | fix(tokens-script): normalize CRLF before drift comparison | 1 | 8 | 2 | clean |
| 35 | `fe2fe95` | chore(brand): capitalise in-app wordmark renderings (ICON-CAPITALISATION-CASCADE) | 2 | 2 | 2 | clean |
| 36 | `5ed5103` | chore(docs): update canonical narrative wordmark refs to "Cornr" | 1 | 2 | 2 | clean |
| 37 | `e923aa1` | chore(canonical): bump CANONICAL-SHA to 5ed5103 | 1 | 1 | 1 | clean (stamp bump) |
| 38 | `c7fa205` | chore(docs): capture REPO-RENAME-CORNR + PACKAGE-JSON-NAME-RENAME P3 follow-ups | 1 | 15 | 0 | clean |
| 39 | `bf95710` | Merge: ICON-CAPITALISATION-CASCADE — wordmark capitalisation aligned to icon decision | — | — | — | clean (merge) |
| 40 | `2185b7e` | chore(docs): canonical Section 0 — 6 themed entries covering 22 Apr to 6 May 2026 | 1 | 122 | 0 | clean |
| 41 | `18b4a3f` | chore(docs): canonical Section 13 — R-33 through R-37 added | 1 | 54 | 0 | clean |
| 42 | `deb6ec0` | chore(docs): canonical Section 14 — design system updates | 1 | 88 | 0 | clean |
| 43 | `801ed62` | chore(docs): close TEAL-DEPRECATION-PROSE-RELOCATE follow-up | 1 | 9 | 9 | clean |
| 44 | `e7c4e0f` | chore(canonical): stamp-bump CANONICAL-SHA to 2185b7e | 1 | 2 | 2 | clean (stamp bump) |
| 45 | `1f289e7` | chore(canonical): stamp-bump LAST-SYNCED-PK to 2185b7e (PK re-uploaded after CD-CANONICAL-SYNC). | 1 | 1 | 1 | clean (stamp bump) |
| 46 | `2943019` | docs(ops): add prod-sync-packets for LR-PROD-SYNC dispatch | 1 | 666 | 0 | **large** (>500 lines; ops runbook doc, clear subject) |
| 47 | `a8f29a9` | docs(ops): strip Packet 2 cron callout (PROD-SYNC-PACKETS-CLEANUP) | 1 | 0 | 8 | clean |
| 48 | `ad5e052` | docs: capture LR-PROD-SYNC closure on prod side | 2 | 46 | 11 | clean |

### Aggregate

- **Total commits:** 48 (46 with diffstat + 2 merges).
- **Total lines added (sum of per-commit insertions):** ≈ **7,325** (gross). Net vs `main`: **7,017 insertions** across 74 files.
- **Total lines deleted (sum of per-commit deletions):** ≈ **1,160** (gross). Net vs `main`: **852 deletions**.
- **By assessment:** clean **44**; large **4** (`b6721ea`, `720b58b`, `2502337`, `2943019`); mixed scope **0**; concerning **0**. (All four "large" commits are >500 lines but each is a single coherent unit — a feature, an audit artefact, a generator, or a runbook — with a clear subject; none mixes unrelated areas.)

---

## 10. Anything notable

- **Handover commit estimate was way off.** Handover said "~16 commits" ahead of `main`; actual is **48**. The branch carries the entire REVEAL-1B feature, the design-token SoT pipeline, SEC-AUDIT-03/04, the logging/discipline infra, the brand-icon cascade, and all canonical Section-0/13/14 updates — none of which has been merged to `main`. `main` is well behind.
- **Two competing pre-commit mechanisms; only one is live.** `core.hooksPath` = `.githooks`, so the active pre-commit is `.githooks/pre-commit` (KI-02 canonical-SHA enforcement). The `simple-git-hooks` config in `package.json` (`pre-commit: npx tsc --noEmit`) and the matching `.git/hooks/pre-commit` shim **do not run** while `core.hooksPath` is set. `CLAUDE.md` §"Pre-commit hook (v4)" still describes the tsc hook as the active one — stale. Net effect: **`tsc --noEmit` is not enforced on commit**; it's only run manually via `npm run check` / `/done`.
- **`CLAUDE.md` "Test strategy" section is stale.** It states "There are NO unit test suites and NONE will be added" and "Do not propose adding Jest…" — but the repo has `jest-expo` configured (inline in `package.json`), a `jest.setup.ts`, `test`/`test:watch` scripts, and **5 test files** (`__tests__/result-fallback.test.tsx` + 4 colocated in `src/`). The jest setup comment dates the first test to 14 April 2026.
- **`.claude/settings.local.json` carries unrelated, very permissive entries.** `defaultMode: bypassPermissions` plus `Bash(*)`/`Edit(*)`/`Write(*)`/`Read(*)`, and several `PowerShell(...)` allow-entries referencing `C:\PZProject` (a Project-Zomboid-server directory — nothing to do with Cornr). It's gitignored so it won't propagate, but it's worth a clean-up. No secrets in it.
- **Canonical stamp is conservatively stale, not ahead.** `CANONICAL-SHA` = `LAST-SYNCED-PK` = `2185b7e`, so drift-check says "in sync" — but `18b4a3f`, `deb6ec0`, `801ed62` modified canonical *content* after `2185b7e` without re-stamping (the `e7c4e0f`/`1f289e7` stamp-bumps both targeted `2185b7e`, not the later content commits). And `stash@{0}` holds a further +12-line canonical edit not yet committed. So PK is *understated* as in-sync; the real canonical content on this branch is ahead of both stamps and of PK.
- **`stash@{1}` is 3 weeks old (21 April).** Message: "reveal-1b WIP, parked 20260421-1227 for drift fix", with a matching tag `wip-reveal-1b-20260421-1227-predrift-backup` → `7e74121` (a `Merge: CONTENT-03 prompts.ts fixes` commit not reachable from current HEAD). Likely superseded by work already on the branch; flagged for the planning session to confirm-and-drop.
- **`sign-up.tsx` still does the post-signup `from("users").update(...)`.** The `handle_new_user` trigger (`2c31abe`, now on prod) makes this resilient (the row is guaranteed to exist), but the app-side pattern is unchanged — the in-flight discipline-pack sequence may want to revisit whether the update should move to the trigger or stay client-side. Also a bare `console.warn("Failed to save consent:", e)` at `sign-up.tsx:219` bypasses `lib/log.ts`.
- **HOME-SIGNOUT-01 expectation in the audit brief is out of date.** The brief said "expect zero `signOut(` call sites in UI code"; there is one, in `app/(app)/profile.tsx:123`, and it is the intended `af1ce20` wire-up — `security.md` still lists HOME-SIGNOUT-01 as an open P1, but it shipped.
- **`docs/CORNR_CANONICAL.md` describes Section 6 as "v1, 9 tables"** but the LR-PROD-SYNC run log and `list_tables`-style evidence in `prod-sync-packets.md` describe **10 public tables** on prod post-migration (original 6 + `consent_events`, `editorial_content`, `archetype_history`, `engagement_events`). The "9 tables" heading predates the bridge-sprint additions — a canonical-content update candidate for the planning session.
- **`docs/operations/security.md` is large (360 lines) and contains a live "open items" list** (HOME-SIGNOUT-01 [shipped], ENV-VAR-MIGRATE, SIGNUP-EMAIL-REGEX-INCONSISTENT, REVEAL-FAILURE-TELEMETRY, ANON-PUBLIC-USERS-PATH, etc.) plus the now-RESOLVED LR-PROD-SYNC entry. Worth a triage pass when MC is updated — several items reference each other and at least one (HOME-SIGNOUT-01) is stale.

---

## Summary

Report written to `docs/audits/repo-audit-2026-05-09.md`.

1. **All gates clear** — branch `feat/reveal-1b-two-experience` @ `ad5e052`, tree clean, drift exit 0; `stash@{0}` holds the deferred canonical LR-PROD-SYNC entry, `stash@{1}` is a stale 21-Apr WIP.
2. **The branch is 48 commits ahead of `main`** (not ~16) — it carries REVEAL-1B, the design-token SoT pipeline, SEC-AUDIT-03/04, logging/discipline infra, brand-icon cascade, and canonical Sections 0/13/14; `main` is far behind. 44 clean / 4 large (each coherent) / 0 mixed / 0 concerning.
3. **`tsc --noEmit` is not enforced on commit** — `core.hooksPath=.githooks` runs only the KI-02 canonical-stamp hook; the `simple-git-hooks` tsc hook (still described in `CLAUDE.md §"Pre-commit hook (v4)"`) is dormant.
4. **Several docs are stale vs reality:** `CLAUDE.md` "Test strategy" (jest + 5 tests now exist), `CLAUDE.md` "Pre-commit hook (v4)", canonical "Section 6 — 9 tables" (now 10 on prod), `security.md` HOME-SIGNOUT-01 (shipped in `af1ce20`); and the canonical SHA stamp understates how far canonical content is ahead of PK.
5. **PII boundary is implemented:** Sentry `beforeSend` scrubs emails/UUIDs/postcodes + secret-keyed fields; PostHog is `identified_only` with `identify()` on signup and `reset()` chained after `signOut()`; `handle_new_user` trigger + `users_id_fkey` FK are live on prod (LR-PROD-SYNC closed), though `sign-up.tsx` still does the redundant client-side `from("users").update()`.
