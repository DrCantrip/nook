// Profile tab — REVEAL-1B block layout.
//
// Replaces the placeholder with a block-structured read-out of what Cornr
// knows about the user. Layout (top-to-bottom):
//   1. Essence header         — archetype name + territory, or a soft prompt
//                               for users who have not completed the quiz
//   2. ArchetypeIdentityCard  — tappable, routes to /archetype-depth
//   3. YOUR COLLECTION        — rooms + wishlist counts (bucketed labels)
//   4. WHAT CORNR KNOWS       — journey stage, home status, property period,
//                               region, member since
//   5. PREFERENCES            — email opt-in, audience data opt-in (read-only,
//                               changes land via openProfileGetInTouch)
//   6. Disclosure paragraph   — what we do with this data
//   7. Actions                — Retake, Something wrong, Delete my account
//
// Anonymous users see a sign-up prompt in place of the preferences/actions
// block — we don't want to surface delete or retake flows on a session that
// has no persistent account to operate on.
//
// Fires profile_viewed once per session on mount.

import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useAuth } from '../../src/hooks/useAuth';
import { useProfile } from '../../src/hooks/useProfile';
import { ArchetypeIdentityCard } from '../../src/components/organisms/ArchetypeIdentityCard';
import { recordEvent } from '../../src/services/engagement';
import {
  openProfileDeleteAccount,
  openProfileGetInTouch,
} from '../../src/lib/support';
import {
  HOME_STATUS_LABELS,
  JOURNEY_LABELS,
  PROPERTY_PERIOD_LABELS,
  postcodeToRegion,
} from '../../src/content/profile-labels';
import { bucketCount } from '../../src/utils/bucket';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

