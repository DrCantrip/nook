═══════════════════════════════════════════════════════════
SESSION TYPE
═══════════════════════════════════════════════════════════
Long, productive product session. ~7 hours. High-energy build
that turned into a production phone-test cascade. Six commits
shipped to origin. REVEAL-1B thesis test passed.

═══════════════════════════════════════════════════════════
WHAT WAS DONE THIS SESSION
═══════════════════════════════════════════════════════════

Commits pushed to origin/feat/reveal-1b-two-experience (6 ahead of main):

  588c0c9  fix(profile, support): regressions surfaced during REVEAL-1B phone test
  8a7e06c  chore(db): add journey_stage, home_status, created_at to users
  8df70d5  fix(routing): signed-in-no-profile users on (auth) redirect to quiz
  8fb92db  chore: gitignore .claude/settings.local.json (machine-specific)
  238643c  fix(reveal-1b): wire production routes + gate first-visit events on DB state
  b6721ea  feat(reveal-1b): two-experience reveal architecture — essence, share, depth

PR ready: https://github.com/DrCantrip/nook/pull/new/feat/reveal-1b-two-experience

Migrations applied to staging tleoqtldxjlyufixeukz:
  - 20260421000000_reveal_1b_timestamps.sql (REVEAL-1B state columns)
  - 20260424130000_users_journey_home_status_member.sql (Profile schema gap fix)

Phone-tested via Expo Go (no EAS yet). Validated:
  ✅ Reveal-essence renders as identity moment (thesis test passed —
     "mostly lands but doesn't feel premium yet, fixable with polish")
  ✅ Reveal-share renders with shareable behavioural truth
  ✅ Routing matrix sends signed-in users correctly (after the fix)
  ✅ Profile loads Curator state with backfilled "Member since"
  ✅ Archetype-depth opens, three-tier layout renders correctly
  ✅ reveal_completed_at + depth_first_seen_at write-once verified
  ✅ reveal_first_visit_seen + reveal_depth_visited fire correctly
  ✅ Mailto template renders cleanly after R-26 regression fix

Bugs caught + fixed this session (8 total):
  1. Orphan REVEAL-1B routes (no production wiring) → wiring fix in 238643c
  2. Module-level hasFiredFirstVisit dedup flag → DB-gated in 238643c
  3. reveal_depth_visited firing on every mount → split into _visited / _revisited in 238643c
  4. Auth routing matrix asymmetry (signed-in-no-profile stuck on Welcome) → 8df70d5
  5. Schema gaps (journey_stage, home_status, created_at missing) → 8a7e06c
  6. Profile error state due to schema gap → resolved by 8a7e06c
  7. Profile null-state due to dead archetype_version SELECT → 588c0c9
  8. Mailto template regression from R-26 sweep → 588c0c9

═══════════════════════════════════════════════════════════
OPEN BUG (P2 — diagnosed, not yet fixed)
═══════════════════════════════════════════════════════════

BUG-EVENT-01: reveal_depth_revisited silently fails to insert

Symptom: Tapping ArchetypeIdentityCard for the second visit fires
the correct branch but the row never appears in engagement_events.
All sibling events insert correctly from the phone.

Confirmed correct (eliminated as causes):
  - Branch logic in archetype-depth.tsx (git show 238643c)
  - recordEvent body in engagement.ts (no filtering, no dedup,
    Sentry warning on insert error)
  - DB schema accepts the event_type (probe via service role
    succeeded with INSERT VALUES)
  - RLS policies on engagement_events (no event_type whitelist;
    only owner check (auth.uid() = user_id) OR (user_id IS NULL))
  - Mount effect fires on every navigation entry (twice per mount
    actually — once with userId null, once with userId set)
  - session.user.id === userId confirmed at recordEvent call site
    (instrumented log "session check: { hasSession: true, hasUser:
    true, userIdMatch: true }")

Reproduction:
  1. Reset test-a state:
     UPDATE users SET depth_first_seen_at = '2026-04-24 14:23:00+00'
     WHERE id = '0e675e05-63de-46a0-bdfb-cb101268bf3f';
  2. Cold-restart Expo bundler + Expo Go (full kill, not background)
  3. Sign in as test-a@cornr.test / CornrTest2026!
  4. Navigate Profile → tap ArchetypeIdentityCard
  5. Query: SELECT * FROM engagement_events
     WHERE user_id = '0e675e05-...'
       AND event_type = 'reveal_depth_revisited'
       AND occurred_at > '<test start>';
     Expected: 1 row. Actual: no row.

