// Dev-only legacy 4-panel reveal. Retired by REVEAL-1B. Scheduled for deletion after mock-first validates reveal-essence + reveal-share.
// S2-T4 — Archetype Result reveal screen.
// Single route, four internal panels advanced by tap. First real-client call
// to the S2-T4-INSIGHT Edge Function.
//
// Reference: canonical Section 7 Sprint 2 T4 spec, Section 0 13 April period-property
// Option B entry, Section 13 archetype rewrite loop (archetype_version logging).

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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import { supabase } from "../../src/lib/supabase";
import { useAuth } from "../../src/hooks/useAuth";
import { recordEvent } from "../../src/services/engagement";
import { colors, spacing } from "../../src/theme/tokens";
import {
  ARCHETYPES,
  type ArchetypeContent,
  type ArchetypeId,
} from "../../src/content/archetypes";
import {
  PERIOD_MODIFIERS,
  type PropertyPeriod,
} from "../../src/content/archetype-period-modifiers";

const PANEL_COUNT = 4;

type FallbackReason = "network" | "auth" | "generation" | "timeout" | null;

type RevealState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      archetype: ArchetypeContent;
      secondary: ArchetypeId | null;
      insight: string | null;       // null while Edge Function is in flight
      cached: boolean | null;
      fallbackUsed: boolean;
      fallbackReason: FallbackReason;
      propertyPeriod: PropertyPeriod | null;
    };