let hasFiredViewed = false;

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const isAnonymous = user?.is_anonymous === true;
  const result = useProfile(user?.id ?? null);
  const viewedFiredRef = useRef(false);

  useEffect(() => {
    if (result.status !== 'ready' || !user || viewedFiredRef.current || hasFiredViewed) return;
    viewedFiredRef.current = true;
    hasFiredViewed = true;
    recordEvent(user, 'profile_viewed', {
      has_archetype: result.data.archetype != null,
      is_anonymous: isAnonymous,
    });
  }, [result, user, isAnonymous]);

  if (result.status === 'loading') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingDot}>…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (result.status === 'error') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <Text style={styles.errorTitle}>We couldn't load your profile.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const {
    email,
    journeyStage,
    homeStatus,
    propertyPeriod,
    postcodeDistrict,
    emailMarketingOptIn,
    audienceDataOptIn,
    memberSince,
    archetype,
    roomsCount,
    wishlistCount,
  } = result.data;

  const onRetake = () => {
    if (!user) return;
    Haptics.selectionAsync();
    recordEvent(user, 'profile_retake_tapped', {
      has_archetype: archetype != null,
    });
    router.push('/(onboarding)/swipe');
  };

  const onGetInTouch = () => {
    if (user) {
      recordEvent(user, 'profile_get_in_touch_tapped', {});
    }
    openProfileGetInTouch();
  };

  const onDelete = () => {
    if (user) {
      recordEvent(user, 'profile_delete_account_tapped', {});
    }
    openProfileDeleteAccount();
  };

  const onSignOut = async () => {
    Haptics.selectionAsync();
    await signOut();
    // Auth guard in app/_layout.tsx detects null session and replaces to /(auth)/welcome.
  };

  const memberSinceLabel = formatMemberSince(memberSince);
  const regionLabel = postcodeToRegion(postcodeDistrict);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 1. Essence header */}
        {archetype ? (
          <View style={styles.essenceHeader}>
            <Text style={styles.kicker}>Your style</Text>
            <Text style={styles.essenceName}>{archetype.displayName}</Text>
            <Text style={styles.essenceTerritory}>{archetype.styleTerritory}</Text>
          </View>
        ) : (
          <View style={styles.essenceHeader}>
            <Text style={styles.kicker}>Your profile</Text>
            <Text style={styles.essenceName}>Every corner, considered.</Text>
          </View>
        )}

        {/* 2. ArchetypeIdentityCard */}
        {archetype ? (
          <ArchetypeIdentityCard variant="populated" archetype={archetype} />
        ) : (
          <ArchetypeIdentityCard variant="empty" />
        )}

        {/* 3. YOUR COLLECTION */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>Your collection</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Rooms</Text>
            <Text style={styles.rowValue}>{countLabel(roomsCount, 'room')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Wishlist</Text>
            <Text style={styles.rowValue}>{countLabel(wishlistCount, 'item')}</Text>
          </View>
        </View>

        {/* 4. WHAT CORNR KNOWS */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>What Cornr knows</Text>

          <FactRow label="Email" value={email} />
          <FactRow
            label="Where you're at"
            value={journeyStage ? JOURNEY_LABELS[journeyStage] : null}
          />
          <FactRow
            label="Home status"
            value={homeStatus ? HOME_STATUS_LABELS[homeStatus] : null}
          />
          <FactRow
            label="Property"
            value={propertyPeriod ? PROPERTY_PERIOD_LABELS[propertyPeriod] : null}
          />
          <FactRow label="Area" value={regionLabel} />
          <FactRow label="Member since" value={memberSinceLabel} last />
        </View>

        {/* 5. PREFERENCES */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>Preferences</Text>

          <FactRow
            label="Style tips by email"
            value={emailMarketingOptIn ? 'On' : 'Off'}
          />
          <FactRow
            label="Help shape style insights"
            value={audienceDataOptIn ? 'On' : 'Off'}
            last
          />

          <Text style={styles.blockFooter}>
            To change any of this, use Something wrong below.
          </Text>
        </View>

        {/* 6. Disclosure */}
        <Text style={styles.disclosure}>
          Cornr uses this to pick products for you, and in anonymised trends we share with
          partner brands only where you have opted in. We never share who you are. You can
          change your mind at any time.
        </Text>

        {/* 7. Actions */}
        {!isAnonymous && (
          <View style={styles.actions}>
            <Pressable
              onPress={onRetake}
              style={({ pressed }) => [styles.action, { opacity: pressed ? 0.85 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel="Retake the style quiz"
            >
              <Text style={styles.actionText}>Retake the style quiz</Text>
            </Pressable>
            <Pressable
              onPress={onGetInTouch}
              style={({ pressed }) => [styles.action, { opacity: pressed ? 0.85 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel="Something wrong? Get in touch"
            >
              <Text style={styles.actionText}>Something wrong? Get in touch</Text>
            </Pressable>
            <Pressable
              onPress={onDelete}
              style={({ pressed }) => [styles.action, { opacity: pressed ? 0.85 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel="Delete my account"
            >
              <Text style={styles.actionDanger}>Delete my account</Text>
            </Pressable>
            <Pressable
              onPress={onSignOut}
              style={({ pressed }) => [styles.action, { opacity: pressed ? 0.85 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <Text style={styles.actionText}>Sign out</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FactRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string | null;
  last?: boolean;
}) {
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, value == null && styles.rowValueMuted]}>
          {value ?? 'Not set'}
        </Text>
      </View>
      {!last && <View style={styles.divider} />}
    </>
  );
}

function countLabel(n: number, noun: 'room' | 'item'): string {
  const bucket = bucketCount(n);
  if (bucket === '0') return `No ${noun}s yet`;
  const plural = n === 1 ? noun : `${noun}s`;
  return `${n} ${plural}`;
}

function formatMemberSince(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['4xl'],
    gap: spacing['3xl'],
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingDot: {
    fontFamily: 'NewsreaderItalic',
    fontSize: 40,
    color: colors.ink,
    opacity: 0.5,
  },
  errorTitle: {
    ...typography.sectionHeading,
    color: colors.ink,
    textAlign: 'center',
  },
  essenceHeader: {
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
  blockFooter: {
    ...typography.uiLabel,
    color: colors.warm600,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xs,
  },
  rowLabel: {
    ...typography.body,
    color: colors.warm600,
    flex: 1,
  },
  rowValue: {
    ...typography.body,
    color: colors.ink,
    textAlign: 'right',
    flexShrink: 1,
  },
  rowValueMuted: {
    color: colors.warm400,
  },
  divider: {
    height: 1,
    backgroundColor: colors.warm100,
  },
  disclosure: {
    ...typography.uiLabel,
    color: colors.warm600,
    lineHeight: 20,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  action: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  actionText: {
    ...typography.cta,
    color: colors.accent,
  },
  actionDanger: {
    ...typography.cta,
    color: colors.error,
  },
});
