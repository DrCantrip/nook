-- D-prime (10 April 2026): room interest from Welcome chip row
ALTER TABLE users ADD COLUMN IF NOT EXISTS room_interest VARCHAR(20);

-- D-prime: product scope for multi-room vs room-specific commerce layer
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_scope VARCHAR(20)
  DEFAULT 'room_specific'
  CHECK (product_scope IN ('multi_room', 'room_specific'));

-- Note: room_engagement JSONB key on style_profiles.swipe_scores
-- is added at the application layer within the existing JSONB column.
-- No schema migration required — the key is written by the SwipeDeck
-- component when recording per-room engagement signal during the quiz.
