import { Linking } from 'react-native';
import Constants from 'expo-constants';

// TODO T-RENAME (Sprint 4): swap to hello@cornr.co.uk once Google Workspace is live
const SUPPORT_EMAIL = 'daryll.cowan@gmail.com';

type SupportContext = {
  errorKey?: string;
  stackTrace?: string;
  componentStack?: string;
  additionalContext?: string;
};

/**
 * Opens the user's mail client with a pre-filled crash/error report.
 * Used by ErrorBoundary (with stack traces) and NetworkErrorScreen (with errorKey context).
 *
 * Future enhancement: log a 'support_report_opened' PostHog event for telemetry on
 * how often users actually try to report errors. Not in v1.
 */
export function openSupportReport(context: SupportContext = {}): void {
  const subject = encodeURIComponent('Cornr crash report');

  const bodyParts: string[] = ['Crash report', ''];

  if (context.errorKey) {
    bodyParts.push(`Error key: ${context.errorKey}`);
  }

  if (context.stackTrace) {
    bodyParts.push('', 'Stack trace:', context.stackTrace);
  }

  if (context.componentStack) {
    bodyParts.push('', 'Component stack:', context.componentStack);
  }

  if (context.additionalContext) {
    bodyParts.push('', 'Additional context:', context.additionalContext);
  }

  bodyParts.push('', '---', `App version: ${Constants.expoConfig?.version ?? 'unknown'}`);

  const body = encodeURIComponent(bodyParts.join('\n'));
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

  Linking.openURL(mailto).catch((err) => {
    // Mail client unavailable — logged silently, no user-facing error
    // (we don't want a meta-error if the user is already trying to report an error)
    console.warn('Could not open mail client for support report:', err);
  });
}

// Profile tab "Something wrong?" CTA. Covers GDPR Article 15/16/21 intents
// via a single mailto with an intent selector. No user_id in the body —
// sender's email address is the identifier Cornr matches on receipt.
export function openProfileGetInTouch(): void {
  const subject = encodeURIComponent('Cornr profile request');
  const body = encodeURIComponent(
    [
      "What I'd like to do:",
      '[ ] Update my life stage, home status, or property details',
      '[ ] Stop using my data for style recommendations',
      '[ ] Delete my account',
      '[ ] Something else',
      '',
      'Please leave any extra details below:',
      '',
      '',
    ].join('\n'),
  );
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

  Linking.openURL(mailto).catch((err) => {
    console.warn('Could not open mail client for profile request:', err);
  });
}

// Profile "Delete my account" fallback mailto. In-app delete flow is S5-T3
// (Apple 5.1.1(v) compliance, required before TestFlight). This mailto is
// the v0 stopgap. No user_id in body; sender's email is the identifier.
export function openProfileDeleteAccount(): void {
  const subject = encodeURIComponent('Delete my Cornr account');
  const body = encodeURIComponent(
    [
      'Please delete my Cornr account and all associated data.',
      '',
      'Optional. What could we have done better?',
      '',
      '',
    ].join('\n'),
  );
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

  Linking.openURL(mailto).catch((err) => {
    console.warn('Could not open mail client for delete account:', err);
  });
}
