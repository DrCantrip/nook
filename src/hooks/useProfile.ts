// useProfile — Profile tab data-loader. Parallel reads against Supabase for
// the five pieces of state the Profile screen renders:
//   1. users row (consent + journey + property + timestamps + email)
//   2. latest archetype_history row (primary archetype + version)
//   3. rooms count
//   4. wishlisted_products count
//   5. archetype content object (local lookup from src/content/archetypes.ts)
//
// All four Supabase reads fire in parallel via Promise.all. First version is
// deliberately simple; if latency flags a concern, we can add caching or
// subscriptions later.

import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import { supabase } from '../lib/supabase';
import { ARCHETYPES, type ArchetypeContent, type ArchetypeId } from '../content/archetypes';
import type { PropertyPeriod } from '../content/archetype-period-modifiers';

type JourneyStage =
  | 'pre_purchase'
  | 'new_0_3'
  | 'settled_3_12'
  | 'established'
  | 'renting';

type HomeStatus = 'first_time' | 'experienced' | 'renter';

export type ProfileData = {
  // User row fields used by Profile tab.
  email: string | null;
  journeyStage: JourneyStage | null;
  homeStatus: HomeStatus | null;
  propertyPeriod: PropertyPeriod | null;
  postcodeDistrict: string | null;
  emailMarketingOptIn: boolean;
  audienceDataOptIn: boolean;
  revealCompletedAt: string | null;
  memberSince: string | null; // from users.created_at
  // Latest archetype assignment. Null if quiz not completed.
  archetype: ArchetypeContent | null;
  // Denormalised counts for "Your collection" section.
  roomsCount: number;
  wishlistCount: number;
};

export type UseProfileResult =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: ProfileData };

const EMPTY_DATA: ProfileData = {
  email: null,
  journeyStage: null,
  homeStatus: null,
  propertyPeriod: null,
  postcodeDistrict: null,
  emailMarketingOptIn: false,
  audienceDataOptIn: false,
  revealCompletedAt: null,
  memberSince: null,
  archetype: null,
  roomsCount: 0,
  wishlistCount: 0,
};

export function useProfile(userId: string | null): UseProfileResult {
  const [state, setState] = useState<UseProfileResult>({ status: 'loading' });

  useEffect(() => {
    if (!userId) {
      setState({ status: 'ready', data: EMPTY_DATA });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    (async () => {
      try {
        const [userRes, archetypeRes, roomsRes, wishlistRes] = await Promise.all([
          Promise.resolve(
            supabase
              .from('users')
              .select(
                'email, journey_stage, home_status, property_period, postcode_district, email_marketing_opt_in, audience_data_opt_in, reveal_completed_at, created_at',
              )
              .eq('id', userId)
              .maybeSingle(),
          ),
          Promise.resolve(
            supabase
              .from('archetype_history')
              .select('primary_archetype')
              .eq('user_id', userId)
              .order('recorded_at', { ascending: false })
              .limit(1)
              .maybeSingle(),
          ),
          Promise.resolve(
            supabase
              .from('rooms')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId),
          ),
          Promise.resolve(
            supabase
              .from('wishlisted_products')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId),
          ),
        ]);

        if (cancelled) return;

        if (userRes.error) {
          setState({ status: 'error', error: userRes.error.message });
          return;
        }

        if (archetypeRes.error) {
          Sentry.captureException(archetypeRes.error, {
            tags: { source: 'useProfile', query: 'archetype_history' },
          });
        }
        if (roomsRes.error) {
          Sentry.captureException(roomsRes.error, {
            tags: { source: 'useProfile', query: 'rooms' },
          });
        }
        if (wishlistRes.error) {
          Sentry.captureException(wishlistRes.error, {
            tags: { source: 'useProfile', query: 'wishlist' },
          });
        }

        const userRow = userRes.data;
        const archetypeRow = archetypeRes.data;
        const roomsCount = roomsRes.count ?? 0;
        const wishlistCount = wishlistRes.count ?? 0;

        const primaryId = (archetypeRow?.primary_archetype as ArchetypeId | undefined) ?? null;
        const archetype = primaryId ? (ARCHETYPES[primaryId] ?? null) : null;

        const data: ProfileData = {
          email: (userRow?.email as string | null | undefined) ?? null,
          journeyStage: (userRow?.journey_stage as JourneyStage | null | undefined) ?? null,
          homeStatus: (userRow?.home_status as HomeStatus | null | undefined) ?? null,
          propertyPeriod: (userRow?.property_period as PropertyPeriod | null | undefined) ?? null,
          postcodeDistrict: (userRow?.postcode_district as string | null | undefined) ?? null,
          emailMarketingOptIn: !!userRow?.email_marketing_opt_in,
          audienceDataOptIn: !!userRow?.audience_data_opt_in,
          revealCompletedAt: (userRow?.reveal_completed_at as string | null | undefined) ?? null,
          memberSince: (userRow?.created_at as string | null | undefined) ?? null,
          archetype,
          roomsCount,
          wishlistCount,
        };

        setState({ status: 'ready', data });
      } catch (err) {
        if (cancelled) return;
        setState({
          status: 'error',
          error: err instanceof Error ? err.message : 'unknown',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return state;
}