export default function ResultScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [state, setState] = useState<RevealState>({ status: "loading" });
  const [panelIndex, setPanelIndex] = useState(0);
  const revealShownFiredRef = useRef(false);
  const panel1TapReadyRef = useRef(false);

  // Prevent accidental skip of the identity reveal moment.
  useEffect(() => {
    panel1TapReadyRef.current = false;
    const t = setTimeout(() => {
      panel1TapReadyRef.current = true;
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  // Load archetype + call Edge Function.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      const { data: history, error: historyError } = await supabase
        .from("archetype_history")
        .select("primary_archetype, secondary_archetype, archetype_scores, recorded_at")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .single();

      if (historyError || !history) {
        if (!cancelled) setState({ status: "error" });
        return;
      }

      const primaryId = history.primary_archetype as ArchetypeId;
      const secondaryId = (history.secondary_archetype as ArchetypeId | null) ?? null;
      const archetype = ARCHETYPES[primaryId];

      if (!archetype) {
        if (!cancelled) setState({ status: "error" });
        return;
      }

      const { data: userRow } = await supabase
        .from("users")
        .select("property_period")
        .eq("id", userId)
        .single();
      const propertyPeriod = (userRow?.property_period as PropertyPeriod | null) ?? null;

      if (!cancelled) {
        setState({
          status: "ready",
          archetype,
          secondary: secondaryId,
          insight: null,
          cached: null,
          fallbackUsed: false,
          fallbackReason: null,
          propertyPeriod,
        });
      }

      // Call Edge Function for blended insight.
      let insightText: string | null = null;
      let cached: boolean | null = null;
      let fallbackUsed = false;
      let fallbackReason: FallbackReason = null;

      try {
        const { data, error } = await supabase.functions.invoke("generate-share-insight", {
          body: { user_id: userId },
        });

        if (error) {
          const msg = (error.message ?? "").toLowerCase();
          if (msg.includes("auth") || msg.includes("401") || msg.includes("403")) {
            fallbackReason = "auth";
          } else {
            fallbackReason = "network";
          }
          throw error;
        }

        if (!data?.insight || data.insight === "BLEND_GENERATION_FAILED") {
          fallbackReason = "generation";
          throw new Error("generation failed");
        }

        insightText = data.insight as string;
        cached = Boolean(data.cached);
      } catch {
        insightText = `You are ${archetype.displayName}. ${archetype.description.essenceLine} ${archetype.description.behaviouralTruth}`;
        fallbackUsed = true;
        if (!fallbackReason) fallbackReason = "network";
      }

      if (!cancelled) {
        setState((prev) =>
          prev.status === "ready"
            ? { ...prev, insight: insightText, cached, fallbackUsed, fallbackReason }
            : prev,
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Fire reveal_shown once when ready.
  useEffect(() => {
    if (state.status !== "ready" || revealShownFiredRef.current || !session?.user) return;
    revealShownFiredRef.current = true;
    recordEvent(session.user, "reveal_shown", {
      primary_archetype: state.archetype.id,
      secondary_archetype: state.secondary,
      cached: state.cached,
      fallback_used: state.fallbackUsed,
      fallback_reason: state.fallbackReason,
      _archetypeVersion: state.archetype.version,
    });
  }, [state, session?.user]);

  const advance = () => {
    if (panelIndex >= PANEL_COUNT - 1) return;
    if (panelIndex === 0 && !panel1TapReadyRef.current) return;
    const from = panelIndex;
    const to = from + 1;
    setPanelIndex(to);
    if (state.status === "ready" && session?.user) {
      recordEvent(session.user, "reveal_panel_changed", {
        from_panel: from,
        to_panel: to,
        primary_archetype: state.archetype.id,
        _archetypeVersion: state.archetype.version,
      });
    }
  };

  const handleShare = async () => {
    if (state.status !== "ready") return;
    const { archetype } = state;
    const message = `I'm ${archetype.displayName} · ${archetype.styleTerritory}. ${archetype.description.essenceLine} Find your home style on Cornr. cornr.co.uk`;
    try {
      const result = await Share.share({ message });
      if (result.action !== Share.dismissedAction && session?.user) {
        recordEvent(session.user, "share_initiated", {
          primary_archetype: archetype.id,
          essence_line: archetype.description.essenceLine,
          _archetypeVersion: archetype.version,
        });
      }
    } catch {
      // Swallow — user cancelling share is not an error we surface.
    }
  };

  if (state.status === "loading") {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingDot}>…</Text>
        </View>
      </>
    );
  }

  if (state.status === "error") {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorScreen}>
          <Text style={styles.errorTitle}>
            We couldn't find your quiz result.
          </Text>
          <Pressable
            onPress={() => router.replace("/(onboarding)/swipe")}
            style={({ pressed }) => [
              styles.errorButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Try the quiz again"
          >
            <Text style={styles.errorButtonText}>Try again</Text>
          </Pressable>
        </View>
      </>
    );
  }

  const { archetype, insight, propertyPeriod } = state;
  const isSharePanel = panelIndex === PANEL_COUNT - 1;
  const periodModifier =
    propertyPeriod != null ? PERIOD_MODIFIERS[archetype.id]?.[propertyPeriod] ?? null : null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[lighten(archetype.accentColour, 0.25), darken(archetype.accentColour, 0.35)]}
        style={styles.container}
      >
        {isSharePanel ? (
          <View style={styles.tapRegion}>
            <Panel4ShareCard
              archetype={archetype}
              onShare={handleShare}
              onDone={() => router.replace("/(app)/home")}
            />
          </View>
        ) : (
          <Pressable
            onPress={advance}
            style={styles.tapRegion}
            accessibilityRole="button"
            accessibilityLabel="Advance to next panel"
          >
            {panelIndex === 0 && <Panel1Identity archetype={archetype} />}
            {panelIndex === 1 && <Panel2Insight insight={insight} archetype={archetype} />}
            {panelIndex === 2 && (
              <Panel3Anchor archetype={archetype} periodModifier={periodModifier} />
            )}
          </Pressable>
        )}
      </LinearGradient>
    </>
  );
}

// ── Panel 1: identity reveal ─────────────────────────────

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
  const territoryStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.centred}>
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

// ── Panel 2: blended insight ─────────────────────────────

function Panel2Insight({
  insight,
  archetype,
}: {
  insight: string | null;
  archetype: ArchetypeContent;
}) {
  const proseOpacity = useSharedValue(0);
  const truthOpacity = useSharedValue(0);

  useEffect(() => {
    if (insight != null) {
      proseOpacity.value = withTiming(1, { duration: 600 });
      truthOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    }
  }, [insight, proseOpacity, truthOpacity]);

  const proseStyle = useAnimatedStyle(() => ({ opacity: proseOpacity.value }));
  const truthStyle = useAnimatedStyle(() => ({ opacity: truthOpacity.value }));

  if (insight == null) {
    return (
      <View style={styles.centred}>
        <Text style={styles.loadingDot}>…</Text>
      </View>
    );
  }

  // Haiku is instructed to close with the behavioural truth verbatim; strip it
  // from the prose so we can render it separately with typographic emphasis.
  const proseText = insight.replace(archetype.description.behaviouralTruth, "").trim();

  return (
    <View style={styles.centred}>
      <Animated.Text style={[styles.insightText, proseStyle]}>{proseText}</Animated.Text>
      <View style={styles.behaviouralTruthGap} />
      <Animated.Text style={[styles.behaviouralTruth, truthStyle]}>
        {archetype.description.behaviouralTruth}
      </Animated.Text>
      <Text style={styles.tapHint}>Tap to continue</Text>
    </View>
  );
}