Next diagnostic steps (priority order):
  1. Check Sentry project cornr-technologies for
     "engagement_events insert failed:" warnings during test window.
     Note: warnings may be filtered by SDK config — verify
     beforeSend doesn't drop level=warning before declaring "no Sentry data."
  2. If Sentry shows the failure: read error message — likely RLS
     auth-context related.
  3. If Sentry empty: instrument recordEvent itself with temporary
     Sentry.captureMessage immediately before AND after the await
     supabase.from(...).insert(...) call. Compare which fires.
  4. If both fire but no row lands: instrument with Supabase
     request ID and chase via Supabase platform logs.

Workaround: None needed. reveal_depth_visited (first-visit) works
correctly. revisit metric is cohort-retention signal that doesn't
matter for mock-first (6 naive users, single session each).

Linked: INFRA-04, SEC-AUDIT-01, TEST-01 below.

═══════════════════════════════════════════════════════════
PHONE-TEST FINDINGS (cosmetic, captured for later)
═══════════════════════════════════════════════════════════

Reveal-essence:
  - Lands as identity but "doesn't feel premium yet"
  - Daryll's instinct: animation, gradient finish, possibly
    typography review needed
  - Captured as DESIGN-03-A, DESIGN-04, DESIGN-05

Profile:
  - Loading state is bare "..." dot character — bad
  - Captured as DESIGN-07 (skeleton screen) + PERF-01 (query
    consolidation, makes loading state mostly invisible)

Trades + Products tabs: empty, no copy. DESIGN-06.

Add a Room CTA on home: 404s. HOME-01.

Status bar contrast on light backgrounds: white text on cream,
unreadable. DESIGN-09.

Archetype-depth: missing back arrow on some screen states. BUG-NAV-01.

Daryll's gesture-system idea: "Cornr is a swipe quiz, why not
swipe-to-navigate everywhere?" Captured as DESIGN-10 — could be
a real differentiator if done well, needs proper exploration.

═══════════════════════════════════════════════════════════
CURRENT STATE
═══════════════════════════════════════════════════════════

Branch: feat/reveal-1b-two-experience
Tip: 588c0c9 (pushed to origin, upstream tracking set)
Working tree: clean
6 commits ahead of main, 0 behind

main: a21e62f (canonical stamp bump from earlier today)

Staging Supabase tleoqtldxjlyufixeukz:
  - All migrations applied
  - test-a (0e675e05-63de-46a0-bdfb-cb101268bf3f):
      reveal_completed_at = 2026-04-24 12:21:00.751+00
      depth_first_seen_at = 2026-04-24 14:23:51.49+00
      created_at = 2026-04-07 09:24:44 (backfilled from auth.users)
      style_profiles row: curator/minimalist (synthetic, source not 'admin')
      archetype_history row: curator/minimalist source='admin'
  - test-b (de7925d8-84f3-49f5-84b8-e6fe01543ef2):
      created_at = 2026-04-07 09:26:19 (backfilled)
      style_profiles row: minimalist/curator
      no archetype_history row
      no reveal/depth state set

Auth credentials (staging only, never production):
  test-a@cornr.test / CornrTest2026!
  test-b@cornr.test / CornrTest2026!

PK current state: dd57853 (canonical at 8a7e06c committed but
PK not yet re-uploaded — drift will trigger on next session-start
check.sh run).

═══════════════════════════════════════════════════════════
NEXT SESSION OPENING (mandatory ritual)
═══════════════════════════════════════════════════════════

1. Read memory
2. Read this handover
3. Re-upload docs/CORNR_CANONICAL.md to Project Knowledge FIRST.
   Then run: bash scripts/drift/check.sh
   Expected: exit 0. If still exit 2, the upload didn't take — retry
   before doing anything else.
4. State match in 2-3 sentences, wait for confirmation
5. If session is product/build: pick from "TOMORROW" below.
6. If session is followup/cleanup/strategy: pick from FOLLOWUPS.

═══════════════════════════════════════════════════════════
TOMORROW — PICK ONE
═══════════════════════════════════════════════════════════

(highest leverage, ~30 min) Open the PR to main:
  - Branch is ready, all gates pass, no merge conflicts
  - PR description: paste the commit messages or summarise the
    six-commit arc as "REVEAL-1B production-ready: architecture,
    wiring, routing fix, schema gaps, regressions"
  - Optional: mark as draft if you want a self-review pass first

(highest priority bug, ~30-60 min) Investigate BUG-EVENT-01:
  - Sentry first (5 min). If filtered/empty, instrument recordEvent
    directly. Don't go past 60 min — the bug is P2, not blocking.

(highest impact polish, ~3-4 hours) Reveal-essence motion + finish:
  - DESIGN-03-A (mount animation, ~1h)
  - DESIGN-04 (gradient finish pass, ~3h)
  - Together: addresses the "mostly lands but doesn't feel premium"
    instinct from this session's thesis test
  - Worth doing before Dan meeting

