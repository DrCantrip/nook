# Synthetic persona fixture coverage

Paragraph per fixture explaining the edge it tests and what a failure would
imply. Read before adding, editing, or removing fixtures. Authored 18 April
2026 as part of SP-1 Part A.

## Primary anchors (7)

### primary-curator-high
Tests the clean Curator signal with no ambiguity. Validates that a score
vector with clear argmax resolves to the expected primary archetype with
high confidence. If this fixture fails, the scorer has a fundamental bug or
the Haiku rationale prompt is producing generic output that doesn't reflect
Curator-specific signals (walnut, brass, warm grain, honest joinery).

### primary-nester-high
Tests the clean Nester signal. Validates soft-daylight Coastal vocabulary
(cotton, rattan, softness, lived-in ease) surfaces in rationale. A failure
here suggests either the archetype lexicon isn't being grounded into the
prompt or Haiku is reaching for generic "warm" language instead of the
specific Nester register.

### primary-maker-high
Tests the clean Maker signal. Validates workshop-register vocabulary
(blackened steel, reclaimed timber, weight and substance) and ensures
Haiku doesn't reach for "delicate" or "refined" — the Maker prohibited
vocabulary. Maker is the most easily confused with Urbanist; this fixture
sets the ceiling for Maker clarity.

### primary-minimalist-high
Tests the clean Minimalist signal. Validates natural-restraint vocabulary
(raw wood, stillness, breathing room) and that Haiku doesn't confuse
Minimalist (tactile-natural restraint) with Urbanist (architectural-hard
restraint). Budget tier is aspirational here — Minimalist tolerates higher
per-piece spend because fewer total pieces.

### primary-romantic-high
Tests the clean Romantic signal. Validates patina-and-atmosphere vocabulary
(faded linen, patina, atmosphere). A failure suggests Haiku is avoiding
"aged" / "worn" language out of misplaced positivity bias — Romantic
rationale MUST celebrate age, not hide it.

### primary-storyteller-high
Tests the clean Storyteller signal. Validates cross-provenance vocabulary
(velvet, mixed metals, accumulated meaning). A failure suggests Haiku is
collapsing Storyteller into Maker (both value authenticity) or Romantic
(both value non-new) instead of grounding in the accumulated-across-places
distinction.

### primary-urbanist-high
Tests the clean Urbanist signal. Validates architectural vocabulary
(concrete, architectural clarity, composed silhouettes) and resists soft
language (cosy, rustic). Budget tier is aspirational — Urbanist is
architecturally invested.

## High-risk blends (3)

### blend-curator-minimalist
Tests the hardest blend in the taxonomy. Both archetypes value restraint,
provenance-variance aside. Validates that rationale mentions BOTH walnut
(Curator material) AND raw wood (Minimalist material), not just one.
Failure here = blend collapse (Haiku picks one and ignores the other).

### blend-nester-romantic
Tests the soft-warm blend. Both emotional registers are warm — ease
(Nester) vs atmosphere (Romantic). Validates rationale surfaces cotton AND
faded linen, not a generic "warm textures" collapse.

### blend-maker-urbanist
Tests the hard-edge blend. Both are industrial in register, but differ on
seam-visible (Maker) vs seam-hidden (Urbanist). Validates rationale
mentions blackened steel AND concrete — not a generic "industrial" hand-
wave.

## Low-confidence flat (2)

### low-confidence-flat-1
Tests the flat-vector case: user swiped right on almost everything, no
strong signal. Primary (urbanist) resolves as weak argmax; confidence is
low. Validates that the scorer returns low confidence AND that Haiku
produces hedged, descriptive rationale rather than committing to a
signature that isn't there.

### low-confidence-flat-2
Second flat-vector variant with Romantic as weak argmax. Validates the
low-confidence path isn't archetype-specific — works for any weak argmax.

## Aspirational-room (2)

### aspirational-room-nester-office
Tests the archetype-room mismatch: strong Nester archetype signal but the
room chip is home-office (a context that usually reads Urbanist or Maker).
Validates that Haiku reconciles by applying Nester soft-welcome register
to desk/chair/storage category. Failure = Haiku pivots to Urbanist
register for the office context and loses the Nester signal.

### aspirational-room-maker-nursery
Tests the archetype-room mismatch: strong Maker signal + nursery context.
Validates Haiku softens the register without abandoning Maker (reclaimed
timber cot, visible joinery, unfussed function). Failure = Haiku abandons
Maker for generic nursery-pastel register.

## Pure-aspirational (2)

### pure-aspirational-curator
Tests pre-purchase Curator with no rooms. Validates that Haiku can still
recommend archetype-aligned pieces in a room-agnostic context — the
"keep-this-when-you-move" aspirational-anchor category. Failure = Haiku
refuses to produce recommendations without a room context.

### pure-aspirational-storyteller
Second pure-aspirational variant. Tests that the pre-purchase path works
across archetypes, not just Curator.

## Near-boundary (2)

### boundary-curator-minimalist
Tests the genuinely-unsure edge case: score vector puts Curator at 0.50,
Minimalist at 0.48. Confidence is low (gap = 0.02). Validates rationale
explicitly names the overlap rather than picking one and committing.

### boundary-nester-romantic
Second boundary case. Tests that the ambiguity-acknowledging path works
for the warm-register boundary as well as the restraint-register one.

## Budget-archetype-tension (2, Mercedes-shaped)

### budget-tension-curator-conservative
The Mercedes-shaped user: aspirational Curator taste, conservative budget.
Validates that Haiku recommends Curator-aligned products at sub-£100 price
points AND does not reach for high-spend tokens (investment piece, anchor
piece, heirloom). This is the single most commercially important fixture
— first-gen FTBs are the core v1 audience, and conservative-budget
Curator is the median user. Failure here = v1 launch risk.

### budget-tension-romantic-conservative
Second budget-tension variant: aspirational Romantic taste, conservative
budget. Validates that Haiku avoids antique / provincial / auction-find
vocabulary that suggests high-priced vintage. High Street Finds tier must
be reachable without compromising the Romantic signal.

## Coverage gaps (intentional)

- **All 21 archetype-pair blends**: covered programmatically via
  `generateBlendFixture`, not hand-authored. Hand-authored blends focus on
  the 3 highest-risk pairs; generator covers the rest for scorer-level
  internal consistency only.
- **Decorator ring (8M users)**: not represented. v1 targets the 370K FTB
  core. Add decorator fixtures when v2 brand partnerships require it
  (~5-7 fixtures for decorator-not-buyer profiles).
- **Period × archetype interaction** (e.g., Coastal in 1930s semi):
  deferred. v1 doesn't expose `property_period` to the recommendation
  prompt; v2 Digital Home work changes this.
- **Adversarial fixtures**: in `synthetic-personas.adversarial.ts`, not
  here. See that file for failure-mode coverage (Barnum, leaks,
  hallucinations, injection, system-leak).
