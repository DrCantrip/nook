# MC Parked Tasks Index — 2026-05-15

**Purpose:** Flat recovery index for every task that existed in MC v12 + v13 but is NOT carried forward into the focused v14 artefact. This file is the lookup surface when deferred work needs to be located.

**Generated from:** `mc-v12.tsx` (18 Apr 2026) + `mc-v13-consolidated-diff.tsx` (20 Apr 2026)

**Generated at:** 2026-05-15

**Sister files:**
- Full task definitions: `mc-v12.tsx` + `mc-v13-consolidated-diff.tsx` retained in repo
- Active task tracking: MC v14 runtime artefact (claude.ai, storage key `cornr-mc-2026-04-12`)
- Canonical sprint plans: `docs/CORNR_CANONICAL.md` Section 7

**Parse notes:**
- v12 `TASKS` array parsed in full (128 entries).
- v13 fully-bodied additions parsed: `NEW_TASKS_LATE_EVENING` (6, CHANGE D) and `REVEAL_1_SUB_TASKS` (5, CHANGE F).
- v13 CHANGE B references **15 PM-session tasks** (QUIZ-01..06, DESIGN-01..06, original DESIGN-07/08/09) whose **bodies live in an archived `mc-v13-diff.tsx` file that is not on disk**. Those IDs are still emitted below as **stub rows** for findability (with the `source` column flagging the gap) — but their tab/group/priority/est/critique/canonical fields are empty, and titles are placeholders. To populate them properly, locate the archived `mc-v13-diff.tsx` and re-run this index.
- v13 CHANGE D **renamed/superseded** the v13 PM `DESIGN-07` and `DESIGN-08` IDs (PM semantics: "palette ship on mock-first" / "palette ship decision"; CHANGE D semantics: "Panel 3 divider removal" / "Panel 4 share card essence treatment"). The diff says to rename the PM versions to `DESIGN-10` / `DESIGN-11` if both are applied — runtime decision unknown. Rows below carry the **CHANGE D semantics** for DESIGN-07/08 (bodies are on disk); the PM-semantics versions are **not** emitted under `DESIGN-10/11` because their existence depends on a runtime choice this script can't see. `DESIGN-09` (PM-only, no collision) is emitted as a stub with the title hint from the CHANGE B comment.
- v13 CHANGE E status update applied: `REVEAL-1` est demoted 16 → 2 (parent rollup; sub-tasks are REVEAL-1A..1F). Other CHANGE E updates (status changes on QUIZ-03 etc.) don't affect the index fields (status is not in the field set).

**Field key:** `Pri` = priority. `Crit` = critique size — `N`=NONE, `S`=SMALL, `M`=MEDIUM, `L`=LARGE.

---

## All tasks (alphabetical by ID)

