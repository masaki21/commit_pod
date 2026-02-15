import React from 'react';
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import './i18n';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
const Root = () => {
  const Analytics =
    Platform.OS === 'web' ? require('@vercel/analytics/react').Analytics : null;

  return (
    <ErrorBoundary>
      <React.Fragment>
        <App />
        {Analytics ? <Analytics /> : null}
      </React.Fragment>
    </ErrorBoundary>
  );
};

if (typeof (global as any).ErrorUtils?.setGlobalHandler === 'function') {
  const originalHandler = (global as any).ErrorUtils.getGlobalHandler?.();
  (global as any).ErrorUtils.setGlobalHandler(
    (error: unknown, isFatal?: boolean) => {
      console.error('Global error:', error, { isFatal });
      if (typeof originalHandler === 'function') {
        originalHandler(error, isFatal);
      }
    }
  );
}

registerRootComponent(Root);