(infrastructure debt, ~1-2 hours) INFRA-01:
  - Pre-commit hook with syntax-aware filters
  - Replaces the ad-hoc grep gates that lost 5-10 min per commit
    tonight
  - Pays off every commit forever

(strategy, decoupled from build) Mini-deck v2 for Dan meeting:
  - May 2026 deadline still live
  - Tonight's REVEAL-1B work + the journey_stage schema readiness
    are real ammunition for the v2 brand-partnership pitch (per
    Theo's panel observation: "this migration is step 1 of 3 for
    'we can sell segment-targeted audiences'")

Recommendation: open the PR (closes the loop on tonight),
then BUG-EVENT-01 if energy holds (small, contained). Save
DESIGN polish and INFRA-01 for fresh sessions.

═══════════════════════════════════════════════════════════
FOLLOWUPS CAPTURED THIS SESSION (29 items)
═══════════════════════════════════════════════════════════

Add to MC v13 backlog. All scoped, none lost in weeds.

DESIGN
  DESIGN-03-A  Mount animation on reveal-essence (~1h, covers
               jump-cut + future Edge Function latency)
  DESIGN-03-B  Post-signup welcome moment between sign-up-success
               and quiz (Tom from wiring panel)
  DESIGN-04    Gradient finish pass on reveal screens (motion drift,
               richer stops, possible grain/texture, ~3h)
  DESIGN-05    Typography pairing review on reveal-essence (Lora
               italic vs Newsreader italic for essence, ~1h)
  DESIGN-06    Empty-state copy for Trades and Products tabs (~30min)
  DESIGN-07    Profile loading state — skeleton screen replacing
               the "..." dot (~2h)
  DESIGN-08    App-wide loading philosophy doc (skeleton vs spinner
               vs optimistic-render, ~1h)
  DESIGN-09    Status bar contrast on light-background screens
               (WCAG AA, hard rule)
  DESIGN-10    Gesture-driven navigation system (swipe-back,
               swipe-between-tabs, archetype-card swipe-to-depth)
               — Cornr is a swipe quiz, gesture vocabulary should
               extend; needs proper exploration
  DESIGN-11    Sensory-anchor background colour audit on archetype-depth
               (sage-grey breaks the 80/15/5 ink+cream+accent rule;
               either carve-out the rule or change the background).

PERF
  PERF-01      Profile query consolidation (4 parallel reads → 1
               RPC or combined query, ~1h, makes DESIGN-07 mostly
               invisible)

SCHEMA / DATA
  SCHEMA-01    style_profiles missing UNIQUE(user_id) constraint;
               clarify history-vs-active intent (~30min)
  LR-PROD-SYNC Production migration backfill steps for both
               REVEAL-1B and journey/home/created_at migrations
               (LAUNCH BLOCKER)

ENG / OBSERVABILITY
  INFRA-01     Pre-commit hook with syntax-aware filters (R-26,
               voice gate); replaces ad-hoc grep (~1h, pays off
               every commit)
  INFRA-02     Refactor app/_layout.tsx else-if routing ladder to
               explicit table/state machine (~1.5h)
  INFRA-03     scripts/dev/seed-test-user.sh parameterised by state
               (fresh / profile-only / fully-archetyped / depth-
               visited) (~30min)
  INFRA-04     Error visibility audit: hooks AND service functions
               that swallow errors silently (useProfile already
               fixed in 588c0c9, others need audit) (~2h)
  TEST-01      Jest event-fire test suite for archetype-depth +
               reveal-essence event-gating logic; would have caught
               BUG-EVENT-01 + the earlier event bugs in CI (~1-2h)
  INFRA-05     Automate canonical-to-PK sync via post-commit hook or
               scheduled job. Eliminates the recurring drift exit 2 at
               session start.

SECURITY
  SEC-AUDIT-01 Same as INFRA-04 from security angle (silent error
               handling = security observability gap)
  SEC-AUDIT-02 Integration test that intentionally errors a query
               and verifies Sentry receives the event (~1h)
  SEC-AUDIT-03 (P0)  Verify Sentry beforeSend PII scrubbing per 8 April A1
                     spec is implemented. Currently unverified — risk that
                     raw UUIDs/emails/postcodes are being transmitted to
                     Sentry EU from any code path that captures errors with
                     user data.
  SEC-AUDIT-04 (P0)  Verify PostHog person_profiles='identified_only' per 8
                     April A2 spec is implemented. Currently unverified —
                     risk that anonymous users are creating persistent PII
                     profiles instead of being merged on signup.

UX / ARCH
  HOME-01      Disable or scaffold Add Room flow (currently 404s)
               (~30min)
  ONBOARDING-01 Design step that captures journey_stage +
                home_status post-reveal; schema is now ready and
                waiting (~3-4h)
  BUG-NAV-01   archetype-depth missing back navigation in some
               states; missing visible back arrow + swipe-back
               doesn't work
  BUG-EVENT-01 reveal_depth_revisited silently fails — full repro
               above

STRATEGY / CANONICAL
  POSITIONING-01 Clarify whether 'renter' belongs in home_status
                 enum given canonical FTB-only positioning
                 (discussion item, not build)
  R-27 (canonical rule) Multi-persona panels must include
       "integration seam: what does this replace, what are the
       routing/data preconditions" as standing agenda. Surfaced
       three times tonight (REVEAL-1B spec missed wiring;
       useProfile spec missed schema; routing matrix had
       asymmetric gap).
  R-28 (canonical rule) Panels are for judgement calls with real
       tradeoffs, not for permission/comfort on decisions the
       rules already answer.
  Canonical note: Welcome screen unconditionally renders dev
       buttons; not an auth bug, just dev-scaffold visible.
  Canonical note: auth.users join requires service_role; backfill
       operations are migration-time only, not runtime.
  Canonical note: post-amend SHA tracking unreliable when prompts
       are written sequentially over hours. Future commit prompts
       should pull `git log` fresh rather than reference earlier
       expected-state hashes.

DOMAIN
  Domain registration: cornr.co.uk deferred to ~1 May with
  trademark + Companies House. Audit needed before purchase: how
  many places in the app reference cornr.co.uk (share-card
  signature, support mailto, possibly more). Run grep before
  the £8 spend so the domain lands ready-to-resolve.

═══════════════════════════════════════════════════════════
AUDIT FINDINGS FROM FULL-CONVERSATION REVIEW
═══════════════════════════════════════════════════════════

After tonight's session ended, audited the full conversation transcript
for new insights that hadn't landed in this handover. Surfaced:

- Two P0 security audits (A1 Sentry, A2 PostHog) specified 8 April have
  never been verified as implemented. Captured as SEC-AUDIT-03/04 above.
  Real risk: Sentry tags shipped tonight in useProfile fix assume A1 is
  in place. If A1 isn't implemented, every other Sentry capture site is
  potentially leaking PII.

- PK ↔ canonical drift pattern is a recurring friction tax (3rd time
  this month). INFRA-05 fixes it permanently. Until then, PK upload
  becomes step 1 of session opening (above).

- archetype_version (engagement_events) and reveal_version (archetype_
  history) are similarly-named columns for genuinely different concepts
  (description-text version vs reveal-surface version). Naming asymmetry
  caused tonight's Profile null-state bug. Future rewrite-loop work
  needs to track BOTH carefully. Worth a canonical clarification line
  near R-15.

- memory_user_edits tool referenced in some Claude.ai system prompts
  does NOT exist in Claude Code's tool surface — Claude Code memory is
  file-based at C:\Users\Skcar\.claude\projects\c--Projects-Nook\memory\.
  Future memory-update prompts to Claude Code should specify the
  file-edit pattern explicitly.

- DESIGN-11 sensory-anchor background colour breaks the 80/15/5 rule
  on archetype-depth (sage-grey backdrop). Captured above.

- Tonight's work generated real Dan-deck-v2 evidence: the journey_stage
  migration + cohort possibility, the "essence IS the evidence" thesis
  test passing, screenshots of the live production reveal flow. Worth
  a 1-page "what we shipped" addendum to the deck before the May meeting.

═══════════════════════════════════════════════════════════
SESSION META-LEARNINGS
═══════════════════════════════════════════════════════════

What worked:
  - Code-first diagnosis over speculation. Every time we read
    actual files (routing matrix, useProfile, archetype_history
    schema) before deciding, we found the real bug in one pass.
  - Two-step prompts where step 2 depends on step 1's output.
  - Idempotent SQL (WHERE NOT EXISTS pattern from Claude Code).
  - Phone test as bug discovery engine: 8 real bugs found, 7
    fixed, 1 documented. Without this session, all 8 would have
    shipped silently.

What added friction:
  - Ad-hoc grep gates (5-10 min triage per commit) → INFRA-01
  - Synthetic data seeding without a script → INFRA-03
  - Manual route-and-screen tracing (no living architecture map)

Patterns to internalise:
  - For diagnostics: always go to source. Read file, schema, data.
    Don't reason from symptoms or memory.
  - For execution: literal, atomic, idempotent prompts.
  - For repeat patterns: build the tool. Three commits triaging
    gate noise = build the gate hook.
  - Panels are for judgement calls with real tradeoffs, not for
    permission. Six panels ran tonight, three were essential, two
    were over-budgeted, one (gate noise) was unnecessary.

Strategic note: tonight is evidence the solo phone-test discipline
is paying off. The bugs caught would have been disastrous in any
demo to Dan. Phone test ROI is significant even pre-revenue.
