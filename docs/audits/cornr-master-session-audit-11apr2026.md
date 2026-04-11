# Cornr Master Session Audit — 11 April 2026

**Purpose:** Catalogue every finding, recommendation, and decision from today's session. Nothing gets lost. Each item is tagged with its source, current status (accepted / needs critique / needs build plan placement / done), and the critique it's been through.

This document is the bridge between today's strategic work and tonight's build plan session. Every item below either needs to land in the canonical, land in Mission Control, or be explicitly parked with a return condition.

---

## Section A — Research Artifacts Produced Today

| # | Artifact | File | Status |
|---|----------|------|--------|
| A1 | TAM/SAM/SOM & Financial Model Framework | cornr-research-audit artifact (in chat) | Complete — needs financial model revisions per critique |
| A2 | Mini-deck packaging research | Building mini-deck artifact (in chat) | Complete — informs deck design |
| A3 | Mini-deck PDFs (mobile + desktop) | cornr_deck_mobile.pdf, cornr_deck_desktop.pdf | Draft 1 complete — needs UI fixes + content revisions |
| A4 | Research audit (Palazzo + TAM cross-ref) | cornr-research-audit-11apr2026.md | Complete — 15 recommendations, 3 priority tiers |
| A5 | Problem-solution linkage audit | cornr-problem-solution-linkage-audit-11apr2026.md | Complete — 12 personas, 3 rounds, 11 actions |
| A6 | Business setup + seed data strategy | cornr-business-setup-seed-data-11apr2026.md | Complete — critiqued, 2 tracks locked |
| A7 | Lean Product Playbook + Kano framework guide | Artifact in chat | Complete — framework application guide |
| A8 | Trades feature analysis | Artifact in chat | Complete — recommendation to defer, pending final critique |

---

## Section B — Strategic Decisions Made or Proposed Today

Each decision needs a status: LOCKED (critiqued and accepted), PROPOSED (needs critique), or NOTED (observation, no action yet).

### B1. Financial model revisions — LOCKED

**Source:** A4 (research audit) + A5 (linkage audit)

**Changes:**
- Year 2 brand partnerships: £120K → £30K (moderate scenario)
- Year 2 taste intelligence: £20K → £5-10K
- MAU definition: "users with at least one room who opened app in last 30 days" (excludes quiz-and-churn)
- Segment ARPU by ring: inner ring 25-35% MAU, outer ring 5-10%
- Model three consent opt-in scenarios: 30%, 50%, 70%
- Add realistic CAC: 80% organic / 20% paid Year 1
- Adjusted Year 1-3 revenue: £10-35K → £60-250K → £200-900K
- Note: model doesn't account for seasonality (Q1 + Q3 peaks). Annual projections average out but cash flow will be lumpy.

### B2. Trades feature deferred from v1 — LOCKED

**Source:** A8 (trades analysis) + A5 (linkage audit)

**Decision:** Replace Google Places directory with "Coming Soon" demand-capture tab. Save ~15h build time. Preserve three-pillar narrative via tab presence. Track trades_tab_tapped + email capture for demand signal. Assembly/fitting (TaskRabbit-style) noted as more natural v2 entry point than full trades.

### B3. Seed data pattern — LOCKED

**Source:** A6 (business setup + seed data)

**Decision:** Create seed product catalogue (~120 products initially, 6 categories × 20 products × 3 budget tiers) with `source` column (seed|awin|manual) on products table. Build and test Sprint 3 against seed data. Swap for real Awin products when approved. Seed products include intentional ambiguity to stress-test recommendations. Seeding script in tools/seed/ with safety checks.

### B4. Business setup phasing — LOCKED

**Source:** A6 + multi-persona critique

**Decision:** Incorporate when affordable (not urgent). TestFlight needs only £79 (Individual Apple Developer). Full chain: incorporate (£50) → domain (£5) → Workspace (£5/mo) → Awin applications → D-U-N-S → Apple Developer Org. Don't add Notion. Don't add paid accounting. Defer Loops.so. Google Sheets for expenses. Pre-trading expenses claimable.

### B5. Secondary archetype blending rule — LOCKED

