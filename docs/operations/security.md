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
- **HOME-REGRESSION-01 (P1):** Profile screen sign-out missing — observed
  during SEC-AUDIT-03 testing that sign-out is unreachable from Profile
  tab. Likely regression from REVEAL-1B branch. Investigate and fix
  before PR merges.
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
