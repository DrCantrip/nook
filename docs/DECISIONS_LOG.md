# Cornr Decisions Log

**Purpose:** Append-only, newest first. One line per strategic decision. Claude Code reads this via `/start` as a quick-scan supplement to CORNR_CANONICAL.md. If the canonical is stale, this file catches what changed.

**Rule:** Every Claude.ai planning session appends new decisions here. Daryll pastes, commits, pushes. 30 seconds.

---

## Decisions

## 2026-04-20 — Archetype writing brief + design integration + palette candidate

### Decisions locked
- Writing brief: 38 conditions consolidated, documented at
  docs/strategy/archetype-writing-brief.md. 10-12 governing rules
  extracted for drafting session.
- Reveal is a two-experience screen (first visit + return visit);
  language + design + motion serve both.
- Quiz produces 4 reveal types, not 1 (single/blend/all-yes/all-no).
  Confidence routing at 1.4x mean threshold. See R-21.
- Typography is archetype-invariant (R-20).
- Fallback copy is directional, never diagnostic (R-22).
- Essence line conjures the motif (R-23).
- Palette revision candidate documented; shipping pending mock-first
  validation. 4 of 7 accents proposed for revision.

### Decisions deferred
- Per-archetype WCAG and CVD verification of proposed palette
  (blocks on mock-first)
- Romantic motif revision (rotated ellipses → scalloped arc proposed)
- Motion language principles (framework drafted, full spec pending)
- Tappable motif tooltip copy (written alongside archetype descriptions)

### New MC tasks
- QUIZ-01..06 (confidence routing, tap buttons, fallback copy,
  vector logging, mini-quiz, fuzzy reveals)
- DESIGN-01..09 (Romantic motif, WCAG verification, motion spec,
  tooltip spec, motion language doc, tooltip copy, palette spec,
  mock-first colour question, palette ship decision)

### Source
Three multi-persona critiques on 20 April 2026:
- Critique 1: Research viability + vocabulary accessibility (20 voices)
- Critique 2: Design × language integration at reveal (10 voices)
- Critique 3: Colour theory + brand colour (8 voices)
- Side critique: Quiz edge cases, all-yes/all-no handling

---

### 15 April 2026 (late PM) — Colour system revision v2: terracotta shift

Accent palette shifted from mocha-brown toward terracotta based on UK paint trend data (Lick 2026 edit, F&B Naperon/Scallop, Pantone Mocha Mousse moving out). Four accent tokens, error token, and icon-bg token updated. Four archetype colours revised for territory authenticity (curator, nester, storyteller, urbanist). Three unchanged (maker, minimalist, romantic). CVD policy: colour never sole differentiator. BDS v3 PDF to be removed from project knowledge (Daryll action, not code).

---

## 12 April 2026 — Deep strategy session

**Decisions locked this session:**

1. **AI-native architecture as commercial moat** — Cornr runs on prompts not ML pipelines. Lead all external conversations (Dan deck, brand pitches, press) with the business story, not the technical story.

2. **GTM Strategy v2** — 10-channel stack with realistic 6-month target of 1,900-5,300 users. Pinterest #1 organic (compounds over 6-12 months), TikTok #2 organic (front-loaded batch filming, week 8 kill gate), mortgage broker cards with realistic 100-150 user target. Reddit deprioritised. £100 paid budget: £50 Pinterest + £30 Vistaprint + £20 reserve.

3. **Unit economics recalibrated** — Commission 4-5% blended (not 5-8%). Purchase conversion 4-8% (not 8-12%). Affiliate alone not fundable; brand partnership thesis validated via SheerLuxe comparable (~£14/subscriber/year at scale, £40M exit at 7.8× EBITDA).

4. **Three-tier data retention model** — Individual engagement_events: 18 months. Aggregated segment counts (future aggregated_segments table): indefinite under legitimate interests. User profiles: until account deletion.

5. **Sprint 3 T1 split into T1a-T1d** — Scaffolding+selection (5h), rationale generation (5h), validation+cache+fallback (4h), payload wiring (3h). Total 17h.

6. **MC contribution proposal** — ~68 items tiered P0-P3. P0 ~30h must-have. P1 ~25-30h strong preference. P2 ~20h defer. P3 post-launch.

7. **Seven new standing rules added to Section 13** — catalogue <500 items ceiling, TikTok front-loaded, GTM capacity cut order, brand pilot before 10K users, Dan meeting regardless of build state, Stale Pattern Gate on PDF-sourced facts, AI-native positioning leads external conversations.

**Research completed this session:**
- Unit Economics Validation (recalibrated commission, validated brand partnership thesis)
- GTM Channel Validation (invalidated v1 claims, validated Pinterest + TikTok, £100 reality check)

