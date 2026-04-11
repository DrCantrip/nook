import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Sentry } from '../../services/sentry';
import { supabase } from '../../lib/supabase';
import { ErrorScreenTemplate } from './ErrorScreenTemplate';
import { openSupportReport } from '../../lib/support';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    let userId: string | undefined;
    try {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id;
    } catch {
      // No session — continue without user context
    }

    Sentry.withScope((scope) => {
      scope.setLevel('fatal');

      if (userId) {
        scope.setUser({ id: userId });
      }

      scope.setContext('device', {
        appVersion: Constants.expoConfig?.version ?? 'unknown',
        sdkVersion: Constants.expoConfig?.sdkVersion ?? 'unknown',
        platform: Platform.OS,
      });

      scope.setContext('componentStack', {
        stack: errorInfo.componentStack ?? 'unavailable',
      });

      Sentry.captureException(error);
    });
  }

  private reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private reportCrash = () => {
    openSupportReport({
      errorKey: 'genericUnknown',
      stackTrace: this.state.error?.stack ?? 'No stack trace available',
      componentStack: this.state.errorInfo?.componentStack ?? undefined,
      additionalContext: `Message: ${this.state.error?.message ?? 'Unknown'}`,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreenTemplate
          title="Something went west"
          body="We hit a bump, but your style is safe. Take a breath, then head back to where you were."
          primaryAction={{ label: 'Take me home', onPress: this.reset }}
          secondaryAction={{ label: 'Report this', onPress: this.reportCrash }}
        />
      );
    }

    return this.props.children;
  }
}
