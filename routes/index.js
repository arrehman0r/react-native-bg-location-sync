import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Login from "../screens/Login";
import Home from "../screens/Home";


// import { MaterialCommunityIcons } from "@expo/vector-icons";
import {  HistoryIcon, ProfileIcon } from "../assets/svg";
import { useSelector } from "react-redux";
// import * as SecureStore from "expo-secure-store";

import Profile from "../screens/Profile";

import OTPVerification from "../screens/OTPVerification";
import LoginWithPassword from "../screens/LoginWithPassword";
import History from "../screens/History";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Create your tab navigator component
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#E04821",
        tabBarInactiveTintColor: "#7A8A97",
        tabBarStyle: {
          paddingBottom: 5,
          height: 78,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
          fontFamily : "Poppins_400Regular"
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
         options={{
          tabBarIcon: ({ color, size }) => <HistoryIcon color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color, size }) => <HistoryIcon color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => <ProfileIcon color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Login");
  const loginUser = useSelector((state) => state.user.loginUser);
  const isAuthenticated = useSelector((state) => state.user?.isAuthenticated);

  console.log("isAuthenticated", isAuthenticated);
  // const checkAuth = async () => {
  //   try {
  //     const storedToken = await SecureStore.getItemAsync("token");

  //     if (isAuthenticated && loginUser?.role) {
  //       console.log(`User is authenticated and has role ${loginUser.role}`);

  //       switch (loginUser.role) {
  //         case 8:
  //           setInitialRoute("HomeTabs");
  //           break;
  //         case 9:
  //           setInitialRoute("TubewellHome");
  //           break;
  //         default:
  //           console.log("Role not recognized. Redirecting to Login.");
  //           setInitialRoute("Login");
  //           break;
  //       }
  //     } else {
  //       console.log("User is not authenticated or has no role");
  //       setInitialRoute("Login");
  //     }
  //   } catch (error) {
  //     console.error("Error checking auth:", error);
  //     setInitialRoute("Login");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   checkAuth();
  // }, [isAuthenticated]); // Add token as dependency

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ contentStyle: { backgroundColor: "white" } }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginWithPassword}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OTPVerification"
              component={OTPVerification}
              options={{ headerShown: false }}
            />
          </>
        ) :  (
          <>
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ title: "Profile", headerShown: true }}
            />
           
          </>
        ) }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
