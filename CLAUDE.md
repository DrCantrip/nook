# CLAUDE.md — Cornr Project Rules

## Current build status
Current sprint: Sprint 1
Current task: T9
Last completed: T8 Home screen shell
Blocking issues: NONE

## Staging test users (permanent — do not delete)

These exist in Supabase staging (project tleoqtldxjlyufixeukz) for RLS verification. They are reused for every schema change that touches user-scoped tables. Do not recreate. Do not seed with realistic data. Never copy to production.

- test-a@cornr.test → 0e675e05-63de-46a0-bdfb-cb101268bf3f
- test-b@cornr.test → de7925d8-84f3-49f5-84b8-e6fe01543ef2

Last RLS verification: 7 Apr 2026 (Prompt A, all 6 tables passed).

## Testing & Debugging Discipline (read every session)

### Logging — the only allowed pattern

All logging in `app/`, `components/`, `lib/`, `hooks/`, and edge functions
goes through `lib/log.ts`. Never write `console.log` in committed code
(except inside `lib/log.ts` itself).

```typescript
// lib/log.ts — the wrapper. Do not modify without explicit instruction.
const isDev = __DEV__;
type Level = "debug" | "info" | "warn" | "error";

const fmt = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (v instanceof Error) return `${v.name}: ${v.message}\n${v.stack ?? ""}`;
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
};

export const createLogger = (tag: string) => ({
  debug: (...args: unknown[]) => { if (isDev) console.log(`[${tag}]`, ...args.map(fmt)); },
  info:  (...args: unknown[]) => console.log(`[${tag}]`, ...args.map(fmt)),
  warn:  (...args: unknown[]) => console.warn(`[${tag}]`, ...args.map(fmt)),
  error: (...args: unknown[]) => console.error(`[${tag}]`, ...args.map(fmt)),
});
```

**Usage — top of every file that logs:**

```typescript
import { createLogger } from "@/lib/log";
const log = createLogger("SwipeDeck"); // tag = component or module name

log.debug("card removed", { id: card.id, remaining: deck.length });
log.info("swipe complete", { direction, ms: Date.now() - startedAt });
log.warn("retrying haiku", { attempt, errorCode });
log.error("auth guard failed", err); // err can be Error or any object
```

### Banned patterns

- `console.log(obj)` directly — collapses to `[Object object]` in some Metro paths.
- `console.log("foo", JSON.stringify(obj))` at call sites — the wrapper handles it.
- Logging without a tag (`createLogger("")` is a smell).
- Logging full Supabase response objects unfiltered (PII risk; log `data?.id, error?.message` instead).
- `console.log` left in code at end of task — see "Self-test before declaring done" below.

### Tag naming convention

Tags use PascalCase and match the most specific scope. Two valid forms:

**Module-scoped tags** (default for code that outlives a single task):
- Component: `SwipeDeck`, `EditorialCard`, `SwipeCard`
- Hook: `useAuthGuard`, `useEngagementEvents`
- Module: `SupabaseClient`, `HaikuPrompt`, `ConsentSplit`
- Edge function: `EdgeFn:scoreMatch`, `EdgeFn:rotateHaiku`
- Migration runtime check: `RLS:engagementEvents`

**Task-scoped tags** (for work that is task-scoped per R-26):
- Active task ID: `SEC-AUDIT-04`, `NAV-DEAD-END`, `HOME-SIGNOUT-01`

This makes Metro logs grep-able: `[SwipeDeck]` filters one component instantly;
`[SEC-AUDIT-04]` traces every line written during that audit task across all
modules.

### Test strategy (the only one that exists right now)

Cornr is pre-6-user-gate. There are NO unit test suites and NONE will be
added without explicit instruction. The test pyramid is:

1. **`npm run check`** — `tsc --noEmit` — Claude Code runs this after
   every code change, before declaring done. Failure is non-negotiable.
   (ESLint is not yet installed; addition is a separate follow-up task.)
2. **Manual smoke checklist** — written into every task's Acceptance Criteria
   by Claude.ai. Daryll executes on iPhone via Expo Go or EAS dev build,
   whichever is current.
3. **TestFlight beta + mock-first user sessions** — the real verification.
4. **Sentry error rate + PostHog event-fire confirmation** — post-deploy.

**Do not propose adding Jest, Vitest, Detox, Maestro, or any test framework
unless explicitly asked.** "Add tests" is not a yes-by-default request in
this repo at this stage.

### Self-test before declaring done — mandatory checklist

Before Claude Code says "task complete" or commits, it MUST in this order:

1. Run `npm run check`. If it fails, fix and re-run. Do not declare done
   on a red build.
