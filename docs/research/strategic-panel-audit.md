# Strategic panel audit — 13 experts, 3 sessions synthesised
**Research session:** 12 April 2026 — Session 3 (synthesises all three sessions)
**Status:** Decisions locked. 52-row master decision table. Do not re-research.

## Purpose
Full adversarial panel critique across all findings from Sessions 1 and 2, plus the final 13-persona, 8-topic panel on architecture, AI-native opportunities, competitive threats, growth, and the v2 vision.

## The panel's overall verdict

Cornr's thesis is validated. The positioning is correct. The competitive gap is real. The five most urgent execution risks are:

1. **Dead app problem** — no re-engagement loop = single-use novelty. Day 30 retention for shopping apps is ~5.6%. Cornr's furnishing window is 3–6 months intense then episodic. Three re-engagement windows (2 weeks/next room, 3 months/seasonal, 6 months/taste retake) must ship with v1.
2. **Catalogue quality** — broken links, out-of-stock products, unrecognised retailers destroy first-session trust. Automated stock-check cron job is non-negotiable before TestFlight.
3. **15h/week constraint** — competitive window is narrowing. Pinterest and Dunelm are shipping AI features quarterly. Speed to TestFlight is the competitive strategy.
4. **Coherence** — the LLM must know the anchor's specific visual properties when selecting the complement. Passing only an archetype label produces incoherent sets.
5. **Quiz image bank** — image quality matters more than the algorithm. A beautiful image every archetype likes provides zero discriminating signal.

## Master decision table (52 rows — key subset)

| # | Finding / Decision | Status | Priority | Action |
|---|---|---|---|---|
| 1 | Pass full 7-dimension archetype score vector to LLM | ACTION REQUIRED | CRITICAL | Update recommendation prompt to accept all 7 scores |
| 2 | Single LLM call with full catalogue as JSON is adequate for TestFlight | VALIDATED | CRITICAL | Proceed with current architecture; temperature=0, structured outputs |
| 3 | Batch-tag catalogue with Claude Vision/Gemini before rec engine build | ACTION REQUIRED | CRITICAL | Run tagging pipeline; cost ~$5–15 for 120 products |
| 4 | Launch with 80–120 products, not 300 | ACTION REQUIRED | CRITICAL | Curate smaller, higher-quality launch catalogue |
| 5 | Precompute all pairwise compatibility scores for anchor categories | ACTION REQUIRED | CRITICAL | Use category-pair-specific prompts (Wayfair approach) |
| 6 | Reduce quiz to 10 cards using full room scenes | ACTION REQUIRED | CRITICAL | Source/create room scene images; calibration study in TestFlight |
| 7 | Archetype reveal = 3–4 screen sequential story → shareable 9:16 card | ACTION REQUIRED | CRITICAL | Design and build reveal flow; this IS the growth mechanic |
| 8 | Signup gate after full reveal, before recommendations (blurred preview) | ACTION REQUIRED | CRITICAL | Move gate to post-reveal; blurred rec preview as incentive |
| 9 | Automated stock-check and broken link detection | ACTION REQUIRED | CRITICAL | Weekly cron job verifying affiliate URLs and availability |
| 10 | Dead app problem: three re-engagement windows (2w, 3m, 6m) | ACTION REQUIRED | CRITICAL | Implement via Loops.so push + email |
| 11 | Anchor-complement-stretch 3-product output structure | VALIDATED | CRITICAL | Implement as core recommendation format |
| 12 | Room setup = one tap (room type only); capture rest progressively | ACTION REQUIRED | CRITICAL | Simplify onboarding to single room-type selector |
| 13 | Data schema: full score vector + timestamped engagement + Awin postbacks | ACTION REQUIRED | CRITICAL | Design and implement before TestFlight |
| 14 | Two-step anchor-then-complement pattern | DEFERRED | HIGH | Sprint 4 or first post-launch update |
| 15 | Adaptive card selection (Bayesian, client-side) | DEFERRED | HIGH | Build after TestFlight calibration confirms 10 best images |
| 16 | Quiz image bank quality matters more than the algorithm | ACTION REQUIRED | CRITICAL | Invest time in sourcing high-discrimination room scene images |
| 17 | Conversational recommendation refinement | DEFERRED | MEDIUM | v1.5 first post-launch feature; ~$0.01–0.024/10-turn conversation |
| 18 | Room photo analysis with Claude Vision | DEFERRED | LOW | v2 flagship; ~$0.007/photo on Sonnet |
| 19 | Category-pair-specific compatibility logic | ACTION REQUIRED | CRITICAL | Different prompt templates per category pair |
| 20 | Prompt caching on system prompt and catalogue context | ACTION REQUIRED | HIGH | Reduces per-call cost by up to 90%; implement in Sprint 3 |
| 21 | Thumbs-up/thumbs-down on every recommended product | ACTION REQUIRED | HIGH | Style Shuffle equivalent; feeds back into taste profile |
| 22 | Build GDPR consent architecture: granular opt-in, post-reveal timing | ACTION REQUIRED | HIGH | Two unbundled toggles; placed after first recommendations |
| 23 | Two growth channels only: quiz viral loop + one distribution partnership | VALIDATED | HIGH | Focus: shareable card mechanic + one mortgage broker pilot |
| 24 | One TikTok per week using AI-generated room imagery | ACTION REQUIRED | HIGH | Template-based posting; 1–2 hours/week |
| 25 | Dunelm AI app (Feb 2026) threatens attention capture, not direct competition | WATCH | HIGH | Cross-retailer positioning is structural defence |
| 26 | Pinterest AI shopping evolution is the most urgent competitive threat | WATCH | HIGH | Accelerate to market; archetype identity = emotional differentiator |
| 27 | Brand partnerships viable at 10,000–15,000 profiled users | DEFERRED | MEDIUM | Plan schema now; don't sell until threshold reached |
| 28 | 15h/week constraint is existential risk — define phase-transition trigger | OPEN QUESTION | CRITICAL | Define user count / revenue milestone for going full-time |
| 29 | Collaborative filtering useless until significant interaction data | VALIDATED | HIGH | Don't build CF; rely on content-based + LLM through v1 and v1.5 |
| 30 | Houzz's quiz-commerce disconnect is exactly what Cornr must never do | VALIDATED | CRITICAL | Every quiz result feeds directly into recommendation engine |
| 31 | Minimum catalogue: 130 products to guarantee coverage | ACTION REQUIRED | CRITICAL | 7 archetypes × 6 room types × 3 budget tiers = 126 cells need ≥1 product |
| 32 | Randomize catalogue JSON order on every recommendation call | ACTION REQUIRED | CRITICAL | Eliminates LLM position bias |
| 33 | L2-normalize archetype score vector before LLM injection | ACTION REQUIRED | CRITICAL | Prevents high-range dimensions dominating |
| 34 | 10 new products added, 10 retired per month post-launch | ACTION REQUIRED | HIGH | Without rotation, users see same 3 recs in 2–3 sessions |

