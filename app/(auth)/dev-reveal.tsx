// Dev-only reveal screen for phone testing without auth/Supabase.
// Duplicates panel logic from app/(onboarding)/result.tsx with hardcoded data.
// TODO: delete before TestFlight.

import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { CaretLeft } from "phosphor-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
} from "react-native-reanimated";

import { colors, spacing, archetypeTheme, typography } from "../../src/theme/tokens";
import { ARCHETYPES, type ArchetypeContent } from "../../src/content/archetypes";
import { PERIOD_MODIFIERS } from "../../src/content/archetype-period-modifiers";
import { GrainOverlay } from "../../src/components/atoms/GrainOverlay";

const PANEL_COUNT = 4;

// Hardcoded mock data for visual testing.
const MOCK_ARCHETYPE_ID = "curator" as const;
const MOCK_PROPERTY_PERIOD = "victorian" as const;

export default function DevRevealScreen() {
  const router = useRouter();
  const archetype = ARCHETYPES[MOCK_ARCHETYPE_ID];
  const [panelIndex, setPanelIndex] = useState(0);
  const panel1TapReadyRef = useRef(false);

  useEffect(() => {
    panel1TapReadyRef.current = false;
    const t = setTimeout(() => {
      panel1TapReadyRef.current = true;
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  const advance = () => {
    if (panelIndex >= PANEL_COUNT - 1) return;
    if (panelIndex === 0 && !panel1TapReadyRef.current) return;
    setPanelIndex(panelIndex + 1);
  };

  const goBack = () => {
    if (panelIndex === 0) {
      // On panel 0, "back" means leave the screen entirely.
      router.back();
      return;
    }
    setPanelIndex(panelIndex - 1);
  };

  const handleShare = async () => {
    const message = `I'm ${archetype.displayName} · ${archetype.styleTerritory}. ${archetype.description.behaviouralTruth} Find your home style on Cornr. cornr.co.uk`;
    try {
      await Share.share({ message });
    } catch {
      // Swallow cancellations.
    }
  };

  const isSharePanel = panelIndex === PANEL_COUNT - 1;
  const periodModifier =
    PERIOD_MODIFIERS[archetype.id]?.[MOCK_PROPERTY_PERIOD] ?? null;

  // Per-archetype theme with pre-darkened gradientStart values for WCAG AA
  // contrast against white text. See tokens.ts archetypeTheme comment block.
  const theme = archetypeTheme(archetype.id);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientMid, theme.gradientEnd]}
        locations={[0, 0.45, 1]}
        style={styles.container}
      >
        <GrainOverlay opacity={theme.grainOpacity} />
        {isSharePanel ? (
          <View style={styles.tapRegion}>
            <Panel4ShareCard
              archetype={archetype}
              onShare={handleShare}
              onDone={() => router.back()}
            />
          </View>
        ) : (
          <View style={styles.tapRegion}>
            {/* Panel content fills the tap region. */}
            <View style={StyleSheet.absoluteFillObject}>
              {panelIndex === 0 && <Panel1Identity archetype={archetype} />}
              {panelIndex === 1 && <Panel2Insight archetype={archetype} />}
              {panelIndex === 2 && (
                <Panel3Anchor archetype={archetype} periodModifier={periodModifier} />
              )}
            </View>

            {/* Split tap targets: left 33% = back, right 67% = advance.
                tapSplit leaves a 20px gutter on the left edge so the iOS
                edge-swipe gesture can pass through to the navigator. */}
            <View style={styles.tapSplit}>
              <Pressable
                onPress={goBack}
                style={styles.tapBack}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              />
              <Pressable
                onPress={advance}
                style={styles.tapForward}
                accessibilityRole="button"
                accessibilityLabel="Advance to next panel"
              />
            </View>
          </View>
        )}

        {/* Back chevron — rendered on every panel. Panel 0 → router.back();
            panels 1-3 → decrement panelIndex via goBack. */}
        <Pressable
          onPress={goBack}
          style={styles.backChevron}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <CaretLeft size={20} weight="light" color={colors.white} />
        </Pressable>

        {/* TASK 5 — progress dots. Always rendered, on top of panel content. */}
        <View pointerEvents="none" style={styles.progressDots}>
          {Array.from({ length: PANEL_COUNT }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i === panelIndex ? styles.progressDotFilled : styles.progressDotOutline,
              ]}
            />
          ))}
        </View>

        {/* TASK 6 — pulsing "Tap to continue" on non-share panels. */}
        {!isSharePanel && <PulsingTapHint />}
      </LinearGradient>
    </>
  );
}

