### 10 April 2026 — Entry point adopts task-aware taste-first with whole-house framing (Option D-prime)

Taste-first entry preserved as primary flow. Visible escape hatch for task-oriented users added to Welcome screen. Quiz extended to 16 cards with whole-house framing and chapter markers every 4 cards. Post-reveal destination changed from room setup to Home tab with "Your home" canvas and multi-room accent feed. Product catalogue gains `product_scope` field distinguishing multi-room items (lamps, rugs, cushions, art, throws) from room-specific items (sofas, beds, dining tables, kitchen taps, headboards). Multi-room products recommended at Home tab level without room setup; room-specific products recommended at room level after room setup. Room setup repositioned as per-room deepening from canvas, not mandatory funnel step.

Welcome screen gains three interaction zones: (1) primary "Find your home style" CTA routing to quiz, (2) secondary "Where would you like to start?" chip row with 6–7 room options plus "I'm not sure yet" storing `room_interest` on users and weighting the swipe deck, (3) tertiary "I know what I'm shopping for" escape hatch routing to anonymous room-scoped browse with soft nudge toward quiz after 3–4 interactions.

**7 April constraint-capture-after-reveal decision softened, not reversed.** A lightweight room-interest signal is now captured at Welcome (pre-quiz) via the chip row. This is a starting-point preference, not a constraint. Rich constraint capture (occupancy status, room stage, existing categories, budget) remains post-reveal at room setup as 7 April specified. The emotional arc (feel known → feel served → feel justified) is preserved because the chip row creates no commitment that competes with the archetype reveal.

**Alternatives considered:**
- (A) Two equal entry points — rejected, too expensive, no panel support
- (B) Room-first full stop — rejected, loses identity mechanic that is Cornr's core differentiator
- (C) Room-balanced taste-first (initial critique recommendation) — superseded by D-prime
- (D) Task-aware taste-first with escape hatch (intermediate recommendation) — extended into D-prime by founder notes on whole-house framing, gamification, multi-room products, and financial state balance

**Rationale:** External research (15+ consumer discovery apps, UK FTB data, behavioural science) confirms taste-first is correct for homeware but requires an escape hatch — no successful high-consideration commerce platform gates its funnel behind exploratory-first with no skip (Houzz, Airbnb both failed this way). Whole-house framing dissolves the deck-length problem (16 cards justified by home scope), enables room-balanced curation, creates a retention hook (progress counter), and enables multi-room vs room-specific product distinction that resolves financial-state adaptation architecturally rather than algorithmically. Lean Product Playbook lens confirmed the problem-space reframe: Cornr's underserved need is "help me have a coherent home" not "help me pick a sofa."

**Dissent preserved:**
- Behavioural Economist: whole-house framing raises psychological stakes of the quiz. If the archetype reveal doesn't feel weighty enough to justify the whole-home promise, the user feels cheated. Mitigated by chapter markers and reveal copy quality. Monitor during mock-first test.
- Glassette CEO: ~21 hours of build is high cognitive overhead for a 7h/week founder. Monitor for Sprint 3 T1 preparation time being displaced.
- Mock Test Specialist: mock-first user test (6 users × 30 min on throwaway mock) is non-negotiable validation before production code. If skipped, log the reason in Section 11.

**Review conditions:**
1. Escape hatch engagement >35% at 100 users → reopen taste-first primacy
2. Quiz completion <45% on 16-card deck → reduce to 12 cards
3. After ~50 real users, run Mom Test item-vs-room interview → reopen entry point if majority describe room-first mental models
4. Ad-traffic landing flow (goal-directed users from ads) → resolve before first paid acquisition campaign

**Source:** Four-round extended strategic critique + compressed refinement pass, 10 April 2026. External research pack (60+ sources), 10 April 2026. Founder notes on whole-house framing, multi-room products, gamification, financial state balance. Prior conversations recalled: March 2026 digital home concept, 7 April archetype critique, multi-room rate metric definition.
