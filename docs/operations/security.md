# Security operations

Audit closure records for security-related work. Each entry captures the spec
source, what was implemented, deliberate deviations, verification evidence,
and any followups generated.

---

## Audit Closure Record — SEC-AUDIT-03

- **Audit ID:** SEC-AUDIT-03
- **Title:** Sentry beforeSend PII scrubbing
- **Spec source:** 8 April 2026 panel, A1
- **Date closed:** 25 April 2026

### Implemented

`src/services/sentry.ts` now wires a `beforeSend` hook into `Sentry.init()`.
The hook recursively walks the event payload and applies three PII regexes
(email, UUID, full UK postcode) to every string, while replacing the value
of any field whose key matches `/email|password|token|api[_-]?key|secret/i`
with the literal `[scrubbed]`. Walked fields: `message`, `transaction`,
`fingerprint`, `tags`, `extra`, `contexts`, `user`, `breadcrumbs`,
`exception`, `request`. Non-plain-object values (Date, Error, Map, Set,
class instances) are stringified via `String(value)` and then scrubbed
rather than recursed into, to avoid losing identity or leaking through
inherited properties.

### Deviations from spec

- **Environment:** kept `__DEV__ ? "development" : "production"` instead of
  `process.env.EXPO_PUBLIC_ENV ?? 'development'`.
  - Rationale: `EXPO_PUBLIC_ENV` is not yet plumbed through EAS staging /
    production profiles. Switching now would silently collapse all
    environments to `'development'` and break Sentry's environment filter.
  - Followup: MC task **ENV-VAR-MIGRATE** (P2), anchored to Sprint 4
    T-RENAME when EAS profiles are formalised.

- **Postcode regex:** full postcode `/\b[A-Z]{1,2}[0-9R][0-9A-Z]? ?[0-9][A-Z]{2}\b/gi`
  instead of the district-only pattern `/\b[A-Z]{1,2}[0-9R][0-9A-Z]?\b/g`
  named in the spec.
  - Rationale: districts produce false positives on internal identifiers
    (task IDs like `T9`, hex fragments, trace IDs) and miss the
    personally-identifying inward part of the postcode anyway. The 8 April
    spec was wrong on this point.
  - Followup: none — the deviation is the correct implementation.

- **Coverage:** added `event.message`, `event.tags`, `event.fingerprint`,
  and `event.transaction` to the walked field list, beyond the six fields
  named in the spec (`extra`, `contexts`, `user`, `breadcrumbs`,
  `exception`, `request`).
  - Rationale: top-level `message` strings carry PII via `captureMessage`
    capture paths; `tags` and `transaction` are also serialised to Sentry
    EU. Partial coverage defeats the audit.
  - Followup: none.

### Test procedure

A temporary route at `app/_dev/sentry-test.tsx` exposes four buttons that
trigger distinct PII payloads:

1. Standard PII — email, fake UUID `00000000-0000-0000-0000-000000000001`,
   full postcode `SW1A 1AA`, sent via `Sentry.captureException`.
2. Compact postcode — email, postcode `SW1A1AA` (no space), sent via
   `Sentry.captureException`.
3. Embedded UUID + email in a JSON-like payload string, sent via
   `Sentry.captureException`.
4. Negative control — `Sentry.captureMessage` with no PII, to confirm the
   scrubber doesn't over-scrub clean events and to exercise the
   `captureMessage` capture path.

Run on phone via Expo Go on staging. Tap each button with ~5s spacing.
Check Sentry EU dashboard at `https://cornr-technologies.de.sentry.io`
that all PII appears as `[email scrubbed]`, `[uuid scrubbed]`, or
`[postcode scrubbed]`, and that test 4 arrives unmodified.

### Verification

25 April 2026 — fired test event from `app/(app)/home.tsx` `__DEV__`-guarded
button on staging. Captured in Sentry US issue REACT-NATIVE-6
(cornr-technologies.sentry.io). Issue title and Stack Trace Error value
both confirmed all three scrub patterns: `[email scrubbed]`,
`[uuid scrubbed]`, `[postcode scrubbed]`. Two events transmitted (button
tapped twice in error), both scrubbed identically. Test button removed in
same commit.

### Followups generated

- **SEC-AUDIT-05 (P0):** Edge Function Sentry config audit. Blocks S3-T1A.
  This audit covers the React Native client only — Edge Functions in
  `supabase/functions/` may have their own Sentry init that needs the
  same `beforeSend` treatment.
- **SENTRY-EU-MIGRATION (P1):** Sentry org `cornr-technologies` is on the
  US region (`cornr-technologies.sentry.io`), not EU as memory and
  canonical claim. Migration is non-trivial — Sentry does not support
  cross-region migration. Options: accept and update canonical to reflect
  US region; or recreate org in EU region and redirect DSN (requires
  re-instrumenting and accepting loss of issue history). GDPR
  implications either way. Decide before any public release.
