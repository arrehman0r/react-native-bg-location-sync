import axios from "axios";
// import * as SecureStore from "expo-secure-store";
import { REACT_NATIVE_PUBLIC_DEV_URL } from "../env";
import store from "../redux/store/store";
import { logoutUser } from "../redux/reducer/userSlice";

export const baseURL = REACT_NATIVE_PUBLIC_DEV_URL;
export const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const makeRequest = async (type, path, body = null, options = {}) => {
  try {
    // Retrieve token from cookies
    // const token = await SecureStore.getItemAsync("token");
    const token = null


    // Setup headers
    const headers = {
      ...options.headers,
      authorization: token ? `Bearer ${token}` : null,
    };

    // If the body is an instance of FormData, set the appropriate Content-Type
    if (body instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else if (body) {
      headers["Content-Type"] = "application/json";
    }

    // Create the config object
    const config = {
      timeout: 30000,
      headers,
      ...options,
    };

    let response;

    // Perform the request based on the type
    switch (type.toUpperCase()) {
      case "GET":
        response = await instance.get(path, {
          ...config,
          params: options.params || {}, // ✅
        });
        break;
      case "POST":
        response = await instance.post(path, body, config);
        break;
      case "PUT":
        response = await instance.put(path, body, config);
        break;
      case "PATCH":
        response = await instance.patch(path, body, config);
        break;
      case "DELETE":
        response = await instance.delete(path, config);
        break;
      default:
        throw new Error("Unsupported request type");
    }

    return response;
  } catch (error) {
    console.log("=== API Error ===", JSON.stringify(error));

    // Handle specific errors
    if (error.response?.status == 403 || error.response?.status == 401) {
      // await SecureStore.deleteItemAsync("token");
      // store.dispatch(logoutUser());
      console.log("Token deleted due to unauthorized access");
      // Handle unauthorized error, such as refreshing tokens or redirecting
      // ToastNotification('error', 'Session expired. Please login again');
    } else if (error.code === "ECONNABORTED") {
      // Handle timeout
      // ToastNotification('error', 'Request timed out');
    }

    throw error; // Re-throw error after logging/handling
  }
};

// Optional: Request interceptor for adding authentication or other common headers
instance.interceptors.request.use(
  (config) => {
    // Example: Add basic auth or other configuration if needed
    // config.auth = { username, password };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
   (response) => {
      // Default: unwrap normal data
    return response.data;
  },
  async (error) => {
    let errorMessage = "Something went wrong";

    if (error.response?.status === 401 || error.response?.status === 403) {
      // await SecureStore.deleteItemAsync("token");
      store.dispatch(logoutUser());
      console.log("Token deleted due to unauthorized access");
      errorMessage = error.response?.data?.message || "Unauthorized access";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject({
      ...error,
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);
