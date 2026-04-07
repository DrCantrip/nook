# Cornr Canonical Context

**Last updated:** 7 April 2026 (Bridge Sprint complete; Section 6 SQL patched for INSERT policies, model_version, partial wishlist index, anon engagement event purge)
**Purpose:** Single source of truth for all strategic decisions, architecture choices, sprint plans, and workflow rules that postdate the v4 PDFs in project knowledge. Read this first in any new session. If anything below contradicts the PDFs, this file wins.

---

## How to use this file

- **At the start of any new claude.ai session:** upload this file to the project (or confirm it's already there). Claude reads it before doing anything strategic.
- **At the start of any Claude Code session:** `/start` should read `docs/CORNR_CANONICAL.md` from the repo.
- **When strategic decisions are made:** Claude updates this file in the conversation, you replace the file in the project and the repo. One file, one update, no PDF wrangling.
- **The v4 PDFs (Master Doc, Brand & Design System, Operations & Legal, Competitor Analysis) remain in project knowledge as archival reference.** They're not wrong, they're snapshots. This file is the living layer on top.

---

## Section 0 — Strategic Decisions Log

Every strategic decision that shapes Cornr's product, scope, or architecture lives here. Append-only. Each entry: date, decision, alternatives considered, rationale, source.

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

---

## Section 1 — Personas (revised)

Three personas, all UK first-time buyers. Cornr serves all three from active house-hunting through 18 months post-completion.

**The Pre-Purchase Researcher** — Actively house-hunting, browsing Rightmove and Zoopla regularly, 6–18 months from completion. Has a forming budget and a forming taste. High curiosity, low urgency, longest engagement window. Cornr serves with archetype discovery, aspirational rooms tied to no specific property, and inspiration-led recommendations. Becomes a New Mover on completion, with all their data already in Cornr.

**The New Mover** — Just completed. Overwhelmed by an empty home. Needs to make dozens of decisions quickly. High urgency, low confidence. Cornr serves with archetype-based recommendations, room-by-room sequencing, and trades discovery for the work that needs doing.

**The Active Renovator** — Moved in 6–18 months ago. One room done, others waiting. Knows what they don't want, unsure what they do want. Medium urgency, growing confidence. Cornr serves with archetype-aware recommendations that respect existing pieces (`existing_categories`), and trades discovery for the next phase.

**Persona priority for v1:** All three are first-class. New Mover is easiest to monetise short-term. Pre-Purchase Researcher is highest LTV and deepest data well. Active Renovator most likely to use trades. Build for all three.

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
| `products` | `id`, `title`, `image_url`, `retailer`, `affiliate_url`, `archetype_tags`, `room_tags`, `budget_tier`, `category`, `season` | Read-all auth users |
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
```

---

## Section 7 — Sprint Plan

### Sprint 1 — COMPLETE 7 April 2026

T1–T10 done. Six PRs merged. Tokens.ts is styling source of truth. NativeWind removed. Fonts bundled. RLS verified across 6 original tables. Sentry EU + PostHog EU live. `signup_completed` event firing.

### Bridge Sprint — Strategic Foundation — COMPLETE 7 April 2026

T13 → T11 → T12 merged in order. Three PRs, branches deleted, main synced. EditorialCard organism live with three-tier fallback (real row → wishlist → quiet welcome). Engagement helper (`src/services/engagement.ts`) wired alongside PostHog for `signup_completed`; remaining six event wiring sites flagged for Sprint 2/3. Voice gate added to CLAUDE.md and `/done` as standing rule. Sprint 2 unblocked.

### Sprint 2 — Swipe Deck and Archetype Result

**Prerequisite:** Bridge Sprint complete. All schema migrations applied. Engagement helper wired.

T1–T5 unchanged from v4.

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

Full prompt template drafted at Sprint 3 T1 build time.

### Sprints 4–6 — unchanged from Master Doc v4

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

The v4 PDFs (Master Doc, Brand & Design System, Operations & Legal, Competitor Analysis) remain in project knowledge as snapshots. They're not edited going forward. This file is authoritative.

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

---

## Section 11 — Open Questions (live)

| Question | Resolve by | Default |
|---|---|---|
| Wayfair mobile exclusion workaround | Before Sprint 3 | Use in-app webview (`expo-web-browser`) for all affiliate links |
| IKEA product coverage without affiliate | Before Sprint 3 | Exclude IKEA from v1; revisit if programme launches |
| Digital Home API costs at scale | Before v2 scoping | Budget £130–250/month for 1K active users |
| Swipe card count: 12 or 15 | Sprint 2 build | Start 12, reduce if completion <45% |
| Seasonal product refresh process | Before launch | Manual quarterly. 30 new replacing bottom 30. |
| Archetype descriptions (7 new) | Before Sprint 2 T4 | Write fresh from BDS v3 voice guide |

**Resolved 7 April 2026:** archetype as primary mechanic; Pre-Purchase Researcher serving; v2 brand partnership data foundation. See Section 0.

---

## Section 12 — Reading order for fresh sessions

1. This file, top to bottom.
2. Memory (already in Claude's context automatically).
3. The relevant sprint section (Section 7) for whatever you're building next.
4. Brand & Design System v3 PDF (in project knowledge) for component specs and visual rules.
5. Master Doc v4 PDF (in project knowledge) for anything not in this file.

If the v4 PDFs and this file disagree, **this file wins**.

---

*End of canonical context. ~3,500 words. Replace this file in project knowledge whenever a strategic decision is made. Single source of truth.*
