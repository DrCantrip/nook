# Cornr Decisions Log

**Purpose:** Append-only, newest first. One line per strategic decision. Claude Code reads this via `/start` as a quick-scan supplement to CORNR_CANONICAL.md. If the canonical is stale, this file catches what changed.

**Rule:** Every Claude.ai planning session appends new decisions here. Daryll pastes, commits, pushes. 30 seconds.

---

## Decisions

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
