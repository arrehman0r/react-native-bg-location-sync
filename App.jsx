// Bare React Native uses a different StatusBar component
import { Alert, StatusBar } from 'react-native';

// Removed: import { StatusBar } from 'expo-status-bar';
// Removed: all imports from @expo-google-fonts

// NOTE: You will need to import these components from the correct location in your project
import AppNavigator from './routes';
import { Button, PaperProvider } from 'react-native-paper';
import { theme } from './theme';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from './redux/store/store';
import AppLoader from './components/AppLoader';
import AppToast from './components/AppToast';
import { queryClient } from './services/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';1
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import notifee from '@notifee/react-native';
import NetInfo from '@react-native-community/netinfo';
import { syncAllLocations } from './redux/reducer/locationSlice';
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
useEffect(() => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('📱 Foreground FCM received:', remoteMessage);
    
    // Extract notification data
    const title = remoteMessage.notification?.title || '🚛 Truck Tracker';
    const body = remoteMessage.notification?.body || 'New update';
    
    console.log(`🔔 Showing notification: ${title} - ${body}`);
    
    // Show system notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
    });
    
    console.log('✅ Notification displayed successfully');
  });

  return unsubscribe;
}, []);

//  async function onDisplayNotification() {
//     // Request permissions (required for iOS)
//     await notifee.requestPermission()

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//     });

//     // Display a notification
//     await notifee.displayNotification({
//       title: 'Notification Title',
//       body: 'Main body content of the notification',
//       android: {
//         channelId,
//       smallIcon: 'ic_launcher',
//         // pressAction is needed if you want the notification to open the app when pressed
//         pressAction: {    
//           id: 'default',
//         },
//       },
//     });
//   }


// Listen for network connectivity
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    store.dispatch(syncAllLocations());
  }
});
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