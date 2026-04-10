# Cornr Canonical Context

**Last updated:** 7 April 2026 PM (canonical surgery: hybrid naming, trend layer, workflow rules, sprint spec updates)
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

### 10 April 2026 — T2 blocked pending entry-point strategic critique; error handling tranche in progress

Real-device testing of T1 SwipeCard on 10 April surfaced a deeper product question than originally scoped: does the user flow start with taste (current canonical, locked 7 April) or with room (user's actual mental model when they arrive with a specific problem)? The swipe deck without contextual chrome relies on implicit user faith, and the commerce engine downstream is inherently room-specific. Structural mismatch.

**Status:** T1 SwipeCard committed to feature branch with mechanic working. T2 SwipeDeck is **blocked** pending a full Large/Strategic critique (10 personas, 3 rounds, per Section 9) running in a separate chat. T2 will not be started until the critique returns a locked decision on room-first vs taste-first entry point.

**Concurrent work:** Error handling tranche in Launch Readiness has been promoted from backlog to active work this afternoon. Three tasks — LR-ERROR-BOUNDARY, LR-UNMATCHED-ROUTE, LR-ERROR-CONTENT — build out the branded error screen system that was identified as missing during T1 debugging (Unmatched Route default, LogBox defaults, no branded crash fallback). These tasks are insulated from the entry-point decision and can ship regardless of how the critique lands.

**Open questions added to Section 11:**
- Entry point question: room-first or taste-first? (Resolve via critique, today.)
- v1 swipe deck image curation brief. (Resolve after entry point decision lands.)

**Rationale:** Pausing a potentially-changing spec is cheaper than building to it and throwing work away. Error handling is a real launch blocker independent of any product flow decisions. Parallelising these two tracks maximises afternoon output without creating rework risk.

**Source:** Phone testing session, 10 April 2026.

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
| curator | The Curator | Mid-Century Modern | #B8860B |
| nester | The Nester | Coastal | #5B9EA6 |
| maker | The Maker | Industrial | #8B7355 |
| minimalist | The Minimalist | Japandi | #9CAF88 |
| romantic | The Romantic | French Country | #C9A9A6 |
| storyteller | The Storyteller | Eclectic Vintage | #A67B5B |
| urbanist | The Urbanist | Urban Contemporary | #708090 |

**Display rule:** UI shows the personality label ("The Curator") everywhere. The style territory appears only on the archetype reveal screen as a subtitle. The share quote (Sprint 2 T4) also includes the territory.

**Option B contingency:** If ≥30% user confusion in testing, drop the territory subtitle and replace with a "Your style leans toward…" sentence in the archetype description. No schema change required.

**Note:** `dreamer` → `nester` rename requires a migration in Sprint 2 T1 (DB enum, archetype_history, style_profiles, swipe scoring keys, tokens.ts colour map).

---

## Section 2 — Room Context Capture (v1)

At room setup, after budget selection, three additional fields are captured:

**1. `occupancy_status`** — "Have you moved in yet?" — three single-tap options:
- "Yes, I'm settling in" → real room, postcode-derived `property_period` applied, full recommendation flow
- "Not yet, I'm planning ahead" → aspirational room (`is_aspirational=true`), no postcode dependency, inspiration-led recommendation flow
- "I'm renovating an existing space" → real room, `room_stage` pre-fills as `partial`

**2. `room_stage`** — "Where are you with this room?" — three options:
- `scratch` (starting from empty)
- `partial` (have a few key pieces)
- `polishing` (mostly furnished, just refining)

**3. `existing_categories`** — "Anything you're keeping?" — six checkboxes plus "Nothing yet":
- Big furniture
- Soft furnishings
- Lighting
- Wall art / decor
- Storage
- Nothing yet (clears all other checkboxes when selected)

All three fields stored on the `rooms` table. All three passed into the Sprint 3 Haiku prompt. Frame as a *briefing*, not a *form* — copy treats this as Cornr getting better at serving the user, not Cornr making the user work.

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
- `users`: `audience_data_opt_in BOOLEAN DEFAULT false`
- `rooms`: `is_aspirational BOOLEAN DEFAULT false`, `occupancy_status VARCHAR(20)`, `room_stage VARCHAR(20)`, `existing_categories TEXT[]`
- `wishlisted_products`: `removed_at TIMESTAMPTZ` (soft delete)

All engagement event writes go through a single helper function: `src/services/engagement.ts → recordEvent(eventType, eventData)`. Called alongside PostHog `.capture()` calls in existing event handlers. No new event handlers needed.

---

## Section 5 — Editorial Surface (v1)

One editorial card on the Home tab. Image-led, headline overlay, single CTA. Manually populated from the `editorial_content` table. Refreshed weekly or biweekly by Daryll.

**Visual specification (EditorialCard organism):**
- Full-width card with image dominating 60%+ of card area
- `radius-card` (16px), `shadow-card`
- Image at top, gradient overlay (ink-toned, `rgba(26,24,20,0.55)` to transparent) covering bottom 40% of image
- Headline overlays the gradient in Lora 22px/600 white, with 20px padding
- Below image: optional `bodyText` in DM Sans 16px/400 ink, 16px padding
- Below body: `ctaLabel` as `GhostLink` with accent (#94653A) highlight on the action verb
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
| `users` | `id`, `email`, `postcode_district`, `push_token`, `daily_call_count`, `property_period`, `email_marketing_opt_in`, `audience_data_opt_in`, plus existing notification columns | Own row only |
| `style_profiles` | `id`, `user_id`, `primary_archetype`, `secondary_archetype`, `swipe_scores` JSONB, `is_anonymous`, `created_at` | Own row only |
| `archetype_history` | `id`, `user_id`, `primary_archetype`, `secondary_archetype`, `swipe_scores` JSONB, `source` (initial/retake/admin), `recorded_at` | Own rows, append-only |
| `rooms` | `id`, `user_id`, `room_type`, `display_name` (nullable), `budget_tier`, `room_analysis` JSONB (nullable), `archetype_at_recommendation`, `is_aspirational`, `occupancy_status`, `room_stage`, `existing_categories` | Own rooms only |
| `products` | `id`, `title`, `image_url`, `retailer`, `affiliate_url`, `archetype_tags`, `room_tags`, `trend_tags`, `budget_tier`, `category`, `season` | Read-all auth users |
| `wishlisted_products` | `id`, `user_id`, `product_id`, `room_id`, `created_at`, `removed_at` (soft delete) | Own rows only |
| `places_cache` | `id`, `postcode_district`, `trade_type`, `results` JSONB, `cached_at` | Service role only |
| `engagement_events` | `id`, `user_id` (nullable for anon), `event_type`, `event_data` JSONB, `occurred_at`, `retention_until`, `model_version` (nullable for AI events) | Own rows only |
| `editorial_content` | `id`, `headline`, `body_text`, `image_url`, `cta_label`, `cta_url`, `archetype_filter` (nullable), `published_at`, `expires_at` | Read-all auth, published & not expired only |

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

**T6 — Budget + Room Setup (REVISED)** — three-screen flow:

*Screen 1:* "Have you moved in yet?" — three SelectorCards setting `occupancy_status` and `is_aspirational`.
*Screen 2:* Budget tier + room type (existing v4 spec).
*Screen 3:* Room context briefing — `room_stage` selector and `existing_categories` checkboxes per Section 2 above.

Voice: briefing, not form. Newsreader italic for the briefing intro, DM Sans for everything functional. PostHog `room_created` event payload now includes all new fields. `engagement_events.recordEvent` called with same payload.

T7 unchanged.

### Sprint 3 — AI Recommendations (T1 prompt structure locked)

The `recommend-products` Edge Function prompt must:
1. Take inputs: archetype (primary), secondary archetype, room_type, budget_tier, property_period (optional, soft hint only), room_stage, existing_categories, is_aspirational
2. Return exactly 3 products in stated priority order
3. **Non-aspirational rooms:** first product = "buy next" given stage; second complements first; third = stretch piece within budget
4. **Aspirational rooms:** all three = anchor pieces / inspiration, not "buy next" framing
5. Rationale text NEVER invokes property_period claims. Describes visible product qualities only.
6. property_period passed in as soft system-prompt nudge: "If the user's property period is provided, prefer products whose styling suits that era when other criteria are equal. Never mention the period in user-facing rationale."
7. `model_version` set to `claude-haiku-4-5` in `engagement_events` for every recommendation generation

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

### Sprints 4–6 — high-level summary

Detailed task specs for Sprints 4–6 will be drafted when each sprint is reached. High-level scope:

**Sprint 4 — Trades + Rename (~22h, Weeks 11–13).** Tradesperson discovery by postcode using Google Places. Companies House badge only. Browse-only, zero monetisation in v1. Full Cornr rebrand across all external services (T-RENAME-1 through T-RENAME-8): Supabase, GitHub, Expo, app.json, PostHog, Sentry, social handles, git commit email. Gate: Sprint 3 complete.

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

### Document update rule

When a strategic decision is made:
1. Append a new entry to Section 0 of this file (Strategic Decisions Log).
2. Update any other affected sections of this file.
3. Daryll replaces the file in project knowledge and the repo. **No PDF wrangling, no .docx conversions, no manual section edits across multiple documents.** This file is the only living document.

The Brand & Design System v3, Operations & Legal v2, and Competitor Analysis v2 PDFs remain in project knowledge as stable reference documents — they are not edited going forward, and if they conflict with this canonical, this canonical wins. The Cornr Master Document v4 PDF has been archived to Google Drive (content captured in this canonical). This file is authoritative for all build planning and product decisions.

### Mission Control rules

- Storage key: bump to `cornr-mc-v9` when first regenerated after this file is in place. (Bumping the version resets stored progress, so do it once and then leave it.)
- Default ALL tasks to "todo" in JSX. Let `window.storage` override with saved state. Never hardcode tasks as "done".
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

**Resolved 7 April 2026:** archetype as primary mechanic; Pre-Purchase Researcher serving; v2 brand partnership data foundation. See Section 0.

---

## Section 12 — Reading order for fresh sessions

1. This file, top to bottom.
2. Memory (already in Claude's context automatically).
3. The relevant sprint section (Section 7) for whatever you're building next.
4. Brand & Design System v3 PDF (in project knowledge) for component specs and visual rules.
5. For anything not in this canonical: check git history first, then ask Daryll. The Master Doc v4 PDF has been archived to Google Drive (Cornr/Archive/Documents/) — retrieve from there only if historical context is genuinely needed.

If the remaining PDFs and this file disagree, **this file wins**.

---

*End of canonical context. ~3,500 words. Replace this file in project knowledge whenever a strategic decision is made. Single source of truth.*