**Critique sessions completed:**
- MC Impact Assessment (15 personas, 8 locked items)
- Cold Start Critique (7 personas, 9 findings)
- Discipline Gates (4 lenses, 7 findings)
- Full Teardown (24 personas including Solution Architect, Prompt Engineer, Claude Code Specialist, AI-Native Business Owner, UX/UI Specialist, App Store Specialist, Data Analyst, Tester, TikTok/Social Media Manager, 3 rounds, 30 new findings)

**Source:** Single session, 12 April 2026, claude.ai strategy conversation.

---

2026-04-11: Onboarding flow restructured: 2 screens + post-recommendation refinement. journey_stage on users replaces occupancy_status on rooms.
2026-04-11: FTB verification via home_status field on users. Enables Tier 2-3 brand reports.
2026-04-11: Renters passively accommodated via journey_stage='renting'. Prompt adapts to freestanding/portable. Not actively marketed to.
2026-04-11: Claude-native ML approach locked. Monthly prompt evolution + quarterly cohort analysis. No traditional ML infra until >50K users.
2026-04-11: Category-level room sequencing in recommendation prompt. ROOM_SEQUENCES in src/content/rooms.ts. Product 1 from first unmet category.
2026-04-11: Delivery tier on products table (days/weeks/made_to_order/long_lead). Truck icon on ProductCard.
2026-04-11: Week 30 diagnostic sequence replaces hard pivot trigger. 6-step diagnostic before any model change.
2026-04-11: Trades tab: branded screen with email capture + trades_waitlist table. Consent separate from marketing opt-in.
2026-04-11: Trades deferred from v1 — "Coming Soon" demand-capture tab. Saves ~15h. Tab stays in nav for three-pillar narrative.
2026-04-11: Seed data pattern adopted. `source` column (seed|awin|manual) on products table. Sprint 3 unblocked from Awin.
2026-04-11: Financial model revised. Y2 brand partnerships £30K (was £120K). Y2 taste intelligence £5-10K (was £20K). Y1 £10-35K, Y2 £60-250K, Y3 £200-900K.
2026-04-11: Secondary archetype influences product 3 only. Products 1-2 pure primary. Prevents incoherent blending.
2026-04-11: MAU definition locked: users with at least one room who opened app in last 30 days. Outer-ring quiz-and-churn excluded.
2026-04-11: Archetype adjacency map needed in src/content/archetypes.ts for catalogue degradation. Curator–Purist–Nester, Traditionalist–Nester, Free Spirit–Maker, Modernist–Purist.
2026-04-11: Optional "describe what you're keeping" free-text on room setup (Sprint 2 T6). JSONB existing_descriptions on rooms table.
2026-04-11: Branded first-load recommendation experience (Sprint 3 T2 note). "Finding products for your [Archetype] style..." on first-ever load only.
2026-04-11: Recommendation engine failure taxonomy: timeout→retry+fallback, malformed→log+fallback, partial→show what we got, rate limit→queue+retry.
2026-04-11: Curated fallback sets needed: 3 products per archetype × budget tier (21 sets, 63 products) from seed catalogue.
2026-04-11: Three standing rules added: (1) archetype must visibly influence every feature screen, (2) every event fires to PostHog AND engagement_events, (3) any future web surface shares Supabase auth.
2026-04-11: Incorporation not urgent for build. TestFlight needs Individual Apple Developer (£79) only. Incorporate when affordable, before Sprint 4.
2026-04-11: Quiz-to-email conversion target: 35-40% (Interact 2026 benchmark). Loops.so for email, deferred until waitlist/launch sprint.
2026-04-11: Purchased state on wishlist (unsaved→wishlisted→bought) accepted but deferred to post-Sprint 3.
2026-04-11: Document architecture: end every planning session with canonical patch + DECISIONS_LOG append. Commit strategy docs to docs/strategy/, audits to docs/audits/, ops to docs/operations/.
2026-04-10: Entry-point decision D-prime locked. Task-aware taste-first, whole-house framing, escape hatch, multi-room commerce.
2026-04-10: Error voice anchors locked. "Something went west" (crash), "Out walking the dog" (image load).
2026-04-10: Auth guard refactored to ALLOW-LIST. Protected groups: (app) and (onboarding) only.
2026-04-07: Archetype hybrid naming locked. 7 archetypes: Curator·Warm Scandi, Traditionalist·Classic Heritage, Free Spirit·Boho & Eclectic, Purist·Minimal & Japandi, Maker·Industrial, Nester·Coastal, Modernist·Contemporary.
2026-04-07: Trend layer: 65/35 stable-vs-trend. trend_tags on products, src/content/trends.ts as source of truth, ~20-25% weight in Sprint 3 prompt.

---

## Memory Pruning Log

2026-04-11: Removed memory #3 (build quality rules) — all 6 rules exist in CLAUDE.md
2026-04-11: Removed memory #13 (critique process) — superseded by canonical Section 9
2026-04-11: Removed memory #15 (April update build) — T-CLEANUP items duplicated in memory #1
2026-04-11: Compressed memory #9 (Glassette deep dive) — quiz-to-email target moved to this file, Wayfair/IKEA in canonical Section 11
