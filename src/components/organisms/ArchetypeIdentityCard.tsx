// ArchetypeIdentityCard — Profile-tab card that surfaces the user's archetype
// identity and links to the deep read-out at /archetype-depth. Two variants:
//
//   populated — user has completed the quiz. Shows display name, style
//               territory, and a single-line motif tooltip. Tappable; routes
//               into archetype-depth.
//   empty     — user signed in without completing onboarding (edge case for
//               legacy accounts). Shows a soft prompt to take the quiz and
//               deep-links back into (onboarding).
//
// Background is the 8% archetype-section tint from tokens.tint(id, 'section').
// Empty variant uses warm100 since there is no archetype to theme from yet.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import type { ArchetypeContent } from '../../content/archetypes';
import { colors, radius, spacing, tint, typography } from '../../theme/tokens';

type Props =
  | { variant: 'populated'; archetype: ArchetypeContent }
  | { variant: 'empty' };

export function ArchetypeIdentityCard(props: Props) {
  if (props.variant === 'empty') {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, styles.cardEmpty, { opacity: pressed ? 0.85 : 1 }]}
        onPress={() => {
          Haptics.selectionAsync();
          router.push('/(onboarding)/swipe');
        }}
        accessibilityRole="button"
        accessibilityLabel="Take the 60-second quiz and find your style"
      >
        <Text style={styles.emptyHeadline}>Your style, unwritten.</Text>
        <Text style={styles.emptyBody}>
          Take the 60-second quiz and we will work out where you sit.
        </Text>
        <Text style={styles.emptyCta}>Start the quiz</Text>
      </Pressable>
    );
  }

  const { archetype } = props;
  const bgColor = tint(archetype.id, 'section');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bgColor, opacity: pressed ? 0.85 : 1 },
      ]}
      onPress={() => {
        Haptics.selectionAsync();
        router.push('/(app)/archetype-depth');
      }}
      accessibilityRole="button"
      accessibilityLabel={`${archetype.displayName}. ${archetype.styleTerritory}. Tap to read more.`}
    >
      <Text style={styles.territory}>{archetype.styleTerritory}</Text>
      <Text style={styles.displayName}>{archetype.displayName}</Text>
      <View style={styles.motifRow}>
        <View style={[styles.motifDot, { backgroundColor: archetype.accentColour }]} />
        <Text style={styles.motif}>{archetype.description.motifTooltip}</Text>
      </View>
      <Text style={styles.readMore}>Read your style</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.md,
  },
  cardEmpty: {
    backgroundColor: colors.warm100,
  },
  territory: {
    ...typography.uiLabel,
    color: colors.warm600,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  displayName: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  motifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  motifDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  motif: {
    ...typography.quote,
    color: colors.ink,
    flex: 1,
  },
  readMore: {
    ...typography.uiLabel,
    color: colors.accent,
    fontFamily: 'DMSans-SemiBold',
    marginTop: spacing.sm,
  },
  emptyHeadline: {
    ...typography.sectionHeading,
    color: colors.ink,
  },
  emptyBody: {
    ...typography.body,
    color: colors.warm600,
  },
  emptyCta: {
    ...typography.cta,
    color: colors.accent,
    marginTop: spacing.sm,
  },
});
