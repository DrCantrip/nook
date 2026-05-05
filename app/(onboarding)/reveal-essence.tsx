// reveal-essence — REVEAL-1B first-visit reveal, screen 1 of 2.
//
// Full archetype gradient + grain overlay. Identity block (kicker, display
// name, territory), essence line, and a static motif caption. A "See your
// share card" CTA fades in at 1.5 s — the delay protects the reveal moment
// from a reflex tap, while keeping the path forward obvious.
//
// Fires reveal_first_visit_seen once on mount (once per session, module flag).
// Stamps users.reveal_completed_at via upsert the first time the screen is
// reached — this is what drives the "return visitor" branch in (app)/home.
//
// Spec: canonical Section 14 REVEAL-1B (two-experience reveal).

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/hooks/useAuth';
import { recordEvent } from '../../src/services/engagement';
import { archetypeTheme, colors, spacing, typography } from '../../src/theme/tokens';
import {
  ARCHETYPES,
  type ArchetypeContent,
  type ArchetypeId,
} from '../../src/content/archetypes';
import { GrainOverlay } from '../../src/components/atoms/GrainOverlay';
import { NetworkErrorScreen } from '../../src/components/organisms/NetworkErrorScreen';
import type { ErrorCopyKey } from '../../src/content/errors';
import { REVEAL_CONTENT_VERSION } from '../../src/content/reveal-versioning';
import { truthHash } from '../../src/utils/hash';
import { useMotionPreference } from '../../src/hooks/useMotionPreference';
import { createLogger } from '../../lib/log';

const log = createLogger('reveal-essence');

// ≥2 failures within this window = genuine backend pressure signal.
// Hardcoded; mock-first telemetry (REVEAL-FAILURE-TELEMETRY) will calibrate.
const RECENT_FAILURE_WINDOW_MS = 90_000;

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; archetype: ArchetypeContent };

