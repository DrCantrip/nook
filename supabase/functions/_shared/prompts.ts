// Haiku prompt builders for Cornr Edge Functions.
// Precedent set by generate-share-insight (S2-T4-INSIGHT) on 13 Apr 2026.
// When S3-T1A recommend-products ships, its rationale prompt builder goes here too.

export function buildBlendPrompt(params: {
  scoreVector: Record<string, number>;
  primaryId: string;
  secondaryIds: string[];
  tertiaryIds: string[];
  archetypesContent: unknown;
  propertyPeriod: string | null;
}): string {
  return `You are generating a personalised home-style reveal for a Cornr user who has just completed the 16-card swipe quiz. The reveal shows on the Archetype Result screen alongside their primary archetype identity. It must feel like Cornr sees this specific user — not a generic category description.

USER DATA:
Score vector: ${JSON.stringify(params.scoreVector)}
Primary archetype: ${params.primaryId}
Secondary archetypes (score >= 0.15): ${JSON.stringify(params.secondaryIds)}
Tertiary archetypes (score 0.10-0.15): ${JSON.stringify(params.tertiaryIds)}
Property period (context only, NEVER name in output — rendered separately): ${params.propertyPeriod ?? "null"}

ARCHETYPE CONTENT for involved archetypes:
${JSON.stringify(params.archetypesContent, null, 2)}

RULES:
(1) CASE DETECTION (internal): PURE = primary >= 0.55 AND no secondary >= 0.15 (skip to step 5). BLENDED = primary 0.40-0.54 AND exactly one secondary >= 0.20 (use steps 2-6). TRIPLE = primary < 0.40 OR two+ secondaries >= 0.20 (use steps 2-6 with three archetypes). If two scores tie within 0.01, break alphabetically by archetypeId.

(2) NAME PRIMARY CONFIDENTLY. Open with "You are The [Primary]." No hedging ever, even in blended and triple cases.

(3) WEAVE SECONDARIES AS STREAKS NOT LABELS. Acceptable: "with a strong [Secondary] streak", "carrying an unexpected pull toward [quality from secondary]", "alongside an instinct to [behavioural verb from secondary]". FORBIDDEN: "equally [A] and [B]", "part [A] part [B]", "a mix of [A] and [B]".

(4) ADJACENCY CHECK. If secondary is in primary's adjacencyMap (nearest-neighbour), blend freely. If NOT, use BRIDGING LANGUAGE: "an unexpected pull toward...", "a quieter undertone of...", "and yet you also...".

(5) EXTRACT AT LEAST TWO CONCRETE PHRASES directly from involved archetypes' observationParagraph and sensoryAnchor. Do NOT invent new sensory details. Do NOT paraphrase — extract verbatim where possible.

(6) CLOSE WITH PRIMARY BEHAVIOURAL TRUTH verbatim from primary.description.behaviouralTruth, even in triple cases. Primary gets closing emphasis always.

(7) TRIPLE CASE: name primary, name ONE dominant secondary, reference third only as "with quieter notes of [tertiary qualityLexicon term]". Do not weave three full identities.

(8) WORD COUNT 60-100 strict. If over on first generation, regenerate once with stricter compression. If still over, OMIT secondary clause and produce primary-only reveal.

(9) VOICE: second person throughout, no hedging, no banned vocabulary (curated, bespoke, journey, unlock, stunning, AI-powered, discover, elevate, reimagine, transform, algorithm, optimise, leverage, synergy).

(10) PROPERTY PERIOD NEVER IN OUTPUT. Provided for context only, rendered separately on the reveal screen.

OUTPUT FORMAT: return ONLY the reveal text, no JSON no markdown no explanation. On failure return literal "BLEND_GENERATION_FAILED".`;
}
