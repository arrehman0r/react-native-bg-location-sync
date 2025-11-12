import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
// Note: AppInput is kept for completeness of original imports
import { AppInput } from '../components/AppInput';
import { DilgoLogo } from '../assets/svg';
import AppButton from '../components/AppButton';

// 🎯 FINAL CORRECT IMPORT: Import the named export 'OtpInput'
import { OtpInput } from 'react-native-otp-entry';
import { useDispatch } from 'react-redux';
import {
  setFcmToken,
  setIsAuthenticated,
  setLoginUser,
} from '../redux/reducer/userSlice';
import { setLoading, showToast } from '../redux/reducer/utilsSlice';
import { generateFcmToken, VerifyOTP } from '../services/apiCalls';

const OTPVerification = ({ navigation, route }) => {
  // State to hold the complete OTP string
  const [otp, setOtp] = useState('');
  const phoneNumber = route.params?.phoneNumber || 'N/A';
  const dispatch = useDispatch();

  // Usage after successful login:
  const handleLoginSuccess = async () => {
    const fcmToken = await generateFcmToken();

    if (fcmToken) {
      // Save to Redux
      dispatch(setFcmToken(fcmToken));
      await dispatch(setIsAuthenticated(true));
      navigation.navigate('HomeTabs');

      console.log('FCM Token saved to Redux:', fcmToken);
    }
  };

  const handleVerifyOTP = async codeToVerify => {
    const finalOtp = codeToVerify || otp;

    if (finalOtp.length === 4) {
      Keyboard.dismiss();
      try {
        const body = {
          phone: phoneNumber,
          otpCode: finalOtp,
        };
        dispatch(setLoading(true));
        const res = await VerifyOTP(body);
        if (res?.status == true) {
          dispatch(showToast(res?.message || 'OTP verified successfully.'));
          await handleLoginSuccess();
          await dispatch(setLoginUser(res?.response?.userData || {}));
        } else {
          dispatch(
            showToast(
              res?.message || 'Failed to verify OTP. Please try again.',
            ),
          );
        }
        console.log('VerifyOTP Response:', res);
      } catch (error) {
        console.error('Error in VerifyOTP:', error);
        dispatch(showToast('Failed to verify OTP. Please try again.'));
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      console.log('OTP not complete. Length:', finalOtp.length);
    }
  };

  const handleOtpChange = text => {
    setOtp(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.logoContainer}>
            <DilgoLogo />
          </View>

          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subTitle}>
            We have sent a verification code to your mobile number{' '}
            <Text style={styles.phoneText}>{phoneNumber} </Text>. Please check
            your inbox.{' '}
          </Text>

          <View style={styles.otpContainer}>
            {/* 🎯 FINAL CORRECT USAGE: Use the component name 'OtpInput' */}
            <OtpInput
              numberOfDigits={4}
              onTextChange={handleOtpChange}
              onFilled={code => handleVerifyOTP(code)}
              focusColor="#E04821"
              keyboardType="numeric" // Use 'numeric' for numbers-only input
              // The library handles autofill automatically when `autoComplete` is not set
              // or you can explicitly use the `textInputProps` for more control:
              textInputProps={{ autoComplete: 'sms-otp' }}
              theme={{
                containerStyle: styles.otpInputContainer,
                pinCodeContainerStyle: styles.otpPinContainer, // Check prop name change!
                pinCodeTextStyle: styles.pinCodeText,
                focusedPinCodeContainerStyle: styles.otpFilledPinInput, // Use this for focused style
                filledPinCodeContainerStyle: styles.otpFilledPinInput, // Re-use for filled style
              }}
            />
          </View>

          {/* <AppButton title="Verify OTP" onPress={() => handleVerifyOTP()} disabled={true} /> */}

          <Text style={styles.termsTitle}>
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
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    letterSpacing: 0,
    marginBottom: 10,
  },
  subTitle: {
    fontWeight: '400',
    fontSize: 12,
    color: '#484949',
    lineHeight: 16,
    letterSpacing: 0,
    marginBottom: 40,
  },
  phoneText: {
    color: '#E04821',
    fontWeight: '500',
    fontSize: 12,
  },
  termsTitle: {
    fontSize: 12,
    color: '#7A8A97',
    fontWeight: '400',
    marginTop: 32,
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0,
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  // OTP Container for centering
  otpContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  // 👇 STYLES FOR OtpInput 'theme' PROP
  otpInputContainer: {
    // Style for the root container
    width: '100%',
    maxWidth: 300,
  },
  otpPinContainer: {
    // Corresponds to pinCodeContainerStyle: Style for the container wrapping all digits
    justifyContent: 'space-around', // Use a standard flex alignment
  },
  pinCodeText: {
    // Corresponds to pinCodeTextStyle
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  otpFilledPinInput: {
    // Corresponds to focusedPinCodeContainerStyle and filledPinCodeContainerStyle
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E04821', // Primary color border
    // Note: The library handles the automatic margin/padding based on the other theme props
  },
});

export default OTPVerification;
