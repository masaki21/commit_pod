import React from 'react';
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import './i18n';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
const Root = () => {
  const Analytics =
    Platform.OS === 'web' ? require('@vercel/analytics/react').Analytics : null;

  return (
    <React.Fragment>
      <App />
      {Analytics ? <Analytics /> : null}
    </React.Fragment>
  );
};

registerRootComponent(Root);