- **HOME-SIGNOUT-01 (P1):** Profile screen sign-out missing — observed
  during SEC-AUDIT-03 testing that sign-out is unreachable from Profile
  tab. Reclassified from HOME-REGRESSION-01 after SEC-AUDIT-04 audit
  confirmed `signOut()` exists in `useAuth.ts` but has zero call sites:
  this is a missing-since-day-one gap, not a regression. Needs design
  treatment, not just a wire-up.
- **ENV-VAR-MIGRATE (P2):** Migrate Sentry environment from `__DEV__`
  ternary to `EXPO_PUBLIC_ENV`. Anchored to Sprint 4 T-RENAME.
- **SENTRY-DPA-REVIEW (P2):** Confirm Sentry DPA is current. Tied to
  PL-DPA-TRAIL.
- **SENTRY-GEO-IP (P2):** Sentry server-side IP geolocation enrichment is
  active (issue REACT-NATIVE-6 showed Harrogate, GB attached as Geography
  context). This bypasses `beforeSend` — geolocation is added server-side
  after transmission. Decide: disable in Sentry project settings, or
  document acceptance. Not blocking, but worth a deliberate decision
  before TestFlight.
- **SEC-AUDIT-03-EXTENDED (P3):** Multi-event hardening — add the round-2
  test cases that were dropped in the pivot to single-button: compact
  postcode (no space, e.g. `SW1A1AA`), embedded UUID + email in
  JSON-like payload string, negative test via `Sentry.captureMessage`
  to confirm clean events pass through unmodified. Anchored to
  pre-TestFlight EAS build verification.
- **BEFORESEND-PERF (P3):** Profile `beforeSend` overhead at scale.
  Recursive walker is O(n) over event size; on small events it's
  negligible, but worth measuring once we have realistic event volume.
  Post-TestFlight.
- **MC-SYNC-SEC-AUDIT-03 (P2):** Apply SEC-AUDIT-03 closure + 8
  followups to MC artifact in claude.ai. Source: this file's
  SEC-AUDIT-03 section. Owner: next claude.ai planning session.

---

## Audit Closure Record — SEC-AUDIT-04

- **Audit ID:** SEC-AUDIT-04
- **Title:** PostHog `identified_only` + identify/reset flow
- **Spec source:** 8 April 2026 panel, A2
- **Date closed:** 29 April 2026

### Implemented

`src/services/posthog.ts` constructor now passes
`personProfiles: "identified_only"` so anonymous distinct_ids no longer
create persistent person profiles. The wrapper `identify()` and `reset()`
functions are now `async` so callers can await ordering. Sign-up
(`app/(auth)/sign-up.tsx`) and sign-in (`app/(auth)/sign-in.tsx`) flows
both call `await identify(userId)` immediately after successful auth,
using the Supabase user UUID — anonymous events from the same session
are auto-merged into the new identified person via PostHog's distinct_id
aliasing. Sign-out in `useAuth.ts` is now `async` and runs
`supabase.auth.signOut()` first, then `await reset()`, ensuring no final
event leaks to the identified profile.

### Deviations from spec

- **Property name:** SDK API uses `personProfiles` (camelCase), not
  `person_profiles` (snake_case) as specified.
  - Rationale: `posthog-react-native` types the option as
    `personProfiles`. The web/JS SDK uses snake_case; React Native uses
    camelCase. Same semantics; SDK-specific naming. Not a behavioural
    deviation, just naming reality.
  - Followup: none.

- **Sign-in identify() added beyond spec scope.** A2 specified
  sign-up → identify only. Sign-in carries the same risk pattern
  (returning user authenticating from a fresh device starts anonymous,
  pre-auth events orphan without identify). Added in same commit.
  - Rationale: spec gap, not deviation. Documented for completeness.
  - Followup: none.

- **Sign-out ordering.** Spec didn't specify ordering between
  `signOut()` and `reset()`. Implemented as `signOut()` first
  (await), then `reset()` (await). Reverse order risks firing a final
  event under the identified profile because PostHog session is still
  active when the auth state change triggers any cleanup events.
  - Rationale: race-condition prevention, not deviation.
  - Followup: none.

### Verification

29 April 2026 — partial pass, sufficient to close. Dashboard at
`eu.posthog.com` (project 142615, EU region confirmed). COUNTs 0/1/2
verified: 0 → 0 → 1, confirming `identified_only` and `identify()`
both work as specified. Events merged on identify: confirmed via 4
distinct_ids aliased to the new identified person. Sign-out `reset()`
implementation verified via Metro logs (320ms `signOut` → `reset` gap
from earlier test); dashboard verification of COUNT 3 + post-signout
event isolation deferred to first post-mock-first end-to-end test due
to NAV-DEAD-END preventing pre-quiz signed-in users from reaching the
dev sign-out button.

