// src/Home.jsx
import { View, Button, Text, Alert } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { AppHeader } from '../components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
  addLocationPoint,
  setIsTrackingOn,
} from '../redux/reducer/locationSlice';
import { DeviceEventEmitter } from 'react-native';

// Import everything from TaskManager
import * as TaskManager from '../tasks/TaskManager';
import ShipmentCard from '../components/ShipmentCard';

const Home = ({ navigation }) => {
  const [permissionStatus, setPermissionStatus] = useState('checking...');
  const dispatch = useDispatch();
  const currentCords = useSelector(state => state.location.current);
  const isTracking = useSelector(state => state.location.isTrackingOn);

  // Handle location updates from foreground service
  const handleLocationUpdate = useCallback((locationData) => {
    console.log('📍 UI Received location update:', locationData);
    
    dispatch(
      addLocationPoint({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timestamp: locationData.timestamp,
      })
    );
  }, [dispatch]);

  const checkStatus = async () => {
    const isRunning = await TaskManager.isTrackingRunning();
    dispatch(setIsTrackingOn(isRunning));
    setPermissionStatus(isRunning ? 'active' : 'inactive');
  };

  const handleStartTracking = async () => {
    const hasPermission = await TaskManager.requestLocationPermissions();
    if (!hasPermission) {
      setPermissionStatus('denied');
      return;
    }

    try {
      await TaskManager.startTracking();
      dispatch(setIsTrackingOn(true));
      setPermissionStatus('active');
      
      Alert.alert(
        'Foreground Service Started ✅',
        'Truck tracking is now active with system notification.',
        [{ text: 'OK' }]
      );
      
    } catch (e) {
      console.error('Failed to start service:', e);
      Alert.alert('Error', 'Could not start tracking service.');
    }
  };

  const handleStopTracking = async () => {
    try {
      await TaskManager.stopTracking();
      dispatch(setIsTrackingOn(false));
      setPermissionStatus('inactive');
      
      Alert.alert('Service Stopped', 'Tracking has been stopped.');
      
    } catch (e) {
      console.error('Failed to stop service:', e);
      Alert.alert('Error', 'Could not stop tracking service.');
    }
  };

  useEffect(() => {
    checkStatus();

    // Listen for location updates from foreground service
    const locationSubscription = DeviceEventEmitter.addListener(
      TaskManager.LOCATION_UPDATE_EVENT, // Use the imported constant
      handleLocationUpdate
    );

    return () => {
      locationSubscription.remove();
    };
  }, [handleLocationUpdate]);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showLogo={true} navigation={navigation} />

      <ShipmentCard />
  
    </View>
  );
};

export default Home;