2. Grep the diff for `console.log` — if any new ones outside `lib/log.ts`,
   replace with `log.debug` or remove. Banned.
3. Grep the diff for `// TODO`, `// FIXME`, `// @ts-ignore`, `as any`. If
   any new ones, list them in the response and ask whether they're
   acceptable.
4. For any new `log.debug` added during debugging, decide explicitly:
   keep (it's load-bearing for a future bug) or remove (it was scaffolding).
   Do not commit speculative debug logs.
5. List in the response, under "Verified" and "Unverified":
   - **Verified**: which acceptance criteria are now machine-checkable-true
     (e.g., "tsc passes; new component renders in isolated Storybook-style
     test in `app/_dev/`; RLS migration applied locally").
   - **Unverified**: which require Daryll's device or a live Supabase
     project to confirm. Be specific.

If 5 cannot be filled in because the acceptance criteria were vague, stop
and ask Daryll to clarify before continuing. Do not invent acceptance.

### Debugging escalation order

When a runtime error or unexpected behaviour appears, follow this order
(do not skip steps):

1. **Read the Metro/dev server log.** Filter by the relevant `[Tag]`. The
   prefix-and-stringify wrapper makes this useful.
2. **Reproduce in isolation.** If it's a component, render it alone in
   `app/_dev/<scratch>.tsx`. If it's an edge function, call it via
   `curl` or `supabase functions invoke`.
3. **Check the SDK 54 trap list** before assuming a code bug:
   - reanimated/worklets version mismatch → `npx expo start --clear`
     and check `npx expo-doctor` for major-version mismatches.
   - babel.config.js with `react-native-reanimated/plugin` → REMOVE,
     it's handled by `babel-preset-expo` in SDK 54+.
   - Edge-to-edge layout glitch on Android 16 → expected; do not "fix"
     by disabling, it cannot be disabled in SDK 54.
4. **Check Sentry dev environment** — the SDK is initialised with
   `environment: __DEV__ ? "development" : "production"`. Errors appear
   with breadcrumbs.
5. **Check Supabase logs** for the right surface: client 403 → Postgres
   policy logs (NOT just function logs). Test the failing query in SQL
   editor BUT REMEMBER the SQL editor runs as `postgres` superuser and
   bypasses RLS — reproduce using `auth.login_as_user('<email>')` to
   simulate the actual user.
6. **Only then ask Daryll**, and when you do, include: the failing log
   line (with prefix), the exact reproduction step, the hypothesis you've
   ruled out, and the hypothesis you're about to test. No vague
   "something seems off."

### RLS verification snippet (use when touching policies)

When adding/modifying any RLS policy, append this verification block to
the migration file as a comment, and run it locally:

```sql
-- RLS verification (run locally; do not deploy):
-- 1. As anonymous:
SET request.jwt.claims TO '{"role":"anon"}';
SET ROLE anon;
-- expected: rows hidden
SELECT * FROM <table> LIMIT 1;

-- 2. As authenticated non-owner:
CALL auth.login_as_user('test-non-owner@cornr.dev');
SELECT * FROM <table> LIMIT 1;

-- 3. As authenticated owner:
CALL auth.login_as_user('test-owner@cornr.dev');
SELECT * FROM <table> LIMIT 1;

RESET ROLE;
```

If `auth.login_as_user` doesn't exist yet in the project, install the
helper from the canonical Supabase test gist before adding the first
RLS-protected table.

### PostHog / Sentry development hygiene

- **PostHog**: dev events go to a separate PostHog project (`Cornr-Dev`),
  not production. The init key is read from `EXPO_PUBLIC_POSTHOG_KEY` and
  switches by `__DEV__`. Do not change this without instruction.
- **Sentry**: single project, `environment` tag separates dev/prod. Do
  NOT add `Sentry.captureException` calls in code — the SDK auto-captures
  thrown errors. Manual capture only for caught-and-handled errors that
  are still worth seeing (rare).
- When verifying a new analytics event during a task, confirm it fired
  by checking the PostHog `Cornr-Dev` Live Events feed, not by adding
  a `console.log` next to the `posthog.capture` call.

### Commit hygiene during testing

- Do not commit `log.debug` lines that were added solely to chase one
  bug. Remove them once root-caused, or convert to `log.info`/`log.warn`
  if they're load-bearing.
- Do not commit changes to `lib/log.ts` itself unless explicitly
  instructed — the wrapper is stable surface area.
- Do not commit `// TODO: fix later` without an issue/ticket reference.
- One observable change per commit, matching the Acceptance Criteria
  granularity of the prompt.

## Stack
React Native + Expo SDK 54 (managed workflow). NEVER eject.
expo-router v6 file-based navigation.
StyleSheet.create + src/theme/tokens.ts for styling. NativeWind permanently removed (6 Apr 2026).
@tanstack/react-query for data fetching.
Supabase (Pro, EU region) for auth, DB, Edge Functions.
posthog-react-native for analytics (EU region Frankfurt).
phosphor-react-native for icons ONLY. NEVER @expo/vector-icons or Lucide.

## Key paths
app/ — expo-router screens and layouts
src/hooks/ — custom hooks (useAuth, useStyleProfile)
src/content/strings.ts — ALL user-facing copy
src/theme/tokens.ts — colour constants, spacing, shadows, archetypeTheme()
src/lib/supabase.ts — Supabase client
src/providers/ — context providers (QueryProvider, etc.)

## Critical rules
NEVER use AsyncStorage for auth — use expo-secure-store (Keychain).
NEVER hardcode any colour — import from src/theme/tokens.ts only.
NEVER hardcode any UI string — import from src/content/strings.ts.
ALL API keys: Supabase Edge Function secrets ONLY. Never in .env or app code.
JWT verified at top of EVERY Edge Function. Unauthenticated -> 401.
Camera permission NOT declared in Info.plist in v1.
No Gas Safe badge in v1. Not anywhere.
"archetype" NEVER appears in UI copy.
activeOpacity={0.85} on ALL Pressable and TouchableOpacity.
Run ALL schema migrations on staging (nook-staging) first.
No PII in Anthropic API requests — archetype, room type, budget only.
All user input in AI prompts wrapped in <user_context></user_context>.

## Voice gate — applies to any task touching user-facing copy
If a task adds, modifies, or generates ANY user-facing string (button labels, screen copy, error messages, empty states, notifications, expander text, headlines, microcopy, placeholder text, accessibility labels), the voice gate runs before commit.
Authoritative source: docs/CORNR_BRAND_DESIGN_SYSTEM_v3 Sections 2.2 (voice table), 2.3 (never say), 2.4 (always use).

Banned words — NEVER appear in user-facing copy:
curated, bespoke, journey, unlock, stunning, AI-powered, discover (not as nav label or button), elevate, reimagine, transform, algorithm, optimise, leverage, synergy, "curated by AI"

Preferred phrases — reach for these where natural:
"Chosen because..." (AI rationale prefix), "Your [archetype] style", "Every corner, considered.", "find your Cornr", "feels like you", "picked for you", "your space, your story"

### R-26 — LLM fingerprint patterns (check before committing user-facing copy)

Run manually before committing any src/content/ or errors.ts / legal.ts changes:

  grep -rn " — " src/content/ supabase/functions/_shared/
  grep -rnE "\b(the move|vibe|iconic|honestly)\b" src/content/

Expected: empty. If hits, fix or justify case-by-case.

Also check for negation-reframe with abstract pairs (judgment, not regex):
  "X isn't Y — it's Z" or "X isn't Y. It's Z."
  where X and Y are abstract nouns.

BANNED: spaced em-dash " — " in user-facing strings. Replace with full stop, comma, colon, or rewrite. Unspaced em-dash for compound modifiers ("mid-century—influenced") is allowed but rare; usually a comma works.

BANNED: negation-reframe pattern when both sides are abstract nouns. Banned in essence lines regardless. Allowed once per piece if concrete-payoff test passes (named thing, concrete detail).

Register-adjacent phrases also banned: "a contrast move", "the honest-contrast move" (same family as "the move").

Full-spec voice-check script deferred to its own task; the manual grep precedent above is authoritative until then.

Error state rules (all four must hold):
1. Explain what happened in plain language
2. Say what to do next
3. Reassure that nothing is lost (where relevant)
4. Never blame the user, never use technical language (no 401, timeout, exception, null, undefined)

Tone by context:
- Archetype/result screens: warm, personal, affirming
- Product rationale: specific, knowledgeable, starts with "Chosen because..."
- Errors: calm, reassuring, actionable
- Onboarding: encouraging, low-pressure
- Disclosure: honest, brief, adult
- Marketing: considered, aspirational

## Supabase patterns
Supabase client returns PromiseLike, not Promise — wrap in Promise.resolve() when passing to Promise.all or other APIs expecting a real Promise.
Never call useAuth() inside another hook — causes stale closures and infinite re-render loops. Keep useAuth() calls at the component level only.

## Design System

Read this section before generating any UI code. These rules override all defaults.

### Philosophy
Restraint over decoration. Every element earns its place. White space is confidence.
Cornr should feel like a quality UK lifestyle editorial — Livingetc, Dezeen residential, a considered independent homeware brand. Not aspirational-to-the-point-of-unattainable. Warm, honest, unhurried.

### Prohibited patterns — check before writing any component
- Hex values in component files — ESLint will fail the build; import from tokens.ts
- `boxShadow` or CSS shadow syntax — use shadow tokens from tokens.ts
- Scale on press (`transform: [{ scale }]`) — use `activeOpacity: 0.85` only
- Hover states, focus rings via CSS pseudo-selectors — this is React Native
- Cool blues, purples, greys outside the warm palette below (exception: archetype theme gradients use territory-specific palettes from archetypeTheme())
- Dark mode variants — not in scope for v1
- Inline styles — use StyleSheet.create only
- NativeWind, Tailwind, CSS-in-JS — permanently removed
- @shopify/react-native-skia — not in v1; breaks Expo Go QR workflow

Icon background uses dedicated token #C4785A (warm terracotta). Separate from accent-surface — used only for the app icon asset, not in runtime UI.

### Styling pattern
`StyleSheet.create` + `src/theme/tokens.ts`. No exceptions.
Archetype-themed screens consume `archetypeTheme(id)` from tokens.ts — never hardcode archetype-specific colours in components.

### Palette — semantic roles (non-themed screens)
<!-- TOKEN-DOCS:START name=palette -->
| Token          | Hex       | Use                                                         |
|----------------|-----------|-------------------------------------------------------------|
| ink            | #1A1814   | All text, headings, wordmark                                |
| cream          | #FAF7F3   | List/home screen backgrounds                                |
| white          | #FFFCF9   | Card surfaces, focus screens, inputs                        |
| accent         | #9E5F3C   | Interactive text, links, borders, icons, focus rings        |
| accent-surface | #BE7458   | PrimaryButton bg and filled interactive surfaces ONLY       |
| warm-600       | #6B6358   | Secondary text, UI labels, form labels                      |
| warm-400       | #948A7D   | Placeholders, inactive icons, inactive nav                  |
| warm-200       | #D4CBC0   | Light borders, dividers, disabled button bg                 |
| warm-100       | #EDE8E2   | Card backgrounds, skeleton loading                          |
| teal-bg        | #F0FDFA   | AI rationale panel bg — ONLY when content source is AI      |
| teal-text      | #134E4A   | AI rationale text — ONLY when content source is AI          |
<!-- TOKEN-DOCS:END name=palette -->

90/10 rule: ink + cream/white = 90% of every non-themed screen. Accent at 10% or less.

WCAG AA is a hard rule: every text colour must pass 4.5:1 contrast on its background. Every UI boundary must pass 3:1. No exceptions.

Teal means "AI generated this content." Never use teal for non-AI elements.

### Archetype visual themes (themed screens: reveal, share card, profile badge)
Defined in `src/theme/tokens.ts` via `archetypeTheme(id: ArchetypeId)`.
Returns: gradientStart, gradientMid, gradientEnd, accent, grainOpacity.
Full spec: see `cornr-brain/design/archetype-visual-identity.md` in the Obsidian vault.

7 archetype IDs (canonical, locked): curator, nester, maker, minimalist, romantic, storyteller, urbanist.
DEAD SET — never use: traditionalist, free_spirit, purist, dreamer, modernist.

Graduated intensity model:
- Reveal screen + share card: 100% archetype theming (full gradient, grain, archetype typography)
- Home tab: ~40% (archetype-tinted header, coloured accents)
- Profile: ~20% (archetype badge, colour ring)
- All other screens: 0% — use the semantic palette above

### Gradient rules
LinearGradient is permitted ONLY on:
1. Archetype reveal screen panels 1-4 (three-stop gradient from archetypeTheme)
2. Share card background (same gradient)
3. White-to-transparent fade at bottom of SwipeCard image
4. Future archetype-themed surfaces per graduated intensity model

Never use LinearGradient on non-themed screens. Never create gradients from hardcoded hex values — always consume archetypeTheme().

### Typography — hierarchy from font family, not colour
Both headings and body text use ink (#1A1814) on non-themed screens.
On themed screens (reveal, share card), all text uses white (#FFFCF9).

<!-- TOKEN-DOCS:START name=typography -->
| Role              | Family       | Size | Weight     | Line-height | Tracking |
|-------------------|-------------|------|------------|-------------|----------|
| Display           | Lora        | 34px | 700        | 40px        | -0.5px   |
| Screen title      | Lora        | 22px | 600        | 28px        | -0.3px   |
| Card heading      | DM Sans     | 17px | 600        | 22px        | 0        |
| Body              | DM Sans     | 16px | 400        | 24px        | 0        |
| UI label          | DM Sans     | 14px | 500        | 20px        | 0        |
| Badge/chip        | DM Sans     | 12px | 600        | 16px        | +0.4px   |
| CTA label         | DM Sans     | 16px | 600        | —           | +0.2px   |
| Editorial/essence | Newsreader  | 18px | 400 italic | 28px        | 0        |
<!-- TOKEN-DOCS:END name=typography -->

Reveal screen hero scale (overrides above on themed screens only):
| Role              | Family          | Size | Weight     |
|-------------------|----------------|------|------------|
| Archetype name    | Lora           | 48px | 600 (SemiBold) |
| Behavioural truth | NewsreaderItalic| 28px | 400 italic |
| Style territory   | DM Sans        | 16px | 400        |
| Period modifier   | NewsreaderItalic| 18px | 400 italic |

Lora = editorial/heading signal. DM Sans = functional/body signal. Newsreader = essence lines,
behavioural truths, and AI reveal copy only. The behavioural truth must be the LARGEST text on
the reveal screen — it IS the product moment.

### Radius — communicates element type, never uniform
radius-badge: 6px · radius-button: 10px · radius-input: 12px · radius-card: 16px ·
radius-modal: 20px top-only · radius-swipe: 20px

### Shadows — tokens only
shadow-card: opacity 0.06, radius 12, offset {0,1}, elevation 2
shadow-swipe: opacity 0.12, radius 20, offset {0,8}, elevation 8
Import from tokens.ts. Never write shadow values by hand in a component.

### Spacing
Screen horizontal margins: 20px. Screen top (below header): 24px. Screen bottom: 32px.
Between major sections: 32px. Between related items: 20px. Card internal: 20px h, 16px v.
Between cards in list: 12px gap.

### Component behaviour
- Pressable: `activeOpacity: 0.85` + `haptics.selectionAsync()` on every interactive element
- Never use scale transform on press
- Minimum touch target: 44x44pt on every Pressable
- `accessibilityRole` and `accessibilityLabel` required on every interactive element (WCAG AA hard rule)

### Grain overlay
`src/components/atoms/GrainOverlay.tsx` — static SVG noise texture for archetype-themed screens.
Props: `opacity` (from archetypeTheme().grainOpacity). Wrapped in React.memo, pointerEvents="none".
Layer above gradient, below text. Only used on themed screens.

### Icons
`phosphor-react-native` only — never Lucide, Heroicons, or @expo/vector-icons.
Weight: `light` default. `fill` for active nav, wishlisted heart, accreditation badges.
Sizes: 20px in cards/lists · 24px for action buttons · 18px in badges. Never mix sizes in one component.

## Pre-commit hook (v4)
A simple-git-hooks pre-commit hook runs npx tsc --noEmit before every commit. If TypeScript errors exist, the commit is blocked. This prevents the silent-TS-error class of bug from reaching main.

## Navigation rules
After adding or modifying any router.push() or router.replace() call, verify the target route file exists. Run: find app/ -name '*.tsx' to list all routes. If the target doesn't exist, stop and flag it — don't commit broken navigation.

## ProductCard rules
Rationale always starts "Chosen because..." — never any other prefix
Teal panel: background #F0FDFA, text #134E4A
Affiliate disclosure on Products screen header only — from STRINGS.affiliateDisclosure

## Trades v1 rules
Companies House badge ONLY. No Gas Safe badge.
Results sorted: rating DESC, review_count DESC.
No messaging, no quotes, no booking. Call button (tel: link) only.

## DO NOT
Import from @expo/vector-icons, Lucide, or Heroicons
Hardcode any colour value
Hardcode any copy string
Use AsyncStorage for auth tokens
Store API keys outside Supabase Edge Function secrets
Add camera permission to Info.plist in v1
Show Gas Safe badge
Write "archetype" in any user-visible text
Use activeOpacity other than 0.85
Apply identical border-radius to all elements
Run migration SQL on production without testing on staging first
Put layout properties (flex, justifyContent, alignItems, minHeight, backgroundColor) inside Pressable style callbacks. Only opacity goes in the callback. Everything else in StyleSheet.create.

## Build rules (added 12 April 2026)
NativeWind is permanently removed (6 Apr). Use StyleSheet.create + src/theme/tokens.ts. No className, no cssInterop, no tw(). ESLint bans hex codes in components.
expo-router v6: app/index.tsx is root entry. Auth guard is ALLOW-LIST only — protected groups (app) and (onboarding). Never deny-list.
