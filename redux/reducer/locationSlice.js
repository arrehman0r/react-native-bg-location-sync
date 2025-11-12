// redux/reducer/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { syncOfflineData } from '../../services/apiCalls';
import NetInfo from '@react-native-community/netinfo';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    current: {
      latitude: null,
      longitude: null,
      timestamp: null,
    },
    isTrackingOn: false,
    history: [],
    pendingSync: [], // Add this for unsynced data
    isSyncing: false,
  },
  reducers: {
    addLocationPoint: (state, action) => {
      state.current = action.payload;
      state.history.push(action.payload);
      state.pendingSync.push(action.payload); // Add to pending sync
    },
    setIsTrackingOn: (state, action) => {
      state.isTrackingOn = action.payload;
    },
    setPendingSync: (state, action) => {
      state.pendingSync = action.payload;
    },
    setIsSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    clearPendingSync: (state) => {
      state.pendingSync = [];
    },
  },
});

// Thunk function for auto-sync
export const syncLocationData = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { pendingSync } = state.location;
    
    // Check if we have data to sync and network is available
    const networkState = await NetInfo.fetch();
    
    if (pendingSync.length > 0 && networkState.isConnected) {
      dispatch(setIsSyncing(true));
      
      console.log(`🔄 Syncing ${pendingSync.length} locations...`);
      
      // Sync with server
      await syncOfflineData(pendingSync);
      
      // Clear pending sync on success
      dispatch(clearPendingSync());
      
      console.log('✅ Locations synced successfully');
    }
    
  } catch (error) {
    console.log('❌ Sync failed:', error);
    // Keep data in pendingSync for retry later
  } finally {
    dispatch(setIsSyncing(false));
  }
};

// Enhanced addLocation that auto-triggers sync
export const addLocationAndSync = (locationData) => async (dispatch) => {
  // Add to Redux
  dispatch(addLocationPoint(locationData));
  
  // Trigger sync attempt
  dispatch(syncLocationData());
};

export const { 
  addLocationPoint, 
  setIsTrackingOn, 
  setPendingSync, 
  setIsSyncing, 
  clearPendingSync 
} = locationSlice.actions;

export default locationSlice.reducer;