-- Bridge Sprint: data architecture foundation
-- Reference: CORNR_CANONICAL.md Sections 4, 6

-- 1. Consent split: audience data opt-in
ALTER TABLE users ADD COLUMN IF NOT EXISTS audience_data_opt_in BOOLEAN DEFAULT false;

-- 2. Editorial content table
CREATE TABLE IF NOT EXISTS editorial_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  body_text TEXT,
  image_url TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  archetype_filter VARCHAR(50),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);
ALTER TABLE editorial_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editorial_content_read" ON editorial_content
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND published_at <= now()
    AND (expires_at IS NULL OR expires_at > now())
  );

-- 3. Archetype history (longitudinal)
CREATE TABLE IF NOT EXISTS archetype_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  primary_archetype VARCHAR(50) NOT NULL,
  secondary_archetype VARCHAR(50),
  swipe_scores JSONB NOT NULL,
  source VARCHAR(20) NOT NULL CHECK (source IN ('initial','retake','admin')),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE archetype_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "archetype_history_select_own" ON archetype_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "archetype_history_insert_own" ON archetype_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Engagement events (first-party event log)
CREATE TABLE IF NOT EXISTS engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '18 months'),
  model_version VARCHAR(50)
);
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "engagement_events_select_own" ON engagement_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "engagement_events_insert_own_or_anon" ON engagement_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE INDEX IF NOT EXISTS engagement_events_user_occurred
  ON engagement_events(user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS engagement_events_type_occurred
  ON engagement_events(event_type, occurred_at DESC);

-- 5. Room context fields
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS is_aspirational BOOLEAN DEFAULT false;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS occupancy_status VARCHAR(20);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS room_stage VARCHAR(20);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS existing_categories TEXT[];
ALTER TABLE rooms ALTER COLUMN display_name DROP NOT NULL;
ALTER TABLE rooms ALTER COLUMN room_analysis DROP NOT NULL;

-- 6. Wishlist soft-delete + active partial index
ALTER TABLE wishlisted_products ADD COLUMN IF NOT EXISTS removed_at TIMESTAMPTZ;
ALTER TABLE wishlisted_products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
CREATE INDEX IF NOT EXISTS wishlisted_products_active
  ON wishlisted_products(user_id, room_id)
  WHERE removed_at IS NULL;

-- 7. pg_cron retention job (engagement events past 18 months)
SELECT cron.schedule(
  'purge-engagement-events',
  '0 2 * * *',
  $$DELETE FROM engagement_events WHERE retention_until < NOW();$$
);

-- 8. Update existing anonymous-session purge to also clear anon engagement events
-- (folds anon engagement event cleanup into the existing hourly anon purge)
SELECT cron.unschedule('purge-anonymous-sessions');
SELECT cron.schedule(
  'purge-anonymous-sessions',
  '0 * * * *',
  $$
  DELETE FROM style_profiles WHERE is_anonymous = true AND created_at < NOW() - INTERVAL '24 hours';
  DELETE FROM engagement_events WHERE user_id IS NULL AND occurred_at < NOW() - INTERVAL '24 hours';
  $$
);
