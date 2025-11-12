import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DilgoWhiteLogo, ProfileIcon } from "../assets/svg";
import { theme } from "../theme";

export const AppHeader = ({ title, showLogo = false, navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#00005B" />

      <View style={styles.headerContainer}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <DilgoWhiteLogo />

            <></>
          </View>
        )}
        {title && <Text style={styles.headerText}>{title || "Requests"}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.tertiary,
  },
  headerContainer: {
    backgroundColor: theme.colors.tertiary,
    paddingHorizontal: 20,
    height: 170, // Balanced height that works for both variants
    overflow: "hidden",
    gap: 10,
    justifyContent: "center",
  
  },

  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0,
    lineHeight: 24,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
});
