// Haiku prompt builders for Cornr Edge Functions.
// Precedent set by generate-share-insight (S2-T4-INSIGHT) on 13 Apr 2026.
// When S3-T1A recommend-products ships, its rationale prompt builder goes here too.
//
// R-24 lexicon isolation enforced via stripMaterialLexicon() before any
// archetype payload reaches Haiku in reveal prompts.
// R-26 em-dash and register hygiene enforced in prompt string contents.
// R-16 cache precedent: role paragraph + RULES block form the static
// cacheable prefix; ARCHETYPE CONTENT and USER DATA are the variable tail.

import type { ArchetypeContent } from './archetypes.ts';

// The caller (generate-share-insight/index.ts) strips rewriteNotes before
// passing archetype payloads here. Mirror that in the type so strip logic
// stays type-safe without mutating the caller.
type ArchetypePayload = Omit<ArchetypeContent, 'rewriteNotes'>;

type RevealSafeStyleCard = Omit<ArchetypeContent['styleCard'], 'materialLexicon'>;
type RevealSafePayload = Omit<ArchetypePayload, 'styleCard'> & {
  styleCard: RevealSafeStyleCard;
};

// Strip materialLexicon (engine-face per R-24) from archetype payloads
// before they reach Haiku in reveal prompts. Defensive: even though rule (5)
// in the prompt tells Haiku not to draw from materialLexicon, stripping at
// the serialisation site means the phrases never reach the model at all.
// Belt and braces.
function stripMaterialLexicon(
  archetypes: Record<string, ArchetypePayload>,
): Record<string, RevealSafePayload> {
  const result: Record<string, RevealSafePayload> = {};
  for (const [id, a] of Object.entries(archetypes)) {
    const { materialLexicon: _ml, ...styleCardSafe } = a.styleCard;
    result[id] = { ...a, styleCard: styleCardSafe };
  }
  return result;
}

export function buildBlendPrompt(params: {
  scoreVector: Record<string, number>;
  primaryId: string;
  secondaryIds: string[];
  tertiaryIds: string[];
  archetypesContent: Record<string, ArchetypePayload>;
  propertyPeriod: string | null;
}): string {
  const revealSafeArchetypes = stripMaterialLexicon(params.archetypesContent);

  // Everything above and including the RULES block inside the template below
  // is the cacheable prefix. Per R-16, the caller should mark this region
  // with cache_control: {type: "ephemeral"}. Do NOT add per-call variable
  // tokens above the ARCHETYPE CONTENT marker inside the template.

  // TODO(CONTENT-04): extract the banned-vocabulary list (rule 10 below) to
  // a shared BANNED_VOCAB constant consumed by voice-gate script, errors.ts,
  // legal.ts, and this file. Centralises R-26 updates.

  return `You are generating a personalised home-style reveal for a Cornr user who has just completed the 16-card swipe quiz. The reveal shows on the Archetype Result screen alongside their primary archetype identity. It must feel like Cornr sees this specific user. Not a generic category description.

RULES:
(1) CASE DETECTION (internal): PURE = primary >= 0.55 AND no secondary >= 0.15 (skip to step 5). BLENDED = primary 0.40-0.54 AND exactly one secondary >= 0.20 (use steps 2-7). TRIPLE = primary < 0.40 OR two+ secondaries >= 0.20 (use steps 2-7 with three archetypes). If two scores tie within 0.01, break alphabetically by archetypeId.

(2) NAME PRIMARY CONFIDENTLY. Open with "You are The [Primary]." No hedging ever, even in blended and triple cases.

(3) WEAVE SECONDARIES AS STREAKS NOT LABELS. Acceptable: "with a strong [Secondary] streak", "carrying an unexpected pull toward [quality from secondary]", "alongside an instinct to [behavioural verb from secondary]". FORBIDDEN: "equally [A] and [B]", "part [A] part [B]", "a mix of [A] and [B]".

(4) ADJACENCY CHECK. If secondary is in primary's adjacencyMap (nearest-neighbour), blend freely. If NOT, use BRIDGING LANGUAGE: "an unexpected pull toward...", "a quieter undertone of...", "and yet you also...".

(5) LEXICON ISOLATION (R-24). When drawing archetype vocabulary for reveal text, use only: description.userLexicon, description.sensoryAnchor, description.observationParagraph, description.behaviouralTruth, and styleCard.qualityLexicon. NEVER use materialLexicon phrases in reveal output. Material phrases are engine-side retrieval only.

(6) EXTRACT AT LEAST TWO CONCRETE PHRASES directly from involved archetypes' observationParagraph and sensoryAnchor. Do NOT invent new sensory details. Do NOT paraphrase. Extract verbatim where possible.

(7) CLOSE WITH PRIMARY BEHAVIOURAL TRUTH verbatim from primary.description.behaviouralTruth, even in triple cases. Primary gets closing emphasis always.

(8) TRIPLE CASE: name primary, name ONE dominant secondary, reference third only as "with quieter notes of [tertiary qualityLexicon term]". Do not weave three full identities.

(9) WORD COUNT 60-100 strict. If over on first generation, regenerate once with stricter compression. If still over, OMIT secondary clause and produce primary-only reveal.

(10) VOICE: second person throughout, no hedging, no banned vocabulary (curated, bespoke, journey, unlock, stunning, AI-powered, discover, elevate, reimagine, transform, algorithm, optimise, leverage, synergy, "curated by AI", "the move", "a contrast move", "the honest-contrast move", vibe, iconic, honestly).

(11) PROPERTY PERIOD NEVER IN OUTPUT. Provided for context only; rendered separately on the reveal screen.

ARCHETYPE CONTENT for involved archetypes:
${JSON.stringify(revealSafeArchetypes, null, 2)}

USER DATA:
Score vector: ${JSON.stringify(params.scoreVector)}
Primary archetype: ${params.primaryId}
Secondary archetypes (score >= 0.15): ${JSON.stringify(params.secondaryIds)}
Tertiary archetypes (score 0.10-0.15): ${JSON.stringify(params.tertiaryIds)}
Property period (context only; NEVER name in output. Rendered separately on the reveal screen): ${params.propertyPeriod ?? "null"}

OUTPUT FORMAT: return ONLY the reveal text, no JSON no markdown no explanation. On failure return literal "BLEND_GENERATION_FAILED".`;
}
