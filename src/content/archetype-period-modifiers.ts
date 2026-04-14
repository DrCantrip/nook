/**
 * Cornr archetype × period modifier sentences.
 *
 * Produced: 13 April 2026, S2-T4-PERIOD task.
 * Source: 13 April period-property research, compatibility matrix Section 2.
 *
 * Used by S2-T4 reveal screen, displayed below the archetype description as
 * a single sentence acknowledging the user's property era. property_period
 * comes from EPC data collected at signup (canonical Section 7).
 *
 * Compatibility ratings drive tone:
 *   Welcome   — celebrate the match, "perfect backdrop" energy
 *   Neutral   — acknowledge adaptably, no overclaim
 *   Tension   — reframe as styling advice, never tell user their taste is wrong
 *   Dissonant — lean into the lighter side of the archetype, only Romantic × Post-war
 *
 * If property_period is null (renting users with no EPC, or pre-purchase
 * users), the reveal screen omits this slot entirely — designed for graceful
 * absence.
 *
 * Voice gate: same banned-words list as Layer 2 descriptions.
 * Each sentence ~15-25 words.
 */

import type { ArchetypeId } from './archetypes';

export type PropertyPeriod =
  | 'georgian'      // pre-1837
  | 'victorian'     // 1837-1901
  | 'edwardian'     // 1901-1914
  | 'interwar'      // 1919-1944 (includes 1930s semi)
  | 'modern';       // 1945-present (post-war + new build, treated as one for v1)

