// Short deterministic hash for analytics tagging.
//
// REVEAL-1B spec called for SHA-256 first 8 hex chars, but expo-crypto is not
// in the dependency tree and this is a non-cryptographic analytics use case
// (cohort-tagging a behavioural-truth string to detect drift, not protecting
// a secret). djb2 with 32-bit output rendered as 8 hex chars satisfies the
// functional need (deterministic, uniform-ish distribution, fits in the
// shared_truth_hash field) without adding a native module dependency.
//
// If future analytics needs require cryptographic strength (e.g. privacy-
// preserving identifiers), swap to expo-crypto's SHA-256 then.
//
// Usage:
//   const hash = truthHash(archetype.description.behaviouralTruth);
//   recordEvent(user, 'reveal_shared', { shared_truth_hash: hash, ... });

export function truthHash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  // Coerce to unsigned 32-bit, render as 8-char hex (zero-padded).
  return (h >>> 0).toString(16).padStart(8, '0');
}