**Source:** A5 (linkage audit) + critique

**Decision:** Secondary archetype influences product 3 only. Products 1-2 pure primary archetype. Archetype adjacency map in src/content/archetypes.ts: Curator↔Purist↔Nester, Traditionalist↔Nester, Free Spirit↔Maker, Modernist↔Purist.

### B6. Wishlisted products as taste signal — LOCKED

**Source:** A5 (linkage audit)

**Decision:** Pass last 5 wishlisted products (title + category + archetype_tags) into Sprint 3 recommendation prompt. Frame as taste signal: "complement, don't duplicate." Merged with B5 as single Sprint 3 T1 prompt design task.

### B7. "Describe what you're keeping" free-text input — LOCKED

**Source:** A5 (linkage audit) + critique

**Decision:** Optional free-text field per checked existing_categories item on Sprint 2 T6 Screen 3. Store as existing_descriptions JSONB on rooms table. Only appears when a category is checked. "Nothing yet" hides all fields. Adds ~1h to T6 build.

### B8. Purchased state on wishlist — ACCEPTED, DEFERRED

**Source:** A5 (linkage audit)

**Decision:** Third state on heart: unsaved → wishlisted → purchased. Bottom sheet interaction. Deferred to post-Sprint 3. Not launch-blocking.

### B9. Branded first-load recommendation experience — LOCKED

**Source:** A5 (linkage audit) + critique

**Decision:** First-ever recommendation load shows "Finding products for your [Archetype] style..." with warm-100 pulse. Subsequent loads use standard BDS v3 skeleton. +30 min on Sprint 3 T2.

### B10. Catalogue depth graceful degradation — LOCKED

**Source:** A5 (linkage audit) + critique

**Decision:** When fewer than 3 products match exact archetype + room + budget, widen to secondary archetype first, then adjacent archetypes per adjacency map, before returning fewer than 3.

### B11. Mini-deck content revisions — PROPOSED (for next session)

**Changes needed:**
- Page 1: Add "buy next" sequencing to positioning line
- Page 2: Timeline → "TestFlight summer 2026, first users autumn 2026"
- Page 2: Financial numbers updated to revised model
- Page 3: Add "Every recommendation click is real purchase intent, not browsing"
- All pages: UI fixes (mobile timeline text, bar chart legibility, spacing)

### B12. GTM sprint scoping — PROPOSED (placeholder)

**Decision:** Scope after Sprint 3 feature-complete. Not before. Placeholder in MC.

### B13. Archetype-driven content editorial brief — PROPOSED

**Decision:** Weekly editorial brief mapped to 7 archetypes × room types. 2h founder work. Retention mechanism for Pre-Purchase Researchers.

### B14. Engagement helper Sentry logging — PROPOSED

**Decision:** Add Sentry error logging to engagement_events write path. 30 min. Needs MC task.

### B15. Recommendation engine failure taxonomy — LOCKED

**Decision:** Four failure modes: (a) timeout → retry once, curated fallback; (b) malformed → log to Sentry, curated fallback; (c) partial (1-2 products) → show what we got; (d) rate limit → queue, 30s retry, curated fallback after 3 attempts. Curated fallback = 3 products per archetype × budget tier (21 sets, 63 products from seed catalogue).

### B16. Cornr.co.uk landing page — PROPOSED

**Decision:** Static holding page with wordmark, tagline, App Store link. GitHub Pages or Cloudflare Pages. Depends on domain registration. 1h after domain.

### B17. Demo account for App Store review — LOCKED

**Decision:** Pre-create demo@cornr.co.uk with completed archetype, rooms, products. In Launch Readiness.

### B18. Canonical standing rules — LOCKED (committed)

Three rules: (1) archetype influences every screen, (2) dual event write, (3) shared Supabase auth. Plus (4) document architecture rule (canonical patch + DECISIONS_LOG).

### B19. Assembly/fitting opportunity — NOTED

**Observation:** TaskRabbit-style light services connect to purchase moment. "You bought a bookshelf — need someone to put it up?" Blocked on purchase data being on affiliate side. Return condition: when purchased state exists on wishlist AND affiliate purchase data can be correlated.

---

