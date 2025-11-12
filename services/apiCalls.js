import { REACT_NATIVE_SYNC_URL } from "../env";
import { makeRequest } from "./instance";
import messaging from '@react-native-firebase/messaging';

export const VerifyUser = (body) => {
  return makeRequest("POST", "mobile/verify-user", body);
};

export const VerifyOTP = (body) => {
  return makeRequest("POST", "mobile/verify-otp", body);
};

export const LoginUser = (body) => {
  return makeRequest("POST", "web/login", body);
}

export const generateFcmToken = async () => {
  try {
    // Request notification permission
    await messaging().requestPermission();
    
    // Get FCM token
    const token = await messaging().getToken();
    console.log('FCM Token generated:', token);
    
    return token;
  } catch (error) {
    console.error('Error generating FCM token:', error);
    return null;
  }
};


export const syncOfflineData = async (offlineData) => {
  return makeRequest("POST", "", offlineData, {
    baseURL: REACT_NATIVE_SYNC_URL, // Override base URL for this call
  });
};