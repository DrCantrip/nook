// archetype-depth — REVEAL-1B return-visit read-out.
//
// Reached from the Profile tab's ArchetypeIdentityCard. Not a gradient
// experience — uses the 5% page tint so the screen feels continuous with
// Profile, not a second reveal. Three-tier stack: essence, observation,
// sensory anchor + behavioural truth + period modifier. Motif dot is
// tappable and expands to show the motif tooltip.
//
// Spec: canonical Section 14 REVEAL-1B (return-visit depth).

import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';

import { useAuth } from '../../src/hooks/useAuth';
import { supabase } from '../../src/lib/supabase';
import { recordEvent } from '../../src/services/engagement';
import {
  ARCHETYPES,
  type ArchetypeContent,
  type ArchetypeId,
} from '../../src/content/archetypes';
import {
  PERIOD_MODIFIERS,
  type PropertyPeriod,
} from '../../src/content/archetype-period-modifiers';
import { colors, radius, spacing, tint, typography } from '../../src/theme/tokens';
import { REVEAL_CONTENT_VERSION } from '../../src/content/reveal-versioning';

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | {
      status: 'ready';
      archetype: ArchetypeContent;
      propertyPeriod: PropertyPeriod | null;
    };

export default function ArchetypeDepthScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const [state, setState] = useState<State>({ status: 'loading' });
  const [motifOpen, setMotifOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setState({ status: 'error' });
      return;
    }
    let cancelled = false;

    (async () => {
      const [historyRes, userRes] = await Promise.all([
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
            .from('users')
            .select('property_period, depth_first_seen_at')
            .eq('id', userId)
            .maybeSingle(),
        ),
      ]);

      if (cancelled) return;

      const primaryId = historyRes.data?.primary_archetype as ArchetypeId | undefined;
      if (!primaryId) {
        setState({ status: 'error' });
        return;
      }
      const archetype = ARCHETYPES[primaryId];
      if (!archetype) {
        setState({ status: 'error' });
        return;
      }
      const propertyPeriod =
        (userRes.data?.property_period as PropertyPeriod | null | undefined) ?? null;

      setState({ status: 'ready', archetype, propertyPeriod });

      const wasFirstDepthVisit = userRes.data?.depth_first_seen_at === null;
      if (session?.user) {
        const eventName = wasFirstDepthVisit ? 'reveal_depth_visited' : 'reveal_depth_revisited';
        recordEvent(session.user, eventName, {
          primary_archetype: archetype.id,
          content_version: REVEAL_CONTENT_VERSION,
          _archetypeVersion: archetype.version,
        });
      }

      if (!userRes.data?.depth_first_seen_at) {
        await supabase
          .from('users')
          .update({ depth_first_seen_at: new Date().toISOString() })
          .eq('id', userId)
          .is('depth_first_seen_at', null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const onBack = () => {
    Haptics.selectionAsync();
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/profile');
  };

  const onToggleMotif = () => {
    Haptics.selectionAsync();
    setMotifOpen((v) => !v);
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
          <Text style={styles.errorTitle}>We couldn't load your style.</Text>
          <Pressable
            onPress={() => router.replace('/(app)/profile')}
            style={({ pressed }) => [styles.errorButton, { opacity: pressed ? 0.85 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Back to profile"
          >
            <Text style={styles.errorButtonText}>Back</Text>
          </Pressable>
        </View>
      </>
    );
  }

  const { archetype, propertyPeriod } = state;
  const pageTint = tint(archetype.id, 'page');
  const sectionTint = tint(archetype.id, 'section');
  const periodModifier =
    propertyPeriod != null ? PERIOD_MODIFIERS[archetype.id]?.[propertyPeriod] ?? null : null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: pageTint }]}>
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.85 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={12}
          >
            <CaretLeft size={24} color={colors.ink} weight="light" />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Tier 1 — identity + essence */}
          <Text style={styles.territory}>{archetype.styleTerritory}</Text>
          <Text style={styles.displayName}>{archetype.displayName}</Text>
          <Text style={styles.essence}>{archetype.description.essenceLine}</Text>

          {/* Motif — tappable to expand */}
          <Pressable
            onPress={onToggleMotif}
            style={({ pressed }) => [
              styles.motifBlock,
              { backgroundColor: sectionTint, opacity: pressed ? 0.9 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={motifOpen ? 'Collapse motif' : 'Read your motif'}
          >
            <View style={styles.motifHeader}>
              <View style={[styles.motifDot, { backgroundColor: archetype.accentColour }]} />
              <Text style={styles.motifLabel}>Your motif</Text>
            </View>
            {motifOpen && (
              <Text style={styles.motifBody}>{archetype.description.motifTooltip}</Text>
            )}
          </Pressable>

          {/* Tier 2 — observation paragraph */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>How you live</Text>
            <Text style={styles.body}>{archetype.description.observationParagraph}</Text>
          </View>

          {/* Tier 3 — sensory anchor + behavioural truth + period */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>What it feels like</Text>
            <Text style={styles.quote}>{archetype.description.sensoryAnchor}</Text>
          </View>

          <View style={[styles.truthBlock, { backgroundColor: sectionTint }]}>
            <Text style={styles.behaviouralTruth}>{archetype.description.behaviouralTruth}</Text>
          </View>

          {periodModifier != null && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>In your home</Text>
              <Text style={styles.quote}>{periodModifier}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing['2xl'],
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
  territory: {
    ...typography.uiLabel,
    color: colors.warm600,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  displayName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  essence: {
    ...typography.essence,
    color: colors.ink,
  },
  motifBlock: {
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  motifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  motifDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  motifLabel: {
    ...typography.uiLabel,
    color: colors.ink,
    fontFamily: 'DMSans-SemiBold',
  },
  motifBody: {
    ...typography.quote,
    color: colors.ink,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.uiLabel,
    color: colors.warm600,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  body: {
    ...typography.body,
    color: colors.ink,
  },
  quote: {
    ...typography.quote,
    color: colors.ink,
  },
  truthBlock: {
    borderRadius: radius.card,
    padding: spacing.xl,
  },
  behaviouralTruth: {
    ...typography.behaviouralTruth,
    color: colors.ink,
  },
});
