import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from "../reducer";


const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "user",
    "location"
  ]
};

const authListenerMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Listen for specific actions
  if (action.type === 'user/logoutUser' || action.type === 'user/setIsAuthenticated' ||
      (action.type === 'user/setLoginUser' && !action.payload)) {
    // Perform any logout cleanup here
  }
  
  return result;
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: process.env.NODE_ENV !== "development", // Disable immutable state checks in development
    }).concat(authListenerMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export default store;