// ── panels ───────────────────────────────────────────────

function Panel1Identity({ archetype }: { archetype: ArchetypeContent }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 140 });
    opacity.value = withDelay(200, withTiming(1, { duration: 400 }));
  }, [scale, opacity]);

  const nameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const territoryStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.centred}>
      {/* TASK 3 — "You are" DM Sans small. Name Lora-SemiBold (closest to "regular" — no Lora Regular loaded). Territory DM Sans. All white. */}
      <Text style={styles.kicker}>You are</Text>
      <Animated.Text style={[styles.displayName, nameStyle]}>
        {archetype.displayName}
      </Animated.Text>
      <Animated.Text style={[styles.styleTerritory, territoryStyle]}>
        {archetype.styleTerritory}
      </Animated.Text>
    </View>
  );
}

function Panel2Insight({ archetype }: { archetype: ArchetypeContent }) {
  const essenceOpacity = useSharedValue(0);
  const truthOpacity = useSharedValue(0);
  const observationOpacity = useSharedValue(0);

  useEffect(() => {
    essenceOpacity.value = withTiming(1, { duration: 600 });
    truthOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    observationOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
  }, [essenceOpacity, truthOpacity, observationOpacity]);

  const essenceStyle = useAnimatedStyle(() => ({ opacity: essenceOpacity.value }));
  const truthStyle = useAnimatedStyle(() => ({ opacity: truthOpacity.value }));
  const observationStyle = useAnimatedStyle(() => ({ opacity: observationOpacity.value }));

  return (
    <View style={styles.panel2Tiers}>
      <Animated.Text style={[styles.tierEssence, essenceStyle]}>
        {archetype.description.essenceLine}
      </Animated.Text>
      <Animated.Text style={[styles.tierBehaviouralTruth, truthStyle]}>
        {archetype.description.behaviouralTruth}
      </Animated.Text>
      <Animated.Text style={[styles.tierObservation, observationStyle]}>
        {archetype.description.observationParagraph}
      </Animated.Text>
    </View>
  );
}

function Panel3Anchor({
  archetype,
  periodModifier,
}: {
  archetype: ArchetypeContent;
  periodModifier: string | null;
}) {
  return (
    <View style={styles.centred}>
      <Text style={styles.sensoryAnchor}>{archetype.description.sensoryAnchor}</Text>
      {periodModifier != null && (
        <>
          <View style={styles.anchorPeriodDivider} />
          <Text style={styles.periodModifier}>{periodModifier}</Text>
        </>
      )}
    </View>
  );
}

