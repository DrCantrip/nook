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

import { useEffect, useRef, useState } from 'react';
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
import { REVEAL_CONTENT_VERSION } from '../../src/content/reveal-versioning';
import { truthHash } from '../../src/utils/hash';

let hasFiredFirstVisit = false;

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; archetype: ArchetypeContent };

export default function RevealEssenceScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [state, setState] = useState<State>({ status: 'loading' });
  const tapReadyRef = useRef(false);
  const ctaOpacity = useSharedValue(0);

  useEffect(() => {
    tapReadyRef.current = false;
    const t = setTimeout(() => {
      tapReadyRef.current = true;
    }, 1500);
    ctaOpacity.value = withDelay(1500, withTiming(1, { duration: 400 }));
    return () => clearTimeout(t);
  }, [ctaOpacity]);

  useEffect(() => {
    if (!userId) {
      setState({ status: 'error' });
      return;
    }
    let cancelled = false;

    (async () => {
      const { data: history, error } = await supabase
        .from('archetype_history')
        .select('primary_archetype')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;
      if (error || !history) {
        setState({ status: 'error' });
        return;
      }

      const primaryId = history.primary_archetype as ArchetypeId;
      const archetype = ARCHETYPES[primaryId];
      if (!archetype) {
        setState({ status: 'error' });
        return;
      }

      setState({ status: 'ready', archetype });

      // Stamp reveal_completed_at on first visit. Upsert semantics via update
      // — the users row is already created at signup.
      await supabase
        .from('users')
        .update({ reveal_completed_at: new Date().toISOString() })
        .eq('id', userId)
        .is('reveal_completed_at', null);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (state.status !== 'ready' || hasFiredFirstVisit || !session?.user) return;
    hasFiredFirstVisit = true;
    recordEvent(session.user, 'reveal_first_visit_seen', {
      primary_archetype: state.archetype.id,
      content_version: REVEAL_CONTENT_VERSION,
      truth_hash: truthHash(state.archetype.description.behaviouralTruth),
      _archetypeVersion: state.archetype.version,
    });
  }, [state, session?.user]);

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
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorScreen}>
          <Text style={styles.errorTitle}>We couldn't find your quiz result.</Text>
          <Pressable
            onPress={() => router.replace('/(onboarding)/swipe')}
            style={({ pressed }) => [styles.errorButton, { opacity: pressed ? 0.85 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Try the quiz again"
          >
            <Text style={styles.errorButtonText}>Try again</Text>
          </Pressable>
        </View>
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
  errorScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    ...typography.sectionHeading,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  errorButton: {
    minHeight: 44,
    paddingHorizontal: spacing['2xl'],
    backgroundColor: colors.ink,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorButtonText: {
    ...typography.cta,
    color: colors.white,
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
