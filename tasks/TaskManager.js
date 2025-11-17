// src/tasks/TaskManager.js
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import { Alert, PermissionsAndroid, DeviceEventEmitter, Platform } from 'react-native';

// Export constants at the top level
export const LOCATION_TASK_NAME = 'TRUCK_TRACKING_FOREGROUND_SERVICE';
export const LOCATION_UPDATE_EVENT = 'BACKGROUND_LOCATION_UPDATE';

const LOCATION_INTERVAL_MS = 1 * 60 * 1000

// In backgroundTask - just this single line:

// Foreground Service Configuration
const options = {
    taskName: LOCATION_TASK_NAME,
    taskTitle: '🚛 Truck Location Tracker',
    taskDesc: 'Live location tracking active • Updates every 5 minutes',
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

const backgroundTask = async (taskData) => {
    const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

    try {
        let updateCount = 0;
        
        while (BackgroundService.isRunning()) {
            updateCount++;
            console.log(`📍 Foreground Service - Location Update #${updateCount}`);
            
            try {
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
                    timestamp: new Date().toLocaleString(),
                    accuracy: accuracy,
                    updateCount: updateCount,
                };
                
                // Update notification
                await BackgroundService.updateNotification({
                    taskTitle: `🚛 Truck Tracker • Update #${updateCount}`,
                    taskDesc: `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                });

                // Send to Redux
                DeviceEventEmitter.emit(LOCATION_UPDATE_EVENT, locationData);
                
                console.log('✅ Foreground Service - Location Updated:', locationData);
                
            } catch (locationError) {
                console.log('❌ Location fetch failed:', locationError);
                await BackgroundService.updateNotification({
                    taskDesc: 'Waiting for location signal...',
                });
            }
            
            await sleep(LOCATION_INTERVAL_MS);
        }
    } catch (error) {
        console.log('❌ Foreground Service Error:', error);
    }
};

// Start Foreground Service
export const startTracking = async () => {
    const isRunning = BackgroundService.isRunning();
    console.log('🔍 Foreground service status:', isRunning);
    
    if (!isRunning) {
        try {
            await BackgroundService.start(backgroundTask, options);
            console.log('🎯 Android Foreground Service STARTED');
            return true;
        } catch (e) {
            console.error('❌ FAILED to start foreground service:', e);
            throw e;
        }
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
    console.log("🔐 Requesting Android location permissions...");
    
    try {
        const foregroundGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'This app needs access to your location for tracking.',
                buttonPositive: 'OK',
            }
        );

        if (foregroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission Required', 'Location permission is needed for tracking.');
            return false;
        }

        // Request background location for Android 10+
        if (Platform.OS === 'android' && Platform.Version >= 29) {
            const backgroundGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                {
                    title: 'Background Location',
                    message: 'Allow location access all the time for continuous tracking.',
                    buttonPositive: 'Allow Always',
                }
            );

            if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert(
                    'Background Permission', 
                    'For best results, enable "Allow all the time" in app settings.'
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