// ── Panel 3: sensory anchor + period modifier ────────────

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
        <Text style={styles.periodModifier}>{periodModifier}</Text>
      )}
      <Text style={styles.tapHint}>Tap to continue</Text>
    </View>
  );
}

// ── Panel 4: share card ──────────────────────────────────

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
        <Text style={styles.shareCardName}>{archetype.displayName}</Text>
        <Text style={styles.shareCardTerritory}>{archetype.styleTerritory}</Text>
        <View style={styles.shareCardGap} />
        <Text style={styles.shareCardEssence}>{archetype.description.essenceLine}</Text>
        <View style={styles.shareCardGap} />
        <Text style={styles.shareCardFooter}>Find your home style on cornr.co.uk</Text>
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
        accessibilityLabel="Continue to home"
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </Pressable>
    </View>
  );
}

// ── colour helpers ───────────────────────────────────────

function lighten(hex: string, amount: number): string {
  return mix(hex, "#FFFFFF", amount);
}

function darken(hex: string, amount: number): string {
  return mix(hex, "#000000", amount);
}

function mix(hex: string, target: string, amount: number): string {
  const a = parseHex(hex);
  const b = parseHex(target);
  const r = Math.round(a.r + (b.r - a.r) * amount);
  const g = Math.round(a.g + (b.g - a.g) * amount);
  const bl = Math.round(a.b + (b.b - a.b) * amount);
  return `rgb(${r}, ${g}, ${bl})`;
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

// ── styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  tapRegion: { flex: 1 },
  centred: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
  },
  loadingDot: {
    fontFamily: "NewsreaderItalic",
    fontSize: 40,
    color: colors.ink,
    opacity: 0.5,
  },
  errorScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    fontFamily: "Lora-SemiBold",
    fontSize: 20,
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing["2xl"],
  },
  errorButton: {
    minHeight: 44,
    paddingHorizontal: spacing["2xl"],
    backgroundColor: colors.ink,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  errorButtonText: {
    fontFamily: "DMSans-SemiBold",
    fontSize: 16,
    color: colors.white,
  },
  kicker: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: colors.ink,
    opacity: 0.7,
    marginBottom: spacing.md,
  },
  displayName: {
    fontFamily: "Lora-Bold",
    fontSize: 52,
    color: colors.ink,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  styleTerritory: {
    fontFamily: "DMSans-Regular",
    fontSize: 18,
    color: colors.ink,
    opacity: 0.85,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  insightText: {
    fontFamily: "NewsreaderItalic",
    fontSize: 22,
    lineHeight: 32,
    color: colors.ink,
    textAlign: "center",
    maxWidth: "85%",
  },
  behaviouralTruthGap: { height: spacing.xl },
  behaviouralTruth: {
    fontFamily: "NewsreaderItalic",
    fontSize: 26,
    lineHeight: 36,
    color: colors.ink,
    textAlign: "center",
    maxWidth: "85%",
    fontStyle: "italic",
  },
  sensoryAnchor: {
    fontFamily: "NewsreaderItalic",
    fontSize: 20,
    lineHeight: 30,
    color: colors.ink,
    textAlign: "center",
    maxWidth: "85%",
  },
  periodModifier: {
    fontFamily: "NewsreaderItalic",
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
    opacity: 0.8,
    textAlign: "center",
    maxWidth: "85%",
    marginTop: spacing["2xl"],
  },
  tapHint: {
    position: "absolute",
    bottom: spacing["4xl"],
    fontFamily: "DMSans-Regular",
    fontSize: 13,
    color: colors.ink,
    opacity: 0.5,
  },
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
  shareCardName: {
    fontFamily: "Lora-Bold",
    fontSize: 42,
    color: colors.ink,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  shareCardTerritory: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: colors.ink,
    opacity: 0.7,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  shareCardGap: { height: spacing["3xl"] },
  shareCardEssence: {
    fontFamily: "NewsreaderItalic",
    fontSize: 24,
    lineHeight: 34,
    color: colors.ink,
    textAlign: "center",
    maxWidth: "80%",
  },
  shareCardFooter: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    color: colors.ink,
    opacity: 0.6,
    textAlign: "center",
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
    color: colors.ink,
    opacity: 0.7,
  },
});
