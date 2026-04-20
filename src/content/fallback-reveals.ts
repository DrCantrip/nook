// Fallback reveal descriptions for quiz outcomes where a single archetype
// cannot be assigned with confidence. Three buckets: all-yes (every card
// swiped right), all-no (every card swiped left), flat-middle (score vector
// too flat to nominate a top archetype).
//
// Structure mirrors archetype descriptions (essence + observation + CTA)
// but omits sensory anchor and motif tooltip — fallbacks have no archetype
// to anchor to. Voice register matches archetypes-v3 (6d3e127): present-
// tense observation, behavioural truth, no aspirational verbs, no quiz-
// system self-reference in essence or observation.
//
// R-24 note: fallbacks do not carry userLexicon or qualityLexicon. Haiku
// recommendation rationale for fallback users grounds in the observation
// text directly. Sprint 3 T1B concern.

export type FallbackId = 'all-yes' | 'all-no' | 'flat-middle';

export interface FallbackDescription {
  id: FallbackId;
  essence: string;
  observation: string;
  ctaPrompt: string;
}

export const allYesFallback: FallbackDescription = {
  id: 'all-yes',
  essence: "Your taste is open: you see something to love almost everywhere.",
  observation: "Most people lean one way. You lean in a few directions at once. Your eye is still reading the room, still collecting before it narrows. Your home won't look like one style. It'll look like you put it together.",
  ctaPrompt: "See rooms other open-taste buyers loved.",
};

export const allNoFallback: FallbackDescription = {
  id: 'all-no',
  essence: "Your taste isn't in this set. That's its own kind of signal.",
  observation: "Sixteen rooms didn't find you. That usually means one of two things: the rooms you're looking for sit at the edges of the common styles, or your eye is calibrated for something more specific than a taste quiz can surface in a first pass. Either way, the next set is worth a look.",
  ctaPrompt: "Run it again with a different set.",
};

export const flatMiddleFallback: FallbackDescription = {
  id: 'flat-middle',
  essence: "You read across several territories at once: your taste doesn't sit in one camp.",
  observation: "Single-result quizzes suit readers who lean hard one way. You came in differently. You have range. Your home won't look like one magazine spread. It'll look like you pulled the best pieces from a few and made them agree. Some of the best rooms come from exactly that.",
  ctaPrompt: "Rooms that pull from more than one style.",
};

export const FALLBACK_DESCRIPTIONS: Record<FallbackId, FallbackDescription> = {
  'all-yes': allYesFallback,
  'all-no': allNoFallback,
  'flat-middle': flatMiddleFallback,
};