| ID | Tab | Group | Pri | Est | Crit | Source | Canonical | Title |
|---|---|---|---|---|---|---|---|---|
| ASO-1 | prelaunch | App Store Optimisation | P1 | 3 | S | 16 Apr MC patch |  | ASO keywords research + App Store listing copy drafted |
| ASR-AGE-RATING | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 0 | N | ASR checklist 8 Apr |  | Age rating questionnaire (Jan 2026 tiers) |
| ASR-AI-CONSENT | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 2 | M | ASR checklist 8 Apr |  | AI consent interstitial before first recommendation call |
| ASR-AI-DISCLOSURE | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 1 | N | ASR checklist 8 Apr |  | AI data processing disclosed in Privacy Policy |
| ASR-DELETE | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 0 | N | ASR checklist 8 Apr |  | In-app Delete Account works (Guideline 5.1.1v) |
| ASR-DEMO-ACCT | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 1 | N | ASR checklist 8 Apr |  | Separate demo account for Apple review (not test account) |
| ASR-DPA-ANTHROPIC | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 1 | N | ASR checklist 8 Apr + BS-06 |  | Anthropic DPA signed before Sprint 3 AI calls begin |
| ASR-ENCRYPTION | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 0 | N | ASR checklist 8 Apr |  | ITSAppUsesNonExemptEncryption = NO in app.json |
| ASR-IPAD | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 1 | N | ASR checklist 8 Apr |  | iPad testing — crash test via BrowserStack (£10-30) or borrowed device |
| ASR-IPV4 | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 0 | N | ASR checklist 8 Apr |  | No hardcoded IPv4 addresses in production build |
| ASR-NO-LOCATION | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 0 | N | ASR checklist 8 Apr |  | Verify no device location APIs called (postcode is user-typed) |
| ASR-NO-PLACEHOLDER | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 0 | N | ASR checklist 8 Apr |  | No placeholder content, beta labels, or broken flows |
| ASR-PRIVACY-POL | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 1 | N | ASR checklist 8 Apr |  | Privacy policy accessible from App Store listing AND in-app |
| ASR-SCREENSHOTS | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 3 | M | ASR checklist 8 Apr + TD-19 App Store Specialist |  | Screenshots from production build — 5 screens per TD-19 sequence |
| ASR-SDK-AUDIT | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 2 | N | ASR checklist 8 Apr |  | All SDK data collection audited and mapped to nutrition labels |
| ASR-SUPPORT-URL | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 0 | N | ASR checklist 8 Apr |  | Support URL live and resolving in App Store Connect |
| ASR-TESTFLIGHT-FB | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 1 | N | ASR checklist 8 Apr |  | Structured TestFlight feedback form — 5 questions |
| ASR-UNIQUE-VALUE | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 0 | N | ASR checklist 8 Apr |  | Unique utility vs existing App Store apps (anti-rejection) |
| ASR-XCODE | prelaunch | App Store Readiness (ASR_CHECKS) | P0 | 0 | N | ASR checklist 8 Apr |  | EAS Build using Xcode 26 / iOS 26 SDK (Expo SDK 54 default) |
| BS2-T0 | active | Bridge Sprint 2-prime | P0 | 3 | M | Entry-point critique 10 Apr, Option D-prime | Section 0 (10 Apr entry) | Welcome screen restructure — three zones (taste-first CTA, room chip row, escape hatch) |
| BS2-T1 | active | Bridge Sprint 2-prime | P0 | 2 | S | Entry-point critique 10 Apr |  | Room interest chip row — stores room_interest on users, weights swipe deck |
| BS2-T2 | active | Bridge Sprint 2-prime | P0 | 2 | S | Entry-point critique 10 Apr |  | Quiz extension — 16 cards with whole-house framing, chapter markers every 4 cards |
| BS2-T3 | active | Bridge Sprint 2-prime | P0 | 2 | S | Entry-point critique 10 Apr |  | Product catalogue gains product_scope (multi-room vs room-specific) |
| BS2-T4 | active | Bridge Sprint 2-prime | P0 | 4 | M | Entry-point critique 10 Apr |  | Home tab — "Your home" canvas with multi-room accent feed |
| BS2-T5 | active | Bridge Sprint 2-prime | P0 | 3 | M | Entry-point critique 10 Apr |  | Room setup repositioned as per-room deepening from canvas (not funnel) |
| BS2-T6 | active | Bridge Sprint 2-prime | P0 | 2 | S | Entry-point critique 10 Apr |  | Anonymous room-scoped browse (tertiary flow) with soft nudge to quiz after 3-4 interactions |
| BS2-T7 | active | Bridge Sprint 2-prime | P0 | 2 | S | 11 Apr evening patch | Section 6 schema | journey_stage field wiring — onboarding flow captures, passes to prompt |
| BS2-T8 | active | Bridge Sprint 2-prime | P0 | 1 | N | Entry-point critique 10 Apr |  | BS2-prime mock-first check — validate flow works end-to-end before merging |
| CAT-REFRESH | prelaunch | Post-launch operations prep | P1 | 2 | N | 16 Apr MC patch + R-17 |  | Catalogue refresh cadence operationalised — 10 new + 10 retired per month |
| CONTENT-01 | active | Content Quality | P0 | 3 | M | 20 Apr late evening — Panel 2 phone-test surfaced LLM fingerprint in v3 content | R-26 (drafted in commit body, lands on next strategic patch) | R-26 em-dash + abstract negation-reframe purge across user-facing copy |
| CONTENT-02 | upcoming | Sprint 3 | P0 | 1 | S | 20 Apr late evening — R-26 scope audit surfaced em-dashes in Haiku system prompt | R-26 | Audit supabase/functions/_shared/prompts.ts for LLM fingerprint patterns |
| DAN-1 | prelaunch | May meeting track (Dan deliverables — parallel, not blocking) | P1 | 4 | L | Dan meeting + 12 Apr unit economics |  | Mini-deck v2 — margin structure, AI-native differentiator, realistic targets, ask for newsletter feature |
| DAN-2 | prelaunch | May meeting track (Dan deliverables — parallel, not blocking) | P1 | 3 | M | Dan meeting + 12 Apr unit economics |  | Financial model 1-page PDF — 3-year margin-focused projection |
| DAN-3 | prelaunch | May meeting track (Dan deliverables — parallel, not blocking) | P1 | 3 | M | TD-25 Thread Analyst + R-5 k-anonymity |  | Illustrative Curator segment report — synthetic data, k≥5 suppressed, format demo |
| DAN-4 | prelaunch | May meeting track (Dan deliverables — parallel, not blocking) | P1 | 2 | M | TD-15 UX/UI Specialist |  | Share card visual mockup — Figma or Claude artifact |
| DAN-5 | prelaunch | May meeting track (Dan deliverables — parallel, not blocking) | P1 | 1 | N | Dan meeting prep |  | Mock-first test results summary — completion, share intent, rationale credibility |
| DESIGN-01 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| DESIGN-02 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| DESIGN-03 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| DESIGN-04 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| DESIGN-05 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| DESIGN-06 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| DESIGN-07 | active | Design Polish (Sprint 2) | P1 | 1 | S | 20 Apr late evening — Panel 3 phone-test observation |  | Panel 3 horizontal divider removal + period modifier voice review |
| DESIGN-08 | active | Design Polish (Sprint 2) | P1 | 1 | S | 20 Apr late evening — Panel 4 phone-test observation |  | Panel 4 share card essence treatment — promote or remove |
| DESIGN-09 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | mock-first colour question protocol (body unavailable — title from CHANGE B comment) |
| DUNS-1 | prelaunch | Incorporation + legal | P0 | 1 | N | 16 Apr MC patch — App Store prerequisite |  | D-U-N-S number application — START NOW (3-4 week wait) |
| GTM-BIP | upcoming | GTM — Other channels | P2 | 1 | N | GTM v2 Channel #8 |  | Build-in-public — X/IndieHackers 30min/week from week 1 |
| GTM-BROKER-1 | upcoming | GTM — Other channels | P1 | 1 | N | GTM v2 £100 allocation + TD-11 |  | 500 Vistaprint QR code business cards (£30) |
| GTM-BROKER-2 | upcoming | GTM — Other channels | P1 | 2 | N | TD-11 Crisis Planner |  | Broker outreach — 3-5 local mortgage brokers, distribute cards |
| GTM-CAP-GATE | upcoming | GTM — Other channels | P0 | 0 | N | Canonical R-3 + TD-10 Crisis Planner |  | Week 12 capacity gate — GTM ≤3h/week ongoing OR cut channels (R-3 order) |
| GTM-IG | upcoming | GTM — Other channels | P2 | 2 | N | GTM v2 Channel #6 |  | Instagram Reels + Threads — repurpose TikTok content, 2-3 text tips daily on Threads |
| GTM-PIN-1 | upcoming | GTM — Pinterest (#1 organic) | P1 | 5 | N | GTM v2 Channel #1 |  | Pinterest account setup + 7 archetype mood boards |
| GTM-PIN-2 | upcoming | GTM — Pinterest (#1 organic) | P1 | 4 | N | GTM v2 Channel #1 |  | 20-30 pins per board with captions (Haiku-generated from archetype language bank) |
| GTM-PIN-3 | upcoming | GTM — Pinterest (#1 organic) | P1 | 1 | N | GTM v2 £100 allocation |  | £50 promoted pins campaign — test landing page CTR on UK women 25-40 |
| GTM-PR | upcoming | GTM — Other channels | P2 | 4 | N | GTM v2 Channel #7 + PR Specialist |  | PR ladder — Sifted/TC UK → Stylist/Grazia → trade → national |
| GTM-TT-1 | upcoming | GTM — TikTok (#2 organic) | P0 | 2 | N | TD-1 Social Media Manager |  | TikTok content pre-creation — batch film 10-15 videos in one 2h session |
| GTM-TT-2 | upcoming | GTM — TikTok (#2 organic) | P2 | 3 | N | GTM v2 Channel #2 |  | TikTok posting — 3-5 videos/week from batch, weeks 5-8 |
| GTM-TT-3 | upcoming | GTM — TikTok (#2 organic) | P2 | 2 | N | TD-24 Social Media Manager |  | Creator partnership DMs — 30 personalised messages to UK home micro-creators |
| GTM-TT-GATE | upcoming | GTM — TikTok (#2 organic) | P0 | 0 | N | Canonical R-2 + TD-9 Crisis Planner |  | Week 8 kill gate — 500+ followers OR kill TikTok, redirect time to Pinterest/brokers (R-2) |
| GTM-WAIT | upcoming | GTM — Other channels | P0 | 2 | N | GTM v2 Channel #1 dependency |  | Waitlist landing page — cornr.co.uk with Loops.so signup |
| ICON-1 | active | Brand identity | P1 | 3 | S | 15 Apr icon design session |  | Master app icon production — corner mark + cornr wordmark, all iOS sizes |
| KI-01 | active | Knowledge infrastructure — Phase 0 (drift detection) | P0 | 0.5 | N | 18 Apr knowledge infra research |  | Stamp CORNR_CANONICAL.md with CONTRACT-VERSION + CANONICAL-SHA + LAST-SYNCED-PK block |
| KI-02 | active | Knowledge infrastructure — Phase 0 (drift detection) | P0 | 0.5 | S | 18 Apr knowledge infra research |  | Pre-commit hook enforcing canonical SHA-bump contract |
| KI-03 | active | Knowledge infrastructure — Phase 0 (drift detection) | P0 | 1 | S | 18 Apr knowledge infra research |  | Session-start drift check — scripts/drift/check.sh |
| KI-04 | upcoming | Knowledge infrastructure — Phase 1 (session hygiene) | P1 | 0.5 | N | 18 Apr research |  | SessionEnd hook writes HANDOVER.md + session log |
| KI-05 | upcoming | Knowledge infrastructure — Phase 1 (session hygiene) | P1 | 0.5 | N | 18 Apr research — reproduces Claude Code system-reminder pattern |  | /refresh slash command — XML-tagged rules block for post-/compact |
| KI-06 | upcoming | Knowledge infrastructure — Phase 1 (session hygiene) | P1 | 0.5 | N | 18 Apr research |  | /handover slash command (J.D. Hodges template) |
| KI-07 | upcoming | Knowledge infrastructure — Phase 2 (retrieval) | P2 | 1 | S | 18 Apr research |  | Indexer script for recall corpus — vault + repo + transcripts |
| KI-08 | upcoming | Knowledge infrastructure — Phase 2 (retrieval) | P2 | 1 | S | 18 Apr research |  | FastMCP recall server exposing recall(query, k=5) |
| KI-09 | upcoming | Knowledge infrastructure — Phase 2 (retrieval) | P2 | 0.5 | N | 18 Apr research |  | Auto-reindex hooks — post-commit + Task Scheduler daily |
| KI-10 | upcoming | Knowledge infrastructure — Phase 2 (retrieval) | P2 | 0.5 | N | 18 Apr research |  | Consolidate .mcp.json with cmd /c wrappers |
| KI-11 | upcoming | Knowledge infrastructure — Phase 3 (personal workflow) | P2 | 0.25 | N | 18 Apr research |  | Install Smart Connections in Obsidian vault (free core only) |
| KI-12 | upcoming | Knowledge infrastructure — Phase 3 (personal workflow) | P2 | 0.5 | N | 18 Apr research |  | /sync-canonical slash command — diff + prompt + bump |
| KI-13 | upcoming | Knowledge infrastructure — Phase 3 (personal workflow) | P3 | 0.25 | N | 18 Apr research |  | Install context-drift MCP — monthly scan of canonical + CLAUDE.md |
| KI-14 | upcoming | Knowledge infrastructure — Phase 3 (personal workflow) | P2 | 0.25 | N | 18 Apr research + memory flag since 15 Apr |  | Operationalise BDS v3 PDF removal from project knowledge |
| KI-15 | parked | Knowledge infrastructure — parked (ToS concern) | P3 | 0.5 | N | 18 Apr research |  | ClaudeSync / claude-code-templates — investigate, likely SKIP |
| MF-1 | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 0 | N | Cold Start |  | Test 1 — Quiz completion rate ≥80% |
| MF-2 | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 0 | N | Cold Start |  | Test 2 — Archetype accuracy ≥4.0/5 |
| MF-3 | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 0 | N | Cold Start + Behavioural Economist |  | Test 3 — Share intent — named person(s) they'd tell |
| MF-4 | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 0 | N | TD-12 Tester |  | Test 4 — Share card visual approval (would post to Stories?) |
| MF-5 | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 0 | N | Cold Start |  | Test 5 — Sequencing comprehension (why is this #1?) |
| MF-6 | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 0 | N | Cold Start |  | Test 6 — Rationale credibility (friend vs search engine?) |
| MF-7 | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 0 | N | Cold Start |  | Test 7 — Install intent (would you install tomorrow?) |
| MF-8 | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 0 | N | Multi-discipline panel 12 Apr |  | Test 8 — Recommendation relevance (4/6 tap View at Retailer CTA) |
| MF-IDENTITY | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 1 | N | TD-18 Behavioural Economist |  | Identity attachment 24h follow-up (TD-18) |
| MF-SETUP | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 2 | N | Cold Start critique + canonical standing rule |  | Mock-first test setup — recruit 6 naive users, build prototype flow |
| MF-SHARE | prelaunch | Mock-first test (6 users, non-negotiable gate) | P0 | 1 | N | TD-12 Tester |  | Share flow end-to-end test (TD-12) — watch user share to one person |
| PK-1 | parked | P3 — Post-launch | P3 | 15 | L | GTM v2 Channel #10 + PR ladder |  | Annual UK FTB style data report — 15h one-time, exclusive pitch to national paper |
| PK-2 | parked | P3 — Post-launch | P3 | 10 | L | TD-25 Thread Analyst + R-4 |  | Brand partnership pilot — at 2-5K users NOT 10K (R-4) |
| PK-3 | parked | P3 — Post-launch | P3 | 6 | M | 12 Apr three-tier retention + DG-6 | Section 0 12 Apr | aggregated_segments table + rollup pipeline (three-tier retention model) |
| PK-4 | parked | P3 — Post-launch | P3 | 2 | N | TD-8 Data Analyst |  | Cohort analysis dashboard in PostHog (from day one per TD-8) |
| PK-5 | parked | v2 features (not scoped) | P3 | 0 | N | 11 Apr competitive research |  | Cross-retailer coordination |
| PK-6 | parked | v2 features (not scoped) | P3 | 0 | N | 11 Apr competitive research |  | Delivery confidence signals |
| PK-7 | parked | v2 features (not scoped) | P3 | 0 | N | 11 Apr competitive research |  | Spatial planning |
| PK-8 | parked | v2 features (not scoped) | P3 | 0 | N | Canonical Section 8 Workstream A |  | Digital Home (photo → AI restyle → product match) |
| PK-9 | parked | v2 features (not scoped) | P3 | 0 | N | Canonical Section 8 Workstream B |  | Cornr Advisor (persistent AI, Sonnet-class, multi-turn design conversation) |
| PK-10 | parked | v2 features (not scoped) | P3 | 0 | N | Canonical Section 8 Workstream D |  | Taste Intelligence (anonymised aggregate quarterly reports) |
| PK-11 | parked | v2 features (not scoped) | P3 | 0 | N | 11 Apr memory |  | Tradesperson Marketplace (deferred from v1, Coming Soon tab in app) |
| PK-12 | parked | Post-launch measurement | P3 | 3 | N | 16 Apr MC patch |  | Archetype description rewrite loop — measurement triggers at 100 completions |
| PK-13 | parked | Post-launch measurement | P3 | 1 | N | 16 Apr MC patch |  | Brand pilot trigger watcher — fires at 2-5K users (R-4) |
| PK-14 | parked | Post-launch measurement | P3 | 2 | N | 16 Apr MC patch + R-16 |  | Prompt caching economics audit — verify ~40% cost reduction holds at scale |
| PK-15 | parked | Post-launch measurement | P3 | 4 | M | 16 Apr MC patch |  | Quarterly taste intelligence report — anonymised aggregate across ≥5K users |
| PK-R12 | parked | Canonical amendments | P3 | 1 | N | 12 Apr session meta-finding |  | Amend R-12 preflight rule to include format-matching check |
| PL-ARCHETYPES | prelaunch | Launch blockers | P1 | 2 | M | Memory + 11 Apr handover Priority 5 |  | Seven archetype descriptions — essence line + body + indicators + share text |
| PL-DPA-TRAIL | prelaunch | Legal + compliance pre-launch | P0 | 2 | N | 16 Apr MC patch — GDPR Art.28 |  | DPA / data processor trail documented for Supabase, Anthropic, PostHog, Sentry, Awin |
| PL-ICO-REVIEW | prelaunch | Legal + compliance pre-launch | P0 | 1 | N | 16 Apr MC patch |  | ICO registration review — verify processing declarations match actual |
| PL-PAYLOAD-REG | prelaunch | Launch blockers | P1 | 1 | N | DG-3 + 11 Apr patch |  | Payload schema registry document (Canonical Section 4 per 11 Apr) |
| PL-PROD-SYNC | prelaunch | Launch blockers | P0 | 3 | M | Memory 11 Apr |  | Production Supabase sync — migrate 3-4 weeks of schema drift from staging |
| PL-REVIEW-PUSH | prelaunch | Launch blockers | P1 | 1 | N | TD-20 App Store Specialist |  | Day-one review push — personal DM to each beta user (not automated) |
| PL-RLS-AUDIT | prelaunch | Legal + compliance pre-launch | P0 | 3 | M | 16 Apr MC patch |  | Full RLS audit across all tables before production submission |
| PL-TESTFLIGHT | prelaunch | Launch blockers | P1 | 2 | N | TD-14 Tester |  | TestFlight expanded to 10-15 users (not 6 — that is mock-first) |
| QUIZ-01 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| QUIZ-02 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| QUIZ-03 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| QUIZ-04 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| QUIZ-05 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| QUIZ-06 |  |  |  |  |  | 20 Apr PM v13 diff — body in archived mc-v13-diff.tsx (not on disk) |  | (body unavailable — see archived mc-v13-diff.tsx) |
| REVEAL-1 | active | Sprint 2 | P0 | 2 | M | 15 Apr design session + expanded panel critique | Section 14 (two-phase colour) + 15 Apr session notes | Reveal resequencing — evidence screen + panel restructure (identity-ownership fix) |
| REVEAL-1A | active | Sprint 2 | P0 | 2 | M | 20 Apr late evening — decomposed from REVEAL-1 after mismatch critique | Section 14 + R-20 (typography archetype-invariant) | REVEAL-1 intervention 2 — Panel 2 three-tier typography |
| REVEAL-1A.5 | active | Sprint 2 | P1 | 4 | M | 20 Apr late evening — panel critique identified label-first as design problem |  | Panel 1 label-before-evidence structural question |
| REVEAL-1B | active | Sprint 2 | P0 | 4 | M | 15 Apr design session |  | REVEAL-1 intervention 1 — "We noticed" evidence screen before reveal |
| REVEAL-1C | active | Sprint 2 | P1 | 3 | S | 15 Apr design session | Section 14.7 (reveal sequence) | REVEAL-1 intervention 3 — Tier 2 gradient reveal timing |
| REVEAL-1D | active | Sprint 2 | P1 | 2 | S | 15 Apr design session + R-23 (essence conjures motif) | Section 14.7 | REVEAL-1 intervention 4 — Motif fade-in at essence moment |
| REVEAL-1E | active | Sprint 2 | P1 | 4 | M | 15 Apr design session |  | REVEAL-1 intervention 5 — ArchetypeThemeContext provider |
| REVEAL-1F | active | Sprint 2 | P2 | 1 | N | 15 Apr design session + 14 Apr reveal panel critique |  | REVEAL-1 intervention 6 — Back-nav + retake link placement confirmation |
| REVEAL-2 | active | Sprint 2 | P0 | 8 | M | 22-voice adversarial panel + TD-15 UX/UI Specialist |  | Share card production — one-tap share to Instagram Stories + WhatsApp |
| S2-T1 | active | Sprint 2 | P0 | 5 | L | Canonical Section 7 |  | SwipeCard component |
| S2-T2 | active | Sprint 2 | P0 | 4 | M | Canonical Section 7 |  | SwipeDeck — card stack, tracks swipe results, theatrical pause then result route |
| S2-T3 | active | Sprint 2 | P0 | 2 | S | Canonical Section 7 |  | Archetype scoring algorithm — pure logic over swipe_scores JSONB |
| S2-T4 | active | Sprint 2 | P0 | 4 | M | Canonical Section 7 + TD-15 + TD-21 + 22-voice adversarial panel |  | Archetype Result screen — integrates REVEAL-1 structure + REVEAL-2 share card + insight Edge Function |
| S2-T4-INSIGHT | active | Sprint 2 | P0 | 3 | M | TD-21 Prompt Engineer | Section 0 AI-native positioning | Personalised share insight — separate Edge Function generate-share-insight |
| S2-T5 | active | Sprint 2 | P0 | 2 | S | Canonical Section 7 |  | Profile tab + retake flow |
| S2-T6 | active | Sprint 2 | P0 | 5 | L | Canonical Section 7 + 11 Apr patch |  | Budget + Room Setup (3 screens: occupancy/journey, budget+room_type, room briefing) |
| S2-T7 | active | Sprint 2 | P1 | 2 | S | TD-16 UX/UI Specialist |  | Second-room prompt (shortened flow, no re-reveal) |
| S3-AWIN-POSTBACK | upcoming | Post-Sprint 3 — Brand Pilot Prep | P1 | 6 | M | Multi-discipline panel 12 Apr — R-4 brand pilot dependency |  | Awin S2S postback — receive purchase confirmations for brand pilot conversion reporting |
| S3-T0 | upcoming | Sprint 3 — AI Recommendations | P0 | 2 | N | Multi-discipline panel 12 Apr — April 19 hard deadline |  | Claude Haiku model string migration — verify claude-haiku-4-5 across all files |
| S3-T1A | upcoming | Sprint 3 — AI Recommendations | P0 | 5 | L | Canonical Section 7 (12 Apr T1 split) + MC-IA-1 | Section 6 delivery_tier + Section 7 T1a | Edge Function scaffolding + products query + Haiku selection call + delivery_tier column |
| S3-T1B | upcoming | Sprint 3 — AI Recommendations | P0 | 5 | L | Canonical Section 7 (12 Apr T1 split) + Cold Start CS-9/CS-13/CS-14 | Section 7 T1b | Rationale generation — second Haiku call with scratch/partial/aspirational branches, quality gate, Position 1 constraint |
| S3-T1C | upcoming | Sprint 3 — AI Recommendations | P0 | 4 | M | Canonical Section 7 + MC-IA-5 + TD-3 Solution Architect | Section 6 recommendation_cache | Validation + cache layer (recommendation_cache table) + fallback |
| S3-T1D | upcoming | Sprint 3 — AI Recommendations | P0 | 3 | M | MC-IA-2/3 + DG-1/2 + TD-7 Data Analyst + multi-discipline panel 12 Apr | Section 4 payload registry | Payload wiring — position, retailer, category, journey_stage, acquisition_source, model_version, recommendation_rank, product_price_band, session_id |
| S3-T2 | upcoming | Sprint 3 — AI Recommendations | P0 | 3 | M | MC-IA-1 + TD-17 UX/UI Specialist |  | ProductCard with delivery_tier badge (decision-time visibility per TD-17) |
| S3-T3 | upcoming | Sprint 3 — AI Recommendations | P0 | 2 | S | Canonical Section 7 |  | Wishlist (soft-delete, heart animation) |
| S3-T4 | upcoming | Sprint 3 — AI Recommendations | P0 | 3 | M | Canonical Section 11 (resolved) |  | Affiliate link routing + in-app webview (expo-web-browser) |
| S3-T5 | upcoming | Sprint 3 — AI Recommendations | P1 | 2 | S | Canonical Section 7 |  | Rate limit / circuit breaker — 20 AI calls/user/day |
| S3-WAYFAIR | upcoming | Sprint 3 — AI Recommendations | P0 | 1 | N | TD-13 Tester |  | Wayfair webview commission test (moved to Sprint 3 per TD-13) |
| S4-LINK-CHECK | upcoming | Sprint 4 — Engagement | P1 | 3 | S | Multi-discipline panel 12 Apr — catalogue quality kill risk |  | Automated affiliate link health check — weekly cron marks dead links inactive |
| S4-RENAME | upcoming | Sprint 4 — Engagement | P1 | 3 | N | Memory T-RENAME-1-8 |  | External service rebranding (Supabase, GitHub, app.json, PostHog, Sentry, CLAUDE.md, handles, git email) |
| S4-T1 | upcoming | Sprint 4 — Engagement | P0 | 3 | M | Canonical Section 7 + App Store ASR-DELETE | Section 7 Sprint 4 | Delete Account flow (Apple Guideline 5.1.1v launch blocker) |
| S4-T2 | upcoming | Sprint 4 — Engagement | P1 | 3 | S | Canonical Section 7 |  | Push notification permission + token (pre-prompt after first room setup) |
| S4-T3 | upcoming | Sprint 4 — Engagement | P1 | 4 | M | Canonical Section 7 |  | Notification triggers — 4 Edge Functions via Supabase Schedules |
| S4-T4 | upcoming | Sprint 4 — Engagement | P1 | 2 | S | Canonical Section 7 |  | Welcome email (Supabase Auth Hook) + password reset deep link |
| S4-T5 | upcoming | Sprint 4 — Engagement | P1 | 2 | S | Canonical Section 3 consent |  | Profile Settings — notifications toggle, privacy link, terms link, consent revoke |

---

## Tasks by tab

### active

BS2-T0, BS2-T1, BS2-T2, BS2-T3, BS2-T4, BS2-T5, BS2-T6, BS2-T7, BS2-T8, CONTENT-01, DESIGN-07, DESIGN-08, ICON-1, KI-01, KI-02, KI-03, REVEAL-1, REVEAL-1A, REVEAL-1A.5, REVEAL-1B, REVEAL-1C, REVEAL-1D, REVEAL-1E, REVEAL-1F, REVEAL-2, S2-T1, S2-T2, S2-T3, S2-T4, S2-T4-INSIGHT, S2-T5, S2-T6, S2-T7

### upcoming

CONTENT-02, GTM-BIP, GTM-BROKER-1, GTM-BROKER-2, GTM-CAP-GATE, GTM-IG, GTM-PIN-1, GTM-PIN-2, GTM-PIN-3, GTM-PR, GTM-TT-1, GTM-TT-2, GTM-TT-3, GTM-TT-GATE, GTM-WAIT, KI-04, KI-05, KI-06, KI-07, KI-08, KI-09, KI-10, KI-11, KI-12, KI-13, KI-14, S3-AWIN-POSTBACK, S3-T0, S3-T1A, S3-T1B, S3-T1C, S3-T1D, S3-T2, S3-T3, S3-T4, S3-T5, S3-WAYFAIR, S4-LINK-CHECK, S4-RENAME, S4-T1, S4-T2, S4-T3, S4-T4, S4-T5

### prelaunch

ASO-1, ASR-AGE-RATING, ASR-AI-CONSENT, ASR-AI-DISCLOSURE, ASR-DELETE, ASR-DEMO-ACCT, ASR-DPA-ANTHROPIC, ASR-ENCRYPTION, ASR-IPAD, ASR-IPV4, ASR-NO-LOCATION, ASR-NO-PLACEHOLDER, ASR-PRIVACY-POL, ASR-SCREENSHOTS, ASR-SDK-AUDIT, ASR-SUPPORT-URL, ASR-TESTFLIGHT-FB, ASR-UNIQUE-VALUE, ASR-XCODE, CAT-REFRESH, DAN-1, DAN-2, DAN-3, DAN-4, DAN-5, DUNS-1, MF-1, MF-2, MF-3, MF-4, MF-5, MF-6, MF-7, MF-8, MF-IDENTITY, MF-SETUP, MF-SHARE, PL-ARCHETYPES, PL-DPA-TRAIL, PL-ICO-REVIEW, PL-PAYLOAD-REG, PL-PROD-SYNC, PL-REVIEW-PUSH, PL-RLS-AUDIT, PL-TESTFLIGHT

### parked

KI-15, PK-1, PK-2, PK-3, PK-4, PK-5, PK-6, PK-7, PK-8, PK-9, PK-10, PK-11, PK-12, PK-13, PK-14, PK-15, PK-R12

### (none)

DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06, DESIGN-09, QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, QUIZ-06

---

## Tasks by group

### (none)

DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06, DESIGN-09, QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, QUIZ-06

### App Store Optimisation

ASO-1

### App Store Readiness (ASR_CHECKS)

ASR-AGE-RATING, ASR-AI-CONSENT, ASR-AI-DISCLOSURE, ASR-DELETE, ASR-DEMO-ACCT, ASR-DPA-ANTHROPIC, ASR-ENCRYPTION, ASR-IPAD, ASR-IPV4, ASR-NO-LOCATION, ASR-NO-PLACEHOLDER, ASR-PRIVACY-POL, ASR-SCREENSHOTS, ASR-SDK-AUDIT, ASR-SUPPORT-URL, ASR-TESTFLIGHT-FB, ASR-UNIQUE-VALUE, ASR-XCODE

### Brand identity

ICON-1

### Bridge Sprint 2-prime

BS2-T0, BS2-T1, BS2-T2, BS2-T3, BS2-T4, BS2-T5, BS2-T6, BS2-T7, BS2-T8

### Canonical amendments

PK-R12

### Content Quality

CONTENT-01

### Design Polish (Sprint 2)

DESIGN-07, DESIGN-08

### GTM — Other channels

GTM-BIP, GTM-BROKER-1, GTM-BROKER-2, GTM-CAP-GATE, GTM-IG, GTM-PR, GTM-WAIT

### GTM — Pinterest (#1 organic)

GTM-PIN-1, GTM-PIN-2, GTM-PIN-3

### GTM — TikTok (#2 organic)

GTM-TT-1, GTM-TT-2, GTM-TT-3, GTM-TT-GATE

### Incorporation + legal

DUNS-1

### Knowledge infrastructure — parked (ToS concern)

KI-15

### Knowledge infrastructure — Phase 0 (drift detection)

KI-01, KI-02, KI-03

### Knowledge infrastructure — Phase 1 (session hygiene)

KI-04, KI-05, KI-06

### Knowledge infrastructure — Phase 2 (retrieval)

KI-07, KI-08, KI-09, KI-10

### Knowledge infrastructure — Phase 3 (personal workflow)

KI-11, KI-12, KI-13, KI-14

### Launch blockers

PL-ARCHETYPES, PL-PAYLOAD-REG, PL-PROD-SYNC, PL-REVIEW-PUSH, PL-TESTFLIGHT

### Legal + compliance pre-launch

PL-DPA-TRAIL, PL-ICO-REVIEW, PL-RLS-AUDIT

### May meeting track (Dan deliverables — parallel, not blocking)

DAN-1, DAN-2, DAN-3, DAN-4, DAN-5

### Mock-first test (6 users, non-negotiable gate)

MF-1, MF-2, MF-3, MF-4, MF-5, MF-6, MF-7, MF-8, MF-IDENTITY, MF-SETUP, MF-SHARE

### P3 — Post-launch

PK-1, PK-2, PK-3, PK-4

### Post-launch measurement

PK-12, PK-13, PK-14, PK-15

### Post-launch operations prep

CAT-REFRESH

### Post-Sprint 3 — Brand Pilot Prep

S3-AWIN-POSTBACK

### Sprint 2

REVEAL-1, REVEAL-1A, REVEAL-1A.5, REVEAL-1B, REVEAL-1C, REVEAL-1D, REVEAL-1E, REVEAL-1F, REVEAL-2, S2-T1, S2-T2, S2-T3, S2-T4, S2-T4-INSIGHT, S2-T5, S2-T6, S2-T7

### Sprint 3

CONTENT-02

### Sprint 3 — AI Recommendations

S3-T0, S3-T1A, S3-T1B, S3-T1C, S3-T1D, S3-T2, S3-T3, S3-T4, S3-T5, S3-WAYFAIR

### Sprint 4 — Engagement

S4-LINK-CHECK, S4-RENAME, S4-T1, S4-T2, S4-T3, S4-T4, S4-T5

### v2 features (not scoped)

PK-5, PK-6, PK-7, PK-8, PK-9, PK-10, PK-11

