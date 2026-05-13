# Cornr Canonical Context

**Last updated:** 6 May 2026 (afternoon — canonical sync covering 22 April through 6 May 2026: commercial thesis stress-test, TestFlight architectural roadmap, workflow infrastructure consolidated, security audits closed, pre-mock-first must-list shipped, business incorporated, brand presentation crystallised)

<!-- CONTRACT-VERSION: 1 -->
<!-- CANONICAL-SHA: 9859cd5 -->
<!-- LAST-SYNCED-PK: 9859cd5 -->

> Drift warning for future sessions: if CANONICAL-SHA and LAST-SYNCED-PK differ, the Project Knowledge copy is STALE. Trust git. Run /sync-canonical after any re-upload.

> **Reading this in project knowledge?** Project knowledge snapshots drift between Claude Code patches and manual re-uploads. If this file in project knowledge shows a "Last updated" date older than `docs/CORNR_CANONICAL.md` in the repo, the repo version is truth. Fresh sessions should flag the drift via the Stale Pattern Gate and work from memory + handover + the repo version read via Claude Code until project knowledge is re-uploaded.

**Purpose:** Single source of truth for all strategic decisions, architecture choices, sprint plans, and workflow rules that postdate the v4 PDFs in project knowledge. Read this first in any new session. If anything below contradicts the PDFs, this file wins.

## Recent updates

**7 April 2026 PM session** — Hybrid archetype naming locked (personality + style territory paired, e.g. "The Curator · Warm Scandi"). The Dreamer renamed to The Nester (Settler as TestFlight Option B). Trend layer architecture decided: 65/35 stable-vs-trend split, trends live in a separate layer that filters through stable archetypes at recommendation time, never in archetype definitions themselves. New `trend_tags` column added to products table schema with GIN indexes. Sprint 3 T1 spec gained the trend layer with strict rationale-quality-not-trend-name rule. Two new workflow rules added to Section 10: recall-before-produce and provisional-until-proven. Share quote format changed for Sprint 2 T4. See Section 0 strategic decisions log for full entries.

---

## How to use this file