### Followups generated

- **POSTHOG-EU-VERIFY (RESOLVED, 29 April 2026):** Dashboard at
  `eu.posthog.com` (project ID 142615) confirmed live and matching the
  `eu.i.posthog.com` SDK ingest host. Memory and canonical were
  correct about PostHog being EU-region — the Sentry US/EU surprise
  did not generalise. No migration needed.
- **NAV-DEAD-END (P1):** Post-signup users with no `archetype_history`
  are stranded on Style Swipe / Reveal placeholder screens with no way
  back to Home or to sign-out. Real users hitting empty-quiz-state
  would be in the same trap. Related to BS2-T0 entry-point work — the
  entry-point flow needs a path back to Home.
- **HOME-SIGNOUT-01 (P1, reclassified from HOME-REGRESSION-01):**
  Profile sign-out has never been wired to a UI surface. `signOut()`
  exists in `useAuth.ts` but no consumer. Needs design treatment, not
  just a wire-up.
- **SIGNUP-EMAIL-REGEX-INCONSISTENT (P2):** Sign In screen rejects
  RFC-valid plus-aliases (`user+tag@gmail.com`); Sign Up screen accepts
  them. Inconsistent client-side regex between screens.
- **MC-SYNC-SEC-AUDIT-04 (P2):** Apply SEC-AUDIT-04 closure to MC
  artifact in claude.ai. Same pattern as MC-SYNC-SEC-AUDIT-03.
- **SUPABASE-STAGING-EMAIL-CONFIRM (RESOLVED, 29 April 2026):** Staging
  required email confirmation; redirect URL pointed at localhost
  (unreachable from phone). Disabled in Supabase dashboard at
  2026-04-29 13:09. Production project must keep email confirmation
  enabled.
- **STAGING-TEST-USER-DOMAIN (P3):** Supabase signup validates email
  deliverability (MX records). `.test` and unbought domains are
  rejected. Use real Gmail with dot-variant for fresh test users
  (e.g. `daryll.cowan2026@gmail.com`).
- **EMPTY-STATE-STYLING (P3):** Pre-quiz "Style Swipe" and "couldn't
  find your quiz result" screens lack brand styling. Acceptable for
  dev placeholders but worth tokenising before TestFlight.
- **DEV-LOG-LOVE (P3):** Stray `console.log("LOVE")` fires during nav.
  Find and remove (or migrate to tagged logger when convention lands).
- **DEV-SIGNOUT-REACHABILITY (P3):** `DevSignOutButton` was on Home
  only; pre-quiz users couldn't reach it. Moot once HOME-SIGNOUT-01
  lands a real sign-out path. The dev button has been removed in this
  commit.
- **REVEAL-RETRY-STATE (RESOLVED, 5 May 2026):** Shipped retry state
  (triggerKey/retryCount/lastFailureAt), `revealBusy` rate-limit copy
  branch (≥2 failures within 90s window), and AbortController on the
  primary archetype-history query in both reveal-essence and
  reveal-share. NetworkErrorScreen now receives a real `onRetry`
  callback. Post-success housekeeping calls (reveal_completed_at
  read/write) intentionally NOT signal-guarded — see commit
  `feat(reveal): retry state + revealBusy + AbortController on
  resolution query (REVEAL-RETRY-STATE)`. Originally captured by
  REVEAL-ERROR-COPY task, 5 May 2026.
- **LOG-CONSOLE-WARN-AUDIT (P2):** `NetworkErrorScreen` contains two
  raw `console.warn` calls (the retry-fallback and dismiss-fallback
  warnings). CLAUDE.md's discipline section bans `console.log` outside
  `lib/log.ts` but does not explicitly cover `console.warn` /
  `console.error`. Decide: extend the ban to all `console.*`, or add
  `warn`/`error` levels to `lib/log.ts` and migrate. Either way, the
  `NetworkErrorScreen` warns become fallback signal channels for
  unwired retry intents (per REVEAL-ERROR-COPY) — preserving them
  intentionally is a valid choice, but it should be documented.
  Source: REVEAL-ERROR-COPY task, 5 May 2026.
- **DEV-RESULT-CLEANUP (P2):** Either delete
  `app/(auth)/dev-result.tsx` or `__DEV__`-gate the route at the
  layout level before TestFlight. Currently a production user could
  URL-type their way to it and see un-gated motion + dead UI. The
  file's own header comment notes "Retired by REVEAL-1B" — slated for
  deletion. Excluded from REDUCED-MOTION-AUDIT scope on this basis.
  Source: REDUCED-MOTION-AUDIT task, 5 May 2026.
