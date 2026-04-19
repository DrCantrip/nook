import type { ArchetypeId } from './archetypes';
import {
  ARCHETYPE_IDS,
  SYNTHETIC_PERSONAS,
  generateBlendFixture,
  type SyntheticPersona,
} from './synthetic-personas';

const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const EPSILON = 0.001;

const deriveExpected = (persona: SyntheticPersona) => {
  const entries = Object.entries(persona.score_vector) as [ArchetypeId, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const [topKey, topValue] = sorted[0];
  const [secondKey, secondValue] = sorted[1];
  const secondary = secondValue > 0.3 ? secondKey : null;
  const gap = topValue - secondValue;
  const confidence: 'high' | 'medium' | 'low' =
    gap > 0.2 ? 'high' : gap > 0.1 ? 'medium' : 'low';
  return { primary: topKey, secondary, confidence };
};

const l1Normalise = (v: Record<ArchetypeId, number>) => {
  const sum = Object.values(v).reduce((a, b) => a + b, 0);
  if (sum === 0) return { ...v };
  const out: Record<ArchetypeId, number> = { ...v };
  for (const k of Object.keys(out) as ArchetypeId[]) out[k] = out[k] / sum;
  return out;
};

describe('synthetic personas — schema sanity', () => {
  it('every fixture has all required fields', () => {
    for (const p of SYNTHETIC_PERSONAS) {
      expect(p.id).toBeTruthy();
      expect(p.label).toBeTruthy();
      expect(typeof p.version).toBe('number');
      expect(Array.isArray(p.archetype_version_compatible)).toBe(true);
      expect(p.primary_archetype).toBeTruthy();
      expect(p.confidence_tier).toBeTruthy();
      expect(p.score_vector).toBeTruthy();
      expect(Array.isArray(p.room_interest_chips)).toBe(true);
      expect(p.journey_stage).toBeTruthy();
      expect(typeof p.is_aspirational).toBe('boolean');
      expect(p.budget_tier).toBeTruthy();
      expect(typeof p.behavioural_notes).toBe('string');
      expect(p.expected_scorer_output).toBeTruthy();
      expect(p.expected_haiku_behaviour).toBeTruthy();
      expect(typeof p.expected_haiku_behaviour.must_respect_budget).toBe('boolean');
    }
  });

  it('every fixture id is unique', () => {
    const ids = SYNTHETIC_PERSONAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every fixture id is kebab-case', () => {
    for (const p of SYNTHETIC_PERSONAS) {
      expect(p.id).toMatch(KEBAB_CASE);
    }
  });

  it('fixture counts match the spec', () => {
    expect(SYNTHETIC_PERSONAS.length).toBe(20);
    const primaries = SYNTHETIC_PERSONAS.filter((p) => p.id.startsWith('primary-'));
    const blends = SYNTHETIC_PERSONAS.filter((p) => p.id.startsWith('blend-'));
    const lowConf = SYNTHETIC_PERSONAS.filter((p) => p.id.startsWith('low-confidence-'));
    const aspRoom = SYNTHETIC_PERSONAS.filter((p) => p.id.startsWith('aspirational-room-'));
    const pureAsp = SYNTHETIC_PERSONAS.filter((p) => p.id.startsWith('pure-aspirational-'));
    const boundary = SYNTHETIC_PERSONAS.filter((p) => p.id.startsWith('boundary-'));
    const budget = SYNTHETIC_PERSONAS.filter((p) => p.id.startsWith('budget-tension-'));
    expect(primaries.length).toBe(7);
    expect(blends.length).toBe(3);
    expect(lowConf.length).toBe(2);
    expect(aspRoom.length).toBe(2);
    expect(pureAsp.length).toBe(2);
    expect(boundary.length).toBe(2);
    expect(budget.length).toBe(2);
  });
});

describe('synthetic personas — score_vector completeness', () => {
  it('every fixture score_vector contains exactly the canonical archetype IDs', () => {
    const expected = [...ARCHETYPE_IDS].sort();
    for (const p of SYNTHETIC_PERSONAS) {
      const keys = Object.keys(p.score_vector).sort();
      expect(keys).toEqual(expected);
    }
  });
});

describe('synthetic personas — L1 normalisation', () => {
  it('every fixture score_vector, after L1 normalisation, sums to 1', () => {
    for (const p of SYNTHETIC_PERSONAS) {
      const normalised = l1Normalise(p.score_vector);
      const sum = Object.values(normalised).reduce((a, b) => a + b, 0);
      expect(Math.abs(sum - 1)).toBeLessThan(EPSILON);
    }
  });
});

describe('synthetic personas — internal consistency', () => {
  it('derived (primary, secondary, confidence) matches expected_scorer_output', () => {
    for (const p of SYNTHETIC_PERSONAS) {
      const derived = deriveExpected(p);
      expect(derived).toEqual(p.expected_scorer_output);
    }
  });
});

describe('synthetic personas — programmatic blend coverage', () => {
  it('generateBlendFixture covers all 42 ordered pairs and derives correctly', () => {
    let count = 0;
    for (const a of ARCHETYPE_IDS) {
      for (const b of ARCHETYPE_IDS) {
        if (a === b) continue;
        const p = generateBlendFixture(a, b);
        const derived = deriveExpected(p);
        expect(derived).toEqual(p.expected_scorer_output);
        count++;
      }
    }
    expect(count).toBe(42); // 7 × 6 ordered pairs
  });

  it('throws on identical archetypes', () => {
    expect(() => generateBlendFixture('curator', 'curator')).toThrow();
  });
});
