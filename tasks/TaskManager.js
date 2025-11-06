// src/tasks/TaskManager.js (Bare React Native Version for Android)

import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert, PermissionsAndroid } from 'react-native';

export const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';
const LAST_LOCATION_KEY = 'latest_truck_location'; 
const LOCATION_INTERVAL_MS = 5 * 60 * 100; // 5 minutes in milliseconds

// --- 1. Background Task Definition ---
// This function runs in the background thread provided by react-native-background-actions.
const backgroundTask = async (taskData) => {
    // Helper function to pause execution
    const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

    // The task logic runs inside a loop to ensure persistence
    await new Promise(async (resolve) => {
        
        while(BackgroundService.isRunning()){
            
            // CORE LOCATION FETCH LOGIC (Simulating the location update interval)
            console.log('Attempting to fetch background location...');
            
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationData = {
                        latitude: latitude,
                        longitude: longitude,
                        timestamp: new Date().toLocaleTimeString(),
                    };
                    
                    // Save to AsyncStorage
                    AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(locationData))
                        .catch(e => console.error("Failed to save location data:", e));

                    console.log('✅ Background location updated:', locationData);
                },
                (error) => {
                    // It's common to get temporary location errors in the background
                    console.log('Background location error:', error.code, error.message);
                },
                { 
                    enableHighAccuracy: true, 
                    timeout: 15000, 
                    maximumAge: 10000 
                }
            );
            
            // Wait for the next interval (5 minutes)
            await sleep(LOCATION_INTERVAL_MS); 
        }
    });
};

// --- 2. Background Service Options (Equivalent to Expo's LOCATION_OPTIONS) ---
const options = {
    taskName: LOCATION_TASK_NAME,
    taskTitle: 'Truck Location Tracking Active',
    taskDesc: 'Your location is being updated every 5 minutes.',
    taskIcon: {
        // IMPORTANT: This icon MUST exist in your Android drawables/mipmaps folder!
        // Use your app's launcher icon name (e.g., ic_launcher)
        name: 'ic_launcher', 
        type: 'mipmap',     
    },
    taskColor: '#30C665', // Notification color
    taskDelay: 5000,       // Delay before the first run (5 seconds)
};

// --- 3. Permission & Control Functions ---

// Source - https://stackoverflow.com/questions/45822318/how-do-i-request-permission-for-android-device-location-in-react-native-at-run-t
// Posted by Jagadeesh
// Retrieved 2025-11-06, License - CC BY-SA 4.0

export const requestLocationPermissions = async () => {
    
    // --- STEP 1: Request Foreground Location (Fine/Coarse) ---
    console.log("Step 1: Requesting foreground location permissions...");
    
    const foregroundResult = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
    
    const fineGranted = foregroundResult[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
    
    if (!fineGranted) {
        Alert.alert("Permissions Required", "Foreground location (While in use) permission is needed to start tracking.");
        return false;
    }
    
    // --- STEP 2: Request Background Location (CRITICAL FOR YOUR PROJECT) ---
    console.log("Step 2: Foreground granted. Requesting background location permission...");
    
    // NOTE: This will trigger a second system modal if not already granted.
    const backgroundResult = await PermissionsAndroid.request(
        'android.permission.ACCESS_BACKGROUND_LOCATION'
    );
    
    const backgroundGranted = backgroundResult === PermissionsAndroid.RESULTS.GRANTED;

    if (backgroundGranted) {
        Alert.alert("Success!", "Location tracking is ready (Allow all the time).");
        return true;
    } else {
        // If background permission is NOT granted, we inform the user it must be set manually.
        Alert.alert(
            "Permissions Required", 
            "For continuous background tracking, please manually set location access to 'Allow all the time' in the app settings after closing this alert."
        );
        return false; 
    }
};

// Starts the persistent background service
export const startTracking = async () => {
    const isRunning = BackgroundService.isRunning();
    console.log('Background service running status:', isRunning);
    if (!isRunning) {
        try {
            await BackgroundService.start(backgroundTask, options);
            console.log('Background service started successfully.');
        } catch (e) {
            console.error('Failed to start background service:', e);
            throw e; // Propagate error back to Home.js
        }
    }
};

// Stops the persistent background service
export const stopTracking = async () => {
    const isRunning = BackgroundService.isRunning();
    if (isRunning) {
        await BackgroundService.stop();
    }
};

// Replaces Location.hasStartedLocationUpdatesAsync
export const isTrackingRunning = async () => {
    return BackgroundService.isRunning();
};


// Function to retrieve the latest stored location for display in Home.js
export const getLatestLocation = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(LAST_LOCATION_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        console.error("Failed to read location data from storage:", e);
        return null;
    }
};