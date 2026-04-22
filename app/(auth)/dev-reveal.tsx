// Dev-only harness for REVEAL-1B phone testing.
//
// Replaces the previous 4-panel dev walk-through. Two tabs:
//   1. Reveal — preview reveal-essence and reveal-share for any archetype.
//              Renders the gradient + identity block inline so we can test
//              without a Supabase session.
//   2. Profile — render the Profile tab block layout with mock data for any
//              archetype, including the empty variant (null archetype).
//
// Not routed from user flow — reach it from the welcome screen's hidden
// double-tap handler, or directly via /(auth)/dev-reveal.
//
// TODO: delete before TestFlight.

import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CaretLeft } from 'phosphor-react-native';

import {
  ARCHETYPES,
  type ArchetypeContent,
  type ArchetypeId,
} from '../../src/content/archetypes';
import {
  PERIOD_MODIFIERS,
  type PropertyPeriod,
} from '../../src/content/archetype-period-modifiers';
import {
  HOME_STATUS_LABELS,
  JOURNEY_LABELS,
  PROPERTY_PERIOD_LABELS,
  postcodeToRegion,
} from '../../src/content/profile-labels';
import { ArchetypeIdentityCard } from '../../src/components/organisms/ArchetypeIdentityCard';
import { GrainOverlay } from '../../src/components/atoms/GrainOverlay';
import {
  archetypeTheme,
  colors,
  radius,
  spacing,
  tint,
  typography,
} from '../../src/theme/tokens';

const ARCHETYPE_IDS: ArchetypeId[] = [
  'curator',
  'nester',
  'maker',
  'minimalist',
  'romantic',
  'storyteller',
  'urbanist',
];

type Tab = 'reveal' | 'profile';
type RevealSurface = 'essence' | 'share';

export default function DevRevealHarness() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('reveal');
  const [archetypeId, setArchetypeId] = useState<ArchetypeId | null>('curator');
  const [surface, setSurface] = useState<RevealSurface>('essence');

  const archetype = archetypeId ? ARCHETYPES[archetypeId] : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <CaretLeft size={24} color={colors.ink} weight="light" />
        </Pressable>
        <Text style={styles.headerTitle}>Dev · REVEAL-1B</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab switch */}
      <View style={styles.tabBar}>
        <TabButton label="Reveal" active={tab === 'reveal'} onPress={() => setTab('reveal')} />
        <TabButton label="Profile" active={tab === 'profile'} onPress={() => setTab('profile')} />
      </View>

      {/* Archetype selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {tab === 'profile' && (
          <Chip
            label="(empty)"
            active={archetypeId === null}
            onPress={() => setArchetypeId(null)}
          />
        )}
        {ARCHETYPE_IDS.map((id) => (
          <Chip
            key={id}
            label={ARCHETYPES[id].displayName}
            active={archetypeId === id}
            onPress={() => setArchetypeId(id)}
          />
        ))}
      </ScrollView>

      {/* Reveal surface selector */}
      {tab === 'reveal' && (
        <View style={styles.surfaceRow}>
          <Chip
            label="Essence"
            active={surface === 'essence'}
            onPress={() => setSurface('essence')}
          />
          <Chip
            label="Share"
            active={surface === 'share'}
            onPress={() => setSurface('share')}
          />
        </View>
      )}

      {/* Preview */}
      <View style={styles.previewWrap}>
        {tab === 'reveal' && archetype && (
          surface === 'essence' ? (
            <RevealEssencePreview archetype={archetype} />
          ) : (
            <RevealSharePreview archetype={archetype} />
          )
        )}
        {tab === 'profile' && (
          <ProfilePreview archetype={archetype} />
        )}
      </View>
    </SafeAreaView>
  );
}

// ── Reveal previews ──────────────────────────────────────

function RevealEssencePreview({ archetype }: { archetype: ArchetypeContent }) {
  const theme = archetypeTheme(archetype.id);
  return (
    <View style={styles.surface}>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientMid, theme.gradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      <GrainOverlay opacity={theme.grainOpacity} />
      <View style={styles.surfaceCentred}>
        <Text style={styles.gradKicker}>You are</Text>
        <Text style={styles.gradDisplayName}>{archetype.displayName}</Text>
        <Text style={styles.gradTerritory}>{archetype.styleTerritory}</Text>
        <View style={{ height: spacing['3xl'] }} />
        <Text style={styles.gradEssence}>{archetype.description.essenceLine}</Text>
        <View style={styles.motifRow}>
          <View style={styles.motifDot} />
          <Text style={styles.motif}>{archetype.description.motifTooltip}</Text>
        </View>
      </View>
    </View>
  );
}

