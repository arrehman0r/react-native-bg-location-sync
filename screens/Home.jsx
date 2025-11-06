import { View, Button, Text, Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { AppHeader } from "../components/AppHeader";
import {
    getLatestLocation, 
    requestLocationPermissions,
    startTracking, // <-- NEW START
    stopTracking,  // <-- NEW STOP
    isTrackingRunning, // <-- NEW CHECKER
} from "./../tasks/TaskManager"; 

// DELETED: import * as Location from "expo-location";

const Home = ({ navigation }) => {
    const [isTracking, setIsTracking] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState("checking..."); 
    const [currentCords, setCurrentCords] = useState({
        lat: "N/A",
        lon: "N/A",
        time: "N/A",
    });

    const updateCords = useCallback(async () => {
        const latestData = await getLatestLocation();
        if (latestData) {
            setCurrentCords({
                lat: latestData.latitude,
                lon: latestData.longitude,
                time: latestData.timestamp,
            });
        }
    }, []);

    const checkStatus = async () => {
        // Use the new checker function from the bare RN TaskManager
        const isRunning = await isTrackingRunning(); 
        setIsTracking(isRunning);
        setPermissionStatus("checked"); 
        updateCords();
    };

    // Renamed function to reflect that we are calling our internal logic
    const handleStartTracking = async () => {
       
        const hasPermission = await requestLocationPermissions();
        console.log("🚀 Location permission granted:", hasPermission);
        if (!hasPermission) {
            setPermissionStatus("denied");
            return;
        }

        try {
            // Call the new start function from TaskManager
            await startTracking(); 
            setIsTracking(true);
            setPermissionStatus("granted");
            console.log("✅ Tracking started.");
        } catch (e) {
            console.error("Failed to start location updates:", e);
            Alert.alert("Error", "Could not start tracking.");
        }
    };
    
    // Added function to stop tracking
    const handleStopTracking = async () => {
        try {
            await stopTracking();
            setIsTracking(false);
            console.log("🛑 Tracking stopped.");
        } catch (e) {
            console.error("Failed to stop location updates:", e);
            Alert.alert("Error", "Could not stop tracking.");
        }
    };


    useEffect(() => {
        checkStatus();

        const interval = setInterval(updateCords, 5000);

        return () => clearInterval(interval);
    }, [updateCords]);

    return (
        <View style={{ flex: 1 }}>
            <AppHeader showLogo={true} navigation={navigation} />
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                }}
            >
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
                    Truck Location Monitor
                </Text>
                
                {/* ... other Text/View components showing coordinates ... */}
                <View style={{ marginBottom: 20, alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>Last Update Time:</Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#007AFF" }}>
                        {currentCords.time}
                    </Text>
                </View>
                <View style={{ marginBottom: 30, alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>Latitude (LAT):</Text>
                    <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                        {currentCords.lat}
                    </Text>
                </View>
                <View style={{ marginBottom: 30, alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>Longitude (LON):</Text>
                    <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                        {currentCords.lon}
                    </Text>
                </View>
                
                <Text
                    style={{
                        marginBottom: 20,
                        color: isTracking ? "green" : "red",
                        fontWeight: "600",
                    }}
                >
                    Tracking Status: {isTracking ? "ACTIVE (30sec INTERVAL)" : "INACTIVE"}
                </Text>
                
                {/* Updated Button logic */}
                {!isTracking && (
                    <Button
                        title="START CONTINUOUS TRACKING"
                        onPress={handleStartTracking} // <-- New Function Name
                        color="green"
                    />
                )}
                {/* {isTracking && (
                    <Button
                        title="STOP TRACKING"
                        onPress={handleStopTracking}
                        color="red"
                    />
                )} */}
            </View>
        </View>
    );
};

export default Home;