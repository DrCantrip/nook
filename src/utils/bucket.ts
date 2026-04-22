// Bucketed count helpers for analytics payloads. Security-adjacent utility:
// raw counts leak user-level information (how many rooms, how many wishlisted
// items). Bucketing preserves signal for cohort analysis while stripping
// fingerprint-level precision.
//
// Usage:
//   recordEvent(user, 'profile_viewed', {
//     rooms_bucket: bucketCount(roomsCount),
//     wishlist_bucket: bucketCount(wishlistCount),
//   });

export type CountBucket = '0' | '1-5' | '6-20' | '21+';

export function bucketCount(n: number): CountBucket {
  if (n === 0) return '0';
  if (n <= 5) return '1-5';
  if (n <= 20) return '6-20';
  return '21+';
}
