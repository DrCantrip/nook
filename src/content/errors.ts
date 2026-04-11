/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  CORNR ERROR COPY LIBRARY — CANONICAL SOURCE                          ║
 * ╠═══════════════════════════════════════════════════════════════════════╣
 * ║                                                                       ║
 * ║  All user-facing error copy in Cornr lives in this file. Do not       ║
 * ║  invent error copy in components — add an entry here and reference    ║
 * ║  it by key.                                                           ║
 * ║                                                                       ║
 * ║  VOICE RULES (BDS v3 Section 2.2):                                    ║
 * ║  - Calm, reassuring, actionable                                       ║
 * ║  - Never blame the user                                               ║
 * ║  - Always reassure that nothing is lost (when applicable)             ║
 * ║  - Never use technical language                                       ║
 * ║                                                                       ║
 * ║  BANNED WORDS in user-facing copy:                                    ║
 * ║  error, failed, exception, timeout, unable, invalid, crash, problem   ║
 * ║                                                                       ║
 * ║  TONAL ANCHOR:                                                        ║
 * ║  "Something went west" — slightly British, slightly warm, willing     ║
 * ║  to have a voice without performing. Cornr's error states are the     ║
 * ║  first surface where users discover the app has a personality. The    ║
 * ║  voice rules above are necessary but not sufficient — there is a      ║
 * ║  personality budget here that should be spent, not preserved. Do      ║
 * ║  not sand these edges off in future sessions.                         ║
 * ║                                                                       ║
 * ║  ADDING NEW ENTRIES:                                                  ║
 * ║  Every new entry must be voice-gated by Daryll before merge.          ║
 * ║  Run the gate even if the copy "feels obvious." The act of running    ║
 * ║  the gate is non-optional per canonical 10 April standing rule.       ║
 * ║                                                                       ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

export type ErrorCopyIntent =
  | 'home'
  | 'retry'
  | 'signIn'
  | 'signUp'
  | 'dismiss'
  | 'support';

export type ErrorCopyAction = {
  label: string;
  intent: ErrorCopyIntent;
};

export type ErrorCopy = {
  title: string;
  body: string;
  primaryAction: ErrorCopyAction;
  secondaryAction?: ErrorCopyAction;
};

export type ErrorCopyKey =
  | 'genericUnknown'
  | 'networkFailure'
  | 'supabaseUnavailable'
  | 'edgeFunctionTimeout'
  | 'recommendationEmpty'
  | 'quizSaveFailed'
  | 'signUpFailed'
  | 'signInFailed'
  | 'wishlistSyncFailed'
  | 'imageLoadFailed';

export const errorCopy: Record<ErrorCopyKey, ErrorCopy> = {
  // Anchor — global crash fallback rendered by ErrorBoundary.
  // Already shipped in LR-ERROR-BOUNDARY but lives here as the canonical source.
  genericUnknown: {
    title: 'Something went west',
    body: 'We hit a bump, but your style is safe. Take a breath, then head back to where you were.',
    primaryAction: { label: 'Take me home', intent: 'home' },
    secondaryAction: { label: 'Report this', intent: 'support' },
  },

  // Generic network failure — device offline or backend unreachable.
  // Responsibility signal: implies user's connection (action: check it).
  networkFailure: {
    title: 'No signal getting through',
    body: "Check your connection, then give it another go. We've kept your place.",
    primaryAction: { label: 'Try again', intent: 'retry' },
  },

  // Supabase specifically unreachable — distinct from generic network failure
  // because we're admitting our backend is the slow part.
  // Responsibility signal: explicit "our end is being slow."
  supabaseUnavailable: {
    title: "We're having a moment",
    body: 'Our end is being slow. Give it a beat, then try again.',
    primaryAction: { label: 'Try again', intent: 'retry' },
    secondaryAction: { label: 'Take me home', intent: 'home' },
  },

  // Haiku Edge Function timed out generating recommendations.
  // Responsibility signal: "longer than they should" — admits this is a bug.
  edgeFunctionTimeout: {
    title: 'Still thinking this through',
    body: 'Our recommendations are taking longer than they should. Try again, or come back in a minute.',
    primaryAction: { label: 'Try again', intent: 'retry' },
    secondaryAction: { label: 'Take me home', intent: 'home' },
  },

  // Recommendation engine returned zero valid products. Rare but real.
  // Responsibility signal: "yet" implies temporary state, not permanent failure.
  recommendationEmpty: {
    title: 'Nothing quite fits yet',
    body: "We couldn't find the right pieces for this room at this budget yet. Try widening your range, or come back later — we add new finds regularly.",
    primaryAction: { label: 'Adjust budget', intent: 'home' },
    secondaryAction: { label: 'Take me home', intent: 'home' },
  },

  // Archetype quiz didn't save — signup race condition or backend hiccup.
  // Responsibility signal: "this one's on us" — explicit ownership of fault.
  quizSaveFailed: {
    title: "Couldn't save that one",
    body: "Your swipes are still here — this one's on us. One more go should do it.",
    primaryAction: { label: 'Try again', intent: 'retry' },
  },

  // Sign-up form submit didn't go through.
  // Responsibility signal: "have a look at" implies user check (gentle).
  signUpFailed: {
    title: "Couldn't create your account",
    body: 'Have a look at your email and password, then try again.',
    primaryAction: { label: 'Try again', intent: 'retry' },
    secondaryAction: { label: 'Already have an account? Sign in', intent: 'signIn' },
  },

  // Sign-in form submit didn't authenticate.
  // Responsibility signal: implies user credential check, offers reset path.
  signInFailed: {
    title: "That didn't match",
    body: "Check your email and password. If you've forgotten the password, tap below to reset it.",
    primaryAction: { label: 'Try again', intent: 'retry' },
    secondaryAction: { label: 'Reset password', intent: 'support' },
  },

  // Wishlist add/remove didn't sync to backend.
  // Responsibility signal: "your wishlist is safe" reassures, "didn't land" is neutral.
  wishlistSyncFailed: {
    title: "Couldn't save that piece",
    body: "Your wishlist is safe — this one just didn't land. Try the heart again.",
    primaryAction: { label: 'Got it', intent: 'dismiss' },
  },

  // Inline error: a product card image failed to load.
  // Responsibility signal: "couldn't make it through" implies network/transit, not blame.
  // "Out walking the dog" is a Geordie phrase — intentional voice moment.
  imageLoadFailed: {
    title: 'Out walking the dog',
    body: "This one couldn't make it through — the rest of your recommendations are fine.",
    primaryAction: { label: 'Got it', intent: 'dismiss' },
  },
};
