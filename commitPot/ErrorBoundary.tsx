import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string | null;
};

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      errorMessage:
        error instanceof Error ? error.message : 'Unexpected application error.',
    };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>予期せぬエラーが発生しました</Text>
        <Text style={styles.message}>
          しばらくしてからもう一度お試しください。
        </Text>
        {this.state.errorMessage ? (
          <Text style={styles.detail}>{this.state.errorMessage}</Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  detail: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
