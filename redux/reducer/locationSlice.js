import { createSlice } from '@reduxjs/toolkit';
import { syncOfflineData } from '../../services/apiCalls';
import NetInfo from '@react-native-community/netinfo';
import dayjs from 'dayjs';

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
    lastSyncedTimestamp: null, // Track what we've synced
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
     setLastSyncedTimestamp: (state, action) => {
      state.lastSyncedTimestamp = action.payload;
    },
  },
});



export const syncAllLocations = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { pendingSync, lastSyncedTimestamp } = state.location;

    // Check network
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected || pendingSync.length === 0) {
      // Nothing to do if offline or no pending points
      return;
    }

    // We'll sync everything in pendingSync for now
    const unsyncedLocations = pendingSync;

    if (unsyncedLocations.length === 0) return;

    dispatch(setIsSyncing(true));
    console.log(`🔄 Syncing ${unsyncedLocations.length} locations...`);

    // Build payload in required format
    const records = unsyncedLocations.map((loc) => {
      const dt_server = new Date().toISOString();
      // Safely parse timestamp: try as-is first, fallback to ISO string parsing
      let dt_tracker = 'Invalid Date';
      if (loc.timestamp) {
        const parsed = dayjs(loc.timestamp);
        dt_tracker = parsed.isValid() ? parsed.format('DD-MM-YYYY HH:mm:ss') : dayjs().format('DD-MM-YYYY HH:mm:ss');
      } else {
        dt_tracker = dayjs().format('DD-MM-YYYY HH:mm:ss');
      }

      return {
        truck: loc.truck || 'MH-12-AB-1234', // hardcoded fallback
        dt_server,
        dt_tracker,
        lat: String(loc.latitude),
        lng: String(loc.longitude),
        companySubject: loc.companySubject || 'transport-company-001',
        status: loc.status || 'Moving',
        speed: loc.speed != null ? String(loc.speed) : '0',
        orignalDateFormat: 'dd-MM-yyyy HH:mm:ss',
        temperature: loc.temperature != null ? String(loc.temperature) : '0',
        ignition: loc.ignition || 'ON',
        harshBreaking: loc.harshBreaking != null ? String(loc.harshBreaking) : 'false',
      };
    });

    const payload = {
      data: [
        {
          type: 'TrackerModel',
          records,
        },
      ],
    };

    // Sync to backend
    const syncRes = await syncOfflineData(payload);
    console.log('✅ Sync response:', syncRes, payload);

    // Mark as synced: clear pending queue and set last synced timestamp
    const latestTimestamp = unsyncedLocations[unsyncedLocations.length - 1].timestamp || new Date().toISOString();
    dispatch(setLastSyncedTimestamp(latestTimestamp));
    dispatch(clearPendingSync());

    console.log('✅ All locations synced successfully');
    
  } catch (error) {
    console.log('❌ Sync failed, will retry later:', error);
  } finally {
    dispatch(setIsSyncing(false));
  }
};


// Enhanced addLocation that auto-triggers sync
export const addLocationAndSync = (locationData) => async (dispatch) => {
  // Add to Redux
  dispatch(addLocationPoint(locationData));

  // Trigger sync attempt only if network is available
  const net = await NetInfo.fetch();
  if (net.isConnected) {
    dispatch(syncAllLocations());
  } else {
    console.log('📶 Offline — queued location for later sync');
  }
};

export const { 
  addLocationPoint, 
  setIsTrackingOn, 
  setPendingSync, 
  setIsSyncing, 
  clearPendingSync ,
  setLastSyncedTimestamp
} = locationSlice.actions;

export default locationSlice.reducer;