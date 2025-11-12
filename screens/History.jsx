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

const History = ({ navigation }) => {
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

      {/* <ShipmentCard /> */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>
          🚛 Truck Tracker
        </Text>

        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>Last Update:</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007AFF' }}>
            {currentCords?.timestamp || 'No updates yet'}
          </Text>
        </View>
        
        <View style={{ marginBottom: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>Latitude:</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
            {currentCords?.latitude ? currentCords.latitude.toFixed(6) : 'N/A'}
          </Text>
        </View>
        
        <View style={{ marginBottom: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>Longitude:</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
            {currentCords?.longitude ? currentCords.longitude.toFixed(6) : 'N/A'}
          </Text>
        </View>

        <Text style={{
          marginBottom: 30,
          color: isTracking ? 'green' : 'red',
          fontWeight: '600',
          fontSize: 16,
          textAlign: 'center'
        }}>
          {isTracking ? '✅ FOREGROUND SERVICE ACTIVE' : '❌ SERVICE INACTIVE'}
        </Text>

        {!isTracking ? (
          <Button
            title="START FOREGROUND SERVICE"
            onPress={handleStartTracking}
            color="green"
          />
        ) : (
          <Button
            title="STOP FOREGROUND SERVICE"
            onPress={handleStopTracking}
            color="red"
          />
        )}
      </View>
    </View>
  );
};

export default History;