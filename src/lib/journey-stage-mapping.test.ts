import {
  mapFixtureJourneyStageToCanonical,
  mapCanonicalJourneyStageToFixture,
  type FixtureJourneyStage,
  type CanonicalJourneyStageValue,
} from './journey-stage-mapping';

const FIXTURE_VALUES: FixtureJourneyStage[] = [
  'pre-purchase',
  'new_mover',
  'renovator',
];

const CANONICAL_VALUES: CanonicalJourneyStageValue[] = [
  'pre_purchase',
  'new_0_3',
  'settled_3_12',
  'established',
  'renting',
];

describe('journey-stage mapping — forward (fixture → canonical)', () => {
  it('maps all 3 fixture values to a canonical value', () => {
    for (const v of FIXTURE_VALUES) {
      const result = mapFixtureJourneyStageToCanonical(v);
      expect(result).toBeTruthy();
    }
  });

  it('pre-purchase → pre_purchase', () => {
    expect(mapFixtureJourneyStageToCanonical('pre-purchase')).toBe('pre_purchase');
  });

  it('new_mover → new_0_3', () => {
    expect(mapFixtureJourneyStageToCanonical('new_mover')).toBe('new_0_3');
  });

  it('renovator → settled_3_12', () => {
    expect(mapFixtureJourneyStageToCanonical('renovator')).toBe('settled_3_12');
  });
});

describe('journey-stage mapping — reverse (canonical → fixture)', () => {
  it('handles all 5 canonical values without throwing', () => {
    for (const v of CANONICAL_VALUES) {
      expect(() => mapCanonicalJourneyStageToFixture(v)).not.toThrow();
    }
  });

  it('pre_purchase → pre-purchase', () => {
    expect(mapCanonicalJourneyStageToFixture('pre_purchase')).toBe('pre-purchase');
  });

  it('new_0_3 → new_mover', () => {
    expect(mapCanonicalJourneyStageToFixture('new_0_3')).toBe('new_mover');
  });

  it('both settled_3_12 and established → renovator', () => {
    expect(mapCanonicalJourneyStageToFixture('settled_3_12')).toBe('renovator');
    expect(mapCanonicalJourneyStageToFixture('established')).toBe('renovator');
  });

  it('renting → null (documented behaviour, not error)', () => {
    expect(mapCanonicalJourneyStageToFixture('renting')).toBeNull();
  });
});

describe('journey-stage mapping — round-trip stability', () => {
  it('fixture → canonical → fixture is stable for all 3 fixture values', () => {
    for (const v of FIXTURE_VALUES) {
      const canonical = mapFixtureJourneyStageToCanonical(v);
      const back = mapCanonicalJourneyStageToFixture(canonical);
      expect(back).toBe(v);
    }
  });

  it("round-trip from 'established' lands on 'settled_3_12', not back on 'established' (documented lossiness)", () => {
    const fixture = mapCanonicalJourneyStageToFixture('established');
    expect(fixture).toBe('renovator');
    const roundTripped = mapFixtureJourneyStageToCanonical(fixture!);
    expect(roundTripped).toBe('settled_3_12');
    expect(roundTripped).not.toBe('established');
  });
});
