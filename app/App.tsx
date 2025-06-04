
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './features/store';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider } from './theme/ThemeContext';
import { requestNotificationPermissions } from './utils/notifications';
import { setupCategorySync } from './utils/sync';

export default function App() {
  useEffect(() => {
    requestNotificationPermissions();
    setupCategorySync();
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
}
