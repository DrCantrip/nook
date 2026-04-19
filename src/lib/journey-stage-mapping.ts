/**
 * journey_stage mapping — fixture simplification ↔ canonical enum.
 *
 * SP-1 Part A fixtures use a 3-value journey_stage simplification
 * (pre-purchase | new_mover | renovator) because the Haiku rationale
 * prompt treats time-since-completion splits as one mode. The canonical
 * schema (Supabase users.journey_stage) defines 5 values.
 *
 * When SP-1B wires the promptfoo harness to the real recommend-products
 * prompt, use these mappers to translate between fixture and canonical
 * shapes. No fixture rewrite needed.
 *
 * When the canonical schema type is extracted to a dedicated types
 * module (e.g. src/types/canonical-schema.ts), replace the inline
 * CanonicalJourneyStageValue union below with an import from that
 * module.
 */

// Fixture-facing simplification (3 values) — used by synthetic-personas*.ts.
export type FixtureJourneyStage = 'pre-purchase' | 'new_mover' | 'renovator';

// Canonical schema — matches docs/CORNR_CANONICAL.md Section 2.
// Mirrors Supabase users.journey_stage. Replace this inline union with
// an import when the canonical schema type is extracted.
export type CanonicalJourneyStageValue =
  | 'pre_purchase'
  | 'new_0_3'
  | 'settled_3_12'
  | 'established'
  | 'renting';

/**
 * Fixture → canonical. Used by SP-1B when feeding fixture journey_stage
 * values into a harness that exercises the real prompt.
 */
export function mapFixtureJourneyStageToCanonical(
  fixtureStage: FixtureJourneyStage,
): CanonicalJourneyStageValue {
  switch (fixtureStage) {
    case 'pre-purchase':
      return 'pre_purchase';
    case 'new_mover':
      return 'new_0_3';
    case 'renovator':
      return 'settled_3_12';
    default: {
      const _exhaustive: never = fixtureStage;
      throw new Error(`Unhandled fixture journey stage: ${String(_exhaustive)}`);
    }
  }
}

/**
 * Canonical → fixture. Useful when Part B wants to validate that a real
 * user's canonical journey_stage is "close enough" to a fixture's
 * behavioural shape for synthetic comparison.
 *
 * Returns null for 'renting' — no renter fixture exists in Tier 1. When
 * SP-1B expands fixture coverage for renters (per TAM note in canonical
 * Section 0, 18 Apr entry), extend this map.
 *
 * Both 'settled_3_12' and 'established' map to 'renovator' — round-trip
 * from 'established' therefore returns 'settled_3_12', not 'established'.
 */
export function mapCanonicalJourneyStageToFixture(
  canonicalStage: CanonicalJourneyStageValue,
): FixtureJourneyStage | null {
  switch (canonicalStage) {
    case 'pre_purchase':
      return 'pre-purchase';
    case 'new_0_3':
      return 'new_mover';
    case 'settled_3_12':
    case 'established':
      return 'renovator';
    case 'renting':
      return null;
    default: {
      const _exhaustive: never = canonicalStage;
      throw new Error(`Unhandled canonical journey stage: ${String(_exhaustive)}`);
    }
  }
}
