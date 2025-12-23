# 🚛 Truck Tracker - Real-time GPS Tracking & Geolocation System

A production-ready React Native application for real-time truck location tracking with offline support, automatic data synchronization, and comprehensive geolocation management for fleet operations.

**Suggested Repository Name:** `react-native-truck-tracker` or `RNTruckGPS`

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Core Modules](#-core-modules)
- [Usage](#-usage)
- [Key Implementations](#-key-implementations)
- [Android Configuration](#-android-configuration)
- [iOS Configuration](#-ios-configuration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Features

### Location Tracking
- ✅ **Real-time GPS Tracking** - Continuous background geolocation updates
- ✅ **High Accuracy Mode** - Fine location precision with configurable intervals
- ✅ **Foreground Service** - Android 14+ compatible foreground location service
- ✅ **Battery Optimized** - Intelligent location update intervals to minimize battery drain

### Data Management
- ✅ **Offline Support** - Automatic offline data queuing with network detection
- ✅ **Network-Aware Sync** - Intelligent synchronization when connectivity returns
- ✅ **Redux State Management** - Persistent Redux store with Redux Persist
- ✅ **Historical Tracking** - Maintains complete location history with timestamps

### API Integration
- ✅ **Automatic Data Sync** - Background sync of location data to server
- ✅ **TrackerModel Format** - Standardized payload structure for API consistency
- ✅ **Retry Logic** - Automatic retry on network failures
- ✅ **Real-time Updates** - Push notifications via Firebase Cloud Messaging

### User Experience
- ✅ **Permission Management** - Intelligent runtime permission handling
- ✅ **User-Friendly UI** - Built with React Native Paper Material Design
- ✅ **OTP Verification** - Secure user authentication system
- ✅ **Location History View** - Visual tracking of location history

### Cross-Platform
- ✅ **Android Support** - Tested on Android 12+ (including Samsung OneUI)
- ✅ **iOS Support** - Full iOS 14+ compatibility
- ✅ **Native Modules** - Leverages platform-specific features safely

---

## 🛠 Tech Stack

### Core Framework
- **React Native** 0.81.4 - Cross-platform mobile development
- **TypeScript** - Type-safe development (configuration available)

### State Management & Data
- **Redux** (@reduxjs/toolkit) - Global state management
- **Redux Persist** - Local storage persistence
- **React Query** (@tanstack/react-query) - Server state management
- **Axios** - HTTP client for API calls

### Location & Geolocation
- **react-native-geolocation-service** - Native geolocation API
- **@react-native-community/netinfo** - Network connectivity detection

### Notifications & Background Tasks
- **react-native-background-actions** - Background service management
- **@notifee/react-native** - Advanced notification system
- **@react-native-firebase/messaging** - Push notifications

### UI & Navigation
- **React Native Paper** - Material Design components
- **React Navigation** - Screen navigation
- **React Hook Form** - Form management
- **Material Icons** - Icon library

### Utilities
- **dayjs** - Date/time handling
- **react-native-otp-entry** - OTP input component
- **react-native-safe-area-context** - Safe area handling

---

## 📦 Prerequisites

### System Requirements
- **Node.js** 16+ and npm/yarn
- **Java Development Kit (JDK)** 11 or higher
- **Android SDK** (for Android development)
- **Xcode** 14+ (for iOS development)
- **CocoaPods** (for iOS dependencies)

### Device Requirements
- **Android** 12.0+ (API Level 31+)
- **iOS** 14.0+

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/react-native-truck-tracker.git
cd react-native-truck-tracker
```

### 2. Install Dependencies

```bash
npm install
# OR
yarn install
```

### 3. Install iOS Pods (iOS only)

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 4. Link Native Modules

Most native modules are auto-linked. If needed:

```bash
npx react-native link
```

---

## ⚙️ Configuration

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Add Android and iOS apps to your project
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place `google-services.json` in `android/app/`
5. Place `GoogleService-Info.plist` in `ios/Dilgo/`

### API Configuration

Edit `services/instance.js`:

```javascript
const instance = axios.create({
  baseURL: 'YOUR_API_BASE_URL',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Location Tracking Configuration

Edit `tasks/TaskManager.js`:

```javascript
const locationConfig = {
  accuracy: Geolocation.ACCURACY_HIGH,
  timeout: 30000,      // 30 seconds
  maximumAge: 60000,   // 60 seconds
  distanceFilter: 10,  // 10 meters
  useSignificantChanges: false,
};
```

---

## 📁 Project Structure

```
.
├── android/                    # Android native code
│   └── app/src/main/
│       ├── AndroidManifest.xml # Permissions & service declarations
│       └── java/               # Native Java modules
├── ios/                        # iOS native code
│   └── Dilgo/
│       ├── Info.plist         # iOS configuration
│       └── Podfile            # CocoaPods configuration
├── components/                 # Reusable UI components
│   ├── AppButton.jsx
│   ├── AppInput.jsx
│   ├── AppDatePicker.jsx
│   ├── AppSelect.jsx
│   ├── AppLoader.jsx
│   ├── AppToast.jsx
│   └── DocumentImages.jsx
├── screens/                    # Application screens
│   ├── Home.jsx               # Main tracking screen
│   ├── History.jsx            # Location history view
│   ├── Login.jsx              # Authentication
│   ├── Profile.jsx            # User profile
│   └── TubewellHome.jsx       # Tubewell management
├── redux/                      # State management
│   ├── store/
│   │   └── store.js          # Redux store configuration
│   └── reducer/
│       ├── locationSlice.js   # Location & sync logic
│       ├── userSlice.js       # User state
│       └── utilsSlice.js      # Utility state
├── services/                   # API & services
│   ├── apiCalls.js            # API endpoints
│   ├── instance.js            # Axios configuration
│   ├── queryClient.js         # React Query setup
│   └── useQueries.js          # Custom hooks
├── tasks/                      # Background tasks
│   └── TaskManager.js         # Foreground service management
├── routes/                     # Navigation
│   └── index.js               # Route definitions
├── theme/                      # Styling & theming
│   └── index.js               # Theme configuration & fonts
├── utils/                      # Utility functions
│   └── index.js               # Helper functions
├── assets/                     # Static assets
│   ├── fonts/                 # Custom fonts
│   └── svg/                   # SVG icons
├── App.jsx                    # App entry point
├── index.js                   # React Native entry point
├── metro.config.js            # Metro bundler config
├── babel.config.js            # Babel configuration
└── package.json               # Dependencies & scripts
```

---

## 🔧 Core Modules

### 1. LocationSlice (Redux State Management)

**File:** `redux/reducer/locationSlice.js`

Manages location tracking state with offline support:

```javascript
// State Structure
{
  locations: [],           // Array of location points
  pendingSync: [],         // Offline queue
  isSyncing: false,        // Sync status
  lastSyncedTimestamp: null,
  isRunning: false,
}

// Key Actions
- addLocationAndSync()     // Add location and sync if online
- syncAllLocations()       // Sync pending data
- clearLocations()         // Clear history
```

**Features:**
- Network-aware queuing
- Automatic retry on sync failure
- Date validation with dayjs
- TrackerModel payload formatting

### 2. TaskManager (Background Service)

**File:** `tasks/TaskManager.js`

Manages Android foreground service with 4-step initialization:

```javascript
// Startup Steps
Step 0: Check service status
Step 1: Create notification channel
Step 2: Request POST_NOTIFICATIONS permission
Step 3: Request background location permission
Step 4: Start BackgroundService
```

**Features:**
- Granular logging for debugging
- Samsung OneUI compatibility
- Automatic retry logic
- Notification management

### 3. API Integration

**File:** `services/apiCalls.js`

RESTful API communication:

```javascript
// TrackerModel Payload Format
{
  data: [
    {
      type: "TrackerModel",
      records: [
        {
          truck: string,
          dt_server: ISO_TIMESTAMP,
          dt_tracker: "DD-MM-YYYY HH:mm:ss",
          lat: number,
          lng: number,
          companySubject: string,
          status: string,
          speed: number,
          temperature: number,
          ignition: boolean,
          harshBreaking: boolean,
        }
      ]
    }
  ]
}
```

### 4. Theme & Fonts

**File:** `theme/index.js`

React Native Paper theme with custom fonts:

```javascript
// Supported Fonts
- Poppins Regular (400)
- Poppins Medium (500)
- Poppins SemiBold (600)
- Poppins Bold (700)
```

---

## 📖 Usage

### Starting the App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Development Server:**
```bash
npm start
```

### Starting Location Tracking

In your component:

```javascript
import { useDispatch } from 'react-redux';
import { startTracking } from '../tasks/TaskManager';
import { addLocationAndSync } from '../redux/reducer/locationSlice';

export default function TrackingComponent() {
  const dispatch = useDispatch();

  const handleStartTracking = async () => {
    try {
      await startTracking();
      // Tracking started
    } catch (error) {
      console.error('Tracking failed:', error);
    }
  };

  return (
    <button onPress={handleStartTracking}>Start Tracking</button>
  );
}
```

### Accessing Location History

```javascript
import { useSelector } from 'react-redux';

function HistoryScreen() {
  const locations = useSelector(state => state.location.locations);
  const pendingSync = useSelector(state => state.location.pendingSync);

  return (
    <FlatList
      data={locations}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Text>{item.lat}, {item.lng}</Text>
      )}
    />
  );
}
```

---

## 🔑 Key Implementations

### Network-Aware Offline Queuing

Locations are queued when offline and automatically synced when connectivity returns:

```javascript
// From locationSlice.js
const handleLocationUpdate = async (location) => {
  // Add to Redux state
  dispatch(addLocation(location));
  
  // Check network status
  const netInfo = await NetInfo.fetch();
  
  if (netInfo.isConnected) {
    // Sync immediately
    dispatch(syncAllLocations());
  } else {
    // Queue for later
    // Will sync automatically when online
  }
};
```

### Background Service on Android 14+

Implements foreground service with required service type:

```xml
<!-- AndroidManifest.xml -->
<service
  android:name="com.asterinet.react.bgactions.RNBackgroundActionsTask"
  android:foregroundServiceType="location|changeNetworkState"
  android:exported="true"
/>
```

### Permission Handling

Comprehensive permission management for Android 10+:

```javascript
// Automatic permission requests
- ACCESS_FINE_LOCATION
- ACCESS_BACKGROUND_LOCATION
- POST_NOTIFICATIONS (Android 13+)
- FOREGROUND_SERVICE_LOCATION (Android 14+)
```

### Date/Time Formatting

Robust date handling with fallback validation:

```javascript
// Input: ISO timestamp from native code
// Output: DD-MM-YYYY HH:mm:ss format
const formatTrackerDate = (timestamp) => {
  const parsed = dayjs(timestamp);
  if (!parsed.isValid()) {
    return dayjs().format('DD-MM-YYYY HH:mm:ss');
  }
  return parsed.format('DD-MM-YYYY HH:mm:ss');
};
```

---

## 🤖 Android Configuration

### Required Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Location Permissions -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

<!-- Foreground Service -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />

<!-- Network -->
<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### Service Declaration

```xml
<service
  android:name="com.asterinet.react.bgactions.RNBackgroundActionsTask"
  android:foregroundServiceType="location|changeNetworkState"
  android:exported="true"
/>
```

### Build Configuration

`android/app/build.gradle`:

```gradle
android {
  compileSdkVersion 34
  targetSdkVersion 34
  
  defaultConfig {
    minSdkVersion 24
    targetSdkVersion 34
  }
}
```

---

## 🍎 iOS Configuration

### Required Permissions

Add to `ios/Dilgo/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to your location to track truck movements.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app needs constant access to your location for background tracking.</string>

<key>NSLocationAlwaysUsageDescription</key>
<string>This app needs constant access to your location for background tracking.</string>

<key>NSBluetooth PeripheralUsageDescription</key>
<string>This app uses Bluetooth for enhanced location tracking.</string>

<key>UIBackgroundModes</key>
<array>
  <string>location</string>
  <string>fetch</string>
</array>
```

### Font Configuration

Add fonts to `ios/Dilgo/Info.plist`:

```xml
<key>UIAppFonts</key>
<array>
  <string>Poppins-Regular.ttf</string>
  <string>Poppins-Medium.ttf</string>
  <string>Poppins-SemiBold.ttf</string>
  <string>Poppins-Bold.ttf</string>
</array>
```

---

## 🐛 Troubleshooting

### Issue: App Crashes on Start (Android 14+)

**Error:** `MissingForegroundServiceTypeException: Starting FGS without a type`

**Solution:** Ensure `android:foregroundServiceType="location|changeNetworkState"` is declared in AndroidManifest.xml

### Issue: Location Permission Denied

**Solution:** Check runtime permission requests are being called:

```javascript
const granted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
);
```

### Issue: Sync Not Working

**Solution:** Verify network connectivity and check Redux DevTools:

```javascript
const locations = useSelector(state => state.location);
console.log('Pending sync:', locations.pendingSync);
console.log('Is syncing:', locations.isSyncing);
```

### Issue: Battery Drain

**Solution:** Adjust location update intervals in TaskManager.js:

```javascript
const locationConfig = {
  timeout: 30000,      // Increase to reduce frequency
  maximumAge: 60000,   // Increase to use cached location
  distanceFilter: 50,  // Increase to reduce updates
};
```

### Issue: Notification Not Showing (Android)

**Solution:** Verify notification channel creation in TaskManager:

```javascript
await notifee.createChannel({
  id: 'truck_tracking_foreground',
  name: 'Truck Tracking',
  importance: AndroidImportance.HIGH,
});
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Style

- Use ESLint for code quality
- Follow React Native best practices
- Add comments for complex logic
- Test on both Android and iOS

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support & Contact

For issues, questions, or suggestions:

- **Issues:** [GitHub Issues](https://github.com/arrehman0r/react-native-truck-tracker/issues)
- **Email:** arrehman0r@gmail.com
- **Documentation:** [Full Docs](https://github.com/arrehman0r/react-native-truck-tracker/wiki)

---

## 🙏 Acknowledgments

Built with ❤️ using:
- React Native
- Redux & Redux Persist
- React Navigation
- Firebase
- Notifee
- And many more amazing open-source libraries

---

## 📊 Stats

- **Lines of Code:** 5000+
- **Components:** 10+
- **Screens:** 5+
- **Redux Slices:** 3
- **API Endpoints:** 10+
- **Supported Platforms:** Android 12+, iOS 14+

---

**Happy Tracking! 🚛📍**
