import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../theme/tokens';

type ErrorScreenAction = {
  label: string;
  onPress: () => void;
};

type ErrorScreenTemplateProps = {
  title: string;
  body: string;
  primaryAction: ErrorScreenAction;
  secondaryAction?: ErrorScreenAction;
};

export function ErrorScreenTemplate({
  title,
  body,
  primaryAction,
  secondaryAction,
}: ErrorScreenTemplateProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <Text style={[styles.wordmark, { marginTop: spacing['3xl'] }]}>cornr</Text>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>

        <View style={styles.primaryWrapper}>
          <Pressable
            onPress={primaryAction.onPress}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.primaryLabel}>{primaryAction.label}</Text>
          </Pressable>
        </View>

        {secondaryAction && (
          <Pressable
            onPress={secondaryAction.onPress}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.secondaryLabel}>{secondaryAction.label}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: 'Lora-Bold',
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  content: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  body: {
    ...typography.body,
    color: colors.ink,
    textAlign: 'center',
    maxWidth: 320,
    marginTop: spacing.lg,
  },
  primaryWrapper: {
    backgroundColor: colors.accentSurface,
    borderRadius: radius.button,
    marginTop: spacing['3xl'],
    overflow: 'hidden',
    width: '100%',
    maxWidth: 320,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  primaryLabel: {
    ...typography.cta,
    color: colors.white,
  },
  secondaryButton: {
    marginTop: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: spacing.md,
  },
  secondaryLabel: {
    ...typography.uiLabel,
    color: colors.accent,
  },
});
