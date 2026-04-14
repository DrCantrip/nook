-- S2-T3B: full 7-dim L2-normalised archetype score vector + rewrite-loop version logging
-- Reference: CORNR_CANONICAL.md Section 6 (schema), Section 13 (archetype description rewrite loop)

-- 13 April 2026: full 7-dim L2-normalised archetype score vector for blended-identity reveal generation
ALTER TABLE archetype_history ADD COLUMN IF NOT EXISTS archetype_scores JSONB NOT NULL DEFAULT '{}'::jsonb;
COMMENT ON COLUMN archetype_history.archetype_scores IS 'L2-normalised 7-dim score vector keyed by archetypeId. Sums to ~1.0. Consumed by S2-T4-INSIGHT Edge Function for blended reveal composition. Format: {"curator": 0.42, "nester": 0.08, ...}';

-- 13 April 2026: archetype version logging for description rewrite loop (canonical Section 13)
ALTER TABLE engagement_events ADD COLUMN IF NOT EXISTS archetype_version INTEGER;
COMMENT ON COLUMN engagement_events.archetype_version IS 'Logs which archetype description version was active when this event fired. Enables A/B comparison of archetype description rewrites against baseline metrics per canonical Section 13 rewrite loop standing rule.';
CREATE INDEX IF NOT EXISTS engagement_events_archetype_version ON engagement_events(archetype_version, event_type, occurred_at DESC) WHERE archetype_version IS NOT NULL;
