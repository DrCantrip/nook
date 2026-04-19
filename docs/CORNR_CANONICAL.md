# Cornr Canonical Context

**Last updated:** 12 April 2026 (Deep strategy session: GTM v2 locked, unit economics recalibrated 4-5% commission, AI-native positioning as commercial moat, 24-persona teardown, 68-item MC contribution proposal P0-P3, three-tier data retention, Sprint 3 T1 split into T1a-T1d, 10 standing rules codified in Section 13)

<!-- CONTRACT-VERSION: 1 -->
<!-- CANONICAL-SHA: 7d332e0 -->
<!-- LAST-SYNCED-PK: 7d332e0 -->

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

Icon background established as dedicated token #C4785A (warm terracotta), separate from accent-surface. Icon concept: "cornr" serif wordmark nested inside organic corner mark on terracotta background.

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

Share card redesign: cornr wordmark at top, archetype name, style territory, behavioural truth as the headline (not the essence line), essence as secondary. No URL until App Store listing is live.

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

## Section 6 — Database Schema (v1, 9 tables)

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

---

*End of canonical context. Replace this file in project knowledge whenever a strategic decision is made. Single source of truth.*
