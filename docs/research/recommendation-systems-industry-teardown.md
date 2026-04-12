# Recommendation systems — industry teardown
**Research session:** 12 April 2026 — Session 2
**Status:** Decisions locked. Do not re-research.

## Purpose
Teardown of 20+ recommendation systems across fashion, music, food, home, dating, and retail — to extract what works, what fails, and what Cornr should and should not do.

## Key findings by system

| System | Key lesson for Cornr |
|---|---|
| **Stitch Fix** | Style Space (continuous embedding) beats discrete labels — but at 120-product catalogue, passing all 7 archetype scores IS the embedding. Style Shuffle (10B binary interactions) was the primary quality driver. Human stylists outperformed pure algorithms on contextual errors — when removed, quality degraded catastrophically. |
| **Thread (UK, M&S acquired)** | Achieved 1:10,000 stylist-to-client ratio with AI doing inventory search, humans applying taste judgment. M&S acquired for personalisation tech alone (expects £100M incremental revenue). Proves tech has standalone acquisition value even when standalone business fails. |
| **Spotify Discover Weekly** | Constraint (30 songs, all novel, weekly) created ritual and avoided choice paralysis. Engagement ≠ satisfaction. Optimising for CTR diverges from optimising for satisfaction. BaRT (contextual bandits) balances exploration vs exploitation. |
| **Pinterest Complete the Look** | Interior design requires diffuse attention across whole room, NOT fashion's single-subject focus. Category-pair-specific compatibility logic needed — what makes sofa-rug compatible differs from sofa-lamp compatible. Bootstraps from visual signals alone. |
| **Houzz** | Quiz disconnected from commerce = anti-pattern. Quiz results don't feed personalisation engine. Massive inspiration content + visual search creates engagement but fails to close loop to coordinated purchasing. Cornr's exact opportunity. |
| **Modsy** | Burned $72.7M trying to replace designers with cheaper designers + technology. Don't do this. Stay lightweight. LLM-based inference at ~$0.003/recommendation is the right cost structure. |
| **Wayfair ViCs** | Visual Complements Model uses triplet-loss Siamese networks + expert-curated 3D scene graphs. August 2025 LLM pipeline: Gemini 2.5 Pro with multimodal inputs, category-pair-specific prompts with embedded design principles → 11% accuracy improvement. This approach is directly portable to Cornr. |
| **Netflix** | Aggressive curation (40-80 recommendations from millions) outperforms choice-maximising. "Because You Watched X" = reference-point framing that makes recommendations legible and trustworthy. Paradox of choice is real. |
| **Tinder/TinVec** | Swipe data creates useful taste embeddings via Word2Vec-style approach. Stated preferences diverge from revealed preferences over time — algorithm should eventually weight revealed over stated. |
| **Hinge "We Met"** | Post-outcome feedback (did you meet? was it good?) is highest-value training signal. Cornr needs equivalent — purchase satisfaction signal via Awin postback + follow-up question. |
| **OKCupid** | Labels change behaviour ("95% match" → 2x conversations, regardless of actual fit). Use confidence framing carefully. Stated vs revealed preference gap is persistent — quiz archetypes will diverge from actual browsing patterns. |
| **Pandora Music Genome** | 450 expert-coded attributes per track = Music Genome. Powerful for cold-start; misses cultural/social dimension. Cornr's product metadata is its Music Genome — expert-coded attributes at manageable scale. |

## Cross-system principles

1. **The canonical architecture for taste-domain recommendation:** content-based filtering (item attributes) + constraint-based filtering (hard limits) + LLM rationale generation. Collaborative filtering only becomes useful at significant scale.

2. **Small catalogue changes the recommendation problem in Cornr's favour:** 120 products = all pairwise compatibility can be precomputed. Expert curation feasible. Collaborative filtering won't work (interaction matrix too sparse). Recommendation task is ordering and framing, not discovery.

3. **Don't build what Houzz built.** Quiz disconnected from commerce = Cornr's worst failure mode. Every quiz result must feed directly into the recommendation engine.

4. **Don't do what Stitch Fix did in Freestyle.** Removing curation constraint (3 curated products → open browse) destroys differentiation. Never add a browse/search feature in v1 or v2.

5. **Don't do what Modsy did.** Human designers at any scale = broken unit economics. LLM inference is the only viable cost structure.

## Decisions made as a result

1. **Single LLM call with full catalogue as JSON context is adequate for TestFlight** — provided temperature=0, structured JSON outputs, and full 7-dimension score vector passed. Not just the label.
2. **Two-step anchor-then-complement is Sprint 4**, not Sprint 3. Anchor selected first; complement derived from anchor's specific visual properties.
3. **Category-pair-specific compatibility prompts are CRITICAL.** Different prompts for sofa-rug vs sofa-lamp vs table-chair. Embed relevant design principles per pair.
4. **Batch-tag entire catalogue with Claude Vision or Gemini before Sprint 3 build.** Cost: ~$5–15 for 120 products. Enables visual-aware recommendations without changing architecture.
5. **Style-referential rationale text, never algorithm-referential.** "Complements your Warm Scandi palette — oak and linen in soft neutrals." Never "Based on your inputs."
6. **Calibration study during TestFlight to identify 10 most discriminative quiz images.** Show 20–30 cards to beta users; lock the 10 that best discriminate between archetypes.
7. **Build Hinge "We Met" equivalent from launch.** Awin postback captures purchase. Follow-up prompt "Did you love it?" captures satisfaction. These are the highest-value training signals.

## Sprint implications

- **Sprint 3 T1a:** Pass full catalogue as JSON context. Full 7-dimension score vector as prompt input. L2-normalize scores before injection. Randomize catalogue JSON order on every call (eliminates LLM position bias).
- **Sprint 3 T1b:** Style-referential rationale only. "Chosen because..." references visible product quality, never trend names, never property_period.
- **Sprint 3 T1a pre-work:** Run batch tagging pipeline (Gemini 2.5 Pro or Claude Sonnet) on all 120 products. Write category-pair-specific compatibility scoring prompts. Create 5–10 curated reference room sets per archetype as few-shot examples.
- **Sprint 4:** Two-step anchor-then-complement pattern. Compatibility graph queried for complement/stretch selection.

## Open questions

- Does Cornr need 80-120 products at launch, or can it launch with fewer and expand? (Working assumption: 130 minimum to guarantee coverage across all 126 archetype × room × budget cells)
- How quickly can the founder iterate on prompt quality when early recommendations feel off? (Plan: weekly manual audit of 20–30 recommendation outputs in first month post-launch)