- **At the start of any new claude.ai session:** upload this file to the project (or confirm it's already there). Claude reads it before doing anything strategic.
- **At the start of any Claude Code session:** `/start` should read `docs/CORNR_CANONICAL.md` from the repo.
- **When strategic decisions are made:** Claude updates this file in the conversation, you replace the file in the project and the repo. One file, one update, no PDF wrangling.
- **The Brand & Design System v3 PDF, Operations & Legal v2 PDF, and Competitor Analysis v2 PDF remain in project knowledge as stable reference documents.** The Cornr Master Document v4 PDF has been archived to Google Drive — its content is fully captured in this canonical. This file is the only living layer for build planning and product decisions.

---

## Section 0 — Strategic Decisions Log

Every strategic decision that shapes Cornr's product, scope, or architecture lives here. Append-only. Each entry: date, decision, alternatives considered, rationale, source.

### 9 May 2026 — LR-PROD-SYNC closed: production migration history brought to staging parity

The six migrations staging accumulated between 7 April and 5 May 2026 were applied to production (`jsrscopoddxoluwaoyak`) on 9 May 2026 via the dashboard SQL Editor, using the pre-prepared packets in `docs/operations/prod-sync-packets.md`. Production had carried the original 16 March six-table schema with zero rows since creation; the `supabase_migrations.schema_migrations` bookkeeping table did not exist (the Supabase CLI auto-creates it, but this run was dashboard-only). Packet 1 bootstrapped that table; packets 1–6 then applied each migration verbatim and recorded the matching `schema_migrations` row using staging's exact `version` values, so production's migration history is now a faithful copy of staging's. Clean run — no errors, no rollback. Post-execution verification passed: 6 migration rows matching staging exactly, 10 public tables (original 6 + consent_events, editorial_content, archetype_history, engagement_events), 14 columns on `public.users` (7 original + 7 added), `on_auth_user_created` trigger live on auth.users. SIGNUP-PUBLIC-USERS-SYNC is closed at the production side: the `handle_new_user` SECURITY DEFINER trigger and the `users_id_fkey` FK now enforce the auth↔public sync on production, so the consent-flag-drop bug that affected staging pre-fix cannot recur on TestFlight.

**Two workflow observations banked** (held below R-N threshold per the one-instance-is-anecdote rule; promote on recurrence):
- *L-E (candidate R-38, 9 May 2026): tech debt surfaced during execution gets fixed in the same session, not deferred.* Discovery plus fix in one pass. Demonstrated by the Packet 2 cron callout removal during LR-PROD-SYNC prep — the original packet carried a warning that `cron.unschedule('purge-anonymous-sessions')` might error if no such job existed on prod; a source check confirmed the 16 March schema already scheduled both pg_cron jobs, so the callout was obsolete and was stripped in the same session rather than left as a follow-up.
- *L-F (candidate R-39, 9 May 2026): operational paste material is delivered as a single fenced code block, no narration, no steps interleaved.* Reduces cognitive load mid-execution. Demonstrated during the LR-PROD-SYNC packet sequence — each packet's SQL was printed as one clean `sql` fence on request, with framing, verification, and rollback notes kept outside the block.

Source: LR-PROD-SYNC execution, 9 May 2026 (Daryll, dashboard SQL Editor). Packets prepared at `2943019`, cleanup at `a8f29a9`. Run log in `docs/operations/prod-sync-packets.md`.

---

### 6 May 2026 — Brand presentation crystallised: icon master locked, capitalisation cascade, design tokens auto-regenerate

Three connected design and infrastructure decisions landed on 6 May, all converging on a single durable shape: Cornr's brand presentation is now consistent across every surface where it appears, and the documentation that describes it auto-regenerates from code.

**Icon master v6 locked.** The icon arc that began with the 16 April masthead-context approval (corner mark plus "cornr" wordmark, matched-weight, cream on terracotta) hit five intermediate failure modes before resolving. v1 introduced a downturn from verbal description alone (the literal SVG path was missing). v2 had correct geometry but masthead proportions in an icon canvas. v3 (a wordmark-led panel output) lost brand presence by demoting the corner mark to ornament. v4 (an "eighth motif" pure-circle direction following an over-extension of family-grammar reasoning) lost the brand name entirely. v5 returned to the 16 April composition with proper icon-canvas proportions and rendered cleanly. v6 added capital-C wordmark presentation after a side-by-side render comparison. Final composition: corner mark above "Cornr" wordmark, matched-weight stroke, cream `#FAF7F3` on terracotta `#C4785A`, SVG path `M 10 14 L 190 14 L 190 90`. 14 production exports landed at `c77db57`. Design captured in canonical Section 14.9. Lessons captured in R-33.

**Capitalisation cascade.** The icon shows "Cornr" capitalised; the codebase before today rendered the wordmark lowercase in two places (welcome screen, error screens) creating a visible byte-level inconsistency. Audit-first sweep returned 295 occurrences of "cornr" across 72 files. 195 already capitalised (66%). Only 5 lines actually needed change. Brand rule locked: "Cornr" capitalised in all user-facing presentation including mid-sentence references (no lowercase exceptions for stylistic flow); "cornr" lowercase only in code paths, identifiers, schemas, deep-link schemes, URL slugs, npm/repo names. The brand's softness is carried by the contraction (missing 'e'), the italic Lora wordmark, the terracotta palette, and the voice rules — not by lowercase styling. Rule formalised as R-34. Two follow-ups captured: REPO-RENAME-CORNR (P3, GitHub-side action), PACKAGE-JSON-NAME-RENAME (P3, paired with repo rename).

**DESIGN-TOKENS-CANONICAL-SOT pipeline.** `src/theme/tokens.ts` is now the runtime source of truth for design tokens. Token-derived sections of CLAUDE.md and `docs/strategy/cornr-design-system-for-claude-design.md` are wrapped in `<!-- TOKEN-DOCS:START name=X -->` markers and regenerate via `npm run docs:tokens`. Drift checked via `npm run docs:tokens:check`. Idempotent, bidirectional, Windows-CRLF-safe. Five logical commits preserved on `feat/token-sot`, merged at `23e42af`. `docs/DESIGN_SPECS.md` retired (3 references redirected). First-run regeneration tripped a deliberate heuristic gate (>5% lines changed plus hex hits in diff) — manual review confirmed additive coverage growth (CLAUDE.md palette grew 11→22 rows, typography 8→12 roles) plus formatting-only diffs, zero value drift. Architecture in 14.11. Pipeline rule formalised as R-35. Heuristic-gate pattern formalised as R-37. Two follow-ups captured: TEAL-DEPRECATION-PROSE-RELOCATE (closed in this canonical sync — note relocated to 14.1), TOKENS-COMMENTS-COMPLETE (P3, six tokens lacking inline comments render as "—" in regenerated docs).

**Three workflow lessons banked as observations** (held below R-N threshold per single-instance evidence; promote when they recur):
- *Render comparisons resolve executional design questions in seconds where panels would take longer.* The capital-vs-lowercase wordmark decision was settled by one side-by-side render. Watch-list for promotion.
- *Claude Code autonomy floor scales with track record.* Yesterday's SoT pipeline ran clean across 5 commits + a self-caught scope error + a Windows-CRLF bugfix without chat round-trips. Worth less prescription density next time. Watch-list.
- *First-run crystallisation pipelines benefit from one-time human review.* Already promoted to R-37 — the SoT first-run had two evidence sources (the heuristic gate worked exactly as designed; the additive coverage growth was real signal worth preserving rather than auto-shipping).

What did NOT change: the warm palette, archetype motif system, design system's authoritative pair (canonical Section 14 + tokens.ts), the locked archetype set, two-commit canonical stamp pattern (KI-02).

Source: 6 May 2026 — three sequenced sessions across morning + afternoon + evening. Icon arc preserved in conversations of 15-16 April (masthead approval), morning of 6 May (v1, v2 failure analysis), and 6 May afternoon/evening (v3-v6 + capitalisation cascade + SoT pipeline). Multiple panels: LARGE for icon-context geometry derivation, LARGE for SoT architecture, SMALL for Stage 2 SoT amendments, brand strategist consult for capitalisation policy. Follow-up tasks for next CD-CANONICAL-SYNC: confirm autonomy-floor and render-comparison observations have crystallised into R-N candidates; close TOKENS-COMMENTS-COMPLETE.

---

### 4-5 May 2026 — Pre-mock-first must-list shipped; CD design-system markdown re-derived; business incorporated

Two parallel arcs landed across 4-5 May: the must-list of items blocking mock-first user testing, and the legal/business infrastructure required for TestFlight.

**Pre-mock-first must-list (5/5 shipped on 5 May, single-day session 2).** REVEAL-ERROR-COPY (e0c55ec) — voice-gated error copy on the reveal screen. REDUCED-MOTION-AUDIT (bd08612 + 93329e2) — P0 WCAG compliance, three motion gates wired into reveal-essence CTA, tab-bar icon scale, and sign-up "Why we ask" expander. SIGNUP-PUBLIC-USERS-SYNC (2c31abe) — P0 data integrity, fixed via SECURITY DEFINER trigger on auth.users (not UPSERT in app code, which the panel rejected for race-condition exposure). HOME-SIGNOUT-01 (af1ce20) — wired `useAuth.signOut()` to Profile screen, replacing the dev-only test button. Motion vocabulary foundation locked in the same session: three registers (considered, gentle, immediate), `lib/motion.ts` as the authoritative source, `reanimated.useReducedMotion` confirmed not reactive at runtime (read once at mount; gating logic must remount or use an alternative reactive source). Reveal-screen retry/abort architecture also landed.

**CD-MARKDOWN-RE-DERIVE shipped on 5 May session 3.** `docs/strategy/cornr-design-system-for-claude-design.md` re-derived from `tokens.ts` and canonical Section 14 to match the post-15-April warm palette and removal of NativeWind. Committed at `0d3177c`. This file is the design system upload Claude Design consumes for journey-flow renders, mockups, and design briefs; pre-derivation it was stale by ~3 weeks. Provisional staleness-rule for derived design-system markdown: re-derive after any tokens.ts edit OR canonical Section 14 patch OR significant brand decision. (This rule was superseded the next day by the SoT pipeline — see 6 May entry.)

**Cornr Ltd incorporated on 4 May.** Companies House registration via 1st Formations privacy package (~£52.99). Sole director, sole shareholder, sole PSC (Daryll). SIC 62012 (Business and domestic software development). 100 ordinary shares at £1 each. Model articles. The privacy package routes the registered office through 1st Formations rather than home address (~£40/year recurring). Incorporation unblocks the Sprint 4 T-RENAME chain: Companies House registration enables HMRC tax registration, which enables business banking (Starling), which enables Apple Developer enrolment as an organisation rather than an individual. Apple Developer organisation enrolment requires DUNS-1 (3-4 week wait, started clock on 30 April per memory). cornr.co.uk domain queue active. Trademark filing target unchanged: May 2026, Class 9 + 42, ~£220.

**Two security findings carried forward from 5 May session 1** (off-ramp audit, ran as planning-side preparation for must-list): every screen's "I want out" affordance audited against actual app surfaces. Four were missing one. Fixes wired into REDUCED-MOTION-AUDIT and HOME-SIGNOUT-01 commits. Pattern captured: planning-side claude.ai work surfaces issues that build-side Claude Code would miss because Claude Code reads files, not user flows.

What did NOT change: Sprint 2 status (T1 complete, T2 SwipeDeck still pending), mock-first user test status (still pending), entry-point D-prime (still locked), the seven archetype set, the two-experience reveal architecture.

Source: 4 May business incorporation session + 5 May three sessions (off-ramp audit, must-list ship, CD markdown re-derive). Specific commits: e0c55ec, bd08612, 93329e2, 2c31abe, af1ce20, 0d3177c, plus the off-ramp audit document at 720b58b. Follow-up: prod Supabase migration deployment remains a launch blocker (`20260505140000_create_handle_new_user_trigger.sql` committed but not yet applied to `jsrscopoddxoluwaoyak`). Three device tests deferred to mock-first cycle: motion-gate behaviour, sign-out flow end-to-end, signup-creates-both-rows verification.

---

### 29 April 2026 — Security audits SEC-AUDIT-03 and SEC-AUDIT-04 closed; observability region facts corrected

Both P0 security audits specified on 8 April closed across the 29 April session.

**SEC-AUDIT-03 (Sentry beforeSend PII scrubbing) closed at `9738221`.** Recursive walker covers six spec-defined fields plus event.message, event.tags, event.fingerprint, event.transaction. Three documented deviations from the 8 April spec, each with rationale: `__DEV__` ternary kept (env-var migration deferred to Sprint 4 to avoid scope creep on a security-critical commit), postcode regex extended to full postcodes with inward part rather than district-only (district-only produced false positives on internal task IDs like SEC-AUDIT-04), coverage extended beyond six named fields to include event.transaction (testing surfaced URL-shaped transaction names containing PII). Verification used a `__DEV__`-guarded inline test button on the Home screen — the separate test route approach was abandoned after significant friction with deep-link navigation on Windows + physical device. Dashboard verification confirmed all three scrub patterns visible in Sentry issue REACT-NATIVE-6.

**Observability region facts corrected.** Sentry org `cornr-technologies` is on the **US region**, not EU as memory previously claimed. SENTRY-EU-MIGRATION captured P1 (cross-region migration not supported by Sentry; needs resolution path before TestFlight). SENTRY-GEO-IP captured P2 (IP geolocation enrichment is active server-side in Sentry, bypassing `beforeSend` — has to be disabled at organisation level, not via SDK). Old `nook-technologies-27` US org also exists; deletion deferred to Sprint 4 T-RENAME-1..8.

**SEC-AUDIT-04 (PostHog person_profiles + identify/reset) closed at `7768c70`.** Implementation across five files. SDK deviation documented: `posthog-react-native` uses `personProfiles` (camelCase), not `person_profiles` (snake_case) as the web SDK spec assumed. PostHog confirmed genuinely EU (`eu.posthog.com`, project ID 142615). HOME-SIGNOUT-01 reclassified during this audit from regression to P1 not-yet-shipped (sign-out hook existed in `useAuth.ts:46` but had zero UI call sites — missing since day one). Anonymous browsing sub-check passed. Supabase email validation rejects .test TLDs (MX validation, not just format) — Gmail plus-alias pattern (`daryll.cowan+auditNN@gmail.com`) is the workaround for test-user creation via app signup.

What did NOT change from these audit closures: any product decision, any architecture decision, the existing test users `test-a@cornr.test` and `test-b@cornr.test` (those exist via direct migration seeding, not signup; the .test TLD restriction only affects signup-via-app).

Source: 25 April + 29 April sessions across two-day implementation + verification cycle. Per R-25, this entry records the deviations and corrections — what was specified vs what shipped — not the implementation work itself. Follow-ups: SENTRY-EU-MIGRATION P1 in `docs/operations/security.md`, SENTRY-GEO-IP P2 in same, three test-account-deletion items captured as MC tasks.

---

### 25 April 2026 — Workflow infrastructure consolidated: lib/log, R-25 through R-32, Testing & Debugging Discipline

A workflow upgrade install patched three workflow surfaces in a single session, producing durable infrastructure that governs how every subsequent build session runs.

**Diagnostic.** Five friction patterns identified across recent sessions: (1) acceptance criteria absent or vague in Claude Code prompts (Claude Code declares done before reachability is verified), (2) unstructured logs producing high-noise low-signal output (raw `console.log` without task-ID prefix or context), (3) Expo SDK 54 fragility surfaces (Reanimated v3 vs v4 mismatch, peer dependency drift, silent TypeScript failures killing Metro), (4) the "compiles but doesn't run" gap (Claude Code's Done-when satisfied; user's flow still broken), (5) Supabase log fragmentation across multiple surfaces (Edge Function logs, Postgres logs, dashboard, CLI — no unified view).

**Three artefacts shipped.**
- `src/lib/log.ts` — tagged logger wrapper, ~30 lines, zero new dependencies. Uses `createLogger(tag)` returning `{info, warn, error, debug}` methods that prefix every output with `[<task-id>]` for grep. Auto-stringifies object payloads. Replaces raw `console.log` for any new code; existing raw calls migrate opportunistically when the file is touched.
- Section 13 patched with R-25 through R-32. R-25 (acceptance criteria mandatory in every Claude Code prompt). R-26 (logging convention named in build prompts). R-27 (handover prompts must declare unverified surfaces). R-28 (critique gate enforces verifiability, not elegance). R-29 (scope ceiling per Claude Code prompt: one observable change). R-30 (Expo SDK 54 fragility surfaces flagged in prompts). R-31 (RLS-touching prompts require dual-role verification). R-32 (standing prompt prefix for build sessions: "two-paste pattern v2").
- CLAUDE.md gained a Testing & Debugging Discipline section: banned patterns, mandatory self-test checklist before declaring done, debugging escalation order, RLS dual-role verification snippet.

**Explicitly out of scope and not built.** No Jest. No Husky. No custom Claude Code subagents. No logger library dependency. No pgTAP RLS suites. The diagnostic identified these as solutions Cornr would over-invest in at current stage; the three shipped artefacts deliver the highest-leverage subset.

**One observation banked, deferred.** The R-25..R-32 install applies to Claude Code (build-side) discipline. Claude.ai (planning-side) failures — the MC artefact unreachability, off-ramp blindness, path-verification-in-flight, panel-discipline drift — are not covered. A parallel "R-33..R-N for planning sessions" was flagged as owed; deferred to a future workflow-upgrade session. (Note from 6 May canonical sync: this deferral was partially addressed by R-33..R-37 in this sync, though R-33..R-37 are domain rules not pure planning-discipline rules. A dedicated planning-discipline workflow upgrade may still be warranted.)

Source: 25 April 2026 — workflow upgrade audit + install session. Diagnostic + R-25..R-32 patch + CLAUDE.md section landed in a single session arc per the documented two-paste install pattern. Per R-25, this canonical entry records the *why* (the five friction patterns) and the *decision* (three artefacts, six things explicitly NOT built); the implementation specifics live in the install session conversation and in the artefacts themselves.

---

### 24 April 2026 — TestFlight architectural roadmap; REVEAL-1B shipped to main as the first item

A LARGE/STRATEGIC architectural critique on 24 April (10 personas, 3 rounds, with external 2026 ecosystem research on RN/Expo/Supabase/AI-assisted-code failure modes) produced a sequenced eight-item roadmap from current state to TestFlight. REVEAL-1B (the first major item) shipped to main the same evening.

**Architectural finding.** Cornr is not a "vibe-coded app" in the failure-mode sense the wider 2026 industry discourse warns about. Discipline rails (canonical, critique gate, two-paste pattern, voice gate, Stale Pattern Gate) and foundational architectural decisions (NativeWind out, default-deny RLS, JWT at every Edge Function, EU residency, expo-secure-store, no client-side API keys, observability wired in Sprint 1) put Cornr ahead of the failure-mode pattern. Risk profile is the inverse: specific, named, fixable now, with a sequence.

**P0 items before S3-T1A (recommend-products Edge Function).**
- Edge Function golden-path Deno test asserting input shape, output shape, no-PII in payload, all rationales pass voice-gate, and `cache_control: {type: "ephemeral"}` is set (mechanically enforces R-16 prompt caching). Estimated ~3h.
- KI-05 dual-file parity pre-commit hook fails commit when `src/content/archetypes.ts` and `supabase/functions/_shared/archetypes.ts` diverge on shared keys. Estimated ~1h. Closes the drift loop that already produced one regression on `accentColour` (20 April).
- Allow-list input validation at Edge Function boundary. In-scope for S3-T1A build, not a separate task.

**P0 items before mock-first runs.**
- Prod Supabase migration catch-up — close the 3-4 week staging-vs-prod gap currently flagged as a launch blocker. Three independent panel personas named this as the highest-probability cause of meeting-timeline slippage. Estimated 4-6h once started.
- Edge Function rollback procedure documented and rehearsed (one-command rollback, practiced once before launch). Estimated 30min.

**P0 item before S2-T5 (Profile retake) ships.**
- Retake rate-limit enforcement Edge Function: server-side check on `engagement_events` for `archetype_retake_started` count in trailing 30-day window. Required for both rewrite-loop data integrity and GDPR purpose-limitation defensibility. Estimated 2h.

**P1 items before TestFlight submission.**
- GitHub Actions CI runner (npm run check on every PR; not present at time of this decision).
- New Architecture migration plan as a canonical entry (Expo SDK 55 will force the migration; SDK 54 currently the target).

**REVEAL-1B shipped same evening.** Two-experience reveal architecture (essence first-visit, depth on return-visit, share card production-tested on phone). Ships journey_stage and home_status DB columns, signed-in-no-profile redirect fix. Six commits to main: b6721ea (feat), 238643c (routing fix), 8df70d5 (auth redirect), 8a7e06c (DB columns), 588c0c9 (regression fixes from phone test), 7978697 (handover). Three follow-ups captured: TIER-2-EDITS, CUTOVER-REVEAL-1B, CLEANUP-RESULT-HEX. REVEAL-1B was the queued 12h build that had been parked through three earlier sessions; pressure to ship before May meeting (live-app demo per 22 April reframe) brought it forward.

What did NOT change: the existing canonical decisions on RLS, EU residency, NativeWind removal, archetype methodology. The architectural deep-dive validated the existing posture rather than amending it; the eight items are gaps, not contradictions.

Source: 24 April 2026 — LARGE/STRATEGIC critique panel + same-evening REVEAL-1B implementation session. External research included Lightrun's 2026 AI engineering report (43% of AI-generated code changes require manual debugging in production post-QA), Expo SDK 55 forced New Architecture migration, Supabase first-party CI testing pattern for Edge Functions. Follow-ups: each P0/P1 item is tracked in MC and `docs/operations/security.md`; this canonical entry records the strategic shape, not the per-item implementation status.

---

### 22 April 2026 — Commercial thesis stress-tested vs Glassette evidence; May meeting format reframed to live-app demo

Dan's reply to the kill-it questions arrived on 22 April. The 22-voice adversarial panel was restaged to teardown his answers against Cornr's commercial thesis. The most important data point in Dan's letter was not in his bet-by-bet responses but in the unsolicited opening: Glassette's forward business model is 95% brand-side revenue and 5% consumer-side. They went into a taste-led platform with the same consumer-WTP assumption Cornr's Pro tier rests on, ran the experiment for four years, and pivoted. Their pivoted business has effectively zero recurring revenue from consumer-side monetisation.

The thesis update: Cornr's commercial mix in v1 stays as currently locked — affiliate-primary, brand pilot at 2-5K users (R-4), no consumer subscription. Cornr Pro is deferred until consumer willingness-to-pay is empirically validated in-app, post-launch. The brand pilot threshold (2-5K users) and AI-native commercial positioning (R-11) are reaffirmed by Dan's evidence rather than weakened. Where Dan's evidence pulls hardest is against the long-tail Cornr Pro hypothesis: a four-year adjacent experiment by an operator with similar audience and similar curation thesis suggests UK home-style consumers do not pay for curation at scale. v1 must not be priced on a Pro assumption that hasn't been validated.

The meeting format also shifted as a consequence. Until 22 April, the Dan meeting was framed as a thesis-led conversation with deck and financial model as primary deliverables. Dan's reply made clear he expects to *see the product*, not pitch on slides. Meeting format reframed to live app demo plus talk track, with a slim 4-5 slide deck as backup for anything the live demo cannot show (commercial model, financial projection, v2 Digital Home render, TAM). This compresses Dan-track scope from ~16h to ~7-9h: slimmer deck (~3h), financial 1-pager (~3h), Replicate render of v2 Digital Home as the single visual backstop (~3h). DAN-3 (illustrative Curator segment report) and DAN-4 (share card visual mockup) collapse into the live demo if it works. DAN-5 (mock-first results) ships with the deck if mock-first has run by meeting date; if not, drops cleanly without restructuring.

The meeting-format shift has one downstream consequence: REVEAL-1 moves from "may not ship before May" to "must ship before May." The reveal experience is the single most demonstrable expression of Cornr's archetype thesis, and a pub demo without it would force back to slide-mode anyway. Apple Developer enrolment also became strategically urgent — DUNS clock plus Apple enrolment plus EAS production build plus mock-first plus any further build before Dan is a tight sequence.

One risk worth carrying forward: a live app demo in a pub has a failure mode the deck does not. Network drop, Haiku call failure, reveal glitch — all visible to a CEO opposite. Stress-test the demo path end-to-end on actual mobile data (not home wifi) at least twice before the meeting, and have the 4-5 slide backup pulled up on the phone ready to open if needed.

What did NOT change: archetype methodology, the locked archetype set (7 archetypes, hybrid naming), entry-point D-prime decision, affiliate-primary monetisation model, brand pilot timing at 2-5K users. Those survived Dan's pressure-test. The change is exclusively in the consumer-subscription assumption (deferred until validated) and the meeting format (live demo over slides).

Source: 22 April 2026 — restaged 22-voice adversarial panel against Dan's reply. Panel format per canonical Section 9 LARGE/STRATEGIC sizing. Dan's reply preserved in project knowledge as cornrglassetteintelligence.pdf. Follow-ups: REVEAL-1 priority elevated (REVEAL-1B shipped 24 April per next entry below); Apple Developer enrolment timeline tightened; DAN-1/DAN-2 deliverables rescoped per meeting format reframe.

---

### 20 April 2026 (evening) — Archetype v3 content shipped; lexicon architecture formalised as R-24

Seven archetype descriptions v3 landed on main as 6d3e127. Four-component structure per the morning's writing brief (essence, observation, sensoryAnchor, behaviouralTruth), plus motifTooltip and userLexicon. Type definition on Description gained motifTooltip: string and userLexicon: string[] as additive-only changes (no renames, preserves every other field). Per-archetype version integers bumped. Merged fast-forward after fresh-head review and 10-voice ship-or-revise panel (convergence 10/10 ship).

Content is provisional-awaiting-mock-first. Panels exhaustive to date (20 voices twice, 11 voices twice, 5 voices once across 20 April writing session, plus 10 voices this evening on ship-or-revise) but empirical validation with real first-time buyers has not run. The MF-IDENTITY script for mock-first gains three questions derived from the ship panel: (1) does the essence line make you want to read more of the description, (2) a compare-read between Minimalist ("one good thing vs four almost-right ones") and Urbanist ("one decisive choice vs a room of quieter ones") essences to test whether the "You'd rather X than Y" grammar echo reads as twinning or as differentiation, (3) whether any userLexicon phrase reads as "the app is quoting me back to myself" rather than "the app gets me."

Lexicon architecture formalised as R-24 in Section 13. qualityLexicon and userLexicon are user-face (inform Haiku's register and voice-matching in recommendation rationale); materialLexicon is engine-face (informs retrieval filtering against product catalogue tags). The distinction matters because S3-T1A's Haiku prompt consumes all three in different roles, and conflating them produces drift at prompt-composition time.

Follow-up: pre-existing accentColour drift on 7/7 archetypes in supabase/functions/_shared/archetypes.ts is confirmed not functionally consumed by the Edge Function today, but breaks the standing dual-file invariant. Trivial sync commit pending; anchored to 6d3e127 so it can be picked up without archaeology. KI-05 candidate (pre-commit hook validating Description and StyleCard region parity between main file and mirror) captured in MC for drift-loop closure.

- Fallback reveal copy (all-yes, all-no, flat-middle) shipped to src/content/ + mirror (4907e4d). Voice-register matched to archetypes-v3.

Source: 20 April 2026 evening — 10-voice ship-or-revise panel on merge decision, canonical patch approach, and R-24 framing. Convergence 10/10 ship with five non-blocking follow-ups (four landed in this entry, one landed in the merge prompt as git status --short pre-step).

### 20 April 2026 — Archetype writing brief locked; reveal is a two-experience screen; palette revision candidate pending mock-first

Three multi-persona critiques on 20 April (20 voices, 10 voices, 8 voices) on behavioural research for archetype descriptions generated 38 conditions governing the writing session. Conditions consolidated in docs/strategy/archetype-writing-brief.md.

Reveal architecture clarified as two-experience screen: first visit reads essence line + archetype name + tap-continue (~4 seconds, 60% of users); return visit from Profile tab reads depth layers (observation, sensory anchor, behavioural truth) plus tappable motif with tooltip.

Quiz produces 4 reveal types, not 1: single archetype (high-confidence argmax), blend (top-2 both significant), all-yes (all dimensions positive, no discrimination), all-no (vector below threshold, no signal). Confidence routing at 1.4x mean threshold.

Palette revision candidate documented: 4 of 7 archetype accents proposed for revision (Nester, Maker, Minimalist, Romantic, Urbanist) due to colour-theory + brand-clash + CVD + cultural-coding concerns. Maker #3A3A3A resolves brand-accent overlap with Cornr terracotta. Revision ships only if validated in mock-first testing; specific colour-fit question added to test script.

### 18 April 2026 — Synthetic persona strategy locked; SP-1 split into Part A (now) and Part B (with S3-T1A)

Deep research landed 18 April ("Synthetic Personas for Cornr: Data Model and Haiku Validation Strategy"). Three LARGE panel critiques followed (10 personas, then 12 personas extended with senior engineer/tester/data analyst/data scientist/Claude Code explorer/LLM expert/strategy/security/user researcher/Mercedes-proxy/interior designer/pre-purchase researcher, then 13 personas adding strategy/design/solution engineer/architect/data engineer/UX/data scientist/commercial/finance/TAM/devops/Claude Code expert).

Claude Code's repo-state diagnostic caught that the `recommend-products` Edge Function is Sprint 3 T1A and unbuilt. Building a promptfoo harness against a non-existent prompt is waste. Scope split:

**Part A (SP-1, landed):** `synthetic-personas.ts` (20 hand-authored primary fixtures including 2 budget-tension representing Mercedes-shaped real v1 users), `synthetic-personas.adversarial.ts` (8 fixtures one-per-failure-mode), `catalogue-sanitise.ts` (pure library + unit test exercising adversarial fixtures), `evals/COVERAGE.md` (paragraph per fixture explaining the edge it tests), `.claude/commands/eval-haiku.md` (stub), `.claude/commands/eval-haiku-status.md`.

**Part B (SP-1B, parked):** promptfoo harness, Sonnet LLM-as-judge Barnum swap-test, sanitiser wire-up into the Edge Function.

**Reframing:** fixtures are interface specification, not just test data. S3-T1A's Haiku prompt must satisfy the fixtures' `expected_haiku_behaviour` contracts. This makes SP-1 architectural infrastructure rather than QA infrastructure.

**Commercial implication:** defensible archetype methodology underpins v2 brand partnership credibility. When a partner eventually pays for access to Curator-segmented audiences, the methodology behind archetype assignment must be defensible. Synthetic fixture coverage is the first evidence of that.

**TAM future-state:** current 20 fixtures represent the 370K UK FTB core. 8M decorator ring and 15M+ style-curious ring not represented — when v2 brand partnerships expand audience scope, fixture coverage needs revisiting (~5-7 additional fixtures for decorator-not-buyer profiles).

R-19 added to Section 13: synthetic personas supplement, never substitute, real-user validation.

Supersedes any prior synthetic persona artefact (per R-9).

### 15 April 2026 (late PM) — Colour system revision: terracotta shift + territory-authentic archetype colours

Accent palette shifted from 2025 mocha-brown (hue ~29°) toward 2026 terracotta (hue ~16-21°), backed by Lick and Farrow & Ball 2025-2026 UK paint trend data. accent #94653A→#9E5F3C, accent-surface #B28760→#BE7458, accent-light #E8D4BC→#F0D8C0, accent-dark #9B7350→#965E40. All WCAG ratios maintained or improved. Error shifted redder (#AC5342→#A84B42) for 16.1° hue separation from warmer accent.

Icon background established as dedicated token #C4785A (warm terracotta), separate from accent-surface. Icon concept: "Cornr" serif wordmark nested inside organic corner mark on terracotta background.

Four archetype colours revised for style territory authenticity: Curator #2E5A4B→#5C6B4A (teal→olive, MCM fix), Nester #4A7C8A→#5A8A94 (warmer coastal), Storyteller #7A6B4A→#8A6550 (khaki→warm sienna), Urbanist #5A5A6B→#5E5A68 (warmer slate). Maker, Minimalist, Romantic unchanged. Archetype versions bumped for changed archetypes.

CVD policy added: archetype colour is never the sole differentiator. Name, motif, and typography always co-present.

**Source:** 22-persona panel critique in claude.ai, Lick/Farrow & Ball 2025-2026 colour trend research, Headspace design principles deep dive. All in claude.ai conversation 15 April late evening.

### 15 April 2026 (PM) — Design system evolution: two-phase colour, archetype motifs, reveal resequencing

90/10 rule replaced by two-phase colour system. Pre-archetype: 90/10 unchanged. Post-archetype: 80/15/5 (tinted neutral at 5%/8% + archetype identity elements at full colour + universal interactive unchanged). 7 pre-computed WCAG-verified tint values locked. AI teal deprecated for user-facing surfaces.

7 archetype geometric motifs designed (v3). Consistent grammar: 48×48 viewBox, 2px stroke. Curator=viewfinder+golden spiral, Nester=concentric embrace, Maker=interlocking brackets, Minimalist=lower-left quarter-arc, Romantic=rotated ellipses, Storyteller=mixed shapes, Urbanist=rectangle+diagonal.

Reveal flow identity-ownership problem diagnosed. 10 ranked interventions locked. Top 6 (~12-16h): evidence screen, panel resequencing, copy reframe, rarity framing, behavioural truth solo panel, user-image share card.

Master app icon: ink background rejected, warm amber (#B28760) direction partially approved, needs character not geometry. Fresh session with Headspace research planned.

**Source:** Deep research (identity systems, colour theory, app icon best practice), 22-persona reveal flow panel, 14-persona motif critique, 12-persona icon panel, 10-persona colour system review. All in claude.ai conversation 15 April evening.

### 15 April 2026 — Archetype visual identity system and reveal screen redesign

Decision: parametric `archetypeTheme(id)` system in `src/theme/tokens.ts`. One function, seven palettes, identical component structure across all themed surfaces. Components never hardcode archetype-specific colours — they consume the returned `{ gradientStart, gradientMid, gradientEnd, accent, grainOpacity }` object.

Seven CVD-reviewed palettes locked (gradientStart → gradientEnd character):
- curator — amber-to-walnut: `#93662C` → `#6B4A2E`
- nester — sand-to-sage: `#7E725A` → `#5A6F62`
- maker — concrete-to-forge: `#766A5B` → `#3D3832`
- minimalist — clay-to-stone: `#756E65` → `#8A7E70`
- romantic — blush-to-burgundy: `#896D61` → `#7A5A5A`
- storyteller — plum-to-oxblood: `#8A4A5A` → `#4A2838`
- urbanist — graphite-to-ink: `#6B645C` → `#2D2A26`

Graduated intensity model: reveal screen 100%, share card 100%, home tab ~40%, profile ~20%, everything else 0%. Non-themed screens keep the core semantic palette (ink/cream/accent).

Typography drama on reveal: DM Sans Regular for context lines, Lora-SemiBold 48px for archetype name, NewsreaderItalic 28px for behavioural truth (largest text on screen). The truth is the product moment.

Share card redesign: Cornr wordmark at top, archetype name, style territory, behavioural truth as the headline (not the essence line), essence as secondary. No URL until App Store listing is live.

Mercedes feedback (first real user, 15 April): identity hook landed ("ENTJ vibe"). Style territory lost ("MCM got a bit lost, mostly behavioural anecdote"). Known gap. Planned resolution: lookbook panel in Phase 3.

Style territory gradient audit post-Mercedes: 5/7 miss the territory feel, 2/7 partial. Revised palettes researched but deferred — current palettes are provisional (provisional-until-proven rule applies). Full palette revision planned for Phase 2.

Implementation: `expo-linear-gradient` (three colour stops at `[0, 0.45, 1]`), static SVG grain overlay (`src/components/atoms/GrainOverlay.tsx`, React.memo, `pointerEvents='none'`), existing fonts only. No `@shopify/react-native-skia` in v1 — it breaks the Expo Go QR workflow.

CLAUDE.md design system section overhauled same session (commit `c8b8bd7`) to reflect the parametric theme approach, the graduated intensity model, and the reveal hero typography scale.

Phases: P1 ~8h (colour/typography/share — this session). P2 ~6h (home and profile theming). P3 ~12h (lookbook content + palette revision).

**Source:** 15 April 2026 implementation session, Mercedes user test, 15-persona visual review.

### 14 April 2026 — S2-T4 reveal screen panel critique (8-persona panel including design systems, UX testing, security voices)

Panel critique of `app/(onboarding)/result.tsx` after first implementation. Blockers identified and fixed in same commit: share card layout clipping on iPhone SE (9:16 aspect ratio dropped), nested Pressable on panel 4 (refactored out of advance-Pressable tree), gradient contrast (15% → 25%/35%), `.gitignore` supabase/.temp, fallback unit test (first test in the codebase, sets testing precedent).

Strong fixes applied: panel 1 tap cooldown (1s), error-type field on fallback engagement event, typographic emphasis on behavioural truth within panel 2 (split prose from truth, 26pt delayed fade-in).

Product decisions deferred to mock-first (BS2-T0): retake link on reveal screen (panel unanimous defer — existing Profile retake pattern exists, psychological argument against rejection-priming at commitment moment), panel structural restructure (defer to post-mock-first evidence).

Two new Section 13 standing rules added: LLM prompt input sanitisation, archetype retake rate-limit enforcement (S2-T5 prerequisite).

First Edge Function in codebase (S2-T4-INSIGHT, commit 99aeaaa) is now called from first real client code (result.tsx).

### 13 April 2026 — Period-property surfaces as visible reveal modifier (Option B from research)

UK first-time buyer market analysis: ~100,000–120,000 FTBs per year buy pre-1945 housing stock (Victorian, Edwardian, Georgian, interwar/1930s), representing approximately 30–35% of the annual FTB cohort. Zero digital products serve this segment with styling guidance — total competitive vacuum across apps, quizzes, and tools. Cornr already collects `property_period` from EPC data at signup (canonical Section 7), so the data exists; the question was whether to surface it.

**Decision: surface period as a visible one-sentence modifier on the reveal screen, beneath the archetype description.** 35 modifier sentences locked in `src/content/archetype-period-modifiers.ts` covering 7 archetypes × 5 property eras (georgian, victorian, edwardian, interwar, modern). For Welcome and Neutral pairings the modifier celebrates or acknowledges the match. For Tension and Dissonant pairings (Romantic × Modern is the only Dissonant cell) the modifier reframes the challenge as styling advice — never tells the user their taste is wrong.

The reveal screen layout must include a slot for the period sentence, designed for graceful absence: renting users with no `property_period` see no slot at all, not a blank space.

**Build cost:** ~12–15 hours total (S2-T4-PERIOD task in MC). Content is shipped; engineering is the period_suitability tags on products in Sprint 3 (~4h absorbed into existing tagging work) and the reveal screen layout slot (~1h into S2-T4 build).

**Strategic positioning:** this is the strongest commercial differentiator Cornr has produced. "Cornr knows your home's era and tailors recommendations accordingly" is a claim no UK competitor can make and none will be able to make without Cornr's specific EPC pipeline. The Dan deck (DAN-1) leads with this positioning, not the archetype thesis.

**Future option deferred:** Option D (period as a first-class dimension alongside archetype, with dual identity 7×5=35 reveal cells) is rejected for v1 on cost (40–60h) and content burden (35 unique reveal descriptions). Option D becomes the right call IF post-launch metrics show period-modified share cards drive 20%+ higher acquisition from period-property communities, OR Welcome pairings show 20%+ higher product CTR than Tension pairings. Not before.

**Future option also deferred:** Option C (eighth archetype "The Preservationist" for users wanting period-faithful restoration) is rejected on grounds that period-property styling is a context, not a style — adding it as an archetype would cannibalise Storyteller and Romantic without serving the diverse range of styles period-property users actually want.

**Source:** 13 April 2026 period-property research (~100K UK FTBs/year, zero competition, full compatibility matrix), 8-persona panel convergence, Daryll explicit decision to accept Sprint 2 scope expansion of ~10–12 hours and TestFlight delay of ~1.5–2 weeks in exchange for the differentiation.

### 12 April 2026 — AI-native architecture is the commercial moat

Cornr's Claude-native catalogue (~120 items, no retrieval pipeline, no vector DB, no embeddings) is a structural advantage, not an implementation detail. Product improvements ship as prompt updates, not ML pipeline retrains. Every user gets a personalised share insight generated at ~$0.001 per call — a unit economics profile no traditional recommendation platform can match.

Positioning implication: the Dan deck and all brand partnership conversations lead with the business story ("Cornr personalises every user's share card with an insight unique to their swipe pattern, at negligible cost, because we're built on prompts not pipelines"), not the technical story ("We use Claude Haiku for recommendations"). The business story is the defensible moat. The technical story is a feature.

**Alternatives considered:** Treating AI-native as a technical implementation detail (rejected — it's the commercial differentiator); leading with catalogue size or user count (rejected — neither is defensible at our stage).

**Rationale:** Unit economics research validated that affiliate alone is not fundable at Cornr's scale (~£5-20/user/year). Brand partnerships and data asset are the fundable revenue lines, and both depend on Cornr being able to do things traditional platforms can't. The AI-native architecture is what makes those things possible. Surfacing it as a locked positioning decision prevents future sessions from treating it as optional framing.

**Source:** 12 April teardown, AI-Native Business Owner persona + Dan Crow persona convergence.

### 12 April 2026 — GTM Strategy v2 locks a 10-channel stack with realistic targets

Validation research invalidated several v1 claims (r/FirstTimeBuyerUK likely doesn't exist under that name, r/HousingUK is 467K not 335K, r/UKPersonalFinance is 1.8M not 800K, "100 users from one Reddit post" is US B2B SaaS only, mortgage broker volume is 2-6 FTBs/broker/month not the inflated numbers previously assumed). GTM v2 locks the following channel priorities and realistic 6-month targets:

1. Pinterest (organic + £50 promoted pins) — 500-1,500 users, 2-3h/week, start week 4, £50 paid
2. TikTok organic — 300-1,000 users, 4-6h/week front-loaded in batch filming weeks 1-4, start week 8, £0
3. Glassette/brand partnership cross-promo — 500-1,500 users, 1h for May meeting, £0
4. Share viral loop (personalised cards) — 1.2x compound on all channels, built into product, £0
5. Mortgage broker card distribution — 100-150 users, 1h/week from week 12, £30 for 500 Vistaprint cards
6. Instagram Reels + Threads — 150-400 users, 2-3h/week blended with TikTok, £0
7. PR (UK lifestyle press ladder: Sifted/TC UK → Stylist/Grazia → trade → national) — 200-600 users, 1h/week pitching, £0
8. Build-in-public (X, IndieHackers) — 50-200 users, 30min/week from week 1, £0
9. ASO + App Store conversion surface — 50-150/month post-launch, 2h one-time + 30min/month, £0
10. Annual data report — 500-2,000 from first report, 15h one-time, £20 reserve

Reddit deprioritised (20-50 users expected, no warmup investment). Apple Search Ads removed (requires $5K/month minimum). Realistic 6-month total: 1,900-5,300 users.

£100 allocation locked: £50 Pinterest promoted pins (only paid channel where £100 produces measurable data at £0.08-1.30 CPC), £30 Vistaprint QR code cards (500 for broker test), £20 reserve for second Pinterest test or £30 Mumsnet non-member post for qualitative feedback.

**Alternatives considered:** GTM v1 (higher targets of 3,350-10,100 users built on unvalidated Reddit claims and inflated broker volumes); paid-first approach (rejected, £100 cannot validate any paid channel except Pinterest).

**Rationale:** Honest targets build credibility with Dan and future investors. Pinterest compounds (6-12 month content lifespan) making it uniquely suited to a 7h/week founder. TikTok has highest discovery upside but tight guardrails needed (week 8 kill gate at <500 followers). Reddit is structurally hostile to homeware promotion in target subreddits. Paid budget is concentrated where it can produce learning.

**Source:** 12 April strategy session, GTM Channel Validation research + 24-persona teardown synthesis.

### 12 April 2026 — Unit economics recalibrated, brand partnership thesis validated

Research invalidated the v1 commission assumption (5-8% blended) and set new baselines:
- Commission: 4-5% blended (Wayfair UK 7%, Heal's 6%, Dunelm 2%, B&Q 2%, John Lewis 3-5%, Amazon 5% with 24hr cookie, M&S 5%, Cox & Cox 1.2-4%). Deprioritise Amazon and John Lewis. Weight toward 30-day-cookie programmes.
- Purchase conversion: 4-8% (not 8-12%)
- AOV: £150-200 validated
- Cornr revenue per user on v1 affiliate only: ~£5-20/year vs Stitch Fix $559/year active client — affiliate is not fundable as sole revenue line
- SheerLuxe acquisition: £39.9M upfront on £12.6M revenue = ~£14 per email subscriber per year at scale, 70% returning brand partners. Validates brand partnership thesis as fundable revenue line.
- Thread raised $30M+, reached 325K users, went into administration 2022 with no revenue data ever disclosed (cautionary tale: scale before unit economics)
- Palazzo (Venus Williams AI quiz) pivoting B2B — no UK competitor occupies Cornr's position

**Fundable thesis revised:** data asset and brand partnerships, not affiliate. Dan deck must lead with margin structure and brand partnership story, not volume.

**Alternatives considered:** Sticking with v1 commission assumptions (rejected, not defensible to any investor who asks for the math).

**Source:** 12 April Unit Economics Validation research.

### 12 April 2026 — Three-tier data retention model

Individual engagement_events retain for 18 months (existing canonical spec). Aggregated segment counts (per archetype × room_type × month rollups in a future `aggregated_segments` table) retain indefinitely under legitimate interests. User profiles (archetype, journey_stage, budget_tier) retain until account deletion.

This resolves the tension between GDPR retention limits on individual events and the data asset value which requires longitudinal trends for year-over-year reporting.

**Alternatives considered:** Extending individual event retention to 36+ months (rejected, disproportionate); losing all longitudinal signal after 18 months (rejected, destroys data asset value).

**Rationale:** Aggregated rollups contain no personal data and can be justified under legitimate interests. Individual events remain subject to 18-month purge. Pipeline to build the rollup table is Sprint 4 or 5 priority, low urgency until brand partnership is active. DPIA flagged pre-brand-launch.

**Source:** 12 April teardown round 2 (Data PM + GDPR DPO + Thread Analyst triangulation).

### 12 April 2026 — Sprint 3 T1 splits into four sub-tasks

The recommend-products Edge Function grew too large under the accumulated findings from MC Impact Assessment, Cold Start critique, and Discipline Gates. Split into:

- **Sprint 3 T1a:** Edge Function scaffolding + products query + basic Haiku call with structured output (3 product IDs) + delivery_tier column and seed. ~5h.
- **Sprint 3 T1b:** Rationale generation (second Haiku call, per-product natural language). Includes prompt branches for scratch/partial/aspirational, Position 1 constraint (never name kept category), rationale quality gate (material/texture/form + behavioural reference). ~5h.
- **Sprint 3 T1c:** Response validation (ID-exists check, 2 retries, fallback) + cache layer in new `recommendation_cache` table keyed on (archetype, room_type, budget_tier, room_stage) with 7-day TTL + Haiku failure fallback serving from cache regardless of age. ~4h.
- **Sprint 3 T1d:** Payload wiring — populate position, retailer, category, journey_stage, acquisition_source, model_version into engagement_events JSONB. Note: model_version column already exists from 7 April canonical; T1d populates it. ~3h.

**Total Sprint 3 T1: ~17h** (previously estimated 8-10h in v4 spec).

**Alternatives considered:** Single fat task (rejected, too complex for one Claude Code session); splitting into two (rejected, doesn't give enough checkpoint granularity).

**Source:** 12 April teardown round 2 (Senior RN Engineer + Prompt Engineer + Solution Architect + Claude Code Specialist consensus).

### 12 April 2026 — MC contribution proposal: 68 items tiered P0-P3

The full strategy session produced a locked proposal for Mission Control v10 consisting of ~68 items across priority tiers P0-P3, sourced from: 8 MC Impact Assessment items, 9 Cold Start findings, 7 Discipline Gate findings, 14 GTM Strategy v2 items, 30 teardown findings.

**P0 (~30h, must have for launch):** Share mechanic + personalised insight Edge Function, recommendation quality (Sprint 3 T1a-T1d), delivery_tier column and badge, mock-first validation (7 tests, 6 users, includes share flow end-to-end test and 24h identity attachment follow-up), Wayfair webview commission test moved to Sprint 3, waitlist landing page, share card visual design (expanded 2h→4-6h), TikTok content pre-creation (10-15 videos batch-filmed weeks 1-4), Haiku cache layer, rationale quality gate, Position 1 constraint.

**P1 (~25-30h, strong preference):** Payload field additions (position, retailer, category, journey_stage, acquisition_source), engagement_events indexes for brand reporting, Pinterest content engine (7 archetype mood boards + 20-30 pins each), mortgage broker card test (Vistaprint + 3-5 brokers), TestFlight expansion to 10-15 users, App Store screenshot sequence specced.

**P2 (~20h, defer if needed):** TikTok execution (weeks 8+), PR ladder, cohort analysis infrastructure in PostHog, aggregated_segments table + pipeline, brand partnership pilot at 2-5K users.

**P3 (post-launch):** Annual UK FTB style data report, Instagram Reels expansion, v2 features (cross-retailer coordination, delivery confidence, spatial planning).

**Source:** 12 April 24-persona teardown, 3 rounds, full synthesis.

### 11 April 2026 — Onboarding flow restructured: 2 screens + post-recommendation refinement

Room setup reduced from 3 screens to 2 screens before first recommendations, plus a post-recommendation refinement card. Driven by UX journey critique: 4 screens of friction between archetype reveal and first recommendation was too many.

**New flow:** Reveal → Sign up → Screen 1 (journey_stage + home_status, adaptive) → Screen 2 (budget + room type) → First recommendations (defaulted room_stage) → Refinement card (existing_categories + existing_descriptions).

**Key changes:**
- `journey_stage VARCHAR(20)` on users table replaces `occupancy_status` on rooms. Values: `pre_purchase`, `new_0_3`, `settled_3_12`, `established`, `renting`.
- `home_status VARCHAR(20)` on users table. Values: `first_time`, `experienced`, `renter`. Conditional — hidden when journey_stage is "renting".
- `is_aspirational` on rooms derived from `journey_stage = 'pre_purchase'` at room creation time.
- `room_stage` defaults from journey_stage (pre_purchase→scratch, new_0_3→scratch, settled_3_12→partial, established→polishing). Override available in refinement card.
- `existing_categories` and `existing_descriptions` moved to post-first-recommendation refinement. Non-blocking — user can skip.

**Rationale:** A slightly wrong first recommendation that arrives fast is better than a perfectly calibrated recommendation that arrives after 4 screens of questions. Progressive disclosure applied to the recommendation engine.

**Source:** UX/UI/journey/brand critique, 11 April 2026 evening session.

### 11 April 2026 — FTB verification via home_status field

Brand partnership data thesis depends on knowing users are verified first-time buyers. Without explicit capture, "FTB audience data" is unverifiable. `home_status` field on users table enables Tier 2-3 brand reports.

**Source:** Data discipline tear-down, 11 April 2026 evening session.

### 11 April 2026 — Renters passively accommodated, not actively marketed to

journey_stage includes "renting". Recommendation prompt adapts (freestanding, portable, no-drill items prioritised). Products tagged `renter_friendly` in attribute_tags. Marketing remains FTB-focused. Renters who later buy become FTBs with existing archetype and data.

**Source:** Renter opportunity analysis, 11 April 2026 evening session.

### 11 April 2026 — Claude-native ML approach: no traditional ML infrastructure

Cornr treats Claude as both the recommendation engine and the performance analyst. Monthly prompt evolution loop (post-launch, ≥500 recommendation events). Quarterly anonymised cohort analysis for archetype calibration and brand reports. No traditional ML infrastructure planned until >50K users. API costs validated at <£5/month for the analysis pipeline.

**Source:** AI/ML data architecture critique + financial model pricing check, 11 April 2026 evening session.

### 11 April 2026 — Category-level room sequencing in recommendation prompt

Product 1 comes from the first unmet category in a room-type-specific priority sequence. Sequences in `src/content/rooms.ts`. Sequences are provisional — validate with click data via quarterly Claude analysis.

Living room: seating → tables → rug → lighting → art/decor. Bedroom: mattress → bedding → bed frame → lighting → storage. Kitchen: table/chairs → lighting → storage → textiles. Bathroom: storage → textiles → lighting → accessories. Home office: desk/chair → lighting → storage → art/decor.

`CATEGORY_MAP` bridges user-facing labels (Big furniture, Soft furnishings, etc.) to sequencing category IDs.

**Source:** "What to buy first" sequencing deep dive, 11 April 2026 evening session.

### 11 April 2026 — Delivery tier on products table

`delivery_tier VARCHAR(20)` with 4 values: `days`, `weeks`, `made_to_order`, `long_lead`. Display copy in `src/content/labels.ts`. Shown on ProductCard with Truck icon. Seed data defaults to `weeks` unless verified. `made_to_order` only when verifiably true.

**Source:** MC impact assessment critique, 11 April 2026 evening session.

### 11 April 2026 — Week 30 diagnostic sequence replaces hard pivot trigger

If affiliate CTR is below target at Week 30, run diagnostic sequence before any model change: (1) check recommendation quality via Claude analysis, (2) check catalogue quality, (3) check click-through UX, (4) check wishlist-to-click ratio + implement remarketing, (5) check audience segmentation by persona, (6) only then consider model changes.

**Source:** Thread cautionary tale deep dive, 11 April 2026 evening session.

### 11 April 2026 — Trades tab: branded screen with email capture, not directory

Replaces Google Places directory build (~15h saved). Single screen with tagline, description, email capture with purpose-specific micro-consent. `trades_waitlist` table with own retention rule. Consent separate from marketing opt-in.

**Source:** MC impact assessment critique, 11 April 2026 evening session.

### 10 April 2026 — T2 blocked pending entry-point strategic critique; error handling tranche in progress

Real-device testing of T1 SwipeCard on 10 April surfaced a deeper product question than originally scoped: does the user flow start with taste (current canonical, locked 7 April) or with room (user's actual mental model when they arrive with a specific problem)? The swipe deck without contextual chrome relies on implicit user faith, and the commerce engine downstream is inherently room-specific. Structural mismatch.

**Status:** T1 SwipeCard committed to feature branch with mechanic working. T2 SwipeDeck is **blocked** pending a full Large/Strategic critique (10 personas, 3 rounds, per Section 9) running in a separate chat. T2 will not be started until the critique returns a locked decision on room-first vs taste-first entry point.

**Concurrent work:** Error handling tranche in Launch Readiness has been promoted from backlog to active work this afternoon. Three tasks — LR-ERROR-BOUNDARY, LR-UNMATCHED-ROUTE, LR-ERROR-CONTENT — build out the branded error screen system that was identified as missing during T1 debugging (Unmatched Route default, LogBox defaults, no branded crash fallback). These tasks are insulated from the entry-point decision and can ship regardless of how the critique lands.

**Open questions added to Section 11:**
- Entry point question: room-first or taste-first? (Resolve via critique, today.)
- v1 swipe deck image curation brief. (Resolve after entry point decision lands.)

**Rationale:** Pausing a potentially-changing spec is cheaper than building to it and throwing work away. Error handling is a real launch blocker independent of any product flow decisions. Parallelising these two tracks maximises afternoon output without creating rework risk.

**Source:** Phone testing session, 10 April 2026.

### 11 April 2026 — Trades deferred from v1; "Coming Soon" demand-capture tab

The Google Places tradesperson directory is removed from v1. The Trades tab remains in bottom navigation but shows a "Coming Soon" screen with email capture for early access. Saves ~15h of build. Sprint 4 scope compressed accordingly.

**Alternatives considered:** Ship thin Google Places wrapper with Gas Safe + Companies House badges (original v4 spec); remove Trades tab entirely.

**Rationale:** Kano analysis classifies a Google Places wrapper as a potential Reverse feature — it returns the same results users get from their phone's search bar, creating a visible quality gap against the polished quiz and recommendation experience. The v1 value proposition is decision confidence through AI-powered personalisation; a commodity directory undermines this. A "Coming Soon" tab preserves the three-pillar narrative, captures demand signal (tab tap rate + email submissions), and saves build time for product catalogue curation and recommendation engine polish.

**Source:** Multi-persona critique, 11 April 2026. Palazzo competitor review (1.0-star App Store rating from shipping features that don't deliver value). UK trades market research (word of mouth dominates at 64-70%, digital platform penetration 6-11%).

### 11 April 2026 — Secondary archetype influences product 3 only

When generating recommendations, products 1 and 2 are pure primary archetype. Product 3 (the stretch piece) may draw from either primary or secondary archetype. This prevents "Curator with a touch of Coastal" producing incoherent recommendations.

**Alternatives considered:** Weighted blend across all 3 products (rejected — dilutes primary identity); secondary archetype in rationale text only (rejected — wastes the signal).

**Rationale:** In real interior design, the "with a touch of" element appears in accessories and accents, not anchor pieces. The stretch piece is the natural home for secondary influence. An archetype adjacency map in `src/content/archetypes.ts` governs catalogue degradation when exact matches are thin.

**Source:** Interior Designer + AI Critic critique, 11 April 2026.

### 11 April 2026 — Seed data pattern adopted; Awin removed from critical path

Sprint 3 builds against a seed product catalogue (~120+ products) with realistic data and placeholder affiliate URLs. A `source` column on the products table (`seed` | `awin` | `manual`) enables clean swap to real products when Awin approves. The seeding script lives in `tools/seed/` and uses the service role key. Seed products include intentional ambiguity (some single-archetype-tagged, some budget-edge) to stress-test recommendation quality.

**Alternatives considered:** Wait for Awin approval before building Sprint 3 (rejected — 2-4 week external dependency on critical path, delays TestFlight by weeks).

**Rationale:** The recommendation engine doesn't care whether affiliate URLs are real. The UI doesn't care whether products are purchasable. User testing doesn't care whether commission is tracked. Seed data unblocks Sprint 3, user testing, App Store screenshots, and the Dan Crow demo simultaneously.

**Source:** Multi-persona critique, 11 April 2026.

### 11 April 2026 — Financial model revised; MAU definition locked

Revenue projections adjusted: Year 1 £10-35K (affiliate only), Year 2 £60-250K (affiliate + £30K brand partnerships + subscriptions + £5-10K data pilot), Year 3 £200-900K (all streams). Previous model overstated Year 2 brand partnerships (was £120K) and taste intelligence (was £20K).

MAU defined as: users with at least one room who opened the app in the last 30 days. This excludes quiz-and-churn users and Pre-Purchase Researchers who haven't set up aspirational rooms. Outer-ring users (style-curious) contribute to quiz completions and viral distribution but not to MAU-based revenue calculations.

**Source:** TAM/financial model research + multi-persona critique, 11 April 2026. BCG first-party data 2.9× uplift, RevenueCat lifestyle app benchmarks, Aldermore FTB furnishing data.

### 11 April 2026 — Incorporation not blocking; TestFlight needs £79 only

Individual Apple Developer account (£79/year) enables TestFlight without incorporation, D-U-N-S, or business email. Companies House incorporation (£50), domain (£5), and Workspace (£5/mo) are needed before Awin applications and public App Store submission but do not block development or TestFlight. Incorporate when affordable, ideally before Sprint 4.

**Source:** App Store Submission Specialist + UK Startup Solicitor critique, 11 April 2026.

### 12 April 2026 — Minimum catalogue size is 130 products, not fewer
7 archetypes × 6 room types × 3 budget tiers = 126 cells. Every cell needs ≥1 product or the recommendation engine returns empty. Minimum launch catalogue: 130 products.
**Source:** Multi-discipline panel, 12 April 2026.

### 12 April 2026 — Recommendation prompt must randomize catalogue JSON order
LLMs have position bias — items in the middle of a large JSON array are under-recommended. Randomize catalogue JSON order on every recommendation call.
**Source:** Multi-discipline panel, 12 April 2026.

### 12 April 2026 — Archetype score vector must be L2-normalized before prompt injection
L2-normalize the 7-dimension score vector before passing to Claude. Without normalization, dimensions with larger raw ranges disproportionately influence selection.
**Source:** Multi-discipline panel, 12 April 2026.

### 12 April 2026 — Catalogue refresh cadence: 10 new, 10 retired per month post-launch
Without rotation, users see the same 3 recommendations within 2–3 sessions. Standing rule: 10 new products added, 10 retired, every month post-launch.
**Source:** Multi-discipline panel, 12 April 2026.

### 7 April 2026 — Constraint capture goes after the archetype reveal

User constraints (room stage, existing categories, property period soft-hint) are captured at room setup, after the archetype reveal and signup. Never before.

**Alternatives considered:** Pre-archetype constraint capture; parallel mechanic alongside the archetype quiz; constraints replacing the archetype mechanic.

**Rationale:** The auth-after-value funnel depends on the swipe → archetype → reveal emotional arc reaching a peak before any friction is introduced. Pre-archetype constraint capture would drop conversion materially. Constraints feel like work; archetype feels like discovery. Capture constraints when the user is invested, not before they care.

**Source:** Sprint 2 strategic critique #1, 7 April 2026.

### 7 April 2026 — Recommendation engine prioritises sequence, not similarity

The Sprint 3 Haiku prompt returns 3 products in stated priority order. The first is what the user should buy *next* given their stage. The second complements the first. The third is a stretch piece within budget.

**Alternatives considered:** Returning 3 best-fit products without priority order (the original v4 spec).

**Rationale:** Houzz and Pinterest both demonstrated taste signal alone produces engagement without commerce. Adding a sequencing dimension to the recommendation output is the smallest change that converts taste signal into purchase intent. The catalogue is small enough that this is a retrieval-and-prioritisation problem, not a similarity-scoring problem.

**Source:** Sprint 2 strategic critique #1, 7 April 2026.

### 7 April 2026 — Property period used as soft prompt hint, never user-facing

`property_period` (already collected via EPC at signup) is passed into the Sprint 3 Haiku prompt as a soft selection nudge. The model is instructed to never invoke property period in the rationale text shown to the user.

**Alternatives considered:** Tagging the entire product catalogue by period suitability (rejected — too much curation work for v1); ignoring `property_period` in v1 entirely (rejected — throws away free signal).

**Rationale:** EPC-derived period is probabilistic and may not match the user's actual property in mixed-stock postcodes. Using it as a model hint without making user-facing claims keeps the value while controlling the risk of confidently wrong recommendations.

**Source:** Sprint 2 strategic critique #1, 7 April 2026.

### 7 April 2026 — Consent split: marketing and audience data are separate toggles

The Sign Up screen has two consent toggles, both default OFF, both with plain-language "Why we ask" expanders.

1. `email_marketing_opt_in` — "Email me with style tips and finds"
2. `audience_data_opt_in` — "Help shape Cornr's style insights"

**Alternatives considered:** Single combined marketing toggle (the original v4 spec); audience data as legitimate interests with no toggle.

**Rationale:** ICO would treat email marketing and audience-segment monetisation as distinct processing purposes. Conflating them in a single toggle is either a dark pattern or a regulatory risk. Splitting them is the GDPR-clean answer and the only way the v2 brand-partnership Workstream C can run on properly consented data. The friction is necessary.

**Source:** Sprint 2 strategic critique #2, 7 April 2026.

### 7 April 2026 — Pre-Purchase Researchers are a first-class v1 persona

Cornr serves UK first-time buyers from active house-hunting through 18 months post-completion. Pre-purchase users complete the onboarding flow, get an archetype, and create *aspirational rooms* tied to no specific property. The recommendation engine handles aspirational rooms with an inspiration-led prompt branch (no immediate-purchase pressure, more anchor pieces, fewer accents).

**Alternatives considered:** Restricting Cornr to post-completion users only (the original v4 framing, treating Pre-Purchase as edge case).

**Rationale:** Pre-Purchase Researchers have the longest engagement window (months versus weeks for New Movers), the richest evolving taste signal, and the highest LTV per user. They expand Cornr's addressable audience from ~600K (post-completion FTBs in engagement window) to ~1.2–1.5M (add active pre-purchase researchers). Two hours of build for a 2–3x TAM expansion.

**This is also a positioning shift.** Cornr is now "for first-time buyers, before and after completion", not "for first-time homeowners". App Store description, marketing copy, and elevator pitch all change accordingly.

**Source:** Sprint 2 strategic critique #2, 7 April 2026.

### 7 April 2026 — Cornr v1 is architected as a data asset, not just an app

v1 includes three new tables (`archetype_history`, `engagement_events`, `editorial_content`), four new columns across existing tables, soft-delete on wishlist, and an 18-month retention window on `engagement_events` with daily pg_cron purge.

None of this is user-facing in v1. All of it is the architectural foundation for v2 Workstreams B (Cornr Advisor), C (Brand Partnerships), and D (Taste Intelligence).

**Alternatives considered:** Adding these tables in v2 when needed (rejected — longitudinal data is only valuable if it goes back to launch; retrofitting in v2 means starting the data collection clock at v2 launch, wasting 12+ months of v1 user behaviour); PostHog as the only event store (rejected — PostHog is for analytics queries, not for query-at-conversation-time AI features or for first-party data ownership).

**Rationale:** The v2 commercial thesis depends on data Cornr doesn't currently collect or owns through a third party. Three tables and four columns added in v1 cost ~3 hours of build and unlock the entire v2 monetisation roadmap. Retrofitting later is structurally impossible.

**Source:** Sprint 2 strategic critique #2, 7 April 2026.

### 7 April 2026 — Editorial slot on Home tab in v1

One image-led editorial card on the Home tab, manually populated by Daryll, fed from a new `editorial_content` table. Engagement tracked from day one.

**Alternatives considered:** No editorial layer in v1 (rejected — leaves nowhere for v2 brand placements to live); full CMS-backed content layer (rejected — scope creep).

**Rationale:** Brands don't pay for raw audience data. They pay for placements alongside content. Cornr v1 currently has no editorial surface. Adding one card costs ~4 hours of build and creates the placement surface that v2 Workstream C plugs into. Engagement tracking from day one tells us, by Week 30, whether the content thesis is viable before we commit v2 budget to it.

Daryll commits to populating this weekly or biweekly. If editorial commitment slips, the slot has a fallback mode that surfaces the user's recent wishlist items so the screen never shows stale content.

**Source:** Sprint 2 strategic critique #2, 7 April 2026.

### 7 April 2026 (PM) — Hybrid archetype naming

Each archetype now carries a two-part name: a personality label (who you are) and a style territory (what your home looks like). The full set:

| DB key | Display name | Style territory |
|---|---|---|
| curator | The Curator | Mid-Century Modern |
| nester | The Nester | Coastal |
| maker | The Maker | Industrial |
| minimalist | The Minimalist | Japandi |
| romantic | The Romantic | French Country |
| storyteller | The Storyteller | Eclectic Vintage |
| urbanist | The Urbanist | Urban Contemporary |

The `dreamer` key is renamed to `nester` everywhere: database enum, `archetype_history`, `style_profiles.primary_archetype` / `secondary_archetype`, swipe scoring keys, tokens.ts colour map. Migration in Sprint 2 T1.

**Display rule:** UI always shows the personality label ("The Curator"). The style territory appears once — on the archetype result reveal screen, as a subtitle below the personality label. Nowhere else. The personality label is what sticks; the territory is context, not identity.

**Option B contingency:** If user testing shows ≥30% confusion between personality label and style territory, collapse to personality-only names (drop the territory subtitle) and add a one-line "Your style leans toward…" sentence in the archetype description instead. This requires no schema change, only a copy change.

**Alternatives considered:** Style-territory-only names (e.g., "Mid-Century Modern" as the archetype name); personality-only names with no territory link; three-part names (personality + territory + era). All rejected — territory-only is generic, personality-only loses the style anchor, three-part is too much cognitive load.

**Rationale:** Personality labels create emotional attachment (users identify as "a Curator", not as "Mid-Century Modern"). Style territories give the recommendation engine a concrete vocabulary for product matching. The two-part structure serves both retention (identity) and commerce (specificity).

**Source:** Archetype naming critique, 7 April 2026.

### 7 April 2026 (PM) — Recall-before-produce rule

Before producing any strategic output (sprint prompt, critique, Mission Control, architecture decision), Claude must first state — from memory and this file — what's already been decided about the topic. If no prior decision exists, state that explicitly. Then produce.

**Alternatives considered:** Relying on Claude's context window alone (no explicit recall step); adding a checklist of files to read per output type.

**Rationale:** The single biggest source of wasted iterations is Claude producing something that contradicts a decision already recorded in this file or in memory. An explicit recall step catches 80%+ of these before they happen. It's 10 seconds of latency for 20 minutes of rework saved.

**Source:** Workflow review, 7 April 2026.

### 7 April 2026 (PM) — Provisional-until-proven rule

Any strategic decision that hasn't been tested in a live build is marked **provisional**. Provisional decisions can be overridden by a single critique round. Proven decisions (tested, shipped, working) require a full critique at the same sizing tier as the original before they can be changed.

**Alternatives considered:** All decisions equally weighted (no provisional/proven distinction); time-based graduation (decisions become "proven" after 7 days regardless of testing).

**Rationale:** Early-stage decisions are cheap to change and should stay cheap. But once a decision has been built, tested, and shipped, the cost of changing it includes code rework. The bar for reversal should match the cost of reversal.

**Source:** Workflow review, 7 April 2026.

### 7 April 2026 (PM) — Share quote format change for Sprint 2 T4

The archetype result share quote (Sprint 2 T4 deliverable) changes from a personality-only format to a format that includes the style territory:

> "I'm The Curator — my home leans Mid-Century Modern. Find yours at cornr.co.uk"

This replaces the previous v4 spec format which was personality-only. The share quote is the one place outside the reveal screen where the style territory appears, because shareability benefits from specificity.

**Alternatives considered:** Personality-only share quote (the v4 spec); share quote with full archetype description.

**Rationale:** "I'm The Curator" alone is intriguing but not informative enough to drive click-through from the recipient. Adding the territory gives the recipient a reason to take the quiz ("what's mine?"). A full description is too long for social sharing.

**Source:** Archetype naming critique, 7 April 2026.

### 7 April 2026 (PM) — Trend layer: 65/35 stable-vs-trend split

Product recommendations use a 65/35 split: 65% of recommended products come from the user's stable archetype territory, 35% come from a "trend layer" that rotates seasonally. The trend layer is curated by Daryll quarterly (same cadence as the seasonal product refresh in Section 11).

**Alternatives considered:** 100% archetype-stable recommendations (the v4 spec); algorithmic trend detection from engagement data; user-controlled trend preference slider.

**Rationale:** Pure archetype recommendations produce a filter bubble. Users see the same aesthetic every session. The 65/35 split introduces controlled variety without undermining the archetype identity. 35% is high enough to feel fresh, low enough that the core archetype still dominates. Manual curation keeps it editorially coherent for v1; algorithmic trend detection can replace it in v2 when the engagement dataset is large enough.

**Source:** Archetype naming critique, 7 April 2026.

### 8 April 2026 — Master Doc v4 archived, canonical is sole source of truth

The Cornr Master Document v4 PDF has been removed from project knowledge after its content was fully captured in this canonical document during the surgery passes of 7–8 April. The PDF file itself has been preserved in Google Drive at `Cornr/` for historical reference if ever genuinely needed.

The Master Change Log April 2026 PDF has also been removed from project knowledge — its content (the rationale for the April 2026 rebrand and warm palette migration) is captured in Section 0 entries from 4 April 2026. The change log was historical noise once changes were applied.

Going forward, this canonical is the only living document for Cornr v1 product decisions. The Brand & Design System v3 PDF, Operations & Legal v2 PDF, and Competitor Analysis v2 PDF remain in project knowledge as stable reference companions — they are not living documents and they are not authoritative if they conflict with this canonical.

**Source:** 8 April 2026 PC session, completing the documentation arc opened on 7 April PM.

---

## Section 1 — Personas (revised)

Three personas, all UK first-time buyers. Cornr serves all three from active house-hunting through 18 months post-completion.

**The Pre-Purchase Researcher** — Actively house-hunting, browsing Rightmove and Zoopla regularly, 6–18 months from completion. Has a forming budget and a forming taste. High curiosity, low urgency, longest engagement window. Cornr serves with archetype discovery, aspirational rooms tied to no specific property, and inspiration-led recommendations. Becomes a New Mover on completion, with all their data already in Cornr.

**The New Mover** — Just completed. Overwhelmed by an empty home. Needs to make dozens of decisions quickly. High urgency, low confidence. Cornr serves with archetype-based recommendations, room-by-room sequencing, and trades discovery for the work that needs doing.

**The Active Renovator** — Moved in 6–18 months ago. One room done, others waiting. Knows what they don't want, unsure what they do want. Medium urgency, growing confidence. Cornr serves with archetype-aware recommendations that respect existing pieces (`existing_categories`), and trades discovery for the next phase.

**Persona priority for v1:** All three are first-class. New Mover is easiest to monetise short-term. Pre-Purchase Researcher is highest LTV and deepest data well. Active Renovator most likely to use trades. Build for all three.

### Archetype mapping (hybrid naming)

| DB key | Display name | Style territory | Accent colour |
|---|---|---|---|
| curator | The Curator | Mid-Century Modern | #5C6B4A |
| nester | The Nester | Coastal | #5A8A94 |
| maker | The Maker | Industrial | #B87F4A |
| minimalist | The Minimalist | Japandi | #A09080 |
| romantic | The Romantic | French Country | #C4908A |
| storyteller | The Storyteller | Eclectic Vintage | #8A6550 |
| urbanist | The Urbanist | Urban Contemporary | #5E5A68 |

**Display rule:** UI shows the personality label ("The Curator") everywhere. The style territory appears only on the archetype reveal screen as a subtitle. The share quote (Sprint 2 T4) also includes the territory.

**Option B contingency:** If ≥30% user confusion in testing, drop the territory subtitle and replace with a "Your style leans toward…" sentence in the archetype description. No schema change required.

**Note:** `dreamer` → `nester` rename requires a migration in Sprint 2 T1 (DB enum, archetype_history, style_profiles, swipe scoring keys, tokens.ts colour map).

---

## Section 2 — Onboarding & Room Context Capture (v1)

After the archetype reveal and signup, users set up their first room in a streamlined 2-screen flow, followed by a post-recommendation refinement step.

### Screen 1 — "Let's find your first [Archetype] picks"

Subtext: "so we can get your [Archetype name] picks right"

Two adaptive questions using SelectorCard components:

**1. `journey_stage`** (on users table) — "Where are you in your home journey?"

Tenure question first (2 cards):
- "I own (or I'm buying)" → shows timeline options
- "I'm renting" → sets `journey_stage = 'renting'`, `home_status = 'renter'`, skips to Screen 2

If owner/buyer, timeline question (4 cards):
- "Still searching for my place" → `pre_purchase`
- "Just got my keys" → `new_0_3`
- "A few months in, getting sorted" → `settled_3_12`
- "Settled in" → `established`

**2. `home_status`** (on users table, conditional — only shown when not renting):
- "Yes, it's my first home" → `first_time`
- "I've owned before" → `experienced`

### Screen 2 — Budget + Room Type (unchanged from v4 spec)

### Post-Recommendation Refinement (appears after first recommendation set)

Non-blocking card below recommendations: "Before we fine-tune — anything you're keeping in this [room_type]?"

**`room_stage`** — defaulted from journey_stage, overridable:
- pre_purchase → `scratch`
- new_0_3 → `scratch`
- settled_3_12 → `partial`
- established → `polishing`
- renting → `partial`

**`existing_categories`** — six checkboxes plus "Nothing yet" (unchanged from original spec).

**`existing_descriptions`** — optional free-text per checked category (B7). Store as `existing_descriptions JSONB` on rooms table.

`is_aspirational` derived from `journey_stage = 'pre_purchase'` at room creation. All fields stored on rooms table except journey_stage and home_status which are on users table.

Frame as *refinement*, not a form — copy treats this as Cornr getting more precise, not making the user work.

### Settled product decisions — do not reopen

These decisions are load-bearing for v1 and have been validated through prior planning sessions. They are NOT subject to the provisional-until-proven rule. Reopening any of them requires strong new evidence and a deliberate strategic decisions log entry in Section 0.

1. **Archetype scoring algorithm (weighted version).** RIGHT_SWIPE_MULTIPLIER = 1.0, LEFT_SWIPE_MULTIPLIER = −0.4, SECONDARY_THRESHOLD = 0.4. Edge case: equal/near-zero scores → assign "curator" with low confidence flag.
2. **Auth flow: auth-after-value.** Auth happens AFTER the archetype reveal, never before. Anonymous users see recommendations but cannot save, set up multiple rooms, or access trades. 24-hour anonymous session expiry. No social login in v1. Email + password only. Email confirmation disabled to preserve auth-after-value momentum.
3. **Budget tiers — friendly labels, never price ranges in UI.** High Street Finds (under £200/item), Great Quality (£200–£600/item), Invest Well (£600+/item). Price ranges never shown to users.
4. **AI architecture: Claude Haiku 4.5, single call per session.** NOT Sonnet or Opus. Returns exactly 3 products as JSON. Rate limit: 20 calls/user/day registered, 3 total anonymous. £30/month hard spend cap. All user content in `<user_context>` XML tags. Upstash Redis IP-based rate limiting alongside Postgres per-user limits.
5. **Tradesperson pillar v1: browse-only, zero monetisation.** Companies House badge only (Gas Safe removed — no public API). Results sorted by rating DESC, review_count DESC. Call button (tel: link) only. No messaging, quotes, or booking in v1. v2 Workstream E is the full trades engine.
6. **Monetisation: Awin + Skimlinks affiliate, day one.** Apply to both. Amazon Associates UK as fallback. All affiliate links open in expo-web-browser (in-app), NEVER system browser — required for Wayfair commission (mobile app exclusion workaround). No ads, no paid tier in v1. ARPU targets: £0.25/user month 3, £0.80–£1.00/user month 6.
7. **Archetype retake in Profile.** Deletes style_profiles, re-runs swipe, assigns new archetype. Rooms preserved. Wishlist preserved with one-time style-change banner. Self-healing room recommendation refresh via archetype_at_recommendation comparison.
8. **Push notifications after first room setup completion.** Pre-prompt screen before native iOS dialog. 4 notification triggers (seasonal refresh quarterly, second room nudge 7 days, wishlist reminder 14 days, new products monthly). Global cap: max 2 per user per 7 days.
9. **Deferred features — do NOT build in v1.** Social login (v2). Gas Safe badge (v2 — no public API). In-app messaging/quotes/booking (v2 Workstream E). Cornr Pro paid tier (v2 Workstream A — Digital Home). Camera/room scan (v1.1). Digital Home Record (v3+). LiDAR/AR (v3+). B2B/estate agent features (v3). Real-time Awin sync (v2). PWA (permanently rejected). Email marketing platform integration (post-launch — Loops.so recommended). Visual ShareCard image generation (Sprint 6 or post-launch).

---

## Section 3 — Consent Architecture (v1)

The Sign Up screen has two independent consent toggles, both default OFF, both with plain-language "Why we ask" expanders.

**Toggle 1 — `email_marketing_opt_in`**
Label: "Email me with style tips and finds"
Why we ask: "We'll send you occasional emails with style ideas and new finds matched to your archetype. You can unsubscribe anytime. We'll never share your email address."

**Toggle 2 — `audience_data_opt_in`**
Label: "Help shape Cornr's style insights"
Why we ask: "We'd like to include your style choices in anonymised trends we share with partner brands — for example, telling a sofa brand that 30% of our users in your archetype are looking for a new sofa. We never share who you are. We never share individual data. Only opted-in users are included in these trends."

Both stored as separate boolean columns on `users`. Marketing email and audience data inclusion are independent — opting into one does not opt into the other. Both must be revocable post-signup (future Profile → Settings).

---

## Section 4 — Engagement Data Architecture (v1)

Cornr captures first-party engagement data in its own database, mirroring critical PostHog events. PostHog remains the analytics surface; the Cornr `engagement_events` table is the data asset.

**Three new tables:**

1. **`archetype_history`** — append-only longitudinal record of every archetype assignment. Written on initial swipe completion and every retake. Captures how a user's taste evolves over time. The freshness mechanism for the audience data asset.

2. **`engagement_events`** — first-party event log. Mirrors the most important PostHog events: `signup_completed`, `archetype_assigned`, `room_created`, `product_card_shown`, `product_link_clicked`, `product_wishlisted`, `retake_started`. Each row has `event_type`, `event_data` JSONB, `occurred_at`, and `retention_until` (default `now()+18 months`). Daily pg_cron purge job deletes rows past retention.

3. **`editorial_content`** — canonical store for the Home tab editorial slot. Manually populated. Includes archetype filtering so future content can be archetype-targeted.

**Schema additions to existing tables:**
- `users`: `audience_data_opt_in BOOLEAN DEFAULT false`, `journey_stage VARCHAR(20)`, `home_status VARCHAR(20)`
- `rooms`: `is_aspirational BOOLEAN DEFAULT false`, `room_stage VARCHAR(20)`, `existing_categories TEXT[]`, `existing_descriptions JSONB`
- `products`: `delivery_tier VARCHAR(20)`, `description TEXT`, `attribute_tags TEXT[]`
- `wishlisted_products`: `removed_at TIMESTAMPTZ` (soft delete)

**Note:** `occupancy_status` on rooms is REMOVED — replaced by `journey_stage` on users.

**New table:**
- `trades_waitlist`: `id UUID`, `email TEXT NOT NULL`, `consent_at TIMESTAMPTZ NOT NULL`, `retention_until TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '18 months')`

All engagement event writes go through a single helper function: `src/services/engagement.ts → recordEvent(eventType, eventData)`. Called alongside PostHog `.capture()` calls in existing event handlers. No new event handlers needed.

### Engagement Event Payload Schema Registry

Every event type has a documented, consistent JSONB shape. No freeform blobs.

| Event type | Payload schema |
|---|---|
| `signup_completed` | `{ journey_stage, home_status }` |
| `archetype_assigned` | `{ primary, secondary, swipe_scores, swipe_decisions: [{image_id, direction, position, time_ms}] }` |
| `room_created` | `{ room_type, budget_tier, journey_stage, is_aspirational }` |
| `room_refined` | `{ room_id, room_stage, existing_categories, existing_descriptions }` |
| `product_card_shown` | `{ product_id, archetype_context, room_id, room_type, position, is_aspirational, model_version }` |
| `product_link_clicked` | `{ product_id, archetype_context, room_id, position, source }` |
| `product_wishlisted` | `{ product_id, room_id, archetype_context }` |
| `retake_started` | `{ previous_primary, previous_secondary }` |
| `editorial_card_shown` | `{ content_id }` |
| `editorial_card_clicked` | `{ content_id, cta_url }` |
| `trades_waitlist_email_submitted` | `{ email_hash }` |

---

## Section 5 — Editorial Surface (v1)

One editorial card on the Home tab. Image-led, headline overlay, single CTA. Manually populated from the `editorial_content` table. Refreshed weekly or biweekly by Daryll.

**Visual specification (EditorialCard organism):**
- Full-width card with image dominating 60%+ of card area
- `radius-card` (16px), `shadow-card`
- Image at top, gradient overlay (ink-toned, `rgba(26,24,20,0.55)` to transparent) covering bottom 40% of image
- Headline overlays the gradient in Lora 22px/600 white, with 20px padding
- Below image: optional `bodyText` in DM Sans 16px/400 ink, 16px padding
- Below body: `ctaLabel` as `GhostLink` with accent (#9E5F3C) highlight on the action verb
- Press: `activeOpacity 0.85` + `haptic-light`. Whole card pressable.
- a11y: `accessibilityRole="link"`, label from headline + ctaLabel

**Engagement events:** `editorial_card_shown` (debounced, once per session) and `editorial_card_clicked` fire to both PostHog and `engagement_events`.

**Fallback mode:** when no `editorial_content` row is published-and-not-expired, render the user's most recent wishlisted product with headline "Still thinking about this?" and CTA "View your wishlist". Ensures the home screen never shows stale content even if Daryll's editorial commitment slips.

**Success metric:** by Week 30, `editorial_card_clicked / editorial_card_shown` ≥ 5% validates v2 brand partnership content thesis. < 1% means content thesis doesn't work and v2 plans should adjust.

---

## Section 6 — Database Schema (10 tables, post-LR-PROD-SYNC, prod-mirror)

**Current 10 public tables (staging and prod, post-LR-PROD-SYNC 9 May 2026):**
- Original 6 (16 March schema): `users`, `style_profiles`, `rooms`, `products`, `wishlisted_products`, `places_cache`
- Bridge-sprint additions (7–24 April migrations): `consent_events`, `editorial_content`, `archetype_history`, `engagement_events`

Tables added 7 April 2026 in strategic foundation pack: `archetype_history`, `engagement_events`, `editorial_content`. Existing tables with new columns: `users`, `rooms`, `wishlisted_products`.

| Table | Key Columns | RLS |
|---|---|---|
| `users` | `id`, `email`, `postcode_district`, `push_token`, `daily_call_count`, `property_period`, `email_marketing_opt_in`, `audience_data_opt_in`, `journey_stage`, `home_status`, plus existing notification columns | Own row only |
| `style_profiles` | `id`, `user_id`, `primary_archetype`, `secondary_archetype`, `swipe_scores` JSONB, `is_anonymous`, `created_at` | Own row only |
| `archetype_history` | `id`, `user_id`, `primary_archetype`, `secondary_archetype`, `swipe_scores` JSONB, `source` (initial/retake/admin), `recorded_at` | Own rows, append-only |
| `rooms` | `id`, `user_id`, `room_type`, `display_name` (nullable), `budget_tier`, `room_analysis` JSONB (nullable), `archetype_at_recommendation`, `is_aspirational`, `room_stage`, `existing_categories`, `existing_descriptions` JSONB | Own rooms only |
| `products` | `id`, `title`, `description`, `image_url`, `retailer`, `affiliate_url`, `archetype_tags`, `room_tags`, `trend_tags`, `budget_tier`, `category`, `season`, `delivery_tier`, `attribute_tags`, `source` | Read-all auth users |
| `wishlisted_products` | `id`, `user_id`, `product_id`, `room_id`, `created_at`, `removed_at` (soft delete) | Own rows only |
| `places_cache` | `id`, `postcode_district`, `trade_type`, `results` JSONB, `cached_at` | Service role only |
| `engagement_events` | `id`, `user_id` (nullable for anon), `event_type`, `event_data` JSONB, `occurred_at`, `retention_until`, `model_version` (nullable for AI events) | Own rows only |
| `editorial_content` | `id`, `headline`, `body_text`, `image_url`, `cta_label`, `cta_url`, `archetype_filter` (nullable), `published_at`, `expires_at` | Read-all auth, published & not expired only |
| `trades_waitlist` | `id`, `email`, `consent_at`, `retention_until` | Insert for authenticated, select own only |

**Default-deny RLS on every table. CASCADE DELETE on all user-linked FK constraints.**

**RLS-DRIFT-CONSENT-EVENTS (open P2, 9 May 2026):** canonical INSERT policy for `consent_events` is `WITH CHECK (auth.uid() = user_id OR user_id IS NULL)`. Live staging policy is `"Service role can insert consent events"` `WITH CHECK true` for role `public` — not in any committed migration. Provenance under investigation; resolution will either restore canonical intent or document the loosened intent.

**Vestigial `gen_random_uuid()` default on `public.users.id` (candidate-for-removal):** predates the `handle_new_user` trigger which now owns row creation from `auth.users(id)`. A stray bare `INSERT` would get a random id that FK-fails. To be dropped as part of the SIGNUP-PUBLIC-USERS-SYNC ADR if scope permits.

### pg_cron jobs (4 total)

- `purge-anonymous-sessions`: hourly. Deletes anonymous `style_profiles` older than 24h.
- `purge-places-cache`: hourly. Deletes `places_cache` rows older than 24h.
- `reset-daily-call-count`: daily midnight UTC. Resets `users.daily_call_count` to 0.
- `purge-engagement-events`: daily 02:00 UTC. Deletes `engagement_events` rows where `retention_until < NOW()`.

### Schema migration SQL (consolidated, ready to paste into staging Supabase)

```sql
-- Bridge Sprint: consent split
ALTER TABLE users ADD COLUMN IF NOT EXISTS audience_data_opt_in BOOLEAN DEFAULT false;

-- Bridge Sprint: editorial content
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
  FOR SELECT USING (auth.role() = 'authenticated'
    AND published_at <= now()
    AND (expires_at IS NULL OR expires_at > now()));

-- Bridge Sprint: archetype history
CREATE TABLE IF NOT EXISTS archetype_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  primary_archetype VARCHAR(50) NOT NULL,
  secondary_archetype VARCHAR(50),
  swipe_scores JSONB NOT NULL,
  source VARCHAR(20) NOT NULL CHECK (source IN ('initial','retake','admin')),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE archetype_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "archetype_history_select_own" ON archetype_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "archetype_history_insert_own" ON archetype_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bridge Sprint: engagement events
CREATE TABLE IF NOT EXISTS engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '18 months'),
  model_version VARCHAR(50)
);
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "engagement_events_select_own" ON engagement_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "engagement_events_insert_own_or_anon" ON engagement_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE INDEX IF NOT EXISTS engagement_events_user_occurred ON engagement_events(user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS engagement_events_type_occurred ON engagement_events(event_type, occurred_at DESC);

-- Bridge Sprint: room context fields
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS is_aspirational BOOLEAN DEFAULT false;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS occupancy_status VARCHAR(20);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS room_stage VARCHAR(20);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS existing_categories TEXT[];
ALTER TABLE rooms ALTER COLUMN display_name DROP NOT NULL;
ALTER TABLE rooms ALTER COLUMN room_analysis DROP NOT NULL;

-- Bridge Sprint: wishlist soft-delete + active partial index
ALTER TABLE wishlisted_products ADD COLUMN IF NOT EXISTS removed_at TIMESTAMPTZ;
ALTER TABLE wishlisted_products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
CREATE INDEX IF NOT EXISTS wishlisted_products_active
  ON wishlisted_products(user_id, room_id)
  WHERE removed_at IS NULL;

-- Bridge Sprint: pg_cron retention job for engagement events past 18 months
SELECT cron.schedule(
  'purge-engagement-events',
  '0 2 * * *',
  $$DELETE FROM engagement_events WHERE retention_until < NOW();$$
);

-- Bridge Sprint: update existing anonymous-session purge to also clear anon engagement events
SELECT cron.unschedule('purge-anonymous-sessions');
SELECT cron.schedule(
  'purge-anonymous-sessions',
  '0 * * * *',
  $$
  DELETE FROM style_profiles WHERE is_anonymous = true AND created_at < NOW() - INTERVAL '24 hours';
  DELETE FROM engagement_events WHERE user_id IS NULL AND occurred_at < NOW() - INTERVAL '24 hours';
  $$
);

-- Sprint 3 prep (locked 7 April 2026 PM): trend layer on products table
-- Adds trend_tags array for filtering recommendations by current trend features.
-- See Section 0 strategic decisions log for the 65/35 stable-vs-trend rationale.

ALTER TABLE products ADD COLUMN IF NOT EXISTS trend_tags TEXT[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS products_trend_tags ON products USING GIN (trend_tags);

-- While we're here: ensure GIN indexes on existing array columns for query performance
CREATE INDEX IF NOT EXISTS products_archetype_tags ON products USING GIN (archetype_tags);
CREATE INDEX IF NOT EXISTS products_room_tags ON products USING GIN (room_tags);

-- 11 Apr evening: journey_stage and home_status on users
ALTER TABLE users ADD COLUMN IF NOT EXISTS journey_stage VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS home_status VARCHAR(20);

-- 11 Apr evening: remove occupancy_status from rooms (replaced by journey_stage on users)
-- Safe: only test-a and test-b staging accounts may have data. IF EXISTS handles missing column.
ALTER TABLE rooms DROP COLUMN IF EXISTS occupancy_status;

-- 11 Apr evening: existing_descriptions on rooms
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS existing_descriptions JSONB;

-- 11 Apr evening: product enrichment fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_tier VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS attribute_tags TEXT[];
CREATE INDEX IF NOT EXISTS products_attribute_tags ON products USING GIN(attribute_tags);

-- 11 Apr evening: trades waitlist
CREATE TABLE IF NOT EXISTS trades_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '18 months')
);
ALTER TABLE trades_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trades_waitlist_insert_auth" ON trades_waitlist
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- No SELECT policy for regular users — admin/service_role only
CREATE POLICY "trades_waitlist_select_service" ON trades_waitlist
  FOR SELECT USING (auth.role() = 'service_role');

-- 12 April: delivery_tier badge support (Sprint 3 T1a, MC-IA-1)
-- Column populated via seed script in T1a. Badge rendered on ProductCard at decision-time per TD-17.
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_tier VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'seed';

-- 12 April: engagement_events functional indexes for brand reporting queries (TD-5)
-- Indexes JSONB payload fields wired in Sprint 3 T1d. Empty until T1d ships.
-- Query pattern: WHERE event_type = X AND event_data->>'archetype' = Y GROUP BY occurred_at
-- Supabase RLS plans against functional indexes; verify query plans at brand reporting build time.
CREATE INDEX IF NOT EXISTS engagement_events_type_archetype
  ON engagement_events(event_type, (event_data->>'archetype'), occurred_at DESC);
CREATE INDEX IF NOT EXISTS engagement_events_journey_stage
  ON engagement_events((event_data->>'journey_stage'), occurred_at DESC);
CREATE INDEX IF NOT EXISTS engagement_events_acquisition_source
  ON engagement_events((event_data->>'acquisition_source'), occurred_at DESC);

-- 12 April: recommendation_cache table for Sprint 3 T1c fallback layer
CREATE TABLE IF NOT EXISTS recommendation_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,  -- format: archetype|room_type|budget_tier|room_stage
  response JSONB NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);
ALTER TABLE recommendation_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recommendation_cache_service_only" ON recommendation_cache
  FOR ALL USING (auth.role() = 'service_role');
CREATE INDEX IF NOT EXISTS recommendation_cache_key ON recommendation_cache(cache_key);
CREATE INDEX IF NOT EXISTS recommendation_cache_expiry ON recommendation_cache(expires_at);
```

---

## Section 7 — Sprint Plan

### Sprint 1 — COMPLETE 7 April 2026

T1–T10 done. Six PRs merged. Tokens.ts is styling source of truth. NativeWind removed. Fonts bundled. RLS verified across 6 original tables. Sentry EU + PostHog EU live. `signup_completed` event firing.

### Bridge Sprint — Strategic Foundation — COMPLETE 7 April 2026

T13 → T11 → T12 merged in order. Three PRs, branches deleted, main synced. EditorialCard organism live with three-tier fallback (real row → wishlist → quiet welcome). Engagement helper (`src/services/engagement.ts`) wired alongside PostHog for `signup_completed`; remaining six event wiring sites flagged for Sprint 2/3. Voice gate added to CLAUDE.md and `/done` as standing rule. Sprint 2 unblocked.

### Sprint 2 — Swipe Deck and Archetype Result

**Prerequisite:** Bridge Sprint complete. All schema migrations applied. Engagement helper wired.

T1–T3, T5 unchanged from v4.

**T4 — Archetype Result screen share quote (REVISED)**

**Share button (revised 7 April 2026 PM):** uses expo-sharing with the new hybrid format that pairs personality name with style territory and includes the archetype's essence line:

> "I'm The [Personality] · [StyleTerritory]. [EssenceLine]. Find your home style on Cornr. cornr.co.uk"

Worked example:

> "I'm The Nester · Coastal. You make a place feel lived-in before you've unpacked a box. Find your home style on Cornr. cornr.co.uk"

The essence line is the Newsreader-italic sentence from `src/content/archetypes.ts` — one of the four required components of every archetype description per the strategic brief. Until descriptions are written, the share button can use a placeholder essence line and ship; the placeholder gets swapped for the real essence line in a follow-up commit when descriptions land.

PostHog `share_initiated` event payload now includes `style_territory` in addition to existing fields:

    share_initiated {
      primary_archetype: string,
      style_territory: string,
      secondary_archetype: string | null,
      channel: string
    }

**T6 — Budget + Room Setup (REVISED 11 April)** — two-screen flow + post-recommendation refinement:

*Screen 1:* "Let's find your first [Archetype] picks" — adaptive journey_stage (tenure → timeline) + conditional home_status. SelectorCard pattern.
*Screen 2:* Budget tier + room type (existing spec).
*Post-recommendation refinement:* Non-blocking card after first recommendations. Room stage (defaulted from journey_stage, overridable) + existing_categories checkboxes + existing_descriptions free text.

Voice: briefing becoming refinement. Newsreader italic for the bridge intro, DM Sans for everything functional. PostHog `room_created` event fires after Screen 2. `room_refined` event fires when refinement card is submitted.

### Sprint 3 additions from 11 April evening session

Sprint 3 T1 prompt design must include:
- `ROOM_SEQUENCES` category priority map in `src/content/rooms.ts`
- `CATEGORY_MAP` bridging user-facing labels to sequencing IDs
- Prompt instruction: product 1 from first unmet category in sequence
- Prompt instruction: timing note when first product is long-lead delivery
- Prompt instruction: renting journey_stage prioritises freestanding, portable items
- Prompt caching: system prompt + product catalogue as cached prefix
- Swipe decisions array in `archetype_assigned` event payload
- `product_card_shown` payload per schema registry

Sprint 3 T2 product card must include:
- Delivery tier display (Truck icon + label from `src/content/labels.ts`)

T7 unchanged.

### Sprint 3 — AI Recommendations (T1 prompt structure locked, revised 11 April, split into T1a-T1d 12 April)

The `recommend-products` Edge Function prompt must:
1. Take inputs: archetype (primary), secondary archetype (blending rule: influences P3 only), room_type, budget_tier, property_period (optional, soft hint only), room_stage, existing_categories, existing_descriptions (optional free-text), is_aspirational, last 5 wishlisted products (title + category + archetype_tags as taste signal)
2. Return exactly 3 products in stated priority order
3. **Products 1-2:** pure primary archetype. **Product 3:** may draw from secondary archetype.
4. **Non-aspirational rooms:** first product = "buy next" given stage; second complements first; third = stretch piece within budget
5. **Aspirational rooms:** all three = anchor pieces / inspiration, not "buy next" framing
6. Rationale text NEVER invokes property_period claims. Describes visible product qualities only.
7. property_period passed in as soft system-prompt nudge
8. Wishlisted products framed as taste signal: "complement, don't duplicate"
9. `model_version` set to `claude-haiku-4-5` in `engagement_events`
10. **Catalogue degradation:** if fewer than 3 products match exact archetype + room + budget, widen to secondary archetype first, then adjacent archetypes per adjacency map in `src/content/archetypes.ts`, before returning fewer than 3
11. **Failure taxonomy:** (a) timeout >10s — retry once, then curated fallback set; (b) malformed JSON — log to Sentry, curated fallback; (c) partial response (1-2 products) — show what we got; (d) rate limit — queue, 30s retry, curated fallback after 3 attempts
12. **Curated fallback sets:** 3 pre-selected products per archetype × budget tier (21 sets, 63 products), created during catalogue curation

**Trend layer (added 7 April 2026 PM — see Section 0 strategic decisions log)**

The Edge Function gains a fifth-class input alongside the existing inputs:

- **`trend_context`** — a structured trend feature list pre-filtered for this archetype, imported at Edge Function build time from `src/content/trends.ts`. Each entry includes: feature name (internal only, never user-facing), priority tier (P1 or P2), and `rationale_qualities` (the quality language the model uses in user-facing rationale text).

The vocabulary file `src/content/trends.ts` is created during Sprint 3 prep. It is the SINGLE SOURCE OF TRUTH for the trend vocabulary — referenced from both the Edge Function (via import) and from Track C catalogue sourcing (via the Mission Control trend vocabulary tab, which mirrors the file contents). Any change to the vocabulary updates both at once.

**Trend layer rules for the Haiku prompt:**

1. Trend signal weighted at approximately 20–25% of recommendation relevance. Archetype is the primary driver; trends flavour but never dominate.
2. Trend items are recommended for **accessory and accent positions only**, never for primary furniture. Primary furniture follows archetype identity alone. This protects the user from chasing trends on high-investment items they cannot affordably replace.
3. Aspirational rooms (where `is_aspirational=true`) follow the same trend layer rules — the model still references current sensibility but in inspiration-led language rather than buy-next language.
4. **Critical rule for rationale text (the rule that protects the app from dating):** the rationale must reference the *quality* a trend embodies, NEVER name the trend itself. The model uses the `rationale_qualities` field from the trend vocabulary, not the feature name.
   - ✓ Correct: "Chosen because the warm walnut finish has the depth you're drawn to."
   - ✗ Wrong: "Chosen because walnut is trending in 2026."
   - ✓ Correct: "Chosen because the soft chalky limewash gives the room a quiet undertone."
   - ✗ Wrong: "Chosen because limewash is having a moment."
   The Haiku prompt explicitly instructs the model to avoid naming trends, era references, or any temporal language. Rationale text should read as timeless even when the underlying recommendation is trend-aware.
5. The `model_version` field on `engagement_events` is set to `claude-haiku-4-5` for every recommendation generation, as already specified.

**Revised input list for the Edge Function (replaces the existing 4-input list):**

1. `archetype` (primary, from whitelist of 7 IDs)
2. `secondary_archetype` (optional, may be null)
3. `style_territory` (paired with archetype, e.g. "Warm Scandi")
4. `room_type`, `budget_tier`, `room_stage`, `existing_categories`, `is_aspirational`
5. `property_period` (optional, soft hint, never user-facing in rationale)
6. **NEW:** `trend_context` — pre-filtered trend feature list for this archetype, imported from `src/content/trends.ts`

**Input validation note for Sprint 3 T4:** the input whitelist must include archetype IDs, style_territory strings, and trend feature codes (the internal feature identifiers from `src/content/trends.ts`). This is a small additive change to the existing T4 whitelist work — no separate task needed.

**PostHog payload changes for Sprint 3:**
- `product_card_shown` payload gains `trend_tags` (the trend tags from the recommended product itself)
- `product_link_clicked` payload gains `trend_tags`
- `room_created` payload unchanged (no trend layer at room creation time)

Full prompt template drafted at Sprint 3 T1 build time.

**12 April update: T1 splits into T1a-T1d.** The 7-point prompt spec above remains the design contract. T1b is where the rationale prompt branches (scratch/partial/aspirational) live, T1a/c/d handle everything else.

**Sprint 3 T1a — Edge Function scaffolding (~5h):** Scaffold `recommend-products` Edge Function. Query products table filtered by budget_tier and archetype_tags. First Haiku call returns exactly 3 product IDs in priority order using structured output. Add `delivery_tier` and `source` columns to products table + seed delivery_tier values for existing catalogue. No rationale generation yet.

**Sprint 3 T1b — Rationale generation (~5h):** Second Haiku call per product for natural language rationale. Uses the 7-point prompt spec above. Three prompt branches:
- **Scratch (existing_categories is empty or "Nothing yet"):** no "working around existing pieces" language; anchor-first language.
- **Partial:** reference existing_categories as context; Position 1 rationale NEVER names a kept category.
- **Aspirational (is_aspirational=true):** all three products framed as anchor pieces / inspiration, no "buy next" framing.

Rationale quality gate enforced in prompt:
1. Material/texture/form reference (e.g., "warm walnut grain", "clean-line silhouette")
2. Behavioural reference ("for the evenings you actually use this room")
3. Never invoke property_period in user-facing rationale
4. Never name trends

Position-aware sequencing: Position 1 = "buy next" anchor purchase. Position 2 = complements position 1. Position 3 = stretch piece within budget.

**Sprint 3 T1c — Validation, cache, fallback (~4h):** Response validation (check returned product IDs exist in products table, retry up to 2x on invalid response, fallback to cached response on second failure). Cache layer lives in new `recommendation_cache` table (see Section 6 SQL) keyed on `archetype|room_type|budget_tier|room_stage` with 7-day TTL. Cache miss = Haiku call; cache hit under 7 days = served from cache; Haiku failure = serve from cache regardless of age with warning log.

**Sprint 3 T1d — Payload wiring (~3h):** Populate engagement_events JSONB payload: position (1/2/3), retailer, category, journey_stage, acquisition_source (captured on first session — new field, requires privacy policy update), model_version ("claude-haiku-4-5" — column already exists from 7 April canonical, T1d just populates it). Wire product_card_shown, product_link_clicked, product_wishlisted events. Verify PostHog receives same payload structure.

**Total Sprint 3 T1: ~17h.**

### Sprints 4–6 — high-level summary

Detailed task specs for Sprints 4–6 will be drafted when each sprint is reached. High-level scope:

**Sprint 4 — Rebrand, Polish & Trades Placeholder (REVISED 11 April, ~10h, Weeks 11–13).** T-RENAME-1 through T-RENAME-8 unchanged (external service rebranding). Trades tab: "Coming Soon" demand-capture screen replaces Google Places directory. Tab remains in bottom navigation (wrench icon). Screen shows: headline, one-line description of what's coming, email capture field. PostHog events: `trades_tab_tapped`, `trades_coming_soon_email_submitted`. ~2-3h build, replacing the original ~15h trades directory scope. Delete account flow (Apple Guideline 5.1.1v) unchanged — launch blocker. Gate: Sprint 3 complete.

**Sprint 5 — Engagement: Push, Email, Delete (~18h, Weeks 14–15).** Push notification permission with pre-prompt screen after first room setup. Four notification triggers (seasonal refresh, second room nudge, wishlist reminder, new products). Global cap: max 2 per user per 7 days. Delete Account flow with two-step confirmation. Welcome email via Supabase Auth Hook. Password reset deep link. Gate: Sprint 4 complete.

**Sprint 6 — Polish, Accessibility, Submission (~32h, Weeks 16–19).** EAS production build with bundle ID `uk.co.cornr.app`. App icon. UX design review polish pass. Accessibility audit (VoiceOver, all 16 checklist items from BDS v3). Security audit (npm audit, RLS verification, secrets check). Content & legal audit. App Store metadata. Terms of Service at cornr.co.uk/terms. TestFlight with 50 testers. App Store + Google Play submission. Post-launch OTA capability via EAS. Gate: all 3 pre-submission checklists green.

---

## Section 8 — v2 Roadmap (annotated with v1 enablers)

| Workstream | Description | Trigger | v1 enabler |
|---|---|---|---|
| A: Digital Home | Photo → AI restyle → product matching → affiliate links. Cornr Pro £6.99/mo. | v1 affiliate CTR ≥10% + qualitative confirms | Independent of 7 April critiques |
| B: Cornr Advisor | Persistent AI, Sonnet-class, multi-turn design conversation. | Digital Home engagement ≥3 renders/user/month | **UNBLOCKED by `engagement_events` table** — multi-turn AI requires query-at-runtime user history |
| C: Brand Partnerships | Homeware brands pay for stylesegmented FTB audience access. Sponsored placements. Glassette model. | >10K profiled users | **ENABLED by `audience_data_opt_in` consent + `editorial_content` placement surface** |
| D: Taste Intelligence | Anonymised aggregate archetype data sold quarterly to homeware brands. BCG 2.9× model. | >7K completed quizzes | **ENABLED by `audience_data_opt_in` consent + `archetype_history` longitudinal data** |
| E: Tradesperson Marketplace | Tiered subscriptions, lead fees, archetype matching. Single metro, design-led trades. | Digital Home + 18–24 months post-launch | unchanged |
| F: Digital Home Record | Full persistent model. LiDAR. B2B partnerships. | v3+ horizon | unchanged |

---

## Section 9 — Task-Level Critique Workflow

Every Sprint task prompt passes a critique gate before being pasted into Claude Code. The critique shapes the prompt, never replaces the build.

### Sizing

- **SMALL** (under 3h, single file, no architectural impact): 3 personas, 1 round, 1 paragraph each. ~5 minutes. *Example: "Add a retake confirmation modal".*
- **MEDIUM** (3–8h, multiple files, no architectural impact): 5 personas, 2 rounds. ~15 minutes. *Example: "Build the SwipeCard component with gesture handling".*
- **LARGE / STRATEGIC** (8h+, OR touches recommendation engine, consent flow, data architecture, or any cross-sprint contract): 10 personas, 3 rounds, full format. ~30+ minutes. *Example: "Build the recommend-products Edge Function".*

### Personas

**Core (always present):** Solo Founder, Senior RN Engineer, one user-shaped persona (FTB / Pre-Purchase Researcher / Renovator — selected by which user the task affects).

**Contextual pool (selected per task):** Security Auditor, GDPR DPO, AI Critic, Behavioural Economist, Glassette CEO friendly critic, Brand Partnership Buyer, Future plc Strategy Lead, Direct Competitor PM, Interior Designer, Renovation Project Manager, React Native Layout Engineer, Phosphor Icons Specialist, expo-router Architect, Tokens.ts Maintainer, Supabase RLS Auditor.

### Rules

- Critique runs in the planning conversation (claude.ai), not in Claude Code.
- Output is the *prompt*, not the critique itself. Critique shapes the prompt then is saved as a comment block at the top of the Mission Control task card.
- **Skip critique for:** single-line bug fixes, memory updates, MC regenerations, document edits where the strategic decision is already locked here.

### Anti-patterns

The critique becomes theatre when (a) all personas agree in Round 1, (b) synthesis says "do what we already planned", or (c) the same five personas show up regardless of task. **Of every 10 critiques, at least 3 should produce a meaningful change to the original plan.** If 10/10 just rubber-stamp, the format isn't doing its job.

---

## Section 10 — Workflow Rules

### Session start gate (mandatory)

1. Read memory.
2. Read this file (CORNR_CANONICAL.md).
3. State to Daryll in 2–3 sentences: what's done + what's next + current commit.
4. Ask "Does this match?" and WAIT for confirmation.
5. NEVER regenerate Mission Control or produce prompts until status is confirmed.
6. If status seems wrong, search past chats before assuming.
7. Launch Claude Code with vault using `C:\Projects\Nook\launch-claude.ps1` — this loads both the repo and `C:\Users\Skcar\Documents\cornr-brain` as working directories.

### Document update rule

When a strategic decision is made:
1. Append a new entry to Section 0 of this file (Strategic Decisions Log).
2. Update any other affected sections of this file.
3. Daryll replaces the file in project knowledge and the repo. **No PDF wrangling, no .docx conversions, no manual section edits across multiple documents.** This file is the only living document.

The Brand & Design System v3, Operations & Legal v2, and Competitor Analysis v2 PDFs remain in project knowledge as stable reference documents — they are not edited going forward, and if they conflict with this canonical, this canonical wins. The Cornr Master Document v4 PDF has been archived to Google Drive (content captured in this canonical). This file is authoritative for all build planning and product decisions.

### Mission Control rules

- Storage key: `cornr-mc-2026-04-12` (permanent — do not bump). Default ALL tasks to "todo" in JSX. Let `window.storage` override. Never hardcode "done".
- MC prompts must be copy-paste ready with literal values. Never descriptions Claude Code has to interpret.

### Build quality rules (apply every session)

1. Run `npx tsc --noEmit` after every Claude Code session — silent TS errors kill the bundler with no red output.
2. Supabase query builder returns PromiseLike — wrap in `Promise.resolve()` before `.catch()`/`.finally()`.
3. Never call `useAuth()` inside another hook — pass user as parameter.
4. expo-router v6 requires `app/index.tsx` as root entry file.
5. Check `expo.dev/go` before any SDK version decision.
6. Use `/plan` before 2+ file tasks; `/compact` every 30–45 mins in Claude Code.
7. Multi-persona critique required before any second fix attempt on a repeated bug.

### Recall-before-produce rule

Before launching any external research task, producing any new document, or running any multi-persona critique, Claude must first search past conversations and project knowledge for existing work on the same or overlapping questions. If prior work exists, Claude surfaces it, states what it already covers, and asks whether fresh work is still needed or whether the existing work can be built on. Default to *recall*, then *reuse*, then *produce*.

Skip the recall step only when: (a) the user explicitly says "we haven't looked at this before", (b) the question is about current events or time-sensitive data, or (c) the task is a quick factual lookup under approximately 2 minutes.

This rule exists because Cornr has accumulated substantial research (Glassette intelligence, March competitive review, archetype validation, taxonomy mapping, April trend research) that is easy to forget and expensive to reproduce.

### Provisional-until-proven rule

Every user-facing naming, copywriting, and taxonomy decision in Cornr v1 is provisional until tested against real user data. This includes archetype names and descriptions, style territory pairings, reveal screen copy, share quote templates, product rationale templates, button labels, and voice choices. These are hypotheses from evidence and research, not immutable commitments. TestFlight (Sprint 6) and the first 100 post-launch users are explicit review gates. If data says change it, we change it.

This rule does NOT apply to: database schema, RLS policies, data model, security and consent flows, WCAG contrast rules, brand hard constraints from BDS v3 (palette, fonts, 90/10 rule), or any decision listed in the "Settled product decisions — do not reopen" subsection of Section 2 below. Those are load-bearing; everything downstream of them flexes.

### Standing rules (added 11 April 2026)

8. The archetype result must visibly influence every subsequent screen the user encounters. If a user can use a feature without seeing how their archetype shapes it, the feature is incorrectly designed.
9. Every new event type must fire to both PostHog AND `engagement_events` — never one without the other. Prevents analytics/data-asset drift.
10. Any future web surface must share Supabase auth with the mobile app. No separate account systems.
11. Every Claude.ai planning session that makes strategic decisions must end with: (a) a paste-ready canonical patch, and (b) a DECISIONS_LOG.md append. This is how decisions persist.

---

## Section 11 — Open Questions (live)

| Question | Resolve by | Default |
|---|---|---|
| Wayfair mobile exclusion workaround | Before Sprint 3 | Use in-app webview (`expo-web-browser`) for all affiliate links |
| IKEA product coverage without affiliate | Before Sprint 3 | Exclude IKEA from v1; revisit if programme launches |
| Digital Home API costs at scale | Before v2 scoping | Budget £130–250/month for 1K active users |
| Swipe card count: 12 or 15 | Sprint 2 build | Start 12, reduce if completion <45% |
| Seasonal product refresh process | Before launch | Manual quarterly. 30 new replacing bottom 30. |
| Archetype descriptions (7 new) | Next claude.ai planning session | Strategic brief locked 7 April PM (4-component structure, present-tense rule, Barnum defence, yes-but-light trend touches). Hybrid names locked. Writing blocked on a focused planning session — not on additional decisions. |
| Trend vocabulary refresh cadence (post-launch) | Sprint 6 launch prep | Quarterly review against Pinterest Predicts and John Lewis trend reports. Mid-quarter triggers, ownership, and re-tagging process all undefined. |
| GTM / TikTok content strategy | Sprint 6 TestFlight in sight | Trend research surfaced strong signals (Dusk +42% YoY TikTok-first, 47% of UK 25–34s use TikTok for renovation inspiration). Worth a dedicated planning session at the right stage. |
| EditorialCard content operationalisation | Sprint 6 launch prep | Format locked: "How [Archetype] homes are embracing [Trend]". Refresh cadence 2–4 weeks. Writer, sources, and weekly process all TBD. |
| Project knowledge audit | Next iPhone train session | Audit remaining project knowledge files (Operations & Legal v2, Competitor Analysis v2, BDS v3, Glassette intelligence). Decide which stay as PDFs, which migrate to markdown in repo, which archive to Google Drive. Estimated 30 mins. |
| BDS v3 → markdown migration | Pre-Sprint 6 launch prep | Convert BDS v3 from PDF in project knowledge to docs/BDS.md in repo. Includes the archetype accent table update with hybrid names paired with style territories (dreamer→nester rename). Tonight the PDF stays as-is — drift is low-risk because canonical Section 1 now has authoritative archetype names + hex colours. |
| Entry point question: room-first or taste-first | Today via strategic critique | No default — needs panel decision before T2 can start |
| v1 swipe deck image curation brief | After entry point decision | 12 photos mix — exact curation depends on critique outcome |
| Quiz-to-email conversion rate | Before launch email setup | Target 35-40% (Interact 2026 benchmark). Loops.so for delivery. |
| Assembly/fitting as v2 trades entry point | v2 scoping | TaskRabbit-style light services connect to purchase moment. Blocked on knowing what users bought (affiliate data on retailer side). |
| Awin sole trader acceptance | Before incorporation | Check if Awin accepts individual publisher accounts — may not need incorporation for affiliate applications. |
| TikTok content batch filming | Week 4 | Pre-film 10-15 videos before channel launches week 8; batch session not sustained |
| Awin server-to-server postback | Before R-4 brand pilot | Brands need purchase data not just clicks |
| Catalogue refresh post-launch | Before launch | 10 new/10 retired per month |
| Claude model string audit | Complete — verified b87c65e | All references confirmed claude-haiku-4-5 |

**Resolved 7 April 2026:** archetype as primary mechanic; Pre-Purchase Researcher serving; v2 brand partnership data foundation. See Section 0.

**Resolved 12 April 2026:** Commission rate recalibrated to 4-5% blended (research-backed); mortgage broker realistic volume (100-150 users over 6 months, not 1,200-3,600); Reddit deprioritised after subreddit claims invalidated; £100 paid budget allocated (£50 Pinterest + £30 Vistaprint + £20 reserve); Sprint 3 T1 architecture split into T1a-T1d; AI-native positioning locked as commercial moat. See Section 0 entries dated 12 April.

---

## Section 12 — Reading order for fresh sessions

1. This file, top to bottom.
2. Memory (already in Claude's context automatically).
3. The relevant sprint section (Section 7) for whatever you're building next.
4. Brand & Design System v3 PDF (in project knowledge) for component specs and visual rules.
5. For anything not in this canonical: check git history first, then ask Daryll. The Master Doc v4 PDF has been archived to Google Drive (Cornr/Archive/Documents/) — retrieve from there only if historical context is genuinely needed.
6. `docs/DECISIONS_LOG.md` — quick-scan for any decisions made since the canonical was last updated.
7. `docs/operations/business-setup.md` — current status of incorporation, domain, Apple Developer, etc.

If the remaining PDFs and this file disagree, **this file wins**.

---

## Section 13 — Standing Rules

Consolidated rules that apply across all sprints and sessions. Each rule has a source and rationale.

### Data & Brand Reports
- **Brand reports filter on `audience_data_opt_in = true`.** Never include non-consented users in brand-facing analytics. (Source: MC assessment Round 2)
- **Brand analytics count post-archetype-assignment behaviour only.** Pre-quiz browsing is internal calibration data, not reportable. (Source: item-first path critique)
- **Demographics derived from postcode + ONS enrichment, NOT captured from users.** Data minimisation — no age/income fields. (Source: data tear-down Round 2)
- **Y1 taste intelligence revenue = £0.** Data too thin to sell below 5K users. (Source: Thread deep dive Round 3)

### Recommendations & AI
- **Prompt caching:** system prompt + product catalogue as cached prefix in recommendation Edge Function. (Source: AI pricing analysis)
- **Model routing:** Haiku for recommendations, Sonnet for analysis and prompt evolution. (Source: AI pricing analysis)
- **Prompt evolution optimises for wishlist-to-click ratio, not raw CTR.** Decision confidence, not impulse. (Source: data tear-down Round 2)
- **Manual spot-check before actioning Claude analysis findings.** Small data produces plausible-sounding noise. (Source: Claude-native ML critique Round 1)
- **model_version string must change on every prompt evolution.** Enables before/after comparison. (Source: data tear-down)
- **Prompt evolution plateau detection:** if 2 consecutive quarterly analyses produce no significant changes, the binding constraint has shifted to catalogue or model — act on that signal. (Source: AI critique Round 3)
- **Room sequences are provisional.** Validate with click data via quarterly analysis. (Source: sequencing deep dive)

### Products & Catalogue
- **Seed product descriptions must be original** (written by Daryll or Claude), not copied from retailer sites. (Source: data tear-down Round 2)
- **`made_to_order` delivery tier only when verifiably true.** Default to `weeks` or `long_lead`. (Source: MC assessment Round 3)
- **Delivery tier labels in `src/content/labels.ts`**, not hardcoded in components. (Source: MC assessment Round 3)
- **Catalogue size hard ceiling:** products table stays under 500 active rows until a retrieval architecture (vector DB or similar) is in place. Enforceable via CI check. The Claude-native full-catalogue-in-prompt approach breaks above ~500 items. (Source: 12 April Solution Architect review)

### Commercial & Growth
- **Start brand conversations at 1,000 users, not 15,000.** Learn what brands want before building the product. (Source: Thread deep dive Round 4)
- **Stay focused on UK FTBs.** No audience expansion until niche proven. Market to FTBs, serve everyone including renters. (Source: Thread deep dive + renter analysis)
- **Week 30 diagnostic sequence:** 6 steps before any model pivot — (1) recommendation quality, (2) catalogue quality, (3) click-through UX, (4) wishlist remarketing, (5) audience segmentation, (6) only then model changes. (Source: Thread deep dive)
- **Quiz-to-signup conversion ≥ 35%** — leading indicator of owned audience. Track from day one. (Source: Thread deep dive)
- **Editorial return rate ≥ 10% MAU by month 6** — validates retention thesis. (Source: Thread deep dive)
- **TikTok time budget is front-loaded:** weeks 1-4 batch-film 10-15 videos; weeks 5-8 post 3-5/week from the batch; week 8 gate — 500+ followers on Cornr account OR kill TikTok and redirect time to Pinterest and brokers. Never sustain 6h/week on TikTok without evidence it's working. (Source: 12 April Social Media Manager + Crisis Planner)
- **GTM capacity cut order:** if post-launch GTM time exceeds 3h/week ongoing, cut channels in this order: Reddit first, Threads second, PR to quarterly (not monthly) third, Pinterest kept last. NEVER cut the share viral loop or mortgage broker maintenance. (Source: 12 April Crisis Planner)
- **Brand partnership pilot before 10K users:** run the first brand partnership pilot at 2-5K users, not 10K. Thread scaled to 325K without validating monetisation and died. The Dan meeting in May is the forcing function. (Source: 12 April Thread Analyst + Dan Crow persona)
- **Dan meeting happens regardless of build state:** if product isn't in TestFlight by May, the meeting still happens with mock-first data, illustrative Curator report, share card mockup, and revised timeline. Don't cancel for slippage. (Source: 12 April Crisis Planner + Dan Crow persona)
- **AI-native positioning leads all external conversations:** Cornr runs on prompts, not ML pipelines. The business story (personalisation at negligible cost) leads Dan deck and brand partnership pitches, not the technical story. (Source: 12 April AI-Native Business Owner persona)

### Privacy & Legal
- **Trades waitlist consent separate from marketing opt-in.** Purpose-specific, own retention rule (18 months or trades launch, whichever first). (Source: MC assessment Round 3)
- **Privacy policy must cover:** journey stage, home status, business transfer clause for acquisition/administration. (Source: data tear-down + Thread deep dive)
- **Check Anthropic inference_geo for EU data residency.** If available, use with 1.1x multiplier. (Source: AI pricing analysis)

### AI-Native Feedback Loops
- **Monthly prompt evolution** (post-launch, ≥500 rec events): feed recommendation performance to Claude, receive prompt improvement suggestions, review and apply. Founder task, not engineering task.
- **Quarterly cohort analysis** (≥200 quiz completions): feed anonymised engagement data to Claude with k-anonymity (k≥5 on archetype + room_type), receive archetype calibration report, product performance analysis, catalogue recommendations. Output doubles as brand partnership data product.
- **Anonymisation method for future training exports must be genuinely irreversible** (destroy salt). Document method before first export. (Source: GDPR critique)

### Content & Voice
- **Language bank** (`docs/content/cornr-language-bank.md`) is the register guide for all user-facing copy. Read before writing archetype descriptions, onboarding copy, recommendation rationale, or error states.
- **Archetype descriptions** require taste vocabulary (materials, textures, colours, objects) in the sensory anchor component. Emotional resonance alone is insufficient.
- **Escape hatch quiz pitch:** "Not sure this is your style? Find out in 2 minutes" — frames quiz as answering doubt, not unlocking a gate.
- **Room setup tone:** "Tell us what you're working with" / "Before we fine-tune" — Cornr refining, not interrogating.

### Future Features (noted, not built)
- **Taste drift detection + prompted retake:** compare user's recent click/wishlist archetype_tags against assigned archetype. v2 feature, architecture ready. (Source: data tear-down)
- **Decision confidence micro-survey:** post-click "How confident?" 1-5. Unique dataset. v2 measurement. (Source: data tear-down)
- **Purchase confirmation (B8):** elevated to early v2 priority. Self-declared purchase data enables brand conversion reporting. (Source: data tear-down)
- **Wishlist remarketing (sale alerts):** simplest version in late v1 or early v2. Refreshes affiliate cookie + creates return reason. (Source: Thread deep dive)
- **RoomProgress molecule:** visual progress indicator, ships with purchased state. (Source: sequencing deep dive)
- **ONS postcode district demographic lookup:** reference data table for brand report enrichment. ~2 hours data prep. (Source: data tear-down)
- **Quiz prediction alignment:** compare pre-quiz browsing to post-quiz archetype. Add when escape hatch live 30 days + ≥50 conversions. (Source: item-first path)

### Workflow & Source of Truth
- **Stale Pattern Gate on PDF-sourced facts:** before stating any technical or design fact from a PDF (colours, framework choices, archetype IDs), check canonical and memory for updates. If canonical contradicts PDF, canonical wins. If memory contradicts canonical on recent changes, memory wins. (Source: 12 April project instructions update)
- **Canonical patches include mandatory preflight checks.** Every canonical patch prompt for Claude Code must (a) read the current canonical first and verify exact-string targets exist before any find/replace, (b) check whether sections being created already exist and stop if they do, (c) print current state of any section being modified so drift is visible before edits land, (d) work on a dedicated branch (never on main), and (e) stop before commit, show diff, and wait for explicit "commit" approval. Patches that skip preflight are not paste-ready and must be rejected. (Source: 12 April session, after preflight detected drift between context snapshot and repo state on the canonical patch itself.)

### Archetype description rewrite loop

The seven archetype descriptions in `src/content/archetypes.ts` are v1 best-guess. The rewrite loop is the mechanism that turns "best guess" into "measurably improving."

**Trigger:** After 100 quiz completions per archetype post-launch, compute three metrics for each archetype:
- `wishlist_add_rate` (percentage of users with this primary archetype who add at least one product to wishlist within 7 days of reveal)
- `share_initiated_rate` (percentage of users with this primary archetype who tap the share button on their reveal screen)
- `retake_rate` (percentage of users with this primary archetype who retake the quiz within 30 days)

**Threshold for rewrite queue:** any archetype more than 1 standard deviation below the mean across all 7 archetypes on ANY of these three metrics enters the rewrite queue. High retake rate is a negative signal (description didn't land); low wishlist and low share rate are negative signals (description failed to motivate engagement).

**Rewrite mechanic:** when an archetype is rewritten, the `version` integer on its record in `src/content/archetypes.ts` bumps. The `engagement_events.archetype_version INTEGER` column logs which version each Haiku call consumed, enabling A/B comparison of rewrite v1 vs v2 against the same baseline metrics.

**Cache invalidation:** because the S2-T4-INSIGHT Edge Function caches blended reveal text per user, and because blended reveals draw phrases from multiple archetypes, the cache key for each cached reveal MUST include the `archetype_version` of every archetype involved in the blend (primary + all secondaries with score ≥ 0.15). Composite key format: `insight:{userId}:{primaryId}v{version}:{secondaryId}v{version}:{...}`. When any archetype's version bumps, all cached reveals referencing that archetype invalidate automatically.

**Rationale:** Cornr cannot know which descriptions will land before real users see them. The rewrite loop accepts that v1 is a starting point and builds the measurement infrastructure to make v2 evidence-based rather than gut-based. This rule explicitly authorises future Claude.ai sessions to rewrite descriptions in `src/content/archetypes.ts` when the metrics warrant it, without re-running the multi-persona panel critique each time — the panel work is locked for v1 only.

**What this rule does NOT authorise:** wholesale rewrites of multiple archetypes simultaneously (only one at a time, to keep the A/B clean), changes to the three-layer schema (locked separately in Section 1), or changes to the seven canonical archetype IDs (locked in Section 1).

**Source:** 13 April 2026 S2-T4-COPY writing session, 8-persona panel convergence on the principle that v1 best-guess descriptions need a measurable improvement path.

### Archetype colour must embody the style territory (R-14, added 15 April 2026)

The Curator gradient should feel mid-century modern. The Nester gradient should feel coastal. If a gradient could belong to any archetype, it is wrong. Test: cover the archetype name and ask "which style is this?" The colour alone should suggest the answer. Applies to all archetype-themed surfaces — reveal, share card, home tint, profile badge. (Source: 15 April Mercedes user test + style territory gradient audit.)

### Behavioural truth is the product (R-15, added 15 April 2026)

Every design decision on the reveal screen must be tested against: does this make the behavioural truth MORE or LESS prominent? Visual craft that competes with the truth text for attention gets killed. The truth is what users screenshot, share, and remember 24 hours later. If a panel has a beautiful image that looks better than the truth, cut the image. If a gradient is striking enough to draw the eye away from the truth, desaturate it. (Source: 15 April reveal redesign session.)

### LLM prompt input sanitisation (added 14 April 2026, post S2-T4 panel critique)

Free-text user input must not flow into LLM prompts without explicit sanitisation and review. The S2-T4-INSIGHT Edge Function's blend prompt currently accepts only score vectors, archetype IDs (from a validated enum), and property_period (from a validated set of values) — zero free-text user input. This is the safe configuration and must be maintained.

If a future feature captures free-text user input (e.g., open-ended responses, user-written descriptions, room notes), and that input is intended to flow into any LLM prompt, it requires:
1. A dedicated sanitisation layer that strips prompt-injection attempts (role reassignment, instruction overrides, system message forgery)
2. A size cap (max 200 chars per input field flowing into prompts)
3. A panel critique before the feature ships, specifically to review the injection surface

The reveal screen's blend prompt is the first such attack surface in Cornr. Protect the constraint.

### Archetype retake rate-limit enforcement (added 14 April 2026, S2-T5 prerequisite)

The archetype retake soft-cap (once per 30 days) must be enforced server-side via a database constraint or RLS policy — NOT via UI hiding alone. S2-T5 Profile retake implementation must include this enforcement from day one.

Rationale: the archetype rewrite loop (Section 13 above) compares retake_rate across archetypes to decide which archetypes enter the rewrite queue. If retake_rate is inflated by users or automated clients spamming retakes through an insufficiently-protected entry point, the rewrite loop fires on false positives and archetypes get rewritten based on noise rather than real signal.

Implementation: check `engagement_events` for rows where `user_id` matches, `event_type = 'archetype_retake_started'`, and `created_at > now() - interval '30 days'`. Reject the attempt server-side if the count exceeds 1. This check runs at the same layer where the retake action is performed — ideally an Edge Function rather than a client-side RPC, so the rate limit cannot be bypassed by crafting direct database calls.

### Colour must embody territory (R-14)

Archetype accent colours must be researched against UK retail evidence (John Lewis, Neptune, Farrow & Ball, Annie Sloan, Cox & Cox, House of Hackney) and reflect the style territory, not generic palette logic. Generic earth-tone gradients are a failure mode — Mercedes test, 15 April. CVD policy: colour is never the sole differentiator; name, motif, and typography are always co-present. Palette revisions require the CVD review gate before merge.

Source: 15 April 2026 design session.

### Behavioural truth is the product (R-15)

Every archetype surface (reveal description, share card, recommendation rationale) must include a specific, embarrassingly-true behavioural observation — the "how did it know that?" moment. Abstract style labels without behavioural truth fail the voice gate. This rule governs archetype copy writing, rationale template construction, and share card headline selection.

Source: 15 April 2026 design session (Mercedes feedback triggered the codification).

### Prompt caching is economic discipline (R-16)

Every Haiku call uses `cache_control: {type: "ephemeral"}` on the system prompt and the catalogue JSON block. Without caching, API costs triple and Sprint 3 unit economics go negative. Cache behaviour verified via the presence of `cache_read_input_tokens` in the response on warm calls. Non-negotiable for the recommend-products Edge Function.

Source: 16 April 2026 22-voice adversarial panel (Nia, Priya).

### Catalogue refresh cadence (R-17)

Minimum 10 new products and 10 retired products per month post-launch. Without refresh, users see the same three products within two to three sessions, which fires the dead-app kill risk. Refresh tracked via the `products.refresh_cohort` column. Applies from TestFlight onward.

Source: 16 April 2026 22-voice adversarial panel (Marcus).

### Session-start drift check (R-18)

Before producing any canonical-dependent work in a session, run `bash scripts/drift/check.sh`.

- Exit 0: proceed.
- Exit 2: drift detected, resolve before continuing (re-upload canonical to Project Knowledge, bump stamp in a follow-up commit).
- Exit 1: script error, investigate.

The script compares declared SHAs only. It cannot verify PK contents. Also confirm manually: the most recent PK upload happened after the last CANONICAL-SHA bump. If unsure, re-upload.

### Synthetic personas supplement, never substitute, real-user validation (R-19)

Synthetic persona fixtures (`src/content/synthetic-personas*.ts`) define the interface specification that Sprint 3 T1A must satisfy AND validate deterministic code surfaces (archetype scoring, catalogue sanitisation, specific failure modes). Passing the synthetic eval (Part B, lands with S3-T1A) means the code works as specified. It does NOT mean the product works for real users.

The mock-first 6-naive-user gate (PL-MOCK-FIRST) remains canonical and non-negotiable. PL-MOCK-FIRST depends on SP-1 — synthetic eval is prerequisite, not substitute. Under deadline pressure, the temptation is to treat synthetic pass as sufficient. This rule exists to prevent that.

Source: 18 April 2026 synthetic personas deep research + three LARGE panels (10, 12, 13 personas) + Claude Code repo-state diagnostic that caught missing `recommend-products` infrastructure.

### Typography is archetype-invariant (R-20)

Only colour, motif, and page/section tints shift per archetype. Type system, hierarchy, spacing, and all interactive elements remain constant across the 7 archetypes. Language carries archetype differentiation under a constant type treatment.

Source: 20 April 2026 design-integration critique.

### Archetype colours pass WCAG AA AND CVD discrimination (R-21)

All archetype accent colours must pass WCAG AA contrast for their intended text size (body-text-level unless explicitly documented as large-text-only) AND show ΔE >10 under deuteranopia and protanopia simulation against every other archetype accent.

Source: 20 April 2026 colour-theory critique.

### Fallback reveal copy is directional, never diagnostic (R-22)

All-yes, all-no, and flat-middle reveal copy must follow second-person-warm voice. Never imply the user "swiped wrong" or "didn't engage." Name the pattern (broad openness, particular eye, blended style) as its own valid signal.

Source: 20 April 2026 quiz-edge-case critique.

### Essence line conjures the motif (R-23)

Each archetype's essence line must evoke its visual motif compositionally. Motif reads as illustration of the essence; essence reads as translation of the motif. Integration at the compositional level, not layout level only.

Source: 20 April 2026 design-integration critique.

### Two-layer lexicon semantics for archetype content (R-24)

Archetype Description objects carry two lexicon fields that serve the user-face LLM layer, and one that serves the engine-face layer. They are not interchangeable.

qualityLexicon and userLexicon are user-face. qualityLexicon supplies the vocabulary Haiku draws from when composing recommendation rationale text; userLexicon supplies the phrases users recognise as their own when reading archetype copy. Both inform voice and register in user-visible output.

materialLexicon is engine-face. It supplies tagged-material terms that filter against product catalogue attributes during retrieval. It never surfaces as user-visible copy.

S3-T1A's Haiku prompt composition must treat these layers distinctly: user-face layers populate the system prompt register guide; engine-face layers populate retrieval filters. Conflating them produces drift between the voice a user experiences on the reveal screen and the voice Haiku produces on the recommendation screen.

Full composition spec deferred to S3-T1A precondition. This rule fixes the semantics so the composition spec can be written against a stable abstraction.

Source: 20 April 2026 evening — 10-voice ship-or-revise panel.

> **Note on R-26 cross-namespace collision:** `CLAUDE.md` contains
> `### R-26 — LLM fingerprint patterns` (a heading-style rule scoped
> to Claude Code copy hygiene). The canonical's R-26 below is
> separately scoped to logging convention. The two governance
> documents have independent rule namespaces; resolution of the
> cross-namespace collision is deferred to follow-up task
> GOV-RULE-NUMBERING-01. When future sessions reference "R-26",
> source must be specified (canonical R-26 vs CLAUDE.md R-26).

**R-25 — Acceptance criteria block is mandatory in every Claude Code prompt.**
Every Claude Code task prompt produced by this project must end with an
`## Acceptance Criteria` block listing: (a) the observable behaviour that
proves the task is done, (b) the exact commands Claude Code must run to
self-verify (`npm run check` minimum: tsc), (c) the runtime smoke steps
Daryll will perform on device. Prompts without this block fail the
critique gate.

For prompts that produce artefacts (files, MC tasks, canonical patches,
documentation), the Acceptance Criteria must additionally include a
`findable_at:` reference (literal path or location) and one verification
command (e.g. `grep`, `ls`, `git show`) that confirms reachability.
Reachability check is the discipline — produced artefacts that cannot be
located by a future session are functionally lost. Source: 30 Apr session
where MC artefact reconstruction blocked because reachability was never
verified at create-time.

**R-26 — Logging convention is named in build prompts.**
Any Claude Code prompt that adds or modifies code containing user-facing
flow, async logic, auth, RLS-touching queries, edge-function calls, or
analytics events must specify: "Use `lib/log.ts` `createLogger` with the
tag matching either the component/module name OR the active task ID
(e.g. `[SEC-AUDIT-04]`, `[NAV-DEAD-END]`) when the work is task-scoped
rather than module-scoped. No raw `console.log`."

Task-ID prefixes enable cross-referencing Metro logs against
`docs/operations/security.md`, MC entries, and commit messages — one
grep traces the work end-to-end. Component-name tags remain correct
for module-scoped work that outlives a single task. This is one line in
the prompt; non-negotiable.

**R-27 — Handover prompts must declare unverified surfaces.**
The session-end handover prompt (the one Daryll pastes into the next
Claude.ai session) must include a `## Unverified` section listing what
was built but NOT smoke-tested on device, NOT tested as a non-owner user
(RLS), or NOT exercised through the consent split. Empty section is
allowed; missing section is not.

**R-28 — Critique gate enforces verifiability, not elegance.**
The critique gate on outgoing build prompts checks one thing first: can
Claude Code verify the acceptance criteria itself without a device deploy?
If not, the prompt is rewritten until at least one criterion is
machine-checkable. Stylistic critique is secondary.

**R-29 — Scope ceiling per Claude Code prompt: one observable change.**
A single Claude Code prompt produces one observable change to the user
flow OR one schema/RLS migration OR one edge function — never a
combination. Multi-step work is split into sequential prompts with
explicit handover. Violations are the #1 cause of "compiles but doesn't
run" rework.

**R-30 — Expo SDK 54 fragility surfaces are flagged in prompts.**
Any Claude Code prompt touching reanimated, worklets, gesture handler,
fonts, edge-to-edge, or babel config must include the line: "SDK 54
notes: do NOT add `react-native-reanimated/plugin` to babel.config.js
(handled by babel-preset-expo). Confirm `react-native-worklets` peer
matches Expo's expected version. If runtime errors occur, run
`npx expo start --clear` before assuming a code bug." This pre-empts the
single most expensive class of false-positive bug in this stack.

**R-31 — RLS-touching prompts require dual-role verification.**
Any prompt that adds or alters an RLS policy, a Supabase migration, or
an edge function with auth-conditional behaviour must specify in
acceptance criteria: "Verified as (a) anonymous role, (b) authenticated
non-owner role, (c) authenticated owner role." If the change cannot be
exercised in all three states from the app, the prompt names the SQL
snippet (`auth.login_as_user`) Claude Code should add to the migration
test file.

**R-32 — Standing prompt prefix for build sessions ("two-paste pattern v2").**
The conventions paste (paste 1) MUST include, verbatim, this header
before any other content:

> Read CLAUDE.md fully before reading this prompt. Run `npm run check`
> after every code change. Use `lib/log.ts` `createLogger`, never raw
> `console.log`. Declare "done" only when the Acceptance Criteria block
> in the task prompt is satisfied AND the Unverified section is filled
> in. Stop and ask if any acceptance criterion cannot be verified
> without a device deploy.

This replaces ad-hoc preambles. The task paste (paste 2) carries the
spec + acceptance criteria + unverified-template only.

### Claude Design briefs match prescription density to specification certainty (R-33)

When delivering design briefs to Claude Design, prescription density must match how locked the specification is.

**Locked-spec mode (typewriter)**: when geometry, palette, dimensions, or composition are locked from prior decision, the brief MUST include literal SVG paths, exact pixel dimensions, and explicit colour hex values. Verbal description is insufficient — verbal-only briefs introduced unintended changes (see icon v1 downturn). Locked geometry → coordinates in the prompt.

**Open-design mode (collaborator-on-rails)**: when the design is genuinely open and Claude Design is the executor of a creative decision, the brief contains intent, dimensional constraints, and explicit permission to flag and propose alternatives if the brief reads under-specified or contradictory. Over-constraining open-design briefs kills the judgement Claude Design is being asked to apply (see icon v2 over-constrained execution).

The asymmetry: typewriter mode applied to open design produces drift-from-judgement; collaborator mode applied to locked spec produces drift-from-decision. The cost of the second is higher because it overrides decisions. Default to typewriter when in doubt; explicitly authorise collaborator only when the design itself is genuinely the question.

Source: 6 May 2026 icon work, particularly the v1-v2-v3 failure arc.

### Brand capitalisation: "Cornr" user-facing, "cornr" internal (R-34)

"Cornr" (capital C) in all user-facing brand presentation including mid-sentence references. "cornr" (lowercase) only in code paths, identifiers, schema names, deep-link schemes, URL slugs, npm package names, repository names, social handles where the platform convention is lowercase.

No mid-sentence exceptions for stylistic flow. The brand's softness comes from the contraction (missing 'e'), the italic Lora wordmark, the terracotta palette, and the voice rules — not from lowercase styling. iPhone pattern: capital P in marketing presentation, lowercase i visually as part of the wordmark, no special internal treatment.

Practical decision boundary: if a string is read by a human as a brand name, capitalise. If it is read by a machine or another developer as an identifier, lowercase.

Source: 6 May 2026 icon master lock + capitalisation cascade.

### tokens.ts is the runtime source of truth for design tokens; downstream docs auto-regenerate (R-35)

`src/theme/tokens.ts` is the runtime source of truth for all design tokens (colours, typography, spacing, radii, shadows, archetype themes). Token-derived sections of CLAUDE.md and `docs/strategy/cornr-design-system-for-claude-design.md` are wrapped in `<!-- TOKEN-DOCS:START name=X -->` markers and regenerate via `npm run docs:tokens`. Drift checked via `npm run docs:tokens:check` (exits non-zero if generated docs don't match current tokens.ts).

Hand-edits inside marker blocks are overwritten on next regeneration — the warning blockquote inside each marker says so loudly. Adding a new token requires running the regenerator before commit; pre-commit drift detection is currently manual (CI gate deferred to v2 of the pipeline).

`docs/DESIGN_SPECS.md` is retired. Authoritative design system documentation is the canonical Section 14 + tokens.ts pair, with `docs/strategy/cornr-design-system-for-claude-design.md` as the auto-derived design upload Claude Design consumes.

Source: 6 May 2026 — DESIGN-TOKENS-CANONICAL-SOT v1 pipeline shipped. Architecture in canonical Section 14.11.

### Audit-first for sweep tasks (R-36)

Tasks that look like "find all X and change to Y across the codebase" must run a read-only audit pass first, surface findings categorised by treatment, and apply changes only after explicit per-category approval.

The 6 May capitalisation cascade demonstrated the pattern's value: 295 occurrences of "cornr" across 72 files; only 5 lines actually needed change. A naive sweep would have lowercased 195 already-correctly-capitalised instances and broken type-narrowed identifiers in TypeScript literal types.

Audit categories should distinguish: (A) user-facing strings that need the change, (B) configuration fields where the rule depends on context, (C) internal code that does not change, (D) documentation where the rule depends on whether the reference is narrative or code-related, (E) any TypeScript literal types or schema literals that need a separate type-system review.

This rule applies to: capitalisation changes, terminology renames, brand name changes, framework/library reference replacements, deprecated-API replacements, and any change with a high false-positive risk on a naive grep-and-replace.

Source: 6 May 2026 capitalisation cascade. Pattern was originally established by the off-ramp audit (5 May 2026) and the Sentry beforeSend audit (29 April 2026); R-36 formalises the pattern as standing rule.

### Heuristic gate on first regeneration of crystallisation pipelines (R-37)

When a manual surface (hand-curated documentation, hand-maintained content) is being crystallised into an automated regeneration pipeline, the first pipeline run almost always produces noise: additive coverage growth (auto-output covers more than the manual surface did), format drift (whitespace, column padding, heading punctuation differ), or genuine content losses (editorial blockquotes, footnotes, asterisks not modelled by the generator).

The heuristic gate pattern: auto-proceed if the first-run diff is small AND no value-bearing tokens (hex codes, identifiers, numeric values) changed; pause for human review otherwise. Future regenerations after the first do not need the gate — it is a v1-only safety net for the crystallisation transition.

The 6 May SoT pipeline first-run hit the gate (>5% lines changed plus 50 hex hits). Manual review confirmed: zero hex value drift (every hex matched tokens.ts), additive coverage growth (CLAUDE.md palette grew 11→22 rows, typography 8→12 roles), three legitimate content losses captured as follow-ups. Heuristic gate prevented silent shipping of incomplete first-run output.

Source: 6 May 2026 — DESIGN-TOKENS-CANONICAL-SOT first-run regeneration.

### Tech debt fix-in-session, not deferred (R-38)

When tech debt surfaces during execution of a feature or fix, fix it in the same session unless the fix expands scope by >50%. Deferred tech debt accumulates into discipline-pack-shaped problems.

Graduated from L-E watch-list candidate, panel v2 9 May 2026. Demonstrated by the Packet 2 cron callout removal during LR-PROD-SYNC prep — the original packet carried a warning that `cron.unschedule('purge-anonymous-sessions')` might error if no such job existed on prod; a source check confirmed the 16 March schema already scheduled both pg_cron jobs, so the callout was obsolete and was stripped in the same session rather than left as a follow-up.

Source: 9 May 2026 — LR-PROD-SYNC execution.

### Operational paste as single fenced block (R-39)

When delivering operational content meant for paste-and-execute (SQL packets, shell sequences, prompts), deliver as a single fenced code block without narration interleaved between commands. Narration goes above or below the block, never within.

Graduated from L-F watch-list candidate, panel v2 9 May 2026. Reduces cognitive load mid-execution. Demonstrated during the LR-PROD-SYNC packet sequence — each packet's SQL was printed as one clean `sql` fence on request, with framing, verification, and rollback notes kept outside the block.

Source: 9 May 2026 — LR-PROD-SYNC execution.

---

## Section 14 — Design System

### 14.1 Two-Phase Colour System

Pre-archetype screens: 90/10 rule (90% cream, 10% colour) unchanged.

Post-archetype screens: 80/15/5 system:
- 80% tinted neutral: archetype colour at 5% opacity on page background, 8% on section backgrounds
- 15% archetype identity elements: motif, name, rationale badges at full archetype colour
- 5% universal interactive: accent buttons and links, unchanged from pre-archetype

Pre-computed tint hex values (WCAG verified):
- Curator (#5C6B4A): page #F2F0EA, section #EDEBE5
- Nester (#5A8A94): page #F2F1EE, section #EDEEEB
- Maker (#B87F4A): page #F7F1EB, section #F5EDE5
- Minimalist (#A09080): page #F6F2ED, section #F3EFEA
- Romantic (#C4908A): page #F7F2EE, section #F6EFEB
- Storyteller (#8A6550): page #F4EFEA, section #F1EBE5
- Urbanist (#5E5A68): page #F2EFEC, section #EDEAE7

CVD policy: archetype colour is never the sole differentiator. Name, motif, and typography hierarchy always co-present.

**Palette revision candidate (20 April 2026):** 4 of 7 archetype accents proposed for revision pending mock-first validation. Current palette remains canonical until mock-first test validates change. See docs/strategy/palette-revision-candidate.md or Section 0 entry dated 20 April 2026.

> AI teal is deprecated for user-facing identity surfaces (this canonical, 15 April 2026 evening colour shift). Teal still applies to AI-generated content panels — recommendation rationale presentation, the explicit "this was generated by Claude" attribution surface. Identity surfaces (archetype reveal, share card, profile header, home greeting) use the warm palette plus archetype theme exclusively. The 80/15/5 post-archetype rule and the 90/10 pre-archetype rule both apply to identity surfaces only; AI rationale panels are an explicit exception with their own teal-on-cream treatment.

(Background: this prose previously lived inside the design-system markdown's palette section, was lost on first SoT pipeline regeneration on 6 May, and is being relocated here per follow-up TEAL-DEPRECATION-PROSE-RELOCATE.)

### 14.5 Archetype-invariant interactive design

Typography, hierarchy, spacing, button treatments, input fields, icons (beyond the single motif), navigation, and reveal sequence structure are identical across all 7 archetypes. Only colour (accent + 5%/8% tints) and motif shift. See R-20.

### 14.6 Motion language principles (pending DESIGN-05)

Motion has a voice, same as typography. Three motion registers:

- **Ceremonial** — identity moments (archetype reveal, first recommendation). Staggered, paced, ~200ms between elements.
- **Gentle** — navigation, transitions, tab switches. Single smooth motion.
- **Immediate** — feedback, taps, loading states. No delay, no overshoot.

`prefers-reduced-motion` respected universally; ceremonial falls back to spatial ceremony (generous whitespace + clear hierarchy) when motion reduced.

### 14.7 Reveal sequence (pending DESIGN-03, DESIGN-04)

Staggered reveal order on first visit:

1. Page tint lands (ambient).
2. Archetype name + style territory fades in (~400ms).
3. Essence line types in character-by-character (~800ms).
4. Motif fades in as visual echo of essence (~1200ms).
5. Observation + sensory + behavioural truth fade in together (~1600ms).
6. CTA gently appears (~2000ms).

Return-visit reveal: static layout, full description visible, motif tappable for tooltip.

Reduced-motion fallback: full layout lands simultaneously with spatial ceremony.

### 14.8 Tappable motif specification (pending DESIGN-04)

Motif is gently interactive. 44pt minimum hit area. No visible indicator on first reveal. One-time soft pulse on first return-visit to Profile tab (discoverability). Tap reveals tooltip above motif, 3-second fade. Tooltip content: 5-8 word archetype-specific micro-essence. Styling: archetype accent at 80%, DM Sans Italic.

### 14.9 — Icon master v6

The Cornr master app icon comprises two cream `#FAF7F3` elements on a solid terracotta `#C4785A` background, vertically stacked.

The corner mark sits above the wordmark. SVG path in a 200×100 reference viewBox: `M 10 14 L 190 14 L 190 90`, stroke-linecap and stroke-linejoin both round, no fill, stroke weight optically matched to the wordmark's stem weight at the rendered size.

The wordmark is "Cornr" in Lora Bold Italic (700 weight, italic style), capital C, lowercase ornr, cream `#FAF7F3`, centred horizontally beneath the corner mark with breathing room (corner mark span ≈ wordmark width).

On a 1024×1024 production canvas: ~12-15% canvas margin on all sides; combined stack occupies the centre 60-70% vertically; visual centre sits slightly above geometric centre per standard icon optical-centring convention.

Production exports: 13 PNG sizes (29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024), one transparent variant (1024), two SVG masters (font-embedded + lean). 20×20 omitted — Apple no longer requires it for modern devices. All assets in `assets/icons/`.

iOS applies the squircle mask at runtime; the master is a 1024×1024 square with no pre-rounded corners. Native projects regenerate from the new icon at next EAS production build.

Decision arc lesson preserved in the 6 May 2026 Section 0 entry: masthead-context geometry does not survive the icon-canvas shift; wordmark-led design without a mark loses brand presence; pure-motif design without a wordmark loses the brand name. The locked composition (corner mark + wordmark, matched-weight, vertically stacked) is the result of six iterations and is not to be re-derived without explicit cause.

### 14.10 — Wordmark presentation rule

The Cornr wordmark always renders capitalised when shown to users.

In-app surfaces using the wordmark: welcome screen header (top-of-screen), error screens (centred above error copy), share card (footer attribution), and any future surface where the wordmark appears as itself rather than as decoration.

Always: Lora Bold Italic. Always: cream `#FAF7F3` on a coloured background, or accent-coloured on cream. Always: capital C, lowercase ornr.

Never: lowercase "cornr" in user-facing wordmark renderings. Never: a different font for the wordmark. Never: outline or stroked treatment (the wordmark is solid fill type).

This rule co-applies with R-34. The wordmark presentation locks the rendering; R-34 governs the textual reference in surrounding copy.

### 14.11 — Token doc auto-regeneration architecture

The token documentation pipeline regenerates token-derived sections of CLAUDE.md and `docs/strategy/cornr-design-system-for-claude-design.md` from `src/theme/tokens.ts`.

**Generation script**: `scripts/generate-token-docs.mts`. Imports tokens.ts via Node 24 native TypeScript stripping (no tsx, no ts-node, zero new dependencies). ARCHETYPE_IDS exported as a runtime const from tokens.ts (added in this pipeline) so the script iterates archetypes without coupling to taxonomy.

**Marker pattern**: token-derived sections are wrapped in HTML comment markers — `<!-- TOKEN-DOCS:START name=X -->` opens, `<!-- TOKEN-DOCS:END name=X -->` closes, with a markdown blockquote warning inside each block stating that the contents are auto-generated. Marker name regex: `[a-z0-9_-]+`. Backreference enforced regex pairing — open and close must use the same name.

**Marker locations** (7 markers total across 2 files):
- CLAUDE.md: `palette`, `typography`
- `docs/strategy/cornr-design-system-for-claude-design.md`: `palette`, `typography`, `spacing`, `radii`, `shadows`

**npm scripts**: `docs:tokens` regenerates; `docs:tokens:check` regenerates to a temp string and compares against on-disk content, exits non-zero on diff. CRLF normalisation on read (Windows checkout safety).

**Node version**: pinned to 24+ in `.nvmrc` and `engines.node` in package.json. Type-stripping is default in Node 23.6+; pinning to 24 makes the dependency explicit.

`docs/DESIGN_SPECS.md` retired by this pipeline (3 references redirected to `docs/strategy/cornr-design-system-for-claude-design.md`).

CI workflow deferred to v2 (drift gate runs locally for now). Test suite deferred to v2.

Source: 6 May 2026 — DESIGN-TOKENS-CANONICAL-SOT v1 pipeline. Pipeline rule formalised as R-35.

### 14.12 — Motion vocabulary

Motion has three registers, each with distinct timing and intent. `src/lib/motion.ts` is the authoritative source for motion tokens; surfaces consume from there rather than hardcoding durations or curves.

**Considered** (~400-600ms, eased): identity moments — archetype reveal, first-time recommendations, share card presentation. Generous, paced, intentional. Communicates "this is meaningful."

**Gentle** (~200-300ms, eased): navigation transitions, tab switches, modal opens, expander toggles. Smooth, single-motion, no overshoot. Communicates "movement, not interruption."

**Immediate** (<100ms or instant): feedback, taps, loading state changes, button-press states. No delay, no spring. Communicates "you did that."

**Reduced-motion fallback**: `prefers-reduced-motion` (or iOS Reduce Motion) is respected universally. Considered moments fall back to spatial ceremony (generous whitespace, clear hierarchy) rather than degraded motion. Gentle moments fall back to instant state change. Immediate moments are unchanged.

**Implementation note**: `react-native-reanimated`'s `useReducedMotion` hook is **not reactive at runtime**. It reads OS state once at component mount and does not update if the user toggles Reduce Motion mid-session. Components that need to respond to runtime toggle either remount (e.g. via key prop) or use an alternative reactive source. This was confirmed by reading reanimated source during the 5 May reduced-motion audit.

`bezierFn` curve choice is intentional — the curve is asymmetric (slow in, fast out for considered; fast in, slow out for gentle). Do not replace with a symmetric curve without considering register intent.

Source: 5 May 2026 — REDUCED-MOTION-AUDIT (P0 WCAG) implementation across reveal-essence CTA fade, tab-bar icon scale, sign-up "Why we ask" expander.

### 14.13 — Reveal retry/abort architecture

The reveal screen (first-visit and return-visit, per 14.7) fault-tolerates Edge Function failure on the recommendation rationale call.

**State machine**: `idle → loading → success | error`. From `error`, user can retry (`error → loading`) or abort (`error → idle` with the underlying reveal already shown). The error state preserves all already-rendered reveal content; only the rationale block enters error UI.

**Retry copy**: voice-gated, single sentence, action-oriented. "Trouble loading recommendations — try again." No technical jargon, no apology language, no error code surface.

**Retry button**: standard accent button styling (R-36 in Section 14, the existing 90/10 + 80/15/5 colour rule). Single tap retries the Edge Function with the same payload. Maximum 2 retries before aborting to "We're having trouble — try again later" copy.

**Abort path**: tapping outside the rationale block, navigating away, or after the maximum retry count returns to the reveal in success state minus the rationale (which is non-blocking — the archetype reveal is the load-bearing content, the rationale is supplementary).

**Reveal-busy guard**: while the rationale call is in flight, the share button is disabled (share would otherwise capture mid-load state). Share re-enables on success or final abort.

Source: 5 May 2026 — REVEAL-RETRY-STATE design + implementation. Architecture co-designed with reveal-error copy work (REVEAL-ERROR-COPY at e0c55ec).

**KI-02 stamp-ritual exemption** — design gap deferred to dedicated session (KI-02 currently treats stamp-only commits as if they required a content edit). See MC backlog `KI-02-STAMP-RITUAL-EXEMPTION`.

---

*End of canonical context. Replace this file in project knowledge whenever a strategic decision is made. Single source of truth.*
