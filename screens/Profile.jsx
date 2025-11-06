import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, Divider, Snackbar, TextInput } from "react-native-paper";
import { AppInput } from "../components/AppInput";
import {
  EmailIcon,
  KeyIcon,
  OpenEyeIcon,
  ClosedEyeIcon,
  ProfileIcon,
} from "../assets/svg";
import AppButton from "../components/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/reducer/userSlice";
import { useQueryClient } from "@tanstack/react-query";

const Profile = ({ navigation }) => {
  const queryClient = useQueryClient();

  const loginUser = useSelector((state) => state.user.loginUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    queryClient.clear();
    dispatch(logoutUser());
  };
  console.log("loginUser", loginUser);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <AppInput
            label="Name"
            keyboardType="default"
            autoCapitalize="words"
            placeholder={"John Doe"}
            value={loginUser?.name}
            left={<TextInput.Icon icon="account" />}
            disabled
          />
          <AppInput
            label="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder={"xyz123@gmail.com"}
            value={loginUser?.email}
            left={<TextInput.Icon icon={() => <EmailIcon />} />}
            disabled
          />
          <View style={{ marginVertical: 20 }}>
            <Divider bold />
          </View>
          <AppButton title="Logout" onPress={() => handleLogout()} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "NunitoSans_700Bold",
    fontWeight: "bold",
    marginBottom: 40,
    lineHeight: 32,
    letterSpacing: 0,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Profile;
