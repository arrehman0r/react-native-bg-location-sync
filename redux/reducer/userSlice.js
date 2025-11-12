import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loginUser: null,
    isAuthenticated: false,
    fcmToken: null,
  },
  reducers: {
    setLoginUser: (state, action) => {
      return {
        ...state,
        loginUser: action.payload,
        isAuthenticated: !!action.payload,
      };
    },
    logoutUser: state => {
      state.loginUser = null;
      state.isAuthenticated = false;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
  },
});

export const { setLoginUser, logoutUser, setIsAuthenticated, setFcmToken } =
  userSlice.actions;

export default userSlice.reducer;
