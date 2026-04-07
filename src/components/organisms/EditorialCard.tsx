import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { useAuth } from "../../hooks/useAuth";
import { capture } from "../../services/posthog";
import { recordEvent } from "../../services/engagement";
import { colors, spacing, radius, typography } from "../../theme/tokens";

// Module-level flag — resets on cold start, persists across re-renders
// and tab switches within a session.
let hasFiredShownEvent = false;

type EditorialCardProps = {
  id?: string;
  headline: string;
  bodyText?: string;
  imageUrl: string;
  imageAlt?: string;
  ctaLabel: string;
  ctaUrl: string;
  archetypeFilter?: string;
  onPress?: () => void;
};

export function EditorialCard({
  id,
  headline,
  bodyText,
  imageUrl,
  imageAlt,
  ctaLabel,
  ctaUrl,
  archetypeFilter,
  onPress,
}: EditorialCardProps) {
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const eventPayload = {
    editorial_id: id ?? "unknown",
    headline,
    archetype_filter: archetypeFilter ?? "none",
  };

  useEffect(() => {
    if (hasFiredShownEvent) return;
    hasFiredShownEvent = true;
    capture("editorial_card_shown", eventPayload);
    recordEvent(user ?? null, "editorial_card_shown", eventPayload);
  }, []);

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    capture("editorial_card_clicked", eventPayload);
    recordEvent(user ?? null, "editorial_card_clicked", eventPayload);
    if (onPress) {
      onPress();
    } else {
      WebBrowser.openBrowserAsync(ctaUrl);
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityLabel={`${headline}. ${ctaLabel}.`}
    >
      {/* Image area */}
      <View style={styles.imageContainer}>
        {!imageLoaded && <View style={styles.skeleton} />}
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          accessibilityLabel={imageAlt ?? headline}
          onLoadEnd={() => setImageLoaded(true)}
        />
        <LinearGradient
          colors={["transparent", "rgba(26,24,20,0.55)"]}
          locations={[0.6, 1]}
          style={styles.imageGradient}
          pointerEvents="none"
        />
        <Text style={styles.headline}>{headline}</Text>
      </View>

      {/* Body + CTA */}
      {bodyText && <Text style={styles.bodyText}>{bodyText}</Text>}
      <Text style={styles.ctaLabel}>{ctaLabel}</Text>
    </Pressable>
  );
}

const IMAGE_HEIGHT = 220;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    overflow: "hidden",
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    backgroundColor: colors.warm100,
    position: "relative",
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.warm100,
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT,
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headline: {
    position: "absolute",
    bottom: spacing.xl,
    left: spacing.xl,
    right: spacing.xl,
    fontFamily: "Lora-SemiBold",
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
    color: colors.white,
  },
  bodyText: {
    ...typography.body,
    color: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  ctaLabel: {
    ...typography.uiLabel,
    color: colors.accent,
    fontFamily: "DMSans-SemiBold",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});
