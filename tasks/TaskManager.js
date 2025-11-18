// src/tasks/TaskManager.js
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import {
  Alert,
  PermissionsAndroid,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

// Export constants at the top level
export const LOCATION_TASK_NAME = 'TRUCK_TRACKING_FOREGROUND_SERVICE';
export const LOCATION_UPDATE_EVENT = 'BACKGROUND_LOCATION_UPDATE';

const LOCATION_INTERVAL_MS = 1 * 60 * 1000;

// In backgroundTask - just this single line:

// Foreground Service Configuration
const options = {
  taskName: LOCATION_TASK_NAME,
  taskTitle: 'Truck Location Tracker',
  taskDesc: 'Live location tracking active',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#30C665',
  linkingURI: 'dilgo://background',
  notificationForeground: true,
  notificationChannelId: 'truck_tracking_foreground',
  notificationChannelName: 'Truck Tracking Service',
  importance: 4,
};

const backgroundTask = async taskData => {
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  try {
    console.log('[backgroundTask] Task started');
    let updateCount = 0;

    while (BackgroundService.isRunning()) {
      updateCount++;
      console.log(`[backgroundTask] Location Update #${updateCount} - Starting location fetch...`);

      try {
        console.log(`[backgroundTask] #${updateCount}: Calling Geolocation.getCurrentPosition...`);
        const position = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 60000,
          });
        });

        const { latitude, longitude, accuracy } = position.coords;
        const locationData = {
          latitude: latitude,
          longitude: longitude,
          timestamp: new Date().toISOString(),
          accuracy: accuracy,
          updateCount: updateCount,
        };

        console.log(`[backgroundTask] #${updateCount}: Location received:`, locationData);

        // Update notification (remove emoji for Samsung compatibility)
        try {
          console.log(`[backgroundTask] #${updateCount}: Updating notification...`);
          await BackgroundService.updateNotification({
            taskTitle: `Truck Tracker Update #${updateCount}`,
            taskDesc: `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
          console.log(`[backgroundTask] #${updateCount}: Notification updated successfully`);
        } catch (notifErr) {
          console.warn(`[backgroundTask] #${updateCount}: Failed to update notification:`, notifErr?.message || notifErr);
        }

        // Send to Redux
        try {
          console.log(`[backgroundTask] #${updateCount}: Emitting location event...`);
          DeviceEventEmitter.emit(LOCATION_UPDATE_EVENT, locationData);
          console.log(`[backgroundTask] #${updateCount}: Location event emitted successfully`);
        } catch (emitErr) {
          console.warn(`[backgroundTask] #${updateCount}: Failed to emit event:`, emitErr?.message || emitErr);
        }

        console.log(`[backgroundTask] #${updateCount}: Update complete, waiting for next interval...`);
      } catch (locationError) {
        console.error(`[backgroundTask] #${updateCount}: Location fetch error:`, locationError?.message || locationError);
        console.error(`[backgroundTask] #${updateCount}: Error stack:`, locationError?.stack || '');
        try {
          await BackgroundService.updateNotification({
            taskDesc: 'Waiting for location signal...',
          });
        } catch (notifErr) {
          console.warn(`[backgroundTask] #${updateCount}: Failed to update notification on error:`, notifErr);
        }
      }

      console.log(`[backgroundTask] #${updateCount}: Sleeping for ${LOCATION_INTERVAL_MS}ms...`);
      await sleep(LOCATION_INTERVAL_MS);
      console.log(`[backgroundTask] #${updateCount}: Sleep complete, checking if still running...`);
    }
    console.log('[backgroundTask] Task ended - BackgroundService.isRunning() returned false');
  } catch (error) {
    console.error('[backgroundTask] CRITICAL ERROR in background task:', error?.message || error);
    console.error('[backgroundTask] Error stack:', error?.stack || '');
  }
};

