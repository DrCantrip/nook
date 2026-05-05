// reveal-share — REVEAL-1B first-visit reveal, screen 2 of 2.
//
// Full archetype gradient + grain overlay. The behavioural truth is the hero
// — largest text on screen, Lora-SemiBold 28 — and doubles as the share
// artefact. Below it, a subtle share footer ("cornr.co.uk"). Two actions at
// the foot: Share (native Share.share) and Done (routes into (app)/home).
//
// This screen is the destination of the "See your share card" CTA from
// reveal-essence. After tapping Done, the user moves into the home tab and
// the app knows — via users.reveal_completed_at stamped on the previous
// screen — to keep them in the return-visit track from now on.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

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
import { supabase } from '../../src/lib/supabase';
import { createLogger } from '../../lib/log';

const log = createLogger('reveal-share');

// ≥2 failures within this window = genuine backend pressure signal.
// Hardcoded; mock-first telemetry (REVEAL-FAILURE-TELEMETRY) will calibrate.
// Note: revealBusy on the share screen is under post-mock-first review
// (REVEAL-SHARE-BUSY-NECESSITY) — share's archetype-history query runs ~2s
// after essence's same query succeeded.
const RECENT_FAILURE_WINDOW_MS = 90_000;

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; archetype: ArchetypeContent };

export default function RevealShareScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ archetype?: string }>();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const [state, setState] = useState<State>({ status: 'loading' });
  // triggerKey: bump-only signal for the resolution useEffect dep array.
  // retryCount: read by the busy-branch threshold; never in deps.
  // lastFailureAt: stamped in the catch path when failure surfaces.
  const [triggerKey, setTriggerKey] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFailureAt, setLastFailureAt] = useState<number | null>(null);
  const shareFiredRef = useRef(false);

  useEffect(() => {
    // Allow the dev harness to preview any archetype via ?archetype=curator.
    // Dev-harness path bypasses network — no AbortController needed.
    const paramId = params.archetype as ArchetypeId | undefined;
    if (paramId && ARCHETYPES[paramId]) {
      setState({ status: 'ready', archetype: ARCHETYPES[paramId] });
      return;
    }

    if (!userId) {
      setState({ status: 'error' });
      setLastFailureAt(Date.now());
      return;
    }
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
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
      } catch (err) {
        if (cancelled) return;
        if (err instanceof Error && err.name === 'AbortError') return;
        log.error('reveal-share resolution threw', err);
        setState({ status: 'error' });
        setLastFailureAt(Date.now());
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userId, params.archetype, triggerKey]);

  const handleRetry = useCallback(() => {
    setRetryCount((n) => n + 1);
    setState({ status: 'loading' });
    setTriggerKey((k) => k + 1);
  }, []);

  const handleShare = async () => {
    if (state.status !== 'ready') return;
    const { archetype } = state;
    Haptics.selectionAsync();
    const message = `${archetype.description.behaviouralTruth} · I'm ${archetype.displayName} on Cornr. cornr.co.uk`;
    try {
      const result = await Share.share({ message });
      if (result.action !== Share.dismissedAction && session?.user && !shareFiredRef.current) {
        shareFiredRef.current = true;
        recordEvent(session.user, 'reveal_shared', {
          primary_archetype: archetype.id,
          content_version: REVEAL_CONTENT_VERSION,
          truth_hash: truthHash(archetype.description.behaviouralTruth),
          _archetypeVersion: archetype.version,
        });
      }
    } catch {
      // Sharing cancelled by the user is not an error.
    }
  };

  const handleDone = () => {
    Haptics.selectionAsync();
    router.replace('/(app)/home');
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
    const errorKey: ErrorCopyKey = isBusyState ? 'revealBusy' : 'revealShareUnavailable';
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
          <Text style={styles.kicker}>{archetype.displayName}</Text>
          <Text style={styles.territory}>{archetype.styleTerritory}</Text>

          <View style={styles.truthGap} />

          <Text style={styles.behaviouralTruth}>{archetype.description.behaviouralTruth}</Text>

          <Text style={styles.footer}>cornr.co.uk</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.primaryCta, { opacity: pressed ? 0.85 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Share your style"
          >
            <Text style={styles.primaryCtaText}>Share</Text>
          </Pressable>
          <Pressable
            onPress={handleDone}
            style={({ pressed }) => [styles.secondaryCta, { opacity: pressed ? 0.85 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Continue to home"
          >
            <Text style={styles.secondaryCtaText}>Done</Text>
          </Pressable>
        </View>
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
    fontFamily: 'Lora-SemiBold',
    fontSize: 24,
    color: colors.white,
    letterSpacing: -0.3,
  },
  territory: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    letterSpacing: 0.4,
    color: colors.white,
    opacity: 0.85,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  truthGap: { height: spacing['3xl'] },
  behaviouralTruth: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 28,
    lineHeight: 38,
    color: colors.white,
    textAlign: 'center',
    maxWidth: '88%',
    letterSpacing: -0.3,
  },
  footer: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.white,
    opacity: 0.7,
    marginTop: spacing['4xl'],
    textTransform: 'uppercase',
  },
  actions: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: spacing.xl,
    right: spacing.xl,
    gap: spacing.md,
  },
  primaryCta: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: {
    ...typography.cta,
    color: colors.ink,
  },
  secondaryCta: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCtaText: {
    ...typography.cta,
    color: colors.white,
  },
});
