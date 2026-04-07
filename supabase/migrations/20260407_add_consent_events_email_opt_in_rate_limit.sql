-- Migration: add_consent_events_email_opt_in_rate_limit
-- Applied: 2026-04-07 via Supabase MCP
-- Branch: feature/april-update-a-schema

-- 1. Email marketing opt-in column
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_marketing_opt_in BOOLEAN DEFAULT false;

-- 2. Consent events table for GDPR demonstrable consent
CREATE TABLE IF NOT EXISTS consent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  consent_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consent_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own consent events"
  ON consent_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert consent events"
  ON consent_events FOR INSERT
  WITH CHECK (true);

-- 3. Rate limit: 50 calls/day for registered users
ALTER TABLE users ALTER COLUMN daily_call_count SET DEFAULT 0;
COMMENT ON COLUMN users.daily_call_count IS 'Rate limit: 50 calls/day for registered users. Reset by pg_cron at midnight UTC.';
