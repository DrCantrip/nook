import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import { Sentry } from '../../services/sentry';
import { supabase } from '../../lib/supabase';
import { ErrorScreenTemplate } from './ErrorScreenTemplate';

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
    const stack = this.state.error?.stack ?? 'No stack trace available';
    const message = this.state.error?.message ?? 'Unknown';
    const reportBody = `Crash report\n\nMessage: ${message}\n\nStack:\n${stack}`;

    // TODO(T-RENAME): swap to hello@cornr.co.uk when Google Workspace is live in Sprint 4
    const mailto = `mailto:daryll.cowan@gmail.com?subject=${encodeURIComponent('Cornr crash report')}&body=${encodeURIComponent(reportBody)}`;
    Linking.openURL(mailto);
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
