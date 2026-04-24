-- Adds three columns to public.users that the useProfile hook (REVEAL-1B) requires.
-- The hook was written against a schema that didn't yet include these columns.
-- This migration corrects the inconsistency.
--
-- journey_stage: 5-value enum mirroring src/lib/journey-stage-mapping.ts canonical values.
-- home_status: 3-value enum from src/hooks/useProfile.ts.
-- created_at: provisioning timestamp, backfilled from auth.users.created_at.
--
-- Indexes: partial indexes on the two enum columns enable cohort segmentation
-- analytics (journey_stage funnels, home_status by archetype) without overhead
-- on rows where the column is NULL.
--
-- Production migration (LR-PROD-SYNC) will need staged 3-step pattern for created_at:
--   1. ADD COLUMN created_at TIMESTAMPTZ NULL (nullable)
--   2. UPDATE public.users SET created_at = auth.users.created_at FROM auth.users WHERE public.users.id = auth.users.id
--   3. ALTER COLUMN created_at SET NOT NULL DEFAULT now()
-- Staging is safe to do all three in one migration because zero existing real users.
--
-- ROLLBACK: ALTER TABLE public.users DROP COLUMN IF EXISTS journey_stage,
--                                    DROP COLUMN IF EXISTS home_status,
--                                    DROP COLUMN IF EXISTS created_at;
--          DROP INDEX IF EXISTS idx_users_journey_stage;
--          DROP INDEX IF EXISTS idx_users_home_status;
--
-- Note: auth.users join requires service_role (RLS prevents authenticated role
-- from reading auth schema). Backfill is therefore migration-time only, not
-- runtime application logic.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS journey_stage VARCHAR
    CHECK (journey_stage IS NULL OR journey_stage IN ('pre_purchase', 'new_0_3', 'settled_3_12', 'established', 'renting')),
  ADD COLUMN IF NOT EXISTS home_status VARCHAR
    CHECK (home_status IS NULL OR home_status IN ('first_time', 'experienced', 'renter')),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ;

-- Backfill created_at from auth.users.created_at for any existing rows.
UPDATE public.users
SET created_at = auth.users.created_at
FROM auth.users
WHERE public.users.id = auth.users.id
  AND public.users.created_at IS NULL;

-- Now safe to set NOT NULL + default.
ALTER TABLE public.users
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now();

-- Partial indexes for analytics segmentation.
CREATE INDEX IF NOT EXISTS idx_users_journey_stage ON public.users(journey_stage) WHERE journey_stage IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_home_status ON public.users(home_status) WHERE home_status IS NOT NULL;

COMMENT ON COLUMN public.users.journey_stage IS 'Where the user is in the buying / settling journey. 5-value enum mirroring src/lib/journey-stage-mapping.ts canonical values. NULL until user populates via onboarding (ONBOARDING-01 follow-up).';
COMMENT ON COLUMN public.users.home_status IS 'Buyer category. 3-value enum from src/hooks/useProfile.ts. NULL until user populates via onboarding. Note: ''renter'' value present pending positioning clarification.';
COMMENT ON COLUMN public.users.created_at IS 'User row creation timestamp. Backfilled from auth.users.created_at on staging. Production: must follow 3-step nullable->backfill->NOT NULL pattern.';