export default function RevealEssenceScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [state, setState] = useState<State>({ status: 'loading' });
  // triggerKey: bump-only signal for the resolution useEffect dep array.
  // retryCount: read by the busy-branch threshold; never in deps.
  // lastFailureAt: stamped in the catch path when failure surfaces.
  const [triggerKey, setTriggerKey] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFailureAt, setLastFailureAt] = useState<number | null>(null);
  const tapReadyRef = useRef(false);
  const ctaOpacity = useSharedValue(0);
  const { gentle, reduceMotion } = useMotionPreference();

  useEffect(() => {
    // Comprehension gate, not animation; see canonical Section 1.5.
    // Reduced-motion users skip the reveal pause since there's no fade to read across.
    const tapDelay = reduceMotion ? 300 : 1500;
    tapReadyRef.current = false;
    const t = setTimeout(() => {
      tapReadyRef.current = true;
    }, tapDelay);
    ctaOpacity.value = withDelay(
      tapDelay,
      withTiming(1, { duration: gentle.duration, easing: gentle.easing }),
    );
    return () => clearTimeout(t);
  }, [ctaOpacity, gentle.duration, gentle.easing, reduceMotion]);

  useEffect(() => {
    if (!userId) {
      setState({ status: 'error' });
      setLastFailureAt(Date.now());
      return;
    }
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        // AbortController guards ONLY the primary archetype-history query.
        // Post-success housekeeping below is intentionally NOT signal-guarded
        // — aborting on retry/unmount could leave reveal_completed_at unwritten
        // after a successful reveal. Asymmetry is intentional.
        const { data: history, error } = await supabase
          .from('archetype_history')
          .select('primary_archetype')
          .eq('user_id', userId)
          .order('recorded_at', { ascending: false })
          .limit(1)
          .abortSignal(controller.signal)
          .maybeSingle();

        if (cancelled) return;
        if (error) {
          // Supabase wraps fetch AbortError into the error field on some paths.
          if (error.name === 'AbortError') return;
          log.error('archetype-history resolution failed', error);
          setState({ status: 'error' });
          setLastFailureAt(Date.now());
          return;
        }
        if (!history) {
          log.error('archetype-history returned no row for user', { userId });
          setState({ status: 'error' });
          setLastFailureAt(Date.now());
          return;
        }

        const primaryId = history.primary_archetype as ArchetypeId;
        const archetype = ARCHETYPES[primaryId];
        if (!archetype) {
          log.error('unknown primary_archetype id', { primaryId });
          setState({ status: 'error' });
          setLastFailureAt(Date.now());
          return;
        }

        setState({ status: 'ready', archetype });

        // Read reveal_completed_at before stamping so the first-visit event only
        // fires on genuine first visits. DB is the source of truth; module flags
        // do not survive cold starts. Not signal-guarded — see header comment.
        const { data: userRow } = await supabase
          .from('users')
          .select('reveal_completed_at')
          .eq('id', userId)
          .single();
        const isFirstVisit = userRow?.reveal_completed_at === null;

        if (isFirstVisit && session?.user) {
          recordEvent(session.user, 'reveal_first_visit_seen', {
            primary_archetype: archetype.id,
            content_version: REVEAL_CONTENT_VERSION,
            truth_hash: truthHash(archetype.description.behaviouralTruth),
            _archetypeVersion: archetype.version,
          });
        }

        await supabase
          .from('users')
          .update({ reveal_completed_at: new Date().toISOString() })
          .eq('id', userId)
          .is('reveal_completed_at', null);
      } catch (err) {
        if (cancelled) return;
        // controller.abort() throws AbortError on the query promise — ignore silently.
        if (err instanceof Error && err.name === 'AbortError') return;
        log.error('reveal-essence resolution threw', err);
        setState({ status: 'error' });
        setLastFailureAt(Date.now());
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userId, triggerKey]);

  const handleRetry = useCallback(() => {
    setRetryCount((n) => n + 1);
    setState({ status: 'loading' });
    setTriggerKey((k) => k + 1);
  }, []);

  const ctaStyle = useAnimatedStyle(() => ({ opacity: ctaOpacity.value }));

  const onAdvance = () => {
    if (!tapReadyRef.current) return;
    if (state.status !== 'ready') return;
    Haptics.selectionAsync();
    router.push('/(onboarding)/reveal-share');
  };

  if (state.status === 'loading') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingDot}>…</Text>
        </View>
      </>
    );
  }

  if (state.status === 'error') {
    const isBusyState =
      retryCount >= 2 &&
      lastFailureAt !== null &&
      Date.now() - lastFailureAt < RECENT_FAILURE_WINDOW_MS;
    const errorKey: ErrorCopyKey = isBusyState ? 'revealBusy' : 'revealUnavailable';
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <NetworkErrorScreen errorKey={errorKey} onRetry={handleRetry} />
      </>
    );
  }

  const { archetype } = state;
  const theme = archetypeTheme(archetype.id);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientMid, theme.gradientEnd]}
        style={styles.container}
      >
        <GrainOverlay opacity={theme.grainOpacity} />
        <View style={styles.centred}>
          <Text style={styles.kicker}>You are</Text>
          <Text style={styles.displayName}>{archetype.displayName}</Text>
          <Text style={styles.styleTerritory}>{archetype.styleTerritory}</Text>

          <View style={styles.gap} />

          <Text style={styles.essence}>{archetype.description.essenceLine}</Text>

          <View style={styles.motifRow}>
            <View style={styles.motifDot} />
            <Text style={styles.motif}>{archetype.description.motifTooltip}</Text>
          </View>
        </View>

        <Animated.View style={[styles.ctaWrap, ctaStyle]}>
          <Pressable
            onPress={onAdvance}
            style={({ pressed }) => [styles.cta, { opacity: pressed ? 0.85 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="See your share card"
          >
            <Text style={styles.ctaText}>See your share card</Text>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  loadingDot: {
    fontFamily: 'NewsreaderItalic',
    fontSize: 40,
    color: colors.ink,
    opacity: 0.5,
  },
  kicker: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.md,
  },
  displayName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 48,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  styleTerritory: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  gap: { height: spacing['3xl'] },
  essence: {
    ...typography.essence,
    color: colors.white,
    textAlign: 'center',
    maxWidth: '88%',
  },
  motifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing['2xl'],
    gap: spacing.sm,
  },
  motifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    opacity: 0.7,
  },
  motif: {
    fontFamily: 'NewsreaderItalic',
    fontSize: 16,
    lineHeight: 22,
    color: colors.white,
    opacity: 0.85,
  },
  ctaWrap: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cta: {
    minHeight: 48,
    paddingHorizontal: spacing['2xl'],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    ...typography.cta,
    color: colors.white,
  },
});