## Section C — Framework Outputs (need visual diagrams in next session)

- C1. Dan Olsen PMF Pyramid — applied to Cornr, 5 layers mapped
- C2. Kano Model — all features classified by version, Reverse category justified trades deferral
- C3. Importance vs Satisfaction — opportunity mapping, upper-left quadrant validated
- C4. NOW-NEXT-LATER roadmap — three columns × four swimlanes (pillars + platform)
- C5. Concentric TAM rings with features overlaid — three rings colour-coded by version

---

## Section D — Document Architecture (LOCKED, committed)

- docs/DECISIONS_LOG.md — append-only, newest first, Claude Code reads via /start
- docs/operations/business-setup.md — phased setup tracker with costs
- docs/audits/ — session audits (this file)
- docs/strategy/ — financial model, frameworks (to be populated)
- Canonical patch workflow: every planning session ends with paste-ready patches + DECISIONS_LOG append
- Memory pruning protocol: extract before delete, verify duplication, changelog in DECISIONS_LOG

---

## Section E — Competitor Intelligence (Palazzo)

**App Store:** 1.0 out of 5, 4 reviews, all 1-star. Developer "Relentless" ships 13+ unrelated apps.

**Five failure themes mapped to Cornr anti-requirements:**
1. Charging before delivering value → Cornr: auth-after-value funnel, affiliate model (user pays nothing)
2. AI renders that don't work → Cornr: defer renders to v2, focus on product recommendations in v1
3. Cross-platform auth broken → Cornr: mobile-native only, no web companion yet
4. Developer focus split across many apps → Cornr: singular product focus
5. Quiz disconnected from product → Cornr: archetype drives every downstream feature

**Palazzo pivot:** Now targeting realtors for virtual staging, suggesting consumer AI-design market isn't converting to revenue fast enough for venture-backed companies. Validates Cornr's affiliate-first model.

---

## Section F — Key Data Points for Dan Meeting (May)

- UK FTB completions: 333K (2024), projected 390K (2025)
- Average FTB furnishing spend: £15,509 (Aldermore, n=500)
- Annual FTB furnishing market: £5.3-6.0B
- SheerLuxe: £40M exit, 7.8× EBITDA, £12.6M revenue, 40% margin, 900K email subs, no personalisation tech
- SheerLuxe per-subscriber valuation: £61
- BCG first-party data: 2.9× revenue uplift
- McKinsey personalisation: 10-15% revenue lift (top performers 5-25%)
- Quiz completion rates: 80-95% (Outgrow, Riddle)
- Quiz email capture: 40.1% (Interact, 80M+ leads)
- No UK competitor combines taste profiling + AI recs + trades in mobile-native app
- Palazzo: closest global entrant, 1.0-star rating, pivoted to realtor staging

---

## Section G — What Daryll Does Next

### Done (committed to repo):
- [x] DECISIONS_LOG.md created and committed
- [x] business-setup.md created and committed
- [x] Canonical patched (7 patches applied)
- [x] Directory structure created (audits/, strategy/)
- [x] Master audit committed to docs/audits/

### Next actions (free, no blockers):
- [ ] Merge both feature branches to main (SwipeCard + error handling)
- [ ] Start seed product research on phone (sofas first, 40 min)
- [ ] Write archetype descriptions (still blocking Sprint 2 T4)
- [ ] Set up expense tracking Google Sheet (15 min)

### Next Claude.ai session (strategy outputs):
- [ ] Build 5 framework diagrams (Kano, PMF Pyramid, I×S scatter, NOW-NEXT-LATER, concentric rings)
- [ ] Rebuild mini-deck v2 with revised content + UI fixes
- [ ] Build 1-page financial model summary
- [ ] Prepare illustrative Curator segment data report for Dan

### When affordable:
- [ ] Incorporate (£50) → domain (£5) → Workspace (£5/mo) → Awin applications
- [ ] Individual Apple Developer (£79) — before TestFlight

---

*Master audit complete. 19 strategic items: 12 locked, 4 proposed for next session, 3 noted for future. All locked items committed to canonical and DECISIONS_LOG. Document architecture established. Nothing lost.*
