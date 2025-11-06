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
import { TextInput } from "react-native-paper";
import { AppInput } from "../components/AppInput";
import { PhoneIcon, DilgoLogo } from "../assets/svg";
import AppButton from "../components/AppButton";
import { LoginUser } from "../services/apiCalls";
import { useDispatch } from "react-redux";
import { setLoading, showToast } from "../redux/reducer/utilsSlice";
// import * as SecureStore from "expo-secure-store";
import { setLoginUser } from "../redux/reducer/userSlice";
import { useQueryClient } from "@tanstack/react-query";
import { phoneRegex } from "../utils";

const Login = ({ navigation }) => {
  const [phone, setPhone] = useState("");
const dispatch = useDispatch();
  const handleSendOTP = () => {
    Keyboard.dismiss();
    if (phoneRegex.test(phone)) {
      navigation.navigate("OTPVerification", { phoneNumber: phone });
    } else {
      dispatch(showToast("Please enter a valid 11-digit mobile number."));
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.logoContainer}>
            <DilgoLogo />
          </View>
          <Text style={styles.title}>Login</Text>
          <AppInput
            label="Mobile Number"
            keyboardType="number-pad"
            autoCapitalize="none"
            placeholder={"0330-1212121"}
            maxLength={11}
            value={phone}
            onChangeText={setPhone}
  
            left={<TextInput.Icon icon={() => <PhoneIcon />} />}
          />

          <AppButton title="Send OTP" onPress={() => handleSendOTP()} />
          <Text style={styles.subTitle}>
            By continuing, you agree to our Terms & Privacy Policy.
          </Text>
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
    fontFamily: "Poppins_600SemiBold",
    fontWeight: "bold",
    marginBottom: 40,
    lineHeight: 32,
    letterSpacing: 0,
  },
  subTitle: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#7A8A97",
    fontWeight: "400",
    marginTop: 32,
    textAlign: "center",
    lineHeight: "100%",
    letterSpacing: 0,
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
});

export default Login;
