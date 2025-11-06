import React, { useEffect } from 'react';
import { View, StyleSheet, Text, BackHandler } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';

const AppLoader = () => {
  const loading = useSelector((state) => state.utils.loading);
  
  // Handle back button presses when loading
  useEffect(() => {
    // Function to handle the back button press
    const handleBackPress = () => {
      // If loading is true, prevent back navigation by returning true
      if (loading) {
        return true; // Return true to prevent default behavior (going back)
      }
      return false; // Return false to allow default behavior
    };

    // Add event listener for back button press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    // Clean up the event listener when component unmounts or dependencies change
    return () => backHandler.remove();
  }, [loading]); // Re-add listener if loading state changes

  // Render nothing if not loading
  if (!loading) {
    return null;
  }

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator animating={true} size="large" />
      <Text>Please wait ....</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    position: 'absolute', // Position absolute to cover the whole screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999, // Ensure it appears above other components
  },
});

export default AppLoader;