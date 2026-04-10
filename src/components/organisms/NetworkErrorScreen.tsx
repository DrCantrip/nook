import React from 'react';
import { useRouter } from 'expo-router';
import { ErrorScreenTemplate } from './ErrorScreenTemplate';
import { errorCopy, ErrorCopyKey, ErrorCopyIntent } from '../../content/errors';
import { openSupportReport } from '../../lib/support';

type NetworkErrorScreenProps = {
  errorKey: ErrorCopyKey;
  onRetry?: () => void;
  onDismiss?: () => void;
};

export function NetworkErrorScreen({
  errorKey,
  onRetry,
  onDismiss,
}: NetworkErrorScreenProps) {
  const router = useRouter();
  const copy = errorCopy[errorKey];

  const resolveIntent = (intent: ErrorCopyIntent): (() => void) => {
    switch (intent) {
      case 'home':
        return () => router.replace('/');
      case 'retry':
        if (!onRetry) {
          console.warn(
            `NetworkErrorScreen: errorKey="${errorKey}" uses 'retry' intent but no onRetry callback was provided. Falling back to home navigation.`
          );
          return () => router.replace('/');
        }
        return onRetry;
      case 'signIn':
        return () => router.push('/(auth)/sign-in');
      case 'signUp':
        return () => router.push('/(auth)/sign-up');
      case 'dismiss':
        if (!onDismiss) {
          console.warn(
            `NetworkErrorScreen: errorKey="${errorKey}" uses 'dismiss' intent but no onDismiss callback was provided. Falling back to router.back().`
          );
          return () => router.back();
        }
        return onDismiss;
      case 'support':
        return () => openSupportReport({ errorKey });
    }
  };

  return (
    <ErrorScreenTemplate
      title={copy.title}
      body={copy.body}
      primaryAction={{
        label: copy.primaryAction.label,
        onPress: resolveIntent(copy.primaryAction.intent),
      }}
      secondaryAction={
        copy.secondaryAction
          ? {
              label: copy.secondaryAction.label,
              onPress: resolveIntent(copy.secondaryAction.intent),
            }
          : undefined
      }
    />
  );
}