- **MOTION-TOKENS-MIGRATE (P2):** When DESIGN-TOKENS-CANONICAL-SOT
  lands, `src/theme/motion.ts` must be in scope of the
  auto-generation pipeline. Markdown derivation should include the
  three motion registers (`considered` / `gentle` / `immediate`) plus
  the canonical philosophy comment from the file header. The
  reduced-motion fallback rule belongs in derived docs too.
  Source: REDUCED-MOTION-AUDIT task, 5 May 2026.
- **STAGGERED-REVEAL-WRAPPER (P3):** Build a `<StaggeredReveal>`
  component for reveal-essence polish (DESIGN-03-A) on top of
  `motion.ts`. Implements canonical Section 14.7's sequence (tint →
  name → essence → motif → depth block → CTA at considered-register
  intervals). Lifts the staggered pattern that REVEAL-1A had and 1B
  lost. Sequenced after mock-first.
  Source: REDUCED-MOTION-AUDIT task, 5 May 2026.
- **SWIPECARD-MOTION-CONSUME (P3):** Migrate SwipeCard from direct
  reanimated `useReducedMotion` to the project `useMotionPreference`
  hook for symmetry. Reanimated's hook is captures-once-at-module-load
  (verified by reading `node_modules` source — docstring confirms
  "Changing the reduced motion system setting doesn't cause your
  components to rerender"). SwipeCard re-renders frequently per-gesture
  so the staleness window is short, but a user toggling Reduce Motion
  mid-deck would see stale behaviour on the next card. Low priority —
  post-launch polish.
  Source: REDUCED-MOTION-AUDIT task, 5 May 2026.
- **SIGNUP-UPDATE-SILENT-NOMATCH-LOG (P3):** Add defensive logging to
  the consent UPDATE in `app/(auth)/sign-up.tsx` — chain `.select()`
  after `.update()` to confirm a row matched, then log a warning via
  `createLogger` if `data.length === 0`. The `handle_new_user` trigger
  installed by SIGNUP-PUBLIC-USERS-SYNC should make this a no-op
  forever, but the defensive log catches future trigger regressions or
  any new sign-up path that bypasses the trigger. Low priority —
  post-launch.
  Source: SIGNUP-PUBLIC-USERS-SYNC task, 5 May 2026.
- **LR-PROD-SYNC (P0 reminder, not new):** The
  `20260505140000_create_handle_new_user_trigger.sql` migration is
  part of the production deployment bundle. Production project
  (`jsrscopoddxoluwaoyak`) was empty at investigation time on 5 May
  2026 (0 auth.users, 0 public.users, 0 triggers). This migration
  must run on production BEFORE any TestFlight user signs up — without
  it, every TestFlight signup will silently drop consent flags and
  journey_stage exactly as staging did pre-fix. The migration includes
  a backfill that is no-op on prod (no stranded rows) but the
  trigger + FK are essential. File this against LR-PROD-SYNC.
  Source: SIGNUP-PUBLIC-USERS-SYNC task, 5 May 2026.
- **REVEAL-FAILURE-TELEMETRY (P2):** Emit PostHog events on reveal
  failure and busy-branch transitions: `reveal_failure` with
  `{screen, retry_count}` payload, and `reveal_busy_shown` when the
  `revealBusy` branch fires. Required for B15 rate-limit threshold
  calibration — the current ≥2 failures within 90s window is
  hardcoded in both reveal-essence and reveal-share; telemetry will
  validate or revise the constants. Without this signal we have no
  way to tell whether the threshold is too aggressive (firing on
  transient flakes) or too lax (silent for users actually being
  rate-limited).
  Source: REVEAL-RETRY-STATE task, 5 May 2026.
- **REVEAL-SHARE-COPY-AUDIT (P3):** `revealShareUnavailable` copy
  ("The share card didn't come together") implies a failed
  generation, but the actual failure mode on reveal-share is an
  archetype-fetch failure (same query as essence, just re-issued ~2s
  later). The voice misframes the user's mental model. Re-voice-gate
  the copy when REVEAL-FAILURE-TELEMETRY data lands and we know how
  often this branch actually fires.
  Source: REVEAL-RETRY-STATE task, 5 May 2026.
- **REVEAL-SHARE-BUSY-NECESSITY (P3):** reveal-share's
  archetype-history query runs roughly 2 seconds after the same
  query succeeded on reveal-essence. The `revealBusy` branch may be
  over-engineered for the share screen specifically — if essence
  succeeded, share is overwhelmingly likely to succeed too on the
  next tap. Decide post-mock-first whether to keep, simplify, or
  remove the busy branch in reveal-share. Could collapse to a
  simpler "Try again" without the busy-vs-unavailable distinction.
  Source: REVEAL-RETRY-STATE task, 5 May 2026.
