// Voice gate validation for user-facing AI output.
// Used by generate-share-insight and (future) recommend-products rationale gate.
// Banned word list from CLAUDE.md / BDS v3 Section 2.3.
// Precedent set by generate-share-insight (S2-T4-INSIGHT) on 13 Apr 2026.

const BANNED_WORDS = [
  "curated", "bespoke", "journey", "unlock", "stunning",
  "AI-powered", "discover", "elevate", "reimagine", "transform",
  "algorithm", "optimise", "leverage", "synergy",
];

export function validateInsight(
  insight: string,
  involvedArchetypes: { description: { observationParagraph: string; sensoryAnchor: string } }[]
): { valid: boolean; reason?: string } {
  if (insight === "BLEND_GENERATION_FAILED") {
    return { valid: false, reason: "Haiku returned failure sentinel" };
  }

  const words = insight.trim().split(/\s+/).filter(Boolean);
  if (words.length < 60 || words.length > 100) {
    return { valid: false, reason: `Word count ${words.length}, must be 60-100` };
  }

  const lowerInsight = insight.toLowerCase();
  for (const banned of BANNED_WORDS) {
    const regex = new RegExp(`\\b${banned.toLowerCase()}\\b`);
    if (regex.test(lowerInsight)) {
      return { valid: false, reason: `Banned word: ${banned}` };
    }
  }

  // Extracted phrase check: at least 6 consecutive words from one of the
  // involved archetypes' observationParagraph or sensoryAnchor must appear.
  const sourceTexts = involvedArchetypes.flatMap((a) => [
    a.description.observationParagraph,
    a.description.sensoryAnchor,
  ]);

  const normalise = (s: string) => s.toLowerCase().replace(/\s+/g, " ");
  const normalisedInsight = normalise(insight);

  const hasExtractedPhrase = sourceTexts.some((source) => {
    const sourceWords = normalise(source).split(" ");
    for (let i = 0; i <= sourceWords.length - 6; i++) {
      const phrase = sourceWords.slice(i, i + 6).join(" ");
      if (normalisedInsight.includes(phrase)) return true;
    }
    return false;
  });

  if (!hasExtractedPhrase) {
    return { valid: false, reason: "No 6-word phrase extracted from archetype content" };
  }

  return { valid: true };
}
