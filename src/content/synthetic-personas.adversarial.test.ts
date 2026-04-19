import { ADVERSARIAL_PERSONAS } from './synthetic-personas.adversarial';

const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

describe('adversarial personas — schema sanity', () => {
  it('every fixture has a failure_mode', () => {
    for (const p of ADVERSARIAL_PERSONAS) {
      expect(p.failure_mode).toBeTruthy();
    }
  });

  it('every fixture id is unique and kebab-case', () => {
    const ids = ADVERSARIAL_PERSONAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(KEBAB_CASE);
  });

  it('one fixture per failure_mode (8 total for Tier 1)', () => {
    const modes = ADVERSARIAL_PERSONAS.map((p) => p.failure_mode);
    expect(new Set(modes).size).toBe(modes.length);
    expect(modes.length).toBe(8);
  });
});

describe('adversarial personas — catalogue_override integrity', () => {
  it('every catalogue override entry has id, title, description', () => {
    for (const p of ADVERSARIAL_PERSONAS) {
      if (!p.catalogue_override) continue;
      for (const entry of p.catalogue_override) {
        expect(entry.id).toBeTruthy();
        expect(entry.title).toBeTruthy();
        expect(entry.description).toBeTruthy();
      }
    }
  });

  it('hallucination fixtures carry the relevant catalogue field', () => {
    const material = ADVERSARIAL_PERSONAS.find(
      (p) => p.failure_mode === 'hallucination_material',
    );
    expect(material?.catalogue_override?.[0]?.material).toBeTruthy();

    const construction = ADVERSARIAL_PERSONAS.find(
      (p) => p.failure_mode === 'hallucination_construction',
    );
    expect(construction?.catalogue_override?.[0]?.construction).toBeTruthy();

    const provenance = ADVERSARIAL_PERSONAS.find(
      (p) => p.failure_mode === 'hallucination_provenance',
    );
    expect(provenance?.catalogue_override?.[0]?.provenance).toBeTruthy();
  });
});