function Panel4ShareCard({
  archetype,
  onShare,
  onDone,
}: {
  archetype: ArchetypeContent;
  onShare: () => void;
  onDone: () => void;
}) {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.85;

  return (
    <View style={styles.shareCentred}>
      <View style={[styles.shareCard, { maxWidth: cardWidth }]}>
        {/* TASK 4 — wordmark at top */}
        <Text style={styles.shareCardWordmark}>cornr</Text>

        <View style={styles.shareCardSmallGap} />

        {/* Name + territory */}
        <Text style={styles.shareCardName}>{archetype.displayName}</Text>
        <Text style={styles.shareCardTerritory}>{archetype.styleTerritory}</Text>

        <View style={styles.shareCardGap} />

        {/* TASK 4 — Behavioural truth as the prominent share-worthy line (emotional peak) */}
        <Text style={styles.shareCardTruth}>{archetype.description.behaviouralTruth}</Text>

        <View style={styles.shareCardSmallGap} />

        {/* Essence line as secondary */}
        <Text style={styles.shareCardEssence}>{archetype.description.essenceLine}</Text>
      </View>

      <Pressable
        onPress={onShare}
        style={({ pressed }) => [
          styles.shareButton,
          { width: cardWidth, opacity: pressed ? 0.85 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Share your archetype"
      >
        <Text style={styles.shareButtonText}>Share</Text>
      </Pressable>

      <Pressable
        onPress={onDone}
        style={({ pressed }) => [styles.doneButton, { opacity: pressed ? 0.85 : 1 }]}
        accessibilityRole="button"
        accessibilityLabel="Back to welcome"
      >
        <Text style={styles.doneButtonText}>Done (back to welcome)</Text>
      </Pressable>
    </View>
  );
}

// TASK 6 — breathing-opacity tap hint
function PulsingTapHint() {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1, // infinite
      true, // reverse
    );
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.Text style={[styles.tapHint, pulseStyle]} pointerEvents="none">
      Tap to continue
    </Animated.Text>
  );
}

// ── styles (all text colours now colors.white for contrast on warm gradient) ──

const styles = StyleSheet.create({
  container: { flex: 1 },
  tapRegion: { flex: 1 },
  tapSplit: {
    // Leaves leftmost 20px uncovered so the iOS edge-swipe gesture reaches
    // the navigator instead of being captured by the tapBack Pressable.
    position: "absolute",
    top: 0,
    left: 20,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  tapBack: {
    flex: 1, // 33% — with flex: 2 on right, totals 3
  },
  tapForward: {
    flex: 2, // 67%
  },
  backChevron: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  centred: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  // Panel 1
  kicker: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    color: colors.white,
    opacity: 0.7,
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  displayName: {
    fontFamily: "Lora-SemiBold",
    fontSize: 48,
    color: colors.white,
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 56,
  },
  styleTerritory: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: colors.white,
    opacity: 0.7,
    marginTop: spacing.lg,
    textAlign: "center",
    letterSpacing: 1,
  },

  // Panel 2 — three-tier typography (essence / behaviouralTruth / observation).
  // Tiers consume typography tokens; colour applied here (white on gradient).
  panel2Tiers: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  tierEssence: {
    ...typography.essence,
    color: colors.white,
    marginBottom: 24,
  },
  tierBehaviouralTruth: {
    ...typography.behaviouralTruth,
    color: colors.white,
    marginBottom: 24,
  },
  tierObservation: {
    ...typography.observation,
    color: colors.white,
  },

  // Panel 3
  sensoryAnchor: {
    fontFamily: "DMSans-Regular",
    fontSize: 17,
    lineHeight: 26,
    color: colors.white,
    textAlign: "center",
    maxWidth: "85%",
    opacity: 0.85,
  },
  anchorPeriodDivider: {
    width: 40,
    height: 1,
    backgroundColor: colors.white,
    opacity: 0.15,
    marginTop: 28,
    marginBottom: 28,
  },
  periodModifier: {
    fontFamily: "NewsreaderItalic",
    fontSize: 18,
    lineHeight: 28,
    color: colors.white,
    textAlign: "center",
    maxWidth: "85%",
  },

  // Progress dots + tap hint overlay
  progressDots: {
    position: "absolute",
    bottom: spacing["4xl"] + 44,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotFilled: {
    backgroundColor: colors.white,
  },
  progressDotOutline: {
    borderWidth: 1,
    borderColor: colors.white,
    opacity: 0.6,
  },
  tapHint: {
    position: "absolute",
    bottom: spacing["3xl"],
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "DMSans-Medium",
    fontSize: 15,
    color: colors.white,
    letterSpacing: 0.5,
  },

  // Panel 4 — share card (keeps gradient background, all text white for feed legibility)
  shareCentred: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing["2xl"],
  },
  shareCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing["3xl"],
  },
  shareCardWordmark: {
    fontFamily: "DMSans-Medium",
    fontSize: 12,
    color: colors.white,
    opacity: 0.5,
    letterSpacing: 3,
    textTransform: "lowercase",
  },
  shareCardSmallGap: { height: spacing.lg },
  shareCardGap: { height: spacing["2xl"] },
  shareCardName: {
    fontFamily: "Lora-SemiBold",
    fontSize: 36,
    color: colors.white,
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  shareCardTerritory: {
    fontFamily: "DMSans-Regular",
    fontSize: 15,
    color: colors.white,
    opacity: 0.7,
    textAlign: "center",
    marginTop: spacing.xs,
    letterSpacing: 0.3,
  },
  shareCardTruth: {
    // THIS is the share-card headline per spec.
    fontFamily: "NewsreaderItalic",
    fontSize: 20,
    lineHeight: 30,
    color: colors.white,
    textAlign: "center",
    maxWidth: "88%",
  },
  shareCardEssence: {
    fontFamily: "NewsreaderItalic",
    fontSize: 14,
    lineHeight: 22,
    color: colors.white,
    textAlign: "center",
    opacity: 0.5,
    maxWidth: "85%",
  },
  shareButton: {
    minHeight: 56,
    marginTop: spacing["2xl"],
    backgroundColor: colors.ink,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonText: {
    fontFamily: "DMSans-SemiBold",
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.2,
  },
  doneButton: {
    minHeight: 44,
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    fontFamily: "DMSans-Medium",
    fontSize: 14,
    color: colors.white,
    opacity: 0.85,
  },
});
