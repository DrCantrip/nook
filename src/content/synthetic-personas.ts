/**
 * Synthetic persona fixtures for Cornr archetype scoring + Haiku recommendation
 * evaluation.
 *
 * Purpose
 * ───────
 * Interface specification for Sprint 3 T1A's recommend-products Edge Function,
 * AND test data for deterministic surfaces (scorer, catalogue sanitiser, eval
 * harness in SP-1B). Fixtures are authored against current ArchetypeId union
 * (7 archetypes, locked 13 Apr) and the materials/qualities lexicons in
 * archetypes.ts.
 *
 * Normalisation
 * ─────────────
 * score_vector values are PRE-normalisation — raw 0-1 per archetype. The
 * scorer's responsibility is to normalise (L1 in v1; preserves probability-
 * mass semantics). Tests assert normalisation yields sum ≈ 1.
 *
 * Expected-output derivation (mirrored in tests)
 * ──────────────────────────────────────────────
 *   primary      = argmax(score_vector)
 *   secondary    = second-argmax if > 0.3 else null
 *   confidence   = 'high'   if (top1 - top2) > 0.20
 *                  'medium' if (top1 - top2) > 0.10
 *                  'low'    otherwise
 *
 * Extend carefully: fixtures are interface-spec, not test data. Adding a new
 * fixture without bumping `version` risks silent drift when S3-T1A lands.
 *
 * Source: 18 April 2026 synthetic persona research + three LARGE panels.
 */

import type { ArchetypeId } from './archetypes';

type RoomChip = string;

export type SyntheticPersona = {
  id: string;
  label: string;
  version: number;
  archetype_version_compatible: number[];
  primary_archetype: ArchetypeId;
  secondary_archetype: ArchetypeId | null;
  confidence_tier: 'high' | 'medium' | 'low';
  score_vector: Record<ArchetypeId, number>;
  room_interest_chips: RoomChip[];
  journey_stage: 'pre-purchase' | 'new_mover' | 'renovator';
  is_aspirational: boolean;
  budget_tier: 'conservative' | 'moderate' | 'aspirational';
  behavioural_notes: string;
  expected_scorer_output: {
    primary: ArchetypeId;
    secondary: ArchetypeId | null;
    confidence: 'high' | 'medium' | 'low';
  };
  expected_haiku_behaviour: {
    must_mention?: string[];
    must_not_mention?: string[];
    must_respect_budget: boolean;
  };
};

// ─── score_vector constructors ────────────────────────────────────────────

export const ARCHETYPE_IDS: ArchetypeId[] = [
  'curator',
  'nester',
  'maker',
  'minimalist',
  'romantic',
  'storyteller',
  'urbanist',
];

const baseNoise = (): Record<ArchetypeId, number> => ({
  curator: 0.05,
  nester: 0.06,
  maker: 0.04,
  minimalist: 0.03,
  romantic: 0.05,
  storyteller: 0.02,
  urbanist: 0.04,
});

const primaryAnchorVector = (primary: ArchetypeId): Record<ArchetypeId, number> => {
  const v = baseNoise();
  v[primary] = 0.90;
  return v;
};

const blendVector = (a: ArchetypeId, b: ArchetypeId): Record<ArchetypeId, number> => {
  const v = baseNoise();
  v[a] = 0.55;
  v[b] = 0.40;
  return v;
};

const boundaryVector = (a: ArchetypeId, b: ArchetypeId): Record<ArchetypeId, number> => {
  const v: Record<ArchetypeId, number> = {
    curator: 0.08,
    nester: 0.10,
    maker: 0.08,
    minimalist: 0.07,
    romantic: 0.09,
    storyteller: 0.07,
    urbanist: 0.09,
  };
  v[a] = 0.50;
  v[b] = 0.48;
  return v;
};

// ─── banned-words (from CLAUDE.md voice gate) ─────────────────────────────

export const BANNED_RATIONALE_WORDS = [
  'curated',
  'bespoke',
  'journey',
  'unlock',
  'stunning',
  'AI-powered',
  'elevate',
  'reimagine',
  'transform',
  'algorithm',
  'optimise',
  'leverage',
  'synergy',
  'curated by AI',
];

// High-spend tokens that should not appear for conservative-budget personas.
const HIGH_SPEND_TOKENS = [
  'investment piece',
  'anchor piece',
  'heirloom',
  'worth the splurge',
  'elevated craftsmanship',
  'auction find',
  'estate piece',
];