function RevealSharePreview({ archetype }: { archetype: ArchetypeContent }) {
  const theme = archetypeTheme(archetype.id);
  const onShare = async () => {
    try {
      await Share.share({
        message: `${archetype.description.behaviouralTruth} · I'm ${archetype.displayName} on Cornr. cornr.co.uk`,
      });
    } catch {
      // Cancelled.
    }
  };
  return (
    <View style={styles.surface}>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientMid, theme.gradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      <GrainOverlay opacity={theme.grainOpacity} />
      <View style={styles.surfaceCentred}>
        <Text style={styles.gradName}>{archetype.displayName}</Text>
        <Text style={styles.gradTerritorySmall}>{archetype.styleTerritory}</Text>
        <View style={{ height: spacing['3xl'] }} />
        <Text style={styles.gradTruth}>{archetype.description.behaviouralTruth}</Text>
        <Text style={styles.gradFooter}>cornr.co.uk</Text>
      </View>
      <View style={styles.shareActions}>
        <Pressable
          onPress={onShare}
          style={({ pressed }) => [styles.sharePrimary, { opacity: pressed ? 0.85 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Share"
        >
          <Text style={styles.sharePrimaryText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── Profile preview ──────────────────────────────────────

function ProfilePreview({ archetype }: { archetype: ArchetypeContent | null }) {
  const period: PropertyPeriod = 'victorian';
  const mockRooms = 3;
  const mockWishlist = 12;
  const regionLabel = postcodeToRegion('SW4');

  return (
    <ScrollView
      contentContainerStyle={styles.profileScroll}
      showsVerticalScrollIndicator={false}
    >
      {archetype ? (
        <View style={styles.profileHeader}>
          <Text style={styles.kicker}>Your style</Text>
          <Text style={styles.essenceName}>{archetype.displayName}</Text>
          <Text style={styles.essenceTerritory}>{archetype.styleTerritory}</Text>
        </View>
      ) : (
        <View style={styles.profileHeader}>
          <Text style={styles.kicker}>Your profile</Text>
          <Text style={styles.essenceName}>Every corner, considered.</Text>
        </View>
      )}

      {archetype ? (
        <ArchetypeIdentityCard variant="populated" archetype={archetype} />
      ) : (
        <ArchetypeIdentityCard variant="empty" />
      )}

      <View style={styles.block}>
        <Text style={styles.blockLabel}>Your collection</Text>
        <Text style={styles.bodyRow}>Rooms: {mockRooms}</Text>
        <Text style={styles.bodyRow}>Wishlist: {mockWishlist} items</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockLabel}>What Cornr knows</Text>
        <Text style={styles.bodyRow}>Email: test@cornr.test</Text>
        <Text style={styles.bodyRow}>Where you're at: {JOURNEY_LABELS.settled_3_12}</Text>
        <Text style={styles.bodyRow}>Home status: {HOME_STATUS_LABELS.first_time}</Text>
        <Text style={styles.bodyRow}>Property: {PROPERTY_PERIOD_LABELS[period]}</Text>
        <Text style={styles.bodyRow}>Area: {regionLabel ?? 'Not set'}</Text>
      </View>

      {archetype && (
        <View style={[styles.depthPreview, { backgroundColor: tint(archetype.id, 'page') }]}>
          <Text style={styles.kicker}>Depth view preview</Text>
          <Text style={styles.depthQuote}>
            {PERIOD_MODIFIERS[archetype.id]?.[period] ?? archetype.description.sensoryAnchor}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ── Shared atoms ─────────────────────────────────────────

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabBtn,
        active && styles.tabBtnActive,
        { opacity: pressed ? 0.85 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        { opacity: pressed ? 0.85 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.cardHeading,
    color: colors.ink,
  },
  tabBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  tabBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    backgroundColor: colors.warm100,
    minHeight: 36,
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.ink,
  },
  tabBtnText: {
    ...typography.uiLabel,
    color: colors.ink,
  },
  tabBtnTextActive: {
    color: colors.white,
    fontFamily: 'DMSans-SemiBold',
  },
  chipRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  surfaceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.button,
    backgroundColor: colors.warm100,
    minHeight: 32,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  chipText: {
    ...typography.badge,
    color: colors.ink,
    textTransform: 'none',
    letterSpacing: 0,
  },
  chipTextActive: {
    color: colors.white,
  },
  previewWrap: {
    flex: 1,
  },
  surface: {
    flex: 1,
    overflow: 'hidden',
  },
  surfaceCentred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  gradKicker: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.md,
  },
  gradDisplayName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 48,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  gradTerritory: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  gradEssence: {
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
  gradName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 24,
    color: colors.white,
    letterSpacing: -0.3,
  },
  gradTerritorySmall: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    letterSpacing: 0.4,
    color: colors.white,
    opacity: 0.85,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  gradTruth: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 28,
    lineHeight: 38,
    color: colors.white,
    textAlign: 'center',
    maxWidth: '88%',
    letterSpacing: -0.3,
  },
  gradFooter: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.white,
    opacity: 0.7,
    marginTop: spacing['4xl'],
    textTransform: 'uppercase',
  },
  shareActions: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: spacing.xl,
    right: spacing.xl,
  },
  sharePrimary: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sharePrimaryText: {
    ...typography.cta,
    color: colors.ink,
  },
  profileScroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing['2xl'],
  },
  profileHeader: {
    gap: spacing.xs,
  },
  kicker: {
    ...typography.uiLabel,
    color: colors.warm600,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  essenceName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 32,
    lineHeight: 38,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  essenceTerritory: {
    fontFamily: 'NewsreaderItalic',
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
    opacity: 0.85,
  },
  block: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  blockLabel: {
    ...typography.uiLabel,
    color: colors.warm600,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  bodyRow: {
    ...typography.body,
    color: colors.ink,
  },
  depthPreview: {
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  depthQuote: {
    ...typography.quote,
    color: colors.ink,
  },
});
