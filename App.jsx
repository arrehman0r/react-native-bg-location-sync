// Bare React Native uses a different StatusBar component
import { StatusBar } from 'react-native';

// Removed: import { StatusBar } from 'expo-status-bar';
// Removed: all imports from @expo-google-fonts

// NOTE: You will need to import these components from the correct location in your project
import AppNavigator from './routes';
import { PaperProvider } from 'react-native-paper';
import { theme } from './theme';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from './redux/store/store';
import AppLoader from './components/AppLoader';
import AppToast from './components/AppToast';
import { queryClient } from './services/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';1


export default function App() {
  // ----------------------------------------------------
  // FONT LOADING - Temporary Fix
  // The @expo-google-fonts logic is removed.
  // We need to implement manual font loading/linking later.
  // For now, we'll skip the loading screen check to allow the app to boot.
  // The font styling may look wrong until you link the actual font files.
  // ----------------------------------------------------

  // const [fontsLoaded] = useFonts({ ... });
  // if (!fontsLoaded) return null;

  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <AppLoader />
            {/* Expo's style="light-content" maps to 
              RN's barStyle="light-content" 
            */}
            <StatusBar barStyle="light-content" /> 
            <AppNavigator />
            <AppToast />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </PaperProvider>
  );
}