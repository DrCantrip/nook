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

import { colors, spacing, archetypeTheme } from "../../src/theme/tokens";
import { ARCHETYPES, type ArchetypeContent } from "../../src/content/archetypes";
import { PERIOD_MODIFIERS } from "../../src/content/archetype-period-modifiers";
import { GrainOverlay } from "../../src/components/atoms/GrainOverlay";

const PANEL_COUNT = 4;

// Hardcoded mock data for visual testing.
const MOCK_ARCHETYPE_ID = "curator" as const;
const MOCK_PROPERTY_PERIOD = "victorian" as const;
const MOCK_INSIGHT =
  "You are The Curator, with a strong Nester streak. You've walked past the same chair in the shop window four times this month. You'd rather leave a wall empty than fill it with something that almost works — and yes, you know that's a little precious. You've rearranged the same three objects on your mantelpiece more times than you'd admit.";

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
    if (panelIndex <= 0) return;
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
              onDone={() => router.replace("/(auth)/welcome")}
            />
          </View>
        ) : (
          <View style={styles.tapRegion}>
            {/* Panel content fills the tap region. */}
            <View style={StyleSheet.absoluteFillObject}>
              {panelIndex === 0 && <Panel1Identity archetype={archetype} />}
              {panelIndex === 1 && (
                <Panel2Insight insight={MOCK_INSIGHT} archetype={archetype} />
              )}
              {panelIndex === 2 && (
                <Panel3Anchor archetype={archetype} periodModifier={periodModifier} />
              )}
            </View>

            {/* Split tap targets: left 33% = back, right 67% = advance. */}
            <View style={styles.tapSplit}>
              <Pressable
                onPress={goBack}
                style={styles.tapBack}
                disabled={panelIndex === 0}
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

            {/* Back chevron on panels 1 and 2 only. */}
            {(panelIndex === 1 || panelIndex === 2) && (
              <Pressable
                onPress={goBack}
                style={styles.backChevron}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <CaretLeft size={20} weight="light" color={colors.white} />
              </Pressable>
            )}
          </View>
        )}

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

function Panel2Insight({
  insight,
  archetype,
}: {
  insight: string;
  archetype: ArchetypeContent;
}) {
  const proseOpacity = useSharedValue(0);
  const truthOpacity = useSharedValue(0);

  useEffect(() => {
    proseOpacity.value = withTiming(1, { duration: 600 });
    truthOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, [proseOpacity, truthOpacity]);

  const proseStyle = useAnimatedStyle(() => ({ opacity: proseOpacity.value }));
  const truthStyle = useAnimatedStyle(() => ({ opacity: truthOpacity.value }));

  const proseText = insight.replace(archetype.description.behaviouralTruth, "").trim();

  // Archetype names within the prose render in Lora-SemiBold for identity weight.
  // Hardcoded list matches the mock prose — real reveal pulls from blend data.
  const emphasisPhrases = [archetype.displayName, "Nester"];

  return (
    <View style={styles.centred}>
      <Animated.Text style={[styles.proseText, proseStyle]}>
        {splitWithEmphasis(proseText, emphasisPhrases).map((seg, i) =>
          seg.emphasis ? (
            <Text key={i} style={styles.proseArchetype}>{seg.text}</Text>
          ) : (
            seg.text
          ),
        )}
      </Animated.Text>
      <View style={styles.behaviouralTruthGap} />
      <Animated.Text style={[styles.behaviouralTruth, truthStyle]}>
        {archetype.description.behaviouralTruth}
      </Animated.Text>
    </View>
  );
}

// Splits a string into segments where any of the provided phrases are marked
// for emphasis. First-match-wins on overlapping phrases. Used to render
// archetype names in Lora within DM Sans prose.
function splitWithEmphasis(
  text: string,
  phrases: string[],
): { text: string; emphasis: boolean }[] {
  const result: { text: string; emphasis: boolean }[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    // Try to match any phrase at the start.
    let startMatch: string | null = null;
    for (const p of phrases) {
      if (remaining.startsWith(p)) {
        startMatch = p;
        break;
      }
    }
    if (startMatch) {
      result.push({ text: startMatch, emphasis: true });
      remaining = remaining.slice(startMatch.length);
      continue;
    }
    // No match at start — advance to next phrase occurrence or end of string.
    let nextIdx = remaining.length;
    for (const p of phrases) {
      const idx = remaining.indexOf(p);
      if (idx !== -1 && idx < nextIdx) nextIdx = idx;
    }
    result.push({ text: remaining.slice(0, nextIdx), emphasis: false });
    remaining = remaining.slice(nextIdx);
  }
  return result;
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
    ...StyleSheet.absoluteFillObject,
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

  // Panel 2
  proseText: {
    fontFamily: "DMSans-Regular",
    fontSize: 17,
    lineHeight: 26,
    color: colors.white,
    textAlign: "center",
    maxWidth: "88%",
    opacity: 0.85,
  },
  proseArchetype: {
    // Lora-SemiBold for archetype name/secondary emphasis within prose.
    // fontSize + lineHeight inherit from parent Animated.Text.
    fontFamily: "Lora-SemiBold",
    color: colors.white,
  },
  behaviouralTruthGap: { height: 32 },
  behaviouralTruth: {
    // Spec: Newsreader-Italic. Loaded in the project as NewsreaderItalic.
    fontFamily: "NewsreaderItalic",
    fontSize: 28,
    lineHeight: 38,
    color: colors.white,
    textAlign: "center",
    maxWidth: "85%",
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