export const PERIOD_MODIFIERS: Record<ArchetypeId, Record<PropertyPeriod, string>> = {
  // ─────────────────────────────────────────────────────────
  // CURATOR — clean lines and warm wood travel well
  // ─────────────────────────────────────────────────────────
  curator: {
    georgian:
      "Your Georgian home's high ceilings and proportioned rooms welcome considered Mid-Century pieces — restraint meeting restraint, two centuries apart.",
    victorian:
      "Your Victorian home is one of the most sought-after backdrops for Mid-Century — clean teak silhouettes against ornate plasterwork is the move.",
    edwardian:
      "Your Edwardian home's bay windows and picture rails were made for Mid-Century furniture — natural light, warm wood, breathing room between pieces.",
    interwar:
      "Your 1930s home is a near-perfect match for Mid-Century — these rooms were built for the proportions, the parquet, the warm-grain woods you're drawn to.",
    modern:
      "Mid-Century furniture was designed for rooms exactly like yours — compact, light, and built for living rather than performing.",
  },

  // ─────────────────────────────────────────────────────────
  // NESTER — soft and pale, needs light
  // ─────────────────────────────────────────────────────────
  nester: {
    georgian:
      "Your Georgian home's tall sash windows and pale proportions love the Coastal palette — soft, light-filled, never trying too hard.",
    victorian:
      "Your Victorian home can carry the Coastal style with a few adjustments — pale rugs over darker boards, soft layers against the deeper wood.",
    edwardian:
      "Your Edwardian home's lighter palette and bay windows take to Coastal naturally — woven texture, pale wood, the unfussed look you're after.",
    interwar:
      "Your 1930s home's open layouts and bay windows were made for Coastal — pale and soft, never stiff, lived-in by design.",
    modern:
      "Your home's clean lines work for Coastal as long as you lean into texture — woven, knitted, layered cotton — to keep it from feeling spare.",
  },

  // ─────────────────────────────────────────────────────────
  // MAKER — needs height, weight, raw materials
  // ─────────────────────────────────────────────────────────
  maker: {
    georgian:
      "Industrial style in a Georgian home is a contrast move — channel the workshop aesthetic through hardware and finishes rather than large-scale furniture.",
    victorian:
      "Your Victorian home is the natural backdrop for Industrial — exposed brick, dark boards, high ceilings that can carry weight without feeling crowded.",
    edwardian:
      "Your Edwardian home's solid bones can take Industrial pieces — leather, metal, reclaimed timber against the original woodwork.",
    interwar:
      "Industrial style loves volume — in your 1930s home, channel it through dark hardware, leather, and visible craft rather than large workshop furniture.",
    modern:
      "Industrial in a modern home is about materials more than scale — raw concrete, blackened metal, leather worn the right way over time.",
  },

  // ─────────────────────────────────────────────────────────
  // MINIMALIST — period-agnostic, needs light and breathing room
  // ─────────────────────────────────────────────────────────
  minimalist: {
    georgian:
      "Your Georgian home's symmetry and tall ceilings give Japandi the breathing room it needs — restraint becomes the architecture, not the furniture.",
    victorian:
      "Your Victorian home can carry Japandi if you let the original features speak — strip back the rest, let the cornicing become the decoration.",
    edwardian:
      "Your Edwardian home's bay windows and pale plaster are the natural backdrop for Japandi — soft light, original woodwork, almost nothing else.",
    interwar:
      "Your 1930s home's clean modernist lines were already heading toward Japandi — pale wood, low horizon, the discipline of less.",
    modern:
      "Your home is the most natural backdrop for Japandi — clean walls, simple proportions, surfaces that hold stillness without working at it.",
  },

  // ─────────────────────────────────────────────────────────
  // ROMANTIC — needs grandeur and patina; Post-war is dissonant
  // ─────────────────────────────────────────────────────────
  romantic: {
    georgian:
      "Your Georgian home is one of the most natural backdrops for French Country — proportions, plasterwork, and patina meeting their own century.",
    victorian:
      "Your Victorian home wears Romantic style well — layered textiles, faded wallpaper, candlelight against the original cornicing.",
    edwardian:
      "Your Edwardian home can carry Romantic style with a slightly lighter touch — softened florals, aged brass, the patina that doesn't perform.",
    interwar:
      "French Country flourishes in homes with grandeur — in your 1930s home, lean into the lighter side: softened linen, aged brass, patina without weight.",
    modern:
      "French Country grew up in older homes — in yours, lean into the lighter, simpler version: linen, soft florals, candlelight, never ornate.",
  },

  // ─────────────────────────────────────────────────────────
  // STORYTELLER — needs the bones, struggles in feature-poor stock
  // ─────────────────────────────────────────────────────────
  storyteller: {
    georgian:
      "Your Georgian home gives Eclectic Vintage strong bones to play against — picture rails, fireplaces, proportions that hold a mismatch by design.",
    victorian:
      "Your Victorian home is the natural backdrop for Eclectic Vintage — gallery walls on picture rails, layered rugs, the room as a collected story.",
    edwardian:
      "Your Edwardian home's original features give Eclectic Vintage somewhere to land — bay windows for displays, picture rails for art, fireplaces as anchors.",
    interwar:
      "Your 1930s home can take Eclectic Vintage with a few anchors — a strong fireplace, a feature wall, picture rails added if the room needs them.",
    modern:
      "Eclectic Vintage in a modern home needs you to bring the architecture — feature walls, salvaged details, deliberate anchor pieces to hang the story on.",
  },

  // ─────────────────────────────────────────────────────────
  // URBANIST — period-neutral, native to modern stock
  // ─────────────────────────────────────────────────────────
  urbanist: {
    georgian:
      "Urban Contemporary in a Georgian home is the honest-contrast move — clean architectural pieces against the period proportions, no apology needed.",
    victorian:
      "Urban Contemporary in a Victorian home is a confident contrast — keep the period features, let the modern furniture hold its own line against them.",
    edwardian:
      "Your Edwardian home can carry Urban Contemporary as deliberate contrast — period architecture, contemporary composition, neither competing with the other.",
    interwar:
      "Your 1930s home's modernist roots take Urban Contemporary naturally — clean lines on clean lines, the architecture quietly agreeing with the furniture.",
    modern:
      "Your home is the most natural backdrop for Urban Contemporary — composed silhouettes, clean edges, the architecture and the furniture speaking the same language.",
  },
};
