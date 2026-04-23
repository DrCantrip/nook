/**
 * Engagement event helper — first-party event log.
 *
 * Mirrors critical PostHog events into Cornr's own engagement_events table.
 * This is the data foundation for v2 Workstreams B (Advisor), C (Brand
 * Partnerships), and D (Taste Intelligence). PostHog stays the analytics
 * surface; this table is the data asset.
 *
 * Conventions:
 * - Fire-and-forget. Never await from caller. Never throw.
 * - On failure: log to Sentry, swallow the error. Never block UI.
 * - user is passed in explicitly (do NOT call useAuth here — hook rule).
 * - For events where archetype context matters (recommendations, product
 *   interactions, retakes), the caller MUST denormalise the archetype into
 *   eventData. Do not look it up on users table at write time — users.archetype
 *   changes on retake and breaks historical attribution.
 * - For AI-derived events, set model_version on the row (handled by helper if
 *   eventData includes a `_modelVersion` key).
 *
 * Usage:
 *   recordEvent(user, 'product_link_clicked', {
 *     product_id: '...',
 *     primary_archetype: currentArchetype,
 *     product_category: 'sofa',
 *   });
 *
 * TODO: wire recordEvent calls in Sprints 2 and 3 alongside posthog.capture for:
 *   archetype_assigned (Sprint 2 T3)
 *   room_created (Sprint 2 T6 — include all room context fields)
 *   product_card_shown / product_link_clicked / product_wishlisted (Sprint 3)
 *   retake_started (Sprint 2 T5)
 *   editorial_card_shown / editorial_card_clicked (Bridge Sprint T12)
 */

import { supabase } from '../lib/supabase';
import * as Sentry from '@sentry/react-native';
import type { User } from '@supabase/supabase-js';

type EventType =
  | 'signup_completed'
  | 'archetype_assigned'
  | 'room_created'
  | 'product_card_shown'
  | 'product_link_clicked'
  | 'product_wishlisted'
  | 'retake_started'
  | 'editorial_card_shown'
  | 'editorial_card_clicked'
  | 'reveal_shown'
  | 'reveal_panel_changed'
  | 'share_initiated'
  // REVEAL-1B additions (21 April 2026) — replace reveal_panel_changed
  // once the legacy 4-panel route (app/(onboarding)/result.tsx) is cut over.
  | 'reveal_first_visit_seen'
  | 'reveal_shared'
  | 'reveal_depth_visited'
  | 'reveal_depth_revisited'
  | 'profile_viewed'
  | 'profile_get_in_touch_tapped'
  | 'profile_retake_tapped'
  | 'profile_delete_account_tapped';

export function recordEvent(
  user: User | null,
  eventType: EventType,
  eventData: Record<string, unknown> = {}
): void {
  // Extract optional model_version and archetype_version from payload.
  // Both live in dedicated columns, not in the JSONB event_data blob.
  const {
    _modelVersion,
    _archetypeVersion,
    ...cleanData
  } = eventData as {
    _modelVersion?: string;
    _archetypeVersion?: number;
  } & Record<string, unknown>;

  // Fire-and-forget. No await, no throw.
  void (async () => {
    try {
      const { error } = await supabase.from('engagement_events').insert({
        user_id: user?.id ?? null,
        event_type: eventType,
        event_data: cleanData,
        model_version: _modelVersion ?? null,
        archetype_version: _archetypeVersion ?? null,
      });
      if (error) {
        Sentry.captureMessage(`engagement_events insert failed: ${error.message}`, 'warning');
      }
    } catch (err) {
      Sentry.captureException(err);
    }
  })();
}
