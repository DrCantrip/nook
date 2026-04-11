// TODO(T2): delete this harness and the parent route once SwipeDeck is built.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SwipeCard } from '../SwipeCard';
import { tokens } from '../../../theme/tokens';

const TEST_IMAGE = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';

export function SwipeCardHarness() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Swipe me</Text>
      <View style={styles.cardWrapper}>
        <SwipeCard
          imageUrl={TEST_IMAGE}
          accessibilityLabel="A warm minimal living room with natural light"
          onSwipeLove={() => console.log('LOVE')}
          onSwipePass={() => console.log('PASS')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.cream,
    padding: tokens.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginBottom: tokens.spacing['2xl'],
    color: tokens.colors.warm600,
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
  },
  cardWrapper: {
    width: '85%',
  },
});
