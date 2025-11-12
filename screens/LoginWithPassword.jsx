import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  ClosedEyeIcon,
  DilgoLogo,
  KeyIcon,
  OpenEyeIcon,
  PhoneIcon,
} from '../assets/svg';
import { AppInput } from '../components/AppInput';
import AppButton from '../components/AppButton';
import { generateFcmToken, LoginUser } from '../services/apiCalls';
import { setLoading, showToast } from '../redux/reducer/utilsSlice';
import { setFcmToken, setIsAuthenticated } from '../redux/reducer/userSlice';
import { phoneRegex } from '../utils';

const LoginWithPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const onSubmit = async data => {
    Keyboard.dismiss();
    dispatch(setLoading(true));

    try {
      const fcmToken = await generateFcmToken();

      if (!phoneRegex.test(data.phone)) {
        dispatch(showToast('Please enter a valid 10-digit mobile number.'));
        return;
      }

      const body = {
        email: data.phone,
        password: data.password,
        type: 'Transporter',
        device: 'mobile',
        appId: 3,
      };

      const res = await LoginUser(body);
      console.log('Login Response:', res);

      if (res?.status) {
        dispatch(showToast(res?.message || 'User login successfully.'));
        await dispatch(setFcmToken(fcmToken));
        await dispatch(setIsAuthenticated(true));
        // navigation.navigate('HomeTabs');
      } else {
        dispatch(
          showToast(res?.message || 'Failed to login. Please try again.'),
        );
      }
    } catch (error) {
      console.error('Error in Login:', error);
      dispatch(showToast('Failed to login. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
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

          <Text style={styles.title}>Login With Password</Text>
          {console.log('LoginWithPassword Rendered', phoneRegex)}
          {/* Phone Field */}
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Mobile number is required',
              pattern: {
                value: phoneRegex,
                message: 'Enter a valid 10-digit mobile number',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Mobile Number"
                keyboardType="number-pad"
                autoCapitalize="none"
                placeholder="+96601212121"
                value={value}
                onChangeText={onChange}
                left={<TextInput.Icon icon={() => <PhoneIcon />} />}
                error={!!errors.phone}
                maxLength={11}
              />
            )}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone.message}</Text>
          )}

          {/* Password Field */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 4,
                message: 'Password must be at least 4 characters long',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Password"
                placeholder="Enter password"
                right={
                  <TextInput.Icon
                    icon={() =>
                      secureTextEntry ? <ClosedEyeIcon /> : <OpenEyeIcon />
                    }
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
                }
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChange}
                left={<TextInput.Icon icon={() => <KeyIcon />} />}
                error={!!errors.password}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <AppButton title="Login" onPress={handleSubmit(onSubmit)} />

          <Text style={styles.subTitle}>
            By continuing, you agree to our Terms & Privacy Policy.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  subTitle: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#7A8A97',
    textAlign: 'center',
    marginTop: 32,
  },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
  },
});

export default LoginWithPassword;
