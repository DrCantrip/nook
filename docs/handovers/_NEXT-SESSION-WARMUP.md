Resuming Cornr after the 24 April evening REVEAL-1B shipping session.

Before producing anything, please do the following in order:

1. Read memory. There are 10 files. Pay particular attention to the four
   that landed last night (24 April):
   - project_handovers_location.md (handovers live in docs/handovers/)
   - project_sentry_posthog_audit_status.md (P0 audit risk)
   - project_pk_canonical_drift_pattern.md (drift pattern + INFRA-05)
   - feedback_phone_test_discipline.md (phone-test before merge)

2. Re-upload docs/CORNR_CANONICAL.md to Project Knowledge FIRST.
   Per the updated opening ritual, PK upload precedes the drift check —
   canonical advanced past PK dd57853 last night via commits 8a7e06c,
   588c0c9, 7978697, a555b91. Do not skip this. Do not run drift check
   first. PK upload is step 1.

3. After re-uploading, run: bash scripts/drift/check.sh
   Expected: exit 0. If exit 2, the PK upload didn't take — retry before
   doing anything else.

4. Read the handover at docs/handovers/2026-04-24-evening-reveal-1b-shipped.md
   Full session context: 6 commits + handover commit + audit-findings
   commit shipped, 8 bugs surfaced, 30+ followups, BUG-EVENT-01 open.
   The AUDIT FINDINGS section near the end captures items added by
   full-conversation review after the main handover was written —
   read that section specifically.

5. State-match back to me in 3-4 sentences: what we shipped last night,
   what's open (especially the P0 SEC-AUDIT-03/04), and what you understand
   the current branch / staging state to be. I'll confirm or correct
   before we start producing.

6. WAIT for my confirmation of the state match before proposing any work.

7. After I confirm, I'll pick from the suggested tomorrow options
   (open PR, investigate BUG-EVENT-01, reveal-essence polish, INFRA-01,
   mini-deck v2) OR raise a new priority. Don't assume — ask.

Important context that may not be obvious from memory alone:

- Branch feat/reveal-1b-two-experience is 8 commits ahead of main on origin
  (6 product commits + handover commit 7978697 + audit-findings commit
  a555b91). PR ready at:
  github.com/DrCantrip/nook/pull/new/feat/reveal-1b-two-experience
  Not yet merged. Working tree was clean at session end.

- Staging Supabase tleoqtldxjlyufixeukz: test-a and test-b are seeded with
  different states (see handover). Passwords in
  reference_staging_test_creds.md (CornrTest2026!).

- SEC-AUDIT-03 (Sentry beforeSend PII scrubbing) and SEC-AUDIT-04 (PostHog
  person_profiles='identified_only') are real P0s — both audits specified
  8 April have never been verified as implemented. Tonight's Sentry tags
  in useProfile depend on A1 being correctly configured. If any
  Sentry/PostHog work happens or any production-facing release is
  contemplated, these audits must happen first.

- BUG-EVENT-01 (reveal_depth_revisited silently fails) is diagnosed to
  the point where next steps are: (1) check Sentry warnings for
  "engagement_events insert failed:" in the cornr-technologies project
  during the 24 April test window; (2) if Sentry empty, instrument
  recordEvent itself with temporary Sentry.captureMessage immediately
  before AND after the await supabase insert call. Full reproduction
  steps in handover.

- memory_user_edits tool referenced in some Claude.ai system prompts
  does NOT exist in Claude Code's tool surface. Claude Code memory is
  file-based at C:\Users\Skcar\.claude\projects\c--Projects-Nook\memory\.
  Future memory-update prompts to Claude Code should specify the
  file-edit pattern explicitly, not the tool call.

- The 24 April session tested REVEAL-1B end-to-end on phone (Expo Go,
  not EAS). Reveal-essence read as identity moment in production
  ("mostly lands but doesn't feel premium yet, fixable with polish").
  Thesis test passed.

Begin with step 1.