## AI-native opportunity assessment

**What "AI-native" actually means for Cornr:**
- Data schema, UX flows, and backend designed around inference — not AI bolted onto existing patterns
- The quiz generates taste embeddings; interactions train the preference model; every session improves future sessions
- The app gets smarter with every user

**Conversational recommendation refinement (v1.5):**
- "I like the sofa but need something smaller" → Claude responds with 2 alternatives
- Cost: ~$0.01–0.024 per 10-turn conversation on Haiku 4.5
- Latency: sub-200ms per turn
- Most differentiated capability vs every current competitor
- Ship as first post-launch feature, not at launch

**Room photo analysis (v2):**
- User photographs their actual room
- Claude Sonnet analyses: style signals, spatial constraints, existing furniture, colour palette
- Recommendations contextualised to what user already owns
- Cost: ~$0.007/photo on Sonnet
- Transforms Cornr from quiz app to AI home advisor

## Competitive window

| Competitor | Threat level | Timeframe | Cornr's defence |
|---|---|---|---|
| Pinterest AI Shopping | High | Now | Archetype identity emotional resonance; quiz-first vs browse-first |
| Dunelm AI app | Medium-high | Now | Cross-retailer positioning; Dunelm is product-siloed |
| Wayfair Muse | Medium | 6–12 months | UK presence limited; catalogue-locked |
| Palazzo (US) | Low | 12+ months | US-only; limited traction; validates the model |
| Future plc / SheerLuxe | Low | 12–24 months | No consumer recommendation product built |

Window assessment: **18–24 months for the full integrated loop; 6–9 months for style discovery alone.** Speed to TestFlight is the strategy.

## Sprint implications

See master decision table above. Priority sequence for sprints:
1. Sprint 3 (recommendation engine) — incorporate all CRITICAL items above
2. Bridge Sprint pre-work — batch tag catalogue, source quiz images, write compatibility prompts
3. Sprint 4 — two-step anchor-complement, thumbs feedback loop, conversational refinement begins
4. v1.5 (post-launch) — conversational refinement ships
5. v2 — room photo analysis, persistent home advisor, data partnership pipeline