// ─── fixtures ─────────────────────────────────────────────────────────────

export const SYNTHETIC_PERSONAS: SyntheticPersona[] = [
  // ─── 7 primary anchors ──────────────────────────────────────────────────
  {
    id: 'primary-curator-high',
    label: 'Curator anchor — high confidence',
    version: 1,
    archetype_version_compatible: [2],
    primary_archetype: 'curator',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('curator'),
    room_interest_chips: ['living_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes:
      'Unambiguous Curator signal: paused on walnut side tables, brass lamps, leather seating. Rejected anything painted, anything frilled. Treats each object as a considered decision.',
    expected_scorer_output: {
      primary: 'curator',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['walnut', 'brass', 'warm grain'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'cosy', 'boho'],
      must_respect_budget: true,
    },
  },
  {
    id: 'primary-nester-high',
    label: 'Nester anchor — high confidence',
    version: 1,
    archetype_version_compatible: [2],
    primary_archetype: 'nester',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('nester'),
    room_interest_chips: ['living_room', 'bedroom'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes:
      'Unambiguous Nester signal: cotton throws, rattan chairs, pale wood, layered cushions. Rejected anything hard-edged or architectural.',
    expected_scorer_output: {
      primary: 'nester',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['cotton', 'rattan', 'lived-in ease'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'austere', 'architectural'],
      must_respect_budget: true,
    },
  },
  {
    id: 'primary-maker-high',
    label: 'Maker anchor — high confidence',
    version: 1,
    archetype_version_compatible: [1],
    primary_archetype: 'maker',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('maker'),
    room_interest_chips: ['home_office', 'living_room'],
    journey_stage: 'renovator',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes:
      'Unambiguous Maker signal: blackened steel, reclaimed timber, exposed brick, visible welds. Values weight, substance, honest making.',
    expected_scorer_output: {
      primary: 'maker',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['blackened steel', 'reclaimed timber', 'weight and substance'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'delicate', 'pastel'],
      must_respect_budget: true,
    },
  },
  {
    id: 'primary-minimalist-high',
    label: 'Minimalist anchor — high confidence',
    version: 1,
    archetype_version_compatible: [1],
    primary_archetype: 'minimalist',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('minimalist'),
    room_interest_chips: ['bedroom', 'living_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'aspirational',
    behavioural_notes:
      'Unambiguous Minimalist signal: raw wood, paper, matte ceramic, stone. Rejects ornament. Protects empty space as deliberately as filled.',
    expected_scorer_output: {
      primary: 'minimalist',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['raw wood', 'stillness', 'breathing room'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'layered', 'eclectic'],
      must_respect_budget: true,
    },
  },
  {
    id: 'primary-romantic-high',
    label: 'Romantic anchor — high confidence',
    version: 1,
    archetype_version_compatible: [1],
    primary_archetype: 'romantic',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('romantic'),
    room_interest_chips: ['bedroom', 'dining_room'],
    journey_stage: 'renovator',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes:
      'Unambiguous Romantic signal: faded linen, aged brass, softened florals, candlelight finishes. Keeps the imperfection on purpose.',
    expected_scorer_output: {
      primary: 'romantic',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['faded linen', 'patina', 'atmosphere'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'architectural', 'engineered'],
      must_respect_budget: true,
    },
  },
  {
    id: 'primary-storyteller-high',
    label: 'Storyteller anchor — high confidence',
    version: 1,
    archetype_version_compatible: [2],
    primary_archetype: 'storyteller',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('storyteller'),
    room_interest_chips: ['living_room', 'dining_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes:
      'Unambiguous Storyteller signal: velvet, patterned tile, mixed metals, inherited pieces. Values the object brought back from somewhere.',
    expected_scorer_output: {
      primary: 'storyteller',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['velvet', 'mixed metals', 'accumulated meaning'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'matching', 'spare'],
      must_respect_budget: true,
    },
  },
  {
    id: 'primary-urbanist-high',
    label: 'Urbanist anchor — high confidence',
    version: 1,
    archetype_version_compatible: [2],
    primary_archetype: 'urbanist',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('urbanist'),
    room_interest_chips: ['living_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'aspirational',
    behavioural_notes:
      'Unambiguous Urbanist signal: concrete, glass, blackened metal, engineered stone. Composes by silhouette. Refuses soft ornament.',
    expected_scorer_output: {
      primary: 'urbanist',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['concrete', 'architectural clarity', 'composed silhouettes'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'cosy', 'rustic'],
      must_respect_budget: true,
    },
  },

  // ─── 3 high-risk blends ────────────────────────────────────────────────
  {
    id: 'blend-curator-minimalist',
    label: 'Curator × Minimalist — mid confidence',
    version: 1,
    archetype_version_compatible: [1, 2],
    primary_archetype: 'curator',
    secondary_archetype: 'minimalist',
    confidence_tier: 'medium',
    score_vector: blendVector('curator', 'minimalist'),
    room_interest_chips: ['living_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'aspirational',
    behavioural_notes:
      'Shared restraint signal but from different directions: walnut AND raw wood, brass AND matte ceramic. Hardest blend to disambiguate — both value fewer/better.',
    expected_scorer_output: {
      primary: 'curator',
      secondary: 'minimalist',
      confidence: 'medium',
    },
    expected_haiku_behaviour: {
      must_mention: ['walnut', 'raw wood', 'considered restraint'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'cosy', 'eclectic'],
      must_respect_budget: true,
    },
  },
  {
    id: 'blend-nester-romantic',
    label: 'Nester × Romantic — mid confidence',
    version: 1,
    archetype_version_compatible: [1, 2],
    primary_archetype: 'nester',
    secondary_archetype: 'romantic',
    confidence_tier: 'medium',
    score_vector: blendVector('nester', 'romantic'),
    room_interest_chips: ['bedroom', 'living_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes:
      'Soft-warm blend: cotton AND faded linen, rattan AND carved wood. Both emotional registers (ease vs atmosphere) can read as "warm" if not disambiguated.',
    expected_scorer_output: {
      primary: 'nester',
      secondary: 'romantic',
      confidence: 'medium',
    },
    expected_haiku_behaviour: {
      must_mention: ['cotton', 'faded linen', 'softness'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'architectural', 'engineered'],
      must_respect_budget: true,
    },
  },
  {
    id: 'blend-maker-urbanist',
    label: 'Maker × Urbanist — mid confidence',
    version: 1,
    archetype_version_compatible: [1, 2],
    primary_archetype: 'maker',
    secondary_archetype: 'urbanist',
    confidence_tier: 'medium',
    score_vector: blendVector('maker', 'urbanist'),
    room_interest_chips: ['home_office'],
    journey_stage: 'renovator',
    is_aspirational: false,
    budget_tier: 'aspirational',
    behavioural_notes:
      'Hard-edge blend: blackened steel AND concrete, visible welds AND sharp edges. Risk: Haiku could describe either as "industrial" and miss the seam-visible vs seam-hidden distinction.',
    expected_scorer_output: {
      primary: 'maker',
      secondary: 'urbanist',
      confidence: 'medium',
    },
    expected_haiku_behaviour: {
      must_mention: ['blackened steel', 'concrete', 'composed silhouettes'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'pastel', 'delicate'],
      must_respect_budget: true,
    },
  },

  // ─── 2 low-confidence flat ─────────────────────────────────────────────
  {
    id: 'low-confidence-flat-1',
    label: 'Flat scores — urbanist weak argmax',
    version: 1,
    archetype_version_compatible: [1, 2],
    primary_archetype: 'urbanist',
    secondary_archetype: 'maker',
    confidence_tier: 'low',
    score_vector: {
      curator: 0.38,
      nester: 0.40,
      maker: 0.42,
      minimalist: 0.39,
      romantic: 0.41,
      storyteller: 0.37,
      urbanist: 0.43,
    },
    room_interest_chips: ['living_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes:
      'User swiped right on almost everything. No strong signal. Urbanist and Maker barely separable. Haiku should be descriptive and hedged, not committed to a signature.',
    expected_scorer_output: {
      primary: 'urbanist',
      secondary: 'maker',
      confidence: 'low',
    },
    expected_haiku_behaviour: {
      must_not_mention: [...BANNED_RATIONALE_WORDS],
      must_respect_budget: true,
    },
  },
  {
    id: 'low-confidence-flat-2',
    label: 'Flat scores — romantic weak argmax',
    version: 1,
    archetype_version_compatible: [1, 2],
    primary_archetype: 'romantic',
    secondary_archetype: 'curator',
    confidence_tier: 'low',
    score_vector: {
      curator: 0.41,
      nester: 0.39,
      maker: 0.35,
      minimalist: 0.37,
      romantic: 0.42,
      storyteller: 0.40,
      urbanist: 0.38,
    },
    room_interest_chips: ['bedroom'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes:
      'Low decisiveness, slight lean warm. Prompt should note the ambiguity and recommend more versatile pieces.',
    expected_scorer_output: {
      primary: 'romantic',
      secondary: 'curator',
      confidence: 'low',
    },
    expected_haiku_behaviour: {
      must_not_mention: [...BANNED_RATIONALE_WORDS],
      must_respect_budget: true,
    },
  },

  // ─── 2 aspirational-room (strong primary, room pulls away) ──────────────
  {
    id: 'aspirational-room-nester-office',
    label: 'Nester primary + home-office chip pulls away',
    version: 1,
    archetype_version_compatible: [2],
    primary_archetype: 'nester',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('nester'),
    room_interest_chips: ['home_office'],
    journey_stage: 'pre-purchase',
    is_aspirational: true,
    budget_tier: 'moderate',
    behavioural_notes:
      'Strong Nester archetype signal but the room chip is home-office — a context that usually reads Urbanist or Maker. Haiku must reconcile: soft-welcome Nester language applied to desk/chair/storage category.',
    expected_scorer_output: {
      primary: 'nester',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['cotton', 'softness', 'lived-in ease'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'architectural', 'engineered'],
      must_respect_budget: true,
    },
  },
  {
    id: 'aspirational-room-maker-nursery',
    label: 'Maker primary + nursery chip pulls away',
    version: 1,
    archetype_version_compatible: [1],
    primary_archetype: 'maker',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('maker'),
    room_interest_chips: ['nursery'],
    journey_stage: 'pre-purchase',
    is_aspirational: true,
    budget_tier: 'moderate',
    behavioural_notes:
      'Strong Maker signal but nursery context rejects exposed brick and blackened steel as primary materials. Haiku must soften the register without abandoning Maker: reclaimed timber cot, visible joinery, unfussed function — not workshop-industrial.',
    expected_scorer_output: {
      primary: 'maker',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['reclaimed timber', 'honest making'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'delicate', 'pastel'],
      must_respect_budget: true,
    },
  },

  // ─── 2 pure-aspirational (pre-purchase, no rooms) ──────────────────────
  {
    id: 'pure-aspirational-curator',
    label: 'Pre-purchase Curator, no rooms',
    version: 1,
    archetype_version_compatible: [2],
    primary_archetype: 'curator',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('curator'),
    room_interest_chips: [],
    journey_stage: 'pre-purchase',
    is_aspirational: true,
    budget_tier: 'aspirational',
    behavioural_notes:
      'Still searching for the place. No rooms to apply taste to yet. Haiku should return Curator-aligned aspirational-anchor pieces — the "keep-this-when-you-move" items that pre-commit to the forthcoming home.',
    expected_scorer_output: {
      primary: 'curator',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['walnut', 'considered restraint', 'honest joinery'],
      must_not_mention: [...BANNED_RATIONALE_WORDS],
      must_respect_budget: true,
    },
  },
  {
    id: 'pure-aspirational-storyteller',
    label: 'Pre-purchase Storyteller, no rooms',
    version: 1,
    archetype_version_compatible: [2],
    primary_archetype: 'storyteller',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('storyteller'),
    room_interest_chips: [],
    journey_stage: 'pre-purchase',
    is_aspirational: true,
    budget_tier: 'moderate',
    behavioural_notes:
      'Pre-purchase Storyteller: no place yet, but accumulating the pieces that will follow them in. Haiku should recommend portable, room-agnostic items that can be placed in any future home.',
    expected_scorer_output: {
      primary: 'storyteller',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['velvet', 'accumulated meaning'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'matching'],
      must_respect_budget: true,
    },
  },

  // ─── 2 near-boundary (genuinely ambiguous) ─────────────────────────────
  {
    id: 'boundary-curator-minimalist',
    label: 'Boundary: Curator vs Minimalist (Δ = 0.02)',
    version: 1,
    archetype_version_compatible: [1, 2],
    primary_archetype: 'curator',
    secondary_archetype: 'minimalist',
    confidence_tier: 'low',
    score_vector: boundaryVector('curator', 'minimalist'),
    room_interest_chips: ['living_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'aspirational',
    behavioural_notes:
      'Real user, genuinely unsure. Paused on walnut chair AND on raw-wood bench. Confidence should read low — rationale should explicitly name the overlap rather than pick one and commit.',
    expected_scorer_output: {
      primary: 'curator',
      secondary: 'minimalist',
      confidence: 'low',
    },
    expected_haiku_behaviour: {
      must_mention: ['walnut', 'raw wood'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'cosy', 'eclectic'],
      must_respect_budget: true,
    },
  },
  {
    id: 'boundary-nester-romantic',
    label: 'Boundary: Nester vs Romantic (Δ = 0.02)',
    version: 1,
    archetype_version_compatible: [1, 2],
    primary_archetype: 'nester',
    secondary_archetype: 'romantic',
    confidence_tier: 'low',
    score_vector: boundaryVector('nester', 'romantic'),
    room_interest_chips: ['bedroom'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes:
      'Genuinely unsure between Coastal-ease and French-Country-patina. Cotton AND faded linen. Rattan AND carved wood. Haiku should hedge and surface pieces that work for either resolution.',
    expected_scorer_output: {
      primary: 'nester',
      secondary: 'romantic',
      confidence: 'low',
    },
    expected_haiku_behaviour: {
      must_mention: ['cotton', 'faded linen'],
      must_not_mention: [...BANNED_RATIONALE_WORDS, 'architectural'],
      must_respect_budget: true,
    },
  },

  // ─── 2 budget-archetype-tension (Mercedes-shaped) ──────────────────────
  {
    id: 'budget-tension-curator-conservative',
    label: 'Curator aspirational + conservative budget (Mercedes-shaped)',
    version: 1,
    archetype_version_compatible: [2],
    primary_archetype: 'curator',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('curator'),
    room_interest_chips: ['living_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'conservative',
    behavioural_notes:
      "Loves Mid-Century aesthetic but cannot justify the £400 walnut dresser. Will accept Curator-aligned products at <£100 price points; rejects 'aspirational anchor pieces' as out-of-reach. First-gen FTB reality: taste aspirational, budget disciplined.",
    expected_scorer_output: {
      primary: 'curator',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['warm grain', 'considered restraint'],
      must_not_mention: [
        ...BANNED_RATIONALE_WORDS,
        ...HIGH_SPEND_TOKENS,
      ],
      must_respect_budget: true,
    },
  },
  {
    id: 'budget-tension-romantic-conservative',
    label: 'Romantic aspirational + conservative budget',
    version: 1,
    archetype_version_compatible: [1],
    primary_archetype: 'romantic',
    secondary_archetype: null,
    confidence_tier: 'high',
    score_vector: primaryAnchorVector('romantic'),
    room_interest_chips: ['bedroom', 'living_room'],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'conservative',
    behavioural_notes:
      'First-gen FTB, aspirational Romantic aesthetic, hard budget reality. Wants French-Country feel but cannot afford antique provincial pieces. Accepts softened-florals textiles and aged-brass finishes at High Street Finds tier.',
    expected_scorer_output: {
      primary: 'romantic',
      secondary: null,
      confidence: 'high',
    },
    expected_haiku_behaviour: {
      must_mention: ['softened florals', 'patina'],
      must_not_mention: [
        ...BANNED_RATIONALE_WORDS,
        ...HIGH_SPEND_TOKENS,
        'antique',
        'provincial',
      ],
      must_respect_budget: true,
    },
  },
];

// ─── programmatic blend generator ─────────────────────────────────────────

/**
 * Produces a blend fixture for any (a, b) archetype pair programmatically.
 * Used by tests to cover all 21 ordered pairs without hand-authoring each.
 *
 * Note: generated fixtures are DERIVED, not hand-authored — their
 * `expected_haiku_behaviour` is deliberately minimal. Use the hand-authored
 * blend-* fixtures for behaviour assertions; use generated fixtures for
 * scorer-only coverage.
 */
export function generateBlendFixture(
  a: ArchetypeId,
  b: ArchetypeId,
): SyntheticPersona {
  if (a === b) throw new Error(`generateBlendFixture: a and b must differ (got ${a})`);
  return {
    id: `blend-generated-${a}-${b}`,
    label: `Generated blend: ${a} × ${b}`,
    version: 1,
    archetype_version_compatible: [1, 2],
    primary_archetype: a,
    secondary_archetype: b,
    confidence_tier: 'medium',
    score_vector: blendVector(a, b),
    room_interest_chips: [],
    journey_stage: 'new_mover',
    is_aspirational: false,
    budget_tier: 'moderate',
    behavioural_notes: `Programmatically generated blend for scorer coverage. Not for Haiku behaviour assertions.`,
    expected_scorer_output: {
      primary: a,
      secondary: b,
      confidence: 'medium',
    },
    expected_haiku_behaviour: {
      must_respect_budget: true,
    },
  };
}