// Start Foreground Service
export const startTracking = async () => {
  const isRunning = BackgroundService.isRunning();
  console.log('[TaskManager] Step 0: Check if service running:', isRunning);

  if (!isRunning) {
    try {
      // Step 1: Create notification channel
      console.log('[TaskManager] Step 1: Creating notification channel...');
      try {
        await notifee.createChannel({
          id: options.notificationChannelId || 'truck_tracking_foreground',
          name: options.notificationChannelName || 'Truck Tracking Service',
          importance: AndroidImportance.DEFAULT,
        });
        console.log('[TaskManager] Step 1: Notification channel created successfully');
        // Small delay to prevent race condition on some devices (Samsung)
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('[TaskManager] Step 1: Delay complete');
      } catch (chErr) {
        console.warn('[TaskManager] Step 1 WARNING: Could not create notification channel:', chErr?.message || chErr);
      }

      // Step 2: Request POST_NOTIFICATIONS on Android 13+
      console.log('[TaskManager] Step 2: Checking Android version for POST_NOTIFICATIONS (need >= 33)...');
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        console.log('[TaskManager] Step 2: Requesting POST_NOTIFICATIONS permission...');
        try {
          const notifPerm = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message: 'Allows the app to show foreground service notifications',
              buttonPositive: 'OK',
            },
          );
          console.log('[TaskManager] Step 2: POST_NOTIFICATIONS result:', notifPerm);
          if (notifPerm !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('[TaskManager] Step 2: Notification permission not granted (but continuing)');
          }
        } catch (pErr) {
          console.warn('[TaskManager] Step 2 ERROR: Failed to request POST_NOTIFICATIONS:', pErr?.message || pErr);
        }
      } else {
        console.log('[TaskManager] Step 2: Android version is', Platform.Version, '(skipping POST_NOTIFICATIONS, need >= 33)');
      }

      // Step 3: Request FOREGROUND_SERVICE_LOCATION on Android 10+
      console.log('[TaskManager] Step 3: Checking Android version for location permission (need >= 29)...');
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        console.log('[TaskManager] Step 3: Requesting ACCESS_BACKGROUND_LOCATION permission...');
        try {
          const fgLocPerm = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Foreground Service Location',
              message: 'Required for continuous location tracking',
              buttonPositive: 'OK',
            },
          );
          console.log('[TaskManager] Step 3: ACCESS_BACKGROUND_LOCATION result:', fgLocPerm);
        } catch (fgErr) {
          console.warn('[TaskManager] Step 3 ERROR: Failed to request ACCESS_BACKGROUND_LOCATION:', fgErr?.message || fgErr);
        }
      } else {
        console.log('[TaskManager] Step 3: Android version is', Platform.Version, '(skipping location permission, need >= 29)');
      }

      // Step 4: Start BackgroundService
      console.log('[TaskManager] Step 4: Starting BackgroundService with options:', {
        taskName: options.taskName,
        notificationChannelId: options.notificationChannelId,
        color: options.color,
      });
      try {
        await BackgroundService.start(backgroundTask, options);
        console.log('[TaskManager] Step 4 SUCCESS: Android Foreground Service STARTED');
        return true;
      } catch (startErr) {
        console.error('[TaskManager] Step 4 CRITICAL ERROR: BackgroundService.start failed');
        console.error('[TaskManager] Step 4 Error message:', startErr?.message || startErr);
        console.error('[TaskManager] Step 4 Full error object:', startErr);
        throw startErr;
      }
    } catch (e) {
      const errMsg = e?.message || String(e) || 'Unknown error';
      const errStack = e?.stack || '';
      console.error('[TaskManager] FINAL ERROR: Failed to start foreground service');
      console.error('[TaskManager] Error message:', errMsg);
      console.error('[TaskManager] Error stack:', errStack);
      console.error('[TaskManager] Full error object:', JSON.stringify(e, Object.getOwnPropertyNames(e)));
      Alert.alert(
        'Service Error',
        `Could not start foreground service.\n\nError: ${errMsg}`,
      );
      return false;
    }
  } else {
    console.log('[TaskManager] Service already running, returning true');
  }
  return true;
};

// Stop Foreground Service
export const stopTracking = async () => {
  try {
    await BackgroundService.stop();
    console.log('🛑 Foreground Service STOPPED');
    return true;
  } catch (e) {
    console.error('Error stopping service:', e);
    throw e;
  }
};

// Check if service is running
export const isTrackingRunning = async () => {
  return BackgroundService.isRunning();
};

// Android Permissions
export const requestLocationPermissions = async () => {
  console.log('🔐 Requesting Android location permissions...');

  try {
    const foregroundGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location for tracking.',
        buttonPositive: 'OK',
      },
    );

    const coarseGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location for tracking.',
        buttonPositive: 'OK',
      },
    );

    if (
      foregroundGranted !== PermissionsAndroid.RESULTS.GRANTED &&
      coarseGranted !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      Alert.alert(
        'Permission Required',
        'Location permission is needed for tracking.',
      );
      return false;
    }

    // Request background location for Android 10+
    if (Platform.OS === 'android' && Platform.Version >= 29) {
      const backgroundGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location',
          message:
            'Allow location access all the time for continuous tracking.',
          buttonPositive: 'Allow Always',
        },
      );

      if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Background Permission',
          'For best results, enable "Allow all the time" in app settings.',
        );
      }
    }

    console.log('✅ All permissions granted');
    return true;
  } catch (err) {
    console.warn('Permission error:', err);
    return false;
  }
};
