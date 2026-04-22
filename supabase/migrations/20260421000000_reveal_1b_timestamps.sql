-- REVEAL-1B: two-experience reveal state (timestamps, not booleans)
-- Reference: docs/CORNR_CANONICAL.md Section 0 (20 April evening entry,
-- two-experience architecture), Section 7 (Sprint 2 T4 revised), REVEAL-1B spec
-- locked via 19-voice end-to-end panel on 21 April 2026.

ALTER TABLE users
ADD COLUMN IF NOT EXISTS reveal_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS depth_first_seen_at TIMESTAMPTZ;

COMMENT ON COLUMN users.reveal_completed_at IS 'Timestamp of first successful completion of the two-experience reveal (screen 1 mount). NULL until set. Set once; not updated on return visits. Cascades with user row on account deletion.';
COMMENT ON COLUMN users.depth_first_seen_at IS 'Timestamp of first open of archetype depth view from Profile tab. NULL until set. Set once; used for re-encounter analytics (seconds_since_first_visit in reveal_depth_visited event).';

-- Cohort version on completion records for legacy-vs-new-reveal analytics.
-- Version 1 = legacy 4-panel tap-through reveal (pre-REVEAL-1B).
-- Version 2 = two-experience reveal (this build).
-- Staging has zero archetype_history rows today, so DEFAULT 2 is correct here.
-- Production migration must backfill existing rows to version 1 before this
-- DEFAULT applies. See LR-PROD-SYNC follow-up.
ALTER TABLE archetype_history
ADD COLUMN IF NOT EXISTS reveal_version INTEGER NOT NULL DEFAULT 2;

COMMENT ON COLUMN archetype_history.reveal_version IS 'Reveal surface version active when this archetype was assigned. 1 = legacy 4-panel, 2 = two-experience (REVEAL-1B). Enables A/B comparison of reveal surfaces against retention, share rate, depth-view rate.';
