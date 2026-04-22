// Reveal content + layout versioning. Bump on significant content or layout
// changes so analytics can segment cohorts cleanly.
//
// Values:
//   'reveal-1b-v1' — initial two-experience ship, 21 April 2026.
//
// When to bump:
//   - New archetype content revision rolls through (e.g. v4 copy pass)
//   - Structural layout change on essence screen, share screen, or depth view
//   - New event payload fields that meaningfully change cohort definitions
//
// When NOT to bump:
//   - Typography token tweak
//   - Colour palette revision (tracked separately via archetype.accentColour)
//   - Bug fix that doesn't change content or structure

export const REVEAL_CONTENT_VERSION = 'reveal-1b-v1' as const;
